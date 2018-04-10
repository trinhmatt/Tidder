import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import App from '../components/App'
import Register from '../components/Register'
import RegisterSuccess from '../components/RegisterSuccess'

export const AppRouter = () => (
  <BrowserRouter>
    <Switch>
      <Route path='/' component={App} exact={true} />
      <Route path='/register' component={Register} exact={true} />
      <Route path='/registersuccess' component={RegisterSuccess} />
    </Switch>
  </BrowserRouter>
);

export default AppRouter;
