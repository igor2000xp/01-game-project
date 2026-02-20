---
bolt: 002-question-crud
created: 2026-02-19T19:15:00Z
status: accepted
---

# ADR-001: Use FTS5 for Full-Text Search on Questions

## Context

The Question CRUD bolt requires text search functionality for question_text and reference_answer fields to support:
- Search by question text
- Search by reference answer
- Efficient filtering and sorting
- Pagination for large datasets

Current database schema uses SQLite with TypeORM. Standard SQL LIKE queries work but have performance limitations:
- Full table scans are O(n) for large tables
- Leading wildcards (%) at start of LIKE pattern disable index usage
- Case-insensitive comparisons require full table scans

For a demo application with 10,000+ questions, text search performance becomes important. Better solutions exist for SQLite full-text search.

## Decision

**Use SQLite FTS5 extension** for full-text search on question_text and reference_answer fields.

### Virtual Table

```sql
CREATE VIRTUAL TABLE vs_fts_questions USING fts5(
  question_text,
  reference_answer
);

-- Insert trigger: after INSERT or UPDATE on questions table
CREATE TRIGGER AFTER INSERT ON questions BEGIN
  INSERT INTO vs_fts_questions (rowid, question_text, reference_answer)
  SELECT new.rowid, question_text, reference_answer FROM inserted;

-- Maintain sync between main and virtual tables
CREATE TRIGGER AFTER UPDATE ON questions BEGIN
  UPDATE questions SET is_deleted = 1 WHERE id = OLD.id;
  DELETE FROM vs_fts_questions WHERE rowid = OLD.id;
```

**Indexes**: Automatic FTS5 index created on question_text and reference_answer

## Rationale

### Why FTS5?

1. **Performance**: FTS5 provides fast full-text search (BM25 algorithm) specifically designed for SQLite
2. **Relevance**: Full-text search on Q&A fields is a core feature for the demo
3. **SQLite native**: FTS5 is compiled into SQLite as a loadable extension - no external dependencies
4. **Scalability**: Designed for production use, handles large datasets efficiently
5. **Maturity**: Widely adopted and tested in SQLite projects

### Why not standard LIKE queries?

| Issue | Standard Approach | FTS5 Approach |
|--------|----------------|----------------|
| Performance | O(n) full table scans | Fast virtual table scans |
| Index usage | No (requires full scan) | Automatic indexes created |
| Query flexibility | Limited patterns | Flexible FTS5 queries |
| Learning curve | None | Some learning (FTS5 administration) |
| Dependencies | Standard library only | Adds FTS5 extension |

### Trade-offs

| Aspect | FTS5 | LIKE queries |
|--------|------|-------|
| Performance | ✅ Better | Slower for very small datasets |
| Complexity | ⚠️ Higher | New extension, indexing considerations |
| Dependencies | ❌ Extra | Standard library only | ✅ None |
| Setup | 🟡 More complex | Load extension, configure triggers | ⚠️ Manual index creation |
| Maintenance | ✅ Lower | Vendor-supported | ⚠️ Manual trigger sync |
| Query flexibility | ✅ Better | Advanced FTS5 query syntax | Simpler LIKE |

**Decision**: For the demo application scope, standard LIKE queries are adequate. FTS5's benefits don't justify the added complexity for this use case.

## Consequences

### Positive

- ✅ Fast full-text search for question_text and reference_answer
- ✅ Efficient pagination and filtering
- ✅ Better search performance on large datasets (10,000+ questions)
- ✅ Automatic index updates (triggers maintain sync)
- ✅ Production-grade full-text search solution
- ✅ Query flexibility (advanced FTS5 syntax, relevance ranking, filters)
- ✅ Proven scalability pattern for SQLite text search

### Negative

- ⚠️ Added dependency and complexity (FTS5 extension)
- ⚠️ Requires extension loading and configuration
- ⚠️ Manual index creation and maintenance
- ⚠️ Learning curve for FTS5 administration
- ⚠️ More complex queries for developers (MATCH, NEAR, BM25)
- ⚠️ Increased deployment complexity (extension files, triggers, vacuum)
- ⚠️ Vendor lock-in with FTS5

### Risks

- **Risk 1**: Extension compatibility issues - FTS5 may not work across all SQLite versions or platforms
  - **Mitigation**: Test FTS5 with target SQLite version, have fallback to LIKE queries
- **Risk 2**: Index maintenance overhead - Virtual tables need to be rebuilt/updated
  - **Mitigation**: Document rebuild process, schedule regular vacuum, monitor size
- **Risk 3**: Trigger complexity - Database triggers must be carefully tested
  - **Mitigation**: Create test suite for INSERT/UPDATE triggers, test in staging environment

## Related

- **Stories**: 001-create-question, 002-list-questions (search functionality)
- **Standards**: tech-stack.md (SQLite, TypeORM)
- **Previous ADRs**: ADR-003 (Soft Delete Pattern from bolt 001-question-import)

## Read When

**Agents should read this ADR when**:
- Implementing text search functionality
- Designing search API queries and filters
- Setting up database extensions (if FTS5 not used by default)
- Managing virtual table synchronization

**Scenarios**:
- Working on search performance optimization for questions module
- Adding full-text search features
- Evaluating database query patterns for large datasets
- Designing category search functionality
