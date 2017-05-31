package com.example.app.models

import com.example.app.{HasUUID, SlickUUIDObject, Tables}

/**
  * Created by matt on 5/31/17.
  */
case class Invitation(id: String = null, taskId: Int, createdMillis: Long) extends HasUUID[Invitation] {
  def updateId(id: String) = this.copy(id = id)
}

object Invitation extends SlickUUIDObject[Invitation, (String, Int, Long), Tables.Invitations] {
  lazy val table = Tables.invitations

  def reify(tuple: (String, Int, Long)) =
    (apply _).tupled(tuple)
}