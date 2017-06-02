package com.example.app.Routes

import com.example.app.models._
import com.example.app.{AuthenticationSupport, SlickRoutes}

/**
  * Created by matt on 6/2/17.
  */
trait ImageRoutes extends SlickRoutes with AuthenticationSupport {

  post("/images/seen") {
    authenticate()

    val imageView = parsedBody.extract[CreateImageView]

    val participantAuthorization = Task.authorizedToParticipateInTask(user.id, imageView.taskId)

    if(participantAuthorization)
      ImageView.createNewImageView(user.id, imageView)
    else
      throw new Exception("Not authorized to view this image")
  }

  post("/images/next") {
    authenticate()

    val imageRequest = parsedBody.extract[RequestImage]

    val participantAuthorization = Task.authorizedToParticipateInTask(user.id, imageRequest.taskId)

    if(participantAuthorization)
      Image.nextImage(user.id, imageRequest.taskId)
    else
      throw new Exception("Not authorized to view this task's images")
  }
}
