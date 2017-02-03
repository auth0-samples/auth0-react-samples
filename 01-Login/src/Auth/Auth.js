import { browserHistory } from 'react-router';
import { EventEmitter } from 'events'
import Auth0Lock from 'auth0-lock';
import decode from 'jwt-decode';
import { AUTH_CONFIG } from './auth0-variables';

export default class Auth extends EventEmitter {
  lock = new Auth0Lock(AUTH_CONFIG.clientId, AUTH_CONFIG.domain, {
    oidcConformant: true,
    autoclose: true,
    auth: {
      callbackUrl: AUTH_CONFIG.callbackUrl,
      responseType: 'token id_token',
      params: {
        audience: `https://${AUTH_CONFIG.domain}/userinfo`
      }
    }
  });
  constructor() {
    super();
    // Add callback Lock's `authenticated` event
    this.lock.on('authenticated', this._doAuthentication.bind(this));
    // Add callback for Lock's `authorization_error` event
    this.lock.on('authorization_error', this._authorizationError.bind(this));
    // binds functions to keep this context
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  login() {
    // Call the show method to display the widget.
    this.lock.show();
  }

  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    // navigate to the home route
    browserHistory.replace('/home');
  }

  _doAuthentication(authResult) {
    if (authResult && authResult.accessToken && authResult.idToken) {
      // Saves the user's access token and ID token
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      // navigate to the home route
      browserHistory.replace('/home');
    }
  }

  _authorizationError(error) {
    // Unexpected authentication error
    console.log('Authentication Error', error);
  }

  isAuthenticated() {
    // Checks whether the token exists and is unexpired
    const token = localStorage.getItem('id_token');
    return !!token && decode(token).exp > Date.now() / 1000;
  }
}
