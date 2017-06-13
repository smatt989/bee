import {createStore, applyMiddleware, compose} from 'redux';
import { cleanState } from './actions'
import reducer from './reducer';
import promise from 'redux-promise';

function initStore() {
  const createStoreWithMiddleware = applyMiddleware(
    promise
  )(createStore);
  const store = createStoreWithMiddleware(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
  store.dispatch(cleanState());
  return store;
}

const store = initStore();
export default store;