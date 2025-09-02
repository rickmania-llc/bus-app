# Work Item Directory Structure

## Overview
This template defines the standard directory structure for CMAD work items. Each work item represents a single overarching task, from simple single-story tasks to complex features requiring epics and multiple stories.

## Directory Structure
```
.cmad/work-items/{ItemName}/
├── goals.md              # Work item goals and requirements
├── status.md             # Current status and phase tracking
├── research/             # Research phase artifacts
│   ├── requirements.md   # Research requirements document (human-provided)
│   └── *.md              # Individual research documents
├── architecture/         # Architecture phase artifacts
│   └── *.md              # Individual architecture documents
├── epics/                # Epic definitions (if multi-story)
│   └── {epic-name}/
│       ├── definition.md
│       └── stories.md
├── stories/              # Individual story definitions
│   ├── {story-id}.md
│   └── completed/        # Completed stories archive
└── retrospective.md      # Post-completion analysis
```

## File Purposes

### Root Level Files

**goals.md**
- Contains work item objectives and success criteria
- Created in Phase 1 by Agent Boss
- Use the human’s wording as the foundation; allow light expansion for clarity and concise, outcome‑focused inferred success criteria

**status.md**
- Single source of truth for work item progress
- Tracks current phase, sub-phases, and blockers
- Contains audit trail of all updates
- Updated by active agents and humans

**retrospective.md**
- Created after work item completion
- Contains lessons learned and process improvements
- Optional file for continuous improvement

### Research Directory

**requirements.md**
- Template created by Agent Boss at start of Phase 2
- MUST be filled in by human developer
- Defines what research is needed before implementation
- Research Agent waits for this before starting work

**Research documents**
- Created by Research Agent based on requirements.md
- Named descriptively (e.g., `document-1-guardian-student-relationships.md`)
- Contains findings, analysis, and recommendations

### Architecture Directory

**Architecture documents**
- Created by Architecture Agent in Phase 3
- System design documents
- Technical decision records
- Risk assessments

### Epics Directory

**Epic definitions**
- Created by Epic Boss/Scrum Master in Phase 4
- Contains epic scope and acceptance criteria
- Includes story breakdown

### Stories Directory

**Story files**
- Individual implementation tasks
- Contains requirements, acceptance criteria, and technical notes
- Moved to `completed/` subdirectory when done

## Directory Creation Rules

1. **Initial Creation**: Create the work item root and all standard subdirectories during Phase 1 for consistency (`research/`, `architecture/`, `epics/`, `stories/`, `stories/completed/`).
2. **Phase Artifacts**: Populate phase-specific documents when entering that phase (e.g., research docs in Phase 2).
3. **File Naming**: Use descriptive names with appropriate prefixes (e.g., `document-1-`, `epic-`, `story-`).
4. **Path Consistency**: All work item files MUST be within the work item directory structure.
5. **No External Files**: Never create work item documents outside this structure.

## File Location Examples

### Correct Locations
✅ `.cmad/work-items/guardian-ui-implementation/research/document-1-analysis.md`
✅ `.cmad/work-items/guardian-ui-implementation/status.md`
✅ `.cmad/work-items/guardian-ui-implementation/goals.md`

### Incorrect Locations
❌ `docs/research/guardian-analysis.md` (outside work item structure)
❌ `.cmad/research/document.md` (not in work item directory)
❌ `guardian-ui-implementation/status.md` (missing .cmad/work-items prefix)
