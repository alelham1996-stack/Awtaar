import * as THREE from 'three'


/* =========================================================
   AWTAAR — WAVE INTERFERENCE EXPERIMENT
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
           SURFACE SETTINGS
           ===================================================== */

        this.width =
            16


        this.depth =
            10


        this.segmentsX =
            140


        this.segmentsZ =
            90


        this.surfaceHeight =
            0.72


        this.waveSpeed =
            2.6


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


        this.positionAttribute =
            null


        this.colorAttribute =
            null


        this.gridHelper =
            null


        this.frame =
            null


        this.sourceA =
            null


        this.sourceB =
            null


        this.coreA =
            null


        this.coreB =
            null


        this.glowA =
            null


        this.glowB =
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


        this.topLight =
            null


        /* =====================================================
           RESIZE
           ===================================================== */

        this.resizeObserver =
            null


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
       SCENE
       ========================================================= */

    createScene() {


        this.experimentScene =
            new THREE.Scene()


        this.experimentScene.background =
            new THREE.Color(
                0x03050a
            )


        this.experimentScene.fog =
            new THREE.Fog(
                0x03050a,
                12,
                30
            )


    }


    /* =========================================================
       CAMERA
       ========================================================= */

    createCamera() {


        this.camera =
            new THREE.PerspectiveCamera(
                40,
                1,
                0.1,
                100
            )


        this.camera.position.set(
            0,
            10.5,
            11.5
        )


        this.camera.lookAt(
            0,
            0,
            0
        )


    }


    /* =========================================================
       RENDERER
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


        this.renderer.outputColorSpace =
            THREE.SRGBColorSpace


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
       LIGHTS
       ========================================================= */

    createLights() {


        this.ambientLight =
            new THREE.AmbientLight(
                0x7aa6c9,
                1.1
            )


        this.experimentScene.add(
            this.ambientLight
        )


        this.pointLightA =
            new THREE.PointLight(
                0x28a8ff,
                5,
                12
            )


        this.pointLightA.position.set(
            -2,
            2.5,
            1
        )


        this.experimentScene.add(
            this.pointLightA
        )


        this.pointLightB =
            new THREE.PointLight(
                0xffc66d,
                5,
                12
            )


        this.pointLightB.position.set(
            2,
            2.5,
            1
        )


        this.experimentScene.add(
            this.pointLightB
        )


        this.topLight =
            new THREE.DirectionalLight(
                0xe7f3ff,
                1.2
            )


        this.topLight.position.set(
            0,
            10,
            4
        )


        this.experimentScene.add(
            this.topLight
        )


    }


    /* =========================================================
       EXPERIMENT
       ========================================================= */

    createExperiment() {


        this.group =
            new THREE.Group()


        this.group.name =
            'AwtaarWaveInterference'


        this.experimentScene.add(
            this.group
        )


        this.createSurface()

        this.createGrid()

        this.createFrame()

        this.createSources()

        this.createWaveRings()

        this.updateSourcePositions()

        this.updateSurface()

        this.updateRings()


    }


    /* =========================================================
       SURFACE
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


        /* =====================================================
           VERTEX COLORS
           ===================================================== */

        const colors =
            new Float32Array(
                this.positionAttribute.count * 3
            )


        this.colorAttribute =
            new THREE.BufferAttribute(
                colors,
                3
            )


        this.surfaceGeometry.setAttribute(
            'color',
            this.colorAttribute
        )


        this.surfaceMaterial =
            new THREE.MeshStandardMaterial({

                vertexColors:
                    true,

                transparent:
                    true,

                opacity:
                    0.96,

                roughness:
                    0.32,

                metalness:
                    0.18,

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
       GRID
       ========================================================= */

    createGrid() {


        this.gridHelper =
            new THREE.GridHelper(
                this.width,
                24,
                0x2d6d96,
                0x16324b
            )


        this.gridHelper.position.y =
            -0.08


        this.gridHelper.material.transparent =
            true


        this.gridHelper.material.opacity =
            0.22


        this.group.add(
            this.gridHelper
        )


    }


    /* =========================================================
       FRAME
       ========================================================= */

    createFrame() {


        const shape =
            new THREE.Shape()


        const halfWidth =
            this.width * 0.5


        const halfDepth =
            this.depth * 0.5


        shape.moveTo(
            -halfWidth,
            -halfDepth
        )


        shape.lineTo(
            halfWidth,
            -halfDepth
        )


        shape.lineTo(
            halfWidth,
            halfDepth
        )


        shape.lineTo(
            -halfWidth,
            halfDepth
        )


        shape.lineTo(
            -halfWidth,
            -halfDepth
        )


        const points =
            shape.getPoints()


        const geometry =
            new THREE.BufferGeometry()
                .setFromPoints(
                    points
                )


        geometry.rotateX(
            -Math.PI / 2
        )


        const material =
            new THREE.LineBasicMaterial({

                color:
                    0xd8bc7a,

                transparent:
                    true,

                opacity:
                    0.65

            })


        this.frame =
            new THREE.LineLoop(
                geometry,
                material
            )


        this.frame.position.y =
            0.02


        this.group.add(
            this.frame
        )


    }


    /* =========================================================
       SOURCES
       ========================================================= */

    createSources() {


        const sourceGeometry =
            new THREE.SphereGeometry(
                0.34,
                32,
                32
            )


        const materialA =
            new THREE.MeshStandardMaterial({

                color:
                    0x55caff,

                emissive:
                    0x1477d1,

                emissiveIntensity:
                    3,

                roughness:
                    0.18,

                metalness:
                    0.35

            })


        const materialB =
            new THREE.MeshStandardMaterial({

                color:
                    0xffcf73,

                emissive:
                    0xff9700,

                emissiveIntensity:
                    3,

                roughness:
                    0.18,

                metalness:
                    0.35

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


        this.group.add(
            this.sourceA
        )


        this.group.add(
            this.sourceB
        )


        /* =====================================================
           CORES
           ===================================================== */

        const coreGeometry =
            new THREE.SphereGeometry(
                0.14,
                24,
                24
            )


        const coreMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0xffffff

            })


        this.coreA =
            new THREE.Mesh(
                coreGeometry,
                coreMaterial
            )


        this.coreB =
            new THREE.Mesh(
                coreGeometry,
                coreMaterial.clone()
            )


        this.group.add(
            this.coreA
        )


        this.group.add(
            this.coreB
        )


        /* =====================================================
           GLOW
           ===================================================== */

        const glowGeometry =
            new THREE.SphereGeometry(
                0.58,
                32,
                32
            )


        const glowMaterialA =
            new THREE.MeshBasicMaterial({

                color:
                    0x198fff,

                transparent:
                    true,

                opacity:
                    0.13

            })


        const glowMaterialB =
            new THREE.MeshBasicMaterial({

                color:
                    0xffb52d,

                transparent:
                    true,

                opacity:
                    0.13

            })


        this.glowA =
            new THREE.Mesh(
                glowGeometry,
                glowMaterialA
            )


        this.glowB =
            new THREE.Mesh(
                glowGeometry,
                glowMaterialB
            )


        this.group.add(
            this.glowA
        )


        this.group.add(
            this.glowB
        )


    }


    /* =========================================================
       WAVE RINGS
       ========================================================= */

    createWaveRings() {


        const ringCount =
            9


        for (
            let i = 0;
            i < ringCount;
            i++
        ) {


            const ringA =
                this.createRing(
                    0x36b9ff
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
                100
            )


        const geometry =
            new THREE.BufferGeometry()
                .setFromPoints(
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
                    0.5

            })


        const ring =
            new THREE.LineLoop(
                geometry,
                material
            )


        ring.position.y =
            0.11


        ring.scale.set(
            0.01,
            0.01,
            0.01
        )


        return ring


    }


    /* =========================================================
       SOURCE POSITIONS
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
            this.sourceDistance * 0.5


        this.sourceA.position.set(
            -halfDistance,
            0.32,
            0
        )


        this.sourceB.position.set(
            halfDistance,
            0.32,
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


        if (
            this.glowA
        ) {

            this.glowA.position.copy(
                this.sourceA.position
            )

        }


        if (
            this.glowB
        ) {

            this.glowB.position.copy(
                this.sourceB.position
            )

        }


        if (
            this.pointLightA
        ) {

            this.pointLightA.position.x =
                this.sourceA.position.x


        }


        if (
            this.pointLightB
        ) {

            this.pointLightB.position.x =
                this.sourceB.position.x


        }


    }


    /* =========================================================
       SURFACE UPDATE
       ========================================================= */

    updateSurface() {


        if (
            !this.positionAttribute
            ||
            !this.colorAttribute
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
            (Math.PI * 2)
            /
            wavelength


        const angularFrequency =
            Math.PI *
            2 *
            frequency


        const damping =
            0.13


        const amplitude =
            this.amplitude *
            this.surfaceHeight


        const baseColor =
            new THREE.Color(
                0x0c2940
            )


        const constructiveColor =
            new THREE.Color(
                0xffbd55
            )


        const destructiveColor =
            new THREE.Color(
                0x154f79
            )


        const crestColor =
            new THREE.Color(
                0x4bc7ff
            )


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


            const dxA =
                x - sourceAX


            const distanceA =
                Math.sqrt(
                    dxA * dxA +
                    z * z
                )


            const dxB =
                x - sourceBX


            const distanceB =
                Math.sqrt(
                    dxB * dxB +
                    z * z
                )


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
                    -distanceA * damping
                )


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
                    -distanceB * damping
                )


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


            /* =================================================
               INTERFERENCE VISUALIZATION
               ================================================= */

            const difference =
                Math.abs(
                    waveA +
                    waveB
                )


            const cancellation =
                1 -
                Math.min(
                    1,
                    difference
                )


            const constructive =
                Math.min(
                    1,
                    difference
                )


            const normalizedHeight =
                Math.min(
                    1,
                    Math.abs(
                        interference
                    )
                    /
                    Math.max(
                        0.001,
                        amplitude * 2
                    )
                )


            const color =
                baseColor.clone()


            if (
                constructive > 0.72
            ) {

                color.lerp(
                    constructiveColor,
                    (constructive - 0.72) / 0.28
                )

            }

            else if (
                cancellation > 0.82
            ) {

                color.lerp(
                    destructiveColor,
                    (cancellation - 0.82) / 0.18
                )

            }

            else {

                color.lerp(
                    crestColor,
                    normalizedHeight * 0.38
                )

            }


            this.colorAttribute.setXYZ(
                i,
                color.r,
                color.g,
                color.b
            )


        }


        this.positionAttribute.needsUpdate =
            true


        this.colorAttribute.needsUpdate =
            true


        this.surfaceGeometry.computeVertexNormals()


    }


    /* =========================================================
       RINGS UPDATE
       ========================================================= */

    updateRings() {


        const spacing =
            Math.max(
                0.7,
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
                i * spacing


            const radius =
                (
                    (
                        this.time * speed
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
                0.12


            ring.scale.set(
                safeRadius,
                safeRadius,
                safeRadius
            )


            const opacity =
                0.48 *
                (
                    1 -
                    safeRadius /
                    maxRadius
                )


            ring.material.opacity =
                Math.max(
                    0,
                    opacity
                )


        }


    }


    /* =========================================================
       SOURCE PULSE
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
                0.16
            )


        this.sourceA.scale.setScalar(
            pulse
        )


        this.sourceB.scale.setScalar(
            pulse
        )


        if (
            this.glowA
        ) {

            this.glowA.scale.setScalar(
                1 +
                (
                    pulse - 1
                ) *
                1.8
            )

        }


        if (
            this.glowB
        ) {

            this.glowB.scale.setScalar(
                1 +
                (
                    pulse - 1
                ) *
                1.8
            )

        }


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
                0.28
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
       COMPATIBILITY
       ========================================================= */

    addToScene(scene = null) {


        if (
            scene
        ) {

            this.scene =
                scene

        }


    }


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


    setVisible(visible) {


        if (
            this.group
        ) {

            this.group.visible =
                Boolean(
                    visible
                )

        }


    }


    /* =========================================================
       START / STOP
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


    stop() {


        this.active =
            false


        this.paused =
            false


    }


    pause() {


        this.paused =
            true


    }


    resume() {


        this.paused =
            false


    }


    togglePause() {


        this.paused =
            !this.paused


        return this.paused


    }


    /* =========================================================
       PARAMETERS
       ========================================================= */

    setAmplitude(value) {


        const number =
            Number(value)


        if (
            !Number.isFinite(number)
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


    setWavelength(value) {


        const number =
            Number(value)


        if (
            !Number.isFinite(number)
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


    setSourceDistance(value) {


        const number =
            Number(value)


        if (
            !Number.isFinite(number)
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


    setFrequency(value) {


        const number =
            Number(value)


        if (
            !Number.isFinite(number)
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
       DATA
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
       RESIZE
       ========================================================= */

    createResizeObserver() {


        if (
            !this.container
        ) {

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


        this.camera.aspect =
            width / height


        this.camera.updateProjectionMatrix()


        this.renderer.setSize(
            width,
            height,
            false
        )


        this.render()


    }


    /* =========================================================
       DESTROY
       ========================================================= */

    destroy() {


        this.active =
            false


        if (
            this.resizeObserver
        ) {

            this.resizeObserver.disconnect()

            this.resizeObserver =
                null

        }


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
                                material => material.dispose()
                            )

                        }

                        else {

                            object.material.dispose()

                        }

                    }


                }
            )

        }


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


        if (
            this.experimentScene
        ) {

            this.experimentScene.clear()

        }


        this.group =
            null


        this.surface =
            null


        this.sourceA =
            null


        this.sourceB =
            null


        this.renderer =
            null


        this.camera =
            null


        this.experimentScene =
            null


        this.container =
            null


    }


}