import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

When('I create a category named {string}', (name: string) => {
  cy.intercept('POST', '**/api/categories', {
    id: 'cat-new',
    name,
    question_count: 0,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  }).as('createCategory');

  cy.contains('[data-cy="add-category-button"]', 'Add Category').click();
  cy.get('[data-cy="category-name"]').clear().type(name);
  cy.get('button[type="submit"]').contains('Create Category').click();

  cy.wait('@createCategory');
});

When('I rename the first category to {string}', (name: string) => {
  cy.intercept('PUT', '**/api/categories/*', {
    id: 'cat-1',
    name,
    question_count: 1,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  }).as('updateCategory');
  cy.intercept('GET', '**/api/categories/with-counts*', {
    data: [
      {
        id: 'cat-1',
        name,
        question_count: 1,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
    ],
  }).as('getUpdatedCategories');

  cy.get('[data-cy="category-item"]').first().find('.edit-btn').click();
  cy.get('[data-cy="category-name"]').clear().type(name);
  cy.get('button[type="submit"]').contains('Update Category').click();

  cy.wait('@updateCategory');
  cy.wait('@getUpdatedCategories');
});

Then('I see category text {string}', (text: string) => {
  cy.get('[data-cy="category-item"]').first().should('contain.text', text);
});

When('I delete the first category', () => {
  cy.intercept('DELETE', '**/api/categories/*', { statusCode: 200, body: {} }).as(
    'deleteCategory'
  );
  cy.get('[data-cy="category-item"]').first().find('.delete-btn').click();

  cy.wait('@deleteCategory');
});
