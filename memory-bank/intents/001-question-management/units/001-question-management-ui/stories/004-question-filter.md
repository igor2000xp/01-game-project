---
id: 004-question-filter
unit: 001-question-management-ui
intent: 001-question-management
status: draft
priority: should
created: 2026-02-19T15:24:31Z
assigned_bolt: null
implemented: false
---

# Story: 004-question-filter

## User Story

**As an admin/teacher**
I want to filter questions by category and search by text so that I can quickly find specific questions without browsing through all content.

**So that** I can efficiently locate questions for editing or review.

## Acceptance Criteria

- [ ] Given I view the question list, When the page loads, Then I see category dropdown and search input
- [ ] Given I select a category, When I choose from dropdown, Then the question list refreshes to show only questions in that category
- [ ] Given I select "All Categories", When I choose, Then all questions are displayed
- [ ] Given I enter search text, When I type, Then search results update after a short delay (debounce 300ms)
- [ ] Given the search returns results, When matching questions are found, Then I see questions matching the text in question or reference answer
- [ ] Given I search returns no results, When the search completes, Then I see "No questions match your search" with clear button
- [ ] Given I clear the search, When I clear the input, Then the full question list is restored

## Technical Notes

- Category dropdown populated from categories endpoint
- Search input with debounced input event
- Search queries API with text parameter
- Clear button to reset filters
- Show result count for filtered views
- Combine category and search filters (AND logic)

## Dependencies

### Requires
- 003-question-list
- 003-category-service

### Enables
- Efficient question discovery

## Edge Cases

| Scenario | Expected Behavior |
|-----------|-------------------|
- Category list is empty | Disable category filter or show "No categories available" |
- Search with special characters | Sanitize and search properly |
- Very long search query | Truncate or limit search length |
- Rapid search typing | Debounce to avoid excessive API calls |

## Out of Scope

- Saved searches/filters
- Advanced search (multiple filters, date range)
- Search history

## Priority

**Should** - This is important for efficiency but not blocking for core functionality.
