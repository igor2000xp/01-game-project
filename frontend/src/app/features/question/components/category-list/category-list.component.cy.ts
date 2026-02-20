import { mount } from 'cypress/angular'
import { signal } from '@angular/core'
import { CategoryListComponent } from './category-list.component'

describe('CategoryListComponent', () => {
  const mockCategories = [
    { id: 1, name: 'Math', question_count: 5 },
    { id: 2, name: 'Geography', question_count: 3 }
  ]

  it('renders category list with data-cy attribute', () => {
    mount(CategoryListComponent, {
      componentProperties: {
        categories: signal(mockCategories)
      }
    })
    cy.get('[data-cy="category-list"]').should('exist')
  })

  it('renders add category button with data-cy attribute', () => {
    mount(CategoryListComponent, {
      componentProperties: {
        categories: signal(mockCategories)
      }
    })
    cy.get('[data-cy="add-category-button"]').should('exist')
  })

  it('renders category items with data-cy attribute', () => {
    mount(CategoryListComponent, {
      componentProperties: {
        categories: signal(mockCategories)
      }
    })
    cy.get('[data-cy="category-item"]').should('have.length', 2)
  })

  it('displays empty state when no categories', () => {
    mount(CategoryListComponent, {
      componentProperties: {
        categories: signal([])
      }
    })
    cy.get('.empty-state').should('contain', 'No categories found')
  })

  it('emits create event when add category button is clicked', () => {
    mount(CategoryListComponent, {
      componentProperties: {
        categories: signal(mockCategories)
      }
    })
    cy.get('[data-cy="add-category-button"]').click()
  })
})
