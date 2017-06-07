import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import reducer from './reducer';
import {SET_USER} from './actions';
import promise from 'redux-promise';
import App from './components/App';

const initialState = {
  userId: null
}

const createStoreWithMiddleware = applyMiddleware(
  promise
)(createStore);
const store = createStoreWithMiddleware(reducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

// Set fake user id to test redux
store.dispatch({ type: SET_USER, userId: 1 });

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);

