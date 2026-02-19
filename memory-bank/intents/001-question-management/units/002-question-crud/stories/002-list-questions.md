---
id: 002-list-questions
unit: 002-question-crud
intent: 001-question-management
status: draft
priority: must
created: 2026-02-19T15:24:31Z
assigned_bolt: null
implemented: false
---

# Story: 002-list-questions

## User Story

**As an admin/teacher**
I want to view a list of all questions with pagination so that I can browse, search, and manage the question database.

**So that** I can find specific questions and manage the content efficiently.

## Acceptance Criteria

- [ ] Given I navigate to the questions page, When the page loads, Then I see a list of questions (default 20 per page)
- [ ] Given I scroll or navigate pages, When I load more questions, Then the next page is loaded without losing current page state
- [ ] Given I have many questions, When I use pagination, Then I can navigate between pages smoothly
- [ ] Given I want to filter, When I select a category, Then I see only questions in that category
- [ ] Given I enter search text, When I submit the search, Then I see questions matching the text in question or reference answer
- [ ] Given no filter is applied, When I view the list, Then I see all questions sorted by creation date (newest first)
- [ ] Given questions exist, When the list loads, Then I see question text, category, and metadata

## Technical Notes

- Use RxJS observable for API calls
- Implement server-side pagination with page and limit parameters
- Client-side filtering and search (or server-side with query params)
- Sort options: created_at (desc/asc), category
- Loading skeleton during data fetch
- Cache category list for filtering

## Dependencies

### Requires
- 001-create-question

### Enables
- 003-update-question
- 004-delete-question
- All question display and filtering features

## Edge Cases

| Scenario | Expected Behavior |
|-----------|-------------------|
| Empty database | Show "No questions found" message with link to create first question |
| Single page of results | Hide pagination controls (next/prev) |
| Search with no results | Show "No questions match your search" with clear button |
| Category with no questions | Show "No questions in this category" message |
- Large dataset (1000+ questions) | Show virtual scrolling or infinite scroll options |

## Out of Scope

- Advanced search (filters, saved searches)
- Bulk actions (edit multiple, delete multiple at once - except category)
- Question preview/hover

## Priority

**Must** - This is core functionality required for CRUD operations to work.
