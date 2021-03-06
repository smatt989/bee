package com.example.app

import com.example.app.Routes._
import org.scalatra.{FutureSupport, ScalatraServlet}


class SlickApp() extends ScalatraServlet with FutureSupport
  with UserRoutes
  with SessionRoutes
  with AppRoutes
  with ImageRoutes
  with ImageSourceRoutes
  with InvitationRoutes
  with LabelRoutes
  with ParticipantRoutes
  with TaskRoutes {

  def db = AppGlobals.db

  lazy val realm = "rekki"

  protected implicit def executor = scala.concurrent.ExecutionContext.Implicits.global

}