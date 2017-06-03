package com.example.app.models

import com.example.app.{HasUUID, SlickUUIDObject, Tables}
import org.joda.time.{DateTime, Interval}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Await
import scala.concurrent.duration.Duration

/**
  * Created by matt on 5/31/17.
  */
case class Invitation(id: String = null, taskId: Int, createdMillis: Long) extends HasUUID[Invitation] {
  def updateId(id: String) = this.copy(id = id)
}

case class InvitationLink(link: String)

object Invitation extends SlickUUIDObject[Invitation, (String, Int, Long), Tables.Invitations] {
  lazy val table = Tables.invitations

  def reify(tuple: (String, Int, Long)) =
    (apply _).tupled(tuple)

  def generateLink(taskId: Int) = {
    val toCreate = Invitation(null, taskId, new DateTime().getMillis)

    val created = create(toCreate)

    created.map(c => {
      println("huh?")
      InvitationLink("/?inv="+c.id)
    })
  }

  def acceptInvitation(userId: Int, invitationString: String) = {
    val invitation = Await.result(byId(invitationString), Duration.Inf)
    if(validInvitation(invitation)){
      if(!Participant.isParticipantInTask(userId, invitation.taskId))
        Participant.create(Participant(0, invitation.taskId, userId, true))
      else
        throw new Exception("Already participating in this task")
    } else
      throw new Exception("Invitation has expired")
  }

  def validInvitation(invitation: Invitation) = {
    val now = new DateTime().getMillis
    val interval = new Interval(invitation.createdMillis, now)
    interval.toDuration.getStandardDays <= 7
  }
}