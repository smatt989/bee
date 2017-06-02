package com.example.app.Routes

import com.example.app.models.{Participant, Task}
import com.example.app.{AuthenticationSupport, SlickRoutes}

/**
  * Created by matt on 6/2/17.
  */
trait ParticipantRoutes extends SlickRoutes with AuthenticationSupport {

  post("/participants/:participant-id/deactivate") {
    authenticate()

    val userId = user.id

    val participantId = {params("participant-id")}.toInt

    val participantAuthorization = Task.authorizedToEditParticipant(userId, participantId)

    if(participantAuthorization)
      Participant.setParticipantActivation(participantId, false)
    else
      throw new Exception("Not authorized to edit participant")

  }

  post("/participants/:participant-id/activate") {
    authenticate()

    val userId = user.id

    val participantId = {params("participant-id")}.toInt

    val participantAuthorization = Task.authorizedToEditParticipant(userId, participantId)

    if(participantAuthorization)
      Participant.setParticipantActivation(participantId, true)
    else
      throw new Exception("Not authorized to edit participant")
  }
}
