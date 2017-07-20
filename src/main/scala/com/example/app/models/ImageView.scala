package com.example.app.models

import com.example.app.SlickUUIDObject
import org.joda.time.DateTime

import scala.concurrent.Await
import scala.concurrent.duration.Duration
import com.example.app.AppGlobals
import AppGlobals.dbConfig.driver.api._

import com.example.app.db.Tables.{ImageViews, _}

/**
  * Created by matt on 5/31/17.
  */

case class CreateImageView(taskId: Int, imageId: String)

case class JsonImageView(taskId: Int, imageId: String, createdMillis: Long, imageViewId: String)

case class RequestImage(taskId: Int, imageViewId: Option[String] = None)

case class ImageWithAccessWithView(imageWithAccess: ImageWithAccess, viewInfo: Option[JsonImageView]) {
  def toJson = ImageWithView(imageWithAccess.image, viewInfo)
}

case class ImageWithView(image: ImagesRow, viewInfo: Option[JsonImageView])

object ImageView extends SlickUUIDObject[ImageViewsRow, ImageViews] {
  lazy val table = ImageViews

  def makeJson(a: ImageViewsRow, taskId: Int) =
    JsonImageView(taskId, a.imageId, a.createdMillis, a.imageViewId)

  def createNewImageView(userId: Int, newImageView: CreateImageView) = {
    val participant = Await.result(Participant.participantByUserAndTask(userId, newImageView.taskId), Duration.Inf)
    val currentOntology = Await.result(OntologyVersion.latestVersionByTask(newImageView.taskId), Duration.Inf).get
    if(participant.isDefined) {
      val imageView = ImageViewsRow(null, participant.get.participantId, newImageView.imageId, currentOntology.ontologyVersionId, new DateTime().getMillis)
      create(imageView)
    } else
      throw new Exception("Not authorized to see this image")
  }

  def byParticipant(participantId: Int) = {
    db.run(table.filter(_.participantId === participantId).result)
  }

  //TODO: EW.
  def imageIncrement(userId: Int, requestImage: RequestImage, increment: ImageIncrement): Option[ImageWithAccessWithView] = {
    if(requestImage.imageViewId.isEmpty && increment == ImageIncrement.next)
      Image.nextImage(userId, requestImage.taskId).map(img => ImageWithAccessWithView(img, None))
    else {
      val participant = Await.result(Participant.participantByUserAndTask(userId, requestImage.taskId), Duration.Inf)
      val previouslySeenImages = Await.result(byParticipant(participant.get.participantId), Duration.Inf)

      if(previouslySeenImages.nonEmpty){
        val lastIndex = previouslySeenImages.size - 1

        val findIndex = requestImage.imageViewId.map(imageViewId => {
          val imageView = Await.result(byId(imageViewId), Duration.Inf)
          previouslySeenImages.indexWhere(a => a.createdMillis == imageView.createdMillis && a.imageId == imageView.imageId)
        })

        val incrementToIndex = findIndex.map(_ + increment.value).getOrElse(lastIndex)
        //TODO: TO JSON THING HERE...
        if(incrementToIndex <= lastIndex && incrementToIndex >= 0)
          Image.getImageWithAccess(userId, requestImage.taskId, previouslySeenImages(incrementToIndex).imageId)
              .map(img => ImageWithAccessWithView(img, Some(previouslySeenImages(incrementToIndex)).map(i => JsonImageView(requestImage.taskId, i.imageId, i.createdMillis, i.imageViewId))))
        else
          Image.nextImage(userId, requestImage.taskId).map(img => ImageWithAccessWithView(img, None))
      } else
        Image.nextImage(userId, requestImage.taskId).map(img => ImageWithAccessWithView(img, None))
    }
  }

  val nextImageIncrement = 1
  val previousImageIncrement = -1

  def idFromRow(a: _root_.com.example.app.db.Tables.ImageViewsRow) =
    a.imageViewId

  def updateId(a: _root_.com.example.app.db.Tables.ImageViewsRow, id: String) =
    a.copy(imageViewId = id)

  def idColumnFromTable(a: _root_.com.example.app.db.Tables.ImageViews) =
    a.imageViewId
}

case class ImageIncrement(value: Int)

object ImageIncrement {
  val next = ImageIncrement(1)
  val previous = ImageIncrement(-1)
}