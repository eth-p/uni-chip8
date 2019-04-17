# Team 15 CHIPotle: Contributing Guide

|<- [README](README.md)|

## Version Control

It's important to have a documented history of changes to the project.
Therefore, it's important that the following guidelines be met:

1. Features should be worked on in branches, and merged using pull requests.
    **Pushes to master will be rejected.**
2. Pull requests must add a complete summary of changes both inside `CHANGELOG.md`, and in the pull request description.
3. Commit messages must explain the intent of the commit.
    They should start with: `Added`, `Removed`, `Fixed`, `Changed`, etc.
4. Commit messages should be prefixed with the project module they affect.
    Example: `interpreter: Added ... `

To make more streamlined, the `sct` utility will enforce these guidelines once initialized.

## Building

We use custom tools for building the project. While you probably could make it work with your own tools, it's really not meant to be built without `sct`. 

```bash
./sct build               # Builds all
./sct build [module]      # Builds the entire "module" module.
./sct build [module:task] # Builds the "task" task in the "module" module.

# Flags:
#  --release          -- Builds for release.
#  --keep:asserts     -- Keeps runtime assertions in release builds.
#  --keep:comments    -- Keeps comments.
#  --no-sourcemaps    -- Disables sourcemaps.
#  --no-minify        -- Disables minification in release builds
#  --modules=es6      -- Outputs ES6 modules.
#  --modules=commonjs -- Outputs CommonJS modules.
#  --modules=amd      -- Outputs AMD modules.
#  --verbose          -- Verbose output.

#  --list-tasks       -- Lists all available build tasks.
```

## Testing

```bash
./sct test          # Run all unit tests
./sct test [module] # Run all unit tests in the "module" module.

# Flags
#  --workers=[n]      -- Use [n] worker threads.
```

## Style Guide

There is a `.editorconfig` file provided as part of the project, but if your text editor does not support it or all the editorconfig features, source code should conform to the following style examples:

For automatic formatting, you can use `./sct fmt -sm` to format uncommitted files.

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

