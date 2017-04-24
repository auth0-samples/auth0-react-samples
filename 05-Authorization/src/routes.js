import React from 'react';
import { Redirect, Route, BrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './Home/Home';
import Profile from './Profile/Profile';
import Admin from './Admin/Admin';
import Ping from './Ping/Ping';
import Callback from './Callback/Callback';
import Auth from './Auth/Auth';

const auth = new Auth();

export const makeMainRoutes = () => {
  return (
    <BrowserRouter history={history} component={App}>
        <div>
          <Route path="/" render={(props) => <App auth={auth} {...props} />} />
          <Route path="/home" render={(props) => <Home auth={auth} {...props} />} />
          <Route path="/profile" render={(props) => (!auth.isAuthenticated() ? (<Redirect to="/home"/>) : (<Profile auth={auth} {...props} />))} />
          <Route path="/ping" render={(props) => (!auth.isAuthenticated() ? (<Redirect to="/home"/>) : (<Ping auth={auth} {...props} />))} />
          <Route path="/admin" render={(props) => ((!auth.isAuthenticated() || !auth.isAdmin()) ? (<Redirect to="/home"/>) : (<Admin auth={auth} {...props} />))} />
          <Route path="/callback" render={(props) => <Callback {...props} />} />
        </div>
      </BrowserRouter>
  );
}
