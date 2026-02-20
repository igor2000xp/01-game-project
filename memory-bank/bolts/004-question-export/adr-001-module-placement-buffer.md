---
bolt: 004-question-export
created: 2026-02-19T20:40:00Z
status: accepted
---

# ADR-001: Module Placement and Buffer vs. Streaming for Question Export

## Context

The Question Export bolt requires generating CSV/JSON exports of question data from the database and serving them for download. Key technical decisions needed:

1. Where to place export functionality in the module structure
2. Whether to stream responses to client or buffer in memory
3. How to handle CSV serialization (format, encoding, escaping)

## Decision

**1. Add export endpoints to existing QuestionCrudModule**

Place export functionality within the existing `QuestionCrudModule` rather than creating a separate export module.

**2. Use Buffer approach for exports**

Generate entire export content in memory before sending to client, rather than streaming.

## Rationale

### Why add to QuestionCrudModule?

| Aspect | Enhancement Approach | Separate Module |
|---------|------------------|-----------------|
| Module count | No increase (1 total) | Increase to 2 (split concerns) |
| Repository access | Direct access | Extra layer/communication |
| Cohesion | High (questions + exports) | Low (split concerns) |
| Test setup | Simpler | More test modules |

### Why Buffer over Streaming?

| Factor | Buffer | Streaming |
|---------|--------|-----------|
| Complexity | Low (simple) | High (stream handling, backpressure) |
| Demo scale | Suitable (<10K records) | Overkill |
| Memory | Acceptable (<10MB) | Lower (streams use more) |
| Implementation | Fast (one call) | Slower (chunk management) |
| HTTP response | Simple (Content-Length) | Complex (Transfer-Encoding) |

### Trade-offs

| Aspect | Buffer | Streaming |
|---------|--------|-----------|
| Performance | ✅ Faster | ❌ Slower |
| Scalability | ❌ Limited | ✅ Better |
| Simplicity | ✅ Simpler | ❌ More complex |
| Memory | ⚠️ Higher | ✅ Lower |

**Decision**: For demo application scope, simplicity and speed outweigh scalability benefits. Buffer approach is adequate for datasets under 10,000 records.

---

## CSV Serialization Details

### Format Rules

1. **Header Row**: Field names
2. **Data Rows**: One question per line
3. **Encoding**: UTF-8 with BOM (byte order mark)
4. **Line Ending**: CRLF (`\r\n`) for Windows compatibility
5. **Field Separator**: Comma (`,`)
6. **Quoting**: Double quotes (`"`) around all fields
7. **Escaping**: Double quotes within fields doubled (`""`)
8. **Date Format**: ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`)

### Example Output

```csv
id,question_text,reference_answer,category_id,created_at,updated_at
"uuid-1","Question 1","Answer 1","cat-1","2026-02-19T00:00:00.000Z","2026-02-19T00:00:00.000Z"
"uuid-2","Question 2, with ""quotes""","Answer 2, with quotes","2026-02-19T00:00:00.000Z","2026-02-19T00:00:00.000Z"
```

### Null Handling

- `null` → empty string in CSV
- `undefined` → omitted from output (JSON only)

---

## JSON Serialization Details

### Format Rules

1. **Structure**: Array of objects
2. **Encoding**: UTF-8
3. **Indentation**: 2 spaces
4. **Date Format**: ISO 8601

### Example Output

```json
[
  {
    "id": "uuid-1",
    "question_text": "Question 1",
    "reference_answer": "Answer 1",
    "category_id": "cat-1",
    "created_at": "2026-02-19T00:00:00.000Z",
    "updated_at": "2026-02-19T00:00:00.000Z"
  },
  {
    "id": "uuid-2",
    "question_text": "Question 2",
    "reference_answer": "Answer 2",
    "category_id": null,
    "created_at": "2026-02-19T00:01:00.000Z",
    "updated_at": "2026-02-19T00:01:00.000Z"
  }
]
```

---

## Filename Pattern

**Template**: `questions_{YYYY-MM-DD_HH-mm-ss}.{extension}`

**Examples**:
- `questions_2026-02-19_20-35-00.csv`
- `questions_2026-02-19_20-35-00.json`

**Implementation**:
```typescript
const now = new Date();
const timestamp = now
  .toISOString()
  .replace(/[:.]/g, '-')      // Replace colons with dashes
  .replace(/\.\d{3}Z/, '')   // Remove milliseconds and Z
  .replace('T', '_');         // Replace T with underscore

const extension = format === 'csv' ? 'csv' : 'json';
const filename = `questions_${timestamp}.${extension}`;
```

---

## Related

- **Stories**: 001-export-csv, 002-export-json
- **Dependencies**: 002-question-crud (Question entity, repository)
- **Standards**: RFC 4180 (CSV), RFC 8259 (JSON)

## Read When

**Agents should read this ADR when**:
- Implementing export functionality
- Designing CSV/JSON serialization
- Setting response headers for file downloads
- Choosing module placement for new features

**Scenarios**:
- Adding export endpoints to QuestionCrudModule
- Implementing CSV generation with special character handling
- Creating download endpoints with proper Content-Type headers
