# Auth0 React Authorization

This sample demonstrates how to include user authorization in a React application with Auth0.

## Getting Started

If you haven't already done so, [sign up](https://auth0.com) for your free Auth0 account and create a new client in the [dashboard](https://manage.auth0.com). Find the **domain** and **client ID** from the settings area and add the URL for your application to the **Allowed Callback URLs** box. The default URL is `http://localhost:3000/callback`. Also configure **Allowed Web Origins** to the default application URL `http://localhost:3000`.

Clone the repo or download it from the React quickstart page in Auth0's documentation.

Open the demo.

```bash
cd 04-Authorization
```

Install the dependencies for the app.

```
npm install
```

## Set up a new API

More complete documentation is available at [React Calling an API](https://auth0.com/docs/quickstart/spa/react/03-calling-an-api).

From the Auth0 dashboard, select the APIs section and select "Create API":

- Add a name for the API. `A friendly name for the API.`
- Select an identifier for the endpoint. `A logical identifier for this API. We recommend using a URL but note that this doesn’t have to be a publicly available URL, Auth0 will not call your API at all. Important! This field cannot be modified.`

For purposes of this demo, you may want to consider using http://localhost:3001 as your identifier.

You will also need to add in a new scope. `Scopes allow you to define the data that will be accessed through the applications to your API. Set a name for them and its description for better understanding.`

- Select the Scopes tab from the API section.
- In the name textbox, enter in `read:messages`.
- Add a description for this scope ex: `permission to read messages` and click the 'add' button.

## Set the Client ID, Domain, and API identifier

If you download the sample from the quickstart page, it will come pre-populated with the **client ID** and **domain** for your application. If you clone the repo directly from Github, rename the `auth0-variables.js.example` file to `auth0-variables.js` and provide the **client ID** and **domain** there. This file is located in `src/Auth/`.

You should also provide the identifier for the API you create in the Auth0 dashboard as your `apiUrl`.

## Set Up the `.env` File

In addition to the above-mentioned `auth0-variables.js` file, a `.env` file is provided at the root of the application. This file provides your application's credentials to the small Node server located in `server.js`.

This file has two values, `AUTH0_AUDIENCE` and `AUTH0_DOMAIN`. If you download this sample from the quickstart page, the value for `AUTH0_DOMAIN` will be populated automatically, but you will still need to populate `AUTH0_AUDIENCE` manually. The value for `AUTH0_AUDIENCE` is the identifier used for an API that you create in the Auth0 dashboard.

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

### Access Control in Single-Page Applications

In Single-Page Applications you use Access Control to define what different users can see, and which routes they can access.
With Auth0, you can implement access control by using scopes granted to users.

To set up access control in your application, enforce the following restrictions:

- The data from an API can only be returned if the user is authorized to access it. This needs to be done when implementing the API.
- The user can access specific routes and UI elements in your application only if they have the appropriate access level.

The previous step used the `read:messages` scope for accessing API resources. This scope indicates that the user can only view the data. You can consider users with this scope regular users. If you want to give some users permission to edit the data, you can add the `write:messages` scope.

> **Note:** Read about naming scopes and mapping them to access levels in the [Scopes documentation](/scopes). To learn more about custom scope claims, follow the [User profile claims and scope tutorial](/api-auth/tutorials/adoption/scope-custom-claims).

### Determine a User's Scopes

You can use scopes to make decisions about the behavior of your application's interface.

You can specify which scopes you want to request at the beginning of the login process.

If a scope you requested is available to the user, their Access Token receives a `scope` claim in the payload. The value of this claim is a string with all the granted scopes, but your application must treat the Access Token as opaque and must not decode it. This means that you cannot read the Access Token to access the scopes.

To get the scopes, you can use the value of the `scope` parameter that comes back after authentication. This parameter is a string containing all the scopes granted to the user, separated by spaces. This parameter will be populated only if the scopes granted to the user are different than those you requested.

To see which scopes are granted to the user, check for the value of `authResult.scope`. If there is no value for `authResult.scope`, all the requested scopes were granted.

## Handle Scopes in the `Auth` Service

Add a local member to your `Auth` service and initialize it with all the scopes you want to request when users log in. Use this member when initializing your instance of the `auth0.WebAuth` object.

```js
// src/Auth/Auth.js

// ...

scopes;
requestedScopes = "openid profile read:messages write:messages";

auth0 = new auth0.WebAuth({
  // ...
  scope: this.requestedScopes
});
```

Add a `setSession` method to save the scopes granted to the user into browser storage.

First, check for the scopes in the `scope` key from `authResult`. If it's not empty, the user was granted a different set of scopes than the one the application requested, so you need to use the ones in `authResult.scope`.

If it's empty, all the scopes requested were granted, so you can use the values from the variable that stores the requested scopes.

```js
// src/Auth/Auth.js

// ...

setSession(authResult) {
  // ...

  // Set the users scopes
  this.scopes = authResult.scope || this.requestedScopes || '';

  // ...
}

// ...

```

Add a method called `userHasScopes` that checks for scopes in local storage. You can use this method to conditionally hide and show UI elements to the user and to limit route access.

```js
// src/Auth/Auth.js

// ...

userHasScopes(scopes) {
  const grantedScopes = this.scopes.split(' ');
  return scopes.every(scope => grantedScopes.includes(scope));
}
```

## Conditionally Display UI Elements

You can use the `userHasScopes` method with the `isAuthenticated` method to show and hide certain UI elements.

```js
// src/App.js

// ...
render() {
  const { isAuthenticated, userHasScopes } = this.props.auth;

  return (
    <div>
      // ...
      {
        isAuthenticated() &&  userHasScopes(['write:messages']) && (
            <Button
              bsStyle="primary"
              className="btn-margin"
              onClick={this.goTo.bind(this, 'admin')}
            >
              Admin
            </Button>
          )
      }
    </div>
  );
}
```

## Protect Client-Side Routes

You may want to give access to some routes in your application only to authenticated users. You can check if the user is authenticated with the `render` function.

```js
// src/routes.js

<Route
  path="/ping"
  render={props =>
    !auth.isAuthenticated() ? (
      <Redirect to="/home" />
    ) : (
      <Ping auth={auth} {...props} />
    )
  }
/>
```

In this example, if an unauthenticated user tries to access the `/ping` route, they are redirected to the `/home` route.

### Limit Route Access Based on Scopes

To prevent access to client-side routes based on a particular scope, make a call to the `userHasScopes` method in the route's `render` function.

If the user does not have the `write:messages` scope, they are redirected to the main route.

```js
// src/routes.js

<Route
  path="/admin"
  render={props =>
    !auth.isAuthenticated() || !auth.userHasScopes(["write:messages"]) ? (
      <Redirect to="/home" />
    ) : (
      <Admin auth={auth} {...props} />
    )
  }
/>
```

## Conditionally Assign Scopes to Users

By default, when you register scopes in your API settings, all the scopes are immediately available and any user can request them.
If you want to handle access control, you need to create policies for deciding which users can get which scopes.

> **Note:** You can use Rules to create access policies. See the [Rules documentation](/rules) to learn how to use Rules to create scope policies.

### Considerations for Client-Side Access Control

For the access control on the application-side, the `scope` values that you get in local storage are only a clue that the user has those scopes. The user could manually adjust the scopes in local storage to access routes they shouldn't have access to.

On the other hand, to access data on your server, the user needs a valid Access Token. Any attempt to modify an Access Token invalidates the token. If a user tries to edit the payload of their Access Token to include different scopes, the token will lose its integrity and become useless.

You should not store your sensitive data application-side. Make sure you always request it from the server. Even if users manually navigate to a page they are not authorized to see, they will not get the relevant data from the server and your application will still be secure.

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
