---
id: 006-category-ui
unit: 001-question-management-ui
intent: 001-question-management
status: draft
priority: should
created: 2026-02-19T15:24:31Z
assigned_bolt: null
implemented: false
---

# Story: 006-category-ui

## User Story

**As an admin/teacher**
I want a category management interface so that I can create, view, edit, and delete categories for organizing questions.

**So that** I can maintain the category structure and ensure questions are properly grouped.

## Acceptance Criteria

- [ ] Given I navigate to the categories section, When I access it, Then I see a list of all categories with question counts
- [ ] Given I want to create a category, When I click "Add Category", Then I see a form for category name and description
- [ ] Given I enter a name (min 3 chars), When the form validates, Then I can submit the category
- [ ] Given I hover on a category, When I hover, Then I see a tooltip with the category description
- [ ] Given I click edit on a category, When the edit modal opens, Then current data is pre-filled
- [ ] Given I save changes, When the update completes, Then the category is updated in the list
- [ ] Given I click delete on a category, When I click, Then I see a confirmation dialog with question count
- [ ] Given I confirm deletion, When I proceed, Then I choose between cascade delete (also delete questions) or unassign questions

## Technical Notes

- Category list page or section
- Create/Edit modals or dialogs
- Question count display for each category
- Inline edit (edit in place) or modal
- Delete confirmation with cascade options
- Category dropdown in question forms

## Dependencies

### Requires
- 002-list-categories

### Enables
- Category management
- Category filtering in question list

## Edge Cases

| Scenario | Expected Behavior |
|-----------|-------------------|
- No categories exist | Show "No categories" message with link to create first category |
- Category name duplicate | Show validation error |
- Category in use (has questions) | Show warning in delete confirmation, require explicit confirmation |
- Category deletion cascade | Show impact count, confirm "This will delete X questions" |

## Out of Scope

- Category color/icon customization
- Category hierarchy/nesting
- Category drag-and-drop reordering
- Bulk category operations

## Priority

**Should** - This is important for category organization but not blocking for core functionality.
