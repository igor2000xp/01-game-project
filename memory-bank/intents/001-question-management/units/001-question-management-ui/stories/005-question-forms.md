---
id: 005-question-forms
unit: 001-question-management-ui
intent: 001-question-management
status: draft
priority: must
created: 2026-02-19T15:24:31Z
assigned_bolt: null
implemented: false
---

# Story: 005-question-forms

## User Story

**As an admin/teacher**
I want to create and edit questions using forms with validation so that I can add new questions or update existing ones.

**So that** I can manage the question database content with proper validation and user feedback.

## Acceptance Criteria

- [ ] Given I click "Create Question", When the form loads, Then I see empty form with required field indicators
- [ ] Given I click "Edit" on a question, When the modal opens, Then all current question data is pre-filled
- [ ] Given I enter question text (min 10 chars), When the field validates, Then I can proceed to reference answer
- [ ] Given I enter reference answer (min 10 chars), When the field validates, Then I can optionally select a category
- [ ] Given I select a category, When I choose, Then the category dropdown shows all available categories
- [ ] Given I leave category unselected, When I proceed, Then the question is created without a category
- [ ] Given I submit the form, When I submit, Then the question is created/updated or validation errors are shown
- [ ] Given the question text is too short, When I try to submit, Then I see validation error "Question text must be at least 10 characters"
- [ ] Given the reference answer is too short, When I try to submit, Then I see validation error "Reference answer must be at least 10 characters"
- [ ] Given the save succeeds, When the operation completes, Then I see success message and the form is closed/redirected

## Technical Notes

- Angular reactive forms with validation
- Real-time validation on field blur/change
- Category dropdown from categories API
- Required field indicators (asterisk)
- Client-side validation with server-side validation
- Success toast/notification
- Error handling with user-friendly messages

## Dependencies

### Requires
None (independent story)

### Enables
- Question creation and editing

## Edge Cases

| Scenario | Expected Behavior |
|-----------|-------------------|
| Category list fails to load | Show error, disable category dropdown |
- Form submission during network error | Keep form data, show error with retry |
- Question with special characters | Allow characters, sanitize input for XSS prevention |
- Concurrent edit by another user | Show optimistic locking or "Question was modified" message |

## Out of Scope

- Rich text editor (markdown/HTML)
- Draft saving
- Question preview
- Form templates

## Priority

**Must** - This is core functionality required for question forms to work.
