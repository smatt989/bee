package com.example.app.models


import com.amazonaws.auth._
import com.amazonaws.services.s3.AmazonS3Client
import com.amazonaws.services.s3.model.S3ObjectSummary
import com.example.app.db.Tables.{ImageSourcesRow, ImagesRow}
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

trait JsonConfigs {

  implicit val formats = DefaultFormats
  def imageSource: ImageSourcesRow
  def parsed = JsonMethods.parse(imageSource.imageSourceConfigs)
}

class AmazonS3ImageSource(val imageSource: ImageSourcesRow) extends ImageSourceInterface with JsonConfigs {

  val bucket = (parsed \ "Bucket").extract[String]
  val accessKey = (parsed \ "Access-Key").extract[String]
  val secret = (parsed \ "Secret").extract[String]


  //TODO: DON'T FORGET TO CHECK FOR TRUNCATION
  def accessImages = {

    val credentials = new BasicAWSCredentials(accessKey, secret)
    val s3 = new AmazonS3Client(credentials)

    val bucketExists = s3.doesBucketExist(bucket)

    if(bucketExists) {

      var obj = s3.listObjects(bucket)
      var listings = obj.getObjectSummaries.toList
      var truncated = obj.isTruncated

      while(truncated) {
        obj = s3.listNextBatchOfObjects(obj)
        listings = listings ++ obj.getObjectSummaries.toList
        truncated = obj.isTruncated
      }

      listings.map(o => {
        val key = o.getKey
        ImagesRow(null, key, s3.getResourceUrl(bucket, key))
      })
    } else
      throw new Exception("no such bucket...")
  }

  def imageHeaders(image: ImagesRow) =
    Map("referer" -> accessKey)
}

class AmazonS3BucketSource(val imageSource: ImageSourcesRow) extends ImageSourceInterface with JsonConfigs {

  val bucket = (parsed \ "Bucket").extract[String]

  def accessImages = {
    val s3 = new AmazonS3Client()

    val bucketExists = s3.doesBucketExist(bucket)

    if(bucketExists) {


      var obj = s3.listObjects(bucket)
      var listings = obj.getObjectSummaries.toList
      var truncated = obj.isTruncated

      while(truncated) {
        obj = s3.listNextBatchOfObjects(obj)
        listings = listings ++ obj.getObjectSummaries.toList
        truncated = obj.isTruncated
      }

      listings.map(o => {
        val key = o.getKey
        ImagesRow(null, key, s3.getResourceUrl(bucket, key))
      })
    } else
      throw new Exception("no such bucket...")
  }

  def imageHeaders(image: _root_.com.example.app.db.Tables.ImagesRow) = Map()
}