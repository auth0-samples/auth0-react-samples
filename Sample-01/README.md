# Auth0 React SDK Sample Application

This sample demonstrates the integration of [Auth0 React SDK](https://github.com/auth0/auth0-react) into a React application created using [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html). The sample is a companion to the [Auth0 React SDK Quickstart](https://auth0.com/docs/quickstart/spa/react).

This sample demonstrates the following use cases:

- [Login](https://github.com/auth0-samples/auth0-react-samples/blob/migrate/auth0-react/01-Login/src/components/NavBar.js#L72-L79)
- [Logout](https://github.com/auth0-samples/auth0-react-samples/blob/migrate/auth0-react/01-Login/src/components/NavBar.js#L102-L108)
- [Showing the user profile](https://github.com/auth0-samples/auth0-react-samples/blob/migrate/auth0-react/01-Login/src/views/Profile.js)
- [Protecting routes](https://github.com/auth0-samples/auth0-react-samples/blob/migrate/auth0-react/01-Login/src/views/Profile.js#L33)
- [Calling APIs](https://github.com/auth0-samples/auth0-react-samples/blob/migrate/auth0-react/01-Login/src/views/ExternalApi.js)

## Project setup

Use `npm` to install the project dependencies:

```bash
npm install
```

## Configuration

### Create an API

For the ["call an API"](https://auth0.com/docs/quickstart/spa/react/02-calling-an-api) page to work, you will need to [create an API](https://auth0.com/docs/apis) using the [management dashboard](https://manage.auth0.com/#/apis). This will give you an API identifier that you can use in the `audience` configuration field below.

If you do not wish to use an API or observe the API call working, you should not specify the `audience` value in the next step. Otherwise, you will receive a "Service not found" error when trying to authenticate.

### Configure credentials

The project needs to be configured with your Auth0 domain and client ID in order for the authentication flow to work.

To do this, first copy `src/auth_config.json.example` into a new file in the same folder called `src/auth_config.json`, and replace the values with your own Auth0 application credentials, and optionally the base URLs of your application and API:

```json
{
  "domain": "{YOUR AUTH0 DOMAIN}",
  "clientId": "{YOUR AUTH0 CLIENT ID}",
  "audience": "{YOUR AUTH0 API_IDENTIFIER}",
  "appOrigin": "{OPTIONAL: THE BASE URL OF YOUR APPLICATION (default: http://localhost:3000)}",
  "apiOrigin": "{OPTIONAL: THE BASE URL OF YOUR API (default: http://localhost:3001)}"
}
```

**Note**: Do not specify a value for `audience` here if you do not wish to use the API part of the sample.

## Run the sample

### Compile and hot-reload for development

This compiles and serves the React app and starts the backend API server on port 3001.

```bash
npm run dev
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

## Frequently Asked Questions

We are compiling a list of questions and answers regarding the new JavaScript SDK - if you're having issues running the sample applications, [check the FAQ](https://github.com/auth0/auth0-spa-js/blob/master/FAQ.md)!

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

This project is licensed under the MIT license. See the [LICENSE](../LICENSE) file for more info.
