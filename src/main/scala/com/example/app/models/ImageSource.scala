package com.example.app.models

import com.example.app.{HasIntId, SlickDbObject, Tables, UpdatableDBObject}
import slick.driver.PostgresDriver.api._

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.Duration

/**
  * Created by matt on 5/31/17.
  */
case class ImageSource(id: Int = 0, taskId: Int, name: String, imageSourceType: String, address: String) extends HasIntId[ImageSource]{
  def updateId(id: Int) = this.copy(id = id)
}

object ImageSource extends UpdatableDBObject[ImageSource, (Int, Int, String, String, String), Tables.ImageSources]{
  lazy val table = Tables.imageSources


  def updateQuery(a: ImageSource) =  table.filter(_.id === a.id)
    .map(x => (x.name, x.imageSourceType, x.address))
    .update((a.name, a.imageSourceType, a.address))

  def reify(tuple: (Int, Int, String, String, String)) =
    (apply _).tupled(tuple)

  def byTask(taskId: Int) = {
    db.run(table.filter(_.taskId === taskId).result).map(_.map(reify))
  }

  def imagesInSource(imageSourceId: Int) = {
    db.run(
      (for {
        relations <- ImageToImageSourceRelation.table if relations.imageSourceId === imageSourceId
        images <- Image.table if images.id === relations.imageId
      } yield (images)).result
    ).map(_.map(Image.reify))
  }

  def deleteImagesFromSource(imageSourceId: Int, images: Seq[Image]) = {
    db.run(ImageToImageSourceRelation.table.filter(a => a.imageSourceId === imageSourceId && a.imageId.inSet(images.map(_.id))).delete)
  }

  def updateImageSourceImages(imageSource: ImageSource) = {
    println("updating images...")
    val imageAccessInterface = imageSourceInterfaceFromImageSource(imageSource)
    val images = imageAccessInterface.accessImages
    addImagesToSource(imageSource.id, images)
  }

  def imageSourceInterfaceFromImageSource(imageSource: ImageSource): ImageSourceInterface = {
    imageSource.imageSourceType match {
      case amazonS3.name => new AmazonS3ImageSource(imageSource)
    }
  }

  def addImagesToSource(imageSourceId: Int, images: Seq[Image]) = {
    val preexistingImages = Await.result(imagesByExternalIds(images.map(_.externalId)), Duration.Inf)
    val savedExternalIds = preexistingImages.map(_.externalId).toSet

    val imagesToSave = images.filterNot(a => savedExternalIds.contains(a.externalId))
    val savedImages = Await.result(Image.createMany(imagesToSave), Duration.Inf)

    val alreadyInSource = Await.result(imagesInSource(imageSourceId), Duration.Inf)

    val imagesByExternalId = (savedImages ++ preexistingImages).map(a => a.externalId -> a).toMap
    val alreadyInSourceByExternalId = alreadyInSource.map(a => a.externalId -> a).toMap

    val idsToAdd = imagesByExternalId.keys.toSet diff alreadyInSourceByExternalId.keys.toSet
    val idsToRemove = alreadyInSourceByExternalId.keys.toSet diff imagesByExternalId.keys.toSet

    Await.result(deleteImagesFromSource(imageSourceId, idsToRemove.map(id => alreadyInSourceByExternalId(id)).toSeq), Duration.Inf)
    Await.result(ImageToImageSourceRelation.createMany(idsToAdd.toSeq.map(id => ImageToImageSourceRelation(null, imagesByExternalId(id).id, imageSourceId))), Duration.Inf)
  }

  def imagesByExternalIds(externalIds: Seq[String]) = {
    db.run(Image.table.filter(_.id inSet externalIds).result).map(_.map(Image.reify))
  }

  val amazonS3 = ImageSourceType("AMAZON_S3")

  val imageSourceTypes = Seq(amazonS3)
}

case class ImageSourceType(name: String)