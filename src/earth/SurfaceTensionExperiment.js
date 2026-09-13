/* =========================================================
   AWTAAR — SURFACE TENSION EXPERIMENT
   تجربة التوتر السطحي
   ========================================================= */

import * as THREE from 'three'
import './SurfaceTensionExperiment.css'

import {
    t,
    getLanguage
} from '../locales/i18n.js'


export default class SurfaceTensionExperiment {

    /* =====================================================
       CONSTRUCTOR
       ===================================================== */

    constructor(
        scene = null,
        parent = null
    ) {

        /*
         * المشهد الأساسي
         */

        this.scene =
            scene

        this.parent =
            parent || document.body


        /*
         * العودة إلى عالم المياه
         */

        this.earthWorldUI =
            null


        /*
         * الحالة
         */

        this.visible =
            false

        this.running =
            true

        this.destroyed =
            false


        /*
         * الزمن
         */

        this.elapsed =
            0

        this.phaseElapsed =
            0


        /*
         * اللغة
         */

        this.language =
            getLanguage() || 'ar'


        /*
         * مراحل التجربة
         */

        this.phaseDurations = [
            6,
            7,
            8,
            8,
            9
        ]

        this.phaseNames = [
            'cohesion',
            'surface',
            'tension',
            'impact',
            'recovery'
        ]


        this.currentPhase =
            0

        this.completedPhases =
            new Set()


        /*
         * Three.js
         */

        this.experimentScene =
            new THREE.Scene()

        this.camera =
            null

        this.renderer =
            null

        this.canvas =
            null


        /*
         * المجموعات
         */

        this.environmentGroup =
            new THREE.Group()

        this.waterGroup =
            new THREE.Group()

        this.moleculeGroup =
            new THREE.Group()

        this.forceGroup =
            new THREE.Group()

        this.experimentObjectGroup =
            new THREE.Group()

        this.rippleGroup =
            new THREE.Group()


        this.experimentScene.add(
            this.environmentGroup
        )

        this.experimentScene.add(
            this.waterGroup
        )

        this.experimentScene.add(
            this.moleculeGroup
        )

        this.experimentScene.add(
            this.forceGroup
        )

        this.experimentScene.add(
            this.experimentObjectGroup
        )

        this.experimentScene.add(
            this.rippleGroup
        )


        /*
         * الماء
         */

        this.waterSurface =
            null

        this.waterMaterial =
            null

        this.waterGeometry =
            null


        /*
         * شبكة الجزيئات
         */

        this.molecules = []

        this.surfaceMolecules = []


        /*
         * القوى
         */

        this.forceLines = []


        /*
         * الجسم المؤثر
         */

        this.drop =
            null

        this.dropMaterial =
            null

        this.needle =
            null

        this.needleTip =
            null


        /*
         * التموجات
         */

        this.ripples = []


        /*
         * الضوء
         */

        this.ambientLight =
            null

        this.mainLight =
            null

        this.rimLight =
            null


        /*
         * واجهة المستخدم
         */

        this.rootElement =
            null

        this.titleElement =
            null

        this.descriptionElement =
            null

        this.phasePanel =
            null

        this.phaseKickerElement =
            null

        this.phaseTitleElement =
            null

        this.phaseDescriptionElement =
            null

        this.statusElement =
            null

        this.pauseButton =
            null

        this.resetButton =
            null

        this.exitButton =
            null

        this.phaseButtons = []


        /*
         * resize
         */

        this.resizeHandler =
            () => this.resize()


        window.addEventListener(
            'resize',
            this.resizeHandler
        )


        /*
         * البناء
         */

        this.createUI()

        this.createScene()

        this.createWater()

        this.createMolecules()

        this.createForces()

        this.createExperimentObjects()

        this.createLights()

        this.applyPhaseVisualState()
    }


    /* =====================================================
       TEXT
       ===================================================== */

    getText(
        key,
        fallback = ''
    ) {

        try {

            const value =
                t(key)

            if (
                typeof value === 'string' &&
                value.trim()
            ) {

                return value
            }

        } catch (error) {
            /*
             * fallback
             */
        }

        return fallback
    }


    /* =====================================================
       PHASE DATA
       ===================================================== */

    getPhaseData(index) {

        const data = [

            {
                kicker: '01',
                key: 'cohesion',

                fallback: {

                    ar: {
                        title:
                            'تماسك الجزيئات',

                        description:
                            'تتجاذب جزيئات الماء معًا بفضل قوى التماسك بين الجزيئات.'
                    },

                    en: {
                        title:
                            'Molecular Cohesion',

                        description:
                            'Water molecules attract one another through cohesive forces.'
                    }
                }
            },

            {
                kicker: '02',
                key: 'surface',

                fallback: {

                    ar: {
                        title:
                            'سطح الماء',

                        description:
                            'تتعرض الجزيئات الموجودة على السطح لقوى غير متوازنة تجعل سطح الماء مختلفًا عن داخله.'
                    },

                    en: {
                        title:
                            'The Water Surface',

                        description:
                            'Molecules at the surface experience unbalanced forces, making the surface different from the water below.'
                    }
                }
            },

            {
                kicker: '03',
                key: 'tension',

                fallback: {

                    ar: {
                        title:
                            'التوتر السطحي',

                        description:
                            'ينشأ التوتر السطحي من تماسك جزيئات الماء، فيجعل السطح يقاوم التمزق والتشوه.'
                    },

                    en: {
                        title:
                            'Surface Tension',

                        description:
                            'Surface tension arises from molecular cohesion, allowing the water surface to resist deformation.'
                    }
                }
            },

            {
                kicker: '04',
                key: 'impact',

                fallback: {

                    ar: {
                        title:
                            'تأثير الجسم على السطح',

                        description:
                            'عندما يلامس جسم صغير سطح الماء، ينحني السطح حوله بسبب التوتر السطحي.'
                    },

                    en: {
                        title:
                            'An Object Meets the Surface',

                        description:
                            'When a small object touches the water, the surface bends around it because of surface tension.'
                    }
                }
            },

            {
                kicker: '05',
                key: 'recovery',

                fallback: {

                    ar: {
                        title:
                            'استعادة السطح',

                        description:
                            'بعد زوال التأثير، تعيد قوى التماسك سطح الماء نحو حالته الأصلية وتنتشر التموجات.'
                    },

                    en: {
                        title:
                            'Surface Recovery',

                        description:
                            'After the disturbance ends, cohesive forces pull the surface back while ripples spread outward.'
                    }
                }
            }
        ]


        const item =
            data[index] || data[0]

        const arabic =
            this.language === 'ar'


        return {

            kicker:
                item.kicker,

            title:
                this.getText(
                    `waterWorld.experiment.surfaceTension.${item.key}.title`,
                    arabic
                        ? item.fallback.ar.title
                        : item.fallback.en.title
                ),

            description:
                this.getText(
                    `waterWorld.experiment.surfaceTension.${item.key}.description`,
                    arabic
                        ? item.fallback.ar.description
                        : item.fallback.en.description
                )
        }
    }


    /* =====================================================
       CREATE UI
       ===================================================== */

    createUI() {

        const arabic =
            this.language === 'ar'


        /*
         * الجذر
         */

        this.rootElement =
            document.createElement('section')

        this.rootElement.className =
            'awtaar-surface-tension-experiment'

        this.rootElement.dir =
            arabic
                ? 'rtl'
                : 'ltr'


        /*
         * الرأس
         */

        const header =
            document.createElement('div')

        header.className =
            'surface-tension-header'


        this.titleElement =
            document.createElement('h1')

        this.titleElement.className =
            'surface-tension-title'

        this.titleElement.textContent =
            this.getText(
                'waterWorld.experiment.surfaceTension.title',
                arabic
                    ? 'التوتر السطحي'
                    : 'Surface Tension'
            )


        this.descriptionElement =
            document.createElement('p')

        this.descriptionElement.className =
            'surface-tension-description'

        this.descriptionElement.textContent =
            this.getText(
                'waterWorld.experiment.surfaceTension.description',
                arabic
                    ? 'اكتشف كيف تجعل قوى التماسك بين جزيئات الماء سطحه يتصرف كأنه غشاء مرن.'
                    : 'Discover how cohesive forces between water molecules make the surface behave like an elastic film.'
            )


        header.appendChild(
            this.titleElement
        )

        header.appendChild(
            this.descriptionElement
        )


        /*
         * منطقة التجربة
         */

        const experimentArea =
            document.createElement('div')

        experimentArea.className =
            'surface-tension-experiment-area'


        /*
         * canvas
         */

        const canvasWrapper =
            document.createElement('div')

        canvasWrapper.className =
            'surface-tension-canvas-wrapper'


        this.canvas =
            document.createElement('canvas')

        this.canvas.className =
            'surface-tension-canvas'

        canvasWrapper.appendChild(
            this.canvas
        )


        /*
         * لوحة المرحلة
         */

        this.phasePanel =
            document.createElement('div')

        this.phasePanel.className =
            'surface-tension-phase-panel'


        this.phaseKickerElement =
            document.createElement('span')

        this.phaseKickerElement.className =
            'surface-tension-phase-kicker'


        this.phaseTitleElement =
            document.createElement('h2')

        this.phaseTitleElement.className =
            'surface-tension-phase-title'


        this.phaseDescriptionElement =
            document.createElement('p')

        this.phaseDescriptionElement.className =
            'surface-tension-phase-description'


        this.phasePanel.appendChild(
            this.phaseKickerElement
        )

        this.phasePanel.appendChild(
            this.phaseTitleElement
        )

        this.phasePanel.appendChild(
            this.phaseDescriptionElement
        )


        /*
         * مراحل التجربة
         */

        const phaseNavigation =
            document.createElement('div')

        phaseNavigation.className =
            'surface-tension-phase-navigation'


        this.phaseNames.forEach(
            (phaseName, index) => {

                const button =
                    document.createElement('button')

                button.type =
                    'button'

                button.className =
                    'surface-tension-phase-button'

                button.dataset.phase =
                    phaseName

                button.dataset.index =
                    String(index)


                const phaseData =
                    this.getPhaseData(index)

                button.textContent =
                    phaseData.title


                button.addEventListener(
                    'click',
                    () => {

                        this.goToPhase(
                            index
                        )
                    }
                )


                phaseNavigation.appendChild(
                    button
                )

                this.phaseButtons.push(
                    button
                )
            }
        )


        /*
         * منطقة التحكم
         */

        const footer =
            document.createElement('div')

        footer.className =
            'surface-tension-footer'


        this.statusElement =
            document.createElement('span')

        this.statusElement.className =
            'surface-tension-status'


        const controls =
            document.createElement('div')

        controls.className =
            'surface-tension-controls'


        this.pauseButton =
            document.createElement('button')

        this.pauseButton.type =
            'button'

        this.pauseButton.className =
            'surface-tension-control'


        this.resetButton =
            document.createElement('button')

        this.resetButton.type =
            'button'

        this.resetButton.className =
            'surface-tension-control'


        this.exitButton =
            document.createElement('button')

        this.exitButton.type =
            'button'

        this.exitButton.className =
            'surface-tension-exit'


        this.pauseButton.addEventListener(
            'click',
            () => {

                this.running =
                    !this.running

                this.updatePauseButton()
            }
        )


        this.resetButton.addEventListener(
            'click',
            () => {

                this.reset()
            }
        )


        this.exitButton.addEventListener(
            'click',
            () => {

                this.exit()
            }
        )


        controls.appendChild(
            this.pauseButton
        )

        controls.appendChild(
            this.resetButton
        )

        controls.appendChild(
            this.exitButton
        )


        footer.appendChild(
            this.statusElement
        )

        footer.appendChild(
            controls
        )


        /*
         * تركيب الواجهة
         */

        experimentArea.appendChild(
            canvasWrapper
        )

        experimentArea.appendChild(
            this.phasePanel
        )

        experimentArea.appendChild(
            phaseNavigation
        )


        this.rootElement.appendChild(
            header
        )

        this.rootElement.appendChild(
            experimentArea
        )

        this.rootElement.appendChild(
            footer
        )


        /*
         * الإضافة إلى الصفحة
         */

        this.parent.appendChild(
            this.rootElement
        )


        /*
         * تحديث أولي
         */

        this.updatePauseButton()

        this.updateUI()
    }


    /* =====================================================
       CREATE SCENE
       ===================================================== */

    createScene() {

        this.experimentScene.background =
            new THREE.Color(
                0x060711
            )


        /*
         * الكاميرا
         */

        const width =
            this.canvas.clientWidth || 900

        const height =
            this.canvas.clientHeight || 520


        this.camera =
            new THREE.PerspectiveCamera(
                42,
                width / height,
                0.1,
                100
            )

        this.camera.position.set(
            0,
            5.8,
            11.5
        )

        this.camera.lookAt(
            0,
            0,
            0
        )


        /*
         * renderer
         */

        this.renderer =
            new THREE.WebGLRenderer({
                canvas:
                    this.canvas,

                antialias:
                    true,

                alpha:
                    false,

                powerPreference:
                    'high-performance'
            })


        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio || 1,
                2
            )
        )

        this.renderer.setSize(
            width,
            height,
            false
        )

        this.renderer.outputColorSpace =
            THREE.SRGBColorSpace


        /*
         * الضباب
         */

        this.experimentScene.fog =
            new THREE.FogExp2(
                0x060711,
                0.035
            )


        /*
         * أرضية داكنة
         */

        const floorGeometry =
            new THREE.CircleGeometry(
                11,
                96
            )

        const floorMaterial =
            new THREE.MeshStandardMaterial({
                color:
                    0x090a12,

                roughness:
                    0.88,

                metalness:
                    0.08
            })

        const floor =
            new THREE.Mesh(
                floorGeometry,
                floorMaterial
            )

        floor.rotation.x =
            -Math.PI / 2

        floor.position.y =
            -1.35

        this.environmentGroup.add(
            floor
        )
    }


    /* =====================================================
       CREATE WATER
       ===================================================== */

    createWater() {

        const size =
            10

        const segments =
            70


        this.waterGeometry =
            new THREE.PlaneGeometry(
                size,
                size,
                segments,
                segments
            )


        this.waterMaterial =
            new THREE.MeshPhysicalMaterial({

                color:
                    0x173a50,

                roughness:
                    0.16,

                metalness:
                    0.12,

                transmission:
                    0.08,

                transparent:
                    true,

                opacity:
                    0.92,

                side:
                    THREE.DoubleSide
            })


        this.waterSurface =
            new THREE.Mesh(
                this.waterGeometry,
                this.waterMaterial
            )


        this.waterSurface.rotation.x =
            -Math.PI / 2

        this.waterSurface.position.y =
            0


        this.waterGroup.add(
            this.waterSurface
        )


        /*
         * حافة مضيئة خفيفة
         */

        const ringGeometry =
            new THREE.RingGeometry(
                4.9,
                5.0,
                96
            )

        const ringMaterial =
            new THREE.MeshBasicMaterial({
                color:
                    0x8bd4df,

                transparent:
                    true,

                opacity:
                    0.12,

                side:
                    THREE.DoubleSide
            })

        const ring =
            new THREE.Mesh(
                ringGeometry,
                ringMaterial
            )

        ring.rotation.x =
            -Math.PI / 2

        ring.position.y =
            0.012

        this.waterGroup.add(
            ring
        )
    }


    /* =====================================================
       CREATE MOLECULES
       ===================================================== */

    createMolecules() {

        const moleculeGeometry =
            new THREE.SphereGeometry(
                0.065,
                12,
                12
            )


        /*
         * جزيئات الماء داخل الحجم
         */

        for (
            let x = -4.2;
            x <= 4.2;
            x += 0.48
        ) {

            for (
                let z = -3.2;
                z <= 3.2;
                z += 0.48
            ) {

                const y =
                    -0.48 +
                    Math.sin(
                        x * 1.7 +
                        z * 1.1
                    ) * 0.035


                const material =
                    new THREE.MeshBasicMaterial({
                        color:
                            0x7ab9ca,

                        transparent:
                            true,

                        opacity:
                            0.30
                    })


                const molecule =
                    new THREE.Mesh(
                        moleculeGeometry,
                        material
                    )

                molecule.position.set(
                    x,
                    y,
                    z
                )

                molecule.userData.baseY =
                    y

                molecule.userData.index =
                    this.molecules.length

                this.moleculeGroup.add(
                    molecule
                )

                this.molecules.push(
                    molecule
                )
            }
        }


        /*
         * جزيئات السطح
         */

        const surfaceGeometry =
            new THREE.SphereGeometry(
                0.09,
                14,
                14
            )


        for (
            let x = -4.1;
            x <= 4.1;
            x += 0.42
        ) {

            for (
                let z = -2.7;
                z <= 2.7;
                z += 0.42
            ) {

                const material =
                    new THREE.MeshBasicMaterial({
                        color:
                            0xd5eef0,

                        transparent:
                            true,

                        opacity:
                            0.70
                    })


                const molecule =
                    new THREE.Mesh(
                        surfaceGeometry,
                        material
                    )

                molecule.position.set(
                    x,
                    0.13,
                    z
                )

                molecule.userData.baseY =
                    0.13

                molecule.userData.index =
                    this.surfaceMolecules.length

                this.moleculeGroup.add(
                    molecule
                )

                this.surfaceMolecules.push(
                    molecule
                )
            }
        }
    }


    /* =====================================================
       CREATE FORCES
       ===================================================== */

    createForces() {

        /*
         * أسهم قوى التماسك على السطح
         */

        const surfaceIndexes =
            [
                -3,
                -2,
                -1,
                0,
                1,
                2,
                3
            ]


        surfaceIndexes.forEach(
            (x, index) => {

                const origin =
                    new THREE.Vector3(
                        x * 0.8,
                        0.22,
                        -2.0
                    )


                const direction =
                    new THREE.Vector3(
                        0,
                        0.65,
                        0
                    )


                const arrow =
                    new THREE.ArrowHelper(
                        direction.normalize(),
                        origin,
                        0.55,
                        0xd8c07a,
                        0.13,
                        0.08
                    )


                arrow.line.material.transparent =
                    true

                arrow.line.material.opacity =
                    0.0

                arrow.cone.material.transparent =
                    true

                arrow.cone.material.opacity =
                    0.0


                this.forceGroup.add(
                    arrow
                )

                this.forceLines.push(
                    arrow
                )
            }
        )


        /*
         * قوى أفقية بسيطة بين الجزيئات
         */

        for (
            let i = 0;
            i < 16;
            i++
        ) {

            const lineMaterial =
                new THREE.LineBasicMaterial({
                    color:
                        0xcdb56f,

                    transparent:
                        true,

                    opacity:
                        0.0
                })


            const points = [

                new THREE.Vector3(
                    -3.2 + i * 0.42,
                    0.15,
                    2.4
                ),

                new THREE.Vector3(
                    -2.9 + i * 0.42,
                    0.15,
                    2.4
                )
            ]


            const geometry =
                new THREE.BufferGeometry()
                    .setFromPoints(points)


            const line =
                new THREE.Line(
                    geometry,
                    lineMaterial
                )


            this.forceGroup.add(
                line
            )

            this.forceLines.push(
                line
            )
        }
    }


    /* =====================================================
       CREATE EXPERIMENT OBJECTS
       ===================================================== */

    createExperimentObjects() {

        /*
         * قطرة ماء معلقة
         */

        const dropGeometry =
            new THREE.SphereGeometry(
                0.48,
                32,
                24
            )


        this.dropMaterial =
            new THREE.MeshPhysicalMaterial({

                color:
                    0xb7e6ee,

                roughness:
                    0.08,

                metalness:
                    0.08,

                transmission:
                    0.35,

                transparent:
                    true,

                opacity:
                    0.84
            })


        this.drop =
            new THREE.Mesh(
                dropGeometry,
                this.dropMaterial
            )

        this.drop.scale.set(
            0.78,
            1.08,
            0.78
        )

        this.drop.position.set(
            0,
            3.7,
            0
        )

        this.drop.userData.baseY =
            3.7

        this.experimentObjectGroup.add(
            this.drop
        )


        /*
         * الإبرة / الجسم الصغير
         */

        const needleGeometry =
            new THREE.CylinderGeometry(
                0.055,
                0.055,
                2.6,
                18
            )


        const needleMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0xd6bd76,

                roughness:
                    0.24,

                metalness:
                    0.72
            })


        this.needle =
            new THREE.Mesh(
                needleGeometry,
                needleMaterial
            )

        this.needle.position.set(
            2.1,
            3.4,
            0
        )

        this.needle.rotation.z =
            0.12

        this.experimentObjectGroup.add(
            this.needle
        )


        /*
         * رأس الإبرة
         */

        const tipGeometry =
            new THREE.SphereGeometry(
                0.13,
                18,
                18
            )

        const tipMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0xf0dca0,

                roughness:
                    0.18,

                metalness:
                    0.62
            })


        this.needleTip =
            new THREE.Mesh(
                tipGeometry,
                tipMaterial
            )

        this.needleTip.position.set(
            2.26,
            2.10,
            0
        )

        this.experimentObjectGroup.add(
            this.needleTip
        )
    }


    /* =====================================================
       CREATE LIGHTS
       ===================================================== */

    createLights() {

        this.ambientLight =
            new THREE.AmbientLight(
                0xffffff,
                1.15
            )

        this.experimentScene.add(
            this.ambientLight
        )


        this.mainLight =
            new THREE.DirectionalLight(
                0xe9f7ff,
                2.0
            )

        this.mainLight.position.set(
            -4,
            8,
            6
        )

        this.experimentScene.add(
            this.mainLight
        )


        this.rimLight =
            new THREE.PointLight(
                0xb9c8ff,
                2.2,
                14
            )

        this.rimLight.position.set(
            4,
            3,
            -3
        )

        this.experimentScene.add(
            this.rimLight
        )
    }


    /* =====================================================
       PHASE CONTROL
       ===================================================== */

    goToPhase(index) {

        if (
            index < 0 ||
            index >= this.phaseNames.length
        ) {

            return
        }


        /*
         * لا يمكن تجاوز المراحل
         */

        if (
            index > this.currentPhase &&
            !this.completedPhases.has(
                this.currentPhase
            )
        ) {

            return
        }


        this.currentPhase =
            index

        this.phaseElapsed =
            0

        this.running =
            true

        this.applyPhaseVisualState()

        this.updatePauseButton()

        this.updateUI()
    }


    /* =====================================================
       COMPLETE PHASE
       ===================================================== */

    completeCurrentPhase() {

        this.completedPhases.add(
            this.currentPhase
        )


        if (
            this.currentPhase <
            this.phaseNames.length - 1
        ) {

            this.currentPhase += 1

            this.phaseElapsed =
                0

            this.applyPhaseVisualState()

            this.updateUI()

            return
        }


        /*
         * نهاية التجربة
         */

        this.running =
            false

        this.phaseElapsed =
            this.phaseDurations[
                this.currentPhase
            ]

        this.updatePauseButton()
    }


    /* =====================================================
       PHASE VISUAL STATE
       ===================================================== */

    applyPhaseVisualState() {

        const phase =
            this.currentPhase


        /*
         * reset general states
         */

        this.forceLines.forEach(
            (item) => {

                if (
                    item.line &&
                    item.line.material
                ) {

                    item.line.material.opacity =
                        0.0
                }

                if (
                    item.cone &&
                    item.cone.material
                ) {

                    item.cone.material.opacity =
                        0.0
                }
            }
        )


        this.drop.visible =
            false

        this.needle.visible =
            false


        /*
         * المراحل الأولى
         */

        if (
            phase === 0
        ) {

            this.setMoleculeOpacity(
                0.38,
                0.56
            )

            this.setForceOpacity(
                0.0
            )

            this.drop.visible =
                false

            this.needle.visible =
                false
        }


        /*
         * السطح
         */

        if (
            phase === 1
        ) {

            this.setMoleculeOpacity(
                0.28,
                0.86
            )

            this.setForceOpacity(
                0.24
            )

            this.drop.visible =
                true

            this.drop.position.y =
                3.7
        }


        /*
         * التوتر السطحي
         */

        if (
            phase === 2
        ) {

            this.setMoleculeOpacity(
                0.22,
                0.96
            )

            this.setForceOpacity(
                0.72
            )

            this.drop.visible =
                true

            this.drop.position.y =
                3.7
        }


        /*
         * الاصطدام
         */

        if (
            phase === 3
        ) {

            this.setMoleculeOpacity(
                0.20,
                0.92
            )

            this.setForceOpacity(
                0.85
            )

            this.drop.visible =
                false

            this.needle.visible =
                true
        }


        /*
         * الاستعادة
         */

        if (
            phase === 4
        ) {

            this.setMoleculeOpacity(
                0.30,
                0.82
            )

            this.setForceOpacity(
                0.48
            )

            this.drop.visible =
                true

            this.drop.position.y =
                3.7

            this.needle.visible =
                false
        }
    }


    /* =====================================================
       MOLECULE OPACITY
       ===================================================== */

    setMoleculeOpacity(
        innerOpacity,
        surfaceOpacity
    ) {

        this.molecules.forEach(
            (molecule) => {

                molecule.material.opacity =
                    innerOpacity
            }
        )


        this.surfaceMolecules.forEach(
            (molecule) => {

                molecule.material.opacity =
                    surfaceOpacity
            }
        )
    }


    /* =====================================================
       FORCE OPACITY
       ===================================================== */

    setForceOpacity(
        opacity
    ) {

        this.forceLines.forEach(
            (item) => {

                if (
                    item.line &&
                    item.line.material
                ) {

                    item.line.material.opacity =
                        opacity
                }

                if (
                    item.cone &&
                    item.cone.material
                ) {

                    item.cone.material.opacity =
                        opacity
                }
            }
        )
    }


    /* =====================================================
       UPDATE UI
       ===================================================== */

    updateUI() {

        if (
            !this.rootElement
        ) {

            return
        }


        const arabic =
            this.language === 'ar'


        this.rootElement.dir =
            arabic
                ? 'rtl'
                : 'ltr'


        /*
         * العنوان
         */

        this.titleElement.textContent =
            this.getText(
                'waterWorld.experiment.surfaceTension.title',
                arabic
                    ? 'التوتر السطحي'
                    : 'Surface Tension'
            )


        this.descriptionElement.textContent =
            this.getText(
                'waterWorld.experiment.surfaceTension.description',
                arabic
                    ? 'اكتشف كيف تجعل قوى التماسك بين جزيئات الماء سطحه يتصرف كأنه غشاء مرن.'
                    : 'Discover how cohesive forces between water molecules make the surface behave like an elastic film.'
            )


        /*
         * المرحلة
         */

        const phaseData =
            this.getPhaseData(
                this.currentPhase
            )


        this.phaseKickerElement.textContent =
            phaseData.kicker

        this.phaseTitleElement.textContent =
            phaseData.title

        this.phaseDescriptionElement.textContent =
            phaseData.description


        /*
         * أزرار المراحل
         */

        this.phaseButtons.forEach(
            (button, index) => {

                const data =
                    this.getPhaseData(
                        index
                    )

                button.textContent =
                    data.title


                const unlocked =
                    index === 0 ||
                    this.completedPhases.has(
                        index - 1
                    ) ||
                    index <= this.currentPhase


                button.disabled =
                    !unlocked


                button.classList.toggle(
                    'is-active',
                    index === this.currentPhase
                )

                button.classList.toggle(
                    'is-completed',
                    this.completedPhases.has(
                        index
                    )
                )

                button.classList.toggle(
                    'is-locked',
                    !unlocked
                )
            }
        )


        /*
         * الحالة
         */

        const phaseNumber =
            this.currentPhase + 1

        const total =
            this.phaseNames.length


        const statusTemplate =
            this.getText(
                'waterWorld.experiment.surfaceTension.status',
                arabic
                    ? 'المرحلة {current} من {total}'
                    : 'Phase {current} of {total}'
            )


        this.statusElement.textContent =
            statusTemplate
                .replace(
                    '{current}',
                    String(phaseNumber)
                )
                .replace(
                    '{total}',
                    String(total)
                )


        /*
         * الأزرار
         */

        this.resetButton.textContent =
            this.getText(
                'waterWorld.experiment.surfaceTension.reset',
                arabic
                    ? 'إعادة التجربة'
                    : 'Restart'
            )


        this.exitButton.textContent =
            this.getText(
                'waterWorld.experiment.surfaceTension.back',
                arabic
                    ? 'العودة إلى عالم المياه'
                    : 'Back to Water World'
            )


        this.updatePauseButton()
    }


    /* =====================================================
       PAUSE BUTTON
       ===================================================== */

    updatePauseButton() {

        if (
            !this.pauseButton
        ) {

            return
        }


        const arabic =
            this.language === 'ar'


        this.pauseButton.textContent =
            this.running

                ? this.getText(
                    'waterWorld.experiment.surfaceTension.pause',
                    arabic
                        ? 'إيقاف مؤقت'
                        : 'Pause'
                )

                : this.getText(
                    'waterWorld.experiment.surfaceTension.continue',
                    arabic
                        ? 'استمرار'
                        : 'Continue'
                )
    }


    /* =====================================================
       ANIMATION — MOLECULES
       ===================================================== */

    animateMolecules(
        time
    ) {

        this.molecules.forEach(
            (molecule, index) => {

                const wave =
                    Math.sin(
                        time * 1.2 +
                        index * 0.31
                    ) * 0.025


                molecule.position.y =
                    molecule.userData.baseY +
                    wave
            }
        )


        this.surfaceMolecules.forEach(
            (molecule, index) => {

                let wave =
                    Math.sin(
                        time * 1.5 +
                        index * 0.23
                    ) * 0.018


                /*
                 * تشوه السطح أثناء الاصطدام
                 */

                if (
                    this.currentPhase === 3
                ) {

                    const dx =
                        molecule.position.x -
                        2.25

                    const dz =
                        molecule.position.z

                    const distance =
                        Math.sqrt(
                            dx * dx +
                            dz * dz
                        )


                    const impact =
                        Math.exp(
                            -distance * 0.8
                        )


                    wave -=
                        impact *
                        0.18 *
                        Math.max(
                            0,
                            Math.sin(
                                this.phaseElapsed * 3.0
                            )
                        )
                }


                /*
                 * الاستعادة
                 */

                if (
                    this.currentPhase === 4
                ) {

                    const dx =
                        molecule.position.x

                    const dz =
                        molecule.position.z

                    const distance =
                        Math.sqrt(
                            dx * dx +
                            dz * dz
                        )


                    const ripple =
                        Math.sin(
                            distance * 3.4 -
                            this.phaseElapsed * 4.0
                        ) *
                        Math.exp(
                            -distance * 0.28
                        ) *
                        0.07


                    wave +=
                        ripple
                }


                molecule.position.y =
                    molecule.userData.baseY +
                    wave
            }
        )
    }


    /* =====================================================
       ANIMATION — FORCES
       ===================================================== */

    animateForces(
        time
    ) {

        const pulse =
            0.55 +
            Math.sin(
                time * 2.2
            ) * 0.25


        this.forceLines.forEach(
            (item) => {

                if (
                    item.line &&
                    item.line.material
                ) {

                    const base =
                        item.line.material.userData
                            ?.baseOpacity || 0.0

                    item.line.material.opacity =
                        base * pulse
                }

                if (
                    item.cone &&
                    item.cone.material
                ) {

                    const base =
                        item.cone.material.userData
                            ?.baseOpacity || 0.0

                    item.cone.material.opacity =
                        base * pulse
                }
            }
        )


        /*
         * لأن ArrowHelper لا يحفظ
         * opacity الأساسي تلقائيًا
         */

        if (
            this.currentPhase === 2
        ) {

            this.forceLines.forEach(
                (item) => {

                    if (
                        item.line &&
                        item.line.material
                    ) {

                        item.line.material.opacity =
                            0.58 * pulse
                    }

                    if (
                        item.cone &&
                        item.cone.material
                    ) {

                        item.cone.material.opacity =
                            0.58 * pulse
                    }
                }
            )
        }


        if (
            this.currentPhase === 3
        ) {

            this.forceLines.forEach(
                (item) => {

                    if (
                        item.line &&
                        item.line.material
                    ) {

                        item.line.material.opacity =
                            0.70 * pulse
                    }

                    if (
                        item.cone &&
                        item.cone.material
                    ) {

                        item.cone.material.opacity =
                            0.70 * pulse
                    }
                }
            )
        }
    }


    /* =====================================================
       ANIMATION — DROP
       ===================================================== */

    animateDrop(
        time
    ) {

        if (
            !this.drop.visible
        ) {

            return
        }


        /*
         * المرحلة الثانية والثالثة
         */

        if (
            this.currentPhase === 1 ||
            this.currentPhase === 2
        ) {

            this.drop.position.y =
                3.7 +
                Math.sin(
                    time * 1.2
                ) * 0.08

            return
        }


        /*
         * مرحلة الاستعادة
         */

        if (
            this.currentPhase === 4
        ) {

            this.drop.position.y =
                3.7 +
                Math.sin(
                    time * 0.9
                ) * 0.05
        }
    }


    /* =====================================================
       ANIMATION — NEEDLE
       ===================================================== */

    animateNeedle() {

        if (
            !this.needle.visible
        ) {

            return
        }


        const progress =
            Math.min(
                this.phaseElapsed / 8,
                1
            )


        const smooth =
            progress *
            progress *
            (3 - 2 * progress)


        this.needle.position.y =
            3.4 -
            smooth * 1.35


        this.needleTip.position.y =
            2.10 -
            smooth * 1.35
    }


    /* =====================================================
       RIPPLE
       ===================================================== */

    createRipple() {

        const geometry =
            new THREE.RingGeometry(
                0.12,
                0.18,
                48
            )


        const material =
            new THREE.MeshBasicMaterial({

                color:
                    0xbdeef2,

                transparent:
                    true,

                opacity:
                    0.55,

                side:
                    THREE.DoubleSide
            })


        const ripple =
            new THREE.Mesh(
                geometry,
                material
            )


        ripple.rotation.x =
            -Math.PI / 2

        ripple.position.set(
            2.25,
            0.04,
            0
        )

        ripple.scale.set(
            0.1,
            0.1,
            0.1
        )


        ripple.userData.age =
            0

        ripple.userData.maxAge =
            3.2


        this.rippleGroup.add(
            ripple
        )

        this.ripples.push(
            ripple
        )
    }


    /* =====================================================
       UPDATE RIPPLES
       ===================================================== */

    updateRipples(
        delta
    ) {

        if (
            this.currentPhase === 4 &&
            this.running
        ) {

            if (
                this.phaseElapsed > 0.25 &&
                Math.floor(
                    this.phaseElapsed * 2
                ) %
                2 === 0
            ) {

                if (
                    this.ripples.length < 4
                ) {

                    this.createRipple()
                }
            }
        }


        for (
            let i = this.ripples.length - 1;
            i >= 0;
            i--
        ) {

            const ripple =
                this.ripples[i]

            ripple.userData.age +=
                delta


            const age =
                ripple.userData.age

            const maxAge =
                ripple.userData.maxAge


            const progress =
                Math.min(
                    age / maxAge,
                    1
                )


            const scale =
                0.1 +
                progress * 3.4


            ripple.scale.set(
                scale,
                scale,
                scale
            )


            ripple.material.opacity =
                0.55 *
                (1 - progress)


            if (
                progress >= 1
            ) {

                this.rippleGroup.remove(
                    ripple
                )

                ripple.geometry.dispose()

                ripple.material.dispose()

                this.ripples.splice(
                    i,
                    1
                )
            }
        }
    }


    /* =====================================================
       WATER SURFACE
       ===================================================== */

    animateWaterSurface(
        time
    ) {

        if (
            !this.waterGeometry
        ) {

            return
        }


        const position =
            this.waterGeometry.attributes.position


        for (
            let i = 0;
            i < position.count;
            i++
        ) {

            const x =
                position.getX(i)

            const z =
                position.getY(i)


            let y =
                0


            /*
             * تموج خفيف دائم
             */

            y +=
                Math.sin(
                    x * 0.7 +
                    time * 0.65
                ) *
                0.018

            y +=
                Math.cos(
                    z * 0.8 -
                    time * 0.5
                ) *
                0.014


            /*
             * انحناء الجسم عند الاصطدام
             */

            if (
                this.currentPhase === 3
            ) {

                const dx =
                    x -
                    2.25

                const dz =
                    z

                const distance =
                    Math.sqrt(
                        dx * dx +
                        dz * dz
                    )


                const depression =
                    Math.exp(
                        -distance * 1.3
                    )


                const pulse =
                    Math.max(
                        0,
                        Math.sin(
                            this.phaseElapsed * 3
                        )
                    )


                y -=
                    depression *
                    pulse *
                    0.20
            }


            /*
             * موجات الاستعادة
             */

            if (
                this.currentPhase === 4
            ) {

                const dx =
                    x -
                    2.25

                const dz =
                    z

                const distance =
                    Math.sqrt(
                        dx * dx +
                        dz * dz
                    )


                y +=
                    Math.sin(
                        distance * 3.0 -
                        time * 3.5
                    ) *
                    Math.exp(
                        -distance * 0.25
                    ) *
                    0.06
            }


            position.setZ(
                i,
                y
            )
        }


        position.needsUpdate =
            true

        this.waterGeometry.computeVertexNormals()
    }


    /* =====================================================
       UPDATE
       ===================================================== */

    update(
        delta = 0.016
    ) {

        if (
            this.destroyed ||
            !this.visible
        ) {

            return
        }


        const safeDelta =
            Math.min(
                Math.max(
                    delta || 0,
                    0
                ),
                0.05
            )


        if (
            this.running
        ) {

            this.elapsed +=
                safeDelta

            this.phaseElapsed +=
                safeDelta


            const duration =
                this.phaseDurations[
                    this.currentPhase
                ]


            if (
                this.phaseElapsed >=
                duration
            ) {

                this.completeCurrentPhase()
            }
        }


        const time =
            this.elapsed


        /*
         * الحركة
         */

        this.animateMolecules(
            time
        )

        this.animateForces(
            time
        )

        this.animateDrop(
            time
        )

        this.animateNeedle()

        this.animateWaterSurface(
            time
        )

        this.updateRipples(
            safeDelta
        )


        /*
         * حركة كاميرا بسيطة جدًا
         */

        if (
            this.camera
        ) {

            this.camera.position.x =
                Math.sin(
                    time * 0.12
                ) * 0.16

            this.camera.position.y =
                5.8 +
                Math.sin(
                    time * 0.18
                ) * 0.06

            this.camera.lookAt(
                0,
                0,
                0
            )
        }


        /*
         * العرض
         */

        if (
            this.renderer &&
            this.camera
        ) {

            this.renderer.render(
                this.experimentScene,
                this.camera
            )
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


        this.visible =
            true

        this.running =
            true


        if (
            this.rootElement
        ) {

            this.rootElement.classList.add(
                'is-visible'
            )
        }


        this.resize()

        this.updateUI()
    }


    /* =====================================================
       HIDE
       ===================================================== */

    hide() {

        this.visible =
            false

        if (
            this.rootElement
        ) {

            this.rootElement.classList.remove(
                'is-visible'
            )
        }
    }


    /* =====================================================
       EXIT
       ===================================================== */

    exit() {

        this.hide()

        this.running =
            false


        if (
            this.earthWorldUI &&
            typeof this.earthWorldUI.show === 'function'
        ) {

            this.earthWorldUI.show()
        }
    }


    /* =====================================================
       RESET
       ===================================================== */

    reset() {

        this.currentPhase =
            0

        this.phaseElapsed =
            0

        this.elapsed =
            0

        this.running =
            true

        this.completedPhases =
            new Set()


        /*
         * إعادة القطرة
         */

        if (
            this.drop
        ) {

            this.drop.position.y =
                3.7
        }


        /*
         * إعادة الإبرة
         */

        if (
            this.needle
        ) {

            this.needle.position.y =
                3.4
        }


        if (
            this.needleTip
        ) {

            this.needleTip.position.y =
                2.10
        }


        /*
         * إزالة التموجات
         */

        this.ripples.forEach(
            (ripple) => {

                this.rippleGroup.remove(
                    ripple
                )

                ripple.geometry.dispose()

                ripple.material.dispose()
            }
        )

        this.ripples =
            []


        /*
         * إعادة الجزيئات
         */

        this.molecules.forEach(
            (molecule) => {

                molecule.position.y =
                    molecule.userData.baseY
            }
        )


        this.surfaceMolecules.forEach(
            (molecule) => {

                molecule.position.y =
                    molecule.userData.baseY
            }
        )


        /*
         * الحالة البصرية
         */

        this.applyPhaseVisualState()

        this.updatePauseButton()

        this.updateUI()
    }


    /* =====================================================
       LANGUAGE
       ===================================================== */

    updateLanguage() {

        this.language =
            getLanguage() || 'ar'


        this.updateUI()
    }


    /* =====================================================
       EARTH WORLD UI
       ===================================================== */

    setEarthWorldUI(
        earthWorldUI
    ) {

        this.earthWorldUI =
            earthWorldUI
    }


    /* =====================================================
       SCENE
       ===================================================== */

    setScene(
        scene
    ) {

        this.scene =
            scene
    }


    /* =====================================================
       RESIZE
       ===================================================== */

    resize() {

        if (
            !this.canvas ||
            !this.renderer ||
            !this.camera
        ) {

            return
        }


        const width =
            this.canvas.clientWidth ||
            this.canvas.parentElement?.clientWidth ||
            900

        const height =
            this.canvas.clientHeight ||
            this.canvas.parentElement?.clientHeight ||
            520


        this.camera.aspect =
            width / height

        this.camera.updateProjectionMatrix()


        this.renderer.setSize(
            width,
            height,
            false
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

        this.visible =
            false

        this.running =
            false


        window.removeEventListener(
            'resize',
            this.resizeHandler
        )


        /*
         * إزالة الواجهة
         */

        if (
            this.rootElement &&
            this.rootElement.parentNode
        ) {

            this.rootElement.parentNode.removeChild(
                this.rootElement
            )
        }


        /*
         * التخلص من meshes
         */

        this.experimentScene.traverse(
            (object) => {

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
                            (material) => {

                                material.dispose()
                            }
                        )

                    } else {

                        object.material.dispose()
                    }
                }
            }
        )


        /*
         * renderer
         */

        if (
            this.renderer
        ) {

            this.renderer.dispose()
        }


        this.renderer =
            null

        this.camera =
            null

        this.canvas =
            null

        this.rootElement =
            null

        this.waterSurface =
            null

        this.molecules =
            []

        this.surfaceMolecules =
            []

        this.forceLines =
            []

        this.ripples =
            []
    }
}