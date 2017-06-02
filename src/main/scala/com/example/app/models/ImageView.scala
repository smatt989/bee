package com.example.app.models

import com.example.app.{HasUUID, SlickUUIDObject, Tables}
import org.joda.time.DateTime

import scala.concurrent.Await
import scala.concurrent.duration.Duration
import slick.driver.PostgresDriver.api._
import scala.concurrent.ExecutionContext.Implicits.global

/**
  * Created by matt on 5/31/17.
  */
case class ImageView(id: String = null, participantId: Int, imageId: String, ontologyVersionId: Int, createdMillis: Long) extends HasUUID[ImageView] {
  def updateId(id: String) = this.copy(id = id)
}

case class CreateImageView(taskId: Int, imageId: String, ontologyVersionId: Int)

case class RequestImage(taskId: Int)

object ImageView extends SlickUUIDObject[ImageView, (String, Int, String, Int, Long), Tables.ImageViews] {
  lazy val table = Tables.imageViews

  def reify(tuple: (String, Int, String, Int, Long)) =
    (apply _).tupled(tuple)

  def createNewImageView(userId: Int, newImageView: CreateImageView) = {
    val participant = Await.result(Participant.participantByUserAndTask(userId, newImageView.taskId), Duration.Inf)
    if(participant.isDefined) {
      val imageView = ImageView(null, participant.get.id, newImageView.imageId, newImageView.ontologyVersionId, new DateTime().getMillis)
      create(imageView)
    } else
      throw new Exception("Not authorized to see this image")
  }

  def byParticipant(participantId: Int) = {
    db.run(table.filter(_.participantId === participantId).result).map(_.map(reify))
  }
}
