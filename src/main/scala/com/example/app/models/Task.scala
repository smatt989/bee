package com.example.app.models

import com.example.app.{HasIntId, Tables, UpdatableDBObject}
import org.joda.time.DateTime
import slick.driver.PostgresDriver.api._

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.Duration

/**
  * Created by matt on 5/31/17.
  */
case class Task(id: Int, name: String, creatorUserId: Int, createdMillis: Long) extends HasIntId[Task]{
  def updateId(id: Int) = this.copy(id = id)

  def toJson =
    InputTask(id, name, createdMillis)
}

case class InputTask(id: Int = 0, name: String, createdMillis: Long = new DateTime().getMillis) {
  def task(userId: Int) = Task(id, name, userId, createdMillis)
}

object Task extends UpdatableDBObject[Task, (Int, String, Int, Long), Tables.Tasks] {
  def updateQuery(a: Task) = table.filter(_.id === a.id)
    .map(x => (x.name))
    .update((a.name))


  lazy val table = Tables.tasks

  def reify(tuple: (Int, String, Int, Long)) =
    (apply _).tupled(tuple)

  def tasksCreatedByUser(userId: Int) = {
    db.run(table.filter(_.creatorUserId === userId).result).map(_.map(reify))
  }

  def tasksParticipatingIn(userId: Int) = {
    db.run(
      (for {
        participants <- Participant.table if participants.userId === userId
        tasks <- table if tasks.id === participants.taskId
      } yield (tasks)).result
    ).map(_.map(reify))
  }

  def isCreatorOfTask(userId: Int, taskId: Int) = {
    Await.result(byId(taskId).map(_.creatorUserId == userId), Duration.Inf)
  }

  def authorizedToEditTask(userId: Int, taskId: Int) = {
    isCreatorOfTask(userId, taskId)
  }

  def authorizedToViewTaskDetails(userId: Int, taskId: Int) = {
    authorizedToEditTask(userId, taskId)
  }

  def authorizedToParticipateInTask(userId: Int, taskId: Int) = {
    Participant.isParticipantInTask(userId, taskId)
  }

  def authorizedToEditParticipant(userId: Int, participantId: Int) = {
    val participant = Await.result(Participant.byId(participantId), Duration.Inf)
    val taskId = participant.taskId
    authorizedToEditTask(userId, taskId)
  }

  def saveWithParticipantCreation(userId: Int, task: Task) = {
    val saved = Await.result(save(task), Duration.Inf)
    if(!Participant.isParticipantInTask(userId, saved.id))
      Participant.create(Participant(0, saved.id, userId, true))
    saved
  }
}