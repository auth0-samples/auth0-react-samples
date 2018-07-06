import auth0 from 'auth0-js';
import { AUTH_CONFIG } from './auth0-variables';
import history from '../history';

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    audience: `https://${AUTH_CONFIG.domain}/userinfo`,
    responseType: 'token id_token',
    scope: 'openid profile'
  });

  expires;
  accessToken;
  userProfile;

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        this.goTo('/home');
      } else if (err) {
        this.goTo('/home');
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  setSession(authResult) {
    this.expires = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    this.accessToken = authResult.accessToken;
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

    this.goTo('/home');
  }

  goTo(path) {
    history.replace(path);
  }

  isAuthenticated() {
    return this.expires && (Date.now() < JSON.parse(this.expires)) && this.accessToken;
  }
}
