---
bolt: 003-category-service
created: 2026-02-19T20:20:00Z
status: accepted
---

# ADR-001: Use LEFT JOIN with COUNT for Category Question Counts

## Context

The Category Service bolt requires listing categories with their associated question counts to support:
- Display category selection with question counts in UI
- Show category popularity
- Help users understand category content distribution

Current `CategoryRepository.findAll()` returns only category entities without question count information. Adding this feature requires a decision on the query approach.

## Decision

**Use LEFT JOIN with GROUP BY and COUNT** to retrieve categories with question counts in a single database query.

### Query Implementation

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
  .getRawMany()
```

### SQL Equivalent

```sql
SELECT
  c.id,
  c.name,
  c.created_at,
  c.updated_at,
  COUNT(q.id) as question_count
FROM categories c
LEFT JOIN questions q
  ON q.category_id = c.id AND q.is_deleted = 0
GROUP BY c.id;
```

## Rationale

### Why LEFT JOIN with COUNT?

1. **Single query**: One database round-trip instead of N+1 queries
2. **Standard SQL**: Uses well-understood SQL patterns
3. **TypeORM support**: QueryBuilder supports this pattern natively
4. **Efficient**: Database optimizes COUNT with LEFT JOIN
5. **Correct semantics**: LEFT JOIN returns categories with zero questions (count = 0)
6. **Deleted filter**: Excludes soft-deleted questions from count

### Comparison of Options

| Option | Complexity | Performance | Pros | Cons |
|---------|-------------|-------------|-------|-------|
| N+1 Queries | Low | ❌ Poor | Simple to implement | O(n) queries, slow |
| JOIN with COUNT | Medium | ✅ Good | Single query, efficient | More complex query |
| Separate Count Query | Low | ✅ Good | Clear separation, cacheable | Two queries |
| Materialized View | High | ✅ Excellent | Best performance | Requires maintenance, overkill |

### Why not materialized views?

- Overkill for demo application
- Requires additional database objects
- Maintenance overhead
- Question counts change frequently

### Why not N+1 queries?

- O(n) query complexity scales poorly
- Each category requires separate COUNT query
- Slow for large category lists

## Consequences

### Positive

- ✅ Single database query
- ✅ Efficient for small to medium category lists
- ✅ Correctly handles categories with zero questions
- ✅ Filters out soft-deleted questions
- ✅ TypeORM QueryBuilder support
- ✅ No additional database objects required

### Negative

- ⚠️ `getRawMany()` returns raw results, requires DTO transformation
- ⚠️ Query complexity higher than basic findAll()
- ⚠️ Not cached by default (can add later if needed)
- ⚠️ No pagination (not required for this story)

### Risks

- **Risk 1**: Large category lists may impact performance
  - **Mitigation**: Acceptable for demo; add pagination if categories exceed 100
- **Risk 2**: Raw result mapping may have edge cases
  - **Mitigation**: Write comprehensive tests for empty, single, and multiple results
- **Risk 3**: COUNT performance with many questions per category
  - **Mitigation**: Acceptable for demo; database optimizes COUNT operations

## Related

- **Stories**: 002-list-categories (category listing with counts)
- **Entities**: Category, Question (existing from bolt 002)
- **Previous ADRs**: None (first ADR for this bolt)

## Read When

**Agents should read this ADR when**:
- Implementing category count functionality
- Designing similar aggregate count queries
- Optimizing category listing performance

**Scenarios**:
- Adding question counts to category endpoints
- Creating dashboard statistics with category data
- Implementing similar count queries for other entities
