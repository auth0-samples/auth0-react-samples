import React from "react";
import ReactDOM from "react-dom";
import { ExternalApiComponent } from "../ExternalApi";

it("renders", () => {
  const div = document.createElement("div");
  ReactDOM.render(<ExternalApiComponent />, div);
});
