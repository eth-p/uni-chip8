; ------------------------------------------------------------------------------------------------------------------------ ;
; Chip-8 Laser Defence                                                                                                      ;
; Copyright (C) 2019 Kyle Saburao                                                                                      ;
; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -;
; This program was designed to be assembled with https://github.com/wernsey/chip8                                      ;
; It will later be converted to the syntax used for our assembler.                                                     ;
; ------------------------------------------------------------------------------------------------------------------------ ;

DEFINE SCRATCH_ONE V0
DEFINE SCRATCH_TWO V1
DEFINE SCRATCH_THREE V2
DEFINE SCRATCH_FOUR V3
DEFINE SCRATCH_FIVE V4
DEFINE SCRATCH_SIX V5
DEFINE TARGET_X V6
DEFINE TARGET_Y V7
DEFINE TARGET_LOCK_X V8
DEFINE TARGET_LOCK_Y V9
DEFINE BEAM_X VA
DEFINE BEAM_Y VB
DEFINE BEAM_ACTIVE VC
DEFINE RETICLE_X VD
DEFINE RETICLE_Y VE

DEFINE UP_KEY #5
DEFINE DOWN_KEY #8
DEFINE LEFT_KEY #7
DEFINE RIGHT_KEY #9
DEFINE LAUNCH_KEY #6
DEFINE ABORT_LAUNCH_KEY #4

DEFINE RETICLE_SPEED #2
DEFINE LOOP_WAIT #2
DEFINE RETICLE_MIN #0
DEFINE RETICLE_X_MAX #3B
DEFINE RETICLE_Y_MAX #1A
DEFINE RETICLE_X_DEFAULT #1E
DEFINE RETICLE_Y_DEFAULT #11
DEFINE TARGET_X_MAX #3D
DEFINE TARGET_Y_MAX #1E

DEFINE BEAMARRAY_X #1D
DEFINE BEAMARRAY_Y #1A

DEFINE BEAM_X_IDLE #20
DEFINE BEAM_Y_IDLE #1C
DEFINE BEAM_X_LAUNCH_LOCATION #20
DEFINE BEAM_Y_LAUNCH_LOCATION #1B

DEFINE SCORE_TOP_X #3
DEFINE SCORE_TOP_Y #3
DEFINE SCORE_SPRITE_MARGIN #5

splashScreen:
    CALL pressToStart
    JP init

init:
    CLS
    CALL initScore
    JP gameRoundInit

gameRoundInit:
    CLS
    LD RETICLE_X, RETICLE_X_DEFAULT
    LD RETICLE_Y, RETICLE_Y_DEFAULT
    CALL renderGround
    CALL renderBeamArray
    CALL renderReticle
    CALL initBeam
    CALL renderBeam
    CALL initRandomTarget
    CALL renderCurrentScore

    LD I, SPRITE_BuildingA
    LD SCRATCH_ONE, #C
    LD SCRATCH_TWO, #1B
    DRW SCRATCH_ONE, SCRATCH_TWO, #4

    LD I, SPRITE_Tower
    LD SCRATCH_ONE, #30
    LD SCRATCH_TWO, #16
    DRW SCRATCH_ONE, SCRATCH_TWO, #9

    JP loop

loop:
    CALL inputReticle
    CALL inputLaunch
    CALL moveTarget
    SNE SCRATCH_ONE, #1
    JP playerIsSafe

    playerLost:
        LD SCRATCH_TWO, #0
        LD SCRATCH_THREE, #10
        LoseLoop:
            CALL generateTargetExplosion1Sprite
            CALL renderTargetExplosion1Sprite
            LD SCRATCH_FOUR, #3
            LD DT, SCRATCH_FOUR
            LD SCRATCH_FOUR, #1
            LD ST, SCRATCH_FOUR
            CALL wait
            ADD SCRATCH_TWO, #1
            SE SCRATCH_TWO, SCRATCH_THREE
            JP LoseLoop
        CALL decrementScore
        JP gameRoundInit

    playerIsSafe:

        CALL handleBeam ; S2 = Target hit

        SNE SCRATCH_TWO, #1
        JP loopTargetHit

        loopTargetNotHit:
            JP loopAfterTargetHitCheck

        loopTargetHit:
            CALL renderTarget
            CALL generateTargetExplosion1Sprite
            CALL generateTargetExplosion2Sprite
            CALL renderTargetExplosion1Sprite
            LD SCRATCH_ONE, #2
            LD SCRATCH_TWO, #1
            LD DT, SCRATCH_ONE
            LD ST, SCRATCH_TWO
            CALL wait
            CALL renderTargetExplosion2Sprite
            LD SCRATCH_ONE, #2
            LD SCRATCH_TWO, #1
            LD DT, SCRATCH_ONE
            LD ST, SCRATCH_TWO
            CALL wait
            CALL renderTargetExplosion2Sprite
            CALL renderTargetExplosion1Sprite
            CALL initRandomTarget
            CALL incrementScore
            JP loopAfterTargetHitCheck

        loopAfterTargetHitCheck:
            LD SCRATCH_ONE, LOOP_WAIT
            LD DT, SCRATCH_ONE
            CALL wait

            JP loop

wait:
    waitLoop:
        LD SCRATCH_ONE, DT
        SE SCRATCH_ONE, #0
        JP waitLoop
    RET

; ------------------------------------------------------------------

pressToStart:
	LD V0, #8
	LD V1, #1A

	; V0 = x, V1 = y
	LD I, SPRITE_p
	DRW V0, V1, #5
	ADD V0, #4

	LD I, SPRITE_r
	DRW V0, V1, #5
	ADD V0, #4

	LD I, SPRITE_e
	DRW V0, V1, #5
	ADD V0, #4

	LD I, SPRITE_s
	DRW V0, V1, #5
	ADD V0, #4

	DRW V0, V1, #5
	ADD V0, #5

	LD I, SPRITE_t
	DRW V0, V1, #5
	ADD V0, #4

	LD I, SPRITE_o
	DRW V0, V1, #5
	ADD V0, #5

	LD I, SPRITE_s
	DRW V0, V1, #5
	ADD V0, #4

	LD I, SPRITE_t
	DRW V0, V1, #5
	ADD V0, #4

	LD I, SPRITE_a
	DRW V0, V1, #5
	ADD V0, #4

	LD I, SPRITE_r
	DRW V0, V1, #5
	ADD V0, #4

	LD I, SPRITE_t
	DRW V0, V1, #5

	LD V0, K ; Halt
	RET

initBeam:
    LD BEAM_X, BEAM_X_LAUNCH_LOCATION
    LD BEAM_Y, BEAM_Y_LAUNCH_LOCATION
    CALL renderBeam
    LD BEAM_X, BEAM_X_IDLE
    LD BEAM_Y, BEAM_Y_IDLE
    LD BEAM_ACTIVE, #0
    RET

isBeamAtTarget:
    LD SCRATCH_ONE, #0
    LD SCRATCH_TWO, #0

    SNE BEAM_X, TARGET_LOCK_X
    LD SCRATCH_ONE, #1

    SNE BEAM_Y, TARGET_LOCK_Y
    LD SCRATCH_TWO, #1

    AND SCRATCH_ONE, SCRATCH_TWO
    RET

handleBeam:
    CALL isBeamIdle
    SNE SCRATCH_ONE, #0
    JP continueHandleBeam 

    LD SCRATCH_TWO, #0
    RET ; Early exit

    continueHandleBeam:

    LD SCRATCH_ONE, #0
    LD SCRATCH_TWO, #0

    SNE BEAM_X, BEAM_X_IDLE
    LD SCRATCH_ONE, #1
    SNE BEAM_Y, BEAM_Y_IDLE
    LD SCRATCH_TWO, #1
    AND SCRATCH_ONE, SCRATCH_TWO
    SNE SCRATCH_ONE, #0
    JP afterLaunch

    launch:
        LD BEAM_X, BEAM_X_LAUNCH_LOCATION
        LD BEAM_Y, BEAM_Y_LAUNCH_LOCATION

    afterLaunch:

    CALL renderBeam

    ; Is beam at the target?
    CALL isBeamAtTarget
    SNE SCRATCH_ONE, #0 ; Not yet
    JP beamNotReachedTarget

    beamReachedTarget:

        LD SCRATCH_THREE, #0
        LD SCRATCH_FOUR, #3

        beamTracing:
            ; Undo beam first
            LD BEAM_X, BEAM_X_LAUNCH_LOCATION
            LD BEAM_Y, BEAM_Y_LAUNCH_LOCATION

            undoBeamLoop:
                undoBeamLoop_X:
                    SNE BEAM_X, TARGET_LOCK_X
                    JP undoBeamLoop_Y

                    LD SCRATCH_ONE, BEAM_X
                    LD SCRATCH_TWO, TARGET_LOCK_X
                    CALL lessThan
                    SNE SCRATCH_ONE, #1
                    JP beamUndoXLess

                    beamUndoXGreater:
                        LD SCRATCH_ONE, #1
                        SUB BEAM_X, SCRATCH_ONE
                        JP undoBeamLoop_Y

                    beamUndoXLess:
                        ADD BEAM_X, #1
                        JP undoBeamLoop_Y

                undoBeamLoop_Y:
                    SNE BEAM_Y, TARGET_LOCK_Y
                    JP undoBeamLoopEnd

                    LD SCRATCH_ONE, BEAM_Y
                    LD SCRATCH_TWO, TARGET_LOCK_Y
                    CALL lessThan
                    SNE SCRATCH_ONE, #1
                    JP beamUndoYLess

                    beamUndoYGreater:
                        LD SCRATCH_ONE, #1
                        SUB BEAM_Y, SCRATCH_ONE
                        JP undoBeamLoopEnd

                    beamUndoYLess:
                        ADD BEAM_Y, #1
                        JP undoBeamLoopEnd

                undoBeamLoopEnd:

                    LD SCRATCH_ONE, #1
                    SE SCRATCH_THREE, #0
                    LD ST, SCRATCH_ONE

                    CALL renderBeam
                    CALL isBeamAtTarget
                    SNE SCRATCH_ONE, #0
                    JP undoBeamLoop

            ADD SCRATCH_THREE, #1
            SE SCRATCH_THREE, SCRATCH_FOUR
            JP beamTracing

        CALL initBeam
        CALL stashToPlayerData

        LD VA, #0
        LD VB, #3

        CALL generateExplosion1Sprite
        CALL generateExplosion2Sprite
        CALL generateExplosion3Sprite

        explosionSoundLoop:
            SNE VA, #0
            CALL renderExplosion1Sprite
            SNE VA, #1
            CALL renderExplosion2Sprite
            SNE VA, #2
            CALL renderExplosion3Sprite
            LD SCRATCH_ONE, #3
            LD DT, SCRATCH_ONE
            LD SCRATCH_TWO, #2
            LD ST, SCRATCH_TWO
            CALL wait
            ADD VA, #1
            SE VA, VB
            JP explosionSoundLoop

        CALL renderExplosion3Sprite
        CALL renderExplosion2Sprite
        CALL renderExplosion1Sprite ; Clear explosion

        CALL unstashFromPlayerData

        ; Check for target at this point

        targetCollideCheck:
            CALL stashToPlayerData
            targetCollideCheckLoop:
                LD SCRATCH_FOUR, TARGET_LOCK_Y ; Y
                LD SCRATCH_FIVE, TARGET_LOCK_X ; X max
                LD SCRATCH_SIX, TARGET_LOCK_Y  ; Y max
                ; Using VD and VE for more scratch space
                ADD SCRATCH_FIVE, #5
                ADD SCRATCH_SIX, #5

                LD SCRATCH_ONE, #2
                SUB SCRATCH_FOUR, SCRATCH_ONE
                SUB SCRATCH_FIVE, SCRATCH_ONE
                SUB SCRATCH_SIX, SCRATCH_ONE

                targetCollideCheckLoop_Y:
                    LD SCRATCH_THREE, TARGET_LOCK_X
                    LD SCRATCH_ONE, #2
                    SUB SCRATCH_THREE, SCRATCH_ONE
                    targetCollideCheckLoop_X:

                        ; Target top left wing
                        LD SCRATCH_ONE, #0
                        LD SCRATCH_TWO, #0
                        LD VD, TARGET_X
                        LD VE, TARGET_Y

                        SNE SCRATCH_THREE, VD
                        LD SCRATCH_ONE, #1
                        SNE SCRATCH_FOUR, VE
                        LD SCRATCH_TWO, #1
                        AND SCRATCH_ONE, SCRATCH_TWO
                        SNE SCRATCH_ONE, #1
                        JP targetWasHit

                        ; Target bottom body
                        LD SCRATCH_ONE, #0
                        LD SCRATCH_TWO, #0
                        LD VD, TARGET_X
                        LD VE, TARGET_Y
                        ADD VD, #1
                        ADD VE, #1

                        SNE SCRATCH_THREE, VD
                        LD SCRATCH_ONE, #1
                        SNE SCRATCH_FOUR, VE
                        LD SCRATCH_TWO, #1
                        AND SCRATCH_ONE, SCRATCH_TWO
                        SNE SCRATCH_ONE, #1
                        JP targetWasHit

                        ; Target top right wing
                        LD SCRATCH_ONE, #0
                        LD SCRATCH_TWO, #0
                        LD VD, TARGET_X
                        LD VE, TARGET_Y
                        ADD VD, #2

                        SNE SCRATCH_THREE, VD
                        LD SCRATCH_ONE, #1
                        SNE SCRATCH_FOUR, VE
                        LD SCRATCH_TWO, #1
                        AND SCRATCH_ONE, SCRATCH_TWO
                        SNE SCRATCH_ONE, #1
                        JP targetWasHit

                        ADD SCRATCH_THREE, #1
                        SE SCRATCH_THREE, SCRATCH_FIVE
                        JP targetCollideCheckLoop_X

                    ADD SCRATCH_FOUR, #1
                    SE SCRATCH_FOUR, SCRATCH_SIX
                    JP targetCollideCheckLoop_Y

                JP targetWasNotHit

            targetWasHit:
                CALL unstashFromPlayerData
                LD SCRATCH_TWO, #1
                JP afterTargetCheck

            targetWasNotHit:
                CALL unstashFromPlayerData
                LD SCRATCH_TWO, #0
                JP afterTargetCheck

        afterTargetCheck:
            RET

    beamNotReachedTarget:
        ; Beam movement

        beamXHandling:
            SNE BEAM_X, TARGET_LOCK_X
            JP beamYHandling

            LD SCRATCH_ONE, BEAM_X
            LD SCRATCH_TWO, TARGET_LOCK_X
            CALL lessThan

            SNE SCRATCH_ONE, #1
            JP beamXLessThanTarget

            beamXGreaterThanTarget:
                LD SCRATCH_ONE, #1
                SUB BEAM_X, SCRATCH_ONE
                JP beamYHandling

            beamXLessThanTarget:
                ADD BEAM_X, #1
                JP beamYHandling

        beamYHandling:
            SNE BEAM_Y, TARGET_LOCK_Y
            JP afterBeamTracking

            LD SCRATCH_ONE, BEAM_Y
            LD SCRATCH_TWO, TARGET_LOCK_Y
            CALL lessThan

            SNE SCRATCH_ONE, #1
            JP beamYLessThanTarget

            beamYGreaterThanTarget:
                LD SCRATCH_ONE, #1
                SUB BEAM_Y, SCRATCH_ONE
                JP afterBeamTracking

            beamYLessThanTarget:
                ADD BEAM_Y, #1
                JP afterBeamTracking

        afterBeamTracking:
            ; Beam sound
            LD SCRATCH_ONE, #1
            LD ST, SCRATCH_ONE

            ; If the beam is too far away on the x-axis, don't check for it
            optimizeBeamDetection_X:
                LD SCRATCH_ONE, BEAM_X
                LD SCRATCH_TWO, TARGET_X
                CALL lessThan
                SNE SCRATCH_ONE, #0
                JP optimizeBeamDetection_X_Greater

                optimizeBeamDetection_X_Less:
                    ; Beam < Target
                    LD SCRATCH_ONE, TARGET_X
                    LD SCRATCH_TWO, BEAM_X
                    SUB SCRATCH_ONE, SCRATCH_TWO
                    ; S1 = T - B
                    LD SCRATCH_TWO, #4
                    CALL greaterThan
                    SNE SCRATCH_ONE, #1
                    JP endBeamHandling

                    JP postBeamDetectionOptimization
                optimizeBeamDetection_X_Greater:
                    ; Beam > Target
                    LD SCRATCH_ONE, BEAM_X
                    LD SCRATCH_TWO, TARGET_X
                    SUB SCRATCH_ONE, SCRATCH_TWO
                    ; S1 = B - T
                    LD SCRATCH_TWO, #4
                    CALL greaterThan
                    SNE SCRATCH_ONE, #1
                    JP endBeamHandling

                    JP postBeamDetectionOptimization

            postBeamDetectionOptimization:

                inFlightCollisionDetection:
                    inFlightCollideTargetTopLeft:
                        LD SCRATCH_ONE, #0
                        LD SCRATCH_TWO, #0
                        LD SCRATCH_THREE, TARGET_X
                        LD SCRATCH_FOUR, TARGET_Y

                        SNE BEAM_X, SCRATCH_THREE
                        LD SCRATCH_ONE, #1
                        SNE BEAM_Y, SCRATCH_FOUR
                        LD SCRATCH_TWO, #1
                        AND SCRATCH_ONE, SCRATCH_TWO
                        SNE SCRATCH_ONE, #1
                        JP beamCollidedWithTarget

                    inFlightCollideTargetBottom:
                        LD SCRATCH_ONE, #0
                        LD SCRATCH_TWO, #0
                        LD SCRATCH_THREE, TARGET_X
                        LD SCRATCH_FOUR, TARGET_Y
                        ADD SCRATCH_THREE, #1
                        ADD SCRATCH_FOUR, #1

                        SNE BEAM_X, SCRATCH_THREE
                        LD SCRATCH_ONE, #1
                        SNE BEAM_Y, SCRATCH_FOUR
                        LD SCRATCH_TWO, #1
                        AND SCRATCH_ONE, SCRATCH_TWO
                        SNE SCRATCH_ONE, #1
                        JP beamCollidedWithTarget

                    inFlightCollideTargetTopRight:
                        LD SCRATCH_ONE, #0
                        LD SCRATCH_TWO, #0
                        LD SCRATCH_THREE, TARGET_X
                        LD SCRATCH_FOUR, TARGET_Y
                        ADD SCRATCH_THREE, #2

                        SNE BEAM_X, SCRATCH_THREE
                        LD SCRATCH_ONE, #1
                        SNE BEAM_Y, SCRATCH_FOUR
                        LD SCRATCH_TWO, #1
                        AND SCRATCH_ONE, SCRATCH_TWO
                        SNE SCRATCH_ONE, #1
                        JP beamCollidedWithTarget

                    JP endBeamHandling
                    beamCollidedWithTarget:
                        LD SCRATCH_ONE, #1F
                        LD ST, SCRATCH_ONE
                        LD TARGET_LOCK_X, BEAM_X
                        LD TARGET_LOCK_Y, BEAM_Y
                        LD SCRATCH_TWO, #1
                        CALL renderBeam
                        JP beamReachedTarget
                        ; RET

        endBeamHandling:        
            LD SCRATCH_TWO, #0
            RET

; S1 = Beam is idle
isBeamIdle:
    SNE BEAM_ACTIVE, #1
    JP isBeamIdleFalse
    SNE BEAM_ACTIVE, #0
    JP isBeamIdleTrue

    isBeamIdleFalse: ; Beam is active
        LD SCRATCH_ONE, #0
        RET

    isBeamIdleTrue:
        LD SCRATCH_ONE, #1
        RET

; ------------------------------------------------------------------

initRandomTarget:
    RND TARGET_X, #3F
    LD SCRATCH_ONE, TARGET_X
    LD SCRATCH_TWO, TARGET_X_MAX
    CALL greaterThan
    SNE SCRATCH_ONE, #1
    LD TARGET_X, TARGET_X_MAX
    LD TARGET_Y, #0
    CALL renderTarget
    RET

; S1 = Target has not destroyed player (Player is safe)
moveTarget:
    CALL hasTargetReachedGround
    SNE SCRATCH_ONE, #0
    JP playerSafe

    playerNotSafe:
        LD SCRATCH_ONE, #0
        RET

    playerSafe:
        RND SCRATCH_ONE, #1
        RND SCRATCH_TWO, #1
        RND SCRATCH_THREE, #1
        AND SCRATCH_ONE, SCRATCH_TWO
        ;AND SCRATCH_ONE, SCRATCH_THREE

        CALL renderTarget

        SNE SCRATCH_ONE, #0
        JP moveTargetFalse
        moveTargetTrue:
            ADD TARGET_Y, #1
        moveTargetFalse:
        CALL renderTarget
        LD SCRATCH_ONE, #1
        RET

; S1 = Target 
hasTargetReachedGround:
    LD SCRATCH_ONE, TARGET_Y
    ;ADD SCRATCH_ONE, #7
    SE SCRATCH_ONE, TARGET_Y_MAX
    JP targetNotReachedGround

    targetReachedGround:
        LD SCRATCH_ONE, #1
        RET

    targetNotReachedGround:
        LD SCRATCH_ONE, #0
        RET

renderTarget:
    LD I, SPRITE_Target
    DRW TARGET_X, TARGET_Y, #2
    RET

; ------------------------------------------------------------------

inputLaunch:
    LD SCRATCH_ONE, LAUNCH_KEY
    SKP SCRATCH_ONE
    JP inputLaunchKeyNotPressed

    inputLaunchKeyPressed:
        CALL isBeamIdle
        SE SCRATCH_ONE, #1
        JP beamAlreadyFired

        beamNotFired:
            ; Missle can be fired

            CALL getTargetX
            LD TARGET_LOCK_X, SCRATCH_ONE

            CALL getTargetY
            LD TARGET_LOCK_Y, SCRATCH_ONE

            LD BEAM_X, BEAM_X_LAUNCH_LOCATION
            LD BEAM_Y, BEAM_Y_LAUNCH_LOCATION
            LD BEAM_ACTIVE, #1

            LD SCRATCH_ONE, #0
            LD SCRATCH_TWO, #0
            SNE TARGET_LOCK_X, #20
            LD SCRATCH_ONE, #1
            SNE TARGET_LOCK_Y, #1C
            LD SCRATCH_TWO, #1
            AND SCRATCH_ONE, SCRATCH_TWO
            SNE SCRATCH_ONE, #1
            LD TARGET_LOCK_Y, #19

            LD SCRATCH_ONE, #3
            LD ST, SCRATCH_ONE
            JP abortBeamKey

        beamAlreadyFired:
            JP abortBeamKey

    inputLaunchKeyNotPressed:

    abortBeamKey:
        LD SCRATCH_ONE, ABORT_LAUNCH_KEY
        SKNP SCRATCH_ONE
        JP abortBeamKeyPressed

        abortBeamDeny:
            JP inputLaunchEnd

        abortBeamKeyPressed:
            CALL isBeamIdle
            SNE SCRATCH_ONE, #1
            JP abortBeamDeny
            LD TARGET_LOCK_X, BEAM_X
            LD TARGET_LOCK_Y, BEAM_Y
            JP inputLaunchEnd

    inputLaunchEnd:
        RET

; ------------------------------------------------------------------

inputReticle:

    ; If the beam is active, don't handle input nor render
    ;CALL isBeamIdle
    ;SNE SCRATCH_ONE, #0
    ;RET

    CALL renderReticle

    upKey:
        LD SCRATCH_ONE, UP_KEY
        SKP SCRATCH_ONE
        JP upKeyNotPressed

        upKeyPressed:
            SNE RETICLE_Y, RETICLE_MIN
            JP downKey

            LD SCRATCH_ONE, RETICLE_Y
            LD SCRATCH_TWO, RETICLE_SPEED
            CALL lessThan
            SNE SCRATCH_ONE, #0
            JP normalReticleUpSpeed
            
            SlowReticleUpSpeed:
                LD SCRATCH_ONE, #1
                SUB RETICLE_Y, SCRATCH_ONE

                JP downKey

            normalReticleUpSpeed:
                LD SCRATCH_ONE, RETICLE_SPEED
                SUB RETICLE_Y, SCRATCH_ONE

                JP downKey

        upKeyNotPressed:

    downKey:
        LD SCRATCH_ONE, DOWN_KEY
        SKP SCRATCH_ONE
        JP downKeyNotPressed

        downKeyPressed:
            SNE RETICLE_Y, RETICLE_Y_MAX
            JP leftKey

            LD SCRATCH_ONE, RETICLE_Y
            LD SCRATCH_TWO, RETICLE_Y_MAX
            LD SCRATCH_THREE, RETICLE_SPEED
            SUB SCRATCH_TWO, SCRATCH_THREE

            CALL greaterThan
            SNE SCRATCH_ONE, #0
            JP normalDownKey

            slowDownKey:
                ADD RETICLE_Y, #1
                JP leftKey

            normalDownKey:
                ADD RETICLE_Y, RETICLE_SPEED
                JP leftKey

            JP leftKey

        downKeyNotPressed:

    leftKey:
        LD SCRATCH_ONE, LEFT_KEY
        SKP SCRATCH_ONE
        JP leftKeyNotPressed

        leftKeyPressed:
            SNE RETICLE_X, RETICLE_MIN
            JP rightKey

            LD SCRATCH_ONE, RETICLE_X
            LD SCRATCH_TWO, RETICLE_SPEED
            CALL lessThan
            SNE SCRATCH_ONE, #0
            JP normalLeftKey

            slowLeftKey:
                LD SCRATCH_ONE, #1
                SUB RETICLE_X, SCRATCH_ONE
                JP rightKey

            normalLeftKey:
                LD SCRATCH_ONE, RETICLE_SPEED
                SUB RETICLE_X, SCRATCH_ONE
                JP rightKey

        leftKeyNotPressed:

    rightKey:
        LD SCRATCH_ONE, RIGHT_KEY
        SKP SCRATCH_ONE
        JP rightKeyNotPressed

        rightKeyPressed:
            SNE RETICLE_X, RETICLE_X_MAX
            JP inputReticleEnd

            LD SCRATCH_ONE, RETICLE_X
            LD SCRATCH_TWO, RETICLE_X_MAX
            LD SCRATCH_THREE, RETICLE_SPEED
            SUB SCRATCH_TWO, SCRATCH_THREE

            CALL greaterThan
            SNE SCRATCH_ONE, #0
            JP normalRightKey

            slowRightKey:
                ADD RETICLE_X, #1
                JP inputReticleEnd

            normalRightKey:
                ADD RETICLE_X, RETICLE_SPEED
                JP inputReticleEnd

        rightKeyNotPressed:

    inputReticleEnd:
        CALL renderReticle
        RET

renderReticle:
    LD I, SPRITE_Reticle
    DRW RETICLE_X, RETICLE_Y, #5
    RET

renderBeam:
    LD I, SPRITE_SingleDot
    DRW BEAM_X, BEAM_Y, #1
    RET

renderBeamArray:
    LD I, SPRITE_BeamArray
    LD SCRATCH_ONE, BEAMARRAY_X
    LD SCRATCH_TWO, BEAMARRAY_Y
    DRW SCRATCH_ONE, SCRATCH_TWO, #5
    RET

; S1 = Reticle centre x
getTargetX:
    LD SCRATCH_ONE, RETICLE_X
    ADD SCRATCH_ONE, #2
    RET

; S1 = Reticle centre y
getTargetY:
    LD SCRATCH_ONE, RETICLE_Y
    ADD SCRATCH_ONE, #2
    RET

renderGround:
    ; S1 = x
    ; S2 = y
    ; S3 = x ceiling

    LD SCRATCH_ONE, #0
    LD SCRATCH_TWO, #1F
    LD SCRATCH_THREE, #40

    LD I, SPRITE_SingleDot
    renderGroundLoop:
        DRW SCRATCH_ONE, SCRATCH_TWO, #1
        ADD SCRATCH_ONE, #1
        SE SCRATCH_ONE, SCRATCH_THREE
        JP renderGroundLoop

    RET

; S1 = S1 < S2
lessThan:
    SUB SCRATCH_ONE, SCRATCH_TWO

    SNE VF, #1 ; No carry
    JP lessThanFalse

    lessThanTrue:
        LD SCRATCH_ONE, #1
        RET

    lessThanFalse:
        LD SCRATCH_ONE, #0
        RET

; S1 = S1 > S2
greaterThan:

    SE SCRATCH_ONE, SCRATCH_TWO
    JP greaterThan_NotEqual

    greaterThan_Equal:
        LD SCRATCH_ONE, #0
        RET

    greaterThan_NotEqual:
        CALL lessThan
        
        SNE SCRATCH_ONE, #1
        JP greaterThanFalse

        greaterThanTrue:
            LD SCRATCH_ONE, #1
            RET

        greaterThanFalse:
            LD SCRATCH_ONE, #0
            RET

; ----------------------------------------------------------------------

stashToPlayerData:
    LD I, StashLocation_PlayerData
    LD [I], VF
    RET

unstashFromPlayerData:
    LD I, StashLocation_PlayerData
    LD VF, [I]
    RET

stashToMiscData:
    LD I, StashLocation_MiscData
    LD [I], VF
    RET

unstashFromMiscData:
    LD I, StashLocation_MiscData
    LD VF, [I]
    RET

stashToScoreData:
    LD I, StashLocation_ScoreData
    LD [I], VF
    RET

unstashFromScoreData:
    LD I, StashLocation_ScoreData
    LD VF, [I]
    RET

; ----------------------------------------------------------------------

initScore:
    CALL stashToPlayerData
    CALL unstashFromScoreData
    LD V3, #0
    CALL stashToScoreData
    CALL unstashFromPlayerData
    CALL renderCurrentScore
    RET

incrementScore:
    CALL renderCurrentScore
    CALL stashToPlayerData
    CALL unstashFromScoreData

    SNE V3, #FF
    JP scoreOverFlow

    scoreNoOverFlow:
        ADD V3, #1
        JP endIncrementScore

    scoreOverFlow:
        LD V3, #0
        JP endIncrementScore

    endIncrementScore:
        CALL stashToScoreData
        CALL unstashFromPlayerData
        CALL renderCurrentScore
        RET

decrementScore:
    CALL renderCurrentScore
    CALL stashToPlayerData
    CALL unstashFromScoreData
    LD V4, #1
    SE V3, #0
    SUB V3, V4
    CALL stashToScoreData
    CALL unstashFromPlayerData
    CALL renderCurrentScore
    RET

; ----------------------------------------------------------------------

renderCurrentScore:
    CALL stashToPlayerData
    CALL unstashFromScoreData
    LD I, StashLocation_ScoreData
    LD B, V3 ; Load score value to bcd
    LD V5, SCORE_TOP_X ; X
    LD V6, SCORE_TOP_Y ; Y

    LD V2, [I]

    LD F, V0
    DRW V5, V6, #5
    ADD V5, SCORE_SPRITE_MARGIN

    LD F, V1
    DRW V5, V6, #5
    ADD V5, SCORE_SPRITE_MARGIN

    LD F, V2
    DRW V5, V6, #5

    CALL stashToScoreData
    CALL unstashFromPlayerData
    RET

generateExplosionSpriteData:
    RND SCRATCH_ONE, #20
    RND SCRATCH_TWO, #70
    RND SCRATCH_THREE, #f8
    RND SCRATCH_FOUR, #70
    RND SCRATCH_FIVE, #20
    RET

; The full explosion sprite is 5x5
; WARNING: UNSAFE REGISTER ACCESS. ONLY USE WITHIN STASHED CONTEXT.
generateExplosion1Sprite:
    CALL stashToMiscData
    CALL generateExplosionSpriteData
    LD I, SPRITE_Explosion1
    LD [I], V4
    CALL unstashFromMiscData
    RET

; WARNING: UNSAFE REGISTER ACCESS. ONLY USE WITHIN STASHED CONTEXT.
renderExplosion1Sprite:
    CALL stashToMiscData
    LD SCRATCH_ONE, TARGET_LOCK_X
    LD SCRATCH_TWO, TARGET_LOCK_Y
    LD SCRATCH_THREE, #2
    SUB SCRATCH_ONE, SCRATCH_THREE
    SUB SCRATCH_TWO, SCRATCH_THREE
    LD I, SPRITE_Explosion1
    DRW SCRATCH_ONE, SCRATCH_TWO, #5
    CALL unstashFromMiscData
    RET

; The full explosion sprite is 5x5
; WARNING: UNSAFE REGISTER ACCESS. ONLY USE WITHIN STASHED CONTEXT.
generateExplosion2Sprite:
    CALL stashToMiscData
    CALL generateExplosionSpriteData
    LD I, SPRITE_Explosion2
    LD [I], V4
    CALL unstashFromMiscData
    RET

; WARNING: UNSAFE REGISTER ACCESS. ONLY USE WITHIN STASHED CONTEXT.
renderExplosion2Sprite:
    CALL stashToMiscData
    LD SCRATCH_ONE, TARGET_LOCK_X
    LD SCRATCH_TWO, TARGET_LOCK_Y
    LD SCRATCH_THREE, #2
    SUB SCRATCH_ONE, SCRATCH_THREE
    SUB SCRATCH_TWO, SCRATCH_THREE
    LD I, SPRITE_Explosion2
    DRW SCRATCH_ONE, SCRATCH_TWO, #5
    CALL unstashFromMiscData
    RET

; The full explosion sprite is 5x5
; WARNING: UNSAFE REGISTER ACCESS. ONLY USE WITHIN STASHED CONTEXT.
generateExplosion3Sprite:
    CALL stashToMiscData
    CALL generateExplosionSpriteData
    LD I, SPRITE_Explosion3
    LD [I], V4
    CALL unstashFromMiscData
    RET

; WARNING: UNSAFE REGISTER ACCESS. ONLY USE WITHIN STASHED CONTEXT.
renderExplosion3Sprite:
    CALL stashToMiscData
    LD SCRATCH_ONE, TARGET_LOCK_X
    LD SCRATCH_TWO, TARGET_LOCK_Y
    LD SCRATCH_THREE, #2
    SUB SCRATCH_ONE, SCRATCH_THREE
    SUB SCRATCH_TWO, SCRATCH_THREE
    LD I, SPRITE_Explosion3
    DRW SCRATCH_ONE, SCRATCH_TWO, #5
    CALL unstashFromMiscData
    RET

generateTargetExplosionSpriteData:
    RND SCRATCH_ONE, #30
    RND SCRATCH_TWO, #78
    RND SCRATCH_THREE, #fc
    RND SCRATCH_FOUR, #fc
    RND SCRATCH_FIVE, #78
    RND SCRATCH_SIX, #30
    RET

; 6 x 6 sprite
generateTargetExplosion1Sprite:
    CALL stashToMiscData
    CALL generateTargetExplosionSpriteData
    LD I, SPRITE_TargetExplosion1
    LD [I], SCRATCH_SIX
    CALL unstashFromMiscData
    RET

renderTargetExplosion1Sprite:
    CALL stashToMiscData
    LD SCRATCH_ONE, TARGET_X
    LD SCRATCH_TWO, TARGET_Y
    LD SCRATCH_THREE, #2
    SUB SCRATCH_ONE, SCRATCH_THREE
    SUB SCRATCH_TWO, SCRATCH_THREE
    LD I, SPRITE_TargetExplosion1
    DRW SCRATCH_ONE, SCRATCH_TWO, #6
    CALL unstashFromMiscData
    RET

; 6 x 6 sprite
generateTargetExplosion2Sprite:
    CALL stashToMiscData
    CALL generateTargetExplosionSpriteData
    LD I, SPRITE_TargetExplosion2
    LD [I], SCRATCH_SIX
    CALL unstashFromMiscData
    RET

renderTargetExplosion2Sprite:
    CALL stashToMiscData
    LD SCRATCH_ONE, TARGET_X
    LD SCRATCH_TWO, TARGET_Y
    LD SCRATCH_THREE, #2
    SUB SCRATCH_ONE, SCRATCH_THREE
    SUB SCRATCH_TWO, SCRATCH_THREE
    LD I, SPRITE_TargetExplosion2
    DRW SCRATCH_ONE, SCRATCH_TWO, #6
    CALL unstashFromMiscData
    RET

; ----------------------------------------------------------------------

; 5 x 5
SPRITE_Reticle:
    db
    #20,
    #70,
    #d8,
    #70,
    #20

; 7 x 5
SPRITE_BeamArray:
    db
    #82,
    #44,
    #28,
    #7c,
    #44

SPRITE_SingleDot:
    db
    #80

StashLocation_MiscData:
    db
    #00, ; V0
    #00,
    #00,
    #00,
    #00,
    #00,
    #00,
    #00,
    #00,
    #00,
    #00,
    #00,
    #00,
    #00,
    #00,
    #00 ; VF

StashLocation_PlayerData:
    db
    #00, ; V0
    #00,
    #00,
    #00,
    #00,
    #00,
    #00,
    #00,
    #00,
    #00,
    #00,
    #00,
    #00,
    #00,
    #00,
    #00 ; VF

StashLocation_ScoreData:
    db
    #00, ; V0 BCD H
    #00, ; V1 BCD T
    #00, ; V2 BCD O
    #00, ; V3 Score
    #00, ; V4
    #00, ; V5
    #00, ; V6
    #00,
    #00,
    #00,
    #00,
    #00,
    #00,
    #00,
    #00,
    #00 ; VF

SPRITE_Explosion1:
    db
    #00,
    #00,
    #00,
    #00,
    #00

SPRITE_Explosion2:
    db
    #00,
    #00,
    #00,
    #00,
    #00

SPRITE_Explosion3:
    db
    #00,
    #00,
    #00,
    #00,
    #00

SPRITE_TargetExplosion1:
    db
    #00,
    #00,
    #00,
    #00,
    #00,
    #00

SPRITE_TargetExplosion2:
    db
    #00,
    #00,
    #00,
    #00,
    #00,
    #00

; 6 x 4
SPRITE_BuildingA:
    db
    #78,
    #fc,
    #84,
    #b4

; 6 x 9
SPRITE_Tower:
    db
    #fc,
    #84,
    #a4,
    #84,
    #94,
    #84,
    #a4,
    #84,
    #94

; 3 x 2
SPRITE_Target:
    db
    #a0,
    #40

SPRITE_p:
    db #e0, #a0, #e0, #80, #80

SPRITE_r:
	db #e0, #a0, #c0, #a0, #a0

SPRITE_e:
	db #e0, #80, #e0, #80, #e0

SPRITE_s:
	db #e0, #80, #e0, #20, #e0

SPRITE_t:
	db #e0, #40, #40, #40, #40

SPRITE_o:
	db #e0, #a0, #a0, #a0, #e0

SPRITE_a:
	db #e0, #a0, #e0, #a0, #a0

SPRITE_Title_L:
    db
    #c0,
    #c0,
    #c0,
    #c0,
    #c0,
    #c0,
    #f0,
    #f0

SPRITE_Title_D:
    db
    #e0,
    #b0,
    #90,
    #90,
    #90,
    #90,
    #b0,
    #e0