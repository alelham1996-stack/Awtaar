import * as THREE from 'three'


/* =========================================================
   AWTAAR — SPACETIME CURVATURE EXPERIMENT
   ========================================================= */

export default class SpacetimeExperiment {

    constructor(options = {}) {

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

        this.visible =
            false

        this.time =
            0


        /* =====================================================
           PHYSICAL PARAMETERS
           ===================================================== */

        /*
         * Mass
         *
         * Relative value from 0 to 1.
         *
         * This does not represent kilograms.
         * It represents the relative strength
         * of the gravitational field.
         */

        this.mass =
            0.65


        /*
         * Orbital / object velocity.
         *
         * Relative to the speed of light.
         */

        this.velocity =
            0.45


        /*
         * Gravitational strength.
         */

        this.gravityStrength =
            1.0


        /* =====================================================
           SPACETIME GRID
           ===================================================== */

        this.grid =
            null

        this.gridGeometry =
            null

        this.gridMaterial =
            null

        this.gridSize =
            18

        this.gridSegments =
            70


        /*
         * Original flat grid positions.
         *
         * These are preserved so the curvature
         * can be recalculated whenever mass changes.
         */

        this.originalPositions =
            null


        /* =====================================================
           CENTRAL MASS
           ===================================================== */

        /*
         * IMPORTANT
         *
         * The mass is now represented ONLY as a physical
         * parameter controlling spacetime curvature.
         *
         * We intentionally do NOT display a giant sphere
         * in the center.
         */

        this.massObject =
            null

        this.massGlow =
            null


        /* =====================================================
           ORBITING BODY
           ===================================================== */

        this.traveler =
            null

        this.travelerGlow =
            null


        /* =====================================================
           TRAJECTORY
           ===================================================== */

        this.trajectory =
            null

        this.trajectoryGeometry =
            null

        this.trajectoryMaterial =
            null

        this.trajectoryPoints =
            []

        this.maxTrajectoryPoints =
            700


        /* =====================================================
           LIGHTING
           ===================================================== */

        this.light =
            null


        /* =====================================================
           INTERNAL VALUES
           ===================================================== */

        this.orbitAngle =
            0

        this.orbitRadius =
            5.2

        this.orbitHeight =
            1.8

        this.lastPosition =
            new THREE.Vector3()


        /* =====================================================
           GROUP
           ===================================================== */

        this.group =
            new THREE.Group()

        this.group.name =
            'AwtaarSpacetimeExperiment'

        this.group.visible =
            false


        /* =====================================================
           BUILD
           ===================================================== */

        this.createGrid()

        this.createMass()

        this.createTraveler()

        this.createTrajectory()

        this.createLighting()


        /* =====================================================
           ADD TO PARENT
           ===================================================== */

        if (this.parent) {

            this.parent.add(
                this.group
            )

        }

    }


    /* =========================================================
       CREATE GRID
       ========================================================= */

    createGrid() {

        const size =
            this.gridSize

        const segments =
            this.gridSegments


        const geometry =
            new THREE.PlaneGeometry(
                size,
                size,
                segments,
                segments
            )


        /*
         * PlaneGeometry initially lies in XY.
         *
         * Rotate it so:
         *
         * X = horizontal
         * Z = depth
         * Y = curvature
         */

        geometry.rotateX(
            -Math.PI / 2
        )


        this.gridGeometry =
            geometry


        this.gridMaterial =
            new THREE.LineBasicMaterial({

                color:
                    0xd8c9a8,

                transparent:
                    true,

                opacity:
                    0.24

            })


        /*
         * Wireframe representation.
         */

        const wireframe =
            new THREE.WireframeGeometry(
                geometry
            )


        this.grid =
            new THREE.LineSegments(
                wireframe,
                this.gridMaterial
            )


        this.grid.name =
            'SpacetimeGrid'


        this.group.add(
            this.grid
        )


        /*
         * Store original flat positions.
         */

        this.originalPositions =
            geometry.attributes.position
                .array
                .slice()

    }


    /* =========================================================
       CREATE CENTRAL MASS
       ========================================================= */

    createMass() {

        /*
         * The mass is intentionally invisible.
         *
         * Its value still controls the curvature
         * of spacetime through getCurvature().
         *
         * This prevents the large sphere from dominating
         * the visual composition.
         */

        this.massObject =
            null

        this.massGlow =
            null

    }


    /* =========================================================
       CREATE TRAVELER
       ========================================================= */

    createTraveler() {

        const geometry =
            new THREE.SphereGeometry(
                0.16,
                32,
                32
            )


        const material =
            new THREE.MeshStandardMaterial({

                color:
                    0xf2dfb0,

                emissive:
                    0xb99858,

                emissiveIntensity:
                    1.8,

                metalness:
                    0.25,

                roughness:
                    0.25

            })


        this.traveler =
            new THREE.Mesh(
                geometry,
                material
            )


        this.traveler.name =
            'SpacetimeTraveler'


        this.group.add(
            this.traveler
        )


        /*
         * Soft luminous halo.
         */

        const glowGeometry =
            new THREE.SphereGeometry(
                0.34,
                24,
                24
            )


        const glowMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0xf1d99f,

                transparent:
                    true,

                opacity:
                    0.13,

                depthWrite:
                    false

            })


        this.travelerGlow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            )


        this.travelerGlow.name =
            'TravelerGlow'


        this.group.add(
            this.travelerGlow
        )


        this.resetTraveler()

    }


    /* =========================================================
       CREATE TRAJECTORY
       ========================================================= */

    createTrajectory() {

        this.trajectoryGeometry =
            new THREE.BufferGeometry()


        this.trajectoryMaterial =
            new THREE.LineBasicMaterial({

                color:
                    0xdcc89b,

                transparent:
                    true,

                opacity:
                    0.42

            })


        this.trajectory =
            new THREE.Line(
                this.trajectoryGeometry,
                this.trajectoryMaterial
            )


        this.trajectory.name =
            'TravelerTrajectory'


        this.group.add(
            this.trajectory
        )

    }


    /* =========================================================
       CREATE LIGHTING
       ========================================================= */

    createLighting() {

        this.light =
            new THREE.PointLight(
                0xd8c18b,
                2.0,
                18
            )


        this.light.position.set(
            0,
            3.5,
            0
        )


        this.group.add(
            this.light
        )

    }


    /* =========================================================
       CURVATURE FUNCTION
       ========================================================= */

    getCurvature(
        x,
        z
    ) {

        const distance =
            Math.sqrt(
                x * x +
                z * z
            )


        /*
         * Prevent singularity at the center.
         */

        const safeDistance =
            Math.max(
                distance,
                0.65
            )


        /*
         * Gravitational strength.
         *
         * At mass = 0:
         *
         * strength = 0
         *
         * therefore:
         *
         * curvature = 0
         *
         * and the grid becomes completely flat.
         */

        const strength =
            this.mass *
            this.gravityStrength


        const radius =
            4.6


        const depth =
            strength *
            3.2 *
            Math.exp(
                -(
                    safeDistance *
                    safeDistance
                ) /
                (
                    radius *
                    radius
                )
            )


        return -depth

    }


    /* =========================================================
       UPDATE GRID CURVATURE
       ========================================================= */

    updateGrid() {

        if (
            !this.gridGeometry
        ) {
            return
        }


        const position =
            this.gridGeometry
                .attributes
                .position


        const original =
            this.originalPositions


        for (
            let i = 0;
            i < position.count;
            i++
        ) {

            const index =
                i * 3


            const x =
                original[index]


            const z =
                original[index + 2]


            const y =
                this.getCurvature(
                    x,
                    z
                )


            position.setY(
                i,
                y
            )

        }


        position.needsUpdate =
            true


        /*
         * Rebuild wireframe geometry
         * from the updated surface.
         */

        const newWireframe =
            new THREE.WireframeGeometry(
                this.gridGeometry
            )


        if (
            this.grid.geometry
        ) {

            this.grid.geometry.dispose()

        }


        this.grid.geometry =
            newWireframe

    }


    /* =========================================================
       RESET TRAVELER
       ========================================================= */

    resetTraveler() {

        this.orbitAngle =
            0


        this.trajectoryPoints =
            []


        const position =
            this.calculateTravelerPosition(
                this.orbitAngle
            )


        if (
            this.traveler
        ) {

            this.traveler.position.copy(
                position
            )

        }


        if (
            this.travelerGlow
        ) {

            this.travelerGlow.position.copy(
                position
            )

        }


        this.lastPosition.copy(
            position
        )


        this.updateTrajectory()

    }


    /* =========================================================
       CALCULATE TRAVELER POSITION
       ========================================================= */

    calculateTravelerPosition(
        angle
    ) {

        /*
         * Stronger mass produces a tighter orbit.
         */

        const effectiveRadius =
            this.orbitRadius -
            (
                this.mass *
                1.25
            )


        const radius =
            Math.max(
                effectiveRadius,
                2.5
            )


        const x =
            Math.cos(angle) *
            radius


        const z =
            Math.sin(angle) *
            radius


        /*
         * The traveler follows
         * the curved spacetime surface.
         */

        const y =
            this.getCurvature(
                x,
                z
            ) +
            0.18


        return new THREE.Vector3(
            x,
            y,
            z
        )

    }


    /* =========================================================
       UPDATE TRAVELER
       ========================================================= */

    updateTraveler(
        delta
    ) {

        /*
         * Convert relative velocity into
         * an educational visual angular speed.
         */

        const angularSpeed =
            0.18 +
            (
                this.velocity *
                1.35
            )


        this.orbitAngle +=
            angularSpeed *
            delta


        const position =
            this.calculateTravelerPosition(
                this.orbitAngle
            )


        if (
            this.traveler
        ) {

            this.traveler.position.copy(
                position
            )

        }


        if (
            this.travelerGlow
        ) {

            this.travelerGlow.position.copy(
                position
            )

        }


        /*
         * Record trajectory.
         */

        if (
            this.active &&
            !this.paused
        ) {

            const distance =
                position.distanceTo(
                    this.lastPosition
                )


            if (
                distance > 0.015
            ) {

                this.trajectoryPoints.push(
                    position.clone()
                )


                if (
                    this.trajectoryPoints.length >
                    this.maxTrajectoryPoints
                ) {

                    this.trajectoryPoints.shift()

                }


                this.lastPosition.copy(
                    position
                )


                this.updateTrajectory()

            }

        }

    }


    /* =========================================================
       UPDATE TRAJECTORY
       ========================================================= */

    updateTrajectory() {

        if (
            !this.trajectoryGeometry
        ) {
            return
        }


        this.trajectoryGeometry.setFromPoints(
            this.trajectoryPoints
        )

    }


    /* =========================================================
       SET MASS
       ========================================================= */

    setMass(
        value
    ) {

        const numericValue =
            Number(value)


        if (
            !Number.isFinite(
                numericValue
            )
        ) {
            return
        }


        this.mass =
            THREE.MathUtils.clamp(
                numericValue,
                0,
                1
            )


        /*
         * Immediately update the spacetime
         * when the slider moves.
         */

        this.updateGrid()


        /*
         * Keep traveler aligned
         * with the new curvature.
         */

        const position =
            this.calculateTravelerPosition(
                this.orbitAngle
            )


        if (
            this.traveler
        ) {

            this.traveler.position.copy(
                position
            )

        }


        if (
            this.travelerGlow
        ) {

            this.travelerGlow.position.copy(
                position
            )

        }

    }


    /* =========================================================
       SET VELOCITY
       ========================================================= */

    setVelocity(
        value
    ) {

        const numericValue =
            Number(value)


        if (
            !Number.isFinite(
                numericValue
            )
        ) {
            return
        }


        this.velocity =
            THREE.MathUtils.clamp(
                numericValue,
                0,
                0.99
            )

    }


    /* =========================================================
       GET RELATIVITY DATA
       ========================================================= */

    getRelativityData() {

        const beta =
            this.velocity


        const gamma =
            1 /
            Math.sqrt(
                1 -
                beta * beta
            )


        return {

            mass:
                this.mass,

            velocity:
                this.velocity,

            gamma:
                gamma,

            curvature:
                this.mass *
                this.gravityStrength,

            orbitRadius:
                Math.max(
                    this.orbitRadius -
                    (
                        this.mass *
                        1.25
                    ),
                    2.5
                )

        }

    }


    /* =========================================================
       START
       ========================================================= */

    start() {

        this.active =
            true

        this.paused =
            false

        this.visible =
            true

        this.group.visible =
            true

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


        this.orbitAngle =
            0


        this.trajectoryPoints =
            []


        this.updateGrid()

        this.resetTraveler()

    }


    /* =========================================================
       SET VISIBILITY
       ========================================================= */

    setVisible(
        visible
    ) {

        this.visible =
            Boolean(visible)

        this.group.visible =
            this.visible

    }


    /* =========================================================
       UPDATE
       ========================================================= */

    update(
        delta
    ) {

        if (
            !this.active ||
            this.paused
        ) {
            return
        }


        if (
            !Number.isFinite(delta)
        ) {
            return
        }


        /*
         * Protect against huge delta values
         * after tab switching.
         */

        const safeDelta =
            Math.min(
                delta,
                0.05
            )


        this.time +=
            safeDelta


        this.updateTraveler(
            safeDelta
        )


        /*
         * Traveler glow pulse.
         */

        if (
            this.travelerGlow
        ) {

            const pulse =
                1 +
                Math.sin(
                    this.time * 4
                ) *
                0.08


            this.travelerGlow.scale.setScalar(
                pulse
            )

        }

    }


    /* =========================================================
       ADD TO SCENE
       ========================================================= */

    addToScene(
        scene
    ) {

        if (
            !scene
        ) {
            return
        }


        if (
            this.group.parent !== scene
        ) {

            scene.add(
                this.group
            )

        }


        this.scene =
            scene

    }


    /* =========================================================
       REMOVE FROM SCENE
       ========================================================= */

    removeFromScene() {

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


        if (
            this.gridGeometry
        ) {

            this.gridGeometry.dispose()

        }


        if (
            this.gridMaterial
        ) {

            this.gridMaterial.dispose()

        }


        if (
            this.massObject &&
            this.massObject.geometry
        ) {

            this.massObject.geometry.dispose()

        }


        if (
            this.massObject &&
            this.massObject.material
        ) {

            this.massObject.material.dispose()

        }


        if (
            this.massGlow
        ) {

            this.massGlow.geometry.dispose()

            this.massGlow.material.dispose()

        }


        if (
            this.traveler
        ) {

            this.traveler.geometry.dispose()

            this.traveler.material.dispose()

        }


        if (
            this.travelerGlow
        ) {

            this.travelerGlow.geometry.dispose()

            this.travelerGlow.material.dispose()

        }


        if (
            this.trajectoryGeometry
        ) {

            this.trajectoryGeometry.dispose()

        }


        if (
            this.trajectoryMaterial
        ) {

            this.trajectoryMaterial.dispose()

        }


        if (
            this.light
        ) {

            this.light.dispose()

        }


        this.removeFromScene()


        this.group.clear()


        this.scene =
            null

        this.parent =
            null

    }

}