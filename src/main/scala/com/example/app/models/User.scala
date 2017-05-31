package com.example.app.models

import com.example.app.{HasIntId, Tables, Updatable, UpdatableDBObject}
import org.mindrot.jbcrypt.BCrypt
import slick.driver.PostgresDriver.api._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}

case class User(id: Int, email: String, hashedPassword: String) extends HasIntId[User] {

  def updateId(id: Int) =
    this.copy(id = id)

  lazy val toJson =
    UserJson(id, email)
}

case class UserCreate(email: String, password: String) {
  lazy val makeUser =
    User(0, email, User.makeHash(password))
}

case class UpdateUser(email: String, password: String, newEmail: Option[String], newPassword: Option[String]){
  lazy val userLogin =
    UserLogin(email, password)
}

case class UserLogin(email: String, password: String)

case class UserJson(id: Int, email: String)

object User extends UpdatableDBObject[User, (Int, String, String), Tables.Users]{

  lazy val table = Tables.users

  def reify(tuple: (Int, String, String)) =
    (apply _).tupled(tuple)

  def reifyJson(tuple: (Int, String, String)) =
    reify(tuple).toJson

  def updateQuery(a: User) = table.filter(_.id === a.id)
    .map(x => (x.email, x.hashedPassword))
    .update((a.email, a.hashedPassword))

  def makeHash(password: String) =
    BCrypt.hashpw(password, BCrypt.gensalt())

  private[this] def checkPassword(password: String, hashedPassword: String) =
    BCrypt.checkpw(password, hashedPassword)

  def authenticate(user: User, password: String) = {
    checkPassword(password, user.hashedPassword)
  }

  def searchUserName(query: String) = {
    val queryString = "%"+query.toLowerCase()+"%"
    db.run(table.filter(_.email.toLowerCase like queryString).result).map(_.map(reifyJson))
  }

  private[this] def unauthenticatedUserFromUserLogin(userLogin: UserLogin) = {

    Await.result(
      db.run(table.filter(_.email.toLowerCase === userLogin.email.toLowerCase()).result).map(_.headOption.map(reify).getOrElse{
        throw new Exception("No user with that email")
      }), UserSession.waitDuration)
  }

  def authenticatedUser(userLogin: UserLogin) = {
    val user = unauthenticatedUserFromUserLogin(userLogin)

    if(authenticate(user, userLogin.password))
      Some(user)
    else
      None
  }

  def uniqueEmail(email: String) =
    db.run(table.filter(_.email.toLowerCase === email.toLowerCase).result).map(_.isEmpty)

  def createNewUser(userCreate: UserCreate) = {
    val emailIsUnique = Await.result(uniqueEmail(userCreate.email), Duration.Inf)

    if(emailIsUnique)
      create(userCreate.makeUser)
    else
      throw new Exception("Must provide unique email")
  }

  def updateUser(updateUser: UpdateUser) = {
    val user = authenticatedUser(updateUser.userLogin)
    if(user.isDefined){
      val newUser = (updateUser.newEmail, updateUser.newPassword) match {
        case (Some(ne), Some(np)) => user.get.copy(email = ne, hashedPassword = makeHash(np))
        case (Some(ne), None) => user.get.copy(email = ne)
        case (None, Some(np)) => user.get.copy(hashedPassword = makeHash(np))
        case _ => user.get
      }
      save(newUser)
    } else {
      throw new Exception("Unable to authenticate")
    }
  }
}