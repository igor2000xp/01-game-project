import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

Given('export endpoint is stubbed for {string}', (format: string) => {
  const mime = format.toLowerCase() === 'csv' ? 'text/csv' : 'application/json';
  cy.intercept('POST', '**/api/questions/export', {
    statusCode: 200,
    headers: { 'content-type': mime },
    body: format.toLowerCase() === 'csv' ? 'id,text\n1,Question' : '{"data":[]}',
  }).as('exportQuestions');
});

When('I export questions as {string}', (format: string) => {
  cy.get('[data-cy="export-button"]').click();
  cy.contains('[data-cy="format-option"]', format.toUpperCase()).click();
});

Then('an export request for {string} is sent', (format: string) => {
  cy.wait('@exportQuestions')
    .its('request.body')
    .should('include', { format: format.toLowerCase() });
});

Given('successful import endpoints are stubbed', () => {
  cy.intercept('POST', '**/api/questions/import', {
    statusCode: 200,
    body: { session_id: 'session-123' },
  }).as('uploadFile');
  cy.intercept('GET', '**/api/questions/import/session-123/status', {
    statusCode: 200,
    body: {
      sessionId: 'session-123',
      status: 'completed',
      total: 2,
      processed: 2,
      success: 2,
      failed: 0,
      errors: [],
    },
  }).as('importStatus');
});

Given('failed import upload endpoint is stubbed', () => {
  cy.intercept('POST', '**/api/questions/import', {
    statusCode: 400,
    body: { message: 'Invalid file format' },
  }).as('uploadFileError');
});

When('I upload file {string}', (fixtureFile: string) => {
  cy.contains('button', 'Import').click();
  cy.get('input[type="file"]').selectFile(`cypress/fixtures/${fixtureFile}`, { force: true });

  if (!fixtureFile.endsWith('.txt')) {
    cy.wait('@uploadFile');
    cy.wait('@importStatus');
  }
});

Then('I see file validation error', () => {
  cy.get('[data-cy="error-message"]').should('contain.text', 'CSV or JSON');
});

Then('no import upload request is sent', () => {
  cy.get('@uploadFileError.all').should('have.length', 0);
});
