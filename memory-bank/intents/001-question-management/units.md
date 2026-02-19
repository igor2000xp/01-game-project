# Units: 001-question-management

## Dependency Graph

```
001-question-import ──► 002-question-crud ──► 004-question-export
                       │
                       └─► 003-category-service
                               │
001-question-management-ui ◄─┴───────┴───►
```

## Units

| Unit | Purpose | Dependencies | Stories | Priority |
|------|---------|-------------|---------|----------|
| 001-question-import | Parse and import CSV/JSON files | None | 2 | Must |
| 002-question-crud | Core CRUD operations for questions | None | 5 | Must |
| 003-category-service | Category management | 002-question-crud | 3 | Should |
| 004-question-export | Export to CSV/JSON formats | 002-question-crud | 2 | Should |
| 001-question-management-ui | Frontend application | All backend units | 8 | Must |

## Unit Details

### 001-question-import
- **Type**: Backend (DDD)
- **Brief**: `units/001-question-import/unit-brief.md`
- **Bolt Type**: ddd-construction-bolt
- **Stories**: 2

### 002-question-crud
- **Type**: Backend (DDD)
- **Brief**: `units/002-question-crud/unit-brief.md`
- **Bolt Type**: ddd-construction-bolt
- **Stories**: 5

### 003-category-service
- **Type**: Backend (DDD)
- **Brief**: `units/003-category-service/unit-brief.md`
- **Bolt Type**: ddd-construction-bolt
- **Stories**: 3

### 004-question-export
- **Type**: Backend (DDD)
- **Brief**: `units/004-question-export/unit-brief.md`
- **Bolt Type**: ddd-construction-bolt
- **Stories**: 2

### 001-question-management-ui
- **Type**: Frontend
- **Brief**: `units/001-question-management-ui/unit-brief.md`
- **Bolt Type**: simple-construction-bolt
- **Stories**: 8

## Independence Verification

| Unit | Separate Team? | Clear API? | No Cascade? | Deployable Alone? |
|------|------------------|-----------|-------------|-----------------|
| 001-question-import | Yes | Yes | Yes | Yes |
| 002-question-crud | Yes | Yes | Yes | Yes |
| 003-category-service | Yes | Yes | Yes | Yes |
| 004-question-export | Yes | Yes | Yes | Yes |
| 001-question-management-ui | Yes | Yes | Yes | Yes |

## Next Steps

1. Create User Stories for each unit
2. Plan Construction Bolts
3. Complete Inception Review
