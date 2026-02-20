Feature: Question Management
  As a user
  I want to manage questions
  So that I can maintain the question database

  Background:
    Given I open the question management page
    And the backend list endpoints are stubbed
    When the initial data loads

  Scenario: View list of questions
    Then I see question rows
    And I see category entries

  Scenario Outline: Search questions by text
    Given the questions API returns items with "<first>" and "<second>"
    When I search for "<term>"
    Then only questions containing "<term>" are visible

    Examples:
      | first                       | second                      | term   |
      | What is the capital of France? | What is the capital of Germany? | France |

  Scenario: Create a new question
    Given categories are available for forms
    When I create a question with text "What is 2+2?" and answer "4"
    Then I should see a success notification

  Scenario: Delete a question
    Given the browser confirm dialog is accepted
    When I delete the first question
    Then I should see a success notification
