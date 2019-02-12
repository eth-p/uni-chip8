define BALL_X VA
define BALL_Y VB
define PADDLE_X VC
define PADDLE_Y_VALUE #1F
define PADDLE_X_OLD VD
define PADDLE_X_DEFAULT_VALUE #1F
define LEFT_KEY #1
define RIGHT_KEY #2
define ONE #1

init:
	LD PADDLE_X, PADDLE_X_DEFAULT_VALUE
	LD PADDLE_X_OLD, PADDLE_X
	CALL load_targets

	; Draw paddle at default location
	LD V0, PADDLE_X_DEFAULT_VALUE
	LD V1, PADDLE_Y_VALUE
	LD I, sprite_paddle
	DRW V0, V1, #1

	; Initialize ball
	LD BALL_X, #1F
	LD BALL_Y, #15

	; Draw ball at default location
	CALL render_ball

	JP loop

loop:
	CALL input_paddle
	CALL render_paddle
	LD V0, #1
	LD DT, V0
	CALL wait
	JP loop

reset:
	JP init

load_targets:
	LD V0, #2 ; x
	LD V1, #2; y
	LD I, sprite_target
	load_targets_y:
		load_targets_x:

			DRW V0, V1, #1
			ADD V0, #4
			SE V0, #3e
			JP load_targets_x
			LD V0, #2

		ADD V1, #3
		SE V1, #11
		JP load_targets_y
	RET


input_paddle:
	
	LD PADDLE_X_OLD, PADDLE_X

	check_left_key:
		LD V0, LEFT_KEY
		SKP V0
		JP check_right_key
		LD V0, ONE
		SUB PADDLE_X, V0

	check_right_key:
		LD V0, RIGHT_KEY
		SKP V0
		JP player_input_exit
		ADD PADDLE_X, ONE

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

; Set VF = 1 if the ball collides with a sprite
test_ball_collision:
	CALL render_ball
	CALL render_ball
	RET

render_ball:
	LD I, sprite_ball
	DRW BALL_X, BALL_Y, #1
	RET

wait:
	wait_loop:
		LD V0, DT
		SE V0, #0
		JP wait_loop
	RET

; SPRITES --------------------------------------------------

sprite_paddle:
	db
	#fc

sprite_target:
	db
	#e0

sprite_ball:
	db
	#80