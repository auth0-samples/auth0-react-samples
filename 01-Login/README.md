# Scenario #1 - Logging In and Gated Content

This sample demonstrates:

- Logging in to Auth0 using Redirect Mode
- Accessing profile information that has been provided in the ID token
- Gated content. The `/profile` route is not accessible without having first logged in

## Project setup

```bash
npm install
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

After creating a new React app using `create-react-app` install `react-router`, which doesn't come as standard with the boilerplate project:

```bash
npm install react-router-dom
```

A reference to the [Auth0 Client SDK](https://github.com/auth0/auth0-spa-js) should also be added:

```bash
npm install @auth0/auth0-spa-js
```

### Create the Navbar component

Create a new folder inside the `src` folder called `components`. Inside that, create a new component called `Navbar.js`. This component will be responsible for showing the authentication UI:

```jsx
import React, { Component } from "react";

class NavBar extends Component {
  state = { isOpen: false, isAuthenticated: false, profile: {} };

  async componentDidMount() {
    const { auth0 } = this.props;

    try {
      const isAuthenticated = await auth0.isAuthenticated();
      const profile = await auth0.getUser();

      this.setState({ isAuthenticated, profile });
    } catch (error) {
      console.error(error);
    }
  }

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const { handleLoginClick, handleLogoutClick } = this.props;
    const { isAuthenticated } = this.state;

    return (
      <div className="nav-container">
        {!isAuthenticated && <button onClick={handleLoginClick}>Log in</button>}

        {isAuthenticated && (
          <button onClick={handleLogoutClick}>Log out</button>
        )}
      </div>
    );
  }
}

export default NavBar;
```

Here the component renders two buttons, for logging in and logging out, depending on whether the user is currently authenticated. The component requires the `auth0` SDK client to be passed in as properties, as well as handler functions for the login and logout events.

### Setup

Open the `App.js` file in the `src` folder, populate it with the following content:

```js
import React from "react";
import createAuth0Client from "@auth0/auth0-spa-js";
import Navbar from "./components/Navbar";
import config from "./auth_config";

class App extends React.Component {
  constructor() {
    super();
    this.state = { loading: true, auth0: null };
  }

  async componentDidMount() {
    try {
      const auth0 = await createAuth0Client({
        domain: config.domain,
        client_id: config.clientId
      });

      this.setState({ loading: false, auth0 });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { loading, auth0 } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    return <Navbar auth0={auth0} />;
  }
}

export default App;
```

This component is responsible for creating the Auth0 client using `createAuth0Client` from the JS SDK. It stores that client for later so that it may be passed down to other components later.

Next, create a new file `auth_config.json` in the `src` folder, and populate it with the following:

```json
{
  "domain": "",
  "clientId": ""
}
```

These values will be populated shortly once the Auth0 application has been created. For now, leave them blank.

### Auth0 dashboard

Log in to your [Auth0 dashboard](https://manage.auth0.com). If you don't already have a free account, you can [sign up here](https://auth0.com/signup).

Once you've opened the dashboard, go into the Applications section.

![Creating a new Auth0 application](https://cdn.auth0.com/blog/quickstarts:create-app.png)

1.  Create a new Application of type "Single Page Application" by giving it a name of choice and clicking "Create". The dashboard redirects you to the quickstart which you can skip and go straight to "Settings" tab.
2.  At the top of the page are displayed the `client_id` and `domain` values. Take note of them as you will be using them later.
3.  Add `http://localhost:3000/callback` into the "Allowed Callback URLs" box.
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

### Handling authentication

Authentication is achieved through a redirect to the Auth0 [Universal Login Page](https://auth0.com/docs/hosted-pages/login). Once the user signs up or signs in, the result will be passed to the redirect URI given as part of the authentication call.

As we saw before we can start the authentication on the "Log in" button click by calling the `auth0.loginWithRedirect()` method passing a valid redirect URI.

Add this handler function to the `App.js` component:

```js
// src/App.js

handleLoginClick = async () => {
  const { auth0 } = this.state;

  try {
    await auth0.loginWithRedirect({
      redirect_uri: `${window.location.origin}/callback`
    });
  } catch (error) {
    console.error(error);
  }
};
```

The reference to the Navbar component should also be updated to pass this function through, so that when the login button is clicked, this handler function is executed:

```js
<Navbar auth0={auth0} handleLoginClick={this.handleLoginClick} />
```

Next, create a new component in the `components` folder called `Callback`. This will be used to process the result from the authorization server and log the user into the application. To do this, call the `auth0.handleRedirectCallback()` method inside the `componentDidMount` lifecycle method. The component should look something like the following:

```js
// src/components/Callback.js
import React, { Component } from "react";

class Callback extends Component {
  async componentDidMount() {
    const { auth0, history } = this.props;

    try {
      const result = await auth0.handleRedirectCallback();
      const targetUrl = result.appState && result.appState.targetUrl;

      history.push(targetUrl || "/");
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return <span>Loading...</span>;
  }
}

export default Callback;
```

> Notice that the `appState` property is being used to support navigating to different pages after authentication has taken place.

Now the redirect is properly handled and the authentication process can be completed successfully.

To complete this step, refactor `App.js` so that it includes a `BrowserRouter`, with a route pointing to the new Callback component. Your new `App.js` file with these changes should look something like the following:

```jsx
// src/App.js
import React from "react";

// NEW - include the router components
import { Switch, Route, BrowserRouter } from "react-router-dom";

import createAuth0Client from "@auth0/auth0-spa-js";
import Navbar from "./components/Navbar";

// NEW - include the Callback component
import Callback from "./components/Callback";

import config from "./auth_config";

class App extends React.Component {
  constructor() {
    super();
    this.state = { loading: true, auth0: null };
  }

  handleLoginClick = async () => {
    const { auth0 } = this.state;

    try {
      await auth0.loginWithRedirect({
        redirect_uri: `${window.location.origin}/callback`
      });
    } catch (error) {
      console.error(error);
    }
  };

  async componentDidMount() {
    try {
      const auth0 = await createAuth0Client({
        domain: config.domain,
        client_id: config.clientId
      });

      this.setState({ loading: false, auth0 });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { loading, auth0 } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <div className="App">
        {/* NEW - include a router to enable access to different pages */}
        <BrowserRouter>
          <Navbar auth0={auth0} handleLoginClick={this.handleLoginClick} />
          <Switch>
            <Route path="/" exact />
            <Route
              path="/callback"
              render={props => <Callback auth0={auth0} {...props} />}
            />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
```

**Checkpoint** Run the project and click the "Log in" button. You should be taken to the Universal Login Page configured for your application. Go ahead and create a new user or log in using a social connection. After authenticating successfully, you will be redirected to callback page. This time, the result will be present in the URL query and the exchange will happen automatically. If everything went fine, you will end up with no query parameters in the URL, the user would now be logged in and the "Log out" button will be enabled.

### Logging the user out

The user can be logged out by calling the `logout()` method on the Auth0 client, passing a valid return-to URI. In this sample you will return the user back to the same page they are now. You can obtain that value from `window.location.origin` property. Abstract this logic into a `loghandleLogoutClickout()` method inside the `App.js` file:

```js
// src/App.js

handleLogoutClick = async event => {
  event && event.preventDefault();
  const { auth0 } = this.state;

  auth0.logout({ returnTo: window.location.origin });
};
```

Next modify the usage of the `Navbar` component to pass this handler through as a prop:

```jsx
// src/App.js

<Navbar
  auth0={auth0}
  handleLoginClick={this.handleLoginClick}
  handleLogoutClick={this.handleLogoutClick}
/>
```

**Checkpoint** Log into the application, then click the "Log out" button. The user should now be logged out, and the login button should once again be visible.

### Reading the user profile

When a user is logged in, the associated **user profile** information can be retrieved. Typically this is used to display their name and profile picture.

To display this information to the user, create a new file called `Profile.js` inside the `components` folder and populate it with the following content:

```jsx
// src/components/Profile.js

import React, { Component } from "react";

class Profile extends Component {
  state = { loading: true, profile: {} };

  async componentDidMount() {
    const { auth0 } = this.props;

    try {
      // Get the user's profile by calling getUser()
      const profile = await auth0.getUser();

      this.setState({ loading: false, profile });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { loading, profile } = this.state;

    if (loading || !profile) {
      return <span>Loading...</span>;
    }

    return (
      <>
        <img src={profile.picture} alt="Profile" />
        <h2>{profile.name}</h2>
        <p>{profile.email}</p>
        {JSON.stringify(profile, null, 2)}
      </>
    );
  }
}

export default Profile;
```

Notice in this component that the user's profile can be retrieved by calling `auth0.getUser()`. This is saved into local state and used in the rendering of the component to display the user's name, email address, and profile picture.

To access this page, update the routing inside the `App.js` file in order to render the `Profile` component, given the `/profile` route:

```jsx
// src/App.js

// .. other imports

// NEW - import the Profile component
import Profile from "./components/Profile.js";

// ..

<BrowserRouter>
  <Navbar
    auth0={auth0}
    handleLoginClick={this.handleLoginClick}
    handleLogoutClick={this.handleLogoutClick}
  />

  <Switch>
    <Route path="/" exact />
    <Route
      path="/callback"
      render={props => <Callback auth0={auth0} {...props} />}
    />

    {/* Add a route entry for the profile page */}
    <Route path="/profile" render={() => <Profile auth0={auth0} />} />
  </Switch>
</BrowserRouter>;
```

Finally, open the `Navbar.js` file and modify the navigation bar's `render` method to include a link to this profile page. In addition, import the `Link` component at the top of the file:

```jsx
// src/components/Navbar.js

// .. other imports

import { Link } from 'react-router-dom';

// ..

render() {
  const { handleLoginClick, handleLogoutClick } = this.props;
  const { isAuthenticated } = this.state;

  return (
    <div className="nav-container">
      {!isAuthenticated && <button onClick={handleLoginClick}>Log in</button>}

      {isAuthenticated && (
        <>
          <button onClick={handleLogoutClick}>Log out</button>

          {/* NEW - add a link to the profile page */}
          <Link to="/profile">Profile</Link>
        </>
      )}
    </div>
  );
}
```

**Checkpoint** Go ahead and run the project one more time. Now if the user is authenticated and you navigate to the `/profile` page, you will see their profile data. See how this content disappears when you log out.

## Securing the Profile Page

The profile page should be protected in such a way that if the user tries to access it directly without logging in, they will be automatically redirected to Auth0 to log in. Currently the user would just see a blank page.

To fix this, first create a High-Order Component function that will wrap any component to check if is authenticated. It will also inject the Auth0 SDK client.

> If you are not familiar with HOCs I recommend you to explore it in the [React's docs](https://reactjs.org/docs/higher-order-components.html).

Create a new file in the `src` directory called `withAuthentication.js` and populate it with the following content:

```jsx
// src/withAuthentication.js

import React, { Component } from "react";

export default function withAuthentication(WrappedComponent, auth0) {
  return class WithAuthentication extends Component {
    state = { loading: true, isAuthenticated: false };

    async componentWillMount() {
      const { path } = this.props;
      const isAuthenticated = await auth0.isAuthenticated();

      if (!isAuthenticated) {
        await auth0.loginWithRedirect({
          redirect_uri: `${window.location.origin}/callback`,
          appState: { targetUrl: path }
        });
      }

      this.setState({ loading: false, isAuthenticated });
    }

    render() {
      const { loading, isAuthenticated } = this.state;

      if (!isAuthenticated) return;

      if (loading) {
        return <span>Loading...</span>;
      }

      return <WrappedComponent auth0={auth0} {...this.props} />;
    }
  };
}
```

Next, create a new component called `PrivateRoute.js`, which is an abstraction of a Route component using the HOC. This is an async version of the example given in [React Router's docs](https://reacttraining.com/react-router/web/example/auth-workflow).

Any component wrapped in this route will check if the user is authenticated before rendering. If they are not authenticated, they will be asked to log in.

Populate `PrivateRoute.js` with the following content:

```jsx
// src/PrivateRoute.js

import React from "react";
import { Route } from "react-router-dom";

import withAuthentication from "./withAuthentication";

const PrivateRoute = ({ component: Component, path, auth0, ...rest }) => {
  const ComponentWithAuthentication = withAuthentication(Component, auth0);
  const render = props => (
    <ComponentWithAuthentication path={path} {...props} />
  );

  return <Route path={path} render={render} {...rest} />;
};

export default PrivateRoute;
```

With this component in place, the application router can now be modified to secure the '/profile' route, ensuring that users must log into the application in order to see it.

Open `App.js` once again, import the `PrivateRoute` component, and update the router so that the `Profile` component is wrapped by the `PrivateRoute` component:

```jsx
// src/App.js

//.. other imports

import PrivateRoute from "./PrivateRoute";

<BrowserRouter>
  <Navbar
    auth0={auth0}
    handleLoginClick={this.handleLoginClick}
    handleLogoutClick={this.handleLogoutClick}
  />

  <Switch>
    <Route path="/" exact />
    <Route
      path="/callback"
      render={props => <Callback auth0={auth0} {...props} />}
    />

    {/*NEW - wrap the Profile component in the PrivateRoute component */}
    <PrivateRoute path="/profile" auth0={auth0} component={Profile} />
  </Switch>
</BrowserRouter>;
```

**Checkpoint** Run the project again. Now if the user is not authenticated and you navigate to the `/profile` you will be send through the authentication flow, and will see the Profile page without issues.

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
