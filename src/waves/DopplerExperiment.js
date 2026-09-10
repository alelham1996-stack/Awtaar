/* =========================================================
   AWTAAR — DOPPLER EXPERIMENT
   =========================================================

   SHARED THREE.JS SCENE
   ---------------------------------------------------------
   This experiment does NOT create:

   - a renderer
   - a canvas
   - a background

   It renders as a THREE.Group inside the existing
   Awtaar Engine / Universe scene.

   The Awtaar universe remains completely untouched.

   ---------------------------------------------------------
   CLASSICAL DOPPLER EFFECT
   ---------------------------------------------------------

              approaching
                  →

          ))  ))  )))   ))))
        ))  ))  )))   ))))
             ● SOURCE ─────────── ● LISTENER

        (((((  (((((  (((((

   Waves are emitted from the source's CURRENT position.

   The source moves.

   Previously emitted waves remain where they were born.

   This creates:

   - compressed fronts ahead of the source
   - expanded fronts behind the source

   ========================================================= */

import * as THREE from 'three'


export default class DopplerExperiment {


    /* =====================================================
       CONSTRUCTOR
       ===================================================== */

    constructor(
        options = {}
    ) {

        /* =================================================
           REFERENCES
           ================================================= */

        this.scene =
            options.scene || null

        this.parent =
            options.parent || null


        /* =================================================
           STATE
           ================================================= */

        this.active =
            false

        this.paused =
            false

        this.destroyed =
            false


        /* =================================================
           SIMULATION TIME
           ================================================= */

        this.time =
            0


        /* =================================================
           SOURCE POSITION
           =================================================

           IMPORTANT:

           The previous version used:

               -4.8 → +5.0

           which made the experiment occupy too much
           horizontal space and caused the wavefronts
           to disappear behind the right control panel.

           The new composition keeps the entire experiment
           around the central visual area.
        */

        this.sourceX =
            -2.8

        this.sourceDirection =
            1


        /* =================================================
           PHYSICAL PARAMETERS
           ================================================= */

        this.sourceSpeed =
            0.80

        this.frequency =
            2.00

        this.waveSpeed =
            5.00


        /* =================================================
           WAVE PARAMETERS
           ================================================= */

        this.maxWaveCount =
            28

        this.waveLifetime =
            4.8

        this.emissionAccumulator =
            0


        /* =================================================
           VISUAL WORLD
           ================================================= */

        /*
         * These are visualization coordinates only.
         *
         * They are deliberately smaller than the previous
         * version so the experiment remains visible in the
         * central safe area of the UI.
         */

        this.worldMinX =
            -5.2

        this.worldMaxX =
            5.2

        this.worldY =
            0

        this.worldZ =
            0


        /*
         * The whole experiment receives a tiny visual
         * offset toward the left.
         *
         * This is intentional:
         *
         * the UI panel occupies the right side of the screen.
         */

        this.visualOffsetX =
            -0.55


        /*
         * Physical radius remains based on waveSpeed.
         *
         * This multiplier only controls the visual scale.
         */

        this.waveVisualScale =
            0.72


        /* =================================================
           THREE MAIN GROUP
           ================================================= */

        this.group =
            new THREE.Group()

        this.group.name =
            'Awtaar_Doppler_Experiment'

        this.group.position.x =
            this.visualOffsetX

        this.group.renderOrder =
            1000


        /* =================================================
           SOURCE GROUP
           ================================================= */

        this.sourceGroup =
            new THREE.Group()

        this.sourceGroup.name =
            'Doppler_Source'

        this.sourceGroup.renderOrder =
            1000

        this.group.add(
            this.sourceGroup
        )


        /* =================================================
           LISTENER GROUP
           ================================================= */

        this.listenerGroup =
            new THREE.Group()

        this.listenerGroup.name =
            'Doppler_Listener'

        this.listenerGroup.renderOrder =
            1000

        this.group.add(
            this.listenerGroup
        )


        /* =================================================
           WAVE GROUP
           ================================================= */

        this.waveGroup =
            new THREE.Group()

        this.waveGroup.name =
            'Doppler_Wavefronts'

        this.waveGroup.renderOrder =
            1000

        this.group.add(
            this.waveGroup
        )


        /* =================================================
           GUIDE GROUP
           ================================================= */

        this.guideGroup =
            new THREE.Group()

        this.guideGroup.name =
            'Doppler_Guides'

        this.guideGroup.renderOrder =
            1000

        this.group.add(
            this.guideGroup
        )


        /* =================================================
           WAVE ARRAY
           ================================================= */

        this.wavefronts =
            []


        /* =================================================
           CREATE VISUAL ELEMENTS
           ================================================= */

        this.createSource()

        this.createListener()

        this.createDirectionArrow()

        this.createAxis()

        this.createDistanceMarkers()


        /* =================================================
           INITIAL STATE
           ================================================= */

        this.updateSourcePosition()

        this.updateDirectionArrow()

    }


    /* =========================================================
       CREATE SOURCE
       ========================================================= */

    createSource() {

        /* =====================================================
           OUTER GLOW
           ===================================================== */

        const glowGeometry =
            new THREE.SphereGeometry(
                0.42,
                32,
                32
            )


        const glowMaterial =
            new THREE.MeshBasicMaterial({
                color: 0x65d9ff,
                transparent: true,
                opacity: 0.13,
                depthWrite: false,
                depthTest: false
            })


        this.sourceGlow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            )

        this.sourceGlow.renderOrder =
            1002


        this.sourceGroup.add(
            this.sourceGlow
        )


        /* =====================================================
           SOURCE BODY
           ===================================================== */

        const sourceGeometry =
            new THREE.SphereGeometry(
                0.23,
                32,
                32
            )


        const sourceMaterial =
            new THREE.MeshBasicMaterial({
                color: 0x65d9ff,
                transparent: true,
                opacity: 1,
                depthWrite: false,
                depthTest: false
            })


        this.sourceMesh =
            new THREE.Mesh(
                sourceGeometry,
                sourceMaterial
            )

        this.sourceMesh.renderOrder =
            1003


        this.sourceGroup.add(
            this.sourceMesh
        )


        /* =====================================================
           INNER CORE
           ===================================================== */

        const coreGeometry =
            new THREE.SphereGeometry(
                0.085,
                20,
                20
            )


        const coreMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.98,
                depthWrite: false,
                depthTest: false
            })


        this.sourceCore =
            new THREE.Mesh(
                coreGeometry,
                coreMaterial
            )

        this.sourceCore.renderOrder =
            1004


        this.sourceGroup.add(
            this.sourceCore
        )


        /* =====================================================
           SOURCE RING
           ===================================================== */

        const ringGeometry =
            new THREE.RingGeometry(
                0.31,
                0.345,
                64
            )


        const ringMaterial =
            new THREE.MeshBasicMaterial({
                color: 0x65d9ff,
                transparent: true,
                opacity: 0.50,
                side: THREE.DoubleSide,
                depthWrite: false,
                depthTest: false
            })


        this.sourceRing =
            new THREE.Mesh(
                ringGeometry,
                ringMaterial
            )

        this.sourceRing.renderOrder =
            1003


        this.sourceGroup.add(
            this.sourceRing
        )

    }


    /* =========================================================
       CREATE LISTENER
       ========================================================= */

    createListener() {

        /*
         * Listener stays close enough to the source to make
         * the Doppler compression easy to see.
         */

        this.listenerX =
            3.15


        /* =====================================================
           LISTENER GLOW
           ===================================================== */

        const glowGeometry =
            new THREE.SphereGeometry(
                0.40,
                32,
                32
            )


        const glowMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xd8c28f,
                transparent: true,
                opacity: 0.11,
                depthWrite: false,
                depthTest: false
            })


        this.listenerGlow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            )

        this.listenerGlow.renderOrder =
            1001


        this.listenerGroup.add(
            this.listenerGlow
        )


        /* =====================================================
           LISTENER BODY
           ===================================================== */

        const bodyGeometry =
            new THREE.SphereGeometry(
                0.20,
                32,
                32
            )


        const bodyMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xd8c28f,
                transparent: true,
                opacity: 0.96,
                depthWrite: false,
                depthTest: false
            })


        this.listenerMesh =
            new THREE.Mesh(
                bodyGeometry,
                bodyMaterial
            )

        this.listenerMesh.renderOrder =
            1003


        this.listenerGroup.add(
            this.listenerMesh
        )


        /* =====================================================
           INNER CORE
           ===================================================== */

        const coreGeometry =
            new THREE.SphereGeometry(
                0.065,
                20,
                20
            )


        const coreMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.95,
                depthWrite: false,
                depthTest: false
            })


        this.listenerCore =
            new THREE.Mesh(
                coreGeometry,
                coreMaterial
            )

        this.listenerCore.renderOrder =
            1004


        this.listenerGroup.add(
            this.listenerCore
        )


        /* =====================================================
           LISTENER RING
           ===================================================== */

        const ringGeometry =
            new THREE.RingGeometry(
                0.28,
                0.315,
                64
            )


        const ringMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xd8c28f,
                transparent: true,
                opacity: 0.42,
                side: THREE.DoubleSide,
                depthWrite: false,
                depthTest: false
            })


        this.listenerRing =
            new THREE.Mesh(
                ringGeometry,
                ringMaterial
            )

        this.listenerRing.renderOrder =
            1002


        this.listenerGroup.add(
            this.listenerRing
        )


        /* =====================================================
           POSITION
           ===================================================== */

        this.listenerGroup.position.set(
            this.listenerX,
            this.worldY,
            this.worldZ
        )

    }


    /* =========================================================
       DIRECTION ARROW
       ========================================================= */

    createDirectionArrow() {

        const arrowOrigin =
            new THREE.Vector3(
                this.sourceX,
                -0.72,
                0
            )


        this.directionArrow =
            new THREE.ArrowHelper(
                new THREE.Vector3(
                    1,
                    0,
                    0
                ),
                arrowOrigin,
                1.05,
                0x65d9ff,
                0.18,
                0.10
            )


        this.directionArrow.renderOrder =
            1005


        this.group.add(
            this.directionArrow
        )

    }


    /* =========================================================
       AXIS
       ========================================================= */

    createAxis() {

        const points = [

            new THREE.Vector3(
                this.worldMinX,
                0,
                0
            ),

            new THREE.Vector3(
                this.worldMaxX,
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
                color: 0xd8c28f,
                transparent: true,
                opacity: 0.075,
                depthWrite: false,
                depthTest: false
            })


        this.axisLine =
            new THREE.Line(
                geometry,
                material
            )

        this.axisLine.renderOrder =
            999


        this.guideGroup.add(
            this.axisLine
        )

    }


    /* =========================================================
       DISTANCE MARKERS
       ========================================================= */

    createDistanceMarkers() {

        this.distanceMarkers =
            []


        const markerPositions = [
            -4,
            -2,
            0,
            2,
            4
        ]


        markerPositions.forEach(
            x => {

                const points = [

                    new THREE.Vector3(
                        x,
                        -0.065,
                        0
                    ),

                    new THREE.Vector3(
                        x,
                        0.065,
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
                        color: 0xd8c28f,
                        transparent: true,
                        opacity: 0.10,
                        depthWrite: false,
                        depthTest: false
                    })


                const line =
                    new THREE.Line(
                        geometry,
                        material
                    )


                line.renderOrder =
                    999


                this.guideGroup.add(
                    line
                )


                this.distanceMarkers.push(
                    line
                )

            }
        )

    }


    /* =========================================================
       ADD TO SCENE
       ========================================================= */

    addToScene(
        scene
    ) {

        if (
            this.destroyed
        ) {
            return
        }


        if (
            scene
        ) {

            this.scene =
                scene

        }


        if (
            !this.scene
        ) {
            return
        }


        if (
            this.group.parent !== this.scene
        ) {

            this.scene.add(
                this.group
            )

        }


        this.updateSourcePosition()

        this.updateDirectionArrow()

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


        if (
            !this.scene
        ) {
            return
        }


        this.active =
            true

        this.paused =
            false


        if (
            this.group.parent !== this.scene
        ) {

            this.scene.add(
                this.group
            )

        }

    }


    /* =========================================================
       PAUSE
       ========================================================= */

    pause() {

        if (
            this.destroyed
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

        if (
            this.destroyed
        ) {
            return
        }


        this.active =
            false

        this.paused =
            false

    }


    /* =========================================================
       UPDATE
       ========================================================= */

    update(
        delta
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

        this.sourceX +=
            this.sourceSpeed *
            this.sourceDirection *
            safeDelta


        /*
         * Keep the source inside the visual composition.
         *
         * It never moves underneath the right control panel.
         */

        const leftLimit =
            -3.75

        const rightLimit =
            1.65


        if (
            this.sourceX >=
            rightLimit
        ) {

            this.sourceX =
                rightLimit

            this.sourceDirection =
                -1

        }


        if (
            this.sourceX <=
            leftLimit
        ) {

            this.sourceX =
                leftLimit

            this.sourceDirection =
                1

        }


        this.updateSourcePosition()

        this.updateDirectionArrow()

        this.updateWaveEmission(
            safeDelta
        )

        this.updateWavefronts(
            safeDelta
        )

        this.updateVisualPulse()

    }


    /* =========================================================
       SOURCE POSITION
       ========================================================= */

    updateSourcePosition() {

        if (
            !this.sourceGroup
        ) {
            return
        }


        this.sourceGroup.position.set(
            this.sourceX,
            this.worldY,
            this.worldZ
        )

    }


    /* =========================================================
       DIRECTION ARROW
       ========================================================= */

    updateDirectionArrow() {

        if (
            !this.directionArrow
        ) {
            return
        }


        const direction =
            this.sourceDirection >= 0
                ? 1
                : -1


        this.directionArrow.setDirection(
            new THREE.Vector3(
                direction,
                0,
                0
            )
        )


        this.directionArrow.position.set(
            this.sourceX,
            -0.72,
            0
        )

    }


    /* =========================================================
       WAVE EMISSION
       ========================================================= */

    updateWaveEmission(
        delta
    ) {

        const interval =
            1 /
            Math.max(
                this.frequency,
                0.0001
            )


        this.emissionAccumulator +=
            delta


        /*
         * Prevent a huge burst after a temporary lag.
         */

        let safety =
            0


        while (
            this.emissionAccumulator >= interval &&
            safety < 4
        ) {

            this.emissionAccumulator -=
                interval


            this.emitWavefront()


            safety++

        }

    }


    /* =========================================================
       CREATE WAVEFRONT
       ========================================================= */

    emitWavefront() {

        if (
            this.wavefronts.length >=
            this.maxWaveCount
        ) {

            this.removeOldestWavefront()

        }


        /*
         * CRITICAL:
         *
         * The wave is born at the CURRENT source position.
         *
         * It never follows the source.
         */

        const originX =
            this.sourceX


        const segments =
            128


        const positions =
            new Float32Array(
                (segments + 1) * 3
            )


        for (
            let i = 0;
            i <= segments;
            i++
        ) {

            const angle =
                (
                    i /
                    segments
                ) *
                Math.PI *
                2


            positions[
                i * 3
            ] =
                Math.cos(angle)


            positions[
                i * 3 + 1
            ] =
                Math.sin(angle)


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


        const material =
            new THREE.LineBasicMaterial({
                color: 0x65d9ff,
                transparent: true,
                opacity: 0.48,
                depthWrite: false,
                depthTest: false
            })


        const line =
            new THREE.LineLoop(
                geometry,
                material
            )


        line.position.set(
            originX,
            this.worldY,
            this.worldZ
        )


        /*
         * Start from an almost invisible radius.
         */

        line.scale.set(
            0.001,
            0.001,
            0.001
        )


        line.renderOrder =
            1001


        /*
         * Prevent Three.js frustum optimization from
         * accidentally hiding a large expanding ring.
         */

        line.frustumCulled =
            false


        this.waveGroup.add(
            line
        )


        this.wavefronts.push({

            object:
                line,

            originX:
                originX,

            age:
                0,

            radius:
                0,

            maxAge:
                this.waveLifetime

        })

    }


    /* =========================================================
       UPDATE WAVEFRONTS
       ========================================================= */

    updateWavefronts(
        delta
    ) {

        for (
            let i =
                this.wavefronts.length - 1;

            i >= 0;

            i--
        ) {

            const wave =
                this.wavefronts[i]


            if (
                !wave ||
                !wave.object
            ) {
                continue
            }


            wave.age +=
                delta


            wave.radius =
                this.waveSpeed *
                wave.age


            const radius =
                Math.max(
                    wave.radius *
                    this.waveVisualScale,
                    0.001
                )


            wave.object.scale.set(
                radius,
                radius,
                radius
            )


            /* =================================================
               FADE
               ================================================= */

            const life =
                THREE.MathUtils.clamp(
                    wave.age /
                    wave.maxAge,
                    0,
                    1
                )


            /*
             * New waves are clearer.
             *
             * Old waves slowly disappear.
             */

            const fade =
                1 -
                life


            wave.object.material.opacity =
                0.045 +
                fade *
                0.44


            /* =================================================
               REMOVE
               ================================================= */

            if (
                wave.age >=
                wave.maxAge
            ) {

                this.removeWavefront(
                    i
                )

            }

        }

    }


    /* =========================================================
       REMOVE OLDEST WAVE
       ========================================================= */

    removeOldestWavefront() {

        if (
            this.wavefronts.length === 0
        ) {
            return
        }


        this.removeWavefront(
            0
        )

    }


    /* =========================================================
       REMOVE WAVE
       ========================================================= */

    removeWavefront(
        index
    ) {

        const wave =
            this.wavefronts[index]


        if (
            !wave
        ) {
            return
        }


        if (
            wave.object &&
            wave.object.parent
        ) {

            wave.object.parent.remove(
                wave.object
            )

        }


        if (
            wave.object
        ) {

            if (
                wave.object.geometry
            ) {

                wave.object.geometry.dispose()

            }


            if (
                wave.object.material
            ) {

                wave.object.material.dispose()

            }

        }


        this.wavefronts.splice(
            index,
            1
        )

    }


    /* =========================================================
       VISUAL PULSE
       ========================================================= */

    updateVisualPulse() {

        if (
            !this.sourceGlow
        ) {
            return
        }


        const sourcePulse =
            (
                Math.sin(
                    this.time *
                    Math.PI *
                    2 *
                    Math.max(
                        this.frequency,
                        0.1
                    )
                ) +
                1
            ) *
            0.5


        this.sourceGlow.scale.setScalar(
            1 +
            sourcePulse *
            0.22
        )


        this.sourceGlow.material.opacity =
            0.10 +
            sourcePulse *
            0.10


        /* =====================================================
           LISTENER PULSE
           ===================================================== */

        if (
            this.listenerGlow
        ) {

            const observed =
                this.getObservedFrequency()


            const listenerPulse =
                (
                    Math.sin(
                        this.time *
                        Math.PI *
                        2 *
                        Math.max(
                            observed,
                            0.1
                        )
                    ) +
                    1
                ) *
                0.5


            this.listenerGlow.scale.setScalar(
                1 +
                listenerPulse *
                0.24
            )


            this.listenerGlow.material.opacity =
                0.07 +
                listenerPulse *
                0.11

        }


        /* =====================================================
           SOURCE RING
           ===================================================== */

        if (
            this.sourceRing
        ) {

            this.sourceRing.material.opacity =
                0.30 +
                sourcePulse *
                0.28

        }


        /* =====================================================
           LISTENER RING
           ===================================================== */

        if (
            this.listenerRing
        ) {

            this.listenerRing.material.opacity =
                0.26 +
                sourcePulse *
                0.18

        }

    }


    /* =========================================================
       SOURCE SPEED
       ========================================================= */

    setSourceSpeed(
        value
    ) {

        if (
            this.destroyed
        ) {
            return
        }


        const number =
            Number(value)


        if (
            !Number.isFinite(number)
        ) {
            return
        }


        this.sourceSpeed =
            THREE.MathUtils.clamp(
                number,
                0,
                2.5
            )

    }


    /* =========================================================
       FREQUENCY
       ========================================================= */

    setFrequency(
        value
    ) {

        if (
            this.destroyed
        ) {
            return
        }


        const number =
            Number(value)


        if (
            !Number.isFinite(number)
        ) {
            return
        }


        this.frequency =
            THREE.MathUtils.clamp(
                number,
                0.1,
                8
            )


        /*
         * Keep emission timing stable when the slider
         * is moved suddenly.
         */

        this.emissionAccumulator =
            Math.min(
                this.emissionAccumulator,
                1 /
                this.frequency
            )

    }


    /* =========================================================
       WAVE SPEED
       ========================================================= */

    setWaveSpeed(
        value
    ) {

        if (
            this.destroyed
        ) {
            return
        }


        const number =
            Number(value)


        if (
            !Number.isFinite(number)
        ) {
            return
        }


        this.waveSpeed =
            THREE.MathUtils.clamp(
                number,
                0.5,
                10
            )

    }


    /* =========================================================
       APPROACHING FREQUENCY
       ========================================================= */

    getApproachingFrequency() {

        const c =
            Math.max(
                this.waveSpeed,
                0.0001
            )


        const vs =
            Math.min(
                Math.abs(
                    this.sourceSpeed
                ),
                c * 0.95
            )


        return (
            this.frequency *
            c /
            (
                c -
                vs
            )
        )

    }


    /* =========================================================
       RECEDING FREQUENCY
       ========================================================= */

    getRecedingFrequency() {

        const c =
            Math.max(
                this.waveSpeed,
                0.0001
            )


        const vs =
            Math.min(
                Math.abs(
                    this.sourceSpeed
                ),
                c * 0.95
            )


        return (
            this.frequency *
            c /
            (
                c +
                vs
            )
        )

    }


    /* =========================================================
       APPROACHING WAVELENGTH
       ========================================================= */

    getApproachingWavelength() {

        const c =
            Math.max(
                this.waveSpeed,
                0.0001
            )


        const vs =
            Math.min(
                Math.abs(
                    this.sourceSpeed
                ),
                c * 0.95
            )


        return (
            (
                c -
                vs
            ) /
            Math.max(
                this.frequency,
                0.0001
            )
        )

    }


    /* =========================================================
       RECEDING WAVELENGTH
       ========================================================= */

    getRecedingWavelength() {

        const c =
            Math.max(
                this.waveSpeed,
                0.0001
            )


        const vs =
            Math.min(
                Math.abs(
                    this.sourceSpeed
                ),
                c * 0.95
            )


        return (
            (
                c +
                vs
            ) /
            Math.max(
                this.frequency,
                0.0001
            )
        )

    }


    /* =========================================================
       OBSERVED FREQUENCY
       ========================================================= */

    getObservedFrequency() {

        /*
         * Listener is always on the RIGHT.
         *
         * Source moving right:
         * approaching.
         *
         * Source moving left:
         * receding.
         */

        if (
            this.sourceDirection > 0
        ) {

            return this.getApproachingFrequency()

        }


        return this.getRecedingFrequency()

    }


    /* =========================================================
       GET WAVE DATA
       ========================================================= */

    getWaveData() {

        const wavelength =
            this.waveSpeed /
            Math.max(
                this.frequency,
                0.0001
            )


        const approachingFrequency =
            this.getApproachingFrequency()


        const recedingFrequency =
            this.getRecedingFrequency()


        const approachingWavelength =
            this.getApproachingWavelength()


        const recedingWavelength =
            this.getRecedingWavelength()


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
                this.wavefronts.length,

            approachingFrequency:
                approachingFrequency,

            recedingFrequency:
                recedingFrequency,

            approachingWavelength:
                approachingWavelength,

            recedingWavelength:
                recedingWavelength,

            observedFrequency:
                this.getObservedFrequency(),

            sourceDirection:
                this.sourceDirection,

            sourceX:
                this.sourceX,

            listenerX:
                this.listenerX,

            approaching:
                this.sourceDirection > 0

        }

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


        this.active =
            false

        this.paused =
            false


        this.time =
            0


        this.sourceX =
            -2.8


        this.sourceDirection =
            1


        this.emissionAccumulator =
            0


        /* =====================================================
           DEFAULT PARAMETERS
           ===================================================== */

        this.sourceSpeed =
            0.80

        this.frequency =
            2.00

        this.waveSpeed =
            5.00


        /* =====================================================
           REMOVE WAVES
           ===================================================== */

        for (
            let i =
                this.wavefronts.length - 1;

            i >= 0;

            i--
        ) {

            this.removeWavefront(
                i
            )

        }


        /* =====================================================
           RESTORE VISUAL STATE
           ===================================================== */

        this.updateSourcePosition()

        this.updateDirectionArrow()


        if (
            this.sourceGlow
        ) {

            this.sourceGlow.scale.setScalar(
                1
            )

            this.sourceGlow.material.opacity =
                0.13

        }


        if (
            this.listenerGlow
        ) {

            this.listenerGlow.scale.setScalar(
                1
            )

            this.listenerGlow.material.opacity =
                0.11

        }

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


        this.destroyed =
            true

        this.active =
            false

        this.paused =
            false


        /* =====================================================
           REMOVE ALL WAVES
           ===================================================== */

        for (
            let i =
                this.wavefronts.length - 1;

            i >= 0;

            i--
        ) {

            this.removeWavefront(
                i
            )

        }


        this.wavefronts =
            []


        /* =====================================================
           REMOVE MAIN GROUP
           ===================================================== */

        if (
            this.group &&
            this.group.parent
        ) {

            this.group.parent.remove(
                this.group
            )

        }


        /* =====================================================
           DISPOSE
           ===================================================== */

        this.disposeObject(
            this.group
        )


        /* =====================================================
           RELEASE REFERENCES
           ===================================================== */

        this.group =
            null

        this.sourceGroup =
            null

        this.listenerGroup =
            null

        this.waveGroup =
            null

        this.guideGroup =
            null

        this.directionArrow =
            null

        this.sourceGlow =
            null

        this.sourceMesh =
            null

        this.sourceCore =
            null

        this.sourceRing =
            null

        this.listenerGlow =
            null

        this.listenerMesh =
            null

        this.listenerCore =
            null

        this.listenerRing =
            null

        this.axisLine =
            null

        this.distanceMarkers =
            []

        this.scene =
            null

        this.parent =
            null

    }


    /* =========================================================
       DISPOSE OBJECT
       ========================================================= */

    disposeObject(
        object
    ) {

        if (
            !object
        ) {
            return
        }


        object.traverse(
            child => {

                if (
                    child.geometry
                ) {

                    child.geometry.dispose()

                }


                if (
                    child.material
                ) {

                    if (
                        Array.isArray(
                            child.material
                        )
                    ) {

                        child.material.forEach(
                            material => {

                                if (
                                    material
                                ) {

                                    material.dispose()

                                }

                            }
                        )

                    }
                    else {

                        child.material.dispose()

                    }

                }

            }
        )

    }

}