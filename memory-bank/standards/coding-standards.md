# Coding Standards

## Overview

TypeScript-first coding standards optimized for Nest.js backend and Angular frontend. Enforced automatically with Prettier and ESLint for consistency across AI-generated and human-written code.

## Code Formatting

**Tool**: Prettier

**Key Settings**:
- `printWidth`: 100
- `tabWidth`: 2
- `useTabs`: false
- `singleQuote`: true
- `trailingComma`: "es5"
- `semi`: true
- `arrowParens`: "always"

**Enforcement**: Pre-commit hook via husky + lint-staged

## Linting

**Tool**: ESLint

**Base Config**:
- Backend: `@typescript-eslint/recommended` + Nest.js preset
- Frontend: Angular ESLint preset

**Strictness**: Strict

**Key Rules**:
- `@typescript-eslint/no-explicit-any`: error - Use `unknown` instead
- `@typescript-eslint/no-unused-vars`: error
- `@typescript-eslint/explicit-function-return-type`: warn
- `@typescript-eslint/no-floating-promises`: error
- `@typescript-eslint/no-unsafe-assignment`: error
- `no-console`: warn (except in non-production files)

**TypeScript Compiler**:
- `strict: true` in tsconfig.json
- `noImplicitAny: true`
- `strictNullChecks: true`

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Variables | camelCase | `userName`, `isActive`, `questionText` |
| Functions | camelCase | `getUserById`, `evaluateAnswer`, `runAudit` |
| Classes | PascalCase | `UserService`, `EvaluationService`, `QuestionEntity` |
| Interfaces | PascalCase | `IQuestion`, `IEvaluation`, `IAuditReport` |
| Types | PascalCase | `UserId`, `EvaluationResult`, `ApiResponse<T>` |
| Constants | UPPER_SNAKE | `MAX_RETRIES`, `API_URL`, `DEFAULT_TIMEOUT` |
| Enums | PascalCase | `EvaluationStatus`, `ProviderType` |
| Angular Components | PascalCase | `UserProfile`, `QuestionDisplay`, `AuditInterface` |
| Angular Services | PascalCase with Service suffix | `QuestionService`, `EvaluationService` |
| Angular Pipes | PascalCase with Pipe suffix | `TruncatePipe`, `StatusPipe` |
| Nest.js Modules | PascalCase with Module suffix | `QuestionModule`, `EvaluationModule` |
| Nest.js Controllers | PascalCase with Controller suffix | `QuestionController`, `AuditController` |
| Nest.js Services | PascalCase with Service suffix | `EvaluationService`, `LlmService` |
| Nest.js Entities | PascalCase | `Question`, `Evaluation`, `AuditReport` |

**File Naming**:
- Components: PascalCase (`UserProfile.ts`)
- Services: PascalCase with Service suffix (`EvaluationService.ts`)
- Utilities: kebab-case (`date-utils.ts`, `string-helpers.ts`)
- Tests: Co-located with source file (`*.spec.ts`)
- Constants: kebab-case (`api.constants.ts`)

## File Organization

**Pattern**: Feature-based (Frontend) / Domain-driven (Backend)

**Backend Structure (Nest.js)**:
```text
src/
  modules/
    question/
      entities/
      dto/
      services/
      controllers/
      question.module.ts
    evaluation/
      entities/
      dto/
      services/
      controllers/
      evaluation.module.ts
    audit/
      entities/
      dto/
      services/
      controllers/
      audit.module.ts
    auth/
      strategies/
      guards/
      services/
      auth.module.ts
  common/
    decorators/
    filters/
    interceptors/
    pipes/
    dtos/
  config/
  database/
  main.ts
```

**Frontend Structure (Angular)**:
```text
src/
  app/
    features/
      question/
        components/
        services/
        models/
        question.module.ts
      evaluation/
        components/
        services/
        evaluation.module.ts
      audit/
        components/
        services/
        audit.module.ts
      auth/
        components/
        services/
        guards/
        auth.module.ts
    shared/
      components/
      directives/
      pipes/
      services/
      models/
      interceptors/
    core/
      services/
      guards/
      interceptors/
      models/
    app.module.ts
    app.component.ts
```

**Conventions**:
- Tests: Co-located with source files (`.spec.ts`)
- Types: Co-located with files using them or in `models/` folder
- Barrel exports: Use `index.ts` for public exports only
- Max nesting depth: 4 levels

## Testing Strategy

**Framework**: Jest (backend and frontend)

**Coverage Target**: 80%

**Test Types**:

| Type | Tool | When to Use |
|------|------|-------------|
| Unit | Jest | Individual functions, services, components |
| Integration | Jest + Supertest | API endpoints, database operations |
| E2E | Playwright | Critical user flows (question → answer → audit) |
| Component | Angular Testing Library | Angular components in isolation |

**Conventions**:
- Test naming: `it('should return evaluation when valid answer is provided')`
- Test structure: Arrange-Act-Assert (AAA)
- Mock external services (LLM, SLM, database) in unit tests
- Use factory functions for test data
- Avoid snapshot testing except for UI components

**Must Test**:
- All public service methods
- All API endpoints
- Evaluation logic (SLM integration)
- Audit logic (LLM integration)
- Authentication and authorization

## Error Handling

**Pattern**: Custom error classes + Nest.js exception filters

**Custom Errors**:
```typescript
export class EvaluationError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'EvaluationError';
  }
}

export class LlmServiceError extends Error {
  constructor(message: string, public readonly provider: string) {
    super(message);
    this.name = 'LlmServiceError';
  }
}
```

**API Error Format**:
```typescript
{
  "statusCode": 400,
  "message": "Invalid answer format",
  "error": "Bad Request",
  "code": "INVALID_ANSWER",
  "timestamp": "2024-12-05T10:30:00Z",
  "path": "/api/evaluate"
}
```

**Async Error Handling**:
```typescript
try {
  const result = await this.slmService.evaluate(answer, reference);
  return result;
} catch (error) {
  if (error instanceof LlmServiceError) {
    throw new HttpException(
      {
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: error.message,
        code: 'SLM_UNAVAILABLE',
      },
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
  throw error;
}
```

**Global Exception Filter**: Nest.js built-in HTTP exception filter + custom filter for structured errors

## Logging

**Tool**: Winston

**Format**: Structured JSON (production), Text (development)

**Levels**:

| Level | Usage |
|-------|-------|
| error | SLM/LLM failures, database errors, critical failures |
| warn | Rate limits, slow responses, unexpected but handled conditions |
| info | User sessions, evaluation results, audit completions |
| debug | SLM/LLM request/response details, database queries (dev only) |

**Rules**:

- **Always log**:
  - SLM/LLM requests (model, provider, prompt, response summary)
  - User authentication events
  - Evaluation results (question, answer, score)
  - Audit report generation
  - Database errors with query context

- **Never log**:
  - API keys or tokens
  - Full user answers (log hash/length instead for PII)
  - Passwords or sensitive credentials
  - Credit card numbers or payment data

**Log Format** (production):
```json
{
  "timestamp": "2024-12-05T10:30:00Z",
  "level": "info",
  "message": "Evaluation completed",
  "context": {
    "sessionId": "uuid",
    "questionId": 123,
    "provider": "ollama",
    "model": "gemma3:8b",
    "score": 0.85
  }
}
```

## Angular-Specific Standards

**Component**:
- Use standalone components where appropriate
- Implement `OnPush` change detection for performance
- Prefer `@Input()` with required flag
- Use `@Output()` with `EventEmitter`

**Services**:
- Use `Injectable({ providedIn: 'root' })` for singleton services
- Prefer `RxJS` for async operations (observables over promises)
- Use `HttpClient` for API calls with typed responses

**Directives/Pipes**:
- Use `@Directive` for DOM manipulation
- Use `@Pipe` for data transformation
- Pure pipes for performance, impure only when necessary

## NestJS-Specific Standards

**Modules**:
- One module per domain/feature
- Use `@Global()` only for truly global providers
- Export only what's necessary from modules

**Controllers**:
- Use `@Controller()` decorator with route prefix
- Use typed DTOs for request/response
- Apply validation with `class-validator`

**Services**:
- Use `@Injectable()` decorator
- Dependency injection via constructor
- One responsibility per service

**DTOs**:
- Use `class-validator` decorators
- Use `class-transformer` for serialization
- Separate DTOs for create/update operations

## Decision Relationships

- **Prettier** → Consistent formatting across backend and frontend
- **ESLint** → Catches type errors and enforces patterns before runtime
- **Jest** → Unified testing framework for both backend and frontend
- **Winston** → Structured logging enables audit trail for LLM evaluation
- **Feature-based organization** → Scales well with AI code generation of new features
- **TypeScript strict mode** → Essential for reliable AI code generation
