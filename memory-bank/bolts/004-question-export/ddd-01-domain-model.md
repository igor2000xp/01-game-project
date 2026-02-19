---
id: 004-question-export
unit: 004-question-export
intent: 001-question-management
type: ddd-construction-bolt
status: in-progress
started: 2026-02-19T20:35:00Z
created: 2026-02-19T15:31:17Z
current_stage: domain-model
stages_completed: []
---

# Stage 1: Domain Model
**Bolt**: 004-question-export
**Status**: In Progress
**Date**: 2026-02-19

## Objective

Implement export functionality including domain entities, service layer for serialization, and API endpoints for CSV/JSON generation.

---

## Domain Entities

### ExportRequest

Request for exporting questions with optional filtering.

```typescript
export interface ExportRequest {
  format: 'csv' | 'json';
  category_id?: string;
  include_deleted?: boolean;  // Include soft-deleted questions
}
```

### ExportResult

Result of an export operation with metadata.

```typescript
export interface ExportResult {
  success: boolean;
  format: 'csv' | 'json';
  filename: string;
  record_count: number;
  created_at: Date;
  message?: string;
}
```

### ExportFormat (Value Object)

Supported export formats with their serialization rules.

```typescript
export enum ExportFormat {
  CSV = 'csv',
  JSON = 'json',
}
```

---

## Repository Interface

### ExportRepository

Repository for export operations - delegates to QuestionRepository for data retrieval.

```typescript
export interface IExportRepository {
  /**
   * Get questions for export with optional filtering
   */
  getQuestionsForExport(options: {
    category_id?: string;
    include_deleted?: boolean;
  }): Promise<Question[]>;

  /**
   * Get total count for export
   */
  getQuestionCount(options: {
    category_id?: string;
    include_deleted?: boolean;
  }): Promise<number>;
}
```

---

## Service Interface

### ExportService

Business logic for question export including serialization and format handling.

```typescript
export interface IExportService {
  /**
   * Export questions to specified format
   */
  exportQuestions(request: ExportRequest): Promise<ExportResult>;

  /**
   * Generate CSV from questions
   */
  generateCSV(questions: Question[]): string;

  /**
   * Generate JSON from questions
   */
  generateJSON(questions: Question[]): string;

  /**
   * Generate filename with timestamp
   */
  generateFilename(format: ExportFormat): string;
}
```

---

## Ubiquitous Language

| Term | Definition |
|-------|------------|
| Export | Process of converting database records to a downloadable file |
| Format | Target file type (CSV, JSON) |
| Timestamp | Date/time string for filename organization |
| UTF-8 Encoding | Character encoding for CSV internationalization |
| Escaping | Process of handling special characters in CSV fields |

---

## Aggregate Design

**Export is a stateless operation** - No aggregate root needed.

**Dependencies**:
- Uses Question entity (from bolt 002)
- Uses Category entity (from bolt 002)
- Uses QuestionRepository (from bolt 002)

---

## Boundary Analysis

**In-scope for Bolt 004**:
- Export request DTO
- Export result DTO
- Export format enum
- Export service with business logic
- Export controller with API endpoints
- CSV serialization
- JSON serialization

**Out-of-scope**:
- Question CRUD operations (bolt 002)
- Category management (bolt 003)
- Frontend UI (bolt 001)
- Database migrations

---

## Completion Criteria

- [ ] ExportRequest DTO created
- [ ] ExportResult DTO created
- [ ] ExportFormat enum created
- [ ] ExportRepository interface defined
- [ ] ExportService interface defined
- [ ] Service implementation with CSV generation
- [ ] Service implementation with JSON generation
- [ ] Service implementation with filename generation
- [ ] Export controller created
- [ ] API endpoints registered

---

## Notes

**CSV Serialization Requirements**:
- UTF-8 encoding for international character support
- Proper field escaping (commas, quotes, newlines)
- RFC 4180 compliant

**JSON Serialization Requirements**:
- Pretty-printed for readability
- ISO 8601 date format
- Proper null handling

**Filename Format**:
- Pattern: `questions_{YYYY-MM-DD_HH-mm-ss}.{extension}`
- Example: `questions_2026-02-19_20-35-00.csv`
