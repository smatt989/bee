package com.example.app.models

import javax.servlet.http.{HttpServletRequest, HttpServletResponse}

import com.example.app.UpdatableDBObject
import org.json4s.DefaultFormats
import org.json4s.jackson.JsonMethods
import com.example.app.AppGlobals
import AppGlobals.dbConfig.driver.api._

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.Duration
import org.json4s.jackson.Serialization

import com.example.app.db.Tables._

/**
  * Created by matt on 5/31/17.
  */

case class ImageSourceRequest(id: Int = 0, taskId: Int, name: String, imageSourceType: String) {

  implicit val formats = DefaultFormats

  def getSerialized(implicit request: HttpServletRequest) = {
    val imageSourceFullType = ImageSource.imageSourceTypeByName(imageSourceType)
    val configsMap = imageSourceFullType.fields.map(field => field -> request.getHeader(field)).toMap
    val configs = Serialization.write(configsMap)
    ImageSourcesRow(id, taskId, name, imageSourceType, configs)
  }
}

object ImageSource extends UpdatableDBObject[ImageSourcesRow, ImageSources]{
  lazy val table = ImageSources

  def jsonConfigs(a: ImageSourcesRow) =
    JsonMethods.parse(a.imageSourceConfigs)

  implicit val formats = DefaultFormats

  def makeHeaderMap(a: ImageSourcesRow)(implicit response: HttpServletResponse) = {
    val imageSourceFullType = ImageSource.imageSourceTypeByName(a.imageSourceType)
    val configs = jsonConfigs(a)
    imageSourceFullType.fields.foreach(field => {
      response.addHeader(field, (configs \ field).extract[String])
    })
  }

  def makeJson(a: ImageSourcesRow) =
    ImageSourceRequest(a.imageSourceId, a.taskId, a.imageSourceName, a.imageSourceType)

  def updateQuery(a: ImageSourcesRow) =  table.filter(t => idColumnFromTable(t) === idFromRow(a))
    .map(x => (x.imageSourceName, x.imageSourceType, x.imageSourceConfigs))
    .update((a.imageSourceName, a.imageSourceType, a.imageSourceConfigs))

  def byTask(taskId: Int) = {
    db.run(table.filter(_.taskId === taskId).result)
  }

  def imagesInSource(imageSourceId: Int) = {
    db.run(
      (for {
        relations <- ImageToImageSourceRelation.table if relations.imageSourceId === imageSourceId
        images <- Image.table if images.imageId === relations.imageId
      } yield images).result
    )
  }

  def imageSourceDetails(imageSourceIds: Seq[Int]) = {
    val participants = Await.result(db.run(
      (
        for {
          imageSources <- table.filter(_.imageSourceId inSet imageSourceIds)
          participants <- Participant.table if participants.taskId === imageSources.taskId
        } yield (participants)
        ).result
    ), Duration.Inf)

    val participantIds = participants.map(_.participantId)

    db.run(
      (
        for {
          ((images, seen), label) <- ImageToImageSourceRelation.table
            .filter(_.imageSourceId inSet imageSourceIds) joinLeft ImageView.table.filter(_.participantId inSet participantIds) on (_.imageId === _.imageId) joinLeft Label.table.filter(_.participantId inSet participantIds) on (_._1.imageId === _.imageId)

        } yield (images, seen, label)
        ).result
    ).map(_.groupBy(_._1.imageSourceId).map(a =>
      ImageSourceDetails(
        a._1,
        a._2.map(_._1.imageId).distinct.size,
        a._2.flatMap(_._2).map(_.imageId).distinct.size,
        a._2.flatMap(_._3).map(_.imageId).distinct.size
      )
    ))
  }

  def deleteImagesFromSource(imageSourceId: Int, images: Seq[ImagesRow]) = {
    db.run(ImageToImageSourceRelation.table.filter(a => a.imageSourceId === imageSourceId && a.imageId.inSet(images.map(_.imageId))).delete)
  }

  def updateImageSourceImages(imageSource: ImageSourcesRow) = {
    val imageAccessInterface = imageSourceInterfaceFromImageSource(imageSource)
    val images = imageAccessInterface.accessImages
    addImagesToSource(imageSource.imageSourceId, images)
  }

  def imageSourceInterfaceFromImageSource(imageSource: ImageSourcesRow): ImageSourceInterface = {
    imageSource.imageSourceType match {
      case amazonS3.name => new AmazonS3ImageSource(imageSource)
      case s3Bucket.name => new AmazonS3BucketSource(imageSource)
    }
  }

  def addImagesToSource(imageSourceId: Int, images: Seq[ImagesRow]) = {
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
    Await.result(ImageToImageSourceRelation.createMany(idsToAdd.toSeq.map(id => ImageToImageSourceRelationsRow(null, imagesByExternalId(id).imageId, imageSourceId))), Duration.Inf)
  }

  def imagesByExternalIds(externalIds: Seq[String]) = {
    db.run(Image.table.filter(_.externalId inSet externalIds).result)
  }

  val amazonS3 = ImageSourceType("AMAZON_S3", Seq("Bucket", "Access-Key", "Secret"))
  val s3Bucket = ImageSourceType("S3_BUCKET", Seq("Bucket"))

  val imageSourceTypes = Seq(amazonS3, s3Bucket)

  val imageSourceTypeByName = imageSourceTypes.map(a => a.name -> a).toMap

  def idFromRow(a: _root_.com.example.app.db.Tables.ImageSourcesRow) =
    a.imageSourceId

  def updateId(a: _root_.com.example.app.db.Tables.ImageSourcesRow, id: Int) =
    a.copy(imageSourceId = id)

  def idColumnFromTable(a: _root_.com.example.app.db.Tables.ImageSources) =
    a.imageSourceId
}

case class ImageSourceType(name: String, fields: Seq[String])

case class ImageSourceDetails(imageSourceId: Int, imageCount: Int, seen: Int, labeled: Int)