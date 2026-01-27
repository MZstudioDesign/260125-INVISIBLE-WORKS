# Global Claude Instructions

## Environment
- **OS**: Windows 11
- MCP servers require `cmd /c` wrapper for npx commands
- Use PowerShell or Git Bash compatible commands

## Language
- Always respond in Korean (한국어)
- Write all code, comments, and documentation in English

## Development Methodology: TDD (Test-Driven Development)

### Workflow
Always follow the TDD cycle strictly:

1. **Red Phase**: Write a failing test first
   - Define expected behavior before implementation
   - Test must fail initially (no implementation exists)

2. **Green Phase**: Write minimal code to pass the test
   - Only write enough code to make the test pass
   - No premature optimization or extra features

3. **Refactor Phase**: Improve code quality
   - Clean up duplication
   - Improve readability and structure
   - Ensure all tests still pass

### Testing Framework & Standards
- **Framework**: Jest with React Testing Library (for Next.js projects)
- **Coverage Target**: Minimum 80%
- **Test Types**:
  - Unit tests for all business logic
  - Integration tests for API routes and data flow
  - E2E tests (Playwright/Cypress) for critical user journeys

## Architecture: Clean Architecture

### Layer Structure
```
src/
├── domain/           # Enterprise business rules
│   ├── entities/     # Business objects
│   └── interfaces/   # Repository interfaces, contracts
├── application/      # Application business rules
│   ├── use-cases/    # Application-specific logic
│   └── dto/          # Data transfer objects
├── infrastructure/   # External concerns
│   ├── repositories/ # Data access implementations
│   ├── services/     # External service integrations
│   └── config/       # Configuration
└── presentation/     # UI & Controllers
    ├── components/   # React components
    ├── hooks/        # Custom hooks
    └── pages/        # Next.js pages/app router
```

### Principles
- Dependencies point inward (outer layers depend on inner layers)
- Domain layer has no external dependencies
- Use Dependency Injection for loose coupling
- Interfaces defined in domain, implemented in infrastructure

## User Interaction Policy

### MUST stop and ask the user when:
- Architecture or design decisions with multiple valid approaches
- Choosing external libraries or dependencies
- Business logic is ambiguous or unclear
- Requirements interpretation is uncertain
- Breaking changes to existing functionality
- Database schema changes
- API contract changes

### Can proceed without asking:
- Implementation details within approved architecture
- Minor refactoring during TDD refactor phase
- Test additions for existing code
- Bug fixes with clear cause

## Tech Stack

### Primary
- **Framework**: Next.js (App Router preferred)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: Zustand or React Context (based on complexity)

### Code Quality
- ESLint with strict rules
- Prettier for formatting
- TypeScript strict mode enabled

## Comments Policy
- Only write comments that help AI understand complex logic
- No obvious comments (self-documenting code preferred)
- Use JSDoc for public APIs and complex functions only

## Tools & Automation

### Maximize usage of:
- All installed MCP servers (Context7, etc.)
- Available Skills and slash commands
- Sub-agents for parallel tasks (Explore, Plan, Bash, etc.)
- Background tasks when appropriate

### Before starting any task:
1. Use TodoWrite to plan and track progress
2. Use Explore agent to understand existing codebase
3. Use Plan agent for complex implementations
