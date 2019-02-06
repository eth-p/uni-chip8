# CHIP-8 Assembler Reference (AT&T)

| [Back](reference.md) | [Home](../index.md) |

## Parameters (AT&T Syntax)

Parameters are values used in instructions.

### Constants

A constant value.

**Syntax:**

```
$<decimal value>
$0x<hex value>
$0b<binary value>
```

**Example:**

```gas
$13
$0xFE
$0b01101001
```

### Registers

A named register.

**Syntax:**

```
%V<0-F>
%I
```

**Example:**

```gas
%V0
%VA
%I
```

### Address

A 12-bit address.

**Syntax:**

```
<label_name>
<sprite_name>
<decimal address>
0x<hex address>
0b<binary address>
```

**Example:**

```gas
my_label
my_sprite
1500
0x200
0b1001
```

### Compile-Time Expression

A value calculated at compile time.

**Syntax:**

```
( <EXPR> )
```

**Example:**

```gas
(my_label + 4)
(0x15 + 0x0A)
```
