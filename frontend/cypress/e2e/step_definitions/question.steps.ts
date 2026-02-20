import { DataTable } from '@cucumber/cucumber';
import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

Given(
  'the question catalog includes {string} and {string}',
  (first: string, second: string) => {
    cy.intercept('GET', '**/api/questions*', {
      data: [
        {
          id: 'q1',
          text: first,
          answer: 'A1',
          category_id: 'cat-1',
          type: 'open-ended',
          difficulty: 'easy',
          is_deleted: false,
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'q2',
          text: second,
          answer: 'A2',
          category_id: 'cat-1',
          type: 'open-ended',
          difficulty: 'easy',
          is_deleted: false,
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z',
        },
      ],
      total: 2,
      page: 1,
      limit: 20,
    }).as('filteredQuestions');
  }
);

When('I filter questions by text {string}', (term: string) => {
  cy.get('[data-cy="search-input"]').clear().type(term);
  cy.wait('@filteredQuestions');
});

Then('only questions containing {string} are shown', (term: string) => {
  cy.get('[data-cy="question-item"]').each(($row) => {
    cy.wrap($row).should('contain.text', term);
  });
});

When('I create an open question with:', (table: DataTable) => {
  const [row] = table.hashes() as Array<{ text: string; answer: string }>;
  const { text, answer } = row;

  cy.intercept('POST', '**/api/questions', {
    id: 'q-new',
    text,
    answer,
    type: 'open-ended',
    is_deleted: false,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  }).as('createQuestion');

  cy.contains('button', 'Add Question').click();
  cy.get('[data-cy="question-text"]').clear().type(text);
  cy.get('#question-answer').clear().type(answer);
  cy.get('button[type="submit"]').contains('Create Question').click();

  cy.wait('@createQuestion');
});

When('I delete the first question in the list', () => {
  cy.intercept('DELETE', '**/api/questions/*', { statusCode: 200, body: {} }).as(
    'deleteQuestion'
  );

  cy.get('[data-cy="question-item"]').first().find('[data-cy="delete-button"]').click();
  cy.wait('@deleteQuestion');
});
