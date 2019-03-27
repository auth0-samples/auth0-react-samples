import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Button } from 'react-bootstrap';
import './App.css';

class App extends Component {
  login = () => {
    this.props.auth.login();
  };

  logout = () => {
    this.props.auth.logout();
  };

  componentDidMount() {
    this.props.auth.checkRenewSession();
  }

  render() {
    const { isAuthenticated } = this.props.auth;

    return (
      <div>
        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">Auth0 - React</a>
            </Navbar.Brand>
            <NavLink className="btn-margin btn btn-primary" to="/home">
              Home
            </NavLink>
            {
              !isAuthenticated && (
                  <Button
                    id="qsLoginBtn"
                    bsStyle="primary"
                    className="btn-margin"
                    onClick={this.login}
                  >
                    Log In
                  </Button>
                )
            }
            {
              isAuthenticated && (
                  <Button
                    id="qsLogoutBtn"
                    bsStyle="primary"
                    className="btn-margin"
                    onClick={this.logout}
                  >
                    Log Out
                  </Button>
                )
            }
          </Navbar.Header>
        </Navbar>
      </div>
    );
  }
}

export default App;
