---
id: 002-question-crud
unit: 002-question-crud
intent: 001-question-management
type: ddd-construction-bolt
status: planned
created: 2026-02-19T15:31:17Z
---

# Bolt: 002-question-crud

## Objective

Implement core CRUD operations for questions including domain entities, service layer, and API endpoints with category support and filtering.

## Stories Included

- [ ] 001-create-question: Create new question - Priority: Must
- [ ] 002-list-questions: List questions with pagination - Priority: Must
- [ ] 003-update-question: Update existing question - Priority: Should
- [ ] 004-delete-question: Delete single question - Priority: Should
- [ ] 005-bulk-delete: Bulk delete questions by category - Priority: Could

## Expected Outputs

- Question domain entities (Question, QuestionFilter)
- Question repository with TypeORM
- Question service with business logic
- Question controller with API endpoints

## Dependencies

### Requires Bolts
None (independent bolt)

### Enables Bolts
- 004-question-export (questions can be exported)
- 003-category-service (questions reference categories)

## Complexity Assessment

| Factor | Score |
|---------|--------|
| Complexity | Medium (2) |
| Uncertainty | Low (1) |
| Dependencies | 1 (003-category-service) |
| Testing | Unit + Integration (2) |

---

## Notes

Ensure category is optional in question entity. Consider adding soft delete with is_deleted flag instead of hard delete for better data integrity.
