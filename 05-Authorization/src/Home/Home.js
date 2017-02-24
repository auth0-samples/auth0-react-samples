import React, { Component } from 'react';
import { Link } from 'react-router';

class Home extends Component {
  login() {
    this.props.route.auth.login();
  }
  render() {
    const { isAuthenticated, isAdmin } = this.props.route.auth;
    return (
      <div>
        {
          isAuthenticated() && (
            <h4>You are logged in!</h4>
          )
        }
        {
          isAuthenticated() && isAdmin() && (
            <h4>You can now You can now view your <Link to="admin">admin area</Link></h4>
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
