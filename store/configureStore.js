import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import authReducer from './reducers/auth'
import userReducer from './reducers/user'
import thunk from 'redux-thunk'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(
    combineReducers({
      auth: authReducer,
      user: userReducer
    }),
    composeEnhancers(applyMiddleware(thunk))
  );
  return store
}
