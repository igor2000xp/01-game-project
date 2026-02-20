import { mount } from 'cypress/angular'
import { signal } from '@angular/core'
import { QuestionFormComponent } from './question-form.component'

describe('QuestionFormComponent', () => {
  const mockCategories = [
    { id: 1, name: 'Math' },
    { id: 2, name: 'Geography' }
  ]

  it('renders form with data-cy attribute', () => {
    mount(QuestionFormComponent, {
      componentProperties: {
        categories: signal(mockCategories)
      }
    })
    cy.get('[data-cy="question-form"]').should('exist')
  })

  it('renders question text input with data-cy attribute', () => {
    mount(QuestionFormComponent, {
      componentProperties: {
        categories: signal(mockCategories)
      }
    })
    cy.get('[data-cy="question-text"]').should('exist')
  })

  it('renders category select with data-cy attribute', () => {
    mount(QuestionFormComponent, {
      componentProperties: {
        categories: signal(mockCategories)
      }
    })
    cy.get('[data-cy="category-select"]').should('exist')
  })

  it('displays "Create Question" title in create mode', () => {
    mount(QuestionFormComponent, {
      componentProperties: {
        categories: signal(mockCategories)
      }
    })
    cy.get('h2').should('contain', 'Create Question')
  })
})
