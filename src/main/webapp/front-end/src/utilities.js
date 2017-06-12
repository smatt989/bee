import store from './store.js';
import { login, loginError, loginSuccess, loginClearInputs } from './actions.js';
var _ = require('lodash');

export var authenticatedSession = null;

export var authenticationHeader = "bee-session-key"

export function setSession(session) {
    authenticatedSession = session
}

export function authenticate() {
    var authentication = {}
    authentication[authenticationHeader] = authenticatedSession
    return authentication
}

export const tryLogin = (email, password) => {
    return store.dispatch(login(email, password))
        .then(response => {
          if (response.error) {
            store.dispatch(loginError(response.error));
            return false;
          }

          const session = response.payload.headers[authenticationHeader];
          if (!session) {
            return false;
          }
          
          store.dispatch(loginSuccess(session));
          return true;
        })
}