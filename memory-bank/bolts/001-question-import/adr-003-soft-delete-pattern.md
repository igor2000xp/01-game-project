---
bolt: 001-question-import
created: 2026-02-19T17:20:00Z
status: accepted
---

# ADR-003: Use Soft Delete Pattern for Questions

## Context

Questions may need to be removed from the system without permanently deleting them. This could be for audit purposes, recovery from accidental deletion, or maintaining evaluation history. The question entity is referenced by evaluations and may have historical value even after "deletion."

**Forces at play**:
- Evaluations reference questions; deleting a question breaks history
- Admins may accidentally delete questions that should be recoverable
- Audit trails require maintaining deleted records
- Storage space is not a constraint (demo project)
- Queries must filter out deleted records

## Decision

Use **soft delete pattern** with an `is_deleted` boolean flag on the question entity. Deleted questions remain in the database but are filtered from queries.

**Implementation**:
```typescript
// Entity with soft delete
@Entity('questions')
export class Question {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'text' })
  question_text: string;

  @Column({ type: 'text' })
  reference_answer: string;

  @Column({ name: 'is_deleted', default: false })
  is_deleted: boolean;

  @DeleteDateColumn()
  deleted_at: Date | null;
}

// Repository query filters
@Injectable()
export class QuestionRepository {
  async findAll(filters: QueryParams) {
    return this.find({ where: { is_deleted: false } });
  }
}
```

## Rationale

Soft delete is appropriate for this project because:

1. **Audit trail**: Evaluations can still reference historical questions
2. **Recovery**: Accidental deletions can be restored
3. **Data integrity**: Prevents cascading deletes breaking history
4. **Demo project**: Storage is not a constraint
5. **Industry standard**: Common practice for content systems

### Alternatives Considered

| Alternative | Pros | Cons | Why Rejected |
|-------------|------|------|--------------|
| Soft delete with flag | Data preserved, recoverable | Queries need filtering, storage grows | Accepted - fits use case |
| Hard delete + CASCADE | Simple, clean data | Lost forever, breaks history | Evaluations need history |
| Archive table | Cleaner main table, separate archive | Complex to maintain | Overkill for demo |
| Hard delete only restore period | Keeps data simple, time-boxed | Complex implementation | Too complex for now |

## Consequences

### Positive

- Deleted questions remain in evaluation history
- Accidental deletions are recoverable
- Audit trail is maintained
- Data integrity preserved

### Negative

- Queries must always include `is_deleted: false` filter
- Storage grows over time (not a concern for demo)
- Potential for large table with many deleted records
- Need cleanup mechanism or archive strategy

### Risks

- **Risk**: Developers forget to filter `is_deleted` in queries
  - **Mitigation**: Add default scope in repository, use query builder
- **Risk**: Table grows indefinitely
  - **Mitigation**: Add periodic cleanup job or archive old deleted records
- **Risk**: Duplicate questions after delete if uniqueness check ignores soft-deleted records
  - **Mitigation**: Include `is_deleted` in unique constraint or check explicitly

## Related

- **Stories**: 002-store-import-results
- **Standards**: Should add to coding-standards.md
- **Previous ADRs**: ADR-001, ADR-002
