import { mount } from 'cypress/angular'
import { signal } from '@angular/core'
import { QuestionFilterComponent } from './question-filter.component'

describe('QuestionFilterComponent', () => {
  const mockCategories = [
    { id: 1, name: 'Math', question_count: 5 },
    { id: 2, name: 'Geography', question_count: 3 }
  ]

  it('renders filter with data-cy attribute', () => {
    mount(QuestionFilterComponent, {
      componentProperties: {
        showFilter: signal(true),
        categories: signal(mockCategories)
      }
    })
    cy.get('[data-cy="question-filter"]').should('exist')
  })

  it('renders search input with data-cy attribute', () => {
    mount(QuestionFilterComponent, {
      componentProperties: {
        showFilter: signal(true),
        categories: signal(mockCategories)
      }
    })
    cy.get('[data-cy="search-input"]').should('exist')
  })

  it('renders category select with data-cy attribute', () => {
    mount(QuestionFilterComponent, {
      componentProperties: {
        showFilter: signal(true),
        categories: signal(mockCategories)
      }
    })
    cy.get('[data-cy="category-filter"]').should('exist')
  })

  it('does not render filter when showFilter is false', () => {
    mount(QuestionFilterComponent, {
      componentProperties: {
        showFilter: signal(false),
        categories: signal(mockCategories)
      }
    })
    cy.get('[data-cy="question-filter"]').should('not.exist')
  })
})
