import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import reducer from './reducer';
import {setState, loadTriggerElementSubTypes, loadTriggerElementSubTypesSuccess, loadTriggerElementSubTypesError, cleanState} from './action_creators';
import promise from 'redux-promise';
import App from './components/App';
import Register from './components/Register';

const createStoreWithMiddleware = applyMiddleware(
  promise
)(createStore);
const store = createStoreWithMiddleware(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

store.dispatch(cleanState());

store.dispatch(loadTriggerElementSubTypes()).then((response) => {
               !response.error ? store.dispatch(loadTriggerElementSubTypesSuccess(response.payload.data)) : store.dispatch(loadTriggerElementSubTypesError(response.error));
           });

const routes = <Route component={App}>
  <Route path="/" component={Register} />
</Route>;

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>{routes}</Router>
  </Provider>,
  document.getElementById('app')
);

