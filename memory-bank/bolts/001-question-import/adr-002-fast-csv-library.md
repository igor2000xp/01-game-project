---
bolt: 001-question-import
created: 2026-02-19T17:20:00Z
status: accepted
---

# ADR-002: Use fast-csv for CSV Parsing

## Context

The Question Import feature needs to parse CSV files containing question-answer pairs. We need a CSV parsing library that balances performance, memory efficiency, and bundle size. The file size limit is 10MB with up to 1000 questions per batch.

**Forces at play**:
- Need streaming support to avoid loading entire file in memory
- Performance requirement: 1000 questions in < 5 seconds
- Bundle size considerations for frontend (if client-side parsing later)
- Need TypeScript support and active maintenance
- Learning project: libraries should be widely used and well-documented

## Decision

Use **fast-csv** library for CSV parsing in the backend import service.

**Implementation**:
```typescript
import { parse } from 'fast-csv';

// Streaming parser for memory efficiency
const records: ParsedRecord[] = [];
await fileStream.pipe(parse({ headers: true }))
  .on('data', (row) => records.push(row))
  .on('end', () => resolve(records));
```

## Rationale

fast-csv provides the best balance for this project:

1. **Streaming support**: Handles large files without memory issues
2. **TypeScript types**: First-class TS support
3. **Performance**: Optimized for speed, meets 5-second requirement
4. **Widely used**: ~5M weekly downloads on npm
5. **Simple API**: Easy to understand for learning purposes

### Alternatives Considered

| Alternative | Pros | Cons | Why Rejected |
|-------------|------|------|--------------|
| fast-csv | Streaming, fast, simple | Extra dependency | Accepted - best balance |
| Papa Parse | Browser support, robust | Larger bundle, node-specific features less tested | Backend-only needs |
| csv-parse | Streaming, modular | More verbose API | fast-csv simpler |
| Built-in Node.js | No dependencies | Complex, error-prone | Too much custom code |

## Consequences

### Positive

- Memory efficient with streaming for 10MB files
- Fast parsing meets performance requirements
- Simple API reduces cognitive load
- Active project with good documentation

### Negative

- Adds ~50KB to node_modules bundle
- One more dependency to maintain
- Not browser-ready if we add client-side parsing later

### Risks

- **Risk**: fast-csv becomes unmaintained
  - **Mitigation**: Monitor npm trends, switch to csv-parse if needed
- **Risk**: Edge cases in CSV formatting
  - **Mitigation**: Add validation and error handling around parsing

## Related

- **Stories**: 001-parse-validate-files
- **Standards**: Should add to tech-stack.md when finalized
- **Previous ADRs**: ADR-001
