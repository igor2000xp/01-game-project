---
id: 002-question-crud
unit: 002-question-crud
intent: 001-question-management
type: ddd-construction-bolt
status: in-progress
started: 2026-02-19T19:10:00Z
created: 2026-02-19T15:19:25Z
current_stage: implement
stages_completed:
  - name: domain-model
    completed: 2026-02-19T19:10:00Z
    artifact: ddd-01-domain-model.md
  - name: technical-design
    completed: 2026-02-19T15:00Z
    artifact: ddd-02-technical-design.md
  - name: adr-analysis
    completed: 2026-02-19T15:00Z
    artifacts:
      - adr-001-fulltext-search-fs5.md
---

# Bolt: 002-question-crud

## Objective

Implement core CRUD operations for questions including domain entities, service layer, and API endpoints with category support and filtering.

## Stories Included

- [x] 001-create-question: Create new question - Priority: Must
- [x] 002-list-questions: List questions with pagination - Priority: Must
- [x] 003-update-question: Update existing question - Priority: Should
- [x] 004-delete-question: Delete single question - Priority: Should
- [x] 005-bulk-delete: Bulk delete questions by category - Priority: Could

## Expected Outputs

- Question domain entities (Question, Category, QuestionFilter)
- Question repository with TypeORM
- Question service with business logic
- Question controller with API endpoints

## Dependencies

### Requires Bolts

None (independent bolt)

### Enables Bolts

- 001-question-management-ui (Frontend uses CRUD endpoints)
- 003-category-service (Questions reference categories)
- 004-question-export (Questions can be exported)

## Complexity Assessment

| Factor | Score |
|---------|--------|
| Complexity | Medium (2) |
| Uncertainty | Low (1) |
| Dependencies | None (0) |
| Testing | Unit + Integration (2) |

---

## Notes

Category relationship should be optional (questions can exist without categories). Use soft delete for questions to preserve data integrity with evaluation references.

Use pagination for list questions to handle large datasets efficiently.

Implement category service (003-category-service) separately to handle category CRUD operations.
