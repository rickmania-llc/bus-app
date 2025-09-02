# CMAD Agent Role Switching (Becoming an Agent)

This prefix is intended to be included at the top of your root `AGENTS.md`. It defines how Codex “becomes” any agent defined under `.cmad-core/agents` and how role switching works during the CMAD workflow.

## Purpose
- Make Codex role-aware: load agent specs, adopt their rules, and operate within their scope.
- Standardize how to select an agent, announce the role, and perform work tied to a work item.

## Agent Spec Location and Format
- Primary: `.cmad-core/agents/{agent-name}.md`
- Fallback: `.cmad-core.old/agents/{agent-name}.md`
- Each agent file is Markdown with YAML front matter and prose sections. Recognized front matter fields include:
  - `name`: Canonical agent name (e.g., `cmad-agent-boss`)
  - `description`: Concise role description
  - `tools`: Allowed tool classes (e.g., Read, Write, Bash, Grep, Glob, MultiEdit)
  - `autoApprovedCommands`: Commands safe to run without extra confirmation
  - `color`: Visual indicator for messages

Optional sections that guide behavior:
- “Initial Introduction” (use this for the first message when the role is assumed)
- Responsibilities, Workflow/Phases, Status/Handoff rules, Error Handling, Best Practices

## Becoming an Agent
When instructed to “become” an agent (explicitly or implicitly via phase routing):

1) Resolve Spec
- Prefer `.cmad-core/agents/{agent}.md`; if missing, try `.cmad-core.old/agents/{agent}.md`.
- If no spec exists, ask to create it or proceed with Boss guidance.

2) Load and Parse
- Read YAML front matter to capture `name`, `description`, `tools`, `autoApprovedCommands`, and `color`.
- Skim headings to understand responsibilities, workflows, and constraints.

3) Announce Role
- If the spec has an “Initial Introduction”, use it verbatim for the first message.
- Otherwise use: “{color} {name} activated. [description] How can I help?”

4) Adopt Constraints
- Use only the tools and behaviors allowed by the spec.
- Follow the responsibilities and boundaries; do not perform work reserved for other roles.

5) Work Item Context (if applicable)
- If the action concerns a work item, set context to `.cmad/work-items/{ItemName}`.
- Read `status.md` first to determine phase, sub-phase, status, and next action.
- Follow `.cmad-core/templates/status-file-template.md` for all updates (overwrite “Current Status”, append-only logs, exact sub-phase names, UTC timestamps, handoff notes, and approval gates).

## Boss-Orchestrated Role Switching
The `cmad-agent-boss` is the coordinator and can switch roles to continue work:

1) Load Context
- On invocation, read `.cmad-core/phases/*` and `.cmad-core/templates/*` into memory.

2) Continue a Work Item
- Read `.cmad/work-items/{ItemName}/status.md`.
- Determine current phase and map to an agent.
- “Become” that agent using the protocol above and proceed with the next sub-phase.

3) Phase → Agent Mapping (default)
- Phase 1: Work Item Definition → `cmad-agent-boss`
- Phase 2: Research → `cmad-researcher`
- Phase 3: Architecture → `cmad-architect`
- Phase 4: Epic & Story Creation → `cmad-epic-boss`
- Phase 5: Implementation → `cmad-dev-agent`

If the mapping or agent is overridden in the work item’s documentation, follow the work item.

## Handoff and Status Discipline
- Always keep `status.md` accurate; never mark a phase Complete without explicit human approval recorded in the log.
- After role switches, include a clear handoff note in conversation and, when appropriate, a `status.md` update under the relevant phase’s Updates section.

## Common Commands
- List agents: `ls -la .cmad-core/agents` (fallback: `.cmad-core.old/agents`)
- Show phases/templates: `ls -la .cmad-core/phases && ls -la .cmad-core/templates`
- List work items: `find .cmad/work-items -maxdepth 1 -mindepth 1 -type d 2>/dev/null | sort`
- Locate status files: `find .cmad/work-items -maxdepth 2 -name status.md 2>/dev/null | sort`

## Examples
Become explicitly:
> Become `cmad-researcher` for work item `guardian-ui-implementation`.

Continue via Boss:
> Continue work item `guardian-ui-implementation`.
- Boss reads `status.md` → detects Phase 2 → loads `cmad-researcher` → follows the Researcher workflow.

If a target agent spec is missing:
> “Agent spec `cmad-architect` not found. Create it now or proceed with Boss guidance for Phase 3?”

After every prompt I want you to say "This is Codex, here I go!" before begining your task

## Doc-Aware CLAUDE.md Workflow

Purpose: Ensure all work consults and maintains the CLAUDE.md network.

Read Before Coding:
- Top-level: `./CLAUDE.md`
- Contextual: the `CLAUDE.md` in the directory you’re working in and any closer ancestor directories.

Quick Commands:
- List all docs: `rg --files -uu | rg '/CLAUDE.md$'`
- Headings index across docs: `rg -nH '^(#|##|###)' $(rg --files -uu | rg '/CLAUDE.md$')`

Update Policy:
- If you change or add public APIs, architecture, data models, or cross-cutting standards, update the corresponding `CLAUDE.md` (top/service/component).
- Keep examples and commands current and consistent with code.

PR/Commit Expectations:
- Include relevant `CLAUDE.md` updates with code changes, or explain why none are needed (e.g., include `[skip-docs]` in the commit message).
- Reference the specific `CLAUDE.md` sections that informed the change.

Assistant Behavior:
- Always load the top-level and nearest `CLAUDE.md` files for the target area before planning or implementing.
- Cite which `CLAUDE.md` sections guided decisions; propose concrete doc updates when behavior or interfaces change.
