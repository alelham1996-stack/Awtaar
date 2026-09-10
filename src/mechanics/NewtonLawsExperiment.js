/* =========================================================
   AWTAAR — NEWTON'S LAWS EXPERIMENT
   =========================================================

   التجربة:
   "القوة التي تحرّك العالم"

   المفاهيم:
   - القوة Force
   - الكتلة Mass
   - التسارع Acceleration
   - السرعة Velocity
   - الاحتكاك Friction

   القانون الأساسي:

        F = m × a

   Three.js = MAIN VISUAL LAYER
   HTML     = LIGHT INTERACTION LAYER

   =========================================================
*/


import * as THREE from 'three'

import './NewtonLaws.css'

import {
    t,
    getLanguage
} from '../locales/i18n.js'


export default class NewtonLawsExperiment {


    /* =====================================================
       CONSTRUCTOR
       ===================================================== */

    constructor(
        scene = null,
        parent = null
    ) {

        this.scene = scene

        this.parent = parent


        /* =================================================
           ROOT THREE GROUP
           ================================================= */

        this.group =
            new THREE.Group()

        this.group.name =
            'AWTAAR_NewtonLawsExperiment'


        this.worldGroup =
            new THREE.Group()


        this.environmentGroup =
            new THREE.Group()


        this.trackGroup =
            new THREE.Group()


        this.objectGroup =
            new THREE.Group()


        this.forceGroup =
            new THREE.Group()


        this.effectGroup =
            new THREE.Group()


        this.group.add(
            this.worldGroup
        )


        this.worldGroup.add(
            this.environmentGroup
        )

        this.worldGroup.add(
            this.trackGroup
        )

        this.worldGroup.add(
            this.objectGroup
        )

        this.worldGroup.add(
            this.forceGroup
        )

        this.worldGroup.add(
            this.effectGroup
        )


        /* =================================================
           STATE
           ================================================= */

        this.active = false

        this.running = false

        this.paused = false

        this.applied = false

        this.phase = 0

        this.elapsed = 0


        /* =================================================
           PHYSICS
           ================================================= */

        this.mass = 2.0

        this.force = 0

        this.friction = 0.12

        this.velocity = 0

        this.acceleration = 0

        this.netForce = 0

        this.frictionForce = 0


        this.positionX = -4.6

        this.startPositionX = -4.6

        this.maxPositionX = 4.6


        /* =================================================
           VISUAL OBJECTS
           ================================================= */

        this.block = null

        this.blockTop = null

        this.blockCore = null

        this.blockGlow = null

        this.track = null

        this.trackEdge = null

        this.forceArrow = null

        this.forceArrowGlow = null

        this.accelerationArrow = null

        this.directionRing = null


        /* =================================================
           EFFECTS
           ================================================= */

        this.glowPulse = 0

        this.forcePulse = 0

        this.trailTimer = 0


        /* =================================================
           COLORS
           ================================================= */

        this.colors = {

            black: 0x070706,

            surface: 0x11100d,

            surfaceLight: 0x1d1a14,

            gold: 0xd5ad55,

            goldBright: 0xf1cc72,

            goldSoft: 0xb28b3c,

            ivory: 0xe8e1d3,

            white: 0xf6f1e7,

            muted: 0x817866,

            grid: 0x4a4030,

            energy: 0xe6c267

        }


        /* =================================================
           HTML
           ================================================= */

        this.ui = null

        this.dom = {}


        /* =================================================
           LANGUAGE
           ================================================= */

        this.handleLanguageChange =
            () => {

                this.updateLanguage()

            }


        window.addEventListener(
            'awtaar-language-change',
            this.handleLanguageChange
        )


        /* =================================================
           CREATE
           ================================================= */

        this.createEnvironment()

        this.createTrack()

        this.createBlock()

        this.createForceArrow()

        this.createAccelerationArrow()

        this.createDirectionIndicator()

        this.createUI()

        this.bindUI()

        this.reset()

    }


    /* =====================================================
       TRANSLATION HELPER
       ===================================================== */

    tx(
        key,
        arabic,
        english
    ) {

        const translated =
            t(key)


        if (
            translated &&
            translated !== key
        ) {

            return translated

        }


        return getLanguage() === 'en'
            ? english
            : arabic

    }


    /* =====================================================
       ENVIRONMENT
       ===================================================== */

    createEnvironment() {

        const floorGeometry =
            new THREE.PlaneGeometry(
                20,
                12
            )


        const floorMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    this.colors.black,

                roughness:
                    0.88,

                metalness:
                    0.05
            })


        const floor =
            new THREE.Mesh(
                floorGeometry,
                floorMaterial
            )


        floor.rotation.x =
            -Math.PI * 0.5


        floor.position.y =
            -0.34


        this.environmentGroup.add(
            floor
        )


        /* -----------------------------------------------
           HORIZON
           ----------------------------------------------- */

        const horizonGeometry =
            new THREE.BoxGeometry(
                17,
                0.018,
                0.018
            )


        const horizonMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    this.colors.gold,

                transparent:
                    true,

                opacity:
                    0.20
            })


        const horizon =
            new THREE.Mesh(
                horizonGeometry,
                horizonMaterial
            )


        horizon.position.set(
            0,
            2.65,
            -2.5
        )


        this.environmentGroup.add(
            horizon
        )


        /* -----------------------------------------------
           BACKGROUND GRID
           ----------------------------------------------- */

        for (
            let i = -8;
            i <= 8;
            i++
        ) {

            const geometry =
                new THREE.BoxGeometry(
                    0.012,
                    5.2,
                    0.012
                )


            const material =
                new THREE.MeshBasicMaterial({

                    color:
                        this.colors.grid,

                    transparent:
                        true,

                    opacity:
                        0.10
                })


            const line =
                new THREE.Mesh(
                    geometry,
                    material
                )


            line.position.set(
                i,
                2,
                -2.52
            )


            this.environmentGroup.add(
                line
            )

        }


        /* -----------------------------------------------
           LIGHTING
           ----------------------------------------------- */

        const ambient =
            new THREE.HemisphereLight(
                0xf2e7cc,
                0x040403,
                1.25
            )


        this.environmentGroup.add(
            ambient
        )


        const keyLight =
            new THREE.DirectionalLight(
                0xfff2d2,
                2.6
            )


        keyLight.position.set(
            -4,
            7,
            5
        )


        this.environmentGroup.add(
            keyLight
        )


        const goldLight =
            new THREE.PointLight(
                this.colors.gold,
                2.4,
                12
            )


        goldLight.position.set(
            0,
            3,
            2
        )


        this.environmentGroup.add(
            goldLight
        )

    }


    /* =====================================================
       TRACK
       ===================================================== */

    createTrack() {

        const geometry =
            new THREE.BoxGeometry(
                13.2,
                0.24,
                3.3
            )


        const material =
            new THREE.MeshStandardMaterial({

                color:
                    this.colors.surface,

                roughness:
                    0.56,

                metalness:
                    0.25
            })


        this.track =
            new THREE.Mesh(
                geometry,
                material
            )


        this.track.position.y =
            0


        this.trackGroup.add(
            this.track
        )


        /* -----------------------------------------------
           GOLD EDGE
           ----------------------------------------------- */

        const edgeGeometry =
            new THREE.BoxGeometry(
                13.35,
                0.035,
                3.4
            )


        const edgeMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    this.colors.gold,

                transparent:
                    true,

                opacity:
                    0.40
            })


        this.trackEdge =
            new THREE.Mesh(
                edgeGeometry,
                edgeMaterial
            )


        this.trackEdge.position.y =
            0.14


        this.trackGroup.add(
            this.trackEdge
        )


        /* -----------------------------------------------
           CENTER LINE
           ----------------------------------------------- */

        const centerGeometry =
            new THREE.BoxGeometry(
                12.8,
                0.012,
                0.025
            )


        const centerMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    this.colors.goldSoft,

                transparent:
                    true,

                opacity:
                    0.40
            })


        const centerLine =
            new THREE.Mesh(
                centerGeometry,
                centerMaterial
            )


        centerLine.position.y =
            0.15


        this.trackGroup.add(
            centerLine
        )


        /* -----------------------------------------------
           POSITION MARKERS
           ----------------------------------------------- */

        for (
            let i = -6;
            i <= 6;
            i++
        ) {

            const markerGeometry =
                new THREE.BoxGeometry(
                    0.018,
                    0.025,
                    0.45
                )


            const markerMaterial =
                new THREE.MeshBasicMaterial({

                    color:
                        this.colors.goldSoft,

                    transparent:
                        true,

                    opacity:
                        0.25
                })


            const marker =
                new THREE.Mesh(
                    markerGeometry,
                    markerMaterial
                )


            marker.position.set(
                i,
                0.16,
                0
            )


            this.trackGroup.add(
                marker
            )

        }

    }


    /* =====================================================
       BLOCK
       ===================================================== */

    createBlock() {

        const geometry =
            new THREE.BoxGeometry(
                1.5,
                1.18,
                1.35
            )


        const material =
            new THREE.MeshStandardMaterial({

                color:
                    this.colors.ivory,

                roughness:
                    0.27,

                metalness:
                    0.20
            })


        this.block =
            new THREE.Mesh(
                geometry,
                material
            )


        this.block.position.set(
            this.positionX,
            0.82,
            0
        )


        this.block.castShadow =
            true


        this.block.receiveShadow =
            true


        this.objectGroup.add(
            this.block
        )


        /* -----------------------------------------------
           TOP GOLD PLATE
           ----------------------------------------------- */

        const topGeometry =
            new THREE.BoxGeometry(
                1.15,
                0.035,
                1.02
            )


        const topMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    this.colors.gold,

                roughness:
                    0.30,

                metalness:
                    0.62
            })


        this.blockTop =
            new THREE.Mesh(
                topGeometry,
                topMaterial
            )


        this.blockTop.position.y =
            0.61


        this.block.add(
            this.blockTop
        )


        /* -----------------------------------------------
           CORE
           ----------------------------------------------- */

        const coreGeometry =
            new THREE.SphereGeometry(
                0.19,
                32,
                32
            )


        const coreMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    this.colors.goldBright,

                transparent:
                    true,

                opacity:
                    0.95
            })


        this.blockCore =
            new THREE.Mesh(
                coreGeometry,
                coreMaterial
            )


        this.blockCore.position.set(
            0,
            0.04,
            0.69
        )


        this.block.add(
            this.blockCore
        )


        /* -----------------------------------------------
           CORE GLOW
           ----------------------------------------------- */

        const glowGeometry =
            new THREE.SphereGeometry(
                0.35,
                24,
                24
            )


        const glowMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    this.colors.goldBright,

                transparent:
                    true,

                opacity:
                    0.10,

                depthWrite:
                    false
            })


        this.blockGlow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            )


        this.blockGlow.position.copy(
            this.blockCore.position
        )


        this.block.add(
            this.blockGlow
        )


        /* -----------------------------------------------
           FRONT INDICATOR
           ----------------------------------------------- */

        const indicatorGeometry =
            new THREE.BoxGeometry(
                0.5,
                0.06,
                0.055
            )


        const indicatorMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    this.colors.goldBright
            })


        const indicator =
            new THREE.Mesh(
                indicatorGeometry,
                indicatorMaterial
            )


        indicator.position.set(
            0,
            -0.02,
            0.69
        )


        this.block.add(
            indicator
        )

    }


    /* =====================================================
       FORCE ARROW
       ===================================================== */

    createForceArrow() {

        this.forceArrow =
            new THREE.ArrowHelper(

                new THREE.Vector3(
                    1,
                    0,
                    0
                ),

                new THREE.Vector3(
                    0,
                    1.65,
                    0
                ),

                1.5,

                this.colors.goldBright,

                0.34,

                0.18
            )


        this.forceArrow.visible =
            false


        this.forceGroup.add(
            this.forceArrow
        )


        this.forceArrowGlow =
            new THREE.ArrowHelper(

                new THREE.Vector3(
                    1,
                    0,
                    0
                ),

                new THREE.Vector3(
                    0,
                    1.65,
                    0
                ),

                1.5,

                this.colors.gold,

                0.45,

                0.24
            )


        this.forceArrowGlow.visible =
            false


        this.forceGroup.add(
            this.forceArrowGlow
        )

    }


    /* =====================================================
       ACCELERATION ARROW
       ===================================================== */

    createAccelerationArrow() {

        this.accelerationArrow =
            new THREE.ArrowHelper(

                new THREE.Vector3(
                    1,
                    0,
                    0
                ),

                new THREE.Vector3(
                    0,
                    1.25,
                    0.7
                ),

                1.2,

                this.colors.ivory,

                0.25,

                0.14
            )


        this.accelerationArrow.visible =
            false


        this.forceGroup.add(
            this.accelerationArrow
        )

    }


    /* =====================================================
       DIRECTION RING
       ===================================================== */

    createDirectionIndicator() {

        const geometry =
            new THREE.RingGeometry(
                0.26,
                0.31,
                32,
                1,
                -Math.PI * 0.45,
                Math.PI * 0.9
            )


        const material =
            new THREE.MeshBasicMaterial({

                color:
                    this.colors.goldBright,

                transparent:
                    true,

                opacity:
                    0.50,

                side:
                    THREE.DoubleSide
            })


        this.directionRing =
            new THREE.Mesh(
                geometry,
                material
            )


        this.directionRing.rotation.x =
            -Math.PI * 0.5


        this.directionRing.position.set(
            this.positionX,
            0.18,
            0
        )


        this.directionRing.visible =
            false


        this.forceGroup.add(
            this.directionRing
        )

    }


    /* =====================================================
       CREATE HTML UI
       ===================================================== */

    createUI() {

        this.ui =
            document.createElement(
                'div'
            )


        this.ui.className =
            'newton-laws-container'


        this.ui.innerHTML = `

            <div class="newton-laws-header">

                <div class="newton-laws-eyebrow"
                    data-i18n="eyebrow">
                    NEWTON'S SECOND LAW
                </div>

                <h1
                    class="newton-laws-title"
                    data-i18n="title"
                >
                    القوة التي تحرّك العالم
                </h1>

                <p
                    class="newton-laws-title-sub"
                    data-i18n="subtitle"
                >
                    اكتشف كيف تغيّر القوة حركة الجسم
                </p>

            </div>


            <button
                class="newton-laws-back"
                type="button"
                data-action="back"
                aria-label="العودة"
            >
                ←
            </button>


            <div class="newton-laws-guide">


                <div class="newton-laws-guide-header">

                    <div
                        class="newton-laws-guide-kicker"
                        data-i18n="interactive"
                    >
                        تجربة تفاعلية
                    </div>

                    <h2
                        class="newton-laws-guide-title"
                        data-i18n="guideTitle"
                    >
                        كيف تصنع القوة تسارعًا؟
                    </h2>

                    <p
                        class="newton-laws-guide-message"
                        data-role="message"
                    >
                        اختر القيم أولًا، ثم طبّق القوة على الجسم.
                    </p>

                </div>


                <div class="newton-laws-values">

                    <div class="newton-laws-value">

                        <span
                            class="newton-laws-value-label"
                            data-i18n="force"
                        >
                            القوة
                        </span>

                        <span
                            class="newton-laws-value-number"
                            data-value="force"
                        >
                            0.0
                            <small class="newton-laws-value-unit">
                                N
                            </small>
                        </span>

                    </div>


                    <div class="newton-laws-value">

                        <span
                            class="newton-laws-value-label"
                            data-i18n="mass"
                        >
                            الكتلة
                        </span>

                        <span
                            class="newton-laws-value-number"
                            data-value="mass"
                        >
                            2.0
                            <small class="newton-laws-value-unit">
                                kg
                            </small>
                        </span>

                    </div>


                    <div class="newton-laws-value">

                        <span
                            class="newton-laws-value-label"
                            data-i18n="acceleration"
                        >
                            التسارع
                        </span>

                        <span
                            class="newton-laws-value-number"
                            data-value="acceleration"
                        >
                            0.0
                            <small class="newton-laws-value-unit">
                                m/s²
                            </small>
                        </span>

                    </div>


                    <div class="newton-laws-value">

                        <span
                            class="newton-laws-value-label"
                            data-i18n="velocity"
                        >
                            السرعة
                        </span>

                        <span
                            class="newton-laws-value-number"
                            data-value="velocity"
                        >
                            0.0
                            <small class="newton-laws-value-unit">
                                m/s
                            </small>
                        </span>

                    </div>

                </div>


                <div class="newton-laws-formula">

                    <div class="newton-laws-formula-text">

                        <span class="formula-force">
                            F
                        </span>

                        <span>
                            =
                        </span>

                        <span class="formula-mass">
                            m
                        </span>

                        <span>
                            ×
                        </span>

                        <span class="formula-acceleration">
                            a
                        </span>

                    </div>

                </div>


                <div class="newton-laws-control-group">

                    <div class="newton-laws-control-label">

                        <span data-i18n="force">
                            القوة
                        </span>

                        <span
                            class="newton-laws-control-value"
                            data-control-value="force"
                        >
                            0.0 N
                        </span>

                    </div>

                    <input
                        class="newton-laws-range"
                        type="range"
                        min="0"
                        max="10"
                        step="0.1"
                        value="0"
                        data-control="force"
                    >

                </div>


                <div class="newton-laws-control-group">

                    <div class="newton-laws-control-label">

                        <span data-i18n="mass">
                            الكتلة
                        </span>

                        <span
                            class="newton-laws-control-value"
                            data-control-value="mass"
                        >
                            2.0 kg
                        </span>

                    </div>

                    <input
                        class="newton-laws-range"
                        type="range"
                        min="0.5"
                        max="10"
                        step="0.1"
                        value="2"
                        data-control="mass"
                    >

                </div>


                <div class="newton-laws-control-group">

                    <div class="newton-laws-control-label">

                        <span data-i18n="friction">
                            الاحتكاك
                        </span>

                        <span
                            class="newton-laws-control-value"
                            data-control-value="friction"
                        >
                            12%
                        </span>

                    </div>

                    <input
                        class="newton-laws-range"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value="0.12"
                        data-control="friction"
                    >

                </div>


                <button
                    class="newton-laws-action"
                    type="button"
                    data-action="apply"
                    data-i18n="apply"
                >
                    تطبيق القوة
                </button>


                <div class="newton-laws-secondary-actions">

                    <button
                        class="newton-laws-secondary"
                        type="button"
                        data-action="pause"
                    >
                        إيقاف مؤقت
                    </button>

                    <button
                        class="newton-laws-secondary"
                        type="button"
                        data-action="reset"
                        data-i18n="reset"
                    >
                        إعادة
                    </button>

                </div>


                <div
                    class="newton-laws-status"
                    data-role="status"
                >

                    <span class="newton-laws-status-dot"></span>

                    <span data-role="status-text">
                        جاهز للتجربة
                    </span>

                </div>


                <div
                    class="newton-laws-hint"
                    data-i18n="hint"
                >
                    اختر القوة والكتلة والاحتكاك،
                    ثم طبّق القوة وشاهد أثرها في الحركة.
                </div>

            </div>


            <div
                class="newton-laws-force-indicator"
                data-role="force-indicator"
            >

                <span class="newton-laws-force-indicator-arrow">
                    →
                </span>

                <span data-i18n="forceApplied">
                    قوة مؤثرة
                </span>

            </div>


            <div class="newton-laws-info">

                <span class="newton-laws-info-icon">
                    i
                </span>

                <span data-i18n="info">
                    القوة المحصلة هي التي تحدد تسارع الجسم
                </span>

            </div>

        `


        document.body.appendChild(
            this.ui
        )


        this.cacheDOM()

        this.updateLanguage()

    }


    /* =====================================================
       CACHE DOM
       ===================================================== */

    cacheDOM() {

        if (!this.ui)
            return


        this.dom.back =
            this.ui.querySelector(
                '[data-action="back"]'
            )


        this.dom.apply =
            this.ui.querySelector(
                '[data-action="apply"]'
            )


        this.dom.pause =
            this.ui.querySelector(
                '[data-action="pause"]'
            )


        this.dom.reset =
            this.ui.querySelector(
                '[data-action="reset"]'
            )


        this.dom.message =
            this.ui.querySelector(
                '[data-role="message"]'
            )


        this.dom.status =
            this.ui.querySelector(
                '[data-role="status"]'
            )


        this.dom.statusText =
            this.ui.querySelector(
                '[data-role="status-text"]'
            )


        this.dom.forceIndicator =
            this.ui.querySelector(
                '[data-role="force-indicator"]'
            )


        this.dom.forceValue =
            this.ui.querySelector(
                '[data-value="force"]'
            )


        this.dom.massValue =
            this.ui.querySelector(
                '[data-value="mass"]'
            )


        this.dom.accelerationValue =
            this.ui.querySelector(
                '[data-value="acceleration"]'
            )


        this.dom.velocityValue =
            this.ui.querySelector(
                '[data-value="velocity"]'
            )


        this.dom.forceControl =
            this.ui.querySelector(
                '[data-control="force"]'
            )


        this.dom.massControl =
            this.ui.querySelector(
                '[data-control="mass"]'
            )


        this.dom.frictionControl =
            this.ui.querySelector(
                '[data-control="friction"]'
            )


        this.dom.forceControlValue =
            this.ui.querySelector(
                '[data-control-value="force"]'
            )


        this.dom.massControlValue =
            this.ui.querySelector(
                '[data-control-value="mass"]'
            )


        this.dom.frictionControlValue =
            this.ui.querySelector(
                '[data-control-value="friction"]'
            )

    }


    /* =====================================================
       BIND UI
       ===================================================== */

    bindUI() {

        if (!this.ui)
            return


        /* -----------------------------------------------
           BACK
           ----------------------------------------------- */

        if (this.dom.back) {

            this.dom.back.addEventListener(
                'click',
                () => {

                    if (
                        this.parent &&
                        typeof this.parent.returnToWorld ===
                        'function'
                    ) {

                        this.parent.returnToWorld()

                    }

                }
            )

        }


        /* -----------------------------------------------
           APPLY FORCE
           ----------------------------------------------- */

        if (this.dom.apply) {

            this.dom.apply.addEventListener(
                'click',
                () => {

                    this.applyForce()

                }
            )

        }


        /* -----------------------------------------------
           PAUSE / RESUME
           ----------------------------------------------- */

        if (this.dom.pause) {

            this.dom.pause.addEventListener(
                'click',
                () => {

                    if (this.running) {

                        this.pause()

                    }

                    else if (this.paused) {

                        this.resume()

                    }

                }
            )

        }


        /* -----------------------------------------------
           RESET
           ----------------------------------------------- */

        if (this.dom.reset) {

            this.dom.reset.addEventListener(
                'click',
                () => {

                    this.reset()

                }
            )

        }


        /* -----------------------------------------------
           FORCE CONTROL
           ----------------------------------------------- */

        if (this.dom.forceControl) {

            this.dom.forceControl.addEventListener(
                'input',
                event => {

                    this.setForce(
                        event.target.value
                    )

                }
            )

        }


        /* -----------------------------------------------
           MASS CONTROL
           ----------------------------------------------- */

        if (this.dom.massControl) {

            this.dom.massControl.addEventListener(
                'input',
                event => {

                    this.setMass(
                        event.target.value
                    )

                }
            )

        }


        /* -----------------------------------------------
           FRICTION CONTROL
           ----------------------------------------------- */

        if (this.dom.frictionControl) {

            this.dom.frictionControl.addEventListener(
                'input',
                event => {

                    this.setFriction(
                        event.target.value
                    )

                }
            )

        }

    }


    /* =====================================================
       UPDATE LANGUAGE
       ===================================================== */

    updateLanguage() {

        if (!this.ui)
            return


        const language =
            getLanguage()


        /* -----------------------------------------------
           DIRECTION
           ----------------------------------------------- */

        this.ui.dir =
            language === 'en'
                ? 'ltr'
                : 'rtl'


        /* -----------------------------------------------
           STATIC TEXT
           ----------------------------------------------- */

        const eyebrow =
            this.ui.querySelector(
                '[data-i18n="eyebrow"]'
            )

        const title =
            this.ui.querySelector(
                '[data-i18n="title"]'
            )

        const subtitle =
            this.ui.querySelector(
                '[data-i18n="subtitle"]'
            )

        const interactive =
            this.ui.querySelector(
                '[data-i18n="interactive"]'
            )

        const guideTitle =
            this.ui.querySelector(
                '[data-i18n="guideTitle"]'
            )

        const forceLabels =
            this.ui.querySelectorAll(
                '[data-i18n="force"]'
            )

        const massLabels =
            this.ui.querySelectorAll(
                '[data-i18n="mass"]'
            )

        const accelerationLabels =
            this.ui.querySelectorAll(
                '[data-i18n="acceleration"]'
            )

        const velocityLabels =
            this.ui.querySelectorAll(
                '[data-i18n="velocity"]'
            )

        const frictionLabels =
            this.ui.querySelectorAll(
                '[data-i18n="friction"]'
            )

        const applyButton =
            this.ui.querySelector(
                '[data-i18n="apply"]'
            )

        const resetButton =
            this.ui.querySelector(
                '[data-i18n="reset"]'
            )

        const hint =
            this.ui.querySelector(
                '[data-i18n="hint"]'
            )

        const forceApplied =
            this.ui.querySelector(
                '[data-i18n="forceApplied"]'
            )

        const info =
            this.ui.querySelector(
                '[data-i18n="info"]'
            )


        if (eyebrow)
            eyebrow.textContent =
                this.tx(
                    'newtonLaws.eyebrow',
                    "قانون نيوتن الثاني",
                    "NEWTON'S SECOND LAW"
                )


        if (title)
            title.textContent =
                this.tx(
                    'newtonLaws.title',
                    'القوة التي تحرّك العالم',
                    'The Force That Moves the World'
                )


        if (subtitle)
            subtitle.textContent =
                this.tx(
                    'newtonLaws.description',
                    'اكتشف كيف تغيّر القوة حركة الجسم',
                    'Discover how force changes the motion of an object.'
                )


        if (interactive)
            interactive.textContent =
                this.tx(
                    'newtonLaws.interactive',
                    'تجربة تفاعلية',
                    'Interactive Experiment'
                )


        if (guideTitle)
            guideTitle.textContent =
                this.tx(
                    'newtonLaws.guideTitle',
                    'كيف تصنع القوة تسارعًا؟',
                    'How Does Force Create Acceleration?'
                )


        forceLabels.forEach(
            element => {

                element.textContent =
                    this.tx(
                        'newtonLaws.force',
                        'القوة',
                        'Force'
                    )

            }
        )


        massLabels.forEach(
            element => {

                element.textContent =
                    this.tx(
                        'newtonLaws.mass',
                        'الكتلة',
                        'Mass'
                    )

            }
        )


        accelerationLabels.forEach(
            element => {

                element.textContent =
                    this.tx(
                        'newtonLaws.acceleration',
                        'التسارع',
                        'Acceleration'
                    )

            }
        )


        velocityLabels.forEach(
            element => {

                element.textContent =
                    this.tx(
                        'newtonLaws.velocity',
                        'السرعة',
                        'Velocity'
                    )

            }
        )


        frictionLabels.forEach(
            element => {

                element.textContent =
                    this.tx(
                        'newtonLaws.friction',
                        'الاحتكاك',
                        'Friction'
                    )

            }
        )


        if (applyButton)
            applyButton.textContent =
                this.tx(
                    'newtonLaws.applyForce',
                    'تطبيق القوة',
                    'Apply Force'
                )


        if (resetButton)
            resetButton.textContent =
                this.tx(
                    'newtonLaws.reset',
                    'إعادة',
                    'Reset'
                )


        if (hint)
            hint.textContent =
                this.tx(
                    'newtonLaws.hint',
                    'اختر القوة والكتلة والاحتكاك، ثم طبّق القوة وشاهد أثرها في الحركة.',
                    'Choose the force, mass, and friction, then apply the force and observe its effect on motion.'
                )


        if (forceApplied)
            forceApplied.textContent =
                this.tx(
                    'newtonLaws.forceApplied',
                    'قوة مؤثرة',
                    'Applied Force'
                )


        if (info)
            info.textContent =
                this.tx(
                    'newtonLaws.info',
                    'القوة المحصلة هي التي تحدد تسارع الجسم',
                    'The net force determines the acceleration of the object.'
                )


        /* -----------------------------------------------
           BACK BUTTON
           ----------------------------------------------- */

        if (this.dom.back) {

            this.dom.back.textContent =
                language === 'en'
                    ? '→'
                    : '←'


            this.dom.back.setAttribute(
                'aria-label',
                this.tx(
                    'common.back',
                    'العودة',
                    'Back'
                )
            )

        }


        /* -----------------------------------------------
           PAUSE BUTTON
           ----------------------------------------------- */

        if (this.dom.pause) {

            this.dom.pause.textContent =
                this.paused
                    ? this.tx(
                        'newtonLaws.resume',
                        'متابعة',
                        'Resume'
                    )
                    : this.tx(
                        'newtonLaws.pause',
                        'إيقاف مؤقت',
                        'Pause'
                    )

        }


        /*
         * Message and status are dynamic,
         * so updateUI() is responsible for them.
         */

        this.updateUI()

    }


    /* =====================================================
       SHOW
       ===================================================== */

    show() {

        this.active =
            true


        /*
         * IMPORTANT:
         *
         * Opening the experiment NEVER starts movement.
         */

        this.running =
            false

        this.paused =
            false

        this.applied =
            false


        this.phase =
            0


        this.velocity =
            0


        this.acceleration =
            0


        this.netForce =
            0


        this.frictionForce =
            0


        this.positionX =
            this.startPositionX


        if (this.block) {

            this.block.position.set(
                this.positionX,
                0.82,
                0
            )

        }


        this.group.visible =
            true


        if (
            this.scene &&
            !this.group.parent
        ) {

            this.scene.add(
                this.group
            )

        }


        if (this.ui) {

            this.ui.classList.remove(
                'is-hidden'
            )

            this.ui.classList.add(
                'is-entering'
            )

        }


        this.hideForce()

        this.clearTrail()

        this.updateUI()

        this.emitState()


        return this

    }


    /* =====================================================
       HIDE
       ===================================================== */

    hide() {

        this.active =
            false

        this.running =
            false

        this.paused =
            false

        this.applied =
            false


        this.group.visible =
            false


        if (this.ui) {

            this.ui.classList.add(
                'is-hidden'
            )

        }


        this.hideForce()

        return this

    }


    /* =====================================================
       START
       ===================================================== */

    start() {

        if (!this.active) {

            this.show()

        }


        /*
         * Deliberately stationary.
         */

        this.running =
            false

        this.paused =
            false

        this.applied =
            false

        this.phase =
            0

        this.velocity =
            0

        this.acceleration =
            0

        this.positionX =
            this.startPositionX


        this.hideForce()

        this.updateUI()

        this.emitState()


        return this

    }


    /* =====================================================
       APPLY FORCE
       ===================================================== */

    applyForce(
        value = null
    ) {

        if (!this.active) {

            this.show()

        }


        if (value !== null) {

            this.setForce(
                value,
                false
            )

        }


        this.applied =
            true


        this.paused =
            false


        this.elapsed =
            0


        this.velocity =
            0


        this.positionX =
            this.startPositionX


        this.calculateAcceleration()


        if (
            this.force <= 0 ||
            this.acceleration <= 0
        ) {

            this.running =
                false

            this.phase =
                1

            this.showForce()

            this.updateUI()

            this.emitState()

            return this

        }


        this.running =
            true

        this.phase =
            2


        this.showForce()

        this.updateUI()

        this.emitState()


        return this

    }


    /* =====================================================
       PAUSE
       ===================================================== */

    pause() {

        if (!this.running)
            return this


        this.running =
            false

        this.paused =
            true


        this.updateUI()

        this.emitState()


        return this

    }


    /* =====================================================
       RESUME
       ===================================================== */

    resume() {

        if (!this.paused)
            return this


        this.running =
            true

        this.paused =
            false


        this.updateUI()

        this.emitState()


        return this

    }


    /* =====================================================
       STOP
       ===================================================== */

    stop() {

        this.running =
            false

        this.paused =
            false


        this.updateUI()

        this.emitState()


        return this

    }


    /* =====================================================
       SET FORCE
       ===================================================== */

    setForce(
        value = 0,
        update = true
    ) {

        this.force =
            THREE.MathUtils.clamp(
                Number(value) || 0,
                0,
                10
            )


        if (!this.applied) {

            this.acceleration =
                0

            this.netForce =
                0

            this.frictionForce =
                0

        }

        else {

            this.calculateAcceleration()

        }


        if (update) {

            this.updateUI()

            this.emitState()

        }


        return this

    }


    /* =====================================================
       SET MASS
       ===================================================== */

    setMass(
        value = 2
    ) {

        this.mass =
            THREE.MathUtils.clamp(
                Number(value) || 2,
                0.5,
                10
            )


        if (!this.applied) {

            this.acceleration =
                0

            this.netForce =
                0

            this.frictionForce =
                0

        }

        else {

            this.calculateAcceleration()

        }


        this.updateUI()

        this.emitState()


        return this

    }


    /* =====================================================
       SET FRICTION
       ===================================================== */

    setFriction(
        value = 0.12
    ) {

        this.friction =
            THREE.MathUtils.clamp(
                Number(value) || 0,
                0,
                1
            )


        if (!this.applied) {

            this.acceleration =
                0

            this.netForce =
                0

            this.frictionForce =
                0

        }

        else {

            this.calculateAcceleration()

        }


        this.updateUI()

        this.emitState()


        return this

    }


    /* =====================================================
       CALCULATE ACCELERATION
       ===================================================== */

    calculateAcceleration() {

        const gravity =
            0.5


        this.frictionForce =
            this.friction *
            this.mass *
            gravity


        this.netForce =
            this.force -
            this.frictionForce


        if (this.netForce <= 0) {

            this.netForce =
                0

            this.acceleration =
                0

            return 0

        }


        this.acceleration =
            this.netForce /
            this.mass


        return this.acceleration

    }


    /* =====================================================
       UPDATE
       ===================================================== */

    update(
        delta = 0.016
    ) {

        if (!this.active)
            return


        delta =
            THREE.MathUtils.clamp(
                delta,
                0,
                0.05
            )


        this.elapsed +=
            delta


        this.animateIdle(
            delta
        )


        if (
            !this.applied ||
            !this.running ||
            this.paused
        ) {

            this.updateUI()

            return

        }


        this.calculateAcceleration()


        if (this.acceleration <= 0) {

            this.velocity =
                0

            this.running =
                false

            this.phase =
                1

            this.updateUI()

            this.emitState()

            return

        }


        /* -----------------------------------------------
           PHYSICS
           ----------------------------------------------- */

        this.velocity +=
            this.acceleration *
            delta


        this.positionX +=
            this.velocity *
            delta


        /* -----------------------------------------------
           END OF TRACK
           ----------------------------------------------- */

        if (
            this.positionX >=
            this.maxPositionX
        ) {

            this.positionX =
                this.maxPositionX

            this.velocity =
                0

            this.running =
                false

            this.phase =
                3


            this.hideForce()

        }

        else {

            this.phase =
                2

        }


        /* -----------------------------------------------
           BLOCK
           ----------------------------------------------- */

        if (this.block) {

            this.block.position.x =
                this.positionX


            const bob =
                Math.sin(
                    this.elapsed * 8
                ) *
                Math.min(
                    Math.abs(
                        this.velocity
                    ) * 0.006,
                    0.018
                )


            this.block.position.y =
                0.82 +
                bob

        }


        /* -----------------------------------------------
           DIRECTION RING
           ----------------------------------------------- */

        if (this.directionRing) {

            this.directionRing.position.x =
                this.positionX

            this.directionRing.rotation.z +=
                delta * 1.8

        }


        /* -----------------------------------------------
           FORCE VISUAL
           ----------------------------------------------- */

        this.animateForce(
            delta
        )


        /* -----------------------------------------------
           TRAIL
           ----------------------------------------------- */

        this.updateTrail(
            delta
        )


        this.updateUI()

        this.emitState()

    }


    /* =====================================================
       IDLE ANIMATION
       ===================================================== */

    animateIdle(
        delta
    ) {

        this.glowPulse +=
            delta


        if (this.blockCore) {

            const pulse =
                1 +
                Math.sin(
                    this.glowPulse * 2.2
                ) * 0.08


            this.blockCore
                .scale
                .setScalar(
                    pulse
                )

        }


        if (this.blockGlow) {

            this.blockGlow
                .scale
                .setScalar(
                    1 +
                    Math.sin(
                        this.glowPulse * 2
                    ) * 0.12
                )

        }

    }


    /* =====================================================
       FORCE ANIMATION
       ===================================================== */

    animateForce(
        delta
    ) {

        if (
            !this.forceArrow ||
            !this.forceArrow.visible
        ) {

            return

        }


        this.forcePulse +=
            delta


        const pulse =
            1 +
            Math.sin(
                this.forcePulse * 12
            ) * 0.055


        const length =
            THREE.MathUtils.clamp(
                0.9 +
                this.force * 0.42,
                0.9,
                5
            )


        this.forceArrow.setLength(
            length * pulse,
            0.34,
            0.18
        )


        this.forceArrowGlow.setLength(
            length * pulse,
            0.45,
            0.24
        )


        this.forceArrow.position.x =
            this.positionX + 0.82


        this.forceArrowGlow.position.x =
            this.positionX + 0.82


        if (this.accelerationArrow) {

            const accelerationLength =
                THREE.MathUtils.clamp(
                    0.7 +
                    this.acceleration * 0.7,
                    0.7,
                    3.2
                )


            this.accelerationArrow.position.x =
                this.positionX


            this.accelerationArrow.setLength(
                accelerationLength,
                0.25,
                0.14
            )


            this.accelerationArrow.visible =
                this.acceleration > 0.01

        }

    }


    /* =====================================================
       SHOW FORCE
       ===================================================== */

    showForce() {

        const visible =
            this.applied &&
            this.force > 0


        if (this.forceArrow)
            this.forceArrow.visible =
                visible


        if (this.forceArrowGlow)
            this.forceArrowGlow.visible =
                visible


        if (this.accelerationArrow)
            this.accelerationArrow.visible =
                visible &&
                this.acceleration > 0.01


        if (this.directionRing)
            this.directionRing.visible =
                visible


        if (this.dom.forceIndicator) {

            this.dom.forceIndicator
                .classList.toggle(
                    'visible',
                    visible
                )

        }

    }


    /* =====================================================
       HIDE FORCE
       ===================================================== */

    hideForce() {

        if (this.forceArrow)
            this.forceArrow.visible =
                false


        if (this.forceArrowGlow)
            this.forceArrowGlow.visible =
                false


        if (this.accelerationArrow)
            this.accelerationArrow.visible =
                false


        if (this.directionRing)
            this.directionRing.visible =
                false


        if (this.dom.forceIndicator) {

            this.dom.forceIndicator
                .classList.remove(
                    'visible'
                )

        }

    }


    /* =====================================================
       TRAIL
       ===================================================== */

    updateTrail(
        delta
    ) {

        if (
            Math.abs(
                this.velocity
            ) < 0.15
        ) {

            return

        }


        this.trailTimer +=
            delta


        if (
            this.trailTimer < 0.055
        ) {

            return

        }


        this.trailTimer =
            0


        const geometry =
            new THREE.SphereGeometry(
                0.035,
                8,
                8
            )


        const material =
            new THREE.MeshBasicMaterial({

                color:
                    this.colors.gold,

                transparent:
                    true,

                opacity:
                    0.42,

                depthWrite:
                    false
            })


        const point =
            new THREE.Mesh(
                geometry,
                material
            )


        point.position.set(
            this.positionX - 0.75,
            0.36,
            0
        )


        point.userData.life =
            0.65


        this.effectGroup.add(
            point
        )


        for (
            let i =
                this.effectGroup.children.length - 1;
            i >= 0;
            i--
        ) {

            const child =
                this.effectGroup.children[i]


            if (
                child.userData &&
                child.userData.life !== undefined
            ) {

                child.userData.life -=
                    delta


                child.material.opacity =
                    Math.max(
                        0,
                        child.userData.life /
                        0.65
                    )


                if (
                    child.userData.life <= 0
                ) {

                    this.effectGroup.remove(
                        child
                    )


                    child.geometry.dispose()

                    child.material.dispose()

                }

            }

        }

    }


    /* =====================================================
       RESET
       ===================================================== */

    reset() {

        this.running =
            false

        this.paused =
            false

        this.applied =
            false

        this.phase =
            0

        this.elapsed =
            0


        this.mass =
            2.0

        this.force =
            0

        this.friction =
            0.12

        this.velocity =
            0

        this.acceleration =
            0

        this.netForce =
            0

        this.frictionForce =
            0


        this.positionX =
            this.startPositionX


        if (this.block) {

            this.block.position.set(
                this.positionX,
                0.82,
                0
            )

            this.block.rotation.set(
                0,
                0,
                0
            )

        }


        if (this.directionRing) {

            this.directionRing.position.x =
                this.positionX

        }


        if (this.dom.forceControl)
            this.dom.forceControl.value =
                this.force


        if (this.dom.massControl)
            this.dom.massControl.value =
                this.mass


        if (this.dom.frictionControl)
            this.dom.frictionControl.value =
                this.friction


        this.clearTrail()

        this.hideForce()

        this.updateUI()

        this.emitState()


        return this

    }


    /* =====================================================
       UPDATE UI
       ===================================================== */

    updateUI() {

        if (!this.ui)
            return


        const language =
            getLanguage()


        /* -----------------------------------------------
           VALUES
           ----------------------------------------------- */

        if (this.dom.forceValue) {

            this.dom.forceValue.innerHTML =
                `${this.force.toFixed(1)}
                <small class="newton-laws-value-unit">N</small>`

        }


        if (this.dom.massValue) {

            this.dom.massValue.innerHTML =
                `${this.mass.toFixed(1)}
                <small class="newton-laws-value-unit">kg</small>`

        }


        if (this.dom.accelerationValue) {

            this.dom.accelerationValue.innerHTML =
                `${this.acceleration.toFixed(2)}
                <small class="newton-laws-value-unit">m/s²</small>`

        }


        if (this.dom.velocityValue) {

            this.dom.velocityValue.innerHTML =
                `${this.velocity.toFixed(2)}
                <small class="newton-laws-value-unit">m/s</small>`

        }


        /* -----------------------------------------------
           CONTROL VALUES
           ----------------------------------------------- */

        if (this.dom.forceControlValue) {

            this.dom.forceControlValue.textContent =
                `${this.force.toFixed(1)} N`

        }


        if (this.dom.massControlValue) {

            this.dom.massControlValue.textContent =
                `${this.mass.toFixed(1)} kg`

        }


        if (this.dom.frictionControlValue) {

            this.dom.frictionControlValue.textContent =
                `${Math.round(this.friction * 100)}%`

        }


        /* -----------------------------------------------
           PAUSE BUTTON
           ----------------------------------------------- */

        if (this.dom.pause) {

            this.dom.pause.textContent =
                this.paused
                    ? this.tx(
                        'newtonLaws.resume',
                        'متابعة',
                        'Resume'
                    )
                    : this.tx(
                        'newtonLaws.pause',
                        'إيقاف مؤقت',
                        'Pause'
                    )

        }


        /* -----------------------------------------------
           MESSAGE
           ----------------------------------------------- */

        if (this.dom.message) {

            if (!this.applied) {

                this.dom.message.textContent =
                    this.tx(
                        'newtonLaws.messageReady',
                        'اختر القيم التي تريدها، ثم اضغط «تطبيق القوة».',
                        'Choose your values, then click “Apply Force”.'
                    )

            }

            else if (
                this.applied &&
                this.acceleration <= 0
            ) {

                this.dom.message.textContent =
                    this.tx(
                        'newtonLaws.messageInsufficient',
                        'القوة غير كافية للتغلب على الاحتكاك، لذلك بقي الجسم ساكنًا.',
                        'The force is not strong enough to overcome friction, so the object remains at rest.'
                    )

            }

            else if (this.running) {

                this.dom.message.textContent =
                    this.tx(
                        'newtonLaws.messageRunning',
                        'القوة المحصلة تؤثر في الجسم وتولّد تسارعًا.',
                        'The net force acts on the object and produces acceleration.'
                    )

            }

            else if (this.paused) {

                this.dom.message.textContent =
                    this.tx(
                        'newtonLaws.messagePaused',
                        'أوقفت الحركة مؤقتًا. يمكنك متابعة التجربة.',
                        'The motion is paused. You can resume the experiment.'
                    )

            }

            else if (this.phase === 3) {

                this.dom.message.textContent =
                    this.tx(
                        'newtonLaws.messageFinished',
                        'وصل الجسم إلى نهاية المسار. غيّر القيم وجرّب مرة أخرى.',
                        'The object reached the end of the track. Change the values and try again.'
                    )

            }

            else {

                this.dom.message.textContent =
                    this.tx(
                        'newtonLaws.messageApplied',
                        'طبّقت القوة. لاحظ كيف أثرت في حركة الجسم.',
                        'The force has been applied. Observe how it affects the object’s motion.'
                    )

            }

        }


        /* -----------------------------------------------
           STATUS
           ----------------------------------------------- */

        if (this.dom.status) {

            this.dom.status.classList.toggle(
                'active',
                this.running
            )

        }


        if (this.dom.statusText) {

            if (this.running) {

                this.dom.statusText.textContent =
                    this.tx(
                        'newtonLaws.statusRunning',
                        'التجربة تعمل الآن',
                        'Experiment Running'
                    )

            }

            else if (this.paused) {

                this.dom.statusText.textContent =
                    this.tx(
                        'newtonLaws.statusPaused',
                        'التجربة متوقفة مؤقتًا',
                        'Experiment Paused'
                    )

            }

            else if (this.phase === 3) {

                this.dom.statusText.textContent =
                    this.tx(
                        'newtonLaws.statusFinished',
                        'انتهت الحركة',
                        'Motion Complete'
                    )

            }

            else if (
                this.applied &&
                this.acceleration <= 0
            ) {

                this.dom.statusText.textContent =
                    this.tx(
                        'newtonLaws.statusNoNetForce',
                        'لا توجد قوة محصلة كافية',
                        'Insufficient Net Force'
                    )

            }

            else {

                this.dom.statusText.textContent =
                    this.tx(
                        'newtonLaws.statusReady',
                        'جاهز للتجربة',
                        'Ready for Experiment'
                    )

            }

        }


        /* -----------------------------------------------
           FORCE VISUAL
           ----------------------------------------------- */

        this.showForce()

    }


    /* =====================================================
       CLEAR TRAIL
       ===================================================== */

    clearTrail() {

        if (!this.effectGroup)
            return


        while (
            this.effectGroup.children.length
        ) {

            const child =
                this.effectGroup.children[
                    this.effectGroup.children.length - 1
                ]


            this.effectGroup.remove(
                child
            )


            if (child.geometry)
                child.geometry.dispose()


            if (child.material)
                child.material.dispose()

        }

    }


    /* =====================================================
       PHYSICS DATA
       ===================================================== */

    getPhysicsData() {

        return {

            mass:
                this.mass,

            force:
                this.force,

            friction:
                this.friction,

            frictionForce:
                this.frictionForce,

            netForce:
                this.netForce,

            velocity:
                this.velocity,

            acceleration:
                this.acceleration,

            position:
                this.positionX,

            phase:
                this.phase,

            applied:
                this.applied,

            running:
                this.running,

            paused:
                this.paused

        }

    }


    /* =====================================================
       EDUCATIONAL STATE
       ===================================================== */

    getEducationalState() {

        if (!this.applied) {

            return {

                title:
                    this.tx(
                        'newtonLaws.educationalReadyTitle',
                        'القوة التي تحرّك العالم',
                        'The Force That Moves the World'
                    ),

                message:
                    this.tx(
                        'newtonLaws.educationalReadyMessage',
                        'اختر القوة والكتلة والاحتكاك، ثم طبّق القوة على الجسم.',
                        'Choose the force, mass, and friction, then apply the force to the object.'
                    ),

                formula:
                    'F = m × a'

            }

        }


        if (
            this.applied &&
            this.acceleration <= 0
        ) {

            return {

                title:
                    this.tx(
                        'newtonLaws.educationalFrictionTitle',
                        'الاحتكاك يقاوم الحركة',
                        'Friction Resists Motion'
                    ),

                message:
                    this.tx(
                        'newtonLaws.educationalFrictionMessage',
                        'القوة المؤثرة غير كافية للتغلب على الاحتكاك.',
                        'The applied force is not enough to overcome friction.'
                    ),

                formula:
                    'Fₙₑₜ = F − Fᶠʳⁱᶜᵗⁱᵒⁿ'

            }

        }


        if (this.running) {

            return {

                title:
                    this.tx(
                        'newtonLaws.educationalMovingTitle',
                        'الجسم يتسارع',
                        'The Object Is Accelerating'
                    ),

                message:
                    this.tx(
                        'newtonLaws.educationalMovingMessage',
                        'القوة المحصلة تولّد تسارعًا في الجسم.',
                        'The net force produces acceleration in the object.'
                    ),

                formula:
                    'a = Fₙₑₜ / m'

            }

        }


        if (this.phase === 3) {

            return {

                title:
                    this.tx(
                        'newtonLaws.educationalFinishedTitle',
                        'اكتملت الحركة',
                        'Motion Complete'
                    ),

                message:
                    this.tx(
                        'newtonLaws.educationalFinishedMessage',
                        'شاهدت أثر القوة والكتلة والاحتكاك في حركة الجسم.',
                        'You observed how force, mass, and friction affect the object’s motion.'
                    ),

                formula:
                    'F = m × a'

            }

        }


        return {

            title:
                this.tx(
                    'newtonLaws.educationalAppliedTitle',
                    'القوة بدأت تأثيرها',
                    'The Force Has Taken Effect'
                ),

            message:
                this.tx(
                    'newtonLaws.educationalAppliedMessage',
                    'لاحظ كيف تتغير حركة الجسم عندما تتغير القوة والكتلة.',
                    'Observe how the object’s motion changes when force and mass change.'
                ),

            formula:
                'a = Fₙₑₜ / m'

        }

    }


    /* =====================================================
       STATE
       ===================================================== */

    emitState() {

        if (
            this.parent &&
            typeof this.parent.onNewtonStateChange ===
            'function'
        ) {

            this.parent.onNewtonStateChange(
                this.getPhysicsData()
            )

        }

    }


    /* =====================================================
       ADD TO SCENE
       ===================================================== */

    addToScene(
        scene = null
    ) {

        const target =
            scene ||
            this.scene


        if (!target)
            return this


        this.scene =
            target


        if (!this.group.parent) {

            target.add(
                this.group
            )

        }


        this.active =
            true

        this.group.visible =
            true


        this.running =
            false

        this.applied =
            false


        this.updateUI()


        return this

    }


    /* =====================================================
       SET SCENE
       ===================================================== */

    setScene(
        scene
    ) {

        this.scene =
            scene


        if (
            this.active &&
            this.scene &&
            !this.group.parent
        ) {

            this.scene.add(
                this.group
            )

        }


        return this

    }


    /* =====================================================
       DESTROY
       ===================================================== */

    destroy() {

        window.removeEventListener(
            'awtaar-language-change',
            this.handleLanguageChange
        )


        this.clearTrail()


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

                    }

                    else {

                        object.material.dispose()

                    }

                }

            }
        )


        if (this.group.parent) {

            this.group.parent.remove(
                this.group
            )

        }


        if (this.ui) {

            this.ui.remove()

            this.ui = null

        }


        this.dom = {}


        this.active =
            false

        this.running =
            false

        this.paused =
            false

        this.applied =
            false

    }

}