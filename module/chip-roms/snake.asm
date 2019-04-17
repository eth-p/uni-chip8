; -------------------------------------------------------------------------------------------------------------------- ;
; This program was designed to be assembled with https://github.com/wernsey/chip8                                      ;
; -------------------------------------------------------------------------------------------------------------------- ;

define headX V0
define headY V1
define tailX V2
define tailY V3
define dirX V4
define dirY V5
define subb V6
define length V7
define temp VE

init:
	LD headX, 31
	LD headY, 15
	LD dirX, 1
	LD dirY, 1
	LD temp, 1
	LD length, 4
	LD I, sprite
	

	CLS

	LD temp, K

	right:
	SNE temp, 9
	;JP 
	;LD tailX, 30
	;LD tailY, 15
	LD dirX, 2

	left:
	SNE temp, 7
	;LD tailX, 
	LD dirX, 0

	down:
	SNE temp, 8
	LD dirY, 2

	up:
	SNE temp, 5
	LD dirY, 0

	JP loop


loop:
	LD temp, #2
	LD DT, temp
	CALL wait

	LD I, sprite
	DRW headX, headY, 1
	SNE VF, 1
	JP end

	LD V8, 1
	LD V9, 1
	LD subb, 1
	
	LD temp, 9		;key right
	SKNP temp
	ADD V8, 1

	LD temp, 7		;key left
	SKNP temp
	SUB V8, subb

	LD temp, 8		;key down
	SKNP temp
	ADD V9, 1
	
	LD temp, 5		;key up
	SKNP temp
	SUB V9, subb

	SE V8,1
	JP turnX

	SE V9,1
	JP turnY

	move:
		SUB headX, subb
		SUB headY, subb
		
		ADD headX, dirX
		ADD headY, dirY

		JP loop

wait:
	waitLoop:
		LD temp, DT
		SE temp, #0
		JP waitLoop
	RET


turnX:
	SE V9, 1
	JP move
	
	LD DirX, V8
	LD DirY, 1
	JP move
	
turnY:
	SE V8, 1
	JP move
	
	LD DirX, 1
	LD DirY, V9
	JP move

end:
	LD I, 0
	JP init

sprite:
db %1,
