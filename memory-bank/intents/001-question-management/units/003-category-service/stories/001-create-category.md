---
id: 001-create-category
unit: 003-category-service
intent: 001-question-management
status: draft
priority: must
created: 2026-02-19T15:24:31Z
assigned_bolt: null
implemented: false
---

# Story: 001-create-category

## User Story

**As an admin/teacher**
I want to create a new category so that I can organize questions by topics for better management.

**So that** questions can be grouped logically for easier filtering and navigation.

## Acceptance Criteria

- [ ] Given I am on the category management page, When I click "Add Category", Then I see a form for category name and description
- [ ] Given the form loads, When I enter a category name (min 3 chars), Then I can proceed to description
- [ ] Given I enter a description (optional), When I save, Then the description is stored
- [ ] Given I leave description empty, When I save, Then the category is created without description
- [ ] Given I submit a valid name, When I save, Then the category is created with a unique ID
- [ ] Given the category name already exists, When I submit, Then I see an error "Category name already exists"

## Technical Notes

- Use reactive form with real-time validation
- Category name: min 3, max 50 characters
- Category description: max 200 characters, optional
- Unique name validation against existing categories
- POST /api/categories to create
- Success message/toast on creation

## Dependencies

### Requires
None (independent story)

### Enables
- 002-list-categories
- Category assignment in question forms

## Edge Cases

| Scenario | Expected Behavior |
|-----------|-------------------|
| Category name with special characters | Allow special characters, sanitize input |
- Category name too short/long | Show validation error with min/max requirements |
- Duplicate name | Show "Category name already exists" error |

## Out of Scope

- Category color/icon customization
- Category hierarchy (nested categories)
- Category permissions/roles

## Priority

**Must** - This is core functionality required for category management to work.
