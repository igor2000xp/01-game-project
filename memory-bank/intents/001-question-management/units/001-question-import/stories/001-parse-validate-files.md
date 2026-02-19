---
id: 001-parse-validate-files
unit: 001-question-import
intent: 001-question-management
status: draft
priority: must
created: 2026-02-19T15:24:31Z
assigned_bolt: null
implemented: false
---

# Story: 001-parse-validate-files

## User Story

**As an admin/teacher**
I want to upload CSV or JSON files containing question-answer pairs so that I can quickly populate the question database with content from podcast transcripts.

**So that** I can manage questions without manual entry and the data is properly validated before storage.

## Acceptance Criteria

- [ ] Given I have selected a CSV or JSON file with valid format, When I upload the file, Then the file is parsed successfully
- [ ] Given a file is being parsed, When a row has required fields missing or invalid data, Then that row is flagged as an error
- [ ] Given the file contains duplicate questions, When parsing is complete, Then duplicate detection identifies and reports them
- [ ] Given the parsing completes successfully, When the process finishes, Then I see a summary showing total rows, successful imports, and error count

## Technical Notes

- Use Fast CSV for CSV parsing with configurable column mapping
- Use built-in JSON parser with schema validation
- Validate required fields: question_text (min 10 chars), reference_answer (min 10 chars)
- Validate optional fields: category (must reference existing category or be null)
- Detect duplicates based on question_text field
- Use streaming for large files to handle 10,000+ rows

## Dependencies

### Requires
None (first story)

### Enables
- 002-store-import-results

## Edge Cases

| Scenario | Expected Behavior |
|-----------|-------------------|
| Empty file | Show error "File contains no data" and 0 imports |
| Missing required columns | Show error with column names and which rows affected |
| Invalid UTF-8 encoding | Show error "File encoding issue - please ensure UTF-8" |
| Duplicate questions | Report duplicate count and offer option to skip or overwrite |
| Category not found | Show warning "Category 'X' not found - questions will be uncategorized" |

## Out of Scope

- File preview before import
- Mapping UI for column selection
- Edit questions during import
- Category creation during import

## Priority

**Must** - This is core functionality required for the import feature to work.
