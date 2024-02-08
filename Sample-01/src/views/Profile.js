import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { jwtDecode } from "jwt-decode";

import Highlight from "../components/Highlight";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

export const ProfileComponent = () => {
  const { user, getIdTokenClaims, getAccessTokenSilently } = useAuth0();

  const [accessTokenForView, setAccessTokenForView] = useState();
  const [decodedAccessTokenForView, setDecodedAccessTokenForView] = useState();
  const [claimsForView, setClaimsForView] = useState();

  useEffect(() => {
    const getTokenContents = async () => {
      const token = await getAccessTokenSilently();
      setAccessTokenForView(token);
      setDecodedAccessTokenForView(jwtDecode(token));
      setClaimsForView(await getIdTokenClaims());
    };

    getTokenContents();
  }, [getAccessTokenSilently, getIdTokenClaims]);

  return (
    <Container className="mb-5">
      <Row className="align-items-center profile-header mb-5 text-center text-md-left">
        <Col md={2}>
          <img
            src={user.picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
          />
        </Col>
        <Col md>
          <h2>{user.name}</h2>
          <p className="lead text-muted">{user.email}</p>
        </Col>
      </Row>
      <Row>
        <h2>`user` object</h2>
        <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
      </Row>
      <Row>
        <h2>`accessToken` object</h2>
        <Highlight>{JSON.stringify(accessTokenForView, null, 2)}</Highlight>
      </Row>
      <Row>
        <h2>Decoded `accessToken` object</h2>
        <Highlight>
          {JSON.stringify(decodedAccessTokenForView, null, 2)}
        </Highlight>
      </Row>
      <Row>
        <h2>ID Token claims</h2>
        <Highlight>{JSON.stringify(claimsForView, null, 2)}</Highlight>
      </Row>
    </Container>
  );
};

export default withAuthenticationRequired(ProfileComponent, {
  onRedirecting: () => <Loading />,
});
