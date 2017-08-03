package com.example.app.models

import com.example.app.UpdatableUUIDObject
import com.example.app.AppGlobals
import AppGlobals.dbConfig.driver.api._
import com.example.app.db.Tables._

import scala.concurrent.Await
import scala.concurrent.duration.Duration

/**
  * Created by matt on 5/31/17.
  */

case class ImageWithAccess(image: ImagesRow, accessConfigs: Map[String, String])

case class ImageJson(id: String, location: String)

object Image extends UpdatableUUIDObject[ImagesRow, Images] {

  val configsHeader = "Image-Request-Headers"

  def makeJson(row: ImagesRow) =
    ImageJson(row.imageId, row.location)

  def updateQuery(a: ImagesRow) = table.filter(t => idColumnFromTable(t) === idFromRow(a))
    .map(x => x.location)
    .update(a.location)

  lazy val table = Images

  def nextImage(userId: Int, taskId: Int) = {
    val participant = Await.result(Participant.participantByUserAndTask(userId, taskId), Duration.Inf).get

    val labels = Await.result(Label.byTask(taskId), Duration.Inf)
    val views = Await.result(ImageView.byParticipant(participant.participantId), Duration.Inf)

    val labeledImages = labels.map(_.imageId)
    val seenImages = views.map(_.imageId)

    util.Random.shuffle(Await.result(db.run(
      (for {
        imageSources <- ImageSource.table if imageSources.taskId === taskId
        relations <- ImageToImageSourceRelation.table if imageSources.imageSourceId === relations.imageSourceId
        images <- table.filterNot(_.imageId inSet (labeledImages ++ seenImages)) if images.imageId === relations.imageId
      } yield (images, imageSources)).result
    ), Duration.Inf)).headOption.map{case (image, imageSource) => makeImageWithAccess(image, imageSource)}
  }

  def getImageWithAccess(userId: Int, taskId: Int, imageId: String) = {
    Await.result(db.run(
      (for{
        imageSources <- ImageSource.table if imageSources.taskId === taskId
        relations <- ImageToImageSourceRelation.table if imageSources.imageSourceId === relations.imageSourceId
        images <- table.filter(_.imageId === imageId) if images.imageId === relations.imageId
      } yield (images, imageSources)).result
    ), Duration.Inf
    ).headOption.map{case (image, imageSource) => makeImageWithAccess(image, imageSource)}
  }

  def makeImageWithAccess(image: ImagesRow, source: ImageSourcesRow) = {
    val imageAccessInterface = ImageSource.imageSourceInterfaceFromImageSource(source)
    ImageWithAccess(image, imageAccessInterface.imageHeaders(image))
  }

  def idFromRow(a: _root_.com.example.app.db.Tables.ImagesRow) =
    a.imageId

  def updateId(a: _root_.com.example.app.db.Tables.ImagesRow, id: String) =
    a.copy(imageId = id)

  def idColumnFromTable(a: _root_.com.example.app.db.Tables.Images) =
    a.imageId
}
