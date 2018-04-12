import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import App from '../components/App'
import Login from '../components/Login'
import Register from '../components/Register'
import RegisterSuccess from '../components/RegisterSuccess'
import CreateSubtidder from '../components/CreateSubtidder'

const history = createHistory()

export const AppRouter = () => (
  <Router history={history}>
    <Switch>
      <Route path='/' component={App} exact={true} />
      <Route path='/login' component={Login} />
      <Route path='/register' component={Register} exact={true} />
      <Route path='/registersuccess' component={RegisterSuccess} />
      <Route path='/createsubtidder' component={CreateSubtidder} />
    </Switch>
  </Router>
);

export default AppRouter;
