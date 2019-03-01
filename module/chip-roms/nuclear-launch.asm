; -------------------------------------------------------------------------------------------------------------------- ;
; Chip-8 DVD Game                                                                                                      ;
; Copyright (C) 2019 Kyle Saburao                                                                                      ;
; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -;
; This program was designed to be assembled with https://github.com/wernsey/chip8                                      ;
; It will later be converted to the syntax used for our assembler.                                                     ;
; -------------------------------------------------------------------------------------------------------------------- ;

DEFINE TARGET_X V4
DEFINE TARGET_Y V5
DEFINE MISSILE_X V6
DEFINE MISSILE_Y V7
DEFINE MISSILE_X_OLD V8
DEFINE MISSILE_Y_OLD V9
DEFINE RETICLE_X VA
DEFINE RETICLE_Y VB
DEFINE RETICLE_X_OLD VC
DEFINE RETICLE_Y_OLD VD
DEFINE SCRATCH_ONE V0
DEFINE SCRATCH_TWO V1
DEFINE SCRATCH_THREE V2

DEFINE UP_KEY #5
DEFINE DOWN_KEY #8
DEFINE LEFT_KEY #7
DEFINE RIGHT_KEY #9
DEFINE LAUNCH_KEY #6

DEFINE RETICLE_SPEED #1
DEFINE LOOP_WAIT #2
DEFINE RETICLE_X_MAX #3B
DEFINE RETICLE_Y_MAX #1B
DEFINE RETICLE_X_DEFAULT #1E
DEFINE RETICLE_Y_DEFAULT #11

DEFINE LAUNCHSILO_X #1D
DEFINE LAUNCHSILO_Y #1B

DEFINE LAUNCH_AVALIABLE_X #1E
DEFINE LAUNCH_AVALIABLE_Y #1A

DEFINE MISSLE_X_LAUNCH_LOCATION #1E
DEFINE MISSLE_Y_LAUNCH_LOCATION #1B


init:
    LD RETICLE_X, RETICLE_X_DEFAULT
    LD RETICLE_Y, RETICLE_Y_DEFAULT
    CALL renderGround
    CALL renderLaunchSilo
    CALL renderReticleNew
    CALL initMissile
    CALL renderMissileNew


    JP loop


loop:
    CALL inputReticle
    CALL renderReticle
    CALL inputLaunch
    CALL handleMissile

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

initMissile:
    LD MISSILE_X, LAUNCH_AVALIABLE_X
    LD MISSILE_Y, LAUNCH_AVALIABLE_Y
    LD MISSILE_X_OLD, MISSILE_X
    LD MISSILE_Y_OLD, MISSILE_Y
    RET

handleMissile:
    CALL isMissileIdle
    SNE SCRATCH_ONE, #1
    RET ; Early exit

    CALL renderMissile

    LD MISSILE_X_OLD, MISSILE_X
    LD MISSILE_Y_OLD, MISSILE_Y

    ; Is missile at the target?

    LD SCRATCH_ONE, #0
    LD SCRATCH_TWO, #0

    SNE MISSILE_X, TARGET_X
    LD SCRATCH_ONE, #1

    SNE MISSILE_Y, TARGET_Y
    LD SCRATCH_TWO, #1

    AND SCRATCH_ONE, SCRATCH_TWO
    SNE SCRATCH_ONE, #0 ; Not yet
    JP missileNotReachedTarget

    missileReachedTarget:
        LD MISSILE_X, LAUNCH_AVALIABLE_X
        LD MISSILE_Y, LAUNCH_AVALIABLE_Y
        RET

    missileNotReachedTarget:
        ; Missile movement

        missileXHandling:
            SNE MISSILE_X, TARGET_X
            JP missileYHandling

            LD SCRATCH_ONE, MISSILE_X
            LD SCRATCH_TWO, TARGET_X
            CALL lessThan

            SNE SCRATCH_ONE, #1
            JP missileXLessThanTarget

            missileXGreaterThanTarget:
                LD SCRATCH_ONE, #1
                SUB MISSILE_X, SCRATCH_ONE
                JP missileYHandling

            missileXLessThanTarget:
                ADD MISSILE_X, #1
                JP missileYHandling

        missileYHandling:
            SNE MISSILE_Y, TARGET_Y
            JP afterMissileTracking

            LD SCRATCH_ONE, MISSILE_Y
            LD SCRATCH_TWO, TARGET_Y
            CALL lessThan

            SNE SCRATCH_ONE, #1
            JP missileYLessThanTarget

            missileYGreaterThanTarget:
                LD SCRATCH_ONE, #1
                SUB MISSILE_Y, SCRATCH_ONE
                JP afterMissileTracking

            missileYLessThanTarget:
                ADD MISSILE_Y, #1
                JP afterMissileTracking

        afterMissileTracking:
            ; Missile sound
            LD SCRATCH_ONE, #1
            LD ST, SCRATCH_ONE

    RET

; S1 = Missile is idle
isMissileIdle:
    ; Check that a missile can be fired
    LD SCRATCH_ONE, #0
    LD SCRATCH_TWO, #0

    SNE MISSILE_X, LAUNCH_AVALIABLE_X
    LD SCRATCH_ONE, #1

    SNE MISSILE_Y, LAUNCH_AVALIABLE_Y
    LD SCRATCH_TWO, #1

    AND SCRATCH_ONE, SCRATCH_TWO
    SNE SCRATCH_ONE, #1 ; At launch ready state
    JP isMissileIdleTrue

    isMissileIdleFalse: ; Missile is active
        LD SCRATCH_ONE, #0
        RET

    isMissileIdleTrue:
        LD SCRATCH_ONE, #1
        RET

inputLaunch:
    LD SCRATCH_ONE, LAUNCH_KEY
    SKP SCRATCH_ONE
    JP inputLaunchKeyNotPressed

    inputLaunchKeyPressed:
        CALL isMissileIdle
        SE SCRATCH_ONE, #1
        JP inputLaunchKeyNotPressed

        ; Missle can be fired

        CALL getTargetX
        LD TARGET_X, SCRATCH_ONE

        CALL getTargetY
        LD TARGET_Y, SCRATCH_ONE

        LD MISSILE_X, MISSLE_X_LAUNCH_LOCATION
        LD MISSILE_Y, MISSLE_Y_LAUNCH_LOCATION

        LD SCRATCH_ONE, #3
        LD ST, SCRATCH_ONE

    inputLaunchKeyNotPressed:

    inputLaunchEnd:
        RET

inputReticle:

    LD RETICLE_X_OLD, RETICLE_X
    LD RETICLE_Y_OLD, RETICLE_Y

    upKey:
        LD SCRATCH_ONE, UP_KEY
        SKP SCRATCH_ONE
        JP upKeyNotPressed

        upKeyPressed:
            SNE RETICLE_Y, #0
            JP downKey

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

            ADD RETICLE_Y, RETICLE_SPEED

            JP leftKey

        downKeyNotPressed:

    leftKey:
        LD SCRATCH_ONE, LEFT_KEY
        SKP SCRATCH_ONE
        JP leftKeyNotPressed

        leftKeyPressed:
            SNE RETICLE_X, #0
            JP rightKey

            LD SCRATCH_ONE, #1
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

            ADD RETICLE_X, RETICLE_SPEED

            JP inputReticleEnd

        rightKeyNotPressed:

    inputReticleEnd:
        RET

renderReticle:

    LD SCRATCH_ONE, #0
    LD SCRATCH_TWO, #0

    SNE RETICLE_X, RETICLE_X_OLD
    LD SCRATCH_ONE, #1

    SNE RETICLE_Y, RETICLE_Y_OLD
    LD SCRATCH_TWO, #1

    AND SCRATCH_ONE, SCRATCH_TWO

    SNE SCRATCH_ONE, #1
    RET

    LD I, SPRITE_Reticle

    CALL renderReticleOld
    CALL renderReticleNew

    RET

renderReticleOld:
    LD I, SPRITE_Reticle
    DRW RETICLE_X_OLD, RETICLE_Y_OLD, #5
    RET

renderReticleNew:
    LD I, SPRITE_Reticle
    DRW RETICLE_X, RETICLE_Y, #5
    RET

renderMissile:

    LD SCRATCH_ONE, #0
    LD SCRATCH_TWO, #0

    SNE MISSILE_X, MISSILE_X_OLD
    LD SCRATCH_ONE, #1

    SNE MISSILE_Y, MISSILE_Y_OLD
    LD SCRATCH_TWO, #1

    AND SCRATCH_ONE, SCRATCH_TWO

    ;SNE SCRATCH_ONE, #1
    ;RET

    CALL renderMissileOld
    CALL renderMissileNew

    RET

renderMissileOld:
    LD I, SPRITE_SingleDot
    DRW MISSILE_X_OLD, MISSILE_Y_OLD, #1
    RET

renderMissileNew:
    LD I, SPRITE_SingleDot
    DRW MISSILE_X, MISSILE_Y, #1
    RET

renderLaunchSilo:
    LD I, SPRITE_LaunchSilo
    LD SCRATCH_ONE, LAUNCHSILO_X
    LD SCRATCH_TWO, LAUNCHSILO_Y
    DRW SCRATCH_ONE, SCRATCH_TWO, #4
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

; 5 x 5
SPRITE_Reticle:
    db
    #20,
    #70,
    #d8,
    #70,
    #20

; 3 x 4
SPRITE_LaunchSilo:
    db
    #a0,
    #a0,
    #a0,
    #e0

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
    #00 ; VE

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
    #00 ; VE