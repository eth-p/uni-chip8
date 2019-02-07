define BALL_X VA
define BALL_Y VB
define PADDLE_X VC ; This is the left-most x position of the paddle.

; Initialize the game to a start state
init:

	jp loop


loop:

	jp loop


; Expect that the call stack has been cleared before jumping to reset
reset:
	jp init


; 1 pixel wide
ball:
	db
	#80

; 4 pixels wide
paddle:
	db
	#f0

; 3 pixels wide
target:
	db
	#e0
