# Developer Guide: Style Guide

| [&lt;--](../index.md) |

## Style Guide

There is a `.editorconfig` file provided as part of the project, but if your text editor does not support it or all the editorconfig features, source code should conform to the following style examples:

**TypeScript**
Filename: `ClassName.ts`
Style:

```ts
// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 [Contributors]
// MIT License
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Summary of class.
 */
export class CamelCase {
    
    /**
     * Field description.
     * Only necessary on public fields.
     */
    public _field: Type;
    
    protected _field: Type = 'initial value';
    
    private _field: Type;
    
    // -------------------------------------------------------------------------------------------------------------
    // | Constructor:                                                                                              |
    // -------------------------------------------------------------------------------------------------------------

    /**
     * Constructor summary.
     * Omit if no parameters.
     */
    constructor() {
        // Code here.
    }
    
    // -------------------------------------------------------------------------------------------------------------
    // | Getters:                                                                                                  |
    // -------------------------------------------------------------------------------------------------------------
    
    public get getter(): Type {
        return 123;
    }
    
    public set setter(value: Type) {
        // Do something.
    }
    
    // -------------------------------------------------------------------------------------------------------------
    // | Methods:                                                                                                  |
    // -------------------------------------------------------------------------------------------------------------
    
    /**
     * Method summary.
     */
    public method(): void {
        // Some method.
    }
    
    /**
     * Method summary.
     * @returns Return summary, if necessary.
     */
    protected method(): Type {
        // ...
    }
    
    /**
     * Method summary.
     *
     * @param   Parameter summary.
     * @returns Return summary, if necessary.
     */
    private method(param: Type) : Type {
        // ...
    }
    
    // -------------------------------------------------------------------------------------------------------------
    // | Static:                                                                                                   |
    // -------------------------------------------------------------------------------------------------------------
    
    // Static properties go at the end, following the same conventions.
    
}
```

## Commits

Commits follow a strict message format:

```
[module]: [verb] [message]

[extended information]
```

- The `[module]` parameter must be a module as listed in `./sct info --list-modules`.
- The `[message]` parameter cannot end with `.`.
- The `[verb]` parameter must be one of:
  - Update
  - Add
  - Remove
  - Refactor
  - Change
  - Rename
  - Move
  - Fix
  - Reformat
  - Replace
  - Split
  - Join
  - Convert
  - Implement
  - Revert
  
Furthermore, commits will be automatically checked with `./sct check` for formatting consistency, profanity, and linting issues.

## Formatting

If you used `./sct init`, your code will automatically be formatted before a git commit.

In the event where you need to manually reformat code, the `./sct fmt` tool will come handy.

```bash
./sct fmt          # Formats all files in project modules.
./sct fmt [module] # Formats all files in the "module" module.

# Flags:
#  --dry                -- Only check formatting, don't change anything.
#  --only-modified (-m) -- Only format modified (not staged) files.
#  --only-staged   (-s) -- Only format staged files.
#  -sm                  -- Only format modified or staged files.
```
