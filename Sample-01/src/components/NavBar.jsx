import React from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
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
                <Nav.Link
                  as={RouterNavLink}
                  to="/"
                  exact
                  activeClassName="router-link-exact-active"
                >
                  Home
                </Nav.Link>
              </Nav.Item>
              {isAuthenticated && (
                <Nav.Item>
                  <Nav.Link
                    as={RouterNavLink}
                    to="/external-api"
                    exact
                    activeClassName="router-link-exact-active"
                  >
                    External API
                  </Nav.Link>
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
                    as={RouterNavLink}
                    to="/profile"
                    className="dropdown-profile"
                    activeClassName="router-link-exact-active"
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
                  <RouterNavLink
                    to="/profile"
                    activeClassName="router-link-exact-active"
                  >
                    Profile
                  </RouterNavLink>
                </Nav.Item>
                <Nav.Item>
                  <FontAwesomeIcon icon="power-off" className="me-3" />
                  <RouterNavLink
                    to="#"
                    id="qsLogoutBtn"
                    onClick={() => logoutWithRedirect()}
                  >
                    Log out
                  </RouterNavLink>
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
