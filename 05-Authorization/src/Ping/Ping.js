import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { API_URL } from './../constants';

class Home extends Component {
  componentWillMount() {
    this.setState({ message: '' });
  }
  login() {
    this.props.route.auth.login();
  }
  ping() {
    fetch(`${API_URL}/public`)
      .then(res => res.json())
      .then(data => this.setState({ message: data.message }));
  }
  securedPing(route) {
    const { authFetch } = this.props.route.auth;
    authFetch(`${API_URL}/${route}`)
      .then(data => this.setState({ message: data.message }))
      .catch(error => this.setState({ message: error.message }));
  }
  render() {
    const { isAuthenticated, isAdmin } = this.props.route.auth;
    const { message } = this.state;
    return (
      <div>
        <h1>Make a Call to the Server</h1>
        {
          !isAuthenticated() &&
            <p>Log in to call a private (secured) server endpoint.</p>
        }
        <Button bsStyle="primary" onClick={this.ping.bind(this)}>Ping</Button>
        {' '}
        {
          isAuthenticated() && (
              <Button bsStyle="primary" onClick={this.securedPing.bind(this, 'private')}>
                Call Private
              </Button>
            )
        }
        {' '}
        {
          isAuthenticated() && isAdmin() && (
              <Button bsStyle="primary" onClick={this.securedPing.bind(this, 'private/admin')}>
                Call Admin
              </Button>
            )
        }
        <h2>{message}</h2>
      </div>
    );
  }
}

export default Home;
