import history from '../history';
import auth0 from 'auth0-js';
import { AUTH_CONFIG } from './auth0-variables';

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    audience: `https://${AUTH_CONFIG.domain}/userinfo`,
    responseType: 'token id_token',
    scope: 'openid'
  });

  expires;
  accessToken;

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
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

  logout() {
    this.expires = null;
    this.accessToken = null;

    this.goTo('/home');
  }

  goTo(path) {
    history.replace(path);
  }

  isAuthenticated() {
    return this.expires && (Date.now() < JSON.parse(this.expires)) && this.accessToken;
  }
}
