import React from "react";
import { ExternalApiComponent } from "../ExternalApi";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { useAuth0 } from "@auth0/auth0-react";
import { getConfig } from "../../config";

jest.mock("../../config");
jest.mock("@auth0/auth0-react");

describe("The ExternalApi component", () => {
  beforeEach(() => {
    fetch.resetMocks();

    getConfig.mockReturnValue({
      domain: "test-domain.com",
      clientId: "123",
      apiOrigin: "http://localhost:3001",
      audience: "test-audience",
    });

    useAuth0.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      getAccessTokenSilently: jest.fn(() => Promise.resolve("access-token")),
      withAuthenticationRequired: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
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
    getConfig.mockReturnValue(() => ({
      domain: "test-domain.com",
      clientId: "123",
      apiOrigin: "http://localhost:3001",
    }));

    render(<ExternalApiComponent />);

    expect(
      await screen.findByText(/You can't call the API at the moment/)
    ).toBeInTheDocument();
  });
});
