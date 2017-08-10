package com.example.app.models

import com.example.app.UpdatableDBObject
import com.example.app.AppGlobals
import AppGlobals.dbConfig.driver.api._
import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.Duration
import com.example.app.db.Tables._

/**
  * Created by matt on 5/31/17.
  */

case class ParticipantSpecification(taskId: Int, userId: Int)

case class RichParticipant(user: UserAccountsRow, participant: ParticipantsRow) {
  def toJson = RichParticipantSerialization(user.email, participant.taskId, participant.participantId, participant.isActive)
}

case class RichParticipantSerialization(email: String, taskId: Int, participantId: Int, isActive: Boolean)


object Participant extends UpdatableDBObject[ParticipantsRow, Participants] {
  def updateQuery(a: ParticipantsRow) = table.filter(t => idColumnFromTable(t) === idFromRow(a))
    .map(x => x.isActive)
    .update(a.isActive)

  lazy val table = Participants

  def participantsByTask(taskId: Int) = {
    db.run(
      (for {
        participants <- table.filter(_.taskId === taskId)
        users <- User.table if users.userAccountId === participants.userId
      } yield (participants, users)).result
    ).map(_.map{ case (ps, us) => RichParticipant(us, ps)})
  }

  def setParticipantActivation(participantId: Int, activation: Boolean) = {
    val futureParticipant = byId(participantId)
    futureParticipant.flatMap(participant => {
      val updated = participant.copy(isActive = activation)
      val user = Await.result(User.byId(participant.userId), Duration.Inf)
      save(updated).map(p => RichParticipant(user, p))
    })
  }

  def participantByUserAndTask(userId: Int, taskId: Int) ={
    db.run(table.filter(a => a.userId === userId && a.taskId === taskId).result).map(_.headOption)
  }

  def isParticipantInTask(userId: Int, taskId: Int) = {
    Await.result(participantByUserAndTask(userId, taskId).map(a => a.isDefined && a.get.isActive), Duration.Inf)
  }

  def idFromRow(a: _root_.com.example.app.db.Tables.ParticipantsRow) =
    a.participantId

  def updateId(a: _root_.com.example.app.db.Tables.ParticipantsRow, id: Int) =
    a.copy(participantId = id)

  def idColumnFromTable(a: _root_.com.example.app.db.Tables.Participants) =
    a.participantId

  def participantDetails(taskId: Int) = {
    db.run(
      (
        for {
          ((participants, seen), labeled) <- table
            .filter(_.taskId === taskId) joinLeft ImageView.table on (_.participantId === _.participantId) joinLeft Label.table on (_._1.participantId === _.participantId)
        } yield (participants, seen, labeled)
        ).result
    ).map(_.groupBy(_._1.participantId).map(a =>
      ParticipantDetails(
        a._1,
        a._2.flatMap(_._2).map(_.imageId).distinct.size,
        a._2.flatMap(_._3).map(_.imageId).distinct.size
      )
    ))
  }
}

case class ParticipantDetails(participantId: Int, seen: Int, labeled: Int)