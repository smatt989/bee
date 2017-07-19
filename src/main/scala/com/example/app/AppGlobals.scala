package com.example.app

import java.io.File

import slick.driver.H2Driver.api._
import com.mchange.v2.c3p0.ComboPooledDataSource
import com.typesafe.config.{Config, ConfigFactory}
import org.slf4j.LoggerFactory
import slick.backend.DatabaseConfig
import slick.driver.JdbcProfile
import slick.profile.BasicProfile
import slick.util.ClassLoaderUtil

import scala.reflect.ClassTag

object AppGlobals {

  lazy val dbConfig: DatabaseConfig[JdbcProfile] = DBLauncher.dbConf
  import dbConfig.driver.api._

  lazy val db: Database = dbConfig.db
}

object DBLauncher {

  val PRODUCTION = "production"
  val environment = System.getenv("ENVIRONMENT")

  val logger = LoggerFactory.getLogger(getClass)

  val cpds = new ComboPooledDataSource
  logger.info("Created c3p0 connection pool")

  var slickDriver = "slick.driver.H2Driver$"

  if(environment == PRODUCTION){
    val DRIVER = System.getenv("DB_DRIVER")
    val DB_CONNECTION = System.getenv("JDBC_DATABASE_URL")
    val DB_USER = System.getenv("JDBC_DATABASE_USERNAME")
    val DB_PASSWORD = System.getenv("JDBC_DATABASE_PASSWORD")
    slickDriver = System.getenv("SLICK_DRIVER")
    cpds.setDriverClass(DRIVER)
    cpds.setJdbcUrl(DB_CONNECTION)
    cpds.setUser(DB_USER)
    cpds.setPassword(DB_PASSWORD)
  }

  cpds.setDataSourceName("huh?")



  // ClassLoaderUtil.defaultClassLoader.loadClass(cpds.getDriverClass).newInstance()
  val dbConf = newDbConfig[JdbcProfile](slickDriver)

  def newDbConfig[R <: BasicProfile : ClassTag](d: String): DatabaseConfig[R] = {

    println("1")

    val root = ConfigFactory.load()
    println("2")
    val untypedP =  ClassLoaderUtil.defaultClassLoader.loadClass(d).getField("MODULE$").get(null)
    println(untypedP)
    println("3")
    val r = new DatabaseConfig[R] {
      val driver: R = untypedP.asInstanceOf[R]

      import driver.api._

      lazy val db: R#Backend#Database =
        driver.api.Database.forDataSource(cpds)
        //driver.Database.forDataSource(cpds)
      //driver.backend.createDatabase(config, "c3p0").asInstanceOf[R#Backend#Database]

      println("class: "+driver.getClass)
      lazy val config: Config = ConfigFactory.parseFile(new File("src/main/resources/c3p0.properties"))
      def driverName = d.substring(0, d.length - 1)
      def driverIsObject = true
    }
    println("4")
    r
  }
}