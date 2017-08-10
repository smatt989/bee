package com.example.app.Routes

import com.example.app.models._
import com.example.app.{AuthenticationSupport, SlickRoutes}

import scala.concurrent.{Await, Future}
import scala.concurrent.duration.Duration

/**
  * Created by matt on 6/1/17.
  */
trait TaskRoutes extends SlickRoutes with AuthenticationSupport{

  post("/tasks/save") {
    contentType = formats("json")
    authenticate()

    val userId = user.userAccountId

    val inputTask = parsedBody.extract[InputTask]

    val toSave = inputTask.task(userId)

    if(!(Task.existsInDb(toSave) && !Task.authorizedToEditTask(userId, toSave.taskId))) {
      val task = Task.saveWithParticipantCreation(userId, toSave)
      Task.makeJson(task, userId)
    } else
      throw new Exception("Not authorized to edit this task")
  }

  get("/tasks") {
    contentType = formats("json")
    authenticate()

    val userId = user.userAccountId

    val participatingIn = Await.result(Task.tasksParticipatingIn(userId), Duration.Inf)
    val created = Await.result(Task.tasksCreatedByUser(userId), Duration.Inf)

    (participatingIn.map(a => Task.makeJson(a, userId)) ++ created.map(a => Task.makeJson(a, userId)))
      .distinct.sortBy(_.id)
  }

  get("/tasks/:id/view") {
    contentType = formats("json")
    authenticate()

    val taskId = {params("id")}.toInt

    val userId = user.userAccountId

    val taskAuthorization = Task.authorizedToViewTaskDetails(userId, taskId)

    if(taskAuthorization)
      Task.byId(taskId).map(t => Task.makeJson(t, userId))
    else
      throw new Exception("Not authorized to view this task")
  }

  get("/tasks/created") {
    contentType = formats("json")
    authenticate()

    val userId = user.userAccountId

    Task.tasksCreatedByUser(userId).map(_.map(t => Task.makeJson(t, userId)))
  }

  get("/tasks/participating") {
    contentType = formats("json")
    authenticate()

    val userId = user.userAccountId

    Task.tasksParticipatingIn(userId).map(_.map(t => Task.makeJson(t, userId)))
  }

  get("/tasks/:id/participants") {
    contentType = formats("json")
    authenticate()

    val taskId = {params("id")}.toInt

    val userId = user.userAccountId

    val taskAuthorization = Task.authorizedToViewTaskDetails(userId, taskId)

    if(taskAuthorization)
      Participant.participantsByTask(taskId).map(_.map(_.toJson))
    else
      throw new Exception("Not authorized to view this task's participants")
  }

  post("/tasks/:id/leave") {
    contentType = formats("json")
    authenticate()

    val userId = user.userAccountId
    val taskId = {params("id")}.toInt

    val participant = Await.result(Participant.participantByUserAndTask(userId, taskId), Duration.Inf)
    if(participant.isDefined)
      Participant.setParticipantActivation(participant.get.participantId, activation = false).map(_.toJson)
    else
      throw new Exception("Not able to leave a task you are not a participant in")
  }

  post("/tasks/:id/participant-link") {
    contentType = formats("json")
    authenticate()

    val taskId = {params("id")}.toInt

    val userId = user.userAccountId

    val taskAuthorization = Task.authorizedToEditTask(userId, taskId)

    if(taskAuthorization)
      Invitation.generateLink(taskId)
    else
      throw new Exception("Not authorized to create participant link")
  }

  post("/tasks/:id/ontology/create") {
    contentType = formats("json")
    authenticate()

    val userId = user.userAccountId

    val taskId = {params("id")}.toInt

    val taskAuthorization = Task.authorizedToEditTask(userId, taskId)

    val ontology = parsedBody.extract[OntologyVersionJson]

    if(taskAuthorization)
      OntologyVersion.createOntologyVersion(taskId, ontology).map(OntologyVersion.makeJson)
    else
      throw new Exception("Not authorized to edit this task")
  }

  get("/tasks/:id/ontology") {
    contentType = formats("json")
    authenticate()

    val taskId = {params("id")}.toInt

    val userId = user.userAccountId

    val ontologyAuthorization = Task.authorizedToParticipateInTask(userId, taskId) || Task.authorizedToEditTask(userId, taskId)

    if(ontologyAuthorization)
      OntologyVersion.latestVersionByTask(taskId).map(_.map(OntologyVersion.makeJson))
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

    val userId = user.userAccountId

    val taskAuthorization = Task.authorizedToViewTaskDetails(userId, taskId)

    if(taskAuthorization)
      ImageSource.byTask(taskId).map(_.map(ImageSource.makeJson))
    else
      throw new Exception("Not authorized to view this information for this task")
  }

  get("/tasks/:id/image-sources/details") {
    contentType = formats("json")
    authenticate()

    val taskId = {params("id")}.toInt
    val userId = user.userAccountId

    val taskAuthorization = Task.authorizedToViewTaskDetails(userId, taskId)

    if(taskAuthorization){
      val imageSources = Await.result(ImageSource.byTask(taskId), Duration.Inf)
      ImageSource.imageSourceDetails(imageSources.map(_.imageSourceId))
    }
    else
      throw new Exception("Not authorized to view this information for this task")
  }

  get("/tasks/:id/participants/details") {
    contentType = formats("json")
    authenticate()

    val taskId = {params("id")}.toInt
    val userId = user.userAccountId

    val taskAuthorization = Task.authorizedToViewTaskDetails(userId, taskId)

    if(taskAuthorization){
      Participant.participantDetails(taskId)
    } else
      throw new Exception("Not authorized to view this information for this task")
  }
}
