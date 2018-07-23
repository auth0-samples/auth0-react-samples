import auth0 from 'auth0-js';
import history from '../history';
import { AUTH_CONFIG } from './auth0-variables';

export default class Auth {
  expires;
  accessToken;

  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    audience: `https://${AUTH_CONFIG.domain}/userinfo`,
    responseType: 'token',
    scope: 'openid'
  });

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.goTo = this.goTo.bind(this);

    if (localStorage.getItem('loggedIn') === 'true') {
      this.renewAuthentication();
    }
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
          console.log(err);
          alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
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
  }

  logout() {
    this.expires = null;
    this.accessToken = null;

    localStorage.removeItem('loggedIn');

    this.goTo('/home');
  }

  goTo(path) {
    history.replace(path);
  }

  isAuthenticated() {
    return this.expires && (Date.now() < JSON.parse(this.expires)) && this.accessToken;
  }
}
