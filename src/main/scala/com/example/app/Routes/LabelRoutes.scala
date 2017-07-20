package com.example.app.Routes

import com.example.app.models._
import com.example.app.{AuthenticationSupport, SlickRoutes}

import scala.concurrent.Await
import scala.concurrent.duration.Duration

/**
  * Created by matt on 6/2/17.
  */
trait LabelRoutes extends SlickRoutes with AuthenticationSupport {

  post("/labels/save") {
    contentType = formats("json")
    authenticate()

    val saveLabels = parsedBody.extract[SaveLabels]

    val authorizedParticipation = Task.authorizedToParticipateInTask(user.userAccountId, saveLabels.taskId)

    if(authorizedParticipation)
      Label.saveLabels(user.userAccountId, saveLabels).map(_.map(Label.makeJson))
    else
      throw new Exception("Not authorized to label this image")
  }

  post("/labels") {
    contentType = formats("json")
    authenticate()

    val labelRequest = parsedBody.extract[LabelRequest]

    val authorizedParticipant = Task.authorizedToParticipateInTask(user.userAccountId, labelRequest.taskId) || Task.authorizedToViewTaskDetails(user.userAccountId, labelRequest.taskId)

    val participant = Await.result(Participant.participantByUserAndTask(user.userAccountId, labelRequest.taskId), Duration.Inf)

    if(authorizedParticipant)
      Label.labelsByParticipantAndImage(participant.get.participantId, labelRequest.imageId).map(_.map(Label.makeJson))
    else
      throw new Exception("Not authorized to view labels for this image")
  }
}
