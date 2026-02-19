---
unit: 001-question-import
intent: 001-question-management
phase: inception
status: draft
created: 2026-02-19T15:19:25Z
updated: 2026-02-19T15:19:25Z
---

# Unit Brief: Question Import

## Purpose

Handle importing question-answer pairs from CSV and JSON files with validation, error handling, and progress feedback. This unit processes external data sources and populates the question database with validated content.

## Scope

### In Scope
- CSV file parsing with configurable column mapping
- JSON file parsing with schema validation
- Data validation (required fields, length constraints, format checks)
- Duplicate detection and handling
- Import progress tracking (success/error counts)
- Error reporting with detailed failure reasons
- Transaction support (roll back on complete failure)

### Out of Scope
- Question editing during import (import only)
- Category creation during import (categories must exist first)
- Large file streaming (entire file must fit in memory for demo)

## Assigned Requirements

| FR | Requirement | Priority |
|----|-------------|----------|
| FR-1 | Import Questions from External Sources | Must |

## Domain Concepts

### Key Entities

| Entity | Description | Attributes |
|--------|-------------|------------|
| Question | The core entity being imported | id, question_text, reference_answer, category_id, created_at, updated_at |
| ImportSession | Tracks a single import operation | id, file_name, file_type, status, created_at, total_rows, success_count, error_count |
| ImportError | Represents a failed row import | id, session_id, row_number, error_type, message |

### Key Operations

| Operation | Description | Inputs | Outputs |
|-----------|-------------|---------|----------|
| Parse File | Read CSV/JSON file from stream | Parsed records, format errors |
| Validate Records | Check each record against rules | Valid records, validation errors |
| Store Questions | Insert valid questions into database | Stored question entities |
| Track Progress | Update import session status | Import result summary |
| Handle Duplicates | Detect and handle duplicate questions | Skip list, warning count |

---

## Story Summary

| Metric | Count |
|--------|-------|
| Total Stories | 2 |
| Must Have | 2 |
| Should Have | 0 |
| Could Have | 0 |

### Stories

| Story ID | Title | Priority | Status |
|----------|-------|----------|--------|
| 001-parse-validate-files | Parse and validate CSV/JSON import files | Must | Planned |
| 002-store-import-results | Store valid questions and track import session | Must | Planned |

---

## Dependencies

### Depends On
None - This is the first unit in the question-management intent.

### Depended By
| Unit | Reason |
|------|--------|
| 002-question-crud | Uses imported questions |
| 001-question-management-ui | Uses import endpoints |

### External Dependencies

| System | Purpose | Risk |
|--------|---------|------|
| File System | Read uploaded import files | Low |
| SQLite Database | Store questions and import results | Low |

## Technical Context

### Suggested Technology
- Backend: Nest.js (following project tech stack)
- File Processing: Fast CSV / built-in JSON parser
- Validation: class-validator for schema validation
- Database: TypeORM with SQLite

### Integration Points

| Integration | Type | Protocol |
|------------|------|----------|
| 001-question-management-ui (Frontend) | API | REST (POST /api/questions/import) |
| SQLite Database | Data Access | TypeORM Entity Manager |

### Data Storage

| Data | Type | Volume | Retention |
|------|------|--------|-----------|
| Questions | SQL | 10,000+ records | Permanent |
| Import Sessions | SQL | Session logs | 90 days |

---

## Constraints

- Import files must be < 10MB
- CSV files must use UTF-8 encoding
- JSON files must match expected schema
- Maximum 1000 questions per import batch (for demo)

## Success Criteria

### Functional
- [ ] CSV files are parsed correctly with configurable columns
- [ ] JSON files are validated against schema
- [ ] All validation rules are applied before storage
- [ ] Duplicate questions are detected and handled
- [ ] Import progress is tracked and shown to user
- [ ] Transaction rollback works on complete failure

### Non-Functional
- [ ] Import completes within 5 seconds for 1000 questions
- [ ] Memory usage stays within system limits
- [ ] File upload size is validated before processing

## Quality

- [ ] Code coverage > 80%
- [ ] All acceptance criteria met
- [ ] Code reviewed and approved

---

## Bolt Suggestions

| Bolt | Type | Stories | Objective |
|------|------|---------|-----------|
| bolt-001-question-import-1 | DDD | S1, S2 | File parsing and validation logic |
| bolt-001-question-import-2 | DDD | S3, S4 | Import session tracking and error handling |

## Notes

This unit should include comprehensive error messages to help users understand why imports fail. Consider adding a "preview" feature to show parsed data before committing.
