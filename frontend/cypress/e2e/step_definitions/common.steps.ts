import { Before, Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

const defaultQuestions = {
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

const defaultCategories = {
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

Given('I open the question management page', () => {
  cy.visit('/questions');
});

Given('the backend list endpoints are stubbed', () => {
  cy.intercept('GET', '**/api/questions*', defaultQuestions).as('getQuestions');
  cy.intercept('GET', '**/api/categories/with-counts*', defaultCategories).as('getCategories');
});

When('the initial data loads', () => {
  cy.wait('@getQuestions');
  cy.wait('@getCategories');
});

Then('I see question rows', () => {
  cy.get('[data-cy="question-item"]').should('have.length.greaterThan', 0);
});

Then('I see category entries', () => {
  cy.get('[data-cy="category-item"]').should('have.length.greaterThan', 0);
});

Then('I should see a success notification', () => {
  cy.get('[data-cy="notification"].notification-success').should('exist');
});

Then('I should see an error notification', () => {
  cy.get('[data-cy="notification"].notification-error').should('exist');
});
