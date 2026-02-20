import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

Given('export service returns a {string} payload', (format: string) => {
  const lowered = format.toLowerCase();
  const mime = lowered === 'csv' ? 'text/csv' : 'application/json';

  cy.intercept('POST', '**/api/questions/export', {
    statusCode: 200,
    headers: { 'content-type': mime },
    body: lowered === 'csv' ? 'id,text\n1,Question' : '{"data":[]}',
  }).as('exportQuestions');
});

When('I request question export in {string} format', (format: string) => {
  cy.get('[data-cy="export-button"]').click();
  cy.contains('[data-cy="format-option"]', format.toUpperCase()).click();
});

Then('the export request uses {string} format', (format: string) => {
  cy.wait('@exportQuestions')
    .its('request.body')
    .should('include', { format: format.toLowerCase() });
});

Given('import processing eventually succeeds', () => {
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

Given('import upload endpoint is observed', () => {
  cy.intercept('POST', '**/api/questions/import', {
    statusCode: 400,
    body: { message: 'Invalid file format' },
  }).as('uploadObserved');
});

When('I import fixture file {string}', (fixtureFile: string) => {
  cy.contains('button', 'Import').click();
  cy.get('input[type="file"]').selectFile(`cypress/fixtures/${fixtureFile}`, {
    force: true,
  });

  if (!fixtureFile.endsWith('.txt')) {
    cy.wait('@uploadFile');
    cy.wait('@importStatus');
  }
});

Then('I see file validation feedback', () => {
  cy.get('[data-cy="error-message"]').should('contain.text', 'CSV or JSON');
});

Then('no import upload request is sent', () => {
  cy.get('@uploadObserved.all').should('have.length', 0);
});
