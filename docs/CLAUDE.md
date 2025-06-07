# Documentation Module

## Directory Purpose
Comprehensive documentation for the bus tracking system, including development processes, project architecture, data models, and AI-assisted development strategies. Serves as the knowledge base for both human developers and AI coding assistants.

## Architecture Notes
- Structured documentation organized by purpose (dev processes vs project details)
- Markdown format for easy version control and readability
- UML diagrams and JSON examples for visual representation
- AI-focused documentation to enable effective AI-assisted development

## Files Overview

### `dev/ai-dev-process.md`
**Purpose:** Comprehensive guide for AI-driven software engineering workflow
**Key Sections:**
- Documentation infrastructure setup (CLAUDE.md files)
- Development workflow phases (planning, implementation, review)
- Issue management and version control integration
- Quality assurance and maintenance guidelines
- Benefits and best practices for AI-assisted development

### `dev/ai-issue-template.md`
**Purpose:** Standardized template for creating development issues
**Key Components:**
- Requirements and acceptance criteria format
- Technical implementation plan structure
- File references and integration points
- Mandatory CLAUDE.md update requirements
- Implementation TODOs checklist format

### `project/overview.md`
**Purpose:** High-level system architecture and business requirements
**Key Sections:**
- User roles and responsibilities (Administrator, Driver, Guardian, Student)
- Core system features (route management, GPS tracking, notifications)
- Technology stack (React Native, Firebase, Electron)
- Multi-tenant architecture design
- Integration points and security considerations

### `project/structure.txt`
**Purpose:** Directory structure snapshot of the entire project
**Usage Context:**
- Quick reference for project organization
- Understanding module boundaries
- Navigation aid for developers and AI assistants

### `project/data/db.json`
**Purpose:** Example database structure with sample data
**Usage Context:**
- Reference for database schema
- Test data for development
- Visual representation of entity relationships

### `project/data/dbStructureExplanation.md`
**Purpose:** Detailed explanation of the database schema
**Key Sections:**
- Entity definitions (drivers, students, guardians, routes, routeLocations)
- Field descriptions and data types
- Embedded stop structure explanation
- Templates vs instances concept
- Reference relationship patterns
- Timestamp and GPS coordinate formats

### `project/data/uml.mermaid`
**Purpose:** UML class diagram of the data model
**Usage Context:**
- Visual representation of entity relationships
- Quick reference for data model structure
- Documentation for architectural discussions

## Key Dependencies
- No external dependencies (pure documentation)
- Referenced by AI tools and developers throughout the project
- Complements code-level documentation in CLAUDE.md files

## Common Workflows
1. **Issue Creation:** Developer/AI reads ai-issue-template.md → Creates structured issue → Includes CLAUDE.md update requirements
2. **System Understanding:** Read overview.md → Review dbStructureExplanation.md → Reference uml.mermaid for visual model
3. **AI Development:** AI reads ai-dev-process.md → Follows workflow → Updates relevant documentation

## Performance Considerations
- Documentation should be concise yet comprehensive
- Regular updates to reflect system changes
- Structured format enables quick AI parsing and understanding

## Security Notes
- No sensitive information should be included in documentation
- Example data should use fictional information
- Authentication and authorization patterns documented without exposing implementation details