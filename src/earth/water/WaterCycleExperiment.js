import * as THREE from 'three'
import './WaterCycleExperiment.css'

import {
    t,
    getLanguage
} from '../../locales/i18n.js'


export default class WaterCycleExperiment {

    /* =====================================================
       CONSTRUCTOR
       ===================================================== */

    constructor(
        scene = null,
        parent = document.body
    ) {

        this.scene =
            scene

        this.parent =
            parent || document.body

        this.earthWorldUI =
            null

        this.visible =
            false

        this.running =
            false

        this.destroyed =
            false

        this.time =
            0

        this.phaseElapsed =
            0

        this.phaseProgress =
            0

        this.currentPhaseIndex =
            0

        this.completedPhases =
            new Set()

        this.language =
            getLanguage()

        this.phaseDurations = [
            7,
            9,
            9,
            7,
            10
        ]

        this.phaseNames = [
            'heating',
            'evaporation',
            'condensation',
            'precipitation',
            'runoff'
        ]

        /*
         * Three.js
         */

        this.renderScene =
            new THREE.Scene()

        this.camera =
            null

        this.renderer =
            null

        this.canvas =
            null

        /*
         * Main groups
         */

        this.environmentGroup =
            new THREE.Group()

        this.waterGroup =
            new THREE.Group()

        this.atmosphereGroup =
            new THREE.Group()

        this.rainGroup =
            new THREE.Group()

        this.runoffGroup =
            new THREE.Group()

        this.cloudGroup =
            new THREE.Group()

        this.vaporGroup =
            new THREE.Group()

        this.sunGroup =
            new THREE.Group()

        /*
         * Ocean
         */

        this.water =
            null

        this.ocean =
            null

        this.oceanBody =
            null

        this.oceanSurfaceGlow =
            null

        this.oceanFoam =
            null

        this.oceanHorizon =
            null

        this.waterRipples =
            []

        this.mouthRipples =
            []

        /*
         * Land
         */

        this.landGroup =
            null

        this.runoffTerrain =
            null

        /*
         * Sun
         */

        this.sun =
            null

        this.sunGlow =
            null

        this.sunRays =
            []

        /*
         * Vapor
         */

        this.vaporParticles =
            []

        /*
         * Clouds
         */

        this.clouds =
            []

        /*
         * Condensation
         */

        this.condensationDrops =
            []

        /*
         * Rain
         */

        this.rainDrops =
            []

        /*
         * Runoff
         */

        this.runoffCurve =
            null

        this.runoffBed =
            null

        this.runoffStream =
            null

        this.runoffHighlight =
            null

        this.runoffMouth =
            null

        this.runoffParticles =
            []

        this.runoffSplashParticles =
            []

        /*
         * UI
         */

        this.root =
            null

        this.titleElement =
            null

        this.descriptionElement =
            null

        this.phaseElement =
            null

        this.phaseKickerElement =
            null

        this.phaseTitleElement =
            null

        this.phaseDescriptionElement =
            null

        this.statusElement =
            null

        this.controlsElement =
            null

        this.phaseButtons =
            []

        this.pauseButton =
            null

        this.resetButton =
            null

        this.exitButton =
            null

        /*
         * Resize
         */

        this.resizeHandler =
            this.resize.bind(this)

        window.addEventListener(
            'resize',
            this.resizeHandler
        )

        /*
         * Build
         */

        this.createUI()

        this.createScene()

        this.createOcean()

        this.createTerrain()

        this.createSun()

        this.createClouds()

        this.createVapor()

        this.createCondensationDrops()

        this.createRain()

        this.createRunoff()

        this.applyPhaseVisualState()
    }


    /* =====================================================
       TRANSLATIONS
       ===================================================== */

    getText(
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

        } catch (error) {
            /*
             * Safe fallback.
             */
        }

        return fallback
    }


    getPhaseData(index) {

        const data = [

            {
                kicker: '01',
                titleAr: 'التسخين',
                titleEn: 'Heating',
                descAr:
                    'تسخّن الشمس سطح المحيط وتمنح الماء الطاقة اللازمة لبدء الدورة.',
                descEn:
                    'The Sun warms the ocean surface and gives water the energy needed to begin the cycle.'
            },

            {
                kicker: '02',
                titleAr: 'التبخر',
                titleEn: 'Evaporation',
                descAr:
                    'تغادر جزيئات الماء سطح المحيط وتتصاعد إلى الغلاف الجوي على شكل بخار.',
                descEn:
                    'Water molecules leave the ocean surface and rise into the atmosphere as vapor.'
            },

            {
                kicker: '03',
                titleAr: 'التكاثف',
                titleEn: 'Condensation',
                descAr:
                    'يبرد بخار الماء فيتكاثف داخل السحب ويكوّن قطرات ماء صغيرة.',
                descEn:
                    'Water vapor cools and condenses inside clouds, forming tiny droplets.'
            },

            {
                kicker: '04',
                titleAr: 'الهطول',
                titleEn: 'Precipitation',
                descAr:
                    'عندما تصبح قطرات الماء أثقل تبدأ بالسقوط من السحب على شكل أمطار.',
                descEn:
                    'When water droplets become heavy enough, they fall from clouds as precipitation.'
            },

            {
                kicker: '05',
                titleAr: 'الجريان السطحي',
                titleEn: 'Runoff',
                descAr:
                    'تتحرك المياه فوق سطح الأرض عبر الأودية والجداول حتى تعود إلى المحيط.',
                descEn:
                    'Water flows across the land through streams and valleys until it returns to the ocean.'
            }

        ]

        const item =
            data[index] ||
            data[0]

        const phaseName =
            this.phaseNames[index] ||
            this.phaseNames[0]

        const arabic =
            this.language === 'ar'

        return {

            kicker:
                item.kicker,

            title:
                this.getText(
                    `waterWorld.experiment.waterCycle.${phaseName}.title`,
                    arabic
                        ? item.titleAr
                        : item.titleEn
                ),

            description:
                this.getText(
                    `waterWorld.experiment.waterCycle.${phaseName}.description`,
                    arabic
                        ? item.descAr
                        : item.descEn
                )

        }
    }


    getPhaseButtonFallback(index) {

        const arabic =
            this.language === 'ar'

        const titles = [

            {
                ar: 'التسخين',
                en: 'Heating'
            },

            {
                ar: 'التبخر',
                en: 'Evaporation'
            },

            {
                ar: 'التكاثف',
                en: 'Condensation'
            },

            {
                ar: 'الهطول',
                en: 'Precipitation'
            },

            {
                ar: 'الجريان السطحي',
                en: 'Runoff'
            }

        ]

        const item =
            titles[index] ||
            titles[0]

        return arabic
            ? item.ar
            : item.en
    }


    /* =====================================================
       UI
       ===================================================== */

    createUI() {

        this.root =
            document.createElement('div')

        this.root.className =
            'awtaar-water-cycle-experiment'

        this.root.setAttribute(
            'dir',
            this.language === 'ar'
                ? 'rtl'
                : 'ltr'
        )

        /*
         * Header
         */

        const header =
            document.createElement('div')

        header.className =
            'water-cycle-header'

        this.titleElement =
            document.createElement('div')

        this.titleElement.className =
            'water-cycle-title'

        this.descriptionElement =
            document.createElement('div')

        this.descriptionElement.className =
            'water-cycle-description'

        header.appendChild(
            this.titleElement
        )

        header.appendChild(
            this.descriptionElement
        )

        /*
         * Body
         */

        const body =
            document.createElement('div')

        body.className =
            'water-cycle-body'

        /*
         * Scene
         */

        const scenePanel =
            document.createElement('div')

        scenePanel.className =
            'water-cycle-scene'

        this.canvas =
            document.createElement('canvas')

        this.canvas.className =
            'water-cycle-canvas'

        scenePanel.appendChild(
            this.canvas
        )

        /*
         * Phase panel
         */

        const phasePanel =
            document.createElement('div')

        phasePanel.className =
            'water-cycle-phase'

        this.phaseKickerElement =
            document.createElement('div')

        this.phaseKickerElement.className =
            'water-cycle-phase-kicker'

        this.phaseTitleElement =
            document.createElement('div')

        this.phaseTitleElement.className =
            'water-cycle-phase-title'

        this.phaseDescriptionElement =
            document.createElement('div')

        this.phaseDescriptionElement.className =
            'water-cycle-phase-description'

        phasePanel.appendChild(
            this.phaseKickerElement
        )

        phasePanel.appendChild(
            this.phaseTitleElement
        )

        phasePanel.appendChild(
            this.phaseDescriptionElement
        )

        /*
         * Phase buttons
         */

        const phaseControls =
            document.createElement('div')

        phaseControls.className =
            'water-cycle-controls'

        this.phaseNames.forEach(
            (phaseName, index) => {

                const button =
                    document.createElement('button')

                button.type =
                    'button'

                button.className =
                    'water-cycle-control'

                button.dataset.phase =
                    String(index)

                button.addEventListener(
                    'click',
                    () => {

                        this.goToPhase(
                            index
                        )

                    }
                )

                phaseControls.appendChild(
                    button
                )

                this.phaseButtons.push(
                    button
                )
            }
        )

        phasePanel.appendChild(
            phaseControls
        )

        body.appendChild(
            scenePanel
        )

        body.appendChild(
            phasePanel
        )

        /*
         * Footer
         */

        const footer =
            document.createElement('div')

        footer.className =
            'water-cycle-footer'

        this.statusElement =
            document.createElement('div')

        this.statusElement.className =
            'water-cycle-status'

        this.controlsElement =
            document.createElement('div')

        this.controlsElement.className =
            'water-cycle-controls'

        /*
         * Pause
         */

        this.pauseButton =
            document.createElement('button')

        this.pauseButton.type =
            'button'

        this.pauseButton.className =
            'water-cycle-control'

        this.pauseButton.addEventListener(
            'click',
            () => {

                this.running =
                    !this.running

                this.updatePauseButton()

            }
        )

        /*
         * Reset
         */

        this.resetButton =
            document.createElement('button')

        this.resetButton.type =
            'button'

        this.resetButton.className =
            'water-cycle-control'

        this.resetButton.addEventListener(
            'click',
            () => {

                this.reset()

            }
        )

        /*
         * Exit
         */

        this.exitButton =
            document.createElement('button')

        this.exitButton.type =
            'button'

        this.exitButton.className =
            'water-cycle-exit'

        this.exitButton.addEventListener(
            'click',
            () => {

                this.exit()

            }
        )

        this.controlsElement.appendChild(
            this.pauseButton
        )

        this.controlsElement.appendChild(
            this.resetButton
        )

        this.controlsElement.appendChild(
            this.exitButton
        )

        footer.appendChild(
            this.statusElement
        )

        footer.appendChild(
            this.controlsElement
        )

        this.root.appendChild(
            header
        )

        this.root.appendChild(
            body
        )

        this.root.appendChild(
            footer
        )

        this.parent.appendChild(
            this.root
        )

        this.updateUI()
    }


    updatePauseButton() {

        const arabic =
            this.language === 'ar'

        this.pauseButton.textContent =
            this.getText(
                this.running
                    ? 'waterWorld.experiment.waterCycle.controls.pause'
                    : 'waterWorld.experiment.waterCycle.controls.continue',
                this.running
                    ? (
                        arabic
                            ? 'إيقاف مؤقت'
                            : 'Pause'
                    )
                    : (
                        arabic
                            ? 'استمرار'
                            : 'Continue'
                    )
            )
    }


    updateUI() {

        const arabic =
            this.language === 'ar'

        /*
         * Main experiment title.
         */

        this.titleElement.textContent =
            this.getText(
                'waterWorld.experiment.waterCycle.title',
                arabic
                    ? 'دورة الماء'
                    : 'Water Cycle'
            )

        /*
         * Main experiment description.
         */

        this.descriptionElement.textContent =
            this.getText(
                'waterWorld.experiment.waterCycle.description',
                arabic
                    ? 'رحلة الماء المستمرة بين المحيط والغلاف الجوي وسطح الأرض.'
                    : 'The continuous journey of water between the ocean, atmosphere, and land.'
            )

        /*
         * Current phase.
         */

        const phase =
            this.getPhaseData(
                this.currentPhaseIndex
            )

        this.phaseKickerElement.textContent =
            phase.kicker

        this.phaseTitleElement.textContent =
            phase.title

        this.phaseDescriptionElement.textContent =
            phase.description

        /*
         * Buttons.
         */

        this.updatePauseButton()

        this.resetButton.textContent =
            this.getText(
                'waterWorld.experiment.waterCycle.controls.reset',
                arabic
                    ? 'إعادة التجربة'
                    : 'Restart'
            )

        this.exitButton.textContent =
            this.getText(
                'waterWorld.experiment.waterCycle.back',
                arabic
                    ? 'العودة إلى عالم المياه'
                    : 'Back to Water World'
            )

        /*
         * Phase buttons.
         */

        this.phaseButtons.forEach(
            (button, index) => {

                const phaseName =
                    this.phaseNames[index]

                button.textContent =
                    this.getText(
                        `waterWorld.experiment.waterCycle.${phaseName}.title`,
                        this.getPhaseButtonFallback(
                            index
                        )
                    )

                const active =
                    index === this.currentPhaseIndex

                const completed =
                    this.completedPhases.has(
                        index
                    )

                button.style.opacity =
                    active
                        ? '1'
                        : completed
                            ? '0.8'
                            : '0.58'

                button.style.borderColor =
                    active
                        ? 'rgba(117, 231, 235, 0.85)'
                        : 'rgba(117, 231, 235, 0.22)'

                button.style.background =
                    active
                        ? 'rgba(48, 173, 185, 0.22)'
                        : 'rgba(255,255,255,0.035)'
            }
        )

        /*
         * Progress status.
         */

        const phaseNumber =
            this.currentPhaseIndex + 1

        const total =
            this.phaseNames.length

        this.statusElement.textContent =
            this.getText(
                'waterWorld.experiment.waterCycle.status',
                arabic
                    ? `المرحلة ${phaseNumber} من ${total}`
                    : `Phase ${phaseNumber} of ${total}`
            )
                .replace(
                    '{current}',
                    String(phaseNumber)
                )
                .replace(
                    '{total}',
                    String(total)
                )

        /*
         * Direction.
         */

        this.root.setAttribute(
            'dir',
            arabic
                ? 'rtl'
                : 'ltr'
        )
    }


    /* =====================================================
       THREE SCENE
       ===================================================== */

    createScene() {

        this.renderScene.background =
            new THREE.Color(
                0x061116
            )

        this.camera =
            new THREE.PerspectiveCamera(
                42,
                1,
                0.1,
                100
            )

        this.camera.position.set(
            0,
            0.8,
            17
        )

        this.camera.lookAt(
            0,
            0.9,
            0
        )

        /*
         * Renderer
         */

        this.renderer =
            new THREE.WebGLRenderer({
                canvas: this.canvas,
                antialias: true,
                alpha: true
            })

        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio || 1,
                2
            )
        )

        this.renderer.outputColorSpace =
            THREE.SRGBColorSpace

        /*
         * Lights
         */

        const ambient =
            new THREE.AmbientLight(
                0xbfeef2,
                1.35
            )

        this.renderScene.add(
            ambient
        )

        const sunLight =
            new THREE.DirectionalLight(
                0xffe6a8,
                2.2
            )

        sunLight.position.set(
            4,
            7,
            6
        )

        this.renderScene.add(
            sunLight
        )

        const blueLight =
            new THREE.PointLight(
                0x3bd4e6,
                1.2,
                18
            )

        blueLight.position.set(
            -5,
            -1,
            4
        )

        this.renderScene.add(
            blueLight
        )

        /*
         * Main groups
         */

        this.renderScene.add(
            this.environmentGroup
        )

        this.renderScene.add(
            this.waterGroup
        )

        this.renderScene.add(
            this.atmosphereGroup
        )

        this.renderScene.add(
            this.rainGroup
        )

        this.renderScene.add(
            this.runoffGroup
        )

        this.renderScene.add(
            this.cloudGroup
        )

        this.renderScene.add(
            this.vaporGroup
        )

        this.renderScene.add(
            this.sunGroup
        )
    }


    /* =====================================================
       OCEAN
       ===================================================== */

    createOcean() {

        const oceanWidth =
            9.6

        const oceanDepth =
            4.2

        const geometry =
            new THREE.PlaneGeometry(
                oceanWidth,
                oceanDepth,
                48,
                24
            )

        const material =
            new THREE.MeshStandardMaterial({
                color: 0x07566a,
                emissive: 0x03242e,
                emissiveIntensity: 0.4,
                roughness: 0.24,
                metalness: 0.08,
                transparent: true,
                opacity: 0.98,
                side: THREE.DoubleSide
            })

        this.water =
            new THREE.Mesh(
                geometry,
                material
            )

        this.water.rotation.x =
            -Math.PI / 2

        this.water.position.set(
            -2.45,
            -1.03,
            0
        )

        this.water.renderOrder =
            20

        this.water.name =
            'awtaar-ocean-surface'

        this.waterGroup.add(
            this.water
        )

        /*
         * Solid ocean body.
         */

        const bodyGeometry =
            new THREE.BoxGeometry(
                oceanWidth,
                0.55,
                oceanDepth
            )

        const bodyMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x043e4e,
                emissive: 0x021c24,
                emissiveIntensity: 0.25,
                roughness: 0.48
            })

        this.oceanBody =
            new THREE.Mesh(
                bodyGeometry,
                bodyMaterial
            )

        this.oceanBody.position.set(
            -2.45,
            -1.31,
            0
        )

        this.oceanBody.renderOrder =
            10

        this.waterGroup.add(
            this.oceanBody
        )

        /*
         * Bright surface band.
         */

        const glowGeometry =
            new THREE.PlaneGeometry(
                9.35,
                0.48
            )

        const glowMaterial =
            new THREE.MeshBasicMaterial({
                color: 0x39bac7,
                transparent: true,
                opacity: 0.3,
                depthWrite: false
            })

        this.oceanSurfaceGlow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            )

        this.oceanSurfaceGlow.rotation.x =
            -Math.PI / 2

        this.oceanSurfaceGlow.position.set(
            -2.45,
            -0.96,
            1.72
        )

        this.oceanSurfaceGlow.renderOrder =
            24

        this.waterGroup.add(
            this.oceanSurfaceGlow
        )

        /*
         * Foam line.
         */

        const foamGeometry =
            new THREE.PlaneGeometry(
                9.3,
                0.12
            )

        const foamMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xb8ffff,
                transparent: true,
                opacity: 0.4,
                depthWrite: false
            })

        this.oceanFoam =
            new THREE.Mesh(
                foamGeometry,
                foamMaterial
            )

        this.oceanFoam.rotation.x =
            -Math.PI / 2

        this.oceanFoam.position.set(
            -2.45,
            -0.94,
            1.79
        )

        this.oceanFoam.renderOrder =
            25

        this.waterGroup.add(
            this.oceanFoam
        )

        /*
         * Horizon line.
         */

        const horizonGeometry =
            new THREE.PlaneGeometry(
                9.3,
                0.07
            )

        const horizonMaterial =
            new THREE.MeshBasicMaterial({
                color: 0x7be7ed,
                transparent: true,
                opacity: 0.4,
                depthWrite: false
            })

        this.oceanHorizon =
            new THREE.Mesh(
                horizonGeometry,
                horizonMaterial
            )

        this.oceanHorizon.rotation.x =
            -Math.PI / 2

        this.oceanHorizon.position.set(
            -2.45,
            -0.935,
            -1.88
        )

        this.oceanHorizon.renderOrder =
            25

        this.waterGroup.add(
            this.oceanHorizon
        )

        /*
         * Large horizontal wave bands.
         */

        for (
            let i = 0;
            i < 24;
            i++
        ) {

            const rippleGeometry =
                new THREE.TorusGeometry(
                    0.13 +
                    Math.random() * 0.12,
                    0.012,
                    8,
                    32
                )

            const rippleMaterial =
                new THREE.MeshBasicMaterial({
                    color: 0x9af4f4,
                    transparent: true,
                    opacity: 0.18,
                    depthWrite: false
                })

            const ripple =
                new THREE.Mesh(
                    rippleGeometry,
                    rippleMaterial
                )

            ripple.rotation.x =
                -Math.PI / 2

            ripple.scale.y =
                0.35

            ripple.position.set(
                -7.0 +
                Math.random() * 9.0,
                -0.91,
                -1.65 +
                Math.random() * 3.15
            )

            ripple.userData.baseScale =
                0.75 +
                Math.random() * 0.7

            ripple.userData.offset =
                Math.random() * Math.PI * 2

            this.waterGroup.add(
                ripple
            )

            this.waterRipples.push(
                ripple
            )
        }

        /*
         * Mouth ripples.
         */

        for (
            let i = 0;
            i < 12;
            i++
        ) {

            const geometry =
                new THREE.TorusGeometry(
                    0.16 +
                    i * 0.055,
                    0.012,
                    8,
                    32
                )

            const material =
                new THREE.MeshBasicMaterial({
                    color: 0xb9ffff,
                    transparent: true,
                    opacity: 0,
                    depthWrite: false
                })

            const ripple =
                new THREE.Mesh(
                    geometry,
                    material
                )

            ripple.rotation.x =
                -Math.PI / 2

            ripple.position.set(
                -1.65,
                -0.88,
                0.15
            )

            ripple.scale.y =
                0.42

            this.waterGroup.add(
                ripple
            )

            this.mouthRipples.push(
                ripple
            )
        }
    }


    /* =====================================================
       TERRAIN
       ===================================================== */

    createTerrain() {

        this.landGroup =
            new THREE.Group()

        this.landGroup.name =
            'awtaar-land'

        this.environmentGroup.add(
            this.landGroup
        )

        const landShape =
            new THREE.Shape()

        landShape.moveTo(
            -0.2,
            -0.75
        )

        landShape.lineTo(
            0.55,
            -0.25
        )

        landShape.lineTo(
            1.25,
            0.55
        )

        landShape.lineTo(
            2.0,
            1.1
        )

        landShape.lineTo(
            2.65,
            0.7
        )

        landShape.lineTo(
            3.25,
            1.45
        )

        landShape.lineTo(
            4.05,
            0.7
        )

        landShape.lineTo(
            5.2,
            1.15
        )

        landShape.lineTo(
            6.0,
            0.1
        )

        landShape.lineTo(
            6.2,
            -0.75
        )

        landShape.closePath()

        const extrude =
            new THREE.ExtrudeGeometry(
                landShape,
                {
                    depth: 0.7,
                    bevelEnabled: true,
                    bevelSegments: 2,
                    bevelSize: 0.08,
                    bevelThickness: 0.08
                }
            )

        const landMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x6b6049,
                roughness: 0.92,
                metalness: 0
            })

        this.runoffTerrain =
            new THREE.Mesh(
                extrude,
                landMaterial
            )

        this.runoffTerrain.rotation.x =
            Math.PI / 2

        this.runoffTerrain.position.set(
            0,
            -1.0,
            -0.12
        )

        this.runoffTerrain.scale.set(
            1,
            1,
            0.72
        )

        this.runoffTerrain.renderOrder =
            5

        this.landGroup.add(
            this.runoffTerrain
        )

        for (
            let i = 0;
            i < 24;
            i++
        ) {

            const rockGeometry =
                new THREE.DodecahedronGeometry(
                    0.08 +
                    Math.random() * 0.16,
                    0
                )

            const rockMaterial =
                new THREE.MeshStandardMaterial({
                    color:
                        i % 2 === 0
                            ? 0x81775d
                            : 0x514a3c,
                    roughness: 1
                })

            const rock =
                new THREE.Mesh(
                    rockGeometry,
                    rockMaterial
                )

            rock.position.set(
                0.15 +
                Math.random() * 5.1,
                -0.25 +
                Math.random() * 0.5,
                -0.5 +
                Math.random() * 1.1
            )

            rock.scale.y =
                0.55 +
                Math.random() * 0.8

            this.landGroup.add(
                rock
            )
        }
    }


    /* =====================================================
       SUN
       ===================================================== */

    createSun() {

        const geometry =
            new THREE.SphereGeometry(
                0.72,
                48,
                32
            )

        const material =
            new THREE.MeshBasicMaterial({
                color: 0xffdf82
            })

        this.sun =
            new THREE.Mesh(
                geometry,
                material
            )

        this.sun.position.set(
            -1.6,
            3.65,
            -0.6
        )

        this.sun.renderOrder =
            40

        this.sunGroup.add(
            this.sun
        )

        const glowGeometry =
            new THREE.SphereGeometry(
                1.08,
                32,
                24
            )

        const glowMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xffd66b,
                transparent: true,
                opacity: 0.12,
                depthWrite: false,
                blending:
                    THREE.AdditiveBlending
            })

        this.sunGlow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            )

        this.sunGlow.position.copy(
            this.sun.position
        )

        this.sunGroup.add(
            this.sunGlow
        )

        for (
            let i = 0;
            i < 12;
            i++
        ) {

            const geometry =
                new THREE.CylinderGeometry(
                    0.018,
                    0.018,
                    1.05,
                    8
                )

            const material =
                new THREE.MeshBasicMaterial({
                    color: 0xffdf86,
                    transparent: true,
                    opacity: 0.1,
                    depthWrite: false
                })

            const ray =
                new THREE.Mesh(
                    geometry,
                    material
                )

            const angle =
                (
                    i /
                    12
                ) *
                Math.PI *
                2

            ray.position.set(
                this.sun.position.x +
                Math.cos(angle) * 1.25,

                this.sun.position.y +
                Math.sin(angle) * 1.25,

                -0.58
            )

            ray.rotation.z =
                -angle

            this.sunGroup.add(
                ray
            )

            this.sunRays.push(
                ray
            )
        }
    }


    /* =====================================================
       CLOUDS
       ===================================================== */

    createClouds() {

        const cloudDefinitions = [

            {
                x: 1.15,
                y: 3.25,
                z: -0.35,
                scale: 1.18
            },

            {
                x: 3.25,
                y: 3.65,
                z: -0.85,
                scale: 0.88
            }

        ]

        cloudDefinitions.forEach(
            (definition, cloudIndex) => {

                const group =
                    new THREE.Group()

                group.position.set(
                    definition.x,
                    definition.y,
                    definition.z
                )

                group.scale.setScalar(
                    definition.scale
                )

                const puffs = []

                const count =
                    cloudIndex === 0
                        ? 13
                        : 9

                for (
                    let i = 0;
                    i < count;
                    i++
                ) {

                    const radius =
                        0.35 +
                        Math.random() * 0.34

                    const geometry =
                        new THREE.SphereGeometry(
                            radius,
                            24,
                            18
                        )

                    const material =
                        new THREE.MeshStandardMaterial({
                            color: 0xdce9e9,
                            emissive: 0x5b7275,
                            emissiveIntensity: 0.08,
                            roughness: 0.9,
                            transparent: true,
                            opacity: 0.78,
                            depthWrite: false
                        })

                    const puff =
                        new THREE.Mesh(
                            geometry,
                            material
                        )

                    puff.position.set(
                        -1.35 +
                        Math.random() * 2.7,

                        -0.12 +
                        Math.random() * 0.62,

                        -0.22 +
                        Math.random() * 0.44
                    )

                    puff.scale.y =
                        0.68 +
                        Math.random() * 0.35

                    group.add(
                        puff
                    )

                    puffs.push(
                        puff
                    )
                }

                this.cloudGroup.add(
                    group
                )

                this.clouds.push({
                    group,
                    puffs,
                    baseX:
                        definition.x,
                    baseY:
                        definition.y,
                    baseZ:
                        definition.z,
                    phase:
                        Math.random() *
                        Math.PI *
                        2
                })
            }
        )
    }


    /* =====================================================
       VAPOR
       ===================================================== */

    createVapor() {

        const count =
            52

        for (
            let i = 0;
            i < count;
            i++
        ) {

            const geometry =
                new THREE.SphereGeometry(
                    0.055 +
                    Math.random() * 0.055,
                    12,
                    10
                )

            const material =
                new THREE.MeshBasicMaterial({
                    color: 0xc9ffff,
                    transparent: true,
                    opacity: 0,
                    depthWrite: false,
                    blending:
                        THREE.AdditiveBlending
                })

            const particle =
                new THREE.Mesh(
                    geometry,
                    material
                )

            particle.position.set(
                -6.7 +
                Math.random() * 7.0,

                -0.58 +
                Math.random() * 0.28,

                -1.2 +
                Math.random() * 2.25
            )

            particle.userData.baseX =
                particle.position.x

            particle.userData.baseY =
                particle.position.y

            particle.userData.baseZ =
                particle.position.z

            particle.userData.speed =
                0.28 +
                Math.random() * 0.42

            particle.userData.offset =
                Math.random() *
                Math.PI *
                2

            particle.userData.delay =
                Math.random() * 2

            this.vaporGroup.add(
                particle
            )

            this.vaporParticles.push(
                particle
            )
        }
    }


    /* =====================================================
       CONDENSATION
       ===================================================== */

    createCondensationDrops() {

        const count =
            60

        for (
            let i = 0;
            i < count;
            i++
        ) {

            const geometry =
                new THREE.SphereGeometry(
                    0.035 +
                    Math.random() * 0.06,
                    12,
                    10
                )

            const material =
                new THREE.MeshBasicMaterial({
                    color: 0xaeeff2,
                    transparent: true,
                    opacity: 0,
                    depthWrite: false,
                    blending:
                        THREE.AdditiveBlending
                })

            const drop =
                new THREE.Mesh(
                    geometry,
                    material
                )

            drop.position.set(
                0.25 +
                Math.random() * 4.0,

                1.6 +
                Math.random() * 2.3,

                -0.55 +
                Math.random() * 1.1
            )

            drop.userData.baseX =
                drop.position.x

            drop.userData.baseY =
                drop.position.y

            drop.userData.baseZ =
                drop.position.z

            drop.userData.targetX =
                0.05 +
                Math.random() * 2.35

            drop.userData.targetY =
                2.85 +
                Math.random() * 0.75

            drop.userData.targetZ =
                -0.48 +
                Math.random() * 0.95

            drop.userData.offset =
                Math.random() *
                Math.PI *
                2

            this.atmosphereGroup.add(
                drop
            )

            this.condensationDrops.push(
                drop
            )
        }
    }


    /* =====================================================
       RAIN
       ===================================================== */

    createRain() {

        const count =
            92

        for (
            let i = 0;
            i < count;
            i++
        ) {

            const geometry =
                new THREE.CylinderGeometry(
                    0.018,
                    0.012,
                    0.32 +
                    Math.random() * 0.22,
                    6
                )

            const material =
                new THREE.MeshBasicMaterial({
                    color: 0x83e9f2,
                    transparent: true,
                    opacity: 0,
                    depthWrite: false
                })

            const drop =
                new THREE.Mesh(
                    geometry,
                    material
                )

            drop.position.set(
                1.35 +
                (
                    Math.random() -
                    0.5
                ) *
                2.2,

                0.15 +
                Math.random() * 3.0,

                -0.2 +
                Math.random() * 0.6
            )

            drop.rotation.z =
                -0.06

            drop.userData.baseX =
                drop.position.x

            drop.userData.baseZ =
                drop.position.z

            drop.userData.speed =
                1.8 +
                Math.random() * 1.7

            drop.userData.offset =
                Math.random() * 4.2

            this.rainGroup.add(
                drop
            )

            this.rainDrops.push(
                drop
            )
        }
    }


    /* =====================================================
       RUNOFF
       ===================================================== */

    createRunoff() {

        this.runoffCurve =
            new THREE.CatmullRomCurve3([
                new THREE.Vector3(
                    3.55,
                    -0.25,
                    0.35
                ),

                new THREE.Vector3(
                    3.15,
                    -0.38,
                    0.32
                ),

                new THREE.Vector3(
                    2.45,
                    -0.52,
                    0.28
                ),

                new THREE.Vector3(
                    1.75,
                    -0.63,
                    0.2
                ),

                new THREE.Vector3(
                    0.9,
                    -0.72,
                    0.12
                ),

                new THREE.Vector3(
                    0.1,
                    -0.82,
                    0.08
                ),

                new THREE.Vector3(
                    -0.9,
                    -0.88,
                    0.1
                ),

                new THREE.Vector3(
                    -1.68,
                    -0.89,
                    0.13
                )
            ])

        const bedGeometry =
            new THREE.TubeGeometry(
                this.runoffCurve,
                80,
                0.19,
                10,
                false
            )

        const bedMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x243b3e,
                roughness: 0.95,
                transparent: true,
                opacity: 0
            })

        this.runoffBed =
            new THREE.Mesh(
                bedGeometry,
                bedMaterial
            )

        this.runoffBed.renderOrder =
            28

        this.runoffGroup.add(
            this.runoffBed
        )

        const streamGeometry =
            new THREE.TubeGeometry(
                this.runoffCurve,
                90,
                0.095,
                10,
                false
            )

        const streamMaterial =
            new THREE.MeshBasicMaterial({
                color: 0x48d8e4,
                transparent: true,
                opacity: 0,
                depthWrite: false
            })

        this.runoffStream =
            new THREE.Mesh(
                streamGeometry,
                streamMaterial
            )

        this.runoffStream.renderOrder =
            35

        this.runoffGroup.add(
            this.runoffStream
        )

        const highlightGeometry =
            new THREE.TubeGeometry(
                this.runoffCurve,
                90,
                0.028,
                8,
                false
            )

        const highlightMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xc0ffff,
                transparent: true,
                opacity: 0,
                depthWrite: false,
                blending:
                    THREE.AdditiveBlending
            })

        this.runoffHighlight =
            new THREE.Mesh(
                highlightGeometry,
                highlightMaterial
            )

        this.runoffHighlight.renderOrder =
            36

        this.runoffGroup.add(
            this.runoffHighlight
        )

        for (
            let i = 0;
            i < 18;
            i++
        ) {

            const point =
                this.runoffCurve.getPointAt(
                    i / 18
                )

            const geometry =
                new THREE.DodecahedronGeometry(
                    0.08 +
                    Math.random() * 0.12,
                    0
                )

            const material =
                new THREE.MeshStandardMaterial({
                    color:
                        i % 2 === 0
                            ? 0x807760
                            : 0x575043,
                    roughness: 1
                })

            const stone =
                new THREE.Mesh(
                    geometry,
                    material
                )

            stone.position.copy(
                point
            )

            stone.position.x +=
                (
                    Math.random() -
                    0.5
                ) *
                0.35

            stone.position.z +=
                (
                    Math.random() -
                    0.5
                ) *
                0.6

            stone.position.y +=
                0.04

            this.runoffGroup.add(
                stone
            )
        }

        const mouthGeometry =
            new THREE.TorusGeometry(
                0.38,
                0.045,
                10,
                48
            )

        const mouthMaterial =
            new THREE.MeshBasicMaterial({
                color: 0x9ffcff,
                transparent: true,
                opacity: 0,
                depthWrite: false
            })

        this.runoffMouth =
            new THREE.Mesh(
                mouthGeometry,
                mouthMaterial
            )

        this.runoffMouth.rotation.x =
            -Math.PI / 2

        this.runoffMouth.position.set(
            -1.68,
            -0.87,
            0.13
        )

        this.runoffMouth.scale.y =
            0.55

        this.runoffMouth.renderOrder =
            38

        this.runoffGroup.add(
            this.runoffMouth
        )

        for (
            let i = 0;
            i < 34;
            i++
        ) {

            const geometry =
                new THREE.SphereGeometry(
                    0.035 +
                    Math.random() * 0.035,
                    10,
                    8
                )

            const material =
                new THREE.MeshBasicMaterial({
                    color: 0x8ff9ff,
                    transparent: true,
                    opacity: 0,
                    depthWrite: false,
                    blending:
                        THREE.AdditiveBlending
                })

            const particle =
                new THREE.Mesh(
                    geometry,
                    material
                )

            particle.userData.offset =
                Math.random()

            particle.userData.speed =
                0.08 +
                Math.random() * 0.12

            this.runoffGroup.add(
                particle
            )

            this.runoffParticles.push(
                particle
            )
        }

        for (
            let i = 0;
            i < 24;
            i++
        ) {

            const geometry =
                new THREE.SphereGeometry(
                    0.025 +
                    Math.random() * 0.035,
                    10,
                    8
                )

            const material =
                new THREE.MeshBasicMaterial({
                    color: 0xc6ffff,
                    transparent: true,
                    opacity: 0,
                    depthWrite: false,
                    blending:
                        THREE.AdditiveBlending
                })

            const particle =
                new THREE.Mesh(
                    geometry,
                    material
                )

            particle.userData.angle =
                Math.random() *
                Math.PI *
                2

            particle.userData.radius =
                0.12 +
                Math.random() *
                0.45

            particle.userData.speed =
                0.5 +
                Math.random() * 1.2

            particle.userData.phase =
                Math.random() *
                Math.PI *
                2

            this.runoffGroup.add(
                particle
            )

            this.runoffSplashParticles.push(
                particle
            )
        }
    }


    /* =====================================================
       PHASE NAVIGATION
       ===================================================== */

    goToPhase(index) {

        if (
            index < 0 ||
            index >= this.phaseNames.length
        ) {
            return
        }

        if (
            index >
            this.currentPhaseIndex
        ) {

            for (
                let i = this.currentPhaseIndex;
                i < index;
                i++
            ) {

                if (
                    !this.completedPhases.has(i)
                ) {

                    return
                }
            }
        }

        this.currentPhaseIndex =
            index

        this.phaseElapsed =
            0

        this.phaseProgress =
            0

        this.running =
            true

        this.applyPhaseVisualState()

        this.updateUI()
    }


    completeCurrentPhase() {

        this.completedPhases.add(
            this.currentPhaseIndex
        )

        if (
            this.currentPhaseIndex <
            this.phaseNames.length - 1
        ) {

            this.currentPhaseIndex++

            this.phaseElapsed =
                0

            this.phaseProgress =
                0

            this.applyPhaseVisualState()

            this.updateUI()

            return
        }

        this.running =
            false

        this.phaseProgress =
            1

        this.applyPhaseVisualState()

        this.updateUI()
    }


    /* =====================================================
       VISUAL STATE
       ===================================================== */

    applyPhaseVisualState() {

        this.setGroupOpacity(
            this.vaporParticles,
            0
        )

        this.setGroupOpacity(
            this.condensationDrops,
            0
        )

        this.setGroupOpacity(
            this.rainDrops,
            0
        )

        if (
            this.runoffBed
        ) {

            this.runoffBed.material.opacity =
                0
        }

        if (
            this.runoffStream
        ) {

            this.runoffStream.material.opacity =
                0
        }

        if (
            this.runoffHighlight
        ) {

            this.runoffHighlight.material.opacity =
                0
        }

        if (
            this.runoffMouth
        ) {

            this.runoffMouth.material.opacity =
                0
        }

        this.runoffParticles.forEach(
            particle => {

                particle.material.opacity =
                    0
            }
        )

        this.runoffSplashParticles.forEach(
            particle => {

                particle.material.opacity =
                    0
            }
        )

        this.clouds.forEach(
            cloud => {

                cloud.puffs.forEach(
                    puff => {

                        puff.material.opacity =
                            0.34
                    }
                )
            }
        )

        this.sunRays.forEach(
            ray => {

                ray.material.opacity =
                    this.currentPhaseIndex === 0
                        ? 0.16
                        : 0.06
            }
        )

        switch (
            this.currentPhaseIndex
        ) {

            case 0:
                this.applyHeatingState()
                break

            case 1:
                this.applyEvaporationState()
                break

            case 2:
                this.applyCondensationState()
                break

            case 3:
                this.applyPrecipitationState()
                break

            case 4:
                this.applyRunoffState()
                break
        }
    }


    applyHeatingState() {

        this.sunGlow.material.opacity =
            0.13 +
            this.phaseProgress *
            0.05

        this.oceanSurfaceGlow.material.opacity =
            0.25 +
            this.phaseProgress *
            0.15

        this.oceanFoam.material.opacity =
            0.34
    }


    applyEvaporationState() {

        this.sunGlow.material.opacity =
            0.18

        this.oceanSurfaceGlow.material.opacity =
            0.38

        const opacity =
            0.22 +
            this.phaseProgress *
            0.58

        this.vaporParticles.forEach(
            particle => {

                particle.material.opacity =
                    opacity
            }
        )
    }


    applyCondensationState() {

        this.sunGlow.material.opacity =
            0.08

        this.oceanSurfaceGlow.material.opacity =
            0.28

        const cloudOpacity =
            0.64 +
            this.phaseProgress *
            0.22

        this.clouds.forEach(
            cloud => {

                cloud.puffs.forEach(
                    puff => {

                        puff.material.opacity =
                            cloudOpacity
                    }
                )
            }
        )

        const dropOpacity =
            0.1 +
            this.phaseProgress *
            0.8

        this.condensationDrops.forEach(
            drop => {

                drop.material.opacity =
                    dropOpacity
            }
        )
    }


    applyPrecipitationState() {

        this.sunGlow.material.opacity =
            0.05

        this.clouds.forEach(
            cloud => {

                cloud.puffs.forEach(
                    puff => {

                        puff.material.opacity =
                            0.82
                    }
                )
            }
        )

        this.condensationDrops.forEach(
            drop => {

                drop.material.opacity =
                    0.08
            }
        )

        const rainOpacity =
            0.22 +
            this.phaseProgress *
            0.62

        this.rainDrops.forEach(
            drop => {

                drop.material.opacity =
                    rainOpacity
            }
        )
    }


    applyRunoffState() {

        this.sunGlow.material.opacity =
            0.04

        this.clouds.forEach(
            cloud => {

                cloud.puffs.forEach(
                    puff => {

                        puff.material.opacity =
                            0.46
                    }
                )
            }
        )

        this.rainDrops.forEach(
            drop => {

                drop.material.opacity =
                    0.06
            }
        )

        if (
            this.runoffBed
        ) {

            this.runoffBed.material.opacity =
                0.16 +
                this.phaseProgress *
                0.3
        }

        if (
            this.runoffStream
        ) {

            this.runoffStream.material.opacity =
                0.3 +
                this.phaseProgress *
                0.58
        }

        if (
            this.runoffHighlight
        ) {

            this.runoffHighlight.material.opacity =
                0.15 +
                this.phaseProgress *
                0.55
        }

        if (
            this.runoffMouth
        ) {

            this.runoffMouth.material.opacity =
                0.3 +
                this.phaseProgress *
                0.55
        }

        this.runoffParticles.forEach(
            particle => {

                particle.material.opacity =
                    0.5 +
                    this.phaseProgress *
                    0.35
            }
        )

        this.runoffSplashParticles.forEach(
            particle => {

                particle.material.opacity =
                    0.2 +
                    this.phaseProgress *
                    0.6
            }
        )
    }


    setGroupOpacity(
        group,
        opacity
    ) {

        group.forEach(
            object => {

                if (
                    object &&
                    object.material
                ) {

                    object.material.opacity =
                        opacity
                }
            }
        )
    }


    /* =====================================================
       ANIMATION — WATER
       ===================================================== */

    animateWater() {

        if (
            !this.water
        ) {
            return
        }

        const geometry =
            this.water.geometry

        const position =
            geometry.attributes.position

        for (
            let i = 0;
            i < position.count;
            i++
        ) {

            const x =
                position.getX(i)

            const y =
                position.getY(i)

            const wave1 =
                Math.sin(
                    x * 2.2 +
                    this.time * 1.5
                ) *
                0.035

            const wave2 =
                Math.sin(
                    y * 3.1 +
                    this.time * 1.15
                ) *
                0.018

            position.setZ(
                i,
                wave1 +
                wave2
            )
        }

        position.needsUpdate =
            true

        this.waterRipples.forEach(
            ripple => {

                const pulse =
                    1 +
                    Math.sin(
                        this.time * 1.4 +
                        ripple.userData.offset
                    ) *
                    0.12

                const base =
                    ripple.userData.baseScale

                ripple.scale.x =
                    base *
                    pulse

                ripple.scale.y =
                    base *
                    0.35 *
                    pulse

                ripple.material.opacity =
                    0.12 +
                    (
                        Math.sin(
                            this.time * 1.1 +
                            ripple.userData.offset
                        ) +
                        1
                    ) *
                    0.04
            }
        )

        if (
            this.oceanFoam
        ) {

            this.oceanFoam.material.opacity =
                0.3 +
                (
                    Math.sin(
                        this.time * 1.8
                    ) +
                    1
                ) *
                0.05
        }

        this.mouthRipples.forEach(
            (ripple, index) => {

                if (
                    this.currentPhaseIndex <
                    4
                ) {

                    ripple.material.opacity =
                        0

                    return
                }

                const pulse =
                    (
                        this.time * 0.55 +
                        index * 0.18
                    ) %
                    1

                ripple.scale.x =
                    0.65 +
                    pulse * 1.5

                ripple.scale.y =
                    (
                        0.65 +
                        pulse * 1.5
                    ) *
                    0.42

                ripple.material.opacity =
                    (
                        1 -
                        pulse
                    ) *
                    (
                        0.14 +
                        this.phaseProgress *
                        0.2
                    )
            }
        )
    }


    /* =====================================================
       ANIMATION — SUN
       ===================================================== */

    animateSun() {

        if (
            !this.sun
        ) {
            return
        }

        const pulse =
            1 +
            Math.sin(
                this.time * 1.4
            ) *
            0.025

        this.sun.scale.setScalar(
            pulse
        )

        this.sunGlow.scale.setScalar(
            1 +
            Math.sin(
                this.time * 1.15
            ) *
            0.07
        )

        const active =
            this.currentPhaseIndex === 0 ||
            this.currentPhaseIndex === 1

        this.sunGlow.material.opacity =
            active
                ? 0.12 +
                    this.phaseProgress *
                    0.06
                : 0.05
    }


    /* =====================================================
       ANIMATION — VAPOR
       ===================================================== */

    animateVapor() {

        if (
            this.currentPhaseIndex <
            1
        ) {

            this.vaporParticles.forEach(
                particle => {

                    particle.material.opacity =
                        0
                }
            )

            return
        }

        this.vaporParticles.forEach(
            particle => {

                const speed =
                    particle.userData.speed

                const rise =
                    (
                        this.time *
                        speed +
                        particle.userData.delay
                    ) %
                    3.9

                const baseY =
                    particle.userData.baseY

                particle.position.y =
                    baseY +
                    rise

                particle.position.x =
                    particle.userData.baseX +
                    Math.sin(
                        this.time * 0.8 +
                        particle.userData.offset
                    ) *
                    0.13

                particle.position.z =
                    particle.userData.baseZ +
                    Math.cos(
                        this.time * 0.7 +
                        particle.userData.offset
                    ) *
                    0.1

                const fade =
                    Math.sin(
                        (
                            rise /
                            3.9
                        ) *
                        Math.PI
                    )

                const baseOpacity =
                    this.currentPhaseIndex === 1
                        ? 0.72
                        : 0.16

                particle.material.opacity =
                    fade *
                    baseOpacity
            }
        )
    }


    /* =====================================================
       ANIMATION — CLOUDS
       ===================================================== */

    animateClouds() {

        this.clouds.forEach(
            cloud => {

                cloud.group.position.x =
                    cloud.baseX +
                    Math.sin(
                        this.time * 0.08 +
                        cloud.phase
                    ) *
                    0.08

                cloud.group.position.y =
                    cloud.baseY +
                    Math.sin(
                        this.time * 0.16 +
                        cloud.phase
                    ) *
                    0.035
            }
        )
    }


    /* =====================================================
       ANIMATION — CONDENSATION
       ===================================================== */

    animateCondensation() {

        if (
            this.currentPhaseIndex <
            2
        ) {

            this.condensationDrops.forEach(
                drop => {

                    drop.material.opacity =
                        0
                }
            )

            return
        }

        this.condensationDrops.forEach(
            drop => {

                const smooth =
                    this.phaseProgress *
                    this.phaseProgress *
                    (
                        3 -
                        2 *
                        this.phaseProgress
                    )

                const baseX =
                    drop.userData.baseX

                const baseY =
                    drop.userData.baseY

                const baseZ =
                    drop.userData.baseZ

                const targetX =
                    drop.userData.targetX

                const targetY =
                    drop.userData.targetY

                const targetZ =
                    drop.userData.targetZ

                drop.position.x =
                    THREE.MathUtils.lerp(
                        baseX,
                        targetX,
                        smooth
                    ) +
                    Math.sin(
                        this.time * 1.3 +
                        drop.userData.offset
                    ) *
                    0.035

                drop.position.y =
                    THREE.MathUtils.lerp(
                        baseY,
                        targetY,
                        smooth
                    ) +
                    Math.sin(
                        this.time * 1.1 +
                        drop.userData.offset
                    ) *
                    0.03

                drop.position.z =
                    THREE.MathUtils.lerp(
                        baseZ,
                        targetZ,
                        smooth
                    )

                drop.material.opacity =
                    this.currentPhaseIndex === 2
                        ? 0.2 +
                            this.phaseProgress *
                            0.7
                        : 0.08
            }
        )
    }


    /* =====================================================
       ANIMATION — RAIN
       ===================================================== */

    animateRain() {

        if (
            this.currentPhaseIndex <
            3
        ) {

            this.rainDrops.forEach(
                drop => {

                    drop.material.opacity =
                        0
                }
            )

            return
        }

        this.rainDrops.forEach(
            drop => {

                const fall =
                    (
                        this.time *
                        drop.userData.speed +
                        drop.userData.offset
                    ) %
                    4.15

                drop.position.y =
                    3.25 -
                    fall

                drop.position.x =
                    drop.userData.baseX +
                    Math.sin(
                        this.time * 0.7 +
                        drop.userData.offset
                    ) *
                    0.04

                drop.position.z =
                    drop.userData.baseZ

                drop.material.opacity =
                    this.currentPhaseIndex === 3
                        ? 0.7
                        : 0.06
            }
        )
    }


    /* =====================================================
       ANIMATION — RUNOFF
       ===================================================== */

    animateRunoff() {

        if (
            this.currentPhaseIndex <
            4
        ) {

            return
        }

        this.runoffParticles.forEach(
            particle => {

                const progress =
                    (
                        this.time *
                        particle.userData.speed +
                        particle.userData.offset
                    ) %
                    1

                const point =
                    this.runoffCurve.getPointAt(
                        progress
                    )

                particle.position.copy(
                    point
                )

                particle.position.y +=
                    0.06

                particle.material.opacity =
                    0.65 +
                    Math.sin(
                        this.time * 3 +
                        particle.userData.offset
                    ) *
                    0.15
            }
        )

        if (
            this.runoffMouth
        ) {

            const pulse =
                1 +
                Math.sin(
                    this.time * 3
                ) *
                0.12

            this.runoffMouth.scale.x =
                pulse

            this.runoffMouth.scale.y =
                pulse * 0.55
        }

        this.runoffSplashParticles.forEach(
            particle => {

                const life =
                    (
                        this.time *
                        particle.userData.speed +
                        particle.userData.phase
                    ) %
                    (
                        Math.PI * 2
                    )

                const progress =
                    (
                        Math.sin(life) +
                        1
                    ) *
                    0.5

                const angle =
                    particle.userData.angle

                const radius =
                    particle.userData.radius *
                    progress

                particle.position.set(
                    -1.68 +
                    Math.cos(angle) *
                    radius,

                    -0.83 +
                    Math.sin(
                        life * 0.5
                    ) *
                    0.18 +
                    progress *
                    0.2,

                    0.13 +
                    Math.sin(angle) *
                    radius
                )

                particle.material.opacity =
                    (
                        1 -
                        progress
                    ) *
                    (
                        0.25 +
                        this.phaseProgress *
                        0.5
                    )
            }
        )
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

        this.time +=
            delta

        if (
            this.running
        ) {

            this.phaseElapsed +=
                delta

            const duration =
                this.phaseDurations[
                    this.currentPhaseIndex
                ]

            this.phaseProgress =
                THREE.MathUtils.clamp(
                    this.phaseElapsed /
                    duration,
                    0,
                    1
                )

            if (
                this.phaseProgress >= 1
            ) {

                this.completeCurrentPhase()
            }

            else {

                this.applyPhaseVisualState()
            }
        }

        this.animateWater()

        this.animateSun()

        this.animateClouds()

        this.animateVapor()

        this.animateCondensation()

        this.animateRain()

        this.animateRunoff()

        if (
            this.renderer &&
            this.camera
        ) {

            this.renderer.render(
                this.renderScene,
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

        this.root.classList.add(
            'is-visible'
        )

        this.resize()

        this.applyPhaseVisualState()

        this.updateUI()

        if (
            this.completedPhases.size === 0 &&
            this.currentPhaseIndex === 0 &&
            this.phaseElapsed === 0
        ) {

            this.running =
                true
        }
    }


    /* =====================================================
       HIDE
       ===================================================== */

    hide() {

        this.visible =
            false

        this.running =
            false

        if (
            this.root
        ) {

            this.root.classList.remove(
                'is-visible'
            )
        }
    }


    /* =====================================================
       EXIT
       ===================================================== */

    exit() {

        this.hide()

        if (
            this.earthWorldUI &&
            typeof this.earthWorldUI.show ===
            'function'
        ) {

            this.earthWorldUI.show()
        }
    }


    /* =====================================================
       RESET
       ===================================================== */

    reset() {

        this.currentPhaseIndex =
            0

        this.phaseElapsed =
            0

        this.phaseProgress =
            0

        this.completedPhases.clear()

        this.running =
            true

        this.vaporParticles.forEach(
            particle => {

                particle.position.set(
                    particle.userData.baseX,
                    particle.userData.baseY,
                    particle.userData.baseZ
                )

                particle.material.opacity =
                    0
            }
        )

        this.condensationDrops.forEach(
            drop => {

                drop.position.set(
                    drop.userData.baseX,
                    drop.userData.baseY,
                    drop.userData.baseZ
                )

                drop.material.opacity =
                    0
            }
        )

        this.rainDrops.forEach(
            drop => {

                drop.material.opacity =
                    0
            }
        )

        if (
            this.runoffBed
        ) {

            this.runoffBed.material.opacity =
                0
        }

        if (
            this.runoffStream
        ) {

            this.runoffStream.material.opacity =
                0
        }

        if (
            this.runoffHighlight
        ) {

            this.runoffHighlight.material.opacity =
                0
        }

        if (
            this.runoffMouth
        ) {

            this.runoffMouth.material.opacity =
                0
        }

        this.runoffParticles.forEach(
            particle => {

                particle.material.opacity =
                    0
            }
        )

        this.runoffSplashParticles.forEach(
            particle => {

                particle.material.opacity =
                    0
            }
        )

        this.mouthRipples.forEach(
            ripple => {

                ripple.material.opacity =
                    0
            }
        )

        this.clouds.forEach(
            cloud => {

                cloud.puffs.forEach(
                    puff => {

                        puff.material.opacity =
                            0.34
                    }
                )
            }
        )

        this.applyPhaseVisualState()

        this.updateUI()
    }


    /* =====================================================
       LANGUAGE
       ===================================================== */

    updateLanguage() {

        this.language =
            getLanguage()

        if (
            this.root
        ) {

            this.root.setAttribute(
                'dir',
                this.language === 'ar'
                    ? 'rtl'
                    : 'ltr'
            )
        }

        this.updateUI()
    }


    /* =====================================================
       EARTH WORLD
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
            !this.renderer ||
            !this.camera ||
            !this.canvas
        ) {

            return
        }

        const width =
            this.canvas.clientWidth ||
            800

        const height =
            this.canvas.clientHeight ||
            500

        this.camera.aspect =
            width /
            height

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

        this.running =
            false

        window.removeEventListener(
            'resize',
            this.resizeHandler
        )

        this.renderScene.traverse(
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

            this.renderer.forceContextLoss()

            this.renderer = null
        }

        if (
            this.root &&
            this.root.parentNode
        ) {

            this.root.parentNode.removeChild(
                this.root
            )
        }

        this.root =
            null

        this.phaseButtons =
            []

        this.vaporParticles =
            []

        this.condensationDrops =
            []

        this.rainDrops =
            []

        this.runoffParticles =
            []

        this.runoffSplashParticles =
            []

        this.waterRipples =
            []

        this.mouthRipples =
            []

        this.clouds =
            []

        this.renderer =
            null

        this.camera =
            null
    }
}