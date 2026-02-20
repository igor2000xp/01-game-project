declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      clickByDataCy(selector: string): Chainable<Subject>
      typeByDataCy(selector: string, text: string): Chainable<Subject>
      verifyNotification(
        type: 'success' | 'error' | 'warning' | 'info',
        message?: string
      ): Chainable<Subject>
    }
  }
}

Cypress.Commands.add('clickByDataCy', (selector: string) => {
  cy.get(`[data-cy="${selector}"]`).click()
})

Cypress.Commands.add('typeByDataCy', (selector: string, text: string) => {
  cy.get(`[data-cy="${selector}"]`).type(text)
})

Cypress.Commands.add('verifyNotification', (type: 'success' | 'error' | 'warning' | 'info', message?: string) => {
  cy.get('[data-cy="notification"]')
    .should('have.class', `notification-${type}`)
  if (message) {
    cy.get('[data-cy="notification"]').should('contain', message)
  }
})

export {}
