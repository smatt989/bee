package com.example.app.Routes

import com.example.app.models.{Participant, Task}
import com.example.app.{AuthenticationSupport, SlickRoutes}

/**
  * Created by matt on 6/2/17.
  */
trait ParticipantRoutes extends SlickRoutes with AuthenticationSupport {

  post("/participants/:id/deactivate") {
    contentType = formats("json")
    authenticate()

    val userId = user.id

    val participantId = {params("id")}.toInt

    val participantAuthorization = Task.authorizedToEditParticipant(userId, participantId)

    if(participantAuthorization)
      Participant.setParticipantActivation(participantId, false).map(_.toJson)
    else
      throw new Exception("Not authorized to edit participant")

  }

  post("/participants/:id/activate") {
    contentType = formats("json")
    authenticate()

    val userId = user.id

    val participantId = {params("id")}.toInt

    val participantAuthorization = Task.authorizedToEditParticipant(userId, participantId)

    if(participantAuthorization)
      Participant.setParticipantActivation(participantId, true).map(_.toJson)
    else
      throw new Exception("Not authorized to edit participant")
  }
}
