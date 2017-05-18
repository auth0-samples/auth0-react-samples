import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { API_URL } from './../constants';

class Ping extends Component {
  componentWillMount() {
    this.setState({ message: '' });
  }
  ping() {
    fetch(`${API_URL}/public`)
      .then(res => res.json())
      .then(data => this.setState({ message: data.message }));
  }
  securedPing() {
    const { authFetch } = this.props.auth;
    authFetch(`${API_URL}/private`)
      .then(data => this.setState({ message: data.message }))
      .catch(error => this.setState({ message: error.message }));
  }
  render() {
    const { isAuthenticated } = this.props.auth;
    const { message } = this.state;
    return (
      <div className="container">
        <h1>Make a Call to the Server</h1>
        {
          !isAuthenticated() &&
            <p>Log in to call a private (secured) server endpoint.</p>
        }
        <Button bsStyle="primary" onClick={this.ping.bind(this)}>Ping</Button>
        {' '}
        {
          isAuthenticated() && (
              <Button bsStyle="primary" onClick={this.securedPing.bind(this)}>
                Call Private
              </Button>
            )
        }
        <h2>{message}</h2>
      </div>
    );
  }
}

export default Ping;
