package com.example.app.Routes

import com.example.app.models._
import com.example.app.{AuthenticationSupport, SlickRoutes}

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
      Task.saveWithParticipantCreation(userId, toSave).toJson(user.id)
    else
      throw new Exception("Not authorized to edit this task")
  }

  get("/tasks/:task-id/view") {
    contentType = formats("json")
    authenticate()

    val taskId = {params("task-id")}.toInt

    val taskAuthorization = Task.authorizedToViewTaskDetails(user.id, taskId)

    if(taskAuthorization)
      Task.byId(taskId).map(_.toJson(user.id))
    else
      throw new Exception("Not authorized to view this task")
  }

  get("/tasks/created") {
    contentType = formats("json")
    authenticate()

    Task.tasksCreatedByUser(user.id).map(_.map(_.toJson(user.id)))
  }

  get("/tasks/participating") {
    contentType = formats("json")
    authenticate()

    Task.tasksParticipatingIn(user.id).map(_.map(_.toJson(user.id)))
  }

  get("/tasks/:task-id/participants") {
    contentType = formats("json")
    authenticate()

    val taskId = {params("task-id")}.toInt

    val taskAuthorization = Task.authorizedToViewTaskDetails(user.id, taskId)

    if(taskAuthorization)
      Participant.participantsByTask(taskId)
    else
      throw new Exception("Not authorized to view this task's participants")
  }

  get("/tasks/:task-id/participant-link") {
    contentType = formats("json")
    authenticate()

    val taskId = {params("task-id")}.toInt

    val taskAuthorization = Task.authorizedToEditTask(user.id, taskId)

    if(taskAuthorization)
      Invitation.generateLink(taskId)
    else
      throw new Exception("Not authorized to create participant link")
  }

  post("/tasks/:task-id/ontology/create") {
    contentType = formats("json")
    authenticate()

    val userId = user.id

    val taskId = {params("task-id")}.toInt

    val taskAuthorization = Task.authorizedToEditTask(userId, taskId)

    val ontology = parsedBody.extract[OntologyVersionJson]

    if(taskAuthorization)
      OntologyVersion.createOntologyVersion(taskId, ontology).map(_.toJson)
    else
      throw new Exception("Not authorized to edit this task")
  }

  get("/tasks/:task-id/ontology") {
    contentType = formats("json")
    authenticate()

    val taskId = {params("task-id")}.toInt

    val ontologyAuthorization = Task.authorizedToParticipateInTask(user.id, taskId) || Task.authorizedToEditTask(user.id, taskId)

    if(ontologyAuthorization)
      OntologyVersion.latestVersionByTask(taskId).map(_.map(_.toJson))
    else
      throw new Exception("Not authorized to view this task's ontology")
  }

  get("/ontologies/types") {
    contentType = formats("json")

    OntologyVersion.ontologyTypes
  }

  get("/tasks/:task-id/image-sources") {
    contentType = formats("json")
    authenticate()

    val taskId = {params("task-id")}.toInt

    val taskAuthorization = Task.authorizedToViewTaskDetails(user.id, taskId)

    if(taskAuthorization)
      ImageSource.byTask(taskId)
    else
      throw new Exception("Not authorized to view this information for this task")
  }
}
