package com.example.app.Routes

import com.example.app.models.{ImageSource, Task}
import com.example.app.{AuthenticationSupport, SlickRoutes}

import scala.concurrent.Await
import scala.concurrent.duration.Duration

/**
  * Created by matt on 6/1/17.
  */
trait ImageSourceRoutes extends SlickRoutes with AuthenticationSupport {

  post("/image-sources/save") {
    authenticate()

    val imageSource = parsedBody.extract[ImageSource]

    val taskAuthorization = Task.authorizedToEditTask(user.id, imageSource.taskId)

    if(taskAuthorization) {
      ImageSource.save(imageSource)
    } else
      throw new Exception("Not authorized to edit this task")
  }

  post("/image-sources/:image-source-id/delete") {
    authenticate()

    val imageSourceId = {params("image-source-id")}.toInt

    val imageSource = Await.result(ImageSource.byId(imageSourceId), Duration.Inf)

    val taskAuthorization = Task.authorizedToEditTask(user.id, imageSource.taskId)

    if(taskAuthorization) {
      ImageSource.delete(imageSource.id)
    } else
      throw new Exception("Not authorized to edit this task")
  }
}
