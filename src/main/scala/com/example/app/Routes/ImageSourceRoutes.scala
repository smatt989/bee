package com.example.app.Routes

import com.example.app.models.{ImageSource, ImageSourceRequest, Task}
import com.example.app.{AuthenticationSupport, SessionTokenStrategy, SlickRoutes}

import scala.concurrent.Await
import scala.concurrent.duration.Duration

/**
  * Created by matt on 6/1/17.
  */
trait ImageSourceRoutes extends SlickRoutes with AuthenticationSupport {

  before() {
    val imageSourceTypeFieldHeaders = ImageSource.imageSourceTypes.flatMap(_.fields)
    response.setHeader("Access-Control-Expose-Headers", (Seq(SessionTokenStrategy.HeaderKey) ++ imageSourceTypeFieldHeaders).mkString(", "))
  }

  post("/image-sources/save") {
    contentType = formats("json")
    authenticate()

    val imageSource = parsedBody.extract[ImageSourceRequest]

    val taskAuthorization = if(imageSource.id != null && imageSource.id > 0)
      Task.authorizedToEditImageSource(user.id, imageSource.id)
    else
      Task.authorizedToEditTask(user.id, imageSource.taskId)

    if(taskAuthorization) {
      val savedImageSource = Await.result(ImageSource.save(imageSource.getSerialized), Duration.Inf)
      ImageSource.updateImageSourceImages(savedImageSource)
      savedImageSource.makeHeaderMap
      savedImageSource.toJson
    } else
      throw new Exception("Not authorized to edit this task")
  }

  get("/image-sources/:id/view") {
    contentType = formats("json")
    authenticate()

    val imageSourceId = {params("id")}.toInt

    val userId = user.id

    val taskAuthorization =
      Task.authorizedToEditImageSource(user.id, imageSourceId)

    if(taskAuthorization) {
      val imageSource = Await.result(ImageSource.byId(imageSourceId), Duration.Inf)
      imageSource.makeHeaderMap
      imageSource.toJson
    } else
      throw new Exception("Not authorized to view this image source")
  }

  post("/image-sources/:id/delete") {
    contentType = formats("json")
    authenticate()

    val imageSourceId = {params("id")}.toInt

    val imageSource = Await.result(ImageSource.byId(imageSourceId), Duration.Inf)

    val taskAuthorization = Task.authorizedToEditTask(user.id, imageSource.taskId)

    if(taskAuthorization) {
      Await.result(ImageSource.delete(imageSource.id), Duration.Inf)
      imageSource.id
    } else
      throw new Exception("Not authorized to edit this task")
  }

  get("/image-sources/types") {
    contentType = formats("json")

    ImageSource.imageSourceTypes
  }
}
