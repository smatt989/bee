package com.example.app.Routes

import com.example.app.models._
import com.example.app.{AuthenticationSupport, SlickRoutes}

import scala.concurrent.Await
import scala.concurrent.duration.Duration

/**
  * Created by matt on 6/1/17.
  */
trait TaskRoutes extends SlickRoutes with AuthenticationSupport{

  post("/tasks/save") {
    contentType = formats("json")
    authenticate()

    val userId = user.id

    val inputTask = parsedBody.extract[InputTask]

    val toSave = inputTask.task(userId)

    if(!(toSave.existsInDb && !Task.authorizedToEditTask(userId, toSave.id)))
      Task.saveWithParticipantCreation(userId, toSave).toJson(userId)
    else
      throw new Exception("Not authorized to edit this task")
  }

  get("/tasks") {
    Task.getAll
  }

  get("/tasks/:id/view") {
    contentType = formats("json")
    authenticate()

    val taskId = {params("id")}.toInt

    val userId = user.id

    val taskAuthorization = Task.authorizedToViewTaskDetails(userId, taskId)

    if(taskAuthorization)
      Task.byId(taskId).map(_.toJson(userId))
    else
      throw new Exception("Not authorized to view this task")
  }

  get("/tasks/created") {
    contentType = formats("json")
    authenticate()

    val userId = user.id

    Task.tasksCreatedByUser(userId).map(_.map(_.toJson(userId)))
  }

  get("/tasks/participating") {
    contentType = formats("json")
    authenticate()

    val userId = user.id

    Task.tasksParticipatingIn(userId).map(_.map(_.toJson(userId)))
  }

  get("/tasks/:id/participants") {
    contentType = formats("json")
    authenticate()

    val taskId = {params("id")}.toInt

    val userId = user.id

    val taskAuthorization = Task.authorizedToViewTaskDetails(userId, taskId)

    if(taskAuthorization)
      Participant.participantsByTask(taskId).map(_.map(_.toJson))
    else
      throw new Exception("Not authorized to view this task's participants")
  }

  post("/tasks/:id/leave") {
    contentType = formats("json")
    authenticate()

    val userId = user.id
    val taskId = {params("id")}.toInt

    val participant = Await.result(Participant.participantByUserAndTask(userId, taskId), Duration.Inf)
    if(participant.isDefined)
      Participant.setParticipantActivation(participant.get.id, false).map(_.toJson)
    else
      throw new Exception("Not able to leave a task you are not a participant in")
  }

  post("/tasks/:id/participant-link") {
    contentType = formats("json")
    authenticate()

    val taskId = {params("id")}.toInt

    val userId = user.id

    val taskAuthorization = Task.authorizedToEditTask(userId, taskId)

    if(taskAuthorization)
      Invitation.generateLink(taskId)
    else
      throw new Exception("Not authorized to create participant link")
  }

  post("/tasks/:id/ontology/create") {
    contentType = formats("json")
    authenticate()

    val userId = user.id

    val taskId = {params("id")}.toInt

    val taskAuthorization = Task.authorizedToEditTask(userId, taskId)

    val ontology = parsedBody.extract[OntologyVersionJson]

    if(taskAuthorization)
      OntologyVersion.createOntologyVersion(taskId, ontology).map(_.toJson)
    else
      throw new Exception("Not authorized to edit this task")
  }

  get("/tasks/:id/ontology") {
    contentType = formats("json")
    authenticate()

    val taskId = {params("id")}.toInt

    val userId = user.id

    val ontologyAuthorization = Task.authorizedToParticipateInTask(userId, taskId) || Task.authorizedToEditTask(userId, taskId)

    if(ontologyAuthorization)
      OntologyVersion.latestVersionByTask(taskId).map(_.map(_.toJson))
    else
      throw new Exception("Not authorized to view this task's ontology")
  }

  get("/ontologies/types") {
    contentType = formats("json")

    OntologyVersion.ontologyTypes
  }

  get("/tasks/:id/image-sources") {
    contentType = formats("json")
    authenticate()

    val taskId = {params("id")}.toInt

    val userId = user.id

    val taskAuthorization = Task.authorizedToViewTaskDetails(userId, taskId)

    if(taskAuthorization)
      ImageSource.byTask(taskId).map(_.map(_.toJson))
    else
      throw new Exception("Not authorized to view this information for this task")
  }

  get("/tasks/:id/image-sources/details") {
    contentType = formats("json")
    authenticate()

    val taskId = {params("id")}.toInt
    val userId = user.id

    val taskAuthorization = Task.authorizedToViewTaskDetails(userId, taskId)

    if(taskAuthorization){
      val imageSources = Await.result(ImageSource.byTask(taskId), Duration.Inf)
      ImageSource.imageCountInSources(imageSources.map(_.id))
    }
    else
      throw new Exception("Not authorized to view this information for this task")
  }
}
