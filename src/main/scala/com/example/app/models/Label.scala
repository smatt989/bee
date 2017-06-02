package com.example.app.models

import com.example.app.{HasUUID, SlickUUIDObject, Tables}
import org.joda.time.DateTime
import slick.driver.PostgresDriver.api._

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.Duration
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
                 point1x: Option[Double],
                 point1y: Option[Double],
                 point2x: Option[Double],
                 point2y: Option[Double],
                 createdMillis: Long
                ) extends HasUUID[Label] {
  def updateId(id: String) = this.copy(id = id)
}

case class SaveLabels(labels: Seq[JsonLabel], taskId: Int, imageId: String, ontologyVersionId: Int)

case class LabelRequest(taskId: Int, imageId: String)

case class JsonLabel(classificationValue: Double,
                     xCoordinate: Option[Double],
                     yCoordinate: Option[Double],
                     width: Option[Double],
                     height: Option[Double],
                     point1x: Option[Double],
                     point1y: Option[Double],
                     point2x: Option[Double],
                     point2y: Option[Double]
                    ) {
  def toModel(participantId: Int, imageId: String, ontologyVersionId: Int, classification: String, classificationType: String, createdMillis: Long) =
    Label(
      null,
      participantId,
      imageId,
      ontologyVersionId,
      classification,
      classificationType,
      classificationValue,
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

object Label extends SlickUUIDObject[Label, (String, Int, String, Int, String, String, Double, Option[Double], Option[Double], Option[Double], Option[Double], Option[Double], Option[Double], Option[Double], Option[Double], Long), Tables.Labels] {
  lazy val table = Tables.labels

  def reify(tuple: (String, Int, String, Int, String, String, Double, Option[Double], Option[Double], Option[Double], Option[Double], Option[Double], Option[Double], Option[Double], Option[Double], Long)) =
    (apply _).tupled(tuple)

  def byTask(taskId: Int) =
    db.run(
      (for {
        participants <- Participant.table.filter(_.taskId === taskId)
        labels <- table if labels.participantId === participants.id
      } yield (labels)).result
    ).map(_.map(reify))

  def saveLabels(userId: Int, saveLabels: SaveLabels) = {
    val participant = Await.result(Participant.participantByUserAndTask(userId, saveLabels.taskId), Duration.Inf).get
    val ontology = Await.result(OntologyVersion.byId(saveLabels.ontologyVersionId), Duration.Inf)

    val now = new DateTime().getMillis

    val toCreate = saveLabels.labels.map(label => {
      label.toModel(participant.id, saveLabels.imageId, saveLabels.ontologyVersionId, ontology.name, ontology.ontologyType, now)
    })

    Await.result(db.run(table.filter(a => a.participantId === participant.id && a.imageId === saveLabels.imageId).delete), Duration.Inf)
    createMany(toCreate)
  }

  def labelsByParticipantAndImage(participantId: Int, imageId: String) = {
    db.run(table.filter(a => a.participantId === participantId && a.imageId === imageId).result).map(_.map(reify))
  }

}