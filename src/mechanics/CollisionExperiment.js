/* =========================================================
   AWTAAR — COLLISION EXPERIMENT
   ========================================================= */

import * as THREE from 'three'
import './Collision.css'
import { t, getLanguage } from '../locales/i18n.js'

export default class CollisionExperiment {

    constructor(scene = null, parentUI = null) {

        this.scene = scene
        this.parentUI = parentUI

        this.group = new THREE.Group()

        this.environmentGroup = new THREE.Group()
        this.trackGroup = new THREE.Group()
        this.objectsGroup = new THREE.Group()
        this.arrowsGroup = new THREE.Group()
        this.effectsGroup = new THREE.Group()

        this.group.add(this.environmentGroup)
        this.group.add(this.trackGroup)
        this.group.add(this.objectsGroup)
        this.group.add(this.arrowsGroup)
        this.group.add(this.effectsGroup)

        this.group.visible = false

        /* =====================================================
           DEDICATED SCENE
           ===================================================== */

        this.renderScene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera(
            38,
            1,
            0.1,
            100
        )

        this.camera.position.set(
            0,
            5.2,
            11.5
        )

        this.camera.lookAt(
            0,
            -0.55,
            0
        )

        this.renderer = null
        this.canvas = null
        this.sceneMount = null
        this.resizeObserver = null

        /* =====================================================
           STATE
           ===================================================== */

        this.active = false
        this.running = false
        this.paused = false
        this.started = false
        this.completed = false
        this.hasImpacted = false

        this.time = 0
        this.impactTime = 0
        this.lastDelta = 0

        /* =====================================================
           PHYSICS
           ===================================================== */

        this.mass1 = 2.0
        this.mass2 = 1.0

        this.velocity1Initial = 2.4
        this.velocity2Initial = -1.2

        this.velocity1 = this.velocity1Initial
        this.velocity2 = this.velocity2Initial

        this.velocity1After = 0
        this.velocity2After = 0

        this.restitution = 1.0

        this.momentumBefore = 0
        this.momentumAfter = 0

        this.energyBefore = 0
        this.energyAfter = 0

        /* =====================================================
           OBJECTS
           ===================================================== */

        this.body1 = null
        this.body2 = null

        this.body1Glow = null
        this.body2Glow = null

        this.arrow1 = null
        this.arrow2 = null

        this.impactRing = null
        this.impactLight = null

        /* =====================================================
           TRAILS
           ===================================================== */

        this.trail1 = []
        this.trail2 = []
        this.maxTrailPoints = 18

        /* =====================================================
           TRACK
           ===================================================== */

        this.trackLength = 12

        this.startX1 = -4.2
        this.startX2 = 4.2

        this.collisionX = 0

        /* =====================================================
           UI
           ===================================================== */

        this.ui = null
        this.dom = {}

        this.language = getLanguage()

        this.handleLanguageChange = () => {

            this.language = getLanguage()

            this.updateLanguage()
            this.updateUI()
        }

        /* =====================================================
           BUILD
           ===================================================== */

        this.createEnvironment()
        this.createTrack()
        this.createObjects()
        this.createArrows()
        this.createEffects()

        this.createUI()
        this.bindUI()

        this.createRenderer()

        window.addEventListener(
            'awtaar-language-change',
            this.handleLanguageChange
        )

        this.updateLanguage()
        this.reset()
    }


    /* =========================================================
       TRANSLATION
       ========================================================= */

    tx(key, fallbackAr, fallbackEn) {

        const value = t(key)

        if (value && value !== key) {
            return value
        }

        return this.language === 'ar'
            ? fallbackAr
            : fallbackEn
    }


    /* =========================================================
       ENVIRONMENT
       ========================================================= */

    createEnvironment() {

        const floorGeometry =
            new THREE.PlaneGeometry(22, 12)

        const floorMaterial =
            new THREE.MeshBasicMaterial({
                color: 0x11141c,
                transparent: true,
                opacity: 0.55,
                side: THREE.DoubleSide
            })

        const floor =
            new THREE.Mesh(
                floorGeometry,
                floorMaterial
            )

        floor.rotation.x =
            -Math.PI / 2

        floor.position.y =
            -1.45

        this.environmentGroup.add(floor)


        const grid =
            new THREE.GridHelper(
                20,
                20,
                0x4c5260,
                0x272b34
            )

        grid.position.y =
            -1.42

        this.environmentGroup.add(grid)
    }


    /* =========================================================
       TRACK
       ========================================================= */

    createTrack() {

        const trackGeometry =
            new THREE.BoxGeometry(
                14,
                0.22,
                2.4
            )

        const trackMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x252b35,
                metalness: 0.15,
                roughness: 0.7
            })

        const track =
            new THREE.Mesh(
                trackGeometry,
                trackMaterial
            )

        track.position.set(
            0,
            -1.15,
            0
        )

        this.trackGroup.add(track)


        const centerGeometry =
            new THREE.BoxGeometry(
                0.035,
                0.04,
                2.5
            )

        const centerMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.35
            })

        const centerLine =
            new THREE.Mesh(
                centerGeometry,
                centerMaterial
            )

        centerLine.position.set(
            this.collisionX,
            -1.02,
            0
        )

        this.trackGroup.add(centerLine)


        this.trackGroup.add(
            this.createMarker(
                this.startX1,
                0x4f8cff
            )
        )

        this.trackGroup.add(
            this.createMarker(
                this.startX2,
                0xff7a59
            )
        )
    }


    createMarker(x, color) {

        const geometry =
            new THREE.BoxGeometry(
                0.045,
                0.06,
                2
            )

        const material =
            new THREE.MeshBasicMaterial({
                color,
                transparent: true,
                opacity: 0.7
            })

        const marker =
            new THREE.Mesh(
                geometry,
                material
            )

        marker.position.set(
            x,
            -0.99,
            0
        )

        return marker
    }


    /* =========================================================
       OBJECTS
       ========================================================= */

    createObjects() {

        const geometry =
            new THREE.SphereGeometry(
                0.72,
                48,
                48
            )

        const material1 =
            new THREE.MeshStandardMaterial({
                color: 0x4f8cff,
                emissive: 0x18376f,
                emissiveIntensity: 0.85,
                metalness: 0.15,
                roughness: 0.28
            })

        const material2 =
            new THREE.MeshStandardMaterial({
                color: 0xff7a59,
                emissive: 0x6f2415,
                emissiveIntensity: 0.75,
                metalness: 0.15,
                roughness: 0.28
            })

        this.body1 =
            new THREE.Mesh(
                geometry,
                material1
            )

        this.body2 =
            new THREE.Mesh(
                geometry.clone(),
                material2
            )

        this.body1.position.set(
            this.startX1,
            -0.35,
            0
        )

        this.body2.position.set(
            this.startX2,
            -0.35,
            0
        )

        this.objectsGroup.add(
            this.body1
        )

        this.objectsGroup.add(
            this.body2
        )


        const glowGeometry =
            new THREE.SphereGeometry(
                0.88,
                32,
                32
            )

        const glowMaterial1 =
            new THREE.MeshBasicMaterial({
                color: 0x4f8cff,
                transparent: true,
                opacity: 0.16,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            })

        const glowMaterial2 =
            new THREE.MeshBasicMaterial({
                color: 0xff7a59,
                transparent: true,
                opacity: 0.16,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            })

        this.body1Glow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial1
            )

        this.body2Glow =
            new THREE.Mesh(
                glowGeometry.clone(),
                glowMaterial2
            )

        this.body1.add(
            this.body1Glow
        )

        this.body2.add(
            this.body2Glow
        )
    }


    /* =========================================================
       ARROWS
       ========================================================= */

    createArrows() {

        this.arrow1 =
            this.createArrow(
                0x4f8cff
            )

        this.arrow2 =
            this.createArrow(
                0xff7a59
            )

        this.arrowsGroup.add(
            this.arrow1
        )

        this.arrowsGroup.add(
            this.arrow2
        )

        this.updateArrows()
    }


    createArrow(color) {

        const group =
            new THREE.Group()

        const shaftGeometry =
            new THREE.CylinderGeometry(
                0.045,
                0.045,
                1,
                12
            )

        const shaftMaterial =
            new THREE.MeshBasicMaterial({
                color,
                transparent: true,
                opacity: 0.9
            })

        const shaft =
            new THREE.Mesh(
                shaftGeometry,
                shaftMaterial
            )

        shaft.rotation.z =
            Math.PI / 2

        group.add(shaft)


        const headGeometry =
            new THREE.ConeGeometry(
                0.12,
                0.28,
                16
            )

        const headMaterial =
            new THREE.MeshBasicMaterial({
                color,
                transparent: true,
                opacity: 0.95
            })

        const head =
            new THREE.Mesh(
                headGeometry,
                headMaterial
            )

        head.rotation.z =
            -Math.PI / 2

        head.position.x =
            0.5

        group.add(head)

        return group
    }


    /* =========================================================
       EFFECTS
       ========================================================= */

    createEffects() {

        const ringGeometry =
            new THREE.RingGeometry(
                0.35,
                0.42,
                48
            )

        const ringMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xffe8b0,
                transparent: true,
                opacity: 0,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            })

        this.impactRing =
            new THREE.Mesh(
                ringGeometry,
                ringMaterial
            )

        this.impactRing.rotation.x =
            -Math.PI / 2

        this.impactRing.position.set(
            this.collisionX,
            -0.2,
            0
        )

        this.effectsGroup.add(
            this.impactRing
        )


        this.impactLight =
            new THREE.PointLight(
                0xffe5ad,
                0,
                8
            )

        this.impactLight.position.set(
            this.collisionX,
            0,
            0
        )

        this.effectsGroup.add(
            this.impactLight
        )
    }


    /* =========================================================
       UI
       ========================================================= */

    createUI() {

        const container =
            document.createElement('div')

        container.className =
            'collision-experiment'

        container.innerHTML = `
            <header class="collision-experiment-header">

                <div class="collision-experiment-heading">

                    <div
                        class="collision-experiment-eyebrow"
                        data-role="eyebrow">
                    </div>

                    <h1
                        class="collision-experiment-title"
                        data-role="title">
                    </h1>

                    <p
                        class="collision-experiment-subtitle"
                        data-role="subtitle">
                    </p>

                </div>

                <button
                    class="collision-experiment-back"
                    data-role="back"
                    type="button">

                    <span class="collision-back-icon">
                        ←
                    </span>

                    <span data-role="back-text"></span>

                </button>

            </header>


            <main class="collision-experiment-main">

                <section
                    class="collision-panel collision-info-panel">

                    <div class="collision-guide">

                        <div
                            class="collision-guide-kicker"
                            data-role="guide-kicker">
                        </div>

                        <h2
                            class="collision-guide-title"
                            data-role="guide-title">
                        </h2>

                        <p
                            class="collision-guide-message"
                            data-role="message">
                        </p>

                        <div class="collision-status">

                            <div
                                class="collision-status-dot"
                                data-role="status-dot">
                            </div>

                            <span data-role="status"></span>

                        </div>

                        <div class="collision-formula">

                            <div
                                class="collision-formula-label"
                                data-role="formula-label">
                            </div>

                            <div class="collision-formula-value">
                                p = m × v
                            </div>

                            <div class="collision-formula-value">
                                E<sub>k</sub> = ½mv²
                            </div>

                        </div>

                    </div>

                </section>


                <section
                    class="collision-scene collision-panel"
                    data-role="scene">

                    <div
                        class="collision-scene-caption"
                        data-role="scene-caption">
                    </div>

                </section>


                <section
                    class="collision-panel collision-controls">

                    <div class="collision-data">

                        <div class="collision-data-grid">

                            <div class="collision-data-card">
                                <span
                                    class="collision-data-label"
                                    data-role="mass1-label">
                                </span>

                                <strong
                                    class="collision-data-value"
                                    data-role="mass1-value">
                                </strong>
                            </div>

                            <div class="collision-data-card">
                                <span
                                    class="collision-data-label"
                                    data-role="mass2-label">
                                </span>

                                <strong
                                    class="collision-data-value"
                                    data-role="mass2-value">
                                </strong>
                            </div>

                            <div class="collision-data-card">
                                <span
                                    class="collision-data-label"
                                    data-role="velocity1-label">
                                </span>

                                <strong
                                    class="collision-data-value"
                                    data-role="velocity1-value">
                                </strong>
                            </div>

                            <div class="collision-data-card">
                                <span
                                    class="collision-data-label"
                                    data-role="velocity2-label">
                                </span>

                                <strong
                                    class="collision-data-value"
                                    data-role="velocity2-value">
                                </strong>
                            </div>

                            <div class="collision-data-card">
                                <span
                                    class="collision-data-label"
                                    data-role="momentum-label">
                                </span>

                                <strong
                                    class="collision-data-value"
                                    data-role="momentum-value">
                                </strong>
                            </div>

                            <div class="collision-data-card">
                                <span
                                    class="collision-data-label"
                                    data-role="energy-label">
                                </span>

                                <strong
                                    class="collision-data-value"
                                    data-role="energy-value">
                                </strong>
                            </div>

                        </div>

                    </div>


                    <div class="collision-control">

                        <div class="collision-control-header">

                            <label
                                class="collision-control-label"
                                for="collision-mass1"
                                data-role="mass1-control-label">
                            </label>

                            <span
                                class="collision-control-value"
                                data-role="mass1-control-value">
                            </span>

                        </div>

                        <input
                            id="collision-mass1"
                            data-role="mass1-input"
                            type="range"
                            min="0.5"
                            max="5"
                            step="0.1"
                        />

                    </div>


                    <div class="collision-control">

                        <div class="collision-control-header">

                            <label
                                class="collision-control-label"
                                for="collision-mass2"
                                data-role="mass2-control-label">
                            </label>

                            <span
                                class="collision-control-value"
                                data-role="mass2-control-value">
                            </span>

                        </div>

                        <input
                            id="collision-mass2"
                            data-role="mass2-input"
                            type="range"
                            min="0.5"
                            max="5"
                            step="0.1"
                        />

                    </div>


                    <div class="collision-control">

                        <div class="collision-control-header">

                            <label
                                class="collision-control-label"
                                for="collision-velocity1"
                                data-role="velocity1-control-label">
                            </label>

                            <span
                                class="collision-control-value"
                                data-role="velocity1-control-value">
                            </span>

                        </div>

                        <input
                            id="collision-velocity1"
                            data-role="velocity1-input"
                            type="range"
                            min="0.5"
                            max="4"
                            step="0.1"
                        />

                    </div>


                    <div class="collision-control">

                        <div class="collision-control-header">

                            <label
                                class="collision-control-label"
                                for="collision-velocity2"
                                data-role="velocity2-control-label">
                            </label>

                            <span
                                class="collision-control-value"
                                data-role="velocity2-control-value">
                            </span>

                        </div>

                        <input
                            id="collision-velocity2"
                            data-role="velocity2-input"
                            type="range"
                            min="-3"
                            max="-0.2"
                            step="0.1"
                        />

                    </div>


                    <div class="collision-actions">

                        <button
                            class="collision-button collision-button-primary"
                            data-role="apply"
                            type="button">
                        </button>

                        <button
                            class="collision-button"
                            data-role="pause"
                            type="button">
                        </button>

                        <button
                            class="collision-button collision-reset-button"
                            data-role="reset"
                            type="button">
                        </button>

                    </div>


                    <div class="collision-note">
                        <span data-role="note"></span>
                    </div>

                </section>

            </main>
        `

        document.body.appendChild(
            container
        )

        this.ui =
            container

        this.cacheDOM()

        this.ui.classList.remove(
            'is-visible'
        )

        this.ui.style.pointerEvents =
            'none'
    }


    cacheDOM() {

        const q =
            role =>
                this.ui.querySelector(
                    `[data-role="${role}"]`
                )

        this.dom = {

            eyebrow: q('eyebrow'),
            title: q('title'),
            subtitle: q('subtitle'),

            back: q('back'),
            backText: q('back-text'),

            guideKicker:
                q('guide-kicker'),

            guideTitle:
                q('guide-title'),

            message:
                q('message'),

            status:
                q('status'),

            statusDot:
                q('status-dot'),

            formulaLabel:
                q('formula-label'),

            sceneCaption:
                q('scene-caption'),

            mass1Label:
                q('mass1-label'),

            mass1Value:
                q('mass1-value'),

            mass2Label:
                q('mass2-label'),

            mass2Value:
                q('mass2-value'),

            velocity1Label:
                q('velocity1-label'),

            velocity1Value:
                q('velocity1-value'),

            velocity2Label:
                q('velocity2-label'),

            velocity2Value:
                q('velocity2-value'),

            momentumLabel:
                q('momentum-label'),

            momentumValue:
                q('momentum-value'),

            energyLabel:
                q('energy-label'),

            energyValue:
                q('energy-value'),

            mass1ControlLabel:
                q('mass1-control-label'),

            mass1ControlValue:
                q('mass1-control-value'),

            mass2ControlLabel:
                q('mass2-control-label'),

            mass2ControlValue:
                q('mass2-control-value'),

            velocity1ControlLabel:
                q('velocity1-control-label'),

            velocity1ControlValue:
                q('velocity1-control-value'),

            velocity2ControlLabel:
                q('velocity2-control-label'),

            velocity2ControlValue:
                q('velocity2-control-value'),

            mass1Input:
                q('mass1-input'),

            mass2Input:
                q('mass2-input'),

            velocity1Input:
                q('velocity1-input'),

            velocity2Input:
                q('velocity2-input'),

            apply:
                q('apply'),

            pause:
                q('pause'),

            reset:
                q('reset'),

            note:
                q('note'),

            scene:
                q('scene')
        }
    }


    /* =========================================================
       RENDERER
       ========================================================= */

    createRenderer() {

        if (!this.dom.scene) {
            console.error(
                'AWTAAR Collision: scene mount not found.'
            )
            return
        }

        this.sceneMount =
            this.dom.scene

        this.renderScene.background =
            new THREE.Color(
                0x07090d
            )

        const ambientLight =
            new THREE.AmbientLight(
                0xffffff,
                1.5
            )

        this.renderScene.add(
            ambientLight
        )

        const keyLight =
            new THREE.DirectionalLight(
                0xffffff,
                2.4
            )

        keyLight.position.set(
            3,
            7,
            6
        )

        this.renderScene.add(
            keyLight
        )

        const fillLight =
            new THREE.PointLight(
                0x6688ff,
                2.0,
                18
            )

        fillLight.position.set(
            -5,
            2,
            4
        )

        this.renderScene.add(
            fillLight
        )

        const warmLight =
            new THREE.PointLight(
                0xff9966,
                1.7,
                18
            )

        warmLight.position.set(
            5,
            1.5,
            4
        )

        this.renderScene.add(
            warmLight
        )

        this.renderScene.add(
            this.group
        )

        this.renderer =
            new THREE.WebGLRenderer({
                antialias: true,
                alpha: false,
                powerPreference:
                    'high-performance'
            })

        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio || 1,
                2
            )
        )

        this.renderer.outputColorSpace =
            THREE.SRGBColorSpace

        this.renderer.toneMapping =
            THREE.ACESFilmicToneMapping

        this.renderer.toneMappingExposure =
            1.15

        this.canvas =
            this.renderer.domElement

        this.canvas.className =
            'collision-three-canvas'

        this.sceneMount.appendChild(
            this.canvas
        )

        this.resizeRenderer()

        if (
            typeof ResizeObserver !==
            'undefined'
        ) {

            this.resizeObserver =
                new ResizeObserver(
                    () => {
                        this.resizeRenderer()
                    }
                )

            this.resizeObserver.observe(
                this.sceneMount
            )
        }
    }


    resizeRenderer() {

        if (
            !this.renderer ||
            !this.camera ||
            !this.sceneMount
        ) {
            return
        }

        const width =
            Math.max(
                1,
                this.sceneMount.clientWidth
            )

        const height =
            Math.max(
                1,
                this.sceneMount.clientHeight
            )

        this.camera.aspect =
            width / height

        this.camera.updateProjectionMatrix()

        this.renderer.setSize(
            width,
            height,
            false
        )
    }


    render() {

        if (
            !this.renderer ||
            !this.camera ||
            !this.active
        ) {
            return
        }

        this.renderer.render(
            this.renderScene,
            this.camera
        )
    }


    /* =========================================================
       EVENTS
       ========================================================= */

    bindUI() {

        if (this.dom.back) {

            this.dom.back.addEventListener(
                'click',
                () => {

                    if (
                        this.parentUI &&
                        typeof this.parentUI.closeExperiment ===
                        'function'
                    ) {

                        this.parentUI.closeExperiment()
                        return
                    }

                    this.hide()
                }
            )
        }


        if (this.dom.apply) {

            this.dom.apply.addEventListener(
                'click',
                () => {
                    this.startCollision()
                }
            )
        }


        if (this.dom.pause) {

            this.dom.pause.addEventListener(
                'click',
                () => {

                    if (!this.started) {
                        return
                    }

                    this.paused =
                        !this.paused

                    this.updateUI()
                    this.emitState()
                }
            )
        }


        if (this.dom.reset) {

            this.dom.reset.addEventListener(
                'click',
                () => {
                    this.reset()
                }
            )
        }


        if (this.dom.mass1Input) {

            this.dom.mass1Input.addEventListener(
                'input',
                event => {

                    this.mass1 =
                        parseFloat(
                            event.target.value
                        )

                    this.updateUI()
                    this.updateObjectScale()
                    this.emitState()
                }
            )
        }


        if (this.dom.mass2Input) {

            this.dom.mass2Input.addEventListener(
                'input',
                event => {

                    this.mass2 =
                        parseFloat(
                            event.target.value
                        )

                    this.updateUI()
                    this.updateObjectScale()
                    this.emitState()
                }
            )
        }


        if (this.dom.velocity1Input) {

            this.dom.velocity1Input.addEventListener(
                'input',
                event => {

                    this.velocity1Initial =
                        parseFloat(
                            event.target.value
                        )

                    if (!this.started) {

                        this.velocity1 =
                            this.velocity1Initial
                    }

                    this.updateUI()
                    this.updateArrows()
                    this.emitState()
                }
            )
        }


        if (this.dom.velocity2Input) {

            this.dom.velocity2Input.addEventListener(
                'input',
                event => {

                    this.velocity2Initial =
                        parseFloat(
                            event.target.value
                        )

                    if (!this.started) {

                        this.velocity2 =
                            this.velocity2Initial
                    }

                    this.updateUI()
                    this.updateArrows()
                    this.emitState()
                }
            )
        }
    }


    /* =========================================================
       LANGUAGE
       ========================================================= */

    updateLanguage() {

        if (
            !this.dom ||
            !this.ui
        ) {
            return
        }

        this.dom.eyebrow.textContent =
            this.tx(
                'collision.interactive',
                'تجربة تفاعلية',
                'Interactive Experiment'
            )

        this.dom.title.textContent =
            this.tx(
                'collision.title',
                'لحظة الاصطدام',
                'The Moment of Collision'
            )

        this.dom.subtitle.textContent =
            this.tx(
                'collision.subtitle',
                'اكتشف ماذا يحدث للزخم والطاقة عندما يلتقي جسمان متحركان.',
                'Discover what happens to momentum and energy when two moving objects meet.'
            )

        this.dom.backText.textContent =
            this.tx(
                'mechanicsWorld.back',
                'العودة إلى عالم الفيزياء',
                'Back to Physics World'
            )

        this.dom.guideKicker.textContent =
            this.tx(
                'collision.interactive',
                'تجربة تفاعلية',
                'Interactive Experiment'
            )

        this.dom.guideTitle.textContent =
            this.tx(
                'collision.guideTitle',
                'ماذا يحدث لحظة الاصطدام؟',
                'What happens at the moment of collision?'
            )

        this.dom.sceneCaption.textContent =
            this.tx(
                'collision.sceneCaption',
                'الزخم محفوظ في التصادم المرن',
                'Momentum is conserved in an elastic collision'
            )

        this.dom.mass1Label.textContent =
            this.tx(
                'collision.mass1',
                'كتلة الجسم الأول',
                'Object 1 Mass'
            )

        this.dom.mass2Label.textContent =
            this.tx(
                'collision.mass2',
                'كتلة الجسم الثاني',
                'Object 2 Mass'
            )

        this.dom.velocity1Label.textContent =
            this.tx(
                'collision.velocity1',
                'سرعة الجسم الأول',
                'Object 1 Velocity'
            )

        this.dom.velocity2Label.textContent =
            this.tx(
                'collision.velocity2',
                'سرعة الجسم الثاني',
                'Object 2 Velocity'
            )

        this.dom.momentumLabel.textContent =
            this.tx(
                'collision.momentum',
                'الزخم الكلي',
                'Total Momentum'
            )

        this.dom.energyLabel.textContent =
            this.tx(
                'collision.energy',
                'الطاقة الحركية',
                'Kinetic Energy'
            )

        this.dom.mass1ControlLabel.textContent =
            this.tx(
                'collision.mass1',
                'كتلة الجسم الأول',
                'Object 1 Mass'
            )

        this.dom.mass2ControlLabel.textContent =
            this.tx(
                'collision.mass2',
                'كتلة الجسم الثاني',
                'Object 2 Mass'
            )

        this.dom.velocity1ControlLabel.textContent =
            this.tx(
                'collision.velocity1',
                'سرعة الجسم الأول',
                'Object 1 Velocity'
            )

        this.dom.velocity2ControlLabel.textContent =
            this.tx(
                'collision.velocity2',
                'سرعة الجسم الثاني',
                'Object 2 Velocity'
            )

        this.dom.formulaLabel.textContent =
            this.tx(
                'collision.formulas',
                'القوانين',
                'Formulas'
            )

        this.dom.note.textContent =
            this.tx(
                'collision.note',
                'غيّر الكتلة والسرعة، ثم ابدأ التجربة ولاحظ ما يبقى محفوظًا أثناء التصادم.',
                'Change the mass and velocity, then start the experiment and observe what remains conserved during the collision.'
            )

        if (this.dom.apply) {

            this.dom.apply.textContent =
                this.tx(
                    'collision.start',
                    'بدء التصادم',
                    'Start Collision'
                )
        }

        if (this.dom.reset) {

            this.dom.reset.textContent =
                this.tx(
                    'collision.reset',
                    'إعادة التجربة',
                    'Reset Experiment'
                )
        }

        this.updatePauseButton()
    }


    /* =========================================================
       SHOW / HIDE
       ========================================================= */

    show() {

        this.active = true

        this.running = false
        this.paused = false

        this.reset()

        if (this.ui) {

            this.ui.classList.add(
                'is-visible'
            )

            this.ui.style.pointerEvents =
                'auto'
        }

        this.group.visible = true

        this.updateLanguage()
        this.updateUI()

        this.resizeRenderer()
        this.render()
        this.emitState()
    }


    hide() {

        this.active = false

        this.running = false
        this.paused = false

        if (this.ui) {

            this.ui.classList.remove(
                'is-visible'
            )

            this.ui.style.pointerEvents =
                'none'
        }

        this.group.visible = false

        this.emitState()
    }


    start() {
        this.show()
    }


    /* =========================================================
       COLLISION
       ========================================================= */

    startCollision() {

        if (!this.active) {
            return
        }

        this.started = true
        this.completed = false
        this.hasImpacted = false

        this.running = true
        this.paused = false

        this.time = 0
        this.impactTime = 0

        this.velocity1 =
            this.velocity1Initial

        this.velocity2 =
            this.velocity2Initial

        this.velocity1After = 0
        this.velocity2After = 0

        this.body1.position.x =
            this.startX1

        this.body2.position.x =
            this.startX2

        this.calculateBeforeCollision()

        this.clearTrails()
        this.hideImpactEffect()

        this.updateArrows()
        this.updateUI()
        this.render()
        this.emitState()
    }


    calculateBeforeCollision() {

        this.momentumBefore =
            this.mass1 *
                this.velocity1 +
            this.mass2 *
                this.velocity2

        this.energyBefore =
            0.5 *
                this.mass1 *
                this.velocity1 *
                this.velocity1 +

            0.5 *
                this.mass2 *
                this.velocity2 *
                this.velocity2
    }


    calculateAfterCollision() {

        const m1 =
            this.mass1

        const m2 =
            this.mass2

        const u1 =
            this.velocity1

        const u2 =
            this.velocity2

        const v1 =
            (
                (m1 - m2) * u1 +
                2 * m2 * u2
            ) /
            (m1 + m2)

        const v2 =
            (
                2 * m1 * u1 +
                (m2 - m1) * u2
            ) /
            (m1 + m2)

        this.velocity1After =
            v1 * this.restitution

        this.velocity2After =
            v2 * this.restitution

        this.momentumAfter =
            this.mass1 *
                this.velocity1After +
            this.mass2 *
                this.velocity2After

        this.energyAfter =
            0.5 *
                this.mass1 *
                this.velocity1After *
                this.velocity1After +

            0.5 *
                this.mass2 *
                this.velocity2After *
                this.velocity2After
    }


    /* =========================================================
       UPDATE
       ========================================================= */

    update(delta = 0) {

        if (!this.active) {
            return
        }

        this.lastDelta =
            delta

        if (
            !this.running ||
            this.paused
        ) {

            this.animateIdle(delta)
            this.updateImpactEffect(delta)
            this.render()

            return
        }

        this.time += delta

        if (!this.hasImpacted) {

            this.body1.position.x +=
                this.velocity1 * delta

            this.body2.position.x +=
                this.velocity2 * delta

            this.addTrailPoint(
                this.trail1,
                this.body1.position
            )

            this.addTrailPoint(
                this.trail2,
                this.body2.position
            )

            const distance =
                Math.abs(
                    this.body2.position.x -
                    this.body1.position.x
                )

            const collisionDistance =
                1.44

            if (
                distance <=
                collisionDistance
            ) {

                this.performImpact()
            }

        } else {

            this.body1.position.x +=
                this.velocity1 * delta

            this.body2.position.x +=
                this.velocity2 * delta

            this.addTrailPoint(
                this.trail1,
                this.body1.position
            )

            this.addTrailPoint(
                this.trail2,
                this.body2.position
            )

            if (
                Math.abs(
                    this.body1.position.x
                ) > 7 ||
                Math.abs(
                    this.body2.position.x
                ) > 7
            ) {

                this.completeExperiment()
            }
        }

        this.updateArrows()
        this.updateImpactEffect(delta)
        this.updateUI()
        this.render()
    }


    performImpact() {

        if (this.hasImpacted) {
            return
        }

        this.hasImpacted = true

        this.impactTime =
            this.time

        this.calculateAfterCollision()

        this.body1.position.x =
            this.collisionX - 0.72

        this.body2.position.x =
            this.collisionX + 0.72

        this.velocity1 =
            this.velocity1After

        this.velocity2 =
            this.velocity2After

        this.showImpactEffect()
        this.updateArrows()
        this.updateUI()
        this.emitState()
    }


    completeExperiment() {

        this.running = false
        this.completed = true
        this.started = false

        this.updateUI()
        this.emitState()
    }


    animateIdle() {

        if (
            !this.body1 ||
            !this.body2
        ) {
            return
        }

        const pulse =
            1 +
            Math.sin(
                performance.now() *
                0.002
            ) *
            0.025

        this.body1Glow.scale.setScalar(
            pulse
        )

        this.body2Glow.scale.setScalar(
            pulse
        )
    }


    /* =========================================================
       ARROWS
       ========================================================= */

    updateArrows() {

        if (
            !this.arrow1 ||
            !this.arrow2
        ) {
            return
        }

        this.updateSingleArrow(
            this.arrow1,
            this.body1,
            this.velocity1
        )

        this.updateSingleArrow(
            this.arrow2,
            this.body2,
            this.velocity2
        )
    }


    updateSingleArrow(
        arrow,
        body,
        velocity
    ) {

        if (
            !arrow ||
            !body
        ) {
            return
        }

        const magnitude =
            Math.min(
                Math.abs(velocity),
                4
            )

        const direction =
            velocity >= 0
                ? 1
                : -1

        const length =
            0.65 +
            magnitude * 0.32

        arrow.position.copy(
            body.position
        )

        arrow.position.y +=
            1.18

        arrow.scale.set(
            direction * length,
            1,
            1
        )

        arrow.visible =
            Math.abs(velocity) >
            0.05
    }


    /* =========================================================
       SCALE
       ========================================================= */

    updateObjectScale() {

        if (
            !this.body1 ||
            !this.body2
        ) {
            return
        }

        const scale1 =
            0.75 +
            this.mass1 * 0.13

        const scale2 =
            0.75 +
            this.mass2 * 0.13

        this.body1.scale.setScalar(
            scale1
        )

        this.body2.scale.setScalar(
            scale2
        )
    }


    /* =========================================================
       TRAILS
       ========================================================= */

    addTrailPoint(
        trail,
        position
    ) {

        trail.push({
            x: position.x,
            y: position.y,
            z: position.z
        })

        if (
            trail.length >
            this.maxTrailPoints
        ) {
            trail.shift()
        }
    }


    clearTrails() {

        this.trail1 = []
        this.trail2 = []
    }


    /* =========================================================
       IMPACT EFFECT
       ========================================================= */

    showImpactEffect() {

        if (!this.impactRing) {
            return
        }

        this.impactRing.position.x =
            this.collisionX

        this.impactRing.scale.setScalar(
            0.6
        )

        this.impactRing.material.opacity =
            0.95

        if (this.impactLight) {

            this.impactLight.intensity =
                5
        }
    }


    hideImpactEffect() {

        if (this.impactRing) {

            this.impactRing.material.opacity =
                0

            this.impactRing.scale.setScalar(
                0.6
            )
        }

        if (this.impactLight) {

            this.impactLight.intensity =
                0
        }
    }


    updateImpactEffect(delta) {

        if (
            !this.hasImpacted ||
            !this.impactRing
        ) {
            return
        }

        const scale =
            this.impactRing.scale.x +
            delta * 3.5

        this.impactRing.scale.setScalar(
            scale
        )

        this.impactRing.material.opacity =
            Math.max(
                0,
                this.impactRing.material.opacity -
                delta * 1.6
            )

        if (this.impactLight) {

            this.impactLight.intensity =
                Math.max(
                    0,
                    this.impactLight.intensity -
                    delta * 8
                )
        }
    }


    /* =========================================================
       UI UPDATE
       ========================================================= */

    updateUI() {

        if (
            !this.dom ||
            !this.dom.mass1Value
        ) {
            return
        }

        this.dom.mass1Value.textContent =
            `${this.mass1.toFixed(1)} kg`

        this.dom.mass2Value.textContent =
            `${this.mass2.toFixed(1)} kg`

        this.dom.velocity1Value.textContent =
            `${this.velocity1.toFixed(2)} m/s`

        this.dom.velocity2Value.textContent =
            `${this.velocity2.toFixed(2)} m/s`

        this.dom.momentumValue.textContent =
            `${this.momentumBefore.toFixed(2)} kg·m/s`

        this.dom.energyValue.textContent =
            `${this.energyBefore.toFixed(2)} J`

        this.dom.mass1ControlValue.textContent =
            `${this.mass1.toFixed(1)} kg`

        this.dom.mass2ControlValue.textContent =
            `${this.mass2.toFixed(1)} kg`

        this.dom.velocity1ControlValue.textContent =
            `${this.velocity1Initial.toFixed(1)} m/s`

        this.dom.velocity2ControlValue.textContent =
            `${this.velocity2Initial.toFixed(1)} m/s`

        if (this.dom.mass1Input) {
            this.dom.mass1Input.value =
                this.mass1
        }

        if (this.dom.mass2Input) {
            this.dom.mass2Input.value =
                this.mass2
        }

        if (this.dom.velocity1Input) {
            this.dom.velocity1Input.value =
                this.velocity1Initial
        }

        if (this.dom.velocity2Input) {
            this.dom.velocity2Input.value =
                this.velocity2Initial
        }

        let status
        let message
        let guideTitle

        if (this.completed) {

            status =
                this.tx(
                    'collision.complete',
                    'اكتملت التجربة',
                    'Experiment Complete'
                )

            message =
                this.tx(
                    'collision.completeMessage',
                    'انتهى التصادم. غيّر القيم وابدأ تجربة جديدة.',
                    'The collision is complete. Change the values and start a new experiment.'
                )

            guideTitle =
                this.tx(
                    'collision.educationalTitle',
                    'لحظة الاصطدام',
                    'The Moment of Collision'
                )

        } else if (this.hasImpacted) {

            status =
                this.tx(
                    'collision.impact',
                    'لحظة الاصطدام',
                    'Moment of Impact'
                )

            message =
                this.tx(
                    'collision.impactMessage',
                    'حدث الاصطدام! راقب كيف تغيّرت السرعات بينما بقي الزخم محفوظًا.',
                    'Impact! Observe how the velocities changed while momentum remained conserved.'
                )

            guideTitle =
                this.tx(
                    'collision.educationalImpactTitle',
                    'الزخم لا يختفي',
                    'Momentum Does Not Disappear'
                )

        } else if (this.running) {

            status =
                this.tx(
                    'collision.running',
                    'الجسمان في حركة',
                    'Objects in Motion'
                )

            message =
                this.tx(
                    'collision.runningMessage',
                    'الجسمان يتحركان نحو لحظة الاصطدام. راقب الزخم والطاقة قبل اللقاء.',
                    'The objects are moving toward impact. Observe momentum and energy before the collision.'
                )

            guideTitle =
                this.tx(
                    'collision.educationalRunningTitle',
                    'الجسمان يقتربان',
                    'The Objects Are Approaching'
                )

        } else if (this.paused) {

            status =
                this.tx(
                    'collision.paused',
                    'التجربة متوقفة مؤقتًا',
                    'The experiment is paused'
                )

            message =
                this.tx(
                    'collision.pausedMessage',
                    'أوقفت الحركة مؤقتًا. يمكنك متابعة التجربة.',
                    'Motion is paused. You can resume the experiment.'
                )

            guideTitle =
                this.tx(
                    'collision.guideTitle',
                    'ماذا يحدث لحظة الاصطدام؟',
                    'What happens at the moment of collision?'
                )

        } else {

            status =
                this.tx(
                    'collision.ready',
                    'جاهز للتجربة',
                    'Ready for Experiment'
                )

            message =
                this.tx(
                    'collision.readyMessage',
                    'غيّر الكتلة والسرعة إذا أردت، ثم ابدأ التصادم وشاهد ما يحدث لحظة الالتقاء.',
                    'Adjust the mass and velocity if you wish, then start the collision and observe what happens at the moment of impact.'
                )

            guideTitle =
                this.tx(
                    'collision.educationalDefaultTitle',
                    'ابدأ التجربة',
                    'Start the Experiment'
                )
        }

        this.dom.status.textContent =
            status

        this.dom.message.textContent =
            message

        this.dom.guideTitle.textContent =
            guideTitle

        if (this.dom.apply) {

            this.dom.apply.disabled =
                this.running ||
                this.hasImpacted
        }

        if (this.dom.pause) {

            this.dom.pause.disabled =
                !this.started ||
                this.completed
        }

        if (this.dom.reset) {

            this.dom.reset.disabled =
                false
        }

        this.updatePauseButton()
        this.updateStatusState()
        this.updateObjectScale()
    }


    updatePauseButton() {

        if (!this.dom.pause) {
            return
        }

        this.dom.pause.textContent =
            this.paused

                ? this.tx(
                    'collision.resume',
                    'متابعة الحركة',
                    'Resume Motion'
                )

                : this.tx(
                    'collision.pause',
                    'إيقاف مؤقت',
                    'Pause'
                )
    }


    updateStatusState() {

        if (!this.dom.statusDot) {
            return
        }

        this.dom.statusDot.classList.toggle(
            'is-running',
            this.running &&
            !this.paused
        )

        this.dom.statusDot.classList.toggle(
            'is-impact',
            this.hasImpacted
        )

        this.dom.statusDot.classList.toggle(
            'is-complete',
            this.completed
        )

        this.dom.statusDot.classList.toggle(
            'is-paused',
            this.paused
        )
    }


    /* =========================================================
       RESET
       ========================================================= */

    reset() {

        this.running = false
        this.paused = false
        this.started = false
        this.completed = false
        this.hasImpacted = false

        this.time = 0
        this.impactTime = 0

        this.velocity1 =
            this.velocity1Initial

        this.velocity2 =
            this.velocity2Initial

        this.velocity1After = 0
        this.velocity2After = 0

        this.momentumBefore = 0
        this.momentumAfter = 0

        this.energyBefore = 0
        this.energyAfter = 0

        if (this.body1) {

            this.body1.position.set(
                this.startX1,
                -0.35,
                0
            )
        }

        if (this.body2) {

            this.body2.position.set(
                this.startX2,
                -0.35,
                0
            )
        }

        this.clearTrails()
        this.hideImpactEffect()
        this.updateObjectScale()
        this.updateArrows()
        this.updateUI()

        if (this.active) {
            this.render()
        }

        this.emitState()
    }


    /* =========================================================
       DATA
       ========================================================= */

    getPhysicsData() {

        return {

            mass1:
                this.mass1,

            mass2:
                this.mass2,

            velocity1:
                this.velocity1,

            velocity2:
                this.velocity2,

            velocity1Initial:
                this.velocity1Initial,

            velocity2Initial:
                this.velocity2Initial,

            velocity1After:
                this.velocity1After,

            velocity2After:
                this.velocity2After,

            momentumBefore:
                this.momentumBefore,

            momentumAfter:
                this.momentumAfter,

            energyBefore:
                this.energyBefore,

            energyAfter:
                this.energyAfter,

            started:
                this.started,

            running:
                this.running,

            paused:
                this.paused,

            hasImpacted:
                this.hasImpacted,

            completed:
                this.completed
        }
    }


    getEducationalState() {

        if (this.completed) {

            return {

                title:
                    this.tx(
                        'collision.educationalCompleteTitle',
                        'اكتملت الحركة',
                        'Motion Complete'
                    ),

                message:
                    this.tx(
                        'collision.educationalCompleteMessage',
                        'لقد شاهدت كيف تغيّرت سرعات الجسمين بعد التصادم مع بقاء الزخم محفوظًا.',
                        'You observed how the velocities changed after the collision while momentum remained conserved.'
                    )
            }
        }

        if (this.hasImpacted) {

            return {

                title:
                    this.tx(
                        'collision.educationalImpactTitle',
                        'الزخم لا يختفي',
                        'Momentum Does Not Disappear'
                    ),

                message:
                    this.tx(
                        'collision.educationalImpactMessage',
                        'في التصادم المرن ينتقل الزخم بين الجسمين مع بقاء الزخم الكلي محفوظًا.',
                        'In an elastic collision, momentum is transferred between the objects while total momentum remains conserved.'
                    )
            }
        }

        if (this.running) {

            return {

                title:
                    this.tx(
                        'collision.educationalRunningTitle',
                        'الجسمان يقتربان',
                        'The Objects Are Approaching'
                    ),

                message:
                    this.tx(
                        'collision.educationalRunningMessage',
                        'راقب الكتلة والسرعة والزخم قبل أن يصل الجسمان إلى لحظة الاصطدام.',
                        'Observe mass, velocity, and momentum before the objects reach the moment of impact.'
                    )
            }
        }

        return {

            title:
                this.tx(
                    'collision.educationalDefaultTitle',
                    'ابدأ التجربة',
                    'Start the Experiment'
                ),

            message:
                this.tx(
                    'collision.educationalDefaultMessage',
                    'غيّر الكتلة والسرعة ثم ابدأ التصادم لمراقبة انتقال الزخم بين الجسمين.',
                    'Change the mass and velocity, then start the collision to observe momentum transfer between the objects.'
                )
        }
    }


    emitState() {

        window.dispatchEvent(
            new CustomEvent(
                'awtaar-collision-state',
                {
                    detail: {
                        physics:
                            this.getPhysicsData(),

                        educational:
                            this.getEducationalState()
                    }
                }
            )
        )
    }


    /* =========================================================
       COMPATIBILITY
       ========================================================= */

    addToScene(scene) {

        if (!scene) {
            return
        }

        this.scene =
            scene
    }


    setScene(scene) {

        this.scene =
            scene
    }


    /* =========================================================
       DESTROY
       ========================================================= */

    destroy() {

        window.removeEventListener(
            'awtaar-language-change',
            this.handleLanguageChange
        )

        if (this.resizeObserver) {

            this.resizeObserver.disconnect()

            this.resizeObserver =
                null
        }

        if (this.renderer) {

            this.renderer.dispose()

            this.renderer =
                null
        }

        if (this.canvas) {

            this.canvas.remove()

            this.canvas =
                null
        }

        if (this.ui) {

            this.ui.remove()

            this.ui =
                null
        }

        if (
            this.group &&
            this.group.parent
        ) {

            this.group.parent.remove(
                this.group
            )
        }

        if (this.group) {

            this.group.traverse(
                object => {

                    if (object.geometry) {
                        object.geometry.dispose()
                    }

                    if (object.material) {

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
        }

        if (this.renderScene) {

            this.renderScene.traverse(
                object => {

                    if (object.geometry) {
                        object.geometry.dispose()
                    }

                    if (object.material) {

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
        }

        this.dom = {}

        this.scene = null
        this.parentUI = null
        this.renderScene = null
        this.camera = null
    }
}