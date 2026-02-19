# Stage 1: Domain Model
**Bolt**: 003-category-service
**Status**: In Progress
**Date**: 2026-02-19

## Existing Artifacts (from Bolt 002)

The following artifacts were created in bolt 002 and are available for reuse:

### Entities

#### Category Entity
```typescript
@Entity('categories')
export class Category {
  @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
```

### Value Objects
- `SortBy` enum (from question-crud)
- `DeleteStatus` enum (from question-crud)

### Repository Interfaces
CategoryRepository - TypeORM-based repository with methods:
- `create(data)` - Create category
- `findAll()` - List all categories
- `findById(id)` - Find by ID
- `delete(id)` - Delete category

### Service Interface
CategoryService - Business logic with methods:
- `create(dto)` - Create category
- `findAll()` - List categories
- `findOne(id)` - Find single category
- `update(id, dto)` - Update category
- `delete(id)` - Delete category

---

## New Requirements (from Bolt 003 Stories)

### Story 002: List categories with question counts

The current `findAll()` returns:
```typescript
{
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}[]
```

**Required enhancement:**
```typescript
{
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  question_count: number;  // NEW FIELD
}[]
```

### Domain Changes Needed

#### CategoryWithCountDto (new)
DTO representing a category with its associated question count:

```typescript
export interface CategoryWithCountDto extends CategoryDto {
  question_count: number;
}
```

#### CategoryWithCount Query (new)
Query type for listing categories with counts:

```typescript
export interface CategoryListWithCountDto {
  data: CategoryWithCountDto[];
  total: number;
}
```

---

## Ubiquitous Language

| Term | Definition |
|-------|------------|
| Category | A topic or subject used to organize questions |
| Question Count | The number of questions currently associated with a category |
| Uncategorized | Questions that have no category assigned (category_id is null) |

---

## Aggregate Design

**Category Aggregate Root**: `Category`
- Invariants:
  - Name must be at least 3 characters
  - Name must be at most 255 characters

**Relationships**:
- Category has many Questions (one-to-many)
- Question belongs to at most one Category (optional)

---

## Boundary Analysis

**In-scope for Bolt 003**:
- Category entity (already exists)
- Category repository (already exists)
- Category service (partial - needs count enhancement)
- Category controller (partial - needs count endpoint)
- DTOs for category with count (new)

**Out-of-scope**:
- Question CRUD (handled by bolt 002)
- Category assignment to questions (handled by bolt 002)
- Frontend UI (bolt 001-question-management-ui)

---

## Completion Criteria

- [x] Category entity exists (from bolt 002)
- [x] Category repository exists (from bolt 002)
- [x] Base category service exists (from bolt 002)
- [ ] `CategoryWithCountDto` created
- [ ] `findAllWithCounts()` method in CategoryRepository
- [ ] `findAllWithCounts()` method in CategoryService
- [ ] `GET /categories/with-counts` endpoint in CategoryController
- [ ] Tests for count functionality

---

## Notes

Since the category entity, repository, and basic service already exist from bolt 002, this bolt focuses on the enhancement for **listing categories with question counts**.

The question count should reflect only non-deleted questions (is_deleted = false).
