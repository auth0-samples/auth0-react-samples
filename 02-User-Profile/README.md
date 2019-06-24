# Auth0 React User Profile

This sample demonstrates how to get a user's profile using Auth0 in a React application.

## Getting Started

If you haven't already done so, [sign up](https://auth0.com) for your free Auth0 account and create a new client in the [dashboard](https://manage.auth0.com). Find the **domain** and **client ID** from the settings area and add the URL for your application to the **Allowed Callback URLs** box. The default URL is `http://localhost:3000/callback`. Also configure **Allowed Web Origins** to the default application URL `http://localhost:3000`.

Clone the repo or download it from the React quickstart page in Auth0's documentation.

Open the demo.

```bash
cd 02-User-Profile
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

Most applications display profile information to authenticated users. Auth0 provides a `/userinfo` endpoint for that. When you send an Access Token to the endpoint, it returns a JSON object with information about the user. The information stored in that object depends on how the user logged in to your application.

To learn more about the information returned by the `/userinfo` endpoint, see the [/userinfo endpoint documentation](/api/authentication#get-user-info).

## Request the Profile Scope

To retrieve user information, request a scope of `openid profile` in the instance of the `auth0.WebAuth` object.

```js
// src/Auth/Auth.js

auth0 = new auth0.WebAuth({
  // ...
  scope: "openid profile"
});
```

## Retrieve User Information

Use the `client.userInfo` method from the auth0.js library to get user information from the `/userinfo` endpoint.

Use the following arguments in the `client.userInfo` method:

1. The user's Access Token
2. A callback function with arguments for a potential error and a profile

Add a method that calls the `client.userInfo` method to the `Auth` service.

```js
// src/Auth/Auth.js

// ...

userProfile;

// ...

constructor() {
  // ...
  this.getProfile = this.getProfile.bind(this);
}

// ...

getProfile(cb) {
  this.auth0.client.userInfo(this.accessToken, (err, profile) => {
    if (profile) {
      this.userProfile = profile;
    }
    cb(err, profile);
  });
}

logout() {
  // ...

  // Remove user profile
  this.userProfile = null;

  // ...
}

// ...
```

The service includes a local `userProfile` member that caches the profile information you requested with the `getProfile` call.

## Display the User Profile

Some applications have a dedicated profile section for displaying user information. The example below shows how to set it up.

Create a new component called `ProfileComponent`.

```js
// src/Profile/Profile.js

import React, { Component } from "react";
import { Panel, ControlLabel, Glyphicon } from "react-bootstrap";
import "./Profile.css";

class Profile extends Component {
  componentWillMount() {
    this.setState({ profile: {} });
    const { userProfile, getProfile } = this.props.auth;
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({ profile });
      });
    } else {
      this.setState({ profile: userProfile });
    }
  }
  render() {
    const { profile } = this.state;
    return (
      <div className="container">
        <div className="profile-area">
          <h1>{profile.name}</h1>
          <Panel header="Profile">
            <img src={profile.picture} alt="profile" />
            <div>
              <ControlLabel>
                <Glyphicon glyph="user" /> Nickname
              </ControlLabel>
              <h3>{profile.nickname}</h3>
            </div>
            <pre>{JSON.stringify(profile, null, 2)}</pre>
          </Panel>
        </div>
      </div>
    );
  }
}

export default Profile;
```

The component first looks for a profile cached on the service. If it doesn't find the profile, the component makes a call to `getProfile` to get the user's information.

## Allow Users to Update Their Profile

You can allow your users to update their profile information. Auth0 provides a `user_metadata` object to store information that users can edit. See [Metadata](/users/concepts/overview-user-metadata) for more information.

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
