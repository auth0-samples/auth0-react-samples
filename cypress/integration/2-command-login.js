/// <reference types="cypress" />
/* eslint-disable no-undef */

describe("Multi domain login", () => {
  beforeEach(() =>
    cy.sessionLogin(Cypress.env("EMAIL"), Cypress.env("PASSWORD"))
  );

  it("Logs in", () => {
    cy.get("h1").should("contain", "React.js Sample Project");
  });

  it("Logs in again", () => {
    cy.contains("React.js Sample Project");
  });
});
