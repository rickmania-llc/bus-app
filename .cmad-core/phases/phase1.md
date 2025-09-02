# Phase 1: Work Item Definition

## Valid Sub-Phases for Status.md

The following are the ONLY valid values for the Sub-Phase field in status.md during Phase 1:

1. `Work item structure created`
2. `Goals documented`
3. `Complete (requires human approval)`

## Sub-Phase Overview

**Work item structure created**
- The work item directory has been created at `.cmad/work-items/{ItemName}/`
- Initial status.md file has been created
- Basic directory structure is in place

**Goals documented**
- The goals.md file has been created
- Work item objectives and success criteria have been documented
- Requirements from human have been captured

**Complete (requires human approval)**
- All Phase 1 tasks are complete
- Awaiting human review and approval to proceed to Phase 2
- Work item is ready for research phase planning

## Sub-Phase Instructions

### Sub-Phase 1: Work item structure created

**Agent:** cmad-agent-boss

**Actions to Complete:**

1. **Create work item directory structure**
   ```bash
   mkdir -p .cmad/work-items/{ItemName}
   mkdir -p .cmad/work-items/{ItemName}/research
   mkdir -p .cmad/work-items/{ItemName}/architecture
   mkdir -p .cmad/work-items/{ItemName}/epics
   mkdir -p .cmad/work-items/{ItemName}/stories
   mkdir -p .cmad/work-items/{ItemName}/stories/completed
   ```
   
   Note: Create ALL directories even though they will be empty initially. This ensures consistent structure across all work items.

2. **Create initial status.md file**
   - Use template from `.cmad-core/templates/status-file-template.md`
   - Set Phase to: `1 - Work Item Definition`
   - Set Sub-Phase to: `Work item structure created`
   - Set Status to: `In Progress`
   - Add creation timestamp to Updates log

3. **Update status.md after completion**
   - Check off `[x] Work item structure created` in Phase 1 checklist
   - Update Sub-Phase to: `Goals documented`
   - Update Next Action to: `Document goals in goals.md`
   - Add completion timestamp to Updates log

### Sub-Phase 2: Goals documented

**Agent:** cmad-agent-boss

**Actions to Complete:**

1. **Create goals.md file**
   - Location: `.cmad/work-items/{ItemName}/goals.md`
   - Use MINIMAL template structure:
     ```markdown
     # Work Item Goals: {ItemName}
     
     ## Objective
     {One brief paragraph using the human's exact description}
     
     ## Success Criteria
     {ONLY include criteria explicitly stated by human}
     1. {Criterion from human's request}
     2. {Criterion from human's request}
     ```

    2. **Goals Authoring Guidelines (updated)**
       - Use the human's wording as the foundation for the Objective
       - Light expansion is allowed to clarify scope and intent
       - You MAY infer a short, concrete Success Criteria list based on context
       - Keep it concise; avoid locking in implementation details prematurely
       - Clearly reflect the product/user outcomes the human intends

3. **Update status.md after completion**
   - Check off `[x] Goals documented` in Phase 1 checklist
   - Update Sub-Phase to: `Complete (requires human approval)`
   - Update Status to: `Awaiting Human Approval`
   - Update Next Action to: `Human review and approval of Phase 1`
   - Add completion timestamp to Updates log

### Sub-Phase 3: Complete (requires human approval)

**Agent:** cmad-agent-boss (monitoring) / Human (approval)

**Actions Required:**

1. **Agent Boss responsibilities**
   - Ensure status shows `Awaiting Human Approval`
   - Inform human that Phase 1 is ready for review
   - Provide summary of what was created:
     - Work item directory structure
     - Goals documented in goals.md
   - Wait for human approval

2. **Human approval process**
   - Human reviews goals.md
   - Human provides approval or requests changes
   - If approved, human indicates: "Approved - proceed to Phase 2"

3. **After human approval**
   - Agent Boss updates status.md:
     - Check off `[x] Complete (requires human approval)`
     - Add human approval to Updates log with timestamp
     - Add handoff note for Phase 2
     - DO NOT add Phase 2 section yet (only when Phase 2 begins)
   - Inform human that Phase 1 is complete

**IMPORTANT:** Agent Boss must NEVER mark this complete without explicit human approval in the conversation.
