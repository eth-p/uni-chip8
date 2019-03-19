; -------------------------------------------------------------------------------------------------------------------- ;
; Chip-8 Test Program                                                                                                  ;
; Copyright (C) 2019 Ethan Pini                                                                                        ;
; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -;
; This program was designed to be assembled with https://github.com/wernsey/chip8                                      ;
; -------------------------------------------------------------------------------------------------------------------- ;
define test_number VD
define test_result VE

define temp V6
define temp2 V7
define output V8
define output2 V9

define mul_multiplicand VA
define mul_multiplier VB
define div_dividend VA
define div_divisor VB

; -------------------------------------------------------------------------------------------------------------------- ;
; ENTRY:                                                                                                               ;
; -------------------------------------------------------------------------------------------------------------------- ;
entry:
	CALL test_00
	CALL test_01
	CALL test_02
	CALL test_03
	CALL test_04
	CALL test_05
	CALL test_06
	CALL test_07
	CALL test_08
	CALL test_09
	CALL test_10
	JP halt

; -------------------------------------------------------------------------------------------------------------------- ;
; HALT:                                                                                                                ;
; This halts execution.                                                                                                ;
; -------------------------------------------------------------------------------------------------------------------- ;
halt:
	LD VF, K
	JP halt

; -------------------------------------------------------------------------------------------------------------------- ;
; TEST 00: DT INITIALIZE                                                                                               ;
; This will test that DT is able to be set.                                                                            ;
; -------------------------------------------------------------------------------------------------------------------- ;
test_00:
	; Initialize test info.
	LD test_number, 0

	; Attempt to set DT.
	LD temp, 60
	LD DT, temp

	; Attempt to read DT.
	LD temp, DT
	SE temp, 0
		JP success
	JP fail

; -------------------------------------------------------------------------------------------------------------------- ;
; TEST 01: DT TIMING                                                                                                   ;
; This will test the timing of the DT register.                                                                        ;
;                                                                                                                      ;
; WARNING: THIS TEST ASSUMES A 500 Hz CLOCK                                                                            ;
; -------------------------------------------------------------------------------------------------------------------- ;
test_01:
	; Initialize test info.
	LD test_number, 1

	; Attempt to set DT.
	LD temp, 60
	LD DT, temp

	; Do nothing for a while.
	LD temp, temp
	LD temp, temp
	LD temp, temp
	LD temp, temp
	LD temp, temp
	LD temp, temp

	; Attempt to read ST.
	LD V0, DT
	LD V1, DT
	LD V2, DT
	LD V3, DT

	; Determine results
	SE V0, 60
		JP fail

	SE V1, 60
		JP fail

	SE V2, 59
		JP fail

	SE V3, 59
		JP fail

	JP success


; -------------------------------------------------------------------------------------------------------------------- ;
; TEST 02: DRW VF                                                                                                      ;
; This will test the collision flag.                                                                                   ;
; -------------------------------------------------------------------------------------------------------------------- ;
test_02:
	; Initialize test info.
	LD test_number, 2

	; Load wrap test sprite.
	LD I, sprite_collide

	; Draw at test position.
	LD V0, 63
	LD V1, 31
	DRW V0, V1, 1

	; Probe for success.
	DRW V0, V1, 1
	LD V4, VF

	; Finish.
	SE V4, 1
		JP fail
	JP success


; -------------------------------------------------------------------------------------------------------------------- ;
; TEST 03: DRW X WRAP                                                                                                  ;
; This will test wrapping along the X axis.                                                                            ;
; -------------------------------------------------------------------------------------------------------------------- ;
test_03:
	; Initialize test info.
	LD test_number, 3

	; Load wrap test sprite.
	LD I, sprite_wrap_test

	; Draw at test position.
	LD V0, 63
	LD V1, 30
	DRW V0, V1, 1

	; Probe for success.
	LD I, sprite_collide

	LD V2, 0
	DRW V2, V1, 1
	LD V4, VF
	DRW V2, V1, 1

	LD V2, 64
	DRW V2, V1, 1
	LD V5, VF
	DRW V2, V1, 1

	; Clear leftovers.
	LD I, sprite_wrap_test
	DRW V0, V1, 1

	; Finish.
	SE V4, 1
		JP fail

	SE V5, 1
		JP fail

	JP success


; -------------------------------------------------------------------------------------------------------------------- ;
; TEST 04: DRW Y WRAP                                                                                                  ;
; This will test wrapping along the Y axis.                                                                            ;
; -------------------------------------------------------------------------------------------------------------------- ;
test_04:
	; Initialize test info.
	LD test_number, 4

	; Load wrap test sprite.
	LD I, sprite_wrap_test

	; Draw at test position.
	LD V0, 62
	LD V1, 31
	DRW V0, V1, 2

	; Probe for success.
	LD I, sprite_collide

	LD V2, 32
	DRW V0, V2, 1
	LD V4, VF
	DRW V0, V2, 1

	LD V2, 0
	DRW V0, V2, 1
	LD V5, VF
	DRW V0, V2, 1

	; Clear leftovers.
	LD I, sprite_wrap_test
	DRW V0, V1, 2

	; Finish.
	SE V4, 1
		JP fail

	SE V5, 1
		JP fail

	JP success


; -------------------------------------------------------------------------------------------------------------------- ;
; TEST 05: Indirect Read                                                                                               ;
; This will test indirect read (LD Vx, [I]).                                                                           ;
; -------------------------------------------------------------------------------------------------------------------- ;
test_05:
	; Initialize test info.
	LD test_number, 5

	; Load read address.
	LD I, data_test_indirect_read

	; Clear bytes.
	LD V0, 255
	LD V1, 255
	LD V2, 255
	LD V3, 255
	LD V4, 255

	; Read bytes.
	LD V3, [I]

	; Finish.
	SE V4, 255
		JP fail

	SE V0, 1
		JP fail

	SE V1, 2
		JP fail

	SE V2, 3
		JP fail

	SE V3, 4
		JP fail

	JP success


; -------------------------------------------------------------------------------------------------------------------- ;
; TEST 06: Indirect Write                                                                                              ;
; This will test indirect write (LD [I], Vx).                                                                          ;
; -------------------------------------------------------------------------------------------------------------------- ;
test_06:
	; Initialize test info.
	LD test_number, 6

	; Load read address.
	LD I, data_test_indirect_write

	; Set registers.
	LD V0, 1
	LD V1, 2
	LD V2, 3
	LD V3, 255

	; Write bytes.
	LD [I], V2

	; Clear registers.
	LD V0, 0
	LD V1, 0
	LD V2, 0
	LD V3, 255

	; Read back bytes.
	LD V3, [I]

	; Finish.
	SE V3, 0
		JP fail

	SE V0, 1
		JP fail

	SE V1, 2
		JP fail

	SE V2, 3
		JP fail

	JP success

; -------------------------------------------------------------------------------------------------------------------- ;
; TEST 07: Shift Left                                                                                                  ;
; This will test shift left (SHL Vx).                                                                                  ;
; -------------------------------------------------------------------------------------------------------------------- ;
test_07:
	; Initialize test info.
	LD test_number, 7

	; Set registers.
	LD V0, 255
	LD V1, 0
	LD V2, 128

	; Test shifts.
	SHL V0
	SE VF, 1
		JP fail
	SE V0, 254
		JP fail

	SHL V1
	SE VF, 0
		JP fail
	SE V1, 0
		JP fail

	SHL V2
	SE VF, 1
		JP fail
	SE V2, 0
		JP fail

	; Finish.
	JP success


; -------------------------------------------------------------------------------------------------------------------- ;
; TEST 08: Shift Right                                                                                                 ;
; This will test shift right (SHR Vx).                                                                                 ;
; -------------------------------------------------------------------------------------------------------------------- ;
test_08:
	; Initialize test info.
	LD test_number, 8

	; Set registers.
	LD V0, 255
	LD V1, 0
	LD V2, 128

	; Test shifts.
	SHR V0
	SE VF, 1
		JP fail
	SE V0, 127
		JP fail

	SHR V1
	SE VF, 0
		JP fail
	SE V1, 0
		JP fail

	SHR V2
	SE VF, 0
		JP fail
	SE V2, 64
		JP fail

	; Finish.
	JP success


; -------------------------------------------------------------------------------------------------------------------- ;
; TEST 09: BCD                                                                                                         ;
; This will test the BCD opcode.                                                                                       ;
; -------------------------------------------------------------------------------------------------------------------- ;
test_09:
	; Initialize test info.
	LD test_number, 9

	; Set registers.
	LD I, data_test_indirect_write
	LD V4, 254
	LD V5, 64

	; Test "254"
	LD B, V4
	LD V2, [I]

	SE V0, 2
		JP fail

	SE V1, 5
		JP fail

	SE V2, 4
		JP fail

	; Test "064"
	LD B, V5
	LD V2, [I]

	SE V0, 0
		JP fail

	SE V1, 6
		JP fail

	SE V2, 4
		JP fail

	; Finish.
	JP success


; -------------------------------------------------------------------------------------------------------------------- ;
; TEST 10: ADD I, Vx                                                                                                   ;
; This will test the ADD I, Vx opcode.                                                                                 ;
; -------------------------------------------------------------------------------------------------------------------- ;
test_10:
	; Initialize test info.
	LD test_number, 10

	; Set registers.
	LD I, data_test_add
	LD V0, 1
	ADD I, V0

	; Test
	LD V0, [I]
	SE V0, 1
		JP fail

	; Finish.
	JP success










; -------------------------------------------------------------------------------------------------------------------- ;
; MUL:                                                                                                                 ;
; Multiples two numbers.                                                                                               ;
; -------------------------------------------------------------------------------------------------------------------- ;
mul:
	LD temp, mul_multiplicand
	LD temp2, 1
	LD output, 0

	mul_loop:
		SNE temp, 0
		RET

		ADD output, mul_multiplier
		SUB temp, temp2
		JP mul_loop

; -------------------------------------------------------------------------------------------------------------------- ;
; DIV:                                                                                                                 ;
; Divides two numbers.                                                                                                 ;
; -------------------------------------------------------------------------------------------------------------------- ;
div:
	LD output2, div_dividend
	LD output, 0
	div_loop:
		SUB output2, div_divisor
		SNE VF, 0
		JP div_end

		ADD output, 1
		JP div_loop

	div_end:
		ADD output2, div_divisor
		RET

; -------------------------------------------------------------------------------------------------------------------- ;
; SUCCESS:                                                                                                             ;
; Sets the success flag and jumps to `finish`.                                                                         ;
; -------------------------------------------------------------------------------------------------------------------- ;
success:
	LD test_result, 1
	JP finish

; -------------------------------------------------------------------------------------------------------------------- ;
; FAIL:                                                                                                                ;
; Sets the fail flag and jumps to `finish`.                                                                            ;
; -------------------------------------------------------------------------------------------------------------------- ;
fail:
	LD test_result, 0
	JP finish

; -------------------------------------------------------------------------------------------------------------------- ;
; FINISH:                                                                                                              ;
; Draws the results of a test.                                                                                         ;
;                                                                                                                      ;
; This will be called when a test finishes.                                                                            ;
; The failure or success status is based on the VE register.                                                           ;
; -------------------------------------------------------------------------------------------------------------------- ;
finish:

	; DrawX: V1
	; DrawY: V2
	; TensS: V3
	; OnesS: V4

	; Calculate DrawX, DrawY
	LD div_dividend, test_number
	LD div_divisor, 4
	CALL div
	LD V1, output2
	LD V2, output

	; Multiply DrawX
	LD mul_multiplicand, V1
	LD mul_multiplier, 16
	CALL mul
	LD V1, output
	ADD V1, 1

	; Multiply DrawY
	LD mul_multiplicand, V2
	LD mul_multiplier, 4
	CALL mul
	LD V2, output
	ADD V2, 1

	; Calculate Sprites
	LD div_dividend, test_number
	LD div_divisor, 10
	CALL div
	LD V3, output
	LD V4, output2

	; Draw Test: 10s
	LD I, sprite_0
	LD mul_multiplicand, 3
	LD mul_multiplier, V3
	CALL mul
	ADD I, output
	DRW V1, V2, 3

	; Draw Test: 1s
	LD I, sprite_0
	LD mul_multiplicand, 3
	LD mul_multiplier, V4
	CALL mul
	ADD V1, 4
	ADD I, output
	DRW V1, V2, 3

	; Draw Test: Status
	LD I, sprite_fail
	SNE test_result, 1
	LD I, sprite_pass
	ADD V1, 4
	DRW V1, V2, 3

	; Done.
	RET

; -------------------------------------------------------------------------------------------------------------------- ;
; SPRITES:                                                                                                             ;
; -------------------------------------------------------------------------------------------------------------------- ;
sprite_test:
db	%11100000,
	%01000000,
	%01000000

sprite_fail:
db	%10100000,
	%01000000,
	%10100000

sprite_pass:
db	%00100000,
	%10100000,
	%01000000

sprite_0:
db	%11100000,
	%10100000,
	%11100000

sprite_1:
db	%11000000,
	%01000000,
	%11100000

sprite_2:
db	%11000000,
	%01000000,
	%01100000

sprite_3:
db	%11100000,
	%01100000,
	%11100000

sprite_4:
db	%10100000,
	%11100000,
	%00100000

sprite_5:
db	%01100000,
	%01000000,
	%11000000

sprite_6:
db	%10000000,
	%11100000,
	%11100000

sprite_7:
db	%11100000,
	%00100000,
	%00100000

sprite_8:
db	%11100000,
	%11100000,
	%11100000

sprite_9:
db	%11100000,
	%11100000,
	%00100000

; -------------------------------------------------------------------------------------------------------------------- ;
; SPRITES: Test Sprites                                                                                                ;
; -------------------------------------------------------------------------------------------------------------------- ;
sprite_wrap_test:
db	%11000000,
	%11000000

sprite_collide:
db	%10000000

; -------------------------------------------------------------------------------------------------------------------- ;
; DATA: Test Data                                                                                                      ;
; -------------------------------------------------------------------------------------------------------------------- ;
data_test_indirect_read:
db	1, 2, 3, 4

data_test_indirect_write:
db	0, 0, 0, 0

data_test_add:
db	0, 1, 2, 3
