import React from "react";
import { ExternalApiComponent } from "../ExternalApi";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

jest.mock("@auth0/auth0-react", () => ({
  useAuth0: jest.fn(() => ({
    isLoading: false,
    isAuthenticated: true,
    getAccessTokenSilently: jest.fn(() => Promise.resolve("access-token")),
  })),
  withAuthenticationRequired: jest.fn(),
}));

jest.mock("../../config", () => ({
  getConfig: jest.fn(() => ({
    domain: "test-domain.com",
    clientId: "123",
    apiOrigin: "http://localhost:3001",
    audience: "test-audience",
  })),
}));

describe("The ExternalApi component", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it("renders", () => {
    render(<ExternalApiComponent />);
  });

  it("makes a call to the API when the button is clicked", async () => {
    fetch.mockResponseOnce(JSON.stringify({ msg: "This is the API result" }));

    render(<ExternalApiComponent />);
    fireEvent.click(screen.getByText("Ping API"));

    await waitFor(() => screen.getByTestId("api-result"));

    expect(
      await screen.findByText(/This is the API result/)
    ).toBeInTheDocument();
  });

  it("shows the warning content when there is no audience", async () => {
    const { getConfig } = require("../../config");

    getConfig.mockImplementation(() => ({
      getConfig: () => ({
        domain: "test-domain.com",
        clientId: "123",
        apiOrigin: "http://localhost:3001",
      }),
    }));

    render(<ExternalApiComponent />);

    expect(
      await screen.findByText(/You can't call the API at the moment/)
    ).toBeInTheDocument();
  });
});
