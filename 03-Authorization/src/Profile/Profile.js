import React, { Component } from 'react';
import { Panel, ControlLabel, Glyphicon } from 'react-bootstrap';
import './Profile.css';

class Profile extends Component {
  render() {
    const { userProfile } = this.props.auth;

    return (
      <div className="container">
        <div className="profile-area">
          <h1>{userProfile.name}</h1>
          <Panel header="Profile">
            <img src={userProfile.picture} alt="profile" />
            <div>
              <ControlLabel><Glyphicon glyph="user" /> Nickname</ControlLabel>
              <h3>{userProfile.nickname}</h3>
            </div>
            <pre>{JSON.stringify(userProfile, null, 2)}</pre>
          </Panel>
        </div>
      </div>
    );
  }
}

export default Profile;
