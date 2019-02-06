# CHIP-8 Assembler Reference (AT&T)

| [Back](reference.md) | [Home](../index.md) |

## Instructions (AT&T Syntax)

Instructions are one-to-one or one-to-many mappings from human-readable mnemonics to CHIP-8 machine code.

**Syntax:**
Instructions start with an instruction mnemonic or macro name.

```
<mnemonic> [<param>][, <param>[, ...]]
<mnemonic>.<overload> [<param>][, <param>[, ...]]
<macro> [[<param_value>|<param_name>=<param_value>], ...]
```

**Example:**

```gas
add $5, %V0
add.rr %V1, %V3
my_macro $5
my_macro value=$5
```
