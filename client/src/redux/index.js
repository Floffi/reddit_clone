import reduxThunk from 'redux-thunk';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import auth from './auth';
import modals from './modals';
import communities from './communities';
import posts from './posts';
import comments from './comments';
import { LOGOUT_SUCCESS } from './auth';

const resetEnhancer = (rootReducer) => (state, action) => {
  if (action.type !== LOGOUT_SUCCESS) return rootReducer(state, action);

  const newState = rootReducer(undefined, {});

  return newState;
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middlewares = [reduxThunk];

const reducer = combineReducers({
  auth,
  modals,
  communities,
  posts,
  comments,
});

const store = createStore(
  resetEnhancer(reducer),
  composeEnhancers(applyMiddleware(...middlewares))
);

export default store;
