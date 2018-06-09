import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'
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
import PostPage from '../components/PostPage'
import DeleteConfirmation from '../components/DeleteConfirmation'
import EditPost from '../components/EditPost'
import EditConfirmation from '../components/EditConfirmation'
import Profile from '../components/Profile'
import SavedPosts from '../components/SavedPosts'

export const history = createHistory()

export const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>
        <PublicRoute path='/' component={Home} exact={true} />
        <PublicRoute path='/404' component={NotFound} exact={true} />
        <PublicRoute path='/t/:sub' component={SubHome} exact={true} />
        <PrivateRoute path='/t/:sub/create' component={CreatePost} exact={true} />
        <PublicRoute path='/t/:sub/:id' component={PostPage} exact={true} />
        <PrivateRoute path='/t/:sub/:id/edit' component={EditPost} exact={true} />
        <PrivateRoute path='/t/:sub/:id/editcomment' component={EditPost} exact={true} />
        <PublicRoute path='/t/:sub/:id/edit/success' component={EditConfirmation} />
        <PublicRoute path='/t/:sub/:id/edit/fail' component={CreateFail} />
        <PublicRoute path='/t/:sub/create/success' component={CreateSuccess} />
        <PublicRoute path='/t/:sub/create/fail' component={CreateFail} />
        <PublicRoute path='/login' component={Login} />
        <PublicRoute path='/register' component={Register} exact={true} />
        <PublicRoute path='/registersuccess' component={RegisterSuccess} />
        <PublicRoute path='/user/:username' component={Profile} exact={true} />
        <PrivateRoute path='/user/:username/saved' component={SavedPosts} />
        <PrivateRoute path='/createsubtidder' component={CreateSubtidder} exact={true} />
        <PublicRoute path='/createsubtidder/success' component={CreateSuccess} />
        <PublicRoute path='/createsubtidder/fail' component={CreateFail} />
        <PublicRoute path='/unauthorized' component={Unauthorized} />
        <PublicRoute path='/deleteconfirm' component={DeleteConfirmation} />
      </Switch>
    </div>
  </Router>
);

export default AppRouter;
