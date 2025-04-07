# TypeScript Migration Guide for WFRP4e

This document provides guidelines for the gradual adoption of TypeScript in the WFRP4e system.

## Overview

The goal is to **gradually introduce TypeScript** features into the codebase while maintaining compatibility with existing JavaScript code. This approach emphasizes:

1. **Incremental adoption** - TypeScript and JavaScript files can coexist
2. **Progressive enhancement** - Add type safety where it provides the most value
3. **Minimal disruption** - Existing functionality continues to work during migration

## Project Setup

The project has been configured to support TypeScript through the following additions:

- `tsconfig.json` - TypeScript configuration optimized for mixed JS/TS development
- TypeScript-related dependencies in `package.json`
- Rollup configuration updates to handle TypeScript files
- Type definition files in the `types` directory

## Getting Started

### Installing Dependencies

After checking out the code, run:

```bash
npm install
```

This will install all the necessary dependencies, including TypeScript and related tools.

### Development Commands

- `npm run build` - Build the project and watch for changes (compiles both JS and TS)
- `npm run release` - Build the project for release
- `npm run type-check` - Run TypeScript type checking without emitting files
- `npm run type-check:watch` - Run TypeScript type checking in watch mode

## Mixed JavaScript/TypeScript Development

### Creating New Features

When creating new features, consider using TypeScript:

1. Create new files with the `.ts` extension
2. Import them from JavaScript files using the `.js` extension (TypeScript compilation will handle this)
3. Start with minimal type annotations and add more as needed

Example:

```typescript
// modules/character/character-utils.ts
export function calculateEncumbrance(strength: number, items: any[]): number {
  // Implementation here
  return result;
}
```

```javascript
// Existing JS file
import { calculateEncumbrance } from "./character/character-utils.js";
```

### Adding Types to Existing Code

You can add type information to existing JavaScript code without converting it completely:

1. Create type definition files (.d.ts) for your JavaScript modules
2. Use JSDoc comments with TypeScript type annotations in JavaScript files

Example:

```typescript
// types/character.d.ts
export interface Character {
  name: string;
  strength: number;
  items: any[];
}
```

```javascript
// Existing JavaScript file with JSDoc type annotations
/**
 * Calculate total encumbrance
 * @param {number} strength - Character's strength characteristic
 * @param {Array<any>} items - Items carried by character
 * @returns {number} Total encumbrance value
 */
function calculateEncumbrance(strength, items) {
  // Implementation
}
```

## TypeScript Conventions

### File Organization

- Keep the same directory structure
- Use `.ts` extension for TypeScript files
- Use `.d.ts` extension for type definition files

### Naming Conventions

- Use PascalCase for interfaces, types, and classes
- Use camelCase for variables, functions, and method names
- Add meaningful type suffixes like `Model`, `Data`, etc.

### Type Strictness

The project is configured with relaxed type checking to facilitate gradual adoption:

- `strict: false` - Allows more flexibility during migration
- `noImplicitAny: false` - Permits variables without explicit types
- `allowJs: true` - Enables processing of JavaScript files
- `checkJs: false` - Doesn't type-check JavaScript files

As more of the codebase is converted, you can increase strictness in `tsconfig.json`.

## Example TypeScript Integration

A minimal TypeScript example has been created in:

- `wfrp4e-minimal.ts` - A simple TypeScript entry point
- `modules/system/utils/ts-utils.ts` - TypeScript utility functions

This demonstrates how TypeScript can coexist with the rest of the JavaScript codebase.

## Working with Foundry VTT Types

The project uses `@league-of-foundry-developers/foundry-vtt-types` for Foundry VTT type definitions.

For Foundry-specific types not covered by the package:

1. Check if they're declared in our `types/*.d.ts` files
2. Add custom declarations if needed

## Troubleshooting Common Issues

### Import Path Resolution

When importing TypeScript files:

```typescript
// For Node.js/bundler environments (like Rollup in this project)
import { MyClass } from "./my-module.js"; // Use .js extension even for TypeScript files

// For TypeScript-only environments (not applicable to this project)
// import { MyClass } from "./my-module"; // No extension
```

Using the `.js` extension in imports is necessary for this project because:

1. **Runtime compatibility**: At runtime, browsers and Node.js expect extensions in import paths
2. **Module resolution**: The TypeScript compiler will correctly resolve `.js` extensions to the corresponding `.ts` files during compilation
3. **Build system configuration**: Our rollup setup is configured to handle this pattern

If you omit the extension or use `.ts` extension, the code might typecheck correctly but will fail at runtime after compilation.

### Type Errors in JavaScript Files

If you're getting type errors in JavaScript files:

1. Make sure `checkJs` is set to `false` in `tsconfig.json`
2. Use `// @ts-ignore` comments for specific lines if needed

### Missing Type Definitions

If you get errors about missing types:

1. Check if the declaration exists in one of our `.d.ts` files
2. Check if it needs to be added to the global declarations in `types/global.d.ts`
3. Create a new declaration file if needed

## Development Workflow

The project is set up to support a gradual adoption of TypeScript. Here's the recommended workflow:

### Building the Project

We've added several npm scripts to help with development:

- `npm run build` - Standard build process that watches for changes
- `npm run build:minimal` - Builds only the minimal TypeScript setup without watching
- `npm run type-check` - Runs TypeScript type checking without emitting files

The build process is configured to:
- Continue building even when there are TypeScript errors
- Skip certain files that aren't ready for TypeScript compilation
- Generate source maps for debugging

### Creating New TypeScript Files

When creating a new TypeScript file:

1. Use the `.ts` extension
2. Import it from JavaScript files using the `.js` extension (TypeScript compilation will handle this)
3. Add type annotations gradually
4. Test thoroughly with the build process

### Converting Existing Files

When you're ready to convert an existing JavaScript file to TypeScript:

1. Make a copy with the `.ts` extension
2. Add type annotations where appropriate
3. Update all imports pointing to this file (remember to keep using `.js` extension in import statements)
4. Test to ensure it works correctly with the rest of the system

### Handling Type Errors

If you encounter type errors:

1. Use `// @ts-ignore` comments for specific lines if needed
2. Add appropriate type declarations in the declaration files
3. Consider excluding problematic files from TypeScript checking initially

## Questions and Help

If you encounter issues during the migration process, please:

1. Check the TypeScript documentation: https://www.typescriptlang.org/docs/
2. Review the Foundry VTT API documentation: https://foundryvtt.com/api/
3. Ask for help in the project's communication channels 

## Future Steps and Long-term Strategy

As the TypeScript migration progresses, follow these steps to gradually improve type safety and code quality:

### 1. Expand Type Definitions

- Add more specific types to the `types/wfrp4e.d.ts` file
- Create type interfaces for major system components
- Define more precise return types for API functions

### 2. Convert Core Utility Modules

- Focus on converting utility functions first (they typically have fewer dependencies)
- Create TypeScript versions of key helper modules
- Ensure these modules have comprehensive types and documentation

### 3. Gradually Increase Type Strictness

As more of the codebase is converted to TypeScript, gradually enable stricter type checking in `tsconfig.json`:

```json
{
  "compilerOptions": {
    // Phase 1: Start with these settings
    "noImplicitAny": true,     // Error on expressions and declarations with an implied 'any' type
    
    // Phase 2: Enable after more type definitions are in place
    "strictNullChecks": true,  // Enable strict null checks
    "strictFunctionTypes": true, // Enable strict checking of function types
    
    // Phase 3: Move toward full strictness
    "strict": true,            // Enable all strict type-checking options
  }
}
```

### 4. Implement Unit Tests for TypeScript Code

- Create test suite for TypeScript modules
- Run tests as part of the build process
- Ensure type compatibility across module boundaries

### 5. Documentation Updates

- Update API documentation with TypeScript interfaces
- Add type information to method documentation
- Create examples showing typed API usage

### 6. Consider Module Architecture Improvements

- Evaluate if the module structure can be improved
- Consider using TypeScript namespaces or modules to better organize code
- Implement design patterns that leverage TypeScript's type system

By following this gradual approach, the codebase will become increasingly type-safe while maintaining compatibility with existing JavaScript code. 