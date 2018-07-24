import auth0 from 'auth0-js';
import history from '../history';
import { AUTH_CONFIG } from './auth0-variables';

export default class Auth {
  expires;
  accessToken;
  userProfile;
  tokenRenewalTimeout;

  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    responseType: 'token id_token',
  });

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.renewAuthentication = this.renewAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.goTo = this.goTo.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (err) {
        this.goTo('/home');
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      } else if (authResult && authResult.accessToken) {
        this.storeToken(authResult);
        this.goTo('/home');
      }
    });
  }

  renewAuthentication() {
    this.auth0.checkSession({}, (err, authResult) => {
        if (err) {
          this.logout();
        } else if (authResult && authResult.accessToken) {
          this.storeToken(authResult);
          this.goTo('/home');
        }
      }
    );
  }

  storeToken(authResult) {
    this.expires = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    this.accessToken = authResult.accessToken;

    localStorage.setItem('loggedIn', 'true');

    this.scheduleRenewal();
  }

  scheduleRenewal() {
    const expiresAt = JSON.parse(this.expires);
    const delay = expiresAt - Date.now();
    if (delay > 0) {
      this.tokenRenewalTimeout = setTimeout(() => {
        this.renewAuthentication();
      }, delay);
    }
  }

  getAccessToken() {
    if (!this.accessToken) {
      throw new Error('No access token found');
    }

    return this.accessToken;
  }

  getProfile(cb) {
    let accessToken = this.getAccessToken();
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        this.userProfile = profile;
      }
      cb(err, profile);
    });
  }

  logout() {
    this.expires = null;
    this.accessToken = null;
    this.userProfile = null;
    clearTimeout(this.tokenRenewalTimeout);

    localStorage.removeItem('loggedIn');

    this.goTo('/home');
  }

  goTo(path) {
    history.replace(path);
  }

  isAuthenticated() {
    return localStorage.getItem('loggedIn') === 'true';
  }
}
