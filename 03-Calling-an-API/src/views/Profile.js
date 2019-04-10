import React, { Component } from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "reactstrap";

import Highlight from "../components/Highlight";
import Loading from "../components/Loading";

class Profile extends Component {
  state = { loading: true, profile: {} };

  async componentDidMount() {
    const { auth0 } = this.props;

    try {
      const profile = await auth0.getUser();

      this.setState({ loading: false, profile });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { loading, profile } = this.state;

    if (loading || !profile) {
      return <Loading />;
    }

    return (
      <Container className="mb-5">
        <Row className="align-items-center profile-header">
          <Col md={2}>
            <img
              src={profile.picture}
              alt="Profile"
              className="rounded-circle img-fluid profile-picture"
            />
          </Col>
          <Col md>
            <h2>{profile.name}</h2>
            <p className="lead text-muted">{profile.email}</p>
          </Col>
        </Row>
        <Row>
          <Highlight>{JSON.stringify(profile, null, 2)}</Highlight>
        </Row>
      </Container>
    );
  }
}

Profile.propTypes = {
  auth0: PropTypes.object.isRequired
};

export default Profile;
