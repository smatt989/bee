package com.example.app.migrations

import com.example.app.models.User
import com.example.app.{AppGlobals, Tables}
import slick.dbio
import com.example.app.AppGlobals
import AppGlobals.dbConfig.driver.api._
import slick.profile.FixedSqlAction

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.Duration

trait Migration {

  def id: Int
  def query: DBIOAction[_, _ <: dbio.NoStream, _ <: dbio.Effect]
}

object MigrationRunner {
  def main(args: Array[String]) : Unit = {
    Migration.run
  }
}

object DBInitializer {
  def main(args: Array[String]): Unit = {
    Migration.initDB
  }
}

object Migration {

  lazy val db = AppGlobals.db

  def initDB = insertOneMigration(InitDB)

  def run = {
    val latest = latestMigrationInDB()
    migrations.drop(latest).map(f => {
      insertOneMigration(f)
    })
  }

  private[this] lazy val migrations: Seq[Migration] = Seq(
    Migration1,
    Migration2
  )

  def latestMigrationInDB() = {
    val r = Await.result(db.run(InitDB.migrationTable.result), Duration.Inf).max - 1
    System.out.println("Last migration: "+r)
    r
  }

  private[this] def insertOneMigration(m: Migration) = {
    System.out.println("Starting migration "+m.id)

    val query = m.query
    System.out.println("got query")

    val d = db

    System.out.println("got db")

    val f = d.run(query)

    System.out.println("running...")

    Await.result(f, Duration.Inf)

    System.out.println("query executed...")

    System.out.println("Updating migration table")
    val r = Await.result(d.run(InitDB.migrationTable += (m.id + 1)), Duration.Inf)
    System.out.println("Finished migration "+m.id)
    r
  }
}
