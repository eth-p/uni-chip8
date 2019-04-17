# Developer Guide: Testing

| [&lt;--](../index.md) |

## Testing

While this project will work by simply running `jest` in the repository root, we also have a wrapper in `sct` for convenience.

```bash
./sct test          # Run all unit tests
./sct test [module] # Run all unit tests in the "module" module.

# Flags
#  --workers=[n]      -- Use [n] worker threads.
```
