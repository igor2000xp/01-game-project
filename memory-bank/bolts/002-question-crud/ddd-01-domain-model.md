---
unit: 002-question-crud
bolt: 002-question-crud
stage: model
created: 2026-02-19T19:10:00Z
---

# Domain Model - Question CRUD

## Overview

Define the domain model for Question CRUD functionality including core entities, value objects, repository interfaces, and domain services. This model supports creating, reading, updating, and deleting questions with category support and filtering.

## Static Model

### Entities

| Entity | Description | Attributes | Business Rules |
|--------|-------------|------------|
| **Question** | Core question entity with ID, text, reference answer, optional category | id, question_text (min 10 chars), reference_answer (min 10 chars), category_id (FK → categories), created_at, updated_at, is_deleted (soft delete) | question_text must be unique per category (case-insensitive) within category_id scope (case-sensitive) overall. Questions with active evaluations cannot be deleted. |
| **Category** | Optional grouping entity for organizing questions by topic | id, name, description, created_at | Name minimum 3 characters. Categories can be used to organize questions. |
| **QuestionFilter** | Value object for query parameters | text (search), category_id, page (default 1), limit (default 20), sort_by (default: created_at) | Enables flexible question listing and searching |

### Value Objects

| Value Object | Description | Constraints |
|-------------|-------------|----------|
| **SortBy** | Enum for sort options | CREATED, UPDATED | Options specify how results should be ordered |
| **Pagination** | Value object for query parameters | page (default 1), limit (default 20) | Pagination parameters for controlling result set size |

### Aggregates

| Aggregate Root | Members | Invariants |
|-------------|---------|----------|
| **Question** | All questions belong to Question aggregate | Each question is its own aggregate root. | No invariants |

### Domain Events

| Event | Description | Trigger | Payload |
|-------------|-------------|----------|
| **QuestionCreated** | Emitted when new question stored | QuestionService.create() | { id, question_text, reference_answer, category_id, created_at } |
| **QuestionUpdated** | Emitted when question fields modified | QuestionService.update() | { id, changed_fields, updated_at } |
| **QuestionDeleted** | Emitted when soft-deleted | QuestionService.delete() | { id, deleted_at } |

### Domain Services

| Service | Operations | Dependencies |
|-------------|-------------|----------|
| **QuestionRepository** | Core data access interface | IQuestionRepository | getQuestionById(id), create(questionData), findAll(filters), update(id, data), softDelete(id) |
| **CategoryRepository** | Category data access | ICategoryRepository | create(categoryData), findAll(), delete(id), findById(id) |

### Repository Interfaces

| Interface | Entity | Methods |
|-------------|--------|----------|
| **IQuestionRepository** | Question | getQuestionById(id), create(questionData), findAll(filters), update(id, data), softDelete(id) |

---

## Constraints

- Question text minimum: 10 characters
- Reference answer minimum: 10 characters
- Category name minimum: 3 characters (if used)
- Maximum 20 questions per page (pagination)
- Questions with active evaluations cannot be deleted
- Soft delete pattern used (is_deleted flag)

## Business Rules

1. Question text uniqueness: question_text must be unique per category_id scope (case-insensitive)
2. Overall uniqueness check: question_text must be unique overall (case-insensitive) if category_id is null
3. Category validation: If category_id is provided, it must reference an existing category
4. Delete protection: Questions with active evaluations cannot be deleted (evaluations must be cleaned first)
5. Timestamps: All entities track created_at and updated_at timestamps

## Success Criteria

### Functional

- [ ] All domain entities identified and documented
- [ ] Business rules captured for each entity
- [ ] Aggregate boundaries defined
- [ ] Domain events specified
- [ ] Domain services designed
- [ ] Repository interfaces defined
- [ ] Ubiquitous language documented
- [ ] All stories covered by domain model

### Non-Functional

- [ ] Domain model is clear and understandable
- [ ] Entity relationships are well-defined
- [ ] Value objects are properly constrained
- [ ] Services follow single responsibility principle

### Quality

- [ ] Code coverage > 80% for Question entities
- [ ] All acceptance criteria met
- [ ] Code reviewed and approved

---

## Notes

**Category Handling**: Questions can exist without categories. Category is optional reference. Create "no category" (null or empty string) for uncategorized questions.

**Filter Query Support**: The QuestionFilter value object enables flexible querying with text search, category filtering, pagination, and sorting. This should be a value object used in repository queries.

**Repository Interfaces**: Defined at interface level but implemented as concrete classes. Use TypeORM decorators (@Entity, @Injectable) for concrete implementations.

**Future Considerations**:
- Question versioning/audit history could be added if evaluation tracking is needed
- Question export functionality (004-question-export bolt) will read from these entities
- Category management UI may need category CRUD operations (003-category-service bolt)
