package com.example.app.migrations

import com.example.app.AppGlobals
import AppGlobals.dbConfig.driver.api._
import com.example.app.db._

object Migration2 extends Migration{

  val id = 2

  class Tasks(tag: Tag) extends Table[(Int, String, Int, Long)](tag, Some(InitDB.SCHEMA_NAME), "TASKS") {
    def id = column[Int]("TASK_ID", O.PrimaryKey, O.AutoInc)
    def name = column[String]("TASK_NAME")
    def creatorUserId = column[Int]("CREATOR_USER_ID")
    def createdMillis = column[Long]("CREATED_MILLIS")

    def * = (id, name, creatorUserId, createdMillis)

    def creator = foreignKey("TASK_TO_USERS_FK", creatorUserId, Migration1.users)(_.id)
  }

  class OntologyVersions(tag: Tag) extends Table[(Int, String, String, Int, Int, String, Option[Double], Option[Double], Boolean, Boolean, Int, Long)](tag, Some(InitDB.SCHEMA_NAME), "ONTOLOGY_VERSIONS") {
    def id = column[Int]("ONTOLOGY_VERSION_ID", O.PrimaryKey, O.AutoInc)
    def name = column[String]("ONTOLOGY_NAME")
    def versionString = column[String]("VERSION_STRING")
    def order = column[Int]("ORDER_VALUE")
    def taskId = column[Int]("TASK_ID")
    def ontologyType = column[String]("ONTOLOGY_TYPE")
    def minValue = column[Option[Double]]("MIN_VALUE")
    def maxValue = column[Option[Double]]("MAX_VALUE")
    def isAreaLabel = column[Boolean]("IS_AREA_LABEL")
    def isLengthLabel = column[Boolean]("IS_LENGTH_LABEL")
    def labelLimit = column[Int]("LABEL_LIMIT")
    def createdMillis = column[Long]("CREATED_MILLIS")

    def * = (id, name, versionString, order, taskId, ontologyType, minValue, maxValue, isAreaLabel, isLengthLabel, labelLimit, createdMillis)

    def task = foreignKey("ONTOLOGY_VERSION_TO_TASKS_FK", taskId, tasks)(_.id)
  }

  class Participants(tag: Tag) extends Table[(Int, Int, Int, Boolean)](tag, Some(InitDB.SCHEMA_NAME), "PARTICIPANTS") {
    def id = column[Int]("PARTICIPANT_ID", O.PrimaryKey, O.AutoInc)
    def taskId = column[Int]("TASK_ID")
    def userId = column[Int]("USER_ID")
    def isActive = column[Boolean]("IS_ACTIVE")

    def * = (id, taskId, userId, isActive)

    def user = foreignKey("PARTICIPANT_TO_USERS_FK", userId, Migration1.users)(_.id)
    def task = foreignKey("PARTICIPANT_TO_TASKS_FK", taskId, tasks)(_.id)
  }

  class Invitations(tag: Tag) extends Table[(String, Int, Long)](tag, Some(InitDB.SCHEMA_NAME), "INVITATIONS") {
    def id = column[String]("INVITATION_ID", O.PrimaryKey)
    def taskId = column[Int]("TASK_ID")
    def createdMillis = column[Long]("CREATED_MILLIS")

    def * = (id, taskId, createdMillis)

    def task = foreignKey("INVITATION_TO_TASKS_FK", taskId, tasks)(_.id)
  }

  class Images(tag: Tag) extends Table[(String, String, String)](tag, Some(InitDB.SCHEMA_NAME), "IMAGES") {
    def id = column[String]("IMAGE_ID", O.PrimaryKey)
    def externalId = column[String]("EXTERNAL_ID")
    def location = column[String]("LOCATION")

    def * = (id, externalId, location)
  }

  class ImageToImageSourceRelations(tag: Tag) extends Table[(String, String, Int)](tag, Some(InitDB.SCHEMA_NAME), "IMAGE_TO_IMAGE_SOURCE_RELATIONS") {
    def id = column[String]("IMAGE_TO_IMAGE_SOURCE_RELATION_ID", O.PrimaryKey)
    def imageId = column[String]("IMAGE_ID")
    def imageSourceId = column[Int]("IMAGE_SOURCE_ID")

    def * = (id, imageId, imageSourceId)

    def image = foreignKey("IMAGE_TO_IMAGE_SOURCE_RELATION_TO_IMAGES_FK", imageId, images)(_.id)
    def imageSource = foreignKey("IMAGE_TO_IMAGE_SOURCE_RELATION_TO_IMAGE_SOURCE_FK", imageSourceId, imageSources)(_.id)
  }

  class ImageSources(tag: Tag) extends Table[(Int, Int, String, String, String)](tag, Some(InitDB.SCHEMA_NAME), "IMAGE_SOURCES") {
    def id = column[Int]("IMAGE_SOURCE_ID", O.PrimaryKey, O.AutoInc)
    def taskId = column[Int]("TASK_ID")
    def name = column[String]("IMAGE_SOURCE_NAME")
    def imageSourceType = column[String]("IMAGE_SOURCE_TYPE")
    def configs = column[String]("IMAGE_SOURCE_CONFIGS")

    def * = (id, taskId, name, imageSourceType, configs)

    def task = foreignKey("IMAGE_SOURCE_TO_TASK_FK", taskId, tasks)(_.id)
  }

  class Labels(tag: Tag) extends Table[(String, Int, String, Int, String, String, Double, Option[Double], Option[Double], Option[Double], Option[Double], Option[Double], Option[Double], Option[Double], Option[Double], Long)](tag, Some(InitDB.SCHEMA_NAME), "LABELS") {
    def id = column[String]("LABEL_ID", O.PrimaryKey)
    def participantId = column[Int]("PARTICIPANT_ID")
    def imageId = column[String]("IMAGE_ID")
    def ontologyVersionId = column[Int]("ONTOLOGY_VERSION_ID")
    def ontology = column[String]("ONTOLOGY")
    def ontologyType = column[String]("ONTOLOGY_TYPE")
    def labelValue = column[Double]("LABEL_VALUE")
    def xCoordinate = column[Option[Double]]("X_COORDINATE")
    def yCoordinate = column[Option[Double]]("Y_COORDINATE")
    def width = column[Option[Double]]("WIDTH")
    def height = column[Option[Double]]("HEIGHT")
    def point1x = column[Option[Double]]("POINT_1_X")
    def point1y = column[Option[Double]]("POINT_1_Y")
    def point2x = column[Option[Double]]("POINT_2_X")
    def point2y = column[Option[Double]]("POINT_2_Y")
    def createdMillis = column[Long]("CREATED_MILLIS")

    def * = (id, participantId, imageId, ontologyVersionId, ontology, ontologyType, labelValue, xCoordinate, yCoordinate, width, height, point1x, point1y, point2x, point2y, createdMillis)

    def participant = foreignKey("LABEL_TO_PARTICIPANTS_FK", participantId, participants)(_.id)
    def image = foreignKey("LABEL_TO_IMAGES_FK", imageId, images)(_.id)
    def ontologyVersion = foreignKey("LABEL_TO_ONTOLOGY_VERSIONS", ontologyVersionId, ontologyVersions)(_.id)
  }

  class ImageViews(tag: Tag) extends Table[(String, Int, String, Int, Long)](tag, Some(InitDB.SCHEMA_NAME), "IMAGE_VIEWS") {
    def id = column[String]("IMAGE_VIEW_ID", O.PrimaryKey)
    def participantId = column[Int]("PARTICIPANT_ID")
    def imageId = column[String]("IMAGE_ID")
    def ontologyVersionId = column[Int]("ONTOLOGY_VERSION_ID")
    def createdMillis = column[Long]("CREATED_MILLIS")

    def * = (id, participantId, imageId, ontologyVersionId, createdMillis)

    def participant = foreignKey("IMAGE_VIEW_TO_PARTICIPANTS_FK", participantId, participants)(_.id)
    def image = foreignKey("IMAGE_VIEW_TO_IMAGES_FK", imageId, images)(_.id)
    def ontologyVersion = foreignKey("IMAGE_VIEW_TO_ONTOLOGY_VERSIONS_FK", ontologyVersionId, ontologyVersions)(_.id)
  }

  val tasks = TableQuery[Tasks]
  val ontologyVersions = TableQuery[OntologyVersions]
  val participants = TableQuery[Participants]
  val invitations = TableQuery[Invitations]
  val images = TableQuery[Images]
  val imageToTaskRelations = TableQuery[ImageToImageSourceRelations]
  val imageSources = TableQuery[ImageSources]
  val labels = TableQuery[Labels]
  val imageViews = TableQuery[ImageViews]

  def query = (tasks.schema ++ ontologyVersions.schema ++ participants.schema ++ invitations.schema ++ images.schema ++
    imageToTaskRelations.schema ++ imageSources.schema ++ labels.schema ++ imageViews.schema).create
}
