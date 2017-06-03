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
case class OntologyVersion(id: Int,
                           name: String,
                           versionString: String,
                           order: Int,
                           taskId: Int,
                           ontologyType: String,
                           minValue: Option[Double],
                           maxValue: Option[Double],
                           isAreaLabel: Boolean,
                           isLengthLabel: Boolean,
                           labelLimit: Int,
                           createdMillis: Long) extends HasIntId[OntologyVersion] {
  def updateId(id: Int) = this.copy(id = id)

  def toJson =
    OntologyVersionJson(name, versionString, ontologyType, minValue, maxValue, isAreaLabel, isLengthLabel, labelLimit)
}

case class OntologyVersionJson(name: String, versionString: String = "1.0.0", ontologyType: String, minValue: Option[Double] = None, maxValue: Option[Double] = None, isAreaLabel: Boolean = false, isLengthLabel: Boolean = false, labelLimit: Int = 1) {
  def toModel(order: Int, taskId: Int) =
    OntologyVersion(0, name, versionString, order, taskId, ontologyType, minValue, maxValue, isAreaLabel, isLengthLabel, labelLimit, new DateTime().getMillis)
}

object OntologyVersion extends SlickDbObject[OntologyVersion, (Int, String, String, Int, Int, String, Option[Double], Option[Double], Boolean, Boolean, Int, Long), Tables.OntologyVersions] {
  lazy val table = Tables.ontologyVersions

  def reify(tuple: (Int, String, String, Int, Int, String, Option[Double], Option[Double], Boolean, Boolean, Int, Long)) =
    (apply _).tupled(tuple)

  def createOntologyVersion(taskId: Int, version: OntologyVersionJson) = {
    val latestVersion = Await.result(latestVersionByTask(taskId), Duration.Inf)
    val newVersion = version.toModel(latestVersion.map(_.order + 1).getOrElse(0), taskId)
    create(newVersion)
  }

  def latestVersionByTask(taskId: Int) = {
    db.run(
      table.filter(_.taskId === taskId).sortBy(_.order).result
    ).map(_.reverse.headOption.map(reify))
  }

  val ontologyTypes = Seq(OntologyType("BINARY"), OntologyType("INTEGER_RANGE"), OntologyType("FLOAT_RANGE"))
}

case class OntologyType(name: String)