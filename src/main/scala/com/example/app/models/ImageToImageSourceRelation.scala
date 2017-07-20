package com.example.app.models

import com.example.app.SlickUUIDObject
import com.example.app.demo.Tables.{ImageToImageSourceRelations, _}

/**
  * Created by matt on 5/31/17.
  */

object ImageToImageSourceRelation extends SlickUUIDObject[ImageToImageSourceRelationsRow, ImageToImageSourceRelations]{
  lazy val table = ImageToImageSourceRelations

  def idFromRow(a: _root_.com.example.app.demo.Tables.ImageToImageSourceRelationsRow) =
    a.imageToImageSourceRelationId

  def updateId(a: _root_.com.example.app.demo.Tables.ImageToImageSourceRelationsRow, id: String) =
    a.copy(imageToImageSourceRelationId = id)

  def idColumnFromTable(a: _root_.com.example.app.demo.Tables.ImageToImageSourceRelations) =
    a.imageToImageSourceRelationId
}