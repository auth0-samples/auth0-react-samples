import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import App from './App';
import Home from './Home/Home';
import Profile from './Profile/Profile';
import Ping from './Ping/Ping';
import Callback from './Callback/Callback';
import Auth from './Auth/Auth';

const auth = new Auth();

const requireAuth = (nextState, replace) => {
  if (!auth.isAuthenticated()) {
    replace({ pathname: '/home' });
  }
}

export const makeMainRoutes = () => {
  return (
    <Route path="/" component={App} auth={auth}>
      <IndexRedirect to="/home" />
      <Route path="home" component={Home} auth={auth} />
      <Route path="profile" component={Profile} auth={auth} onEnter={requireAuth} />
      <Route path="ping" component={Ping} auth={auth} onEnter={requireAuth} />
      <Route path="callback" component={Callback} />
    </Route>
  );
}
