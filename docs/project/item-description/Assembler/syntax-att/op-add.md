# CHIP-8 Assembler Reference (AT&T)

| [Back](reference.md) | [Home](../index.md) |

## ADD Instruction (AT&T Syntax)

### ADD `<con>`, `<reg>`

Adds `<con>` to the register specified by `<reg>`.

**Example:**

```asm
add 9, %VE
```

### ADD `<reg>`, `<reg>`

Adds the value of the first `<reg>` to the register specified by the second `<reg>`.

**Example:**

```asm
add %V1, %VE
```
