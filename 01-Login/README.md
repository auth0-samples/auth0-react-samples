# Auth0 React Login

This sample demonstrates how to add authentication to a React application with Auth0. The sample makes use of Auth0's hosted login page which provides centralized authentication and the user email is displayed when the user is authenticated.

## Getting Started


Clone the repo or download it from https://github.com/GustaveKar/auth0-react-samples.git
Open the demo.

```bash
cd 01-Login
```


## Set the Client ID and Domain

The clientID and domain are already added when creating the auth object

## Run the Application

The demo comes ready to serve locally using react-scripts. 
In case you encounter "react-scripts: not found" error, please delete the package.-lock.json file and the node_modules folder and run npm install.

```bash
npm start
```

The application will be served at `http://localhost:3000`.


## Todo

Fixing the App.test.js failure test and implementing some more unit test for the routing files

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
