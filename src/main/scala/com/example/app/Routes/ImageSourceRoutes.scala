package com.example.app.Routes

import com.example.app.models.{ImageSource, ImageSourceRequest, Task}
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

    val imageSource = parsedBody.extract[ImageSourceRequest]

    val taskAuthorization = if(imageSource.id != null && imageSource.id > 0)
      Task.authorizedToEditImageSource(user.userAccountId, imageSource.id)
    else
      Task.authorizedToEditTask(user.userAccountId, imageSource.taskId)

    //TODO: NOT OBVIOUS THAT OVERLAPPING IMAGE SOURCE IMAGES ARE BEING CONSOLIDATED HERE
    if(taskAuthorization) {
      val savedImageSource = Await.result(ImageSource.save(imageSource.getSerialized), Duration.Inf)
      ImageSource.updateImageSourceImages(savedImageSource)
      ImageSource.makeHeaderMap(savedImageSource)
      ImageSource.makeJson(savedImageSource)
    } else
      throw new Exception("Not authorized to edit this task")
  }

  get("/image-sources/:id/view") {
    contentType = formats("json")
    authenticate()

    val imageSourceId = {params("id")}.toInt

    val userId = user.userAccountId

    val taskAuthorization =
      Task.authorizedToEditImageSource(userId, imageSourceId)

    if(taskAuthorization) {
      val imageSource = Await.result(ImageSource.byId(imageSourceId), Duration.Inf)
      ImageSource.makeHeaderMap(imageSource)
      ImageSource.makeJson(imageSource)
    } else
      throw new Exception("Not authorized to view this image source")
  }

  post("/image-sources/:id/delete") {
    contentType = formats("json")
    authenticate()

    val imageSourceId = {params("id")}.toInt

    val imageSource = Await.result(ImageSource.byId(imageSourceId), Duration.Inf)

    val taskAuthorization = Task.authorizedToEditTask(user.userAccountId, imageSource.taskId)

    if(taskAuthorization) {
      Await.result(ImageSource.delete(imageSource.imageSourceId), Duration.Inf)
      "200"
    } else
      throw new Exception("Not authorized to edit this task")
  }

  get("/image-sources/types") {
    contentType = formats("json")

    ImageSource.imageSourceTypes
  }
}
