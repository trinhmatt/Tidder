import React from 'react';
import { Route } from 'react-router-dom';
import Header from '../components/Header';


const PublicRoute = ({component: Component, ...rest}) => (
  <Route {...rest} component={ (props) => (
      <div>
        <Header />
        <Component {...props}/>
      </div>
    )
  }/>
);

export default PublicRoute;
