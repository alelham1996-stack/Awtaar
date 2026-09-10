/* =========================================================
   AWTAAR — BIOLOGY GALAXY
   CELL WORLD
   CELL GATEWAY EXPERIMENT
   =========================================================

   بوابة الخلية

   الفكرة:
   كيف تسمح الخلية لبعض المواد بالعبور عبر غشائها
   بينما تمنع مواد أخرى؟

   النموذج التعليمي:
   - غشاء خلوي ثلاثي الأبعاد
   - قناة بروتينية انتقائية
   - جسيمات خارج الخلية
   - أيونات متوافقة مع القناة
   - جزيئات غير متوافقة مع القناة
   - انتظار الجسيمات عند البوابة المغلقة
   - عبور الأيونات عند فتح القناة
   - منع الجزيئات غير المتوافقة
   - فتح وإغلاق البوابة
   - اختيار البوابة
   - تفاعل مباشر بالماوس
   - لوحة معلومات جانبية
   - عداد المواد التي عبرت
   - إعادة التجربة
   - OrbitControls
   - Zoom
   - Responsive
   - Cleanup كامل

   Architecture:

   CellWorldUI
        ↓
   CellGateExperiment

   ========================================================= */

import * as THREE from 'three'

import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js'

import {
    t,
    getLanguage
} from '../locales/i18n.js'


export default class CellGateExperiment {


    /* =====================================================
       CONSTRUCTOR
       ===================================================== */

    constructor(
        scene = null,
        parent = null
    ) {

        this.scene =
            scene

        this.parent =
            parent


        /* -------------------------------------------------
           STATE
           ------------------------------------------------- */

        this.active =
            false

        this.destroyed =
            false

        this.paused =
            false

        this.elapsed =
            0

        this.introTime =
            0

        this.introDuration =
            2.6


        /* -------------------------------------------------
           GATE STATE
           ------------------------------------------------- */

        this.gateOpen =
            false

        this.gateProgress =
            0

        this.gateTarget =
            0

        this.gateOpeningSpeed =
            2.8


        /* -------------------------------------------------
           PARTICLE STATE
           ------------------------------------------------- */

        this.particles =
            []

        this.particleCount =
            18

        this.particlesPassed =
            0


        /*
         * The channel is selective.
         *
         * ion      → compatible → can pass
         * molecule → incompatible → blocked
         */

        this.allowedParticleType =
            'ion'


        /*
         * Spatial thresholds.
         */

        this.membraneZ =
            6.2

        this.gateZ =
            5.75

        this.gateApproachZ =
            6.65

        this.gateExitZ =
            5.15

        this.insideZ =
            3.8


        /* -------------------------------------------------
           INTERACTION
           ------------------------------------------------- */

        this.pointer =
            new THREE.Vector2()

        this.raycaster =
            new THREE.Raycaster()

        this.pointerDown =
            false

        this.pointerDownX =
            0

        this.pointerDownY =
            0

        this.pointerMoved =
            false

        this.hoveredObject =
            null

        this.selectedObject =
            null


        /* -------------------------------------------------
           THREE
           ------------------------------------------------- */

        this.renderScene =
            new THREE.Scene()

        this.renderScene.background =
            new THREE.Color(
                0x02090a
            )

        this.renderScene.fog =
            new THREE.FogExp2(
                0x02090a,
                0.025
            )


        this.camera =
            null

        this.renderer =
            null

        this.controls =
            null


        /* -------------------------------------------------
           GROUPS
           ------------------------------------------------- */

        this.worldGroup =
            new THREE.Group()

        this.cellGroup =
            new THREE.Group()

        this.gateGroup =
            new THREE.Group()

        this.particleGroup =
            new THREE.Group()

        this.environmentGroup =
            new THREE.Group()


        this.renderScene.add(
            this.worldGroup
        )

        this.worldGroup.add(
            this.cellGroup
        )

        this.worldGroup.add(
            this.gateGroup
        )

        this.worldGroup.add(
            this.particleGroup
        )

        this.renderScene.add(
            this.environmentGroup
        )


        /* -------------------------------------------------
           REFERENCES
           ------------------------------------------------- */

        this.membrane =
            null

        this.membraneGlow =
            null

        this.gateFrame =
            null

        this.gateChannel =
            null

        this.gateLeft =
            null

        this.gateRight =
            null

        this.gateCore =
            null

        this.gateGlow =
            null

        this.gateParticles =
            []

        this.membraneParticles =
            []


        this.gateBaseScales =
            new Map()


        /* -------------------------------------------------
           UI
           ------------------------------------------------- */

        this.uiRoot =
            null

        this.selectedPanel =
            null

        this.selectedTitle =
            null

        this.selectedDescription =
            null

        this.gateStatus =
            null

        this.progressBar =
            null

        this.progressValue =
            null

        this.toggleButton =
            null

        this.toggleButtonText =
            null

        this.resetButton =
            null

        this.closeButton =
            null

        this.introElement =
            null

        this.passedValue =
            null

        this.selectionType =
            null


        /* -------------------------------------------------
           LANGUAGE
           ------------------------------------------------- */

        this.languageChangeHandler =
            () => this.updateLanguage()


        /* -------------------------------------------------
           CREATE
           ------------------------------------------------- */

        this.createScene()

        this.createCamera()

        this.createRenderer()

        this.createLights()

        this.createEnvironment()

        this.createCellMembrane()

        this.createGateway()

        this.createParticles()

        this.createUI()

        this.createEvents()

        this.resize()


        document.addEventListener(
            'awtaar-language-change',
            this.languageChangeHandler
        )


        this.updateLanguage()
    }


    /* =====================================================
       TRANSLATION HELPER
       ===================================================== */

    translate(
        key,
        fallback
    ) {

        try {

            const value =
                t(key)

            if (
                value &&
                value !== key
            ) {
                return value
            }

        } catch (
            error
        ) {
            /* Fallback below */
        }


        return fallback
    }


    /* =====================================================
       SCENE
       ===================================================== */

    createScene() {

        this.renderScene.background =
            new THREE.Color(
                0x02090a
            )
    }


    /* =====================================================
       CAMERA
       ===================================================== */

    createCamera() {

        this.camera =
            new THREE.PerspectiveCamera(
                42,
                window.innerWidth /
                window.innerHeight,
                0.1,
                100
            )


        this.camera.position.set(
            0,
            0.7,
            14
        )


        this.camera.lookAt(
            0,
            0,
            0
        )
    }


    /* =====================================================
       RENDERER
       ===================================================== */

    createRenderer() {

        this.renderer =
            new THREE.WebGLRenderer({

                antialias: true,

                alpha: true,

                powerPreference:
                    'high-performance'
            })


        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        )


        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        )


        this.renderer.outputColorSpace =
            THREE.SRGBColorSpace


        this.renderer.toneMapping =
            THREE.ACESFilmicToneMapping


        this.renderer.toneMappingExposure =
            1.15


        this.renderer.domElement.className =
            'awtaar-cell-gate-canvas'


        this.renderer.domElement.style.position =
            'fixed'


        this.renderer.domElement.style.inset =
            '0'


        this.renderer.domElement.style.width =
            '100%'


        this.renderer.domElement.style.height =
            '100%'


        this.renderer.domElement.style.zIndex =
            '2201'


        this.renderer.domElement.style.pointerEvents =
            'auto'


        document.body.appendChild(
            this.renderer.domElement
        )


        /* -------------------------------------------------
           CONTROLS
           ------------------------------------------------- */

        this.controls =
            new OrbitControls(
                this.camera,
                this.renderer.domElement
            )


        this.controls.enableDamping =
            true

        this.controls.dampingFactor =
            0.055

        this.controls.enablePan =
            false

        this.controls.minDistance =
            7

        this.controls.maxDistance =
            22

        this.controls.minPolarAngle =
            0.5

        this.controls.maxPolarAngle =
            Math.PI - 0.5


        this.controls.target.set(
            0,
            0,
            0
        )


        this.controls.update()
    }


    /* =====================================================
       LIGHTS
       ===================================================== */

    createLights() {

        const ambient =
            new THREE.AmbientLight(
                0x9fffe1,
                1.35
            )

        this.renderScene.add(
            ambient
        )


        const key =
            new THREE.PointLight(
                0x74ffd0,
                70,
                35,
                2
            )

        key.position.set(
            4,
            6,
            8
        )

        this.renderScene.add(
            key
        )


        const blue =
            new THREE.PointLight(
                0x5c9dff,
                65,
                25,
                2
            )

        blue.position.set(
            -4,
            1,
            6
        )

        this.renderScene.add(
            blue
        )


        const rim =
            new THREE.PointLight(
                0x21d99c,
                45,
                28,
                2
            )

        rim.position.set(
            2,
            -5,
            5
        )

        this.renderScene.add(
            rim
        )
    }


    /* =====================================================
       ENVIRONMENT
       ===================================================== */

    createEnvironment() {

        const count =
            700


        const positions =
            new Float32Array(
                count * 3
            )


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const radius =
                9 +
                Math.random() * 15


            const theta =
                Math.random() *
                Math.PI *
                2


            const phi =
                Math.acos(
                    2 *
                    Math.random() -
                    1
                )


            positions[
                i * 3
            ] =
                radius *
                Math.sin(phi) *
                Math.cos(theta)


            positions[
                i * 3 + 1
            ] =
                radius *
                Math.cos(phi)


            positions[
                i * 3 + 2
            ] =
                radius *
                Math.sin(phi) *
                Math.sin(theta)
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
            new THREE.PointsMaterial({

                color: 0x55dcb0,

                size: 0.045,

                transparent: true,

                opacity: 0.3,

                depthWrite: false,

                blending:
                    THREE.AdditiveBlending
            })


        const particles =
            new THREE.Points(
                geometry,
                material
            )


        this.environmentGroup.add(
            particles
        )


        this.environmentParticles =
            particles
    }


    /* =====================================================
       CELL MEMBRANE
       ===================================================== */

    createCellMembrane() {

        const geometry =
            new THREE.SphereGeometry(
                6.2,
                96,
                64
            )


        const material =
            new THREE.MeshPhysicalMaterial({

                color: 0x174e43,

                transparent: true,

                opacity: 0.17,

                roughness: 0.22,

                metalness: 0.02,

                transmission: 0.18,

                thickness: 0.7,

                side: THREE.DoubleSide
            })


        this.membrane =
            new THREE.Mesh(
                geometry,
                material
            )


        this.membrane.name =
            'cell-gate-membrane'


        this.cellGroup.add(
            this.membrane
        )


        /* -------------------------------------------------
           OUTER GLOW
           ------------------------------------------------- */

        const glowGeometry =
            new THREE.SphereGeometry(
                6.28,
                72,
                48
            )


        const glowMaterial =
            new THREE.MeshBasicMaterial({

                color: 0x42e5b0,

                transparent: true,

                opacity: 0.08,

                side: THREE.BackSide,

                depthWrite: false,

                blending:
                    THREE.AdditiveBlending
            })


        this.membraneGlow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            )


        this.cellGroup.add(
            this.membraneGlow
        )


        /* -------------------------------------------------
           OUTLINE
           ------------------------------------------------- */

        const outlineGeometry =
            new THREE.SphereGeometry(
                6.25,
                72,
                48
            )


        const outlineMaterial =
            new THREE.MeshBasicMaterial({

                color: 0x6affd1,

                wireframe: true,

                transparent: true,

                opacity: 0.1
            })


        const outline =
            new THREE.Mesh(
                outlineGeometry,
                outlineMaterial
            )


        this.cellGroup.add(
            outline
        )
    }


    /* =====================================================
       GATEWAY
       ===================================================== */

    createGateway() {

        this.gateGroup.position.set(
            0,
            0,
            5.75
        )


        this.gateGroup.rotation.x =
            -0.05


        /* -------------------------------------------------
           FRAME
           ------------------------------------------------- */

        const frameGeometry =
            new THREE.TorusGeometry(
                1.45,
                0.22,
                24,
                64
            )


        const frameMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x3ac69a,

                emissive: 0x0b6d4d,

                emissiveIntensity: 0.75,

                roughness: 0.3,

                metalness: 0.15
            })


        this.gateFrame =
            new THREE.Mesh(
                frameGeometry,
                frameMaterial
            )


        this.gateFrame.name =
            'cell-gateway-frame'


        this.gateFrame.userData.interactive =
            true


        this.gateGroup.add(
            this.gateFrame
        )


        /* -------------------------------------------------
           CHANNEL
           ------------------------------------------------- */

        const channelGeometry =
            new THREE.CylinderGeometry(
                1.0,
                1.0,
                0.65,
                48
            )


        const channelMaterial =
            new THREE.MeshPhysicalMaterial({

                color: 0x0a3b34,

                transparent: true,

                opacity: 0.92,

                roughness: 0.18,

                metalness: 0.05,

                transmission: 0.05
            })


        this.gateChannel =
            new THREE.Mesh(
                channelGeometry,
                channelMaterial
            )


        this.gateChannel.rotation.x =
            Math.PI / 2


        this.gateChannel.name =
            'cell-gateway-channel'


        this.gateChannel.userData.interactive =
            true


        this.gateGroup.add(
            this.gateChannel
        )


        /* -------------------------------------------------
           GATE LEAVES
           ------------------------------------------------- */

        const leafGeometry =
            new THREE.SphereGeometry(
                0.78,
                40,
                28
            )


        const leafMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x43d3a4,

                emissive: 0x0d6b4c,

                emissiveIntensity: 0.9,

                roughness: 0.28
            })


        this.gateLeft =
            new THREE.Mesh(
                leafGeometry,
                leafMaterial
            )


        this.gateRight =
            new THREE.Mesh(
                leafGeometry.clone(),
                leafMaterial.clone()
            )


        this.gateLeft.scale.set(
            0.85,
            1.5,
            0.45
        )


        this.gateRight.scale.set(
            0.85,
            1.5,
            0.45
        )


        this.gateLeft.position.set(
            -0.55,
            0,
            0.25
        )


        this.gateRight.position.set(
            0.55,
            0,
            0.25
        )


        this.gateLeft.name =
            'cell-gateway-left'


        this.gateRight.name =
            'cell-gateway-right'


        this.gateLeft.userData.interactive =
            true

        this.gateRight.userData.interactive =
            true


        this.gateGroup.add(
            this.gateLeft
        )

        this.gateGroup.add(
            this.gateRight
        )


        /* -------------------------------------------------
           CENTRAL CORE
           ------------------------------------------------- */

        const coreGeometry =
            new THREE.SphereGeometry(
                0.34,
                32,
                24
            )


        const coreMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x8fffe0,

                emissive: 0x26c996,

                emissiveIntensity: 1.2,

                roughness: 0.18
            })


        this.gateCore =
            new THREE.Mesh(
                coreGeometry,
                coreMaterial
            )


        this.gateCore.name =
            'cell-gateway-core'


        this.gateCore.userData.interactive =
            true


        this.gateGroup.add(
            this.gateCore
        )


        /* -------------------------------------------------
           GLOW
           ------------------------------------------------- */

        const glowGeometry =
            new THREE.TorusGeometry(
                1.58,
                0.055,
                12,
                64
            )


        const glowMaterial =
            new THREE.MeshBasicMaterial({

                color: 0x63ffd0,

                transparent: true,

                opacity: 0.7,

                blending:
                    THREE.AdditiveBlending
            })


        this.gateGlow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            )


        this.gateGlow.name =
            'cell-gateway-glow'


        this.gateGroup.add(
            this.gateGlow
        )


        /* -------------------------------------------------
           GATE PARTICLES
           ------------------------------------------------- */

        for (
            let i = 0;
            i < 24;
            i++
        ) {

            const geometry =
                new THREE.SphereGeometry(
                    0.035,
                    10,
                    8
                )


            const material =
                new THREE.MeshBasicMaterial({

                    color: 0x8fffe0,

                    transparent: true,

                    opacity: 0.75,

                    blending:
                        THREE.AdditiveBlending
                })


            const particle =
                new THREE.Mesh(
                    geometry,
                    material
                )


            const angle =
                (
                    i /
                    24
                ) *
                Math.PI *
                2


            particle.position.set(
                Math.cos(angle) *
                1.7,

                Math.sin(angle) *
                1.7,

                0
            )


            particle.userData.angle =
                angle


            particle.userData.radius =
                1.7 +
                Math.random() *
                0.15


            this.gateGroup.add(
                particle
            )


            this.gateParticles.push(
                particle
            )
        }


        /* -------------------------------------------------
           STORE BASE SCALES
           ------------------------------------------------- */

        this.gateBaseScales.set(
            this.gateFrame,
            this.gateFrame.scale.clone()
        )

        this.gateBaseScales.set(
            this.gateLeft,
            this.gateLeft.scale.clone()
        )

        this.gateBaseScales.set(
            this.gateRight,
            this.gateRight.scale.clone()
        )

        this.gateBaseScales.set(
            this.gateCore,
            this.gateCore.scale.clone()
        )
    }


    /* =====================================================
       PARTICLES
       ===================================================== */

    createParticles() {

        for (
            let i = 0;
            i < this.particleCount;
            i++
        ) {

            this.createParticle(
                i
            )
        }
    }


    createParticle(
        index
    ) {

        const geometry =
            new THREE.SphereGeometry(
                0.16,
                18,
                14
            )


        const type =
            index % 2 === 0
                ? 'ion'
                : 'molecule'


        const material =
            new THREE.MeshStandardMaterial({

                color:
                    type === 'ion'
                        ? 0x77baff
                        : 0xffd27d,

                emissive:
                    type === 'ion'
                        ? 0x123e82
                        : 0x704914,

                emissiveIntensity:
                    0.85,

                roughness: 0.22
            })


        const particle =
            new THREE.Mesh(
                geometry,
                material
            )


        particle.name =
            `cell-gate-particle-${index}`


        particle.userData.type =
            type


        particle.userData.index =
            index


        particle.userData.progress =
            Math.random() *
            0.38


        particle.userData.speed =
            0.075 +
            Math.random() *
            0.035


        particle.userData.offset =
            (
                Math.random() -
                0.5
            ) *
            2.2


        particle.userData.yOffset =
            (
                Math.random() -
                0.5
            ) *
            1.5


        particle.userData.zOffset =
            (
                Math.random() -
                0.5
            ) *
            0.55


        particle.userData.state =
            'approaching'


        particle.userData.crossingProgress =
            0


        particle.userData.waitTime =
            Math.random() *
            0.6


        this.particleGroup.add(
            particle
        )


        this.particles.push(
            particle
        )


        this.positionParticle(
            particle
        )
    }


    /* =====================================================
       PARTICLE POSITION
       ===================================================== */

    positionParticle(
        particle
    ) {

        const data =
            particle.userData


        const progress =
            THREE.MathUtils.clamp(
                data.progress,
                0,
                1
            )


        const startZ =
            10.2


        const targetZ =
            this.gateApproachZ


        const z =
            THREE.MathUtils.lerp(
                startZ,
                targetZ,
                progress
            ) +
            data.zOffset


        const convergence =
            THREE.MathUtils.smoothstep(
                progress,
                0,
                1
            )


        const x =
            data.offset *
            (1 - convergence) +
            Math.sin(
                this.elapsed *
                1.4 +
                data.index
            ) *
            0.12


        const y =
            data.yOffset *
            (1 - convergence) +
            Math.sin(
                this.elapsed *
                1.1 +
                data.index *
                0.7
            ) *
            0.10


        particle.position.set(
            x,
            y,
            z
        )
    }


    /* =====================================================
       POSITION PARTICLE AT GATE
       ===================================================== */

    positionParticleAtGate(
        particle
    ) {

        particle.position.x =
            THREE.MathUtils.lerp(
                particle.position.x,
                0,
                0.16
            )


        particle.position.y =
            THREE.MathUtils.lerp(
                particle.position.y,
                0,
                0.16
            )


        particle.position.z =
            THREE.MathUtils.lerp(
                particle.position.z,
                this.gateApproachZ,
                0.16
            )
    }


    /* =====================================================
       MOVE PARTICLE THROUGH CHANNEL
       ===================================================== */

    moveParticleThroughGate(
        particle,
        delta
    ) {

        const data =
            particle.userData


        data.crossingProgress +=
            delta *
            1.25


        const p =
            THREE.MathUtils.clamp(
                data.crossingProgress,
                0,
                1
            )


        const eased =
            THREE.MathUtils.smoothstep(
                p,
                0,
                1
            )


        particle.position.x =
            THREE.MathUtils.lerp(
                0,
                0,
                eased
            )


        particle.position.y =
            THREE.MathUtils.lerp(
                0,
                0,
                eased
            )


        particle.position.z =
            THREE.MathUtils.lerp(
                this.gateApproachZ,
                this.insideZ,
                eased
            )


        if (
            particle.material
        ) {

            particle.material.emissiveIntensity =
                THREE.MathUtils.lerp(
                    0.85,
                    1.35,
                    Math.sin(
                        p *
                        Math.PI
                    )
                )
        }


        if (
            p >= 1
        ) {

            data.state =
                'inside'

            data.progress =
                1

            this.particlesPassed++

            data.insideTime =
                0

            data.insideX =
                particle.position.x

            data.insideY =
                particle.position.y

            data.insideZ =
                particle.position.z
        }
    }


    /* =====================================================
       MOVE PARTICLE INSIDE
       ===================================================== */

    moveParticleInside(
        particle,
        delta
    ) {

        const data =
            particle.userData


        data.insideTime =
            (
                data.insideTime || 0
            ) +
            delta


        const index =
            data.index


        const time =
            this.elapsed


        const targetX =
            (
                data.insideX || 0
            ) +
            Math.sin(
                time *
                0.75 +
                index *
                1.37
            ) *
            0.75


        const targetY =
            (
                data.insideY || 0
            ) +
            Math.cos(
                time *
                0.62 +
                index *
                0.91
            ) *
            0.55


        const targetZ =
            (
                data.insideZ || this.insideZ
            ) +
            Math.sin(
                time *
                0.48 +
                index *
                1.13
            ) *
            0.35


        const safeX =
            THREE.MathUtils.clamp(
                targetX,
                -4.2,
                4.2
            )


        const safeY =
            THREE.MathUtils.clamp(
                targetY,
                -4.0,
                4.0
            )


        const safeZ =
            THREE.MathUtils.clamp(
                targetZ,
                -3.8,
                3.4
            )


        particle.position.x =
            THREE.MathUtils.lerp(
                particle.position.x,
                safeX,
                Math.min(
                    delta *
                    1.8,
                    1
                )
            )


        particle.position.y =
            THREE.MathUtils.lerp(
                particle.position.y,
                safeY,
                Math.min(
                    delta *
                    1.8,
                    1
                )
            )


        particle.position.z =
            THREE.MathUtils.lerp(
                particle.position.z,
                safeZ,
                Math.min(
                    delta *
                    1.4,
                    1
                )
            )


        if (
            particle.material
        ) {

            particle.material.emissiveIntensity =
                1.05 +
                Math.sin(
                    time *
                    2.2 +
                    index
                ) *
                0.18
        }
    }


    /* =====================================================
       BLOCK INCOMPATIBLE PARTICLE
       ===================================================== */

    blockParticle(
        particle
    ) {

        const data =
            particle.userData


        data.state =
            'blocked'


        this.positionParticleAtGate(
            particle
        )


        if (
            particle.material
        ) {

            const pulse =
                0.8 +
                Math.sin(
                    this.elapsed *
                    4 +
                    data.index
                ) *
                0.18


            particle.scale.setScalar(
                pulse
            )
        }
    }


    /* =====================================================
       RECYCLE PARTICLE
       ===================================================== */

    recycleParticle(
        particle
    ) {

        const data =
            particle.userData


        data.progress =
            0


        data.offset =
            (
                Math.random() -
                0.5
            ) *
            2.2


        data.yOffset =
            (
                Math.random() -
                0.5
            ) *
            1.5


        data.zOffset =
            (
                Math.random() -
                0.5
            ) *
            0.55


        data.state =
            'approaching'


        data.crossingProgress =
            0


        data.insideTime =
            0


        data.insideX =
            null

        data.insideY =
            null

        data.insideZ =
            null


        data.waitTime =
            Math.random() *
            0.5


        particle.scale.setScalar(
            1
        )


        if (
            particle.material
        ) {

            particle.material.emissiveIntensity =
                0.85
        }


        this.positionParticle(
            particle
        )
    }


    /* =====================================================
       UI
       ===================================================== */

    createUI() {

        this.uiRoot =
            document.createElement(
                'section'
            )


        this.uiRoot.className =
            'awtaar-cell-gate-ui'


        this.uiRoot.dir =
            'rtl'


        this.uiRoot.innerHTML = `

            <div class="cell-gate-topbar">

                <div class="cell-gate-title-group">

                    <div class="cell-gate-eyebrow">
                        AWTAAR • BIOLOGY • CELL WORLD
                    </div>

                    <h1 class="cell-gate-title">
                        بوابة الخلية
                    </h1>

                    <p class="cell-gate-subtitle">
                        كيف تتحكم الخلية فيما يدخل إليها وما يخرج منها؟
                    </p>

                </div>


                <button
                    class="cell-gate-close"
                    type="button"
                >

                    <span class="cell-gate-close-icon">
                        ×
                    </span>

                    <span class="cell-gate-close-text">
                        الخروج
                    </span>

                </button>

            </div>


            <div class="cell-gate-intro">

                <div class="cell-gate-intro-small">
                    غشاء الخلية ليس جدارًا مغلقًا...
                </div>

                <div class="cell-gate-intro-main">
                    إنه بوابة ذكية.
                </div>

            </div>


            <div class="cell-gate-left-panel">

                <div class="cell-gate-panel-kicker">
                    CELL GATE
                </div>

                <div class="cell-gate-panel-title">
                    بوابة بروتينية
                </div>

                <div class="cell-gate-panel-description">
                    القناة البروتينية تسمح بمرور مواد محددة، بينما تمنع مواد أخرى لا تتوافق معها.
                </div>


                <div class="cell-gate-status-row">

                    <span class="cell-gate-status-label">
                        حالة البوابة
                    </span>

                    <strong
                        class="cell-gate-status"
                    >
                        مغلقة
                    </strong>

                </div>


                <div class="cell-gate-progress">

                    <div class="cell-gate-progress-track">

                        <div
                            class="cell-gate-progress-value"
                        ></div>

                    </div>

                    <div class="cell-gate-progress-label">
                        0%
                    </div>

                </div>


                <div
                    class="cell-gate-status-row"
                    style="margin-top:4px;"
                >

                    <span class="cell-gate-passed-label">
                        مواد عبرت
                    </span>

                    <strong
                        class="cell-gate-passed"
                    >
                        0
                    </strong>

                </div>


                <button
                    class="cell-gate-toggle"
                    type="button"
                >

                    <span class="cell-gate-toggle-icon">
                        ◉
                    </span>

                    <span class="cell-gate-toggle-text">
                        فتح البوابة
                    </span>

                </button>


                <button
                    class="cell-gate-reset"
                    type="button"
                >

                    <span>
                        ↻
                    </span>

                    <span class="cell-gate-reset-text">
                        إعادة التجربة
                    </span>

                </button>

            </div>


            <div class="cell-gate-selected">

                <div class="cell-gate-selected-kicker">
                    بوابة الخلية
                </div>

                <div class="cell-gate-selected-title">
                    قناة بروتينية
                </div>

                <div class="cell-gate-selected-description">
                    القناة انتقائية؛ فتحها لا يعني أن كل المواد تستطيع المرور عبرها.
                </div>

            </div>


            <div class="cell-gate-bottom-hint">

                <span class="cell-gate-hint-rotate">
                    اسحب للدوران
                </span>

                <span>•</span>

                <span class="cell-gate-hint-zoom">
                    مرر للتكبير
                </span>

                <span>•</span>

                <span class="cell-gate-hint-click">
                    اضغط على البوابة لفتحها
                </span>

            </div>

        `


        document.body.appendChild(
            this.uiRoot
        )


        this.injectStyles()

        this.cacheUI()

        this.updateGateUI()
    }


    /* =====================================================
       CACHE UI
       ===================================================== */

    cacheUI() {

        this.closeButton =
            this.uiRoot.querySelector(
                '.cell-gate-close'
            )


        this.toggleButton =
            this.uiRoot.querySelector(
                '.cell-gate-toggle'
            )


        this.resetButton =
            this.uiRoot.querySelector(
                '.cell-gate-reset'
            )


        this.toggleButtonText =
            this.uiRoot.querySelector(
                '.cell-gate-toggle-text'
            )


        this.gateStatus =
            this.uiRoot.querySelector(
                '.cell-gate-status'
            )


        this.progressBar =
            this.uiRoot.querySelector(
                '.cell-gate-progress-value'
            )


        this.progressValue =
            this.uiRoot.querySelector(
                '.cell-gate-progress-label'
            )


        this.passedValue =
            this.uiRoot.querySelector(
                '.cell-gate-passed'
            )


        this.selectedPanel =
            this.uiRoot.querySelector(
                '.cell-gate-selected'
            )


        this.selectedTitle =
            this.uiRoot.querySelector(
                '.cell-gate-selected-title'
            )


        this.selectedDescription =
            this.uiRoot.querySelector(
                '.cell-gate-selected-description'
            )


        this.selectionType =
            this.uiRoot.querySelector(
                '.cell-gate-selected-kicker'
            )


        this.introElement =
            this.uiRoot.querySelector(
                '.cell-gate-intro'
            )


        this.closeButtonText =
            this.uiRoot.querySelector(
                '.cell-gate-close-text'
            )


        this.statusLabel =
            this.uiRoot.querySelector(
                '.cell-gate-status-label'
            )


        this.passedLabel =
            this.uiRoot.querySelector(
                '.cell-gate-passed-label'
            )


        this.resetButtonText =
            this.uiRoot.querySelector(
                '.cell-gate-reset-text'
            )


        this.hintRotate =
            this.uiRoot.querySelector(
                '.cell-gate-hint-rotate'
            )


        this.hintZoom =
            this.uiRoot.querySelector(
                '.cell-gate-hint-zoom'
            )


        this.hintClick =
            this.uiRoot.querySelector(
                '.cell-gate-hint-click'
            )


        this.panelKicker =
            this.uiRoot.querySelector(
                '.cell-gate-panel-kicker'
            )


        this.panelTitle =
            this.uiRoot.querySelector(
                '.cell-gate-panel-title'
            )


        this.panelDescription =
            this.uiRoot.querySelector(
                '.cell-gate-panel-description'
            )
    }


    /* =====================================================
       EVENTS
       ===================================================== */

    createEvents() {

        this.onResize =
            () => this.resize()


        this.onPointerDown =
            event =>
                this.handlePointerDown(
                    event
                )


        this.onPointerMove =
            event =>
                this.handlePointerMove(
                    event
                )


        this.onPointerUp =
            event =>
                this.handlePointerUp(
                    event
                )


        this.onClick =
            event =>
                this.handleClick(
                    event
                )


        window.addEventListener(
            'resize',
            this.onResize
        )


        this.renderer.domElement.addEventListener(
            'pointerdown',
            this.onPointerDown
        )


        this.renderer.domElement.addEventListener(
            'pointermove',
            this.onPointerMove
        )


        window.addEventListener(
            'pointerup',
            this.onPointerUp
        )


        this.renderer.domElement.addEventListener(
            'click',
            this.onClick
        )


        this.closeButton.addEventListener(
            'click',
            event => {

                event.stopPropagation()

                this.close()
            }
        )


        this.toggleButton.addEventListener(
            'click',
            event => {

                event.stopPropagation()

                this.toggleGate()
            }
        )


        this.resetButton.addEventListener(
            'click',
            event => {

                event.stopPropagation()

                this.reset()
            }
        )
    }


    /* =====================================================
       POINTER DOWN
       ===================================================== */

    handlePointerDown(
        event
    ) {

        this.pointerDown =
            true

        this.pointerMoved =
            false

        this.pointerDownX =
            event.clientX

        this.pointerDownY =
            event.clientY
    }


    /* =====================================================
       POINTER MOVE
       ===================================================== */

    handlePointerMove(
        event
    ) {

        if (
            !this.active
        ) {
            return
        }


        if (
            this.pointerDown
        ) {

            const distance =
                Math.hypot(
                    event.clientX -
                    this.pointerDownX,

                    event.clientY -
                    this.pointerDownY
                )


            if (
                distance > 6
            ) {

                this.pointerMoved =
                    true
            }
        }


        this.updatePointer(
            event
        )


        const object =
            this.getInteractiveObject()


        this.hoveredObject =
            object


        this.renderer.domElement.style.cursor =
            object
                ? 'pointer'
                : 'grab'
    }


    /* =====================================================
       POINTER UP
       ===================================================== */

    handlePointerUp() {

        this.pointerDown =
            false
    }


    /* =====================================================
       UPDATE POINTER
       ===================================================== */

    updatePointer(
        event
    ) {

        const rect =
            this.renderer.domElement
                .getBoundingClientRect()


        if (
            !rect.width ||
            !rect.height
        ) {
            return
        }


        this.pointer.x =
            (
                (
                    event.clientX -
                    rect.left
                ) /
                rect.width
            ) *
            2 -
            1


        this.pointer.y =
            -(
                (
                    event.clientY -
                    rect.top
                ) /
                rect.height
            ) *
            2 +
            1
    }


    /* =====================================================
       INTERACTIVE OBJECT
       ===================================================== */

    getInteractiveObject() {

        this.raycaster.setFromCamera(
            this.pointer,
            this.camera
        )


        const objects = [

            this.gateFrame,

            this.gateChannel,

            this.gateLeft,

            this.gateRight,

            this.gateCore

        ]


        const intersects =
            this.raycaster.intersectObjects(
                objects,
                true
            )


        if (
            intersects.length
        ) {

            return intersects[0].object
        }


        return null
    }


    /* =====================================================
       CLICK
       ===================================================== */

    handleClick(
        event
    ) {

        if (
            !this.active ||
            this.pointerMoved
        ) {
            return
        }


        this.updatePointer(
            event
        )


        const object =
            this.getInteractiveObject()


        if (
            !object
        ) {
            return
        }


        this.selectedObject =
            object


        this.selectGateway()

        this.toggleGate()
    }


    /* =====================================================
       SELECT GATEWAY
       ===================================================== */

    selectGateway() {

        if (
            this.selectedPanel
        ) {

            this.selectedPanel.classList.add(
                'visible'
            )
        }


        this.highlightGateway()
    }


    /* =====================================================
       HIGHLIGHT GATEWAY
       ===================================================== */

    highlightGateway() {

        const objects = [

            this.gateFrame,

            this.gateLeft,

            this.gateRight,

            this.gateCore

        ]


        objects.forEach(
            object => {

                if (
                    !object ||
                    !object.material
                ) {
                    return
                }


                const baseScale =
                    this.gateBaseScales.get(
                        object
                    )


                if (
                    baseScale
                ) {

                    object.scale.copy(
                        baseScale
                    )

                    object.scale.multiplyScalar(
                        1.03
                    )
                }


                if (
                    object.material.emissive
                ) {

                    object.material.emissive.set(
                        0x42ffd0
                    )

                    object.material.emissiveIntensity =
                        1.45
                }
            }
        )
    }


    /* =====================================================
       TOGGLE GATE
       ===================================================== */

    toggleGate() {

        const isCurrentlyOpening =
            this.gateTarget >
            0.5


        this.gateTarget =
            isCurrentlyOpening
                ? 0
                : 1


        this.selectedPanel?.classList.add(
            'visible'
        )


        this.updateGateUI()
    }


    /* =====================================================
       UPDATE GATE UI
       ===================================================== */

    updateGateUI() {

        if (
            !this.gateStatus
        ) {
            return
        }


        const progress =
            this.gateProgress


        const language =
            getLanguage()


        const isArabic =
            language === 'ar'


        if (
            progress < 0.05 &&
            this.gateTarget < 0.5
        ) {

            this.gateStatus.textContent =
                isArabic
                    ? 'مغلقة'
                    : 'Closed'

        } else if (
            progress > 0.95 &&
            this.gateTarget > 0.5
        ) {

            this.gateStatus.textContent =
                isArabic
                    ? 'مفتوحة'
                    : 'Open'

        } else if (
            this.gateTarget > 0.5
        ) {

            this.gateStatus.textContent =
                isArabic
                    ? 'جاري الفتح'
                    : 'Opening'

        } else {

            this.gateStatus.textContent =
                isArabic
                    ? 'جاري الإغلاق'
                    : 'Closing'
        }


        if (
            this.toggleButtonText
        ) {

            this.toggleButtonText.textContent =
                this.gateTarget > 0.5
                    ? (
                        isArabic
                            ? 'إغلاق البوابة'
                            : 'Close Gate'
                    )
                    : (
                        isArabic
                            ? 'فتح البوابة'
                            : 'Open Gate'
                    )
        }


        const percentage =
            Math.round(
                progress *
                100
            )


        if (
            this.progressValue
        ) {

            this.progressValue.textContent =
                `${percentage}%`
        }


        if (
            this.progressBar
        ) {

            this.progressBar.style.width =
                `${percentage}%`
        }


        if (
            this.passedValue
        ) {

            this.passedValue.textContent =
                `${this.particlesPassed}`
        }
    }


    /* =====================================================
       UPDATE GATE ANIMATION
       ===================================================== */

    updateGate(
        delta
    ) {

        const difference =
            this.gateTarget -
            this.gateProgress


        if (
            Math.abs(
                difference
            ) > 0.001
        ) {

            this.gateProgress +=
                difference *
                Math.min(
                    delta *
                    this.gateOpeningSpeed,
                    1
                )
        }


        this.gateProgress =
            THREE.MathUtils.clamp(
                this.gateProgress,
                0,
                1
            )


        /* -------------------------------------------------
           GATE LEAVES
           ------------------------------------------------- */

        if (
            this.gateLeft
        ) {

            this.gateLeft.position.x =
                THREE.MathUtils.lerp(
                    -0.55,
                    -0.98,
                    this.gateProgress
                )
        }


        if (
            this.gateRight
        ) {

            this.gateRight.position.x =
                THREE.MathUtils.lerp(
                    0.55,
                    0.98,
                    this.gateProgress
                )
        }


        /* -------------------------------------------------
           CORE
           ------------------------------------------------- */

        if (
            this.gateCore &&
            this.gateCore.material
        ) {

            this.gateCore.material.emissiveIntensity =
                THREE.MathUtils.lerp(
                    0.8,
                    2.2,
                    this.gateProgress
                )


            const scale =
                THREE.MathUtils.lerp(
                    1,
                    1.3,
                    this.gateProgress
                )


            const highlighted =
                this.selectedObject !== null


            const finalScale =
                highlighted
                    ? scale * 1.03
                    : scale


            this.gateCore.scale.setScalar(
                finalScale
            )
        }


        /* -------------------------------------------------
           GLOW
           ------------------------------------------------- */

        if (
            this.gateGlow &&
            this.gateGlow.material
        ) {

            this.gateGlow.material.opacity =
                THREE.MathUtils.lerp(
                    0.35,
                    0.95,
                    this.gateProgress
                )
        }


        this.updateGateUI()
    }


    /* =====================================================
       UPDATE PARTICLES
       ===================================================== */

    updateParticles(
        delta
    ) {

        if (
            this.paused
        ) {
            return
        }


        this.particles.forEach(
            particle => {

                const data =
                    particle.userData


                switch (
                    data.state
                ) {

                    case 'approaching': {

                        data.progress +=
                            delta *
                            data.speed


                        data.progress =
                            Math.min(
                                data.progress,
                                1
                            )


                        this.positionParticle(
                            particle
                        )


                        if (
                            data.progress >=
                            0.92
                        ) {

                            data.progress =
                                1

                            data.state =
                                'waiting'

                            data.waitTime =
                                0
                        }


                        break
                    }


                    case 'waiting': {

                        this.positionParticleAtGate(
                            particle
                        )


                        if (
                            data.type ===
                            this.allowedParticleType
                        ) {

                            if (
                                this.gateProgress >
                                0.72
                            ) {

                                data.state =
                                    'entering'

                                data.crossingProgress =
                                    0
                            }

                        } else {

                            this.blockParticle(
                                particle
                            )
                        }


                        break
                    }


                    case 'blocked': {

                        this.positionParticleAtGate(
                            particle
                        )


                        if (
                            particle.material
                        ) {

                            const pulse =
                                0.92 +
                                Math.sin(
                                    this.elapsed *
                                    3 +
                                    data.index
                                ) *
                                0.06


                            particle.scale.setScalar(
                                pulse
                            )
                        }


                        data.waitTime +=
                            delta


                        if (
                            data.waitTime >
                            2.8
                        ) {

                            this.recycleParticle(
                                particle
                            )
                        }


                        break
                    }


                    case 'entering': {

                        if (
                            data.type !==
                            this.allowedParticleType
                        ) {

                            data.state =
                                'blocked'

                            break
                        }


                        if (
                            this.gateProgress <
                            0.45
                        ) {

                            data.state =
                                'waiting'

                            data.crossingProgress =
                                0

                            break
                        }


                        this.moveParticleThroughGate(
                            particle,
                            delta
                        )


                        break
                    }


                    case 'inside': {

                        this.moveParticleInside(
                            particle,
                            delta
                        )


                        break
                    }


                    default: {

                        this.recycleParticle(
                            particle
                        )

                        break
                    }
                }
            }
        )
    }


    /* =====================================================
       UPDATE GATE PARTICLES
       ===================================================== */

    updateGateParticles(
        delta
    ) {

        this.gateParticles.forEach(
            (
                particle,
                index
            ) => {

                particle.userData.angle +=
                    delta *
                    (
                        0.35 +
                        index *
                        0.004
                    )


                const angle =
                    particle.userData.angle


                const radius =
                    particle.userData.radius


                particle.position.x =
                    Math.cos(angle) *
                    radius


                particle.position.y =
                    Math.sin(angle) *
                    radius


                particle.position.z =
                    Math.sin(
                        this.elapsed *
                        1.5 +
                        index
                    ) *
                    0.18


                if (
                    particle.material
                ) {

                    particle.material.opacity =
                        THREE.MathUtils.lerp(
                            0.2,
                            0.85,
                            this.gateProgress
                        )
                }
            }
        )
    }


    /* =====================================================
       INTRO
       ===================================================== */

    updateIntro(
        delta
    ) {

        if (
            this.introTime >=
            this.introDuration
        ) {
            return
        }


        this.introTime +=
            delta


        const progress =
            Math.min(
                this.introTime /
                this.introDuration,
                1
            )


        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            )


        this.worldGroup.scale.setScalar(
            THREE.MathUtils.lerp(
                0.72,
                1,
                eased
            )
        )


        this.worldGroup.position.z =
            THREE.MathUtils.lerp(
                -1.2,
                0,
                eased
            )


        this.worldGroup.rotation.y =
            THREE.MathUtils.lerp(
                -0.35,
                0,
                eased
            )


        if (
            this.introElement
        ) {

            if (
                progress >= 1
            ) {

                this.introElement.classList.add(
                    'hidden'
                )

            } else {

                this.introElement.classList.remove(
                    'hidden'
                )
            }
        }
    }


    /* =====================================================
       SHOW
       ===================================================== */

    show() {

        if (
            this.destroyed
        ) {
            return
        }


        this.active =
            true

        this.paused =
            false


        this.renderer.domElement.style.display =
            'block'


        this.uiRoot.style.display =
            'block'


        this.reset()


        this.active =
            true


        this.introTime =
            0


        this.worldGroup.scale.setScalar(
            0.72
        )


        this.worldGroup.position.z =
            -1.2


        this.worldGroup.rotation.y =
            -0.35


        this.introElement.classList.remove(
            'hidden'
        )


        this.renderer.render(
            this.renderScene,
            this.camera
        )
    }


    /* =====================================================
       HIDE
       ===================================================== */

    hide() {

        this.active =
            false


        if (
            this.renderer
        ) {

            this.renderer.domElement.style.display =
                'none'
        }


        if (
            this.uiRoot
        ) {

            this.uiRoot.style.display =
                'none'
        }
    }


    /* =====================================================
       CLOSE
       ===================================================== */

    close() {

        this.hide()


        if (
            this.parent &&
            typeof this.parent.closeActiveExperiment ===
                'function'
        ) {

            this.parent.closeActiveExperiment()
        }


        this.dispatchEvent(
            'awtaar-cell-gate-closed'
        )
    }


    /* =====================================================
       RESET
       ===================================================== */

    reset() {

        this.gateOpen =
            false

        this.gateTarget =
            0

        this.gateProgress =
            0

        this.particlesPassed =
            0

        this.paused =
            false


        this.selectedObject =
            null


        if (
            this.selectedPanel
        ) {

            this.selectedPanel.classList.remove(
                'visible'
            )
        }


        /* -------------------------------------------------
           RESET GATE
           ------------------------------------------------- */

        if (
            this.gateLeft
        ) {

            this.gateLeft.position.x =
                -0.55
        }


        if (
            this.gateRight
        ) {

            this.gateRight.position.x =
                0.55
        }


        if (
            this.gateCore
        ) {

            this.gateCore.scale.setScalar(
                1
            )

            if (
                this.gateCore.material
            ) {

                this.gateCore.material.emissiveIntensity =
                    0.8
            }
        }


        if (
            this.gateGlow
        ) {

            this.gateGlow.material.opacity =
                0.35
        }


        /* -------------------------------------------------
           RESET PARTICLES
           ------------------------------------------------- */

        this.particles.forEach(
            (
                particle,
                index
            ) => {

                const data =
                    particle.userData


                data.progress =
                    (
                        index /
                        this.particleCount
                    ) *
                    0.35


                data.progress +=
                    Math.random() *
                    0.18


                data.offset =
                    (
                        Math.random() -
                        0.5
                    ) *
                    2.2


                data.yOffset =
                    (
                        Math.random() -
                        0.5
                    ) *
                    1.5


                data.zOffset =
                    (
                        Math.random() -
                        0.5
                    ) *
                    0.55


                data.state =
                    'approaching'


                data.crossingProgress =
                    0


                data.insideTime =
                    0


                data.insideX =
                    null

                data.insideY =
                    null

                data.insideZ =
                    null


                data.waitTime =
                    Math.random() *
                    0.5


                particle.scale.setScalar(
                    1
                )


                if (
                    particle.material
                ) {

                    particle.material.emissiveIntensity =
                        0.85
                }


                this.positionParticle(
                    particle
                )
            }
        )


        /* -------------------------------------------------
           RESET CAMERA
           ------------------------------------------------- */

        this.camera.position.set(
            0,
            0.7,
            14
        )


        this.controls.target.set(
            0,
            0,
            0
        )


        this.controls.update()


        this.updateGateUI()
    }


    /* =====================================================
       UPDATE
       ===================================================== */

    update(
        delta = 0.016
    ) {

        if (
            !this.active ||
            this.destroyed
        ) {
            return
        }


        delta =
            Math.min(
                delta,
                0.05
            )


        this.elapsed +=
            delta


        this.updateIntro(
            delta
        )


        this.updateGate(
            delta
        )


        this.updateParticles(
            delta
        )


        this.updateGateParticles(
            delta
        )


        /* -------------------------------------------------
           MEMBRANE MOTION
           ------------------------------------------------- */

        if (
            this.membrane
        ) {

            this.membrane.rotation.y +=
                delta *
                0.008
        }


        if (
            this.membraneGlow
        ) {

            this.membraneGlow.rotation.y +=
                delta *
                0.006
        }


        /* -------------------------------------------------
           GATE PULSE
           ------------------------------------------------- */

        if (
            this.gateGlow
        ) {

            const pulse =
                0.88 +
                Math.sin(
                    this.elapsed *
                    2
                ) *
                0.12


            this.gateGlow.scale.setScalar(
                pulse
            )
        }


        /* -------------------------------------------------
           ENVIRONMENT
           ------------------------------------------------- */

        if (
            this.environmentParticles
        ) {

            this.environmentParticles.rotation.y +=
                delta *
                0.006
        }


        this.controls.update()


        this.renderer.render(
            this.renderScene,
            this.camera
        )
    }


    /* =====================================================
       RESIZE
       ===================================================== */

    resize() {

        if (
            !this.camera ||
            !this.renderer
        ) {
            return
        }


        const width =
            window.innerWidth

        const height =
            window.innerHeight


        this.camera.aspect =
            width /
            height


        this.camera.updateProjectionMatrix()


        this.renderer.setSize(
            width,
            height
        )
    }


    /* =====================================================
       LANGUAGE
       ===================================================== */

    updateLanguage() {

        if (
            !this.uiRoot
        ) {
            return
        }


        const language =
            getLanguage()


        const isArabic =
            language === 'ar'


        this.uiRoot.dir =
            isArabic
                ? 'rtl'
                : 'ltr'


        const root =
            key =>
                `biology.cellWorld.experiments.cellGateway.${key}`


        const text =
            (
                key,
                arabic,
                english
            ) => {

                return this.translate(
                    root(key),
                    isArabic
                        ? arabic
                        : english
                )
            }


        /* -------------------------------------------------
           TOPBAR
           ------------------------------------------------- */

        const eyebrow =
            this.uiRoot.querySelector(
                '.cell-gate-eyebrow'
            )


        const title =
            this.uiRoot.querySelector(
                '.cell-gate-title'
            )


        const subtitle =
            this.uiRoot.querySelector(
                '.cell-gate-subtitle'
            )


        if (
            eyebrow
        ) {

            eyebrow.textContent =
                'AWTAAR • BIOLOGY • CELL WORLD'
        }


        if (
            title
        ) {

            title.textContent =
                text(
                    'title',
                    'بوابة الخلية',
                    'Cell Gateway'
                )
        }


        if (
            subtitle
        ) {

            subtitle.textContent =
                text(
                    'subtitle',
                    'كيف تتحكم الخلية فيما يدخل إليها وما يخرج منها؟',
                    'How does a cell control what enters and leaves?'
                )
        }


        if (
            this.closeButtonText
        ) {

            this.closeButtonText.textContent =
                text(
                    'close',
                    'الخروج',
                    'Exit'
                )
        }


        /* -------------------------------------------------
           INTRO
           ------------------------------------------------- */

        const introSmall =
            this.uiRoot.querySelector(
                '.cell-gate-intro-small'
            )


        const introMain =
            this.uiRoot.querySelector(
                '.cell-gate-intro-main'
            )


        if (
            introSmall
        ) {

            introSmall.textContent =
                text(
                    'introSmall',
                    'غشاء الخلية ليس جدارًا مغلقًا...',
                    'The cell membrane is not a sealed wall...'
                )
        }


        if (
            introMain
        ) {

            introMain.textContent =
                text(
                    'introMain',
                    'إنه بوابة ذكية.',
                    'It is a smart gateway.'
                )
        }


        /* -------------------------------------------------
           LEFT PANEL
           ------------------------------------------------- */

        if (
            this.panelKicker
        ) {

            this.panelKicker.textContent =
                text(
                    'panelKicker',
                    'بوابة الخلية',
                    'CELL GATE'
                )
        }


        if (
            this.panelTitle
        ) {

            this.panelTitle.textContent =
                text(
                    'panelTitle',
                    'بوابة بروتينية',
                    'Protein Gateway'
                )
        }


        if (
            this.panelDescription
        ) {

            this.panelDescription.textContent =
                text(
                    'panelDescription',
                    'القناة البروتينية تسمح بمرور مواد محددة، بينما تمنع مواد أخرى لا تتوافق معها.',
                    'The protein channel allows specific materials to pass while blocking others that do not fit.'
                )
        }


        if (
            this.statusLabel
        ) {

            this.statusLabel.textContent =
                text(
                    'gateStatusLabel',
                    'حالة البوابة',
                    'Gate status'
                )
        }


        if (
            this.passedLabel
        ) {

            this.passedLabel.textContent =
                text(
                    'passedLabel',
                    'مواد عبرت',
                    'Materials passed'
                )
        }


        if (
            this.resetButtonText
        ) {

            this.resetButtonText.textContent =
                text(
                    'reset',
                    'إعادة التجربة',
                    'Reset experiment'
                )
        }


        /* -------------------------------------------------
           SELECTED PANEL
           ------------------------------------------------- */

        if (
            this.selectionType
        ) {

            this.selectionType.textContent =
                text(
                    'selectedKicker',
                    'بوابة الخلية',
                    'CELL GATE'
                )
        }


        if (
            this.selectedTitle
        ) {

            this.selectedTitle.textContent =
                text(
                    'selectedTitle',
                    'قناة بروتينية',
                    'Protein Channel'
                )
        }


        if (
            this.selectedDescription
        ) {

            this.selectedDescription.textContent =
                text(
                    'selectedDescription',
                    'القناة انتقائية؛ فتحها لا يعني أن كل المواد تستطيع المرور عبرها.',
                    'The channel is selective; opening it does not mean every material can pass through.'
                )
        }


        /* -------------------------------------------------
           BOTTOM HINT
           ------------------------------------------------- */

        if (
            this.hintRotate
        ) {

            this.hintRotate.textContent =
                text(
                    'hintRotate',
                    'اسحب للدوران',
                    'Drag to rotate'
                )
        }


        if (
            this.hintZoom
        ) {

            this.hintZoom.textContent =
                text(
                    'hintZoom',
                    'مرر للتكبير',
                    'Scroll to zoom'
                )
        }


        if (
            this.hintClick
        ) {

            this.hintClick.textContent =
                text(
                    'hintClick',
                    'اضغط على البوابة لفتحها',
                    'Click the gateway to open it'
                )
        }


        /*
         * Recalculate the dynamic gate status
         * and button text after switching language.
         */

        this.updateGateUI()
    }


    /* =====================================================
       SCENE REFERENCE
       ===================================================== */

    setScene(
        scene
    ) {

        this.scene =
            scene

        return this
    }


    /* =====================================================
       EVENT
       ===================================================== */

    dispatchEvent(
        name,
        detail = {}
    ) {

        document.dispatchEvent(
            new CustomEvent(
                name,
                {
                    detail
                }
            )
        )
    }


    /* =====================================================
       STYLES
       ===================================================== */

    injectStyles() {

        if (
            document.getElementById(
                'awtaar-cell-gate-inline-styles'
            )
        ) {
            return
        }


        const style =
            document.createElement(
                'style'
            )


        style.id =
            'awtaar-cell-gate-inline-styles'


        style.textContent = `

            .awtaar-cell-gate-ui {

                position: fixed;

                inset: 0;

                z-index: 2202;

                pointer-events: none;

                color: #effff8;

                font-family:
                    "Tajawal",
                    sans-serif;

            }


            .cell-gate-topbar {

                position: absolute;

                top: 0;

                left: 0;

                right: 0;

                min-height: 92px;

                padding:
                    22px 30px;

                display: flex;

                justify-content:
                    space-between;

                align-items:
                    flex-start;

                pointer-events: none;

            }


            .cell-gate-title-group {

                text-align: right;

            }


            .cell-gate-eyebrow {

                color:
                    rgba(102,230,186,.62);

                font-size: 9px;

                letter-spacing:
                    2.2px;

                margin-bottom: 5px;

            }


            .cell-gate-title {

                margin: 0;

                color: #effff8;

                font-size: 25px;

                font-weight: 500;

                line-height: 1.2;

                text-shadow:
                    0 2px 25px
                    rgba(0,0,0,.35);

            }


            .cell-gate-subtitle {

                margin:
                    5px 0 0;

                color:
                    rgba(220,255,242,.46);

                font-size: 10px;

                font-weight: 300;

            }


            .cell-gate-close {

                pointer-events: auto;

                min-width: 88px;

                height: 38px;

                border:
                    1px solid
                    rgba(119,235,198,.18);

                border-radius: 11px;

                background:
                    rgba(3,17,15,.5);

                color:
                    rgba(230,255,247,.75);

                display: flex;

                align-items: center;

                justify-content: center;

                gap: 7px;

                cursor: pointer;

                font-family:
                    "Tajawal",
                    sans-serif;

                font-size: 10px;

                backdrop-filter:
                    blur(12px);

                transition:
                    .2s ease;

            }


            .cell-gate-close:hover {

                background:
                    rgba(8,35,29,.75);

                border-color:
                    rgba(119,235,198,.38);

                transform:
                    translateY(-1px);

            }


            .cell-gate-close-icon {

                font-size: 19px;

                font-weight: 300;

                line-height: 1;

            }


            .cell-gate-intro {

                position: absolute;

                left: 50%;

                top: 50%;

                transform:
                    translate(
                        -50%,
                        -50%
                    );

                text-align: center;

                pointer-events: none;

                z-index: 5;

                transition:
                    opacity .7s ease,
                    transform .7s ease;

            }


            .cell-gate-intro.hidden {

                opacity: 0;

                transform:
                    translate(
                        -50%,
                        -50%
                    )
                    scale(.96);

            }


            .cell-gate-intro-small {

                color:
                    rgba(115,235,195,.6);

                font-size: 12px;

                margin-bottom: 8px;

                letter-spacing:
                    1.5px;

            }


            .cell-gate-intro-main {

                color: #effff8;

                font-size: 30px;

                font-weight: 400;

                text-shadow:
                    0 0 35px
                    rgba(75,235,188,.22);

            }


            .cell-gate-left-panel {

                position: absolute;

                left: 28px;

                top: 50%;

                transform:
                    translateY(-50%);

                width: 250px;

                padding:
                    19px 19px 18px;

                border-left:
                    1px solid
                    rgba(105,230,185,.2);

                background:
                    linear-gradient(
                        90deg,
                        rgba(3,16,14,.58),
                        rgba(3,16,14,.08)
                    );

                pointer-events: auto;

                text-align: left;

                direction: ltr;

                backdrop-filter:
                    blur(7px);

            }


            .cell-gate-panel-kicker {

                color: #64ddb0;

                font-size: 8px;

                letter-spacing:
                    2px;

                margin-bottom: 7px;

            }


            .cell-gate-panel-title {

                color: #effff8;

                font-size: 16px;

                font-weight: 500;

                margin-bottom: 6px;

            }


            .cell-gate-panel-description {

                color:
                    rgba(223,255,244,.55);

                font-size: 10px;

                line-height: 1.75;

                font-weight: 300;

                margin-bottom: 15px;

            }


            .cell-gate-status-row {

                display: flex;

                align-items: center;

                justify-content:
                    space-between;

                direction: rtl;

                color:
                    rgba(220,255,242,.5);

                font-size: 10px;

                margin-bottom: 8px;

            }


            .cell-gate-status {

                color: #69e2b6;

                font-weight: 500;

            }


            .cell-gate-passed {

                color: #77baff;

                font-weight: 500;

            }


            .cell-gate-progress {

                margin-bottom: 14px;

            }


            .cell-gate-progress-track {

                width: 100%;

                height: 3px;

                border-radius: 20px;

                overflow: hidden;

                background:
                    rgba(111,230,192,.1);

            }


            .cell-gate-progress-value {

                width: 0%;

                height: 100%;

                border-radius: inherit;

                background:
                    #55ddb0;

                box-shadow:
                    0 0 12px
                    rgba(85,221,176,.5);

                transition:
                    width .12s linear;

            }


            .cell-gate-progress-label {

                color:
                    rgba(214,255,241,.35);

                font-size: 8px;

                text-align: right;

                margin-top: 4px;

                direction: rtl;

            }


            .cell-gate-toggle {

                width: 100%;

                height: 39px;

                border:
                    1px solid
                    rgba(98,226,180,.24);

                border-radius: 10px;

                background:
                    rgba(6,38,30,.55);

                color:
                    #dfffee;

                display: flex;

                align-items: center;

                justify-content:
                    center;

                gap: 8px;

                cursor: pointer;

                font-family:
                    "Tajawal",
                    sans-serif;

                font-size: 10px;

                transition:
                    .2s ease;

            }


            .cell-gate-toggle:hover {

                border-color:
                    rgba(98,226,180,.48);

                background:
                    rgba(9,52,41,.75);

                transform:
                    translateY(-1px);

            }


            .cell-gate-toggle-icon {

                color: #69e2b6;

                font-size: 14px;

            }


            .cell-gate-reset {

                width: 100%;

                height: 34px;

                margin-top: 7px;

                border:
                    1px solid
                    rgba(120,230,200,.1);

                border-radius: 9px;

                background:
                    rgba(3,17,15,.35);

                color:
                    rgba(222,255,244,.45);

                display: flex;

                align-items: center;

                justify-content:
                    center;

                gap: 7px;

                cursor: pointer;

                font-family:
                    "Tajawal",
                    sans-serif;

                font-size: 9px;

                transition:
                    .2s ease;

            }


            .cell-gate-reset:hover {

                color:
                    rgba(235,255,248,.8);

                border-color:
                    rgba(120,230,200,.25);

            }


            .cell-gate-selected {

                position: absolute;

                left: 50%;

                bottom: 86px;

                transform:
                    translateX(-50%)
                    translateY(10px);

                width: 280px;

                text-align: center;

                opacity: 0;

                pointer-events: none;

                transition:
                    opacity .35s ease,
                    transform .35s ease;

            }


            .cell-gate-selected.visible {

                opacity: 1;

                transform:
                    translateX(-50%)
                    translateY(0);

            }


            .cell-gate-selected-kicker {

                color: #64ddb0;

                font-size: 8px;

                letter-spacing:
                    2px;

                margin-bottom: 5px;

            }


            .cell-gate-selected-title {

                color: #effff8;

                font-size: 18px;

                font-weight: 500;

                margin-bottom: 5px;

            }


            .cell-gate-selected-description {

                color:
                    rgba(222,255,244,.52);

                font-size: 10px;

                line-height: 1.7;

                font-weight: 300;

            }


            .cell-gate-bottom-hint {

                position: absolute;

                left: 50%;

                bottom: 18px;

                transform:
                    translateX(-50%);

                display: flex;

                align-items: center;

                white-space: nowrap;

                color:
                    rgba(200,245,228,.3);

                font-size: 8px;

                pointer-events: none;

            }


            .cell-gate-bottom-hint span {

                margin:
                    0 7px;

            }


            .cell-gate-bottom-hint span:nth-child(even) {

                color:
                    rgba(105,226,182,.45);

            }


            @media (
                max-width: 900px
            ) {

                .cell-gate-left-panel {

                    width: 220px;

                    left: 16px;

                }


                .cell-gate-topbar {

                    padding:
                        18px;

                }


                .cell-gate-title {

                    font-size: 21px;

                }

            }


            @media (
                max-width: 650px
            ) {

                .cell-gate-left-panel {

                    width: 190px;

                    left: 12px;

                    top: auto;

                    bottom: 60px;

                    transform: none;

                    padding:
                        13px;

                }


                .cell-gate-panel-description {

                    font-size: 9px;

                    line-height: 1.55;

                }


                .cell-gate-selected {

                    width: 210px;

                    bottom: 18px;

                }


                .cell-gate-bottom-hint {

                    display: none;

                }


                .cell-gate-subtitle {

                    max-width: 180px;

                    line-height: 1.5;

                }

            }

        `


        document.head.appendChild(
            style
        )
    }


    /* =====================================================
       DESTROY
       ===================================================== */

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


        document.removeEventListener(
            'awtaar-language-change',
            this.languageChangeHandler
        )


        window.removeEventListener(
            'resize',
            this.onResize
        )


        if (
            this.renderer
        ) {

            this.renderer.domElement.removeEventListener(
                'pointerdown',
                this.onPointerDown
            )

            this.renderer.domElement.removeEventListener(
                'pointermove',
                this.onPointerMove
            )

            this.renderer.domElement.removeEventListener(
                'click',
                this.onClick
            )
        }


        window.removeEventListener(
            'pointerup',
            this.onPointerUp
        )


        if (
            this.controls
        ) {

            this.controls.dispose()
        }


        this.disposeObject(
            this.renderScene
        )


        if (
            this.renderer
        ) {

            this.renderer.dispose()


            if (
                this.renderer.domElement.parentNode
            ) {

                this.renderer.domElement.parentNode.removeChild(
                    this.renderer.domElement
                )
            }
        }


        if (
            this.uiRoot &&
            this.uiRoot.parentNode
        ) {

            this.uiRoot.parentNode.removeChild(
                this.uiRoot
            )
        }


        const style =
            document.getElementById(
                'awtaar-cell-gate-inline-styles'
            )


        if (
            style
        ) {

            style.remove()
        }
    }


    /* =====================================================
       DISPOSE
       ===================================================== */

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

                    const materials =
                        Array.isArray(
                            child.material
                        )
                            ? child.material
                            : [
                                child.material
                            ]


                    materials.forEach(
                        material => {

                            if (
                                material.map
                            ) {

                                material.map.dispose()
                            }


                            if (
                                material.normalMap
                            ) {

                                material.normalMap.dispose()
                            }


                            if (
                                material.roughnessMap
                            ) {

                                material.roughnessMap.dispose()
                            }


                            if (
                                material.metalnessMap
                            ) {

                                material.metalnessMap.dispose()
                            }


                            material.dispose()
                        }
                    )
                }
            }
        )
    }
}