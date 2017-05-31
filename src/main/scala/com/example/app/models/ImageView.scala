package com.example.app.models

import com.example.app.{HasUUID, SlickUUIDObject, Tables}

/**
  * Created by matt on 5/31/17.
  */
case class ImageView(id: String = null, participantId: Int, imageId: String, ontologyVersionId: Int, createdMillis: Long) extends HasUUID[ImageView] {
  def updateId(id: String) = this.copy(id = id)
}

object ImageView extends SlickUUIDObject[ImageView, (String, Int, String, Int, Long), Tables.ImageViews] {
  lazy val table = Tables.imageViews

  def reify(tuple: (String, Int, String, Int, Long)) =
    (apply _).tupled(tuple)
}
