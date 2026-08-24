import * as THREE from 'three'

import './WaveInterference.css'
import './WaveDoppler.css'

import WaveInterferenceExperiment
    from './WaveInterferenceExperiment.js'

import WaveDopplerUI
    from './WaveDopplerUI.js'

import {
    getLanguage
} from '../locales/i18n.js'


/* =========================================================
   AWTAAR — WAVES WORLD UI
   ========================================================= */

export default class WavesWorldUI {


    constructor(
        physicsWorldUI = null,
        scene = null
    ) {


        /* =====================================================
           REFERENCES
           ===================================================== */

        this.physicsWorldUI =
            physicsWorldUI


        this.scene =
            scene


        /* =====================================================
           LANGUAGE
           ===================================================== */

        this.language =
            getLanguage()


        /* =====================================================
           ROOT
           ===================================================== */

        this.root =
            null


        /* =====================================================
           INTERFERENCE CONTAINER
           ===================================================== */

        this.interferenceContainer =
            null


        /* =====================================================
           INTERFERENCE THREE.JS
           ===================================================== */

        this.interferenceScene =
            null


        this.interferenceCamera =
            null


        this.interferenceRenderer =
            null


        this.interferenceStage =
            null


        this.interferenceAnimationFrame =
            null


        this.interferenceClock =
            null


        this.interferenceResizeHandler =
            null


        /* =====================================================
           EXPERIMENTS
           ===================================================== */

        this.waveInterferenceExperiment =
            null


        this.dopplerUI =
            null


        /* =====================================================
           STATE
           ===================================================== */

        this.activeExperiment =
            null


        this.isInterferenceRunning =
            true


        /* =====================================================
           INTERFERENCE VALUES
           ===================================================== */

        this.amplitude =
            0.75


        this.wavelength =
            2.4


        this.frequency =
            1.2


        /* =====================================================
           BUILD
           ===================================================== */

        this.create()


    }


    /* =========================================================
       CREATE WORLD
       ========================================================= */

    create() {


        this.root =
            document.createElement(
                'div'
            )


        this.root.id =
            'awtaar-wave-world'


        this.root.setAttribute(
            'dir',
            this.language === 'ar'
                ? 'rtl'
                : 'ltr'
        )


        this.root.innerHTML =
            this.getWorldHTML()


        document.body.appendChild(
            this.root
        )


        /* =====================================================
           INITIAL STATE
           ===================================================== */

        this.root.style.opacity =
            '0'


        this.root.style.visibility =
            'hidden'


        this.root.style.pointerEvents =
            'none'


        this.bindWorldEvents()


    }


    /* =========================================================
       WORLD HTML
       ========================================================= */

    getWorldHTML() {


        const isArabic =
            this.language === 'ar'


        const eyebrow =
            isArabic
                ? 'فيزياء الموجات'
                : 'WAVE PHYSICS'


        const title =
            isArabic
                ? 'عالم الموجات'
                : 'Wave World'


        const subtitle =
            isArabic
                ? 'استكشف كيف تنتقل الطاقة عبر الموجات، وكيف تتفاعل الموجات معًا.'
                : 'Explore how waves travel and interact with each other.'


        const interferenceTitle =
            isArabic
                ? 'تداخل الموجات'
                : 'Wave Interference'


        const interferenceDescription =
            isArabic
                ? 'شاهد موجتين تنطلقان من مصدرين وتلتقيان لتشكلا مناطق التعزيز والإلغاء.'
                : 'Watch two waves meet and form patterns of reinforcement and cancellation.'


        const dopplerTitle =
            isArabic
                ? 'تأثير دوبلر'
                : 'Doppler Effect'


        const dopplerDescription =
            isArabic
                ? 'اكتشف كيف تتغير الموجات عندما يتحرك المصدر.'
                : 'Discover how waves change when the source moves.'


        const hint =
            isArabic
                ? 'اختر تجربة لبدء الاستكشاف'
                : 'Choose an experiment to begin exploring'


        const back =
            isArabic
                ? 'العودة'
                : 'Back'


        return `

            <div class="wave-world-header">

                <p class="wave-world-eyebrow">
                    ${eyebrow}
                </p>

                <h1 class="wave-world-title">
                    ${title}
                </h1>

                <p class="wave-world-subtitle">
                    ${subtitle}
                </p>

            </div>


            <!-- =============================================
                 EXPERIMENT CARDS
                 ============================================= -->

            <div class="wave-experiments">


                <!-- =========================================
                     WAVE INTERFERENCE
                     ========================================= -->

                <button
                    type="button"
                    class="wave-experiment-card"
                    data-experiment="interference"
                >

                    <div class="wave-card-glow"></div>


                    <div class="wave-experiment-icon">
                        ≋
                    </div>


                    <div class="wave-experiment-content">

                        <h2>
                            ${interferenceTitle}
                        </h2>

                        <p>
                            ${interferenceDescription}
                        </p>

                    </div>


                    <div class="wave-experiment-arrow">
                        →
                    </div>

                </button>


                <!-- =========================================
                     DOPPLER EFFECT
                     ========================================= -->

                <button
                    type="button"
                    class="wave-experiment-card"
                    data-experiment="doppler"
                >

                    <div class="wave-card-glow"></div>


                    <div class="wave-experiment-icon">
                        ◉
                    </div>


                    <div class="wave-experiment-content">

                        <h2>
                            ${dopplerTitle}
                        </h2>

                        <p>
                            ${dopplerDescription}
                        </p>

                    </div>


                    <div class="wave-experiment-arrow">
                        →
                    </div>

                </button>


            </div>


            <!-- =============================================
                 HINT
                 ============================================= -->

            <div class="wave-world-hint">

                ${hint}

            </div>


            <!-- =============================================
                 BACK
                 ============================================= -->

            <button
                type="button"
                class="wave-back-button"
                data-action="back"
            >

                ${back}

            </button>

        `


    }


    /* =========================================================
       WORLD EVENTS
       ========================================================= */

    bindWorldEvents() {


        if (
            !this.root
        ) {

            return

        }


        const interferenceButton =
            this.root.querySelector(
                '[data-experiment="interference"]'
            )


        const dopplerButton =
            this.root.querySelector(
                '[data-experiment="doppler"]'
            )


        const backButton =
            this.root.querySelector(
                '[data-action="back"]'
            )


        /* =====================================================
           OPEN INTERFERENCE
           ===================================================== */

        if (
            interferenceButton
        ) {

            interferenceButton.addEventListener(
                'click',
                () => {

                    this.openInterferenceExperiment()

                }
            )

        }


        /* =====================================================
           OPEN DOPPLER
           ===================================================== */

        if (
            dopplerButton
        ) {

            dopplerButton.addEventListener(
                'click',
                () => {

                    this.openDopplerExperiment()

                }
            )

        }


        /* =====================================================
           BACK
           ===================================================== */

        if (
            backButton
        ) {

            backButton.addEventListener(
                'click',
                () => {

                    this.hide()


                    setTimeout(
                        () => {

                            if (
                                this.physicsWorldUI
                                &&
                                typeof this.physicsWorldUI.returnFromWaves
                                === 'function'
                            ) {

                                this.physicsWorldUI.returnFromWaves()

                            }

                        },
                        350
                    )

                }
            )

        }


    }


    /* =========================================================
       SHOW
       ========================================================= */

    show() {


        if (
            !this.root
        ) {

            return

        }


        this.updateLanguage()


        this.root.style.display =
            'flex'


        this.root.style.visibility =
            'visible'


        this.root.style.pointerEvents =
            'auto'


        requestAnimationFrame(
            () => {

                if (
                    this.root
                ) {

                    this.root.style.opacity =
                        '1'

                }

            }
        )


    }


    /* =========================================================
       HIDE
       ========================================================= */

    hide() {


        if (
            !this.root
        ) {

            return

        }


        this.closeExperiment()


        this.root.style.opacity =
            '0'


        this.root.style.pointerEvents =
            'none'


        setTimeout(
            () => {

                if (
                    this.root
                    &&
                    this.root.style.opacity === '0'
                ) {

                    this.root.style.visibility =
                        'hidden'


                    this.root.style.display =
                        'none'

                }

            },
            550
        )


    }


    /* =========================================================
       OPEN / CLOSE
       ========================================================= */

    open() {


        this.show()


    }


    close() {


        this.hide()


    }


    /* =========================================================
       UPDATE LANGUAGE
       ========================================================= */

    updateLanguage() {


        this.language =
            getLanguage()


        if (
            !this.root
        ) {

            return

        }


        this.root.setAttribute(
            'dir',
            this.language === 'ar'
                ? 'rtl'
                : 'ltr'
        )


        if (
            !this.activeExperiment
        ) {

            this.root.innerHTML =
                this.getWorldHTML()


            this.bindWorldEvents()

        }


    }


    /* =========================================================
       OPEN INTERFERENCE
       ========================================================= */

    openInterferenceExperiment() {


        this.closeExperiment()


        this.activeExperiment =
            'interference'


        this.isInterferenceRunning =
            true


        /* =====================================================
           HIDE WORLD
           ===================================================== */

        if (
            this.root
        ) {

            this.root.style.opacity =
                '0'


            this.root.style.pointerEvents =
                'none'


            this.root.style.visibility =
                'hidden'

        }


        /* =====================================================
           CREATE CONTAINER
           ===================================================== */

        this.interferenceContainer =
            document.createElement(
                'div'
            )


        this.interferenceContainer.className =
            'wave-interference-container'


        this.interferenceContainer.setAttribute(
            'dir',
            this.language === 'ar'
                ? 'rtl'
                : 'ltr'
        )


        this.interferenceContainer.innerHTML =
            this.getInterferenceHTML()


        document.body.appendChild(
            this.interferenceContainer
        )


        /* =====================================================
           GET STAGE
           ===================================================== */

        this.interferenceStage =
            this.interferenceContainer.querySelector(
                '[data-wave-stage]'
            )


        /* =====================================================
           CREATE LOCAL THREE.JS SCENE
           ===================================================== */

        this.createInterferenceScene()


        /* =====================================================
           CREATE EXPERIMENT
           ===================================================== */

        this.waveInterferenceExperiment =
            new WaveInterferenceExperiment(
                {
                    scene:
                        this.interferenceScene,

                    amplitude:
                        this.amplitude,

                    wavelength:
                        this.wavelength,

                    frequency:
                        this.frequency
                }
            )


        if (
            typeof this.waveInterferenceExperiment.addToScene
            === 'function'
        ) {

            this.waveInterferenceExperiment.addToScene(
                this.interferenceScene
            )

        }


        if (
            typeof this.waveInterferenceExperiment.start
            === 'function'
        ) {

            this.waveInterferenceExperiment.start()

        }


        /* =====================================================
           EVENTS
           ===================================================== */

        this.bindInterferenceEvents()


        this.updateInterferenceUI()


        /* =====================================================
           RENDER LOOP
           ===================================================== */

        this.startInterferenceRenderLoop()


    }


    /* =========================================================
       CREATE INTERFERENCE SCENE
       ========================================================= */

    createInterferenceScene() {


        if (
            !this.interferenceStage
        ) {

            return

        }


        const width =
            this.interferenceStage.clientWidth
            ||
            800


        const height =
            this.interferenceStage.clientHeight
            ||
            500


        /* =====================================================
           SCENE
           ===================================================== */

        this.interferenceScene =
            new THREE.Scene()


        this.interferenceScene.background =
            new THREE.Color(
                0x05050a
            )


        /* =====================================================
           CAMERA
           ===================================================== */

        this.interferenceCamera =
            new THREE.PerspectiveCamera(
                45,
                width / height,
                0.1,
                100
            )


        this.interferenceCamera.position.set(
            0,
            10,
            12
        )


        this.interferenceCamera.lookAt(
            0,
            0,
            0
        )


        /* =====================================================
           RENDERER
           ===================================================== */

        this.interferenceRenderer =
            new THREE.WebGLRenderer(
                {
                    antialias:
                        true,

                    alpha:
                        true
                }
            )


        this.interferenceRenderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        )


        this.interferenceRenderer.setSize(
            width,
            height
        )


        this.interferenceRenderer.outputColorSpace =
            THREE.SRGBColorSpace


        this.interferenceStage.appendChild(
            this.interferenceRenderer.domElement
        )


        /* =====================================================
           CLOCK
           ===================================================== */

        this.interferenceClock =
            new THREE.Clock()


        /* =====================================================
           GRID
           ===================================================== */

        const grid =
            new THREE.GridHelper(
                18,
                18
            )


        grid.position.y =
            -0.04


        this.interferenceScene.add(
            grid
        )


        /* =====================================================
           RESIZE
           ===================================================== */

        this.interferenceResizeHandler =
            () => {

                this.resizeInterferenceScene()

            }


        window.addEventListener(
            'resize',
            this.interferenceResizeHandler
        )


    }


    /* =========================================================
       RESIZE INTERFERENCE
       ========================================================= */

    resizeInterferenceScene() {


        if (
            !this.interferenceStage
            ||
            !this.interferenceCamera
            ||
            !this.interferenceRenderer
        ) {

            return

        }


        const width =
            this.interferenceStage.clientWidth


        const height =
            this.interferenceStage.clientHeight


        if (
            width <= 0
            ||
            height <= 0
        ) {

            return

        }


        this.interferenceCamera.aspect =
            width / height


        this.interferenceCamera.updateProjectionMatrix()


        this.interferenceRenderer.setSize(
            width,
            height
        )


    }


    /* =========================================================
       INTERFERENCE RENDER LOOP
       ========================================================= */

    startInterferenceRenderLoop() {


        const render =
            () => {


                if (
                    this.activeExperiment
                    !== 'interference'
                ) {

                    return

                }


                const delta =
                    this.interferenceClock
                        ? this.interferenceClock.getDelta()
                        : 0.016


                if (
                    this.waveInterferenceExperiment
                    &&
                    this.isInterferenceRunning
                    &&
                    typeof this.waveInterferenceExperiment.update
                    === 'function'
                ) {

                    this.waveInterferenceExperiment.update(
                        delta
                    )

                }


                if (
                    this.interferenceRenderer
                    &&
                    this.interferenceScene
                    &&
                    this.interferenceCamera
                ) {

                    this.interferenceRenderer.render(
                        this.interferenceScene,
                        this.interferenceCamera
                    )

                }


                this.interferenceAnimationFrame =
                    requestAnimationFrame(
                        render
                    )

            }


        render()


    }


    /* =========================================================
       INTERFERENCE HTML
       ========================================================= */

    getInterferenceHTML() {


        const isArabic =
            this.language === 'ar'


        const title =
            isArabic
                ? 'تداخل الموجات'
                : 'Wave Interference'


        const back =
            isArabic
                ? 'العودة'
                : 'Back'


        const amplitude =
            isArabic
                ? 'السعة'
                : 'Amplitude'


        const wavelength =
            isArabic
                ? 'الطول الموجي'
                : 'Wavelength'


        const frequency =
            isArabic
                ? 'التردد'
                : 'Frequency'


        const pause =
            isArabic
                ? 'إيقاف التجربة'
                : 'Pause'


        const reset =
            isArabic
                ? 'إعادة التجربة'
                : 'Reset'


        return `

            <div class="wave-interference-top">


                <button
                    type="button"
                    class="wave-interference-back"
                    data-action="back"
                >
                    ${back}
                </button>


                <h2 class="wave-interference-title">
                    ${title}
                </h2>


            </div>


            <div class="wave-interference-layout">


                <!-- =========================================
                     THREE.JS STAGE
                     ========================================= -->

                <div
                    class="wave-interference-stage"
                    data-wave-stage
                >

                </div>


                <!-- =========================================
                     CONTROLS
                     ========================================= -->

                <div class="wave-interference-controls">


                    <!-- AMPLITUDE -->

                    <div class="wave-interference-control">

                        <div
                            class="wave-interference-control-header"
                        >

                            <span>
                                ${amplitude}
                            </span>


                            <strong
                                data-value="amplitude"
                            >
                                75%
                            </strong>

                        </div>


                        <input
                            class="wave-interference-slider"
                            data-control="amplitude"
                            type="range"
                            min="0"
                            max="150"
                            value="75"
                        >

                    </div>


                    <!-- WAVELENGTH -->

                    <div class="wave-interference-control">

                        <div
                            class="wave-interference-control-header"
                        >

                            <span>
                                ${wavelength}
                            </span>


                            <strong
                                data-value="wavelength"
                            >
                                2.4
                            </strong>

                        </div>


                        <input
                            class="wave-interference-slider"
                            data-control="wavelength"
                            type="range"
                            min="8"
                            max="50"
                            value="24"
                        >

                    </div>


                    <!-- FREQUENCY -->

                    <div class="wave-interference-control">

                        <div
                            class="wave-interference-control-header"
                        >

                            <span>
                                ${frequency}
                            </span>


                            <strong
                                data-value="frequency"
                            >
                                1.2 Hz
                            </strong>

                        </div>


                        <input
                            class="wave-interference-slider"
                            data-control="frequency"
                            type="range"
                            min="2"
                            max="30"
                            value="12"
                        >

                    </div>


                    <!-- ACTIONS -->

                    <div
                        class="wave-interference-actions"
                    >


                        <button
                            type="button"
                            class="wave-interference-action primary"
                            data-action="pause"
                        >

                            ${pause}

                        </button>


                        <button
                            type="button"
                            class="wave-interference-action"
                            data-action="reset"
                        >

                            ${reset}

                        </button>


                    </div>


                </div>


            </div>

        `


    }


    /* =========================================================
       BIND INTERFERENCE EVENTS
       ========================================================= */

    bindInterferenceEvents() {


        if (
            !this.interferenceContainer
        ) {

            return

        }


        const backButton =
            this.interferenceContainer.querySelector(
                '[data-action="back"]'
            )


        const amplitudeSlider =
            this.interferenceContainer.querySelector(
                '[data-control="amplitude"]'
            )


        const wavelengthSlider =
            this.interferenceContainer.querySelector(
                '[data-control="wavelength"]'
            )


        const frequencySlider =
            this.interferenceContainer.querySelector(
                '[data-control="frequency"]'
            )


        const pauseButton =
            this.interferenceContainer.querySelector(
                '[data-action="pause"]'
            )


        const resetButton =
            this.interferenceContainer.querySelector(
                '[data-action="reset"]'
            )


        /* =====================================================
           BACK
           ===================================================== */

        if (
            backButton
        ) {

            backButton.addEventListener(
                'click',
                () => {

                    this.closeExperiment()


                    this.show()

                }
            )

        }


        /* =====================================================
           AMPLITUDE
           ===================================================== */

        if (
            amplitudeSlider
        ) {

            amplitudeSlider.addEventListener(
                'input',
                event => {

                    this.amplitude =
                        Number(
                            event.target.value
                        )
                        / 100


                    if (
                        this.waveInterferenceExperiment
                        &&
                        typeof this.waveInterferenceExperiment
                            .setAmplitude
                        === 'function'
                    ) {

                        this.waveInterferenceExperiment
                            .setAmplitude(
                                this.amplitude
                            )

                    }


                    this.updateInterferenceUI()

                }
            )

        }


        /* =====================================================
           WAVELENGTH
           ===================================================== */

        if (
            wavelengthSlider
        ) {

            wavelengthSlider.addEventListener(
                'input',
                event => {

                    this.wavelength =
                        Number(
                            event.target.value
                        )
                        / 10


                    if (
                        this.waveInterferenceExperiment
                        &&
                        typeof this.waveInterferenceExperiment
                            .setWavelength
                        === 'function'
                    ) {

                        this.waveInterferenceExperiment
                            .setWavelength(
                                this.wavelength
                            )

                    }


                    this.updateInterferenceUI()

                }
            )

        }


        /* =====================================================
           FREQUENCY
           ===================================================== */

        if (
            frequencySlider
        ) {

            frequencySlider.addEventListener(
                'input',
                event => {

                    this.frequency =
                        Number(
                            event.target.value
                        )
                        / 10


                    if (
                        this.waveInterferenceExperiment
                        &&
                        typeof this.waveInterferenceExperiment
                            .setFrequency
                        === 'function'
                    ) {

                        this.waveInterferenceExperiment
                            .setFrequency(
                                this.frequency
                            )

                    }


                    this.updateInterferenceUI()

                }
            )

        }


        /* =====================================================
           PAUSE
           ===================================================== */

        if (
            pauseButton
        ) {

            pauseButton.addEventListener(
                'click',
                () => {

                    this.toggleInterference()

                }
            )

        }


        /* =====================================================
           RESET
           ===================================================== */

        if (
            resetButton
        ) {

            resetButton.addEventListener(
                'click',
                () => {

                    this.resetInterference()

                }
            )

        }


    }


    /* =========================================================
       TOGGLE INTERFERENCE
       ========================================================= */

    toggleInterference() {


        this.isInterferenceRunning =
            !this.isInterferenceRunning


        const experiment =
            this.waveInterferenceExperiment


        if (
            experiment
        ) {

            if (
                this.isInterferenceRunning
            ) {

                if (
                    typeof experiment.resume
                    === 'function'
                ) {

                    experiment.resume()

                }

            }

            else {

                if (
                    typeof experiment.pause
                    === 'function'
                ) {

                    experiment.pause()

                }

            }

        }


        const button =
            this.interferenceContainer?.querySelector(
                '[data-action="pause"]'
            )


        if (
            button
        ) {

            button.textContent =
                this.isInterferenceRunning

                    ? (
                        this.language === 'ar'
                            ? 'إيقاف التجربة'
                            : 'Pause'
                    )

                    : (
                        this.language === 'ar'
                            ? 'تشغيل التجربة'
                            : 'Resume'
                    )

        }


    }


    /* =========================================================
       RESET INTERFERENCE
       ========================================================= */

    resetInterference() {


        this.amplitude =
            0.75


        this.wavelength =
            2.4


        this.frequency =
            1.2


        this.isInterferenceRunning =
            true


        const experiment =
            this.waveInterferenceExperiment


        if (
            experiment
        ) {

            if (
                typeof experiment.reset
                === 'function'
            ) {

                experiment.reset()

            }


            if (
                typeof experiment.setAmplitude
                === 'function'
            ) {

                experiment.setAmplitude(
                    this.amplitude
                )

            }


            if (
                typeof experiment.setWavelength
                === 'function'
            ) {

                experiment.setWavelength(
                    this.wavelength
                )

            }


            if (
                typeof experiment.setFrequency
                === 'function'
            ) {

                experiment.setFrequency(
                    this.frequency
                )

            }


            if (
                typeof experiment.start
                === 'function'
            ) {

                experiment.start()

            }

        }


        const amplitudeSlider =
            this.interferenceContainer?.querySelector(
                '[data-control="amplitude"]'
            )


        const wavelengthSlider =
            this.interferenceContainer?.querySelector(
                '[data-control="wavelength"]'
            )


        const frequencySlider =
            this.interferenceContainer?.querySelector(
                '[data-control="frequency"]'
            )


        if (
            amplitudeSlider
        ) {

            amplitudeSlider.value =
                '75'

        }


        if (
            wavelengthSlider
        ) {

            wavelengthSlider.value =
                '24'

        }


        if (
            frequencySlider
        ) {

            frequencySlider.value =
                '12'

        }


        const pauseButton =
            this.interferenceContainer?.querySelector(
                '[data-action="pause"]'
            )


        if (
            pauseButton
        ) {

            pauseButton.textContent =
                this.language === 'ar'
                    ? 'إيقاف التجربة'
                    : 'Pause'

        }


        this.updateInterferenceUI()


    }


    /* =========================================================
       UPDATE INTERFERENCE UI
       ========================================================= */

    updateInterferenceUI() {


        if (
            !this.interferenceContainer
        ) {

            return

        }


        const amplitudeControl =
            this.interferenceContainer.querySelector(
                '[data-value="amplitude"]'
            )


        const wavelengthControl =
            this.interferenceContainer.querySelector(
                '[data-value="wavelength"]'
            )


        const frequencyControl =
            this.interferenceContainer.querySelector(
                '[data-value="frequency"]'
            )


        if (
            amplitudeControl
        ) {

            amplitudeControl.textContent =
                `${Math.round(
                    this.amplitude * 100
                )}%`

        }


        if (
            wavelengthControl
        ) {

            wavelengthControl.textContent =
                this.wavelength.toFixed(
                    1
                )

        }


        if (
            frequencyControl
        ) {

            frequencyControl.textContent =
                `${this.frequency.toFixed(
                    1
                )} Hz`

        }


    }


    /* =========================================================
       OPEN DOPPLER
       ========================================================= */

    openDopplerExperiment() {


        this.closeExperiment()


        this.activeExperiment =
            'doppler'


        /* =====================================================
           HIDE WORLD
           ===================================================== */

        if (
            this.root
        ) {

            this.root.style.opacity =
                '0'


            this.root.style.pointerEvents =
                'none'


            this.root.style.visibility =
                'hidden'

        }


        /* =====================================================
           CREATE DOPPLER UI
           ===================================================== */

        this.dopplerUI =
            new WaveDopplerUI(
                this.scene,
                {
                    parent:
                        document.body,

                    onExit:
                        () => {

                            this.closeExperiment()


                            this.show()

                        }
                }
            )


        if (
            this.dopplerUI
            &&
            typeof this.dopplerUI.start
            === 'function'
        ) {

this.dopplerUI.enter()
        }


    }


    /* =========================================================
       CLOSE CURRENT EXPERIMENT
       ========================================================= */

    closeExperiment() {


        /* =====================================================
           STOP INTERFERENCE RENDER LOOP
           ===================================================== */

        if (
            this.interferenceAnimationFrame
        ) {

            cancelAnimationFrame(
                this.interferenceAnimationFrame
            )


            this.interferenceAnimationFrame =
                null

        }


        /* =====================================================
           REMOVE RESIZE LISTENER
           ===================================================== */

        if (
            this.interferenceResizeHandler
        ) {

            window.removeEventListener(
                'resize',
                this.interferenceResizeHandler
            )


            this.interferenceResizeHandler =
                null

        }


        /* =====================================================
           DESTROY INTERFERENCE EXPERIMENT
           ===================================================== */

        if (
            this.waveInterferenceExperiment
        ) {

            if (
                typeof this.waveInterferenceExperiment.destroy
                === 'function'
            ) {

                this.waveInterferenceExperiment.destroy()

            }


            this.waveInterferenceExperiment =
                null

        }


        /* =====================================================
           DISPOSE INTERFERENCE RENDERER
           ===================================================== */

        if (
            this.interferenceRenderer
        ) {

            this.interferenceRenderer.dispose()


            this.interferenceRenderer.forceContextLoss()


            this.interferenceRenderer =
                null

        }


        /* =====================================================
           REMOVE INTERFERENCE CONTAINER
           ===================================================== */

        if (
            this.interferenceContainer
        ) {

            this.interferenceContainer.remove()


            this.interferenceContainer =
                null

        }


        /* =====================================================
           CLEAR THREE REFERENCES
           ===================================================== */

        this.interferenceScene =
            null


        this.interferenceCamera =
            null


        this.interferenceStage =
            null


        this.interferenceClock =
            null


        /* =====================================================
           DESTROY DOPPLER UI
           ===================================================== */

        if (
            this.dopplerUI
        ) {

            if (
                typeof this.dopplerUI.destroy
                === 'function'
            ) {

                this.dopplerUI.destroy()

            }


            this.dopplerUI =
                null

        }


        /* =====================================================
           STATE
           ===================================================== */

        this.activeExperiment =
            null


    }


    /* =========================================================
       UPDATE
       ========================================================= */

    update() {


        /*
         * Wave Interference uses its own
         * local Three.js render loop.
         *
         * Wave Doppler UI manages its own
         * experiment lifecycle.
         */


    }


    /* =========================================================
       DESTROY
       ========================================================= */

    destroy() {


        this.closeExperiment()


        if (
            this.root
        ) {

            this.root.remove()


            this.root =
                null

        }


        this.scene =
            null


        this.physicsWorldUI =
            null


    }


}