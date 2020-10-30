import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./Loading";

const Layout = ({ children }) => {
  const { isLoading, error } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  return isLoading ? (
    <Loading />
  ) : (
    <div id="app" className="d-flex flex-column h-100">
      {children}
    </div>
  );
};

export default Layout;
