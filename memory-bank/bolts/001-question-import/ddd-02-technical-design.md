---
unit: 001-question-import
bolt: 001-question-import-1
stage: design
status: complete
updated: 2026-02-19T17:15:00Z
---

# Technical Design - Question Import

## Architecture Pattern

**Modular Monolith** (per project ARCHITECTURE.md)

**Rationale**:
- Single deployment unit with strong module boundaries
- Question Import operates within its own bounded context
- Clear separation between import logic and question management
- Supports future extraction to microservice if needed
- Aligns with project's existing Nest.js module structure

## Layer Structure

```text
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                      │
│  ImportController (@Controller)                            │
│  - POST /api/questions/import                             │
│  - GET /api/import/sessions/:id                           │
├─────────────────────────────────────────────────────────────┤
│                   Application Layer                        │
│  ImportService (@Injectable)                               │
│  - parseFile(file)                                        │
│  - validateRecords(records)                                │
│  - storeQuestions(questions)                               │
│  - trackProgress(session)                                  │
├─────────────────────────────────────────────────────────────┤
│                     Domain Layer                           │
│  Entities: Question, ImportSession, ImportError             │
│  Value Objects: ImportStatus, ErrorType                    │
│  Repository Interfaces: IQuestionRepository, etc.            │
├─────────────────────────────────────────────────────────────┤
│                Infrastructure Layer                         │
│  TypeORM Entities, File Upload Handler, CSV/JSON Parsers  │
└─────────────────────────────────────────────────────────────┘
```

**Layer Responsibilities**:

| Layer | Responsibility | Key Artifacts |
|-------|----------------|---------------|
| Presentation | HTTP request/response handling, file upload | ImportController, DTOs, Guards |
| Application | Orchestration, business rules, validation | ImportService, Validators |
| Domain | Core entities, value objects, repository interfaces | Question, ImportSession, ImportStatus |
| Infrastructure | Data access, file parsing, external services | TypeORM entities, CSVParser, JsonParser |

**Dependency Rules**:

- ✅ Presentation → Application (via ImportService)
- ✅ Presentation → Domain (via DTOs)
- ✅ Application → Domain (via entities)
- ✅ Infrastructure → Domain (implements repository interfaces)
- ✅ Infrastructure → Application (configuration)
- ❌ Domain → No dependencies (pure business logic)
- ❌ Application → No direct Infrastructure (uses interfaces)

## API Design

### POST /api/questions/import

**Purpose**: Upload and process CSV or JSON file for question import

**Request**:

- Method: POST
- Content-Type: multipart/form-data
- Body:
  ```typescript
  {
    file: File,           // CSV or JSON file
    mode: 'skip' | 'replace'  // Optional: default 'skip'
  }
  ```

**Response** (200 OK):

```json
{
  "statusCode": 200,
  "message": "Import completed",
  "data": {
    "sessionId": "uuid-v4",
    "totalRows": 1000,
    "successCount": 998,
    "errorCount": 2,
    "errors": [
      {
        "rowNumber": 15,
        "errorType": "MISSING_FIELD",
        "message": "Column 'reference_answer' is required"
      }
    ]
  }
}
```

**Response** (400 Bad Request - Validation Failed):

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
    "sessionId": "uuid-v4"
  }
}
```

**Response** (413 Payload Too Large):

```json
{
  "statusCode": 413,
  "message": "File exceeds maximum size of 10MB"
}
```

### GET /api/import/sessions/:id

**Purpose**: Retrieve import session details and progress

**Request**:

- Method: GET
- Path Params:
  ```typescript
  {
    id: string  // session UUID
  }
  ```

**Response** (200 OK):

```json
{
  "statusCode": 200,
  "data": {
    "id": "uuid-v4",
    "fileName": "questions.csv",
    "fileType": "CSV",
    "status": "COMPLETED",
    "totalRows": 1000,
    "successCount": 998,
    "errorCount": 2,
    "createdAt": "2026-02-19T17:00:00Z",
    "errors": [
      {
        "id": "uuid",
        "rowNumber": 15,
        "errorType": "MISSING_FIELD",
        "message": "Column 'reference_answer' is required"
      }
    ]
  }
}
```

## Data Persistence

### Database Schema (TypeORM + SQLite)

#### questions Table

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | varchar(36) | PRIMARY KEY | UUID |
| question_text | text | NOT NULL, UNIQUE (case-sensitive) | Minimum 10 chars |
| reference_answer | text | NOT NULL | Minimum 10 chars |
| category_id | varchar(36) | NULL, FOREIGN KEY → categories(id) | Optional |
| created_at | datetime | NOT NULL | Auto-generated |
| updated_at | datetime | NOT NULL | Auto-updated |
| is_deleted | boolean | NOT NULL, DEFAULT FALSE | Soft delete flag |

#### import_sessions Table

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | varchar(36) | PRIMARY KEY | UUID |
| file_name | varchar(255) | NOT NULL | Original filename |
| file_type | varchar(10) | NOT NULL | 'CSV' or 'JSON' |
| status | varchar(20) | NOT NULL | 'PROGRESSING', 'COMPLETED', 'FAILED' |
| total_rows | integer | NOT NULL, DEFAULT 0 | Total records parsed |
| success_count | integer | NOT NULL, DEFAULT 0 | Successfully imported |
| error_count | integer | NOT NULL, DEFAULT 0 | Failed imports |
| created_at | datetime | NOT NULL | Auto-generated |

#### import_errors Table

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | varchar(36) | PRIMARY KEY | UUID |
| session_id | varchar(36) | NOT NULL, FOREIGN KEY → import_sessions(id) | CASCADE DELETE |
| row_number | integer | NOT NULL | Row index in file |
| error_type | varchar(50) | NOT NULL | Error category |
| message | text | NOT NULL | Detailed error message |
| created_at | datetime | NOT NULL | Auto-generated |

### Indexes

```sql
-- For duplicate detection (case-sensitive)
CREATE INDEX idx_questions_text ON questions(question_text);

-- For session queries
CREATE INDEX idx_import_sessions_created ON import_sessions(created_at DESC);

-- For error queries
CREATE INDEX idx_import_errors_session ON import_errors(session_id);
```

### Migration Plan

1. Create questions table with constraints
2. Create import_sessions table
3. Create import_errors table
4. Add indexes for performance
5. Seed with empty categories table (if not exists)

## Security Design

| Concern | Approach |
|---------|----------|
| Authentication | JWT-based auth via existing auth module (protected routes) |
| Authorization | Role-based: Admin/Teacher only for import operations |
| File Upload | Size limit: 10MB, Type validation: .csv, .json only |
| Input Validation | class-validator DTOs, sanitize CSV/JSON input |
| SQL Injection | Protected by TypeORM (parameterized queries) |
| Rate Limiting | Limit to 10 imports per minute per user |

### File Upload Security

```typescript
// Multer configuration
{
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['text/csv', 'application/json', '.csv', '.json'];
    cb(null, allowedTypes.includes(file.mimetype));
  }
}
```

## NFR Implementation

| Requirement | Design Approach |
|-------------|----------------|
| Performance (5s for 1000 questions) | Batch inserts with TypeORM, CSV streaming parser |
| Scalability (10,000 questions < 30s) | Chunked processing, progress tracking, async import |
| Reliability (transaction support) | TypeORM transactions, rollback on critical errors |
| Memory (stay within limits) | Stream-based CSV parsing, dispose file handles |

### Performance Optimization

1. **Batch Insert**: Use TypeORM's `insert().values()` with chunking (100 rows per batch)
2. **CSV Streaming**: Use `fast-csv` with streaming to avoid loading entire file in memory
3. **Duplicate Check Pre-processing**: Build in-memory set for O(1) lookup
4. **Progress Tracking**: Update session status after each batch (not per row)

### Error Handling Strategy

| Error Type | Code | Response | Recovery |
|------------|------|----------|-----------|
| Invalid file format | 400 | File must be CSV or JSON | User re-uploads correct format |
| Missing required columns | 400 | Column 'xxx' is required | User fixes file |
| Duplicate question | 200 with warnings | Skipped X duplicates | Continues import |
| Category not found | 400 | Category 'xxx' does not exist | User creates category first |
| File too large | 413 | File exceeds 10MB | User splits file |
| Database error | 500 | Internal server error | Admin investigates |

## Error Handling

### Error Types (Value Object)

| Type | Code | HTTP | Description |
|------|------|------|-------------|
| MISSING_FIELD | MISSING_FIELD | 400 | Required column missing |
| INVALID_FORMAT | INVALID_FORMAT | 400 | Data format incorrect |
| DUPLICATE_QUESTION | DUPLICATE_QUESTION | 200 | Question already exists |
| CATEGORY_NOT_FOUND | CATEGORY_NOT_FOUND | 400 | Referenced category missing |
| FILE_TOO_LARGE | FILE_TOO_LARGE | 413 | Exceeds 10MB limit |
| UNKNOWN_ERROR | UNKNOWN_ERROR | 500 | Unexpected error |

### Validation Rules

```typescript
// Question validation rules
{
  question_text: { minLength: 10, maxLength: 2000 },
  reference_answer: { minLength: 10, maxLength: 5000 },
  category_id: { optional: true, format: 'uuid' }
}

// CSV format validation
{
  headers: ['id', 'question_text', 'reference_answer', 'category'],
  encoding: 'utf-8',
  delimiter: ','
}

// JSON format validation
{
  type: 'array',
  items: {
    type: 'object',
    properties: {
      question_text: { type: 'string', minLength: 10 },
      reference_answer: { type: 'string', minLength: 10 },
      category: { type: 'string', optional: true }
    }
  }
}
```

## External Dependencies

| System | Purpose | Integration | Risk |
|--------|---------|-------------|------|
| SQLite Database | Persistent storage | TypeORM ORM | Low |
| File System | Read uploaded files | Node.js fs module | Low |

### CSV Parser

**Library**: `fast-csv` (recommended)

```typescript
// Interface design
interface ICsvParser {
  parseFile(fileStream: ReadableStream): Promise<ParsedRecord[]>;
}
```

**Rationale**: Streaming support, memory efficient, TypeScript support

### JSON Parser

**Library**: Built-in `JSON.parse()` with schema validation

```typescript
// Interface design
interface IJsonParser {
  parseFile(fileStream: ReadableStream): Promise<ParsedRecord[]>;
}
```

**Rationale**: Native support, no external dependency for basic JSON

## Integrations

### Angular Frontend Integration

| Component | Integration Point |
|-----------|------------------|
| FileUploadComponent | POST /api/questions/import |
| ImportProgressComponent | GET /api/import/sessions/:id (polling) |
| NotificationService | Display import results/errors |

### API Contracts

**Request DTO**:

```typescript
class ImportFileDto {
  @IsFile()
  @MimeType(['text/csv', 'application/json'])
  file: Express.Multer.File;

  @IsOptional()
  @IsEnum(['skip', 'replace'])
  mode?: 'skip' | 'replace';
}
```

**Response DTO**:

```typescript
class ImportResultDto {
  sessionId: string;
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: ImportErrorDto[];
}

class ImportErrorDto {
  rowNumber: number;
  errorType: string;
  message: string;
}
```

## Module Structure (Nest.js)

```text
src/modules/question-import/
├── domain/
│   ├── entities/
│   │   ├── question.entity.ts
│   │   ├── import-session.entity.ts
│   │   └── import-error.entity.ts
│   ├── value-objects/
│   │   ├── import-status.vo.ts
│   │   └── error-type.vo.ts
│   └── repositories/
│       ├── question.repository.interface.ts
│       ├── import-session.repository.interface.ts
│       └── import-error.repository.interface.ts
├── application/
│   ├── services/
│   │   ├── import.service.ts
│   │   ├── csv-parser.service.ts
│   │   ├── json-parser.service.ts
│   │   └── import-validator.service.ts
│   └── dto/
│       ├── import-file.dto.ts
│       ├── import-result.dto.ts
│       └── import-error.dto.ts
├── infrastructure/
│   ├── repositories/
│   │   ├── question.repository.ts
│   │   ├── import-session.repository.ts
│   │   └── import-error.repository.ts
│   └── parsers/
│       ├── csv-parser.impl.ts
│       └── json-parser.impl.ts
├── presentation/
│   ├── controllers/
│   │   └── import.controller.ts
│   └── guards/
│       └── import-role.guard.ts
└── question-import.module.ts
```

---

## Completion Criteria

- ✅ Architecture pattern selected and documented (Modular Monolith)
- ✅ All layers designed with responsibilities
- ✅ API contracts defined (POST /api/questions/import, GET /api/import/sessions/:id)
- ✅ Database schema designed (questions, import_sessions, import_errors tables)
- ✅ NFRs addressed in design (performance, scalability, reliability)
- ✅ Security patterns applied (auth, file validation, input sanitization)
