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
});
