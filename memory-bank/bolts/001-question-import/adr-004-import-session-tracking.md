---
bolt: 001-question-import
created: 2026-02-19T17:20:00Z
status: accepted
---

# ADR-004: Use Dedicated Tables for Import Session Tracking

## Context

Question imports are potentially large operations (up to 1000 questions). Users need visibility into import progress, success/error counts, and detailed error information for failed rows. Import operations may fail partially, requiring tracking of what succeeded and what didn't.

**Forces at play**:
- Need to track import progress and results
- Error details must be accessible for debugging
- Import session may be queried after completion
- Storage is not constrained (demo project)
- Frontend needs to poll for status

## Decision

Create **dedicated database tables** for import session tracking: `import_sessions` and `import_errors`.

**Schema**:
```sql
CREATE TABLE import_sessions (
  id VARCHAR(36) PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(10) NOT NULL,
  status VARCHAR(20) NOT NULL,  -- PROGRESSING, COMPLETED, FAILED
  total_rows INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  created_at DATETIME NOT NULL
);

CREATE TABLE import_errors (
  id VARCHAR(36) PRIMARY KEY,
  session_id VARCHAR(36) NOT NULL,
  row_number INTEGER NOT NULL,
  error_type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME NOT NULL,
  FOREIGN KEY (session_id) REFERENCES import_sessions(id) ON DELETE CASCADE
);
```

**API**: `GET /api/import/sessions/:id` returns session details with errors

## Rationale

Dedicated tables are appropriate because:

1. **Detailed tracking**: Complete error information for each failed row
2. **Audit history**: Import operations can be reviewed later
3. **Frontend polling**: Session status can be queried independently
4. **Structured queries**: Easy to filter by session, date, status
5. **Demo project**: Storage cost is negligible

### Alternatives Considered

| Alternative | Pros | Cons | Why Rejected |
|-------------|------|------|--------------|
| Dedicated tables | Detailed history, queryable, audit trail | Extra schema, storage growth | Accepted - best UX |
| Response only | Simple, no storage | No history, can't query later | Users need history |
| In-memory tracking | Fast, no storage | Lost on restart, no audit | Persistence needed |
| Logs only | Simple debugging | Not queryable, not structured | API needs structured data |

## Consequences

### Positive

- Users can review import history and errors
- Frontend can poll for status during import
- Detailed error messages help fix file issues
- Import operations can be audited
- Structured data for analytics

### Negative

- Extra database schema to maintain
- Storage grows with each import
- Need cleanup policy for old sessions
- More complex import service

### Risks

- **Risk**: Table grows indefinitely with import history
  - **Mitigation**: Add scheduled cleanup of sessions older than 90 days
- **Risk**: Import errors table grows very large with bad files
  - **Mitigation**: Limit errors stored per session (e.g., first 100 errors)
- **Risk**: Session lookup becomes slow with many records
  - **Mitigation**: Add index on created_at, delete old records

## Related

- **Stories**: 002-store-import-results
- **Standards**: Should add to data-stack.md
- **Previous ADRs**: ADR-001, ADR-002, ADR-003
