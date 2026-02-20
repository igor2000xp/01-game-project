Feature: Import and Export Questions
  As a user
  I want to import and export questions
  So that I can backup and migrate my question database

  Background:
    Given I open the question management page
    And the backend list endpoints are stubbed
    When the initial data loads

  Scenario Outline: Export questions
    Given export endpoint is stubbed for "<format>"
    When I export questions as "<format>"
    Then an export request for "<format>" is sent
    And I should see a success notification

    Examples:
      | format |
      | CSV    |
      | JSON   |

  Scenario: Import a valid CSV file
    Given successful import endpoints are stubbed
    When I upload file "test-questions.csv"
    Then I should see a success notification

  Scenario: Import fails with invalid file
    Given failed import upload endpoint is stubbed
    When I upload file "invalid.txt"
    Then I see file validation error
    And no import upload request is sent
