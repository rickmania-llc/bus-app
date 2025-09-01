# [Component/Module Name] - [Brief Description]

## Directory Purpose
[Concise description of what this component/module does within its parent service. Explain its specific responsibility and how it contributes to the service's functionality.]

## Architecture Overview

### Design Pattern
[Describe the architectural pattern this component follows and why]

### Component Structure
```
[component-directory]/
├── [file1.ext]           # [Purpose]
├── [file2.ext]           # [Purpose]
├── [file3.ext]           # [Purpose]
└── [subdirectory]/       # [Purpose]
    ├── [file4.ext]       # [Purpose]
    └── [file5.ext]       # [Purpose]
```

### Dependencies
- Internal: [List of internal dependencies]
- External: [List of external package dependencies]

## Core Functionality

### Primary Responsibilities
1. **[Responsibility 1]**: [Detailed description]
2. **[Responsibility 2]**: [Detailed description]
3. **[Responsibility 3]**: [Detailed description]

### Key Interfaces

#### [Interface/Class Name]
**Purpose**: [What this interface/class provides]
**Methods/Properties**:
```typescript
// Example structure (adjust syntax for your language)
interface [InterfaceName] {
  property1: type;
  property2: type;
  method1(param: type): returnType;
  method2(param: type): returnType;
}
```

#### [Interface/Class Name]
**Purpose**: [What this interface/class provides]
**Methods/Properties**:
```typescript
// Example structure
class [ClassName] {
  property1: type;
  method1(param: type): returnType;
  method2(param: type): returnType;
}
```

## File Descriptions

### [file1.ext]
**Purpose**: [Detailed purpose of this file]
**Exports**:
- `functionName()`: [What it does, parameters, return value]
- `className`: [What it represents]
- `constantName`: [What it defines]

**Key Functions**:
```typescript
// Example function signature
function functionName(param1: type, param2: type): returnType {
  // Function purpose and behavior
}
```

### [file2.ext]
**Purpose**: [Detailed purpose of this file]
**Exports**:
- `functionName()`: [What it does, parameters, return value]
- `className`: [What it represents]

**Dependencies**:
- Imports from: [List of imports]
- Used by: [List of files that use this]

### [file3.ext]
**Purpose**: [Detailed purpose of this file]
**Configuration Options**:
- `option1`: [Description and default value]
- `option2`: [Description and default value]

## Data Models

### [Model Name]
**Purpose**: [What this model represents]
**Structure**:
```typescript
// Example model structure
{
  field1: type,        // [Description]
  field2: type,        // [Description]
  field3: {            // [Description]
    subfield1: type,   // [Description]
    subfield2: type    // [Description]
  }
}
```

**Validation Rules**:
- [Validation rule 1]
- [Validation rule 2]

### [Model Name]
**Purpose**: [What this model represents]
**Fields**:
- `field1`: [Type and description]
- `field2`: [Type and description]
- `field3`: [Type and description]

## API/Methods Documentation

### Public API

#### `functionName(param1, param2)`
**Purpose**: [What this function does]
**Parameters**:
- `param1` (type): [Description]
- `param2` (type): [Description]
**Returns**: [Return type and description]
**Example**:
```typescript
// Usage example
const result = functionName(value1, value2);
```

#### `className.methodName(param)`
**Purpose**: [What this method does]
**Parameters**:
- `param` (type): [Description]
**Returns**: [Return type and description]
**Throws**: [Exception types and conditions]

### Internal Methods

#### `_privateFunctionName(param)`
**Purpose**: [What this internal function does]
**Parameters**:
- `param` (type): [Description]
**Returns**: [Return type and description]
**Note**: [Any special considerations]

## Common Patterns

### [Pattern Name]
**Use Case**: [When to use this pattern]
**Implementation**:
```typescript
// Example pattern implementation
[code example showing the pattern]
```

### [Pattern Name]
**Use Case**: [When to use this pattern]
**Implementation**:
```typescript
// Example pattern implementation
[code example showing the pattern]
```

## Configuration

### Configuration Options
```typescript
// Example configuration structure
{
  option1: value,     // [Description]
  option2: value,     // [Description]
  option3: {          // [Description]
    suboption1: value // [Description]
  }
}
```

### Environment Variables
- `[VARIABLE_NAME]`: [Description and default]
- `[VARIABLE_NAME]`: [Description and default]

## Error Handling

### Error Types
- **[ErrorType1]**: [When thrown and how to handle]
- **[ErrorType2]**: [When thrown and how to handle]
- **[ErrorType3]**: [When thrown and how to handle]

### Error Recovery
```typescript
// Example error handling pattern
try {
  // Operation
} catch (error) {
  if (error instanceof ErrorType1) {
    // Handle specific error
  } else {
    // Handle general error
  }
}
```

## Testing

### Test Coverage
- Unit tests: [Coverage areas]
- Integration tests: [Coverage areas]
- Edge cases: [Special cases tested]

### Test Files
- `[test-file1.ext]`: [What it tests]
- `[test-file2.ext]`: [What it tests]

### Testing Approach
```typescript
// Example test structure
describe('[Component Name]', () => {
  it('should [behavior]', () => {
    // Test implementation
  });
});
```

## Performance Considerations

### Optimization Strategies
- [Strategy 1]: [Description]
- [Strategy 2]: [Description]
- [Strategy 3]: [Description]

### Benchmarks
- [Operation 1]: [Performance metrics]
- [Operation 2]: [Performance metrics]

### Caching
- [What is cached]: [Caching strategy]
- [Cache invalidation]: [When and how]

## Security Considerations

### Input Validation
- [Validation point 1]: [What is validated]
- [Validation point 2]: [What is validated]

### Data Sanitization
- [Sanitization rule 1]: [How data is sanitized]
- [Sanitization rule 2]: [How data is sanitized]

### Access Control
- [Access control measure 1]
- [Access control measure 2]

## Integration Points

### Inbound Integrations
- **[Source 1]**: [How it integrates with this component]
- **[Source 2]**: [How it integrates with this component]

### Outbound Integrations
- **[Target 1]**: [How this component integrates with it]
- **[Target 2]**: [How this component integrates with it]

### Events
- **Emitted Events**:
  - `[event-name]`: [When emitted and payload]
  - `[event-name]`: [When emitted and payload]
- **Listened Events**:
  - `[event-name]`: [What happens when received]
  - `[event-name]`: [What happens when received]

## Usage Examples

### Basic Usage
```typescript
// Example: [Description of what this example shows]
import { Component } from './component';

const instance = new Component(config);
const result = await instance.doSomething(params);
```

### Advanced Usage
```typescript
// Example: [Description of what this example shows]
import { Component } from './component';

const instance = new Component({
  option1: value1,
  option2: value2
});

instance.on('event', (data) => {
  // Handle event
});

const result = await instance.complexOperation(params);
```

## Migration Guide

### From Version X to Y
1. [Migration step 1]
2. [Migration step 2]
3. [Migration step 3]

### Breaking Changes
- [Breaking change 1]: [How to adapt]
- [Breaking change 2]: [How to adapt]

## Troubleshooting

### Common Issues

#### [Issue 1]
**Symptoms**: [What user sees]
**Cause**: [Root cause]
**Solution**: [How to fix]

#### [Issue 2]
**Symptoms**: [What user sees]
**Cause**: [Root cause]
**Solution**: [How to fix]

### Debug Mode
```typescript
// How to enable debug mode
[code example]
```

### Logging
- Log levels: [Available log levels]
- Log location: [Where logs are stored]
- Log format: [Format of log entries]

## Best Practices

### Do's
- [Best practice 1]
- [Best practice 2]
- [Best practice 3]

### Don'ts
- [Anti-pattern 1]
- [Anti-pattern 2]
- [Anti-pattern 3]

## Future Improvements

### Planned Features
- [ ] [Feature 1]: [Description]
- [ ] [Feature 2]: [Description]

### Technical Debt
- [Debt item 1]: [Description and impact]
- [Debt item 2]: [Description and impact]

## References

### External Documentation
- [Link to external doc 1]
- [Link to external doc 2]

### Related Components
- [Link to related CLAUDE.md 1]
- [Link to related CLAUDE.md 2]

---

**Last Updated**: [Date]
**Maintainers**: [Team/Person responsible]

**Note**: This documentation is part of the component-level CLAUDE.md network. Keep it synchronized with code changes.