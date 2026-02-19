---
unit: 002-question-crud
bolt: 002-question-crud
stage: design
status: complete
updated: 2026-02-19T19:15:00Z
---

# Technical Design - Question CRUD

## Architecture Pattern

**Modular Monolith** (per project ARCHITECTURE.md)

**Rationale**:
- Question CRUD is a well-defined bounded context with clear entity boundaries
- Aligns with existing question-import module architecture
- Simple module structure (entities, dto, services, controllers) matches Nest.js patterns
- Appropriate for demo application with moderate complexity

## Layer Structure

```text
┌─────────────────────────────────────────────────────┐
│      Presentation           │  API/UI
├─────────────────────────────────────────────────────┤
│      Application            │  Use Cases
├─────────────────────────────────────────────────────┤
│        Domain               │  Business Logic
├─────────────────────────────────────────────────────┤
│     Infrastructure          │  Database/External
└─────────────────────────────────────────────────────┘
```

### Layer Structure

| Layer | Responsibilities |
|--------|----------------|
| **Presentation** | API endpoints (GET, POST, PUT, DELETE), DTOs, guards |
| **Application** | Use cases, service orchestration, business rules |
| **Domain** | Entities, value objects, aggregates, domain events, repository interfaces |
| **Infrastructure** | TypeORM entities, repository implementations, database access |

### API Design

| Endpoint | Method | Request | Response |
|----------|--------|---------|----------|
| **POST /api/questions** | CreateQuestionDto | QuestionDto (with ID) |
| **GET /api/questions/:id** | N/A | QuestionDto |
| **PUT /api/questions/:id** | UpdateQuestionDto | QuestionDto |
| **DELETE /api/questions/:id** | N/A | SuccessDto |
| **GET /api/questions** | QuestionQueryDto | PaginatedQuestionListDto |
| **POST /api/questions/:id/category** | AssignCategoryDto | QuestionDto |
| **DELETE /api/questions/:id/category** | N/A | SuccessDto |

**Request/Response Schemas**:

```typescript
// CreateQuestionDto
export class CreateQuestionDto {
  question_text: string;
  reference_answer: string;
  category_id?: string;
}

// QuestionDto
export class QuestionDto {
  id: string;
  question_text: string;
  reference_answer: string;
  category_id?: string | null;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

// UpdateQuestionDto
export class UpdateQuestionDto {
  question_text: string;
  reference_answer: string;
  category_id?: string;
}

// QuestionQueryDto
export class QuestionQueryDto {
  page?: number;
  limit?: number;
  text?: string;
  category_id?: string;
  sort_by?: 'created_at' | 'updated_at';
}

// PaginatedQuestionListDto
export class PaginatedQuestionListDto {
  data: QuestionDto[];
  total: number;
  page: number;
  limit: number;
}

// AssignCategoryDto
export class AssignCategoryDto {
  category_id: string;
}

// SuccessDto
export class SuccessDto {
  success: boolean;
  message?: string;
}
```

### Data Model

| Table | Columns | Relationships |
|-------|---------|---------------|
| **questions** | id, question_text, reference_answer, category_id (FK → categories), created_at, updated_at, is_deleted | Categories (id, name, description) → has many |
| **categories** | id, name, description | Questions.category_id | One category can have many questions |

### Indexes

```sql
-- For uniqueness within category
CREATE INDEX idx_questions_category_text
  ON questions(category_id, question_text)
  WHERE is_deleted = false;

-- For faster category lookups
CREATE INDEX idx_questions_category_id
  ON questions(category_id)
  WHERE is_deleted = false;

-- For sorting
CREATE INDEX idx_questions_created_at
  ON questions(created_at DESC);

-- For text search (full-text search)
CREATE VIRTUAL TABLE vs_fts_questions
  USING FTS5(questions);

-- For pagination sorting
CREATE INDEX idx_questions_category_created
  ON questions(category_id, created_at DESC);
```

### Security Design

| Concern | Approach |
|---------|----------|
| Authentication | JWT-based auth via existing auth module |
| Authorization | Role-based: Admin/Teacher can CRUD, Student/Trainee read-only |
| Input Validation | class-validator DTOs, sanitize inputs |
| SQL Injection | Protected by TypeORM (parameterized queries) |
| Delete Protection | Soft delete (is_deleted flag), active check before hard delete |

### NFR Implementation

| Requirement | Design Approach |
|-------------|----------------|
| Performance | Pagination (max 20/page), index-based lookups, query optimization with SELECT only needed fields |
| Scalability | Database indexes, prepared statement caching for category lookups |
| Reliability | Soft delete for data integrity, transaction rollback on errors |

## Error Handling

| Error Type | Code | Response |
|-----------|-----|----------|
| Not Found | 404 | { success: false, message: "Question not found" } |
| Validation Failed | 400 | { success: false, message: "Validation failed", errors: [] } |
| Conflict | 409 | { success: false, message: "Question already exists", questionId } |
| Unauthorized | 401 | { success: false, message: "Unauthorized access" } |

## External Dependencies

| System | Purpose | Integration |
|--------|---------|---------------|
| SQLite Database | Persistent data storage | TypeORM ORM |
| Category Service | Read category IDs for question categorization | Optional dependency (when implemented) |
| Auth Module | Provide JWT tokens and role-based authorization | Required for protected endpoints |

---

## Completion Criteria

- [x] Architecture pattern selected and documented (Modular Monolith)
- [x] All layers designed with responsibilities
- [x] All API contracts defined (7 endpoints)
- [x] Database schema designed (questions, categories with relationships)
- [x] Database indexes planned for performance
- [x] Security patterns documented (auth, validation, SQL injection prevention)
- [x] NFRs addressed (pagination, scalability)
- [x] External dependencies identified (SQLite, Auth, Category Service)

---

## Notes

**Architecture**: Simple module structure following ADR-001 from question-import bolt. No DDD layering needed.

**API Design**: RESTful with resource-based URLs (/api/questions/:id, /api/questions). Query parameters for filtering (text search, category filter, pagination).

**Database**: TypeORM with SQLite for development. Prepared statement caching for category lookups (future: could be Redis cache).

**Security**: All CRUD endpoints require authentication. Soft delete with is_deleted flag. Active evaluation check needed before delete.

**Dependencies**: Category service (003-category-service) is optional dependency - questions can exist without categories until that bolt is implemented.

**Future Considerations**:
- Full-text search using FTS5 for better performance on large datasets
- Query optimization (SELECT only vs SELECT *)
- Caching layer (Redis) for production deployments
