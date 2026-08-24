import * as THREE from 'three'


/* =========================================================
   AWTAAR — WAVE INTERFERENCE EXPERIMENT
   =========================================================

   Standalone Three.js experiment.

   Compatible with WavesWorldUI.js

   Public API:

   addToScene(scene)
   removeFromScene()
   setVisible(visible)

   start()
   stop()
   pause()
   resume()
   togglePause()

   reset()

   setAmplitude(value)
   setWavelength(value)
   setSourceDistance(value)
   setFrequency(value)

   getWaveData()

   update(delta)

   destroy()

   ========================================================= */


export default class WaveInterferenceExperiment {


    constructor(options = {}) {


        /* =====================================================
           REFERENCES
           ===================================================== */

        this.scene =
            options.scene || null


        this.parent =
            options.parent || null


        this.container =
            options.container || null


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
           DEFAULT PARAMETERS
           ===================================================== */

        this.defaultAmplitude =
            options.amplitude ?? 0.75


        this.defaultWavelength =
            options.wavelength ?? 2.4


        this.defaultSourceDistance =
            options.sourceDistance ?? 3.4


        this.defaultFrequency =
            options.frequency ?? 1.2


        /* =====================================================
           CURRENT PARAMETERS
           ===================================================== */

        this.amplitude =
            this.defaultAmplitude


        this.wavelength =
            this.defaultWavelength


        this.sourceDistance =
            this.defaultSourceDistance


        this.frequency =
            this.defaultFrequency


        /* =====================================================
           WAVE SETTINGS
           ===================================================== */

        this.waveSpeed =
            2.4


        this.surfaceHeight =
            0.8


        this.width =
            16


        this.depth =
            10


        this.segmentsX =
            100


        this.segmentsZ =
            70


        /* =====================================================
           THREE
           ===================================================== */

        this.experimentScene =
            null


        this.camera =
            null


        this.renderer =
            null


        this.clock =
            null


        /* =====================================================
           OBJECTS
           ===================================================== */

        this.group =
            null


        this.surface =
            null


        this.surfaceGeometry =
            null


        this.surfaceMaterial =
            null


        this.grid =
            null


        this.sourceA =
            null


        this.sourceB =
            null


        this.coreA =
            null


        this.coreB =
            null


        this.ringsA =
            []


        this.ringsB =
            []


        /* =====================================================
           LIGHTS
           ===================================================== */

        this.ambientLight =
            null


        this.pointLightA =
            null


        this.pointLightB =
            null


        /* =====================================================
           HELPERS
           ===================================================== */

        this.gridHelper =
            null


        /* =====================================================
           BUFFER
           ===================================================== */

        this.positionAttribute =
            null


        /* =====================================================
           RESIZE
           ===================================================== */

        this.resizeObserver =
            null


        this.widthPixels =
            0


        this.heightPixels =
            0


        /* =====================================================
           BUILD
           ===================================================== */

        this.create()


    }


    /* =========================================================
       CREATE
       ========================================================= */

    create() {


        this.createScene()

        this.createCamera()

        this.createRenderer()

        this.createLights()

        this.createExperiment()

        this.createResizeObserver()

        this.render()


    }


    /* =========================================================
       CREATE SCENE
       ========================================================= */

    createScene() {


        this.experimentScene =
            new THREE.Scene()


        this.experimentScene.background =
            new THREE.Color(
                0x050510
            )


        this.experimentScene.fog =
            new THREE.Fog(
                0x050510,
                10,
                28
            )


    }


    /* =========================================================
       CREATE CAMERA
       ========================================================= */

    createCamera() {


        this.camera =
            new THREE.PerspectiveCamera(
                42,
                1,
                0.1,
                100
            )


        this.camera.position.set(
            0,
            9.5,
            11
        )


        this.camera.lookAt(
            0,
            0,
            0
        )


    }


    /* =========================================================
       CREATE RENDERER
       ========================================================= */

    createRenderer() {


        this.renderer =
            new THREE.WebGLRenderer({

                antialias:
                    true,

                alpha:
                    true

            })


        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        )


        this.renderer.setSize(
            1,
            1
        )


        this.renderer.domElement.style.width =
            '100%'


        this.renderer.domElement.style.height =
            '100%'


        this.renderer.domElement.style.display =
            'block'


        this.renderer.domElement.style.position =
            'absolute'


        this.renderer.domElement.style.inset =
            '0'


        this.renderer.domElement.style.pointerEvents =
            'none'


        if (
            this.container
        ) {

            this.container.appendChild(
                this.renderer.domElement
            )

        }


        this.clock =
            new THREE.Clock()


    }


    /* =========================================================
       CREATE LIGHTS
       ========================================================= */

    createLights() {


        this.ambientLight =
            new THREE.AmbientLight(
                0xffffff,
                0.7
            )


        this.experimentScene.add(
            this.ambientLight
        )


        this.pointLightA =
            new THREE.PointLight(
                0x66ccff,
                3.5,
                10
            )


        this.pointLightA.position.set(
            -2,
            2,
            1
        )


        this.experimentScene.add(
            this.pointLightA
        )


        this.pointLightB =
            new THREE.PointLight(
                0xffcc66,
                3.5,
                10
            )


        this.pointLightB.position.set(
            2,
            2,
            1
        )


        this.experimentScene.add(
            this.pointLightB
        )


    }


    /* =========================================================
       CREATE EXPERIMENT
       ========================================================= */

    createExperiment() {


        this.group =
            new THREE.Group()


        this.group.name =
            'AwtaarWaveInterference'


        this.group.visible =
            true


        this.experimentScene.add(
            this.group
        )


        this.createSurface()

        this.createGrid()

        this.createSources()

        this.createWaveRings()

        this.updateSourcePositions()

        this.updateSurface()

        this.updateRings()


    }


    /* =========================================================
       CREATE SURFACE
       ========================================================= */

    createSurface() {


        this.surfaceGeometry =
            new THREE.PlaneGeometry(
                this.width,
                this.depth,
                this.segmentsX,
                this.segmentsZ
            )


        this.surfaceGeometry.rotateX(
            -Math.PI / 2
        )


        this.positionAttribute =
            this.surfaceGeometry.getAttribute(
                'position'
            )


        this.surfaceMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0x123c62,

                transparent:
                    true,

                opacity:
                    0.88,

                roughness:
                    0.45,

                metalness:
                    0.15,

                side:
                    THREE.DoubleSide

            })


        this.surface =
            new THREE.Mesh(
                this.surfaceGeometry,
                this.surfaceMaterial
            )


        this.surface.name =
            'InterferenceSurface'


        this.group.add(
            this.surface
        )


    }


    /* =========================================================
       CREATE GRID
       ========================================================= */

    createGrid() {


        this.gridHelper =
            new THREE.GridHelper(
                this.width,
                20,
                0x2a6f97,
                0x12324d
            )


        this.gridHelper.position.y =
            -0.03


        this.gridHelper.material.transparent =
            true


        this.gridHelper.material.opacity =
            0.3


        this.group.add(
            this.gridHelper
        )


    }


    /* =========================================================
       CREATE SOURCES
       ========================================================= */

    createSources() {


        const sourceGeometry =
            new THREE.SphereGeometry(
                0.32,
                32,
                32
            )


        const materialA =
            new THREE.MeshStandardMaterial({

                color:
                    0x47bfff,

                emissive:
                    0x1976d2,

                emissiveIntensity:
                    2.5,

                roughness:
                    0.25,

                metalness:
                    0.25

            })


        const materialB =
            new THREE.MeshStandardMaterial({

                color:
                    0xffc15c,

                emissive:
                    0xff8c00,

                emissiveIntensity:
                    2.5,

                roughness:
                    0.25,

                metalness:
                    0.25

            })


        this.sourceA =
            new THREE.Mesh(
                sourceGeometry,
                materialA
            )


        this.sourceB =
            new THREE.Mesh(
                sourceGeometry,
                materialB
            )


        this.sourceA.position.y =
            0.3


        this.sourceB.position.y =
            0.3


        this.group.add(
            this.sourceA
        )


        this.group.add(
            this.sourceB
        )


        /* =====================================================
           INNER CORES
           ===================================================== */

        const coreGeometry =
            new THREE.SphereGeometry(
                0.12,
                20,
                20
            )


        const coreMaterialA =
            new THREE.MeshBasicMaterial({

                color:
                    0xffffff

            })


        const coreMaterialB =
            new THREE.MeshBasicMaterial({

                color:
                    0xffffff

            })


        this.coreA =
            new THREE.Mesh(
                coreGeometry,
                coreMaterialA
            )


        this.coreB =
            new THREE.Mesh(
                coreGeometry,
                coreMaterialB
            )


        this.group.add(
            this.coreA
        )


        this.group.add(
            this.coreB
        )


    }


    /* =========================================================
       CREATE WAVE RINGS
       ========================================================= */

    createWaveRings() {


        const ringCount =
            7


        for (
            let i = 0;
            i < ringCount;
            i++
        ) {


            const ringA =
                this.createRing(
                    0x47bfff
                )


            const ringB =
                this.createRing(
                    0xffc15c
                )


            ringA.userData.index =
                i


            ringB.userData.index =
                i


            this.ringsA.push(
                ringA
            )


            this.ringsB.push(
                ringB
            )


            this.group.add(
                ringA
            )


            this.group.add(
                ringB
            )

        }


    }


    /* =========================================================
       CREATE RING
       ========================================================= */

    createRing(color) {


        const curve =
            new THREE.EllipseCurve(
                0,
                0,
                1,
                1,
                0,
                Math.PI * 2,
                false,
                0
            )


        const points =
            curve.getPoints(
                80
            )


        const geometry =
            new THREE.BufferGeometry().setFromPoints(
                points
            )


        geometry.rotateX(
            -Math.PI / 2
        )


        const material =
            new THREE.LineBasicMaterial({

                color,

                transparent:
                    true,

                opacity:
                    0.45

            })


        const ring =
            new THREE.LineLoop(
                geometry,
                material
            )


        ring.position.y =
            0.08


        ring.scale.set(
            0.01,
            0.01,
            0.01
        )


        return ring


    }


    /* =========================================================
       UPDATE SOURCE POSITIONS
       ========================================================= */

    updateSourcePositions() {


        if (
            !this.sourceA
            ||
            !this.sourceB
        ) {

            return

        }


        const halfDistance =
            this.sourceDistance *
            0.5


        this.sourceA.position.set(
            -halfDistance,
            0.28,
            0
        )


        this.sourceB.position.set(
            halfDistance,
            0.28,
            0
        )


        if (
            this.coreA
        ) {

            this.coreA.position.copy(
                this.sourceA.position
            )

        }


        if (
            this.coreB
        ) {

            this.coreB.position.copy(
                this.sourceB.position
            )

        }


    }


    /* =========================================================
       UPDATE SURFACE
       ========================================================= */

    updateSurface() {


        if (
            !this.positionAttribute
        ) {

            return

        }


        const sourceAX =
            -this.sourceDistance * 0.5


        const sourceBX =
            this.sourceDistance * 0.5


        const wavelength =
            Math.max(
                0.2,
                this.wavelength
            )


        const frequency =
            Math.max(
                0.05,
                this.frequency
            )


        const waveNumber =
            (
                Math.PI * 2
            )
            /
            wavelength


        const angularFrequency =
            Math.PI *
            2 *
            frequency


        const damping =
            0.16


        const amplitude =
            this.amplitude *
            this.surfaceHeight


        for (
            let i = 0;
            i < this.positionAttribute.count;
            i++
        ) {


            const x =
                this.positionAttribute.getX(
                    i
                )


            const z =
                this.positionAttribute.getZ(
                    i
                )


            /* ================================================
               DISTANCE FROM SOURCE A
               ================================================ */

            const dxA =
                x -
                sourceAX


            const distanceA =
                Math.sqrt(
                    dxA * dxA +
                    z * z
                )


            /* ================================================
               DISTANCE FROM SOURCE B
               ================================================ */

            const dxB =
                x -
                sourceBX


            const distanceB =
                Math.sqrt(
                    dxB * dxB +
                    z * z
                )


            /* ================================================
               WAVE A
               ================================================ */

            const waveA =
                Math.sin(
                    (
                        waveNumber *
                        distanceA
                    )
                    -
                    (
                        angularFrequency *
                        this.time
                    )
                )
                *
                Math.exp(
                    -distanceA *
                    damping
                )


            /* ================================================
               WAVE B
               ================================================ */

            const waveB =
                Math.sin(
                    (
                        waveNumber *
                        distanceB
                    )
                    -
                    (
                        angularFrequency *
                        this.time
                    )
                )
                *
                Math.exp(
                    -distanceB *
                    damping
                )


            /* ================================================
               INTERFERENCE
               ================================================ */

            const interference =
                (
                    waveA +
                    waveB
                )
                *
                amplitude


            this.positionAttribute.setY(
                i,
                interference
            )


        }


        this.positionAttribute.needsUpdate =
            true


        this.surfaceGeometry.computeVertexNormals()


    }


    /* =========================================================
       UPDATE RINGS
       ========================================================= */

    updateRings() {


        const spacing =
            Math.max(
                0.8,
                this.wavelength
            )


        const speed =
            this.waveSpeed *
            this.frequency


        this.updateRingSet(
            this.ringsA,
            this.sourceA,
            spacing,
            speed
        )


        this.updateRingSet(
            this.ringsB,
            this.sourceB,
            spacing,
            speed
        )


    }


    /* =========================================================
       UPDATE RING SET
       ========================================================= */

    updateRingSet(
        rings,
        source,
        spacing,
        speed
    ) {


        if (
            !source
        ) {

            return

        }


        const maxRadius =
            8.5


        for (
            let i = 0;
            i < rings.length;
            i++
        ) {


            const ring =
                rings[i]


            const offset =
                i *
                spacing


            const radius =
                (
                    (
                        this.time *
                        speed
                    )
                    +
                    offset
                )
                %
                maxRadius


            const safeRadius =
                Math.max(
                    0.05,
                    radius
                )


            ring.position.x =
                source.position.x


            ring.position.z =
                source.position.z


            ring.position.y =
                0.09


            ring.scale.set(
                safeRadius,
                safeRadius,
                safeRadius
            )


            const opacity =
                0.5 *
                (
                    1 -
                    (
                        safeRadius /
                        maxRadius
                    )
                )


            ring.material.opacity =
                Math.max(
                    0,
                    opacity
                )


        }


    }


    /* =========================================================
       UPDATE SOURCE PULSE
       ========================================================= */

    updateSourcePulse() {


        if (
            !this.sourceA
            ||
            !this.sourceB
        ) {

            return

        }


        const pulse =
            1 +
            (
                Math.sin(
                    this.time *
                    Math.PI *
                    2 *
                    this.frequency
                )
                *
                0.22
            )


        this.sourceA.scale.setScalar(
            pulse
        )


        this.sourceB.scale.setScalar(
            pulse
        )


        const corePulse =
            1 +
            (
                Math.sin(
                    this.time *
                    Math.PI *
                    4 *
                    this.frequency
                )
                *
                0.3
            )


        if (
            this.coreA
        ) {

            this.coreA.scale.setScalar(
                corePulse
            )

        }


        if (
            this.coreB
        ) {

            this.coreB.scale.setScalar(
                corePulse
            )

        }


    }


    /* =========================================================
       ADD TO SCENE
       ========================================================= */

    addToScene(scene = null) {


        /*
         * This experiment has its own scene.
         *
         * The argument is accepted only to maintain
         * compatibility with WavesWorldUI.
         */

        if (
            scene
        ) {

            this.scene =
                scene

        }


    }


    /* =========================================================
       REMOVE FROM SCENE
       ========================================================= */

    removeFromScene() {


        if (
            this.group
            &&
            this.group.parent
        ) {

            this.group.parent.remove(
                this.group
            )

        }


    }


    /* =========================================================
       SET VISIBLE
       ========================================================= */

    setVisible(visible) {


        if (
            !this.group
        ) {

            return

        }


        this.group.visible =
            Boolean(
                visible
            )


    }


    /* =========================================================
       START
       ========================================================= */

    start() {


        this.active =
            true


        this.paused =
            false


        if (
            this.group
        ) {

            this.group.visible =
                true

        }


        if (
            this.clock
        ) {

            this.clock.start()

        }


        this.resize()


        this.updateSurface()

        this.updateRings()

        this.render()


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
       PAUSE
       ========================================================= */

    pause() {


        this.paused =
            true


    }


    /* =========================================================
       RESUME
       ========================================================= */

    resume() {


        this.paused =
            false


    }


    /* =========================================================
       TOGGLE PAUSE
       ========================================================= */

    togglePause() {


        this.paused =
            !this.paused


        return this.paused


    }


    /* =========================================================
       SET AMPLITUDE
       ========================================================= */

    setAmplitude(value) {


        const number =
            Number(
                value
            )


        if (
            !Number.isFinite(
                number
            )
        ) {

            return

        }


        this.amplitude =
            Math.max(
                0,
                Math.min(
                    1.5,
                    number
                )
            )


    }


    /* =========================================================
       SET WAVELENGTH
       ========================================================= */

    setWavelength(value) {


        const number =
            Number(
                value
            )


        if (
            !Number.isFinite(
                number
            )
        ) {

            return

        }


        this.wavelength =
            Math.max(
                0.5,
                Math.min(
                    5,
                    number
                )
            )


    }


    /* =========================================================
       SET SOURCE DISTANCE
       ========================================================= */

    setSourceDistance(value) {


        const number =
            Number(
                value
            )


        if (
            !Number.isFinite(
                number
            )
        ) {

            return

        }


        this.sourceDistance =
            Math.max(
                1,
                Math.min(
                    8,
                    number
                )
            )


        this.updateSourcePositions()


    }


    /* =========================================================
       SET FREQUENCY
       ========================================================= */

    setFrequency(value) {


        const number =
            Number(
                value
            )


        if (
            !Number.isFinite(
                number
            )
        ) {

            return

        }


        this.frequency =
            Math.max(
                0.1,
                Math.min(
                    3,
                    number
                )
            )


    }


    /* =========================================================
       GET WAVE DATA
       ========================================================= */

    getWaveData() {


        return {

            amplitude:
                this.amplitude,

            wavelength:
                this.wavelength,

            frequency:
                this.frequency,

            sourceDistance:
                this.sourceDistance,

            time:
                this.time,

            active:
                this.active,

            paused:
                this.paused

        }


    }


    /* =========================================================
       RESET
       ========================================================= */

    reset() {


        this.time =
            0


        this.active =
            true


        this.paused =
            false


        this.amplitude =
            this.defaultAmplitude


        this.wavelength =
            this.defaultWavelength


        this.sourceDistance =
            this.defaultSourceDistance


        this.frequency =
            this.defaultFrequency


        this.updateSourcePositions()

        this.updateSurface()

        this.updateRings()

        this.updateSourcePulse()

        this.render()


    }


    /* =========================================================
       UPDATE
       ========================================================= */

    update(delta = 0.016) {


        if (
            !this.active
        ) {

            return

        }


        if (
            this.paused
        ) {

            this.render()

            return

        }


        const safeDelta =
            Math.min(
                Math.max(
                    0,
                    Number(delta) || 0.016
                ),
                0.05
            )


        this.time +=
            safeDelta


        this.updateSurface()

        this.updateRings()

        this.updateSourcePulse()

        this.render()


    }


    /* =========================================================
       RENDER
       ========================================================= */

    render() {


        if (
            !this.renderer
            ||
            !this.experimentScene
            ||
            !this.camera
        ) {

            return

        }


        this.renderer.render(
            this.experimentScene,
            this.camera
        )


    }


    /* =========================================================
       CREATE RESIZE OBSERVER
       ========================================================= */

    createResizeObserver() {


        if (
            !this.container
        ) {

            return

        }


        if (
            typeof ResizeObserver ===
            'undefined'
        ) {

            window.addEventListener(
                'resize',
                () => {

                    this.resize()

                }
            )


            return

        }


        this.resizeObserver =
            new ResizeObserver(
                () => {

                    this.resize()

                }
            )


        this.resizeObserver.observe(
            this.container
        )


    }


    /* =========================================================
       RESIZE
       ========================================================= */

    resize() {


        if (
            !this.container
            ||
            !this.renderer
            ||
            !this.camera
        ) {

            return

        }


        const width =
            this.container.clientWidth


        const height =
            this.container.clientHeight


        if (
            width <= 0
            ||
            height <= 0
        ) {

            return

        }


        this.widthPixels =
            width


        this.heightPixels =
            height


        this.camera.aspect =
            width /
            height


        this.camera.updateProjectionMatrix()


        this.renderer.setSize(
            width,
            height,
            false
        )


        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        )


        this.render()


    }


    /* =========================================================
       DESTROY
       ========================================================= */

    destroy() {


        this.active =
            false


        this.paused =
            false


        /* =====================================================
           RESIZE OBSERVER
           ===================================================== */

        if (
            this.resizeObserver
        ) {

            this.resizeObserver.disconnect()


            this.resizeObserver =
                null

        }


        /* =====================================================
           DISPOSE GROUP
           ===================================================== */

        if (
            this.group
        ) {

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


        }


        /* =====================================================
           REMOVE CANVAS
           ===================================================== */

        if (
            this.renderer
        ) {


            this.renderer.dispose()


            if (
                this.renderer.domElement
                &&
                this.renderer.domElement.parentNode
            ) {

                this.renderer.domElement.parentNode.removeChild(
                    this.renderer.domElement
                )

            }


        }


        /* =====================================================
           CLEAR SCENE
           ===================================================== */

        if (
            this.experimentScene
        ) {

            this.experimentScene.clear()

        }


        /* =====================================================
           NULL REFERENCES
           ===================================================== */

        this.group =
            null


        this.surface =
            null


        this.surfaceGeometry =
            null


        this.surfaceMaterial =
            null


        this.positionAttribute =
            null


        this.gridHelper =
            null


        this.sourceA =
            null


        this.sourceB =
            null


        this.coreA =
            null


        this.coreB =
            null


        this.ringsA =
            []


        this.ringsB =
            []


        this.ambientLight =
            null


        this.pointLightA =
            null


        this.pointLightB =
            null


        this.camera =
            null


        this.renderer =
            null


        this.clock =
            null


        this.experimentScene =
            null


        this.scene =
            null


        this.parent =
            null


        this.container =
            null


    }


}