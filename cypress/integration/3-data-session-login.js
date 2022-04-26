/// <reference types="cypress" />
/* eslint-disable no-undef */

it("Logs in with data session", () => {
  cy.visit("/");
  cy.get("#qsLoginBtn").click();

  // cy.dataSessionLogin(Cypress.env("EMAIL"), Cypress.env("PASSWORD"));
});
