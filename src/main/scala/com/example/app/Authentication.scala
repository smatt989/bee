package com.example.app

import javax.servlet.http.{HttpServletRequest, HttpServletResponse}

import com.example.app.demo.Tables.UserAccountsRow
import com.example.app.models.{User, UserLogin, UserSession}
import org.scalatra.auth.ScentryAuthStore.SessionAuthStore
import org.scalatra.auth.strategy.BasicAuthSupport
import org.scalatra.ScalatraBase
import org.scalatra.auth.{ScentryConfig, ScentryStrategy, ScentrySupport}

object SessionTokenStrategy {
  val HeaderKey = "Bee-Session-Key"
  val Email = "email"
  val Password = "password"
}

class SessionTokenStrategy(protected val app: ScalatraBase) extends ScentryStrategy[UserAccountsRow] {
  import SessionTokenStrategy._

  private[this] def getHeader(implicit request: HttpServletRequest) = {
    val headerResult = app.request.getHeader(HeaderKey)
    Option(headerResult)
  }

  private[this] def getToken(implicit request: HttpServletRequest) =
    getHeader

  override def isValid(implicit request: HttpServletRequest): Boolean = {
    getToken.isDefined

  }

  def authenticate()(implicit request: HttpServletRequest, response: HttpServletResponse): Option[UserAccountsRow] = {
    val token = getToken
    token.flatMap {t =>  UserSession.byHashString(t).map(UserSession.user) }
  }
}

class PasswordStrategy(protected val app: ScalatraBase) extends ScentryStrategy[UserAccountsRow] {

  override def isValid(implicit request: HttpServletRequest) =
    request.getHeader(SessionTokenStrategy.Email) != null && request.getHeader(SessionTokenStrategy.Password) != null

  def authenticate()(implicit request: HttpServletRequest, response: HttpServletResponse): Option[UserAccountsRow] = {
    val eMail = headerOption(request, SessionTokenStrategy.Email).get
    User.authenticatedUser(UserLogin(eMail, request.getHeader(SessionTokenStrategy.Password)))
  }

  private[this] def headerOption(request: HttpServletRequest, key: String) =
    Option(request.getHeader(key))
}

trait AuthenticationSupport extends ScentrySupport[UserAccountsRow] with BasicAuthSupport[UserAccountsRow] {
  self: ScalatraBase =>

  protected def fromSession = { case id: String =>
    val session = UserSession.byHashString(id)
    session.map(UserSession.user).get
  }
  protected def toSession = { case usr: UserAccountsRow ⇒ UserSession.findFromUserOrCreate(usr.userAccountId).hashString }

  /**
    * Registers authentication strategies.
    */

  protected val scentryConfig = new ScentryConfig {}.asInstanceOf[ScentryConfiguration]

  override protected def configureScentry {

    scentry.store = new SessionAuthStore(self) {
      override def set(value: String)(implicit request: HttpServletRequest, response: HttpServletResponse) = {
        super.set(value)
        response.headers(SessionTokenStrategy.HeaderKey) = value
      }

      override def get(implicit request: HttpServletRequest, response: HttpServletResponse) = {
        request.header(SessionTokenStrategy.HeaderKey).get
      }

      override def invalidate()(implicit request: HttpServletRequest, response: HttpServletResponse) = {
        response.headers(SessionTokenStrategy.HeaderKey) = null
      }
    }
    scentry.unauthenticated { unauthenticated() }
  }

  def unauthenticated() ={
    response.setHeader("WWW-Authenticate", "Unable to authenticate")
    halt(401, "Unauthenticated")
  }

  override protected def registerAuthStrategies = {
    scentry.register("user_password", _ ⇒ new PasswordStrategy(self))
    scentry.register("session_token", _ ⇒ new SessionTokenStrategy(self))
  }

}