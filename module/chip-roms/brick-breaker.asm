; -------------------------------------------------------------------------------------------------------------------- ;
; Chip-8 Brick Breaker                                                                                                 ;
; Copyright (C) 2019 Kyle Saburao                                                                                      ;
; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -;
; This program was designed to be assembled with https://github.com/wernsey/chip8                                      ;
; It will later be converted to the syntax used for our assembler.                                                     ;
; -------------------------------------------------------------------------------------------------------------------- ;
define LIVES_X V4
define TARGETS_LEFT V5
define LIVES_LEFT V6
define BALL_X_OLD V7
define BALL_Y_OLD V8
define BALL_V V9
define BALL_X VA
define BALL_Y VB
define PADDLE_X VC
define PADDLE_Y_VALUE #1F
define PADDLE_X_OLD VD
define PADDLE_X_MAX #38
define PADDLE_SPEED #3
define BALL_COLLIDE VE
define PADDLE_X_DEFAULT_VALUE #1C
define LEFT_KEY #7
define RIGHT_KEY #9
define ONE #1
define BALL_X_MAX #3F
define BALL_Y_MAX #1F
define TARGET_ROW_COUNT #5
define TARGET_ROW_SPACING #4
define TARGET_ROW_INITIAL_Y_COORDINATE #4
define DEFAULT_LIVES_COUNT #3

splash_screen:
	LD V0, #C ; x
	LD V1, #A ; y

	; BRICK
	LD I, sprite_BR
	DRW V0, V1, #5
	
	ADD V0, #8

	LD I, sprite_IC
	DRW V0, V1, #5

	ADD V0, #8

	LD I, sprite_K
	DRW V0, V1, #5

	; BREAKER
	ADD V1, #8

	LD I, sprite_BR
	DRW V0, V1, #5
	ADD V0, #8

	LD I, sprite_EA
	DRW V0, V1, #5
	ADD V0, #7

	LD I, sprite_K
	DRW V0, V1, #5
	ADD V0, #4

	LD I, sprite_ER
	DRW V0, V1, #5

	LD V0, #B4
	LD DT, V0
	LD ST, V0
	CALL wait

	JP init

init:
	CLS
	LD LIVES_LEFT, #3
	LD TARGETS_LEFT, #0
	CALL load_targets
	CALL load_lives_indicator ; Call after load_targets

	JP init_round

init_round:
	LD PADDLE_X, PADDLE_X_DEFAULT_VALUE
	LD PADDLE_X_OLD, PADDLE_X

	; Draw paddle at default location
	LD V0, PADDLE_X_DEFAULT_VALUE
	LD V1, PADDLE_Y_VALUE
	LD I, sprite_paddle
	DRW V0, V1, #1

	; Initialize ball
	; BALL_V = (isDXPos, isDYPos)
	LD BALL_V, #11

	RND V0, #F
	LD V1, #7
	CALL greater_than
	SNE V2, #1
	JP init_ball_right
	init_ball_left:
		CALL set_ball_dx_neg
		JP init_ball_continue

	init_ball_right:
		CALL set_ball_dx_pos

	init_ball_continue:

	LD BALL_X, #1F
	LD BALL_Y, #13

	; Draw ball at default location
	CALL render_ball

	JP loop

; Clear the old sprites
init_new_round:
	LD V0, #1
	SUB LIVES_LEFT, V0
	LD V0, PADDLE_X
	LD V1, PADDLE_Y_VALUE
	LD I, sprite_paddle
	DRW V0, V1, #1
	LD I, sprite_ball
	DRW BALL_X, BALL_Y, #1
	LD V0, #0
	DRW LIVES_X, V0, #1
	LD V0, #2
	SUB LIVES_X, V0
	JP init_round

lost_game:
	JP init

loop:
	CALL input_paddle
	; CALL paddle_ai
	CALL render_paddle
	CALL move_ball
	CALL render_old_ball
	CALL render_ball

	LD BALL_COLLIDE, VF
	SE BALL_COLLIDE, #1
	JP loop_no_collide

	loop_collide:
		LD V0, #1
		LD ST, V0

		SE BALL_Y, BALL_Y_MAX
		JP loop_collide_target

		loop_collide_paddle:
			; Bounce angle determined by hit location on paddle
			LD V0, BALL_X
			SUB V0, PADDLE_X

			SNE V0, #0
			JP loop_collide_paddle_left
			SNE V0, #1
			JP loop_collide_paddle_left
			SNE V0, #2
			JP loop_collide_paddle_left
			SNE V0, #3
			JP loop_collide_paddle_left
			SNE V0, #4
			JP loop_collide_paddle_right
			SNE V0, #5
			JP loop_collide_paddle_right
			SNE V0, #6
			JP loop_collide_paddle_right
			SNE V0, #7
			JP loop_collide_paddle_right

			loop_collide_paddle_left:
				CALL set_ball_dx_neg
				JP loop_collide_check_end

			loop_collide_paddle_right:
				CALL set_ball_dx_pos
				JP loop_collide_check_end

			JP loop_collide_check_end

		; Handle collision with target
		; Expect the target sprite hit location to be unset
		loop_collide_target:

			; Skip if the ball is at the top y = 0
			SNE BALL_Y, #0
			JP loop_collide_check_end

			CALL render_ball ; Reset target to full sprite

			LD V0, BALL_X
			LD V1, #1

			loop_collide_target_loop: ; Find the left-most pixel of the target
				CALL render_ball
				LD V2, VF
				CALL render_ball
				SUB BALL_X, V1
				SNE V2, #1
				JP loop_collide_target_loop
			
			ADD BALL_X, #2

			LD I, sprite_target
			DRW BALL_X, BALL_Y, #1

			loop_collide_target_end:
				LD BALL_X, V0
				CALL render_ball
				CALL flip_ball_dy
				LD V0, #1
				SUB TARGETS_LEFT, V0
				SNE TARGETS_LEFT, #0
				JP game_win
				JP loop_collide_check_end

	loop_no_collide:

		SE BALL_Y, BALL_Y_MAX
		JP loop_no_collide_other

		loop_no_collide_bottom:
			CALL game_lost
			CALL wait
			SNE LIVES_LEFT, #1
				JP start_new_game
			start_new_round:
				JP init_new_round
			start_new_game:
				JP lost_game

		loop_no_collide_other:
			JP loop_collide_check_end

	loop_collide_check_end:
	
	loop_timer:
		LD V0, #3
		LD DT, V0
		CALL wait
	
	JP loop

reset:
	JP init

game_win:
	CLS

	; Draw "You win!"

	LD V0, #11
	LD V1, #D

	LD I, sprite_YO
	DRW V0, V1, #5
	ADD V0, #8

	LD I, sprite_U
	DRW V0, V1, #5
	ADD V0, #6

	LD I, sprite_W
	DRW V0, V1, #5
	ADD V0, #6

	LD I, sprite_IN
	DRW V0, V1, #5
	ADD V0, #8

	LD I, sprite_e_mark
	DRW V0, V1, #5

	; Beep and delay
	LD V0, #3C
	LD DT, V0
	LD ST, V0

	CALL wait

	JP init

load_lives_indicator:
	LD I, sprite_ball
	LD LIVES_X, #2 ; x
	LD V1, #0 ; y
	LD V2, #0 ; count
	load_lives_indicator_loop:
		DRW LIVES_X, V1, #1
		ADD LIVES_X, #2
		ADD V2, #1
		SE V2, DEFAULT_LIVES_COUNT
		JP load_lives_indicator_loop
	LD V0, #2
	SUB LIVES_X, V0
	RET

load_targets:
	LD V3, #2 ; x
	LD V4, TARGET_ROW_INITIAL_Y_COORDINATE; y
	LD VE, #1 ; ROW COUNT
	LD I, sprite_target
	load_targets_y:
		LD V3, #2
		load_targets_x:
			DRW V3, V4, #1
			ADD TARGETS_LEFT, #1
			ADD V3, #4
			LD V0, V3
			LD V1, #3A
			CALL greater_than
			SNE V2, #0
			JP load_targets_x

		ADD VE, #1
		ADD V4, #3
		LD V0, VE
		LD V1, TARGET_ROW_COUNT
		CALL greater_than
		SNE V2, #0
		JP load_targets_y

		LD VE, #0
	RET

game_lost:
	LD V0, #1E
	LD ST, V0
	LD DT, V0
	RET

; -----------------------------------------------------------------------------

paddle_ai:

	LD PADDLE_X_OLD, PADDLE_X
	LD V0, PADDLE_X
	ADD V0, #2
	LD V1, BALL_X

	CALL less_than
	SNE V2, #1
	JP paddle_ai_right
	JP paddle_ai_left

	paddle_ai_left:
		LD V0, #1
		SNE PADDLE_X, #0
		JP paddle_ai_exit
		SUB PADDLE_X, V0
		JP paddle_ai_exit

	paddle_ai_right:
		SNE PADDLE_X, PADDLE_X_MAX
		JP paddle_ai_exit
		ADD PADDLE_X, #1

	paddle_ai_exit:
		RET

input_paddle:
	
	LD PADDLE_X_OLD, PADDLE_X

	check_left_key:
		LD V0, LEFT_KEY
		SKP V0
		JP check_left_key_disallowed

		check_left_key_allowed:

			LD V0, PADDLE_X
			LD V1, PADDLE_SPEED
			CALL less_than
			SNE V2, #0
			JP check_left_key_allowed_continue

			move_paddle_to_zero:
				LD PADDLE_X, #0
				JP check_right_key

			check_left_key_allowed_continue:

				LD V0, PADDLE_X
				LD V1, #1
				CALL greater_than
				SE V2, #1
				JP check_right_key

				LD V0, PADDLE_SPEED
				SUB PADDLE_X, V0
				JP check_right_key

		check_left_key_disallowed:
			JP check_right_key

		JP check_right_key
		

	check_right_key:
		LD V0, RIGHT_KEY
		SKP V0
		JP player_input_exit
		ADD PADDLE_X, PADDLE_SPEED
		LD V0, PADDLE_X
		LD V1, PADDLE_X_MAX
		CALL greater_than
		SE V2, #1
		JP player_input_exit

		shift_paddle_left:
			LD PADDLE_X, PADDLE_X_MAX

	player_input_exit:
		RET

render_paddle:
	; Only do any rendering if the paddle has moved
	SNE PADDLE_X, PADDLE_X_OLD
	JP render_paddle_exit

	LD I, sprite_paddle
	LD V0, PADDLE_Y_VALUE

	clear_old_paddle:
		DRW PADDLE_X_OLD, V0, ONE

	draw_new_paddle:	
		DRW PADDLE_X, V0, ONE
	
	render_paddle_exit:
		RET

; BALL -----------------------------------------------------------------------

; Set VF = 1 if the ball collides with a sprite
test_ball_collision:
	CALL render_ball
	CALL render_ball
	RET

decide_ball_movement:
	
	; Bounce off walls

	SNE BALL_X, #0
	CALL set_ball_dx_pos

	SNE BALL_X, BALL_X_MAX
	CALL set_ball_dx_neg

	SNE BALL_Y, #0
	CALL set_ball_dy_pos

	SNE BALL_Y, BALL_Y_MAX
	CALL set_ball_dy_neg

	decide_ball_movement_exit:
		RET

move_ball:
	LD BALL_X_OLD, BALL_X
	LD BALL_Y_OLD, BALL_Y

	CALL decide_ball_movement

	move_ball_x:
		CALL is_ball_dx_pos
		SE V0, #1
		JP move_ball_x_neg
		move_ball_x_pos:
			ADD BALL_X, #1
			JP move_ball_y

		move_ball_x_neg:
			LD V0, #1
			SUB BALL_X, V0

	move_ball_y:
		CALL is_ball_dy_pos
		SE V0, #1
		JP move_ball_y_neg
		move_ball_y_pos:
			ADD BALL_Y, #1
			RET

		move_ball_y_neg:
			LD V0, #1
			SUB BALL_Y, V0
	RET

set_ball_dx_pos:
	LD V0, #10
	OR BALL_V, V0
	RET

set_ball_dx_neg:
	LD V0, #1
	AND BALL_V, V0
	RET

set_ball_dy_pos:
	LD V0, #1
	OR BALL_V, V0
	RET

set_ball_dy_neg:
	LD V0, #10
	AND BALL_V, V0
	RET

; Store ball dx > 0 in V0
is_ball_dx_pos:
	LD V0, BALL_V
	LD V1, #10
	AND V0, V1

	SE V0, #10
	JP is_ball_dx_pos_false

	is_ball_dx_pos_true:
		LD V0, #1
		RET

	is_ball_dx_pos_false:
		LD V0, #0

	RET

; Store ball dy > 0 in V0
is_ball_dy_pos:
	LD V0, BALL_V
	LD V1, #1
	AND V0, V1
	RET

flip_ball_dx:
	CALL is_ball_dx_pos
	SE V0, #1
	JP flip_ball_dx_currentneg

	flip_ball_dx_currentpos:
		CALL set_ball_dx_neg
		JP flip_ball_dx_end

	flip_ball_dx_currentneg:
		CALL set_ball_dx_pos

	flip_ball_dx_end:
		RET

flip_ball_dy:
	CALL is_ball_dy_pos
	SE V0, #1
	JP flip_ball_dy_currentneg

	flip_ball_dy_currentpos:
		CALL set_ball_dy_neg
		JP flip_ball_dy_end

	flip_ball_dy_currentneg:
		CALL set_ball_dy_pos

	flip_ball_dy_end:
		RET

render_old_ball:
	LD I, sprite_ball
	DRW BALL_X_OLD, BALL_Y_OLD, #1
	RET

render_ball:
	LD I, sprite_ball
	DRW BALL_X, BALL_Y, #1
	RET

; ----------------------------------------------------------------------------

wait:
	wait_loop:
		LD V0, DT
		SE V0, #0
		JP wait_loop
	RET

; Set V2 = V0 < V1
less_than:
	LD V2, V0
	SUB V2, V1
	SE VF, #0
	JP less_than_false

	less_than_true:
		LD V2, #1
		RET

	less_than_false:
		LD V2, #0
		RET

; Set V2 = V0 > V1
greater_than:
	SNE V0, V1
	JP greater_than_false

	CALL less_than
	SE V2, #1
	JP greater_than_true
	JP greater_than_false

	greater_than_true:
		LD V2, #1
		RET

	greater_than_false:
		LD V2, #0
		RET

; SPRITES --------------------------------------------------

; 8 wide
sprite_paddle:
	db
	#ff

sprite_target:
	db
	#e0

sprite_ball:
	db
	#80

sprite_BR:
	db
	#cc,
	#aa,
	#cc,
	#aa,
	#ca

sprite_IC:
	db
	#ee,
	#48,
	#48,
	#48,
	#ee

sprite_K:
	db
	#a0,
	#a0,
	#c0,
	#a0,
	#a0

sprite_EA:
	db
	#c8,
	#94,
	#dc,
	#94,
	#d4

sprite_ER:
	db
	#d8,
	#94,
	#d8,
	#94,
	#d4

sprite_YO:
	db
	#ae,
	#aa,
	#ea,
	#2a,
	#ee

sprite_U:
	db
	#a0,
	#a0,
	#a0,
	#a0,
	#e0

sprite_W:
	db
	#88,
	#88,
	#88,
	#a8,
	#50

sprite_IN:
	db
	#ee,
	#4a,
	#4a,
	#4a,
	#ea

sprite_e_mark:
	db
	#80,
	#80,
	#80,
	#0,
	#80