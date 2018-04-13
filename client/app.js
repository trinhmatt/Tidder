import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import axios from 'axios'
import AppRouter from './routes/AppRouter'
import configureStore from '../store/configureStore'
import { login } from '../store/actions/auth'

const store = configureStore();

const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

//AUTH LISTENER
let hasRendered = false;

const renderApp = () => {
  if (!hasRendered) {
    ReactDOM.render(jsx, document.getElementById('app'))
    hasRendered = true
  }
}

const authDispatch = () => {
  axios.get('/currentuser')
    .then( (response) => {
      //Check if user is logged in, if yes => dispatch logIn action
      if (response.data) {
        const id = response.data._id,
              username = response.data.username;

        store.dispatch(login(id, username))
      }
    })
    .catch( (error) => {
      console.log(error)
    })
}

renderApp();
authDispatch();
