package com.example.app.Routes

import com.example.app.models.Invitation
import com.example.app.{AuthenticationSupport, SlickRoutes}

/**
  * Created by matt on 6/2/17.
  */
trait InvitationRoutes extends SlickRoutes with AuthenticationSupport {

  post("/invitation/:invitation/accept") {
    authenticate()

    val userId = user.id
    val invitation = {params("invitation")}

    Invitation.acceptInvitation(userId, invitation)
  }
}
