package com.example.app.models

import com.example.app.SlickUUIDObject
import org.joda.time.DateTime
import com.example.app.AppGlobals
import AppGlobals.dbConfig.driver.api._
import scala.concurrent.Await
import scala.concurrent.duration.Duration
import com.example.app.demo.Tables._
/**
  * Created by matt on 5/31/17.
  */

case class SaveLabels(labels: Seq[JsonLabel] = Seq(), taskId: Int, imageId: String)

case class LabelRequest(taskId: Int, imageId: String)

case class LabelView(ontologyVersionId: Int,
                     ontology: String,
                     ontologyType: String,
                     labelValue: Double,
                     xCoordinate: Option[Double],
                     yCoordinate: Option[Double],
                     width: Option[Double],
                     height: Option[Double],
                     point1x: Option[Double],
                     point1y: Option[Double],
                     point2x: Option[Double],
                     point2y: Option[Double],
                     createdMillis: Long
                    )

case class JsonLabel(labelValue: Double,
                     xCoordinate: Option[Double],
                     yCoordinate: Option[Double],
                     width: Option[Double],
                     height: Option[Double],
                     point1x: Option[Double],
                     point1y: Option[Double],
                     point2x: Option[Double],
                     point2y: Option[Double]
                    ) {
  def toModel(participantId: Int, imageId: String, ontologyVersionId: Int, ontology: String, ontologyType: String, createdMillis: Long) =
    LabelsRow(
      null,
      participantId,
      imageId,
      ontologyVersionId,
      ontology,
      ontologyType,
      labelValue,
      xCoordinate,
      yCoordinate,
      width,
      height,
      point1x,
      point1y,
      point2x,
      point2y,
      createdMillis
    )
}

object Label extends SlickUUIDObject[LabelsRow, Labels] {
  lazy val table = Labels

  def makeJson(a: LabelsRow) =
    LabelView(a.ontologyVersionId, a.ontology, a.ontologyType, a.labelValue, a.xCoordinate, a.yCoordinate, a.width, a.height, a.point1X, a.point1Y, a.point2X, a.point2Y, a.createdMillis)

  def byTask(taskId: Int) =
    db.run(
      (for {
        participants <- Participant.table.filter(_.taskId === taskId)
        labels <- table if labels.participantId === participants.participantId
      } yield labels).result
    )

  def saveLabels(userId: Int, saveLabels: SaveLabels) = {
    val participant = Await.result(Participant.participantByUserAndTask(userId, saveLabels.taskId), Duration.Inf).get
    val ontology = Await.result(OntologyVersion.latestVersionByTask(saveLabels.taskId), Duration.Inf).get

    val now = new DateTime().getMillis

    val toCreate = saveLabels.labels.map(label => {
      label.toModel(participant.participantId, saveLabels.imageId, ontology.ontologyVersionId, ontology.ontologyName, ontology.ontologyType, now)
    })

    Await.result(db.run(table.filter(a => a.participantId === participant.participantId && a.imageId === saveLabels.imageId).delete), Duration.Inf)
    createMany(toCreate)
  }

  def labelsByParticipantAndImage(participantId: Int, imageId: String) = {
    db.run(table.filter(a => a.participantId === participantId && a.imageId === imageId).result)
  }

  def idFromRow(a: _root_.com.example.app.demo.Tables.LabelsRow) =
    a.labelId

  def updateId(a: _root_.com.example.app.demo.Tables.LabelsRow, id: String) =
    a.copy(labelId = id)

  def idColumnFromTable(a: _root_.com.example.app.demo.Tables.Labels) =
    a.labelId
}