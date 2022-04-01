import React from "react";
import ReactDOM from "react-dom";
import { ProfileComponent } from "../Profile";
import { useAuth0 } from "@auth0/auth0-react";

jest.mock("@auth0/auth0-react");

describe("The profile component", () => {
  beforeEach(() => {
    useAuth0.mockReturnValue({
      loading: false,
      user: {
        name: "Test user",
        email: "test@user.com",
        picture: "https://avatar.com",
      },
    });
  });

  it("renders when loading = true", () => {
    const div = document.createElement("div");
    ReactDOM.render(<ProfileComponent />, div);
  });
});
