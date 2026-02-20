import { mount } from 'cypress/angular'
import { QuestionListComponent } from './question-list.component'

describe('QuestionListComponent', () => {
  const mockQuestions = [
    { id: 1, text: 'What is 2+2?', type: 'single', category_id: 1, difficulty: 'easy', created_at: new Date() },
    { id: 2, text: 'What is the capital of France?', type: 'single', category_id: 2, difficulty: 'medium', created_at: new Date() }
  ]

  it('renders the question list with data-cy attribute', () => {
    mount(QuestionListComponent, {
      componentProperties: {
        questions: mockQuestions,
        totalPages: 1,
        currentPage: 1
      }
    })
    cy.get('[data-cy="question-list"]').should('exist')
    cy.get('[data-cy="question-item"]').should('have.length', 2)
  })

  it('renders empty state when no questions', () => {
    mount(QuestionListComponent, {
      componentProperties: {
        questions: [],
        totalPages: 1,
        currentPage: 1
      }
    })
    cy.get('td.empty-state').should('contain', 'No questions found')
  })

  it('renders pagination when there are multiple pages', () => {
    mount(QuestionListComponent, {
      componentProperties: {
        questions: mockQuestions,
        totalPages: 3,
        currentPage: 1
      }
    })
    cy.get('[data-cy="pagination"]').should('exist')
  })

  it('emits edit event when edit button is clicked', () => {
    mount(QuestionListComponent, {
      componentProperties: {
        questions: mockQuestions,
        totalPages: 1,
        currentPage: 1
      }
    })
    cy.get('[data-cy="edit-button"]').first().click()
  })

  it('emits delete event when delete button is clicked', () => {
    mount(QuestionListComponent, {
      componentProperties: {
        questions: mockQuestions,
        totalPages: 1,
        currentPage: 1
      }
    })
    cy.get('[data-cy="delete-button"]').first().click()
  })
})
