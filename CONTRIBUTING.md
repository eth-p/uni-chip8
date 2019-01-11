# Contributing Guide



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

To make it simpler and more streamlined, the [sct utility](https://github.com/eth-p/SFU-CMPT276/wiki/Tooling#simple-contribution-tool-sct) has a couple of convenience commands available for contributors:

```bash
./sct commit                   # Interactive interface for commiting changes.
./sct branch                   # List all branches.
./sct branch [branch]          # Checkout a branch.
./sct branch [branch] --create # Checkout a branch (after creating it).
./sct push                     # Push commits.
./sct pull                     # Pull commits.
```

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

