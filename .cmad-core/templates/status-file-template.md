# Status File Template

## Purpose
The status.md file is the single source of truth for work item progress. It tracks the current phase, sub-phases, blockers, and provides an audit trail of all changes.

## File Format

```markdown
# Work Item Status: {ItemName}

## Current Status
**Phase:** {number} - {phase name}
**Sub-Phase:** {current sub-phase from checklist below}
**Status:** {In Progress | Awaiting Human Approval | Awaiting Human Input | Complete}
**Last Updated:** {YYYY-MM-DD HH:MM UTC}
**Updated By:** {agent-name}
**Next Action:** {brief description of immediate next step}

---

## Status Update Log

### Phase {N}: {Phase Name}
- [ ] {Sub-phase 1}
- [ ] {Sub-phase 2}
- [ ] {Sub-phase 3}
- [ ] Complete (requires human approval)

**Updates:**
- {timestamp} - {updater}: {action taken}
- {timestamp} - {updater}: {action taken}
```

## Update Instructions

### When to Update
1. On phase transitions
2. When sub-phase items are completed
3. When requesting human approval or input
4. At agent handoffs
5. When blockers are identified or resolved

### How to Update

#### Current Status Section
- **ALWAYS OVERWRITE** the entire Current Status section with latest information
- Use exact sub-phase names from the checkbox list
- Include accurate timestamp in UTC format
- Specify who made the update (agent name or "human")

#### Status Update Log
- **NEVER DELETE** previous log entries - only append new ones
- Add new phases as they begin (don't pre-create future phases)
- Check off completed sub-phases with `[x]`
- Add timestamped entries under the relevant phase's **Updates:** section

### Update Format Examples

#### Starting a Sub-Phase
```markdown
## Current Status
**Phase:** 2 - Research
**Sub-Phase:** Document 1 in progress
**Status:** In Progress
**Last Updated:** 2024-01-15 14:30 UTC
**Updated By:** cmad-researcher
**Next Action:** Complete analysis of existing system

**Updates:**
- 2024-01-15 14:30 UTC - cmad-researcher: Started Document 1 research
```

#### Completing a Sub-Phase
```markdown
## Current Status
**Phase:** 2 - Research
**Sub-Phase:** Document 1 complete
**Status:** In Progress
**Last Updated:** 2024-01-15 16:45 UTC
**Updated By:** cmad-researcher
**Next Action:** Begin Document 2 research

### Phase 2: Research
- [x] Document 1: system-analysis.md
- [ ] Document 2: competitive-analysis.md

**Updates:**
- 2024-01-15 16:45 UTC - cmad-researcher: Completed Document 1 at research/document-1-system-analysis.md
```

#### Requesting Human Approval
```markdown
## Current Status
**Phase:** 1 - Work Item Definition
**Sub-Phase:** Goals documented
**Status:** Awaiting Human Approval
**Last Updated:** 2024-01-15 10:20 UTC
**Updated By:** cmad-agent-boss
**Next Action:** Human review and approval of Phase 1

### Phase 1: Work Item Definition
- [x] Work item structure created
- [x] Goals documented
- [ ] Complete (requires human approval)
```

#### Human Approval Entry
```markdown
**Updates:**
- 2024-01-15 11:00 UTC - human: Approved Phase 1 - proceed to Phase 2
- 2024-01-15 11:01 UTC - cmad-agent-boss: Handoff - Phase 2 ready for research requirements
```

## Critical Rules

1. **Current Status Overwrite**: The Current Status section is ALWAYS completely overwritten with each update
2. **Log Append Only**: The Status Update Log is NEVER edited or deleted, only appended to
3. **Phase Addition**: Add new phase sections only when entering that phase (not before)
4. **Sub-Phase Accuracy**: Sub-Phase field MUST exactly match one of the checkbox items
5. **Timestamp Format**: Always use YYYY-MM-DD HH:MM UTC format
6. **Handoff Notes**: Include context for next agent after phase completion
7. **Human Approval**: Never mark a phase as Complete without explicit human approval

## Status Values

### Phase Status Options
- **In Progress**: Actively working on phase
- **Awaiting Human Approval**: All sub-phases complete, needs human review
- **Awaiting Human Input**: Blocked waiting for human to provide information
- **Complete**: Human has approved phase completion

### Initial Status for New Work Items

When creating a new work item, initialize with:

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
- {timestamp} - cmad-agent-boss: Created work item directory structure
```

## Common Mistakes to Avoid

❌ Pre-creating sections for future phases
❌ Editing or deleting log entries
❌ Using informal sub-phase descriptions instead of exact checkbox text
❌ Marking phases complete without human approval
❌ Forgetting to update the Current Status section
❌ Missing handoff notes between phases
❌ Using incorrect timestamp formats