import './quantum-world.css'

import QuantumExperiment from '../quantum/QuantumExperiment.js'
import QuantumSuperposition from '../quantum/QuantumSuperposition.js'


export default class QuantumWorldUI {

    /*
     * =====================================================
     * CONSTRUCTOR
     * =====================================================
     */

    constructor(
        physicsWorldUI,
        scene = null
    ) {

        this.physicsWorldUI =
            physicsWorldUI

        this.scene =
            scene


        /*
         * =================================================
         * STATE
         * =================================================
         */

        this.activeExperiment =
            null

        this.isExperimentRunning =
            false


        /*
         * حفظ حالة عناصر المشهد
         */

        this.sceneVisibility =
            new Map()


        /*
         * =================================================
         * EXPERIMENT 1
         * DOUBLE SLIT
         * =================================================
         */

        this.experiment =
            new QuantumExperiment()


        /*
         * =================================================
         * EXPERIMENT 2
         * SUPERPOSITION
         * =================================================
         */

        this.superpositionExperiment =
            new QuantumSuperposition()


        /*
         * =================================================
         * ADD EXPERIMENTS TO SCENE
         * =================================================
         */

        if (
            this.scene &&
            this.experiment &&
            this.experiment.group
        ) {

            this.scene.add(
                this.experiment.group
            )

        }


        if (
            this.scene &&
            this.superpositionExperiment &&
            this.superpositionExperiment.group
        ) {

            this.scene.add(
                this.superpositionExperiment.group
            )

        }


        /*
         * =================================================
         * CREATE UI
         * =================================================
         */

        this.createUI()


        /*
         * =================================================
         * BIND METHODS
         * =================================================
         */

        this.updateExperiment =
            this.updateExperiment.bind(
                this
            )


        this.handleLanguageChange =
            this.handleLanguageChange.bind(
                this
            )


        window.addEventListener(
            'awtaar-language-changed',
            this.handleLanguageChange
        )


        /*
         * =================================================
         * START UPDATE LOOP
         * =================================================
         */

        this.updateExperiment()

    }


    /*
     * =====================================================
     * CREATE UI
     * =====================================================
     */

    createUI() {

        /*
         * =================================================
         * MAIN CONTAINER
         * =================================================
         */

        this.container =
            document.createElement('section')

        this.container.id =
            'awtaar-quantum-world'


        /*
         * =================================================
         * BACKGROUND
         * =================================================
         */

        this.background =
            document.createElement('div')

        this.background.className =
            'quantum-background'


        /*
         * =================================================
         * MAIN CONTENT
         * =================================================
         */

        this.content =
            document.createElement('div')

        this.content.className =
            'quantum-content'


        /*
         * =================================================
         * SYMBOL
         * =================================================
         */

        this.symbol =
            document.createElement('div')

        this.symbol.className =
            'quantum-symbol'

        this.symbol.textContent =
            'Ψ'


        /*
         * =================================================
         * TITLE
         * =================================================
         */

        this.title =
            document.createElement('h1')

        this.title.textContent =
            'عالم فيزياء الكم'


        /*
         * =================================================
         * DESCRIPTION
         * =================================================
         */

        this.description =
            document.createElement('p')

        this.description.textContent =
            'استكشف التجارب التي تكشف السلوك الغريب للعالم الكمي.'


        /*
         * =================================================
         * EXPERIMENT LIST
         * =================================================
         */

        this.experiments =
            document.createElement('div')

        this.experiments.className =
            'quantum-experiments'


        /*
         * =================================================
         * EXPERIMENT DATA
         * =================================================
         */

        this.experimentData = [

            {
                key:
                    'double-slit',

                symbol:
                    '〰',

                title:
                    'تجربة الشق المزدوج',

                description:
                    'راقب كيف تتصرف الجسيمات كموجات وتكوّن نمط التداخل.'
            },


            {
                key:
                    'superposition',

                symbol:
                    'Ψ',

                title:
                    'التراكب الكمي',

                description:
                    'استكشف كيف يمكن للنظام الكمي أن يوجد في حالات متعددة.'
            },


            {
                key:
                    'quantum-tunneling',

                symbol:
                    '↗',

                title:
                    'النفق الكمي',

                description:
                    'كيف يعبر الجسيم حاجزًا لا يستطيع عبوره وفق الفيزياء الكلاسيكية؟'
            },


            {
                key:
                    'entanglement',

                symbol:
                    '∞',

                title:
                    'التشابك الكمي',

                description:
                    'استكشف العلاقة الغريبة بين جسيمين متشابكين.'
            },


            {
                key:
                    'uncertainty',

                symbol:
                    'Δ',

                title:
                    'مبدأ عدم اليقين',

                description:
                    'لماذا لا يمكن معرفة بعض خصائص الجسيم بدقة مطلقة في الوقت نفسه؟'
            }

        ]


        /*
         * =================================================
         * CREATE EXPERIMENT CARDS
         * =================================================
         */

        this.experimentData.forEach(
            (experiment) => {

                const item =
                    document.createElement('button')


                item.type =
                    'button'


                item.className =
                    'quantum-experiment-item'


                item.dataset.experiment =
                    experiment.key


                /*
                 * SYMBOL
                 */

                const experimentSymbol =
                    document.createElement('span')


                experimentSymbol.className =
                    'quantum-experiment-symbol'


                experimentSymbol.textContent =
                    experiment.symbol


                /*
                 * INFORMATION
                 */

                const information =
                    document.createElement('span')


                information.className =
                    'quantum-experiment-information'


                /*
                 * TITLE
                 */

                const experimentTitle =
                    document.createElement('strong')


                experimentTitle.className =
                    'quantum-experiment-name'


                experimentTitle.textContent =
                    experiment.title


                /*
                 * DESCRIPTION
                 */

                const experimentDescription =
                    document.createElement('small')


                experimentDescription.className =
                    'quantum-experiment-description'


                experimentDescription.textContent =
                    experiment.description


                /*
                 * BUILD INFORMATION
                 */

                information.appendChild(
                    experimentTitle
                )


                information.appendChild(
                    experimentDescription
                )


                /*
                 * BUILD CARD
                 */

                item.appendChild(
                    experimentSymbol
                )


                item.appendChild(
                    information
                )


                /*
                 * =================================================
                 * CARD CLICK
                 * =================================================
                 */

                item.addEventListener(
                    'click',
                    (event) => {

                        event.preventDefault()

                        event.stopPropagation()


                        if (
                            this.isExperimentRunning
                        ) {

                            return

                        }


                        this.openExperiment(
                            experiment.key
                        )

                    }
                )


                this.experiments.appendChild(
                    item
                )

            }
        )


        /*
         * =================================================
         * BACK BUTTON
         * =================================================
         */

        this.backButton =
            document.createElement('button')


        this.backButton.type =
            'button'


        this.backButton.className =
            'quantum-back-button'


        this.backButton.textContent =
            'العودة إلى عالم الفيزياء'


        this.backButton.addEventListener(
            'click',
            (event) => {

                event.preventDefault()

                event.stopPropagation()


                if (
                    this.isExperimentRunning
                ) {

                    return

                }


                this.returnToPhysics()

            }
        )


        /*
         * =================================================
         * EXPERIMENT UI
         * =================================================
         */

        this.experimentUI =
            document.createElement('div')


        this.experimentUI.className =
            'quantum-experiment-ui'


        /*
         * =================================================
         * EXPERIMENT TITLE
         * =================================================
         */

        this.experimentTitle =
            document.createElement('div')


        this.experimentTitle.className =
            'quantum-experiment-title'


        this.experimentTitle.textContent =
            'تجربة الشق المزدوج'


        /*
         * =================================================
         * EXPERIMENT HINT
         * =================================================
         */

        this.experimentHint =
            document.createElement('div')


        this.experimentHint.className =
            'quantum-experiment-hint'


        this.experimentHint.textContent =
            'راقب وصول الفوتونات وتكوّن نمط التداخل.'


        /*
         * =================================================
         * SUPERPOSITION CONTROLS
         * =================================================
         */

        this.superpositionControls =
            document.createElement('div')

        this.superpositionControls.className =
            'quantum-superposition-controls'


        /*
         * MEASURE BUTTON
         */

        this.measureButton =
            document.createElement('button')

        this.measureButton.type =
            'button'

        this.measureButton.className =
            'quantum-measure-button'

        this.measureButton.textContent =
            'قياس الحالة'


        /*
         * RESET BUTTON
         */

        this.resetSuperpositionButton =
            document.createElement('button')

        this.resetSuperpositionButton.type =
            'button'

        this.resetSuperpositionButton.className =
            'quantum-reset-button'

        this.resetSuperpositionButton.textContent =
            'إعادة التجربة'


        /*
         * BUILD SUPERPOSITION CONTROLS
         */

        this.superpositionControls.appendChild(
            this.measureButton
        )

        this.superpositionControls.appendChild(
            this.resetSuperpositionButton
        )


        /*
         * HIDE CONTROLS INITIALLY
         */

        this.superpositionControls.style.display =
            'none'


        /*
         * =================================================
         * EXIT BUTTON
         * =================================================
         */

        this.exitExperimentButton =
            document.createElement('button')


        this.exitExperimentButton.type =
            'button'


        this.exitExperimentButton.className =
            'quantum-exit-experiment-button'


        this.exitExperimentButton.textContent =
            'خروج من التجربة'


        /*
         * =================================================
         * BUILD EXPERIMENT UI
         * =================================================
         */

        this.experimentUI.appendChild(
            this.experimentTitle
        )


        this.experimentUI.appendChild(
            this.experimentHint
        )


        this.experimentUI.appendChild(
            this.superpositionControls
        )


        this.experimentUI.appendChild(
            this.exitExperimentButton
        )


        /*
         * HIDE EXPERIMENT UI
         */

        this.experimentUI.style.display =
            'none'


        /*
         * =================================================
         * BUILD MAIN CONTENT
         * =================================================
         */

        this.content.appendChild(
            this.symbol
        )


        this.content.appendChild(
            this.title
        )


        this.content.appendChild(
            this.description
        )


        this.content.appendChild(
            this.experiments
        )


        this.content.appendChild(
            this.backButton
        )


        /*
         * =================================================
         * ADD TO CONTAINER
         * =================================================
         */

        this.container.appendChild(
            this.background
        )


        this.container.appendChild(
            this.content
        )


        this.container.appendChild(
            this.experimentUI
        )


        /*
         * =================================================
         * ADD TO DOM
         * =================================================
         */

        document.body.appendChild(
            this.container
        )


        /*
         * =================================================
         * INITIAL STATE
         * =================================================
         */

        this.container.style.display =
            'none'


        this.container.style.visibility =
            'hidden'


        this.container.style.opacity =
            '0'


        this.container.style.pointerEvents =
            'none'


        /*
         * =================================================
         * HIDE EXPERIMENTS
         * =================================================
         */

        if (
            this.experiment &&
            this.experiment.group
        ) {

            this.experiment.group.visible =
                false

        }


        if (
            this.superpositionExperiment &&
            this.superpositionExperiment.group
        ) {

            this.superpositionExperiment.group.visible =
                false

        }


        /*
         * =================================================
         * EXIT BUTTON EVENT
         * =================================================
         */

        this.exitExperimentButton.addEventListener(
            'click',
            (event) => {

                event.preventDefault()

                event.stopPropagation()


                this.exitExperiment()

            }
        )


        /*
         * =================================================
         * MEASURE EVENT
         * =================================================
         */

        this.measureButton.addEventListener(
            'click',
            (event) => {

                event.preventDefault()

                event.stopPropagation()


                if (
                    !this.isExperimentRunning ||
                    this.activeExperiment !==
                    'superposition'
                ) {

                    return

                }


                if (
                    this.superpositionExperiment &&
                    typeof this.superpositionExperiment.measure ===
                    'function'
                ) {

                    this.superpositionExperiment.measure()

                }

            }
        )


        /*
         * =================================================
         * RESET SUPERPOSITION EVENT
         * =================================================
         */

        this.resetSuperpositionButton.addEventListener(
            'click',
            (event) => {

                event.preventDefault()

                event.stopPropagation()


                if (
                    !this.isExperimentRunning ||
                    this.activeExperiment !==
                    'superposition'
                ) {

                    return

                }


                if (
                    this.superpositionExperiment &&
                    typeof this.superpositionExperiment.reset ===
                    'function'
                ) {

                    this.superpositionExperiment.reset()

                }

            }
        )

    }


    /*
     * =====================================================
     * UPDATE EXPERIMENTS
     * =====================================================
     */

    updateExperiment() {

        requestAnimationFrame(
            this.updateExperiment
        )


        /*
         * =================================================
         * DOUBLE SLIT
         * =================================================
         */

        if (
            this.experiment &&
            this.experiment.active
        ) {

            this.experiment.update()

        }


        /*
         * =================================================
         * SUPERPOSITION
         * =================================================
         */

        if (
            this.superpositionExperiment &&
            this.superpositionExperiment.active
        ) {

            this.superpositionExperiment.update()

        }

    }


    /*
     * =====================================================
     * LANGUAGE CHANGE
     * =====================================================
     */

    handleLanguageChange(
        event
    ) {

        const language =
            event &&
            event.detail &&
            event.detail.language
                ? event.detail.language
                : this.getCurrentLanguage()


        this.updateLanguage(
            language
        )

    }


    /*
     * =====================================================
     * GET CURRENT LANGUAGE
     * =====================================================
     */

    getCurrentLanguage() {

        const savedLanguage =
            localStorage.getItem(
                'awtaar-language'
            )


        return savedLanguage === 'en'
            ? 'en'
            : 'ar'

    }


    /*
     * =====================================================
     * APPLY LANGUAGE DIRECTION
     * =====================================================
     */

    applyLanguageDirection(
        language
    ) {

        const direction =
            language === 'en'
                ? 'ltr'
                : 'rtl'


        this.container.dir =
            direction

        this.container.style.direction =
            direction


        this.content.dir =
            direction

        this.content.style.direction =
            direction


        this.experiments.dir =
            direction

        this.experiments.style.direction =
            direction


        /*
         * =================================================
         * EXPERIMENT CARDS
         * =================================================
         */

        const items =
            this.experiments.querySelectorAll(
                '.quantum-experiment-item'
            )


        items.forEach(
            (item) => {

                item.dir =
                    direction

                item.style.direction =
                    direction


                const information =
                    item.querySelector(
                        '.quantum-experiment-information'
                    )


                if (
                    information
                ) {

                    information.dir =
                        direction

                    information.style.direction =
                        direction

                    information.style.textAlign =
                        language === 'en'
                            ? 'left'
                            : 'right'

                }


                const title =
                    item.querySelector(
                        '.quantum-experiment-name'
                    )


                const description =
                    item.querySelector(
                        '.quantum-experiment-description'
                    )


                if (
                    title
                ) {

                    title.dir =
                        direction

                    title.style.textAlign =
                        language === 'en'
                            ? 'left'
                            : 'right'

                }


                if (
                    description
                ) {

                    description.dir =
                        direction

                    description.style.textAlign =
                        language === 'en'
                            ? 'left'
                            : 'right'

                }

            }
        )


        /*
         * =================================================
         * BACK BUTTON
         * =================================================
         */

        this.backButton.dir =
            direction

        this.backButton.style.direction =
            direction


        /*
         * =================================================
         * EXPERIMENT UI
         * =================================================
         */

        this.experimentUI.dir =
            direction

        this.experimentUI.style.direction =
            direction


        this.experimentTitle.dir =
            direction

        this.experimentHint.dir =
            direction

        this.measureButton.dir =
            direction

        this.resetSuperpositionButton.dir =
            direction

        this.exitExperimentButton.dir =
            direction


        /*
         * =================================================
         * TEXT ALIGNMENT
         * ================================================= */

        const textAlign =
            language === 'en'
                ? 'left'
                : 'right'


        this.experimentTitle.style.textAlign =
            textAlign


        this.experimentHint.style.textAlign =
            textAlign

    }


    /*
     * =====================================================
     * SHOW
     * =====================================================
     */

    show() {

        console.log(
            '⚛️ Showing Quantum World'
        )


        const language =
            this.getCurrentLanguage()


        this.updateLanguage(
            language
        )


        this.applyLanguageDirection(
            language
        )


        /*
         * لا توجد تجربة مفتوحة عند العودة
         */

        if (
            this.isExperimentRunning
        ) {

            this.exitExperiment()

        }


        /*
         * =================================================
         * SHOW CONTAINER
         * =================================================
         */

        this.container.style.display =
            'flex'

        this.container.style.visibility =
            'visible'

        this.container.style.pointerEvents =
            'auto'

        this.container.style.opacity =
            '0'


        /*
         * =================================================
         * MAIN WORLD
         * =================================================
         */

        this.background.style.display =
            'block'

        this.content.style.display =
            'flex'


        this.experimentUI.style.display =
            'none'


        this.superpositionControls.style.display =
            'none'


        /*
         * =================================================
         * HIDE EXPERIMENTS
         * =================================================
         */

        if (
            this.experiment &&
            this.experiment.group
        ) {

            this.experiment.group.visible =
                false

        }


        if (
            this.superpositionExperiment &&
            this.superpositionExperiment.group
        ) {

            this.superpositionExperiment.group.visible =
                false

        }


        /*
         * =================================================
         * ENABLE CARDS
         * =================================================
         */

        const items =
            this.experiments.querySelectorAll(
                '.quantum-experiment-item'
            )


        items.forEach(
            (item) => {

                item.disabled =
                    false

                item.style.pointerEvents =
                    'auto'

            }
        )


        this.backButton.disabled =
            false


        this.backButton.style.pointerEvents =
            'auto'


        /*
         * =================================================
         * FADE IN
         * =================================================
         */

        requestAnimationFrame(
            () => {

                this.container.style.opacity =
                    '1'

            }
        )

    }


    /*
     * =====================================================
     * HIDE
     * =====================================================
     */

    hide() {

        console.log(
            '⚛️ Hiding Quantum World'
        )


        if (
            this.isExperimentRunning
        ) {

            this.exitExperiment()
        }


        this.container.style.opacity =
            '0'


        this.container.style.pointerEvents =
            'none'


        setTimeout(
            () => {

                if (
                    this.container.style.opacity ===
                    '0'
                ) {

                    this.container.style.visibility =
                        'hidden'

                    this.container.style.display =
                        'none'

                }

            },
            700
        )

    }


    /*
     * =====================================================
     * OPEN EXPERIMENT
     * =====================================================
     */

    openExperiment(
        key
    ) {

        console.log(
            `⚛️ Opening Quantum Experiment: ${key}`
        )


        if (
            this.isExperimentRunning
        ) {

            return

        }


        /*
         * =================================================
         * DOUBLE SLIT
         * =================================================
         */

        if (
            key === 'double-slit'
        ) {

            this.startDoubleSlitExperiment()

            return

        }


        /*
         * =================================================
         * SUPERPOSITION
         * =================================================
         */

        if (
            key === 'superposition'
        ) {

            this.startSuperpositionExperiment()

            return

        }


        /*
         * =================================================
         * FUTURE EXPERIMENTS
         * =================================================
         */

        console.log(
            `🌌 Quantum Experiment "${key}" Coming Soon`
        )

    }


    /*
     * =====================================================
     * START DOUBLE SLIT
     * =====================================================
     */

    startDoubleSlitExperiment() {

        console.log(
            '〰️ Starting Double-Slit Experiment'
        )


        this.isExperimentRunning =
            true


        this.activeExperiment =
            'double-slit'


        const language =
            this.getCurrentLanguage()


        /*
         * =================================================
         * UPDATE LANGUAGE
         * =================================================
         */

        this.updateLanguage(
            language
        )


        /*
         * =================================================
         * APPLY LANGUAGE DIRECTION
         * =================================================
         */

        this.applyLanguageDirection(
            language
        )


        /*
         * =================================================
         * DISABLE CARDS
         * =================================================
         */

        const items =
            this.experiments.querySelectorAll(
                '.quantum-experiment-item'
            )


        items.forEach(
            (item) => {

                item.disabled =
                    true

                item.style.pointerEvents =
                    'none'

            }
        )


        this.backButton.disabled =
            true


        /*
         * =================================================
         * HIDE QUANTUM WORLD UI
         * =================================================
         */

        this.background.style.display =
            'none'

        this.content.style.display =
            'none'


        /*
         * =================================================
         * SHOW EXPERIMENT UI
         * =================================================
         */

        this.experimentUI.style.display =
            'block'

        this.experimentUI.style.opacity =
            '1'


        /*
         * DOUBLE SLIT DOES NOT NEED
         * SUPERPOSITION CONTROLS
         */

        this.superpositionControls.style.display =
            'none'


        /*
         * =================================================
         * HIDE MAIN SCENE
         * =================================================
         */

        this.hideMainScene()


        /*
         * =================================================
         * MAKE SURE SUPERPOSITION IS HIDDEN
         * =================================================
         */

        if (
            this.superpositionExperiment
        ) {

            this.superpositionExperiment.stop()

        }


        if (
            this.superpositionExperiment &&
            this.superpositionExperiment.group
        ) {

            this.superpositionExperiment.group.visible =
                false

        }


        /*
         * =================================================
         * START DOUBLE SLIT
         * =================================================
         */

        if (
            this.experiment
        ) {

            this.experiment.start()

        }


        if (
            this.experiment &&
            this.experiment.group
        ) {

            this.experiment.group.visible =
                true

        }


        /*
         * =================================================
         * SHOW CONTAINER
         * =================================================
         */

        this.container.style.display =
            'flex'

        this.container.style.visibility =
            'visible'

        this.container.style.opacity =
            '1'

        this.container.style.pointerEvents =
            'auto'

    }


    /*
     * =====================================================
     * START SUPERPOSITION
     * =====================================================
     */

    startSuperpositionExperiment() {

        console.log(
            'Ψ Starting Quantum Superposition Experiment'
        )


        this.isExperimentRunning =
            true


        this.activeExperiment =
            'superposition'


        const language =
            this.getCurrentLanguage()


        /*
         * =================================================
         * DIRECTION
         * =================================================
         */

        this.applyLanguageDirection(
            language
        )


        /*
         * =================================================
         * DISABLE EXPERIMENT CARDS
         * =================================================
         */

        const items =
            this.experiments.querySelectorAll(
                '.quantum-experiment-item'
            )


        items.forEach(
            (item) => {

                item.disabled =
                    true

                item.style.pointerEvents =
                    'none'

            }
        )


        this.backButton.disabled =
            true


        /*
         * =================================================
         * HIDE MAIN QUANTUM WORLD
         * =================================================
         */

        this.background.style.display =
            'none'

        this.content.style.display =
            'none'


        /*
         * =================================================
         * SHOW EXPERIMENT UI
         * =================================================
         */

        /*
         * IMPORTANT:
         * Use block instead of flex.
         *
         * This prevents the experiment UI
         * from distributing its children horizontally.
         */

        this.experimentUI.style.display =
            'block'

        this.experimentUI.style.opacity =
            '1'


        /*
         * =================================================
         * SHOW SUPERPOSITION CONTROLS
         * =================================================
         */

        this.superpositionControls.style.display =
            'flex'


        /*
         * =================================================
         * STOP DOUBLE SLIT
         * =================================================
         */

        if (
            this.experiment
        ) {

            this.experiment.stop()

        }


        if (
            this.experiment &&
            this.experiment.group
        ) {

            this.experiment.group.visible =
                false

        }


        /*
         * =================================================
         * HIDE MAIN UNIVERSE
         * =================================================
         */

        this.hideMainScene()


        /*
         * =================================================
         * RESET SUPERPOSITION
         * =================================================
         */

        if (
            this.superpositionExperiment
        ) {

            if (
                typeof this.superpositionExperiment.reset ===
                'function'
            ) {

                this.superpositionExperiment.reset()

            }


            this.superpositionExperiment.start()

        }


        /*
         * =================================================
         * SHOW SUPERPOSITION SCENE
         * =================================================
         */

        if (
            this.superpositionExperiment &&
            this.superpositionExperiment.group
        ) {

            this.superpositionExperiment.group.visible =
                true

        }


        /*
         * =================================================
         * SHOW CONTAINER
         * =================================================
         */

        this.container.style.display =
            'flex'

        this.container.style.visibility =
            'visible'

        this.container.style.opacity =
            '1'

        this.container.style.pointerEvents =
            'auto'


        /*
         * =================================================
         * UPDATE TITLE
         * =================================================
         */

        this.updateLanguage(
            language
        )

    }


    /*
     * =====================================================
     * EXIT EXPERIMENT
     * =====================================================
     */

    exitExperiment() {

        console.log(
            '⏹️ Exiting Quantum Experiment'
        )


        this.isExperimentRunning =
            false


        this.activeExperiment =
            null


        /*
         * =================================================
         * STOP DOUBLE SLIT
         * =================================================
         */

        if (
            this.experiment
        ) {

            this.experiment.stop()

        }


        /*
         * =================================================
         * STOP SUPERPOSITION
         * =================================================
         */

        if (
            this.superpositionExperiment
        ) {

            this.superpositionExperiment.stop()

        }


        /*
         * =================================================
         * HIDE EXPERIMENTS
         * =================================================
         */

        if (
            this.experiment &&
            this.experiment.group
        ) {

            this.experiment.group.visible =
                false

        }


        if (
            this.superpositionExperiment &&
            this.superpositionExperiment.group
        ) {

            this.superpositionExperiment.group.visible =
                false

        }


        /*
         * =================================================
         * RESTORE MAIN UNIVERSE
         * =================================================
         */

        this.restoreMainScene()


        /*
         * =================================================
         * HIDE EXPERIMENT UI
         * =================================================
         */

        this.experimentUI.style.display =
            'none'


        this.superpositionControls.style.display =
            'none'


        /*
         * =================================================
         * RESTORE QUANTUM WORLD
         * =================================================
         */

        this.background.style.display =
            'block'

        this.content.style.display =
            'flex'


        /*
         * =================================================
         * ENABLE CARDS
         * =================================================
         */

        const items =
            this.experiments.querySelectorAll(
                '.quantum-experiment-item'
            )


        items.forEach(
            (item) => {

                item.disabled =
                    false

                item.style.pointerEvents =
                    'auto'

            }
        )


        this.backButton.disabled =
            false

        this.backButton.style.pointerEvents =
            'auto'


        /*
         * =================================================
         * KEEP QUANTUM WORLD VISIBLE
         * =================================================
         */

        this.container.style.display =
            'flex'

        this.container.style.visibility =
            'visible'

        this.container.style.opacity =
            '1'

        this.container.style.pointerEvents =
            'auto'


        /*
         * =================================================
         * LANGUAGE
         * =================================================
         */

        const language =
            this.getCurrentLanguage()


        this.updateLanguage(
            language
        )


        this.applyLanguageDirection(
            language
        )


        console.log(
            '⚛️ Returned to Quantum Experiments'
        )

    }


    /*
     * =====================================================
     * HIDE MAIN SCENE
     * =====================================================
     */

    hideMainScene() {

        if (
            !this.scene
        ) {

            return

        }


        this.sceneVisibility.clear()


        this.scene.children.forEach(
            (object) => {

                if (
                    object ===
                    this.experiment.group
                ) {

                    return

                }


                if (
                    object ===
                    this.superpositionExperiment.group
                ) {

                    return

                }


                this.sceneVisibility.set(
                    object,
                    object.visible
                )


                object.visible =
                    false

            }
        )


        console.log(
            '🌑 Main universe hidden for quantum experiment'
        )

    }


    /*
     * =====================================================
     * RESTORE MAIN SCENE
     * =====================================================
     */

    restoreMainScene() {

        if (
            !this.scene
        ) {

            return

        }


        this.sceneVisibility.forEach(
            (
                visible,
                object
            ) => {

                if (
                    object
                ) {

                    object.visible =
                        visible

                }

            }
        )


        this.sceneVisibility.clear()


        console.log(
            '🌌 Main universe restored'
        )

    }


    /*
     * =====================================================
     * RETURN TO PHYSICS WORLD
     * =====================================================
     */

    returnToPhysics() {

        console.log(
            '↩️ Returning to Physics World'
        )


        if (
            this.isExperimentRunning
        ) {

            this.exitExperiment()

        }


        if (
            this.experiment
        ) {

            this.experiment.stop()

        }


        if (
            this.superpositionExperiment
        ) {

            this.superpositionExperiment.stop()

        }


        if (
            this.experiment &&
            this.experiment.group
        ) {

            this.experiment.group.visible =
                false

        }


        if (
            this.superpositionExperiment &&
            this.superpositionExperiment.group
        ) {

            this.superpositionExperiment.group.visible =
                false

        }


        this.container.style.opacity =
            '0'

        this.container.style.pointerEvents =
            'none'


        setTimeout(
            () => {

                this.container.style.visibility =
                    'hidden'

                this.container.style.display =
                    'none'


                if (
                    this.physicsWorldUI &&
                    typeof this.physicsWorldUI.show ===
                    'function'
                ) {

                    this.physicsWorldUI.show()

                }

            },
            700
        )

    }


    /*
     * =====================================================
     * UPDATE LANGUAGE
     * =====================================================
     */

    updateLanguage(
        language = null
    ) {

        if (
            !language
        ) {

            language =
                this.getCurrentLanguage()

        }


        language =
            language === 'en'
                ? 'en'
                : 'ar'


        /*
         * =================================================
         * MAIN QUANTUM WORLD
         * =================================================
         */

        if (
            language === 'en'
        ) {

            this.title.textContent =
                'Quantum Physics'


            this.description.textContent =
                'Explore experiments that reveal the strange behavior of the quantum world.'


            this.backButton.textContent =
                'Back to Physics World'


            /*
             * DOUBLE SLIT
             */

            this.experimentData[0].title =
                'Double-Slit Experiment'

            this.experimentData[0].description =
                'Observe how particles behave like waves and create an interference pattern.'


            /*
             * SUPERPOSITION
             */

            this.experimentData[1].title =
                'Quantum Superposition'

            this.experimentData[1].description =
                'Explore how a quantum system can exist in multiple states.'


            /*
             * TUNNELING
             */

            this.experimentData[2].title =
                'Quantum Tunneling'

            this.experimentData[2].description =
                'How can a particle cross a barrier that classical physics says it cannot cross?'


            /*
             * ENTANGLEMENT
             */

            this.experimentData[3].title =
                'Quantum Entanglement'

            this.experimentData[3].description =
                'Explore the strange connection between entangled particles.'


            /*
             * UNCERTAINTY
             */

            this.experimentData[4].title =
                'Uncertainty Principle'

            this.experimentData[4].description =
                'Why can some properties of a quantum particle not be known with absolute precision at the same time?'

        }


        else {

            this.title.textContent =
                'عالم فيزياء الكم'


            this.description.textContent =
                'استكشف التجارب التي تكشف السلوك الغريب للعالم الكمي.'


            this.backButton.textContent =
                'العودة إلى عالم الفيزياء'


            /*
             * DOUBLE SLIT
             */

            this.experimentData[0].title =
                'تجربة الشق المزدوج'

            this.experimentData[0].description =
                'راقب كيف تتصرف الجسيمات كموجات وتكوّن نمط التداخل.'


            /*
             * SUPERPOSITION
             */

            this.experimentData[1].title =
                'التراكب الكمي'

            this.experimentData[1].description =
                'استكشف كيف يمكن للنظام الكمي أن يوجد في حالات متعددة.'


            /*
             * TUNNELING
             */

            this.experimentData[2].title =
                'النفق الكمي'

            this.experimentData[2].description =
                'كيف يعبر الجسيم حاجزًا لا يستطيع عبوره وفق الفيزياء الكلاسيكية؟'


            /*
             * ENTANGLEMENT
             */

            this.experimentData[3].title =
                'التشابك الكمي'

            this.experimentData[3].description =
                'استكشف العلاقة الغريبة بين جسيمين متشابكين.'


            /*
             * UNCERTAINTY
             */

            this.experimentData[4].title =
                'مبدأ عدم اليقين'

            this.experimentData[4].description =
                'لماذا لا يمكن معرفة بعض خصائص الجسيم بدقة مطلقة في الوقت نفسه؟'

        }


        /*
         * =================================================
         * ACTIVE EXPERIMENT UI
         * =================================================
         */

        if (
            this.activeExperiment ===
            'double-slit'
        ) {

            if (
                language === 'en'
            ) {

                this.experimentTitle.textContent =
                    'Double-Slit Experiment'

                this.experimentHint.textContent =
                    'Watch photons arrive and form an interference pattern.'

                this.exitExperimentButton.textContent =
                    'Exit Experiment'

            }

            else {

                this.experimentTitle.textContent =
                    'تجربة الشق المزدوج'

                this.experimentHint.textContent =
                    'راقب وصول الفوتونات وتكوّن نمط التداخل.'

                this.exitExperimentButton.textContent =
                    'خروج من التجربة'

            }

        }


        /*
         * =================================================
         * SUPERPOSITION UI
         * =================================================
         */

        if (
            this.activeExperiment ===
            'superposition'
        ) {

            if (
                language === 'en'
            ) {

                this.experimentTitle.textContent =
                    'Quantum Superposition'

                this.experimentHint.textContent =
                    'A quantum system can exist in multiple possible states until it is measured.'

                this.measureButton.textContent =
                    'Measure State'

                this.resetSuperpositionButton.textContent =
                    'Reset Experiment'

                this.exitExperimentButton.textContent =
                    'Exit Experiment'

            }

            else {

                this.experimentTitle.textContent =
                    'التراكب الكمي'

                this.experimentHint.textContent =
                    'يمكن للنظام الكمي أن يوجد في حالات متعددة حتى تتم عملية القياس.'

                this.measureButton.textContent =
                    'قياس الحالة'

                this.resetSuperpositionButton.textContent =
                    'إعادة التجربة'

                this.exitExperimentButton.textContent =
                    'خروج من التجربة'

            }

        }


        /*
         * =================================================
         * UPDATE CARDS
         * =================================================
         */

        const items =
            this.experiments.querySelectorAll(
                '.quantum-experiment-item'
            )


        items.forEach(
            (
                item,
                index
            ) => {

                const experiment =
                    this.experimentData[index]


                if (
                    !experiment
                ) {

                    return

                }


                const title =
                    item.querySelector(
                        '.quantum-experiment-name'
                    )


                const description =
                    item.querySelector(
                        '.quantum-experiment-description'
                    )


                if (
                    title
                ) {

                    title.textContent =
                        experiment.title

                }


                if (
                    description
                ) {

                    description.textContent =
                        experiment.description

                }

            }
        )


        /*
         * =================================================
         * APPLY DIRECTION
         * =================================================
         */

        this.applyLanguageDirection(
            language
        )

    }


    /*
     * =====================================================
     * DESTROY
     * =====================================================
     */

    destroy() {

        /*
         * =================================================
         * REMOVE LANGUAGE LISTENER
         * =================================================
         */

        if (
            this.handleLanguageChange
        ) {

            window.removeEventListener(
                'awtaar-language-changed',
                this.handleLanguageChange
            )

        }


        /*
         * =================================================
         * STOP DOUBLE SLIT
         * =================================================
         */

        if (
            this.experiment
        ) {

            this.experiment.stop()

        }


        /*
         * =================================================
         * STOP SUPERPOSITION
         * =================================================
         */

        if (
            this.superpositionExperiment
        ) {

            this.superpositionExperiment.stop()

        }


        /*
         * =================================================
         * RESTORE MAIN SCENE
         * =================================================
         */

        this.restoreMainScene()


        /*
         * =================================================
         * REMOVE DOUBLE SLIT
         * =================================================
         */

        if (
            this.scene &&
            this.experiment &&
            this.experiment.group
        ) {

            this.scene.remove(
                this.experiment.group
            )

        }


        /*
         * =================================================
         * REMOVE SUPERPOSITION
         * =================================================
         */

        if (
            this.scene &&
            this.superpositionExperiment &&
            this.superpositionExperiment.group
        ) {

            this.scene.remove(
                this.superpositionExperiment.group
            )

        }


        /*
         * =================================================
         * DESTROY DOUBLE SLIT
         * =================================================
         */

        if (
            this.experiment &&
            typeof this.experiment.destroy ===
            'function'
        ) {

            this.experiment.destroy()

        }


        /*
         * =================================================
         * DESTROY SUPERPOSITION
         * =================================================
         */

        if (
            this.superpositionExperiment &&
            typeof this.superpositionExperiment.destroy ===
            'function'
        ) {

            this.superpositionExperiment.destroy()

        }


        /*
         * =================================================
         * REMOVE UI
         * =================================================
         */

        if (
            this.container
        ) {

            this.container.remove()

        }

    }

}