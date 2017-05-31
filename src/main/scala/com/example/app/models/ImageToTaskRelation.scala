package com.example.app.models

import com.example.app.{HasUUID, SlickUUIDObject, Tables}

/**
  * Created by matt on 5/31/17.
  */
case class ImageToTaskRelation(id: String, imageId: String, taskId: Int) extends HasUUID[ImageToTaskRelation] {
  def updateId(id: String) = this.copy(id = id)
}

object ImageToTaskRelation extends SlickUUIDObject[ImageToTaskRelation, (String, String, Int), Tables.ImageToTaskRelations]{
  lazy val table = Tables.imageToTaskRelations

  def reify(tuple: (String, String, Int)) =
    (apply _).tupled(tuple)
}