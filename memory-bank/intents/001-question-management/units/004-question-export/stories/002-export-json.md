---
id: 002-export-json
unit: 004-question-export
intent: 001-question-management
status: draft
priority: must
created: 2026-02-19T15:24:31Z
assigned_bolt: null
implemented: false
---

# Story: 002-export-json

## User Story

**As an admin/teacher**
I want to export all questions to JSON format so that I have a machine-readable backup of the data.

**So that** I can programmatically process or analyze the question data outside of the application.

## Acceptance Criteria

- [ ] Given I click "Export JSON", When I click, Then the export process starts
- [ ] Given the export starts, When I see a loading indicator, Then I know the operation is in progress
- [ ] Given the export completes, When the process finishes, Then a JSON file is downloaded to my device
- [ ] Given the file downloads, When I inspect it, Then the JSON has the full question entity structure with all fields
- [ ] Given I apply a filter before export, When I click export, Then only matching questions are included in the JSON
- [ ] Given the export is large, When the file generates, Then it completes within reasonable time (< 30 seconds for 10,000 questions)

## Technical Notes

- Use JSON.stringify() with proper indentation
- Include all question entity fields (id, text, reference_answer, category_id, created_at, updated_at, is_deleted)
- Include category associations as nested objects or category_id
- File download with content-disposition header
- Filename format: questions-export-YYYYMMDDTHHMMSSZ.json
- Show progress indicator for large exports
- Browser handles file download

## Dependencies

### Requires
- 002-question-crud (access to question data)

### Enables
- Data backup and machine-readable export

## Edge Cases

| Scenario | Expected Behavior |
|-----------|-------------------|
| No questions to export | Show "No questions to export" message |
| Large dataset (10,000+ questions) | Show progress indicator and estimated time |
- Network timeout during export | Show error, provide retry option |
- JSON serialization errors | Show error with details about which field caused issue |

## Out of Scope

- Select specific fields for JSON export
- Export to other formats (Excel, XML)
- Scheduled or automated exports

## Priority

**Must** - This is core functionality required for export to work.
