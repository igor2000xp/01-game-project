# AGENTS.md

> Project map for AI agents. Keep this file up-to-date as the project evolves.

## Project Overview

AI-Trainer Demo: Full-stack TypeScript application demonstrating dual-layer AI evaluation system (local SLM for initial evaluation, cloud LLM for final audit).

## Tech Stack

- **Language**: TypeScript
- **Backend**: Nest.js + TypeORM + SQLite
- **Frontend**: Angular + RxJS
- **AI/LLM**: Ollama (gemma3:8b) + GLM-5 Z.AI API

## Project Structure

```
01-game-project/
├── .ai-factory/              # AI Factory context files
│   ├── DESCRIPTION.md        # Project specification
│   └── ARCHITECTURE.md       # Architecture guidelines (Modular Monolith)
├── .claude/                  # Claude Code configuration
│   ├── agents/               # AI agent configurations (SpecMD)
│   ├── commands/             # Slash commands (SpecMD)
│   └── skills/               # Installed skills (aif-*)
├── .specsmd/                 # SpecMD AI-DLC framework
│   └── aidlc/                # AI-DLC agents, skills, templates
├── memory-bank/              # Project standards and configuration
│   ├── project.yaml          # Project type (full-stack-web)
│   └── standards/            # Tech stack, data stack, coding standards
├── .ai-factory.json          # Skills and MCP configuration
└── .mcp.json                 # MCP server configuration
```

## Key Entry Points

| File | Purpose |
|------|---------|
| `.ai-factory/DESCRIPTION.md` | Project specification and tech stack reference |
| `.ai-factory.json` | Installed AIF skills and MCP server configuration |
| `memory-bank/project.yaml` | Project type and initialization metadata |
| `memory-bank/standards/tech-stack.md` | Detailed technology choices and rationale |
| `memory-bank/standards/data-stack.md` | Database schema and ORM configuration |
| `memory-bank/standards/coding-standards.md` | Naming, formatting, testing, and error handling |

## Documentation

| Document | Path | Description |
|----------|------|-------------|
| AGENTS.md | AGENTS.md | This file — project structure map |

## AI Context Files

| File | Purpose |
|------|---------|
| AGENTS.md | This file — project structure map |
| .ai-factory/DESCRIPTION.md | Project specification and tech stack |
| .ai-factory/ARCHITECTURE.md | Architecture decisions and guidelines |
| memory-bank/standards/tech-stack.md | Technology choices with rationale |
| memory-bank/standards/data-stack.md | Database and ORM configuration |
| memory-bank/standards/coding-standards.md | Code style and conventions |

## Notes

- **Status**: Configuration complete, source code not yet created
- **Skills**: All AIF skills pre-installed (18 skills total)
- **MCP**: GitHub, Filesystem, Postgres, Chrome DevTools configured
- **Framework**: SpecMD AI-DLC for structured development workflow
