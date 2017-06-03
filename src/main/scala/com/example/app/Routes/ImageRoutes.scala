package com.example.app.Routes

import com.example.app.models._
import com.example.app.{AuthenticationSupport, SlickRoutes}

/**
  * Created by matt on 6/2/17.
  */
trait ImageRoutes extends SlickRoutes with AuthenticationSupport {

  post("/images/seen") {
    contentType = formats("json")
    authenticate()

    val imageView = parsedBody.extract[CreateImageView]

    val participantAuthorization = Task.authorizedToParticipateInTask(user.id, imageView.taskId)

    if(participantAuthorization)
      ImageView.createNewImageView(user.id, imageView).map(_.toJson(imageView.taskId))
    else
      throw new Exception("Not authorized to view this image")
  }

  post("/images/next") {
    contentType = formats("json")
    authenticate()

    val imageRequest = parsedBody.extract[RequestImage]

    val participantAuthorization = Task.authorizedToParticipateInTask(user.id, imageRequest.taskId)

    if(participantAuthorization)
      Image.nextImage(user.id, imageRequest.taskId)
    else
      throw new Exception("Not authorized to view this task's images")
  }
}
