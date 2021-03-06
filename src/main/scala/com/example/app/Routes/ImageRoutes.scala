package com.example.app.Routes

import com.example.app.models._
import com.example.app.{AuthenticationSupport, SlickRoutes}
import org.json4s.jackson.Serialization

/**
  * Created by matt on 6/2/17.
  */
trait ImageRoutes extends SlickRoutes with AuthenticationSupport {

  post("/images/seen") {
    contentType = formats("json")
    authenticate()

    val imageView = parsedBody.extract[CreateImageView]

    val participantAuthorization = Task.authorizedToParticipateInTask(user.userAccountId, imageView.taskId)

    if(participantAuthorization)
      ImageView.createNewImageView(user.userAccountId, imageView).map(a => ImageView.makeJson(a, imageView.taskId))
    else
      throw new Exception("Not authorized to view this image")
  }

  post("/images/next") {
    contentType = formats("json")
    authenticate()

    val imageRequest = parsedBody.extract[RequestImage]

    val participantAuthorization = Task.authorizedToParticipateInTask(user.userAccountId, imageRequest.taskId)

    if(participantAuthorization) {
      val imageWithAccess = ImageView.imageIncrement(user.userAccountId, imageRequest, ImageIncrement.next)

      if(imageWithAccess.isDefined) {
        response.addHeader(Image.configsHeader, Serialization.write(imageWithAccess.get.imageWithAccess.accessConfigs))
      }

      imageWithAccess.map(_.toJson)
    } else
      throw new Exception("Not authorized to view this task's images")
  }

  post("/images/previous") {
    contentType = formats("json")
    authenticate()

    val imageRequest = parsedBody.extract[RequestImage]

    val participantAuthorization = Task.authorizedToParticipateInTask(user.userAccountId, imageRequest.taskId)

    if(participantAuthorization) {
      val imageWithAccess = ImageView.imageIncrement(user.userAccountId, imageRequest, ImageIncrement.previous)

      if(imageWithAccess.isDefined) {
        response.addHeader(Image.configsHeader, Serialization.write(imageWithAccess.get.imageWithAccess.accessConfigs))
      }

      imageWithAccess.map(_.toJson)
    } else
      throw new Exception("Not authorized to view this task's images")
  }

  get("/images") {
    contentType = formats("json")

    Image.getAll
  }
}
