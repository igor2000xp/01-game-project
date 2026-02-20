import { Given, When, Then, Before } from '@badeball/cypress-cucumber-preprocessor'

Before(() => {
  cy.clearCookies()
  cy.clearLocalStorage()
})

Given('I am on the questions page', () => {
  cy.visit('/questions')
})

Given('the API is available', () => {
  cy.intercept('GET', '/api/questions*', { fixture: 'questions.json' }).as('getQuestions')
})

Given('I view the category list', () => {
  cy.get('[data-cy="category-list-toggle"]').click()
})

When('the questions load', () => {
  cy.wait('@getQuestions')
})

Then('I should see a list of questions', () => {
  cy.get('[data-cy="question-item"]').should('have.length.greaterThan', 0)
})

Then('the list should be paginated', () => {
  cy.get('[data-cy="pagination"]').should('exist')
})

Then('I should see a success notification', () => {
  cy.get('[data-cy="notification"]').should('contain', 'success')
})

Then('I should see an error notification', () => {
  cy.get('[data-cy="notification"]').should('contain', 'error')
})

Then('the question should appear in the list', () => {
  cy.get('[data-cy="question-item"]').should('be.visible')
})

Then('the question should be removed from the list', () => {
  cy.get('[data-cy="question-item"]').should('not.exist')
})
