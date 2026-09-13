/* =========================================================
   AWTAAR — PLATE TECTONICS
   حركة الصفائح التكتونية
   ========================================================= */

import * as THREE from 'three'

import './PlateTectonics.css'

import {
    t,
    getLanguage
} from '../locales/i18n.js'


export default class PlateTectonics {

    /* =====================================================
       CONSTRUCTOR
       ===================================================== */

    constructor(
        geologyWorldUI = null,
        parent = document.body
    ) {

        this.geologyWorldUI =
            geologyWorldUI

        this.parent =
            parent || document.body

        this.language =
            getLanguage() || 'ar'

        this.isVisible =
            false

        this.isRunning =
            false

        this.destroyed =
            false

        this.currentMode =
            'divergent'

        /*
         * نتائج التقارب:
         *
         * trench
         * earthquake
         * mountains
         */
        this.convergentType =
            'trench'


        this.elapsed =
            0

        this.modeTime =
            0

        this.plateOffset =
            0

        this.earthquakeTime =
            0

        this.convergencePressure =
            0

        this.earthquakePhase =
            'idle'

        this.earthquakeReleaseTime =
            0

        this.cameraShake =
            0


        this.animationFrame =
            null

        this.clock =
            new THREE.Clock()


        this.plates =
            []

        this.magmaParticles =
            []

        this.boundaryParticles =
            []

        this.mountains =
            []

        this.earthquakeWaves =
            []


        /*
         * الخندق.
         */

        this.trench =
            null

        this.trenchFloor =
            null

        this.trenchEdgeLeft =
            null

        this.trenchEdgeRight =
            null

        this.trenchShadow =
            null


        /*
         * الصفيحة المنغمسة.
         */

        this.subductionPlate =
            null

        this.subductionCrust =
            null


        /*
         * الزلزال.
         */

        this.faultLine =
            null


        /*
         * لوحة نتائج التقارب.
         */

        this.convergentPanel =
            null

        this.convergentButtons =
            {}


        /*
         * =================================================
         * بيانات هندسة الجبال
         * =================================================
         *
         * نستخدمها لإعادة تشكيل سطح الصفائح
         * أثناء التصادم القاري.
         *
         * الارتفاع يحدث عند الحد الداخلي لكل صفيحة،
         * وليس للصفيحة كلها.
         */

        this.mountainDeformationStrength =
            0

        this.mountainSurfaceOriginals =
            {
                left: null,
                right: null
            }

        this.mountainCrustOriginals =
            {
                left: null,
                right: null
            }


        this.createContainer()

        this.createScene()

        this.createCamera()

        this.createRenderer()

        this.createLights()

        this.createEnvironment()

        this.createPlates()

        this.createBoundary()

        this.createMagma()

        this.createMountains()

        this.createEarthquakeSystem()

        this.createUI()

        this.updateLanguage()

        this.handleResize()


        /*
         * البداية دائمًا من وضع التباعد.
         */

        this.setMode(
            'divergent'
        )


        window.addEventListener(
            'resize',
            this.handleResizeBound =
                () => this.handleResize()
        )
    }


    /* =====================================================
       CONTAINER
       ===================================================== */

    createContainer() {

        const existing =
            document.getElementById(
                'awtaar-plate-tectonics'
            )

        if (existing) {
            existing.remove()
        }


        this.container =
            document.createElement('div')

        this.container.id =
            'awtaar-plate-tectonics'

        this.container.className =
            'awtaar-plate-tectonics'

        this.container.setAttribute(
            'dir',
            this.language === 'ar'
                ? 'rtl'
                : 'ltr'
        )

        this.parent.appendChild(
            this.container
        )
    }


    /* =====================================================
       THREE.JS SCENE
       ===================================================== */

    createScene() {

        /*
         * Scene مستقل بالكامل.
         */

        this.scene =
            new THREE.Scene()

        this.scene.background =
            new THREE.Color(
                0x090706
            )

        this.scene.fog =
            new THREE.FogExp2(
                0x090706,
                0.035
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
            5.5,
            15
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
                alpha: true
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
            1.05

        this.renderer.domElement.className =
            'awtaar-plate-tectonics-canvas'

        this.container.appendChild(
            this.renderer.domElement
        )
    }


    /* =====================================================
       LIGHTING
       ===================================================== */

    createLights() {

        const ambient =
            new THREE.AmbientLight(
                0xffe9cc,
                1.25
            )

        this.scene.add(
            ambient
        )


        const warmLight =
            new THREE.PointLight(
                0xff9b45,
                3.2,
                28
            )

        warmLight.position.set(
            0,
            -1.5,
            4
        )

        this.scene.add(
            warmLight
        )


        const softLight =
            new THREE.DirectionalLight(
                0xffd8a8,
                1.8
            )

        softLight.position.set(
            -5,
            9,
            8
        )

        this.scene.add(
            softLight
        )
    }


    /* =====================================================
       ENVIRONMENT
       ===================================================== */

    createEnvironment() {

        const mantleGeometry =
            new THREE.CylinderGeometry(
                8,
                8,
                2.8,
                96
            )

        const mantleMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x3b1710,
                roughness: 0.92,
                metalness: 0.02
            })

        this.mantle =
            new THREE.Mesh(
                mantleGeometry,
                mantleMaterial
            )

        this.mantle.rotation.x =
            Math.PI / 2

        this.mantle.position.y =
            -1.7

        this.scene.add(
            this.mantle
        )


        const innerGeometry =
            new THREE.CylinderGeometry(
                5.8,
                5.8,
                0.65,
                96
            )

        const innerMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x8b3216,
                emissive: 0x4a1408,
                emissiveIntensity: 0.85,
                roughness: 0.82
            })

        this.innerMantle =
            new THREE.Mesh(
                innerGeometry,
                innerMaterial
            )

        this.innerMantle.rotation.x =
            Math.PI / 2

        this.innerMantle.position.y =
            -0.42

        this.scene.add(
            this.innerMantle
        )


        const groundGeometry =
            new THREE.PlaneGeometry(
                24,
                18
            )

        const groundMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x18110d,
                roughness: 1
            })

        this.ground =
            new THREE.Mesh(
                groundGeometry,
                groundMaterial
            )

        this.ground.rotation.x =
            -Math.PI / 2

        this.ground.position.y =
            -0.1

        this.scene.add(
            this.ground
        )


        for (let i = 0; i < 5; i++) {

            const geometry =
                new THREE.RingGeometry(
                    3.2 + i * 0.75,
                    3.22 + i * 0.75,
                    96
                )

            const material =
                new THREE.MeshBasicMaterial({
                    color: 0x8b5b38,
                    transparent: true,
                    opacity: 0.055,
                    side: THREE.DoubleSide
                })

            const ring =
                new THREE.Mesh(
                    geometry,
                    material
                )

            ring.rotation.x =
                -Math.PI / 2

            ring.position.y =
                0.01

            this.scene.add(
                ring
            )
        }
    }


    /* =====================================================
       PLATES
       ===================================================== */

    createPlates() {

        /*
         * -------------------------------------------------
         * جسم الصفيحة
         * -------------------------------------------------
         *
         * لدينا تقسيمات كافية على محور X حتى نستطيع
         * تشكيل منطقة التصادم ورفعها تدريجيًا.
         */

        const plateGeometry =
            new THREE.BoxGeometry(
                5.4,
                0.62,
                5.2,
                24,
                2,
                12
            )


        const position =
            plateGeometry.attributes.position


        for (
            let i = 0;
            i < position.count;
            i++
        ) {

            const x =
                position.getX(i)

            const y =
                position.getY(i)

            const z =
                position.getZ(i)

            const distortion =
                Math.sin(
                    x * 2.1 +
                    z * 1.7
                ) * 0.055

            position.setY(
                i,
                y + distortion
            )
        }


        plateGeometry.computeVertexNormals()


        const leftMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x4c3425,
                roughness: 0.96,
                metalness: 0.01
            })

        const rightMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x63432e,
                roughness: 0.94,
                metalness: 0.01
            })


        this.leftPlate =
            new THREE.Mesh(
                plateGeometry.clone(),
                leftMaterial
            )

        this.rightPlate =
            new THREE.Mesh(
                plateGeometry.clone(),
                rightMaterial
            )


        this.leftPlate.position.set(
            -3.0,
            0.42,
            0
        )

        this.rightPlate.position.set(
            3.0,
            0.42,
            0
        )


        /*
         * الميل الابتدائي الخفيف فقط.
         *
         * لن نزيد هذا الميل في حالة الجبال.
         */

        this.leftPlate.rotation.z =
            THREE.MathUtils.degToRad(
                -1.5
            )

        this.rightPlate.rotation.z =
            THREE.MathUtils.degToRad(
                1.5
            )


        this.scene.add(
            this.leftPlate,
            this.rightPlate
        )


        this.plates = [
            this.leftPlate,
            this.rightPlate
        ]


        /*
         * =================================================
         * حفظ الهندسة الأصلية
         * =================================================
         */

        this.mountainSurfaceOriginals.left =
            this.copyPositionAttribute(
                this.leftPlate.geometry
                    .attributes
                    .position
            )

        this.mountainSurfaceOriginals.right =
            this.copyPositionAttribute(
                this.rightPlate.geometry
                    .attributes
                    .position
            )


        /*
         * -------------------------------------------------
         * Thin crust layers.
         * -------------------------------------------------
         *
         * تمت زيادة تقسيم X أيضًا حتى يمكن للقشرة نفسها
         * أن تنحني عند منطقة التصادم.
         */

        const crustGeometry =
            new THREE.BoxGeometry(
                5.45,
                0.08,
                5.25,
                24,
                1,
                12
            )

        const crustMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x9b6d45,
                roughness: 0.9
            })


        this.leftCrust =
            new THREE.Mesh(
                crustGeometry.clone(),
                crustMaterial
            )

        this.rightCrust =
            new THREE.Mesh(
                crustGeometry.clone(),
                crustMaterial.clone()
            )


        this.leftCrust.position.set(
            -3.0,
            0.76,
            0
        )

        this.rightCrust.position.set(
            3.0,
            0.76,
            0
        )


        this.scene.add(
            this.leftCrust,
            this.rightCrust
        )


        /*
         * حفظ القشرة الأصلية.
         */

        this.mountainCrustOriginals.left =
            this.copyPositionAttribute(
                this.leftCrust.geometry
                    .attributes
                    .position
            )

        this.mountainCrustOriginals.right =
            this.copyPositionAttribute(
                this.rightCrust.geometry
                    .attributes
                    .position
            )


        /*
         * =================================================
         * SUBDUCTING PLATE
         * =================================================
         */

        const subductionGeometry =
            new THREE.BoxGeometry(
                6.2,
                0.28,
                4.85,
                10,
                2,
                10
            )

        const subductionMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x432719,
                roughness: 0.98,
                metalness: 0.01
            })


        this.subductionPlate =
            new THREE.Mesh(
                subductionGeometry,
                subductionMaterial
            )

        this.subductionPlate.position.set(
            2.4,
            -0.45,
            0
        )

        this.subductionPlate.rotation.z =
            THREE.MathUtils.degToRad(
                13
            )

        this.subductionPlate.visible =
            false

        this.scene.add(
            this.subductionPlate
        )


        /*
         * قشرة الصفيحة المنغمسة.
         */

        const subductionCrustGeometry =
            new THREE.BoxGeometry(
                6.15,
                0.055,
                4.9
            )

        const subductionCrustMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x8f6240,
                roughness: 0.95
            })


        this.subductionCrust =
            new THREE.Mesh(
                subductionCrustGeometry,
                subductionCrustMaterial
            )

        this.subductionCrust.position.set(
            2.4,
            -0.27,
            0
        )

        this.subductionCrust.rotation.z =
            THREE.MathUtils.degToRad(
                13
            )

        this.subductionCrust.visible =
            false

        this.scene.add(
            this.subductionCrust
        )
    }


    /* =====================================================
       POSITION ATTRIBUTE COPY
       ===================================================== */

    copyPositionAttribute(attribute) {

        return new Float32Array(
            attribute.array
        )
    }


    /* =====================================================
       MOUNTAIN SURFACE DEFORMATION
       ===================================================== */

    deformMountainSurface(
        mesh,
        originalArray,
        side,
        strength,
        centerX
    ) {

        if (
            !mesh ||
            !originalArray
        ) {
            return
        }


        const position =
            mesh.geometry.attributes.position


        const localEdge =
            side === 'left'
                ? 2.7
                : -2.7


        for (
            let i = 0;
            i < position.count;
            i++
        ) {

            const originalY =
                originalArray[
                    i * 3 + 1
                ]

            const localX =
                originalArray[
                    i * 3
                ]


            /*
             * المسافة من الحد الداخلي للصفيحة.
             *
             * لا نرفع الصفيحة كلها.
             * نرفع فقط المنطقة القريبة من الحد
             * الذي يواجه الصفيحة الأخرى.
             */

            const distanceFromInnerEdge =
                Math.abs(
                    localEdge -
                    localX
                )


            /*
             * نطاق التأثير.
             *
             * يبدأ قرب الحد الداخلي،
             * ثم يتلاشى تدريجيًا بعيدًا عنه.
             */

            const influenceRadius =
                2.25


            const normalized =
                THREE.MathUtils.clamp(
                    distanceFromInnerEdge /
                        influenceRadius,
                    0,
                    1
                )


            /*
             * منحنى ناعم جدًا.
             */

            const influence =
                1 -
                THREE.MathUtils.smoothstep(
                    normalized,
                    0,
                    1
                )


            /*
             * نركز الارتفاع على منطقة التصادم
             * نفسها.
             *
             * centerX قريب من الصفر.
             */

            const worldX =
                mesh.position.x +
                localX


            const centralFocus =
                Math.exp(
                    -(
                        worldX *
                        worldX
                    ) /
                    1.15
                )


            /*
             * الارتفاع النهائي.
             *
             * يجمع بين:
             *
             * 1. قرب النقطة من الحد الداخلي.
             * 2. قربها من مركز التصادم.
             */

            const uplift =
                strength *
                influence *
                centralFocus


            position.setY(
                i,
                originalY +
                uplift
            )
        }


        position.needsUpdate =
            true

        mesh.geometry.computeVertexNormals()
    }


    /* =====================================================
       RESET MOUNTAIN GEOMETRY
       ===================================================== */

    resetMountainGeometry() {

        const restore = (
            mesh,
            originalArray
        ) => {

            if (
                !mesh ||
                !originalArray
            ) {
                return
            }


            const position =
                mesh.geometry
                    .attributes
                    .position


            for (
                let i = 0;
                i < position.count;
                i++
            ) {

                position.setY(
                    i,
                    originalArray[
                        i * 3 + 1
                    ]
                )
            }


            position.needsUpdate =
                true

            mesh.geometry.computeVertexNormals()
        }


        restore(
            this.leftPlate,
            this.mountainSurfaceOriginals.left
        )

        restore(
            this.rightPlate,
            this.mountainSurfaceOriginals.right
        )

        restore(
            this.leftCrust,
            this.mountainCrustOriginals.left
        )

        restore(
            this.rightCrust,
            this.mountainCrustOriginals.right
        )
    }


    /* =====================================================
       BOUNDARY
       ===================================================== */

    createBoundary() {

        const geometry =
            new THREE.PlaneGeometry(
                0.32,
                4.8
            )

        const material =
            new THREE.MeshBasicMaterial({
                color: 0xff8b32,
                transparent: true,
                opacity: 0.5,
                side: THREE.DoubleSide
            })


        this.boundary =
            new THREE.Mesh(
                geometry,
                material
            )

        this.boundary.rotation.x =
            -Math.PI / 2

        this.boundary.position.set(
            0,
            0.47,
            0
        )

        this.scene.add(
            this.boundary
        )


        /*
         * Boundary glow.
         */

        const glowGeometry =
            new THREE.PlaneGeometry(
                1.1,
                5.4
            )

        const glowMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xff6326,
                transparent: true,
                opacity: 0.08,
                blending:
                    THREE.AdditiveBlending,
                side: THREE.DoubleSide
            })


        this.boundaryGlow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            )

        this.boundaryGlow.rotation.x =
            -Math.PI / 2

        this.boundaryGlow.position.y =
            0.48

        this.scene.add(
            this.boundaryGlow
        )
    }


    /* =====================================================
       MAGMA
       ===================================================== */

    createMagma() {

        const geometry =
            new THREE.SphereGeometry(
                0.055,
                8,
                8
            )

        const material =
            new THREE.MeshBasicMaterial({
                color: 0xffa044
            })


        for (let i = 0; i < 70; i++) {

            const particle =
                new THREE.Mesh(
                    geometry,
                    material.clone()
                )

            particle.position.set(
                (Math.random() - 0.5) * 1.0,
                -0.35 -
                    Math.random() * 2.5,
                (Math.random() - 0.5) * 3.8
            )

            particle.userData.speed =
                0.25 +
                Math.random() * 0.55

            particle.userData.phase =
                Math.random() *
                Math.PI *
                2

            this.scene.add(
                particle
            )

            this.magmaParticles.push(
                particle
            )
        }
    }


    /* =====================================================
       MOUNTAINS
       ===================================================== */

    createMountains() {

        /*
         * سلسلة جبال مركزية.
         *
         * تبدأ بحجم شبه صفري،
         * ثم تنمو أثناء التصادم القاري.
         */

        const positions = [
            -2.15,
            -1.65,
            -1.15,
            -0.65,
            -0.15,
            0.35,
            0.85,
            1.35,
            1.85,
            2.25
        ]


        positions.forEach(
            (x, index) => {

                const height =
                    0.55 +
                    Math.random() * 0.95

                const radius =
                    0.28 +
                    Math.random() * 0.22


                const geometry =
                    new THREE.ConeGeometry(
                        radius,
                        height,
                        6
                    )


                const material =
                    new THREE.MeshStandardMaterial({
                        color:
                            index % 3 === 0
                                ? 0x79563b
                                : 0x684932,
                        roughness: 1
                    })


                const mountain =
                    new THREE.Mesh(
                        geometry,
                        material
                    )


                mountain.position.set(
                    x,
                    0.78 +
                        height / 2,
                    -0.75 +
                        Math.random() * 1.5
                )


                mountain.rotation.z =
                    (
                        Math.random() -
                        0.5
                    ) * 0.14


                /*
                 * تبدأ مخفية بصريًا.
                 */

                mountain.scale.set(
                    0.001,
                    0.001,
                    0.001
                )


                mountain.userData.baseY =
                    mountain.position.y

                mountain.userData.targetScale =
                    0.82 +
                    Math.random() * 0.35

                mountain.userData.delay =
                    index * 0.22


                mountain.visible =
                    false


                this.scene.add(
                    mountain
                )

                this.mountains.push(
                    mountain
                )
            }
        )
    }


    /* =====================================================
       EARTHQUAKE SYSTEM
       ===================================================== */

    createEarthquakeSystem() {

        /*
         * Fault line
         */

        const faultGeometry =
            new THREE.PlaneGeometry(
                0.075,
                5.1
            )

        const faultMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xffb35c,
                transparent: true,
                opacity: 0.0,
                blending:
                    THREE.AdditiveBlending,
                side: THREE.DoubleSide
            })


        this.faultLine =
            new THREE.Mesh(
                faultGeometry,
                faultMaterial
            )

        this.faultLine.rotation.x =
            -Math.PI / 2

        this.faultLine.position.set(
            0,
            0.515,
            0
        )

        this.scene.add(
            this.faultLine
        )


        /*
         * ثلاث موجات زلزالية.
         */

        for (let i = 0; i < 3; i++) {

            const geometry =
                new THREE.RingGeometry(
                    0.08,
                    0.12,
                    48
                )

            const material =
                new THREE.MeshBasicMaterial({
                    color: 0xffb45f,
                    transparent: true,
                    opacity: 0,
                    side: THREE.DoubleSide,
                    blending:
                        THREE.AdditiveBlending
                })


            const wave =
                new THREE.Mesh(
                    geometry,
                    material
                )

            wave.rotation.x =
                -Math.PI / 2

            wave.position.set(
                0,
                0.53,
                0
            )

            wave.visible =
                false

            wave.userData.delay =
                i * 0.45

            wave.userData.duration =
                2.3

            wave.userData.active =
                false

            this.scene.add(
                wave
            )

            this.earthquakeWaves.push(
                wave
            )
        }
    }


    /* =====================================================
       UI
       ===================================================== */

    createUI() {

        /*
         * Header
         */

        this.header =
            document.createElement('div')

        this.header.className =
            'awtaar-plate-header'


        this.title =
            document.createElement('h1')

        this.description =
            document.createElement('p')


        this.header.appendChild(
            this.title
        )

        this.header.appendChild(
            this.description
        )


        this.container.appendChild(
            this.header
        )


        /*
         * Main mode panel.
         */

        this.modePanel =
            document.createElement('div')

        this.modePanel.className =
            'awtaar-plate-modes'


        this.modeButtons =
            {}


        const modes = [
            {
                id: 'divergent',
                icon: '↔'
            },
            {
                id: 'convergent',
                icon: '⇄'
            },
            {
                id: 'transform',
                icon: '⇆'
            }
        ]


        modes.forEach(
            mode => {

                const button =
                    document.createElement(
                        'button'
                    )

                button.type =
                    'button'

                button.className =
                    'awtaar-plate-mode'

                button.dataset.mode =
                    mode.id

                button.innerHTML = `
                    <span class="awtaar-plate-mode-icon">
                        ${mode.icon}
                    </span>
                    <span class="awtaar-plate-mode-label"></span>
                `


                button.addEventListener(
                    'click',
                    () => {
                        this.setMode(
                            mode.id
                        )
                    }
                )


                this.modePanel.appendChild(
                    button
                )

                this.modeButtons[
                    mode.id
                ] =
                    button
            }
        )


        this.container.appendChild(
            this.modePanel
        )


        /*
         * =================================================
         * CONVERGENT SUB PANEL
         * =================================================
         */

        this.convergentPanel =
            document.createElement('div')

        this.convergentPanel.className =
            'awtaar-plate-convergent-panel'


        this.convergentPanelTitle =
            document.createElement('div')

        this.convergentPanelTitle.className =
            'awtaar-plate-convergent-title'


        this.convergentPanel.appendChild(
            this.convergentPanelTitle
        )


        const convergentTypes = [
            {
                id: 'trench',
                icon: '⌄'
            },
            {
                id: 'earthquake',
                icon: '≈'
            },
            {
                id: 'mountains',
                icon: '△'
            }
        ]


        convergentTypes.forEach(
            type => {

                const button =
                    document.createElement(
                        'button'
                    )

                button.type =
                    'button'

                button.className =
                    'awtaar-plate-convergent-button'

                button.dataset.type =
                    type.id

                button.innerHTML = `
                    <span class="awtaar-plate-convergent-icon">
                        ${type.icon}
                    </span>
                    <span class="awtaar-plate-convergent-label"></span>
                `


                button.addEventListener(
                    'click',
                    () => {

                        this.setConvergentType(
                            type.id
                        )
                    }
                )


                this.convergentPanel.appendChild(
                    button
                )

                this.convergentButtons[
                    type.id
                ] =
                    button
            }
        )


        this.container.appendChild(
            this.convergentPanel
        )


        /*
         * Information panel.
         */

        this.infoPanel =
            document.createElement('div')

        this.infoPanel.className =
            'awtaar-plate-info'


        this.infoTitle =
            document.createElement('div')

        this.infoText =
            document.createElement('div')


        this.infoPanel.appendChild(
            this.infoTitle
        )

        this.infoPanel.appendChild(
            this.infoText
        )


        this.container.appendChild(
            this.infoPanel
        )


        /*
         * Controls.
         */

        this.controls =
            document.createElement('div')

        this.controls.className =
            'awtaar-plate-controls'


        this.toggleButton =
            document.createElement('button')

        this.toggleButton.className =
            'awtaar-plate-control'


        this.toggleButton.addEventListener(
            'click',
            () => this.toggle()
        )


        this.resetButton =
            document.createElement('button')

        this.resetButton.className =
            'awtaar-plate-control'


        this.resetButton.addEventListener(
            'click',
            () => this.reset()
        )


        this.controls.appendChild(
            this.toggleButton
        )

        this.controls.appendChild(
            this.resetButton
        )


        this.container.appendChild(
            this.controls
        )


        /*
         * Exit.
         */

        this.exitButton =
            document.createElement('button')

        this.exitButton.className =
            'awtaar-plate-exit'


        this.exitButton.addEventListener(
            'click',
            () => this.exitExperiment()
        )


        this.container.appendChild(
            this.exitButton
        )
    }


    /* =====================================================
       LANGUAGE
       ===================================================== */

    updateLanguage() {

        this.language =
            getLanguage() || 'ar'


        this.container.setAttribute(
            'dir',
            this.language === 'ar'
                ? 'rtl'
                : 'ltr'
        )


        this.title.textContent =
            this.getText(
                'title',
                'حركة الصفائح التكتونية',
                'Plate Tectonics'
            )


        this.description.textContent =
            this.getText(
                'description',
                'استكشف كيف تتحرك الصفائح التكتونية وتعيد تشكيل سطح الأرض.',
                'Explore how tectonic plates move and reshape Earth.'
            )


        const labels = {

            divergent:
                this.getText(
                    'divergent',
                    'تباعد الصفائح',
                    'Divergent'
                ),

            convergent:
                this.getText(
                    'convergent',
                    'تقارب الصفائح',
                    'Convergent'
                ),

            transform:
                this.getText(
                    'transform',
                    'الانزلاق التحويلي',
                    'Transform'
                )
        }


        Object.keys(
            this.modeButtons
        ).forEach(
            id => {

                const label =
                    this.modeButtons[id]
                        .querySelector(
                            '.awtaar-plate-mode-label'
                        )

                if (label) {
                    label.textContent =
                        labels[id]
                }
            }
        )


        /*
         * Convergent labels.
         */

        this.convergentPanelTitle.textContent =
            this.getText(
                'convergentChoose',
                'نتيجة التقارب',
                'Convergence Result'
            )


        const convergentLabels = {

            trench:
                this.getText(
                    'trench',
                    'خندق',
                    'Trench'
                ),

            earthquake:
                this.getText(
                    'earthquake',
                    'زلزال',
                    'Earthquake'
                ),

            mountains:
                this.getText(
                    'mountains',
                    'جبال',
                    'Mountains'
                )
        }


        Object.keys(
            this.convergentButtons
        ).forEach(
            id => {

                const label =
                    this.convergentButtons[id]
                        .querySelector(
                            '.awtaar-plate-convergent-label'
                        )

                if (label) {
                    label.textContent =
                        convergentLabels[id]
                }
            }
        )


        this.toggleButton.textContent =
            this.isRunning
                ? this.getText(
                    'pause',
                    'إيقاف',
                    'Pause'
                )
                : this.getText(
                    'continue',
                    'استمرار',
                    'Continue'
                )


        this.resetButton.textContent =
            this.getText(
                'reset',
                'إعادة التجربة',
                'Reset'
            )


        this.exitButton.textContent =
            this.getText(
                'exit',
                'العودة إلى عالم الجيولوجيا',
                'Back to Geology'
            )


        this.updateConvergentButtons()

        this.updateInfo()
    }


    getText(
        key,
        arabic,
        english
    ) {

        try {

            const value =
                t(
                    `plateTectonics.${key}`
                )

            if (
                value &&
                value !==
                    `plateTectonics.${key}`
            ) {

                return value
            }

        } catch (error) {
            // fallback
        }


        return this.language === 'ar'
            ? arabic
            : english
    }


    /* =====================================================
       MODE
       ===================================================== */

    setMode(mode) {

        if (
            ![
                'divergent',
                'convergent',
                'transform'
            ].includes(mode)
        ) {
            return
        }


        this.currentMode =
            mode

        this.modeTime =
            0

        this.plateOffset =
            0

        this.earthquakeTime =
            0

        this.convergencePressure =
            0

        this.earthquakePhase =
            'idle'

        this.earthquakeReleaseTime =
            0

        this.cameraShake =
            0


        this.applyMode()


        Object.keys(
            this.modeButtons
        ).forEach(
            id => {

                this.modeButtons[id]
                    .classList.toggle(
                        'active',
                        id === mode
                    )
            }
        )


        this.updateConvergentButtons()

        this.updateInfo()
    }


    /* =====================================================
       CONVERGENT TYPE
       ===================================================== */

    setConvergentType(type) {

        if (
            ![
                'trench',
                'earthquake',
                'mountains'
            ].includes(type)
        ) {
            return
        }


        this.convergentType =
            type


        this.modeTime =
            0

        this.plateOffset =
            0

        this.earthquakeTime =
            0

        this.convergencePressure =
            0

        this.earthquakePhase =
            'idle'

        this.earthquakeReleaseTime =
            0

        this.cameraShake =
            0


        this.applyMode()

        this.updateConvergentButtons()

        this.updateInfo()
    }


    updateConvergentButtons() {

        if (
            !this.convergentPanel
        ) {
            return
        }


        const visible =
            this.currentMode ===
            'convergent'


        this.convergentPanel.classList.toggle(
            'visible',
            visible
        )


        Object.keys(
            this.convergentButtons
        ).forEach(
            id => {

                this.convergentButtons[id]
                    .classList.toggle(
                        'active',
                        visible &&
                        id ===
                            this.convergentType
                    )
            }
        )
    }


    /* =====================================================
       APPLY MODE
       ===================================================== */

    applyMode() {

        if (
            !this.leftPlate ||
            !this.rightPlate
        ) {
            return
        }


        /*
         * إعادة هندسة الصفائح إلى حالتها الأصلية.
         */

        this.resetMountainGeometry()


        /*
         * Reset plates.
         */

        this.leftPlate.position.set(
            -3.0,
            0.42,
            0
        )

        this.rightPlate.position.set(
            3.0,
            0.42,
            0
        )


        this.leftPlate.rotation.set(
            0,
            0,
            THREE.MathUtils.degToRad(-1.5)
        )

        this.rightPlate.rotation.set(
            0,
            0,
            THREE.MathUtils.degToRad(1.5)
        )


        this.leftCrust.position.set(
            -3.0,
            0.76,
            0
        )

        this.rightCrust.position.set(
            3.0,
            0.76,
            0
        )


        this.leftCrust.rotation.set(
            0,
            0,
            0
        )

        this.rightCrust.rotation.set(
            0,
            0,
            THREE.MathUtils.degToRad(1.5)
        )


        /*
         * Reset scales.
         */

        this.leftPlate.scale.set(
            1,
            1,
            1
        )

        this.rightPlate.scale.set(
            1,
            1,
            1
        )

        this.leftCrust.scale.set(
            1,
            1,
            1
        )

        this.rightCrust.scale.set(
            1,
            1,
            1
        )


        this.boundary.rotation.z =
            0

        this.boundaryGlow.rotation.z =
            0


        /*
         * Reset trench.
         */

        if (this.trench) {

            this.trench.visible =
                false

            this.trench.position.set(
                0,
                0,
                0
            )

            this.trench.scale.set(
                1,
                1,
                1
            )
        }


        /*
         * Reset subduction.
         */

        if (this.subductionPlate) {

            this.subductionPlate.visible =
                false

            this.subductionPlate.position.set(
                2.4,
                -0.45,
                0
            )

            this.subductionPlate.rotation.set(
                0,
                0,
                THREE.MathUtils.degToRad(13)
            )
        }


        if (this.subductionCrust) {

            this.subductionCrust.visible =
                false

            this.subductionCrust.position.set(
                2.4,
                -0.27,
                0
            )

            this.subductionCrust.rotation.set(
                0,
                0,
                THREE.MathUtils.degToRad(13)
            )
        }


        /*
         * Reset mountains.
         */

        this.mountains.forEach(
            mountain => {

                mountain.visible =
                    false

                mountain.scale.set(
                    0.001,
                    0.001,
                    0.001
                )
            }
        )


        /*
         * Reset earthquake.
         */

        if (this.faultLine) {

            this.faultLine.material.opacity =
                0
        }


        this.earthquakeWaves.forEach(
            wave => {

                wave.visible =
                    false

                wave.material.opacity =
                    0

                wave.scale.set(
                    0.001,
                    0.001,
                    0.001
                )

                wave.userData.active =
                    false
            }
        )


        /*
         * =================================================
         * DIVERGENT
         * =================================================
         */

        if (
            this.currentMode ===
            'divergent'
        ) {

            this.boundary.material.color
                .set(0xff9a45)

            this.boundary.material.opacity =
                0.62

            this.boundaryGlow.material.opacity =
                0.1
        }


        /*
         * =================================================
         * CONVERGENT
         * =================================================
         */

        if (
            this.currentMode ===
            'convergent'
        ) {

            this.boundary.material.color
                .set(0xff6130)

            this.boundary.material.opacity =
                0.45

            this.boundaryGlow.material.opacity =
                0.08


            /*
             * ---------------------------------------------
             * TRENCH
             * ---------------------------------------------
             */

            if (
                this.convergentType ===
                'trench'
            ) {

                this.createOrShowTrench()


                if (
                    this.subductionPlate
                ) {

                    this.subductionPlate.visible =
                        true
                }


                if (
                    this.subductionCrust
                ) {

                    this.subductionCrust.visible =
                        true
                }
            }


            /*
             * ---------------------------------------------
             * EARTHQUAKE
             * ---------------------------------------------
             */

            if (
                this.convergentType ===
                'earthquake'
            ) {

                if (this.faultLine) {

                    this.faultLine.material.opacity =
                        0.22
                }

                this.boundary.material.color
                    .set(0xd8a15e)

                this.boundary.material.opacity =
                    0.25
            }


            /*
             * ---------------------------------------------
             * MOUNTAINS
             * ---------------------------------------------
             */

            if (
                this.convergentType ===
                'mountains'
            ) {

                this.boundary.material.color
                    .set(0xc98b52)

                this.boundary.material.opacity =
                    0.2

                this.boundaryGlow.material.opacity =
                    0.045


                this.mountains.forEach(
                    mountain => {

                        mountain.visible =
                            true
                    }
                )
            }
        }


        /*
         * =================================================
         * TRANSFORM
         * =================================================
         */

        if (
            this.currentMode ===
            'transform'
        ) {

            this.boundary.material.color
                .set(0xe8c38c)

            this.boundary.material.opacity =
                0.25

            this.boundaryGlow.material.opacity =
                0.035
        }


        this.updateConvergentButtons()
    }


    /* =====================================================
       TRENCH
       ===================================================== */

    createOrShowTrench() {

        if (this.trench) {

            this.trench.visible =
                true

            return
        }


        this.trench =
            new THREE.Group()

        this.trench.name =
            'SubductionTrench'


        /*
         * قاع الخندق.
         */

        const floorGeometry =
            new THREE.BoxGeometry(
                0.72,
                0.075,
                4.9
            )

        const floorMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x100907,
                roughness: 1,
                metalness: 0
            })


        this.trenchFloor =
            new THREE.Mesh(
                floorGeometry,
                floorMaterial
            )

        this.trenchFloor.position.set(
            0.32,
            0.455,
            0
        )

        this.trench.add(
            this.trenchFloor
        )


        /*
         * الحافة اليسرى.
         */

        const edgeGeometry =
            new THREE.BoxGeometry(
                0.13,
                0.035,
                4.95
            )

        const edgeMaterialLeft =
            new THREE.MeshBasicMaterial({
                color: 0x8b4b28,
                transparent: true,
                opacity: 0.42
            })


        this.trenchEdgeLeft =
            new THREE.Mesh(
                edgeGeometry,
                edgeMaterialLeft
            )

        this.trenchEdgeLeft.position.set(
            -0.12,
            0.49,
            0
        )

        this.trench.add(
            this.trenchEdgeLeft
        )


        /*
         * الحافة اليمنى.
         */

        const edgeMaterialRight =
            new THREE.MeshBasicMaterial({
                color: 0x5b301c,
                transparent: true,
                opacity: 0.52
            })


        this.trenchEdgeRight =
            new THREE.Mesh(
                edgeGeometry.clone(),
                edgeMaterialRight
            )

        this.trenchEdgeRight.position.set(
            0.72,
            0.47,
            0
        )

        this.trench.add(
            this.trenchEdgeRight
        )


        /*
         * الظل الداخلي.
         */

        const shadowGeometry =
            new THREE.PlaneGeometry(
                0.48,
                4.7
            )

        const shadowMaterial =
            new THREE.MeshBasicMaterial({
                color: 0x050303,
                transparent: true,
                opacity: 0.72,
                side: THREE.DoubleSide
            })


        this.trenchShadow =
            new THREE.Mesh(
                shadowGeometry,
                shadowMaterial
            )

        this.trenchShadow.rotation.x =
            -Math.PI / 2

        this.trenchShadow.position.set(
            0.35,
            0.492,
            0
        )

        this.trench.add(
            this.trenchShadow
        )


        this.scene.add(
            this.trench
        )
    }


    /* =====================================================
       INFO
       ===================================================== */

    updateInfo() {

        const data = {

            divergent: {

                title:
                    this.getText(
                        'divergentTitle',
                        'تباعد الصفائح',
                        'Divergent Boundary'
                    ),

                text:
                    this.getText(
                        'divergentDescription',
                        'تتحرك الصفائح بعيدًا عن بعضها، فتندفع الصهارة إلى الأعلى وتتشكل قشرة جديدة.',
                        'The plates move apart, allowing magma to rise and create new crust.'
                    )
            },


            convergent: {

                title:
                    this.getText(
                        this.convergentType ===
                            'trench'
                            ? 'trenchTitle'
                            : this.convergentType ===
                              'earthquake'
                                ? 'earthquakeTitle'
                                : 'mountainsTitle',

                        this.convergentType ===
                            'trench'
                            ? 'الخندق المحيطي'
                            : this.convergentType ===
                              'earthquake'
                                ? 'الزلازل'
                                : 'تشكّل الجبال',

                        this.convergentType ===
                            'trench'
                            ? 'Ocean Trench'
                            : this.convergentType ===
                              'earthquake'
                                ? 'Earthquake'
                                : 'Mountain Formation'
                    ),

                text:
                    this.getText(
                        this.convergentType ===
                            'trench'
                            ? 'trenchDescription'
                            : this.convergentType ===
                              'earthquake'
                                ? 'earthquakeDescription'
                                : 'mountainsDescription',

                        this.convergentType ===
                            'trench'
                            ? 'تنغمس إحدى الصفائح أسفل الأخرى، فتتشكل منطقة اندساس وخندق محيطي.'
                            : this.convergentType ===
                              'earthquake'
                                ? 'تتراكم الضغوط بين الصفائح حتى يحدث انزلاق مفاجئ يحرر الطاقة على شكل موجات زلزالية.'
                                : 'تصطدم الصفائح القارية وتضغط القشرة، فترتفع الصخور تدريجيًا وتتكون السلاسل الجبلية.',

                        this.convergentType ===
                            'trench'
                            ? 'One plate subducts beneath the other, forming a subduction zone and an ocean trench.'
                            : this.convergentType ===
                              'earthquake'
                                ? 'Stress builds between the plates until a sudden slip releases energy as seismic waves.'
                                : 'Continental plates collide and compress the crust, gradually uplifting rocks into mountain ranges.'
                    )
            },


            transform: {

                title:
                    this.getText(
                        'transformTitle',
                        'الانزلاق التحويلي',
                        'Transform Boundary'
                    ),

                text:
                    this.getText(
                        'transformDescription',
                        'تنزلق الصفائح أفقيًا بمحاذاة بعضها، وقد يؤدي احتكاكها إلى حدوث الزلازل.',
                        'The plates slide horizontally past each other, and friction can generate earthquakes.'
                    )
            }
        }


        const current =
            data[this.currentMode]


        this.infoTitle.textContent =
            current.title

        this.infoText.textContent =
            current.text
    }


    /* =====================================================
       UPDATE
       ===================================================== */

    update(delta = 0.016) {

        if (
            this.destroyed ||
            !this.isVisible
        ) {
            return
        }


        if (this.isRunning) {

            this.elapsed += delta

            this.modeTime += delta


            this.animatePlates(
                delta
            )

            this.animateMagma(
                delta
            )

            this.animateEarthquake(
                delta
            )

            this.animateMountains(
                delta
            )

            this.animateEnvironment(
                delta
            )
        }


        this.renderer.render(
            this.scene,
            this.camera
        )
    }


    /* =====================================================
       PLATE ANIMATION
       ===================================================== */

    animatePlates(delta) {

        const speed =
            0.45


        this.plateOffset =
            Math.sin(
                this.modeTime *
                    speed
            ) * 0.75


        /*
         * =================================================
         * DIVERGENT
         * =================================================
         */

        if (
            this.currentMode ===
            'divergent'
        ) {

            const offset =
                Math.abs(
                    this.plateOffset
                )


            this.leftPlate.position.x =
                -3.0 -
                offset

            this.rightPlate.position.x =
                3.0 +
                offset


            this.leftCrust.position.x =
                this.leftPlate.position.x

            this.rightCrust.position.x =
                this.rightPlate.position.x


            this.boundary.scale.x =
                0.85 +
                Math.sin(
                    this.modeTime * 2
                ) * 0.12

            return
        }


        /*
         * =================================================
         * CONVERGENT
         * =================================================
         */

        if (
            this.currentMode ===
            'convergent'
        ) {

            /*
             * ---------------------------------------------
             * TRENCH
             * ---------------------------------------------
             */

            if (
                this.convergentType ===
                'trench'
            ) {

                const offset =
                    Math.abs(
                        this.plateOffset
                    )


                this.leftPlate.position.x =
                    -3.0 +
                    offset

                this.rightPlate.position.x =
                    3.0 -
                    offset


                this.leftPlate.position.y =
                    0.42 +
                    offset * 0.025

                this.rightPlate.position.y =
                    0.42 -
                    offset * 0.10


                const subductionAngle =
                    THREE.MathUtils.degToRad(
                        1.5 +
                        offset * 15
                    )


                this.rightPlate.rotation.z =
                    subductionAngle


                this.leftCrust.position.x =
                    this.leftPlate.position.x

                this.rightCrust.position.x =
                    this.rightPlate.position.x


                this.leftCrust.position.y =
                    0.76 +
                    offset * 0.025

                this.rightCrust.position.y =
                    0.76 -
                    offset * 0.10


                this.rightCrust.rotation.z =
                    subductionAngle


                if (
                    this.subductionPlate
                ) {

                    const depth =
                        offset * 1.45

                    const forward =
                        offset * 0.85


                    this.subductionPlate.position.x =
                        2.4 -
                        forward

                    this.subductionPlate.position.y =
                        -0.45 -
                        depth

                    this.subductionPlate.rotation.z =
                        THREE.MathUtils.degToRad(
                            13 +
                            offset * 10
                        )
                }


                if (
                    this.subductionCrust
                ) {

                    const depth =
                        offset * 1.45

                    const forward =
                        offset * 0.85


                    this.subductionCrust.position.x =
                        2.4 -
                        forward

                    this.subductionCrust.position.y =
                        -0.27 -
                        depth

                    this.subductionCrust.rotation.z =
                        THREE.MathUtils.degToRad(
                            13 +
                            offset * 10
                        )
                }


                if (this.trench) {

                    this.trench.position.x =
                        0.05 -
                        offset * 0.08
                }


                this.boundary.scale.x =
                    1.0 -
                    offset * 0.22

                return
            }


            /*
             * ---------------------------------------------
             * EARTHQUAKE
             * ---------------------------------------------
             */

            if (
                this.convergentType ===
                'earthquake'
            ) {

                this.animateEarthquakePlates()

                return
            }


            /*
             * ---------------------------------------------
             * MOUNTAINS
             * ---------------------------------------------
             */

            if (
                this.convergentType ===
                'mountains'
            ) {

                this.animateMountainPlates()

                return
            }
        }


        /*
         * =================================================
         * TRANSFORM
         * =================================================
         */

        if (
            this.currentMode ===
            'transform'
        ) {

            const shift =
                Math.sin(
                    this.modeTime * 0.55
                ) * 0.8


            this.leftPlate.position.z =
                shift

            this.rightPlate.position.z =
                -shift


            this.leftCrust.position.z =
                shift

            this.rightCrust.position.z =
                -shift


            const earthquake =
                Math.sin(
                    this.modeTime * 8
                ) * 0.025


            this.leftPlate.rotation.y =
                earthquake

            this.rightPlate.rotation.y =
                -earthquake
        }


        /*
         * Geological breathing.
         */

        this.innerMantle.scale.y =
            1 +
            Math.sin(
                this.modeTime * 0.8
            ) * 0.018
    }


    /* =====================================================
       EARTHQUAKE PLATE ANIMATION
       ===================================================== */

    animateEarthquakePlates() {

        /*
         * المرحلة الأولى:
         * ضغط بطيء وتراكم الإجهاد.
         */

        if (
            this.modeTime <
            3.8
        ) {

            this.earthquakePhase =
                'pressure'


            const progress =
                THREE.MathUtils.clamp(
                    this.modeTime / 3.8,
                    0,
                    1
                )


            this.convergencePressure =
                progress


            const compression =
                progress * 0.72


            this.leftPlate.position.x =
                -3.0 +
                compression

            this.rightPlate.position.x =
                3.0 -
                compression


            this.leftCrust.position.x =
                this.leftPlate.position.x

            this.rightCrust.position.x =
                this.rightPlate.position.x


            /*
             * القشرة تنضغط قليلًا.
             */

            this.leftPlate.scale.x =
                1 +
                progress * 0.045

            this.rightPlate.scale.x =
                1 +
                progress * 0.045


            this.leftCrust.scale.x =
                1 +
                progress * 0.045

            this.rightCrust.scale.x =
                1 +
                progress * 0.045


            if (this.faultLine) {

                this.faultLine.material.opacity =
                    0.16 +
                    progress * 0.26
            }


            this.boundaryGlow.material.opacity =
                0.045 +
                progress * 0.035

            return
        }


        /*
         * المرحلة الثانية:
         * الانزلاق المفاجئ.
         */

        if (
            this.modeTime <
            5.3
        ) {

            this.earthquakePhase =
                'release'


            this.earthquakeReleaseTime =
                this.modeTime -
                3.8


            const release =
                THREE.MathUtils.clamp(
                    this.earthquakeReleaseTime /
                        1.5,
                    0,
                    1
                )


            const slip =
                Math.sin(
                    release * Math.PI
                ) * 0.48


            this.leftPlate.position.x =
                -2.28 -
                slip

            this.rightPlate.position.x =
                2.28 +
                slip


            this.leftCrust.position.x =
                this.leftPlate.position.x

            this.rightCrust.position.x =
                this.rightPlate.position.x


            const vibration =
                Math.sin(
                    this.earthquakeReleaseTime *
                        31
                ) *
                (1 - release) *
                0.08


            this.leftPlate.position.z =
                vibration

            this.rightPlate.position.z =
                -vibration


            this.leftCrust.position.z =
                vibration

            this.rightCrust.position.z =
                -vibration


            this.leftPlate.rotation.y =
                vibration * 0.75

            this.rightPlate.rotation.y =
                -vibration * 0.75


            this.cameraShake =
                (1 - release) *
                0.045


            if (this.faultLine) {

                this.faultLine.material.opacity =
                    0.35 +
                    Math.sin(
                        this.elapsed * 30
                    ) * 0.16
            }


            return
        }


        /*
         * المرحلة الثالثة:
         * الاستقرار بعد الزلزال.
         */

        this.earthquakePhase =
            'settled'


        const settle =
            Math.min(
                (this.modeTime - 5.3) /
                    1.4,
                1
            )


        this.leftPlate.position.x =
            THREE.MathUtils.lerp(
                -2.28,
                -2.38,
                settle
            )

        this.rightPlate.position.x =
            THREE.MathUtils.lerp(
                2.28,
                2.38,
                settle
            )


        this.leftCrust.position.x =
            this.leftPlate.position.x

        this.rightCrust.position.x =
            this.rightPlate.position.x


        this.leftPlate.position.z =
            THREE.MathUtils.lerp(
                this.leftPlate.position.z,
                0,
                0.12
            )

        this.rightPlate.position.z =
            THREE.MathUtils.lerp(
                this.rightPlate.position.z,
                0,
                0.12
            )


        this.leftPlate.rotation.y =
            THREE.MathUtils.lerp(
                this.leftPlate.rotation.y,
                0,
                0.12
            )

        this.rightPlate.rotation.y =
            THREE.MathUtils.lerp(
                this.rightPlate.rotation.y,
                0,
                0.12
            )


        this.cameraShake =
            Math.max(
                0,
                this.cameraShake -
                    0.004
            )


        /*
         * تبدأ دورة جديدة بعد الاستقرار.
         */

        if (
            this.modeTime >
            8.5
        ) {

            this.modeTime =
                0

            this.earthquakePhase =
                'idle'

            this.earthquakeTime =
                0

            this.convergencePressure =
                0


            this.leftPlate.scale.x =
                1

            this.rightPlate.scale.x =
                1

            this.leftCrust.scale.x =
                1

            this.rightCrust.scale.x =
                1


            this.earthquakeWaves.forEach(
                wave => {

                    wave.visible =
                        false

                    wave.material.opacity =
                        0

                    wave.scale.set(
                        0.001,
                        0.001,
                        0.001
                    )
                }
            )
        }
    }


    /* =====================================================
       MOUNTAIN PLATE ANIMATION
       ===================================================== */

    animateMountainPlates() {

        /*
         * =================================================
         * التصادم القاري الحقيقي بصريًا
         * =================================================
         *
         * لا نرفع الصفيحتين بالكامل.
         *
         * الحركة تكون:
         *
         * 1. الصفائح تتحرك نحو بعضها.
         *
         * 2. الحد الداخلي للصفيحة اليسرى يقترب
         *    من الحد الداخلي للصفيحة اليمنى.
         *
         * 3. عند التقاء الحدين يبدأ الضغط.
         *
         * 4. منطقة الالتقاء نفسها تنثني إلى الأعلى.
         *
         * 5. الأجزاء البعيدة من الصفائح تبقى
         *    قريبة من مستواها الأصلي.
         *
         * بهذه الطريقة لا يظهر V هابط.
         */

        const progress =
            THREE.MathUtils.clamp(
                this.modeTime / 7.0,
                0,
                1
            )


        const smooth =
            THREE.MathUtils.smoothstep(
                progress,
                0,
                1
            )


        /*
         * =================================================
         * التقارب الأفقي
         * =================================================
         *
         * الصفيحتان تقتربان فقط بما يكفي
         * حتى تلتقي الحافتان الداخليتان.
         *
         * عرض الصفيحة = 5.4
         * نصف العرض = 2.7
         *
         * عند مركز الصفيحة ±2.7
         * تكون الحواف عند منطقة الصفر تقريبًا.
         */

        const compression =
            smooth * 0.42


        this.leftPlate.position.x =
            -3.0 +
            compression

        this.rightPlate.position.x =
            3.0 -
            compression


        /*
         * القشرة تتحرك مع الصفائح.
         */

        this.leftCrust.position.x =
            this.leftPlate.position.x

        this.rightCrust.position.x =
            this.rightPlate.position.x


        /*
         * =================================================
         * لا يوجد دوران إضافي
         * =================================================
         *
         * هذا مهم جدًا.
         *
         * الدوران السابق كان يجعل الحافتين الداخليتين
         * تنزلان بصريًا وتنتج V.
         *
         * لذلك نبقيهما شبه أفقيتين.
         */

        this.leftPlate.rotation.z =
            0

        this.rightPlate.rotation.z =
            0

        this.leftCrust.rotation.z =
            0

        this.rightCrust.rotation.z =
            0


        /*
         * =================================================
         * ضغط التصادم
         * =================================================
         *
         * يبدأ بعد أن تقترب الصفائح من بعضها.
         *
         * في البداية:
         * لا يوجد ارتفاع تقريبًا.
         *
         * في النهاية:
         * يرتفع مركز التصادم بوضوح.
         */

        const collisionProgress =
            THREE.MathUtils.clamp(
                (
                    smooth -
                    0.22
                ) /
                0.78,
                0,
                1
            )


        const collisionSmooth =
            THREE.MathUtils.smoothstep(
                collisionProgress,
                0,
                1
            )


        /*
         * مقدار انثناء سطح الصفيحة.
         *
         * هذا ليس translation.
         *
         * إنه deformation فعلي للـvertices.
         */

        const upliftStrength =
            Math.pow(
                collisionSmooth,
                1.18
            ) * 0.72


        this.mountainDeformationStrength =
            upliftStrength


        /*
         * =================================================
         * تشويه الصفيحة اليسرى
         * =================================================
         */

        this.deformMountainSurface(
            this.leftPlate,
            this.mountainSurfaceOriginals.left,
            'left',
            upliftStrength,
            0
        )


        /*
         * =================================================
         * تشويه الصفيحة اليمنى
         * =================================================
         */

        this.deformMountainSurface(
            this.rightPlate,
            this.mountainSurfaceOriginals.right,
            'right',
            upliftStrength,
            0
        )


        /*
         * =================================================
         * تشويه القشرة
         * =================================================
         *
         * القشرة ترتفع أكثر وضوحًا من جسم الصفيحة،
         * لأنها تمثل الجزء السطحي الذي تتشكل منه
         * السلاسل الجبلية.
         */

        const crustUplift =
            upliftStrength * 1.08


        this.deformMountainSurface(
            this.leftCrust,
            this.mountainCrustOriginals.left,
            'left',
            crustUplift,
            0
        )


        this.deformMountainSurface(
            this.rightCrust,
            this.mountainCrustOriginals.right,
            'right',
            crustUplift,
            0
        )


        /*
         * =================================================
         * ارتفاع مركزي إضافي صغير
         * =================================================
         *
         * ليس رفعًا للصفيحة كلها.
         *
         * هذا فقط يضيف إحساسًا بتراكم الضغط
         * في اللحظة التي تتلامس فيها الحدود.
         */

        const centralRise =
            Math.pow(
                collisionSmooth,
                1.4
            ) * 0.08


        this.leftPlate.position.y =
            0.42 +
            centralRise * 0.18

        this.rightPlate.position.y =
            0.42 +
            centralRise * 0.18


        this.leftCrust.position.y =
            0.76 +
            centralRise * 0.3

        this.rightCrust.position.y =
            0.76 +
            centralRise * 0.3


        /*
         * =================================================
         * ضغط الحدود
         * =================================================
         */

        this.boundary.scale.x =
            1 -
            collisionSmooth * 0.55


        this.boundaryGlow.scale.x =
            1 +
            collisionSmooth * 0.18
    }


    /* =====================================================
       EARTHQUAKE WAVES
       ===================================================== */

    animateEarthquake() {

        if (
            this.currentMode !==
            'convergent' ||
            this.convergentType !==
            'earthquake'
        ) {

            this.cameraShake =
                0

            return
        }


        /*
         * تبدأ الموجات لحظة الانزلاق.
         */

        if (
            this.earthquakePhase ===
            'release'
        ) {

            const releaseTime =
                this.earthquakeReleaseTime


            this.earthquakeWaves.forEach(
                wave => {

                    const local =
                        releaseTime -
                        wave.userData.delay


                    if (
                        local < 0
                    ) {

                        wave.visible =
                            false

                        return
                    }


                    if (
                        local >
                        wave.userData.duration
                    ) {

                        wave.visible =
                            false

                        wave.material.opacity =
                            0

                        return
                    }


                    wave.visible =
                        true


                    const progress =
                        THREE.MathUtils.clamp(
                            local /
                                wave.userData.duration,
                            0,
                            1
                        )


                    const scale =
                        THREE.MathUtils.lerp(
                            0.08,
                            4.8,
                            progress
                        )


                    wave.scale.set(
                        scale,
                        scale,
                        scale
                    )


                    wave.material.opacity =
                        0.52 *
                        (1 - progress)
                }
            )
        }


        /*
         * اهتزاز الكاميرا.
         */

        if (
            this.cameraShake >
            0
        ) {

            const shake =
                this.cameraShake


            this.camera.position.x =
                Math.sin(
                    this.elapsed * 48
                ) *
                shake

            this.camera.position.y =
                5.5 +
                Math.cos(
                    this.elapsed * 42
                ) *
                shake * 0.55


            this.camera.lookAt(
                0,
                0,
                0

            )

        } else {

            this.camera.position.x =
                0

            this.camera.position.y =
                5.5


            this.camera.lookAt(
                0,
                0,
                0
            )
        }
    }


    /* =====================================================
       MAGMA ANIMATION
       ===================================================== */

    animateMagma(delta) {

        this.magmaParticles.forEach(
            particle => {

                particle.position.y +=
                    particle.userData.speed *
                    delta


                particle.position.x +=
                    Math.sin(
                        this.elapsed * 1.4 +
                        particle.userData.phase
                    ) *
                    0.0015


                if (
                    particle.position.y >
                    0.9
                ) {

                    particle.position.y =
                        -2.8 -
                        Math.random() * 0.5


                    particle.position.x =
                        (
                            Math.random() -
                            0.5
                        ) * 0.9


                    particle.position.z =
                        (
                            Math.random() -
                            0.5
                        ) * 3.8
                }


                /*
                 * التباعد + الخندق.
                 * الزلزال والجبال بدون صهارة
                 * حتى تكون الحالات بصريًا واضحة.
                 */

                particle.visible =
                    this.currentMode ===
                        'divergent' ||
                    (
                        this.currentMode ===
                        'convergent' &&
                        this.convergentType ===
                        'trench'
                    )
            }
        )
    }


    /* =====================================================
       MOUNTAIN ANIMATION
       ===================================================== */

    animateMountains() {

        if (
            this.currentMode !==
                'convergent' ||
            this.convergentType !==
                'mountains'
        ) {

            return
        }


        const elapsed =
            this.modeTime


        this.mountains.forEach(
            mountain => {

                if (
                    !mountain.visible
                ) {
                    return
                }


                const localProgress =
                    THREE.MathUtils.clamp(
                        (
                            elapsed -
                            mountain.userData.delay
                        ) / 5.8,
                        0,
                        1
                    )


                const smooth =
                    THREE.MathUtils.smoothstep(
                        localProgress,
                        0,
                        1
                    )


                const target =
                    mountain.userData.targetScale


                const scale =
                    Math.max(
                        0.001,
                        smooth * target
                    )


                mountain.scale.set(
                    scale,
                    scale,
                    scale
                )


                /*
                 * ارتفاع بسيط نابض بعد اكتمال التكوين.
                 */

                if (
                    localProgress >= 1
                ) {

                    mountain.position.y =
                        mountain.userData.baseY +
                        Math.sin(
                            this.elapsed * 0.65 +
                            mountain.position.x
                        ) *
                        0.006
                }
            }
        )
    }


    /* =====================================================
       ENVIRONMENT ANIMATION
       ===================================================== */

    animateEnvironment() {

        if (
            this.boundaryGlow
        ) {

            let opacity =
                0.025


            if (
                this.currentMode ===
                'divergent'
            ) {

                opacity =
                    0.065 +
                    Math.sin(
                        this.elapsed * 2
                    ) * 0.025
            }


            if (
                this.currentMode ===
                'convergent'
            ) {

                if (
                    this.convergentType ===
                    'trench'
                ) {

                    opacity =
                        0.05 +
                        Math.sin(
                            this.elapsed * 2.5
                        ) * 0.02

                } else if (
                    this.convergentType ===
                    'earthquake'
                ) {

                    opacity =
                        0.035 +
                        Math.sin(
                            this.elapsed * 7
                        ) * 0.018

                } else {

                    opacity =
                        0.035 +
                        Math.sin(
                            this.elapsed * 1.5
                        ) * 0.012
                }
            }


            this.boundaryGlow.material.opacity =
                Math.max(
                    0.01,
                    opacity
                )
        }


        /*
         * الخندق.
         */

        if (
            this.trench &&
            this.currentMode ===
                'convergent' &&
            this.convergentType ===
                'trench'
        ) {

            const pulse =
                1 +
                Math.sin(
                    this.elapsed * 1.8
                ) * 0.025


            this.trench.scale.z =
                pulse
        }


        /*
         * جبال:
         * حركة دقيقة جدًا حتى لا تبدو كأنها
         * تتحرك من مكانها.
         */

        this.mountains.forEach(
            (mountain, index) => {

                if (
                    mountain.visible &&
                    this.currentMode ===
                        'convergent' &&
                    this.convergentType ===
                        'mountains'
                ) {

                    mountain.rotation.y =
                        Math.sin(
                            this.elapsed * 0.25 +
                            index
                        ) *
                        0.012
                }
            }
        )
    }


    /* =====================================================
       START
       ===================================================== */

    start() {

        if (this.destroyed) {
            return
        }


        this.isRunning =
            true

        this.updateLanguage()
    }


    /* =====================================================
       PAUSE
       ===================================================== */

    pause() {

        this.isRunning =
            false

        this.updateLanguage()
    }


    /* =====================================================
       TOGGLE
       ===================================================== */

    toggle() {

        if (
            this.isRunning
        ) {

            this.pause()

        } else {

            this.start()
        }
    }


    /* =====================================================
       RESET
       ===================================================== */

    reset() {

        this.modeTime =
            0

        this.elapsed =
            0

        this.plateOffset =
            0

        this.earthquakeTime =
            0

        this.convergencePressure =
            0

        this.earthquakePhase =
            'idle'

        this.earthquakeReleaseTime =
            0

        this.cameraShake =
            0


        this.resetMountainGeometry()


        this.applyMode()


        this.setMode(
            this.currentMode
        )
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


        this.isVisible =
            true

        this.container.classList.add(
            'visible'
        )


        this.start()


        if (
            !this.animationFrame
        ) {

            this.animate()
        }
    }


    /* =====================================================
       HIDE
       ===================================================== */

    hide() {

        this.isVisible =
            false

        this.isRunning =
            false

        this.container.classList.remove(
            'visible'
        )
    }


    /* =====================================================
       EXIT
       ===================================================== */

    exitExperiment() {

        this.hide()


        setTimeout(
            () => {

                if (
                    this.destroyed
                ) {
                    return
                }


                this.destroy()


                if (
                    this.geologyWorldUI &&
                    typeof this.geologyWorldUI.show ===
                        'function'
                ) {

                    this.geologyWorldUI.show()
                }

            },
            550
        )
    }


    /* =====================================================
       ANIMATION LOOP
       ===================================================== */

    animate() {

        if (
            this.destroyed
        ) {
            return
        }


        this.animationFrame =
            requestAnimationFrame(
                () => this.animate()
            )


        const delta =
            Math.min(
                this.clock.getDelta(),
                0.05
            )


        this.update(
            delta
        )
    }


    /* =====================================================
       RESIZE
       ===================================================== */

    handleResize() {

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
       SET SCENE
       ===================================================== */

    setScene(scene) {

        /*
         * متعمد:
         * التجربة تبقى معزولة عن المشهد الرئيسي.
         */

        return this
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

        this.isVisible =
            false

        this.isRunning =
            false


        if (
            this.animationFrame
        ) {

            cancelAnimationFrame(
                this.animationFrame
            )

            this.animationFrame =
                null
        }


        window.removeEventListener(
            'resize',
            this.handleResizeBound
        )


        this.scene.traverse(
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
                            material =>
                                material.dispose()
                        )

                    } else {

                        object.material.dispose()
                    }
                }
            }
        )


        if (
            this.renderer
        ) {

            this.renderer.dispose()


            if (
                this.renderer.domElement &&
                this.renderer.domElement.parentNode
            ) {

                this.renderer.domElement
                    .parentNode
                    .removeChild(
                        this.renderer.domElement
                    )
            }
        }


        if (
            this.container &&
            this.container.parentNode
        ) {

            this.container.parentNode
                .removeChild(
                    this.container
                )
        }


        this.plates = []

        this.magmaParticles = []

        this.boundaryParticles = []

        this.mountains = []

        this.earthquakeWaves = []


        this.mountainSurfaceOriginals =
            {
                left: null,
                right: null
            }

        this.mountainCrustOriginals =
            {
                left: null,
                right: null
            }


        this.scene =
            null

        this.camera =
            null

        this.renderer =
            null
    }
}