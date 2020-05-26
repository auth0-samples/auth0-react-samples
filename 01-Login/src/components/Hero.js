import React from "react";

import logo from "../assets/logo.svg";
import {useAuth0} from "../react-auth0-spa";

const Hero = () => {

  const { isAuthenticated, getTokenSilently } = useAuth0();

  const handleClick = async () => {
    console.log('before first request');
    let token = await getTokenSilently();
    console.log('after first request:', token);
    token = await getTokenSilently();
    console.log('after second request:', token);
    token = await getTokenSilently();
    console.log('after third request:', token);
  }

  return (
      <div className="text-center hero my-5">
        <img className="mb-3 app-logo" src={logo} alt="React logo" width="120" />
        <h1 className="mb-4">React.js Sample Project</h1>
        {isAuthenticated && <button onClick={handleClick}>Sequential requests</button>}
        <p className="lead">
          This is a sample application that demonstrates an authentication flow for
          an SPA, using <a href="https://reactjs.org">React.js</a>
        </p>
      </div>
  )
};

export default Hero;
