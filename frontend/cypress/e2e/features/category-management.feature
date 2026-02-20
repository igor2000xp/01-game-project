Feature: Category Management
  As a user
  I want to manage categories
  So that I can organize questions by topic

  Background:
    Given I open the question management page
    And the backend list endpoints are stubbed
    When the initial data loads

  Scenario: View category list with counts
    Then I see category entries

  Scenario: Create a new category
    When I create a category named "Science"
    Then I should see a success notification

  Scenario: Edit a category
    When I rename the first category to "Mathematics"
    Then I see category text "Mathematics"

  Scenario: Delete a category
    Given the browser confirm dialog is accepted
    When I delete the first category
    Then I should see a success notification
