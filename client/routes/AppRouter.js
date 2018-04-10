import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import App from '../components/App'
import Test from '../components/Test'
import RegisterSuccess from '../components/RegisterSuccess'

export const AppRouter = () => (
  <BrowserRouter>
    <Switch>
      <Route exact={true} path='/' component={App} />
      <Route path='/test' component={Test} />
      <Route path='/registersuccess' component={RegisterSuccess} />
    </Switch>
  </BrowserRouter>
);

export default AppRouter;
