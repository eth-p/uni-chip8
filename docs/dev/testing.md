# Developer Guide: Building

| [&lt;--](../index.md) |

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

## Debug Builds

Say, for example, you wanted to compile a debug build:

```bash
./sct build
```

This will compile a build to the `out` folder with the following features:

- Sourcemaps
- Runtime assertions

## Release Builds

If you want to compile a standard release build:

```bash
./sct build --release
```

This will compile a build with the following features:

- Sourcemaps
- Minification (no comments)

## Electron Builds (Linux/MacOS Only)

**This is only supported on Linux and MacOS systems.**  
Compiles a release and packages it as an Electron application.

```bash
./sct build --release
./sct build elec-emu --release
.script/package/package.sh
```

The packaged applications will be located in the `artifacts` folder.
