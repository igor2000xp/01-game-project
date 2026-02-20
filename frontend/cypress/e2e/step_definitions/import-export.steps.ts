import { When, Then } from '@badeball/cypress-cucumber-preprocessor'

When('I click the export button', () => {
  cy.get('[data-cy="export-button"]').click()
})

When('I select {string} format', (format: string) => {
  cy.contains(`[data-cy="format-option"]`, format).click()
})

Then('a {string} file should be downloaded', (extension: string) => {
  cy.get('[data-cy="download-link"]').should('have.attr', 'href').and('include', `.${extension}`)
})

Then('the file should contain all questions', () => {
  cy.get('[data-cy="download-link"]').should('exist')
})

When('I upload a valid CSV file', () => {
  cy.intercept('POST', '/api/import', { statusCode: 200, body: { id: 'import-123', status: 'completed' } }).as('import')
  cy.intercept('GET', '/api/import/import-123', { statusCode: 200, body: { status: 'completed', total: 2, processed: 2 } }).as('importStatus')
  cy.get('[data-cy="file-upload"]').selectFile('cypress/fixtures/test-questions.csv')
})

When('I upload a valid JSON file', () => {
  cy.intercept('POST', '/api/import', { statusCode: 200, body: { id: 'import-123', status: 'completed' } }).as('import')
  cy.get('[data-cy="file-upload"]').selectFile('cypress/fixtures/questions.json')
})

When('I upload an invalid file', () => {
  cy.intercept('POST', '/api/import', { statusCode: 400, body: { error: 'Invalid file format' } }).as('importError')
  cy.get('[data-cy="file-upload"]').selectFile('cypress/fixtures/invalid.txt')
})

Then('I should see import progress', () => {
  cy.get('[data-cy="import-progress"]').should('be.visible')
})

When('import completes I should see a success notification', () => {
  cy.wait('@importStatus')
  cy.get('[data-cy="notification"]').should('contain', 'success')
})

Then('the imported questions should appear in the list', () => {
  cy.get('[data-cy="question-item"]').should('have.length.greaterThan', 0)
})

Then('no questions should be added', () => {
  cy.get('[data-cy="question-item"]').should('not.exist')
})
