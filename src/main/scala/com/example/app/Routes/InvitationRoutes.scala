package com.example.app.Routes

import com.example.app.models.{Invitation, Task}
import com.example.app.{AuthenticationSupport, SlickRoutes}

import scala.concurrent.Await
import scala.concurrent.duration.Duration

/**
  * Created by matt on 6/2/17.
  */
trait InvitationRoutes extends SlickRoutes with AuthenticationSupport {

  post("/invitation/:invitation/accept") {
    contentType = formats("json")
    authenticate()

    val userId = user.userAccountId

    val invitation = {params("invitation")}

    val participant = Await.result(Invitation.acceptInvitation(userId, invitation), Duration.Inf)

    Task.byId(participant.taskId).map(a => Task.makeJson(a, userId))
  }
}
