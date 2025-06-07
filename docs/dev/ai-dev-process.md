# AI-Driven Software Engineering Strategy

## Overview
This document outlines a comprehensive strategy for leveraging Claude Code and AI tools to streamline software development, from initial planning through implementation and delivery. The approach emphasizes thorough documentation, systematic planning, and automated execution.

## Prerequisites & Setup

### Documentation Infrastructure
**Directory-Level Documentation**
- Create `CLAUDE.md` files in all major directories
- Include file-by-file breakdown with function purposes
- Document architecture patterns, dependencies, and workflows
- Maintain high-level overviews focused on business logic and system interactions

**Project-Level Documentation**
- Create root-level `CLAUDE.md` with overall architecture explanation
- Define coding standards, conventions, and project rules
- Include development guidelines and AI interaction patterns
- Document key business domains and technical constraints

**Issue Management Templates**
- Create `ai-issue-template.md` as standardized format for AI-generated issues
- Include sections for requirements, acceptance criteria, and reference materials
- **Always include requirement to update relevant `CLAUDE.md` files** when new functions, files, or architectural changes are made
- Establish consistent structure for AI planning and execution

### Integration Setup
**Version Control Integration**
- Connect Claude Code to GitHub or GitLab (using GitLab integration)
- Configure CLI rules and permissions in top-level `CLAUDE.md`
- Ensure proper authentication and repository access
- Set up branch protection rules and merge request workflows

**Reference Materials**
- Create `ref/` directory for supplementary documentation and examples
- Add `ref/` to `.gitignore` to keep repository clean
- Store architectural diagrams, API documentation, and external references
- Maintain examples and templates for common patterns

## Development Workflow

### Phase 1: Epic/Master Issue Planning

**Large Feature Planning**
- Use Claude Chat app or Claude Code for high-level feature analysis
- Break down complex features into manageable components
- Create Epic (GitLab) or Master Issue (GitHub) with comprehensive scope
- Generate list of constituent issues with clear dependencies

**Planning Session Structure**
1. Define feature requirements and business value
2. Analyze impact on existing system architecture
3. Identify technical challenges and dependencies
4. Break down into logical, implementable units
5. Create Epic/Master Issue with complete roadmap

### Phase 2: Issue Creation & Planning

**Planning Phase**
- Use Claude Code in planning mode (no code execution)
- Provide issue requirements and reference materials from `ref/` directory
- Analyze technical approach and identify implementation strategy
- Generate detailed issue specifications with acceptance criteria

**Issue Creation Process**
1. Claude Code analyzes requirements against existing codebase
2. Reviews relevant `CLAUDE.md` files for context
3. Creates comprehensive issue on GitHub or GitLab
4. Includes technical approach, acceptance criteria, and testing requirements
5. **Adds requirement to update relevant `CLAUDE.md` files** if new functions, files, or architectural changes are introduced
6. Links to Epic/Master Issue and identifies dependencies

### Phase 3: Implementation & Execution

**Execution Phase**
- Claude Code pulls assigned issue from GitHub or GitLab
- Creates feature branch following naming conventions
- Implements all requirements listed in issue
- Follows coding standards and architectural patterns from project documentation

**Implementation Process**
1. **Issue Analysis**: Claude Code reads issue requirements and acceptance criteria
2. **Context Building**: Reviews relevant `CLAUDE.md` files for system understanding
3. **Branch Creation**: Creates appropriately named feature branch
4. **Implementation**: Executes all items in issue systematically
5. **Documentation Update**: Updates relevant `CLAUDE.md` files with any new functions, files, or architectural changes
6. **Commit Strategy**: Makes logical, well-documented commits throughout development
7. **Push & PR/MR**: Pushes completed work and creates merge/pull request

### Phase 4: Review & Integration (Human Software Engineer)

**Quality Assurance**
- **Human engineer** examines implemented code against requirements
- Run tests and verify functionality
- Review code quality and adherence to standards
- Verify that `CLAUDE.md` files have been properly updated with new additions
- Provide follow-up instructions for any necessary adjustments

**Integration Process**
1. **Human engineer** reviews merge/pull request for completeness
2. Test functionality in appropriate environment
3. Verify acceptance criteria are met
4. Confirm documentation updates are accurate and complete
5. Merge to main branch following team protocols
6. Update Epic/Master Issue progress tracking

## Key Principles

**Documentation-Driven Development**
- Comprehensive `CLAUDE.md` files provide consistent context
- Reference materials support complex decision-making
- Templates ensure consistent issue structure and quality

**Systematic Planning**
- Separate planning from execution for better outcomes
- Break complex features into manageable issues
- Maintain clear dependency tracking and progress visibility

**Automated Execution**
- Claude Code handles routine implementation tasks
- Consistent branching, committing, and PR/MR creation
- Reduces manual overhead while maintaining quality standards

**Iterative Improvement**
- Regular review and refinement of AI-generated work
- Continuous update of documentation and templates
- Feedback loops to improve AI effectiveness over time

## Benefits

**Efficiency Gains**
- Reduced context-switching between planning and implementation
- Consistent code quality through documented standards
- Faster feature delivery with systematic approach

**Quality Improvements**
- Comprehensive documentation reduces misunderstandings
- Systematic planning catches issues early
- Consistent implementation patterns improve maintainability

**Team Scalability**
- New team members can understand system through `CLAUDE.md` files
- Standardized processes reduce onboarding time
- AI assistance allows focus on high-value architectural decisions

## Maintenance & Evolution

**Documentation Maintenance**
- Update `CLAUDE.md` files when architectural changes occur
- Refine templates based on AI performance and team feedback
- Keep reference materials current and relevant

**Process Refinement**
- Regular retrospectives on AI-assisted development effectiveness
- Adjust templates and workflows based on project learnings
- Evolve integration patterns as tools and capabilities improve