/* =========================================================
   AWTAAR — WAVES WORLD UI
   =========================================================

   RESPONSIBILITY
   --------------
   Wave World navigation + experiment management.

   EXPERIMENTS
   -----------
   1. Wave Interference
   2. Doppler Effect

   ARCHITECTURE
   ------------
   PhysicsWorldUI
        ↓
   WavesWorldUI
        ↓
   ┌─────────────────────────────┐
   │ WaveInterferenceExperiment  │
   │ WaveDopplerUI               │
   └─────────────────────────────┘
        ↓
   DopplerExperiment
        ↓
   Three.js Scene

   ========================================================= */


console.log(
    '🔥 AWTAAR TEST — WAVES WORLD UI IS LOADED'
)


/* =========================================================
   THREE
   ========================================================= */

import * as THREE from 'three'


/* =========================================================
   CSS
   ========================================================= */

import './WaveInterference.css'
import './WaveDoppler.css'


/* =========================================================
   EXPERIMENTS
   ========================================================= */

import WaveInterferenceExperiment
    from './WaveInterferenceExperiment.js'


import WaveDopplerUI
    from './WaveDopplerUI.js'


/* =========================================================
   LANGUAGE
   ========================================================= */

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
            scene || null


        console.log(
            '🌊 WavesWorldUI: constructor',
            {
                physicsWorldUI:
                    this.physicsWorldUI,

                scene:
                    this.scene
            }
        )


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
           INTERFERENCE
           ===================================================== */

        this.interferenceContainer =
            null


        this.interferenceStage =
            null


        this.interferenceAnimationFrame =
            null


        this.interferenceClock =
            null


        this.waveInterferenceExperiment =
            null


        /* =====================================================
           DOPPLER
           ===================================================== */

        this.dopplerUI =
            null


        /* =====================================================
           STATE
           ===================================================== */

        this.activeExperiment =
            null


        this.isInterferenceRunning =
            false


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
           CREATE
           ===================================================== */

        this.create()

    }


    /* =========================================================
       CREATE WORLD
       ========================================================= */

    create() {


        console.log(
            '🌊 WavesWorldUI: CREATE'
        )


        if (
            this.root
        ) {

            console.warn(
                '⚠️ WavesWorldUI: root already exists'
            )

            return

        }


        /* =====================================================
           ROOT
           ===================================================== */

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


        this.root.style.display =
            'none'


        console.log(
            '🌊 WavesWorldUI: ROOT CREATED',
            this.root
        )


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
                     INTERFERENCE
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
                     DOPPLER
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

            console.error(
                '❌ WavesWorldUI: root missing'
            )

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


        console.log(
            '🌊 WavesWorldUI: buttons',
            {
                interference:
                    !!interferenceButton,

                doppler:
                    !!dopplerButton,

                back:
                    !!backButton
            }
        )


        /* =====================================================
           INTERFERENCE
           ===================================================== */

        if (
            interferenceButton
        ) {

            interferenceButton.addEventListener(
                'click',
                event => {

                    event.preventDefault()

                    event.stopPropagation()


                    console.log(
                        '〰️ WavesWorldUI: INTERFERENCE CLICKED'
                    )


                    this.openInterferenceExperiment()

                }
            )

        }


        /* =====================================================
           DOPPLER
           ===================================================== */

        if (
            dopplerButton
        ) {

            dopplerButton.addEventListener(
                'click',
                event => {

                    event.preventDefault()

                    event.stopPropagation()


                    console.log(
                        '🔵 WavesWorldUI: DOPPLER CLICKED'
                    )


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
                event => {

                    event.preventDefault()

                    event.stopPropagation()


                    console.log(
                        '↩️ WavesWorldUI: BACK CLICKED'
                    )


                    this.hide()


                    setTimeout(
                        () => {

                            if (
                                this.physicsWorldUI &&
                                typeof this.physicsWorldUI
                                    .returnFromWaves
                                === 'function'
                            ) {

                                this.physicsWorldUI
                                    .returnFromWaves()

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


        console.log(
            '🌊 WavesWorldUI: SHOW'
        )


        if (
            !this.root
        ) {

            console.error(
                '❌ WavesWorldUI: cannot show — root missing'
            )

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


        console.log(
            '🌊 WavesWorldUI: WORLD VISIBLE'
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


        console.log(
            '🌊 WavesWorldUI: HIDE'
        )


        this.root.style.opacity =
            '0'


        this.root.style.pointerEvents =
            'none'


        setTimeout(
            () => {

                if (
                    this.root &&
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
       OPEN
       ========================================================= */

    open() {


        console.log(
            '🌊 STEP 5 — WavesWorldUI.open() CALLED'
        )


        this.show()

    }


    /* =========================================================
       CLOSE
       ========================================================= */

    close() {


        console.log(
            '🌊 WavesWorldUI.close() CALLED'
        )


        this.hide()

    }


    /* =========================================================
       LANGUAGE
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


        /*
         * Never rebuild the world while
         * an experiment is active.
         */

        if (
            this.activeExperiment
        ) {

            return

        }


        this.root.innerHTML =
            this.getWorldHTML()


        this.bindWorldEvents()

    }


    /* =========================================================
       OPEN INTERFERENCE
       ========================================================= */

    openInterferenceExperiment() {


        console.log(
            '〰️ WavesWorldUI: OPEN INTERFERENCE'
        )


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


            this.root.style.display =
                'none'

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
           STAGE
           ===================================================== */

        this.interferenceStage =
            this.interferenceContainer.querySelector(
                '[data-wave-stage]'
            )


        if (
            !this.interferenceStage
        ) {

            console.error(
                '❌ Wave interference stage not found'
            )


            this.activeExperiment =
                null


            this.show()


            return

        }


        /* =====================================================
           CREATE EXPERIMENT
           ===================================================== */

        try {

            this.waveInterferenceExperiment =
                new WaveInterferenceExperiment(
                    {
                        container:
                            this.interferenceStage,

                        amplitude:
                            this.amplitude,

                        wavelength:
                            this.wavelength,

                        frequency:
                            this.frequency,

                        sourceDistance:
                            3.4
                    }
                )

        }

        catch (
            error
        ) {

            console.error(
                '❌ Could not create WaveInterferenceExperiment',
                error
            )


            this.closeExperiment()

            this.show()

            return

        }


        /* =====================================================
           CLOCK
           ===================================================== */

        this.interferenceClock =
            new THREE.Clock()


        /* =====================================================
           START
           ===================================================== */

        if (
            this.waveInterferenceExperiment &&
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
           LOOP
           ===================================================== */

        this.startInterferenceRenderLoop()

    }


    /* =========================================================
       INTERFERENCE LOOP
       ========================================================= */

    startInterferenceRenderLoop() {


        if (
            this.interferenceAnimationFrame
        ) {

            cancelAnimationFrame(
                this.interferenceAnimationFrame
            )


            this.interferenceAnimationFrame =
                null

        }


        const render =
            () => {


                if (
                    this.activeExperiment !==
                    'interference'
                ) {

                    return

                }


                const delta =
                    this.interferenceClock
                        ? this.interferenceClock.getDelta()
                        : 0.016


                if (
                    this.waveInterferenceExperiment &&
                    typeof this.waveInterferenceExperiment.update
                    === 'function'
                ) {

                    this.waveInterferenceExperiment.update(
                        this.isInterferenceRunning
                            ? delta
                            : 0
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

                <div
                    class="wave-interference-stage"
                    data-wave-stage
                >
                </div>


                <div class="wave-interference-controls">


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
       INTERFERENCE EVENTS
       ========================================================= */

    bindInterferenceEvents() {


        if (
            !this.interferenceContainer
        ) {

            return

        }


        const container =
            this.interferenceContainer


        const backButton =
            container.querySelector(
                '[data-action="back"]'
            )


        const amplitudeSlider =
            container.querySelector(
                '[data-control="amplitude"]'
            )


        const wavelengthSlider =
            container.querySelector(
                '[data-control="wavelength"]'
            )


        const frequencySlider =
            container.querySelector(
                '[data-control="frequency"]'
            )


        const pauseButton =
            container.querySelector(
                '[data-action="pause"]'
            )


        const resetButton =
            container.querySelector(
                '[data-action="reset"]'
            )


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


        if (
            amplitudeSlider
        ) {

            amplitudeSlider.addEventListener(
                'input',
                event => {

                    this.amplitude =
                        Number(
                            event.target.value
                        ) / 100


                    if (
                        this.waveInterferenceExperiment &&
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


        if (
            wavelengthSlider
        ) {

            wavelengthSlider.addEventListener(
                'input',
                event => {

                    this.wavelength =
                        Number(
                            event.target.value
                        ) / 10


                    if (
                        this.waveInterferenceExperiment &&
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


        if (
            frequencySlider
        ) {

            frequencySlider.addEventListener(
                'input',
                event => {

                    this.frequency =
                        Number(
                            event.target.value
                        ) / 10


                    if (
                        this.waveInterferenceExperiment &&
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
                    typeof experiment.resume ===
                    'function'
                ) {

                    experiment.resume()

                }

            }

            else {

                if (
                    typeof experiment.pause ===
                    'function'
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
                typeof experiment.reset ===
                'function'
            ) {

                experiment.reset()

            }


            if (
                typeof experiment.setAmplitude ===
                'function'
            ) {

                experiment.setAmplitude(
                    this.amplitude
                )

            }


            if (
                typeof experiment.setWavelength ===
                'function'
            ) {

                experiment.setWavelength(
                    this.wavelength
                )

            }


            if (
                typeof experiment.setFrequency ===
                'function'
            ) {

                experiment.setFrequency(
                    this.frequency
                )

            }


            if (
                typeof experiment.start ===
                'function'
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


        console.log(
            '🔵 STEP 8 — openDopplerExperiment() CALLED'
        )


        /* =====================================================
           CLOSE PREVIOUS EXPERIMENT
           ===================================================== */

        console.log(
            '🔵 STEP 8.1 — BEFORE closeExperiment()'
        )


        try {

            this.closeExperiment()

        }

        catch (
            error
        ) {

            console.error(
                '❌ STEP 8.2 — closeExperiment() CRASHED',
                error
            )

            return

        }


        console.log(
            '🔵 STEP 8.3 — AFTER closeExperiment()'
        )


        /* =====================================================
           SET STATE
           ===================================================== */

        this.activeExperiment =
            'doppler'


        console.log(
            '🔵 STEP 9 — activeExperiment = doppler'
        )


        /* =====================================================
           HIDE WORLD
           ===================================================== */

        if (
            this.root
        ) {

            console.log(
                '🔵 STEP 9.1 — HIDING WAVES WORLD'
            )


            this.root.style.opacity =
                '0'


            this.root.style.pointerEvents =
                'none'


            this.root.style.visibility =
                'hidden'


            this.root.style.display =
                'none'

        }


        /* =====================================================
           CHECK SCENE
           ===================================================== */

        console.log(
            '🔵 STEP 9.2 — CHECKING THREE.JS SCENE',
            this.scene
        )


        if (
            !this.scene
        ) {

            console.error(
                '❌ STEP 10 FAILED — WavesWorldUI has NO THREE.JS SCENE'
            )


            this.activeExperiment =
                null


            this.show()


            return

        }


        console.log(
            '🔵 STEP 10 — THREE.JS SCENE EXISTS',
            this.scene
        )


        /* =====================================================
           CHECK CLASS
           ===================================================== */

        console.log(
            '🔵 STEP 10.1 — CHECKING WaveDopplerUI',
            WaveDopplerUI
        )


        if (
            typeof WaveDopplerUI !==
            'function'
        ) {

            console.error(
                '❌ STEP 11 FAILED — WaveDopplerUI is not a constructor',
                WaveDopplerUI
            )


            this.activeExperiment =
                null


            this.show()


            return

        }


        console.log(
            '🔵 STEP 11 — WaveDopplerUI CLASS EXISTS'
        )


        /* =====================================================
           CREATE UI
           ===================================================== */

        try {

            console.log(
                '🔵 STEP 11.1 — CREATING WaveDopplerUI'
            )


            this.dopplerUI =
                new WaveDopplerUI(
                    this.scene,
                    {
                        parent:
                            document.body,

                        onExit:
                            () => {

                                console.log(
                                    '🔵 Doppler onExit() CALLED'
                                )


                                this.closeExperiment()


                                this.show()

                            }

                    }
                )


            console.log(
                '🔵 STEP 12 — WaveDopplerUI CREATED',
                this.dopplerUI
            )

        }

        catch (
            error
        ) {

            console.error(
                '❌ STEP 12 FAILED — Could not create WaveDopplerUI',
                error
            )


            this.dopplerUI =
                null


            this.activeExperiment =
                null


            this.show()


            return

        }


        /* =====================================================
           CHECK EXPERIMENT
           ===================================================== */

        console.log(
            '🔵 STEP 12.1 — DOPPLER UI OBJECT CHECK',
            {
                dopplerUI:
                    this.dopplerUI,

                hasExperiment:
                    !!this.dopplerUI?.experiment,

                experiment:
                    this.dopplerUI?.experiment
            }
        )


        /* =====================================================
           ENTER
           ===================================================== */

        console.log(
            '🔵 STEP 12.2 — CHECKING enter()'
        )


        if (
            typeof this.dopplerUI.enter !==
            'function'
        ) {

            console.error(
                '❌ STEP 13 FAILED — dopplerUI.enter() DOES NOT EXIST',
                this.dopplerUI
            )


            this.closeExperiment()


            this.show()


            return

        }


        /* =====================================================
           CALL ENTER
           ===================================================== */

        try {

            console.log(
                '🔵 STEP 13 — CALLING dopplerUI.enter()'
            )


            this.dopplerUI.enter()


            console.log(
                '🔵 STEP 14 — dopplerUI.enter() FINISHED'
            )


            console.log(
                '🔵 STEP 14.1 — DOPPLER AFTER ENTER',
                {
                    activeExperiment:
                        this.activeExperiment,

                    dopplerUI:
                        this.dopplerUI,

                    experiment:
                        this.dopplerUI?.experiment
                }
            )

        }

        catch (
            error
        ) {

            console.error(
                '❌ STEP 14 FAILED — WaveDopplerUI.enter() ERROR',
                error
            )


            this.closeExperiment()


            this.show()

        }

    }


    /* =========================================================
       CLOSE CURRENT EXPERIMENT
       ========================================================= */

    closeExperiment() {


        console.log(
            '🧹 WavesWorldUI: closeExperiment()'
        )


        /* =====================================================
           STOP INTERFERENCE LOOP
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
           DESTROY INTERFERENCE
           ===================================================== */

        if (
            this.waveInterferenceExperiment
        ) {

            try {

                if (
                    typeof this.waveInterferenceExperiment
                        .destroy
                    === 'function'
                ) {

                    this.waveInterferenceExperiment
                        .destroy()

                }

            }

            catch (
                error
            ) {

                console.error(
                    '❌ Error destroying interference experiment',
                    error
                )

            }


            this.waveInterferenceExperiment =
                null

        }


        /* =====================================================
           REMOVE INTERFERENCE DOM
           ===================================================== */

        if (
            this.interferenceContainer
        ) {

            this.interferenceContainer.remove()


            this.interferenceContainer =
                null

        }


        this.interferenceStage =
            null


        this.interferenceClock =
            null


        /* =====================================================
           DESTROY DOPPLER
           ===================================================== */

        if (
            this.dopplerUI
        ) {

            console.log(
                '🔵 WavesWorldUI: destroying Doppler UI'
            )


            try {

                if (
                    typeof this.dopplerUI.destroy ===
                    'function'
                ) {

                    this.dopplerUI.destroy()

                }

            }

            catch (
                error
            ) {

                console.error(
                    '❌ Error destroying Doppler UI',
                    error
                )

            }


            this.dopplerUI =
                null

        }


        /* =====================================================
           STATE
           ===================================================== */

        this.activeExperiment =
            null


        this.isInterferenceRunning =
            false


        console.log(
            '🧹 WavesWorldUI: closeExperiment() FINISHED'
        )

    }


    /* =========================================================
       UPDATE
       ========================================================= */

    update(
        delta = 0.016
    ) {


        /* =====================================================
           VALIDATE DELTA
           ===================================================== */

        const numericDelta =
            Number(
                delta
            )


        const safeDelta =
            Number.isFinite(
                numericDelta
            )

                ? Math.min(
                    Math.max(
                        numericDelta,
                        0
                    ),
                    0.05
                )

                : 0.016


        /* =====================================================
           DOPPLER
           ===================================================== */

        if (
            this.activeExperiment ===
            'doppler'
        ) {

            if (
                this.dopplerUI &&
                typeof this.dopplerUI.update ===
                'function'
            ) {

                this.dopplerUI.update(
                    safeDelta
                )

            }

        }


        /* =====================================================
           INTERFERENCE
           ===================================================== */

        /*
         * Wave Interference has its own
         * requestAnimationFrame loop:
         *
         * startInterferenceRenderLoop()
         *
         * Therefore we intentionally do NOT call
         * waveInterferenceExperiment.update()
         * from this global update().
         */

    }


    /* =========================================================
       SET SCENE
       ========================================================= */

    setScene(
        scene
    ) {


        console.log(
            '🌌 WavesWorldUI: setScene()',
            scene
        )


        this.scene =
            scene || null


        /* =====================================================
           DOPPLER UI
           ===================================================== */

        if (
            this.dopplerUI &&
            typeof this.dopplerUI.setScene ===
            'function'
        ) {

            this.dopplerUI.setScene(
                this.scene
            )

        }


        /* =====================================================
           DOPPLER EXPERIMENT DIRECTLY
           ===================================================== */

        if (
            this.dopplerUI?.experiment
        ) {

            this.dopplerUI.experiment.scene =
                this.scene

        }

    }


    /* =========================================================
       GET ACTIVE EXPERIMENT
       ========================================================= */

    getActiveExperiment() {

        return this.activeExperiment

    }


    /* =========================================================
       GET DOPPLER UI
       ========================================================= */

    getDopplerUI() {

        return this.dopplerUI

    }


    /* =========================================================
       GET ROOT
       ========================================================= */

    getElement() {

        return this.root

    }


    /* =========================================================
       DESTROY
       ========================================================= */

    destroy() {


        console.log(
            '🗑️ WavesWorldUI: DESTROY'
        )


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