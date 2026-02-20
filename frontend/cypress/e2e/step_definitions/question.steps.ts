import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

Given('there are questions with text {string} and {string}', (text1: string, text2: string) => {
  cy.intercept('GET', '/api/questions*', {
    body: [
      { id: 1, text: text1, categoryId: 1 },
      { id: 2, text: text2, categoryId: 2 }
    ]
  }).as('getQuestions')
})

Given('there is a question {string}', (questionText: string) => {
  cy.intercept('GET', '/api/questions*', {
    body: [
      { id: 1, text: questionText, categoryId: 1 }
    ]
  }).as('getQuestions')
})

Given('there are multiple questions', () => {
  cy.intercept('GET', '/api/questions*', {
    body: [
      { id: 1, text: 'Question 1', categoryId: 1 },
      { id: 2, text: 'Question 2', categoryId: 2 }
    ]
  }).as('getQuestions')
})

When('I click the {string} button', (buttonText: string) => {
  cy.contains('button', buttonText).click()
})

When('I fill in the question text with {string}', (text: string) => {
  cy.get('[data-cy="question-text"]').type(text)
})

When('I select the category {string}', (category: string) => {
  cy.get('[data-cy="category-select"]').select(category)
})

When('I search for {string}', (searchTerm: string) => {
  cy.get('[data-cy="search-input"]').clear().type(searchTerm)
})

Then('I should only see questions containing {string}', (searchTerm: string) => {
  cy.get('[data-cy="question-item"]').each($item => {
    cy.wrap($item).should('contain', searchTerm)
  })
})

When('I click the delete button for that question', () => {
  cy.get('[data-cy="question-item"]').first().find('[data-cy="delete-button"]').click()
})

When('I select questions {string} and {string}', (question1: string, question2: string) => {
  cy.get('[data-cy="question-item"]').contains(question1).find('[data-cy="select-checkbox"]').check()
  cy.get('[data-cy="question-item"]').contains(question2).find('[data-cy="select-checkbox"]').check()
})

When('I confirm the deletion', () => {
  cy.get('[data-cy="confirm-delete-button"]').click()
})

Then('both questions should be removed', () => {
  cy.get('[data-cy="question-item"]').should('not.exist')
})
