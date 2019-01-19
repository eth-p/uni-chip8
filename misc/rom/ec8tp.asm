; -------------------------------------------------------------------------------------------------------------------- ;
; Chip-8 Test Program                                                                                                  ;
; Copyright (C) 2019 Ethan Pini                                                                                        ;
; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -;
; This program was designed to be assembled with https://github.com/wernsey/chip8                                      ;
; It will later be converted to the syntax used for our assembler.                                                     ;
; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -;
; Registers:                                                                                                           ;
; VD - The test number.                                                                                                ;
; VE - The test result.                                                                                                ;
; -------------------------------------------------------------------------------------------------------------------- ;

; -------------------------------------------------------------------------------------------------------------------- ;
; ENTRY:                                                                                                               ;
; -------------------------------------------------------------------------------------------------------------------- ;
entry:
	CALL test_01
	JP exit

; -------------------------------------------------------------------------------------------------------------------- ;
; TEST 01: DT TIMING                                                                                                   ;
; This will test the timing of the DT register.                                                                        ;
;                                                                                                                      ;
; WARNING: THIS TEST ASSUMES A 500 Hz CLOCK                                                                            ;
; -------------------------------------------------------------------------------------------------------------------- ;
test_01:
	; Initialize test info.
	LD VD, 1

	; Set DT to 2.
	LD V1, 2
	LD DT, V1

	; Run test.
	LD V0, V0        ; NO-OP
	LD V0, V0        ; NO-OP
	LD V0, V0        ; NO-OP
	LD V0, V0        ; NO-OP
	LD V0, V0        ; NO-OP
	LD V0, V0        ; NO-OP
	LD V1, DT        ; Assert DT = 2
	LD V2, DT        ; Assert DT = 2
	LD V3, DT        ; Assert DT = 1
	LD V4, DT        ; Assert DT = 1

	; Check results.
	SE V1, 2
	JP fail

	SE V2, 2
	JP fail

	SE V3, 1
	JP fail

	SE V4, 1
	JP fail

	; Done
	JP success









; -------------------------------------------------------------------------------------------------------------------- ;
; SUCCESS:                                                                                                             ;
; Sets the success flag and jumps to `finish`.                                                                         ;
; -------------------------------------------------------------------------------------------------------------------- ;
success:
	LD VE, 1
	JP finish

; -------------------------------------------------------------------------------------------------------------------- ;
; FAIL:                                                                                                                ;
; Sets the fail flag and jumps to `finish`.                                                                            ;
; -------------------------------------------------------------------------------------------------------------------- ;
fail:
	LD VE, 0
	JP finish

; -------------------------------------------------------------------------------------------------------------------- ;
; FINISH:                                                                                                              ;
; Draws the results of a test.                                                                                         ;
;                                                                                                                      ;
; This will be called when a test finishes.                                                                            ;
; The failure or success status is based on the VE register.                                                           ;
; -------------------------------------------------------------------------------------------------------------------- ;
finish:

	LD V1, VD
	LD V4, 0    ; Loop condition.
	LD V2, 1    ; X
	LD V3, 1    ; Y

finish__calc_y:

	; Calculate Y
	; Equivalent:
	;
	;     while (!(V1 >= 1 && V1 <= 4)) {
	;         V1 -= 4;
	;         V3 += 4;
	;     }
	;

	SNE V1, 1
	LD V4, 1
	SNE V1, 2
	LD V4, 1
	SNE V1, 3
	LD V4, 1
	SNE V1, 4
	LD V4, 1

	SNE V4, 0
	JP finish__calc_y_next
	JP finish__calc_x

finish__calc_y_next:
	LD V0, 4
	SUB V1, V0
	ADD V3, 4
	JP finish__calc_y

finish__calc_x:

	; Calculate X
	; Equivalent:
	;
	;    V2 = V1 * 4;
	;
	SNE V1, 1
	JP finish__calc_places

	LD V0, 1
	ADD V2, 16
	SUB V1, V0
	JP finish__calc_x

finish__calc_places:

	; Calculate the test number.
	; This splits VD into a tens place (V5) and a ones place (V6).

	LD V1, VD
	LD V5, 0    ; 10s.
	LD V6, 0    ; 1s

finish__calc_places_ones:
	SNE V1, 0
	JP finish__draw

	LD V0, 1
	SUB V1, V0

	ADD V6, 1
	SNE V6, 10
	JP finish__calc_places_tens
	JP finish__calc_places_ones

finish__calc_places_tens:
	LD V6, 0
	ADD V5, 1
	JP finish__calc_places_ones

finish__draw:

	; Draw 10s place.
	SNE V5, 0
	LD I, sprite_0
	SNE V5, 1
	LD I, sprite_1
	SNE V5, 2
	LD I, sprite_2
	SNE V5, 3
	LD I, sprite_3
	SNE V5, 4
	LD I, sprite_4
	SNE V5, 5
	LD I, sprite_5
	SNE V5, 6
	LD I, sprite_6
	SNE V5, 7
	LD I, sprite_7
	SNE V5, 8
	LD I, sprite_8
	SNE V5, 9
	LD I, sprite_9
	DRW V2, V3, 3
	ADD V2, 4

	; Draw 1s place.
	SNE V6, 0
	LD I, sprite_0
	SNE V6, 1
	LD I, sprite_1
	SNE V6, 2
	LD I, sprite_2
	SNE V6, 3
	LD I, sprite_3
	SNE V6, 4
	LD I, sprite_4
	SNE V6, 5
	LD I, sprite_5
	SNE V6, 6
	LD I, sprite_6
	SNE V6, 7
	LD I, sprite_7
	SNE V6, 8
	LD I, sprite_8
	SNE V6, 9
	LD I, sprite_9
	DRW V2, V3, 3
	ADD V2, 4

	; Draw result.
	SNE VE, 1
	LD I, sprite_pass
	SNE VE, 0
	LD I, sprite_fail
	DRW V2, V3, 3

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
