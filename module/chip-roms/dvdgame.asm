define key_reg V3
define SCORE V4
define score_x V5
define score_y V6
define x_pos VA
define y_pos VB
define x_inc VC
define y_inc VD
define one V9
define loop_at_least_once V1
define dvd_width #8
define dvd_height #7
define increasing #1
define decreasing #0
define coord_min #0
define x_max #35
define y_max #19

; Reserve VE

init:
	LD x_pos, #25
	LD y_pos, #16
	LD x_inc, #0
	LD y_inc, #0
	LD SCORE, #0
	LD score_x, #8
	LD score_y, #4
	LD one, #1
	LD loop_at_least_once, #0
	JP loop

; -------------------------------

set_x_inc_pos:
	SE x_pos, x_max
	LD x_inc, increasing
	RET

set_x_inc_dec:
	SE x_pos, coord_min
	LD x_inc, decreasing
	RET

set_y_inc_pos:
	SE y_pos, y_max
	LD y_inc, increasing
	RET

set_y_inc_dec:
	SE y_pos, coord_min
	LD y_inc, decreasing
	RET

bounce_sound:
	LD VE, #5
	LD ST, VE
	RET

flip_x_max:
	LD x_inc, #0
	LD x_pos, #35
	CALL bounce_sound
	RET

flip_y_max:
	LD y_inc, #0
	LD y_pos, #19
	CALL bounce_sound
	RET

flip_x_min:
	LD x_inc, #1
	LD x_pos, #0
	CALL bounce_sound
	RET

flip_y_min:
	LD y_inc, #1
	LD y_pos, #0
	CALL bounce_sound
	RET

move:
	SNE x_pos, x_max
	CALL flip_x_max
	SNE y_pos, y_max
	CALL flip_y_max
	SNE x_pos, coord_min
	CALL flip_x_min
	SNE y_pos, coord_min
	CALL flip_y_min

	SNE x_inc, increasing
	ADD x_pos, increasing
	SNE y_inc, increasing
	ADD y_pos, increasing
	SNE x_inc, decreasing
	SUB x_pos, one
	SNE y_inc, decreasing
	SUB y_pos, one
	RET

; -------------------------------

scoring:
	LD VE, #0

	; Jump table
	SNE x_pos, #0
	JP scoring_left
	SNE x_pos, x_max	
	JP scoring_right
	JP scoring_exit

	scoring_left:
		; y = 0
		SE y_pos, #0
		JP sl_y_max
		JP scoring_add
		
		sl_y_max:
			; y = max
			SE y_pos, y_max
			JP scoring_right
			JP scoring_add

	scoring_right:
		; y = 0
		SE y_pos, #0
		JP sl_r_max
		JP scoring_add
		
		sl_r_max:
			; y = max
			SE y_pos, y_max
			JP scoring_exit
			JP scoring_add

	scoring_add:
		LD VE, #1E
		LD ST, VE
		ADD SCORE, #1
		LD x_pos, #25
		LD y_pos, #16
		SNE SCORE, #A
		JP scoring_win
		JP scoring_exit

	scoring_win:
		; Win at score = 10
		LD I, win_left
		LD V0, #17
		LD V1, #F
		DRW V0, V1, #4
		LD I, win_right
		LD V0, #1F
		DRW V0, V1, #4
		LD V0, #78
		LD DT, V0
		LD ST, V0
		
	scoring_win_timer:
		LD V0, DT
		SE V0, #0
		JP scoring_win_timer
		LD VE, #FF ; Mark VE as reset state
	
	scoring_exit:
		RET

keys:
	LD key_reg, #1
	SKNP key_reg
	CALL set_x_inc_dec
	LD key_reg, #2
	SKNP key_reg
	CALL set_x_inc_pos

draw:
	CLS
	LD F, SCORE
	DRW score_x, score_y, #5
	LD I, dvd_left
	DRW x_pos, y_pos, dvd_height
	LD I, dvd_right
	LD VE, x_pos
	ADD VE, dvd_width
	DRW VE, y_pos, dvd_height
	RET

loop:
	CALL keys
	CALL move
	CALL scoring
	SNE VE, #FF ; If the score reaches 0xa, reset the game
	JP init
	CALL draw
	LD V0, #1
	LD DT, V0
	CALL wait
	JP loop

wait:
	wait_loop:
		LD V0, DT
		SE V0, #0
		JP wait_loop
	RET
; -------------------------------

dvd_left:
	db
	#ca,
	#aa,
	#c4,
	#0,
	#7f,
	#f1,
	#7f

dvd_right:
	db
	#c0,
	#a0,
	#c0,
	#0,
	#c0,
	#e0,
	#c0

win_left:
	db
	#ab,
	#a9,
	#a9,
	#53

win_right:
	db
	#ba,
	#2a,
	#28,
	#aa
