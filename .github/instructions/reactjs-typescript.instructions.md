---
applyTo: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx"
---
# Project coding standards for TypeScript and React

Instructions for building high-quality ReactJS applications with modern patterns, hooks, and best practices following the official React documentation at [https://react.dev](https://react.dev).
Apply the [general coding guidelines](./general.instructions.md) to all code.

## Project Context
- Latest React version (React 19+)
- TypeScript for type safety (when applicable)
- Functional components with hooks as default
- Follow React's official style guide and best practices
- Use modern build tools (Vite, Create React App, or custom Webpack setup)
- Implement proper component composition and reusability patterns

## TypeScript Guidelines
- Use TypeScript for all new code
- Follow functional programming principles where possible
- Use interfaces for data structures and type definitions
- Prefer immutable data (const, readonly)
- Use optional chaining (?.) and nullish coalescing (??) operators
- Use arrow functions, template literals, destructuring assignment, spread/rest operators

## React Guidelines
- Use functional components with hooks
- Follow the React hooks rules (no conditional hooks)
- Use React.FC type for components with children
- Keep components small and focused
- Use CSS modules for component styling
- Organize components by feature or domain for scalability
- Use custom hooks for reusable stateful logic
- Implement proper component hierarchies with clear data flow

## TypeScript Integration
- Use TypeScript interfaces for props, state, and component definitions
- Define proper types for event handlers and refs
- Implement generic components where appropriate
- Use strict mode in `tsconfig.json` for type safety
- Leverage React's built-in types (`React.FC`, `React.ComponentProps`, etc.)
- Create union types for component variants and states

## Component Design
- Follow the single responsibility principle for components
- Use descriptive and consistent naming conventions
- Implement proper prop validation with TypeScript or PropTypes
- Design components to be testable and reusable
- Keep components small and focused on a single concern
- Use composition patterns (render props, children as functions)

## State Management
- Use `useState` for local component state
- Implement `useReducer` for complex state logic
- Leverage `useContext` for sharing state across component trees
- Consider external state management (Redux Toolkit, Zustand) for complex applications
- Implement proper state normalization and data structures
- Use React Query or SWR for server state management

## Hooks and Effects
- Use `useEffect` with proper dependency arrays to avoid infinite loops
- Implement cleanup functions in effects to prevent memory leaks
- Use `useMemo` and `useCallback` for performance optimization when needed
- Create custom hooks for reusable stateful logic
- Follow the rules of hooks (only call at the top level)
- Use `useRef` for accessing DOM elements and storing mutable values

## Styling
- Keep styling to absolute minimum
- Use only black and white, only use gray if there's no other option
- Use styling only for layout
- Use CSS Modules
- Only suggest more complex styling when asked explicitly

## Performance Optimization
- Use `React.memo` for component memoization when appropriate
- Implement code splitting with `React.lazy` and `Suspense`
- Optimize bundle size with tree shaking and dynamic imports
- Use `useMemo` and `useCallback` judiciously to prevent unnecessary re-renders
- Implement virtual scrolling for large lists
- Profile components with React DevTools to identify performance bottlenecks

## Data Fetching
- Use modern data fetching libraries (React Query, SWR, Apollo Client)
- Implement proper loading, error, and success states
- Handle race conditions and request cancellation
- Use optimistic updates for better user experience
- Implement proper caching strategies
- Handle offline scenarios and network errors gracefully

## Error Handling
- Implement Error Boundaries for component-level error handling
- Use proper error states in data fetching
- Implement fallback UI for error scenarios
- Log errors appropriately for debugging
- Handle async errors in effects and event handlers
- Provide meaningful error messages to users

## Forms and Validation
- Use controlled components for form inputs
- Implement proper form validation with libraries like React Hook Form
- Handle form submission and error states appropriately
- Implement forms in an accessible way (labels, keyboard navigation, accessible text for icons)
- Use debounced validation for better user experience
- Handle file uploads and complex form scenarios

## Routing
- Use React Router for client-side routing
- Implement nested routes and route protection
- Handle route parameters and query strings properly
- Implement lazy loading for route-based code splitting
- Use proper navigation patterns and back button handling
- Implement breadcrumbs and navigation state management

## Testing
- Write unit tests for components using Vitest
- Test component behavior, not implementation details
- Use Vitest for test runner and assertion library
- Implement integration tests for complex component interactions
- Mock external dependencies and API calls appropriately
- Test accessibility features and keyboard navigation

## Security
- Sanitize user inputs to prevent XSS attacks
- Validate and escape data before rendering
- Use HTTPS for all external API calls
- Implement proper authentication and authorization patterns
- Avoid storing sensitive data in localStorage or sessionStorage
- Use Content Security Policy (CSP) headers

## Accessibility
- Apply the [accessibility guidelines](./accessibility.instructions.md) to all code.

## Additional Guidelines
- Keep dependencies up to date and audit for security vulnerabilities
- Implement proper environment configuration for different deployment stages
