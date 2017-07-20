package com.example.app.db
// AUTO-GENERATED Slick data model
/** Stand-alone Slick data model for immediate use */
object Tables extends {
  val profile = slick.driver.PostgresDriver
} with Tables

/** Slick data model trait for extension, choice of backend or usage in the cake pattern. (Make sure to initialize this late.) */
trait Tables {
  val profile: slick.driver.JdbcProfile
  import profile.api._
  import slick.model.ForeignKeyAction
  // NOTE: GetResult mappers for plain SQL are only generated for tables where Slick knows how to map the types of all columns.
  import slick.jdbc.{GetResult => GR}

  /** DDL for all tables. Call .create to execute. */
  lazy val schema: profile.SchemaDescription = Array(DeviceTokens.schema, Images.schema, ImageSources.schema, ImageToImageSourceRelations.schema, ImageViews.schema, Invitations.schema, Labels.schema, Migrations.schema, OntologyVersions.schema, Participants.schema, Tasks.schema, UserAccounts.schema, UserConnections.schema, UserSessions.schema).reduceLeft(_ ++ _)
  @deprecated("Use .schema instead of .ddl", "3.0")
  def ddl = schema

  /** Entity class storing rows of table DeviceTokens
   *  @param deviceTokenId Database column DEVICE_TOKEN_ID SqlType(INTEGER), AutoInc, PrimaryKey
   *  @param userId Database column USER_ID SqlType(INTEGER)
   *  @param deviceToken Database column DEVICE_TOKEN SqlType(VARCHAR), Default(None) */
  case class DeviceTokensRow(deviceTokenId: Int, userId: Int, deviceToken: Option[String] = None)
  /** GetResult implicit for fetching DeviceTokensRow objects using plain SQL queries */
  implicit def GetResultDeviceTokensRow(implicit e0: GR[Int], e1: GR[Option[String]]): GR[DeviceTokensRow] = GR{
    prs => import prs._
    DeviceTokensRow.tupled((<<[Int], <<[Int], <<?[String]))
  }
  /** Table description of table DEVICE_TOKENS. Objects of this class serve as prototypes for rows in queries. */
  class DeviceTokens(_tableTag: Tag) extends Table[DeviceTokensRow](_tableTag, Some("BEE"), "DEVICE_TOKENS") {
    def * = (deviceTokenId, userId, deviceToken) <> (DeviceTokensRow.tupled, DeviceTokensRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (Rep.Some(deviceTokenId), Rep.Some(userId), deviceToken).shaped.<>({r=>import r._; _1.map(_=> DeviceTokensRow.tupled((_1.get, _2.get, _3)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column DEVICE_TOKEN_ID SqlType(INTEGER), AutoInc, PrimaryKey */
    val deviceTokenId: Rep[Int] = column[Int]("DEVICE_TOKEN_ID", O.AutoInc, O.PrimaryKey)
    /** Database column USER_ID SqlType(INTEGER) */
    val userId: Rep[Int] = column[Int]("USER_ID")
    /** Database column DEVICE_TOKEN SqlType(VARCHAR), Default(None) */
    val deviceToken: Rep[Option[String]] = column[Option[String]]("DEVICE_TOKEN", O.Default(None))

    /** Foreign key referencing UserAccounts (database name DEVICE_TOKENS_TO_USER_FK) */
    lazy val userAccountsFk = foreignKey("DEVICE_TOKENS_TO_USER_FK", userId, UserAccounts)(r => r.userAccountId, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
  }
  /** Collection-like TableQuery object for table DeviceTokens */
  lazy val DeviceTokens = new TableQuery(tag => new DeviceTokens(tag))

  /** Entity class storing rows of table Images
   *  @param imageId Database column IMAGE_ID SqlType(VARCHAR), PrimaryKey
   *  @param externalId Database column EXTERNAL_ID SqlType(VARCHAR)
   *  @param location Database column LOCATION SqlType(VARCHAR) */
  case class ImagesRow(imageId: String, externalId: String, location: String)
  /** GetResult implicit for fetching ImagesRow objects using plain SQL queries */
  implicit def GetResultImagesRow(implicit e0: GR[String]): GR[ImagesRow] = GR{
    prs => import prs._
    ImagesRow.tupled((<<[String], <<[String], <<[String]))
  }
  /** Table description of table IMAGES. Objects of this class serve as prototypes for rows in queries. */
  class Images(_tableTag: Tag) extends Table[ImagesRow](_tableTag, Some("BEE"), "IMAGES") {
    def * = (imageId, externalId, location) <> (ImagesRow.tupled, ImagesRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (Rep.Some(imageId), Rep.Some(externalId), Rep.Some(location)).shaped.<>({r=>import r._; _1.map(_=> ImagesRow.tupled((_1.get, _2.get, _3.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column IMAGE_ID SqlType(VARCHAR), PrimaryKey */
    val imageId: Rep[String] = column[String]("IMAGE_ID", O.PrimaryKey)
    /** Database column EXTERNAL_ID SqlType(VARCHAR) */
    val externalId: Rep[String] = column[String]("EXTERNAL_ID")
    /** Database column LOCATION SqlType(VARCHAR) */
    val location: Rep[String] = column[String]("LOCATION")
  }
  /** Collection-like TableQuery object for table Images */
  lazy val Images = new TableQuery(tag => new Images(tag))

  /** Entity class storing rows of table ImageSources
   *  @param imageSourceId Database column IMAGE_SOURCE_ID SqlType(INTEGER), AutoInc, PrimaryKey
   *  @param taskId Database column TASK_ID SqlType(INTEGER)
   *  @param imageSourceName Database column IMAGE_SOURCE_NAME SqlType(VARCHAR)
   *  @param imageSourceType Database column IMAGE_SOURCE_TYPE SqlType(VARCHAR)
   *  @param imageSourceConfigs Database column IMAGE_SOURCE_CONFIGS SqlType(VARCHAR) */
  case class ImageSourcesRow(imageSourceId: Int, taskId: Int, imageSourceName: String, imageSourceType: String, imageSourceConfigs: String)
  /** GetResult implicit for fetching ImageSourcesRow objects using plain SQL queries */
  implicit def GetResultImageSourcesRow(implicit e0: GR[Int], e1: GR[String]): GR[ImageSourcesRow] = GR{
    prs => import prs._
    ImageSourcesRow.tupled((<<[Int], <<[Int], <<[String], <<[String], <<[String]))
  }
  /** Table description of table IMAGE_SOURCES. Objects of this class serve as prototypes for rows in queries. */
  class ImageSources(_tableTag: Tag) extends Table[ImageSourcesRow](_tableTag, Some("BEE"), "IMAGE_SOURCES") {
    def * = (imageSourceId, taskId, imageSourceName, imageSourceType, imageSourceConfigs) <> (ImageSourcesRow.tupled, ImageSourcesRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (Rep.Some(imageSourceId), Rep.Some(taskId), Rep.Some(imageSourceName), Rep.Some(imageSourceType), Rep.Some(imageSourceConfigs)).shaped.<>({r=>import r._; _1.map(_=> ImageSourcesRow.tupled((_1.get, _2.get, _3.get, _4.get, _5.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column IMAGE_SOURCE_ID SqlType(INTEGER), AutoInc, PrimaryKey */
    val imageSourceId: Rep[Int] = column[Int]("IMAGE_SOURCE_ID", O.AutoInc, O.PrimaryKey)
    /** Database column TASK_ID SqlType(INTEGER) */
    val taskId: Rep[Int] = column[Int]("TASK_ID")
    /** Database column IMAGE_SOURCE_NAME SqlType(VARCHAR) */
    val imageSourceName: Rep[String] = column[String]("IMAGE_SOURCE_NAME")
    /** Database column IMAGE_SOURCE_TYPE SqlType(VARCHAR) */
    val imageSourceType: Rep[String] = column[String]("IMAGE_SOURCE_TYPE")
    /** Database column IMAGE_SOURCE_CONFIGS SqlType(VARCHAR) */
    val imageSourceConfigs: Rep[String] = column[String]("IMAGE_SOURCE_CONFIGS")

    /** Foreign key referencing Tasks (database name IMAGE_SOURCE_TO_TASK_FK) */
    lazy val tasksFk = foreignKey("IMAGE_SOURCE_TO_TASK_FK", taskId, Tasks)(r => r.taskId, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
  }
  /** Collection-like TableQuery object for table ImageSources */
  lazy val ImageSources = new TableQuery(tag => new ImageSources(tag))

  /** Entity class storing rows of table ImageToImageSourceRelations
   *  @param imageToImageSourceRelationId Database column IMAGE_TO_IMAGE_SOURCE_RELATION_ID SqlType(VARCHAR), PrimaryKey
   *  @param imageId Database column IMAGE_ID SqlType(VARCHAR)
   *  @param imageSourceId Database column IMAGE_SOURCE_ID SqlType(INTEGER) */
  case class ImageToImageSourceRelationsRow(imageToImageSourceRelationId: String, imageId: String, imageSourceId: Int)
  /** GetResult implicit for fetching ImageToImageSourceRelationsRow objects using plain SQL queries */
  implicit def GetResultImageToImageSourceRelationsRow(implicit e0: GR[String], e1: GR[Int]): GR[ImageToImageSourceRelationsRow] = GR{
    prs => import prs._
    ImageToImageSourceRelationsRow.tupled((<<[String], <<[String], <<[Int]))
  }
  /** Table description of table IMAGE_TO_IMAGE_SOURCE_RELATIONS. Objects of this class serve as prototypes for rows in queries. */
  class ImageToImageSourceRelations(_tableTag: Tag) extends Table[ImageToImageSourceRelationsRow](_tableTag, Some("BEE"), "IMAGE_TO_IMAGE_SOURCE_RELATIONS") {
    def * = (imageToImageSourceRelationId, imageId, imageSourceId) <> (ImageToImageSourceRelationsRow.tupled, ImageToImageSourceRelationsRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (Rep.Some(imageToImageSourceRelationId), Rep.Some(imageId), Rep.Some(imageSourceId)).shaped.<>({r=>import r._; _1.map(_=> ImageToImageSourceRelationsRow.tupled((_1.get, _2.get, _3.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column IMAGE_TO_IMAGE_SOURCE_RELATION_ID SqlType(VARCHAR), PrimaryKey */
    val imageToImageSourceRelationId: Rep[String] = column[String]("IMAGE_TO_IMAGE_SOURCE_RELATION_ID", O.PrimaryKey)
    /** Database column IMAGE_ID SqlType(VARCHAR) */
    val imageId: Rep[String] = column[String]("IMAGE_ID")
    /** Database column IMAGE_SOURCE_ID SqlType(INTEGER) */
    val imageSourceId: Rep[Int] = column[Int]("IMAGE_SOURCE_ID")

    /** Foreign key referencing Images (database name IMAGE_TO_IMAGE_SOURCE_RELATION_TO_IMAGES_FK) */
    lazy val imagesFk = foreignKey("IMAGE_TO_IMAGE_SOURCE_RELATION_TO_IMAGES_FK", imageId, Images)(r => r.imageId, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
    /** Foreign key referencing Tasks (database name IMAGE_TO_IMAGE_SOURCE_RELATION_TO_IMAGE_SOURCE_FK) */
    lazy val tasksFk = foreignKey("IMAGE_TO_IMAGE_SOURCE_RELATION_TO_IMAGE_SOURCE_FK", imageSourceId, Tasks)(r => r.taskId, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
  }
  /** Collection-like TableQuery object for table ImageToImageSourceRelations */
  lazy val ImageToImageSourceRelations = new TableQuery(tag => new ImageToImageSourceRelations(tag))

  /** Entity class storing rows of table ImageViews
   *  @param imageViewId Database column IMAGE_VIEW_ID SqlType(VARCHAR), PrimaryKey
   *  @param participantId Database column PARTICIPANT_ID SqlType(INTEGER)
   *  @param imageId Database column IMAGE_ID SqlType(VARCHAR)
   *  @param ontologyVersionId Database column ONTOLOGY_VERSION_ID SqlType(INTEGER)
   *  @param createdMillis Database column CREATED_MILLIS SqlType(BIGINT) */
  case class ImageViewsRow(imageViewId: String, participantId: Int, imageId: String, ontologyVersionId: Int, createdMillis: Long)
  /** GetResult implicit for fetching ImageViewsRow objects using plain SQL queries */
  implicit def GetResultImageViewsRow(implicit e0: GR[String], e1: GR[Int], e2: GR[Long]): GR[ImageViewsRow] = GR{
    prs => import prs._
    ImageViewsRow.tupled((<<[String], <<[Int], <<[String], <<[Int], <<[Long]))
  }
  /** Table description of table IMAGE_VIEWS. Objects of this class serve as prototypes for rows in queries. */
  class ImageViews(_tableTag: Tag) extends Table[ImageViewsRow](_tableTag, Some("BEE"), "IMAGE_VIEWS") {
    def * = (imageViewId, participantId, imageId, ontologyVersionId, createdMillis) <> (ImageViewsRow.tupled, ImageViewsRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (Rep.Some(imageViewId), Rep.Some(participantId), Rep.Some(imageId), Rep.Some(ontologyVersionId), Rep.Some(createdMillis)).shaped.<>({r=>import r._; _1.map(_=> ImageViewsRow.tupled((_1.get, _2.get, _3.get, _4.get, _5.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column IMAGE_VIEW_ID SqlType(VARCHAR), PrimaryKey */
    val imageViewId: Rep[String] = column[String]("IMAGE_VIEW_ID", O.PrimaryKey)
    /** Database column PARTICIPANT_ID SqlType(INTEGER) */
    val participantId: Rep[Int] = column[Int]("PARTICIPANT_ID")
    /** Database column IMAGE_ID SqlType(VARCHAR) */
    val imageId: Rep[String] = column[String]("IMAGE_ID")
    /** Database column ONTOLOGY_VERSION_ID SqlType(INTEGER) */
    val ontologyVersionId: Rep[Int] = column[Int]("ONTOLOGY_VERSION_ID")
    /** Database column CREATED_MILLIS SqlType(BIGINT) */
    val createdMillis: Rep[Long] = column[Long]("CREATED_MILLIS")

    /** Foreign key referencing Images (database name IMAGE_VIEW_TO_IMAGES_FK) */
    lazy val imagesFk = foreignKey("IMAGE_VIEW_TO_IMAGES_FK", imageId, Images)(r => r.imageId, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
    /** Foreign key referencing OntologyVersions (database name IMAGE_VIEW_TO_ONTOLOGY_VERSIONS_FK) */
    lazy val ontologyVersionsFk = foreignKey("IMAGE_VIEW_TO_ONTOLOGY_VERSIONS_FK", ontologyVersionId, OntologyVersions)(r => r.ontologyVersionId, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
    /** Foreign key referencing Participants (database name IMAGE_VIEW_TO_PARTICIPANTS_FK) */
    lazy val participantsFk = foreignKey("IMAGE_VIEW_TO_PARTICIPANTS_FK", participantId, Participants)(r => r.participantId, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
  }
  /** Collection-like TableQuery object for table ImageViews */
  lazy val ImageViews = new TableQuery(tag => new ImageViews(tag))

  /** Entity class storing rows of table Invitations
   *  @param invitationId Database column INVITATION_ID SqlType(VARCHAR), PrimaryKey
   *  @param taskId Database column TASK_ID SqlType(INTEGER)
   *  @param createdMillis Database column CREATED_MILLIS SqlType(BIGINT) */
  case class InvitationsRow(invitationId: String, taskId: Int, createdMillis: Long)
  /** GetResult implicit for fetching InvitationsRow objects using plain SQL queries */
  implicit def GetResultInvitationsRow(implicit e0: GR[String], e1: GR[Int], e2: GR[Long]): GR[InvitationsRow] = GR{
    prs => import prs._
    InvitationsRow.tupled((<<[String], <<[Int], <<[Long]))
  }
  /** Table description of table INVITATIONS. Objects of this class serve as prototypes for rows in queries. */
  class Invitations(_tableTag: Tag) extends Table[InvitationsRow](_tableTag, Some("BEE"), "INVITATIONS") {
    def * = (invitationId, taskId, createdMillis) <> (InvitationsRow.tupled, InvitationsRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (Rep.Some(invitationId), Rep.Some(taskId), Rep.Some(createdMillis)).shaped.<>({r=>import r._; _1.map(_=> InvitationsRow.tupled((_1.get, _2.get, _3.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column INVITATION_ID SqlType(VARCHAR), PrimaryKey */
    val invitationId: Rep[String] = column[String]("INVITATION_ID", O.PrimaryKey)
    /** Database column TASK_ID SqlType(INTEGER) */
    val taskId: Rep[Int] = column[Int]("TASK_ID")
    /** Database column CREATED_MILLIS SqlType(BIGINT) */
    val createdMillis: Rep[Long] = column[Long]("CREATED_MILLIS")

    /** Foreign key referencing Tasks (database name INVITATION_TO_TASKS_FK) */
    lazy val tasksFk = foreignKey("INVITATION_TO_TASKS_FK", taskId, Tasks)(r => r.taskId, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
  }
  /** Collection-like TableQuery object for table Invitations */
  lazy val Invitations = new TableQuery(tag => new Invitations(tag))

  /** Entity class storing rows of table Labels
   *  @param labelId Database column LABEL_ID SqlType(VARCHAR), PrimaryKey
   *  @param participantId Database column PARTICIPANT_ID SqlType(INTEGER)
   *  @param imageId Database column IMAGE_ID SqlType(VARCHAR)
   *  @param ontologyVersionId Database column ONTOLOGY_VERSION_ID SqlType(INTEGER)
   *  @param ontology Database column ONTOLOGY SqlType(VARCHAR)
   *  @param ontologyType Database column ONTOLOGY_TYPE SqlType(VARCHAR)
   *  @param labelValue Database column LABEL_VALUE SqlType(DOUBLE)
   *  @param xCoordinate Database column X_COORDINATE SqlType(DOUBLE), Default(None)
   *  @param yCoordinate Database column Y_COORDINATE SqlType(DOUBLE), Default(None)
   *  @param width Database column WIDTH SqlType(DOUBLE), Default(None)
   *  @param height Database column HEIGHT SqlType(DOUBLE), Default(None)
   *  @param point1X Database column POINT_1_X SqlType(DOUBLE), Default(None)
   *  @param point1Y Database column POINT_1_Y SqlType(DOUBLE), Default(None)
   *  @param point2X Database column POINT_2_X SqlType(DOUBLE), Default(None)
   *  @param point2Y Database column POINT_2_Y SqlType(DOUBLE), Default(None)
   *  @param createdMillis Database column CREATED_MILLIS SqlType(BIGINT) */
  case class LabelsRow(labelId: String, participantId: Int, imageId: String, ontologyVersionId: Int, ontology: String, ontologyType: String, labelValue: Double, xCoordinate: Option[Double] = None, yCoordinate: Option[Double] = None, width: Option[Double] = None, height: Option[Double] = None, point1X: Option[Double] = None, point1Y: Option[Double] = None, point2X: Option[Double] = None, point2Y: Option[Double] = None, createdMillis: Long)
  /** GetResult implicit for fetching LabelsRow objects using plain SQL queries */
  implicit def GetResultLabelsRow(implicit e0: GR[String], e1: GR[Int], e2: GR[Double], e3: GR[Option[Double]], e4: GR[Long]): GR[LabelsRow] = GR{
    prs => import prs._
    LabelsRow.tupled((<<[String], <<[Int], <<[String], <<[Int], <<[String], <<[String], <<[Double], <<?[Double], <<?[Double], <<?[Double], <<?[Double], <<?[Double], <<?[Double], <<?[Double], <<?[Double], <<[Long]))
  }
  /** Table description of table LABELS. Objects of this class serve as prototypes for rows in queries. */
  class Labels(_tableTag: Tag) extends Table[LabelsRow](_tableTag, Some("BEE"), "LABELS") {
    def * = (labelId, participantId, imageId, ontologyVersionId, ontology, ontologyType, labelValue, xCoordinate, yCoordinate, width, height, point1X, point1Y, point2X, point2Y, createdMillis) <> (LabelsRow.tupled, LabelsRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (Rep.Some(labelId), Rep.Some(participantId), Rep.Some(imageId), Rep.Some(ontologyVersionId), Rep.Some(ontology), Rep.Some(ontologyType), Rep.Some(labelValue), xCoordinate, yCoordinate, width, height, point1X, point1Y, point2X, point2Y, Rep.Some(createdMillis)).shaped.<>({r=>import r._; _1.map(_=> LabelsRow.tupled((_1.get, _2.get, _3.get, _4.get, _5.get, _6.get, _7.get, _8, _9, _10, _11, _12, _13, _14, _15, _16.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column LABEL_ID SqlType(VARCHAR), PrimaryKey */
    val labelId: Rep[String] = column[String]("LABEL_ID", O.PrimaryKey)
    /** Database column PARTICIPANT_ID SqlType(INTEGER) */
    val participantId: Rep[Int] = column[Int]("PARTICIPANT_ID")
    /** Database column IMAGE_ID SqlType(VARCHAR) */
    val imageId: Rep[String] = column[String]("IMAGE_ID")
    /** Database column ONTOLOGY_VERSION_ID SqlType(INTEGER) */
    val ontologyVersionId: Rep[Int] = column[Int]("ONTOLOGY_VERSION_ID")
    /** Database column ONTOLOGY SqlType(VARCHAR) */
    val ontology: Rep[String] = column[String]("ONTOLOGY")
    /** Database column ONTOLOGY_TYPE SqlType(VARCHAR) */
    val ontologyType: Rep[String] = column[String]("ONTOLOGY_TYPE")
    /** Database column LABEL_VALUE SqlType(DOUBLE) */
    val labelValue: Rep[Double] = column[Double]("LABEL_VALUE")
    /** Database column X_COORDINATE SqlType(DOUBLE), Default(None) */
    val xCoordinate: Rep[Option[Double]] = column[Option[Double]]("X_COORDINATE", O.Default(None))
    /** Database column Y_COORDINATE SqlType(DOUBLE), Default(None) */
    val yCoordinate: Rep[Option[Double]] = column[Option[Double]]("Y_COORDINATE", O.Default(None))
    /** Database column WIDTH SqlType(DOUBLE), Default(None) */
    val width: Rep[Option[Double]] = column[Option[Double]]("WIDTH", O.Default(None))
    /** Database column HEIGHT SqlType(DOUBLE), Default(None) */
    val height: Rep[Option[Double]] = column[Option[Double]]("HEIGHT", O.Default(None))
    /** Database column POINT_1_X SqlType(DOUBLE), Default(None) */
    val point1X: Rep[Option[Double]] = column[Option[Double]]("POINT_1_X", O.Default(None))
    /** Database column POINT_1_Y SqlType(DOUBLE), Default(None) */
    val point1Y: Rep[Option[Double]] = column[Option[Double]]("POINT_1_Y", O.Default(None))
    /** Database column POINT_2_X SqlType(DOUBLE), Default(None) */
    val point2X: Rep[Option[Double]] = column[Option[Double]]("POINT_2_X", O.Default(None))
    /** Database column POINT_2_Y SqlType(DOUBLE), Default(None) */
    val point2Y: Rep[Option[Double]] = column[Option[Double]]("POINT_2_Y", O.Default(None))
    /** Database column CREATED_MILLIS SqlType(BIGINT) */
    val createdMillis: Rep[Long] = column[Long]("CREATED_MILLIS")

    /** Foreign key referencing Images (database name LABEL_TO_IMAGES_FK) */
    lazy val imagesFk = foreignKey("LABEL_TO_IMAGES_FK", imageId, Images)(r => r.imageId, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
    /** Foreign key referencing OntologyVersions (database name LABEL_TO_ONTOLOGY_VERSIONS) */
    lazy val ontologyVersionsFk = foreignKey("LABEL_TO_ONTOLOGY_VERSIONS", ontologyVersionId, OntologyVersions)(r => r.ontologyVersionId, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
    /** Foreign key referencing Participants (database name LABEL_TO_PARTICIPANTS_FK) */
    lazy val participantsFk = foreignKey("LABEL_TO_PARTICIPANTS_FK", participantId, Participants)(r => r.participantId, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
  }
  /** Collection-like TableQuery object for table Labels */
  lazy val Labels = new TableQuery(tag => new Labels(tag))

  /** Entity class storing rows of table Migrations
   *  @param migrationId Database column MIGRATION_ID SqlType(INTEGER), PrimaryKey */
  case class MigrationsRow(migrationId: Int)
  /** GetResult implicit for fetching MigrationsRow objects using plain SQL queries */
  implicit def GetResultMigrationsRow(implicit e0: GR[Int]): GR[MigrationsRow] = GR{
    prs => import prs._
    MigrationsRow(<<[Int])
  }
  /** Table description of table MIGRATIONS. Objects of this class serve as prototypes for rows in queries. */
  class Migrations(_tableTag: Tag) extends Table[MigrationsRow](_tableTag, Some("BEE"), "MIGRATIONS") {
    def * = migrationId <> (MigrationsRow, MigrationsRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = Rep.Some(migrationId).shaped.<>(r => r.map(_=> MigrationsRow(r.get)), (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column MIGRATION_ID SqlType(INTEGER), PrimaryKey */
    val migrationId: Rep[Int] = column[Int]("MIGRATION_ID", O.PrimaryKey)
  }
  /** Collection-like TableQuery object for table Migrations */
  lazy val Migrations = new TableQuery(tag => new Migrations(tag))

  /** Entity class storing rows of table OntologyVersions
   *  @param ontologyVersionId Database column ONTOLOGY_VERSION_ID SqlType(INTEGER), AutoInc, PrimaryKey
   *  @param ontologyName Database column ONTOLOGY_NAME SqlType(VARCHAR)
   *  @param versionString Database column VERSION_STRING SqlType(VARCHAR)
   *  @param orderValue Database column ORDER_VALUE SqlType(INTEGER)
   *  @param taskId Database column TASK_ID SqlType(INTEGER)
   *  @param ontologyType Database column ONTOLOGY_TYPE SqlType(VARCHAR)
   *  @param minValue Database column MIN_VALUE SqlType(DOUBLE), Default(None)
   *  @param maxValue Database column MAX_VALUE SqlType(DOUBLE), Default(None)
   *  @param isAreaLabel Database column IS_AREA_LABEL SqlType(BOOLEAN)
   *  @param isLengthLabel Database column IS_LENGTH_LABEL SqlType(BOOLEAN)
   *  @param labelLimit Database column LABEL_LIMIT SqlType(INTEGER)
   *  @param createdMillis Database column CREATED_MILLIS SqlType(BIGINT) */
  case class OntologyVersionsRow(ontologyVersionId: Int, ontologyName: String, versionString: String, orderValue: Int, taskId: Int, ontologyType: String, minValue: Option[Double] = None, maxValue: Option[Double] = None, isAreaLabel: Boolean, isLengthLabel: Boolean, labelLimit: Int, createdMillis: Long)
  /** GetResult implicit for fetching OntologyVersionsRow objects using plain SQL queries */
  implicit def GetResultOntologyVersionsRow(implicit e0: GR[Int], e1: GR[String], e2: GR[Option[Double]], e3: GR[Boolean], e4: GR[Long]): GR[OntologyVersionsRow] = GR{
    prs => import prs._
    OntologyVersionsRow.tupled((<<[Int], <<[String], <<[String], <<[Int], <<[Int], <<[String], <<?[Double], <<?[Double], <<[Boolean], <<[Boolean], <<[Int], <<[Long]))
  }
  /** Table description of table ONTOLOGY_VERSIONS. Objects of this class serve as prototypes for rows in queries. */
  class OntologyVersions(_tableTag: Tag) extends Table[OntologyVersionsRow](_tableTag, Some("BEE"), "ONTOLOGY_VERSIONS") {
    def * = (ontologyVersionId, ontologyName, versionString, orderValue, taskId, ontologyType, minValue, maxValue, isAreaLabel, isLengthLabel, labelLimit, createdMillis) <> (OntologyVersionsRow.tupled, OntologyVersionsRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (Rep.Some(ontologyVersionId), Rep.Some(ontologyName), Rep.Some(versionString), Rep.Some(orderValue), Rep.Some(taskId), Rep.Some(ontologyType), minValue, maxValue, Rep.Some(isAreaLabel), Rep.Some(isLengthLabel), Rep.Some(labelLimit), Rep.Some(createdMillis)).shaped.<>({r=>import r._; _1.map(_=> OntologyVersionsRow.tupled((_1.get, _2.get, _3.get, _4.get, _5.get, _6.get, _7, _8, _9.get, _10.get, _11.get, _12.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column ONTOLOGY_VERSION_ID SqlType(INTEGER), AutoInc, PrimaryKey */
    val ontologyVersionId: Rep[Int] = column[Int]("ONTOLOGY_VERSION_ID", O.AutoInc, O.PrimaryKey)
    /** Database column ONTOLOGY_NAME SqlType(VARCHAR) */
    val ontologyName: Rep[String] = column[String]("ONTOLOGY_NAME")
    /** Database column VERSION_STRING SqlType(VARCHAR) */
    val versionString: Rep[String] = column[String]("VERSION_STRING")
    /** Database column ORDER_VALUE SqlType(INTEGER) */
    val orderValue: Rep[Int] = column[Int]("ORDER_VALUE")
    /** Database column TASK_ID SqlType(INTEGER) */
    val taskId: Rep[Int] = column[Int]("TASK_ID")
    /** Database column ONTOLOGY_TYPE SqlType(VARCHAR) */
    val ontologyType: Rep[String] = column[String]("ONTOLOGY_TYPE")
    /** Database column MIN_VALUE SqlType(DOUBLE), Default(None) */
    val minValue: Rep[Option[Double]] = column[Option[Double]]("MIN_VALUE", O.Default(None))
    /** Database column MAX_VALUE SqlType(DOUBLE), Default(None) */
    val maxValue: Rep[Option[Double]] = column[Option[Double]]("MAX_VALUE", O.Default(None))
    /** Database column IS_AREA_LABEL SqlType(BOOLEAN) */
    val isAreaLabel: Rep[Boolean] = column[Boolean]("IS_AREA_LABEL")
    /** Database column IS_LENGTH_LABEL SqlType(BOOLEAN) */
    val isLengthLabel: Rep[Boolean] = column[Boolean]("IS_LENGTH_LABEL")
    /** Database column LABEL_LIMIT SqlType(INTEGER) */
    val labelLimit: Rep[Int] = column[Int]("LABEL_LIMIT")
    /** Database column CREATED_MILLIS SqlType(BIGINT) */
    val createdMillis: Rep[Long] = column[Long]("CREATED_MILLIS")

    /** Foreign key referencing Tasks (database name ONTOLOGY_VERSION_TO_TASKS_FK) */
    lazy val tasksFk = foreignKey("ONTOLOGY_VERSION_TO_TASKS_FK", taskId, Tasks)(r => r.taskId, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
  }
  /** Collection-like TableQuery object for table OntologyVersions */
  lazy val OntologyVersions = new TableQuery(tag => new OntologyVersions(tag))

  /** Entity class storing rows of table Participants
   *  @param participantId Database column PARTICIPANT_ID SqlType(INTEGER), AutoInc, PrimaryKey
   *  @param taskId Database column TASK_ID SqlType(INTEGER)
   *  @param userId Database column USER_ID SqlType(INTEGER)
   *  @param isActive Database column IS_ACTIVE SqlType(BOOLEAN) */
  case class ParticipantsRow(participantId: Int, taskId: Int, userId: Int, isActive: Boolean)
  /** GetResult implicit for fetching ParticipantsRow objects using plain SQL queries */
  implicit def GetResultParticipantsRow(implicit e0: GR[Int], e1: GR[Boolean]): GR[ParticipantsRow] = GR{
    prs => import prs._
    ParticipantsRow.tupled((<<[Int], <<[Int], <<[Int], <<[Boolean]))
  }
  /** Table description of table PARTICIPANTS. Objects of this class serve as prototypes for rows in queries. */
  class Participants(_tableTag: Tag) extends Table[ParticipantsRow](_tableTag, Some("BEE"), "PARTICIPANTS") {
    def * = (participantId, taskId, userId, isActive) <> (ParticipantsRow.tupled, ParticipantsRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (Rep.Some(participantId), Rep.Some(taskId), Rep.Some(userId), Rep.Some(isActive)).shaped.<>({r=>import r._; _1.map(_=> ParticipantsRow.tupled((_1.get, _2.get, _3.get, _4.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column PARTICIPANT_ID SqlType(INTEGER), AutoInc, PrimaryKey */
    val participantId: Rep[Int] = column[Int]("PARTICIPANT_ID", O.AutoInc, O.PrimaryKey)
    /** Database column TASK_ID SqlType(INTEGER) */
    val taskId: Rep[Int] = column[Int]("TASK_ID")
    /** Database column USER_ID SqlType(INTEGER) */
    val userId: Rep[Int] = column[Int]("USER_ID")
    /** Database column IS_ACTIVE SqlType(BOOLEAN) */
    val isActive: Rep[Boolean] = column[Boolean]("IS_ACTIVE")

    /** Foreign key referencing Tasks (database name PARTICIPANT_TO_TASKS_FK) */
    lazy val tasksFk = foreignKey("PARTICIPANT_TO_TASKS_FK", taskId, Tasks)(r => r.taskId, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
    /** Foreign key referencing UserAccounts (database name PARTICIPANT_TO_USERS_FK) */
    lazy val userAccountsFk = foreignKey("PARTICIPANT_TO_USERS_FK", userId, UserAccounts)(r => r.userAccountId, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
  }
  /** Collection-like TableQuery object for table Participants */
  lazy val Participants = new TableQuery(tag => new Participants(tag))

  /** Entity class storing rows of table Tasks
   *  @param taskId Database column TASK_ID SqlType(INTEGER), AutoInc, PrimaryKey
   *  @param taskName Database column TASK_NAME SqlType(VARCHAR)
   *  @param creatorUserId Database column CREATOR_USER_ID SqlType(INTEGER)
   *  @param createdMillis Database column CREATED_MILLIS SqlType(BIGINT) */
  case class TasksRow(taskId: Int, taskName: String, creatorUserId: Int, createdMillis: Long)
  /** GetResult implicit for fetching TasksRow objects using plain SQL queries */
  implicit def GetResultTasksRow(implicit e0: GR[Int], e1: GR[String], e2: GR[Long]): GR[TasksRow] = GR{
    prs => import prs._
    TasksRow.tupled((<<[Int], <<[String], <<[Int], <<[Long]))
  }
  /** Table description of table TASKS. Objects of this class serve as prototypes for rows in queries. */
  class Tasks(_tableTag: Tag) extends Table[TasksRow](_tableTag, Some("BEE"), "TASKS") {
    def * = (taskId, taskName, creatorUserId, createdMillis) <> (TasksRow.tupled, TasksRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (Rep.Some(taskId), Rep.Some(taskName), Rep.Some(creatorUserId), Rep.Some(createdMillis)).shaped.<>({r=>import r._; _1.map(_=> TasksRow.tupled((_1.get, _2.get, _3.get, _4.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column TASK_ID SqlType(INTEGER), AutoInc, PrimaryKey */
    val taskId: Rep[Int] = column[Int]("TASK_ID", O.AutoInc, O.PrimaryKey)
    /** Database column TASK_NAME SqlType(VARCHAR) */
    val taskName: Rep[String] = column[String]("TASK_NAME")
    /** Database column CREATOR_USER_ID SqlType(INTEGER) */
    val creatorUserId: Rep[Int] = column[Int]("CREATOR_USER_ID")
    /** Database column CREATED_MILLIS SqlType(BIGINT) */
    val createdMillis: Rep[Long] = column[Long]("CREATED_MILLIS")

    /** Foreign key referencing UserAccounts (database name TASK_TO_USERS_FK) */
    lazy val userAccountsFk = foreignKey("TASK_TO_USERS_FK", creatorUserId, UserAccounts)(r => r.userAccountId, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
  }
  /** Collection-like TableQuery object for table Tasks */
  lazy val Tasks = new TableQuery(tag => new Tasks(tag))

  /** Entity class storing rows of table UserAccounts
   *  @param userAccountId Database column USER_ACCOUNT_ID SqlType(INTEGER), AutoInc, PrimaryKey
   *  @param email Database column EMAIL SqlType(VARCHAR)
   *  @param hashedPassword Database column HASHED_PASSWORD SqlType(VARCHAR) */
  case class UserAccountsRow(userAccountId: Int, email: String, hashedPassword: String)
  /** GetResult implicit for fetching UserAccountsRow objects using plain SQL queries */
  implicit def GetResultUserAccountsRow(implicit e0: GR[Int], e1: GR[String]): GR[UserAccountsRow] = GR{
    prs => import prs._
    UserAccountsRow.tupled((<<[Int], <<[String], <<[String]))
  }
  /** Table description of table USER_ACCOUNTS. Objects of this class serve as prototypes for rows in queries. */
  class UserAccounts(_tableTag: Tag) extends Table[UserAccountsRow](_tableTag, Some("BEE"), "USER_ACCOUNTS") {
    def * = (userAccountId, email, hashedPassword) <> (UserAccountsRow.tupled, UserAccountsRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (Rep.Some(userAccountId), Rep.Some(email), Rep.Some(hashedPassword)).shaped.<>({r=>import r._; _1.map(_=> UserAccountsRow.tupled((_1.get, _2.get, _3.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column USER_ACCOUNT_ID SqlType(INTEGER), AutoInc, PrimaryKey */
    val userAccountId: Rep[Int] = column[Int]("USER_ACCOUNT_ID", O.AutoInc, O.PrimaryKey)
    /** Database column EMAIL SqlType(VARCHAR) */
    val email: Rep[String] = column[String]("EMAIL")
    /** Database column HASHED_PASSWORD SqlType(VARCHAR) */
    val hashedPassword: Rep[String] = column[String]("HASHED_PASSWORD")
  }
  /** Collection-like TableQuery object for table UserAccounts */
  lazy val UserAccounts = new TableQuery(tag => new UserAccounts(tag))

  /** Entity class storing rows of table UserConnections
   *  @param userConnectionId Database column USER_CONNECTION_ID SqlType(INTEGER), AutoInc, PrimaryKey
   *  @param senderUserId Database column SENDER_USER_ID SqlType(INTEGER)
   *  @param receiverUserId Database column RECEIVER_USER_ID SqlType(INTEGER) */
  case class UserConnectionsRow(userConnectionId: Int, senderUserId: Int, receiverUserId: Int)
  /** GetResult implicit for fetching UserConnectionsRow objects using plain SQL queries */
  implicit def GetResultUserConnectionsRow(implicit e0: GR[Int]): GR[UserConnectionsRow] = GR{
    prs => import prs._
    UserConnectionsRow.tupled((<<[Int], <<[Int], <<[Int]))
  }
  /** Table description of table USER_CONNECTIONS. Objects of this class serve as prototypes for rows in queries. */
  class UserConnections(_tableTag: Tag) extends Table[UserConnectionsRow](_tableTag, Some("BEE"), "USER_CONNECTIONS") {
    def * = (userConnectionId, senderUserId, receiverUserId) <> (UserConnectionsRow.tupled, UserConnectionsRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (Rep.Some(userConnectionId), Rep.Some(senderUserId), Rep.Some(receiverUserId)).shaped.<>({r=>import r._; _1.map(_=> UserConnectionsRow.tupled((_1.get, _2.get, _3.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column USER_CONNECTION_ID SqlType(INTEGER), AutoInc, PrimaryKey */
    val userConnectionId: Rep[Int] = column[Int]("USER_CONNECTION_ID", O.AutoInc, O.PrimaryKey)
    /** Database column SENDER_USER_ID SqlType(INTEGER) */
    val senderUserId: Rep[Int] = column[Int]("SENDER_USER_ID")
    /** Database column RECEIVER_USER_ID SqlType(INTEGER) */
    val receiverUserId: Rep[Int] = column[Int]("RECEIVER_USER_ID")

    /** Foreign key referencing UserAccounts (database name USER_CONNECTIONS_RECEIVER_TO_USERS_FK) */
    lazy val userAccountsFk1 = foreignKey("USER_CONNECTIONS_RECEIVER_TO_USERS_FK", receiverUserId, UserAccounts)(r => r.userAccountId, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
    /** Foreign key referencing UserAccounts (database name USER_CONNECTIONS_SENDER_TO_USERS_FK) */
    lazy val userAccountsFk2 = foreignKey("USER_CONNECTIONS_SENDER_TO_USERS_FK", senderUserId, UserAccounts)(r => r.userAccountId, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
  }
  /** Collection-like TableQuery object for table UserConnections */
  lazy val UserConnections = new TableQuery(tag => new UserConnections(tag))

  /** Entity class storing rows of table UserSessions
   *  @param userSessionId Database column USER_SESSION_ID SqlType(INTEGER), AutoInc, PrimaryKey
   *  @param userId Database column USER_ID SqlType(INTEGER)
   *  @param hashString Database column HASH_STRING SqlType(VARCHAR) */
  case class UserSessionsRow(userSessionId: Int, userId: Int, hashString: String)
  /** GetResult implicit for fetching UserSessionsRow objects using plain SQL queries */
  implicit def GetResultUserSessionsRow(implicit e0: GR[Int], e1: GR[String]): GR[UserSessionsRow] = GR{
    prs => import prs._
    UserSessionsRow.tupled((<<[Int], <<[Int], <<[String]))
  }
  /** Table description of table USER_SESSIONS. Objects of this class serve as prototypes for rows in queries. */
  class UserSessions(_tableTag: Tag) extends Table[UserSessionsRow](_tableTag, Some("BEE"), "USER_SESSIONS") {
    def * = (userSessionId, userId, hashString) <> (UserSessionsRow.tupled, UserSessionsRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (Rep.Some(userSessionId), Rep.Some(userId), Rep.Some(hashString)).shaped.<>({r=>import r._; _1.map(_=> UserSessionsRow.tupled((_1.get, _2.get, _3.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column USER_SESSION_ID SqlType(INTEGER), AutoInc, PrimaryKey */
    val userSessionId: Rep[Int] = column[Int]("USER_SESSION_ID", O.AutoInc, O.PrimaryKey)
    /** Database column USER_ID SqlType(INTEGER) */
    val userId: Rep[Int] = column[Int]("USER_ID")
    /** Database column HASH_STRING SqlType(VARCHAR) */
    val hashString: Rep[String] = column[String]("HASH_STRING")

    /** Foreign key referencing UserAccounts (database name USER_SESSIONS_TO_USER_FK) */
    lazy val userAccountsFk = foreignKey("USER_SESSIONS_TO_USER_FK", userId, UserAccounts)(r => r.userAccountId, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Restrict)
  }
  /** Collection-like TableQuery object for table UserSessions */
  lazy val UserSessions = new TableQuery(tag => new UserSessions(tag))
}
