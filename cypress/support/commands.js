/* eslint-disable no-undef */

Cypress.Commands.add("sessionLogin", (email, password) => {
  const args = [email, password];

  cy.session(args, () => {
    cy.visit("/");
    cy.get("#qsLoginBtn").click();

    cy.origin(Cypress.env("AUTH_URL"), { args }, (args) => {
      cy.get("input[inputmode='email']").type(args[0]);
      cy.get("input[type='password']").type(args[1]);
      cy.contains("button[type='submit']", "Continue").click();
    });
  });
  return cy.visit("/");
});

Cypress.Commands.add("dataSessionLogin", (email, password) => {
  const args = [email, password];

  // cy.visit("/");
  // cy.get("#qsLoginBtn").click();

  cy.dataSession({
    name: `${email}-${password}`,

    // init: () => {
    //   cy.log(
    //     `**init()**: runs when there is nothing in cache. Yields the value to validate()`
    //   );
    // },

    validate: () => {
      cy.log(`**validate()**`);

      return true;
    },

    setup: () => {
      cy.log(`**setup()**`);
      return cy.origin(Cypress.env("AUTH_URL"), { args }, (args) => {
        cy.get("input[inputmode='email']").type(args[0]);
        cy.get("input[type='password']").type(args[1]);
        cy.contains("button[type='submit']", "Continue").click();
      });
    },

    // recreate: () => {
    //   cy.log(`**recreate()**:`);
    //   Promise.resolve();
    // },

    // onInvalidated: () => {
    //   cy.log(`**onInvalidated**`);
    //   Cypress.clearDataSession(sessionName);
    // },

    // shareAcrossSpecs: true,
  });
});
