---
stage: plan
bolt: 001-question-management-ui
created: 2026-02-20T10:00:00Z
---

# Implementation Plan: Question Management UI

## Objective

Build a complete Angular frontend application for question management including file upload, import progress, question list with pagination, filtering, CRUD forms, category management, and export functionality.

## Deliverables

### Angular Application Structure
- Standalone Angular application with modular feature organization
- Feature modules for question management, categories, and import/export
- Shared components and utilities (buttons, forms, tables, modals)

### Components

**Import Feature**
- FileUploadComponent - Drag-and-drop file picker for CSV/JSON files
- ImportProgressComponent - Progress bar showing import status
- ImportStatusComponent - Success/error summary display

**Question Management Feature**
- QuestionListComponent - Paginated table of questions
- QuestionFilterComponent - Search box and category filter dropdown
- QuestionFormComponent - Create/edit form for questions
- QuestionDeleteDialogComponent - Confirmation dialog for delete
- QuestionBulkDeleteDialogComponent - Bulk delete by category

**Category Management Feature**
- CategoryListComponent - List of categories with question counts
- CategoryFormComponent - Create/edit category form
- CategoryDeleteDialogComponent - Category delete confirmation

**Export Feature**
- ExportButtonComponent - Dropdown with CSV/JSON format selection

### Services
- QuestionService - HTTP client for question CRUD operations
- CategoryService - HTTP client for category operations
- ImportService - HTTP client for file upload and import status
- ExportService - HTTP client for export requests with file download
- NotificationService - Toast/snackbar notifications for user feedback

### Models/Types
- Question model interface matching backend DTOs
- Category model interface matching backend DTOs
- Import status interface for progress tracking
- Export request/response types

### Routing
- Lazy-loaded feature routes
- Route guards for protected routes (if needed)
- Query parameter handling for filters and pagination

### Styling
- Responsive layout for desktop and tablet
- Consistent design tokens (colors, spacing, typography)
- Material Design or custom component library integration

## Dependencies

### Backend API Endpoints
All endpoints are assumed to be running on `http://localhost:3000/api` (configurable via environment variables):

- **Import**: POST `/questions/import` (multipart/form-data), GET `/questions/import/:sessionId/status`
- **Questions**: GET `/questions`, GET `/questions/:id`, POST `/questions`, PUT `/questions/:id`, DELETE `/questions/:id`, POST `/questions/bulk-delete`
- **Categories**: GET `/categories`, GET `/categories/with-counts`, GET `/categories/:id`, POST `/categories`, PUT `/categories/:id`, DELETE `/categories/:id`
- **Export**: POST `/questions/export` (returns file download)

### Required Backend Bolts (All Complete)
- 001-question-import: Import endpoints available
- 002-question-crud: CRUD endpoints available
- 003-category-service: Category endpoints available
- 004-question-export: Export endpoints available

### External Libraries
- Angular v20+ (standalone components)
- Angular Router (for navigation)
- Angular HttpClient (for API calls)
- RxJS (for async operations)
- Angular Signals (for reactive state)

### Optional Libraries (To be determined)
- Angular Material or similar component library for UI components
- Angular CDK for advanced interactions
- Form validation library (e.g., ng-recaptcha if needed)

## Technical Approach

### Component Architecture
- Use standalone components (Angular 14+)
- OnPush change detection strategy for performance
- Signals for reactive state management
- Input/Output pattern for component communication

### State Management
- Local component state with signals for simple scenarios
- Service-level state for shared data (categories, question lists)
- RxJS BehaviorSubject for async data streams

### Form Handling
- Reactive forms (FormControl, FormGroup, FormBuilder)
- Custom validators for business logic
- Async validators for unique field checks

### HTTP Communication
- Typed HttpClient with response interfaces
- Error handling with centralized interceptor
- Retry logic for failed requests
- File upload with progress tracking

### Routing
- Lazy-loaded feature modules for code splitting
- Route parameters for detail views
- Query parameters for filters and pagination
- Router Guards for route protection (if auth added)

### File Upload
- FormData API for multipart/form-data requests
- Progress event tracking from XHR
- File size validation (max 10MB)
- File type validation (CSV, JSON)

### Export
- Blob handling for file downloads
- Dynamic filename generation with timestamp
- Format selection via dropdown

### Error Handling
- Global HTTP error interceptor
- User-friendly error messages
- Toast notifications for success/error states
- Retry mechanism for transient failures

### Accessibility
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus management in modals
- Color contrast compliance (WCAG 2.1 AA)

### Testing Strategy
- Unit tests for services and components
- Integration tests for HTTP services
- Component tests with TestBed
- End-to-end tests for critical user flows

## Acceptance Criteria

### Import Functionality
- [ ] User can upload CSV or JSON files via drag-and-drop
- [ ] File upload shows progress indicator
- [ ] Import status is displayed with success/error counts
- [ ] File size validation prevents uploads > 10MB
- [ ] Invalid file formats are rejected with clear error message

### Question List
- [ ] Questions are displayed in a paginated table
- [ ] Default page size is configurable (e.g., 20 items)
- [ ] Pagination controls work (next, previous, page numbers)
- [ ] Each row shows question text, category, created date
- [ ] Empty state displays helpful message

### Filtering and Search
- [ ] Search box filters questions by text matching
- [ ] Category dropdown filters by selected category
- [ ] Filters work together (combined search + category)
- [ ] Filter state persists across page navigation
- [ ] Clear filters button resets all filters

### Question Forms
- [ ] Create form has all required fields (text, answer, category, type)
- [ ] Edit form pre-fills existing question data
- [ ] Form validation prevents submission with invalid data
- [ ] Success message displays after successful save
- [ ] Form resets after successful creation

### Question Delete
- [ ] Delete button shows confirmation dialog
- [ ] Bulk delete by category has confirmation
- [ ] Delete action removes question from list
- [ ] Error message displays if delete fails

### Category Management
- [ ] Category list shows category name and question count
- [ ] Create category form validates name uniqueness
- [ ] Edit category pre-fills existing data
- [ ] Delete category has confirmation dialog
- [ ] Question counts update in real-time

### Export
- [ ] Export button opens format selection dropdown
- [ ] CSV export downloads correctly formatted file
- [ ] JSON export downloads properly formatted JSON
- [ ] Export respects current filters (if applicable)
- [ ] Filename includes timestamp

### Responsive Design
- [ ] Layout works on desktop (1920px+)
- [ ] Layout works on tablet (768px - 1024px)
- [ ] Table scrolls horizontally on smaller screens
- [ ] Forms remain usable on tablet

### Performance
- [ ] Initial page load time < 2 seconds
- [ ] Navigation between routes is smooth
- [ ] Large question lists paginate efficiently
- [ ] File upload progress updates smoothly

### Code Quality
- [ ] Code follows Angular coding standards
- [ ] Prettier formatting applied
- [ ] ESLint rules pass
- [ ] TypeScript strict mode enabled
- [ ] Test coverage > 80%
