---
id: 002-import-progress
unit: 001-question-management-ui
intent: 001-question-management
status: draft
priority: must
created: 2026-02-19T15:24:31Z
assigned_bolt: null
implemented: false
---

# Story: 002-import-progress

## User Story

**As an admin/teacher**
I want to see the import progress and results so that I know how many questions were imported, if there were any errors, and the overall status of the import operation.

**So that** I can verify the import succeeded and troubleshoot any issues that occurred during the import.

## Acceptance Criteria

- [ ] Given the import starts, When the process begins, Then I see a progress indicator showing the current step
- [ ] Given the import is running, When rows are processed, Then I see live count of processed rows
- [ ] Given the import completes, When finished, Then I see a summary with total rows, successful imports, and error count
- [ ] Given there are errors, When the import finishes, Then I can see a list of error messages for failed rows
- [ ] Given the import fails completely, When an error occurs, Then I see the error message and can retry the import
- [ ] Given the import succeeds, When I view the summary, Then I see a success message with count of imported questions
- [ ] Given there are duplicates, When duplicates are found, Then I can see the duplicate count and what action was taken

## Technical Notes

- Poll import status endpoint periodically
- Display progress bar with percentage
- Show current operation (parsing, validating, storing)
- Error list with row numbers and messages
- Success/error summary card
- Link to question list after successful import
- Retry button on failure

## Dependencies

### Requires
- 001-import-file-upload

### Enables
- Import verification and error reporting

## Edge Cases

| Scenario | Expected Behavior |
|-----------|-------------------|
- Import stuck at 0% | Show error and provide cancel/retry options |
- Import completes with 100% errors | Show error summary, offer to fix data |
- Duplicate handling choice | Show options: Skip duplicates, Replace all |
- Network timeout during import | Show timeout error, provide retry option |
- Import server error (500) | Show error message, contact admin option |

## Out of Scope

- Detailed per-row error messages (show count and sample)
- Import undo/rollback
- Save import template

## Priority

**Must** - This is core functionality required for import verification to work.
