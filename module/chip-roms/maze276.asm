;----------------------------------------------------------------------------
;This program was designed to be assembled with https://github.com/wernsey/chip8                                      
; This Program was designed by Firas Fakih
; March 9th 2019
; ---------MAZE-------------
;This Program spawns a random maze everytime it is loaded and the goal of the game is for the user to try and escape the maze.
;--------------------------------------------------------------------------

vars:
	LD V0,0
	LD V1,0
	LD V4,0  ; Using V4 as a Storage register to compare with V2 and V1 

main:
	LD I,DRAW_Y
	RND V2,1
	LD V4,1
	SE V2,V4
	LD I,DRAW_X
	DRW V0,V1,4
	ADD V0,5            ; We have to update V0 (X coordinate)
	LD V4,60
	SE V0,V4
	JP main
	LD V0,0
	ADD V1,5			 ; Update V1 (Y Cooridinate)
	LD V4,30           
	SE V1,V4
	JP main

	endLoop:
		JP endLoop      

		; Infinite Loop to keep state and not redraw sprites.
		; TIMESTAMP: WEDNESDAY MARCH 6th 8:31PM


DRAW_X:
	db	%10000000,
		%01000000,
		%00100000,
		%00010000
		
DRAW_Y:
	db	%00010000, 	
		%00100000,
		%01000000,
		%10000000
		
		;TIMESTAMP FRIDAY MARCH 8TH 11:42PM
