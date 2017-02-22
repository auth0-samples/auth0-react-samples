import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import App from './App';
import Home from './Home/Home';
import Login from './Login/Login';
import Callback from './Callback/Callback';
import Auth from './Auth/Auth';

const auth = new Auth();

const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication(nextState.location.hash);
  }
}

export const makeMainRoutes = () => {
  return (
    <Route path="/" component={App} auth={auth}>
      <IndexRedirect to="/home" />
      <Route path="home" component={Home} auth={auth} />
      <Route path="login" component={Login} auth={auth} />
      <Route path="callback" component={Callback} onEnter={handleAuthentication} />
    </Route>
  );
};
