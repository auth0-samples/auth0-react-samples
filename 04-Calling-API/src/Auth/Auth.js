import { browserHistory } from 'react-router';
import { EventEmitter } from 'events';
import Auth0Lock from 'auth0-lock';
import { AUTH_CONFIG } from './auth0-variables';

export default class Auth extends EventEmitter {
  lock = new Auth0Lock(AUTH_CONFIG.clientId, AUTH_CONFIG.domain, {
    oidcConformant: true,
    autoclose: true,
    auth: {
      redirectUrl: AUTH_CONFIG.callbackUrl,
      responseType: 'token id_token',
      audience: AUTH_CONFIG.apiUrl, 
      params: { 
        scope: 'openid profile' 
      }
    }
  });

  userProfile;

  constructor() {
    super();
    // Add callback Lock's `authenticated` event
    this.lock.on('authenticated', this.setSession.bind(this));
    // Add callback for Lock's `authorization_error` event
    this.lock.on('authorization_error', error => console.log(error));
    // binds functions to keep this context
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.authFetch = this.authFetch.bind(this);
  }

  login() {
    // Call the show method to display the widget.
    this.lock.show();
  }

  setSession(authResult) {
    if (authResult && authResult.accessToken && authResult.idToken) {
      // Set the time that the access token will expire at
      let expiresAt = JSON.stringify(
        authResult.expiresIn * 1000 + new Date().getTime()
      );
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('expires_at', expiresAt);
      // navigate to the home route
      browserHistory.replace('/home');
    }
  }

  getAccessToken() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }
    return accessToken;
  }

  getProfile(cb) {
    let accessToken = this.getAccessToken();
    this.lock.getUserInfo(accessToken, (err, profile) => {
      if (profile) {
        this.userProfile = profile;
      }
      cb(err, profile);
    });
  }

  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    this.userProfile = null;
    // navigate to the home route
    browserHistory.replace('/home');
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  authFetch(url, options) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };

    if (this.isAuthenticated()) {
      headers['Authorization'] = 'Bearer ' + this.getAccessToken();
    }

    return fetch(url, { headers, ...options })
      .then(this.checkStatus)
      .then(response => response.json());
  }

  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      let error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }
}
