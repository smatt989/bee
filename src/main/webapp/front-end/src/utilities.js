var _ = require('lodash');

export var authenticatedSession = null;

export var authenticationHeader = "Bee-Session-Key"

export function setSession(session) {
    authenticatedSession = session
}

export function authenticate() {
    var authentication = {}
    authentication[authenticationHeader] = authenticatedSession
    return authentication
}