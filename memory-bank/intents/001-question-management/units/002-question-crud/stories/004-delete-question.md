---
id: 004-delete-question
unit: 002-question-crud
intent: 001-question-management
status: draft
priority: should
created: 2026-02-19T15:24:31Z
assigned_bolt: null
implemented: false
---

# Story: 004-delete-question

## User Story

**As an admin/teacher**
I want to delete a question so that I can remove outdated or incorrect content from the database.

**So that** the question database remains clean and only relevant content is available.

## Acceptance Criteria

- [ ] Given I click delete on a question, When I click, Then I see a confirmation dialog
- [ ] Given the confirmation dialog appears, When I read it, Then I see the question text and a warning about deletion
- [ ] Given I confirm the deletion, When I proceed, Then the question is soft deleted (is_deleted flag set to true)
- [ ] Given the question is deleted, When the operation completes, Then I see a success message and the question is removed from the list
- [ ] Given the question has active evaluations, When I try to delete, Then deletion is blocked with error "Cannot delete question with active evaluations"
- [ ] Given I use bulk delete by category, When I select a category, Then all questions in that category are soft deleted with one confirmation

## Technical Notes

- Soft delete using PUT /api/questions/:id with {is_deleted: true}
- Delete single question: DELETE /api/questions/:id
- Bulk delete: DELETE /api/questions with category filter
- Check for active evaluations before allowing delete
- Show confirmation dialog with question details
- Success message/toast after deletion
- Filter deleted questions from list

## Dependencies

### Requires
- 002-list-questions

### Enables
- Clean question database, space reclamation

## Edge Cases

| Scenario | Expected Behavior |
|-----------|-------------------|
| Question not found | Show "Question not found" error |
| Question already soft deleted | Show "Question already deleted" message |
- Category doesn't exist | Show error for bulk delete operation |
- Bulk delete with evaluations in progress | Block operation, show "Questions have active evaluations" error |

## Out of Scope

- Hard delete (permanent removal)
- Restore deleted questions
- Undo delete operation
- Bulk delete by custom filter

## Priority

**Should** - This is important for data cleanliness but not blocking for core functionality.
