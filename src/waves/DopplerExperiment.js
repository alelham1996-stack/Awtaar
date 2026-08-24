import * as THREE from 'three'


/* =========================================================
   AWTAAR — DOPPLER EXPERIMENT
   ========================================================= */

export default class DopplerExperiment {


    constructor(
        options = {}
    ) {


        /* =====================================================
           REFERENCES
           ===================================================== */

        this.scene =
            options.scene || null


        this.parent =
            options.parent || null


        /* =====================================================
           STATE
           ===================================================== */

        this.active =
            false


        this.paused =
            false


        this.time =
            0


        /* =====================================================
           PARAMETERS
           ===================================================== */

        this.frequency =
            1.5


        this.sourceSpeed =
            0.8


        this.waveSpeed =
            3.0


        this.sourcePosition =
            -6


        this.listenerPosition =
            6


        /* =====================================================
           DEFAULT PARAMETERS
           ===================================================== */

        this.defaultFrequency =
            1.5


        this.defaultSourceSpeed =
            0.8


        this.defaultWaveSpeed =
            3.0


        this.defaultSourcePosition =
            -6


        /* =====================================================
           WAVE STATE
           ===================================================== */

        this.maxWaveRadius =
            18


        this.waveInterval =
            1 / this.frequency


        this.waveSpawnTimer =
            0


        this.waveCount =
            0


        /* =====================================================
           THREE GROUP
           ===================================================== */

        this.group =
            new THREE.Group()


        this.group.name =
            'AwtaarDopplerExperiment'


        this.group.visible =
            true


        /* =====================================================
           OBJECTS
           ===================================================== */

        this.source =
            null


        this.listener =
            null


        this.sourceGlow =
            null


        this.listenerGlow =
            null


        this.path =
            null


        this.waves =
            []


        /* =====================================================
           BUILD
           ===================================================== */

        this.createExperiment()


        /* =====================================================
           ADD TO SCENE
           ===================================================== */

        this.addToScene(
            this.scene
        )


    }


    /* =========================================================
       ADD TO SCENE
       ========================================================= */

    addToScene(
        scene = null
    ) {


        const targetScene =
            scene || this.scene


        if (
            !targetScene ||
            !targetScene.add
        ) {

            return

        }


        this.scene =
            targetScene


        if (
            this.group.parent ===
            targetScene
        ) {

            return

        }


        if (
            this.group.parent
        ) {

            this.group.parent.remove(
                this.group
            )

        }


        targetScene.add(
            this.group
        )


    }


    /* =========================================================
       CREATE EXPERIMENT
       ========================================================= */

    createExperiment() {


        this.createBackground()

        this.createPath()

        this.createSource()

        this.createListener()

        this.createInitialWaves()


    }


    /* =========================================================
       BACKGROUND
       ========================================================= */

    createBackground() {


        const geometry =
            new THREE.PlaneGeometry(
                22,
                12
            )


        const material =
            new THREE.MeshBasicMaterial({

                color:
                    0x08080c,

                transparent:
                    true,

                opacity:
                    0.35,

                depthWrite:
                    false

            })


        const background =
            new THREE.Mesh(
                geometry,
                material
            )


        background.position.z =
            -0.5


        this.group.add(
            background
        )


    }


    /* =========================================================
       MOTION PATH
       ========================================================= */

    createPath() {


        const points = [

            new THREE.Vector3(
                -9,
                0,
                0
            ),

            new THREE.Vector3(
                9,
                0,
                0
            )

        ]


        const geometry =
            new THREE.BufferGeometry()
                .setFromPoints(
                    points
                )


        const material =
            new THREE.LineBasicMaterial({

                color:
                    0xd8c28f,

                transparent:
                    true,

                opacity:
                    0.16

            })


        this.path =
            new THREE.Line(
                geometry,
                material
            )


        this.group.add(
            this.path
        )


    }


    /* =========================================================
       SOURCE
       ========================================================= */

    createSource() {


        const sourceGroup =
            new THREE.Group()


        /* BODY */

        const bodyGeometry =
            new THREE.SphereGeometry(
                0.55,
                32,
                32
            )


        const bodyMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0xd8c28f,

                emissive:
                    0x8c7348,

                emissiveIntensity:
                    1.2,

                roughness:
                    0.35,

                metalness:
                    0.45

            })


        const body =
            new THREE.Mesh(
                bodyGeometry,
                bodyMaterial
            )


        sourceGroup.add(
            body
        )


        /* CORE */

        const coreGeometry =
            new THREE.SphereGeometry(
                0.22,
                24,
                24
            )


        const coreMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0xf5ead0

            })


        const core =
            new THREE.Mesh(
                coreGeometry,
                coreMaterial
            )


        sourceGroup.add(
            core
        )


        /* GLOW */

        const glowGeometry =
            new THREE.SphereGeometry(
                0.95,
                32,
                32
            )


        const glowMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0xd8c28f,

                transparent:
                    true,

                opacity:
                    0.08,

                side:
                    THREE.BackSide

            })


        this.sourceGlow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            )


        sourceGroup.add(
            this.sourceGlow
        )


        sourceGroup.position.set(

            this.sourcePosition,

            0,

            0

        )


        this.source =
            sourceGroup


        this.group.add(
            this.source
        )


    }


    /* =========================================================
       LISTENER
       ========================================================= */

    createListener() {


        const listenerGroup =
            new THREE.Group()


        /* RING */

        const ringGeometry =
            new THREE.TorusGeometry(

                0.62,

                0.06,

                16,

                64

            )


        const ringMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0xf5ead0,

                transparent:
                    true,

                opacity:
                    0.75

            })


        const ring =
            new THREE.Mesh(
                ringGeometry,
                ringMaterial
            )


        listenerGroup.add(
            ring
        )


        /* POINT */

        const pointGeometry =
            new THREE.SphereGeometry(
                0.18,
                20,
                20
            )


        const pointMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0xd8c28f

            })


        const point =
            new THREE.Mesh(
                pointGeometry,
                pointMaterial
            )


        listenerGroup.add(
            point
        )


        /* GLOW */

        const glowGeometry =
            new THREE.SphereGeometry(
                0.9,
                24,
                24
            )


        const glowMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0xd8c28f,

                transparent:
                    true,

                opacity:
                    0.05,

                side:
                    THREE.BackSide

            })


        this.listenerGlow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            )


        listenerGroup.add(
            this.listenerGlow
        )


        listenerGroup.position.set(

            this.listenerPosition,

            0,

            0

        )


        this.listener =
            listenerGroup


        this.group.add(
            this.listener
        )


    }


    /* =========================================================
       INITIAL WAVES
       ========================================================= */

    createInitialWaves() {


        for (

            let i = 0;

            i < 12;

            i++

        ) {

            this.createWave(
                i * 1.25
            )

        }


    }


    /* =========================================================
       CREATE WAVE
       ========================================================= */

    createWave(
        offset = 0
    ) {


        const geometry =
            new THREE.RingGeometry(

                0.92,

                1,

                96

            )


        const material =
            new THREE.MeshBasicMaterial({

                color:
                    0xd8c28f,

                transparent:
                    true,

                opacity:
                    0.32,

                side:
                    THREE.DoubleSide

            })


        const wave =
            new THREE.Mesh(
                geometry,
                material
            )


        wave.rotation.x =
            Math.PI / 2


        wave.userData = {

            offset:
                offset,

            born:
                this.time

        }


        this.group.add(
            wave
        )


        this.waves.push(
            wave
        )


        this.waveCount =
            this.waves.length


        return wave


    }


    /* =========================================================
       START
       ========================================================= */

    start() {


        this.active =
            true


        this.paused =
            false


    }


    /* =========================================================
       PAUSE
       ========================================================= */

    pause() {


        if (
            !this.active
        ) {

            return

        }


        this.paused =
            true


    }


    /* =========================================================
       RESUME
       ========================================================= */

    resume() {


        if (
            !this.active
        ) {

            return

        }


        this.paused =
            false


    }


    /* =========================================================
       STOP
       ========================================================= */

    stop() {


        this.active =
            false


        this.paused =
            false


    }


    /* =========================================================
       RESET
       ========================================================= */

    reset() {


        this.time =
            0


        this.sourceSpeed =
            this.defaultSourceSpeed


        this.frequency =
            this.defaultFrequency


        this.waveSpeed =
            this.defaultWaveSpeed


        this.sourcePosition =
            this.defaultSourcePosition


        this.waveSpawnTimer =
            0


        if (
            this.source
        ) {

            this.source.position.x =
                this.sourcePosition


            this.source.rotation.z =
                0

        }


        this.waves.forEach(

            (
                wave,
                index
            ) => {


                wave.userData.born =
                    -index * 0.8


                wave.scale.set(

                    1,

                    1,

                    1

                )


                wave.position.set(

                    this.sourcePosition,

                    0,

                    0

                )


                wave.material.opacity =
                    0.32


            }

        )


        this.active =
            false


        this.paused =
            false


    }


    /* =========================================================
       SET SOURCE SPEED
       ========================================================= */

    setSourceSpeed(
        value
    ) {


        this.sourceSpeed =
            Math.max(

                0,

                Number(value) || 0

            )


    }


    /* =========================================================
       SET FREQUENCY
       ========================================================= */

    setFrequency(
        value
    ) {


        this.frequency =
            Math.max(

                0.1,

                Number(value) || 0.1

            )


    }


    /* =========================================================
       SET WAVE SPEED
       ========================================================= */

    setWaveSpeed(
        value
    ) {


        this.waveSpeed =
            Math.max(

                0.1,

                Number(value) || 0.1

            )


    }


    /* =========================================================
       UPDATE
       ========================================================= */

    update(
        delta = 0.016
    ) {


        if (
            !this.active ||
            this.paused
        ) {

            return

        }


        const safeDelta =
            Math.min(

                Math.max(
                    Number(delta) || 0,
                    0
                ),

                0.05

            )


        this.time +=
            safeDelta


        /* =============================================
           MOVE SOURCE
           ============================================= */

        this.sourcePosition +=

            safeDelta *

            this.sourceSpeed *


            1.2


        if (
            this.sourcePosition > 5.5
        ) {

            this.sourcePosition =
                -6

        }


        if (
            this.source
        ) {

            this.source.position.x =
                this.sourcePosition


            this.source.rotation.z +=
                safeDelta * 0.8

        }


        /* =============================================
           SOURCE PULSE
           ============================================= */

        if (
            this.sourceGlow
        ) {

            const pulse =

                1 +

                Math.sin(

                    this.time *

                    this.frequency *

                    6

                ) *

                0.16


            this.sourceGlow.scale.set(

                pulse,

                pulse,

                pulse

            )

        }


        /* =============================================
           LISTENER PULSE
           ============================================= */

        if (
            this.listenerGlow
        ) {

            const pulse =

                1 +

                Math.sin(

                    this.time * 2

                ) *

                0.08


            this.listenerGlow.scale.set(

                pulse,

                pulse,

                pulse

            )

        }


        /* =============================================
           UPDATE WAVES
           ============================================= */

        this.updateWaves()


    }


    /* =========================================================
       UPDATE WAVES
       ========================================================= */

    updateWaves() {


        const sourceX =
            this.sourcePosition


        this.waves.forEach(

            (
                wave,
                index
            ) => {


                const phase =

                    (

                        this.time *

                        this.frequency *

                        3

                    )

                    -

                    index *

                    1.15


                let radius =

                    1 +

                    (

                        phase %

                        12

                    )


                if (
                    radius < 1
                ) {

                    radius +=
                        12

                }


                /*
                 * Doppler compression:
                 * the moving source shifts the
                 * wavefronts behind it.
                 */

                const waveX =

                    sourceX -

                    radius *

                    this.sourceSpeed *

                    0.12


                wave.position.x =
                    waveX


                const scaleX =

                    radius *

                    (

                        1 +

                        this.sourceSpeed *

                        0.05

                    )


                const scaleY =
                    radius


                wave.scale.set(

                    scaleX,

                    scaleY,

                    1

                )


                const opacity =

                    Math.max(

                        0,

                        0.34 -

                        radius *

                        0.018

                    )


                wave.material.opacity =
                    opacity


                wave.rotation.z =

                    Math.sin(

                        this.time *

                        0.7 +

                        index

                    ) *

                    0.03


            }

        )


    }


    /* =========================================================
       GET WAVE DATA
       ========================================================= */

    getWaveData() {


        const wavelength =
            this.waveSpeed /
            this.frequency


        const sourceSpeed =
            Math.min(

                this.sourceSpeed,

                this.waveSpeed *
                0.8

            )


        /*
         * Ahead of source:
         * compressed wavelength.
         */

        const approachingWavelength =
            Math.max(

                0.001,

                (
                    this.waveSpeed -
                    sourceSpeed
                ) /
                this.frequency

            )


        /*
         * Behind source:
         * stretched wavelength.
         */

        const recedingWavelength =

            (
                this.waveSpeed +
                sourceSpeed
            ) /
            this.frequency


        const approachingFrequency =
            this.waveSpeed /
            approachingWavelength


        const recedingFrequency =
            this.waveSpeed /
            recedingWavelength


        return {

            sourceSpeed:
                this.sourceSpeed,


            frequency:
                this.frequency,


            waveSpeed:
                this.waveSpeed,


            wavelength:
                wavelength,


            waveCount:
                this.waves.length,


            sourcePosition:
                this.sourcePosition,


            listenerPosition:
                this.listenerPosition,


            approachingFrequency:
                approachingFrequency,


            approachingWavelength:
                approachingWavelength,


            recedingFrequency:
                recedingFrequency,


            recedingWavelength:
                recedingWavelength

        }


    }


    /* =========================================================
       SHOW
       ========================================================= */

    show() {


        this.group.visible =
            true


    }


    /* =========================================================
       HIDE
       ========================================================= */

    hide() {


        this.group.visible =
            false


    }


    /* =========================================================
       DISPOSE
       ========================================================= */

    dispose() {


        this.waves =
            []


        this.group.traverse(

            object => {


                if (
                    object.geometry
                ) {

                    object.geometry.dispose()

                }


                if (
                    object.material
                ) {

                    if (
                        Array.isArray(
                            object.material
                        )
                    ) {

                        object.material.forEach(

                            material => {

                                material.dispose()

                            }

                        )

                    }

                    else {

                        object.material.dispose()

                    }

                }


            }

        )


        if (
            this.group.parent
        ) {

            this.group.parent.remove(
                this.group
            )

        }


    }


    /* =========================================================
       DESTROY
       ========================================================= */

    destroy() {


        this.stop()

        this.dispose()


        this.scene =
            null


        this.parent =
            null


        this.source =
            null


        this.listener =
            null


        this.sourceGlow =
            null


        this.listenerGlow =
            null


    }


}