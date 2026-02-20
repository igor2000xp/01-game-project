Feature: Import and Export Questions
  As a user
  I want to import and export questions
  So that I can backup and migrate my question database

  Background:
    Given I am on the questions page

  Scenario: Export questions to CSV
    When I click the export button
    And I select CSV format
    Then a CSV file should be downloaded
    And the file should contain all questions

  Scenario: Export questions to JSON
    When I click the export button
    And I select JSON format
    Then a JSON file should be downloaded
    And the file should contain all questions

  Scenario: Import questions from CSV
    When I upload a valid CSV file
    Then I should see import progress
    And when import completes I should see a success notification
    And the imported questions should appear in the list

  Scenario: Import questions from JSON
    When I upload a valid JSON file
    Then I should see import progress
    And when import completes I should see a success notification

  Scenario: Import fails with invalid file
    When I upload an invalid file
    Then I should see an error notification
    And no questions should be added
