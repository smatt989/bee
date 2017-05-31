package com.example.app.migrations

import com.example.app.models.{Adventure, User}
import com.example.app.{AppGlobals, Tables}
import slick.driver.PostgresDriver.api._

trait Migration {

  def run: Unit
}