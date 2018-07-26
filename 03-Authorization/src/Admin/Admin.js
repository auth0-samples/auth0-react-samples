import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { API_URL } from './../constants';
import axios from 'axios';

class Admin extends Component {
  componentWillMount() {
    this.setState({ message: '' });
  }
  adminPing() {
    const { getAccessToken } = this.props.auth;
    const headers = { 'Authorization': `Bearer ${getAccessToken()}`}
    axios.post(`${API_URL}/admin`, {}, { headers })
      .then(response => this.setState({ message: response.data.message }))
      .catch(error => this.setState({ message: error.message }));
  }
  render() {
    const { message } = this.state;
    return (
      <div className="container">
        <h2>You are an Admin!</h2>
        <p>
          Only users who have a
          {' '}
          <code>scope</code>
          {' '}
          of
          {' '}
          <code>write:messages</code>
          {' '}
          in their
          {' '}
          <code>access_token</code>
          {' '}
          can see this area.
        </p>
        <hr />

        <h3>Call an Admin endpoint</h3>
        <Button bsStyle="primary" onClick={this.adminPing.bind(this)}>
          Post a Message
        </Button>
        <h2>{message}</h2>
      </div>
    );
  }
}

export default Admin;
