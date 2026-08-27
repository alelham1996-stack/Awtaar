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

        this.elements =
            {}


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
       TRANSLATION
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
            // Keep UI functional.
        }

        return fallback

    }


    /* =========================================================
       CREATE UI
       ========================================================= */

    createUI() {

        /* =====================================================
           ROOT
           ===================================================== */

        this.container =
            document.createElement('div')

        this.container.className =
            'wave-doppler-container'

        this.container.id =
            'awtaar-wave-doppler'


        this.root =
            document.createElement('div')

        this.root.className =
            'wave-doppler-root'


        this.container.appendChild(
            this.root
        )


        /* =====================================================
           HEADER
           ===================================================== */

        const header =
            document.createElement('header')

        header.className =
            'wave-doppler-top'


        const titleArea =
            document.createElement('div')

        titleArea.className =
            'wave-doppler-title-area'


        const eyebrow =
            document.createElement('div')

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
            document.createElement('h1')

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


        const backButton =
            document.createElement('button')

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


        header.appendChild(
            titleArea
        )

        header.appendChild(
            backButton
        )


        /* =====================================================
           LEFT HUD
           ===================================================== */

        const hud =
            document.createElement('div')

        hud.className =
            'wave-doppler-hud'


        const hudLabel =
            document.createElement('div')

        hudLabel.className =
            'wave-doppler-hud-label'

        hudLabel.textContent =
            this.translate(
                'waves.doppler.observe',
                'OBSERVE'
            )


        const hudDescription =
            document.createElement('div')

        hudDescription.className =
            'wave-doppler-hud-description'

        hudDescription.dataset.i18n =
            'waves.doppler.description'

        hudDescription.textContent =
            this.translate(
                'waves.doppler.description',
                'راقب كيف تتغير المسافة بين الجبهات الموجية عندما يتحرك المصدر.'
            )


        const liveIndicator =
            document.createElement('div')

        liveIndicator.className =
            'wave-doppler-live'


        const liveDot =
            document.createElement('span')

        liveDot.className =
            'wave-doppler-live-dot'


        const liveText =
            document.createElement('span')

        liveText.dataset.i18n =
            'waves.doppler.ready'

        liveText.textContent =
            this.translate(
                'waves.doppler.ready',
                'جاهز'
            )


        liveIndicator.appendChild(
            liveDot
        )

        liveIndicator.appendChild(
            liveText
        )


        hud.appendChild(
            hudLabel
        )

        hud.appendChild(
            hudDescription
        )

        hud.appendChild(
            liveIndicator
        )


        this.elements.status =
            liveIndicator

        this.elements.statusText =
            liveText


        /* =====================================================
           RIGHT CONTROL PANEL
           ===================================================== */

        const panel =
            document.createElement('aside')

        panel.className =
            'wave-doppler-panel'


        /* =====================================================
           PANEL HEADER
           ===================================================== */

        const panelHeader =
            document.createElement('div')

        panelHeader.className =
            'wave-doppler-panel-header'


        const panelTitle =
            document.createElement('div')

        panelTitle.className =
            'wave-doppler-panel-title'

        panelTitle.dataset.i18n =
            'waves.doppler.controls'

        panelTitle.textContent =
            this.translate(
                'waves.doppler.controls',
                'التحكم في التجربة'
            )


        const panelSubtitle =
            document.createElement('div')

        panelSubtitle.className =
            'wave-doppler-panel-subtitle'

        panelSubtitle.textContent =
            this.translate(
                'waves.doppler.parameters',
                'PARAMETERS'
            )


        panelHeader.appendChild(
            panelTitle
        )

        panelHeader.appendChild(
            panelSubtitle
        )


        /* =====================================================
           BASIC DATA
           ===================================================== */

        const dataGrid =
            document.createElement('div')

        dataGrid.className =
            'wave-doppler-data'


        this.elements.sourceSpeed =
            this.createDataBox(
                'waves.doppler.sourceSpeed',
                'سرعة المصدر',
                '0.00'
            )

        this.elements.frequency =
            this.createDataBox(
                'waves.doppler.frequency',
                'تردد المصدر',
                '0.00'
            )

        this.elements.waveSpeed =
            this.createDataBox(
                'waves.doppler.waveSpeed',
                'سرعة الموجة',
                '0.00'
            )

        this.elements.wavelength =
            this.createDataBox(
                'waves.doppler.wavelength',
                'الطول الموجي',
                '0.00'
            )

        this.elements.waveCount =
            this.createDataBox(
                'waves.doppler.waveCount',
                'الجبهات الموجية',
                '0'
            )


        dataGrid.appendChild(
            this.elements.sourceSpeed.box
        )

        dataGrid.appendChild(
            this.elements.frequency.box
        )

        dataGrid.appendChild(
            this.elements.waveSpeed.box
        )

        dataGrid.appendChild(
            this.elements.wavelength.box
        )

        dataGrid.appendChild(
            this.elements.waveCount.box
        )


        /* =====================================================
           DOPPLER RESULTS
           ===================================================== */

        const resultsTitle =
            document.createElement('div')

        resultsTitle.className =
            'wave-doppler-section-title'

        resultsTitle.textContent =
            this.translate(
                'waves.doppler.results',
                'النتيجة المرصودة'
            )


        const comparison =
            document.createElement('div')

        comparison.className =
            'wave-doppler-comparison'


        this.elements.approaching =
            this.createComparisonBox(
                'approaching',
                'waves.doppler.approaching',
                'أمام المصدر'
            )


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
           SLIDERS
           ===================================================== */

        const controlsTitle =
            document.createElement('div')

        controlsTitle.className =
            'wave-doppler-section-title'

        controlsTitle.textContent =
            this.translate(
                'waves.doppler.adjust',
                'تعديل المعلمات'
            )


        const controls =
            document.createElement('div')

        controls.className =
            'wave-doppler-controls'


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
            document.createElement('div')

        actions.className =
            'wave-doppler-actions'


        const playButton =
            document.createElement('button')

        playButton.type =
            'button'

        playButton.className =
            'wave-doppler-action primary'

        playButton.dataset.action =
            'play'

        playButton.dataset.i18n =
            'waves.doppler.play'

        playButton.textContent =
            this.translate(
                'waves.doppler.play',
                'تشغيل'
            )


        const pauseButton =
            document.createElement('button')

        pauseButton.type =
            'button'

        pauseButton.className =
            'wave-doppler-action'

        pauseButton.dataset.action =
            'pause'

        pauseButton.dataset.i18n =
            'waves.doppler.pause'

        pauseButton.textContent =
            this.translate(
                'waves.doppler.pause',
                'إيقاف مؤقت'
            )


        const resetButton =
            document.createElement('button')

        resetButton.type =
            'button'

        resetButton.className =
            'wave-doppler-action'

        resetButton.dataset.action =
            'reset'

        resetButton.dataset.i18n =
            'waves.doppler.reset'

        resetButton.textContent =
            this.translate(
                'waves.doppler.reset',
                'إعادة'
            )


        this.elements.playButton =
            playButton

        this.elements.pauseButton =
            pauseButton

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
           EXPLANATION
           ===================================================== */

        const note =
            document.createElement('div')

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
           ASSEMBLE
           ===================================================== */

        panel.appendChild(
            panelHeader
        )

        panel.appendChild(
            dataGrid
        )

        panel.appendChild(
            resultsTitle
        )

        panel.appendChild(
            comparison
        )

        panel.appendChild(
            controlsTitle
        )

        panel.appendChild(
            controls
        )

        panel.appendChild(
            actions
        )

        panel.appendChild(
            note
        )


        this.root.appendChild(
            header
        )

        this.root.appendChild(
            hud
        )

        this.root.appendChild(
            panel
        )


        /* =====================================================
           ADD TO DOM
           ===================================================== */

        this.parent.appendChild(
            this.container
        )

    }


    /* =========================================================
       DATA BOX
       ========================================================= */

    createDataBox(
        key,
        fallbackLabel,
        initialValue
    ) {

        const box =
            document.createElement('div')

        box.className =
            'wave-doppler-data-box'


        const label =
            document.createElement('span')

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
            document.createElement('strong')

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
            box,
            label,
            value
        }

    }


    /* =========================================================
       COMPARISON BOX
       ========================================================= */

    createComparisonBox(
        type,
        key,
        fallback
    ) {

        const box =
            document.createElement('div')

        box.className =
            `wave-doppler-comparison-box ${type}`


        const header =
            document.createElement('div')

        header.className =
            'wave-doppler-comparison-header'


        const title =
            document.createElement('span')

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


        const frequencyRow =
            this.createComparisonRow(
                'waves.doppler.observedFrequency',
                'التردد المرصود'
            )


        const wavelengthRow =
            this.createComparisonRow(
                'waves.doppler.observedWavelength',
                'الطول الموجي'
            )


        const ratioRow =
            this.createComparisonRow(
                'waves.doppler.relativeChange',
                'التغير النسبي'
            )


        box.appendChild(
            header
        )

        box.appendChild(
            frequencyRow.row
        )

        box.appendChild(
            wavelengthRow.row
        )

        box.appendChild(
            ratioRow.row
        )


        return {

            box,

            title,

            frequency:
                frequencyRow.value,

            wavelength:
                wavelengthRow.value,

            ratio:
                ratioRow.value

        }

    }


    /* =========================================================
       COMPARISON ROW
       ========================================================= */

    createComparisonRow(
        key,
        fallback
    ) {

        const row =
            document.createElement('div')

        row.className =
            'wave-doppler-comparison-row'


        const label =
            document.createElement('span')

        label.dataset.i18n =
            key

        label.textContent =
            this.translate(
                key,
                fallback
            )


        const value =
            document.createElement('strong')

        value.textContent =
            '0.00'


        row.appendChild(
            label
        )

        row.appendChild(
            value
        )


        return {
            row,
            label,
            value
        }

    }


    /* =========================================================
       SLIDER
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
            document.createElement('div')

        row.className =
            'wave-doppler-control-row'


        const header =
            document.createElement('div')

        header.className =
            'wave-doppler-control-header'


        const label =
            document.createElement('span')

        label.dataset.i18n =
            key

        label.textContent =
            this.translate(
                key,
                fallbackLabel
            )


        const valueDisplay =
            document.createElement('strong')

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


        const input =
            document.createElement('input')

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
            row,
            input,
            value:
                valueDisplay
        }

    }


    /* =========================================================
       EVENTS
       ========================================================= */

    bindEvents() {

        if (
            !this.container
        ) {
            return
        }


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


                switch (
                    actionElement.dataset.action
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


        this.elements.sourceSpeedSlider?.addEventListener(
            'input',
            event => {

                this.experiment.setSourceSpeed(
                    Number(event.target.value)
                )

                this.updateValues()

            }
        )


        this.elements.frequencySlider?.addEventListener(
            'input',
            event => {

                this.experiment.setFrequency(
                    Number(event.target.value)
                )

                this.updateValues()

            }
        )


        this.elements.waveSpeedSlider?.addEventListener(
            'input',
            event => {

                this.experiment.setWaveSpeed(
                    Number(event.target.value)
                )

                this.updateValues()

            }
        )


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


        if (
            this.scene
        ) {

            this.experiment.addToScene(
                this.scene
            )

        }


        this.container.classList.add(
            'is-visible'
        )


        this.experiment.start()

        this.updateStatus(
            'running'
        )

        this.updateActionState()

        this.updateValues()

    }


    show() {

        this.enter()

    }


    hide() {

        this.container?.classList.remove(
            'is-visible'
        )

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
            this.destroyed ||
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


        this.elements.sourceSpeed.value.textContent =
            this.formatNumber(
                data.sourceSpeed,
                2
            )


        this.elements.frequency.value.textContent =
            this.formatNumber(
                data.frequency,
                2
            )


        this.elements.waveSpeed.value.textContent =
            this.formatNumber(
                data.waveSpeed,
                2
            )


        this.elements.wavelength.value.textContent =
            this.formatNumber(
                data.wavelength,
                2
            )


        this.elements.waveCount.value.textContent =
            String(
                data.waveCount
            )


        this.elements.sourceSpeedSliderValue.textContent =
            this.formatNumber(
                data.sourceSpeed,
                2
            )


        this.elements.frequencySliderValue.textContent =
            this.formatNumber(
                data.frequency,
                2
            )


        this.elements.waveSpeedSliderValue.textContent =
            this.formatNumber(
                data.waveSpeed,
                2
            )


        /* =====================================================
           APPROACHING
           ===================================================== */

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


        this.elements.approaching.ratio.textContent =
            this.formatPercentage(
                this.calculatePercentage(
                    data.approachingFrequency,
                    data.frequency
                )
            )


        /* =====================================================
           RECEDING
           ===================================================== */

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


        this.elements.receding.ratio.textContent =
            this.formatPercentage(
                this.calculatePercentage(
                    data.recedingFrequency,
                    data.frequency
                )
            )

    }


    /* =========================================================
       STATUS
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


        if (
            state === 'running'
        ) {

            key =
                'waves.doppler.running'

            fallback =
                'التجربة تعمل'

        }
        else if (
            state === 'paused'
        ) {

            key =
                'waves.doppler.paused'

            fallback =
                'متوقفة مؤقتًا'

        }


        this.elements.statusText.dataset.i18n =
            key

        this.elements.statusText.textContent =
            this.translate(
                key,
                fallback
            )


        this.elements.status.dataset.state =
            state

    }


    /* =========================================================
       ACTION STATE
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
       LANGUAGE
       ========================================================= */

    updateLanguage() {

        if (
            !this.container
        ) {
            return
        }


        const language =
            typeof getLanguage === 'function'
                ? getLanguage()
                : 'ar'


        this.container.dir =
            language === 'ar'
                ? 'rtl'
                : 'ltr'


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


                node.textContent =
                    this.translate(
                        key,
                        node.textContent
                    )

            }
        )


        this.updateValues()


        if (
            this.elements.status?.dataset.state
        ) {

            this.updateStatus(
                this.elements.status.dataset.state
            )

        }

    }


    /* =========================================================
       FORMAT
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
       SCENE
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
       PARENT
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
            this.container.parentNode !== parent
        ) {

            parent.appendChild(
                this.container
            )

        }

    }


    /* =========================================================
       GETTERS
       ========================================================= */

    getExperiment() {

        return this.experiment

    }


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


        if (
            this.experiment
        ) {

            this.experiment.destroy()

        }


        if (
            this.container?.parentNode
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