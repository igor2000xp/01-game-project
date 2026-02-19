---
id: 002-store-import-results
unit: 001-question-import
intent: 001-question-management
status: draft
priority: must
created: 2026-02-19T15:24:31Z
assigned_bolt: null
implemented: false
---

# Story: 002-store-import-results

## User Story

**As an admin/teacher**
I want to validate and store imported questions so that they become available in the system for use in evaluations and audits.

**So that** the question database is populated with validated content and I can track import operations for auditing.

## Acceptance Criteria

- [ ] Given valid parsed questions are ready, When I commit the import, Then all valid questions are stored in the database with unique IDs
- [ ] Given validation errors are found, When I review errors, Then I can see detailed error messages for each failed row
- [ ] Given duplicates are detected, When duplicates are handled, Then I can choose to skip or overwrite each duplicate
- [ ] Given the import process completes, When storage is finished, Then an import session is created tracking the operation
- [ ] Given the import fails completely, When errors occur, Then the transaction is rolled back and no questions are stored

## Technical Notes

- Use database transaction to ensure atomicity of import operation
- Store import session with: file_name, file_type, status, total_rows, success_count, error_count
- For duplicate handling: show skip list and allow user to choose per duplicate
- For rollback: ensure no partial data remains on failure
- Create import session entity in database

## Dependencies

### Requires
- 001-parse-validate-files

### Enables
- All question management features (questions can now be created and read)

## Edge Cases

| Scenario | Expected Behavior |
|-----------|-------------------|
| Partial failure (some rows fail) | Store valid rows, create error records for failed rows, mark session as "partial success" |
| Complete failure (all rows fail) | Rollback transaction, mark session as "failed", no questions stored |
| Database connection lost during import | Rollback any partial data, show error to user, retry option |
| Duplicate handling choice | Store duplicate rows based on user's skip/overwrite selection |

## Out of Scope

- Async import processing
- Import preview with edit before commit
- Undo/redo import operations

## Priority

**Must** - This is core functionality required for the import feature to work.
