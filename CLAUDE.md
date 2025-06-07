# Project Overview - CLAUDE.md

## AI Development Strategy

This project follows a comprehensive AI-driven software engineering strategy using Claude Code and AI tools. All development should adhere to the principles and processes outlined in this document.

## Development Rules & Standards

### Package Management
- **MANDATORY**: Always use `yarn` for package management, never `npm`
- Install packages: `yarn add [package-name]`
- Install dev dependencies: `yarn add -D [package-name]`
- Install dependencies: `yarn install`
- Run scripts: `yarn [script-name]`

### Code Standards
- Follow established coding conventions for the project language
- Maintain consistent indentation and formatting
- Write clear, descriptive function and variable names
- Include comprehensive error handling
- Add comments for complex business logic

## AI Development Workflow

### Issue Management Process
1. **Epic/Master Issue Planning**: Use Claude Chat or Claude Code to break down large features
2. **Issue Creation**: Use Claude Code in planning mode to create detailed issues
3. **Implementation**: Claude Code executes issues systematically
4. **Review**: Human engineer reviews and integrates changes

### Documentation Requirements
- **CRITICAL**: Every issue MUST update relevant `CLAUDE.md` files
- All new functions, files, and architectural changes must be documented
- Documentation updates are mandatory for issue completion
- Follow the `ai-issue-template.md` format for all issues

## Project Architecture

### Directory Structure
```
[Project Root]/
├── CLAUDE.md (this file)
├── docs/
│   ├── dev/
│   │   ├── ai-issue-template.md
│   │   └── ai-dev-process.md
│   └── project/
│       ├── data/
│       │   ├── db.json
│       │   ├── dbStructureExplanation.md
│       │   └── uml.mermaid
│       ├── overview.md
│       └── structure.txt
├── ref/ (reference materials - gitignored)
│   └── Extra reference files/directories (if needed)
├── react-app/ (React frontend application)
│   └── CLAUDE.md (directory-level documentation)
├── functions/ (Firebase Cloud Functions)
│   └── CLAUDE.md (directory-level documentation)
├── electron/ (Electron desktop app)
│   └── CLAUDE.md (directory-level documentation)
├── common/ (Shared types and utilities)

### Documentation System
- **Root CLAUDE.md**: This file - overall project rules and architecture
- **Directory CLAUDE.md**: File and function breakdowns for each major directory
- **Reference Materials**: Additional context in `ref/` directory (gitignored)
- **Issue Template**: `docs/dev/ai-issue-template.md` for consistent issue creation

## Implementation Guidelines for Claude Code

### Pre-Implementation Checklist
1. Read relevant directory-level `CLAUDE.md` files for context
2. Review issue requirements and acceptance criteria
3. Identify which `CLAUDE.md` files will need updates
4. Create appropriate feature branch

### During Implementation
1. Follow established patterns from existing code
2. Implement all requirements systematically
3. **Update `CLAUDE.md` files** with new functions, files, and changes
4. Make logical, well-documented commits
5. Include documentation updates in commits

### Post-Implementation
1. Verify all acceptance criteria are met
2. Ensure `CLAUDE.md` files are accurately updated
3. Create merge request with clear description
4. Reference original issue in merge request

## Directory-Level CLAUDE.md Requirements

Each major directory should contain a `CLAUDE.md` file with:

### Required Sections
1. **Directory Purpose**: Brief explanation of the directory's role
2. **Architecture Notes**: Patterns, dependencies, and conventions used
3. **Files Overview**: Each file with its purpose and key functions
4. **Key Dependencies**: Important external libraries or internal modules
5. **Common Workflows**: How components interact and typical usage patterns
6. **Performance/Security Considerations**: Important constraints or notes

### Function Documentation Format
For each function, include:
- **Purpose**: What the function does
- **Parameters**: Input parameters and their types
- **Returns**: What the function returns
- **Usage Context**: When and how it's typically used

## Issue Creation Standards

### Use ai-issue-template.md
All issues must follow the template format including:
- Clear requirements and acceptance criteria
- Technical implementation plan with phases
- File references and integration points
- **Mandatory CLAUDE.md update requirements**
- Implementation TODOs with specific tasks

### Documentation Update Requirements
Every issue must include:
- Identification of affected directories
- List of new functions to document
- List of new files to document
- Description of architectural changes
- Explicit acceptance criteria for documentation updates

## Quality Standards

### Code Quality
- All functions must have clear purpose and proper error handling
- Follow DRY (Don't Repeat Yourself) principles
- Maintain consistent coding style throughout project
- Include appropriate logging and debugging capabilities

### Documentation Quality
- Keep `CLAUDE.md` files current with codebase changes
- Use clear, concise language in documentation
- Include practical examples where helpful
- Focus on high-level purpose rather than implementation details

## Performance Considerations

- Optimize for both development speed and runtime performance
- Consider scalability implications of architectural decisions
- Monitor and document performance characteristics
- Use appropriate caching strategies where beneficial

## Maintenance & Evolution

### Regular Updates
- Update `CLAUDE.md` files when architectural changes occur
- Refine templates based on AI performance and team feedback
- Keep reference materials current and relevant
- Review and improve development processes regularly

### Process Improvement
- Conduct regular retrospectives on AI-assisted development effectiveness
- Adjust templates and workflows based on project learnings
- Evolve integration patterns as tools and capabilities improve
- Document lessons learned and best practices

## Integration Points

### External Services
- Firebase Authentication and Database
- Firebase Cloud Functions for backend API
- Electron for desktop application wrapper

### Internal APIs
- REST API endpoints in `/functions/src/api/`
- Redux store for state management in React app
- IPC communication between Electron and React

### Database Patterns
- Firebase Realtime Database structure documented in `/docs/project/data/`
- Type definitions in `/common/types/`

## Development Environment Setup

### Required Tools
- Node.js (version specified in package.json)
- Yarn package manager
- Git for version control
- Claude Code CLI tool
- Firebase CLI for cloud functions deployment

## Project-Specific Notes

### Bus Tracking Application
- This is a bus tracking application with React frontend and Firebase backend
- The React app is located in `/react-app` directory
- Tailwind CSS v4 is configured for styling
- Run `yarn dev` from the `/react-app` directory to start the development server on http://localhost:5173/
- To start the Electron desktop app, run `yarn electron:dev` from the root directory

---

**Remember**: This documentation-driven approach ensures consistent, scalable development with AI assistance. Every change to the codebase should be reflected in the appropriate documentation to maintain the effectiveness of our AI development strategy.