# Stage 2: Technical Design
**Bolt**: 003-category-service
**Status**: In Progress
**Date**: 2026-02-19

## Architecture Decisions

### Decision 1: Query Approach for Category Counts

**Problem**: Need to efficiently retrieve categories with their question counts.

**Options**:
1. **N+1 Query**: Fetch categories, then fetch count for each category (inefficient)
2. **JOIN with COUNT**: Single query with LEFT JOIN and GROUP BY (efficient)
3. **Separate Count Query**: Fetch categories, then single query with IN clause (efficient for caching)

**Selected**: Option 2 - JOIN with COUNT

**Rationale**:
- Single database query
- Efficient for small to medium category lists
- TypeORM supports this pattern

**Implementation**:
```typescript
createQueryBuilder('category')
  .leftJoin('category.questions', 'question', 'question.is_deleted = :isDeleted')
  .setParameter('isDeleted', false)
  .select([
    'category.id',
    'category.name',
    'category.created_at',
    'category.updated_at',
    'COUNT(question.id) as question_count'
  ])
  .groupBy('category.id')
```

### Decision 2: New Endpoint vs. Enhanced Existing

**Problem**: Should `GET /categories` return counts or create a new endpoint?

**Options**:
1. **Enhance existing**: Modify `GET /categories` to always include counts
2. **New endpoint**: Create `GET /categories/with-counts` for explicit count requests
3. **Query parameter**: Add `?include_counts=true` to existing endpoint

**Selected**: Option 2 - New endpoint

**Rationale**:
- Backward compatible - existing consumers won't break
- Explicit API contract - consumers know when they get counts
- Performance - counts only calculated when requested
- Clean separation of concerns

---

## API Design

### New Endpoint

#### GET /categories/with-counts

**Description**: Returns all categories with their associated question counts.

**Request**:
```http
GET /categories/with-counts
```

**Query Parameters**: None

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "uuid-1",
      "name": "Geography",
      "created_at": "2026-02-19T00:00:00.000Z",
      "updated_at": "2026-02-19T00:00:00.000Z",
      "question_count": 15
    },
    {
      "id": "uuid-2",
      "name": "Math",
      "created_at": "2026-02-19T00:00:00.000Z",
      "updated_at": "2026-02-19T00:00:00.000Z",
      "question_count": 8
    }
  ],
  "total": 2
}
```

**Error Responses**:
- 500 Internal Server Error: Database error

### Existing Endpoints (No Changes)

- `GET /categories` - Basic list (no changes)
- `GET /categories/:id` - Single category (no changes)
- `POST /categories` - Create category (no changes)
- `PUT /categories/:id` - Update category (no changes)
- `DELETE /categories/:id` - Delete category (no changes)

---

## Database Schema

### Existing Schema (No Changes)

```sql
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  question_text TEXT NOT NULL,
  reference_answer TEXT NOT NULL,
  category_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  is_deleted INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

### Query Implementation

```sql
SELECT
  c.id,
  c.name,
  c.created_at,
  c.updated_at,
  COUNT(q.id) as question_count
FROM categories c
LEFT JOIN questions q ON q.category_id = c.id AND q.is_deleted = 0
GROUP BY c.id;
```

---

## Module Structure

```
src/modules/question-crud/
├── entities/
│   ├── category.entity.ts          (existing)
│   └── question.entity.ts         (existing)
├── dto/
│   ├── category.dto.ts            (existing)
│   └── category-with-count.dto.ts  (NEW)
├── repositories/
│   └── category.repository.ts      (extend - add findAllWithCounts)
├── services/
│   └── category.service.ts        (extend - add findAllWithCounts)
└── controllers/
    └── category.controller.ts      (extend - add with-counts endpoint)
```

---

## Security Considerations

- No authentication required for category listing (public data)
- No input validation needed for GET request (no parameters)
- SQL injection protection via TypeORM parameterized queries

---

## Performance Considerations

| Factor | Impact | Mitigation |
|---------|---------|------------|
| Large category list | O(n) query complexity | Consider pagination in future |
| Large question counts | COUNT operation overhead | Acceptable for small/medium data |
| Database load | Single JOIN query | Efficient, single round-trip |

---

## Testing Strategy

### Unit Tests

1. **CategoryRepository.findAllWithCounts()**
   - Returns categories with correct counts
   - Returns zero for categories with no questions
   - Filters out deleted questions from count
   - Handles empty database

2. **CategoryService.findAllWithCounts()**
   - Returns CategoryWithCountDto[]
   - Delegates to repository

### Integration Tests

1. **CategoryController.findAllWithCounts()**
   - Returns 200 OK
   - Returns correct JSON structure
   - Includes question_count field

### Test Data

```typescript
const testCategories = [
  { id: 'cat-1', name: 'Geography' },
  { id: 'cat-2', name: 'Math' },
];

const testQuestions = [
  { id: 'q1', category_id: 'cat-1', is_deleted: false },
  { id: 'q2', category_id: 'cat-1', is_deleted: false },
  { id: 'q3', category_id: 'cat-2', is_deleted: false },
  { id: 'q4', category_id: 'cat-1', is_deleted: true },  // deleted
];

Expected:
- cat-1: count = 2 (only non-deleted)
- cat-2: count = 1
```

---

## Rollback Plan

If issues arise:
1. Remove `findAllWithCounts()` from CategoryController
2. Remove DTO from exports
3. No database schema changes to revert
- Low risk change
