---
unit: 004-question-export
intent: 001-question-management
phase: inception
status: draft
created: 2026-02-19T15:19:25Z
updated: 2026-02-19T15:19:25Z
---

# Unit Brief: Question Export

## Purpose

Export question data to CSV and JSON formats with filtering options for backup and sharing. Exports must be compatible with import format for round-trip support.

## Scope

### In Scope
- Export all questions to CSV
- Export all questions to JSON
- Export filtered questions by category
- Export filtered questions by date range
- Include question metadata (id, created_at, updated_at, category)
- Include category associations in export
- Download with timestamped filename
- Large export handling (streaming if needed)

### Out of Scope
- Export to other formats (Excel, XML)
- Export with complex relationships
- Export in real-time (server-side generation)
- Export scheduling/automation

## Assigned Requirements

| FR | Requirement | Priority |
|----|-------------|----------|
| FR-7 | Export Question Data | Should |

## Domain Concepts

### Key Entities

| Entity | Description | Attributes |
|--------|-------------|------------|
| ExportRequest | Represents an export operation | id, user_id, filter_criteria, format, created_at |
| ExportResult | Tracks export completion | id, request_id, status, file_path, record_count, created_at |

### Key Operations

| Operation | Description | Inputs | Outputs |
|-----------|-------------|---------|----------|
| Generate CSV | Convert questions to CSV format | CSV file stream |
| Generate JSON | Convert questions to JSON array | JSON file stream |
| Apply Filters | Filter by category, date range | Filtered question list |
| Create File | Generate download with filename | File path |
| Stream Response | Send file to client | File download |

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
| 001-export-csv | Export questions to CSV format | Must | Planned |
| 002-export-json | Export questions to JSON format | Must | Planned |

---

## Dependencies

### Depends On
| Unit | Reason |
|------|--------|
| 002-question-crud | Export reads questions from database |

### Depended By
| Unit | Reason |
|------|--------|
| 001-question-management-ui | UI uses export endpoints |

### External Dependencies

| System | Purpose | Risk |
|--------|---------|------|
| SQLite Database | Read questions for export | Low |
| File System | Write export files | Low |

## Technical Context

### Suggested Technology
- Backend: Nest.js (QuestionController, export endpoint)
- CSV Generation: Fast CSV library
- JSON Serialization: built-in JSON.stringify()
- File Streaming: Node.js streams for large exports

### Integration Points

| Integration | Type | Protocol |
|------------|------|----------|
| 002-question-crud | API | REST (GET /api/questions) |
| 001-question-management-ui (Frontend) | API | REST (GET /api/questions/export/*) |
| SQLite Database | Data Access | TypeORM queries |

### Data Storage

| Data | Type | Volume | Retention |
|------|------|--------|-----------|
| Questions (read) | SQL | 10,000+ records | Temporary for export |

---

## Constraints

- CSV format must match import format (columns: id, question_text, reference_answer, category)
- JSON format must include full entity structure
- Export filename includes ISO timestamp
- Maximum export size: 10MB file limit
- Exports are read-only operations

## Success Criteria

### Functional
- [ ] CSV export matches import format (round-trip compatible)
- [ ] JSON export includes full entity structure
- [ ] Exports can be filtered by category
- [ ] Exports can be filtered by date range
- [ ] Category associations are included in export
- [ ] Download filename includes timestamp
- [ ] Export progress is shown for large datasets

### Non-Functional
- [ ] Export 1000 questions in < 5 seconds
- [ ] Export 10,000 questions in < 30 seconds
- [ ] Memory usage stays within system limits during export

## Quality

- [ ] Code coverage > 80%
- [ ] All acceptance criteria met
- [ ] Code reviewed and approved

---

## Bolt Suggestions

| Bolt | Type | Stories | Objective |
|------|------|---------|-----------|
| bolt-004-question-export-1 | DDD | S1, S2 | Export domain entities and serializers |
| bolt-004-question-export-2 | DDD | S3, S4 | Export service with business logic |
| bolt-004-question-export-3 | DDD | S5, S6 | Export controller and API endpoints |

## Notes

CSV export should use UTF-8 encoding and proper escaping for special characters. Consider adding a "fields selector" for customizable exports.
