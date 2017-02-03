import React, { Component } from 'react';
import { Link } from 'react-router';

class Home extends Component {
  login() {
    this.props.route.auth.login();
  }
  render() {
    const { isAuthenticated } = this.props.route.auth;
    return (
      <div>
        {
          isAuthenticated() && (
              <h4>
                You are logged in! You can now <Link to="ping">send authenticated requests</Link> to your server.
              </h4>
            )
        }
        {
          !isAuthenticated() && (
              <h4>
                You are not logged in! Please{' '}
                <a
                  style={{ cursor: 'pointer' }}
                  onClick={this.login.bind(this)}
                >
                  Log In
                </a>
                {' '}to continue.
              </h4>
            )
        }
      </div>
    );
  }
}

export default Home;
