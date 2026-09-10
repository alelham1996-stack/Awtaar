/* =========================================================
   AWTAAR — GENETICS WORLD UI
   =========================================================

   Biology World
        │
        └── Genetics World
              ├── 🧬 DNA — The Code of Life
              └── 🔬 Gene Expression — From Gene to Protein

   Architecture:

   BiologyGalaxyUI
        ↓
   BiologyWorldUI
        ↓
   GeneticsWorldUI
        ↓
   Genetics Experiments

   IMPORTANT:
   This world is intentionally independent from CellWorldUI.
   Genetics is a separate biology world.

   Current build:
   - World UI
   - Two experiment cards
   - DNA experiment connected
   - Gene to Protein experiment connected
   - Arabic / English support
   - Scene lifecycle support
   - Camera lifecycle support
   - Delta propagation
   ========================================================= */

import './GeneticsWorld.css'

import DNAExperiment from './DNAExperiment.js'
import GeneToProteinExperiment from './GeneToProteinExperiment.js'

import {
    t,
    getLanguage
} from '../../locales/i18n.js'


/* =========================================================
   GENETICS WORLD UI
   ========================================================= */

export default class GeneticsWorldUI {


    /* =====================================================
       CONSTRUCTOR
       ===================================================== */

    constructor(
        biologyWorldUI = null,
        scene = null
    ) {

        console.log(
            '🧬 GeneticsWorldUI: CONSTRUCTOR START',
            {
                biologyWorldUI,
                scene
            }
        )


        this.biologyWorldUI =
            biologyWorldUI

        this.scene =
            scene

        this.camera =
            null


        /* -------------------------------------------------
           STATE
           ------------------------------------------------- */

        this.visible =
            false

        this.transitioning =
            false

        this.destroyed =
            false

        this.activeExperiment =
            null

        this.isExperimentOpen =
            false


        /* -------------------------------------------------
           DOM
           ------------------------------------------------- */

        this.container =
            null

        this.header =
            null

        this.eyebrowElement =
            null

        this.titleElement =
            null

        this.descriptionElement =
            null

        this.backButton =
            null

        this.experimentsContainer =
            null

        this.hintElement =
            null


        this.experimentElements =
            new Map()


        /* -------------------------------------------------
           BUILD
           ------------------------------------------------- */

        try {

            this.createUI()

            console.log(
                '🧬 GeneticsWorldUI: UI CREATED',
                this.container
            )

        } catch (error) {

            console.error(
                '❌ GeneticsWorldUI: createUI FAILED',
                error
            )

            throw error
        }


        /* -------------------------------------------------
           LANGUAGE
           ------------------------------------------------- */

        this.updateLanguage()


        /* -------------------------------------------------
           INITIAL HIDDEN STATE
           ------------------------------------------------- */

        this.hide()


        console.log(
            '🧬 GeneticsWorldUI: CONSTRUCTOR COMPLETE'
        )
    }


    /* =====================================================
       TRANSLATION HELPER
       ===================================================== */

    translate(
        key,
        fallback
    ) {

        try {

            const value =
                t(key)

            if (
                value &&
                typeof value === 'string' &&
                value !== key
            ) {

                return value
            }

        } catch (error) {

            console.warn(
                '⚠️ GeneticsWorldUI translation fallback:',
                key,
                error
            )
        }

        return fallback
    }


    /* =====================================================
       CREATE UI
       ===================================================== */

    createUI() {

        /* -------------------------------------------------
           ROOT
           ------------------------------------------------- */

        this.container =
            document.createElement('section')

        this.container.id =
            'awtaar-genetics-world'

        this.container.className =
            'awtaar-genetics-world'

        this.container.setAttribute(
            'aria-label',
            'Genetics World'
        )


        /* -------------------------------------------------
           HEADER
           ------------------------------------------------- */

        this.header =
            document.createElement('header')

        this.header.className =
            'genetics-world-header'


        /* -------------------------------------------------
           EYEBROW
           ------------------------------------------------- */

        this.eyebrowElement =
            document.createElement('div')

        this.eyebrowElement.className =
            'genetics-world-eyebrow'

        this.eyebrowElement.textContent =
            this.translate(
                'biology.geneticsWorld.eyebrow',
                'AWTAAR • GENETICS'
            )


        /* -------------------------------------------------
           TITLE
           ------------------------------------------------- */

        this.titleElement =
            document.createElement('h2')

        this.titleElement.className =
            'genetics-world-title'

        this.titleElement.textContent =
            this.translate(
                'biology.geneticsWorld.title',
                'عالم الجينيات'
            )


        /* -------------------------------------------------
           DESCRIPTION
           ------------------------------------------------- */

        this.descriptionElement =
            document.createElement('p')

        this.descriptionElement.className =
            'genetics-world-description'

        this.descriptionElement.textContent =
            this.translate(
                'biology.geneticsWorld.description',
                'اكتشف كيف تحمل المادة الوراثية معلومات الحياة وكيف تتحول هذه المعلومات إلى وظائف وصفات.'
            )


        /* -------------------------------------------------
           BACK BUTTON
           ------------------------------------------------- */

        this.backButton =
            document.createElement('button')

        this.backButton.type =
            'button'

        this.backButton.className =
            'genetics-world-back'

        this.backButton.textContent =
            this.translate(
                'biology.geneticsWorld.back',
                'العودة إلى عالم الأحياء'
            )


        this.backButton.addEventListener(
            'click',
            event => {

                event.preventDefault()
                event.stopPropagation()

                console.log(
                    '🧬 GeneticsWorldUI: BACK CLICKED'
                )

                this.returnToBiologyWorld()
            }
        )


        /* -------------------------------------------------
           HEADER ASSEMBLY
           ------------------------------------------------- */

        this.header.appendChild(
            this.eyebrowElement
        )

        this.header.appendChild(
            this.titleElement
        )

        this.header.appendChild(
            this.descriptionElement
        )

        this.header.appendChild(
            this.backButton
        )

        this.container.appendChild(
            this.header
        )


        /* =================================================
           EXPERIMENTS
           ================================================= */

        this.experimentsContainer =
            document.createElement('div')

        this.experimentsContainer.className =
            'genetics-world-experiments'


        const experiments = [

            /* ------------------------------------------------
               DNA
               ------------------------------------------------ */

            {
                key: 'dna',

                number: '01',

                symbol: '🧬',

                titleKey:
                    'biology.geneticsWorld.experiments.dna.title',

                title:
                    'شفرة الحياة',

                descriptionKey:
                    'biology.geneticsWorld.experiments.dna.description',

                description:
                    'استكشف بنية DNA وكيف تحفظ القواعد الوراثية المعلومات داخلها.',

                available:
                    true
            },


            /* ------------------------------------------------
               GENE EXPRESSION
               ------------------------------------------------ */

            {
                key: 'geneExpression',

                number: '02',

                symbol: '🔬',

                titleKey:
                    'biology.geneticsWorld.experiments.geneExpression.title',

                title:
                    'من الجين إلى البروتين',

                descriptionKey:
                    'biology.geneticsWorld.experiments.geneExpression.description',

                description:
                    'تتبع رحلة المعلومات الوراثية من DNA إلى RNA ثم إلى البروتين.',

                available:
                    true
            }

        ]


        experiments.forEach(
            experiment => {

                this.createExperimentCard(
                    experiment
                )
            }
        )


        this.container.appendChild(
            this.experimentsContainer
        )


        /* =================================================
           GENETICS CORE
           ================================================= */

        const core =
            document.createElement('div')

        core.className =
            'genetics-world-core'


        const coreGlow =
            document.createElement('div')

        coreGlow.className =
            'genetics-world-core-glow'


        const coreOrb =
            document.createElement('div')

        coreOrb.className =
            'genetics-world-core-orb'


        const coreSymbol =
            document.createElement('span')

        coreSymbol.className =
            'genetics-world-core-symbol'

        coreSymbol.textContent =
            '🧬'


        const coreName =
            document.createElement('span')

        coreName.className =
            'genetics-world-core-name'

        coreName.textContent =
            this.translate(
                'biology.geneticsWorld.core',
                'المعلومة'
            )


        coreOrb.appendChild(
            coreSymbol
        )

        coreOrb.appendChild(
            coreName
        )

        core.appendChild(
            coreGlow
        )

        core.appendChild(
            coreOrb
        )

        this.container.appendChild(
            core
        )


        /* =================================================
           HINT
           ================================================= */

        this.hintElement =
            document.createElement('div')

        this.hintElement.className =
            'genetics-world-hint'

        this.hintElement.textContent =
            this.translate(
                'biology.geneticsWorld.hint',
                'اختر تجربة لبدء الاستكشاف'
            )

        this.container.appendChild(
            this.hintElement
        )


        /* =================================================
           INITIAL DOM STATE
           ================================================= */

        this.container.style.setProperty(
            'opacity',
            '0',
            'important'
        )

        this.container.style.setProperty(
            'visibility',
            'hidden',
            'important'
        )

        this.container.style.setProperty(
            'pointer-events',
            'none',
            'important'
        )

        this.container.style.setProperty(
            'z-index',
            '2200',
            'important'
        )


        /* -------------------------------------------------
           APPEND
           ------------------------------------------------- */

        document.body.appendChild(
            this.container
        )


        console.log(
            '🧬 GeneticsWorldUI: ROOT APPENDED',
            {
                element: this.container,
                parent: this.container.parentElement
            }
        )
    }


    /* =====================================================
       CREATE EXPERIMENT CARD
       ===================================================== */

    createExperimentCard(
        experiment
    ) {

        const button =
            document.createElement('button')

        button.type =
            'button'

        button.className =
            'genetics-experiment-card'

        button.dataset.experiment =
            experiment.key


        if (
            experiment.available
        ) {

            button.classList.add(
                'is-available'
            )

        } else {

            button.classList.add(
                'is-locked'
            )

            button.setAttribute(
                'aria-disabled',
                'true'
            )
        }


        /* -------------------------------------------------
           NUMBER
           ------------------------------------------------- */

        const number =
            document.createElement('span')

        number.className =
            'genetics-experiment-number'

        number.textContent =
            experiment.number


        /* -------------------------------------------------
           ICON
           ------------------------------------------------- */

        const icon =
            document.createElement('span')

        icon.className =
            'genetics-experiment-icon'

        icon.textContent =
            experiment.symbol


        /* -------------------------------------------------
           CONTENT
           ------------------------------------------------- */

        const content =
            document.createElement('span')

        content.className =
            'genetics-experiment-content'


        const title =
            document.createElement('span')

        title.className =
            'genetics-experiment-title'

        title.textContent =
            this.translate(
                experiment.titleKey,
                experiment.title
            )


        const description =
            document.createElement('span')

        description.className =
            'genetics-experiment-description'

        description.textContent =
            this.translate(
                experiment.descriptionKey,
                experiment.description
            )


        const status =
            document.createElement('span')

        status.className =
            'genetics-experiment-status'

        status.textContent =
            experiment.available
                ? this.translate(
                    'biology.geneticsWorld.available',
                    'متاح للاستكشاف'
                )
                : this.translate(
                    'biology.geneticsWorld.comingSoon',
                    'سيفتح لاحقًا'
                )


        /* -------------------------------------------------
           ACTION
           ------------------------------------------------- */

        const action =
            document.createElement('span')

        action.className =
            'genetics-experiment-action'

        action.textContent =
            experiment.available
                ? '↗'
                : '🔒'


        /* -------------------------------------------------
           ASSEMBLE
           ------------------------------------------------- */

        button.appendChild(
            number
        )

        button.appendChild(
            icon
        )

        content.appendChild(
            title
        )

        content.appendChild(
            description
        )

        content.appendChild(
            status
        )

        button.appendChild(
            content
        )

        button.appendChild(
            action
        )


        /* -------------------------------------------------
           CLICK
           ------------------------------------------------- */

        button.addEventListener(
            'click',
            event => {

                event.preventDefault()
                event.stopPropagation()


                console.log(
                    '🧬 GeneticsWorldUI: EXPERIMENT CLICKED',
                    experiment.key
                )


                this.selectExperiment(
                    experiment.key
                )
            }
        )


        /* -------------------------------------------------
           HOVER
           ------------------------------------------------- */

        button.addEventListener(
            'mouseenter',
            () => {

                if (
                    !experiment.available
                ) {
                    return
                }


                this.container
                    ?.classList
                    .add(
                        `genetics-focus-${experiment.key}`
                    )
            }
        )


        button.addEventListener(
            'mouseleave',
            () => {

                this.container
                    ?.classList
                    .remove(
                        `genetics-focus-${experiment.key}`
                    )
            }
        )


        /* -------------------------------------------------
           ADD
           ------------------------------------------------- */

        this.experimentsContainer.appendChild(
            button
        )


        this.experimentElements.set(
            experiment.key,
            {
                button,
                number,
                icon,
                title,
                description,
                status,
                action,
                data: experiment
            }
        )
    }


    /* =====================================================
       UPDATE LANGUAGE
       ===================================================== */

    updateLanguage() {

        if (
            this.destroyed
        ) {
            return
        }


        const language =
            getLanguage()

        const isArabic =
            language === 'ar'


        /* -------------------------------------------------
           DIRECTION
           ------------------------------------------------- */

        if (
            this.container
        ) {

            this.container.dir =
                isArabic
                    ? 'rtl'
                    : 'ltr'
        }


        /* -------------------------------------------------
           DOCUMENT LANGUAGE
           ------------------------------------------------- */

        if (
            document.documentElement
        ) {

            document.documentElement.lang =
                language

            document.documentElement.dir =
                isArabic
                    ? 'rtl'
                    : 'ltr'
        }


        /* -------------------------------------------------
           HEADER
           ------------------------------------------------- */

        if (
            this.eyebrowElement
        ) {

            this.eyebrowElement.textContent =
                this.translate(
                    'biology.geneticsWorld.eyebrow',
                    'AWTAAR • GENETICS'
                )
        }


        if (
            this.titleElement
        ) {

            this.titleElement.textContent =
                this.translate(
                    'biology.geneticsWorld.title',
                    'عالم الجينيات'
                )
        }


        if (
            this.descriptionElement
        ) {

            this.descriptionElement.textContent =
                this.translate(
                    'biology.geneticsWorld.description',
                    'اكتشف كيف تحمل المادة الوراثية معلومات الحياة وكيف تتحول هذه المعلومات إلى وظائف وصفات.'
                )
        }


        if (
            this.backButton
        ) {

            this.backButton.textContent =
                this.translate(
                    'biology.geneticsWorld.back',
                    'العودة إلى عالم الأحياء'
                )
        }


        /* -------------------------------------------------
           CORE
           ------------------------------------------------- */

        const coreName =
            this.container?.querySelector(
                '.genetics-world-core-name'
            )


        if (
            coreName
        ) {

            coreName.textContent =
                this.translate(
                    'biology.geneticsWorld.core',
                    'المعلومة'
                )
        }


        /* -------------------------------------------------
           HINT
           ------------------------------------------------- */

        if (
            this.hintElement
        ) {

            this.hintElement.textContent =
                this.translate(
                    'biology.geneticsWorld.hint',
                    'اختر تجربة لبدء الاستكشاف'
                )
        }


        /* -------------------------------------------------
           EXPERIMENT CARDS
           ------------------------------------------------- */

        this.experimentElements.forEach(
            item => {

                const experiment =
                    item.data


                item.title.textContent =
                    this.translate(
                        experiment.titleKey,
                        experiment.title
                    )


                item.description.textContent =
                    this.translate(
                        experiment.descriptionKey,
                        experiment.description
                    )


                item.status.textContent =
                    experiment.available
                        ? this.translate(
                            'biology.geneticsWorld.available',
                            'متاح للاستكشاف'
                        )
                        : this.translate(
                            'biology.geneticsWorld.comingSoon',
                            'سيفتح لاحقًا'
                        )


                item.action.textContent =
                    experiment.available
                        ? '↗'
                        : '🔒'
            }
        )
    }


    /* =====================================================
       SELECT EXPERIMENT
       ===================================================== */

    selectExperiment(
        key
    ) {

        console.log(
            '🧬 GeneticsWorldUI: SELECT EXPERIMENT',
            key
        )


        if (
            this.destroyed
        ) {

            return
        }


        if (
            this.transitioning
        ) {

            return
        }


        if (
            this.isExperimentOpen
        ) {

            return
        }


        const item =
            this.experimentElements.get(
                key
            )


        if (
            !item
        ) {

            console.error(
                '❌ GeneticsWorldUI: experiment not found:',
                key
            )

            return
        }


        const experiment =
            item.data


        if (
            !experiment.available
        ) {

            this.showLockedFeedback(
                item.button
            )

            return
        }


        /* =================================================
           DNA EXPERIMENT
           ================================================= */

        if (
            key === 'dna'
        ) {

            this.openDNAExperiment(
                item
            )

            return
        }


        /* =================================================
           GENE TO PROTEIN EXPERIMENT
           ================================================= */

        if (
            key === 'geneExpression'
        ) {

            this.openGeneToProteinExperiment(
                item
            )

            return
        }


        /* =================================================
           FUTURE EXPERIMENTS
           ================================================= */

        console.info(
            '🧬 GeneticsWorldUI: experiment reserved:',
            key
        )


        item.button.classList.add(
            'is-selected'
        )


        window.setTimeout(
            () => {

                item.button?.classList.remove(
                    'is-selected'
                )

            },
            350
        )
    }


    /* =====================================================
       OPEN DNA EXPERIMENT
       ===================================================== */

    openDNAExperiment(
        item = null
    ) {

        console.log(
            '🧬 GeneticsWorldUI: OPEN DNA EXPERIMENT'
        )


        if (
            this.destroyed
        ) {

            return
        }


        if (
            this.isExperimentOpen
        ) {

            return
        }


        if (
            !this.scene
        ) {

            console.error(
                '❌ GeneticsWorldUI: DNA experiment cannot open — scene missing'
            )

            return
        }


        this.transitioning =
            true


        /* -------------------------------------------------
           CARD FEEDBACK
           ------------------------------------------------- */

        if (
            item?.button
        ) {

            item.button.classList.add(
                'is-selected'
            )
        }


        /* -------------------------------------------------
           CREATE EXPERIMENT
           ------------------------------------------------- */

        try {

            if (
                this.activeExperiment &&
                typeof this.activeExperiment.destroy ===
                'function'
            ) {

                this.activeExperiment.destroy()
            }


            this.activeExperiment =
                new DNAExperiment(
                    this.scene,
                    this
                )


            /* -------------------------------------------------
               CAMERA
               ------------------------------------------------- */

            if (
                this.camera &&
                typeof this.activeExperiment.setCamera ===
                'function'
            ) {

                this.activeExperiment.setCamera(
                    this.camera
                )
            }


            this.isExperimentOpen =
                true


            /* -------------------------------------------------
               HIDE GENETICS WORLD
               ------------------------------------------------- */

            this.hide()


            /* -------------------------------------------------
               SHOW EXPERIMENT
               ------------------------------------------------- */

            window.setTimeout(
                () => {

                    if (
                        this.destroyed ||
                        !this.activeExperiment
                    ) {

                        return
                    }


                    this.activeExperiment.show()

                    this.transitioning =
                        false


                    console.log(
                        '🧬 GeneticsWorldUI: DNA EXPERIMENT OPENED'
                    )

                },
                250
            )

        } catch (error) {

            console.error(
                '❌ GeneticsWorldUI: DNA experiment failed to open',
                error
            )


            this.activeExperiment =
                null

            this.isExperimentOpen =
                false

            this.transitioning =
                false


            if (
                item?.button
            ) {

                item.button.classList.remove(
                    'is-selected'
                )
            }
        }
    }


    /* =====================================================
       OPEN GENE TO PROTEIN EXPERIMENT
       ===================================================== */

    openGeneToProteinExperiment(
        item = null
    ) {

        console.log(
            '🧬 GeneticsWorldUI: OPEN GENE TO PROTEIN EXPERIMENT'
        )


        if (
            this.destroyed
        ) {

            return
        }


        if (
            this.isExperimentOpen
        ) {

            return
        }


        if (
            !this.scene
        ) {

            console.error(
                '❌ GeneticsWorldUI: Gene to Protein experiment cannot open — scene missing'
            )

            return
        }


        this.transitioning =
            true


        /* -------------------------------------------------
           CARD FEEDBACK
           ------------------------------------------------- */

        if (
            item?.button
        ) {

            item.button.classList.add(
                'is-selected'
            )
        }


        /* -------------------------------------------------
           CREATE EXPERIMENT
           ------------------------------------------------- */

        try {

            if (
                this.activeExperiment &&
                typeof this.activeExperiment.destroy ===
                'function'
            ) {

                this.activeExperiment.destroy()
            }


            this.activeExperiment =
                new GeneToProteinExperiment(
                    this.scene,
                    this
                )


            /* -------------------------------------------------
               CAMERA
               ------------------------------------------------- */

            if (
                this.camera &&
                typeof this.activeExperiment.setCamera ===
                'function'
            ) {

                this.activeExperiment.setCamera(
                    this.camera
                )
            }


            this.isExperimentOpen =
                true


            /* -------------------------------------------------
               HIDE GENETICS WORLD
               ------------------------------------------------- */

            this.hide()


            /* -------------------------------------------------
               SHOW EXPERIMENT
               ------------------------------------------------- */

            window.setTimeout(
                () => {

                    if (
                        this.destroyed ||
                        !this.activeExperiment
                    ) {

                        return
                    }


                    this.activeExperiment.show()

                    this.transitioning =
                        false


                    console.log(
                        '🧬 GeneticsWorldUI: GENE TO PROTEIN EXPERIMENT OPENED'
                    )

                },
                250
            )

        } catch (error) {

            console.error(
                '❌ GeneticsWorldUI: Gene to Protein experiment failed to open',
                error
            )


            this.activeExperiment =
                null

            this.isExperimentOpen =
                false

            this.transitioning =
                false


            if (
                item?.button
            ) {

                item.button.classList.remove(
                    'is-selected'
                )
            }
        }
    }


    /* =====================================================
       RETURN FROM DNA EXPERIMENT
       ===================================================== */

    returnFromDNAExperiment() {

        console.log(
            '🧬 GeneticsWorldUI: RETURN FROM DNA EXPERIMENT'
        )


        if (
            this.destroyed
        ) {

            return
        }


        if (
            this.transitioning
        ) {

            return
        }


        this.transitioning =
            true


        /* -------------------------------------------------
           DESTROY EXPERIMENT
           ------------------------------------------------- */

        if (
            this.activeExperiment &&
            typeof this.activeExperiment.destroy ===
            'function'
        ) {

            try {

                this.activeExperiment.destroy()

            } catch (error) {

                console.error(
                    '❌ GeneticsWorldUI: DNA destroy failed',
                    error
                )
            }
        }


        this.activeExperiment =
            null

        this.isExperimentOpen =
            false


        /* -------------------------------------------------
           SHOW GENETICS WORLD
           ------------------------------------------------- */

        window.setTimeout(
            () => {

                if (
                    this.destroyed
                ) {

                    return
                }


                this.show()

                this.transitioning =
                    false


                console.log(
                    '🧬 GeneticsWorldUI: GENETICS WORLD RESTORED'
                )

            },
            250
        )
    }


    /* =====================================================
       RETURN FROM GENE TO PROTEIN EXPERIMENT
       ===================================================== */

    returnFromGeneToProteinExperiment() {

        console.log(
            '🧬 GeneticsWorldUI: RETURN FROM GENE TO PROTEIN EXPERIMENT'
        )


        if (
            this.destroyed
        ) {

            return
        }


        if (
            this.transitioning
        ) {

            return
        }


        this.transitioning =
            true


        /* -------------------------------------------------
           DESTROY EXPERIMENT
           ------------------------------------------------- */

        if (
            this.activeExperiment &&
            typeof this.activeExperiment.destroy ===
            'function'
        ) {

            try {

                this.activeExperiment.destroy()

            } catch (error) {

                console.error(
                    '❌ GeneticsWorldUI: Gene to Protein destroy failed',
                    error
                )
            }
        }


        this.activeExperiment =
            null

        this.isExperimentOpen =
            false


        /* -------------------------------------------------
           SHOW GENETICS WORLD
           ------------------------------------------------- */

        window.setTimeout(
            () => {

                if (
                    this.destroyed
                ) {

                    return
                }


                this.show()

                this.transitioning =
                    false


                console.log(
                    '🧬 GeneticsWorldUI: GENETICS WORLD RESTORED FROM GENE TO PROTEIN'
                )

            },
            250
        )
    }


    /* =====================================================
       LOCKED FEEDBACK
       ===================================================== */

    showLockedFeedback(
        button
    ) {

        if (
            !button
        ) {
            return
        }


        button.classList.remove(
            'is-locked-pulse'
        )


        void button.offsetWidth


        button.classList.add(
            'is-locked-pulse'
        )


        window.setTimeout(
            () => {

                button.classList.remove(
                    'is-locked-pulse'
                )

            },
            650
        )
    }


    /* =====================================================
       SHOW
       ===================================================== */

    show() {

        console.log(
            '🧬 GeneticsWorldUI: SHOW START'
        )


        if (
            this.destroyed
        ) {

            console.warn(
                '⚠️ GeneticsWorldUI: SHOW ABORTED — destroyed'
            )

            return
        }


        if (
            !this.container
        ) {

            console.error(
                '❌ GeneticsWorldUI: SHOW ABORTED — container missing'
            )

            return
        }


        /*
         * Do not show the Genetics World UI over an active
         * experiment.
         */

        if (
            this.isExperimentOpen
        ) {

            console.warn(
                '⚠️ GeneticsWorldUI: SHOW IGNORED — experiment is open'
            )

            return
        }


        this.updateLanguage()


        this.visible =
            true

        this.transitioning =
            false


        /* -------------------------------------------------
           FORCE VISIBILITY
           ------------------------------------------------- */

        this.container.style.setProperty(
            'display',
            'block',
            'important'
        )

        this.container.style.setProperty(
            'visibility',
            'visible',
            'important'
        )

        this.container.style.setProperty(
            'pointer-events',
            'auto',
            'important'
        )

        this.container.style.setProperty(
            'z-index',
            '2200',
            'important'
        )


        /* -------------------------------------------------
           REFLOW
           ------------------------------------------------- */

        void this.container.offsetWidth


        requestAnimationFrame(
            () => {

                if (
                    !this.container ||
                    this.destroyed ||
                    this.isExperimentOpen
                ) {

                    return
                }


                this.container.style.setProperty(
                    'opacity',
                    '1',
                    'important'
                )


                console.log(
                    '🧬 GeneticsWorldUI: SHOW COMPLETE'
                )
            }
        )
    }


    /* =====================================================
       HIDE
       ===================================================== */

    hide() {

        if (
            this.destroyed ||
            !this.container
        ) {
            return
        }


        this.visible =
            false


        this.container.style.setProperty(
            'opacity',
            '0',
            'important'
        )

        this.container.style.setProperty(
            'pointer-events',
            'none',
            'important'
        )


        window.setTimeout(
            () => {

                if (
                    !this.container ||
                    this.visible
                ) {
                    return
                }


                this.container.style.setProperty(
                    'visibility',
                    'hidden',
                    'important'
                )

            },
            550
        )
    }


    /* =====================================================
       CLOSE
       ===================================================== */

    close() {

        console.log(
            '🧬 GeneticsWorldUI: CLOSE'
        )


        if (
            this.activeExperiment &&
            typeof this.activeExperiment.destroy ===
            'function'
        ) {

            try {

                this.activeExperiment.destroy()

            } catch (error) {

                console.error(
                    '❌ GeneticsWorldUI: close experiment failed',
                    error
                )
            }
        }


        this.activeExperiment =
            null

        this.isExperimentOpen =
            false

        this.transitioning =
            false

        this.hide()
    }


    /* =====================================================
       RETURN TO BIOLOGY WORLD
       ===================================================== */

    returnToBiologyWorld() {

        console.log(
            '🧬 GeneticsWorldUI: RETURN TO BIOLOGY WORLD'
        )


        if (
            this.destroyed
        ) {
            return
        }


        if (
            this.transitioning
        ) {
            return
        }


        this.transitioning =
            true


        /* -------------------------------------------------
           CLOSE ACTIVE EXPERIMENT
           ------------------------------------------------- */

        if (
            this.activeExperiment &&
            typeof this.activeExperiment.destroy ===
            'function'
        ) {

            try {

                this.activeExperiment.destroy()

            } catch (error) {

                console.error(
                    '❌ GeneticsWorldUI: experiment destroy failed',
                    error
                )
            }
        }


        this.activeExperiment =
            null

        this.isExperimentOpen =
            false


        /* -------------------------------------------------
           HIDE GENETICS WORLD
           ------------------------------------------------- */

        this.hide()


        /* -------------------------------------------------
           RETURN AFTER TRANSITION
           ------------------------------------------------- */

        window.setTimeout(
            () => {

                if (
                    this.destroyed
                ) {
                    return
                }


                this.transitioning =
                    false


                if (
                    this.biologyWorldUI &&
                    typeof this.biologyWorldUI.show ===
                    'function'
                ) {

                    console.log(
                        '🧬 GeneticsWorldUI: CALLING BiologyWorldUI.show()'
                    )


                    this.biologyWorldUI.show()

                    return
                }


                /* ------------------------------------------------
                   FALLBACK EVENT
                   ------------------------------------------------ */

                window.dispatchEvent(
                    new CustomEvent(
                        'awtaar:return-to-biology-world'
                    )
                )

            },
            550
        )
    }


    /* =====================================================
       SET BIOLOGY WORLD
       ===================================================== */

    setBiologyWorld(
        biologyWorldUI
    ) {

        this.biologyWorldUI =
            biologyWorldUI || null
    }


    /* =====================================================
       SET SCENE
       ===================================================== */

    setScene(
        scene
    ) {

        console.log(
            '🧬 GeneticsWorldUI: SET SCENE',
            scene
        )


        this.scene =
            scene


        /* -------------------------------------------------
           UPDATE ACTIVE EXPERIMENT
           ------------------------------------------------- */

        if (
            this.activeExperiment &&
            typeof this.activeExperiment.setScene ===
            'function'
        ) {

            this.activeExperiment.setScene(
                scene
            )
        }
    }


    /* =====================================================
       SET CAMERA
       ===================================================== */

    setCamera(
        camera
    ) {

        console.log(
            '🧬 GeneticsWorldUI: SET CAMERA',
            camera
        )


        this.camera =
            camera || null


        if (
            this.activeExperiment &&
            typeof this.activeExperiment.setCamera ===
            'function'
        ) {

            this.activeExperiment.setCamera(
                this.camera
            )
        }
    }


    /* =====================================================
       UPDATE
       ===================================================== */

    update(
        delta = 0
    ) {

        if (
            this.destroyed
        ) {
            return
        }


        if (
            this.activeExperiment &&
            typeof this.activeExperiment.update ===
            'function'
        ) {

            this.activeExperiment.update(
                delta
            )
        }
    }


    /* =====================================================
       OPEN STATE
       ===================================================== */

    isOpen() {

        return (
            this.visible === true &&
            this.destroyed === false
        )
    }


    /* =====================================================
       DESTROY
       ===================================================== */

    destroy() {

        console.log(
            '🧬 GeneticsWorldUI: DESTROY'
        )


        if (
            this.destroyed
        ) {
            return
        }


        this.destroyed =
            true

        this.transitioning =
            false


        /* -------------------------------------------------
           DESTROY ACTIVE EXPERIMENT
           ------------------------------------------------- */

        if (
            this.activeExperiment &&
            typeof this.activeExperiment.destroy ===
            'function'
        ) {

            try {

                this.activeExperiment.destroy()

            } catch (error) {

                console.error(
                    '❌ GeneticsWorldUI: active experiment destroy failed',
                    error
                )
            }
        }


        this.activeExperiment =
            null


        /* -------------------------------------------------
           CLEAR STATE
           ------------------------------------------------- */

        this.isExperimentOpen =
            false


        this.experimentElements.clear()


        /* -------------------------------------------------
           REMOVE DOM
           ------------------------------------------------- */

        if (
            this.container
        ) {

            this.container.remove()
        }


        /* -------------------------------------------------
           NULL REFERENCES
           ------------------------------------------------- */

        this.container =
            null

        this.header =
            null

        this.eyebrowElement =
            null

        this.titleElement =
            null

        this.descriptionElement =
            null

        this.backButton =
            null

        this.experimentsContainer =
            null

        this.hintElement =
            null

        this.biologyWorldUI =
            null

        this.scene =
            null

        this.camera =
            null
    }
}