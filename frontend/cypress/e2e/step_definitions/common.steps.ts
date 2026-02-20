import { Before, Given, Then } from '@badeball/cypress-cucumber-preprocessor';

const seededQuestions = {
  data: [
    {
      id: 'q1',
      text: 'What is the capital of France?',
      answer: 'Paris',
      category_id: 'cat-1',
      type: 'open-ended',
      difficulty: 'easy',
      is_deleted: false,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'q2',
      text: 'What is the capital of Germany?',
      answer: 'Berlin',
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
};

const seededCategories = {
  data: [
    {
      id: 'cat-1',
      name: 'Geography',
      question_count: 2,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
  ],
};

Before(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});

Given('the question management workspace is loaded with seeded data', () => {
  cy.intercept('GET', '**/api/questions*', seededQuestions).as('getQuestions');
  cy.intercept('GET', '**/api/categories/with-counts*', seededCategories).as('getCategories');

  cy.visit('/questions');
  cy.wait('@getQuestions');
  cy.wait('@getCategories');
});

Given('browser confirmations are accepted', () => {
  cy.on('window:confirm', () => true);
});

Then('a success notification is displayed', () => {
  cy.get('[data-cy="notification"].notification-success').should('exist');
});

Then('an error notification is displayed', () => {
  cy.get('[data-cy="notification"].notification-error').should('exist');
});
