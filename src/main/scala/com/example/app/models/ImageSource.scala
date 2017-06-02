package com.example.app.models

import com.example.app.{HasIntId, SlickDbObject, Tables, UpdatableDBObject}
import slick.driver.PostgresDriver.api._

import scala.concurrent.ExecutionContext.Implicits.global

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
}