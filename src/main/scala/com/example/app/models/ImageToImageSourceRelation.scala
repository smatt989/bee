package com.example.app.models

import com.example.app.{HasUUID, SlickUUIDObject, Tables}

/**
  * Created by matt on 5/31/17.
  */
case class ImageToImageSourceRelation(id: String, imageId: String, imageSourceId: Int) extends HasUUID[ImageToImageSourceRelation] {
  def updateId(id: String) = this.copy(id = id)
}

object ImageToImageSourceRelation extends SlickUUIDObject[ImageToImageSourceRelation, (String, String, Int), Tables.ImageToImageSourceRelations]{
  lazy val table = Tables.imageToTaskRelations

  def reify(tuple: (String, String, Int)) =
    (apply _).tupled(tuple)
}