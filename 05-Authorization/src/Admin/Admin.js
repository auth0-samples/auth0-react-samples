import React, { Component } from 'react';

class Admin extends Component {
  render() {
    return (
      <div className="container">
        <h2>You are an Admin!</h2>
        <p>
          Only users who have a{' '}
          <code>role</code>
          {' '}of{' '}
          <code>admin</code>
          {' '}in their{' '}
          <code>id_token</code>
          {' '}can see this area.
        </p>
      </div>
    );
  }
}

export default Admin;
