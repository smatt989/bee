package com.example.app.models


import com.amazonaws.auth._
import com.amazonaws.services.s3.AmazonS3Client
import com.amazonaws.services.s3.event.S3EventNotification.S3BucketEntity
import com.amazonaws.{AmazonWebServiceClient, ClientConfiguration}
import scala.collection.JavaConversions._

/**
  * Created by matt on 6/4/17.
  */
trait ImageSourceInterface {

  def accessImages: Seq[Image]
}

class AmazonS3ImageSource(imageSource: ImageSource) extends ImageSourceInterface {

  val accessKey = "AKIAIUMOYK4QDOAG26DQ"
  val secret = "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"

  //TODO: SEEMS LIKE ANYONE CAN VIEW THE IMAGES GIVEN URL?

  //TODO: DON'T FORGET TO CHECK FOR TRUNCATION
  def accessImages = {

    val credentials = new BasicAWSCredentials(accessKey, secret)
    val s3 = new AmazonS3Client(credentials)

    val bucketName = imageSource.address//"smatt989-image-annotation"

    val bucketExists = s3.doesBucketExist(bucketName)

    if(bucketExists) {
      val objects = s3.listObjects(bucketName).getObjectSummaries()

      objects.toList.map(o => {
        val key = o.getKey
        Image(null, key, s3.getResourceUrl(bucketName, key))
      })
    } else
      throw new Exception("no such bucket...")
  }
}