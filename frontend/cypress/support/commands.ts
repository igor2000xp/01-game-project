declare global {
  namespace Cypress {
    interface Chainable {
      mountWithMocks: typeof mountWithMocks
      clickByDataCy: typeof clickByDataCy
      typeByDataCy: typeof typeByDataCy
      verifyNotification: typeof verifyNotification
    }
  }
}

Cypress.Commands.add('mountWithMocks', (component, mocks) => {
  const providers = Object.entries(mocks).map(([token, mock]) => ({
    provide: token,
    useValue: mock
  }))
  return mount(component, { providers })
})

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
