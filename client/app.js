import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import axios from 'axios'
import AppRouter from './routes/AppRouter'
import configureStore from '../store/configureStore'
import './css/styles.scss'
import 'normalize.css/normalize.css'
import { login } from '../store/actions/auth'
import { getSubs } from '../store/actions/subs'

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
        const user = response.data
        store.dispatch(login(user))
        renderApp();
      } else {
        renderApp();
      }
    })
    .catch( (error) => {
      console.log(error)
    })
}

authDispatch();
