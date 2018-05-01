import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import authReducer from './reducers/auth'
import subReducer from './reducers/subs'
import thunk from 'redux-thunk'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(
    combineReducers({
      auth: authReducer,
      subs: subReducer
    }),
    composeEnhancers(applyMiddleware(thunk))
  );
  return store
}
