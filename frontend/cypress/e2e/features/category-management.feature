Feature: Category Management
  As a user
  I want to manage categories
  So that I can organize questions by topic

  Background:
    Given I am on the questions page

  Scenario: View list of categories
    When I view the category list
    Then I should see all categories with their question counts

  Scenario: Create a new category
    When I click the "Add Category" button
    And I enter the category name "Science"
    And I click the "Save" button
    Then I should see a success notification
    And the category should appear in the list

  Scenario: Edit a category
    Given there is a category "Mathematics"
    When I click the edit button for "Mathematics"
    And I change the name to "Math"
    And I click the "Save" button
    Then the category should be updated

  Scenario: Delete a category
    Given there is a category "Old Category"
    When I click the delete button for "Old Category"
    And I confirm the deletion
    Then I should see a success notification
    And the category should be removed
