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
      console.log('axios failed', error)
    })
}
//Trying to add an auth listener that will redirect the user once they successfully login
//Adding this makes the axios post in the login action throw an error when it shouldnt
//Since I'm still getting a response from the backend....

// function changeHandler() {
//   const currentState = store.getState()
//
//   console.log(currentState)
//
//   if (currentState.auth.id && history.location.pathname === '/login') {
//     renderApp()
//     history.push('/')
//   } else {
//     renderApp()
//   }
// }
//
// const unsubscribe = store.subscribe(changeHandler)
renderApp();
authDispatch();
