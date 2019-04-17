; -------------------------------------------------------------------------------------------------------------------- ;
; Advanced Warfare (F to Pay Respects)                                                                                 ;
; Copyright (C) 2019 Ethan Pini                                                                                        ;
; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -;
; This program was designed to be assembled with https://github.com/wernsey/chip8                                      ;
; -------------------------------------------------------------------------------------------------------------------- ;
define x VA
define y VB
define dg0 V5
define dg1 V6
define dg2 V7
define is_down VC
define scratch V0
define scratch2 V1
define scratch3 V2

; -------------------------------------------------------------------------------------------------------------------- ;
; ENTRY:                                                                                                               ;
; -------------------------------------------------------------------------------------------------------------------- ;
entry:
	LD dg0, 0
	LD dg1, 0
	LD dg2, 0
	LD is_down, 0
	CALL init
	CALL draw_score
	JP main

init:
	LD scratch, 5
	LD scratch2, 0
	LD I, sprite_instructions
	LD x, 4
	LD y, 2

	init_draw_instructions:
		DRW x, y, 5
		ADD x, 8
		ADD I, scratch
		ADD scratch2, 1
		SNE scratch2, 7
			JP init_draw_f
		JP init_draw_instructions

	init_draw_f:
		LD I, sprite_key
		LD x, 28
		LD y, 12
		DRW x, y, 8
		RET

main:
	LD scratch, #0F

	; Reset is_down if key is released.
	SKP scratch
		LD is_down, 0

	; Jump to beginning if key is still down.
	SE is_down, 0
		JP main

	; Jump to beginning if key is not down.
	SKP scratch
		JP main

	; Key is down!
	LD is_down, 1

	LD scratch, 4
	LD ST, scratch
	CALL draw_score
	CALL increment
	CALL draw_score

	JP main


; -------------------------------------------------------------------------------------------------------------------- ;
; WIN:                                                                                                                 ;
; -------------------------------------------------------------------------------------------------------------------- ;
win:
	CLS
	LD I, sprite_win
	LD x, 28
	LD y, 13
	DRW x, y, 5
	JP halt

; -------------------------------------------------------------------------------------------------------------------- ;
; SCORE:                                                                                                               ;
; -------------------------------------------------------------------------------------------------------------------- ;
draw_score:
	LD x, 17
	LD y, 25

	LD scratch, dg2
	CALL draw_score_segment
	LD scratch, dg1
	CALL draw_score_segment
	LD scratch, dg0
	CALL draw_score_segment
	RET

draw_score_segment:
	; Get human representation.
	LD I, b_target
	LD B, scratch
	LD V2, [I]

	; Draw first digit.
	LD F, V1
	DRW x, y, 5
	ADD x, 5

	; Draw second digit.
	LD F, V2
	DRW x, y, 5
	ADD x, 5

	; Return.
	RET

; -------------------------------------------------------------------------------------------------------------------- ;
; INCREMENT:                                                                                                           ;
; -------------------------------------------------------------------------------------------------------------------- ;
increment:
	SNE dg2, 100
	CALL win

	increment_dg0:
		ADD dg0, 1
		SE dg0, 100
			RET

		LD dg0, 0

	increment_dg1:
		ADD dg1, 1
		SE dg1, 100
			RET

		LD dg1, 0

	increment_dg2:
		ADD dg2, 1
		SE dg1, 100
			RET

		JP win

; -------------------------------------------------------------------------------------------------------------------- ;
; HALT:                                                                                                                ;
; -------------------------------------------------------------------------------------------------------------------- ;
halt:
	LD VF, K
	JP halt

; -------------------------------------------------------------------------------------------------------------------- ;
; DATA:                                                                                                                ;
; -------------------------------------------------------------------------------------------------------------------- ;
b_target:
	db 0, 0, 0

; -------------------------------------------------------------------------------------------------------------------- ;
; SPRITES:                                                                                                             ;
; -------------------------------------------------------------------------------------------------------------------- ;
sprite_key:
db	%11111111,
	%10000001,
	%10111101,
	%10100001,
	%10111101,
	%10100001,
	%10000001,
	%11111111

sprite_instructions:
db	%11110111,
	%10010100,
	%11110111,
	%10000100,
	%10000100

db	%10101000,
	%10101000,
	%10111000,
	%10010000,
	%10010000

db	%00111101,
	%00100101,
	%00111101,
	%00101001,
	%00100101

db	%11101111,
	%00001000,
	%11101111,
	%00000001,
	%11101111

db	%01111011,
	%01001010,
	%01111011,
	%01000010,
	%01000011

db	%11011110,
	%00010000,
	%11010000,
	%00010000,
	%11011110

db	%11101111,
	%01001000,
	%01001111,
	%01000001,
	%01001111

sprite_win:
db	%11110000,
	%10000000,
	%11110000,
	%10000000,
	%10000000
