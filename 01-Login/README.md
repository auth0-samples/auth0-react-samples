# Auth0 React Login

This sample demonstrates how to add authentication to a React application with Auth0. The sample makes use of Auth0's hosted login page which provides centralized authentication.

## Getting Started

If you haven't already done so, [sign up](https://auth0.com) for your free Auth0 account and create a new client in the [dashboard](https://manage.auth0.com). Find the **domain** and **client ID** from the settings area and add the URL for your application to the **Allowed Callback URLs** box. The default URL is `http://localhost:3000/callback`. Also configure **Allowed Web Origins** to the default application URL `http://localhost:3000`.

Clone the repo or download it from the React quickstart page in Auth0's documentation.

Open the demo.

```bash
cd 01-Login
```

Install the dependencies for the app.

```
npm install
```

## Set the Client ID and Domain

If you download the sample from the quickstart page, it will come pre-populated with the **client ID** and **domain** for your application. If you clone the repo directly from Github, rename the `auth0-variables.js.example` file to `auth0-variables.js` and provide the **client ID** and **domain** there. This file is located in `src/Auth/`.

## Run the Application

The demo comes ready to serve locally using react-scripts.

```bash
npm start
```

The application will be served at `http://localhost:3000`.

## Run the Application With Docker

In order to run the example with docker you need to have `docker` installed.

You also need to set the environment variables as explained [previously](#set-the-client-id-and-domain).

Execute in command line `sh exec.sh` to run the Docker in Linux, or `.\exec.ps1` to run the Docker in Windows.

## Tutorial

### Create an Authentication Service

Create a service to manage and coordinate user authentication. You can give the service any name. In the examples below, the service is `Auth` and the filename is `Auth.js`.

In the service add an instance of the `auth0.WebAuth` object. When creating that instance, you can specify the following:

- Configuration for your application and domain
- Response type, to show that you need a user's Access Token and an ID Token after authentication
- Audience and scope, specifying that you need an `access_token` that can be used to invoke the [/userinfo endpoint](/api/authentication#get-user-info).
- The URL where you want to redirect your users after authentication.

> **Note:** In this tutorial, the route is `/callback`, which is implemented in the [Add a Callback Component](#add-a-callback-component) step.

Add a `login` method that calls the `authorize` method from auth0.js.

```js
// src/Auth/Auth.js

import auth0 from "auth0-js";

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: "YOUR AUTH0 DOMAIN",
    clientID: "YOUR AUTH0 CLIENT ID",
    redirectUri: "http://localhost:3000/callback",
    responseType: "token id_token",
    scope: "openid"
  });

  login() {
    this.auth0.authorize();
  }
}
```

#### Checkpoint

Try to import the `Auth` service from somewhere in your application. Call the `login` method from the service to see the login page.
For example:

```js
// App.js
import Auth from "./Auth/Auth.js";

const auth = new Auth();
auth.login();
```

## Handle Authentication Tokens

Add more methods to the `Auth` service to handle authentication in the app.

The example below shows the following methods:

- `handleAuthentication`: looks for the result of authentication in the URL hash. Then, the result is processed with the `parseHash` method from auth0.js
- `setSession`: sets the user's Access Token, ID Token, and the Access Token's expiry time
- `logout`: removes the user's tokens and expiry time from browser storage
- `isAuthenticated`: checks whether the expiry time for the user's Access Token has passed

```js
// src/Auth/Auth.js

import history from "../history";

// ...
export default class Auth {
  accessToken;
  idToken;
  expiresAt;

  // ...

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.renewSession = this.renewSession.bind(this);
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        history.replace("/home");
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  getAccessToken() {
    return this.accessToken;
  }

  getIdToken() {
    return this.idToken;
  }

  setSession(authResult) {
    // Set isLoggedIn flag in localStorage
    localStorage.setItem("isLoggedIn", "true");

    // Set the time that the Access Token will expire at
    let expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;

    // navigate to the home route
    history.replace("/home");
  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        this.logout();
        console.log(err);
        alert(
          `Could not get a new token (${err.error}: ${err.error_description}).`
        );
      }
    });
  }

  logout() {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;

    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem("isLoggedIn");

    this.auth0.logout({
      returnTo: window.location.origin
    });

    // navigate to the home route
    history.replace("/home");
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = this.expiresAt;
    return new Date().getTime() < expiresAt;
  }
}
```

```js
// src/history.js

import createHistory from "history/createBrowserHistory";

export default createHistory();
```

### Provide a Login Control

Provide a component with controls for the user to log in and log out.

```js
// src/App.js

import React, { Component } from "react";
import { Navbar, Button } from "react-bootstrap";
import "./App.css";

class App extends Component {
  goTo(route) {
    this.props.history.replace(`/${route}`);
  }

  login() {
    this.props.auth.login();
  }

  logout() {
    this.props.auth.logout();
  }

  componentDidMount() {
    const { renewSession } = this.props.auth;

    if (localStorage.getItem("isLoggedIn") === "true") {
      renewSession();
    }
  }

  render() {
    const { isAuthenticated } = this.props.auth;

    return (
      <div>
        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">Auth0 - React</a>
            </Navbar.Brand>
            <Button
              bsStyle="primary"
              className="btn-margin"
              onClick={this.goTo.bind(this, "home")}
            >
              Home
            </Button>
            {!isAuthenticated() && (
              <Button
                bsStyle="primary"
                className="btn-margin"
                onClick={this.login.bind(this)}
              >
                Log In
              </Button>
            )}
            {isAuthenticated() && (
              <Button
                bsStyle="primary"
                className="btn-margin"
                onClick={this.logout.bind(this)}
              >
                Log Out
              </Button>
            )}
          </Navbar.Header>
        </Navbar>
      </div>
    );
  }
}

export default App;
```

> **Note:** This example uses Bootstrap styles. You can use any style library you want, or not use one at all.

Depending on whether the user is authenticated or not, they see the **Log In** or **Log Out** button. The `click` events on the buttons make calls to the `Auth` service to let the user log out or log in. When the user clicks the **Log In** button, they are redirected to the login page.

> **Note:** The login page uses the Lock widget. To learn more about Universal Login and the login page, see the [Universal Login documentation](/hosted-pages/login). To customize the look and feel of the Lock widget, see the [Lock customization options documentation](/libraries/lock/v10/customization).

### Add a Callback Component

When you use the login page, your users are taken away from your application. After they authenticate, the users automatically return to your application and a client-side session is set for them.

> **Note:** This example assumes you are using path-based routing with `<BrowserRouter>`. If you are using hash-based routing, you will not be able to specify a dedicated callback route. The URL hash will be used to hold the user's authentication information.

You can select any URL in your application for your users to return to. We recommend creating a dedicated callback route.
If you create a single callback route:

- You don't have to whitelist many, sometimes unknown, callback URLs.
- You can display a loading indicator while the application sets up a client-side session.

Create a component named `CallbackComponent` and add a loading indicator.

> **Note:** To display a loading indicator, you need a loading spinner or another indicator in the `assets` directory. See the downloadable sample for demonstration.

```js
// src/Callback/Callback.js

import React, { Component } from 'react';
import loading from './loading.svg';

class Callback extends Component {
  render() {
    const style = //...

    return (
      <div style={style}>
        <img src={loading} alt="loading"/>
      </div>
    );
  }
}

export default Callback;
```

After authentication, your users are taken to the `/callback` route. They see the loading indicator while the application sets up a client-side session for them. After the session is set up, the users are redirected to the `/home` route.

### Process the Authentication Result

When a user authenticates at the login page, they are redirected to your application. Their URL contains a hash fragment with their authentication information. The `handleAuthentication` method in the `Auth` service processes the hash.

Call the `handleAuthentication` method after you render the `Callback` route. The method processes the authentication hash fragment when the `Callback` component initializes.

```js
// src/routes.js

import React from "react";
import { Route, Router } from "react-router-dom";
import App from "./App";
import Home from "./Home/Home";
import Callback from "./Callback/Callback";
import Auth from "./Auth/Auth";
import history from "./history";

const auth = new Auth();

const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
};

export const makeMainRoutes = () => {
  return (
    <Router history={history} component={App}>
      <div>
        <Route path="/" render={props => <App auth={auth} {...props} />} />
        <Route path="/home" render={props => <Home auth={auth} {...props} />} />
        <Route
          path="/callback"
          render={props => {
            handleAuthentication(props);
            return <Callback {...props} />;
          }}
        />
      </div>
    </Router>
  );
};
```

## What is Auth0?

Auth0 helps you to:

- Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, among others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
- Add authentication through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
- Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
- Support for generating signed [Json Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.
- Analytics of how, when and where users are logging in.
- Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).

## Create a Free Auth0 Account

1. Go to [Auth0](https://auth0.com/signup) and click Sign Up.
2. Use Google, GitHub or Microsoft Account to login.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](https://auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE.txt) file for more info.
