package com.example.app.models

import com.example.app.{HasIntId, SlickDbObject, Tables}

/**
  * Created by matt on 5/31/17.
  */
case class ImageSource(id: Int, taskId: Int, name: String, imageSourceType: String, address: String) extends HasIntId[ImageSource]{
  def updateId(id: Int) = this.copy(id = id)
}

object ImageSource extends SlickDbObject[ImageSource, (Int, Int, String, String, String), Tables.ImageSources]{
  lazy val table = Tables.imageSources

  def reify(tuple: (Int, Int, String, String, String)) =
    (apply _).tupled(tuple)
}