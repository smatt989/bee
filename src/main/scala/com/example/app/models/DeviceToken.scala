package com.example.app.models

import com.example.app.{HasIntId, Tables, Updatable, UpdatableDBObject}
import com.example.app.AppGlobals
import AppGlobals.dbConfig.driver.api._

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.Duration

case class DeviceToken(id: Int = 0, userId: Int, deviceToken: Option[String]) extends HasIntId[DeviceToken]{
  def updateId(id: Int) =
    this.copy(id = id)
}

object DeviceToken extends UpdatableDBObject[DeviceToken, (Int, Int, Option[String]), Tables.DeviceTokens] {
  def updateQuery(a: DeviceToken) = table.filter(_.id === a.id)
    .map(x => (x.deviceToken))
    .update((a.deviceToken))

  lazy val table = Tables.deviceTokens

  def reify(tuple: (Int, Int, Option[String])) =
    (apply _).tupled(tuple)

  def getByUserIds(ids: Seq[Int]): Map[Int, Option[String]] = {
    val tokens = Await.result(db.run(table.filter(_.userId inSet ids).result).map(_.map(reify)), Duration.Inf)
    val tokenMap = tokens.groupBy(_.userId).mapValues(_.sortBy(_.id).last.deviceToken)
    ids.map(id => id -> tokenMap.get(id).getOrElse(None)).toMap
  }
}