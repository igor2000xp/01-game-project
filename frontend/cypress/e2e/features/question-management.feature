@bdd @questions
Feature: Question Management
  As a content editor
  I want to maintain the question library
  So that training sessions use current and accurate material

  Background:
    Given the question management workspace is loaded with seeded data

  Rule: Discover existing questions
    Scenario Outline: Filter questions by text
      Given the question catalog includes "<first>" and "<second>"
      When I filter questions by text "<term>"
      Then only questions containing "<term>" are shown

      Examples:
        | first                           | second                            | term   |
        | What is the capital of France? | What is the capital of Germany?   | France |
        | What is 2 + 2?                 | What is 3 + 3?                    | 2 + 2  |

  Rule: Maintain questions
    Scenario: Create a new open question
      When I create an open question with:
        | text         | answer |
        | What is 2+2? | 4      |
      Then a success notification is displayed

    Scenario: Delete an existing question
      Given browser confirmations are accepted
      When I delete the first question in the list
      Then a success notification is displayed
