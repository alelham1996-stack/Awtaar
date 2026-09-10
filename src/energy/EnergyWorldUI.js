import './EnergyConversion.css'
import './EnergyCircuit.css'

import EnergyConversionExperiment
    from './EnergyConversionExperiment.js'

import EnergyCircuitExperiment
    from './EnergyCircuitExperiment.js'

import {
    t,
    getLanguage
} from '../locales/i18n.js'


/* =========================================================
   AWTAAR — ENERGY WORLD UI
   =========================================================

   Two experiments only:

   1. Energy Conversion
   2. Energy Circuit

   The circuit experiment is intentionally guided and
   sequential. It does not use a control panel.
   ========================================================= */

export default class EnergyWorldUI {

    constructor(physicsWorldUI, scene = null) {

        this.physicsWorldUI = physicsWorldUI
        this.scene = scene

        this.isTransitioning = false
        this.isExperimentOpen = false
        this.activeExperiment = null


        /* =====================================================
           WORLD
           ===================================================== */

        this.container = null
        this.header = null
        this.title = null
        this.subtitle = null
        this.hint = null
        this.experiments = null
        this.backButton = null


        /* =====================================================
           CONVERSION UI
           ===================================================== */

        this.experimentUI = null
        this.experimentTitle = null
        this.experimentDescription = null

        this.statusText = null
        this.statusDot = null

        this.inputValue = null
        this.efficiencyValue = null
        this.outputValue = null

        this.speedSlider = null
        this.speedValue = null

        this.pauseButton = null
        this.resetButton = null
        this.exitButton = null


        /* =====================================================
           CIRCUIT UI
           ===================================================== */

        this.circuitUI = null

        this.circuitStatus = null
        this.circuitStatusDot = null

        this.circuitStepCount = null
        this.circuitStepTitle = null
        this.circuitStepDescription = null

        this.circuitActionButton = null
        this.circuitProgress = null

        this.circuitResetButton = null
        this.circuitExitButton = null


        /* =====================================================
           EXPERIMENTS
           
           IMPORTANT:
           Do NOT pass this UI object as "parent".
           The experiment must later be attached to the
           actual THREE.Scene.
           ===================================================== */

        this.energyConversionExperiment =
            new EnergyConversionExperiment({
                scene: null,
                parent: null
            })


        this.energyCircuitExperiment =
            new EnergyCircuitExperiment({
                scene: null,
                parent: null
            })


        /* =====================================================
           BUILD UI
           ===================================================== */

        this.createUI()

        this.createExperimentUI()

        this.createCircuitUI()

        this.updateLanguage()


        /* =====================================================
           RESIZE
           ===================================================== */

        this.handleResize =
            () => this.updateResponsiveLayout()

        window.addEventListener(
            'resize',
            this.handleResize
        )

        this.updateResponsiveLayout()
    }


    /* =========================================================
       LOCALIZED TEXT
       ========================================================= */

    tx(key, arabic, english) {

        const translated = t(key)

        if (
            translated &&
            translated !== key
        ) {
            return translated
        }

        return getLanguage() === 'ar'
            ? arabic
            : english
    }


    /* =========================================================
       WORLD UI
       ========================================================= */

    createUI() {

        this.container =
            document.createElement('section')

        this.container.id =
            'awtaar-energy-world'

        this.container.className =
            'awtaar-energy-world'

        this.container.dir = 'ltr'


        /* HEADER */

        this.header =
            document.createElement('div')

        this.header.className =
            'energy-world-header'


        /* TITLE */

        this.title =
            document.createElement('h2')

        this.title.className =
            'energy-world-title'


        /* DESCRIPTION */

        this.subtitle =
            document.createElement('p')

        this.subtitle.className =
            'energy-world-description'


        /* HINT */

        this.hint =
            document.createElement('p')

        this.hint.className =
            'energy-world-hint'


        this.header.appendChild(
            this.title
        )

        this.header.appendChild(
            this.subtitle
        )

        this.header.appendChild(
            this.hint
        )


        /* EXPERIMENT CARDS */

        this.experiments =
            document.createElement('div')

        this.experiments.className =
            'energy-world-experiments'


        /* =====================================================
           ENERGY CONVERSION
           ===================================================== */

        const conversionCard =
            this.createExperimentCard(
                'conversion',
                '⚡'
            )


        conversionCard.addEventListener(
            'click',
            event => {

                event.preventDefault()
                event.stopPropagation()

                this.openEnergyConversion()
            }
        )


        this.experiments.appendChild(
            conversionCard
        )


        /* =====================================================
           ENERGY CIRCUIT
           ===================================================== */

        const circuitCard =
            this.createExperimentCard(
                'circuit',
                '◉'
            )


        circuitCard.addEventListener(
            'click',
            event => {

                event.preventDefault()
                event.stopPropagation()

                this.openEnergyCircuit()
            }
        )


        this.experiments.appendChild(
            circuitCard
        )


        /* =====================================================
           BACK BUTTON
           ===================================================== */

        this.backButton =
            document.createElement('button')

        this.backButton.type =
            'button'

        this.backButton.className =
            'energy-world-back'


        this.backButton.addEventListener(
            'click',
            event => {

                event.preventDefault()
                event.stopPropagation()

                this.returnToPhysicsWorld()
            }
        )


        /* APPEND */

        this.container.appendChild(
            this.header
        )

        this.container.appendChild(
            this.experiments
        )

        this.container.appendChild(
            this.backButton
        )


        document.body.appendChild(
            this.container
        )


        /* =====================================================
           START HIDDEN
           ===================================================== */

        Object.assign(
            this.container.style,
            {
                position: 'fixed',
                inset: '0',
                zIndex: '20',
                opacity: '0',
                visibility: 'hidden',
                pointerEvents: 'none'
            }
        )
    }


    createExperimentCard(
        key,
        symbol
    ) {

        const card =
            document.createElement('button')

        card.type =
            'button'

        card.className =
            'energy-experiment-card'

        card.dataset.experiment =
            key


        const icon =
            document.createElement('span')

        icon.className =
            'energy-experiment-icon'

        icon.textContent =
            symbol


        const content =
            document.createElement('span')

        content.className =
            'energy-experiment-content'


        const title =
            document.createElement('span')

        title.className =
            'energy-experiment-title'


        const description =
            document.createElement('span')

        description.className =
            'energy-experiment-description'


        content.appendChild(
            title
        )

        content.appendChild(
            description
        )


        card.appendChild(
            icon
        )

        card.appendChild(
            content
        )


        return card
    }


    /* =========================================================
       ENERGY CONVERSION UI
       ========================================================= */

    createExperimentUI() {

        this.experimentUI =
            document.createElement('section')

        this.experimentUI.className =
            'energy-experiment-ui'

        this.experimentUI.dir =
            'ltr'


        Object.assign(
            this.experimentUI.style,
            {
                position: 'fixed',
                inset: '0',
                zIndex: '30',
                background: 'transparent',
                pointerEvents: 'none',
                display: 'none',
                opacity: '0',
                visibility: 'hidden',
                transition: 'opacity 350ms ease'
            }
        )


        /* TOP BAR */

        const topBar =
            document.createElement('div')

        topBar.className =
            'energy-experiment-topbar'


        this.experimentTitle =
            document.createElement('h1')

        this.experimentTitle.className =
            'energy-ui-title'


        this.experimentDescription =
            document.createElement('p')

        this.experimentDescription.className =
            'energy-ui-description'


        const titleBlock =
            document.createElement('div')

        titleBlock.className =
            'energy-experiment-title-block'


        titleBlock.appendChild(
            this.experimentTitle
        )

        titleBlock.appendChild(
            this.experimentDescription
        )


        /* STATUS */

        const status =
            document.createElement('div')

        status.className =
            'energy-experiment-status'


        this.statusDot =
            document.createElement('span')

        this.statusDot.className =
            'energy-status-dot'


        this.statusText =
            document.createElement('span')

        this.statusText.className =
            'energy-status-text'


        status.appendChild(
            this.statusDot
        )

        status.appendChild(
            this.statusText
        )


        topBar.appendChild(
            titleBlock
        )

        topBar.appendChild(
            status
        )


        /* =====================================================
           METRICS
           ===================================================== */

        const infoPanel =
            document.createElement('aside')

        infoPanel.className =
            'energy-experiment-info'


        const inputMetric =
            this.createMetric(
                '⚡',
                'input'
            )


        const efficiencyMetric =
            this.createMetric(
                '◈',
                'efficiency'
            )


        const outputMetric =
            this.createMetric(
                '✦',
                'output'
            )


        this.inputValue =
            inputMetric.value

        this.efficiencyValue =
            efficiencyMetric.value

        this.outputValue =
            outputMetric.value


        infoPanel.appendChild(
            inputMetric.element
        )

        infoPanel.appendChild(
            efficiencyMetric.element
        )

        infoPanel.appendChild(
            outputMetric.element
        )


        /* =====================================================
           CONTROLS
           ===================================================== */

        const controls =
            document.createElement('div')

        controls.className =
            'energy-experiment-controls'


        const speedControl =
            document.createElement('div')

        speedControl.className =
            'energy-control'


        const speedHeader =
            document.createElement('div')

        speedHeader.className =
            'energy-control-header'


        const speedLabel =
            document.createElement('span')

        speedLabel.className =
            'energy-control-label'

        speedLabel.dataset.translation =
            'speed'


        this.speedValue =
            document.createElement('span')

        this.speedValue.className =
            'energy-control-value'

        this.speedValue.textContent =
            '1.0×'


        speedHeader.appendChild(
            speedLabel
        )

        speedHeader.appendChild(
            this.speedValue
        )


        this.speedSlider =
            document.createElement('input')

        this.speedSlider.type =
            'range'

        this.speedSlider.className =
            'energy-slider'

        this.speedSlider.min =
            '0.1'

        this.speedSlider.max =
            '3'

        this.speedSlider.step =
            '0.1'

        this.speedSlider.value =
            '1'


        this.speedSlider.addEventListener(
            'input',
            () => {

                const value =
                    Number(
                        this.speedSlider.value
                    )


                this.speedValue.textContent =
                    `${value.toFixed(1)}×`


                if (
                    this.energyConversionExperiment &&
                    typeof this.energyConversionExperiment.setConversionSpeed ===
                    'function'
                ) {

                    this.energyConversionExperiment
                        .setConversionSpeed(value)
                }
            }
        )


        speedControl.appendChild(
            speedHeader
        )

        speedControl.appendChild(
            this.speedSlider
        )


        controls.appendChild(
            speedControl
        )


        /* =====================================================
           BUTTONS
           ===================================================== */

        const buttons =
            document.createElement('div')

        buttons.className =
            'energy-experiment-buttons'


        this.pauseButton =
            this.createControlButton(
                'pause',
                'primary'
            )


        this.resetButton =
            this.createControlButton(
                'reset'
            )


        this.exitButton =
            this.createControlButton(
                'exit',
                'exit'
            )


        /* PAUSE */

        this.pauseButton.addEventListener(
            'click',
            event => {

                event.preventDefault()
                event.stopPropagation()

                this.togglePause()
            }
        )


        /* RESET */

        this.resetButton.addEventListener(
            'click',
            event => {

                event.preventDefault()
                event.stopPropagation()

                this.resetExperiment()
            }
        )


        /* EXIT */

        this.exitButton.addEventListener(
            'click',
            event => {

                event.preventDefault()
                event.stopPropagation()

                this.closeExperiment()
            }
        )


        buttons.appendChild(
            this.pauseButton
        )

        buttons.appendChild(
            this.resetButton
        )

        buttons.appendChild(
            this.exitButton
        )


        controls.appendChild(
            buttons
        )


        /* APPEND */

        this.experimentUI.appendChild(
            topBar
        )

        this.experimentUI.appendChild(
            infoPanel
        )

        this.experimentUI.appendChild(
            controls
        )


        document.body.appendChild(
            this.experimentUI
        )
    }


    createMetric(
        symbol,
        key
    ) {

        const element =
            document.createElement('div')

        element.className =
            'energy-metric'


        const icon =
            document.createElement('span')

        icon.className =
            'energy-metric-icon'

        icon.textContent =
            symbol


        const body =
            document.createElement('div')

        body.className =
            'energy-metric-body'


        const label =
            document.createElement('span')

        label.className =
            'energy-metric-label'

        label.dataset.metric =
            key


        const value =
            document.createElement('strong')

        value.className =
            'energy-metric-value'

        value.textContent =
            '0'


        body.appendChild(
            label
        )

        body.appendChild(
            value
        )


        element.appendChild(
            icon
        )

        element.appendChild(
            body
        )


        return {
            element,
            value
        }
    }


    createControlButton(
        key,
        extraClass = ''
    ) {

        const button =
            document.createElement('button')

        button.type =
            'button'

        button.className =
            `energy-control-button ${extraClass}`.trim()

        button.dataset.control =
            key

        button.setAttribute(
            'aria-label',
            key
        )


        return button
    }


    /* =========================================================
       CIRCUIT — GUIDED UI
       ========================================================= */

    createCircuitUI() {

        this.circuitUI =
            document.createElement('section')

        this.circuitUI.className =
            'awtaar-energy-circuit'

        this.circuitUI.dir =
            'ltr'


        /* =====================================================
           CRITICAL:
           Circuit UI MUST start completely hidden.
           ===================================================== */

        Object.assign(
            this.circuitUI.style,
            {
                position: 'fixed',
                inset: '0',
                zIndex: '1200',
                display: 'none',
                opacity: '0',
                visibility: 'hidden',
                pointerEvents: 'none',
                transition: 'opacity 350ms ease'
            }
        )


        /* HEADER */

        const header =
            document.createElement('div')

        header.className =
            'energy-circuit-header'


        const heading =
            document.createElement('div')

        heading.className =
            'energy-circuit-heading'


        const eyebrow =
            document.createElement('p')

        eyebrow.className =
            'energy-circuit-eyebrow'

        eyebrow.textContent =
            'ENERGY / CIRCUIT'


        this.circuitTitle =
            document.createElement('h1')

        this.circuitTitle.className =
            'energy-circuit-title'


        this.circuitDescription =
            document.createElement('p')

        this.circuitDescription.className =
            'energy-circuit-description'


        heading.appendChild(
            eyebrow
        )

        heading.appendChild(
            this.circuitTitle
        )

        heading.appendChild(
            this.circuitDescription
        )


        /* STATUS */

        const status =
            document.createElement('div')

        status.className =
            'energy-circuit-status'


        this.circuitStatusDot =
            document.createElement('span')

        this.circuitStatusDot.className =
            'energy-circuit-status-dot'


        this.circuitStatus =
            document.createElement('span')

        this.circuitStatus.className =
            'energy-circuit-status-text'


        status.appendChild(
            this.circuitStatusDot
        )

        status.appendChild(
            this.circuitStatus
        )


        header.appendChild(
            heading
        )

        header.appendChild(
            status
        )


        /* =====================================================
           GUIDE
           ===================================================== */

        const guide =
            document.createElement('div')

        guide.className =
            'energy-circuit-guide'

        this.circuitGuide =
            guide


        /* PROGRESS */

        this.circuitProgress =
            document.createElement('div')

        this.circuitProgress.className =
            'energy-circuit-progress'


        for (
            let i = 0;
            i < 8;
            i += 1
        ) {

            const dot =
                document.createElement('span')

            dot.className =
                'energy-circuit-progress-dot'

            dot.dataset.step =
                String(i)


            this.circuitProgress.appendChild(
                dot
            )
        }


        /* STEP COUNT */

        this.circuitStepCount =
            document.createElement('p')

        this.circuitStepCount.className =
            'energy-circuit-step-count'


        /* STEP TITLE */

        this.circuitStepTitle =
            document.createElement('h2')

        this.circuitStepTitle.className =
            'energy-circuit-step-title'


        /* STEP DESCRIPTION */

        this.circuitStepDescription =
            document.createElement('p')

        this.circuitStepDescription.className =
            'energy-circuit-step-description'


        /* MAIN ACTION */

        this.circuitActionButton =
            document.createElement('button')

        this.circuitActionButton.type =
            'button'

        this.circuitActionButton.className =
            'energy-circuit-action'


        /* RESET */

        this.circuitResetButton =
            document.createElement('button')

        this.circuitResetButton.type =
            'button'

        this.circuitResetButton.className =
            'energy-circuit-reset'


        /* EXIT */

        this.circuitExitButton =
            document.createElement('button')

        this.circuitExitButton.type =
            'button'

        this.circuitExitButton.className =
            'energy-circuit-exit'


        /* SECONDARY */

        const secondary =
            document.createElement('div')

        secondary.className =
            'energy-circuit-secondary'


        secondary.appendChild(
            this.circuitResetButton
        )

        secondary.appendChild(
            this.circuitExitButton
        )


        /* GUIDE CONTENT */

        guide.appendChild(
            this.circuitProgress
        )

        guide.appendChild(
            this.circuitStepCount
        )

        guide.appendChild(
            this.circuitStepTitle
        )

        guide.appendChild(
            this.circuitStepDescription
        )

        guide.appendChild(
            this.circuitActionButton
        )

        guide.appendChild(
            secondary
        )


        /* =====================================================
           ACTION
           ===================================================== */

        this.circuitActionButton.addEventListener(
            'click',
            event => {

                event.preventDefault()
                event.stopPropagation()


                if (
                    !this.energyCircuitExperiment
                ) {
                    return
                }


                const data =
                    this.energyCircuitExperiment.advance()


                this.renderCircuitStep(
                    data
                )
            }
        )


        /* =====================================================
           RESET
           ===================================================== */

        this.circuitResetButton.addEventListener(
            'click',
            event => {

                event.preventDefault()
                event.stopPropagation()


                if (
                    !this.energyCircuitExperiment
                ) {
                    return
                }


                const data =
                    this.energyCircuitExperiment.reset()


                this.renderCircuitStep(
                    data
                )
            }
        )


        /* =====================================================
           EXIT
           ===================================================== */

        this.circuitExitButton.addEventListener(
            'click',
            event => {

                event.preventDefault()
                event.stopPropagation()

                this.closeEnergyCircuit()
            }
        )


        this.circuitUI.appendChild(
            header
        )

        this.circuitUI.appendChild(
            guide
        )


        document.body.appendChild(
            this.circuitUI
        )
    }


    /* =========================================================
       CIRCUIT STEP TEXT
       ========================================================= */

    getCircuitStepText(step) {

        const ar = {

            0: {
                status: 'الدائرة مفتوحة',
                title: 'هل سيضيء المصباح؟',
                description:
                    'هناك بطارية ومصباح وأسلاك، لكن المسار غير مكتمل. ماذا يحدث عندما نغلق المفتاح؟',
                action:
                    'إغلاق المفتاح'
            },

            1: {
                status: 'الدائرة مغلقة',
                title: 'اكتمل المسار',
                description:
                    'أصبح المسار متصلًا من البطارية إلى المصباح ثم عائدًا إلى البطارية، لذلك يضيء المصباح.',
                action:
                    'فتح المفتاح'
            },

            2: {
                status: 'التيار منقطع',
                title: 'ماذا حدث؟',
                description:
                    'عندما فتحنا المفتاح أصبح المسار غير مكتمل، فتوقف التيار وانطفأ المصباح.',
                action:
                    'تجربة دائرة التوالي'
            },

            3: {
                status: 'دائرة التوالي',
                title: 'مسار واحد فقط',
                description:
                    'في دائرة التوالي يمر التيار عبر المصباح الأول ثم الثاني في المسار نفسه.',
                action:
                    'افتح الدائرة'
            },

            4: {
                status: 'المسار مقطوع',
                title: 'ماذا لو انقطع المسار؟',
                description:
                    'لأن المصباحين يشتركان في مسار واحد، فإن فتح الدائرة يوقف التيار عن كليهما.',
                action:
                    'تجربة دائرة التوازي'
            },

            5: {
                status: 'دائرة التوازي',
                title: 'أكثر من طريق',
                description:
                    'هنا ينقسم المسار إلى فرعين، ولكل مصباح طريقه الخاص لمرور التيار.',
                action:
                    'افتح الفرع الأول'
            },

            6: {
                status: 'فرع واحد مفتوح',
                title: 'هل ينطفئ المصباحان؟',
                description:
                    'لا. ينطفئ المصباح في الفرع المفتوح فقط، بينما يستمر التيار في الفرع الآخر.',
                action:
                    'إعادة التجربة'
            },

            7: {
                status: 'اكتملت التجربة',
                title: 'اكتشفت سر الدائرة',
                description:
                    'الدائرة المغلقة تحتاج إلى مسار كامل. وفي التوالي يؤدي انقطاع المسار إلى توقف الجميع، بينما يسمح التوازي ببقاء الفروع الأخرى عاملة.',
                action:
                    'إعادة التجربة'
            }
        }


        const en = {

            0: {
                status: 'Open Circuit',
                title: 'Will the lamp light?',
                description:
                    'There is a battery, a lamp, and wires, but the path is incomplete. What happens when we close the switch?',
                action:
                    'Close the Switch'
            },

            1: {
                status: 'Closed Circuit',
                title: 'The path is complete',
                description:
                    'The path now connects the battery to the lamp and back to the battery, so the lamp lights.',
                action:
                    'Open the Switch'
            },

            2: {
                status: 'Current Stopped',
                title: 'What happened?',
                description:
                    'When we opened the switch, the path became incomplete, so the current stopped and the lamp went out.',
                action:
                    'Try a Series Circuit'
            },

            3: {
                status: 'Series Circuit',
                title: 'Only one path',
                description:
                    'In a series circuit, current passes through the first lamp and then the second along the same path.',
                action:
                    'Break the Circuit'
            },

            4: {
                status: 'Path Broken',
                title: 'What if the path breaks?',
                description:
                    'Because both lamps share one path, breaking the circuit stops current through both of them.',
                action:
                    'Try a Parallel Circuit'
            },

            5: {
                status: 'Parallel Circuit',
                title: 'More than one path',
                description:
                    'Here the path splits into two branches, giving each lamp its own path for current.',
                action:
                    'Open the First Branch'
            },

            6: {
                status: 'One Branch Open',
                title: 'Do both lamps go out?',
                description:
                    'No. Only the lamp on the open branch goes out, while current continues through the other branch.',
                action:
                    'Restart Experiment'
            },

            7: {
                status: 'Experiment Complete',
                title: 'You discovered the secret',
                description:
                    'A closed circuit needs a complete path. In series, breaking the path stops everything; in parallel, the other branches can keep working.',
                action:
                    'Restart Experiment'
            }
        }


        return (
            getLanguage() === 'ar'
                ? ar
                : en
        )[step] || ar[0]
    }


    /* =========================================================
       RENDER CIRCUIT STEP
       ========================================================= */

    renderCircuitStep(data = null) {

        if (
            !this.circuitUI ||
            !this.energyCircuitExperiment
        ) {
            return
        }


        const state =
            data ||
            this.energyCircuitExperiment.getStepData()


        const text =
            this.getCircuitStepText(
                state.step
            )


        const step =
            state.step


        /* STATUS */

        this.circuitStatus.textContent =
            text.status


        /* STEP COUNT */

        this.circuitStepCount.textContent =
            getLanguage() === 'ar'
                ? `المرحلة ${step + 1} من 8`
                : `Step ${step + 1} of 8`


        /* CONTENT */

        this.circuitStepTitle.textContent =
            text.title

        this.circuitStepDescription.textContent =
            text.description

        this.circuitActionButton.textContent =
            text.action


        /* DATASET */

        this.circuitUI.dataset.step =
            String(step)

        this.circuitUI.dataset.type =
            state.type


        /* STATUS CLASSES */

        this.circuitStatus.className =
            'energy-circuit-status-text'


        const statusElement =
            this.circuitUI.querySelector(
                '.energy-circuit-status'
            )


        if (statusElement) {

            statusElement.classList.toggle(
                'is-active',
                step === 1 ||
                step === 3 ||
                step === 5 ||
                step === 6
            )


            statusElement.classList.toggle(
                'is-complete',
                step === 7
            )
        }


        /* GUIDE STATE */

        this.circuitGuide.classList.toggle(
            'is-complete',
            step === 7
        )


        this.circuitGuide.classList.toggle(
            'is-series',
            state.type === 'series'
        )


        this.circuitGuide.classList.toggle(
            'is-parallel',
            state.type === 'parallel'
        )


        /* PROGRESS */

        const dots =
            this.circuitProgress.querySelectorAll(
                '.energy-circuit-progress-dot'
            )


        dots.forEach(
            dot => {

                const dotStep =
                    Number(
                        dot.dataset.step
                    )


                dot.classList.toggle(
                    'is-current',
                    dotStep === step
                )


                dot.classList.toggle(
                    'is-done',
                    dotStep < step
                )
            }
        )


        /* RESET */

        this.circuitResetButton.textContent =
            getLanguage() === 'ar'
                ? 'إعادة من البداية'
                : 'Restart from Beginning'


        /* EXIT */

        this.circuitExitButton.textContent =
            getLanguage() === 'ar'
                ? 'الخروج من التجربة'
                : 'Exit Experiment'
    }


    /* =========================================================
       LANGUAGE
       ========================================================= */

    updateLanguage() {

        const language =
            getLanguage() === 'en'
                ? 'en'
                : 'ar'


        const direction =
            language === 'ar'
                ? 'rtl'
                : 'ltr'


        document.documentElement.lang =
            language

        document.documentElement.dir =
            direction


        if (this.container) {
            this.container.dir =
                direction
        }


        if (this.experimentUI) {
            this.experimentUI.dir =
                direction
        }


        if (this.circuitUI) {
            this.circuitUI.dir =
                direction
        }


        /* =====================================================
           WORLD
           ===================================================== */

        if (this.title) {

            this.title.textContent =
                t('energyWorld.title')
        }


        if (this.subtitle) {

            this.subtitle.textContent =
                t('energyWorld.description')
        }


        if (this.hint) {

            this.hint.textContent =
                t('energyWorld.hint')
        }


        /* =====================================================
           CONVERSION CARD
           ===================================================== */

        const conversionCard =
            this.experiments?.querySelector(
                '[data-experiment="conversion"]'
            )


        if (conversionCard) {

            const cardTitle =
                conversionCard.querySelector(
                    '.energy-experiment-title'
                )


            const cardDescription =
                conversionCard.querySelector(
                    '.energy-experiment-description'
                )


            if (cardTitle) {

                cardTitle.textContent =
                    t(
                        'energyWorld.conversion.title'
                    )
            }


            if (cardDescription) {

                cardDescription.textContent =
                    t(
                        'energyWorld.conversion.description'
                    )
            }
        }


        /* =====================================================
           CIRCUIT CARD
           ===================================================== */

        const circuitCard =
            this.experiments?.querySelector(
                '[data-experiment="circuit"]'
            )


        if (circuitCard) {

            const cardTitle =
                circuitCard.querySelector(
                    '.energy-experiment-title'
                )


            const cardDescription =
                circuitCard.querySelector(
                    '.energy-experiment-description'
                )


            if (cardTitle) {

                cardTitle.textContent =
                    this.tx(
                        'energyWorld.circuit.title',
                        'سرّ الدائرة المغلقة',
                        'The Secret of the Closed Circuit'
                    )
            }


            if (cardDescription) {

                cardDescription.textContent =
                    this.tx(
                        'energyWorld.circuit.description',
                        'اكتشف لماذا يضيء المصباح، وماذا يحدث عندما ينقطع المسار، ولماذا تختلف دائرة التوالي عن التوازي.',
                        'Discover why a lamp lights, what happens when the path breaks, and how series and parallel circuits differ.'
                    )
            }
        }


        /* BACK */

        if (this.backButton) {

            this.backButton.textContent =
                t('energyWorld.back')
        }


        /* =====================================================
           CONVERSION EXPERIMENT
           ===================================================== */

        if (this.experimentTitle) {

            this.experimentTitle.textContent =
                t(
                    'energyWorld.conversion.title'
                )
        }


        if (this.experimentDescription) {

            this.experimentDescription.textContent =
                t(
                    'energyWorld.conversion.description'
                )
        }


        this.experimentUI
            ?.querySelectorAll(
                '.energy-metric-label'
            )
            .forEach(
                label => {

                    const key =
                        label.dataset.metric


                    if (key === 'input') {

                        label.textContent =
                            this.tx(
                                'energyWorld.conversion.inputEnergy',
                                'الطاقة الداخلة',
                                'Input Energy'
                            )
                    }


                    if (key === 'efficiency') {

                        label.textContent =
                            this.tx(
                                'energyWorld.conversion.efficiency',
                                'كفاءة التحويل',
                                'Conversion Efficiency'
                            )
                    }


                    if (key === 'output') {

                        label.textContent =
                            this.tx(
                                'energyWorld.conversion.outputEnergy',
                                'الطاقة الناتجة',
                                'Output Energy'
                            )
                    }
                }
            )


        const speedLabel =
            this.experimentUI
                ?.querySelector(
                    '[data-translation="speed"]'
                )


        if (speedLabel) {

            speedLabel.textContent =
                this.tx(
                    'energyWorld.conversion.speed',
                    'سرعة التحويل',
                    'Conversion Speed'
                )
        }


        if (this.resetButton) {

            this.resetButton.textContent =
                this.tx(
                    'energyWorld.conversion.reset',
                    'إعادة التجربة',
                    'Restart Experiment'
                )
        }


        if (this.exitButton) {

            this.exitButton.textContent =
                this.tx(
                    'energyWorld.conversion.exit',
                    'الخروج من التجربة',
                    'Exit Experiment'
                )
        }


        /* =====================================================
           CIRCUIT EXPERIMENT
           ===================================================== */

        if (this.circuitTitle) {

            this.circuitTitle.textContent =
                this.tx(
                    'energyWorld.circuit.title',
                    'سرّ الدائرة المغلقة',
                    'The Secret of the Closed Circuit'
                )
        }


        if (this.circuitDescription) {

            this.circuitDescription.textContent =
                this.tx(
                    'energyWorld.circuit.description',
                    'اكتشف لماذا يضيء المصباح، وماذا يحدث عندما ينقطع المسار، ولماذا تختلف دائرة التوالي عن التوازي.',
                    'Discover why a lamp lights, what happens when the path breaks, and how series and parallel circuits differ.'
                )
        }


        this.renderCircuitStep()

        this.updateExperimentStatus()
    }


    /* =========================================================
       WORLD VISIBILITY
       ========================================================= */

    show() {

        if (!this.container) {
            return
        }


        this.updateLanguage()


        this.isExperimentOpen =
            false

        this.activeExperiment =
            null

        this.isTransitioning =
            false


        this.container.style.display =
            'flex'

        this.container.style.visibility =
            'visible'

        this.container.style.pointerEvents =
            'auto'


        requestAnimationFrame(
            () => {

                if (this.container) {

                    this.container.style.opacity =
                        '1'
                }
            }
        )
    }


    open() {

        this.show()
    }


    hide() {

        if (!this.container) {
            return
        }


        this.container.style.opacity =
            '0'

        this.container.style.pointerEvents =
            'none'


        setTimeout(
            () => {

                if (
                    this.container &&
                    this.container.style.opacity === '0'
                ) {

                    this.container.style.visibility =
                        'hidden'
                }
            },
            450
        )
    }


    /* =========================================================
       OPEN ENERGY CONVERSION
       ========================================================= */

    openEnergyConversion() {

        if (
            this.isTransitioning ||
            this.isExperimentOpen
        ) {
            return
        }


        if (
            !this.energyConversionExperiment
        ) {
            return
        }


        this.isTransitioning =
            true

        this.isExperimentOpen =
            true

        this.activeExperiment =
            'conversion'


        this.hide()


        setTimeout(
            () => {

                if (
                    !this.energyConversionExperiment
                ) {
                    return
                }


                /* =================================================
                   FIND REAL THREE.JS SCENE
                   ================================================= */

                const activeScene =
                    this.scene ||
                    this.physicsWorldUI?.scene ||
                    null


                if (!activeScene) {

                    console.error(
                        'Awtaar Energy Conversion: no THREE.Scene available.'
                    )


                    this.isExperimentOpen =
                        false

                    this.activeExperiment =
                        null

                    this.isTransitioning =
                        false

                    this.show()

                    return
                }


                this.scene =
                    activeScene


                this.energyConversionExperiment.scene =
                    activeScene


                this.energyConversionExperiment.addToScene(
                    activeScene
                )


                this.energyConversionExperiment.start()


                this.showExperimentUI()


                this.isTransitioning =
                    false

            },
            450
        )
    }


    showExperimentUI() {

        if (!this.experimentUI) {
            return
        }


        this.updateLanguage()

        this.updateExperimentMetrics()


        this.experimentUI.style.display =
            'block'

        this.experimentUI.style.visibility =
            'visible'

        this.experimentUI.style.pointerEvents =
            'auto'


        requestAnimationFrame(
            () => {

                if (this.experimentUI) {

                    this.experimentUI.style.opacity =
                        '1'
                }
            }
        )
    }


    hideExperimentUI() {

        if (!this.experimentUI) {
            return
        }


        this.experimentUI.style.opacity =
            '0'

        this.experimentUI.style.pointerEvents =
            'none'


        setTimeout(
            () => {

                if (
                    this.experimentUI &&
                    this.experimentUI.style.opacity === '0'
                ) {

                    this.experimentUI.style.visibility =
                        'hidden'

                    this.experimentUI.style.display =
                        'none'
                }
            },
            400
        )
    }


    togglePause() {

        const experiment =
            this.energyConversionExperiment


        if (!experiment) {
            return
        }


        if (experiment.paused) {

            if (
                typeof experiment.resume ===
                'function'
            ) {

                experiment.resume()
            }

        } else {

            if (
                typeof experiment.pause ===
                'function'
            ) {

                experiment.pause()
            }
        }


        this.updateExperimentStatus()
    }


    resetExperiment() {

        const experiment =
            this.energyConversionExperiment


        if (!experiment) {
            return
        }


        if (
            typeof experiment.reset ===
            'function'
        ) {

            experiment.reset()
        }


        if (
            typeof experiment.start ===
            'function'
        ) {

            experiment.start()
        }


        this.updateExperimentMetrics()

        this.updateExperimentStatus()
    }


    closeExperiment() {

        if (this.isTransitioning) {
            return
        }


        this.isTransitioning =
            true

        this.isExperimentOpen =
            false

        this.activeExperiment =
            null


        if (
            this.energyConversionExperiment
        ) {

            if (
                typeof this.energyConversionExperiment.stop ===
                'function'
            ) {

                this.energyConversionExperiment.stop()
            }


            if (
                typeof this.energyConversionExperiment.removeFromScene ===
                'function'
            ) {

                this.energyConversionExperiment
                    .removeFromScene()
            }
        }


        this.hideExperimentUI()


        setTimeout(
            () => {

                this.show()

                this.isTransitioning =
                    false
            },
            450
        )
    }


    /* =========================================================
       OPEN ENERGY CIRCUIT
       ========================================================= */

    openEnergyCircuit() {

        if (
            this.isTransitioning ||
            this.isExperimentOpen
        ) {
            return
        }


        if (
            !this.energyCircuitExperiment
        ) {
            return
        }


        this.isTransitioning =
            true

        this.isExperimentOpen =
            true

        this.activeExperiment =
            'circuit'


        /* =====================================================
           HIDE ENERGY WORLD MENU
           ===================================================== */

        this.hide()


        setTimeout(
            () => {

                if (
                    !this.energyCircuitExperiment
                ) {
                    return
                }


                /* =================================================
                   GET THE REAL SCENE
                   ================================================= */

                const activeScene =
                    this.scene ||
                    this.physicsWorldUI?.scene ||
                    null


                /* =================================================
                   SAFETY CHECK
                   ================================================= */

                if (!activeScene) {

                    console.error(
                        'Awtaar Energy Circuit: no THREE.Scene available.'
                    )


                    this.isExperimentOpen =
                        false

                    this.activeExperiment =
                        null

                    this.isTransitioning =
                        false

                    this.show()

                    return
                }


                /* =================================================
                   SAVE REAL SCENE
                   ================================================= */

                this.scene =
                    activeScene


                /* =================================================
                   GIVE SCENE TO EXPERIMENT
                   ================================================= */

                if (
                    typeof this.energyCircuitExperiment.setScene ===
                    'function'
                ) {

                    this.energyCircuitExperiment.setScene(
                        activeScene
                    )

                } else {

                    this.energyCircuitExperiment.scene =
                        activeScene
                }


                /* =================================================
                   ADD GROUP TO SCENE
                   ================================================= */

                this.energyCircuitExperiment.addToScene(
                    activeScene
                )


                /* =================================================
                   FORCE GROUP VISIBLE
                   ================================================= */

                if (
                    this.energyCircuitExperiment.group
                ) {

                    this.energyCircuitExperiment.group.visible =
                        true
                }


                /* =================================================
                   START EXPERIMENT
                   ================================================= */

                const data =
                    this.energyCircuitExperiment.start()


                /* =================================================
                   UPDATE UI
                   ================================================= */

                this.renderCircuitStep(
                    data
                )


                this.showCircuitUI()


                this.isTransitioning =
                    false

            },
            450
        )
    }


    /* =========================================================
       SHOW CIRCUIT UI
       ========================================================= */

    showCircuitUI() {

        if (!this.circuitUI) {
            return
        }


        this.updateLanguage()

        this.renderCircuitStep()


        this.circuitUI.style.display =
            'block'

        this.circuitUI.style.visibility =
            'visible'

        this.circuitUI.style.pointerEvents =
            'auto'


        this.circuitUI.classList.add(
            'is-visible'
        )


        requestAnimationFrame(
            () => {

                if (this.circuitUI) {

                    this.circuitUI.style.opacity =
                        '1'
                }
            }
        )
    }


    /* =========================================================
       HIDE CIRCUIT UI
       ========================================================= */

    hideCircuitUI() {

        if (!this.circuitUI) {
            return
        }


        this.circuitUI.classList.remove(
            'is-visible'
        )


        this.circuitUI.style.opacity =
            '0'

        this.circuitUI.style.pointerEvents =
            'none'


        setTimeout(
            () => {

                if (
                    this.circuitUI &&
                    this.circuitUI.style.opacity === '0'
                ) {

                    this.circuitUI.style.visibility =
                        'hidden'

                    this.circuitUI.style.display =
                        'none'
                }
            },
            400
        )
    }


    /* =========================================================
       CLOSE CIRCUIT
       ========================================================= */

    closeEnergyCircuit() {

        if (this.isTransitioning) {
            return
        }


        this.isTransitioning =
            true

        this.isExperimentOpen =
            false

        this.activeExperiment =
            null


        if (
            this.energyCircuitExperiment
        ) {

            if (
                typeof this.energyCircuitExperiment.stop ===
                'function'
            ) {

                this.energyCircuitExperiment.stop()
            }


            if (
                typeof this.energyCircuitExperiment.removeFromScene ===
                'function'
            ) {

                this.energyCircuitExperiment
                    .removeFromScene()
            }
        }


        this.hideCircuitUI()


        setTimeout(
            () => {

                this.show()

                this.isTransitioning =
                    false
            },
            450
        )
    }


    /* =========================================================
       RETURN TO PHYSICS WORLD
       ========================================================= */

    returnToPhysicsWorld() {

        if (this.isTransitioning) {
            return
        }


        this.isTransitioning =
            true


        /* =====================================================
           CONVERSION
           ===================================================== */

        if (
            this.activeExperiment ===
            'conversion'
        ) {

            if (
                this.energyConversionExperiment
            ) {

                this.energyConversionExperiment.stop()

                this.energyConversionExperiment
                    .removeFromScene()
            }


            this.hideExperimentUI()
        }


        /* =====================================================
           CIRCUIT
           ===================================================== */

        if (
            this.activeExperiment ===
            'circuit'
        ) {

            if (
                this.energyCircuitExperiment
            ) {

                this.energyCircuitExperiment.stop()

                this.energyCircuitExperiment
                    .removeFromScene()
            }


            this.hideCircuitUI()
        }


        this.isExperimentOpen =
            false

        this.activeExperiment =
            null


        this.hide()


        setTimeout(
            () => {

                if (
                    this.physicsWorldUI &&
                    typeof this.physicsWorldUI.show ===
                    'function'
                ) {

                    this.physicsWorldUI.show()
                }


                this.isTransitioning =
                    false

            },
            500
        )
    }


    /* =========================================================
       UPDATE
       ========================================================= */

    update(delta = 0) {

        /* =====================================================
           ENERGY CONVERSION
           ===================================================== */

        if (
            this.energyConversionExperiment &&
            typeof this.energyConversionExperiment.update ===
            'function'
        ) {

            this.energyConversionExperiment.update(
                delta
            )
        }


        /* =====================================================
           ENERGY CIRCUIT
           ===================================================== */

        if (
            this.energyCircuitExperiment &&
            typeof this.energyCircuitExperiment.update ===
            'function'
        ) {

            this.energyCircuitExperiment.update(
                delta
            )
        }


        /* =====================================================
           CONVERSION METRICS
           ===================================================== */

        if (
            this.isExperimentOpen &&
            this.activeExperiment ===
            'conversion'
        ) {

            this.updateExperimentMetrics()
        }
    }


    /* =========================================================
       CONVERSION METRICS
       ========================================================= */

    updateExperimentMetrics() {

        const experiment =
            this.energyConversionExperiment


        if (
            !experiment ||
            typeof experiment.getEnergyData !==
            'function'
        ) {
            return
        }


        const data =
            experiment.getEnergyData()


        if (this.inputValue) {

            this.inputValue.textContent =
                `${data.inputEnergy.toFixed(0)}`
        }


        if (this.efficiencyValue) {

            this.efficiencyValue.textContent =
                `${(
                    data.conversionEfficiency * 100
                ).toFixed(0)}%`
        }


        if (this.outputValue) {

            this.outputValue.textContent =
                `${data.outputEnergy.toFixed(0)}`
        }


        this.updateExperimentStatus()
    }


    /* =========================================================
       CONVERSION STATUS
       ========================================================= */

    updateExperimentStatus() {

        const experiment =
            this.energyConversionExperiment


        if (
            !experiment ||
            !this.statusText
        ) {
            return
        }


        /* PAUSED */

        if (experiment.paused) {

            this.statusText.textContent =
                this.tx(
                    'energyWorld.conversion.paused',
                    'متوقفة مؤقتًا',
                    'Paused'
                )


            if (this.statusDot) {

                this.statusDot.style.background =
                    '#e8b45d'

                this.statusDot.style.boxShadow =
                    '0 0 10px rgba(232,180,93,0.55)'
            }


        /* ACTIVE */

        } else if (experiment.active) {

            this.statusText.textContent =
                this.tx(
                    'energyWorld.conversion.running',
                    'تعمل',
                    'Running'
                )


            if (this.statusDot) {

                this.statusDot.style.background =
                    '#74c69d'

                this.statusDot.style.boxShadow =
                    '0 0 10px rgba(116,198,157,0.55)'
            }


        /* STOPPED */

        } else {

            this.statusText.textContent =
                this.tx(
                    'energyWorld.conversion.stopped',
                    'متوقفة',
                    'Stopped'
                )


            if (this.statusDot) {

                this.statusDot.style.background =
                    '#b86a6a'

                this.statusDot.style.boxShadow =
                    '0 0 10px rgba(184,106,106,0.45)'
            }
        }


        /* PAUSE BUTTON */

        if (this.pauseButton) {

            this.pauseButton.textContent =
                experiment.paused

                    ? this.tx(
                        'energyWorld.conversion.resume',
                        'استئناف التجربة',
                        'Resume Experiment'
                    )

                    : this.tx(
                        'energyWorld.conversion.pause',
                        'إيقاف التجربة',
                        'Pause Experiment'
                    )
        }
    }


    /* =========================================================
       RESPONSIVE
       ========================================================= */

    updateResponsiveLayout() {

        const narrow =
            window.innerWidth < 900


        const veryNarrow =
            window.innerWidth < 620


        /* =====================================================
           CONVERSION
           ===================================================== */

        if (this.experimentUI) {

            const infoPanel =
                this.experimentUI.querySelector(
                    '.energy-experiment-info'
                )


            const controls =
                this.experimentUI.querySelector(
                    '.energy-experiment-controls'
                )


            if (infoPanel) {

                infoPanel.style.left =
                    veryNarrow
                        ? '12px'
                        : narrow
                            ? '16px'
                            : '24px'


                infoPanel.style.top =
                    veryNarrow
                        ? '118px'
                        : narrow
                            ? '132px'
                            : '150px'


                infoPanel.style.width =
                    veryNarrow
                        ? '165px'
                        : narrow
                            ? '185px'
                            : '205px'
            }


            if (controls) {

                controls.style.width =
                    veryNarrow
                        ? 'calc(100vw - 24px)'
                        : narrow
                            ? 'min(520px, calc(100vw - 32px))'
                            : 'min(580px, calc(100vw - 40px))'


                controls.style.bottom =
                    veryNarrow
                        ? '12px'
                        : '20px'
            }
        }


        /* =====================================================
           CIRCUIT
           ===================================================== */

        if (this.circuitUI) {

            this.circuitUI.style.setProperty(
                '--energy-circuit-side-gap',
                veryNarrow
                    ? '10px'
                    : narrow
                        ? '20px'
                        : '34px'
            )
        }
    }


    /* =========================================================
       SCENE
       ========================================================= */

    setScene(scene) {

        this.scene =
            scene || null


        /* CONVERSION */

        if (
            this.energyConversionExperiment
        ) {

            this.energyConversionExperiment.scene =
                this.scene
        }


        /* CIRCUIT */

        if (
            this.energyCircuitExperiment
        ) {

            if (
                typeof this.energyCircuitExperiment.setScene ===
                'function'
            ) {

                this.energyCircuitExperiment.setScene(
                    this.scene
                )

            } else {

                this.energyCircuitExperiment.scene =
                    this.scene
            }
        }
    }


    /* =========================================================
       DESTROY
       ========================================================= */

    destroy() {

        /* =====================================================
           CONVERSION
           ===================================================== */

        if (
            this.energyConversionExperiment
        ) {

            if (
                typeof this.energyConversionExperiment.destroy ===
                'function'
            ) {

                this.energyConversionExperiment.destroy()
            }


            this.energyConversionExperiment =
                null
        }


        /* =====================================================
           CIRCUIT
           ===================================================== */

        if (
            this.energyCircuitExperiment
        ) {

            if (
                typeof this.energyCircuitExperiment.destroy ===
                'function'
            ) {

                this.energyCircuitExperiment.destroy()
            }


            this.energyCircuitExperiment =
                null
        }


        /* =====================================================
           CIRCUIT UI
           ===================================================== */

        if (this.circuitUI) {

            this.circuitUI.remove()

            this.circuitUI =
                null
        }


        /* =====================================================
           WORLD UI
           ===================================================== */

        if (this.container) {

            this.container.remove()

            this.container =
                null
        }


        /* =====================================================
           RESIZE LISTENER
           ===================================================== */

        if (this.handleResize) {

            window.removeEventListener(
                'resize',
                this.handleResize
            )

            this.handleResize =
                null
        }


        /* =====================================================
           CONVERSION UI
           ===================================================== */

        if (this.experimentUI) {

            this.experimentUI.remove()

            this.experimentUI =
                null
        }


        /* =====================================================
           CLEAR REFERENCES
           ===================================================== */

        this.physicsWorldUI =
            null

        this.scene =
            null
    }
}