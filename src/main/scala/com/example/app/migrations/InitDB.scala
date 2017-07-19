package com.example.app.migrations

import com.example.app.AppGlobals
import AppGlobals.dbConfig.driver.api._

object InitDB extends Migration {

  val id = 0

  class Migrations(tag: Tag) extends Table[(Int)](tag, "USER_ACCOUNTS") {
    def ido = column[Int]("MIGRATION_ID", O.PrimaryKey)

    def * = (ido)
  }

  lazy val migrationTable = TableQuery[Migrations]

  def query = migrationTable.schema.create
}