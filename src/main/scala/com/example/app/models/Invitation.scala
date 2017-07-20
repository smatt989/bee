package com.example.app.models

import com.example.app.SlickUUIDObject
import org.joda.time.{DateTime, Interval}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Await
import scala.concurrent.duration.Duration
import com.example.app.demo.Tables._

/**
  * Created by matt on 5/31/17.
  */
case class InvitationLink(link: String)

object Invitation extends SlickUUIDObject[InvitationsRow, Invitations] {
  lazy val table = Invitations

  def generateLink(taskId: Int) = {
    val toCreate = InvitationsRow(null, taskId, new DateTime().getMillis)

    val created = create(toCreate)

    created.map(c => {
      InvitationLink(c.invitationId)
    })
  }

  def acceptInvitation(userId: Int, invitationString: String) = {
    val invitation = Await.result(byId(invitationString), Duration.Inf)
    if(validInvitation(invitation)){
      val participant = Await.result(Participant.participantByUserAndTask(userId, invitation.taskId), Duration.Inf)
      if(participant.isEmpty)
        Participant.create(ParticipantsRow(0, invitation.taskId, userId, isActive = true))
      else if (!participant.get.isActive)
        Participant.setParticipantActivation(participant.get.participantId, activation = true).map(_.participant)
      else
        throw new Exception("Already participating in this task")
    } else
      throw new Exception("Invitation has expired")
  }

  def validInvitation(invitation: InvitationsRow) = {
    val now = new DateTime().getMillis
    val interval = new Interval(invitation.createdMillis, now)
    interval.toDuration.getStandardDays <= 7
  }

  def idFromRow(a: _root_.com.example.app.demo.Tables.InvitationsRow) =
    a.invitationId

  def updateId(a: _root_.com.example.app.demo.Tables.InvitationsRow, id: String) =
    a.copy(invitationId = id)

  def idColumnFromTable(a: _root_.com.example.app.demo.Tables.Invitations) =
    a.invitationId
}