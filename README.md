# AI-Trainer Demo

A full-stack TypeScript application demonstrating an AI-powered evaluation system using a dual-layer architecture: a local Small Language Model (SLM) for initial evaluation and a cloud Large Language Model (LLM) for final audit.

## Overview

The AI-Trainer Demo (01-game-project) is designed to manage question-answer pairs from podcast transcripts and evaluate user responses using an intelligent two-step evaluation process:

1. **Local Evaluation (SLM)**: Ollama-based gemma3:8b model evaluates answers locally
2. **Audit Review (LLM)**: GLM-5 Z.AI API reviews SLM performance for quality assurance

This architecture balances performance (local processing) with accuracy (cloud validation) while maintaining an audit trail of all evaluations.

## Key Features

- **Question Management**: Import, create, read, update, and delete question-answer pairs
- **File Import**: Support for CSV and JSON file formats with validation
- **Category Organization**: Organize questions by topic/category
- **Data Export**: Export questions to CSV and JSON formats
- **Answer Evaluation**: Compare user responses against reference answers using AI
- **Session Tracking**: Log all evaluation sessions and results
- **Audit System**: Cloud-based final review of evaluation quality
- **Admin Dashboard**: View sessions, evaluations, and audit reports

## Tech Stack

### Languages & Runtime
- **TypeScript** - Type-safe development for frontend and backend
- **Node.js** - Backend runtime

### Backend
- **Nest.js** - Progressive Node.js framework with TypeScript
- **TypeORM** - Object-Relational Mapper with decorator-based models
- **SQLite** - File-based database for local demo
- **Winston** - Structured logging

### Frontend
- **Angular 20+** - Full-featured web application framework
- **RxJS** - Reactive programming library
- **Angular Testing Library** - Component testing utilities

### AI & LLM Integration
- **Ollama** - Local SLM inference engine (gemma3:8b)
- **GLM-5 Z.AI API** - Cloud-based LLM for audit phase

### Development Tools
- **npm** - Package manager
- **Prettier** - Code formatter (printWidth: 100, singleQuote: true)
- **ESLint** - Code linting with strict TypeScript rules
- **Jest** - Unit testing framework
- **Vitest** - Alternative test runner (Angular v21+)
- **Playwright** - End-to-end testing
- **Husky + lint-staged** - Git pre-commit hooks

## Project Structure

```
01-game-project/
├── README.md                      # This file
├── AGENTS.md                      # Project map for AI agents
├── .ai-factory/                   # AI Factory context
│   ├── DESCRIPTION.md             # Project specification
│   └── ARCHITECTURE.md            # Architecture guidelines
├── .claude/                       # Claude Code configuration
│   ├── agents/                    # AI agent specs
│   ├── commands/                  # Slash commands
│   └── skills/                    # Installed AI skills
├── .specsmd/                      # SpecMD framework
│   └── aidlc/                     # AI-DLC agents and templates
├── memory-bank/                   # Project standards
│   ├── project.yaml               # Project metadata
│   ├── bolts/                     # Development bolts
│   ├── intents/                   # Feature intents and requirements
│   └── standards/                 # Coding & tech standards
│       ├── tech-stack.md
│       ├── data-stack.md
│       └── coding-standards.md
├── apps/                          # Application source (TBD)
│   ├── backend/                   # Nest.js backend
│   └── frontend/                  # Angular frontend
├── .ai-factory.json               # Skills & MCP config
└── .mcp.json                      # Model Context Protocol config
```

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm 9+
- **Ollama** 0.1+ with gemma3:8b model installed
- **Git**
- GLM-5 Z.AI API key (for audit features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 01-game-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration:
   # - Ollama endpoint (default: localhost:11434)
   # - GLM-5 Z.AI API key
   # - Database path
   ```

4. **Start Ollama** (in separate terminal)
   ```bash
   ollama serve
   # Ensure gemma3:8b model is downloaded:
   ollama pull gemma3:8b
   ```

### Development

**Backend (Nest.js)**
```bash
# Install backend dependencies
npm install

# Start development server (port 3000)
npm run start:dev

# Run backend tests
npm run test

# Run e2e tests
npm run test:e2e
```

**Frontend (Angular)**
```bash
# Start development server (port 4200)
npm run ng serve

# Run component tests
npm run test

# Run e2e tests
npm run e2e
```

### Build

```bash
# Build both backend and frontend
npm run build

# Build backend only
npm run build:backend

# Build frontend only
npm run build:frontend
```

## Project Phases

### Active Intent: 001-question-management

Core functionality for managing question-answer pairs used during evaluation.

**Units:**
1. **001-question-import** - Parse and validate CSV/JSON files, store results
2. **001-question-management-ui** - Admin interface for managing questions
3. **002-question-crud** - Create, read, update, delete operations
4. **003-category-service** - Category management and organization
5. **004-question-export** - Export questions to CSV/JSON

**Progress:** [In Planning]

See [memory-bank/intents/001-question-management](memory-bank/intents/001-question-management) for detailed requirements and user stories.

## Architecture

The project follows a **Modular Monolith** architecture pattern optimizing for:

- **Clear separation of concerns** - Distinct backend and frontend
- **Type safety** - End-to-end TypeScript
- **Local development** - SQLite and local Ollama
- **Scalable structure** - Ready for microservices evolution

### Backend Architecture (Nest.js)
- **Modules** - Feature-based modules (question, evaluation, session, audit)
- **Controllers** - HTTP endpoint handlers
- **Services** - Business logic implementation
- **Entities** - TypeORM database models
- **DTOs** - Data transfer objects for API contracts

### Frontend Architecture (Angular)
- **Modules** - Feature modules with lazy loading
- **Components** - Standalone components with signals
- **Services** - Data access and business logic
- **Directives** - Custom DOM manipulation
- **Guards** - Route protection and data loading

See [.ai-factory/ARCHITECTURE.md](.ai-factory/ARCHITECTURE.md) for detailed architecture guidelines.

## Standards & Best Practices

### Code Standards
- **TypeScript** - Strict mode enabled, no `any` types
- **Naming** - Clear, descriptive names (services, components, variables)
- **Formatting** - Prettier with printWidth 100, singleQuote true
- **Testing** - Minimum 70% coverage, critical flows with e2e tests
- **Error Handling** - Consistent error types and logging

See [memory-bank/standards/coding-standards.md](memory-bank/standards/coding-standards.md) for complete guidelines.

### Tech Stack Decisions

See [memory-bank/standards/tech-stack.md](memory-bank/standards/tech-stack.md) for decision rationale and technology relationships.

### Data Schema

See [memory-bank/standards/data-stack.md](memory-bank/standards/data-stack.md) for database design and ORM configuration.

## Development Workflow

### 1. Planning Phase
- Review intent requirements in `memory-bank/intents/`
- Identify user stories in `stories/` subdirectory
- Create feature branch from `main`

### 2. Implementation Phase
- Follow the AI-Trainer skill development process
- Implement features story by story
- Write tests alongside code
- Use provided AI skills for common tasks:
  - `angular-component` - Create standalone components
  - `angular-http` - Implement API calls
  - `angular-forms` - Build reactive forms
  - `aif-plan` - Plan feature implementation

### 3. Review Phase
- Ensure code meets standards
- Run full test suite
- Verify linting passes
- Request code review using `/aif-review`

### 4. Merge & Deploy
- Merge to main after approval
- Run full build pipeline
- Deploy to environment

## Code Quality

### Linting & Formatting
```bash
# Run ESLint
npm run lint

# Format code (Prettier)
npm run format

# Check formatting
npm run format:check
```

### Testing
```bash
# Run all tests
npm run test

# Run specific test file
npm run test path/to/test.spec.ts

# Coverage report
npm run test:coverage

# E2E tests
npm run e2e
```

### Pre-commit Hooks
This project uses Husky and lint-staged to automatically:
- Run linting on staged files
- Format code with Prettier
- Run tests on changed files

Hooks are installed automatically with `npm install`.

## Database

**SQLite** is used for local development and demo deployment.

### Schema
- `questions` - Question-answer pairs with categories
- `categories` - Topic/category organization
- `sessions` - User evaluation sessions
- `evaluations` - SLM evaluation results
- `audits` - LLM audit records

Run migrations during setup:
```bash
npm run typeorm migration:run
```

## Environment Configuration

Create `.env.local` with these variables:

```env
# Backend
NODE_ENV=development
API_PORT=3000
DATABASE_URL=sqlite://./data/ai-trainer.db

# AI Integration
OLLAMA_ENDPOINT=http://localhost:11434
OLLAMA_MODEL=gemma3:8b
GLM_API_KEY=your-glm5-api-key
GLM_API_BASE=https://api.apiglm5.example.com

# Frontend
ANGULAR_PORT=4200
API_BASE_URL=http://localhost:3000
```

## Common Tasks

### Import Questions
```bash
# Via API endpoint
POST /api/questions/import
Content-Type: multipart/form-data

file: questions.csv
```

Supported formats: CSV, JSON

### Export Questions
```bash
# Export all as CSV
GET /api/questions/export?format=csv

# Export by category as JSON
GET /api/questions/export?format=json&category=algorithms
```

### Evaluate Answers
```bash
POST /api/evaluations
{
  "sessionId": "uuid",
  "questionId": "uuid",
  "userAnswer": "user's response",
  "referenceAnswer": "reference answer"
}
```

Response includes SLM evaluation result and audit status.

## Troubleshooting

### Ollama Connection Failed
```bash
# Verify Ollama is running
curl http://localhost:11434/api/tags

# Check model availability
ollama list

# Pull model if missing
ollama pull gemma3:8b
```

### Database Errors
```bash
# Reset database
rm -f data/ai-trainer.db

# Re-run migrations
npm run typeorm migration:run
```

### Port Already in Use
```bash
# Change port in .env.local
API_PORT=3001
ANGULAR_PORT=4201
```

## Contributing

1. Create feature branch: `git checkout -b feat/feature-name`
2. Implement following code standards
3. Write tests for new features
4. Run full test suite: `npm run test`
5. Commit with descriptive messages
6. Push and create pull request
7. Request review: `@ai-trainer`

## Documentation

- [AGENTS.md](AGENTS.md) - Project structure for AI agents
- [.ai-factory/DESCRIPTION.md](.ai-factory/DESCRIPTION.md) - Project specification
- [.ai-factory/ARCHITECTURE.md](.ai-factory/ARCHITECTURE.md) - Architecture guidelines
- [memory-bank/standards/](memory-bank/standards/) - Tech stack, data schema, code standards
- [memory-bank/intents/](memory-bank/intents/) - Feature requirements and user stories

## Performance Considerations

- **Local SLM Inference**: Runs on user's machine, ~500ms-2s per evaluation
- **Cloud LLM Audit**: Batched processing for cost efficiency, 1-5 minute SLA
- **Database**: SQLite suitable for single-user demo, upgrade to PostgreSQL for multi-user
- **Caching**: Response caching implemented for categories and static question lists

## Security Notes

- **API Authentication**: TBD - Authentication required for student tracking
- **API Keys**: Never commit `.env.local`, use environment variables
- **Data Privacy**: SQLite database is local; no cloud storage by default
- **LLM API**: Secure key storage for GLM-5 API credentials
- **Input Validation**: All file uploads and user input validated server-side

## License

[To be determined]

## Support & Issues

For issues and questions:
1. Check existing GitHub issues
2. Review documentation in [memory-bank/](memory-bank/)
3. Create detailed issue with reproduction steps
4. Contact project maintainers

---

**Project Status**: Early Development (Planning Phase)  
**Last Updated**: February 19, 2026  
**Maintainers**: RS School Project Team
