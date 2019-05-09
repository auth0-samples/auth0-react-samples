# Scenario #1 - Logging In and Gated Content

This sample demonstrates:

- Logging in to Auth0 using Redirect Mode
- Accessing profile information that has been provided in the ID token
- Gated content. The `/profile` route is not accessible without having first logged in

## Project setup

Use `yarn` or `npm` to install the project dependencies:

```bash
# Using npm..
npm install

# Using yarn..
yarn install
```

### Configuration

The project needs to be configured with your Auth0 domain and client ID in order for the authentication flow to work.

To do this, first copy `src/auth_config.json.example` into a new file in the same folder called `src/auth_config.json`, and replace the values with your own Auth0 application credentials:

```json
{
  "domain": "{YOUR AUTH0 DOMAIN}",
  "clientId": "{YOUR AUTH0 CLIENT ID}"
}
```

### Compiles and hot-reloads for development

```bash
npm run start
```

## Deployment

### Compiles and minifies for production

```bash
npm run build
```

### Docker build

To build and run the Docker image, run `exec.sh`, or `exec.ps1` on Windows.

### Run your tests

```bash
npm run test
```

# Tutorial

This tutorial will help you get up and running the React app using the new SDK.

## Prerequisites

This tutorial assumes the following:

- You have a recent version of Node installed (version 8 and onwards)
- A code editor such as [Visual Studio Code](https://code.visualstudio.com/) to edit project files
- Access to the terminal

## Setting Up the Application

Find a location on your drive where you want to create the project and run the following commands:

```bash
# Create the application using create-react-app
npx create-react-app my-app

# Move into the project directory
cd my-app
```

(npx comes with npm 5.2+ and higher, see [instructions for older npm versions](https://gist.github.com/gaearon/4064d3c23a77c74a3614c498a8bb1c5f))

### Installing initial dependencies

After creating a new React app using `create-react-app` install `react-router`, which doesn't come as standard with the boilerplate project. The [Auth0 Client SDK](https://github.com/auth0/auth0-spa-js) should also be added.

Install these two packages using the following command in the terminal:

```bash
npm install react-router-dom @auth0/auth0-spa-js
```

### Install the Auth0 React wrapper

Create a new file in the `src` directory called `react-auth0-wrapper.js` and populate it with the following content:

```js
import React, { useState, useEffect, useContext } from "react";
import createAuth0Client from "@auth0/auth0-spa-js";

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

export const Auth0Context = React.createContext();
export const useAuth0 = () => useContext(Auth0Context);
export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [user, setUser] = useState();
  const [auth0Client, setAuth0] = useState();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions);
      setAuth0(auth0FromHook);

      if (window.location.search.includes("code=")) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        onRedirectCallback(appState);
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated();

      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const user = await auth0FromHook.getUser();
        setUser(user);
      }

      setLoading(false);
    };
    initAuth0();
    // eslint-disable-next-line
  }, []);

  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true);
    try {
      await auth0Client.loginWithPopup(params);
    } catch (error) {
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const user = await auth0Client.getUser();
    setUser(user);
    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async () => {
    setLoading(true);
    await auth0Client.handleRedirectCallback();
    const user = await auth0Client.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);
  };
  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
        loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
        getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
        getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
        logout: (...p) => auth0Client.logout(...p)
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
```

This is a set of React hooks that enable you to work with the Auth0 SDK in a more idiomatic way, providing functions that allow the user to log in, log out, and information such as whether the use is logged in.

The next few sections will integrate these hooks into the various components that make up the app.

### Create the Navbar component

Create a new folder inside the `src` folder called `components`. This is where you will house all the components for this application.

Create a new component in the `components` folder called `Navbar.jsx`. This component will be responsible for showing the login and logout buttons:

```jsx
// src/components/NavBar.js

import React from "react";
import { useAuth0 } from "../react-auth0-wrapper";

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <div>
      {!isAuthenticated && (
        <button
          onClick={() =>
            loginWithRedirect({
              redirect_uri: window.location.origin
            })
          }
        >
          Log in
        </button>
      )}

      {isAuthenticated && <button onClick={() => logout()}>Log out</button>}
    </div>
  );
};

export default NavBar;
```

Here the component renders two buttons, for logging in and logging out, depending on whether the user is currently authenticated.

Notice the use of `useAuth0` — provided by the wrapper you created in the previous section — which provides the functions needed in order to log in, log out, and determine if the user is logged in through the `isAuthenticated` property.

### Application setup

In order for the authentication system to work properly, the application components should be wrapped in the `Auth0Provider` component that is provided by the wrapper created earlier in the tutorial. This means that any components inside this wrapper will be able to access the Auth0 SDK client.

Open the `src/index.js` file and replace its contents with the following:

```jsx
// src/index.js

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Auth0Provider } from "./react-auth0-wrapper";
import config from "./auth_config.json";

ReactDOM.render(
  <Auth0Provider domain={config.domain} client_id={config.clientId}>
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
```

Notice that the `App` component is now wrapped in the `Auth0Provider` component, where the details about the Auth0 domain and client ID are specified.

Next, create a new file `auth_config.json` in the `src` folder, and populate it with the following:

```json
{
  "domain": "{YOUR AUTH0 DOMAIN}",
  "clientId": "{YOUR AUTH0 CLIENT ID}"
}
```

> **Note**: The values for `domain` and `clientId` should be replaced with those for your own Auth0 app. If you don't already have an Auth0 account, this will be covered shortly.

Next, open the `App.js` file in the `src` folder, populate it with the following content:

```js
import React from "react";
import NavBar from "./components/Navbar";

function App() {
  return (
    <div className="App">
      <header>
        <NavBar />
      </header>
    </div>
  );
}

export default App;
```

This replaces the default content created by `create-react-app` and simply shows the `NavBar` component you created earlier.

### Auth0 dashboard

Log in to your [Auth0 dashboard](https://manage.auth0.com). If you don't already have a free account, you can [sign up here](https://auth0.com/signup).

Once you've opened the dashboard, go into the Applications section.

![Creating a new Auth0 application](https://cdn.auth0.com/blog/quickstarts:create-app.png)

1.  Create a new Application of type "Single Page Application" by giving it a name of choice and clicking "Create". The dashboard redirects you to the quickstart which you can skip and go straight to "Settings" tab.
2.  At the top of the page are displayed the `client_id` and `domain` values. Take note of them as you will be using them later.
3.  Add `http://localhost:3000` into the "Allowed Callback URLs" box.
4.  Add `http://localhost:3000` into the "Allowed Web Origins" box.
5.  Lastly, add `http://localhost:3000` into the "Allowed Logout URLs" box.
6.  Click the `SAVE CHANGES` button to save the configuration.
7.  Go to the "Connections" tab and enable the connections you wish to use for authentication. e.g. the default "Username-Password-Authentication".

![Retrieving your Auth0 credentials](https://cdn.auth0.com/blog/quickstarts:create-app2.png)

Reopen the `auth_config.json` in the `src` folder of the project. Place the information collected in step (2), replacing the values with your own:

```json
{
  "domain": "{YOUR AUTH0 DOMAIN}",
  "clientId": "{YOUR AUTH0 CLIENT ID}"
}
```

### Checkpoint: Testing the application

At this point, you should be able to go through a complete authentication cycle, logging in and loggin out. Start the application from the terminal using `yarn start` and browse to http://localhost:3000 (if the application does not open automatially). From there, clicking the **Log in** button should redirect you to the Auth0 Login Page where you will be given the opportunity to log in.

Once you are logged in, control returns to your application and you should see that the **Log out** button is now visible. Clicking this should log you out of the application and return you to an unauthenticated state.

## Reading the user profile

When a user is logged in, the associated **user profile** information can be retrieved. Typically this is used to display their name and profile picture.

To display this information to the user, create a new file called `Profile.js` inside the `components` folder and populate it with the following content:

```jsx
// src/components/Profile.js

import React from "react";
import { useAuth0 } from "../react-auth0-wrapper";

const Profile = () => {
  const { loading, user } = useAuth0();

  if (loading || !user) {
    return "Loading...";
  }

  return (
    <>
      <img src={user.picture} alt="Profile" />

      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <code>{JSON.stringify(user, null, 2)}</code>
    </>
  );
};

export default Profile;
```

Notice here that the `useAuth0` hook is again being used, this time to retrieve the user's profile information (through the `user` property) and a `loading` property that can be used to display some kind of "loading" text or spinner graphic while the user's data is being retrieved.

In the UI for this component, the user's profile picture, name, and email address is being retrieved from the `user` property and displayed on the screen.

To access this page, modify the `App.js` file to include a router so that the profile page may be displayed on the screen. The `App.js` file should now look something like this:

```jsx
// src/App.js

import React from "react";
import NavBar from "./components/Navbar";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Profile from "./components/Profile";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <header>
          <NavBar />
        </header>
        <Switch>
          <Route path="/" exact />
          <Route path="/profile" component={Profile} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
```

Notice that a `BrowserRouter` component has been included, and that two routes have been defined — one for the home page, and another for the profile page.

To complete this step, open the `Navbar.js` file and modify the navigation bar's UI to include a link to the profile page. In addition, import the `Link` component at the top of the file.

The `NavBar` component should now look something like this:

```jsx
import React from "react";
import { useAuth0 } from "../react-auth0-wrapper";

// NEW - import the Link component
import { Link } from "react-router-dom";

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <div>
      {!isAuthenticated && (
        <button
          onClick={() =>
            loginWithRedirect({
              redirect_uri: window.location.origin
            })
          }
        >
          Log in
        </button>
      )}

      {isAuthenticated && <button onClick={() => logout()}>Log out</button>}

      {/* NEW - add a link to the home and profile pages */}
      {isAuthenticated && (
        <span>
          <Link to="/">Home</Link>&nbsp;
          <Link to="/profile">Profile</Link>
        </span>
      )}
    </div>
  );
};

export default NavBar;
```

### Checkpoint: Testing the profile page

Go ahead and run the project one more time. Now if the user is authenticated and you navigate to the `/profile` page, you will see their profile data. See how this content disappears when you log out.

## Securing the Profile Page

The profile page should be protected in such a way that if the user tries to access it directly without logging in, they will be automatically redirected to Auth0 to log in. Currently the user would just see a blank page.

To fix this, a Higher-Order Component can be created that will wrap any component to check if is authenticated.

Start by creating a new component `components/PrivateRoute.js` that can wrap another component. Populate it with the following content:

```jsx
import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import { useAuth0 } from "../react-auth0-wrapper";

const PrivateRoute = ({ component: Component, path, ...rest }) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    const fn = async () => {
      if (!isAuthenticated) {
        await loginWithRedirect({
          redirect_uri: window.location.origin,
          appState: { targetUrl: path }
        });
      }
    };
    fn();
  }, [isAuthenticated, loginWithRedirect, path]);

  const render = props => <Component {...props} />;

  return <Route path={path} render={render} {...rest} />;
};

export default PrivateRoute;
```

This component takes another component as one of its arguments. It makes use of `useEffect` to redirect to the user to the login page if they are not yet authenticated.

If the user is authenticated, the redirect will not take place and the component that was specified as the argument will be rendered instead. In this way, components that require the user to be logged in can be protected simply by wrapping the component using `PrivateRoute`.

### Modifying the router with PrivateRoute

With `PrivateRoute` component in place, the application router can now be modified to secure the `/profile` route, ensuring that users must log into the application in order to see it.

Open `App.js` once again, import the `PrivateRoute` component, and update the router so that the `Profile` component is wrapped by the `PrivateRoute` component:

```jsx
import React from "react";
import NavBar from "./components/Navbar";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Profile from "./components/Profile";

// NEW - import the PrivateRoute component
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <header>
          <NavBar />
        </header>
        <Switch>
          <Route path="/" exact />

          {/* NEW - Modify the /profile route to use PrivateRoute instead of Route */}
          <PrivateRoute path="/profile" component={Profile} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
```

### Checkpoint: Testing the PrivateRoute component

Run the project again. Now if the user is not authenticated and you navigate to the `/profile` page through the URL bar in the browser, you will be sent through the authentication flow, and will see the Profile page upon your return.

## Recap

In this tutorial you learned how to create a React application and install the Auth0 SPA SDK library. You then added code to authenticate the user, show the user's profile information on the screen, and protect routes so that authentication is required before they can be accessed.

You have come to the end of the tutorial for Scenario 1. From here, continue with [Scenario 3 - Calling the backend](../03-Calling-an-API).

# What is Auth0?

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

This project is licensed under the MIT license. See the [LICENSE](../LICENSE) file for more info.
