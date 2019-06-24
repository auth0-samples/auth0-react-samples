import React, { Component } from "react";

import { Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import contentData from "../utils/contentData";

class Content extends Component {
  render() {
    return (
      <div className="next-steps">
        <h2 className="mt-5 text-center">What can I do next?</h2>
          <Row className="d-flex justify-content-between">
            {contentData.map((col, i) => (
              <Col key={i} md={5}>
                <h6 className="mb-3">
                  <a href={col.link}>
                    <FontAwesomeIcon icon="link" />
                    {col.title}
                  </a>
                </h6>
                <p>{col.description}</p>
              </Col>
            ))}
          </Row>
      </div>
    );
  }
}

export default Content;
