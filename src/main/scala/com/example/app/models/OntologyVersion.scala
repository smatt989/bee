package com.example.app.models

import com.example.app.SlickDbObject
import org.joda.time.DateTime
import com.example.app.AppGlobals
import AppGlobals.dbConfig.driver.api._

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.Duration
import com.example.app.db.Tables._

/**
  * Created by matt on 5/31/17.
  */

case class OntologyVersionJson(name: String, versionString: String = "1.0.0", ontologyType: String, minValue: Option[Double] = None, maxValue: Option[Double] = None, isAreaLabel: Boolean = false, isLengthLabel: Boolean = false, labelLimit: Int = 1) {
  def toModel(order: Int, taskId: Int) =
    OntologyVersionsRow(0, name, versionString, order, taskId, ontologyType, minValue, maxValue, isAreaLabel, isLengthLabel, labelLimit, new DateTime().getMillis)
}

object OntologyVersion extends SlickDbObject[OntologyVersionsRow, OntologyVersions] {

  def makeJson(a: OntologyVersionsRow) =
    OntologyVersionJson(a.ontologyName, a.versionString, a.ontologyType, a.minValue, a.maxValue, a.isAreaLabel, a.isLengthLabel, a.labelLimit)

  lazy val table = OntologyVersions

  def createOntologyVersion(taskId: Int, version: OntologyVersionJson) = {
    val latestVersion = Await.result(latestVersionByTask(taskId), Duration.Inf)
    val newVersion = version.toModel(latestVersion.map(_.orderValue + 1).getOrElse(0), taskId)
    create(newVersion)
  }

  def latestVersionByTask(taskId: Int) = {
    db.run(
      table.filter(_.taskId === taskId).sortBy(_.orderValue).result
    ).map(_.reverse.headOption)
  }

  val ontologyTypes = Seq(OntologyType("BINARY"), OntologyType("INTEGER_RANGE"), OntologyType("FLOAT_RANGE"))

  def idFromRow(a: _root_.com.example.app.db.Tables.OntologyVersionsRow) =
    a.ontologyVersionId

  def updateId(a: _root_.com.example.app.db.Tables.OntologyVersionsRow, id: Int) =
    a.copy(ontologyVersionId = id)

  def idColumnFromTable(a: _root_.com.example.app.db.Tables.OntologyVersions) =
    a.ontologyVersionId
}

case class OntologyType(name: String)