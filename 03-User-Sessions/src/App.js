import React, { Component } from 'react';
import { Navbar, Button } from 'react-bootstrap';
import { browserHistory } from 'react-router';
import './App.css';

class App extends Component {
  goHome() {
    browserHistory.replace('/home');
  }

  goToProfile() {
    browserHistory.replace('/profile');
  }

  login() {
    this.props.route.auth.login();
  }

  logout() {
    this.props.route.auth.logout();
  }

  render() {
    const { isAuthenticated } = this.props.route.auth;

    return (
      <div>
        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">Auth0 - React</a>
            </Navbar.Brand>
            <Button
              bsStyle="primary"
              className="btn-margin"
              onClick={this.goHome.bind(this)}
            >
              Home
            </Button>
            {
              !isAuthenticated() && (
                  <Button
                    bsStyle="primary"
                    className="btn-margin"
                    onClick={this.login.bind(this)}
                  >
                    Log In
                  </Button>
                )
            }
            {
              isAuthenticated() && (
                  <Button
                    bsStyle="primary"
                    className="btn-margin"
                    onClick={this.goToProfile.bind(this)}
                  >
                    Profile
                  </Button>
                )
            }
            {
              isAuthenticated() && (
                  <Button
                    bsStyle="primary"
                    className="btn-margin"
                    onClick={this.logout.bind(this)}
                  >
                    Log Out
                  </Button>
                )
            }
          </Navbar.Header>
        </Navbar>
        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default App;
