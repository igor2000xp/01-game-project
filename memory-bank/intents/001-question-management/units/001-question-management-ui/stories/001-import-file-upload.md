---
id: 001-import-file-upload
unit: 001-question-management-ui
intent: 001-question-management
status: draft
priority: must
created: 2026-02-19T15:24:31Z
assigned_bolt: null
implemented: false
---

# Story: 001-import-file-upload

## User Story

**As an admin/teacher**
I want to upload CSV or JSON files so that I can import questions from external sources without manual data entry.

**So that** I can quickly populate the question database with content from transcripts.

## Acceptance Criteria

- [ ] Given I navigate to the import page, When the page loads, Then I see a file upload area
- [ ] Given I click the upload area, When I click, Then I can select a CSV or JSON file from my device
- [ ] Given I select a file, When the file is chosen, Then I see the file name and size
- [ ] Given I select a valid file (< 10MB), When I click "Import", Then the file is uploaded to the server
- [ ] Given the upload starts, When the file uploads, Then I see a progress bar or percentage indicator
- [ ] Given I select an invalid file format, When I choose, Then I see an error "Only CSV and JSON files are supported"
- [ ] Given the file is too large, When I select, Then I see an error "File must be less than 10MB"
- [ ] Given the upload completes, When the import finishes, Then I am redirected to the import progress page

## Technical Notes

- Use Angular file upload with drag-and-drop support
- File size validation: max 10MB
- File type validation: only .csv and .json
- Upload progress with HttpClient events
- FormData with multipart/form-data
- Show progress bar for files > 1MB
- Display file size in human-readable format

## Dependencies

### Requires
None (independent story)

### Enables
- 002-import-progress

## Edge Cases

| Scenario | Expected Behavior |
|-----------|-------------------|
- File upload cancelled by user | Cancel upload, clear selected file |
- Network error during upload | Show error message, keep file selected for retry |
- File upload interrupted | Allow retry or select new file |
- Multiple file selection (not allowed) | Only allow one file at a time |

## Out of Scope

- File preview before upload
- Select multiple files for batch import
- Resume interrupted uploads

## Priority

**Must** - This is core functionality required for import to work.
