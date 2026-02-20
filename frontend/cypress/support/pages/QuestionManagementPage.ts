export class QuestionManagementPage {
  static visit() {
    cy.visit('/questions')
  }

  static getQuestionItems() {
    return cy.get('[data-cy="question-item"]')
  }

  static clickAddQuestion() {
    cy.get('[data-cy="add-question-button"]').click()
  }

  static searchFor(query: string) {
    cy.get('[data-cy="search-input"]').clear().type(query)
  }

  static selectCategory(category: string) {
    cy.get('[data-cy="category-filter"]').select(category)
  }

  static clickDeleteForQuestion(questionText: string) {
    this.getQuestionItems().contains(questionText).parent().find('[data-cy="delete-button"]').click()
  }

  static confirmDelete() {
    cy.get('[data-cy="confirm-delete-button"]').click()
  }

  static clickExportButton() {
    cy.get('[data-cy="export-button"]').click()
  }

  static selectExportFormat(format: 'CSV' | 'JSON') {
    cy.get('[data-cy="export-format-dropdown"]').click()
    cy.contains('[data-cy="format-option"]', format).click()
  }
}
