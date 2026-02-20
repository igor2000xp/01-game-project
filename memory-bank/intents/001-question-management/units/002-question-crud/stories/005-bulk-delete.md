---
id: 005-bulk-delete
unit: 002-question-crud
intent: 001-question-management
status: draft
priority: could
created: 2026-02-19T15:24:31Z
assigned_bolt: null
implemented: false
---

# Story: 005-bulk-delete

## User Story

**As an admin/teacher**
I want to delete all questions in a category at once so that I can quickly remove outdated content without deleting each question individually.

**So that** I can efficiently manage the question database by cleaning entire categories.

## Acceptance Criteria

- [ ] Given I select a category with questions, When I click bulk delete, Then I see a confirmation dialog with question count
- [ ] Given the confirmation appears, When I confirm, Then all questions in that category are soft deleted
- [ ] Given questions are deleted, When the operation completes, Then I see a success message with count of deleted questions
- [ ] Given a category has no questions, When I click bulk delete, Then I see "No questions to delete" message
- [ ] Given questions in category have active evaluations, When I try bulk delete, Then operation is blocked with error

## Technical Notes

- Bulk delete via DELETE /api/questions?category_id=X
- Check all questions in category for active evaluations before allowing delete
- Single confirmation for entire category
- Show count of questions to be deleted in confirmation
- Success message includes deleted count
- Filter deleted category from list

## Dependencies

### Requires
- 002-list-questions
- 003-category-service (category listing)

### Enables
- Efficient category cleanup

## Edge Cases

| Scenario | Expected Behavior |
|-----------|-------------------|
| Category not found | Show error "Category not found" |
- Large category (500+ questions) | Show warning about large deletion, require double confirmation |
- Network error during bulk delete | Show error, retry option available |
- Partial failure (some questions fail) | Report successful count and failed count |

## Out of Scope

- Select specific questions for bulk delete
- Restore deleted questions
- Bulk delete by date range or custom filter

## Priority

**Could** - This is a convenience feature that enhances efficiency but is not essential.
