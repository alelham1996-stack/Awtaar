/* =========================================================
   AWTAAR — BIOLOGY GALAXY
   CELL WORLD UI
   =========================================================

   World:
   🧫 Cell World

   Experiments:
   1. Inside the Cell
   2. Cell Gateway

   Architecture:

   BiologyWorldUI
        ↓
   CellWorldUI
        ↓
   ├── InsideCellExperiment
   └── CellGateExperiment

   ========================================================= */


import './CellWorld.css'
import './CellGate.css'

import InsideCellExperiment
    from './InsideCellExperiment.js'

import CellGateExperiment
    from './CellGateExperiment.js'

import {
    t,
    getLanguage
} from '../locales/i18n.js'


export default class CellWorldUI {


    /* =====================================================
       CONSTRUCTOR
       ===================================================== */

    constructor(
        biologyWorldUI = null,
        scene = null
    ) {

        console.log(
            '🧫 CellWorldUI: CONSTRUCTOR START',
            {
                biologyWorldUI,
                scene
            }
        )


        /* -------------------------------------------------
           REFERENCES
           ------------------------------------------------- */

        this.biologyWorldUI =
            biologyWorldUI

        this.scene =
            scene


        /* -------------------------------------------------
           STATE
           ------------------------------------------------- */

        this.active =
            false

        this.isExperimentOpen =
            false

        this.activeExperiment =
            null

        this.isTransitioning =
            false


        /* -------------------------------------------------
           EXPERIMENTS
           ------------------------------------------------- */

        this.insideCellExperiment =
            null

        this.cellGateExperiment =
            null


        /* -------------------------------------------------
           DOM
           ------------------------------------------------- */

        this.root =
            null

        this.header =
            null

        this.title =
            null

        this.description =
            null

        this.backButton =
            null

        this.experiments =
            null

        this.hint =
            null


        /* -------------------------------------------------
           BUILD
           ------------------------------------------------- */

        try {

            this.createUI()

        } catch (error) {

            console.error(
                '❌ CellWorldUI: createUI FAILED',
                error
            )

            throw error
        }


        this.updateLanguage()


        /* -------------------------------------------------
           RESIZE
           ------------------------------------------------- */

        this.handleResize =
            () => {

                this.updateResponsiveLayout()

            }


        window.addEventListener(
            'resize',
            this.handleResize
        )


        this.updateResponsiveLayout()


        console.log(
            '🧫 CellWorldUI: CONSTRUCTOR COMPLETE'
        )
    }


    /* =====================================================
       TRANSLATION HELPER
       ===================================================== */

    tx(
        key,
        arabic,
        english
    ) {

        try {

            const translated =
                t(key)

            if (
                translated &&
                translated !== key
            ) {

                return translated
            }

        } catch (error) {

            console.warn(
                '⚠️ CellWorldUI: translation failed',
                key,
                error
            )
        }


        const language =
            typeof getLanguage === 'function'
                ? getLanguage()
                : 'ar'


        return language === 'en'
            ? english
            : arabic
    }


    /* =====================================================
       CREATE UI
       ===================================================== */

    createUI() {

        console.log(
            '🧫 CellWorldUI: CREATE UI START'
        )


        /* -------------------------------------------------
           ROOT
           ------------------------------------------------- */

        this.root =
            document.createElement(
                'section'
            )


        this.root.id =
            'awtaar-cell-world'


        this.root.className =
            'awtaar-cell-world'


        this.root.dir =
            'rtl'


        /* -------------------------------------------------
           HTML
           ------------------------------------------------- */

        this.root.innerHTML = `

            <div class="cell-world-header">

                <div class="cell-world-header-content">

                    <div class="cell-world-eyebrow">
                        AWTAAR • BIOLOGY
                    </div>

                    <h1 class="cell-world-title">
                        عالم الخلية
                    </h1>

                    <p class="cell-world-description">
                        اقترب من أصغر وحدة تنبض بالحياة واستكشف عالمها الداخلي.
                    </p>

                </div>


                <button
                    class="cell-world-back"
                    type="button"
                >

                    <span class="cell-world-back-icon">
                        ←
                    </span>

                    <span class="cell-world-back-text">
                        العودة إلى مجرة الأحياء
                    </span>

                </button>

            </div>


            <div class="cell-world-core">

                <div class="cell-world-core-ring ring-one"></div>

                <div class="cell-world-core-ring ring-two"></div>

                <div class="cell-world-core-ring ring-three"></div>

                <div class="cell-world-core-glow"></div>

                <div class="cell-world-core-center">

                    <div class="cell-world-core-symbol">
                        🧫
                    </div>

                    <div class="cell-world-core-label">
                        الحياة
                    </div>

                </div>

            </div>


            <div class="cell-world-experiments">


                <!-- =========================================
                     EXPERIMENT 01
                     INSIDE THE CELL
                     ========================================= -->

                <button
                    class="cell-experiment-card"
                    data-experiment="insideCell"
                    type="button"
                >

                    <div class="cell-experiment-card-glow"></div>

                    <div class="cell-experiment-icon">
                        🧫
                    </div>

                    <div class="cell-experiment-number">
                        01
                    </div>

                    <div class="cell-experiment-content">

                        <div class="cell-experiment-title">
                            داخل الخلية
                        </div>

                        <div class="cell-experiment-description">
                            ادخل إلى الخلية واستكشف العضيات التي تجعل الحياة ممكنة.
                        </div>

                    </div>

                    <div class="cell-experiment-arrow">
                        ←
                    </div>

                </button>


                <!-- =========================================
                     EXPERIMENT 02
                     CELL GATEWAY
                     ========================================= -->

                <button
                    class="cell-experiment-card"
                    data-experiment="cellGateway"
                    type="button"
                >

                    <div class="cell-experiment-card-glow"></div>

                    <div class="cell-experiment-icon">
                        ◉
                    </div>

                    <div class="cell-experiment-number">
                        02
                    </div>

                    <div class="cell-experiment-content">

                        <div class="cell-experiment-title">
                            بوابة الخلية
                        </div>

                        <div class="cell-experiment-description">
                            اكتشف كيف تدخل المواد إلى الخلية وتخرج منها عبر الغشاء.
                        </div>

                    </div>

                    <div class="cell-experiment-arrow">
                        ←
                    </div>

                </button>

            </div>


            <div class="cell-world-hint">

                <span class="cell-world-hint-line"></span>

                اختر تجربة لبدء الاستكشاف

                <span class="cell-world-hint-line"></span>

            </div>

        `


        document.body.appendChild(
            this.root
        )


        /* -------------------------------------------------
           CACHE DOM
           ------------------------------------------------- */

        this.header =
            this.root.querySelector(
                '.cell-world-header'
            )


        this.title =
            this.root.querySelector(
                '.cell-world-title'
            )


        this.description =
            this.root.querySelector(
                '.cell-world-description'
            )


        this.backButton =
            this.root.querySelector(
                '.cell-world-back'
            )


        this.experiments =
            this.root.querySelector(
                '.cell-world-experiments'
            )


        this.hint =
            this.root.querySelector(
                '.cell-world-hint'
            )


        /* -------------------------------------------------
           EXPERIMENT CARDS
           ------------------------------------------------- */

        const cards =
            this.root.querySelectorAll(
                '.cell-experiment-card'
            )


        cards.forEach(
            card => {

                card.addEventListener(
                    'click',
                    event => {

                        event.preventDefault()

                        event.stopPropagation()


                        const experiment =
                            card.dataset.experiment


                        console.log(
                            '🧫 CellWorldUI: CARD CLICK',
                            experiment
                        )


                        this.selectExperiment(
                            experiment
                        )

                    }
                )

            }
        )


        /* -------------------------------------------------
           BACK BUTTON
           ------------------------------------------------- */

        if (
            this.backButton
        ) {

            this.backButton.addEventListener(
                'click',
                event => {

                    event.preventDefault()

                    event.stopPropagation()


                    this.returnToBiologyWorld()

                }
            )
        }


        /* -------------------------------------------------
           INITIAL STATE
           ------------------------------------------------- */

        this.hide()


        console.log(
            '🧫 CellWorldUI: CREATE UI COMPLETE'
        )
    }


    /* =====================================================
       LANGUAGE
       ===================================================== */

    updateLanguage() {

        if (
            !this.root
        ) {
            return
        }


        const language =
            typeof getLanguage === 'function'
                ? getLanguage()
                : 'ar'


        const currentLanguage =
            language === 'en'
                ? 'en'
                : 'ar'


        const direction =
            currentLanguage === 'ar'
                ? 'rtl'
                : 'ltr'


        document.documentElement.lang =
            currentLanguage


        document.documentElement.dir =
            direction


        this.root.dir =
            direction


        /* -------------------------------------------------
           WORLD TITLE
           ------------------------------------------------- */

        if (
            this.title
        ) {

            this.title.textContent =
                currentLanguage === 'en'
                    ? 'Cell World'
                    : 'عالم الخلية'
        }


        /* -------------------------------------------------
           WORLD DESCRIPTION
           ------------------------------------------------- */

        if (
            this.description
        ) {

            this.description.textContent =
                currentLanguage === 'en'
                    ? 'Enter the smallest living unit and explore the world inside it.'
                    : 'اقترب من أصغر وحدة تنبض بالحياة واستكشف عالمها الداخلي.'
        }


        /* -------------------------------------------------
           BACK BUTTON
           ------------------------------------------------- */

        if (
            this.backButton
        ) {

            const text =
                this.backButton.querySelector(
                    '.cell-world-back-text'
                )


            const icon =
                this.backButton.querySelector(
                    '.cell-world-back-icon'
                )


            if (
                text
            ) {

                text.textContent =
                    currentLanguage === 'en'
                        ? 'Back to Biology Galaxy'
                        : 'العودة إلى مجرة الأحياء'
            }


            if (
                icon
            ) {

                icon.textContent =
                    currentLanguage === 'en'
                        ? '→'
                        : '←'
            }
        }


        /* -------------------------------------------------
           INSIDE CELL CARD
           ------------------------------------------------- */

        const insideCard =
            this.root.querySelector(
                '[data-experiment="insideCell"]'
            )


        if (
            insideCard
        ) {

            const title =
                insideCard.querySelector(
                    '.cell-experiment-title'
                )


            const description =
                insideCard.querySelector(
                    '.cell-experiment-description'
                )


            const arrow =
                insideCard.querySelector(
                    '.cell-experiment-arrow'
                )


            if (
                title
            ) {

                title.textContent =
                    currentLanguage === 'en'
                        ? 'Inside the Cell'
                        : 'داخل الخلية'
            }


            if (
                description
            ) {

                description.textContent =
                    currentLanguage === 'en'
                        ? 'Enter the cell and explore the organelles that make life possible.'
                        : 'ادخل إلى الخلية واستكشف العضيات التي تجعل الحياة ممكنة.'
            }


            if (
                arrow
            ) {

                arrow.textContent =
                    currentLanguage === 'en'
                        ? '→'
                        : '←'
            }
        }


        /* -------------------------------------------------
           CELL GATEWAY CARD
           ------------------------------------------------- */

        const gatewayCard =
            this.root.querySelector(
                '[data-experiment="cellGateway"]'
            )


        if (
            gatewayCard
        ) {

            const title =
                gatewayCard.querySelector(
                    '.cell-experiment-title'
                )


            const description =
                gatewayCard.querySelector(
                    '.cell-experiment-description'
                )


            const arrow =
                gatewayCard.querySelector(
                    '.cell-experiment-arrow'
                )


            if (
                title
            ) {

                title.textContent =
                    currentLanguage === 'en'
                        ? 'Cell Gateway'
                        : 'بوابة الخلية'
            }


            if (
                description
            ) {

                description.textContent =
                    currentLanguage === 'en'
                        ? 'Discover how materials enter and leave the cell through its membrane.'
                        : 'اكتشف كيف تدخل المواد إلى الخلية وتخرج منها عبر الغشاء.'
            }


            if (
                arrow
            ) {

                arrow.textContent =
                    currentLanguage === 'en'
                        ? '→'
                        : '←'
            }
        }


        /* -------------------------------------------------
           HINT
           ------------------------------------------------- */

        if (
            this.hint
        ) {

            const leftLine =
                this.hint.querySelector(
                    '.cell-world-hint-line'
                )


            const lines =
                this.hint.querySelectorAll(
                    '.cell-world-hint-line'
                )


            this.hint.innerHTML = ''


            const left =
                document.createElement(
                    'span'
                )

            left.className =
                'cell-world-hint-line'


            const text =
                document.createTextNode(
                    currentLanguage === 'en'
                        ? 'Choose an experiment to begin'
                        : 'اختر تجربة لبدء الاستكشاف'
                )


            const right =
                document.createElement(
                    'span'
                )

            right.className =
                'cell-world-hint-line'


            this.hint.appendChild(
                left
            )

            this.hint.appendChild(
                text
            )

            this.hint.appendChild(
                right
            )
        }


        /* -------------------------------------------------
           ACTIVE EXPERIMENT LANGUAGE
           ------------------------------------------------- */

        if (
            this.insideCellExperiment &&
            typeof this.insideCellExperiment.updateLanguage ===
                'function'
        ) {

            try {

                this.insideCellExperiment.updateLanguage()

            } catch (error) {

                console.warn(
                    '⚠️ CellWorldUI: InsideCellExperiment language update failed',
                    error
                )
            }
        }


        if (
            this.cellGateExperiment &&
            typeof this.cellGateExperiment.updateLanguage ===
                'function'
        ) {

            try {

                this.cellGateExperiment.updateLanguage()

            } catch (error) {

                console.warn(
                    '⚠️ CellWorldUI: CellGateExperiment language update failed',
                    error
                )
            }
        }
    }


    /* =====================================================
       SHOW CELL WORLD
       ===================================================== */

    show() {

        console.log(
            '🧫 CellWorldUI: SHOW'
        )


        if (
            !this.root
        ) {
            return
        }


        this.active =
            true


        this.isExperimentOpen =
            false


        this.activeExperiment =
            null


        this.root.style.display =
            'block'


        this.root.classList.add(
            'is-visible'
        )


        this.root.style.setProperty(
            'visibility',
            'visible',
            'important'
        )


        this.root.style.setProperty(
            'pointer-events',
            'auto',
            'important'
        )


        this.root.style.setProperty(
            'opacity',
            '1',
            'important'
        )


        this.root.style.setProperty(
            'z-index',
            '2100',
            'important'
        )


        this.updateLanguage()

        this.updateResponsiveLayout()
    }


    /* =====================================================
       HIDE CELL WORLD
       ===================================================== */

    hide() {

        if (
            !this.root
        ) {
            return
        }


        this.root.classList.remove(
            'is-visible'
        )


        this.root.style.setProperty(
            'visibility',
            'hidden',
            'important'
        )


        this.root.style.setProperty(
            'pointer-events',
            'none',
            'important'
        )


        this.root.style.setProperty(
            'opacity',
            '0',
            'important'
        )


        this.root.style.display =
            'none'


        this.active =
            false
    }


    /* =====================================================
       SELECT EXPERIMENT
       ===================================================== */

    selectExperiment(
        experiment
    ) {

        console.log(
            '🧫 CellWorldUI: SELECT EXPERIMENT',
            experiment
        )


        if (
            this.isTransitioning
        ) {

            console.warn(
                '⚠️ CellWorldUI: TRANSITION BLOCKED'
            )

            return
        }


        if (
            !this.active
        ) {

            console.warn(
                '⚠️ CellWorldUI: WORLD IS NOT ACTIVE'
            )

            return
        }


        if (
            this.isExperimentOpen
        ) {

            console.warn(
                '⚠️ CellWorldUI: EXPERIMENT ALREADY OPEN'
            )

            return
        }


        if (
            experiment ===
            'insideCell'
        ) {

            this.openInsideCell()

            return
        }


        if (
            experiment ===
            'cellGateway'
        ) {

            this.openCellGateway()

            return
        }


        console.warn(
            '⚠️ CellWorldUI: UNKNOWN EXPERIMENT',
            experiment
        )
    }


    /* =====================================================
       OPEN INSIDE CELL
       ===================================================== */

    openInsideCell() {

        console.log(
            '🧫 CellWorldUI: OPEN INSIDE CELL'
        )


        if (
            this.isExperimentOpen
        ) {
            return
        }


        try {

            if (
                !this.insideCellExperiment
            ) {

                this.insideCellExperiment =
                    new InsideCellExperiment(
                        this.scene,
                        this
                    )

            }


            if (
                typeof this.insideCellExperiment.setParent ===
                    'function'
            ) {

                this.insideCellExperiment.setParent(
                    this
                )
            }


            if (
                typeof this.insideCellExperiment.setScene ===
                    'function'
            ) {

                this.insideCellExperiment.setScene(
                    this.scene
                )
            }


            this.activeExperiment =
                'insideCell'


            this.isExperimentOpen =
                true


            this.hide()


            if (
                typeof this.insideCellExperiment.show ===
                    'function'
            ) {

                this.insideCellExperiment.show()
            }


            console.log(
                '🧫 CellWorldUI: INSIDE CELL OPENED'
            )

        } catch (error) {

            console.error(
                '❌ CellWorldUI: FAILED TO OPEN INSIDE CELL',
                error
            )


            this.isExperimentOpen =
                false

            this.activeExperiment =
                null


            this.show()
        }
    }


    /* =====================================================
       OPEN CELL GATEWAY
       ===================================================== */

    openCellGateway() {

        console.log(
            '🧫 CellWorldUI: OPEN CELL GATEWAY'
        )


        if (
            this.isExperimentOpen
        ) {
            return
        }


        try {

            if (
                !this.cellGateExperiment
            ) {

                this.cellGateExperiment =
                    new CellGateExperiment(
                        this.scene,
                        this
                    )

            }


            if (
                typeof this.cellGateExperiment.setParent ===
                    'function'
            ) {

                this.cellGateExperiment.setParent(
                    this
                )
            }


            if (
                typeof this.cellGateExperiment.setScene ===
                    'function'
            ) {

                this.cellGateExperiment.setScene(
                    this.scene
                )
            }


            this.activeExperiment =
                'cellGateway'


            this.isExperimentOpen =
                true


            this.hide()


            if (
                typeof this.cellGateExperiment.show ===
                    'function'
            ) {

                this.cellGateExperiment.show()
            }


            console.log(
                '🧫 CellWorldUI: CELL GATEWAY OPENED'
            )

        } catch (error) {

            console.error(
                '❌ CellWorldUI: FAILED TO OPEN CELL GATEWAY',
                error
            )


            this.isExperimentOpen =
                false

            this.activeExperiment =
                null


            this.show()
        }
    }


    /* =====================================================
       CLOSE ACTIVE EXPERIMENT
       ===================================================== */

    closeActiveExperiment() {

        console.log(
            '🧫 CellWorldUI: CLOSE ACTIVE EXPERIMENT',
            this.activeExperiment
        )


        if (
            this.activeExperiment ===
            'insideCell'
        ) {

            if (
                this.insideCellExperiment
            ) {

                if (
                    typeof this.insideCellExperiment.hide ===
                        'function'
                ) {

                    this.insideCellExperiment.hide()

                } else if (
                    typeof this.insideCellExperiment.close ===
                        'function'
                ) {

                    this.insideCellExperiment.close()
                }
            }
        }


        if (
            this.activeExperiment ===
            'cellGateway'
        ) {

            if (
                this.cellGateExperiment
            ) {

                if (
                    typeof this.cellGateExperiment.hide ===
                        'function'
                ) {

                    this.cellGateExperiment.hide()

                } else if (
                    typeof this.cellGateExperiment.close ===
                        'function'
                ) {

                    this.cellGateExperiment.close()
                }
            }
        }


        this.isExperimentOpen =
            false


        this.activeExperiment =
            null


        this.show()
    }


    /* =====================================================
       RETURN TO BIOLOGY WORLD
       ===================================================== */

    returnToBiologyWorld() {

        console.log(
            '🧫 CellWorldUI: RETURN TO BIOLOGY WORLD'
        )


        if (
            this.isTransitioning
        ) {
            return
        }


        /* -------------------------------------------------
           IF EXPERIMENT IS OPEN
           FIRST CLICK CLOSES EXPERIMENT
           ------------------------------------------------- */

        if (
            this.isExperimentOpen
        ) {

            this.closeActiveExperiment()

            return
        }


        this.isTransitioning =
            true


        this.hide()


        requestAnimationFrame(
            () => {

                this.isTransitioning =
                    false


                if (
                    this.biologyWorldUI &&
                    typeof this.biologyWorldUI.returnFromCellWorld ===
                        'function'
                ) {

                    this.biologyWorldUI.returnFromCellWorld()

                    return
                }


                if (
                    this.biologyWorldUI &&
                    typeof this.biologyWorldUI.show ===
                        'function'
                ) {

                    this.biologyWorldUI.show()
                }

            }
        )
    }


    /* =====================================================
       UPDATE
       ===================================================== */

    update(
        delta = 0.016
    ) {

        /* -------------------------------------------------
           INSIDE CELL
           ------------------------------------------------- */

        if (
            this.isExperimentOpen &&
            this.activeExperiment ===
                'insideCell' &&
            this.insideCellExperiment
        ) {

            try {

                this.insideCellExperiment.update(
                    delta
                )

            } catch (error) {

                console.error(
                    '❌ CellWorldUI: InsideCellExperiment.update() FAILED',
                    error
                )


                this.isExperimentOpen =
                    false

                this.activeExperiment =
                    null
            }


            return
        }


        /* -------------------------------------------------
           CELL GATEWAY
           ------------------------------------------------- */

        if (
            this.isExperimentOpen &&
            this.activeExperiment ===
                'cellGateway' &&
            this.cellGateExperiment
        ) {

            try {

                this.cellGateExperiment.update(
                    delta
                )

            } catch (error) {

                console.error(
                    '❌ CellWorldUI: CellGateExperiment.update() FAILED',
                    error
                )


                this.isExperimentOpen =
                    false

                this.activeExperiment =
                    null
            }


            return
        }


        if (
            !this.active
        ) {
            return
        }
    }


    /* =====================================================
       SET SCENE
       ===================================================== */

    setScene(
        scene
    ) {

        console.log(
            '🧫 CellWorldUI: SET SCENE'
        )


        this.scene =
            scene


        /* -------------------------------------------------
           INSIDE CELL
           ------------------------------------------------- */

        if (
            this.insideCellExperiment &&
            typeof this.insideCellExperiment.setScene ===
                'function'
        ) {

            try {

                this.insideCellExperiment.setScene(
                    scene
                )

            } catch (error) {

                console.error(
                    '❌ CellWorldUI: InsideCellExperiment.setScene() FAILED',
                    error
                )
            }
        }


        /* -------------------------------------------------
           CELL GATEWAY
           ------------------------------------------------- */

        if (
            this.cellGateExperiment &&
            typeof this.cellGateExperiment.setScene ===
                'function'
        ) {

            try {

                this.cellGateExperiment.setScene(
                    scene
                )

            } catch (error) {

                console.error(
                    '❌ CellWorldUI: CellGateExperiment.setScene() FAILED',
                    error
                )
            }
        }


        return this
    }


    /* =====================================================
       SET BIOLOGY WORLD
       ===================================================== */

    setBiologyWorld(
        biologyWorldUI
    ) {

        this.biologyWorldUI =
            biologyWorldUI


        return this
    }


    /* =====================================================
       RESPONSIVE LAYOUT
       ===================================================== */

    updateResponsiveLayout() {

        if (
            !this.root
        ) {
            return
        }


        const width =
            window.innerWidth


        if (
            width <= 640
        ) {

            this.root.dataset.layout =
                'mobile'

        } else if (
            width <= 1000
        ) {

            this.root.dataset.layout =
                'tablet'

        } else {

            this.root.dataset.layout =
                'desktop'
        }
    }


    /* =====================================================
       IS OPEN
       ===================================================== */

    isOpen() {

        return (
            this.active === true
        )
    }


    /* =====================================================
       IS EXPERIMENT ACTIVE
       ===================================================== */

    isExperimentActive() {

        return (
            this.isExperimentOpen &&
            this.activeExperiment !== null
        )
    }


    /* =====================================================
       REGISTER EXPERIMENT
       ===================================================== */

    registerExperiment(
        key,
        experiment
    ) {

        console.log(
            '🧫 CellWorldUI: REGISTER EXPERIMENT',
            key
        )


        /* -------------------------------------------------
           INSIDE CELL
           ------------------------------------------------- */

        if (
            key ===
            'insideCell'
        ) {

            this.insideCellExperiment =
                experiment


            if (
                experiment &&
                typeof experiment.setParent ===
                    'function'
            ) {

                experiment.setParent(
                    this
                )
            }


            if (
                experiment &&
                typeof experiment.setScene ===
                    'function'
            ) {

                experiment.setScene(
                    this.scene
                )
            }
        }


        /* -------------------------------------------------
           CELL GATEWAY
           ------------------------------------------------- */

        if (
            key ===
            'cellGateway'
        ) {

            this.cellGateExperiment =
                experiment


            if (
                experiment &&
                typeof experiment.setParent ===
                    'function'
            ) {

                experiment.setParent(
                    this
                )
            }


            if (
                experiment &&
                typeof experiment.setScene ===
                    'function'
            ) {

                experiment.setScene(
                    this.scene
                )
            }
        }


        return this
    }


    /* =====================================================
       DESTROY
       ===================================================== */

    destroy() {

        console.log(
            '🧫 CellWorldUI: DESTROY'
        )


        /* -------------------------------------------------
           RESIZE
           ------------------------------------------------- */

        if (
            this.handleResize
        ) {

            window.removeEventListener(
                'resize',
                this.handleResize
            )
        }


        /* -------------------------------------------------
           INSIDE CELL
           ------------------------------------------------- */

        if (
            this.insideCellExperiment
        ) {

            if (
                typeof this.insideCellExperiment.destroy ===
                    'function'
            ) {

                try {

                    this.insideCellExperiment.destroy()

                } catch (error) {

                    console.error(
                        '❌ CellWorldUI: InsideCellExperiment.destroy() FAILED',
                        error
                    )
                }
            }


            this.insideCellExperiment =
                null
        }


        /* -------------------------------------------------
           CELL GATEWAY
           ------------------------------------------------- */

        if (
            this.cellGateExperiment
        ) {

            if (
                typeof this.cellGateExperiment.destroy ===
                    'function'
            ) {

                try {

                    this.cellGateExperiment.destroy()

                } catch (error) {

                    console.error(
                        '❌ CellWorldUI: CellGateExperiment.destroy() FAILED',
                        error
                    )
                }
            }


            this.cellGateExperiment =
                null
        }


        /* -------------------------------------------------
           REMOVE ROOT
           ------------------------------------------------- */

        if (
            this.root &&
            this.root.parentNode
        ) {

            this.root.parentNode.removeChild(
                this.root
            )
        }


        /* -------------------------------------------------
           RESET STATE
           ------------------------------------------------- */

        this.root =
            null

        this.header =
            null

        this.title =
            null

        this.description =
            null

        this.backButton =
            null

        this.experiments =
            null

        this.hint =
            null


        this.active =
            false

        this.isExperimentOpen =
            false

        this.activeExperiment =
            null

        this.isTransitioning =
            false

        this.biologyWorldUI =
            null

        this.scene =
            null


        console.log(
            '🧫 CellWorldUI: DESTROY COMPLETE'
        )
    }
}