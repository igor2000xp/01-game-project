---
id: 001-create-question
unit: 002-question-crud
intent: 001-question-management
status: draft
priority: must
created: 2026-02-19T15:24:31Z
assigned_bolt: null
implemented: false
---

# Story: 001-create-question

## User Story

**As an admin/teacher**
I want to create a new question with text, reference answer, and optional category so that I can add content to the training system.

**So that** students have questions available for evaluation during training sessions.

## Acceptance Criteria

- [ ] Given I am on the create question page, When I enter valid question text (min 10 chars), Then I can proceed to the next field
- [ ] Given question text is entered, When I enter valid reference answer (min 10 chars), Then I can optionally select a category
- [ ] Given a category is selected, When I select it, Then the category is associated with the question
- [ ] Given all fields are valid, When I submit the form, Then the question is saved to the database with a unique ID
- [ ] Given the question is created, When the save completes, Then I am redirected to the question list and see the new question
- [ ] Given I enter duplicate question text, When I submit, Then I see an error "Question with this text already exists"

## Technical Notes

- Use reactive form with real-time validation
- Validate field lengths: question_text >= 10, reference_answer >= 10
- Category dropdown populated with existing categories
- Optional category selection (uncategorized option)
- Form submits to POST /api/questions
- Redirect to question list after successful creation
- Show success message/toast notification

## Dependencies

### Requires
None (independent story)

### Enables
- 002-list-questions
- All question display features

## Edge Cases

| Scenario | Expected Behavior |
|-----------|-------------------|
| Category list is empty | Show "No categories available" message and allow creating without category |
| Text contains special characters | Allow special characters, sanitize to prevent XSS |
| Network error during save | Show error message, keep form data filled for retry |
- Session timeout during creation | Redirect to login page |

## Out of Scope

- Rich text editor (markdown/HTML)
- Question preview/playback
- Draft saving

## Priority

**Must** - This is core functionality required for CRUD operations to work.
