import { mount } from 'cypress/angular'
import { signal } from '@angular/core'
import { CategoryFormComponent } from './category-form.component'

describe('CategoryFormComponent', () => {
  it('renders form with data-cy attribute', () => {
    mount(CategoryFormComponent)
    cy.get('[data-cy="category-form"]').should('exist')
  })

  it('renders category name input with data-cy attribute', () => {
    mount(CategoryFormComponent)
    cy.get('[data-cy="category-name"]').should('exist')
  })

  it('displays "Create Category" title in create mode', () => {
    mount(CategoryFormComponent)
    cy.get('h2').should('contain', 'Create Category')
  })

  it('displays "Edit Category" title in edit mode', () => {
    mount(CategoryFormComponent, {
      componentProperties: {
        editCategory: signal({ id: 1, name: 'Math' })
      }
    })
    cy.get('h2').should('contain', 'Edit Category')
  })
})
