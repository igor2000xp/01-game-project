Feature: Question Management
  As a user
  I want to manage questions
  So that I can maintain the question database

  Background:
    Given I am on the questions page
    And the API is available

  Scenario: View list of questions
    When the questions load
    Then I should see a list of questions
    And the list should be paginated

  Scenario: Create a new question
    When I click the "Add Question" button
    And I fill in the question text with "What is the capital of France?"
    And I select the category "Geography"
    And I click the "Save" button
    Then I should see a success notification
    And the question should appear in the list

  Scenario: Search for questions
    Given there are questions with text "France" and "Germany"
    When I search for "France"
    Then I should only see questions containing "France"

  Scenario: Delete a question
    Given there is a question "What is 2+2?"
    When I click the delete button for that question
    And I confirm the deletion
    Then I should see a success notification
    And the question should be removed from the list

  Scenario: Bulk delete questions
    Given there are multiple questions
    When I select questions "Question 1" and "Question 2"
    And I click the "Delete Selected" button
    And I confirm the deletion
    Then both questions should be removed
