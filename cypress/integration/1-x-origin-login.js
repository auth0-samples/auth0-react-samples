/// <reference types="cypress" />
/* eslint-disable no-undef */

describe("Multi domain login", () => {
  it.skip("should reproduce x-origin issue", () => {
    cy.visit("/");
    cy.get("#qsLoginBtn").click();
    cy.get("input[inputmode='email']").type(Cypress.env("EMAIL"));
    cy.get("input[type='password']").type(Cypress.env("PASSWORD"));
    cy.get("button[type='submit']").click();
  });

  it("Logs in with Auth0", () => {
    cy.visit("/");
    cy.get("#qsLoginBtn").click();

    cy.origin(Cypress.env("AUTH_URL"), () => {
      cy.get("input[inputmode='email']").type(Cypress.env("EMAIL"));
      cy.get("input[type='password']").type(Cypress.env("PASSWORD"));
      cy.contains("button[type='submit']", "Continue").click();
    });

    cy.get("h1").should("contain", "React.js Sample Project");
  });
});
