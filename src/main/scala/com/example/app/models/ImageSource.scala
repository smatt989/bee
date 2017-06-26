package com.example.app.models

import javax.servlet.http.{HttpServletRequest, HttpServletResponse}

import com.example.app.{HasIntId, SlickDbObject, Tables, UpdatableDBObject}
import org.joda.time.DateTime
import org.json4s.DefaultFormats
import org.json4s.JsonAST.{JObject, JValue}
import org.json4s.jackson.JsonMethods
import slick.driver.PostgresDriver.api._

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.Duration
import org.json4s.jackson.Serialization

/**
  * Created by matt on 5/31/17.
  */
case class ImageSource(id: Int = 0, taskId: Int, name: String, imageSourceType: String, configs: String) extends HasIntId[ImageSource]{
  def updateId(id: Int) = this.copy(id = id)

  def jsonConfigs =
    JsonMethods.parse(configs)

  implicit val formats = DefaultFormats

  def makeHeaderMap(implicit response: HttpServletResponse) = {
    val imageSourceFullType = ImageSource.imageSourceTypeByName(imageSourceType)
    imageSourceFullType.fields.map(field => {
      response.addHeader(field, (jsonConfigs \ field).extract[String])
    })
  }

  def toJson =
    ImageSourceRequest(id, taskId, name, imageSourceType)
}

case class ImageSourceRequest(id: Int = 0, taskId: Int, name: String, imageSourceType: String) {

  implicit val formats = DefaultFormats

  def getSerialized(implicit request: HttpServletRequest) = {
    val imageSourceFullType = ImageSource.imageSourceTypeByName(imageSourceType)
    val configsMap = imageSourceFullType.fields.map(field => field -> request.getHeader(field)).toMap
    val configs = Serialization.write(configsMap)
    ImageSource(id, taskId, name, imageSourceType, configs)
  }
}

object ImageSource extends UpdatableDBObject[ImageSource, (Int, Int, String, String, String), Tables.ImageSources]{
  lazy val table = Tables.imageSources


  def updateQuery(a: ImageSource) =  table.filter(_.id === a.id)
    .map(x => (x.name, x.imageSourceType, x.configs))
    .update((a.name, a.imageSourceType, a.configs))

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

  def imageCountInSources(imageSourceIds: Seq[Int]) = {
    //TODO: MAY WANT TO ADD SOME SORT OF DISTINCT THING HERE...
    db.run(ImageToImageSourceRelation.table.filter(_.imageSourceId inSet imageSourceIds).length.result).map(ImageSourceDetails)
  }

  def deleteImagesFromSource(imageSourceId: Int, images: Seq[Image]) = {
    db.run(ImageToImageSourceRelation.table.filter(a => a.imageSourceId === imageSourceId && a.imageId.inSet(images.map(_.id))).delete)
  }

  def updateImageSourceImages(imageSource: ImageSource) = {
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
    db.run(Image.table.filter(_.externalId inSet externalIds).result).map(_.map(Image.reify))
  }

  val amazonS3 = ImageSourceType("AMAZON_S3", Seq("Bucket", "Access-Key", "Secret"))

  val imageSourceTypes = Seq(amazonS3)

  val imageSourceTypeByName = imageSourceTypes.map(a => a.name -> a).toMap
}

case class ImageSourceType(name: String, fields: Seq[String])

case class ImageSourceDetails(imageCount: Int)