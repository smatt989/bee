package com.example.app.Routes

import com.example.app.models._
import com.example.app.{AuthenticationSupport, CSVWriter, SlickRoutes}

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

  get("/tasks/:id/labels/dump") {

    authenticate()

    val userId = user.userAccountId
    val taskId = {params("id")}.toInt

    val taskAuthorization = Task.authorizedToViewTaskDetails(userId, taskId)

    if(taskAuthorization){
      val labels = Await.result(Label.labelAndImageByTask(taskId), Duration.Inf)

      try {

        val columns = Seq(
          ("externalId", (a: ImageAndLabel) => a.image.externalId),
          ("location", (a: ImageAndLabel) => a.image.location),
          ("participantId", (a: ImageAndLabel) => a.label.participantId),
          ("ontologyType", (a: ImageAndLabel) => a.label.ontologyType),
          ("labelValue", (a: ImageAndLabel) => a.label.labelValue),
          ("createdMillis", (a: ImageAndLabel) => a.label.createdMillis),
          ("xCoordinate", (a: ImageAndLabel) => a.label.xCoordinate.getOrElse("")),
          ("yCoordinate", (a: ImageAndLabel) => a.label.yCoordinate.getOrElse("")),
          ("width", (a: ImageAndLabel) => a.label.width.getOrElse("")),
          ("height", (a: ImageAndLabel) => a.label.height.getOrElse("")),
          ("point1x", (a: ImageAndLabel) => a.label.point1X.getOrElse("")),
          ("point1y", (a: ImageAndLabel) => a.label.point1Y.getOrElse("")),
          ("point2x", (a: ImageAndLabel) => a.label.point2X.getOrElse("")),
          ("point2y", (a: ImageAndLabel) => a.label.point2Y.getOrElse(""))
        )

        CSVWriter.writeCsv[ImageAndLabel](labels, columns)
      } catch {
        case _ => throw new Exception("Error generating CSV")
      }
    } else
      throw new Exception("Not authorized to view labels for this task")
  }

}
