---
id: 004-question-export
unit: 004-question-export
intent: 001-question-management
type: ddd-construction-bolt
status: in-progress
started: 2026-02-19T20:35:00Z
created: 2026-02-19T15:31:17Z
current_stage: technical-design
stages_completed:
  - name: domain-model
    completed: 2026-02-19T20:35:00Z
    artifact: ddd-01-domain-model.md

---

# Stage 2: Technical Design
**Bolt**: 004-question-export
**Status**: In Progress
**Date**: 2026-02-19

## Architecture Decisions

### Decision 1: Export Module Structure

**Problem**: Where to place export functionality within existing modules?

**Options**:
1. **New module**: Create `ExportModule` - Clean separation
2. **Question module enhancement**: Add to `QuestionCrudModule` - Reuse existing infrastructure
3. **Shared module**: Create `SharedModule` - For reusable utilities

**Selected**: Option 2 - Question module enhancement

**Rationale**:
- Export operates on Questions - natural fit with QuestionCrudModule
- Reuses QuestionRepository and QuestionService from bolt 002
- Avoids creating unnecessary module for simple functionality
- Keeps related functionality together

### Decision 2: Streaming vs. Buffer Generation

**Problem**: Should exports be streamed to client or buffered in memory?

**Options**:
1. **Streaming**: Write to response stream as data is generated
2. **Buffer**: Generate entire file in memory, then send
3. **Hybrid**: Buffer small exports, stream large ones

**Selected**: Option 2 - Buffer

**Rationale**:
- Demo application: datasets will be small (< 10,000 records)
- Simpler implementation
- No complex stream handling needed
- Memory usage acceptable for demo scale

---

## API Design

### New Endpoints

#### POST /questions/export

**Description**: Exports questions to specified format and returns download URL.

**Request Body**:
```json
{
  "format": "csv" | "json",
  "category_id": "uuid"  // optional
  "include_deleted": false  // optional, default false
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "format": "csv",
  "filename": "questions_2026-02-19_20-35-00.csv",
  "record_count": 42,
  "created_at": "2026-02-19T20:35:00.000Z"
}
```

**Error Responses**:
- 400 Bad Request: Invalid format
- 500 Internal Server Error: Generation failure

---

## Data Serialization

### CSV Format

**Fields**: `id`, `question_text`, `reference_answer`, `category_id`, `created_at`, `updated_at`

**Format**:
```csv
id,question_text,reference_answer,category_id,created_at,updated_at
uuid-1,Question 1?,Answer 1,2026-02-19T00:00:00.000Z,2026-02-19T00:00:00.000Z
uuid-2,Question 2?,Answer 2,uuid-3,,2026-02-19T01:00:00.000Z,2026-02-19T01:00:00.000Z
```

**Rules**:
- UTF-8 encoding
- RFC 4180 compliant
- Fields with commas/quotes wrapped in quotes
- Newlines as `\r\n` (Windows compatible)
- Null values as empty strings

### JSON Format

**Structure**: Array of question objects

```json
[
  {
    "id": "uuid-1",
    "question_text": "Question 1?",
    "reference_answer": "Answer 1",
    "category_id": null,
    "created_at": "2026-02-19T00:00:00.000Z",
    "updated_at": "2026-02-19T00:00:00.000Z"
  }
]
```

**Rules**:
- ISO 8601 date format
- Pretty-printed (2-space indent)
- Null values as `null` (not string "null")

---

## Module Structure

```
src/modules/question-crud/
├── entities/
│   ├── question.entity.ts          (existing)
│   └── category.entity.ts          (existing)
├── dto/
│   ├── export-request.dto.ts       (NEW)
│   ├── export-result.dto.ts        (NEW)
│   └── export-format.enum.ts        (NEW)
├── services/
│   └── export.service.ts           (NEW)
└── controllers/
    └── export.controller.ts         (NEW)
```

---

## Dependencies

### Requires Bolts
- 002-question-crud: Uses Question entity and repository

### Enables Bolts
- 001-question-management-ui: Frontend will call export endpoints

---

## Security Considerations

- No authentication required for export (public data)
- No SQL injection (using TypeORM parameterized queries)
- CSV injection mitigated (proper escaping)
- JSON serialization uses safe methods

---

## Performance Considerations

| Factor | Impact | Mitigation |
|---------|---------|------------|
| Large dataset export | Memory usage | Buffer approach fine for <10K records |
| CSV generation | CPU intensive | Acceptable for demo |
| Database query | Full table scan | Add index optimization later if needed |

---

## Testing Strategy

### Unit Tests

1. **ExportService.generateCSV()**
   - Generates valid CSV from questions array
   - Handles null values correctly
   - Escapes commas and quotes properly
   - Uses UTF-8 encoding

2. **ExportService.generateJSON()**
   - Generates valid JSON from questions array
   - Uses ISO 8601 date format
   - Pretty-prints output

3. **ExportService.generateFilename()**
   - Returns filename with correct format
   - Includes timestamp

4. **ExportService.exportQuestions()**
   - Calls correct generator based on format
   - Returns ExportResult with metadata

5. **ExportController.export()**
   - Handles valid format (csv, json)
   - Returns error for invalid format
   - Calls service correctly

### Test Data

```typescript
const testQuestions = [
  {
    id: 'q1',
    question_text: 'What is the capital of France?',
    reference_answer: 'Paris',
    category_id: 'cat-1',
    created_at: new Date('2026-02-19'),
    updated_at: new Date('2026-02-19'),
  },
  {
    id: 'q2',
    question_text: 'Question with, commas, "quotes" and\nnewlines',
    reference_answer: 'Answer with same',
    category_id: null,
    created_at: new Date('2026-02-19'),
    updated_at: new Date('2026-02-19'),
  },
];
```

---

## Rollback Plan

If issues arise:
1. Remove export endpoints from CategoryController
2. Remove DTOs from exports
3. No database schema changes to revert
- Low risk change
