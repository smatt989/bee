import axios from 'axios';
import {authenticatedSession, authenticationHeader, authenticate} from './utilities';

export const domain = CONFIG ? CONFIG.frontServer ? 'http://localhost:8080' : '' : '';

/*
 * action types
 */

export const SIGNUP_EMAIL_CHANGED = 'SIGNUP_EMAIL_CHANGED';
export const SIGNUP_PASSWORD_CHANGED = 'SIGNUP_PASSWORD_CHANGED';
export const SIGNUP_CLEAR_INPUTS = 'SIGNUP_CLEAR_INPUTS';
export const LOGIN_EMAIL_CHANGED = 'LOGIN_EMAIL_CHANGED';
export const LOGIN_PASSWORD_CHANGED = 'LOGIN_PASSWORD_CHANGED';
export const LOGIN_CLEAR_INPUTS = 'LOGIN_CLEAR_INPUTS';

/*
 * action creators
 */

export function cleanState() {
  return {
    type: 'CLEAN_STATE'
  };
}

export function createUser(email, password) {
  const request = axios({
    method: 'post',
    url: `${domain}/users/create`,
    headers: {
      'email': email,
      'password': password
    }
  });

  return {
    type: 'CREATE_USER',
    payload: request
  };
}

export function createUserSuccess(loaded) {
  return {
    type: 'CREATE_USER_SUCCESS',
    payload: loaded
  };
}

export function createUserError(error) {
  return {
    type: 'CREATE_USER_ERROR',
    error: error
  };
}

export function login(email, password) {
  const request = axios({
    method: 'get',
    url: `${domain}/sessions/new`,
    headers: {
      'email': email,
      'password': password
    }
  });

  return {
    type: 'LOGIN',
    payload: request
  };
}

export function loginSuccess(loaded) {
  return {
    type: 'LOGIN_SUCCESS',
    payload: loaded
  };
}

export function loginError(error) {
  return {
    type: 'LOGIN_ERROR',
    error: error
  };
}

export function checkAuthentication() {
    const request = axios({
        method: 'get',
        url: `${domain}/sessions/new`,
        headers: authenticate()
    });

    return {
        type: 'CHECK_AUTHENTICATION',
        payload: request
    };
}

export function logout(session) {
  const request = axios({
    method: 'post',
    url: `${domain}/sessions/logout`,
    headers: authenticate()
  });

  return {
    type: 'LOGOUT',
    payload: request
  };
}

export function logoutSuccess(loaded) {
  return {
    type: 'LOGOUT_SUCCESS',
    payload: loaded
  };
}

export function logoutError(error) {
  return {
    type: 'LOGOUT_ERROR',
    error: error
  };
}

export function saveTask(task, id){
  const request = axios({
    method: 'post',
    url: `${domain}/tasks/save`,
    //TODO: SHOULD PROBABLY BE PASSING IN A WHOLE TASK OBJECT.
    //IF IT HAPPENS TO BE AN IMMUTABLE JS OBJECT, CALL task.toJS()
    //IF IT IS A PLAIN JS OBJECT JUST PASS IT IN
    //data: task.toJS(),
    data: {name: task, id: id},
    headers: authenticate()
  });

  return {
    type: 'SAVE_TASK',
    payload: request
  }
}

export function saveTaskSuccess(loaded) {
  return {
    type: 'SAVE_TASK_SUCCESS',
    payload: loaded
  }
}

export function saveTaskError(error) {
  return {
    type: 'SAVE_TASK_ERROR',
    error: error
  }
}

export function cleanTaskState() {
  return {
    type: 'CLEAN_TASK_STATE'
  }
}

export function viewTask(taskId) {
  const request = axios({
    method: 'get',
    url: `${domain}/tasks/${taskId}/view`,
    headers: authenticate()
  });

  return {
    type: 'VIEW_TASK',
    payload: request
  }
}

export function viewTaskSuccess(loaded) {
  return {
    type: 'VIEW_TASK_SUCCESS',
    payload: loaded
  }
}

export function viewTaskError(error) {
  return {
    type: 'VIEW_TASK_ERROR',
    error: error
  }
}

export function getTasks() {
  const request = axios({
    method: 'get',
    url: `${domain}/tasks`,
    headers: authenticate()
  });

  return {
    type: 'GET_TASKS',
    payload: request
  }
}

export function getTasksSuccess(loaded) {
  return {
    type: 'GET_TASKS_SUCCESS',
    payload: loaded
  }
}

export function getTasksError(error) {
  return {
    type: 'GET_TASKS_ERROR',
    error: error
  }
}

export function taskParticipants(taskId) {
  const request = axios({
    method: 'get',
    url: `${domain}/tasks/${taskId}/participants`,
    headers: authenticate()
  });

  return {
    type: 'TASK_PARTICIPANTS',
    payload: request
  }
}

export function taskParticipantsSuccess(loaded) {
  return {
    type: 'TASK_PARTICIPANTS_SUCCESS',
    payload: loaded
  }
}

export function taskParticipantsError(error) {
  return {
    type: 'TASK_PARTICIPANTS_ERROR',
    error: error
  }
}

export function participantLink(taskId) {
  const request = axios({
    method: 'post',
    url: `${domain}/tasks/${taskId}/participant-link`,
    headers: authenticate()
  });

  return {
    type: 'PARTICIPANT_LINK',
    payload: request
  }
}

export function participantLinkSuccess(loaded) {
  return {
    type: 'PARTICIPANT_LINK_SUCCESS',
    payload: loaded
  }
}

export function participantLinkError(error) {
  return {
    type: 'PARTICIPANT_LINK_ERROR',
    error: error
  }
}

export function acceptInvitation(invitation) {
  const request = axios({
    method: 'post',
    url: `${domain}/invitation/${invitation}/accept`,
    headers: authenticate()
  });

  return {
    type: 'ACCEPT_INVITATION',
    payload: request
  }
}

export function acceptInvitationSuccess(loaded) {
  return {
    type: 'ACCEPT_INVITATION_SUCCESS',
    payload: loaded
  }
}

export function acceptInvitationError(error) {
  return {
    type: 'ACCEPT_INVITATION_ERROR',
    error: error
  }
}

export function createOntology(taskId, ontology) {
  const request = axios({
    method: 'post',
    url: `${domain}/tasks/${taskId}/ontology/create`,
    data: ontology.toJS(),
    headers: authenticate()
  });

  return {
    type: 'CREATE_ONTOLOGY',
    payload: request
  }
}

export function createOntologySuccess(loaded) {
  return {
    type: 'CREATE_ONTOLOGY_SUCCESS',
    payload: loaded
  }
}

export function createOntologyError(error) {
  return {
    type: 'CREATE_ONTOLOGY_ERROR',
    error: error
  }
}

export function ontologyTypes() {
  const request = axios({
    method: 'get',
    url: `${domain}/ontologies/types`
  });

  return {
    type: 'ONTOLOGY_TYPES',
    payload: request
  }
}

export function ontologyTypesSuccess(loaded) {
  return {
    type: 'ONTOLOGY_TYPES_SUCCESS',
    payload: loaded
  }
}

export function ontologyTypesError(error) {
  return {
    type: 'ONTOLOGY_TYPES_ERROR',
    error: error
  }
}

export function viewTaskOntology(taskId) {
  const request = axios({
    method: 'get',
    url: `${domain}/tasks/${taskId}/ontology`,
    headers: authenticate()
  });

  return {
    type: 'VIEW_TASK_ONTOLOGY',
    payload: request
  }
}

export function viewTaskOntologySuccess(loaded) {
  return {
    type: 'VIEW_TASK_ONTOLOGY_SUCCESS',
    payload: loaded
  }
}

export function viewTaskOntologyError(error) {
  return {
    type: 'VIEW_TASK_ONTOLOGY_ERROR',
    error: error
  }
}

export function saveImageSource(imageSource, configs) {
  var headers = authenticate()
  //TODO: CAN PROBABLY DO THIS BETTER
  for(var key in configs){
      headers[key] = configs[key];
  }

  const request = axios({
    method: 'post',
    url: `${domain}/image-sources/save`,
    data: imageSource.toJS(),
    headers: headers
  });

  return {
    type: 'SAVE_IMAGE_SOURCE',
    payload: request
  }
}

// TODO: GET RESPONSE HEADERS
export function saveImageSourceSuccess(loaded, configs) {
  return {
    type: 'SAVE_IMAGE_SOURCE_SUCCESS',
    payload: loaded,
    configs: configs
  }
}

export function saveImageSourceError(error) {
  return {
    type: 'SAVE_IMAGE_SOURCE_ERROR',
    error: error
  }
}

export function viewImageSource(imageSourceId) {
  const request = axios({
    method: 'get',
    url: `${domain}/image-sources/${imageSourceId}/view`,
    headers: authenticate()
  });

  return {
    type: 'VIEW_IMAGE_SOURCE',
    payload: request
  }
}

// TODO: GET RESPONSE HEADERS
export function viewImageSourceSuccess(loaded, configs) {
  return {
    type: 'VIEW_IMAGE_SOURCE_SUCCESS',
    payload: loaded,
    configs: configs
  }
}

export function viewImageSourceError(error) {
  return {
    type: 'VIEW_IMAGE_SOURCE_ERROR',
    error: error
  }
}

export function imageSourceTypes() {
  const request = axios({
    method: 'get',
    url: `${domain}/image-sources/types`
  });

  return {
    type: 'IMAGE_SOURCE_TYPES',
    payload: request
  }
}

export function imageSourceTypesSuccess(loaded) {
  return {
    type: 'IMAGE_SOURCE_TYPES_SUCCESS',
    payload: loaded
  }
}

export function imageSourceTypesError(error) {
  return {
    type: 'IMAGE_SOURCE_TYPES_ERROR',
    error: error
  }
}

export function deleteImageSource(imageSourceId) {
  const request = axios({
    method: 'post',
    url: `${domain}/image-sources/${imageSourceId}/delete`,
    headers: authenticate()
  });

  return {
    type: 'DELETE_IMAGE_SOURCE',
    payload: request
  }
}

export function deleteImageSourceSuccess(imageSourceId) {
  return {
    type: 'DELETE_IMAGE_SOURCE_SUCCESS',
    payload: imageSourceId
  }
}

export function deleteImageSourceError(error) {
  return {
    type: 'DELETE_IMAGE_SOURCE_ERROR',
    error: error
  }
}

export function viewImageSources(taskId) {
  const request = axios({
    method: 'get',
    url: `${domain}/tasks/${taskId}/image-sources`,
    headers: authenticate()
  });

  return {
    type: 'VIEW_IMAGE_SOURCES',
    payload: request
  }
}

export function viewImageSourcesSuccess(loaded) {
  return {
    type: 'VIEW_IMAGE_SOURCES_SUCCESS',
    payload: loaded
  }
}

export function viewImageSourcesError(error) {
  return {
    type: 'VIEW_IMAGE_SOURCES_ERROR',
    error: error
  }
}

export function viewImageSourcesDetails(taskId) {
    const request = axios({
        method: 'get',
        url: `${domain}/tasks/${taskId}/image-sources/details`,
        headers: authenticate()
    });

    return {
        type: 'VIEW_IMAGE_SOURCES_DETAILS',
        payload: request
    }
}

export function viewImageSourcesDetailsSuccess(loaded) {
    return {
        type: 'VIEW_IMAGE_SOURCES_DETAILS_SUCCESS',
        payload: loaded
    }
}

export function viewImageSourcesDetailsError(error) {
    return {
        type: 'VIEW_IMAGE_SOURCES_DETAILS_ERROR',
        error: error
    }
}

export function viewParticipantsDetails(taskId) {
    const request = axios({
        method: 'get',
        url: `${domain}/tasks/${taskId}/participants/details`,
        headers: authenticate()
    });

    return {
        type: 'VIEW_PARTICIPANTS_DETAILS',
        payload: request
    }
}

export function viewParticipantsDetailsSuccess(loaded) {
    return {
        type: 'VIEW_PARTICIPANTS_DETAILS_SUCCESS',
        payload: loaded
    }
}

export function viewParticipantsDetailsError(error) {
    return {
        type: 'VIEW_PARTICIPANTS_DETAILS_ERROR',
        error: error
    }
}

export function viewParticipationDetails(taskId) {
    const request = axios({
        method: 'get',
        url: `${domain}/tasks/${taskId}/participation`,
        headers: authenticate()
    });

    return {
        type: 'VIEW_PARTICIPATION_DETAILS',
        payload: request
    }
}

export function viewParticipationDetailsSuccess(loaded) {
    return {
        type: 'VIEW_PARTICIPATION_DETAILS_SUCCESS',
        payload: loaded
    }
}

export function viewParticipationDetailsError(error) {
    return {
        type: 'VIEW_PARTICIPATION_DETAILS_ERROR',
        error: error
    }
}

export function deactivateParticipant(participantId) {
  const request = axios({
    method: 'post',
    url: `${domain}/participants/${participantId}/deactivate`,
    headers: authenticate()
  });

  return {
    type: 'DEACTIVATE_PARTICIPANT',
    payload: request
  }
}

export function deactivateParticipantSuccess(loaded) {
  return {
    type: 'DEACTIVATE_PARTICIPANT_SUCCESS',
    payload: loaded
  }
}

export function deactivateParticipantError(error) {
  return {
    type: 'DEACTIVATE_PARTICIPANT_ERROR',
    error: error
  }
}

export function leaveTask(taskId) {
  const request = axios({
    method: 'post',
    url: `${domain}/tasks/${taskId}/leave`,
    headers: authenticate()
  });

  return {
    type: 'LEAVE_TASK',
    payload: request
  }
}

export function leaveTaskSuccess(loaded) {
  return {
    type: 'LEAVE_TASK_SUCCESS',
    payload: loaded
  }
}

export function leaveTaskError(error) {
  return {
     type: 'LEAVE_TASK_ERROR',
     error: error
  }
}

export function activateParticipant(participantId) {
  const request = axios({
    method: 'post',
    url: `${domain}/participants/${participantId}/activate`,
    headers: authenticate()
  });

  return {
    type: 'ACTIVATE_PARTICIPANT',
    payload: request
  }
}

export function activateParticipantSuccess(loaded) {
  return {
    type: 'ACTIVATE_PARTICIPANT_SUCCESS',
    payload: loaded
  }
}

export function activateParticipantError(error) {
  return {
    type: 'ACTIVATE_PARTICIPANT_ERROR',
    error: error
  }
}

export function markImageSeen(taskId, imageId) {
  const request = axios({
    method: 'post',
    url: `${domain}/images/seen`,
    data: {taskId: taskId, imageId: imageId},
    headers: authenticate()
  });

  return {
    type: 'MARK_IMAGE_SEEN',
    payload: request
  }
}

export function markImageSeenSuccess(loaded) {
  return {
    type: 'MARK_IMAGE_SEEN_SUCCESS',
    payload: loaded
  }
}

export function markImageSeenError(error) {
  return {
    type: 'MARK_IMAGE_SEEN_ERROR',
    error: error
  }
}

export function nextImage(taskId, imageViewId) {
  const request = axios({
    method: 'post',
    url: `${domain}/images/next`,
    data: {taskId: taskId, imageViewId: imageViewId},
    headers: authenticate()
  });

  return {
    type: 'NEXT_IMAGE',
    payload: request
  }
}

export function nextImageSuccess(loaded, configs) {
  return {
    type: 'NEXT_IMAGE_SUCCESS',
    payload: loaded,
    configs: configs
  }
}

export function nextImageError(error) {
  return {
    type: 'NEXT_IMAGE_ERROR',
    error: error
  }
}

export function previousImage(taskId, imageViewId) {
  const request = axios({
    method: 'post',
    url: `${domain}/images/previous`,
    data: {taskId: taskId, imageViewId: imageViewId},
    headers: authenticate()
  });

  return {
    type: 'PREVIOUS_IMAGE',
    payload: request
  }
}

export function previousImageSuccess(loaded, configs) {
  return {
    type: 'PREVIOUS_IMAGE_SUCCESS',
    payload: loaded,
    configs: configs
  }
}

export function previousImageError(error) {
  return {
    type: 'PREVIOUS_IMAGE_ERROR',
    error: error
  }
}

export function saveLabels(taskId, imageId, labels) {
  const request = axios({
    method: 'post',
    url: `${domain}/labels/save`,
    data: {taskId: taskId, imageId: imageId, labels: labels},
    headers: authenticate()
  });

  return {
    type: 'SAVE_LABELS',
    payload: request
  }
}

export function saveLabelsSuccess(loaded) {
  return {
    type: 'SAVE_LABELS_SUCCESS',
    payload: loaded
  }
}

export function saveLabelsError(error) {
  return {
    type: 'SAVE_LABELS_ERROR',
    error: error
  }
}

export function viewParticipantImageLabels(taskId, imageId) {
  const request = axios({
    method: 'post',
    url: `${domain}/labels`,
    data: {taskId: taskId, imageId: imageId},
    headers: authenticate()
  });

  return {
    type: 'VIEW_PARTICIPANT_IMAGE_LABELS',
    payload: request
  }
}

export function viewParticipantImageLabelsSuccess(loaded) {
  return {
    type: 'VIEW_PARTICIPANT_IMAGE_LABELS_SUCCESS',
    payload: loaded
  }
}

export function viewParticipantImageLabelsError(error) {
  return {
    type: 'VIEW_PARTICIPANT_IMAGE_LABELS_ERROR',
    error: error
  }
}

export function signupEmailChanged(email) {
  return {
    type: SIGNUP_EMAIL_CHANGED,
    email: email
  }
}

export function signupPasswordChanged(password) {
  return {
    type: SIGNUP_PASSWORD_CHANGED,
    password: password
  }
}

export function signupClearInputs() {
  return {
    type: SIGNUP_CLEAR_INPUTS
  }
}

export function loginEmailChanged(email) {
  return {
    type: LOGIN_EMAIL_CHANGED,
    email: email
  }
}

export function loginPasswordChanged(password) {
  return {
    type: LOGIN_PASSWORD_CHANGED,
    password: password
  }
}

export function loginClearInputs() {
  return {
    type: LOGIN_CLEAR_INPUTS
  }
}

export function addLabel(label) {
    return {
        type: 'ADD_LABEL',
        label: label
    }
}

export function removeLabel(labelUuid) {
    return {
        type: 'REMOVE_LABEL',
        uuid: labelUuid
    }
}

export function updateLabelValue(labelUuid, value) {
    return {
        type: 'UPDATE_LABEL_VALUE',
        uuid: labelUuid,
        value: value
    }
}

export function startEditingTask() {
  return {
    type: "START_EDITING_TASK"
  }
}

export function stopEditingTask() {
  return {
    type: 'STOP_EDITING_TASK'
  }
}