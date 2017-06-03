package com.example.app.models

import com.example.app.{HasIntId, Tables, UpdatableDBObject}
import slick.driver.PostgresDriver.api._

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.Duration

/**
  * Created by matt on 5/31/17.
  */
case class Participant(id: Int, taskId: Int, userId: Int, isActive: Boolean) extends HasIntId[Participant] {
  def updateId(id: Int) = this.copy(id = id)
  def richParticipant(user: UserJson) =
    RichParticipant(user, this)
}

case class ParticipantSpecification(taskId: Int, userId: Int)

case class RichParticipant(user: UserJson, participant: Participant) {
  def toJson = RichParticipantSerialization(user.email, participant.taskId, participant.id, participant.isActive)
}

case class RichParticipantSerialization(email: String, taskId: Int, participantId: Int, isActive: Boolean)

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
      } yield (participants, users)).result
    ).map(_.map{ case (ps, us) => reify(ps).richParticipant(User.reifyJson(us))})
  }

  def setParticipantActivation(participantId: Int, activation: Boolean) = {
    val futureParticipant = byId(participantId)
    futureParticipant.flatMap(participant => {
      val updated = participant.copy(isActive = activation)
      val user = Await.result(User.byId(participantId), Duration.Inf).toJson
      save(updated).map(_.richParticipant(user))
    })
  }

  def participantByUserAndTask(userId: Int, taskId: Int) ={
    db.run(table.filter(a => a.userId === userId && a.taskId === taskId).result).map(_.headOption.map(reify))
  }

  def isParticipantInTask(userId: Int, taskId: Int) = {
    Await.result(participantByUserAndTask(userId, taskId).map(a => a.isDefined && a.get.isActive), Duration.Inf)
  }
}