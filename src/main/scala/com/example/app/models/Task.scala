package com.example.app.models

import com.example.app.UpdatableDBObject
import org.joda.time.DateTime
import com.example.app.AppGlobals
import AppGlobals.dbConfig.driver.api._

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.Duration

import com.example.app.db.Tables._

/**
  * Created by matt on 5/31/17.
  */

case class InputTask(id: Int = 0, name: String, isCreator: Boolean = false, createdMillis: Long = new DateTime().getMillis) {
  def task(userId: Int) = TasksRow(id, name, userId, createdMillis)
}

object Task extends UpdatableDBObject[TasksRow, Tasks] {

  def makeJson(a: TasksRow, userId: Int) =
    InputTask(a.taskId, a.taskName, userId == a.creatorUserId, a.createdMillis)

  def updateQuery(a: TasksRow) = table.filter(t => idColumnFromTable(t) === idFromRow(a))
    .map(x => x.taskName)
    .update(a.taskName)


  lazy val table = Tasks

  def tasksCreatedByUser(userId: Int) =
    db.run(table.filter(_.creatorUserId === userId).result)

  def tasksParticipatingIn(userId: Int) = {
    db.run(
      (for {
        participants <- Participant.table if participants.userId === userId && participants.isActive
        tasks <- table if tasks.taskId === participants.taskId
      } yield tasks).result
    )
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

  def authorizedToEditImageSource(userId: Int, imageSourceId: Int) = {
    val imageSource = Await.result(ImageSource.byId(imageSourceId), Duration.Inf)
    val taskId = imageSource.taskId
    authorizedToEditTask(userId, taskId)
  }

  def saveWithParticipantCreation(userId: Int, task: TasksRow) = {
    val saved = Await.result(save(task), Duration.Inf)
    if(!Participant.isParticipantInTask(userId, saved.taskId))
      Participant.create(ParticipantsRow(0, saved.taskId, userId, isActive = true))
    saved
  }

  def idFromRow(a: _root_.com.example.app.db.Tables.TasksRow) =
    a.taskId

  def updateId(a: _root_.com.example.app.db.Tables.TasksRow, id: Int) =
    a.copy(taskId = id)

  def idColumnFromTable(a: _root_.com.example.app.db.Tables.Tasks) =
    a.taskId
}