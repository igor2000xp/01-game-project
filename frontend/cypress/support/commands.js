/* eslint-disable no-undef */
Cypress.Commands.add('clickByDataCy', (selector) => {
  cy.get(`[data-cy="${selector}"]`).click();
});

Cypress.Commands.add('typeByDataCy', (selector, text) => {
  cy.get(`[data-cy="${selector}"]`).type(text);
});

Cypress.Commands.add('verifyNotification', (type, message) => {
  cy.get('[data-cy="notification"]').should('have.class', `notification-${type}`);
  if (message) {
    cy.get('[data-cy="notification"]').should('contain', message);
  }
});
