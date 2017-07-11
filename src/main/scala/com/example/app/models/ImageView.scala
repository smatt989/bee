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

  def toJson(taskId: Int) =
    JsonImageView(taskId, imageId, createdMillis)
}

case class CreateImageView(taskId: Int, imageId: String)

case class JsonImageView(taskId: Int, imageId: String, createdMillis: Long)

case class RequestImage(taskId: Int, imageView: Option[JsonImageView] = None)

case class ImageWithAccessWithView(imageWithAccess: ImageWithAccess, viewInfo: Option[JsonImageView]) {
  def toJson = ImageWithView(imageWithAccess.image, viewInfo)
}

case class ImageWithView(image: Image, viewInfo: Option[JsonImageView])

object ImageView extends SlickUUIDObject[ImageView, (String, Int, String, Int, Long), Tables.ImageViews] {
  lazy val table = Tables.imageViews

  def reify(tuple: (String, Int, String, Int, Long)) =
    (apply _).tupled(tuple)

  def createNewImageView(userId: Int, newImageView: CreateImageView) = {
    val participant = Await.result(Participant.participantByUserAndTask(userId, newImageView.taskId), Duration.Inf)
    val currentOntology = Await.result(OntologyVersion.latestVersionByTask(newImageView.taskId), Duration.Inf).get
    if(participant.isDefined) {
      val imageView = ImageView(null, participant.get.id, newImageView.imageId, currentOntology.id, new DateTime().getMillis)
      create(imageView)
    } else
      throw new Exception("Not authorized to see this image")
  }

  def byParticipant(participantId: Int) = {
    db.run(table.filter(_.participantId === participantId).result).map(_.map(reify))
  }

  //TODO: EW.
  def imageIncrement(userId: Int, requestImage: RequestImage, increment: ImageIncrement): Option[ImageWithAccessWithView] = {
    if(requestImage.imageView.isEmpty && increment == ImageIncrement.next)
      Image.nextImage(userId, requestImage.taskId).map(img => ImageWithAccessWithView(img, None))
    else {
      val participant = Await.result(Participant.participantByUserAndTask(userId, requestImage.taskId), Duration.Inf)
      val previouslySeenImages = Await.result(byParticipant(participant.get.id), Duration.Inf)

      if(previouslySeenImages.nonEmpty){
        val lastIndex = previouslySeenImages.size - 1

        val findIndex = requestImage.imageView.map(imageView => {
          previouslySeenImages.indexWhere(a => a.createdMillis == requestImage.imageView.get.createdMillis && a.imageId == requestImage.imageView.get.imageId)
        })

        val incrementToIndex = findIndex.map(_ + increment.value).getOrElse(lastIndex)
        if(incrementToIndex <= lastIndex && incrementToIndex >= 0)
          Image.getImageWithAccess(userId, requestImage.taskId, previouslySeenImages(incrementToIndex).imageId)
              .map(img => ImageWithAccessWithView(img, Some(previouslySeenImages(incrementToIndex).toJson(requestImage.taskId))))
        else
          Image.nextImage(userId, requestImage.taskId).map(img => ImageWithAccessWithView(img, None))
      } else
        Image.nextImage(userId, requestImage.taskId).map(img => ImageWithAccessWithView(img, None))
    }
  }

  val nextImageIncrement = 1
  val previousImageIncrement = -1
}

case class ImageIncrement(value: Int)

object ImageIncrement {
  val next = ImageIncrement(1)
  val previous = ImageIncrement(-1)
}