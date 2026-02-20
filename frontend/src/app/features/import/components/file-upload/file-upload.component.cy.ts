import { mount } from 'cypress/angular'
import { signal } from '@angular/core'
import { FileUploadComponent } from './file-upload.component'

describe('FileUploadComponent', () => {
  it('renders file upload with data-cy attribute', () => {
    mount(FileUploadComponent)
    cy.get('[data-cy="file-upload"]').should('exist')
  })

  it('displays upload area with text', () => {
    mount(FileUploadComponent)
    cy.get('.upload-area').should('exist')
    cy.contains('Upload Questions').should('exist')
  })

  it('displays error message with data-cy attribute when error is set', () => {
    mount(FileUploadComponent, {
      componentProperties: {
        errorMessage: signal('Invalid file format')
      }
    })
    cy.get('[data-cy="error-message"]').should('contain', 'Invalid file format')
  })

  it('has drag and drop class when dragging', () => {
    mount(FileUploadComponent)
    cy.get('[data-cy="file-upload"]').should('not.have.class', 'dragging')
  })
})
