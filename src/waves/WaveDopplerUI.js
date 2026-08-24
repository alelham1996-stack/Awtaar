/* =========================================================
   AWTAAR — WAVE DOPPLER UI
   ========================================================= */

import WaveDopplerExperiment
    from './DopplerExperiment.js'

import {
    t,
    getLanguage
} from '../locales/i18n.js'


export default class WaveDopplerUI {


    constructor(
        scene = null,
        options = {}
    ) {


        /* =====================================================
           REFERENCES
           ===================================================== */

        this.scene =
            scene || null

        this.parent =
            options.parent || document.body

        this.onExit =
            typeof options.onExit === 'function'
                ? options.onExit
                : null


        /* =====================================================
           STATE
           ===================================================== */

        this.active =
            false

        this.paused =
            false

        this.destroyed =
            false


        /* =====================================================
           DOM
           ===================================================== */

        this.container =
            null

        this.root =
            null


        this.elements = {}


        /* =====================================================
           EXPERIMENT
           ===================================================== */

        this.experiment =
            new WaveDopplerExperiment({
                scene: this.scene,
                parent: this.parent
            })


        /* =====================================================
           INITIALIZE
           ===================================================== */

        this.createUI()

        this.bindEvents()

        this.updateLanguage()

        this.updateValues()

    }


    /* =========================================================
       TRANSLATION HELPER
       ========================================================= */

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

        }
        catch (
            error
        ) {

            /*
             * Keep UI functional even if
             * a translation key does not exist.
             */

        }


        return fallback

    }


    /* =========================================================
       CREATE UI
       ========================================================= */

    createUI() {


        /*
         * Main experiment container.
         */

        this.container =
            document.createElement(
                'div'
            )

        this.container.className =
            'wave-doppler-container'

        this.container.id =
            'awtaar-wave-doppler'


        /*
         * Inner root.
         */

        this.root =
            document.createElement(
                'div'
            )

        this.root.className =
            'wave-doppler-root'


        this.container.appendChild(
            this.root
        )


        /* =====================================================
           TOP BAR
           ===================================================== */

        const top =
            document.createElement(
                'div'
            )

        top.className =
            'wave-doppler-top'


        const titleArea =
            document.createElement(
                'div'
            )

        titleArea.className =
            'wave-doppler-title-area'


        const eyebrow =
            document.createElement(
                'div'
            )

        eyebrow.className =
            'wave-doppler-eyebrow'

        eyebrow.dataset.i18n =
            'waves.doppler.eyebrow'

        eyebrow.textContent =
            this.translate(
                'waves.doppler.eyebrow',
                'WAVE PHYSICS'
            )


        const title =
            document.createElement(
                'h1'
            )

        title.className =
            'wave-doppler-title'

        title.dataset.i18n =
            'waves.doppler.title'

        title.textContent =
            this.translate(
                'waves.doppler.title',
                'تأثير دوبلر'
            )


        titleArea.appendChild(
            eyebrow
        )

        titleArea.appendChild(
            title
        )


        /*
         * Back button.
         */

        const backButton =
            document.createElement(
                'button'
            )

        backButton.type =
            'button'

        backButton.className =
            'wave-doppler-back'

        backButton.dataset.action =
            'back'

        backButton.dataset.i18n =
            'waves.doppler.back'

        backButton.textContent =
            this.translate(
                'waves.doppler.back',
                'العودة'
            )


        top.appendChild(
            titleArea
        )

        top.appendChild(
            backButton
        )


        /* =====================================================
           INTRO
           ===================================================== */

        const intro =
            document.createElement(
                'div'
            )

        intro.className =
            'wave-doppler-intro'


        const line =
            document.createElement(
                'div'
            )

        line.className =
            'wave-doppler-line'

        line.dataset.i18n =
            'waves.doppler.intro'

        line.textContent =
            this.translate(
                'waves.doppler.intro',
                'SOURCE MOTION • FREQUENCY • WAVELENGTH'
            )


        const description =
            document.createElement(
                'p'
            )

        description.className =
            'wave-doppler-description'

        description.dataset.i18n =
            'waves.doppler.description'

        description.textContent =
            this.translate(
                'waves.doppler.description',
                'راقب كيف تتغير المسافة بين الجبهات الموجية عندما يتحرك المصدر.'
            )


        intro.appendChild(
            line
        )

        intro.appendChild(
            description
        )


        /* =====================================================
           INFORMATION PANEL
           ===================================================== */

        const info =
            document.createElement(
                'div'
            )

        info.className =
            'wave-doppler-info'


        this.elements.info =
            info


        /*
         * Source speed.
         */

        this.elements.sourceSpeed =
            this.createDataBox(
                'waves.doppler.sourceSpeed',
                'سرعة المصدر',
                '0.80'
            )


        /*
         * Source frequency.
         */

        this.elements.frequency =
            this.createDataBox(
                'waves.doppler.frequency',
                'تردد المصدر',
                '1.50'
            )


        /*
         * Wave speed.
         */

        this.elements.waveSpeed =
            this.createDataBox(
                'waves.doppler.waveSpeed',
                'سرعة الموجة',
                '3.00'
            )


        /*
         * Base wavelength.
         */

        this.elements.wavelength =
            this.createDataBox(
                'waves.doppler.wavelength',
                'الطول الموجي',
                '2.00'
            )


        /*
         * Active wave count.
         */

        this.elements.waveCount =
            this.createDataBox(
                'waves.doppler.waveCount',
                'الجبهات الموجية',
                '0'
            )


        info.appendChild(
            this.elements.sourceSpeed.box
        )

        info.appendChild(
            this.elements.frequency.box
        )

        info.appendChild(
            this.elements.waveSpeed.box
        )

        info.appendChild(
            this.elements.wavelength.box
        )

        info.appendChild(
            this.elements.waveCount.box
        )


        /* =====================================================
           DOPPLER COMPARISON
           ===================================================== */

        const comparison =
            document.createElement(
                'div'
            )

        comparison.className =
            'wave-doppler-comparison'


        /*
         * Approaching.
         */

        this.elements.approaching =
            this.createComparisonBox(
                'approaching',
                'waves.doppler.approaching',
                'أمام المصدر'
            )


        /*
         * Receding.
         */

        this.elements.receding =
            this.createComparisonBox(
                'receding',
                'waves.doppler.receding',
                'خلف المصدر'
            )


        comparison.appendChild(
            this.elements.approaching.box
        )

        comparison.appendChild(
            this.elements.receding.box
        )


        /* =====================================================
           CONTROLS
           ===================================================== */

        const controls =
            document.createElement(
                'div'
            )

        controls.className =
            'wave-doppler-controls'


        /*
         * Section title.
         */

        const controlsTitle =
            document.createElement(
                'div'
            )

        controlsTitle.className =
            'wave-doppler-controls-title'

        controlsTitle.dataset.i18n =
            'waves.doppler.controls'

        controlsTitle.textContent =
            this.translate(
                'waves.doppler.controls',
                'التحكم في التجربة'
            )


        controls.appendChild(
            controlsTitle
        )


        /* =====================================================
           SOURCE SPEED SLIDER
           ===================================================== */

        const sourceSpeedControl =
            this.createSlider(
                'source-speed',
                'waves.doppler.sourceSpeed',
                'سرعة المصدر',
                0,
                2.5,
                0.01,
                this.experiment.sourceSpeed
            )


        this.elements.sourceSpeedSlider =
            sourceSpeedControl.input

        this.elements.sourceSpeedSliderValue =
            sourceSpeedControl.value


        controls.appendChild(
            sourceSpeedControl.row
        )


        /* =====================================================
           FREQUENCY SLIDER
           ===================================================== */

        const frequencyControl =
            this.createSlider(
                'frequency',
                'waves.doppler.frequency',
                'التردد',
                0.1,
                8,
                0.1,
                this.experiment.frequency
            )


        this.elements.frequencySlider =
            frequencyControl.input

        this.elements.frequencySliderValue =
            frequencyControl.value


        controls.appendChild(
            frequencyControl.row
        )


        /* =====================================================
           WAVE SPEED SLIDER
           ===================================================== */

        const waveSpeedControl =
            this.createSlider(
                'wave-speed',
                'waves.doppler.waveSpeed',
                'سرعة الموجة',
                0.5,
                10,
                0.1,
                this.experiment.waveSpeed
            )


        this.elements.waveSpeedSlider =
            waveSpeedControl.input

        this.elements.waveSpeedSliderValue =
            waveSpeedControl.value


        controls.appendChild(
            waveSpeedControl.row
        )


        /* =====================================================
           ACTIONS
           ===================================================== */

        const actions =
            document.createElement(
                'div'
            )

        actions.className =
            'wave-doppler-actions'


        /*
         * Play / pause.
         */

        const playButton =
            document.createElement(
                'button'
            )

        playButton.type =
            'button'

        playButton.className =
            'wave-doppler-action primary'

        playButton.dataset.action =
            'play'

        playButton.textContent =
            this.translate(
                'waves.doppler.play',
                'تشغيل'
            )


        this.elements.playButton =
            playButton


        /*
         * Pause.
         */

        const pauseButton =
            document.createElement(
                'button'
            )

        pauseButton.type =
            'button'

        pauseButton.className =
            'wave-doppler-action'

        pauseButton.dataset.action =
            'pause'

        pauseButton.textContent =
            this.translate(
                'waves.doppler.pause',
                'إيقاف مؤقت'
            )


        this.elements.pauseButton =
            pauseButton


        /*
         * Reset.
         */

        const resetButton =
            document.createElement(
                'button'
            )

        resetButton.type =
            'button'

        resetButton.className =
            'wave-doppler-action'

        resetButton.dataset.action =
            'reset'

        resetButton.textContent =
            this.translate(
                'waves.doppler.reset',
                'إعادة'
            )


        this.elements.resetButton =
            resetButton


        actions.appendChild(
            playButton
        )

        actions.appendChild(
            pauseButton
        )

        actions.appendChild(
            resetButton
        )


        /* =====================================================
           NOTE
           ===================================================== */

        const note =
            document.createElement(
                'div'
            )

        note.className =
            'wave-doppler-note'

        note.dataset.i18n =
            'waves.doppler.note'

        note.textContent =
            this.translate(
                'waves.doppler.note',
                'كلما اقتربت سرعة المصدر من سرعة الموجة، تصبح الجبهات الموجية أمام المصدر أكثر تقاربًا.'
            )


        this.elements.note =
            note


        /* =====================================================
           STATUS
           ===================================================== */

        const status =
            document.createElement(
                'div'
            )

        status.className =
            'wave-doppler-status'


        const statusDot =
            document.createElement(
                'span'
            )

        statusDot.className =
            'wave-doppler-status-dot'


        const statusText =
            document.createElement(
                'span'
            )

        statusText.className =
            'wave-doppler-status-text'

        statusText.dataset.i18n =
            'waves.doppler.ready'

        statusText.textContent =
            this.translate(
                'waves.doppler.ready',
                'جاهز'
            )


        status.appendChild(
            statusDot
        )

        status.appendChild(
            statusText
        )


        this.elements.status =
            status

        this.elements.statusText =
            statusText


        /* =====================================================
           ASSEMBLE
           ===================================================== */

        this.root.appendChild(
            top
        )

        this.root.appendChild(
            intro
        )

        this.root.appendChild(
            info
        )

        this.root.appendChild(
            comparison
        )

        this.root.appendChild(
            controls
        )

        this.root.appendChild(
            actions
        )

        this.root.appendChild(
            note
        )

        this.root.appendChild(
            status
        )


        /*
         * Add to DOM.
         */

        this.parent.appendChild(
            this.container
        )


        /*
         * Start hidden.
         */

        this.container.classList.remove(
            'is-visible'
        )

    }


    /* =========================================================
       CREATE DATA BOX
       ========================================================= */

    createDataBox(
        key,
        fallbackLabel,
        initialValue
    ) {

        const box =
            document.createElement(
                'div'
            )

        box.className =
            'wave-doppler-data-box'


        const label =
            document.createElement(
                'span'
            )

        label.className =
            'wave-doppler-label'

        label.dataset.i18n =
            key

        label.textContent =
            this.translate(
                key,
                fallbackLabel
            )


        const value =
            document.createElement(
                'strong'
            )

        value.className =
            'wave-doppler-value'

        value.textContent =
            initialValue


        box.appendChild(
            label
        )

        box.appendChild(
            value
        )


        return {

            box:
                box,

            label:
                label,

            value:
                value

        }

    }


    /* =========================================================
       CREATE COMPARISON BOX
       ========================================================= */

    createComparisonBox(
        type,
        key,
        fallback
    ) {

        const box =
            document.createElement(
                'div'
            )

        box.className =
            `wave-doppler-comparison-box ${type}`


        const header =
            document.createElement(
                'div'
            )

        header.className =
            'wave-doppler-comparison-header'


        const title =
            document.createElement(
                'span'
            )

        title.className =
            'wave-doppler-comparison-title'

        title.dataset.i18n =
            key

        title.textContent =
            this.translate(
                key,
                fallback
            )


        header.appendChild(
            title
        )


        /*
         * Frequency.
         */

        const frequencyRow =
            document.createElement(
                'div'
            )

        frequencyRow.className =
            'wave-doppler-comparison-row'


        const frequencyLabel =
            document.createElement(
                'span'
            )

        frequencyLabel.dataset.i18n =
            'waves.doppler.observedFrequency'

        frequencyLabel.textContent =
            this.translate(
                'waves.doppler.observedFrequency',
                'التردد المرصود'
            )


        const frequencyValue =
            document.createElement(
                'strong'
            )

        frequencyValue.textContent =
            '0.00'


        frequencyRow.appendChild(
            frequencyLabel
        )

        frequencyRow.appendChild(
            frequencyValue
        )


        /*
         * Wavelength.
         */

        const wavelengthRow =
            document.createElement(
                'div'
            )

        wavelengthRow.className =
            'wave-doppler-comparison-row'


        const wavelengthLabel =
            document.createElement(
                'span'
            )

        wavelengthLabel.dataset.i18n =
            'waves.doppler.observedWavelength'

        wavelengthLabel.textContent =
            this.translate(
                'waves.doppler.observedWavelength',
                'الطول الموجي'
            )


        const wavelengthValue =
            document.createElement(
                'strong'
            )

        wavelengthValue.textContent =
            '0.00'


        wavelengthRow.appendChild(
            wavelengthLabel
        )

        wavelengthRow.appendChild(
            wavelengthValue
        )


        /*
         * Ratio.
         */

        const ratioRow =
            document.createElement(
                'div'
            )

        ratioRow.className =
            'wave-doppler-comparison-row'


        const ratioLabel =
            document.createElement(
                'span'
            )

        ratioLabel.dataset.i18n =
            'waves.doppler.relativeChange'

        ratioLabel.textContent =
            this.translate(
                'waves.doppler.relativeChange',
                'التغير النسبي'
            )


        const ratioValue =
            document.createElement(
                'strong'
            )

        ratioValue.textContent =
            '0%'


        ratioRow.appendChild(
            ratioLabel
        )

        ratioRow.appendChild(
            ratioValue
        )


        box.appendChild(
            header
        )

        box.appendChild(
            frequencyRow
        )

        box.appendChild(
            wavelengthRow
        )

        box.appendChild(
            ratioRow
        )


        return {

            box:
                box,

            title:
                title,

            frequency:
                frequencyValue,

            wavelength:
                wavelengthValue,

            ratio:
                ratioValue

        }

    }


    /* =========================================================
       CREATE SLIDER
       ========================================================= */

    createSlider(
        id,
        key,
        fallbackLabel,
        min,
        max,
        step,
        value
    ) {

        const row =
            document.createElement(
                'div'
            )

        row.className =
            'wave-doppler-control-row'


        /*
         * Header.
         */

        const header =
            document.createElement(
                'div'
            )

        header.className =
            'wave-doppler-control-header'


        const label =
            document.createElement(
                'span'
            )

        label.dataset.i18n =
            key

        label.textContent =
            this.translate(
                key,
                fallbackLabel
            )


        const valueDisplay =
            document.createElement(
                'strong'
            )

        valueDisplay.textContent =
            this.formatNumber(
                value,
                2
            )


        header.appendChild(
            label
        )

        header.appendChild(
            valueDisplay
        )


        /*
         * Slider.
         */

        const input =
            document.createElement(
                'input'
            )

        input.type =
            'range'

        input.id =
            `wave-doppler-${id}`

        input.className =
            'wave-doppler-slider'

        input.min =
            String(min)

        input.max =
            String(max)

        input.step =
            String(step)

        input.value =
            String(value)


        row.appendChild(
            header
        )

        row.appendChild(
            input
        )


        return {

            row:
                row,

            input:
                input,

            value:
                valueDisplay

        }

    }


    /* =========================================================
       BIND EVENTS
       ========================================================= */

    bindEvents() {


        if (
            !this.container
        ) {
            return
        }


        /*
         * Event delegation.
         */

        this.container.addEventListener(
            'click',
            event => {

                const actionElement =
                    event.target.closest(
                        '[data-action]'
                    )


                if (
                    !actionElement
                ) {
                    return
                }


                const action =
                    actionElement.dataset.action


                switch (
                    action
                ) {

                    case 'play':

                        this.play()

                        break


                    case 'pause':

                        this.pause()

                        break


                    case 'reset':

                        this.reset()

                        break


                    case 'back':

                        this.exit()

                        break

                }

            }
        )


        /* =====================================================
           SOURCE SPEED
           ===================================================== */

        if (
            this.elements.sourceSpeedSlider
        ) {

            this.elements.sourceSpeedSlider.addEventListener(
                'input',
                event => {

                    const value =
                        Number(
                            event.target.value
                        )


                    this.experiment.setSourceSpeed(
                        value
                    )


                    this.updateValues()

                }
            )

        }


        /* =====================================================
           FREQUENCY
           ===================================================== */

        if (
            this.elements.frequencySlider
        ) {

            this.elements.frequencySlider.addEventListener(
                'input',
                event => {

                    const value =
                        Number(
                            event.target.value
                        )


                    this.experiment.setFrequency(
                        value
                    )


                    this.updateValues()

                }
            )

        }


        /* =====================================================
           WAVE SPEED
           ===================================================== */

        if (
            this.elements.waveSpeedSlider
        ) {

            this.elements.waveSpeedSlider.addEventListener(
                'input',
                event => {

                    const value =
                        Number(
                            event.target.value
                        )


                    this.experiment.setWaveSpeed(
                        value
                    )


                    this.updateValues()

                }
            )

        }


        /* =====================================================
           LANGUAGE
           ===================================================== */

        window.addEventListener(
            'awtaar-language-changed',
            () => {

                this.updateLanguage()

            }
        )

    }


    /* =========================================================
       PLAY
       ========================================================= */

    play() {

        if (
            this.destroyed
        ) {
            return
        }


        this.experiment.start()


        this.active =
            true

        this.paused =
            false


        this.updateStatus(
            'running'
        )

        this.updateActionState()

    }


    /* =========================================================
       PAUSE
       ========================================================= */

    pause() {

        if (
            this.destroyed
        ) {
            return
        }


        this.experiment.pause()


        this.paused =
            true


        this.updateStatus(
            'paused'
        )

        this.updateActionState()

    }


    /* =========================================================
       RESET
       ========================================================= */

    reset() {

        if (
            this.destroyed
        ) {
            return
        }


        this.experiment.reset()


        this.active =
            false

        this.paused =
            false


        /*
         * Restore slider values.
         */

        if (
            this.elements.sourceSpeedSlider
        ) {

            this.elements.sourceSpeedSlider.value =
                String(
                    this.experiment.sourceSpeed
                )

        }


        if (
            this.elements.frequencySlider
        ) {

            this.elements.frequencySlider.value =
                String(
                    this.experiment.frequency
                )

        }


        if (
            this.elements.waveSpeedSlider
        ) {

            this.elements.waveSpeedSlider.value =
                String(
                    this.experiment.waveSpeed
                )

        }


        this.updateValues()

        this.updateStatus(
            'ready'
        )

        this.updateActionState()

    }


    /* =========================================================
       ENTER
       ========================================================= */

    enter() {

        if (
            this.destroyed
        ) {
            return
        }


        this.active =
            true

        this.paused =
            false


        /*
         * Add Three.js group to scene.
         */

        if (
            this.scene
        ) {

            this.experiment.addToScene(
                this.scene
            )

        }


        /*
         * Show UI.
         */

        if (
            this.container
        ) {

            this.container.classList.add(
                'is-visible'
            )

        }


        /*
         * Start experiment.
         */

        this.experiment.start()


        this.updateStatus(
            'running'
        )

        this.updateActionState()

        this.updateValues()

    }


    /* =========================================================
       SHOW
       ========================================================= */

    show() {

        this.enter()

    }


    /* =========================================================
       HIDE
       ========================================================= */

    hide() {

        if (
            this.container
        ) {

            this.container.classList.remove(
                'is-visible'
            )

        }

    }


    /* =========================================================
       EXIT
       ========================================================= */

    exit() {


        this.experiment.stop()


        this.active =
            false

        this.paused =
            false


        this.hide()


        this.updateStatus(
            'ready'
        )


        this.updateActionState()


        /*
         * Notify parent UI.
         */

        if (
            this.onExit
        ) {

            this.onExit()

        }

    }


    /* =========================================================
       UPDATE
       ========================================================= */

    update(
        delta
    ) {

        if (
            this.destroyed
        ) {
            return
        }


        if (
            !this.active
        ) {
            return
        }


        const safeDelta =
            Math.min(
                Math.max(
                    Number(delta) || 0,
                    0
                ),
                0.05
            )


        this.experiment.update(
            safeDelta
        )


        /*
         * Update UI data periodically.
         */

        this.updateValues()

    }


    /* =========================================================
       UPDATE VALUES
       ========================================================= */

    updateValues() {

        if (
            !this.experiment
        ) {
            return
        }


        const data =
            this.experiment.getWaveData()


        if (
            !data
        ) {
            return
        }


        /* =====================================================
           BASIC VALUES
           ===================================================== */

        if (
            this.elements.sourceSpeed
        ) {

            this.elements.sourceSpeed.value.textContent =
                this.formatNumber(
                    data.sourceSpeed,
                    2
                )

        }


        if (
            this.elements.frequency
        ) {

            this.elements.frequency.value.textContent =
                this.formatNumber(
                    data.frequency,
                    2
                )

        }


        if (
            this.elements.waveSpeed
        ) {

            this.elements.waveSpeed.value.textContent =
                this.formatNumber(
                    data.waveSpeed,
                    2
                )

        }


        if (
            this.elements.wavelength
        ) {

            this.elements.wavelength.value.textContent =
                this.formatNumber(
                    data.wavelength,
                    2
                )

        }


        if (
            this.elements.waveCount
        ) {

            this.elements.waveCount.value.textContent =
                String(
                    data.waveCount
                )

        }


        /* =====================================================
           SLIDER VALUES
           ===================================================== */

        if (
            this.elements.sourceSpeedSliderValue
        ) {

            this.elements.sourceSpeedSliderValue.textContent =
                this.formatNumber(
                    data.sourceSpeed,
                    2
                )

        }


        if (
            this.elements.frequencySliderValue
        ) {

            this.elements.frequencySliderValue.textContent =
                this.formatNumber(
                    data.frequency,
                    2
                )

        }


        if (
            this.elements.waveSpeedSliderValue
        ) {

            this.elements.waveSpeedSliderValue.textContent =
                this.formatNumber(
                    data.waveSpeed,
                    2
                )

        }


        /* =====================================================
           APPROACHING
           ===================================================== */

        if (
            this.elements.approaching
        ) {

            this.elements.approaching.frequency.textContent =
                this.formatNumber(
                    data.approachingFrequency,
                    2
                )


            this.elements.approaching.wavelength.textContent =
                this.formatNumber(
                    data.approachingWavelength,
                    2
                )


            const approachingChange =
                this.calculatePercentage(
                    data.approachingFrequency,
                    data.frequency
                )


            this.elements.approaching.ratio.textContent =
                this.formatPercentage(
                    approachingChange
                )

        }


        /* =====================================================
           RECEDING
           ===================================================== */

        if (
            this.elements.receding
        ) {

            this.elements.receding.frequency.textContent =
                this.formatNumber(
                    data.recedingFrequency,
                    2
                )


            this.elements.receding.wavelength.textContent =
                this.formatNumber(
                    data.recedingWavelength,
                    2
                )


            const recedingChange =
                this.calculatePercentage(
                    data.recedingFrequency,
                    data.frequency
                )


            this.elements.receding.ratio.textContent =
                this.formatPercentage(
                    recedingChange
                )

        }

    }


    /* =========================================================
       UPDATE STATUS
       ========================================================= */

    updateStatus(
        state
    ) {

        if (
            !this.elements.statusText
        ) {
            return
        }


        let key =
            'waves.doppler.ready'

        let fallback =
            'جاهز'


        switch (
            state
        ) {

            case 'running':

                key =
                    'waves.doppler.running'

                fallback =
                    'التجربة تعمل'

                break


            case 'paused':

                key =
                    'waves.doppler.paused'

                fallback =
                    'متوقفة مؤقتًا'

                break


            case 'ready':

            default:

                key =
                    'waves.doppler.ready'

                fallback =
                    'جاهز'

                break

        }


        this.elements.statusText.dataset.i18n =
            key

        this.elements.statusText.textContent =
            this.translate(
                key,
                fallback
            )


        if (
            this.elements.status
        ) {

            this.elements.status.dataset.state =
                state

        }

    }


    /* =========================================================
       UPDATE ACTION STATE
       ========================================================= */

    updateActionState() {

        if (
            this.elements.playButton
        ) {

            this.elements.playButton.disabled =
                this.active &&
                !this.paused

        }


        if (
            this.elements.pauseButton
        ) {

            this.elements.pauseButton.disabled =
                !this.active ||
                this.paused

        }

    }


    /* =========================================================
       UPDATE LANGUAGE
       ========================================================= */

    updateLanguage() {

        if (
            !this.container
        ) {
            return
        }


        /*
         * Direction.
         */

        const language =
            typeof getLanguage === 'function'
                ? getLanguage()
                : 'ar'


        this.container.dir =
            language === 'ar'
                ? 'rtl'
                : 'ltr'


        /*
         * Update all translation nodes.
         */

        const nodes =
            this.container.querySelectorAll(
                '[data-i18n]'
            )


        nodes.forEach(
            node => {

                const key =
                    node.dataset.i18n


                if (
                    !key
                ) {
                    return
                }


                const currentText =
                    node.textContent


                const translated =
                    this.translate(
                        key,
                        currentText
                    )


                node.textContent =
                    translated

            }
        )


        /*
         * Restore dynamic values.
         */

        this.updateValues()


        /*
         * Status is dynamic,
         * so restore it after translation.
         */

        if (
            this.elements.status?.dataset.state
        ) {

            this.updateStatus(
                this.elements.status.dataset.state
            )

        }

    }


    /* =========================================================
       FORMAT NUMBER
       ========================================================= */

    formatNumber(
        value,
        decimals = 2
    ) {

        const number =
            Number(value)


        if (
            !Number.isFinite(number)
        ) {

            return '0.00'

        }


        return number.toFixed(
            decimals
        )

    }


    /* =========================================================
       CALCULATE PERCENTAGE
       ========================================================= */

    calculatePercentage(
        value,
        base
    ) {

        const safeBase =
            Number(base)


        if (
            !Number.isFinite(safeBase) ||
            Math.abs(safeBase) < 0.000001
        ) {

            return 0

        }


        return (
            (
                Number(value) -
                safeBase
            ) /
            safeBase
        ) *
        100

    }


    /* =========================================================
       FORMAT PERCENTAGE
       ========================================================= */

    formatPercentage(
        value
    ) {

        const number =
            Number(value)


        if (
            !Number.isFinite(number)
        ) {

            return '0%'

        }


        const sign =
            number > 0
                ? '+'
                : ''


        return (
            sign +
            number.toFixed(1) +
            '%'
        )

    }


    /* =========================================================
       SET SCENE
       ========================================================= */

    setScene(
        scene
    ) {

        this.scene =
            scene || null


        if (
            this.experiment
        ) {

            this.experiment.scene =
                this.scene

        }

    }


    /* =========================================================
       SET PARENT
       ========================================================= */

    setParent(
        parent
    ) {

        if (
            !parent ||
            !parent.appendChild
        ) {
            return
        }


        this.parent =
            parent


        if (
            this.container &&
            this.container.parentNode !==
            parent
        ) {

            parent.appendChild(
                this.container
            )

        }

    }


    /* =========================================================
       GET EXPERIMENT
       ========================================================= */

    getExperiment() {

        return this.experiment

    }


    /* =========================================================
       GET ROOT
       ========================================================= */

    getElement() {

        return this.container

    }


    /* =========================================================
       DESTROY
       ========================================================= */

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

        this.paused =
            false


        /*
         * Stop experiment.
         */

        if (
            this.experiment
        ) {

            this.experiment.destroy()

        }


        /*
         * Remove DOM.
         */

        if (
            this.container &&
            this.container.parentNode
        ) {

            this.container.parentNode.removeChild(
                this.container
            )

        }


        this.container =
            null

        this.root =
            null

        this.elements =
            {}

        this.experiment =
            null

        this.scene =
            null

        this.parent =
            null

        this.onExit =
            null

    }

}