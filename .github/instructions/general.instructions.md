---
applyTo: "**"
---
# Project general coding standards

## MANDATORY PLANNING PHASE
- When working with large files (>300 lines) or complex changes, ALWAYS start by creating a detailed plan BEFORE making any edits
- Your plan MUST include:
    - All functions/sections that need modification
    - The order in which changes should be applied
    - Dependencies between changes
    - Estimated number of separate edits required

## Naming Conventions
- Use PascalCase for component names, interfaces, and type aliases
- Use camelCase for variables, functions, and methods
- Prefix private class members with underscore (_)
- Use ALL_CAPS for constants

## Error Handling
- Use try/catch blocks for async operations
- Implement proper error boundaries in React components
- Always log errors with contextual information

## Formatting
- Use Prettier for code formatting
- Follow a consistent indentation style (4 spaces)
- Use single quotes for strings
- Include trailing commas where possible
- Keep lines under 80 characters