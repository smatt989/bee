import {createStore, applyMiddleware} from 'redux';
import { cleanState } from './actions';
import reducer from './reducer';
import promise from 'redux-promise';
import thunk from 'redux-thunk';

function initStore() {
  let middleware = [promise, thunk];
  const createStoreWithMiddleware = applyMiddleware(
    ...middleware
  )(createStore);

  const store = createStoreWithMiddleware(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
  store.dispatch(cleanState());
  return store;
}

const store = initStore();
export default store;
