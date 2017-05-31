package com.example.app.models

import com.example.app.{HasIntId, Tables, UpdatableDBObject}
import slick.driver.PostgresDriver.api._
import scala.concurrent.ExecutionContext.Implicits.global

/**
  * Created by matt on 5/31/17.
  */
case class Task(id: Int, name: String, creatorUserId: Int, createdMillis: Long) extends HasIntId[Task]{
  def updateId(id: Int) = this.copy(id = id)
}

case class CreateTask(name: String, ontology: OntologyVersion)

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
}