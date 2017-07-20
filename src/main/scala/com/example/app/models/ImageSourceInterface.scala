package com.example.app.models


import com.amazonaws.auth._
import com.amazonaws.services.s3.AmazonS3Client
import com.example.app.demo.Tables.{ImageSourcesRow, ImagesRow}
import org.json4s.DefaultFormats
import org.json4s.jackson.JsonMethods

import scala.collection.JavaConversions._

/**
  * Created by matt on 6/4/17.
  */
trait ImageSourceInterface {

  def accessImages: Seq[ImagesRow]
  def imageHeaders(image: ImagesRow): Map[String, String]
}

class AmazonS3ImageSource(imageSource: ImageSourcesRow) extends ImageSourceInterface {

  implicit val formats = DefaultFormats

  val parsed = JsonMethods.parse(imageSource.imageSourceConfigs)

  val bucket = (parsed \ "Bucket").extract[String]
  val accessKey = (parsed \ "Access-Key").extract[String]
  val secret = (parsed \ "Secret").extract[String]


  //TODO: DON'T FORGET TO CHECK FOR TRUNCATION
  def accessImages = {

    val credentials = new BasicAWSCredentials(accessKey, secret)
    val s3 = new AmazonS3Client(credentials)

    val bucketExists = s3.doesBucketExist(bucket)

    if(bucketExists) {
      val objects = s3.listObjects(bucket).getObjectSummaries

      objects.toList.map(o => {
        val key = o.getKey
        ImagesRow(null, key, s3.getResourceUrl(bucket, key))
      })
    } else
      throw new Exception("no such bucket...")
  }

  def imageHeaders(image: ImagesRow) =
    Map("referer" -> accessKey)
}