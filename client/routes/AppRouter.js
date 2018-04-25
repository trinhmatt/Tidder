import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import PrivateRoute from './PrivateRoute'
import Home from '../components/Home'
import Login from '../components/Login'
import Register from '../components/Register'
import RegisterSuccess from '../components/RegisterSuccess'
import CreateSubtidder from '../components/CreateSubtidder'
import CreateSuccess from '../components/CreateSuccess'
import CreateFail from '../components/CreateFail'
import SubHome from '../components/SubHome'
import CreatePost from '../components/CreatePost'
import Unauthorized from '../components/Unauthorized'
import NotFound from '../components/NotFound'
import Post from '../components/Post'
import DeleteConfirmation from '../components/DeleteConfirmation'
import EditPost from '../components/EditPost'
import EditConfirmation from '../components/EditConfirmation'

export const history = createHistory()

export const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>
        <Route path='/' component={Home} exact={true} />
        <Route path='/404' component={NotFound} exact={true} />
        <Route path='/t/:sub' component={SubHome} exact={true} />
        <PrivateRoute path='/t/:sub/create' component={CreatePost} exact={true} />
        <Route path='/t/:sub/:id' component={Post} exact={true} />
        <PrivateRoute path='/t/:sub/:id/edit' component={EditPost} exact={true} />
        <Route path='/t/:sub/:id/edit/success' component={EditConfirmation} />
        <Route path='/t/:sub/:id/edit/fail' component={CreateFail} />
        <Route path='/t/:sub/create/success' component={CreateSuccess} />
        <Route path='/t/:sub/create/fail' component={CreateFail} />
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} exact={true} />
        <Route path='/registersuccess' component={RegisterSuccess} />
        <PrivateRoute path='/createsubtidder' component={CreateSubtidder} exact={true} />
        <Route path='/createsubtidder/success' component={CreateSuccess} />
        <Route path='/createsubtidder/fail' component={CreateFail} />
        <Route path='/unauthorized' component={Unauthorized} />
        <Route path='/deleteconfirm' component={DeleteConfirmation} />
      </Switch>
    </div>
  </Router>
);

export default AppRouter;
