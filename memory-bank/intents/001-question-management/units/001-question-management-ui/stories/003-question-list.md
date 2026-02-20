---
id: 003-question-list
unit: 001-question-management-ui
intent: 001-question-management
status: draft
priority: must
created: 2026-02-19T15:24:31Z
assigned_bolt: null
implemented: false
---

# Story: 003-question-list

## User Story

**As an admin/teacher**
I want to see a paginated list of questions with filtering and search so that I can browse and find specific questions efficiently.

**So that** I can navigate the question database and locate questions for editing or deletion.

## Acceptance Criteria

- [ ] Given I navigate to the questions page, When the page loads, Then I see a list of questions (20 per page by default)
- [ ] Given questions are loaded, When I view the list, Then I see question text, category, and metadata for each
- [ ] Given I scroll to the bottom, When I reach the last item, Then the next page loads automatically
- [ ] Given I use pagination controls, When I click next/prev, Then I navigate to the appropriate page
- [ ] Given I want to filter, When I select a category from dropdown, Then only questions in that category are displayed
- [ ] Given I enter search text, When I submit the search, Then I see questions matching the text in question or reference answer
- [ ] Given there are no results, When the search returns empty, Then I see "No questions match your search" with clear button
- [ ] Given there are no questions, When the list is empty, Then I see "No questions found" with link to create question

## Technical Notes

- Use RxJS for API calls
- Server-side pagination with page and limit query params
- Client-side filtering for category dropdown
- Search debouncing (wait 300ms after typing before API call)
- Loading skeleton while fetching
- Infinite scroll or "Load More" button for large datasets

## Dependencies

### Requires
None (independent story)

### Enables
- 004-question-filter
- All question display actions (edit, delete)

## Edge Cases

| Scenario | Expected Behavior |
|-----------|-------------------|
- Page out of range | Show "Page not found" error |
- Search with no results | Show "No questions match" message with clear button |
- Category with no questions | Show "No questions in this category" message |
- Network error during load | Show error message, retry button |
- Slow API response | Show loading indicator with timeout message |

## Out of Scope

- Advanced search filters (date range, multiple filters)
- Column selection for question list
- Bulk selection (checkboxes for multiple actions)

## Priority

**Must** - This is core functionality required for question viewing to work.
