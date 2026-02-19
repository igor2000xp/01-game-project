---
last_updated: 2026-02-19T19:15:00Z
total_decisions: 6
---

# Decision Index

This index tracks all Architecture Decision Records (ADRs) created during Construction bolts.
Use this to find relevant prior decisions when working on related features.

## How to Use

**For Agents**: Scan to "Read when" fields below to identify decisions relevant to your current task. Before implementing new features, check if existing ADRs constrain or guide your approach. Load to full ADR for matching entries.

**For Humans**: Browse decisions chronologically or search for keywords. Each entry links to the full ADR with complete context, alternatives considered, and consequences.

---

## Decisions

### ADR-001: Use Simple Module Structure over DDD Layering
- **Status**: accepted
- **Date**: 2026-02-19
- **Bolt**: 001-question-import (001-question-import)
- **Path**: `bolts/001-question-import/adr-001-simple-module-structure.md`
- **Summary**: The Question Import technical design initially proposed a 4-layer DDD structure. Use simple module structure as defined in ARCHITECTURE.md, NOT the 4-layer DDD approach.
- **Read when**: Working on module structure, defining new feature modules, deciding between DDD and simple patterns, reviewing architecture adherence
