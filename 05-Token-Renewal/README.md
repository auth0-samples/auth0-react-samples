# Auth0 React Token Renewal

This sample demonstrates how to renew `access_token`s in a React application with Auth0 using `checkSession`. For more information, read [our reference documentation](https://auth0.com/docs/libraries/auth0js#using-checksession-to-acquire-new-tokens).

## Getting Started

If you haven't already done so, [sign up](https://auth0.com) for your free Auth0 account and create a new client in the [dashboard](https://manage.auth0.com). Find the **domain** and **client ID** from the settings area and add the URL for your application to the **Allowed Callback URLs** box. The default URL is `http://localhost:3000/callback`. Also configure **Allowed Web Origins** to the default application URL `http://localhost:3000`.

Clone the repo or download it from the React quickstart page in Auth0's documentation.

Open the demo.

```bash
cd 05-Token-Renewal
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

### Token Lifetime

For security, keep the expiry time of a user's Access Token short.

When you create an API in the Auth0 dashboard, the default expiry time for browser flows is 7200 seconds (2 hours).

This short expiry time is good for security, but can affect user experience. To improve user experience, provide a way for your users to automatically get a new Access Token and keep their client-side session alive. You can do this with [Silent Authentication](/api-auth/tutorials/silent-authentication).

> **Note:** You can control the expiry time of an Access Token from the [APIs section](https://manage.auth0.com/#/apis). You can control the expiry time of an ID Token from the [Applications section](https://manage.auth0.com/#/applications). These settings are independent.

### Add Token Renewal

In the `Auth` service, we already have a method which calls the `checkSession` method from auth0.js. If the renewal is successful, use the existing `setSession` method to set new tokens in local storage.

```js
// src/Auth/Auth.js

renewSession() {
  this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        this.logout();
        console.log(err);
        alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
      }
  });
}
```

The Access Token should be renewed when it expires. In this tutorial, we'll make sure it automatically reviews when the token expires. The expiry time of the token is stored in the Auth service `this.expiresAt`.

Define a timing mechanism for renewing the token.

> **Note:** You can define any timing mechanism you want. You can choose any library that handles timers. This example shows how to use a `setTimeout` call.

In the `Auth` service, add a property called `tokenRenewalTimeout` which refers to the `setTimeout` call.

Add a method called `scheduleRenewal` to set up the time when the authentication is silently renewed. The method subtracts the current time from the Access Token's expiry time and calculates delay. The `setTimeout` call uses the calculated delay and makes a call to `renewToken`.

The `setTimeout` call call is assigned to the `tokenRenewalTimeout` property. When the user logs out, the timeout is cleared.

```js
// src/Auth/Auth.js

// ...

export default class Auth {
  // ...

  tokenRenewalTimeout;

  // ...

  scheduleRenewal() {
    let expiresAt = this.expiresAt;
    const timeout = expiresAt - Date.now();
    if (timeout > 0) {
      this.tokenRenewalTimeout = setTimeout(() => {
        this.renewSession();
      }, timeout);
    }
  }

  getExpiryDate() {
    return JSON.stringify(new Date(this.expiresAt));
  }
}
```

You can now include a call to the `scheduleRenewal` method in the `setSession` method.

```js
// src/Auth/Auth.js

// ...

export default class Auth {
  // ...

  setSession(authResult) {
    // ...

    // schedule a token renewal
    this.scheduleRenewal();

    // ...
  }

  // ...
}
```

To schedule renewing the tokens when the page is refreshed, in the constructor of the `Auth` service, add a call to the `scheduleRenewal` method.

```js
// src/Auth/Auth.js

// ...

export default class Auth {
  // ,..

  constructor() {
    // ...

    this.scheduleRenewal();
  }

  // ,..
}
```

Since client-side sessions should not be renewed after the user logs out, call `clearTimeout` in the `logout` method to cancel the renewal.

```js
// src/Auth/Auth.js

// ...

export default class Auth {
  // ...

  logout() {
    // ...

    // Clear token renewal
    clearTimeout(this.tokenRenewalTimeout);

    // ...
  }

  // ...
}
```

## Troubleshooting APIs

For more information on troubleshooting backend APIs and tokens, please see [this article on auth0.com/docs](https://auth0.com/docs/quickstart/backend/nodejs/03-troubleshooting).

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
