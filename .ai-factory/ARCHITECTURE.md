# Architecture: Modular Monolith

## Overview

This project uses a **Modular Monolith** architecture pattern — a single deployment unit with strong, well-defined module boundaries. This architecture is ideal for the AI-Trainer Demo because:

1. **Nest.js Alignment**: Nest.js's module system naturally supports modular architecture
2. **Clear Boundaries**: Each domain (question, evaluation, audit, auth) is isolated within its module
3. **Future Flexibility**: Modules can be extracted to microservices later if needed
4. **Simple Operations**: Single deployment, single database, easy local development
5. **Appropriate Complexity**: Enough structure for the AI evaluation logic without over-engineering

The Modular Monolith provides the benefits of microservices (independent modules) without the operational overhead.

## Decision Rationale

- **Project type**: Demo application for RS School (small team, learning focus)
- **Tech stack**: Nest.js (modular by design), Angular (feature-based organization)
- **Key factor**: Balance between structure and simplicity — need clear boundaries for AI workflows (SLM/LLM) but want to keep it maintainable

## Folder Structure

### Backend (Nest.js)

```
backend/
├── src/
│   ├── modules/                    # Feature modules (Bounded Contexts)
│   │   ├── question/               # Question management domain
│   │   │   ├── entities/
│   │   │   │   └── question.entity.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-question.dto.ts
│   │   │   │   └── question-response.dto.ts
│   │   │   ├── services/
│   │   │   │   └── question.service.ts
│   │   │   ├── controllers/
│   │   │   │   └── question.controller.ts
│   │   │   └── question.module.ts   # Public API exports only
│   │   ├── evaluation/             # SLM evaluation domain
│   │   │   ├── entities/
│   │   │   │   └── evaluation.entity.ts
│   │   │   ├── dto/
│   │   │   ├── services/
│   │   │   │   └── evaluation.service.ts
│   │   │   ├── providers/
│   │   │   │   └── slm-provider.interface.ts
│   │   │   │   ├── ollama-provider.ts
│   │   │   │   └── mock-provider.ts
│   │   │   └── evaluation.module.ts
│   │   ├── audit/                  # LLM audit domain
│   │   │   ├── entities/
│   │   │   ├── dto/
│   │   │   ├── services/
│   │   │   │   └── audit.service.ts
│   │   │   ├── providers/
│   │   │   │   ├── llm-provider.interface.ts
│   │   │   │   └── zai-provider.ts
│   │   │   └── audit.module.ts
│   │   ├── session/                # User session domain
│   │   │   ├── entities/
│   │   │   ├── dto/
│   │   │   ├── services/
│   │   │   └── session.module.ts
│   │   └── auth/                   # Authentication domain
│   │       ├── strategies/
│   │       ├── guards/
│   │       ├── dto/
│   │       └── auth.module.ts
│   ├── shared/                     # Cross-cutting concerns (truly shared)
│   │   ├── types/
│   │   │   └── providers.ts        # Provider types for DI
│   │   ├── decorators/
│   │   │   ├── logger.decorator.ts
│   │   │   └── require-user.decorator.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/
│   │   │   ├── logging.interceptor.ts
│   │   │   └── transform.interceptor.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   ├── utils/
│   │   │   └── hash.util.ts
│   │   └── index.ts                # Public exports from shared
│   ├── config/                     # Configuration management
│   │   ├── database.config.ts
│   │   ├── llm.config.ts
│   │   └── ollama.config.ts
│   ├── database/
│   │   └── migrations/
│   ├── app.module.ts               # Root module (imports all feature modules)
│   └── main.ts                     # Application entry point
├── test/                           # E2E tests
│   └── app.e2e-spec.ts
├── jest.config.js
├── nest-cli.json
├── package.json
└── tsconfig.json
```

### Frontend (Angular)

```
frontend/
├── src/
│   ├── app/
│   │   ├── features/               # Feature modules (aligned with backend)
│   │   │   ├── question/
│   │   │   │   ├── components/
│   │   │   │   │   ├── question-display/
│   │   │   │   │   │   ├── question-display.component.ts
│   │   │   │   │   │   ├── question-display.component.html
│   │   │   │   │   │   └── question-display.component.scss
│   │   │   │   │   └── answer-form/
│   │   │   │   ├── services/
│   │   │   │   │   └── question.service.ts
│   │   │   │   ├── models/
│   │   │   │   │   └── question.model.ts
│   │   │   │   └── question.module.ts
│   │   │   ├── evaluation/
│   │   │   │   ├── components/
│   │   │   │   │   ├── evaluation-result/
│   │   │   │   │   └── evaluation-history/
│   │   │   │   ├── services/
│   │   │   │   ├── models/
│   │   │   │   └── evaluation.module.ts
│   │   │   ├── audit/
│   │   │   │   ├── components/
│   │   │   │   │   ├── audit-report/
│   │   │   │   │   └── audit-dashboard/
│   │   │   │   ├── services/
│   │   │   │   ├── models/
│   │   │   │   └── audit.module.ts
│   │   │   └── auth/
│   │   │       ├── components/
│   │   │       │   ├── login-form/
│   │   │       │   └── register-form/
│   │   │       ├── guards/
│   │   │       │   └── auth.guard.ts
│   │   │       ├── services/
│   │   │       │   └── auth.service.ts
│   │   │       ├── models/
│   │   │       └── auth.module.ts
│   │   ├── shared/                 # Reusable components, pipes, directives
│   │   │   ├── components/
│   │   │   │   ├── loading-spinner/
│   │   │   │   ├── error-message/
│   │   │   │   └── confirm-dialog/
│   │   │   ├── directives/
│   │   │   │   └── autofocus.directive.ts
│   │   │   ├── pipes/
│   │   │   │   ├── safe-html.pipe.ts
│   │   │   │   └── truncate.pipe.ts
│   │   │   ├── services/
│   │   │   │   └── api.service.ts   # Base HTTP service
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts
│   │   │   │   └── error.interceptor.ts
│   │   │   └── shared.module.ts
│   │   ├── core/                   # Singleton services, global configuration
│   │   │   ├── services/
│   │   │   │   ├── config.service.ts
│   │   │   │   └── session.service.ts
│   │   │   ├── guards/
│   │   │   │   └── authenticated.guard.ts
│   │   │   └── core.module.ts       # imported only in AppModule
│   │   ├── layouts/
│   │   │   ├── main-layout/
│   │   │   │   ├── main-layout.component.ts
│   │   │   │   ├── main-layout.component.html
│   │   │   │   └── main-layout.component.scss
│   │   │   └── auth-layout/
│   │   │   ├── auth-layout.component.ts
│   │   │   └── ...
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   └── app.module.ts
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── angular.json
├── package.json
└── tsconfig.json
```

## Dependency Rules

### Backend (Nest.js)

- ✅ **Feature modules** may depend on **Shared module**
- ✅ **Feature modules** may depend on **Config module**
- ❌ **Feature modules** must NOT depend on other feature modules directly
- ✅ **Shared module** may NOT depend on any feature modules
- ✅ **All modules** must export only their public API via `exports` array

### Frontend (Angular)

- ✅ **Feature modules** may depend on **Shared module**
- ✅ **Feature modules** may depend on **Core module**
- ❌ **Feature modules** must NOT depend on other feature modules
- ✅ **Shared module** must NOT depend on Core or Feature modules
- ✅ **Core module** must NOT depend on any Feature module

## Layer/Module Communication

### Backend Communication Patterns

**1. Module-to-Module via Public API**
```typescript
// question/question.module.ts - Exports ONLY what others need
@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService], // Public API
})
export class QuestionModule {}

// evaluation/evaluation.module.ts - Uses Question via DI
@Module({
  imports: [
    TypeOrmModule.forFeature([Evaluation]),
    QuestionModule, // Import the module, use the service
  ],
  providers: [EvaluationService],
})
export class EvaluationModule {}
```

**2. Cross-Module Events (if needed)**
```typescript
// Using Nest.js EventEmitter2 for loose coupling
@Injectable()
export class EvaluationService {
  constructor(
    private eventEmitter: EventEmitter2,
    private questionService: QuestionService,
  ) {}

  async evaluate(answer: string, questionId: string) {
    const question = await this.questionService.findOne(questionId);
    const result = await this.slmProvider.evaluate(answer, question.referenceAnswer);

    // Emit event without tight coupling to Audit module
    this.eventEmitter.emit('evaluation.completed', {
      questionId,
      answer,
      result,
    });

    return result;
  }
}
```

**3. Provider Strategy Pattern (for LLM/SLM)**
```typescript
// Define interface, inject concrete implementation
export interface SlmProvider {
  evaluate(answer: string, reference: string): Promise<EvaluationResult>;
}

@Injectable()
export class OllamaProvider implements SlmProvider {
  async evaluate(answer: string, reference: string) { /* ... */ }
}

@Module({
  providers: [
    {
      provide: 'SLM_PROVIDER',
      useClass: OllamaProvider, // Can swap to MockProvider for tests
    },
  ],
})
export class EvaluationModule {}
```

### Frontend Communication Patterns

**1. Service Layer for API Calls**
```typescript
// shared/services/api.service.ts - Base HTTP service
@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(`/api${url}`);
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(`/api${url}`, body);
  }
}

// features/question/services/question.service.ts - Domain-specific
@Injectable({ providedIn: 'root' })
export class QuestionService {
  private readonly endpoint = '/questions';

  constructor(private api: ApiService) {}

  getQuestions(): Observable<Question[]> {
    return this.api.get<Question[]>(this.endpoint);
  }
}
```

**2. RxJS for Async Data Flow**
```typescript
// Using observables for reactive data
@Component({
  selector: 'app-evaluation-result',
  template: `
    <div *ngIf="result$ | async as result">
      <p>Score: {{ result.score }}</p>
      <p>Comment: {{ result.comment }}</p>
    </div>
  `,
})
export class EvaluationResultComponent implements OnInit {
  result$: Observable<EvaluationResult>;

  constructor(private evaluationService: EvaluationService) {}

  ngOnInit() {
    this.result$ = this.evaluationService.getLastEvaluation().pipe(
      catchError(() => of({ score: 0, comment: 'Error loading result' }))
    );
  }
}
```

## Key Principles

1. **Explicit Public API** — Each module exports only what others need via `index.ts` or `exports` array. Never access internal files.

2. **Feature Independence** — A feature module should be understandable in isolation. Remove any import, it should still work on its own.

3. **Dependency Injection Over Direct Imports** — Use DI tokens and interfaces for dependencies between modules.

4. **Domain Alignment** — Module boundaries follow business domains, not technical concerns. `QuestionModule`, not `DatabaseModule`.

5. **Shared is Minimal** — Put code in shared only when it's truly shared across multiple features. When in doubt, keep it in the feature module.

6. **Testing at Module Boundaries** — Unit tests test internal logic. Integration tests test public API. E2E tests cross-module flows.

## Code Examples

### Example 1: Nest.js Feature Module with Public API

```typescript
// question/question.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionController } from './controllers/question.controller';
import { QuestionService } from './services/question.service';
import { Question } from './entities/question.entity';

// Internal DTOs are NOT exported
import { CreateQuestionDto, UpdateQuestionDto } from './dto';

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  controllers: [QuestionController],
  providers: [QuestionService],
  // Export only the service - others use it via DI
  exports: [QuestionService],
})
export class QuestionModule {}
```

```typescript
// Another module using Question
// evaluation/evaluation.service.ts
@Injectable()
export class EvaluationService {
  constructor(
    // Inject QuestionService - we don't import the entity directly
    private questionService: QuestionService,
    @Inject('SLM_PROVIDER') private slmProvider: SlmProvider,
  ) {}

  async evaluate(questionId: string, userAnswer: string) {
    // Use the public API, not internal implementation
    const question = await this.questionService.getPublicQuestion(questionId);
    return this.slmProvider.evaluate(userAnswer, question.referenceAnswer);
  }
}
```

### Example 2: Angular Feature Module

```typescript
// features/question/question.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { QuestionDisplayComponent } from './components/question-display/question-display.component';
import { AnswerFormComponent } from './components/answer-form/answer-form.component';
import { QuestionRoutingModule } from './question-routing.module';

// Services are providedIn: 'root' to avoid circular deps
// Only component declarations and routing here

@NgModule({
  declarations: [
    QuestionDisplayComponent,
    AnswerFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    QuestionRoutingModule,
  ],
})
export class QuestionModule {}
```

### Example 3: Provider Strategy for LLM/SLM

```typescript
// evaluation/providers/slm-provider.interface.ts
export interface SlmProvider {
  evaluate(answer: string, reference: string): Promise<EvaluationResult>;
  getModelInfo(): { name: string; provider: string };
}

// evaluation/providers/ollama-provider.ts
@Injectable()
export class OllamaProvider implements SlmProvider {
  constructor(private configService: ConfigService) {}

  async evaluate(answer: string, reference: string): Promise<EvaluationResult> {
    const url = this.configService.get('OLLAMA_URL');
    const response = await fetch(`${url}/api/generate`, {
      method: 'POST',
      body: JSON.stringify({ /* ... */ }),
    });
    return response.json();
  }

  getModelInfo() {
    return { name: 'gemma3:8b', provider: 'ollama' };
  }
}

// evaluation/providers/mock-provider.ts (for testing)
@Injectable()
export class MockSlmProvider implements SlmProvider {
  async evaluate(answer: string, reference: string): Promise<EvaluationResult> {
    return {
      score: 0.85,
      comment: 'Mock evaluation',
      model: 'mock',
    };
  }

  getModelInfo() {
    return { name: 'mock', provider: 'mock' };
  }
}

// evaluation/evaluation.module.ts
@Module({
  providers: [
    EvaluationService,
    {
      provide: 'SLM_PROVIDER',
      useClass: process.env.NODE_ENV === 'test' ? MockSlmProvider : OllamaProvider,
    },
  ],
})
export class EvaluationModule {}
```

## Anti-Patterns

- ❌ **Direct internal file imports**: `import { QuestionEntity } from '../../question/entities/question.entity'`
  - Use the service's public API instead

- ❌ **Circular dependencies**: Module A imports Module B, Module B imports Module A
  - Use events or extract shared logic to Shared module

- ❌ **Shared module growing indefinitely**: Adding everything to shared "just in case"
  - Keep shared minimal. Feature-specific code belongs in the feature module

- ❌ **Module knows about implementation details**: Controller directly accesses repository
  - Controller → Service → Repository. Keep layers even within modules

- ❌ **Testing implementation instead of behavior**: Testing private methods
  - Test public API. If it's hard to test, the public API might be wrong

- ❌ **Cross-module direct database access**: Evaluation module queries Question table directly
  - Use QuestionService to get data, even within the same process

- ❌ **Frontend components calling multiple services directly**
  - Have a facade service coordinate the calls, keep components simple
