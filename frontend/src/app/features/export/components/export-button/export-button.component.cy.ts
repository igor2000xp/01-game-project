import { mount } from 'cypress/angular'
import { signal } from '@angular/core'
import { ExportButtonComponent } from './export-button.component'

describe('ExportButtonComponent', () => {
  it('renders export button with data-cy attribute', () => {
    mount(ExportButtonComponent)
    cy.get('[data-cy="export-button"]').should('exist')
  })

  it('displays export button text', () => {
    mount(ExportButtonComponent)
    cy.get('[data-cy="export-button"]').should('contain', 'Export')
  })

  it('opens dropdown when button is clicked', () => {
    mount(ExportButtonComponent)
    cy.get('[data-cy="export-button"]').click()
    cy.get('[data-cy="export-format-dropdown"]').should('exist')
  })

  it('renders format options with data-cy attribute', () => {
    mount(ExportButtonComponent, {
      componentProperties: {
        isDropdownOpen: signal(true)
      }
    })
    cy.get('[data-cy="export-format-dropdown"]').should('exist')
    cy.get('[data-cy="format-option"]').should('have.length.greaterThan', 0)
  })
})
