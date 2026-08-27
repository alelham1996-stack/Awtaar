/* =========================================================
   AWTAAR — DOPPLER EXPERIMENT
   =========================================================

   Real-time visual Doppler wave experiment.

   RESPONSIBILITY
   --------------
   Three.js experiment only.

   NO HTML.
   NO CSS.
   NO UI.

   The source moves horizontally.

   Every wavefront is emitted from the exact source
   position at the exact emission time.

   The experiment is rendered as a foreground
   visualization layer above the main world.

   ========================================================= */

import * as THREE from 'three'


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

        this.destroyed =
            false

        this.time =
            0


        /* =====================================================
           PHYSICS
           ===================================================== */

        this.frequency =
            1.5

        this.sourceSpeed =
            0.8

        this.waveSpeed =
            3.0


        this.defaultFrequency =
            1.5

        this.defaultSourceSpeed =
            0.8

        this.defaultWaveSpeed =
            3.0


        /* =====================================================
           SOURCE
           ===================================================== */

        this.defaultSourcePosition =
            -5

        this.sourcePosition =
            this.defaultSourcePosition

        this.sourceMinX =
            -6

        this.sourceMaxX =
            6

        this.sourceDirection =
            1


        /* =====================================================
           LISTENER
           ===================================================== */

        this.listenerPosition =
            5


        /* =====================================================
           WAVES
           ===================================================== */

        this.waveInterval =
            1 / this.frequency

        this.waveSpawnTimer =
            0

        this.waveCount =
            0

        this.maxWaves =
            80

        this.maxWaveRadius =
            16

        this.waves =
            []


        /* =====================================================
           VISUAL SCALE
           ===================================================== */

        this.waveSegments =
            96

        this.sourceRadius =
            0.38

        this.listenerRadius =
            0.32


        /* =====================================================
           FOREGROUND LAYER
           ===================================================== */

        /*
         * The main Awtaar scene contains the universe and
         * other visual systems.
         *
         * We place the Doppler experiment slightly in front
         * of the world and disable depth testing on its
         * visual materials so the experiment remains visible.
         */

        this.foregroundZ =
            2.5


        /* =====================================================
           THREE ROOT
           ===================================================== */

        this.group =
            null


        /* =====================================================
           OBJECTS
           ===================================================== */

        this.source =
            null

        this.sourceGlow =
            null

        this.listener =
            null

        this.listenerGlow =
            null

        this.path =
            null

        this.centerLine =
            null

        this.directionArrow =
            null


        /* =====================================================
           MATERIALS
           ===================================================== */

        this.waveMaterial =
            null

        this.sourceMaterial =
            null

        this.sourceGlowMaterial =
            null

        this.listenerMaterial =
            null

        this.listenerGlowMaterial =
            null

        this.pathMaterial =
            null


        /* =====================================================
           CREATE
           ===================================================== */

        this.createExperiment()

    }


    /* =========================================================
       CREATE EXPERIMENT
       ========================================================= */

    createExperiment() {


        if (
            this.group
        ) {

            return this.group

        }


        /* =====================================================
           ROOT GROUP
           ===================================================== */

        this.group =
            new THREE.Group()


        this.group.name =
            'AwtaarDopplerExperiment'


        /*
         * Keep the experiment in a predictable foreground
         * plane relative to the main world.
         */

        this.group.position.set(
            0,
            0,
            this.foregroundZ
        )


        this.group.renderOrder =
            1000


        this.group.frustumCulled =
            false


        /* =====================================================
           WAVE MATERIAL
           ===================================================== */

        this.waveMaterial =
            new THREE.LineBasicMaterial({

                color:
                    0x55ddff,

                transparent:
                    true,

                opacity:
                    0.9,

                depthWrite:
                    false,

                depthTest:
                    false,

                toneMapped:
                    false

            })


        /* =====================================================
           SOURCE MATERIAL
           ===================================================== */

        this.sourceMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0xffd45c,

                depthWrite:
                    false,

                depthTest:
                    false,

                toneMapped:
                    false

            })


        /* =====================================================
           SOURCE GLOW MATERIAL
           ===================================================== */

        this.sourceGlowMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0xff9f1c,

                transparent:
                    true,

                opacity:
                    0.22,

                depthWrite:
                    false,

                depthTest:
                    false,

                toneMapped:
                    false

            })


        /* =====================================================
           LISTENER MATERIAL
           ===================================================== */

        this.listenerMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0xffffff,

                depthWrite:
                    false,

                depthTest:
                    false,

                toneMapped:
                    false

            })


        /* =====================================================
           LISTENER GLOW
           ===================================================== */

        this.listenerGlowMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0x55ccff,

                transparent:
                    true,

                opacity:
                    0.22,

                depthWrite:
                    false,

                depthTest:
                    false,

                toneMapped:
                    false

            })


        /* =====================================================
           PATH MATERIAL
           ===================================================== */

        this.pathMaterial =
            new THREE.LineBasicMaterial({

                color:
                    0x8da8bd,

                transparent:
                    true,

                opacity:
                    0.5,

                depthWrite:
                    false,

                depthTest:
                    false,

                toneMapped:
                    false

            })


        /* =====================================================
           CREATE OBJECTS
           ===================================================== */

        this.createPath()

        this.createCenterLine()

        this.createSource()

        this.createListener()

        this.createDirectionArrow()


        /* =====================================================
           INITIAL VISUAL STATE
           ===================================================== */

        this.updateSourceVisual()

        this.updateListenerVisual()


        /* =====================================================
           ADD TO SCENE
           ===================================================== */

        if (
            this.scene
        ) {

            this.addToScene(
                this.scene
            )

        }


        return this.group

    }


    /* =========================================================
       PATH
       ========================================================= */

    createPath() {


        const geometry =
            new THREE.BufferGeometry()


        geometry.setFromPoints([

            new THREE.Vector3(
                -7,
                0,
                0
            ),

            new THREE.Vector3(
                7,
                0,
                0
            )

        ])


        this.path =
            new THREE.Line(
                geometry,
                this.pathMaterial
            )


        this.path.name =
            'DopplerPath'


        this.path.renderOrder =
            1001


        this.path.frustumCulled =
            false


        this.group.add(
            this.path
        )

    }


    /* =========================================================
       CENTER LINE
       ========================================================= */

    createCenterLine() {


        const points =
            []

        const segments =
            80


        for (
            let i = 0;
            i <= segments;
            i++
        ) {


            const x =
                -7 +
                (
                    14 *
                    i /
                    segments
                )


            points.push(

                new THREE.Vector3(
                    x,
                    0,
                    -0.02
                )

            )

        }


        const geometry =
            new THREE.BufferGeometry()


        geometry.setFromPoints(
            points
        )


        this.centerLine =
            new THREE.Line(
                geometry,
                this.pathMaterial
            )


        this.centerLine.name =
            'DopplerCenterLine'


        this.centerLine.renderOrder =
            1002


        this.centerLine.frustumCulled =
            false


        this.group.add(
            this.centerLine
        )

    }


    /* =========================================================
       SOURCE
       ========================================================= */

    createSource() {


        const geometry =
            new THREE.SphereGeometry(
                this.sourceRadius,
                32,
                32
            )


        this.source =
            new THREE.Mesh(
                geometry,
                this.sourceMaterial
            )


        this.source.name =
            'DopplerSource'


        this.source.position.set(

            this.sourcePosition,
            0,
            0.25

        )


        this.source.renderOrder =
            1010


        this.source.frustumCulled =
            false


        this.group.add(
            this.source
        )


        /* =====================================================
           SOURCE GLOW
           ===================================================== */

        const glowGeometry =
            new THREE.SphereGeometry(
                this.sourceRadius * 2.8,
                32,
                32
            )


        this.sourceGlow =
            new THREE.Mesh(
                glowGeometry,
                this.sourceGlowMaterial
            )


        this.sourceGlow.name =
            'DopplerSourceGlow'


        this.sourceGlow.position.copy(
            this.source.position
        )


        this.sourceGlow.renderOrder =
            1005


        this.sourceGlow.frustumCulled =
            false


        this.group.add(
            this.sourceGlow
        )

    }


    /* =========================================================
       LISTENER
       ========================================================= */

    createListener() {


        const geometry =
            new THREE.SphereGeometry(
                this.listenerRadius,
                24,
                24
            )


        this.listener =
            new THREE.Mesh(
                geometry,
                this.listenerMaterial
            )


        this.listener.name =
            'DopplerListener'


        this.listener.position.set(

            this.listenerPosition,
            0,
            0.25

        )


        this.listener.renderOrder =
            1010


        this.listener.frustumCulled =
            false


        this.group.add(
            this.listener
        )


        /* =====================================================
           LISTENER GLOW
           ===================================================== */

        const glowGeometry =
            new THREE.SphereGeometry(
                this.listenerRadius * 2.6,
                24,
                24
            )


        this.listenerGlow =
            new THREE.Mesh(
                glowGeometry,
                this.listenerGlowMaterial
            )


        this.listenerGlow.name =
            'DopplerListenerGlow'


        this.listenerGlow.position.copy(
            this.listener.position
        )


        this.listenerGlow.renderOrder =
            1005


        this.listenerGlow.frustumCulled =
            false


        this.group.add(
            this.listenerGlow
        )

    }


    /* =========================================================
       DIRECTION ARROW
       ========================================================= */

    createDirectionArrow() {


        this.directionArrow =
            new THREE.ArrowHelper(

                new THREE.Vector3(
                    1,
                    0,
                    0
                ),

                new THREE.Vector3(
                    this.sourcePosition,
                    0,
                    0.75
                ),

                1.2,

                0xffd45c,

                0.3,

                0.18

            )


        this.directionArrow.name =
            'DopplerDirectionArrow'


        this.directionArrow.renderOrder =
            1015


        this.directionArrow.frustumCulled =
            false


        /*
         * ArrowHelper contains line + cone.
         *
         * Ensure both parts are rendered in the foreground.
         */

        if (
            this.directionArrow.line
        ) {

            this.directionArrow.line.renderOrder =
                1015

            this.directionArrow.line.frustumCulled =
                false

        }


        if (
            this.directionArrow.cone
        ) {

            this.directionArrow.cone.renderOrder =
                1016

            this.directionArrow.cone.frustumCulled =
                false

        }


        this.group.add(
            this.directionArrow
        )

    }


    /* =========================================================
       ADD TO SCENE
       ========================================================= */

    addToScene(
        scene = null
    ) {


        if (
            scene
        ) {

            this.scene =
                scene

        }


        if (
            !this.scene
        ) {

            console.error(
                '❌ DopplerExperiment: no THREE.js scene'
            )

            return

        }


        if (
            !this.group
        ) {

            console.error(
                '❌ DopplerExperiment: group does not exist'
            )

            return

        }


        if (
            this.group.parent !==
            this.scene
        ) {

            this.scene.add(
                this.group
            )

        }


        /*
         * Force foreground visibility.
         */

        this.group.visible =
            true

        this.group.renderOrder =
            1000

        this.group.frustumCulled =
            false


        /*
         * Make sure every current child is visible.
         */

        this.group.traverse(
            object => {

                object.visible =
                    true

                object.frustumCulled =
                    false

            }
        )


        console.log(
            '🔵 DopplerExperiment: ADDED TO SCENE',
            {
                scene:
                    this.scene,

                group:
                    this.group,

                children:
                    this.group.children.length,

                position:
                    this.group.position
            }
        )

    }


    /* =========================================================
       START
       ========================================================= */

    start() {


        if (
            this.destroyed
        ) {

            return

        }


        /*
         * Ensure the experiment is attached before running.
         */

        if (
            this.scene &&
            this.group &&
            this.group.parent !== this.scene
        ) {

            this.addToScene(
                this.scene
            )

        }


        this.active =
            true

        this.paused =
            false


        this.show()

    }


    /* =========================================================
       PAUSE
       ========================================================= */

    pause() {


        if (
            this.destroyed ||
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
            this.destroyed
        ) {

            return

        }


        this.active =
            true

        this.paused =
            false


        this.show()

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


        if (
            this.destroyed
        ) {

            return

        }


        this.time =
            0


        this.frequency =
            this.defaultFrequency

        this.sourceSpeed =
            this.defaultSourceSpeed

        this.waveSpeed =
            this.defaultWaveSpeed


        this.sourcePosition =
            this.defaultSourcePosition

        this.sourceDirection =
            1


        this.waveInterval =
            1 /
            this.frequency


        this.waveSpawnTimer =
            0


        this.removeAllWaves()


        this.updateSourceVisual()

        this.updateListenerVisual()


        this.stop()

        this.show()

    }


    /* =========================================================
       SOURCE SPEED
       ========================================================= */

    setSourceSpeed(
        value
    ) {


        const number =
            Number(value)


        this.sourceSpeed =
            Number.isFinite(number)
                ? Math.max(
                    0,
                    number
                )
                : 0

    }


    /* =========================================================
       FREQUENCY
       ========================================================= */

    setFrequency(
        value
    ) {


        const number =
            Number(value)


        this.frequency =
            Number.isFinite(number)
                ? Math.max(
                    0.1,
                    number
                )
                : 0.1


        this.waveInterval =
            1 /
            this.frequency

    }


    /* =========================================================
       WAVE SPEED
       ========================================================= */

    setWaveSpeed(
        value
    ) {


        const number =
            Number(value)


        this.waveSpeed =
            Number.isFinite(number)
                ? Math.max(
                    0.1,
                    number
                )
                : 0.1

    }


    /* =========================================================
       UPDATE
       ========================================================= */

    update(
        delta = 0.016
    ) {


        if (
            this.destroyed ||
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


        /* =====================================================
           MOVE SOURCE
           ===================================================== */

        this.updateSourceMotion(
            safeDelta
        )


        /* =====================================================
           EMIT WAVE
           ===================================================== */

        this.waveSpawnTimer +=
            safeDelta


        while (
            this.waveSpawnTimer >=
            this.waveInterval
        ) {


            this.waveSpawnTimer -=
                this.waveInterval


            this.spawnWave()

        }


        /* =====================================================
           UPDATE WAVES
           ===================================================== */

        this.updateWaves(
            safeDelta
        )


        /* =====================================================
           VISUALS
           ===================================================== */

        this.updateSourceVisual()

        this.updateListenerVisual()

    }


    /* =========================================================
       SOURCE MOTION
       ========================================================= */

    updateSourceMotion(
        delta
    ) {


        if (
            this.sourceSpeed <= 0
        ) {

            return

        }


        this.sourcePosition +=

            this.sourceSpeed *
            this.sourceDirection *
            delta


        if (
            this.sourcePosition >=
            this.sourceMaxX
        ) {


            this.sourcePosition =
                this.sourceMaxX


            this.sourceDirection =
                -1

        }


        if (
            this.sourcePosition <=
            this.sourceMinX
        ) {


            this.sourcePosition =
                this.sourceMinX


            this.sourceDirection =
                1

        }

    }


    /* =========================================================
       SOURCE VISUAL
       ========================================================= */

    updateSourceVisual() {


        if (
            !this.source
        ) {

            return

        }


        this.source.position.x =
            this.sourcePosition


        if (
            this.sourceGlow
        ) {

            this.sourceGlow.position.x =
                this.sourcePosition

        }


        if (
            this.directionArrow
        ) {


            this.directionArrow.position.x =
                this.sourcePosition


            this.directionArrow.setDirection(

                new THREE.Vector3(

                    this.sourceDirection,
                    0,
                    0

                )

            )

        }

    }


    /* =========================================================
       LISTENER VISUAL
       ========================================================= */

    updateListenerVisual() {


        if (
            !this.listener
        ) {

            return

        }


        this.listener.position.x =
            this.listenerPosition


        if (
            this.listenerGlow
        ) {

            this.listenerGlow.position.x =
                this.listenerPosition

        }

    }


    /* =========================================================
       SPAWN WAVE
       ========================================================= */

    spawnWave() {


        if (
            this.destroyed ||
            !this.group
        ) {

            return

        }


        /* =====================================================
           REMOVE OLDEST WAVE
           ===================================================== */

        if (
            this.waves.length >=
            this.maxWaves
        ) {

            this.removeWave(
                this.waves[0]
            )

        }


        /* =====================================================
           EXACT EMISSION ORIGIN
           ===================================================== */

        const origin =
            new THREE.Vector3(

                this.sourcePosition,
                0,
                0

            )


        /* =====================================================
           GEOMETRY
           ===================================================== */

        const geometry =
            this.createWaveGeometry(
                0.01
            )


        /* =====================================================
           MATERIAL
           ===================================================== */

        const material =
            this.waveMaterial.clone()


        material.opacity =
            0.9

        material.depthWrite =
            false

        material.depthTest =
            false

        material.toneMapped =
            false


        /* =====================================================
           WAVE OBJECT
           ===================================================== */

        const object =
            new THREE.LineLoop(
                geometry,
                material
            )


        object.name =
            'DopplerWavefront'


        object.position.copy(
            origin
        )


        object.renderOrder =
            1008


        object.frustumCulled =
            false


        /* =====================================================
           WAVE DATA
           ===================================================== */

        const wave = {

            object,

            origin:
                origin.clone(),

            radius:
                0.01,

            age:
                0,

            opacity:
                0.9

        }


        object.userData =
            wave


        this.group.add(
            object
        )


        this.waves.push(
            wave
        )


        this.waveCount =
            this.waves.length

    }


    /* =========================================================
       CREATE WAVE GEOMETRY
       ========================================================= */

    createWaveGeometry(
        radius
    ) {


        const positions =
            new Float32Array(

                this.waveSegments *
                3

            )


        for (
            let i = 0;
            i < this.waveSegments;
            i++
        ) {


            const angle =

                (
                    i /
                    this.waveSegments
                ) *
                Math.PI *
                2


            positions[
                i * 3
            ] =

                Math.cos(angle) *
                radius


            positions[
                i * 3 + 1
            ] =

                Math.sin(angle) *
                radius


            positions[
                i * 3 + 2
            ] =
                0

        }


        const geometry =
            new THREE.BufferGeometry()


        geometry.setAttribute(

            'position',

            new THREE.BufferAttribute(
                positions,
                3
            )

        )


        return geometry

    }


    /* =========================================================
       UPDATE WAVES
       ========================================================= */

    updateWaves(
        delta
    ) {


        for (
            let i =
                this.waves.length - 1;

            i >= 0;

            i--
        ) {


            const wave =
                this.waves[i]


            if (
                !wave ||
                !wave.object
            ) {

                continue

            }


            wave.age +=
                delta


            wave.radius +=

                this.waveSpeed *
                delta


            this.updateWaveGeometry(
                wave
            )


            /* =================================================
               FADE
               ================================================= */

            const fadeStart =
                this.maxWaveRadius *
                0.65


            if (
                wave.radius >
                fadeStart
            ) {


                const range =
                    this.maxWaveRadius -
                    fadeStart


                const fade =

                    1 -
                    (

                        (
                            wave.radius -
                            fadeStart
                        ) /
                        range

                    )


                wave.object.material.opacity =

                    Math.max(
                        0,
                        wave.opacity * fade
                    )

            }


            /* =================================================
               REMOVE
               ================================================= */

            if (
                wave.radius >=
                this.maxWaveRadius
            ) {

                this.removeWave(
                    wave
                )

            }

        }


        this.waveCount =
            this.waves.length

    }


    /* =========================================================
       UPDATE WAVE GEOMETRY
       ========================================================= */

    updateWaveGeometry(
        wave
    ) {


        if (
            !wave ||
            !wave.object
        ) {

            return

        }


        const geometry =
            wave.object.geometry


        const attribute =
            geometry?.getAttribute(
                'position'
            )


        if (
            !attribute
        ) {

            return

        }


        for (
            let i = 0;
            i < this.waveSegments;
            i++
        ) {


            const angle =

                (
                    i /
                    this.waveSegments
                ) *
                Math.PI *
                2


            attribute.setXYZ(

                i,

                Math.cos(angle) *
                wave.radius,

                Math.sin(angle) *
                wave.radius,

                0

            )

        }


        attribute.needsUpdate =
            true

    }


    /* =========================================================
       REMOVE WAVE
       ========================================================= */

    removeWave(
        wave
    ) {


        if (
            !wave
        ) {

            return

        }


        const object =
            wave.object


        if (
            object
        ) {


            if (
                object.parent
            ) {

                object.parent.remove(
                    object
                )

            }


            object.geometry?.dispose()

            object.material?.dispose()

        }


        const index =
            this.waves.indexOf(
                wave
            )


        if (
            index !== -1
        ) {

            this.waves.splice(
                index,
                1
            )

        }


        this.waveCount =
            this.waves.length

    }


    /* =========================================================
       REMOVE ALL WAVES
       ========================================================= */

    removeAllWaves() {


        for (
            let i =
                this.waves.length - 1;

            i >= 0;

            i--
        ) {


            this.removeWave(
                this.waves[i]
            )

        }


        this.waves =
            []

        this.waveCount =
            0

    }


    /* =========================================================
       WAVE DATA
       ========================================================= */

    getWaveData() {


        const frequency =
            Math.max(

                0.1,

                Number(
                    this.frequency
                ) || 0.1

            )


        const waveSpeed =
            Math.max(

                0.1,

                Number(
                    this.waveSpeed
                ) || 0.1

            )


        const sourceSpeed =
            Math.max(

                0,

                Number(
                    this.sourceSpeed
                ) || 0

            )


        const wavelength =
            waveSpeed /
            frequency


        const effectiveSourceSpeed =
            Math.min(

                sourceSpeed,

                waveSpeed * 0.95

            )


        const approachingWavelength =

            (
                waveSpeed -
                effectiveSourceSpeed
            ) /
            frequency


        const approachingFrequency =

            waveSpeed /
            approachingWavelength


        const recedingWavelength =

            (
                waveSpeed +
                effectiveSourceSpeed
            ) /
            frequency


        const recedingFrequency =

            waveSpeed /
            recedingWavelength


        return {

            disabled:
                false,

            sourceSpeed,

            frequency,

            waveSpeed,

            wavelength,

            waveCount:
                this.waveCount,

            sourcePosition:
                this.sourcePosition,

            listenerPosition:
                this.listenerPosition,

            approachingFrequency,

            approachingWavelength,

            recedingFrequency,

            recedingWavelength

        }

    }


    /* =========================================================
       SHOW
       ========================================================= */

    show() {


        if (
            this.group
        ) {

            this.group.visible =
                true

        }

    }


    /* =========================================================
       HIDE
       ========================================================= */

    hide() {


        if (
            this.group
        ) {

            this.group.visible =
                false

        }

    }


    /* =========================================================
       DISPOSE
       ========================================================= */

    dispose() {


        this.removeAllWaves()


        if (
            this.group?.parent
        ) {

            this.group.parent.remove(
                this.group
            )

        }


        this.source?.geometry?.dispose()

        this.sourceGlow?.geometry?.dispose()

        this.listener?.geometry?.dispose()

        this.listenerGlow?.geometry?.dispose()

        this.path?.geometry?.dispose()

        this.centerLine?.geometry?.dispose()


        if (
            this.directionArrow
        ) {


            this.directionArrow.line
                ?.geometry
                ?.dispose()


            this.directionArrow.line
                ?.material
                ?.dispose()


            this.directionArrow.cone
                ?.geometry
                ?.dispose()


            this.directionArrow.cone
                ?.material
                ?.dispose()

        }


        this.waveMaterial?.dispose()

        this.sourceMaterial?.dispose()

        this.sourceGlowMaterial?.dispose()

        this.listenerMaterial?.dispose()

        this.listenerGlowMaterial?.dispose()

        this.pathMaterial?.dispose()


        this.group =
            null


        this.source =
            null

        this.sourceGlow =
            null

        this.listener =
            null

        this.listenerGlow =
            null

        this.path =
            null

        this.centerLine =
            null

        this.directionArrow =
            null


        this.waveMaterial =
            null

        this.sourceMaterial =
            null

        this.sourceGlowMaterial =
            null

        this.listenerMaterial =
            null

        this.listenerGlowMaterial =
            null

        this.pathMaterial =
            null

    }


    /* =========================================================
       DESTROY
       ========================================================= */

    destroy() {


        if (
            this.destroyed
        ) {

            return

        }


        this.stop()

        this.dispose()


        this.scene =
            null

        this.parent =
            null

        this.destroyed =
            true

    }

}