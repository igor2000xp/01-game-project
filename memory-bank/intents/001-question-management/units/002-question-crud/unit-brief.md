---
unit: 002-question-crud
intent: 001-question-management
phase: inception
status: draft
created: 2026-02-19T15:19:25Z
updated: 2026-02-19T15:19:25Z
---

# Unit Brief: Question CRUD

## Purpose

Provide core CRUD operations for questions including create, read, update, and delete with category support, filtering, search, and pagination. This unit serves as the primary data access layer for question management.

## Scope

### In Scope
- Create new questions with text, reference answer, and optional category
- Read questions with pagination, filtering by category, and full-text search
- Update question text, reference answer, and category
- Soft delete questions with confirmation
- Bulk delete by category
- Question metadata tracking (created_at, updated_at)
- Prevent deletion of questions referenced by active evaluations

### Out of Scope
- Question versioning/audit history (consider future enhancement)
- Question approval workflow
- Multi-language support
- Rich text editing (markdown/HTML) in reference answers

## Assigned Requirements

| FR | Requirement | Priority |
|----|-------------|----------|
| FR-2 | Create and Store Questions | Must |
| FR-3 | Read and List Questions | Must |
| FR-4 | Update Existing Questions | Should |
| FR-5 | Delete Questions | Should |

## Domain Concepts

### Key Entities

| Entity | Description | Attributes |
|--------|-------------|------------|
| Question | The core question entity | id, question_text, reference_answer, category_id (FK), created_at, updated_at, is_deleted |
| Category | Optional grouping entity | id, name, description, created_at |
| QuestionFilter | Query parameters for listing | text (search), category_id, page, limit, sort_by, sort_order |

### Key Operations

| Operation | Description | Inputs | Outputs |
|-----------|-------------|---------|----------|
| Create Question | Insert new question with validation | Question entity with ID |
| List Questions | Query with filters and pagination | Paginated Question list |
| Get Question | Fetch single question by ID | Question entity |
| Update Question | Modify existing question fields | Updated Question entity |
| Delete Question | Soft delete by ID | Success confirmation |
| Bulk Delete | Soft delete by category filter | Success confirmation |
| Search Questions | Full-text search on question/reference | Matching Question list |

---

## Story Summary

| Metric | Count |
|--------|-------|
| Total Stories | 5 |
| Must Have | 3 |
| Should Have | 2 |
| Could Have | 0 |

### Stories

| Story ID | Title | Priority | Status |
|----------|-------|----------|--------|
| 001-create-question | Create new question | Must | Planned |
| 002-list-questions | List questions with pagination | Must | Planned |
| 003-update-question | Update existing question | Should | Planned |
| 004-delete-question | Delete single question | Should | Planned |
| 005-bulk-delete | Bulk delete questions by category | Could | Planned |

---

## Dependencies

### Depends On
None - Independent core CRUD unit.

### Depended By
| Unit | Reason |
|------|--------|
| 003-category-service | Questions reference categories |
| 004-question-export | Export reads questions |
| 001-question-management-ui | UI uses CRUD endpoints |

### External Dependencies

| System | Purpose | Risk |
|--------|---------|------|
| SQLite Database | Data storage and queries | Low |

## Technical Context

### Suggested Technology
- Backend: Nest.js (QuestionController, QuestionService)
- ORM: TypeORM (QuestionRepository)
- Validation: class-validator (DTOs)
- Search: SQLite FTS or simple LIKE queries (for demo)

### Integration Points

| Integration | Type | Protocol |
|------------|------|----------|
| 001-question-management-ui (Frontend) | API | REST (GET, POST, PUT, DELETE /api/questions) |
| 003-category-service | API | REST (GET /api/categories) |
| SQLite Database | Data Access | TypeORM Entity Manager |

### Data Storage

| Data | Type | Volume | Retention |
|------|------|--------|-----------|
| Questions | SQL | 10,000+ records | Permanent (soft delete) |
| Categories | SQL | 100+ records | Permanent |

---

## Constraints

- Question text minimum: 10 characters
- Reference answer minimum: 10 characters
- Maximum questions per page: 20
- Soft delete requires admin confirmation
- Questions with active evaluations cannot be deleted

## Success Criteria

### Functional
- [ ] Questions can be created with all required fields
- [ ] Questions can be listed with pagination (default 20 per page)
- [ ] Questions can be filtered by category
- [ ] Questions can be searched by text or reference answer
- [ ] Questions can be updated with any field
- [ ] Questions can be soft deleted with confirmation
- [ ] Bulk delete works by category
- [ ] Metadata (timestamps) are tracked

### Non-Functional
- [ ] Question list response < 200ms (p95)
- [ ] CRUD operations < 100ms
- [ ] Pagination handles 10,000+ questions

## Quality

- [ ] Code coverage > 80%
- [ ] All acceptance criteria met
- [ ] Code reviewed and approved

---

## Bolt Suggestions

| Bolt | Type | Stories | Objective |
|------|------|---------|-----------|
| bolt-002-question-crud-1 | DDD | S1, S2 | Domain entities and repository layer |
| bolt-002-question-crud-2 | DDD | S3, S4 | Service layer with business logic |
| bolt-002-question-crud-3 | DDD | S5, S6 | Controller layer and API endpoints |

## Notes

The category relationship should be optional - questions can exist without categories. Consider adding a "no category" option in the UI for better UX.
