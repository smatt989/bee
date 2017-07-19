package com.example.app.models

import java.util.UUID

import com.example.app.{HasIntId, SlickDbObject, Tables}
import com.example.app.AppGlobals
import AppGlobals.dbConfig.driver.api._
import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.Duration


case class UserSession(id: Int, userId: Int, hashString: String) extends HasIntId[UserSession]{

  def updateId(id: Int) =
    this.copy(id = id)

  lazy val user =
    Await.result(UserSession.user(this), UserSession.waitDuration)
}

object UserSession extends SlickDbObject[UserSession, (Int, Int, String), Tables.UserSessions]{

  lazy val waitDuration = Duration.fromNanos(10000000000L)

  lazy val table = Tables.userSessions

  def fromUser(userId: Int) =
    Await.result(db.run(table.filter(_.userId === userId).result).map(_.headOption.map(reify)), waitDuration)

  def findFromUserOrCreate(userId: Int) = {
    fromUser(userId).getOrElse(
      Await.result(create(UserSession(0, userId, UUID.randomUUID().toString)), waitDuration)
    )
  }

  def reify(tuple: (Int, Int, String)) =
    (apply _).tupled(tuple)

  def user(userSession: UserSession) =
    User.byId(userSession.userId)

  def byHashString(hashString: String) =
    Await.result(db.run(table.filter(_.hashString === hashString).result).map(_.headOption.map(reify)), waitDuration)

}