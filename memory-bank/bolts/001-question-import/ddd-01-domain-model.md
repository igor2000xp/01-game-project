---
id: ddd-01-domain-model
bolt: 001-question-import-1
unit: 001-question-import
intent: 001-question-management
phase: construction
status: in-progress
created: 2026-02-19T17:09:11Z
---

# Domain Model: Question Import

## Overview

Define the domain model for Question Import functionality, including entities, value objects, and repository interfaces. This model supports importing CSV and JSON files with validation, duplicate detection, and import session tracking.

## Static Model

### Entities

| Entity | Description | Attributes |
|--------|-------------|------------|
| **Question** | Core question entity with ID, text, reference answer, optional category | id, question_text, reference_answer, category_id, created_at, updated_at, is_deleted |
| **ImportSession** | Tracks a single import operation with metadata | id, file_name, file_type, status, total_rows, success_count, error_count, created_at |
| **ImportError** | Represents a failed row import | id, session_id, row_number, error_type, message, created_at |

### Value Objects

| Value Object | Description | Usage |
|-----------|-------------|------------|
| **ImportStatus** | Enum for import operation status | PROGRESSING, COMPLETED, FAILED |

### Domain Events

| Event | Description |
|-----------|-------------|------------|
| **QuestionImported** | Emitted when a question is stored | Trigger: after ImportService.storeQuestions() |
| **ImportFailed** | Emitted when an error occurs | Trigger: after ImportService.logError() |

---

## Repository Interfaces

| Interface | Description | Methods |
|-----------|-------------|------------|
| **IQuestionRepository** | Core data access interface for Question entity | getQuestionById(id), create(questionData), findAll(filters), save(question), softDelete(id), existsByText(text) |
| **IImportSessionRepository** | Import session data access | create(sessionData), getById(id), updateStatus(), addError(error), getErrorsBySession(sessionId) |
| **CsvParser** | File parsing service | parseFile(fileStream), parseJson(fileStream) |
| **ImportValidator** | Validation service | validateQuestionData(data), validateCategoryExists(id), checkDuplicate(text) |

---

## External Dependencies

| System | Purpose | Risk |
|--------|---------|------|
| None | No external dependencies for import | Low |

---

## Constraints

- Import files must be < 10MB
- CSV files must use UTF-8 encoding
- JSON files must match expected schema
- Maximum 1000 questions per import batch
- Question text minimum: 10 characters
- Reference answer minimum: 10 characters
- Category name minimum: 3 characters (if used)

## Business Rules

1. Questions with the same question_text are considered duplicates (case-insensitive comparison)
2. Question text must be unique within category_id scope (case-sensitive)
3. Deleted questions should not be imported again (is_deleted flag)
4. Questions with active evaluations cannot be deleted

## Success Criteria

### Functional

- [ ] CSV files are parsed correctly with configurable columns
- [ ] JSON files are validated against schema
- [ ] All validation rules are applied before storage
- [ ] Duplicate questions are detected and handled
- [ ] Import progress is tracked and shown to user
- [ ] Import session is created with operation summary
- [ ] Errors are reported with detailed failure reasons

### Non-Functional

- [ ] Import completes within 5 seconds for 1000 questions
- [ ] Import 10,000 questions completes in < 30 seconds
- [ ] Memory usage stays within system limits
- [ ] File upload size is validated before processing

### Quality

- [ ] Code coverage > 80% for Question entities
- [ ] All acceptance criteria met
- [ ] Code reviewed and approved

---

## Notes

**Category Handling**: Questions can exist without categories. Category reference is optional.

**File Format**: CSV with headers (id, question_text, reference_answer, category) for import. Export format matches.

**Transaction Support**: Import operation should be transactional - roll back on complete failure.

**Import Modes**:
- Add/Replace mode: Update existing questions
- Skip duplicate mode: Don't import duplicates

**API Response Format**:
```json
{
  "statusCode": 200,
  "message": "Import completed",
  "data": {
    "totalRows": 1000,
    "successCount": 998,
    "errorCount": 2,
    "errors": [...]
  },
  "sessionId": "uuid"
}
```

**Error Response Format**:
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "data": {
    "errors": [
      {
        "rowNumber": 15,
        "errorType": "MISSING_FIELD",
        "message": "Column 'reference_answer' is required"
      }
    ],
  "sessionId": "uuid"
  }
}
```

---

## Test Coverage

- Unit tests for entity logic (QuestionRepository, ImportService)
- Integration tests for API endpoints
- Component tests for Angular UI components
