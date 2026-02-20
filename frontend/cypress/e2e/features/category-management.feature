@bdd @categories
Feature: Category Management
  As a content editor
  I want to maintain categories
  So that questions are grouped by topic

  Background:
    Given the question management workspace is loaded with seeded data

  Rule: Maintain category catalog
    Scenario: Create a category
      When I create a category named "Science"
      Then a success notification is displayed

    Scenario: Rename a category
      When I rename the first category to "Mathematics"
      Then the category list includes "Mathematics"

    Scenario: Delete a category
      Given browser confirmations are accepted
      When I delete the first category in the list
      Then a success notification is displayed
