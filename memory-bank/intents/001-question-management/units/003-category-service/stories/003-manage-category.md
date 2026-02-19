---
id: 003-manage-category
unit: 003-category-service
intent: 001-question-management
status: draft
priority: should
created: 2026-02-19T15:24:31Z
assigned_bolt: null
implemented: false
---

# Story: 003-manage-category

## User Story

**As an admin/teacher**
I want to update and delete categories so that I can maintain the category structure as the question database evolves.

**So that** categories remain relevant and unused categories don't clutter the interface.

## Acceptance Criteria

- [ ] Given I click edit on a category, When the edit form loads, Then current category data is pre-filled
- [ ] Given the form loads, When I modify the name or description, Then I can save the changes
- [ ] Given I save the changes, When the update completes, Then the category is updated
- [ ] Given I click delete on a category, When I click, Then I see a confirmation dialog
- [ ] Given I confirm deletion, When I proceed, Then I need to choose between "Cascade delete" (also delete questions) or "Unassign questions" (set to uncategorized)
- [ ] Given I choose cascade delete, When the operation completes, Then the category and all its questions are deleted
- [ ] Given I choose unassign, When the operation completes, Then the category is deleted and questions are set to uncategorized
- [ ] Given a category has questions, When I try to delete, Then I see the question count in the confirmation

## Technical Notes

- Edit via PUT /api/categories/:id
- Delete via DELETE /api/categories/:id with query param for cascade choice
- Check question count before delete confirmation
- Show confirmation with cascade options
- Update category list after any change

## Dependencies

### Requires
- 002-list-categories

### Enables
- Updated category list
- Category reassignment for questions (on unassign)

## Edge Cases

| Scenario | Expected Behavior |
|-----------|-------------------|
| Category not found | Show "Category not found" error |
- Category name already exists | Show validation error on update |
- Delete category in use by questions | Block deletion, show "Category has X questions in use" |
- Network error during update/delete | Show error message, keep form for retry |

## Out of Scope

- Category history/versioning
- Category merge/split
- Bulk category operations

## Priority

**Should** - This is important for maintaining category relevance but not blocking for core functionality.
