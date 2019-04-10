import React from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";

import withAuthentication from "../hocs/withAuthentication";

const PrivateRoute = ({ component: Component, path, auth0, ...rest }) => {
  const ComponentWithAuthentication = withAuthentication(Component, auth0);
  const render = props => (
    <ComponentWithAuthentication path={path} {...props} />
  );

  return <Route path={path} render={render} {...rest} />;
};

PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
  path: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]).isRequired,
  auth0: PropTypes.object.isRequired
};

export default PrivateRoute;
