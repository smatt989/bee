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
    contentType = formats("json")
    authenticate()

    val imageSource = parsedBody.extract[ImageSource]

    val taskAuthorization = Task.authorizedToEditTask(user.id, imageSource.taskId)

    if(taskAuthorization) {
      val savedImageSource = Await.result(ImageSource.save(imageSource), Duration.Inf)
      ImageSource.updateImageSourceImages(savedImageSource)
      savedImageSource
    } else
      throw new Exception("Not authorized to edit this task")
  }

  post("/image-sources/:id/delete") {
    contentType = formats("json")
    authenticate()

    val imageSourceId = {params("id")}.toInt

    val imageSource = Await.result(ImageSource.byId(imageSourceId), Duration.Inf)

    val taskAuthorization = Task.authorizedToEditTask(user.id, imageSource.taskId)

    if(taskAuthorization) {
      ImageSource.delete(imageSource.id)
      "200"
    } else
      throw new Exception("Not authorized to edit this task")
  }

  get("/image-sources/types") {
    contentType = formats("json")

    ImageSource.imageSourceTypes
  }
}
