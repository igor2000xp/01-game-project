---
id: 007-export-ui
unit: 001-question-management-ui
intent: 001-question-management
status: draft
priority: should
created: 2026-02-19T15:24:31Z
assigned_bolt: null
implemented: false
---

# Story: 007-export-ui

## User Story

**As an admin/teacher**
I want to export questions to CSV or JSON format so that I can backup or share the question database with a simple click.

**So that** I can easily create portable copies of the question data.

## Acceptance Criteria

- [ ] Given I view the question list, When I access the page, Then I see export buttons (CSV and JSON)
- [ ] Given I click "Export CSV", When I click, Then the CSV export starts and downloads automatically
- [ ] Given I click "Export JSON", When I click, Then the JSON export starts and downloads automatically
- [ ] Given the export starts, When the process begins, Then I see a progress indicator
- [ ] Given I want to filter before export, When I apply a category filter, Then only filtered questions are exported
- [ ] Given the export is large, When generating, Then I see progress bar with percentage
- [ ] Given the export completes, When finished, Then I see a success message with the file size
- [ ] Given there are no questions, When I try to export, Then I see "No questions to export" message

## Technical Notes

- Export buttons in toolbar or actions menu
- Format selection (CSV/JSON)
- Progress overlay or inline progress bar
- Success toast/notification with file details
- Browser handles file download

## Dependencies

### Requires
- 003-question-list (to trigger export)

### Enables
- Data backup and sharing

## Edge Cases

| Scenario | Expected Behavior |
|-----------|-------------------|
| Large dataset export | Show progress with estimated time, allow cancel |
- Network timeout during export | Show error, provide retry option |
- Export with no results | Show "No questions to export" message |
- Multiple rapid clicks | Show warning "Export in progress, please wait" |

## Out of Scope

- Export options (column selection, field selection)
- Scheduled exports
- Export history/view
- Email export option

## Priority

**Should** - This is important for data portability but not blocking for core functionality.
