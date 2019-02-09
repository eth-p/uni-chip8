define BALL_X VA
define BALL_Y VB
define PADDLE_X VC
define PADDLE_Y #1F
define PADDLE_X_OLD VD
define LEFT_KEY #1
define RIGHT_KEY #2
define ONE #1

init:
	LD PADDLE_X, #1F
	LD PADDLE_X_OLD, PADDLE_X
	LD I, sprite_paddle
	LD V0, PADDLE_Y
	DRW PADDLE_X, V0, ONE
	JP loop

loop:
	CALL input_paddle
	CALL render_paddle

	JP loop

reset:

	JP init

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
	LD I, sprite_paddle
	LD V0, PADDLE_Y
	SE PADDLE_X, PADDLE_X_OLD
	JP draw_new_paddle

	clear_old_paddle:
		DRW PADDLE_X_OLD, V0, ONE

	draw_new_paddle:	
		DRW PADDLE_X, V0, ONE
	
	render_paddle_exit:
		RET

; SPRITES --------------------------------------------------

sprite_paddle:
	db
	#f0