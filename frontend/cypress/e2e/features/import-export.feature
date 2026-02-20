@bdd @import-export
Feature: Import and Export Questions
  As a content editor
  I want to import and export questions
  So that I can migrate and back up the catalog safely

  Background:
    Given the question management workspace is loaded with seeded data

  Rule: Export catalog
    Scenario Outline: Export questions in supported formats
      Given export service returns a "<format>" payload
      When I request question export in "<format>" format
      Then the export request uses "<format>" format
      And a success notification is displayed

      Examples:
        | format |
        | CSV    |
        | JSON   |

  Rule: Import catalog
    Scenario: Import a valid CSV file
      Given import processing eventually succeeds
      When I import fixture file "test-questions.csv"
      Then a success notification is displayed

    Scenario: Reject unsupported import files
      Given import upload endpoint is observed
      When I import fixture file "invalid.txt"
      Then I see file validation feedback
      And no import upload request is sent
