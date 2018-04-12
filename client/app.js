import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import AppRouter from './routes/AppRouter'
import configureStore from '../store/configureStore'

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
