---
bolt: 001-question-import
created: 2026-02-19T17:20:00Z
status: accepted
---

# ADR-005: Use 100-Row Batch Size for Database Inserts

## Context

Question import operations may process up to 1000 records per batch. Inserting records one-by-one is too slow, but inserting all at once risks memory issues and transaction timeouts. We need a batch size that balances performance, memory usage, and transaction scope.

**Forces at play**:
- Performance requirement: 1000 questions in < 5 seconds
- Memory constraint: Must stay within demo project limits
- Transaction scope: Too many rows per transaction risks locks/timeout
- SQLite performance: Database is not optimized for large transactions
- Error handling: Smaller batches limit rollback scope

## Decision

Use **100-row batch size** for database inserts during import.

**Implementation**:
```typescript
async storeQuestions(questions: Question[]): Promise<void> {
  const BATCH_SIZE = 100;
  for (let i = 0; i < questions.length; i += BATCH_SIZE) {
    const batch = questions.slice(i, i + BATCH_SIZE);
    await this.repository.insert(batch);
    // Update session progress after each batch
    await this.updateProgress(i + batch.length);
  }
}
```

## Rationale

100-row batch size provides optimal balance:

1. **Performance**: 10 batches for 1000 rows, meets 5-second target
2. **Memory**: Small batches fit easily in memory
3. **Transaction scope**: Short transactions reduce lock contention
4. **Progress tracking**: Updates after each batch provide feedback
5. **Error isolation**: Failed batch doesn't invalidate previous batches
6. **SQLite-friendly**: Smaller transactions work better with SQLite

### Alternatives Considered

| Alternative | Pros | Cons | Why Rejected |
|-------------|------|------|--------------|
| 100 rows | Balanced performance/memory, good progress feedback | More API calls than larger batches | Accepted - optimal balance |
| Single large insert | Fastest, 1 transaction | Memory risk, long lock, rollback all-or-nothing | Too risky for SQLite |
| 10 rows | Best error isolation, lowest memory | Slower, 100 batches for 1000 rows | Performance suffers |
| 1000 rows | Fewest API calls | Memory pressure, long transaction | SQLite may timeout |
| Streaming inserts | Lowest memory | Complex, hard to rollback | Overkill for 1000 rows |

## Consequences

### Positive

- Meets 5-second performance target
- Memory usage stays within limits
- Transactions complete quickly
- Progress updates every ~10% of import
- Failed batch doesn't lose previous work

### Negative

- More database round-trips than single insert
- Still 10 calls for 1000 records
- Error handling must handle partial success

### Risks

- **Risk**: Batch size may not be optimal for all data volumes
  - **Mitigation**: Make batch size configurable, tune based on metrics
- **Risk**: SQLite performance varies with database size
  - **Mitigation**: Test with full dataset, adjust if needed
- **Risk**: Network latency adds overhead for 10 batches
  - **Mitigation**: Negligible for localhost SQLite

## Related

- **Stories**: 002-store-import-results
- **Standards**: Should add to performance section of tech-stack.md
- **Previous ADRs**: ADR-001, ADR-002, ADR-003, ADR-004
