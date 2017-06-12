import {Map, List} from 'immutable';
import Immutable from 'immutable';
import {setSession} from './utilities';
import { 
    SIGNUP_EMAIL_CHANGED, SIGNUP_PASSWORD_CHANGED, 
    LOGIN_EMAIL_CHANGED, LOGIN_PASSWORD_CHANGED 
} from './actions.js';

function cleanState() {
    const cleanState = Map({
        createUser: Map({loading: false, error: null}),
        login: Map({session: null, error: null, loading: false}),
        user: Map({email: null, id: null}),
        logout: Map({error: null, loading: false}),
        savingTask: Map({error: null, loading: false}),
        currentTask: Map({task: null, error: null, loading: false}),
        tasksCreated: Map({tasks: List.of(), error: null, loading: false}),
        tasksParticipating: Map({tasks: List.of(), error: null, loading: false}),
        taskParticipants: Map({participants: List.of(), error: null, loading: false}),
        participantLink: Map({link: null, error: null, loading: false}),
        acceptInvitation: Map({error: null, loading: false}),
        createOntology: Map({ontology: null, error: null, loading: false}),
        ontologyTypes: Map({types: List.of(), error: null, loading: false}),
        currentTaskOntology: Map({ontology: null, error: null, loading: false}),
        savingImageSource: Map({error: null, loading: false}),
        currentImageSource: Map({imageSource: null, error: null, loading: false}),
        imageSourceTypes: Map({types: List.of(), error: null, loading: false}),
        deletingImageSource: Map({error: null, loading: false}),
        currentImageSources: Map({imageSources: List.of(), error: null, loading: false}),
        deactivatingParticipant: Map({error: null, loading: false}),
        activatingParticipant: Map({error: null, loading: false}),
        markingImageSeen: Map({error: null, loading: false}),
        currentImage: Map({image: null, loadConfigs: null, markedSeen: false, error: null, loading: false}),
        savingLabels: Map({error: null, loading: false}),
        currentLabels: Map({labels: List.of(), error: null, loading: false}),
        signupEmail: Map({ email: '' }),
        signupPassword: Map({ password: '' }),
        loginEmail: Map({ email: '' }),
        loginPassword: Map({ password: '' })
    });

    return cleanState
}

function createUser(state) {
    return state.set('createUser', Map({loading: true, error: null}));
}

function createUserSuccess(state, user) {
    return state.set('createUser', Map({loading: false, error: null}));
}

function createUserError(state, error) {
    return state.set('createUser', Map({loading: false, error: Immutable.fromJS(error)}));
}

function login(state) {
    return state.set('login', Map({session: null, error: null, loading: true}));
}

function loginSuccess(state, session) {
    setSession(session)
    return state.set('login', Map({session: session, error: null, loading: false}));
}

function loginError(state, error) {
    return state.set('login', Map({session: null, error: error, loading: false}));
}

function logout(state){
    return state.set('logout', Map({error: null, loading: true}));
}

function logoutSuccess(state, payload){
    setSession(null)
    const newState = state.set('login', Map({session: null, error: null, loading: false}));
    return newState.set('logout', Map({error: null, loading: false}));
}

function logoutError(state, error) {
    return state.set('logout', Map({error: error, loading: false}));
}

function saveTask(state) {
    return state.set('savingTask', Map({error: null, loading: true}));
}

//TODO: NOT USING TASK HERE...
//TODO: SHOULD UPDATE TASKS CREATED HERE, and maybe CURRENT TASK
function saveTaskSuccess(state, task) {
    return state.set('savingTask', Map({error: null, loading: false}));
}

function saveTaskError(state, error){
    return state.set('savingTask', Map({error: Immutable.fromJS(error), loading: false}));
}

function viewTask(state) {
    return state.set('currentTask', Map({task: null, error: null, loading: true}));
}

function viewTaskSuccess(state, task) {
    return state.set('currentTask', Map({task: Immutable.fromJS(task), error: null, loading: false}));
}

function viewTaskError(state, error) {
    return state.set('currentTask', Map({task: null, error: Immutable.fromJS(error), loading: false}));
}

function tasksCreated(state) {
    return state.set('tasksCreated', Map({tasks: List.of(), error: null, loading: true}));
}

function tasksCreatedSuccess(state, tasks) {
    return state.set('tasksCreated', Map({tasks: Immutable.fromJS(tasks), error: null, loading: false}));
}

function tasksCreatedError(state, error) {
    return state.set('tasksCreated', Map({tasks: List.of(), error: Immutable.fromJS(error), loading: false}));
}

function tasksParticipating(state) {
    return state.set('tasksParticipating', Map({tasks: List.of(), error: null, loading: true}));
}

function tasksParticipatingSuccess(state, tasks) {
    return state.set('tasksParticipating', Map({tasks: Immutable.fromJS(tasks), error: null, loading: false}));
}

function tasksParticipatingError(state, error) {
    return state.set('tasksParticipating', Map({tasks: List.of(), error: Immutable.fromJS(error), loading: false}));
}

function taskParticipants(state) {
    return state.set('taskParticipants', Map({participants: List.of(), error: null, loading: true}));
}

function taskParticipantsSuccess(state, participants) {
    return state.set('taskParticipants', Map({participants: Immutable.fromJS(participants), error: null, loading: false}));
}

function taskParticipantsError(state, error) {
    return state.set('taskParticipants', Map({participants: List.of(), error: Immutable.fromJS(error), loading: false}));
}

function participantLink(state) {
    return state.set('participantLink', Map({link: null, error: null, loading: true}));
}

function participantLinkSuccess(state, linkObj) {
    const link = linkObj.link
    return state.set('participantLink', Map({link: link, error: null, loading: false}));
}

function participantLinkError(state, error) {
    return state.set('participantLink', Map({link: null, error: Immutable.fromJS(error), loading: false}));
}

function acceptInvitation(state) {
    return state.set('acceptInvitation', Map({error: null, loading: true}));
}

//TODO: NOT USING TASK
//TODO: SHOULD UPDATE TASKS PARTICIPATING
function acceptInvitationSuccess(state, task) {
    return state.set('acceptInvitation', Map({error: null, loading: false}));
}

function acceptInvitationError(state, error) {
    return state.set('acceptInvitation', Map({error: Immutable.fromJS(error), loading: false}));
}

function createOntology(state) {
    return state.set('createOntology', Map({ontology: null, error: null, loading: true}));
}

function createOntologySuccess(state, ontology) {
    const newState = viewTaskOntologySuccess(state, ontology)
    return newState.set('createOntology', Map({ontology: Immutable.fromJS(ontology), error: null, loading: false}));
}

function createOntologyError(state, error) {
    return state.set('createOntology', Map({ontology: null, error: Immutable.fromJS(error), loading: false}));
}

function ontologyTypes(state) {
    return state.set('ontologyTypes', Map({types: List.of(), error: null, loading: true}));
}

function ontologyTypesSuccess(state, types) {
    return state.set('ontologyTypes', Map({types: Immutable.fromJS(types), error: null, loading: false}));
}

function ontologyTypesError(state, error) {
    return state.set('ontologyTypes', Map({types: List.of(), error: Immutable.fromJS(error), loading: false}));
}

function viewTaskOntology(state) {
    return state.set('currentTaskOntology', Map({ontology: null, error: null, loading: true}));
}

function viewTaskOntologySuccess(state, ontology) {
    return state.set('currentTaskOntology', Map({ontology: Immutable.fromJS(ontology), error: null, loading: false}));
}

function viewTaskOntologyError(state, error) {
    return state.set('currentTaskOntology', Map({ontology: null, error: Immutable.fromJS(error), loading: false}));
}

function saveImageSource(state) {
    return state.set('savingImageSource', Map({error: null, loading: true}));
}

//TODO: NOT USING IMAGE SOURCE
//TODO: SHOULD UPDATE CURRENT IMAGE SOURCES, and maybe CURRENT IMAGE SOURCE
function saveImageSourceSuccess(state, imageSource, configs) {
    return state.set('savingImageSource', Map({error: null, loading: false}));
}

function saveImageSourceError(state, error) {
    return state.set('savingImageSource', Map({error: Immutable.fromJS(error), loading: false}));
}

function viewImageSource(state) {
    return state.set('currentImageSource', Map({imageSource: null, error: null, loading: true}));
}

function viewImageSourceSuccess(state, imageSource, configs) {
    return state.set('currentImageSource', Map({imageSource: Map({details: Immutable.fromJS(imageSource), configs: Immutable.fromJS(configs), error: null, loading: false})}));
}

function viewImageSourceError(state, error) {
    return state.set('currentImageSource', Map({imageSource: null, error: Immutable.fromJS(error), loading: false}));
}

function imageSourceTypes(state) {
    return state.set('imageSourceTypes', Map({types: List.of(), error: null, loading: true}));
}

function imageSourceTypesSuccess(state, types) {
    return state.set('imageSourceTypes', Map({types: Immutable.fromJS(types), error: null, loading: false}));
}

function imageSourceTypesError(state, error) {
    return state.set('imageSourceTypes', Map({types: List.of(), error: Immutable.fromJS(error), loading: false}));
}

function deleteImageSource(state) {
    return state.set('deletingImageSource', Map({error: null, loading: true}));
}

function deleteImageSourceSuccess(state, imageSourceId) {
    //TODO: MIGHT NEED TO DEAL W PRIMITIVE TYPES HERE ON FILTER
    const newImageSources = state.get('currentImageSources').filterNot(function(o){ return o.get('id') == imageSourceId});
    const newState = viewImageSourcesSuccess(state, newImageSources);
    const newNewState = newState.setIn(['currentImageSource', 'imageSource'], null);
    return newNewState.set('deletingImageSource', Map({error: null, loading: false}));
}

function deleteImageSourceError(state, error) {
    return state.set('deletingImageSource', Map({error: Immutable.fromJS(error), loading: false}));
}

function viewImageSources(state) {
    return state.set('currentImageSources', Map({imageSources: List.of(), error: null, loading: true}));
}

function viewImageSourcesSuccess(state, imageSources) {
    return state.set('currentImageSources', Map({imageSources: Immutable.fromJS(imageSources), error: null, loading: false}));
}

function viewImageSourcesError(state, error) {
    return state.set('currentImageSources', Map({imageSources: List.of(), error: Immutable.fromJS(error), loading: false}));
}

function deactivateParticipant(state) {
    return state.set('deactivatingParticipant', Map({error: null, loading: true}));
}

//TODO: SHOULD UPDATE TASK PARTICIPANTS
function deactivateParticipantSuccess(state, participant) {
    return state.set('deactivatingParticipant', Map({error: null, loading: false}));
}

function deactivateParticipantError(state, error) {
    return state.set('deactivatingParticipant', Map({error: Immutable.fromJS(error), loading: false}));
}

function activateParticipant(state) {
    return state.set('activatingParticipant', Map({error: null, loading: true}));
}

//TODO: SHOULD UPDATE TASK PARTICIPANTS
function activateParticipantSuccess(state, participant) {
    return state.set('activatingParticipant', Map({error: null, loading: false}));
}

function activateParticipantError(state, error) {
    return state.set('activatingParticipant', Map({error: Immutable.fromJS(error), loading: false}));
}

function markImageSeen(state) {
    return state.set('markingImageSeen', Map({error: null, loading: true}));
}

function markImageSeenSuccess(state, seen) {
    const newState = state.setIn(['currentImage', 'markedSeen'], true);
    return newState.set('markingImageSeen', Map({error: null, loading: false}));
}

function markImageSeenError(state, error) {
    return state.set('markingImageSeen', Map({error: Immutable.fromJS(error), loading: false}));
}

function nextImage(state) {
    return state.set('currentImage', Map({image: null, loadConfigs: null, markedSeen: false, error: null, loading: true}));
}

function nextImageSuccess(state, image, configs) {
    return state.set('currentImage', Map({image: Immutable.fromJS(image), loadConfigs: Immutable.fromJS(configs), markedSeen: false, error: null, loading: false}));
}

function nextImageError(state, error) {
    return state.set('currentImage', Map({image: null, loadConfigs: null, markedSeen: false, error: Immutable.fromJS(error), loading: false}));
}

function saveLabels(state) {
    return state.set('savingLabels', Map({error: null, loading: true}));
}

function saveLabelsSuccess(state, labels) {
    const newState = viewParticipantImageLabelsSuccess(state, labels);
    return newState.set('savingLabels', Map({error: null, loading: false}));
}

function saveLabelsError(state, error) {
    return state.set('savingLabels', Map({error: Immutable.fromJS(error), loading: false}));
}

function viewParticipantImageLabels(state) {
    return state.set('currentLabels', Map({labels: List.of(), error: null, loading: true}));
}

function viewParticipantImageLabelsSuccess(state, labels) {
    return state.set('currentLabels', Map({labels: Immutable.fromJS(labels), error: null, loading: false}));
}

function viewParticipantImageLabelsError(state, error) {
    return state.set('currentLabels', Map({labels: List.of(), error: Immutable.fromJS(error), loading: false}))
}

function signupEmailChanged(state, email) {
    return state.set('signupEmail', Map({ email: Immutable.fromJS(email) }))
}

function signupPasswordChanged(state, password) {
    return state.set('signupPassword', Map({ password: Immutable.fromJS(password) }))
}

function loginEmailChanged(state, email) {
    return state.set('loginEmail', Map({ email: Immutable.fromJS(email) }))
}

function loginPasswordChanged(state, password) {
    return state.set('loginPassword', Map({ password: Immutable.fromJS(password) }))
}

export default function reducer(state = Map(), action) {
  switch (action.type) {
    case 'CLEAN_STATE':
        return cleanState();
    case 'CREATE_USER':
        return createUser(state);
    case 'CREATE_USER_SUCCESS':
        return createUserSuccess(state, action.email);
    case 'CREATE_USER_ERROR':
        return createUserError(state, action.error);
    case 'LOGIN':
        return login(state);
    case 'LOGIN_SUCCESS':
        return loginSuccess(state, action.payload);
    case 'LOGIN_ERROR':
        return loginError(state, action.error);
    case 'LOGOUT':
        return logout(state);
    case 'LOGOUT_SUCCESS':
        return logoutSuccess(state, action.payload);
    case 'LOGOUT_ERROR':
        return logoutError(state, action.error);
    case 'SAVE_TASK':
        return saveTask(state);
    case 'SAVE_TASK_SUCCESS':
        return saveTaskSuccess(state, action.payload);
    case 'SAVE_TASK_ERROR':
        return saveTaskError(state, action.error);
    case 'VIEW_TASK':
        return viewTask(state);
    case 'VIEW_TASK_SUCCESS':
        return viewTaskSuccess(state, action.payload);
    case 'VIEW_TASK_ERROR':
        return viewTaskError(state, action.error);
    case 'TASKS_CREATED':
        return tasksCreated(state);
    case 'TASKS_CREATED_SUCCESS':
        return tasksCreatedSuccess(state, action.payload);
    case 'TASKS_CREATED_ERROR':
        return tasksCreatedError(state, action.error);
    case 'TASKS_PARTICIPATING':
        return tasksParticipating(state);
    case 'TASKS_PARTICIPATING_SUCCESS':
        return tasksParticipatingSuccess(state, action.payload);
    case 'TASKS_PARTICIPATING_ERROR':
        return tasksParticipatingError(state, action.error);
    case 'TASK_PARTICIPANTS':
        return taskParticipants(state);
    case 'TASK_PARTICIPANTS_SUCCESS':
        return taskParticipantsSuccess(state, action.payload);
    case 'TASK_PARTICIPANTS_ERROR':
        return taskParticipantsError(state, action.error);
    case 'PARTICIPANT_LINK':
        return participantLink(state);
    case 'PARTICIPANT_LINK_SUCCESS':
        return participantLinkSuccess(state, action.payload);
    case 'PARTICIPANT_LINK_ERROR':
        return participantLinkError(state, action.error);
    case 'ACCEPT_INVITATION':
        return acceptInvitation(state);
    case 'ACCEPT_INVITATION_SUCCESS':
        return acceptInvitationSuccess(state, action.payload);
    case 'ACCEPT_INVITATION_ERROR':
        return acceptInvitationError(state, action.error);
    case 'CREATE_ONTOLOGY':
        return createOntology(state);
    case 'CREATE_ONTOLOGY_SUCCESS':
        return createOntologySuccess(state, action.payload);
    case 'CREATE_ONTOLOGY_ERROR':
        return createOntologyError(state, action.error);
    case 'ONTOLOGY_TYPES':
        return ontologyTypes(state);
    case 'ONTOLOGY_TYPES_SUCCESS':
        return ontologyTypesSuccess(state, action.payload);
    case 'ONTOLOGY_TYPES_ERROR':
        return ontologyTypesError(state, action.error);
    case 'VIEW_TASK_ONTOLOGY':
        return viewTaskOntology(state);
    case 'VIEW_TASK_ONTOLOGY_SUCCESS':
        return viewTaskOntologySuccess(state, action.payload);
    case 'VIEW_TASK_ONTOLOGY_ERROR':
        return viewTaskOntologyError(state, action.error);
    case 'SAVE_IMAGE_SOURCE':
        return saveImageSource(state);
    case 'SAVE_IMAGE_SOURCE_SUCCESS':
        return saveImageSourceSuccess(state, action.payload, action.configs);
    case 'SAVE_IMAGE_SOURCE_ERROR':
        return saveImageSourceError(state, action.error);
    case 'VIEW_IMAGE_SOURCE':
        return viewImageSource(state);
    case 'VIEW_IMAGE_SOURCE':
        return viewImageSourceSuccess(state, action.payload, action.configs);
    case 'VIEW_IMAGE_ERROR':
        return viewImageSourceError(state, action.error);
    case 'IMAGE_SOURCE_TYPES':
        return imageSourceTypes(state);
    case 'IMAGE_SOURCE_TYPES_SUCCESS':
        return imageSourceTypesSuccess(state, action.payload);
    case 'IMAGE_SOURCE_TYPES_ERROR':
        return imageSourceTypesError(state, action.error);
    case 'DELETE_IMAGE_SOURCE':
        return deleteImageSource(state);
    case 'DELETE_IMAGE_SOURCE_SUCCESS':
        return deleteImageSourceSuccess(state, action.payload);
    case 'DELETE_IMAGE_SOURCE_ERROR':
        return deleteImageSourceError(state, action.error);
    case 'VIEW_IMAGE_SOURCES':
        return viewImageSources(state);
    case 'VIEW_IMAGE_SOURCES_SUCCESS':
        return viewImageSourcesSuccess(state, action.payload);
    case 'VIEW_IMAGE_SOURCES_ERROR':
        return viewImageSourcesError(state, action.error);
    case 'DEACTIVATE_PARTICIPANT':
        return deactivateParticipant(state);
    case 'DEACTIVATE_PARTICIPANT':
        return deactivateParticipantSuccess(state, action.payload);
    case 'DEACTIVATE_PARTICIPANT':
        return deactivateParticipantError(state, action.error);
    case 'ACTIVATE_PARTICIPANT':
        return activateParticipant(state);
    case 'ACTIVATE_PARTICIPANT':
        return activateParticipantSuccess(state, action.payload);
    case 'ACTIVATE_PARTICIPANT':
        return activateParticipantError(state, action.error);
    case 'MARK_IMAGE_SEEN':
        return markImageSeen(state);
    case 'MARK_IMAGE_SEEN_SUCCESS':
        return markImageSeenSuccess(state, action.payload);
    case 'MARK_IMAGE_SEEN_ERROR':
        return markImageSeenError(state, action.error);
    case 'NEXT_IMAGE':
        return nextImage(state);
    case 'NEXT_IMAGE_SUCCESS':
        return nextImageSuccess(state, action.payload, action.configs);
    case 'NEXT_IMAGE_ERROR':
        return nextImageError(state, action.error);
    case 'SAVE_LABELS':
        return saveLabels(state);
    case 'SAVE_LABELS_SUCCESS':
        return saveLabelsSuccess(state, action.payload);
    case 'SAVE_LABELS_ERROR':
        return saveLabelsError(state, action.error);
    case 'VIEW_PARTICIPANT_IMAGE_LABELS':
        return viewParticipantImageLabels(state);
    case 'VIEW_PARTICIPANT_IMAGE_LABELS_SUCCESS':
        return viewParticipantImageLabelsSuccess(state, action.payload);
    case 'VIEW_PARTICIPANT_IMAGE_LABELS_ERROR':
        return viewParticipantImageLabelsError(state, action.error);
    case SIGNUP_EMAIL_CHANGED:
        return signupEmailChanged(state, action.email);
    case SIGNUP_PASSWORD_CHANGED:
        return signupPasswordChanged(state, action.password);
    case LOGIN_EMAIL_CHANGED:
        return loginEmailChanged(state, action.email);
    case LOGIN_PASSWORD_CHANGED:
        return loginPasswordChanged(state, action.password);
    default:
      return state;
  }
}