# CHIP-8 Assembler Reference (AT&T)

| [Back](reference.md) | [Home](../index.md) |

## Syntax Directive (AT&T Syntax)

Specifies an assembly syntax.
In the absence of a `.syntax` directive, the default is `INTEL`.

**Syntax:**

```
.syntax INTEL
.syntax AT&T|ATT
```

**Example:**

```asm
.syntax AT&T
```
