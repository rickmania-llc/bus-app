# [FEATURE/BUG/ENHANCEMENT NAME] Issue Template

## Overview
[Provide a clear, concise description of what needs to be implemented/fixed. Describe the goal and what will be replaced/enhanced.]

## Current State
[Describe the current implementation and what specifically needs to change]

**Current Code Location**: `[file-path]` lines [start-end]
```[language]
[Current code snippet that needs modification]
// <-- [Comment indicating what needs to be changed]
```

## Requirements

### Primary Requirement
- [Main objective/goal of the issue]

### [Feature/System] Content/Requirements
The new [implementation/feature] should include:
1. **[Requirement 1]** - [Description]
2. **[Requirement 2]** - [Description]
3. **[Requirement 3]** - [Description]
4. **[Additional Requirements]** (as needed)

### [New Component/Script/Feature] Requirements
- **Location**: `[file-path]`
- **Functionality**: [What it should do]
- **Output Format**: [Expected output format]
- **Error Handling**: [Error handling requirements]
- **Performance**: [Performance requirements and constraints]

## Technical Implementation Plan

### Phase 1: [Phase Name]
[Describe first phase of implementation]:
- [Task 1]
- [Task 2]
- [Task 3]
- [Task 4]

### Phase 2: [Phase Name]
[Describe second phase]:
- TODO: [Task 1]
- TODO: [Task 2]
- TODO: [Task 3]
- TODO: [Task 4]

### Phase 3: [Phase Name]
[Describe third phase]:
- TODO: [Task 1]
- TODO: [Task 2]
- TODO: [Task 3]
- TODO: [Task 4]

### Phase 4: [Phase Name]
[Describe final phase]:
- TODO: [Task 1]
- TODO: [Task 2]
- TODO: [Task 3]
- TODO: [Task 4]

## File References

### Core [System/Feature] Files
- `[file-path]` - [Description of file's role]
- `[file-path]` - [Description of file's role]
- `[file-path]` - [Description of file's role]

### Documentation References
- `[docs-path]` - [Description of documentation]
- `[docs-path]` - [Description of documentation]

### Existing [Related] Files (Patterns to Follow)
- `[file-path]` - [Description and pattern to follow]
- `[file-path]` - [Description and pattern to follow]
- `[file-path]` - [Description and pattern to follow]

### [System] Integration Points
- **[Integration Point 1]**: [Description of how systems connect]
- **[Integration Point 2]**: [Description of integration]
- **[Integration Point 3]**: [Description of integration]

## Implementation TODOs

### [Component/Script] Development TODOs
- [ ] [Specific implementation task with function/method name]
- [ ] [Specific implementation task with function/method name]
- [ ] [Specific implementation task with function/method name]
- [ ] [Specific implementation task with function/method name]
- [ ] [Specific implementation task with function/method name]
- [ ] [Specific implementation task with function/method name]
- [ ] [Specific implementation task with function/method name]
- [ ] [Specific implementation task with function/method name]
- [ ] [Specific implementation task with function/method name]

### [System] Integration TODOs
- [ ] [Integration task with specific file/function]
- [ ] [Integration task with specific technology/module]
- [ ] [Integration task with specific replacement/modification]
- [ ] [Integration task with error handling]
- [ ] [Integration task with format/safety requirements]
- [ ] [Integration task with testing/validation]

### Testing and Validation TODOs
- [ ] [Testing task for integration/functionality]
- [ ] [Testing task for error scenarios]
- [ ] [Testing task for performance requirements]
- [ ] [Testing task for format/data validation]
- [ ] [Testing task for concurrent/edge cases]

### **MANDATORY: Documentation Update TODOs**
- [ ] **Update CLAUDE.md files**: Update all relevant directory-level `CLAUDE.md` files to reflect new functions, files, or architectural changes
- [ ] **Identify affected directories**: List all directories whose `CLAUDE.md` files require updates
- [ ] **Document new functions**: Add descriptions of any new functions with their purpose, inputs, and outputs
- [ ] **Document new files**: Add any new files to the appropriate `CLAUDE.md` with their role and key functions
- [ ] **Update architectural notes**: Modify architectural patterns or dependency information if changed
- [ ] **Verify documentation accuracy**: Ensure all `CLAUDE.md` updates accurately reflect the implemented changes

## Acceptance Criteria

### Functional Acceptance
1. **[Criteria 1]**: [Specific measurable outcome]
2. **[Criteria 2]**: [Specific measurable outcome]
3. **[Criteria 3]**: [Specific measurable outcome]
4. **[Criteria 4]**: [Specific measurable outcome]
5. **[Criteria 5]**: [Specific measurable outcome]

### Performance Acceptance  
1. **[Performance Metric 1]**: [Specific performance requirement with measurable target]
2. **[Performance Metric 2]**: [Specific performance requirement with measurable target]
3. **[Performance Metric 3]**: [Specific performance requirement with measurable target]

### Quality Acceptance
1. **[Quality Aspect 1]**: [Specific quality requirement]
2. **[Quality Aspect 2]**: [Specific quality requirement]
3. **[Quality Aspect 3]**: [Specific quality requirement]
4. **[Quality Aspect 4]**: [Specific quality requirement]

### **MANDATORY: Documentation Acceptance**
1. **CLAUDE.md Updates Complete**: All relevant directory-level `CLAUDE.md` files have been updated with new functions, files, and architectural changes
2. **Documentation Accuracy**: Updated documentation accurately reflects implemented functionality and follows established format
3. **Completeness Check**: No new functions or files are missing from appropriate `CLAUDE.md` files
4. **Architectural Consistency**: Any architectural changes are reflected in relevant documentation

## Development Notes

### [Component] Pattern to Follow
Reference existing [similar components] like `[example-file]` for:
- [Pattern/approach 1]
- [Pattern/approach 2]
- [Pattern/approach 3]
- [Pattern/approach 4]

### Integration Pattern
Follow existing patterns in `[file-name]` for:
- [Pattern/approach 1]
- [Pattern/approach 2]
- [Pattern/approach 3]

## CLAUDE.md Update Requirements

**This section MUST be completed as part of issue implementation:**

### Directories Requiring CLAUDE.md Updates
- `[directory-path]` - [Reason for update: new file, new functions, architectural change]
- `[directory-path]` - [Reason for update: new file, new functions, architectural change]
- `[directory-path]` - [Reason for update: new file, new functions, architectural change]

### New Functions to Document
List all new functions that must be added to appropriate `CLAUDE.md` files:
- `[function-name]` in `[file-path]` - [Brief description of purpose and parameters]
- `[function-name]` in `[file-path]` - [Brief description of purpose and parameters]

### New Files to Document
List all new files that must be added to appropriate `CLAUDE.md` files:
- `[file-path]` - [Description of file's purpose and key functions]
- `[file-path]` - [Description of file's purpose and key functions]

### Architectural Changes to Document
- [Description of any architectural pattern changes]
- [Description of any new dependencies or integration points]
- [Description of any workflow changes]

## Implementation Instructions for Claude Code

**CRITICAL: During implementation, you MUST:**

1. **Before making any commits**: Update all identified `CLAUDE.md` files with new functions, files, and architectural changes
2. **For each new function**: Add entry to appropriate `CLAUDE.md` following the established format
3. **For each new file**: Add file description to relevant directory's `CLAUDE.md`
4. **For architectural changes**: Update relevant sections in affected `CLAUDE.md` files
5. **Commit documentation updates**: Include `CLAUDE.md` updates in your commits alongside code changes
6. **Verify completeness**: Ensure no new functionality is missing from documentation before final commit

**Documentation updates are not optional - they are required for issue completion.**