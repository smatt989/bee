package com.example.app.models

import com.example.app.{HasIntId, Tables, UpdatableDBObject}
import slick.driver.PostgresDriver.api._
import scala.concurrent.ExecutionContext.Implicits.global

/**
  * Created by matt on 5/31/17.
  */
case class Participant(id: Int, taskId: Int, userId: Int, isActive: Boolean) extends HasIntId[Participant] {
  def updateId(id: Int) = this.copy(id = id)
}

object Participant extends UpdatableDBObject[Participant, (Int, Int, Int, Boolean), Tables.Participants] {
  def updateQuery(a: Participant) = table.filter(_.id === a.id)
    .map(x => (x.isActive))
    .update((a.isActive))

  lazy val table = Tables.participants

  def reify(tuple: (Int, Int, Int, Boolean)) =
    (apply _).tupled(tuple)

  def participantsByTask(taskId: Int) = {
    db.run(
      (for {
        participants <- table.filter(_.taskId === taskId)
        users <- User.table if users.id === participants.userId
      } yield (users)).result
    ).map(_.map(User.reifyJson))
  }
}