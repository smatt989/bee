package com.example.app.models

import com.example.app.{HasUUID, SlickUUIDObject, Tables}

/**
  * Created by matt on 5/31/17.
  */
case class Label(id: String,
                 participantId: Int,
                 imageId: String,
                 ontologyVersionId: Int,
                 classification: String,
                 classificationType: String,
                 classificationValue: Double,
                 xCoordinate: Option[Double],
                 yCoordinate: Option[Double],
                 width: Option[Double],
                 height: Option[Double],
                 createdMillis: Long
                ) extends HasUUID[Label] {
  def updateId(id: String) = this.copy(id = id)
}

object Label extends SlickUUIDObject[Label, (String, Int, String, Int, String, String, Double, Option[Double], Option[Double], Option[Double], Option[Double], Long), Tables.Labels] {
  lazy val table = Tables.labels

  def reify(tuple: (String, Int, String, Int, String, String, Double, Option[Double], Option[Double], Option[Double], Option[Double], Long)) =
    (apply _).tupled(tuple)
}