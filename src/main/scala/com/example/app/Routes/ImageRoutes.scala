package com.example.app.Routes

import com.example.app.models._
import com.example.app.{AuthenticationSupport, SlickRoutes}
import org.json4s.jackson.JsonMethods
import org.json4s.jackson.Serialization

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

    if(participantAuthorization) {
      val imageWithAccess = Image.nextImage(user.id, imageRequest.taskId)

      if(imageWithAccess.isDefined) {
        response.addHeader("image-request-headers", Serialization.write(imageWithAccess.get.accessConfigs))
      }
      imageWithAccess.map(_.image)
    } else
      throw new Exception("Not authorized to view this task's images")
  }

  get("/images") {
    contentType = formats("json")

    Image.getAll
  }
}
