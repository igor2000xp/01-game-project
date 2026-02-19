---
id: 003-update-question
unit: 002-question-crud
intent: 001-question-management
status: draft
priority: should
created: 2026-02-19T15:24:31Z
assigned_bolt: null
implemented: false
---

# Story: 003-update-question

## User Story

**As an admin/teacher**
I want to edit an existing question so that I can correct errors, improve content, or update category assignments.

**So that** the question database stays accurate and questions reflect current needs.

## Acceptance Criteria

- [ ] Given I click edit on a question, When the edit form loads, Then all current question data is pre-filled
- [ ] Given the form loads, When I see the question text, reference answer, and category populated, Then I can modify any field
- [ ] Given I modify the question text, When I save, Then the question text is updated with the new value
- [ ] Given I modify the reference answer, When I save, Then the reference answer is updated
- [ ] Given I change the category, When I save, Then the new category is associated (or removed if uncategorized)
- [ ] Given I save the changes, When the update completes, Then the updated_at timestamp is refreshed
- [ ] Given the question is used in evaluations, When I try to edit, Then I see a warning "Question is in use - changes may affect active sessions"

## Technical Notes

- Pre-fill form with GET /api/questions/:id
- Update via PUT /api/questions/:id
- Validate same rules as create (min lengths)
- Check if question has active evaluations before allowing edit
- Show warning for in-use questions but allow edit with confirmation
- Track updated_at timestamp for audit

## Dependencies

### Requires
- 002-list-questions

### Enables
- Updated question data for all views

## Edge Cases

| Scenario | Expected Behavior |
|-----------|-------------------|
| Question not found | Show "Question not found" error and redirect to list |
| Question locked (active evaluations) | Show warning dialog with "Edit Anyway" and "Cancel" options |
- Concurrent edit by another user | Show optimistic locking or "This question was modified by another user" message |
- Validation error on update | Show error message, keep form data for corrections |

## Out of Scope

- Version history/view
- Bulk edit
- Rich text formatting for edits

## Priority

**Should** - This is important for data accuracy but not blocking for core functionality.
