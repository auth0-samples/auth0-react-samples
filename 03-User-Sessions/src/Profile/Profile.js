import React, { Component } from 'react';
import { Panel, ControlLabel, Glyphicon } from 'react-bootstrap';
import './Profile.css';

class Profile extends Component {
  login() {
    this.props.route.auth.login();
  }
  componentWillMount() {
    this.setState({ profile: {} });
    const { userProfile, getProfile } = this.props.route.auth;
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({ profile });
      });
    } else {
      this.setState({ profile: userProfile });
    }
  }
  render() {
    const { profile } = this.state;
    return (
      <div className="profile-area">
        <h1>{profile.name}</h1>
        <Panel header="Profile">
          <img src={profile.picture} alt="profile" />
          <div>
            <ControlLabel><Glyphicon glyph="user" /> Nickname</ControlLabel>
            <h3>{profile.nickname}</h3>
            <ControlLabel><Glyphicon glyph="envelope" /> Email</ControlLabel>
            <h3>{profile.email}</h3>
          </div>
        </Panel>
      </div>
    );
  }
}

export default Profile;
