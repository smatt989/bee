package com.example.app.models

import com.example.app.{HasUUID, Tables, UpdatableUUIDObject}
import org.json4s.JsonAST.JValue
import slick.driver.PostgresDriver.api._

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.Duration

/**
  * Created by matt on 5/31/17.
  */
case class Image(id: String, externalId: String, location: String) extends HasUUID[Image] {
  def updateId(id: String) = this.copy(id = id)
}

case class ImageWithAccess(image: Image, accessConfigs: Map[String, String])

object Image extends UpdatableUUIDObject[Image, (String, String, String), Tables.Images] {
  def updateQuery(a: Image) = table.filter(_.id === a.id)
    .map(x => (x.location))
    .update((a.location))

  lazy val table = Tables.images

  def reify(tuple: (String, String, String)) =
    (apply _).tupled(tuple)

  def nextImage(userId: Int, taskId: Int) = {
    val participant = Await.result(Participant.participantByUserAndTask(userId, taskId), Duration.Inf).get

    val labels = Await.result(Label.byTask(taskId), Duration.Inf)
    val views = Await.result(ImageView.byParticipant(participant.id), Duration.Inf)

    val labeledImages = labels.map(_.imageId)
    val seenImages = views.map(_.imageId)

    util.Random.shuffle(Await.result(db.run(
      (for {
        imageSources <- ImageSource.table if imageSources.taskId === taskId
        relations <- ImageToImageSourceRelation.table if imageSources.id === relations.imageSourceId
        images <- table.filterNot(_.id inSet (labeledImages ++ seenImages)) if images.id === relations.imageId
      } yield (images, imageSources)).result
    ), Duration.Inf)).headOption.map{case (image, imageSource) => makeImageWithAccess(reify(image), ImageSource.reify(imageSource))}
  }

  def makeImageWithAccess(image: Image, source: ImageSource) = {
    val imageAccessInterface = ImageSource.imageSourceInterfaceFromImageSource(source)
    ImageWithAccess(image, imageAccessInterface.imageHeaders(image))
  }
}
