import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

Given('there is a category {string}', (categoryName: string) => {
  cy.intercept('GET', '/api/categories*', {
    body: [{ id: 1, name: categoryName, questionCount: 5 }]
  }).as('getCategories')
})

When('I click the {string} button', (buttonText: string) => {
  cy.contains('button', buttonText).click()
})

When('I enter the category name {string}', (name: string) => {
  cy.get('[data-cy="category-name"]').clear().type(name)
})

When('I change the name to {string}', (name: string) => {
  cy.get('[data-cy="category-name"]').clear().type(name)
})

Then('I should see all categories with their question counts', () => {
  cy.get('[data-cy="category-item"]').should('have.length.greaterThan', 0)
})

Then('the category should appear in the list', () => {
  cy.get('[data-cy="category-item"]').should('be.visible')
})

Then('the category should be updated', () => {
  cy.get('[data-cy="category-item"]').should('contain', 'Math')
})

Then('the category should be removed', () => {
  cy.get('[data-cy="category-item"]').should('not.exist')
})
