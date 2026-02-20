import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

Given(
  'the questions API returns items with {string} and {string}',
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
    }).as('searchQuestions');
  }
);

Given('categories are available for forms', () => {
  cy.intercept('GET', '**/api/categories/with-counts*', {
    data: [
      {
        id: 'cat-1',
        name: 'Geography',
        question_count: 2,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
    ],
  }).as('formCategories');
});

Given('the browser confirm dialog is accepted', () => {
  cy.on('window:confirm', () => true);
});

When('I search for {string}', (term: string) => {
  cy.get('[data-cy="search-input"]').clear().type(term);
  cy.wait('@searchQuestions');
});

Then('only questions containing {string} are visible', (term: string) => {
  cy.get('[data-cy="question-item"]').each(($row) => {
    cy.wrap($row).should('contain.text', term);
  });
});

When(
  'I create a question with text {string} and answer {string}',
  (text: string, answer: string) => {
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
    cy.get('[data-cy="question-text"]').type(text);
    cy.get('#question-answer').type(answer);
    cy.get('button[type="submit"]').contains('Create Question').click();

    cy.wait('@createQuestion');
  }
);

When('I delete the first question', () => {
  cy.intercept('DELETE', '**/api/questions/*', { statusCode: 200, body: {} }).as('deleteQuestion');

  cy.get('[data-cy="question-item"]').first().find('[data-cy="delete-button"]').click();
  cy.wait('@deleteQuestion');
});
