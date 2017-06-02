package com.example.app

import slick.driver.PostgresDriver.api._
import slick.profile.SqlProfile.ColumnOption.SqlType


object Tables {

  class Users(tag: Tag) extends Table[(Int, String, String)](tag, "USER_ACCOUNTS") with HasIdColumn[Int] {
    def id = column[Int]("USER_ACCOUNT_ID", O.PrimaryKey, O.AutoInc)
    def email = column[String]("EMAIL")
    def hashedPassword = column[String]("HASHED_PASSWORD")

    def * = (id, email, hashedPassword)
  }

  class DeviceTokens(tag: Tag) extends Table[(Int, Int, Option[String])](tag, "DEVICE_TOKENS") with HasIdColumn[Int] {
    def id = column[Int]("DEVICE_TOKEN_ID", O.PrimaryKey, O.AutoInc)
    def userId = column[Int]("USER_ID")
    def deviceToken = column[Option[String]]("DEVICE_TOKEN")

    def * = (id, userId, deviceToken)

    def user = foreignKey("DEVICE_TOKENS_TO_USER_FK", userId, users)(_.id)
  }

  class UserSessions(tag: Tag) extends Table[(Int, Int, String)](tag, "USER_SESSIONS") with HasIdColumn[Int] {
    def id = column[Int]("USER_SESSION_ID", O.PrimaryKey, O.AutoInc)
    def userId = column[Int]("USER_ID")
    def hashString = column[String]("HASH_STRING")

    def * = (id, userId, hashString)

    def user = foreignKey("USER_SESSIONS_TO_USER_FK", userId, users)(_.id)
  }

  class UserConnections(tag: Tag) extends Table[(Int, Int, Int)](tag, "USER_CONNECTIONS") with HasIdColumn[Int] {
    def id = column[Int]("USER_CONNECTION_ID", O.PrimaryKey, O.AutoInc)
    def senderUserId = column[Int]("SENDER_USER_ID")
    def receiverUserId = column[Int]("RECEIVER_USER_ID")

    def * = (id, senderUserId, receiverUserId)

    def sender = foreignKey("USER_CONNECTIONS_SENDER_TO_USERS_FK", senderUserId, users)(_.id)
    def receiver = foreignKey("USER_CONNECTIONS_RECEIVER_TO_USERS_FK", receiverUserId, users)(_.id)
  }

  class Tasks(tag: Tag) extends Table[(Int, String, Int, Long)](tag, "TASKS") with HasIdColumn[Int] {
    def id = column[Int]("TASK_ID", O.PrimaryKey, O.AutoInc)
    def name = column[String]("TASK_NAME")
    def creatorUserId = column[Int]("CREATOR_USER_ID")
    def createdMillis = column[Long]("CREATED_MILLIS")

    def * = (id, name, creatorUserId, createdMillis)

    def creator = foreignKey("TASK_TO_USERS_FK", creatorUserId, users)(_.id)
  }

  class OntologyVersions(tag: Tag) extends Table[(Int, String, String, Int, Int, String, Option[Double], Option[Double], Boolean, Boolean, Int, Long)](tag, "ONTOLOGY_VERSIONS") with HasIdColumn[Int] {
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

  class Participants(tag: Tag) extends Table[(Int, Int, Int, Boolean)](tag, "PARTICIPANTS") with HasIdColumn[Int] {
    def id = column[Int]("PARTICIPANT_ID", O.PrimaryKey, O.AutoInc)
    def taskId = column[Int]("TASK_ID")
    def userId = column[Int]("USER_ID")
    def isActive = column[Boolean]("IS_ACTIVE")

    def * = (id, taskId, userId, isActive)

    def user = foreignKey("PARTICIPANT_TO_USERS_FK", userId, users)(_.id)
    def task = foreignKey("PARTICIPANT_TO_TASKS_FK", taskId, tasks)(_.id)
  }

  class Invitations(tag: Tag) extends Table[(String, Int, Long)](tag, "INVITATIONS") with HasIdColumn[String] {
    def id = column[String]("INVITATION_ID", O.PrimaryKey)
    def taskId = column[Int]("TASK_ID")
    def createdMillis = column[Long]("CREATED_MILLIS")

    def * = (id, taskId, createdMillis)

    def task = foreignKey("INVITATION_TO_TASKS_FK", taskId, tasks)(_.id)
  }

  class Images(tag: Tag) extends Table[(String, String, String)](tag, "IMAGES") with HasIdColumn[String] {
    def id = column[String]("IMAGE_ID", O.PrimaryKey)
    def externalId = column[String]("EXTERNAL_ID")
    def location = column[String]("LOCATION")

    def * = (id, externalId, location)
  }

  class ImageToTaskRelations(tag: Tag) extends Table[(String, String, Int)](tag, "IMAGE_TO_TASK_RELATIONS") with HasIdColumn[String] {
    def id = column[String]("IMAGE_TO_TASK_RELATION_ID", O.PrimaryKey)
    def imageId = column[String]("IMAGE_ID")
    def taskId = column[Int]("TASK_ID")

    def * = (id, imageId, taskId)

    def image = foreignKey("IMAGE_TO_TASK_RELATION_TO_IMAGES_FK", imageId, images)(_.id)
    def task = foreignKey("IMAGE_TO_TASK_RELATION_TO_TASKS_FK", taskId, tasks)(_.id)
  }

  class ImageSources(tag: Tag) extends Table[(Int, Int, String, String, String)](tag, "IMAGE_SOURCES") with HasIdColumn[Int] {
    def id = column[Int]("IMAGE_SOURCE_ID", O.PrimaryKey, O.AutoInc)
    def taskId = column[Int]("TASK_ID")
    def name = column[String]("IMAGE_SOURCE_NAME")
    def imageSourceType = column[String]("IMAGE_SOURCE_TYPE")
    def address = column[String]("IMAGE_SOURCE_ADDRESS")

    def * = (id, taskId, name, imageSourceType, address)

    def task = foreignKey("IMAGE_SOURCE_TO_TASK_FK", taskId, tasks)(_.id)
  }

  class Labels(tag: Tag) extends Table[(String, Int, String, Int, String, String, Double, Option[Double], Option[Double], Option[Double], Option[Double], Option[Double], Option[Double], Option[Double], Option[Double], Long)](tag, "LABELS") with HasIdColumn[String] {
    def id = column[String]("LABEL_ID", O.PrimaryKey)
    def participantId = column[Int]("PARTICIPANT_ID")
    def imageId = column[String]("IMAGE_ID")
    def ontologyVersionId = column[Int]("ONTOLOGY_VERSION_ID")
    def classification = column[String]("CLASSIFICATION")
    def classificationType = column[String]("CLASSIFICATION_TYPE")
    def classificationValue = column[Double]("CLASSIFICATION_VALUE")
    def xCoordinate = column[Option[Double]]("X_COORDINATE")
    def yCoordinate = column[Option[Double]]("Y_COORDINATE")
    def width = column[Option[Double]]("WIDTH")
    def height = column[Option[Double]]("HEIGHT")
    def point1x = column[Option[Double]]("POINT_1_X")
    def point1y = column[Option[Double]]("POINT_1_Y")
    def point2x = column[Option[Double]]("POINT_2_X")
    def point2y = column[Option[Double]]("POINT_2_Y")
    def createdMillis = column[Long]("CREATED_MILLIS")

    def * = (id, participantId, imageId, ontologyVersionId, classification, classificationType, classificationValue, xCoordinate, yCoordinate, width, height, point1x, point1y, point2x, point2y, createdMillis)

    def participant = foreignKey("LABEL_TO_PARTICIPANTS_FK", participantId, participants)(_.id)
    def image = foreignKey("LABEL_TO_IMAGES_FK", imageId, images)(_.id)
    def ontologyVersion = foreignKey("LABEL_TO_ONTOLOGY_VERSIONS", ontologyVersionId, ontologyVersions)(_.id)
  }

  class ImageViews(tag: Tag) extends Table[(String, Int, String, Int, Long)](tag, "IMAGE_VIEWS") with HasIdColumn[String] {
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

  val users = TableQuery[Users]
  val deviceTokens = TableQuery[DeviceTokens]
  val userSessions = TableQuery[UserSessions]

  val userConnections = TableQuery[UserConnections]

  val tasks = TableQuery[Tasks]
  val ontologyVersions = TableQuery[OntologyVersions]
  val participants = TableQuery[Participants]
  val invitations = TableQuery[Invitations]
  val images = TableQuery[Images]
  val imageToTaskRelations = TableQuery[ImageToTaskRelations]
  val imageSources = TableQuery[ImageSources]
  val labels = TableQuery[Labels]
  val imageViews = TableQuery[ImageViews]


  val schemas = (users.schema ++ userSessions.schema ++ deviceTokens.schema ++ userConnections.schema ++
    tasks.schema ++ ontologyVersions.schema ++ participants.schema ++ invitations.schema ++ images.schema ++
    imageToTaskRelations.schema ++ imageSources.schema ++ labels.schema ++ imageViews.schema)


  // DBIO Action which creates the schema
  val createSchemaAction = schemas.create

  // DBIO Action which drops the schema
  val dropSchemaAction = schemas.drop

}

trait HasIdColumn[A]{
  def id: Rep[A]
}
