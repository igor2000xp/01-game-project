---
unit: 003-category-service
intent: 001-question-management
phase: inception
status: draft
created: 2026-02-19T15:19:25Z
updated: 2026-02-19T15:19:25Z
---

# Unit Brief: Category Service

## Purpose

Manage question categories for organization and grouping. Provide CRUD operations for categories with referential integrity ensuring questions always reference valid categories.

## Scope

### In Scope
- Create new categories with name and optional description
- List all categories with question count
- Update category name and description
- Delete categories (cascade delete to questions or unassign)
- Category name uniqueness validation
- Category-question relationship management

### Out of Scope
- Category hierarchy/nesting (flat structure only)
- Category permissions/roles (admin-only assumed)
- Category color/icon customization

## Assigned Requirements

| FR | Requirement | Priority |
|----|-------------|----------|
| FR-6 | Category Management | Should |

## Domain Concepts

### Key Entities

| Entity | Description | Attributes |
|--------|-------------|------------|
| Category | Category entity | id, name, description, created_at, updated_at, question_count |

### Key Operations

| Operation | Description | Inputs | Outputs |
|-----------|-------------|---------|----------|
| Create Category | Insert new category with validation | Category entity with ID |
| List Categories | Fetch all with question counts | Category list with counts |
| Get Category | Fetch single category by ID | Category entity |
| Update Category | Modify category name/description | Updated Category entity |
| Delete Category | Delete with option to cascade or unassign | Success confirmation |
| Validate Name | Check category name uniqueness | Validation result |

---

## Story Summary

| Metric | Count |
|--------|-------|
| Total Stories | 3 |
| Must Have | 2 |
| Should Have | 1 |
| Could Have | 0 |

### Stories

| Story ID | Title | Priority | Status |
|----------|-------|----------|--------|
| 001-create-category | Create new category | Must | Planned |
| 002-list-categories | List categories with question counts | Must | Planned |
| 003-manage-category | Update and delete categories | Should | Planned |

---

## Dependencies

### Depends On
None - Independent service unit.

### Depended By
| Unit | Reason |
|------|--------|
| 002-question-crud | Questions reference categories |
| 001-question-management-ui | UI uses category endpoints |

### External Dependencies

| System | Purpose | Risk |
|--------|---------|------|
| SQLite Database | Data storage and queries | Low |

## Technical Context

### Suggested Technology
- Backend: Nest.js (CategoryController, CategoryService)
- ORM: TypeORM (CategoryRepository)
- Validation: class-validator (DTOs)

### Integration Points

| Integration | Type | Protocol |
|------------|------|----------|
| 002-question-crud | API | REST (GET /api/categories for listing) |
| 001-question-management-ui (Frontend) | API | REST (POST, PUT, DELETE /api/categories) |
| SQLite Database | Data Access | TypeORM Entity Manager |

### Data Storage

| Data | Type | Volume | Retention |
|------|------|--------|-----------|
| Categories | SQL | 100+ records | Permanent |

---

## Constraints

- Category name minimum: 3 characters
- Category name maximum: 50 characters
- Category description maximum: 200 characters
- Category names must be unique
- Delete requires cascade or unassign choice

## Success Criteria

### Functional
- [ ] Categories can be created with name and description
- [ ] Categories can be listed with question counts
- [ ] Category names are validated for uniqueness
- [ ] Categories can be updated
- [ ] Categories can be deleted with cascade option
- [ ] Question-category relationships are maintained

### Non-Functional
- [ ] Category list response < 100ms (p95)
- [ ] CRUD operations < 100ms

## Quality

- [ ] Code coverage > 80%
- [ ] All acceptance criteria met
- [ ] Code reviewed and approved

---

## Bolt Suggestions

| Bolt | Type | Stories | Objective |
|------|------|---------|-----------|
| bolt-003-category-service-1 | DDD | S1, S2 | Category domain entity and repository |
| bolt-003-category-service-2 | DDD | S3, S4 | Category service layer |
| bolt-003-category-service-3 | DDD | S5, S6 | Category controller and API endpoints |

## Notes

Consider allowing questions to have a "no category" state for flexibility. Category deletion should have a default action (cascade delete is destructive).
