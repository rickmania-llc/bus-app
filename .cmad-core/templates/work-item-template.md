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
VALID SUB-PHASES (use these exact phrases in Current Status Sub-Phase field):
- [ ] Work item structure created
- [ ] Goals documented
- [ ] Complete (human approved)

**Updates:**
- 2024-01-01 10:00 UTC - cmad-agent-boss: Phase started
- 2024-01-01 10:05 UTC - cmad-agent-boss: Created work item directory structure
- 2024-01-01 10:15 UTC - cmad-agent-boss: Documented goals in goals.md
- 2024-01-01 10:20 UTC - Human: Approved - proceed to Phase 2
- 2024-01-01 10:21 UTC - cmad-agent-boss: Handoff: Work item ready for research phase

---

### Phase 2: Research
VALID SUB-PHASES (use these exact phrases in Current Status Sub-Phase field):
- [ ] Creating research requirements (AWAITING HUMAN INPUT)
- [ ] Research requirements defined (by human)
- [ ] Document 1: {document-name} complete
- [ ] Document 2: {document-name} complete
- [ ] Complete (requires human approval)

**CRITICAL PHASE 2 PROCESS:**
1. Agent Boss transitions to Phase 2 and sets sub-phase to "Creating research requirements (AWAITING HUMAN INPUT)"
2. Status MUST be set to "Awaiting Human Input"
3. Agent creates empty template at: `{work-item-dir}/research/requirements.md`
4. Human developer fills in research requirements in `research/requirements.md` (NOT in root directory)
5. Only AFTER human provides requirements: Research Agent begins work
6. Research Agent conducts research based ONLY on human's requirements
7. Research Agent creates documents as specified by human in the `research/` directory

**Updates:**
- 2024-01-02 09:00 UTC - cmad-agent-boss: Phase 2 started - awaiting human research requirements
- 2024-01-02 10:00 UTC - Human: Provided research requirements in research/requirements.md
- 2024-01-02 10:05 UTC - research-agent: Beginning research based on human requirements
(etc...)

---


### Status Values

#### Phases
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

**IMPORTANT INSTRUCTIONS FOR AGENTS:**
- Keep goals.md CONCISE and MINIMAL
- Only include information EXPLICITLY provided by the human
- Do NOT infer or add additional details
- Do NOT expand on requirements unless specifically given

```markdown
# Work Item Goals: {ItemName}

## Objective
{One brief paragraph using only the human's exact description}

## Success Criteria
{Only include criteria explicitly stated by human}
1. {Criterion from human's request}
2. {Criterion from human's request}
3. {Criterion from human's request}

```

### research/requirements.md Template

**PATH:** `{work-item-directory}/research/requirements.md`
**IMPORTANT:** This template is created by the agent at the correct path above. The CONTENT must be filled by the HUMAN DEVELOPER, not by agents.

```markdown
# Research Requirements

## Status
**Created:** {timestamp}
**Status:** AWAITING HUMAN INPUT / READY FOR RESEARCH
**Human Developer:** {name or "Please fill in requirements below"}

## Context Needed
[TO BE PROVIDED BY HUMAN DEVELOPER]
What information do we need to gather before we can architect and implement this feature?

## Research Tasks
[TO BE PROVIDED BY HUMAN DEVELOPER]

1. **Task:** {Description}
   **Purpose:** {Why we need this}
   **Output:** {What artifact will be produced}

2. **Task:** {Description}
   **Purpose:** {Why we need this}
   **Output:** {What artifact will be produced}

## Instructions for Human Developer
Please replace the placeholder sections above with specific research requirements.
Once complete, update the Status to "READY FOR RESEARCH" and notify the Research Agent.
```

## Agent Responsibilities by Phase

### Phase 1: Agent Boss
- Creates work item directory
- Initializes status.md
- Documents initial goals

### Phase 2: Research Agent
- WAITS for human to provide research requirements first
- Agent creates template file at `{work-item}/research/requirements.md` for human to fill
- Human fills in research requirements in `research/requirements.md` (inside research/ subdirectory)
- Only after requirements are provided: Conducts research
- Documents findings based on human's requirements in `research/` directory
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