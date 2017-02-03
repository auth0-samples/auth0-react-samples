import { browserHistory } from 'react-router';
import { EventEmitter } from 'events';
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
      params: { audience: AUTH_CONFIG.apiUrl }
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
    this.authFetch = this.authFetch.bind(this);
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
    console.log(authResult)
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

  getAccessToken() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }
    return accessToken;
  }
  

  authFetch(url, options) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }

    if (this.isAuthenticated()) {
      headers['Authorization'] = 'Bearer ' + this.getAccessToken();
    }

    return fetch(url, { headers, ...options })
      .then(this._checkStatus)
      .then(response => response.json());
  }

  _checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      let error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }
}
