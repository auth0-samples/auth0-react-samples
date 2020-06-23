import React from "react";
import ReactDOM from "react-dom";
import { ProfileComponent } from "../Profile";

jest.mock("@auth0/auth0-react", () => ({
  useAuth0: jest.fn(() => ({
    loading: false,
    user: {
      name: "Test user",
      email: "test@user.com",
      picture: "https://avatar.com",
    },
  })),
  withAuthenticationRequired: jest.fn(),
}));

describe("The profile component", () => {
  it("renders when loading = true", () => {
    const div = document.createElement("div");
    ReactDOM.render(<ProfileComponent />, div);
  });
});
