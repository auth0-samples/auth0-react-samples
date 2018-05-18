# Auth0 React Calling an API

This sample demonstrates how to make secure calls to an API after authenticating a user with Auth0. The calls to the API are made with the user's `access_token`. The sample makes use of Auth0's hosted login page which provides centralized authentication. The sample uses create-react-app.

There is a [short screencast](https://www.youtube.com/watch?v=ti2zMJm34Cw) available.

## Getting Started

If you haven't already done so, [sign up](https://auth0.com) for your free Auth0 account and create a new client in the [dashboard](https://manage.auth0.com). Find the **domain** and **client ID** from the settings area and add the URL for your application to the **Allowed Callback URLs** box. If you are using the server provided by the create-react-app, that URL is `http://localhost:3000/callback`.

Clone the repo or download it from the React quickstart page in Auth0's documentation. Install create-react-app globally and the dependencies for the app.

```bash
npm install -g create-react-app
cd 03-Calling-an-API
npm install
```

> **Note:** If you are not using create-react-app but are using Babel, you need to add the `stage-0` preset.

## Set up a new API

More complete documentation is available at [React Calling an API](https://auth0.com/docs/quickstart/spa/react/03-calling-an-api).

From the Auth0 dashboard, select the APIs section and select "Create API":

* Add a name for the API. `A friendly name for the API.`
* Select an identifier for the endpoint. `A logical identifier for this API. We recommend using a URL but note that this doesn’t have to be a publicly available URL, Auth0 will not call your API at all. Important! This field cannot be modified.`

For purposes of this demo, you may want to consider using http://localhost:3001 as your identifier.

You will also need to add in a new scope. `Scopes allow you to define the data that will be accessed through the applications to your API. Set a name for them and its description for better understanding.`

* Select the Scopes tab from the API section.
* In the name textbox, enter in `read:messages`.
* Add a description for this scope ex: `permission to read messages` and click the 'add' button.

## Set the Client ID and Domain

If you download the sample from the quickstart page, it will come pre-populated with the **client ID** and **domain** for your application. If you clone the repo directly from Github, rename the `auth0-variables.js.example` file to `auth0-variables.js` and provide the **client ID** and **domain** there. This file is located in `src/Auth/`.

You should also provide the identifier for the API you create in the Auth0 dashboard as your `apiUrl`.

## Set Up the `.env` File

In addition to the above-mentioned `auth0-variables.js` file, a `.env` file is provided at the root of the application. This file provides your application's credentials to the small Node server located in `server.js`.

This file has two values, `AUTH0_AUDIENCE` and `AUTH0_DOMAIN`. If you download this sample from the quickstart page, the value for `AUTH0_DOMAIN` will be populated automatically, but you will still need to populate `AUTH0_AUDIENCE` manually. The value for `AUTH0_AUDIENCE` is the identifier used for an API that you create in the Auth0 dashboard.

## Run the Application

The development server that comes with create-react-app can be used to serve the application.

```bash
npm start
```

The application will be served at `http://localhost:3000`.

## Run the Application With Docker

In order to run the example with docker you need to have `docker` installed.

You also need to set the environment variables as explained [previously](#set-the-client-id-and-domain).

Execute in command line `sh exec.sh` to run the Docker in Linux, or `.\exec.ps1` to run the Docker in Windows.

## What is Auth0?

Auth0 helps you to:

* Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, among others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
* Add authentication through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
* Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
* Support for generating signed [Json Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.
* Analytics of how, when and where users are logging in.
* Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).

## Create a Free Auth0 Account

1. Go to [Auth0](https://auth0.com/signup) and click Sign Up.
2. Use Google, GitHub or Microsoft Account to login.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](https://auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE.txt) file for more info.
