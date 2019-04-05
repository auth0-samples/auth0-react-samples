import React, { Component } from 'react';

class Page1 extends Component {
  login() {
    this.props.auth.login();
  }
  render() {
    const { isAuthenticated } = this.props.auth;
    return (
      <div className="container">
        {
          isAuthenticated() && (
              <h4>
                Thank you for logging in ! Here is your email address : {  this.props.auth.getEmail().email}
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
                {' '}to view your email address.
              </h4>
            )
        }
      </div>
    );
  }

}
export default Page1;
