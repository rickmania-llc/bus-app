# Work Item Directory Template

## Overview
This template defines the standard directory structure for CMAD work items. Each work item represents a single overarching task, from simple single-story tasks to complex features requiring epics and multiple stories.

## Directory Structure
```
.cmad/work-items/{ItemName}/
├── goals.md              # Work item goals and requirements
├── status.md             # Current status and phase tracking
├── research/             # Research phase artifacts
│   ├── requirements.md   # Research requirements document
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

## Status.md Format and Instructions

### Purpose
The status.md file is the single source of truth for work item progress. It tracks the current phase, blockers, decisions, and provides quick navigation to relevant artifacts.

### File Structure

**IMPORTANT**: This example shows a COMPLETED work item for reference. When creating a NEW work item:
- Start with ONLY Phase 1 section
- Do NOT create sections for future phases
- Add new phase sections only when entering that phase

```markdown
# Work Item Status: {ItemName}

## Current Status
**Phase:** {number} - {phase name}
**Sub-Phase:** {MUST be one of the checkbox items from the phase below, e.g., "Work item structure created"}
**Status:** {In Progress | Awaiting Human Approval | Complete}
**Last Updated:** {timestamp}
**Updated By:** {agent-name}
**Next Action:** {description of next step}

---

## Status Update Log

### Phase 1: Work Item Definition
VALID SUB-PHASES (use these exact phrases in Current Status Sub-Phase field):
- [ ] Work item structure created
- [ ] Goals documented
- [ ] Complete (requires human approval)

**Updates:**
- {timestamp} - {agent-name}: Phase started
- {timestamp} - {agent-name}: Created work item directory structure
- {timestamp} - {agent-name}: Documented goals in goals.md
```

**EXAMPLE OF COMPLETED WORK ITEM (DO NOT COPY FOR NEW ITEMS):**

```markdown
### Phase 1: Work Item Definition
- [x] Work item structure created
- [x] Goals documented
- [x] Complete (human approved)

**Updates:**
- 2024-01-01 10:00 UTC - cmad-agent-boss: Phase started
- 2024-01-01 10:05 UTC - cmad-agent-boss: Created work item directory structure
- 2024-01-01 10:15 UTC - cmad-agent-boss: Documented goals in goals.md
- 2024-01-01 10:20 UTC - Human: Approved - proceed to Phase 2
- 2024-01-01 10:21 UTC - cmad-agent-boss: Handoff: Work item ready for research phase

---

### Phase 2: Research
VALID SUB-PHASES:
- [x] Research requirements defined
- [x] Document 1: authentication-analysis complete
- [x] Document 2: competitor-review complete
- [x] Complete (human approved)

**Updates:**
- 2024-01-02 09:00 UTC - research-agent: Phase started
(etc...)

---


### Status Values

#### Phases
- **Phase 0:** Documentation Network
- **Phase 1:** Work Item Definition  
- **Phase 2:** Research
- **Phase 3:** Architecture
- **Phase 4:** Epic & Story Creation
- **Phase 5:** Implementation

#### Status Within Phase
- **Not Started:** Phase not yet begun
- **In Progress:** Actively working
- **Blocked:** Waiting on external dependency
- **Under Review:** Awaiting approval/feedback
- **Completed:** Phase requirements met
- **Skipped:** Phase not applicable for this work item

### Update Instructions

1. **When to Update:**
   - On phase transitions
   - When sub-phase items are completed
   - When requesting human approval
   - At agent handoffs
   - When blockers are identified/resolved

2. **Who Updates:**
   - The active agent working on the phase
   - Human when approving phase completion
   - Agent Boss during transitions

3. **Update Process:**
   - Update "Current Status" section (overwrite previous)
   - Add timestamped entry to relevant phase's "Updates" section
   - Check off completed sub-phase items
   - Mark phase as "Awaiting Human Approval" when all sub-phases complete
   - Only mark as "Complete" after human approval
   - Add "Handoff:" entry after phase completion with context for next agent

4. **Sub-Phase Management:**
   - Sub-phases are dynamically defined based on phase requirements
   - Example: Research phase defines number of docs needed in requirements.md
   - Each sub-phase completion gets its own update entry
   - All sub-phases must complete before requesting human approval

5. **Critical Rules:**
   - **NEVER mark a phase as Complete without human approval**
   - Always add updates to the log (never delete history)
   - Current Status section is overwritten with each update
   - Sub-phases are determined by the initial phase step
   - Include enough context in updates for audit trail

### Example Status Update
```markdown
## Current Status
**Phase:** Research
**Sub-Phase:** Document 2 in progress
**Status:** In Progress
**Last Updated:** 2024-01-15 14:30 UTC
**Updated By:** research-agent
**Next Action:** Complete competitor analysis document
```

## Work Item Initialization

When creating a new work item:

1. Copy this entire directory structure
2. Rename {ItemName} to actual work item name
3. Initialize status.md with ONLY Phase 1 section (no future phases)
4. Create initial goals.md from requirements
5. Set Phase 1 checkboxes to unchecked
6. Add creation timestamp and creating agent

### Initial status.md Structure for NEW Work Items

```markdown
# Work Item Status: {ItemName}

## Current Status
**Phase:** 1 - Work Item Definition
**Sub-Phase:** Work item structure created
**Status:** In Progress
**Last Updated:** {timestamp}
**Updated By:** cmad-agent-boss
**Next Action:** Document goals in goals.md

---

## Status Update Log

### Phase 1: Work Item Definition
- [x] Work item structure created
- [ ] Goals documented
- [ ] Complete (requires human approval)

**Updates:**
- {timestamp} - cmad-agent-boss: Phase started
- {timestamp} - cmad-agent-boss: Created work item directory structure
```

**DO NOT add Phase 2, 3, 4, or 5 sections until entering those phases!**

## Templates for Sub-Documents

### goals.md Template
```markdown
# Work Item Goals: {ItemName}

## Objective
{One paragraph description of what we're trying to achieve}

## Success Criteria
1. {Measurable criterion}
2. {Measurable criterion}
3. {Measurable criterion}

```

### research/requirements.md Template
```markdown
# Research Requirements

## Context Needed
What information do we need to gather before we can architect and implement this feature?

## Research Tasks
1. **Task:** {Description}
   **Purpose:** {Why we need this}
   **Output:** {What artifact will be produced}

2. **Task:** {Description}
   **Purpose:** {Why we need this}
   **Output:** {What artifact will be produced}

```

## Agent Responsibilities by Phase

### Phase 1: Agent Boss
- Creates work item directory
- Initializes status.md
- Documents initial goals

### Phase 2: Research Agent
- Creates research requirements
- Conducts research
- Documents findings
- Updates status on completion

### Phase 3: Architecture Agent
- Reviews research
- Creates system design
- Documents decisions
- Identifies risks

### Phase 4: Epic Boss / Scrum Master
- Breaks down work into epics/stories
- Sets priorities
- Maps dependencies
- Creates story files

### Phase 5: Dev Agent
- Implements stories
- Writes tests
- Updates documentation
- Manages code reviews