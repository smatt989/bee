import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import reducer from './reducer';
import {SET_USER} from './actions';
import promise from 'redux-promise';
import App from './components/App';
import Home from './components/Home';
import Register from './components/Register';

const initialState = {
  userId: null
}

const createStoreWithMiddleware = applyMiddleware(
  promise
)(createStore);
const store = createStoreWithMiddleware(reducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

// Set fake user id to test redux
store.dispatch({ type: SET_USER, userId: 1 });

const routes = <Route component={App}>
  <Route path="/" component={Home} />
  <Route path="/register" component={Register} />
</Route>;

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>{routes}</Router>
  </Provider>,
  document.getElementById('app')
);

