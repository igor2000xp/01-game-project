---
id: 002-list-categories
unit: 003-category-service
intent: 001-question-management
status: draft
priority: must
created: 2026-02-19T15:24:31Z
assigned_bolt: null
implemented: false
---

# Story: 002-list-categories

## User Story

**As an admin/teacher**
I want to view all categories with question counts so that I can see how questions are organized and manage the category structure.

**So that** I have visibility into the question organization and can make informed decisions about category management.

## Acceptance Criteria

- [ ] Given I navigate to the categories page, When the page loads, Then I see a list of all categories
- [ ] Given categories are loaded, When I view the list, Then I see category name, description, and question count for each
- [ ] Given there are categories, When I view them, Then I can sort by name or question count
- [ ] Given a category has no questions, When I view it, Then I can still see the category (with count of 0)
- [ ] Given I want to filter questions, When I select a category, Then the question list is filtered by that category

## Technical Notes

- Use RxJS observable for API calls
- GET /api/categories to fetch list
- Display category name and question count
- Sort options: name (asc/desc), question count (desc/asc)
- Show "Create Category" button
- Link to questions filtered by category

## Dependencies

### Requires
- 001-create-category

### Enables
- 003-manage-category
- Category filtering in question list

## Edge Cases

| Scenario | Expected Behavior |
|-----------|-------------------|
| No categories exist | Show "No categories created" message with link to create first category |
- Large category list (50+) | Show pagination or virtual scrolling |
- Category with very long name | Truncate name with ellipsis in display |

## Out of Scope

- Category question counts in real-time (cached on load)
- Category statistics dashboard
- Bulk category operations

## Priority

**Must** - This is core functionality required for category management to work.
