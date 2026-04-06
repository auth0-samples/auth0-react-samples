import React from "react";
import { NavLink, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import { useAuth0 } from "@auth0/auth0-react";

const NavBar = () => {
  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
  } = useAuth0();

  const logoutWithRedirect = () =>
    logout({
        logoutParams: {
          returnTo: window.location.origin,
        }
    });

  return (
    <div className="nav-container">
      <Navbar bg="light" expand="md">
        <Container>
          <Navbar.Brand className="logo" />
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto">
              <Nav.Item>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                >
                  Home
                </NavLink>
              </Nav.Item>
              {isAuthenticated && (
                <Nav.Item>
                  <NavLink
                    to="/external-api"
                    className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                  >
                    External API
                  </NavLink>
                </Nav.Item>
              )}
            </Nav>
            <Nav className="d-none d-md-block">
              {!isAuthenticated && (
                <Nav.Item>
                  <Button
                    id="qsLoginBtn"
                    variant="primary"
                    className="btn-margin"
                    onClick={() => loginWithRedirect()}
                  >
                    Log in
                  </Button>
                </Nav.Item>
              )}
              {isAuthenticated && (
                <NavDropdown
                  title={<img src={user.picture} alt="Profile" className="nav-user-profile rounded-circle" width="50" />}
                  id="profileDropDown"
                >
                  <NavDropdown.Header>{user.name}</NavDropdown.Header>
                  <NavDropdown.Item
                    as={Link}
                    to="/profile"
                    className="dropdown-profile"
                  >
                    <FontAwesomeIcon icon="user" className="me-3" /> Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    id="qsLogoutBtn"
                    onClick={() => logoutWithRedirect()}
                  >
                    <FontAwesomeIcon icon="power-off" className="me-3" /> Log
                    out
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
            {!isAuthenticated && (
              <Nav className="d-md-none">
                <Nav.Item>
                  <Button
                    id="qsLoginBtn"
                    variant="primary"
                    className="w-100"
                    onClick={() => loginWithRedirect({})}
                  >
                    Log in
                  </Button>
                </Nav.Item>
              </Nav>
            )}
            {isAuthenticated && (
              <Nav
                className="d-md-none justify-content-between"
                style={{ minHeight: 170 }}
              >
                <Nav.Item>
                  <span className="user-info">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="nav-user-profile d-inline-block rounded-circle me-3"
                      width="50"
                    />
                    <h6 className="d-inline-block">{user.name}</h6>
                  </span>
                </Nav.Item>
                <Nav.Item>
                  <FontAwesomeIcon icon="user" className="me-3" />
                  <NavLink
                    to="/profile"
                    className={({ isActive }) => isActive ? "active" : undefined}
                  >
                    Profile
                  </NavLink>
                </Nav.Item>
                <Nav.Item>
                  <FontAwesomeIcon icon="power-off" className="me-3" />
                  <Link
                    to="#"
                    id="qsLogoutBtn"
                    onClick={() => logoutWithRedirect()}
                  >
                    Log out
                  </Link>
                </Nav.Item>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
