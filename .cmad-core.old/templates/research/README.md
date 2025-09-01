# Research Document Templates

This directory contains templates for creating comprehensive research and analysis documents. These templates are designed to ensure consistency and thoroughness in technical documentation across different types of analysis.

## Available Templates

### 1. Feature Analysis Template (`feature-analysis-template.md`)
**Purpose**: Deep-dive analysis of specific features or components within a system.

**Use When**:
- Analyzing how a specific feature works
- Documenting complex functionality
- Understanding component interactions
- Researching implementation details

**Key Sections**:
- Executive Summary
- Key Distinctions
- Implementation Details
- Database/Data Structures
- Frontend/Backend Integration
- Security Considerations
- Best Practices

### 2. System Documentation Template (`system-documentation-template.md`)
**Purpose**: Comprehensive documentation of entire systems or major modules.

**Use When**:
- Documenting a complete system architecture
- Creating reference documentation
- Onboarding new developers
- System handover documentation

**Key Sections**:
- Architecture Components
- Authentication/Authorization
- Data Flow and State Management
- API Layer
- Security Model
- Configuration and Setup
- Implementation Patterns

### 3. Agent Specification Template (`agent-specification-template.md`)
**Purpose**: Define and document AI agent behaviors, workflows, and responsibilities.

**Use When**:
- Creating new AI agents
- Documenting agent capabilities
- Defining agent workflows
- Establishing agent standards

**Key Sections**:
- Core Responsibilities
- Workflow Phases
- Standards and Guidelines
- Communication Style
- Error Handling
- Best Practices

### 4. Quick Analysis Template (`quick-analysis-template.md`)
**Purpose**: Rapid analysis and documentation of smaller features or issues.

**Use When**:
- Time-constrained analysis
- Quick feature exploration
- Bug investigation
- Initial reconnaissance

**Key Sections**:
- Overview
- Key Components
- Implementation Pattern
- Key Findings
- Recommendations

### 5. Comparative Analysis Template (`comparative-analysis-template.md`)
**Purpose**: Side-by-side comparison of different approaches, systems, or solutions.

**Use When**:
- Evaluating technology choices
- Comparing implementation approaches
- Migration planning
- Decision documentation

**Key Sections**:
- Comparison Overview
- Detailed Comparison
- Use Case Analysis
- Advantages/Disadvantages
- Decision Matrix
- Recommendations

## Template Usage Guidelines

### Selecting the Right Template

1. **Scope Assessment**:
   - Single feature → Feature Analysis
   - Entire system → System Documentation
   - Multiple options → Comparative Analysis
   - Time-limited → Quick Analysis
   - Agent definition → Agent Specification

2. **Audience Consideration**:
   - Technical team → Include code examples
   - Management → Focus on executive summary
   - External users → Emphasize use cases

3. **Depth Requirements**:
   - High detail → Feature/System templates
   - Overview only → Quick Analysis
   - Decision support → Comparative Analysis

### Best Practices for Using Templates

1. **Don't Skip Sections**: Even if brief, address each section
2. **Use Real Examples**: Include actual code/configuration from the project
3. **Maintain Consistency**: Use the same terminology throughout
4. **Include File Paths**: Always reference specific files with line numbers
5. **Add Visual Aids**: Use diagrams, tables, and code blocks
6. **Update Regularly**: Keep research documents current with code changes

### Customization Guidelines

These templates are starting points. Feel free to:
- Add sections relevant to your specific analysis
- Remove sections that don't apply
- Adjust the depth based on your needs
- Combine templates for hybrid documentation

### Quality Checklist

Before finalizing any research document:

- [ ] Executive summary is clear and concise
- [ ] All code examples include file paths
- [ ] Technical terms are defined or linked
- [ ] Recommendations are actionable
- [ ] Security considerations are addressed
- [ ] Document is spell-checked
- [ ] Links and references are valid
- [ ] Diagrams/tables are properly formatted

## Document Naming Convention

When creating research documents from these templates:

```
[date]-[topic]-[type].md

Examples:
2024-01-15-authentication-feature-analysis.md
2024-01-16-frontend-system-documentation.md
2024-01-17-react-vs-vue-comparative-analysis.md
2024-01-18-api-endpoints-quick-analysis.md
```

## Integration with CMAD Workflow

These templates integrate with the CMAD (Claude-assisted Modern Application Development) workflow:

1. **Discovery Phase**: Use Quick Analysis template
2. **Planning Phase**: Use Comparative Analysis for decisions
3. **Implementation Phase**: Create Feature Analysis for complex features
4. **Documentation Phase**: Use System Documentation template
5. **Agent Creation**: Use Agent Specification template

## Maintenance

Templates should be reviewed and updated:
- Quarterly for general improvements
- After major project completions for lessons learned
- When new documentation patterns emerge
- Based on team feedback

## Contributing

To suggest improvements to these templates:
1. Create a research document using the template
2. Note areas for improvement
3. Submit suggestions with examples
4. Include rationale for changes

## Version History

- **v1.0.0** (2024-01): Initial template creation based on analysis of existing research documents
- Templates derived from actual project research in bus-app system
- Patterns identified from notify-role, frontend-roles, and cmad-project-analyst documents