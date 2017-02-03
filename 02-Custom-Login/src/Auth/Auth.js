import { browserHistory } from 'react-router';
import { EventEmitter } from 'events';
import auth0 from 'auth0-js';
import decode from 'jwt-decode';
import { AUTH_CONFIG } from './auth0-variables';

export default class Auth extends EventEmitter {
  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    audience: `https://${AUTH_CONFIG.domain}/userinfo`,
    responseType: 'token id_token'
  });

  constructor() {
    super();
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.loginWithGoogle = this.loginWithGoogle.bind(this);
    this.logout = this.logout.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
  }

  login(username, password) {
    this.auth0.client.login(
      { realm: 'Username-Password-Authentication', username, password },
      (err, authResult) => {
        if (err) {
          alert(`Error: ${err.description}`);
          return;
        }
        if (authResult && authResult.accessToken && authResult.idToken) {
          this.setUser(authResult);
          browserHistory.replace('/home');
        }
      }
    );
  }

  signup(email, password) {
    this.auth0.redirect.signupAndLogin(
      { connection: 'Username-Password-Authentication', email, password },
      function(err) {
        if (err) {
          alert(`Error: ${err.description}`);
        }
      }
    );
  }

  loginWithGoogle() {
    this.auth0.authorize({ connection: 'google-oauth2' });
  }

  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    // navigate to the home route
    browserHistory.replace('/home');
  }

  isAuthenticated() {
    // Checks whether the token exists and is unexpired
    const token = localStorage.getItem('id_token');
    return !!token && decode(token).exp > Date.now() / 1000;
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setUser(authResult);
        browserHistory.replace('/home');
      } else if (authResult && authResult.error) {
        alert(`Error: ${authResult.error}`);
      }
    });
  }

  setUser(authResult) {
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
  }
}
