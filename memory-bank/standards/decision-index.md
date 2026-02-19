---
last_updated: 2026-02-19T17:20:00Z
total_decisions: 5
---

# Decision Index

This index tracks all Architecture Decision Records (ADRs) created during Construction bolts.
Use this to find relevant prior decisions when working on related features.

## How to Use

**For Agents**: Scan the "Read when" fields below to identify decisions relevant to your current task. Before implementing new features, check if existing ADRs constrain or guide your approach. Load the full ADR for matching entries.

**For Humans**: Browse decisions chronologically or search for keywords. Each entry links to the full ADR with complete context, alternatives considered, and consequences.

---

## Decisions

### ADR-001: Use Simple Module Structure over DDD Layering
- **Status**: accepted
- **Date**: 2026-02-19
- **Bolt**: 001-question-import (001-question-import)
- **Path**: `bolts/001-question-import/adr-001-simple-module-structure.md`
- **Summary**: The Question Import technical design initially proposed a 4-layer DDD structure. Use the simple module structure as defined in ARCHITECTURE.md, NOT the 4-layer DDD approach.
- **Read when**: Working on module structure, defining new feature modules, deciding between DDD and simple patterns, reviewing architecture adherence

### ADR-002: Use fast-csv for CSV Parsing
- **Status**: accepted
- **Date**: 2026-02-19
- **Bolt**: 001-question-import (001-question-import)
- **Path**: `bolts/001-question-import/adr-002-fast-csv-library.md`
- **Summary**: The Question Import feature needs to parse CSV files containing question-answer pairs. Use fast-csv library for CSV parsing in the backend import service.
- **Read when**: Implementing CSV parsing, selecting CSV libraries, handling file uploads, working with streaming parsers

### ADR-003: Use Soft Delete Pattern for Questions
- **Status**: accepted
- **Date**: 2026-02-19
- **Bolt**: 001-question-import (001-question-import)
- **Path**: `bolts/001-question-import/adr-003-soft-delete-pattern.md`
- **Summary**: Questions may need to be removed from the system without permanently deleting them. Use soft delete pattern with an `is_deleted` boolean flag on the question entity.
- **Read when**: Implementing delete operations, designing database schema for entities, working on audit trails, handling data recovery

### ADR-004: Use Dedicated Tables for Import Session Tracking
- **Status**: accepted
- **Date**: 2026-02-19
- **Bolt**: 001-question-import (001-question-import)
- **Path**: `bolts/001-question-import/adr-004-import-session-tracking.md`
- **Summary**: Question imports are potentially large operations (up to 1000 questions). Create dedicated database tables for import session tracking: `import_sessions` and `import_errors`.
- **Read when**: Designing import/session tracking, creating audit history, implementing progress tracking for long operations

### ADR-005: Use 100-Row Batch Size for Database Inserts
- **Status**: accepted
- **Date**: 2026-02-19
- **Bolt**: 001-question-import (001-question-import)
- **Path**: `bolts/001-question-import/adr-005-batch-insert-size.md`
- **Summary**: Question import operations may process up to 1000 records per batch. Use 100-row batch size for database inserts during import.
- **Read when**: Implementing bulk data operations, optimizing database performance, designing batch processing, working with SQLite performance
