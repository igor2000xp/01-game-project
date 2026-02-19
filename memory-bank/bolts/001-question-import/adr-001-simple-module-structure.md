---
bolt: 001-question-import
created: 2026-02-19T17:20:00Z
status: accepted
---

# ADR-001: Use Simple Module Structure over DDD Layering

## Context

The Question Import technical design initially proposed a 4-layer DDD structure (Presentation, Application, Domain, Infrastructure). However, the project's ARCHITECTURE.md defines a simpler module structure aligned with Nest.js conventions (entities, dto, services, controllers within each feature module). The project is a demo application for learning purposes, not a complex enterprise domain requiring DDD rigor.

**Forces at play**:
- DDD layering provides clean separation but adds complexity
- Simple structure aligns with Nest.js patterns and reduces boilerplate
- Project is educational/demo in nature, not production-scale
- Future maintainability vs. current simplicity

## Decision

Use the **simple module structure** as defined in ARCHITECTURE.md, NOT the 4-layer DDD approach. Each feature module will contain entities, dto, services, and controllers directly, without explicit domain/infrastructure separation.

**Module structure**:
```
src/modules/question-import/
├── entities/
│   ├── question.entity.ts
│   ├── import-session.entity.ts
│   └── import-error.entity.ts
├── dto/
│   ├── import-file.dto.ts
│   └── import-result.dto.ts
├── services/
│   ├── import.service.ts
│   ├── csv-parser.service.ts
│   └── import-validator.service.ts
└── controllers/
    └── import.controller.ts
```

## Rationale

The simple module structure is more appropriate for this project because:

1. **Alignment with Nest.js**: Nest.js modules naturally organize code this way
2. **Learning project**: Complexity should not hinder understanding
3. **No complex domain**: Question import is straightforward CRUD-like logic
4. **Reduced boilerplate**: Fewer files, less ceremony
5. **Consistency**: Matches existing project architecture

### Alternatives Considered

| Alternative | Pros | Cons | Why Rejected |
|-------------|------|------|--------------|
| 4-layer DDD structure | Strict separation, testable | Too complex for demo, boilerplate-heavy | Project is educational, DDD overkill |
| Clean Architecture | Clear dependency direction | Many files, confusing for beginners | Complexity not justified |
| Simple module structure | Matches Nest.js, easy to understand | Less strict separation | Accepted - best fit |

## Consequences

### Positive

- Code structure aligns with Nest.js patterns and community examples
- Lower cognitive load for developers working on the project
- Fewer files to create and maintain
- Consistent with existing project architecture
- Easier to onboard new contributors

### Negative

- Less strict separation between data access and business logic
- Harder to test isolated domain logic
- Potentially more coupling over time
- Not "pure" by DDD standards

### Risks

- **Risk**: Services may grow fat with mixed concerns
  - **Mitigation**: Use descriptive methods, extract helper functions when needed
- **Risk**: Testing may require mocking database layer
  - **Mitigation**: Use TypeORM query builder in tests or test database

## Related

- **Stories**: 001-parse-validate-files, 002-store-import-results
- **Standards**: ARCHITECTURE.md - Module Structure
- **Previous ADRs**: None
