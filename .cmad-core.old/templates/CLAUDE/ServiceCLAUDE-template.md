# [Service/Module Name] - [Brief Service Description]

## Directory Purpose
[Detailed description of what this service/module does, its role in the larger system, and its primary responsibilities. This should be 2-3 sentences that clearly explain why this service exists.]

## Architecture Notes

### Design Patterns
- **[Pattern Name]**: [Description of how it's used in this service]
- **[Pattern Name]**: [Description of how it's used in this service]
- **[Pattern Name]**: [Description of how it's used in this service]

### Technology Stack
- **Framework**: [Primary framework and version]
- **Language**: [Programming language and version]
- **Database**: [If applicable, database technology used]
- **Communication**: [Protocols/methods used for inter-service communication]
- **[Other Tech]**: [Other significant technologies]

### Key Integration Points
- **[Integration 1]**: [What it integrates with and how]
- **[Integration 2]**: [What it integrates with and how]
- **[Integration 3]**: [What it integrates with and how]

## Documentation Network

This directory contains comprehensive documentation organized by functional areas. Each subdirectory has its own CLAUDE.md file providing detailed information:

### Core Documentation
- **[src/component1/CLAUDE.md](src/component1/CLAUDE.md)**: [Description of what this covers]
- **[src/component2/CLAUDE.md](src/component2/CLAUDE.md)**: [Description of what this covers]
- **[src/component3/CLAUDE.md](src/component3/CLAUDE.md)**: [Description of what this covers]

### Quick Navigation Guide
1. **New to this service?** Start with this file, then explore [suggested next file]
2. **Working on [specific area]?** See [relevant CLAUDE.md]
3. **Making changes to [specific area]?** Check [relevant CLAUDE.md]

## Files Overview

### Entry Points

#### [main-file.ext]
**Purpose**: [What this file does]
**Key Functions**:
- [Function/responsibility 1]
- [Function/responsibility 2]
- [Function/responsibility 3]
**Usage**: [How/when this file is used]

#### [app-file.ext]
**Purpose**: [What this file does]
**Key Functions**:
- [Function/responsibility 1]
- [Function/responsibility 2]
**Usage**: [How/when this file is used]

### Core Components (`[directory]/`)

#### [component1/index.ext]
**Purpose**: [Component purpose]
**Endpoints/Methods**:
- `[METHOD] /path`: [Description]
- `[METHOD] /path`: [Description]
**Features**: [Key features]

#### [component2/index.ext]
**Purpose**: [Component purpose]
**Endpoints/Methods**:
- `[METHOD] /path`: [Description]
- `[METHOD] /path`: [Description]
**Features**: [Key features]

### Data Layer

#### Models (`[models-directory]/`)

**Core Entities**:
- `[entity1.ext]`: [Description]
- `[entity2.ext]`: [Description]
- `[entity3.ext]`: [Description]

**Supporting Entities**:
- `[entity4.ext]`: [Description]
- `[entity5.ext]`: [Description]

**Relationships**:
- [Relationship description]
- [Relationship description]

#### Controllers/Handlers (`[controllers-directory]/`)
Each controller provides:
- [Responsibility 1]
- [Responsibility 2]
- [Responsibility 3]

#### Services (`[services-directory]/`)
Services abstract:
- [Abstraction 1]
- [Abstraction 2]
- [Abstraction 3]

### Communication Layer (`[network-directory]/`)

#### [handler1.ext]
**Purpose**: [What this handles]
**Key Functions**:
- `functionName()`: [What it does]
- `functionName()`: [What it does]
**Topics/Events**: [If applicable]

#### [handler2.ext]
**Purpose**: [What this handles]
**Functions**:
- `functionName()`: [What it does]
- `functionName()`: [What it does]
**Usage**: [When/how it's used]

### Utilities (`[utils-directory]/`)

#### [utility1.ext]
**Purpose**: [Utility purpose]
**Functions**:
- `functionName()`: [What it does]
- `functionName()`: [What it does]
**Features**: [Key features]

#### [utility2.ext]
**Purpose**: [Utility purpose]
**Functions**:
- `functionName()`: [What it does]
- `functionName()`: [What it does]

## Key Dependencies

### Core Framework
- **[package-name]**: [Purpose/usage]
- **[package-name]**: [Purpose/usage]
- **[package-name]**: [Purpose/usage]

### Communication
- **[package-name]**: [Purpose/usage]
- **[package-name]**: [Purpose/usage]

### Utilities
- **[package-name]**: [Purpose/usage]
- **[package-name]**: [Purpose/usage]

## Common Workflows

### [Workflow 1 Name]
1. [Step 1 description]
2. [Step 2 description]
3. [Step 3 description]
4. [Step 4 description]

### [Workflow 2 Name]
1. [Step 1 description]
2. [Step 2 description]
3. [Step 3 description]

### [Workflow 3 Name]
1. [Step 1 description]
2. [Step 2 description]
3. [Step 3 description]

## Testing Approach

### Test Structure
- [Test type 1]: [What it tests]
- [Test type 2]: [What it tests]
- [Test type 3]: [What it tests]

### Test Utilities
- [Utility 1 description]
- [Utility 2 description]
- [Utility 3 description]

## Performance/Security Considerations

### Performance
- [Performance consideration 1]
- [Performance consideration 2]
- [Performance consideration 3]

### Security
- [Security measure 1]
- [Security measure 2]
- [Security measure 3]

### Scalability
- [Scalability consideration 1]
- [Scalability consideration 2]
- [Scalability consideration 3]

## Configuration

### Environment Variables
- `[VARIABLE_NAME]`: [Description and usage]
- `[VARIABLE_NAME]`: [Description and usage]
- `[VARIABLE_NAME]`: [Description and usage]

### Feature Flags
[If applicable, describe feature flags and their controls]

## Deployment Considerations

### Production Requirements
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

### Monitoring
- [What to monitor]
- [Metrics to track]
- [Logging approach]

### Maintenance
- [Maintenance task 1]
- [Maintenance task 2]
- [Maintenance task 3]

## API Documentation

### Public Endpoints

#### [Endpoint Category 1]
- `[METHOD] /path`: [Description]
  - **Request**: [Request format]
  - **Response**: [Response format]
  - **Authorization**: [Auth requirements]

#### [Endpoint Category 2]
- `[METHOD] /path`: [Description]
  - **Request**: [Request format]
  - **Response**: [Response format]
  - **Authorization**: [Auth requirements]

### Internal APIs
- `[METHOD] /internal/path`: [Internal use description]
- `[METHOD] /internal/path`: [Internal use description]

## Error Handling

### Error Types
- **[Error Type 1]**: [When it occurs and how it's handled]
- **[Error Type 2]**: [When it occurs and how it's handled]
- **[Error Type 3]**: [When it occurs and how it's handled]

### Error Recovery
- [Recovery strategy 1]
- [Recovery strategy 2]
- [Recovery strategy 3]

## Best Practices

### Code Organization
- [Best practice 1]
- [Best practice 2]
- [Best practice 3]

### Data Handling
- [Best practice 1]
- [Best practice 2]
- [Best practice 3]

### Communication
- [Best practice 1]
- [Best practice 2]
- [Best practice 3]

## Known Issues

### Current Limitations
- [Limitation 1]
- [Limitation 2]

### Workarounds
- [Workaround for limitation 1]
- [Workaround for limitation 2]

## Common Commands

### Development
```bash
[command]              # [Description]
[command]              # [Description]
```

### Testing
```bash
[command]              # [Description]
[command]              # [Description]
```

### Debugging
```bash
[command]              # [Description]
[command]              # [Description]
```

---

**Note**: This documentation is part of the comprehensive CLAUDE.md network. Always keep it updated when making changes to this service.