import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import contentData from "../utils/contentData";
import { getChatImage } from "./logo"; // Import the function

class Content extends Component {
  render() {
    return (
      <div className="next-steps my-5">
        
        {/* <Row className="d-flex justify-content-between">
          {contentData.map((col, i) => (
            <Col key={i} md={5} className="mb-4">
              <h6 className="mb-3">
                {col.title}
              </h6>
              <p>{col.description}</p>
            </Col>
          ))}
        </Row> */}

        {/* New content added below */}
        
        
        {/* s */}
      </div>
    );
  }
}

export default Content;
