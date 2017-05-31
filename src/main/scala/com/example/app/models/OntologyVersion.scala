package com.example.app.models

import com.example.app.{HasIntId, SlickDbObject, Tables}
import org.joda.time.DateTime
import slick.driver.PostgresDriver.api._

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.Duration

/**
  * Created by matt on 5/31/17.
  */
case class OntologyVersion(id: Int, versionString: String, order: Int, taskId: Int, ontologyType: String, minValue: Option[Double], maxValue: Option[Double], isAreaLabel: Boolean, labelLimit: Int, createdMillis: Long) extends HasIntId[OntologyVersion] {
  def updateId(id: Int) = this.copy(id = id)
}

case class OntologyVersionCreate(versionString: String, taskId: Int, ontologyType: String, minValue: Option[Double] = None, maxValue: Option[Double] = None, isAreaLabel: Boolean = false, labelLimit: Int = 1) {
  def toModel(order: Int) =
    OntologyVersion(0, versionString, order, taskId, ontologyType, minValue, maxValue, isAreaLabel, labelLimit, new DateTime().getMillis)
}

object OntologyVersion extends SlickDbObject[OntologyVersion, (Int, String, Int, Int, String, Option[Double], Option[Double], Boolean, Int, Long), Tables.OntologyVersions] {
  lazy val table = Tables.ontologyVersions

  def reify(tuple: (Int, String, Int, Int, String, Option[Double], Option[Double], Boolean, Int, Long)) =
    (apply _).tupled(tuple)

  def createOntologyVersion(version: OntologyVersionCreate) = {
    val latestVersion = Await.result(latestVersionByTask(version.taskId), Duration.Inf)
    val newVersion = version.toModel(latestVersion.map(_.order + 1).getOrElse(0))
    create(newVersion)
  }

  def latestVersionByTask(taskId: Int) = {
    db.run(
      table.filter(_.taskId === taskId).sortBy(_.order).result
    ).map(_.headOption.map(reify))
  }
}
