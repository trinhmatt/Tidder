import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import Home from '../components/Home'
import Login from '../components/Login'
import Register from '../components/Register'
import RegisterSuccess from '../components/RegisterSuccess'
import CreateSubtidder from '../components/CreateSubtidder'
import CreateSubSuccess from '../components/CreateSubSuccess'
import CreateSubFail from '../components/CreateSubFail'

export const history = createHistory()

export const AppRouter = () => (
  <Router history={history}>
    <Switch>
      <Route path='/' component={Home} exact={true} />
      <Route path='/login' component={Login} />
      <Route path='/register' component={Register} exact={true} />
      <Route path='/registersuccess' component={RegisterSuccess} />
      <Route path='/createsubtidder' component={CreateSubtidder} exact={true} />
      <Route path='/createsubtidder/success' component={CreateSubSuccess} />
      <Route path='/createsubtidder/fail' component={CreateSubFail} />
    </Switch>
  </Router>
);

export default AppRouter;
