import './relative-world.css'
import './time-dilation.css'
import './spacetime.css'


import TimeDilationExperiment
    from '../relativity/TimeDilationExperiment.js'

import SpacetimeExperiment
    from '../relativity/SpacetimeExperiment.js'


import {
    t,
    getLanguage
} from '../locales/i18n.js'


/* =========================================================
   AWTAAR — RELATIVE WORLD UI
   ========================================================= */

export default class RelativeWorldUI {


    constructor(
        physicsWorldUI,
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
           STATE
           ===================================================== */

        this.isTransitioning =
            false

        this.experimentActive =
            false

        this.activeExperiment =
            null


        /*
         * نحفظ حالة عناصر المشهد الأساسية
         * حتى نعيدها كما كانت بعد الخروج.
         */

        this.sceneVisibilityState =
            new Map()


        /* =====================================================
           TIME DILATION EXPERIMENT
           ===================================================== */

        this.timeDilationExperiment =
            new TimeDilationExperiment({
                scene: this.scene
            })


        if (this.scene) {

            this.timeDilationExperiment.addToScene(
                this.scene
            )

        }


        /* =====================================================
           SPACETIME EXPERIMENT
           ===================================================== */

        this.spacetimeExperiment =
            new SpacetimeExperiment({
                scene: this.scene
            })


        if (this.scene) {

            this.spacetimeExperiment.addToScene(
                this.scene
            )

        }


        /* =====================================================
           CREATE MAIN UI
           ===================================================== */

        this.createUI()


        /* =====================================================
           CREATE EXPERIMENT UIs
           ===================================================== */

        this.createTimeDilationUI()

        this.createSpacetimeUI()


        /* =====================================================
           INITIAL STATE
           ===================================================== */

        this.container.style.opacity =
            '0'

        this.container.style.visibility =
            'hidden'

        this.container.style.pointerEvents =
            'none'


        this.timeDilationUI.style.opacity =
            '0'

        this.timeDilationUI.style.visibility =
            'hidden'

        this.timeDilationUI.style.pointerEvents =
            'none'


        this.spacetimeUI.style.opacity =
            '0'

        this.spacetimeUI.style.visibility =
            'hidden'

        this.spacetimeUI.style.pointerEvents =
            'none'


        /* =====================================================
           HIDE EXPERIMENTS
           ===================================================== */

        this.timeDilationExperiment.setVisible(
            false
        )

        this.spacetimeExperiment.setVisible(
            false
        )


        /* =====================================================
           LANGUAGE
           ===================================================== */

        this.updateLanguage()

    }


    /* =========================================================
       CREATE MAIN UI
       ========================================================= */

    createUI() {

        this.container =
            document.createElement('section')

        this.container.id =
            'awtaar-relative-world'

        this.container.className =
            'relative-world-container'


        /* =====================================================
           HEADER
           ===================================================== */

        this.header =
            document.createElement('div')

        this.header.className =
            'relative-world-header'


        this.eyebrow =
            document.createElement('div')

        this.eyebrow.className =
            'relative-world-eyebrow'


        this.title =
            document.createElement('h1')

        this.title.className =
            'relative-world-title'


        this.subtitle =
            document.createElement('p')

        this.subtitle.className =
            'relative-world-subtitle'


        this.header.appendChild(
            this.eyebrow
        )

        this.header.appendChild(
            this.title
        )

        this.header.appendChild(
            this.subtitle
        )


        /* =====================================================
           EXPERIMENTS
           ===================================================== */

        this.experiments =
            document.createElement('div')

        this.experiments.className =
            'relative-experiments'


        this.timeDilationCard =
            this.createExperimentCard({
                key: 'timeDilation',
                icon: '◷'
            })


        this.spacetimeCard =
            this.createExperimentCard({
                key: 'spacetime',
                icon: '◉'
            })


        this.experiments.appendChild(
            this.timeDilationCard
        )

        this.experiments.appendChild(
            this.spacetimeCard
        )


        /* =====================================================
           HINT
           ===================================================== */

        this.hint =
            document.createElement('div')

        this.hint.className =
            'relative-world-hint'


        /* =====================================================
           BACK
           ===================================================== */

        this.backButton =
            document.createElement('button')

        this.backButton.type =
            'button'

        this.backButton.className =
            'relative-back-button'


        this.backButton.addEventListener(
            'click',
            (event) => {

                event.preventDefault()
                event.stopPropagation()


                if (
                    this.isTransitioning ||
                    this.experimentActive
                ) {
                    return
                }


                this.returnToPhysics()

            }
        )


        /* =====================================================
           BUILD
           ===================================================== */

        this.container.appendChild(
            this.header
        )

        this.container.appendChild(
            this.experiments
        )

        this.container.appendChild(
            this.hint
        )

        this.container.appendChild(
            this.backButton
        )


        document.body.appendChild(
            this.container
        )

    }


    /* =========================================================
       EXPERIMENT CARD
       ========================================================= */

    createExperimentCard(data) {

        const card =
            document.createElement('button')

        card.type =
            'button'

        card.className =
            'relative-experiment-card'

        card.dataset.experiment =
            data.key


        const glow =
            document.createElement('span')

        glow.className =
            'relative-card-glow'


        const icon =
            document.createElement('span')

        icon.className =
            'relative-experiment-icon'

        icon.textContent =
            data.icon


        const content =
            document.createElement('span')

        content.className =
            'relative-experiment-content'


        const title =
            document.createElement('h2')


        const description =
            document.createElement('p')


        content.appendChild(
            title
        )

        content.appendChild(
            description
        )


        const arrow =
            document.createElement('span')

        arrow.className =
            'relative-experiment-arrow'

        arrow.textContent =
            '→'


        card.appendChild(
            glow
        )

        card.appendChild(
            icon
        )

        card.appendChild(
            content
        )

        card.appendChild(
            arrow
        )


        /* =====================================================
           CARD CLICK
           ===================================================== */

        card.addEventListener(
            'click',
            (event) => {

                event.preventDefault()
                event.stopPropagation()


                if (
                    this.isTransitioning ||
                    this.experimentActive
                ) {
                    return
                }


                if (
                    data.key === 'timeDilation'
                ) {

                    this.startTimeDilation()

                }


                if (
                    data.key === 'spacetime'
                ) {

                    this.startSpacetime()

                }

            }
        )


        return card

    }


    /* =========================================================
       CREATE TIME DILATION UI
       ========================================================= */

    createTimeDilationUI() {

        this.timeDilationUI =
            document.createElement('section')

        this.timeDilationUI.id =
            'awtaar-time-dilation'

        this.timeDilationUI.className =
            'time-dilation-container'


        /* =====================================================
           TOP BAR
           ===================================================== */

        this.experimentTop =
            document.createElement('div')

        this.experimentTop.className =
            'time-dilation-top'


        this.experimentTitle =
            document.createElement('h1')

        this.experimentTitle.className =
            'time-dilation-title'


        this.experimentBack =
            document.createElement('button')

        this.experimentBack.type =
            'button'

        this.experimentBack.className =
            'time-dilation-back'


        this.experimentTop.appendChild(
            this.experimentTitle
        )

        this.experimentTop.appendChild(
            this.experimentBack
        )


        /* =====================================================
           INTRO
           ===================================================== */

        this.experimentIntro =
            document.createElement('div')

        this.experimentIntro.className =
            'time-dilation-intro'


        const introLine =
            document.createElement('div')

        introLine.className =
            'time-dilation-line'


        const introText =
            document.createElement('span')

        introText.textContent =
            'RELATIVITY • TIME'


        introLine.appendChild(
            introText
        )


        this.experimentIntro.appendChild(
            introLine
        )


        /* =====================================================
           DATA
           ===================================================== */

        this.infoPanel =
            document.createElement('div')

        this.infoPanel.className =
            'time-dilation-info'


        this.observerInfo =
            this.createDataBox(
                'observer'
            )

        this.travelerInfo =
            this.createDataBox(
                'traveler'
            )

        this.gammaInfo =
            this.createDataBox(
                'gamma'
            )


        this.infoPanel.appendChild(
            this.observerInfo.box
        )

        this.infoPanel.appendChild(
            this.travelerInfo.box
        )

        this.infoPanel.appendChild(
            this.gammaInfo.box
        )


        this.observerLabel =
            this.observerInfo.label

        this.observerValue =
            this.observerInfo.value


        this.travelerLabel =
            this.travelerInfo.label

        this.travelerValue =
            this.travelerInfo.value


        this.gammaLabel =
            this.gammaInfo.label

        this.gammaValue =
            this.gammaInfo.value


        /* =====================================================
           CONTROLS
           ===================================================== */

        this.controls =
            document.createElement('div')

        this.controls.className =
            'time-dilation-controls'


        this.speedHeader =
            document.createElement('div')

        this.speedHeader.className =
            'time-speed-header'


        this.speedLabel =
            document.createElement('span')


        this.speedValue =
            document.createElement('strong')


        this.speedHeader.appendChild(
            this.speedLabel
        )

        this.speedHeader.appendChild(
            this.speedValue
        )


        this.speedSlider =
            document.createElement('input')

        this.speedSlider.type =
            'range'

        this.speedSlider.min =
            '0'

        this.speedSlider.max =
            '99'

        this.speedSlider.step =
            '1'

        this.speedSlider.value =
            '56'

        this.speedSlider.className =
            'time-speed-slider'


        this.controls.appendChild(
            this.speedHeader
        )

        this.controls.appendChild(
            this.speedSlider
        )


        /* =====================================================
           ACTIONS
           ===================================================== */

        this.actionBar =
            document.createElement('div')

        this.actionBar.className =
            'time-dilation-actions'


        this.playButton =
            document.createElement('button')

        this.playButton.type =
            'button'

        this.playButton.className =
            'time-dilation-action primary'


        this.resetButton =
            document.createElement('button')

        this.resetButton.type =
            'button'

        this.resetButton.className =
            'time-dilation-action'


        this.actionBar.appendChild(
            this.playButton
        )

        this.actionBar.appendChild(
            this.resetButton
        )


        /* =====================================================
           BUILD
           ===================================================== */

        this.timeDilationUI.appendChild(
            this.experimentTop
        )

        this.timeDilationUI.appendChild(
            this.experimentIntro
        )

        this.timeDilationUI.appendChild(
            this.infoPanel
        )

        this.timeDilationUI.appendChild(
            this.controls
        )

        this.timeDilationUI.appendChild(
            this.actionBar
        )


        document.body.appendChild(
            this.timeDilationUI
        )


        /* =====================================================
           EXIT
           ===================================================== */

        this.experimentBack.addEventListener(
            'click',
            (event) => {

                event.preventDefault()
                event.stopPropagation()

                this.exitTimeDilation()

            }
        )


        /* =====================================================
           PLAY / PAUSE
           ===================================================== */

        this.playButton.addEventListener(
            'click',
            (event) => {

                event.preventDefault()
                event.stopPropagation()


                if (
                    !this.timeDilationExperiment.active
                ) {

                    this.timeDilationExperiment.start()

                }
                else if (
                    this.timeDilationExperiment.paused
                ) {

                    this.timeDilationExperiment.resume()

                }
                else {

                    this.timeDilationExperiment.pause()

                }


                this.updateControlsLanguage()

            }
        )


        /* =====================================================
           RESET
           ===================================================== */

        this.resetButton.addEventListener(
            'click',
            (event) => {

                event.preventDefault()
                event.stopPropagation()


                this.timeDilationExperiment.reset()


                this.timeDilationExperiment.setVelocity(
                    Number(
                        this.speedSlider.value
                    ) / 100
                )


                this.timeDilationExperiment.start()


                this.updateTimeDilationData()

                this.updateControlsLanguage()

            }
        )


        /* =====================================================
           SPEED
           ===================================================== */

        this.speedSlider.addEventListener(
            'input',
            (event) => {

                event.preventDefault()
                event.stopPropagation()


                const value =
                    Number(
                        this.speedSlider.value
                    )


                const velocity =
                    value / 100


                if (
                    this.timeDilationExperiment.active
                ) {

                    this.timeDilationExperiment.reset()

                    this.timeDilationExperiment.setVelocity(
                        velocity
                    )

                    this.timeDilationExperiment.start()

                }
                else {

                    this.timeDilationExperiment.setVelocity(
                        velocity
                    )

                }


                this.updateTimeDilationData()

                this.updateControlsLanguage()

            }
        )

    }


    /* =========================================================
       CREATE SPACETIME UI
       ========================================================= */

    createSpacetimeUI() {

        this.spacetimeUI =
            document.createElement('section')

        this.spacetimeUI.id =
            'awtaar-spacetime'


        /* =====================================================
           TOP BAR
           ===================================================== */

        this.spacetimeTop =
            document.createElement('div')

        this.spacetimeTop.className =
            'spacetime-top'


        this.spacetimeTitle =
            document.createElement('h1')

        this.spacetimeTitle.className =
            'spacetime-title'


        this.spacetimeBack =
            document.createElement('button')

        this.spacetimeBack.type =
            'button'

        this.spacetimeBack.className =
            'spacetime-back'


        this.spacetimeTop.appendChild(
            this.spacetimeTitle
        )

        this.spacetimeTop.appendChild(
            this.spacetimeBack
        )


        /* =====================================================
           INTRO
           ===================================================== */

        this.spacetimeIntro =
            document.createElement('div')

        this.spacetimeIntro.className =
            'spacetime-intro'


        const spacetimeLine =
            document.createElement('div')

        spacetimeLine.className =
            'spacetime-line'


        const spacetimeIntroText =
            document.createElement('span')

        spacetimeIntroText.textContent =
            'RELATIVITY • SPACETIME'


        spacetimeLine.appendChild(
            spacetimeIntroText
        )


        this.spacetimeIntro.appendChild(
            spacetimeLine
        )


        /* =====================================================
           INFORMATION PANEL
           ===================================================== */

        this.spacetimeInfo =
            document.createElement('div')

        this.spacetimeInfo.className =
            'spacetime-info'


        this.massInfo =
            this.createSpacetimeDataBox(
                'mass'
            )


        this.velocityInfo =
            this.createSpacetimeDataBox(
                'velocity'
            )


        this.curvatureInfo =
            this.createSpacetimeDataBox(
                'curvature'
            )


        this.spacetimeInfo.appendChild(
            this.massInfo.box
        )

        this.spacetimeInfo.appendChild(
            this.velocityInfo.box
        )

        this.spacetimeInfo.appendChild(
            this.curvatureInfo.box
        )


        this.massLabel =
            this.massInfo.label

        this.massValue =
            this.massInfo.value


        this.velocityLabel =
            this.velocityInfo.label

        this.velocityValue =
            this.velocityInfo.value


        this.curvatureLabel =
            this.curvatureInfo.label

        this.curvatureValue =
            this.curvatureInfo.value


        /* =====================================================
           CONTROLS
           ===================================================== */

        this.spacetimeControls =
            document.createElement('div')

        this.spacetimeControls.className =
            'spacetime-controls'


        /* =====================================================
           MASS CONTROL
           ===================================================== */

        this.massControl =
            this.createSpacetimeControl(
                'mass'
            )


        this.massSlider =
            this.massControl.slider

        this.massControlLabel =
            this.massControl.label

        this.massControlValue =
            this.massControl.value


        this.massSlider.min =
            '0'

        this.massSlider.max =
            '100'

        this.massSlider.step =
            '1'

        this.massSlider.value =
            String(
                Math.round(
                    this.spacetimeExperiment.mass *
                    100
                )
            )


        /* =====================================================
           VELOCITY CONTROL
           ===================================================== */

        this.velocityControl =
            this.createSpacetimeControl(
                'velocity'
            )


        this.velocitySlider =
            this.velocityControl.slider

        this.velocityControlLabel =
            this.velocityControl.label

        this.velocityControlValue =
            this.velocityControl.value


        this.velocitySlider.min =
            '0'

        this.velocitySlider.max =
            '99'

        this.velocitySlider.step =
            '1'

        this.velocitySlider.value =
            String(
                Math.round(
                    this.spacetimeExperiment.velocity *
                    100
                )
            )


        this.spacetimeControls.appendChild(
            this.massControl.row
        )

        this.spacetimeControls.appendChild(
            this.velocityControl.row
        )


        /* =====================================================
           ACTIONS
           ===================================================== */

        this.spacetimeActions =
            document.createElement('div')

        this.spacetimeActions.className =
            'spacetime-actions'


        this.spacetimePlayButton =
            document.createElement('button')

        this.spacetimePlayButton.type =
            'button'

        this.spacetimePlayButton.className =
            'spacetime-action primary'


        this.spacetimeResetButton =
            document.createElement('button')

        this.spacetimeResetButton.type =
            'button'

        this.spacetimeResetButton.className =
            'spacetime-action'


        this.spacetimeActions.appendChild(
            this.spacetimePlayButton
        )

        this.spacetimeActions.appendChild(
            this.spacetimeResetButton
        )


        /* =====================================================
           NOTE
           ===================================================== */

        this.spacetimeNote =
            document.createElement('div')

        this.spacetimeNote.className =
            'spacetime-note'


        /* =====================================================
           BUILD
           ===================================================== */

        this.spacetimeUI.appendChild(
            this.spacetimeTop
        )

        this.spacetimeUI.appendChild(
            this.spacetimeIntro
        )

        this.spacetimeUI.appendChild(
            this.spacetimeInfo
        )

        this.spacetimeUI.appendChild(
            this.spacetimeControls
        )

        this.spacetimeUI.appendChild(
            this.spacetimeActions
        )

        this.spacetimeUI.appendChild(
            this.spacetimeNote
        )


        document.body.appendChild(
            this.spacetimeUI
        )


        /* =====================================================
           EXIT
           ===================================================== */

        this.spacetimeBack.addEventListener(
            'click',
            (event) => {

                event.preventDefault()
                event.stopPropagation()

                this.exitSpacetime()

            }
        )


        /* =====================================================
           PLAY / PAUSE
           ===================================================== */

        this.spacetimePlayButton.addEventListener(
            'click',
            (event) => {

                event.preventDefault()
                event.stopPropagation()


                if (
                    !this.spacetimeExperiment.active
                ) {

                    this.spacetimeExperiment.start()

                }
                else if (
                    this.spacetimeExperiment.paused
                ) {

                    this.spacetimeExperiment.resume()

                }
                else {

                    this.spacetimeExperiment.pause()

                }


                this.updateSpacetimeControlsLanguage()

            }
        )


        /* =====================================================
           RESET
           ===================================================== */

        this.spacetimeResetButton.addEventListener(
            'click',
            (event) => {

                event.preventDefault()
                event.stopPropagation()


                this.spacetimeExperiment.reset()


                this.spacetimeExperiment.setMass(
                    Number(
                        this.massSlider.value
                    ) / 100
                )


                this.spacetimeExperiment.setVelocity(
                    Number(
                        this.velocitySlider.value
                    ) / 100
                )


                this.spacetimeExperiment.start()


                this.updateSpacetimeData()

                this.updateSpacetimeControlsLanguage()

            }
        )


        /* =====================================================
           MASS SLIDER
           ===================================================== */

        this.massSlider.addEventListener(
            'input',
            (event) => {

                event.preventDefault()
                event.stopPropagation()


                const value =
                    Number(
                        this.massSlider.value
                    )


                const mass =
                    value / 100


                this.spacetimeExperiment.setMass(
                    mass
                )


                /*
                 * عند تغيير الكتلة أثناء التجربة،
                 * نعيد المسار حتى لا يبقى أثر
                 * لمسار قديم في انحناء مختلف.
                 */

                if (
                    this.spacetimeExperiment.active
                ) {

                    this.spacetimeExperiment.reset()

                    this.spacetimeExperiment.setMass(
                        mass
                    )

                    this.spacetimeExperiment.setVelocity(
                        Number(
                            this.velocitySlider.value
                        ) / 100
                    )

                    this.spacetimeExperiment.start()

                }


                this.updateSpacetimeData()

            }
        )


        /* =====================================================
           VELOCITY SLIDER
           ===================================================== */

        this.velocitySlider.addEventListener(
            'input',
            (event) => {

                event.preventDefault()
                event.stopPropagation()


                const value =
                    Number(
                        this.velocitySlider.value
                    )


                const velocity =
                    value / 100


                this.spacetimeExperiment.setVelocity(
                    velocity
                )


                /*
                 * إعادة بداية المسار عند تغيير
                 * السرعة أثناء التشغيل.
                 */

                if (
                    this.spacetimeExperiment.active
                ) {

                    this.spacetimeExperiment.reset()

                    this.spacetimeExperiment.setMass(
                        Number(
                            this.massSlider.value
                        ) / 100
                    )

                    this.spacetimeExperiment.setVelocity(
                        velocity
                    )

                    this.spacetimeExperiment.start()

                }


                this.updateSpacetimeData()

            }
        )

    }


    /* =========================================================
       CREATE DATA BOX
       ========================================================= */

    createDataBox(key) {

        const box =
            document.createElement('div')

        box.className =
            `time-dilation-clock-info ${key}`


        const label =
            document.createElement('span')

        label.className =
            'time-dilation-label'


        const value =
            document.createElement('strong')

        value.className =
            'time-dilation-value'


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
       CREATE SPACETIME DATA BOX
       ========================================================= */

    createSpacetimeDataBox(key) {

        const box =
            document.createElement('div')

        box.className =
            `spacetime-data-box ${key}`


        const label =
            document.createElement('span')

        label.className =
            'spacetime-label'


        const value =
            document.createElement('strong')

        value.className =
            'spacetime-value'


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
       CREATE SPACETIME CONTROL
       ========================================================= */

    createSpacetimeControl(key) {

        const row =
            document.createElement('div')

        row.className =
            'spacetime-control-row'


        const header =
            document.createElement('div')

        header.className =
            'spacetime-control-header'


        const label =
            document.createElement('span')


        const value =
            document.createElement('strong')


        header.appendChild(
            label
        )

        header.appendChild(
            value
        )


        const slider =
            document.createElement('input')

        slider.type =
            'range'

        slider.className =
            'spacetime-slider'


        row.appendChild(
            header
        )

        row.appendChild(
            slider
        )


        return {
            row,
            label,
            value,
            slider
        }

    }


    /* =========================================================
       UPDATE TIME DILATION DATA
       ========================================================= */

    updateTimeDilationData() {

        if (
            !this.timeDilationExperiment
        ) {
            return
        }


        const data =
            this.timeDilationExperiment
                .getRelativityData()


        if (this.observerValue) {

            this.observerValue.textContent =
                `${data.observerTime.toFixed(2)} s`

        }


        if (this.travelerValue) {

            this.travelerValue.textContent =
                `${data.properTime.toFixed(2)} s`

        }


        if (this.gammaValue) {

            this.gammaValue.textContent =
                data.gamma.toFixed(3)

        }


        if (this.speedValue) {

            this.speedValue.textContent =
                `${Math.round(data.velocity * 100)}% c`

        }

    }


    /* =========================================================
       UPDATE SPACETIME DATA
       ========================================================= */

    updateSpacetimeData() {

        if (
            !this.spacetimeExperiment
        ) {
            return
        }


        const data =
            this.spacetimeExperiment
                .getRelativityData()


        if (this.massValue) {

            this.massValue.textContent =
                `${Math.round(data.mass * 100)}%`

        }


        if (this.velocityValue) {

            this.velocityValue.textContent =
                `${Math.round(data.velocity * 100)}% c`

        }


        if (this.curvatureValue) {

            this.curvatureValue.textContent =
                data.curvature.toFixed(2)

        }


        if (this.massControlValue) {

            this.massControlValue.textContent =
                `${Math.round(data.mass * 100)}%`

        }


        if (this.velocityControlValue) {

            this.velocityControlValue.textContent =
                `${Math.round(data.velocity * 100)}% c`

        }

    }


    /* =========================================================
       SAVE MAIN SCENE VISIBILITY
       ========================================================= */

    saveSceneVisibility() {

        if (!this.scene) {
            return
        }


        this.sceneVisibilityState.clear()


        this.scene.children.forEach(
            object => {

                if (
                    object ===
                    this.timeDilationExperiment.group
                ) {
                    return
                }


                if (
                    object ===
                    this.spacetimeExperiment.group
                ) {
                    return
                }


                this.sceneVisibilityState.set(
                    object,
                    object.visible
                )

            }
        )

    }


    /* =========================================================
       HIDE MAIN SCENE
       ========================================================= */

    hideMainScene() {

        if (!this.scene) {
            return
        }


        this.saveSceneVisibility()


        this.scene.children.forEach(
            object => {

                if (
                    object ===
                    this.timeDilationExperiment.group
                ) {
                    return
                }


                if (
                    object ===
                    this.spacetimeExperiment.group
                ) {
                    return
                }


                object.visible =
                    false

            }
        )

    }


    /* =========================================================
       RESTORE MAIN SCENE
       ========================================================= */

    restoreMainScene() {

        if (!this.scene) {
            return
        }


        this.sceneVisibilityState.forEach(
            (visible, object) => {

                if (object) {

                    object.visible =
                        visible

                }

            }
        )


        this.sceneVisibilityState.clear()

    }


    /* =========================================================
       START TIME DILATION
       ========================================================= */

    startTimeDilation() {

        if (
            this.isTransitioning ||
            this.experimentActive
        ) {
            return
        }


        this.isTransitioning =
            true

        this.experimentActive =
            true

        this.activeExperiment =
            'timeDilation'


        /* =====================================================
           ISOLATE SCENE
           ===================================================== */

        this.hideMainScene()


        /* =====================================================
           HIDE RELATIVE WORLD
           ===================================================== */

        this.hide()


        /* =====================================================
           MAKE SURE OTHER EXPERIMENT IS OFF
           ===================================================== */

        this.spacetimeExperiment.stop()

        this.spacetimeExperiment.reset()

        this.spacetimeExperiment.setVisible(
            false
        )


        /* =====================================================
           RESET TIME DILATION
           ===================================================== */

        this.timeDilationExperiment.reset()


        this.timeDilationExperiment.setVelocity(
            Number(
                this.speedSlider.value
            ) / 100
        )


        this.timeDilationExperiment.setVisible(
            true
        )


        this.timeDilationExperiment.start()


        /* =====================================================
           SHOW UI
           ===================================================== */

        this.timeDilationUI.style.visibility =
            'visible'

        this.timeDilationUI.style.pointerEvents =
            'auto'


        requestAnimationFrame(
            () => {

                this.timeDilationUI.style.opacity =
                    '1'

            }
        )


        this.updateTimeDilationData()

        this.updateControlsLanguage()


        setTimeout(
            () => {

                this.isTransitioning =
                    false

            },
            550
        )

    }


    /* =========================================================
       EXIT TIME DILATION
       ========================================================= */

    exitTimeDilation() {

        if (
            this.isTransitioning ||
            !this.experimentActive ||
            this.activeExperiment !==
            'timeDilation'
        ) {
            return
        }


        this.isTransitioning =
            true


        /* =====================================================
           FADE
           ===================================================== */

        this.timeDilationUI.style.opacity =
            '0'

        this.timeDilationUI.style.pointerEvents =
            'none'


        /* =====================================================
           STOP
           ===================================================== */

        this.timeDilationExperiment.stop()

        this.timeDilationExperiment.reset()

        this.timeDilationExperiment.setVisible(
            false
        )


        /* =====================================================
           WAIT
           ===================================================== */

        setTimeout(
            () => {

                this.timeDilationUI.style.visibility =
                    'hidden'


                this.experimentActive =
                    false

                this.activeExperiment =
                    null


                this.restoreMainScene()


                this.show()


                this.isTransitioning =
                    false

            },
            550
        )

    }


    /* =========================================================
       START SPACETIME
       ========================================================= */

    startSpacetime() {

        if (
            this.isTransitioning ||
            this.experimentActive
        ) {
            return
        }


        this.isTransitioning =
            true

        this.experimentActive =
            true

        this.activeExperiment =
            'spacetime'


        /* =====================================================
           ISOLATE SCENE
           ===================================================== */

        this.hideMainScene()


        /* =====================================================
           HIDE RELATIVE WORLD
           ===================================================== */

        this.hide()


        /* =====================================================
           MAKE SURE TIME DILATION IS OFF
           ===================================================== */

        this.timeDilationExperiment.stop()

        this.timeDilationExperiment.reset()

        this.timeDilationExperiment.setVisible(
            false
        )


        /* =====================================================
           RESET SPACETIME
           ===================================================== */

        this.spacetimeExperiment.reset()


        this.spacetimeExperiment.setMass(
            Number(
                this.massSlider.value
            ) / 100
        )


        this.spacetimeExperiment.setVelocity(
            Number(
                this.velocitySlider.value
            ) / 100
        )


        this.spacetimeExperiment.setVisible(
            true
        )


        this.spacetimeExperiment.start()


        /* =====================================================
           SHOW UI
           ===================================================== */

        this.spacetimeUI.style.visibility =
            'visible'

        this.spacetimeUI.style.pointerEvents =
            'auto'


        requestAnimationFrame(
            () => {

                this.spacetimeUI.style.opacity =
                    '1'

            }
        )


        this.updateSpacetimeData()

        this.updateSpacetimeControlsLanguage()


        setTimeout(
            () => {

                this.isTransitioning =
                    false

            },
            550
        )

    }


    /* =========================================================
       EXIT SPACETIME
       ========================================================= */

    exitSpacetime() {

        if (
            this.isTransitioning ||
            !this.experimentActive ||
            this.activeExperiment !==
            'spacetime'
        ) {
            return
        }


        this.isTransitioning =
            true


        /* =====================================================
           FADE
           ===================================================== */

        this.spacetimeUI.style.opacity =
            '0'

        this.spacetimeUI.style.pointerEvents =
            'none'


        /* =====================================================
           STOP
           ===================================================== */

        this.spacetimeExperiment.stop()

        this.spacetimeExperiment.reset()

        this.spacetimeExperiment.setVisible(
            false
        )


        /* =====================================================
           WAIT
           ===================================================== */

        setTimeout(
            () => {

                this.spacetimeUI.style.visibility =
                    'hidden'


                this.experimentActive =
                    false

                this.activeExperiment =
                    null


                this.restoreMainScene()


                this.show()


                this.isTransitioning =
                    false

            },
            550
        )

    }


    /* =========================================================
       LANGUAGE
       ========================================================= */

    updateLanguage() {

        const language =
            getLanguage()


        const direction =
            language === 'ar'
                ? 'rtl'
                : 'ltr'


        /* =====================================================
           DIRECTIONS
           ===================================================== */

        if (this.container) {

            this.container.dir =
                direction

        }


        if (this.timeDilationUI) {

            this.timeDilationUI.dir =
                direction

        }


        if (this.spacetimeUI) {

            this.spacetimeUI.dir =
                direction

        }


        /* =====================================================
           RELATIVE WORLD
           ===================================================== */

        if (this.eyebrow) {

            this.eyebrow.textContent =
                t(
                    'relativeWorld.eyebrow'
                )

        }


        if (this.title) {

            this.title.textContent =
                t(
                    'relativeWorld.title'
                )

        }


        if (this.subtitle) {

            this.subtitle.textContent =
                t(
                    'relativeWorld.description'
                )

        }


        if (this.hint) {

            this.hint.textContent =
                t(
                    'relativeWorld.hint'
                )

        }


        if (this.backButton) {

            this.backButton.textContent =
                t(
                    'relativeWorld.back'
                )

        }


        /* =====================================================
           CARDS
           ===================================================== */

        this.updateCardLanguage(
            this.timeDilationCard,
            'timeDilation'
        )


        this.updateCardLanguage(
            this.spacetimeCard,
            'spacetime'
        )


        /* =====================================================
           TIME DILATION
           ===================================================== */

        if (this.experimentTitle) {

            this.experimentTitle.textContent =
                t(
                    'relativeWorld.timeDilation.title'
                )

        }


        if (this.experimentBack) {

            this.experimentBack.textContent =
                t(
                    'relativeWorld.timeDilation.exit'
                )

        }


        if (this.observerLabel) {

            this.observerLabel.textContent =
                t(
                    'relativeWorld.timeDilation.observer'
                )

        }


        if (this.travelerLabel) {

            this.travelerLabel.textContent =
                t(
                    'relativeWorld.timeDilation.traveler'
                )

        }


        if (this.gammaLabel) {

            this.gammaLabel.textContent =
                'γ'

        }


        if (this.speedLabel) {

            this.speedLabel.textContent =
                t(
                    'relativeWorld.timeDilation.speed'
                )

        }


        this.updateControlsLanguage()


        /* =====================================================
           SPACETIME
           ===================================================== */

        if (this.spacetimeTitle) {

            this.spacetimeTitle.textContent =
                t(
                    'relativeWorld.spacetime.title'
                )

        }


        if (this.spacetimeBack) {

            this.spacetimeBack.textContent =
                t(
                    'relativeWorld.spacetime.exit'
                )

        }


        if (this.massLabel) {

            this.massLabel.textContent =
                t(
                    'relativeWorld.spacetime.mass'
                )

        }


        if (this.velocityLabel) {

            this.velocityLabel.textContent =
                t(
                    'relativeWorld.spacetime.velocity'
                )

        }


        if (this.curvatureLabel) {

            this.curvatureLabel.textContent =
                t(
                    'relativeWorld.spacetime.curvature'
                )

        }


        if (this.massControlLabel) {

            this.massControlLabel.textContent =
                t(
                    'relativeWorld.spacetime.mass'
                )

        }


        if (this.velocityControlLabel) {

            this.velocityControlLabel.textContent =
                t(
                    'relativeWorld.spacetime.velocity'
                )

        }


        if (this.spacetimeNote) {

            this.spacetimeNote.textContent =
                t(
                    'relativeWorld.spacetime.note'
                )

        }


        this.updateSpacetimeControlsLanguage()

    }


    /* =========================================================
       TIME DILATION CONTROLS LANGUAGE
       ========================================================= */

    updateControlsLanguage() {

        if (
            !this.playButton ||
            !this.resetButton ||
            !this.timeDilationExperiment
        ) {
            return
        }


        if (
            this.timeDilationExperiment.paused
        ) {

            this.playButton.textContent =
                t(
                    'relativeWorld.timeDilation.resume'
                )

        }
        else {

            this.playButton.textContent =
                t(
                    'relativeWorld.timeDilation.pause'
                )

        }


        this.resetButton.textContent =
            t(
                'relativeWorld.timeDilation.reset'
            )

    }


    /* =========================================================
       SPACETIME CONTROLS LANGUAGE
       ========================================================= */

    updateSpacetimeControlsLanguage() {

        if (
            !this.spacetimePlayButton ||
            !this.spacetimeResetButton ||
            !this.spacetimeExperiment
        ) {
            return
        }


        if (
            this.spacetimeExperiment.paused
        ) {

            this.spacetimePlayButton.textContent =
                t(
                    'relativeWorld.spacetime.resume'
                )

        }
        else {

            this.spacetimePlayButton.textContent =
                t(
                    'relativeWorld.spacetime.pause'
                )

        }


        this.spacetimeResetButton.textContent =
            t(
                'relativeWorld.spacetime.reset'
            )

    }


    /* =========================================================
       CARD LANGUAGE
       ========================================================= */

    updateCardLanguage(
        card,
        key
    ) {

        if (!card) {
            return
        }


        const title =
            card.querySelector('h2')


        const description =
            card.querySelector('p')


        if (
            key === 'timeDilation'
        ) {

            title.textContent =
                t(
                    'relativeWorld.timeDilation.title'
                )


            description.textContent =
                t(
                    'relativeWorld.timeDilation.description'
                )

        }


        if (
            key === 'spacetime'
        ) {

            title.textContent =
                t(
                    'relativeWorld.spacetime.title'
                )


            description.textContent =
                t(
                    'relativeWorld.spacetime.description'
                )

        }

    }


    /* =========================================================
       SHOW RELATIVITY WORLD
       ========================================================= */

    show() {

        if (
            this.experimentActive
        ) {
            return
        }


        this.updateLanguage()


        this.container.style.display =
            'flex'

        this.container.style.visibility =
            'visible'

        this.container.style.pointerEvents =
            'auto'


        requestAnimationFrame(
            () => {

                this.container.style.opacity =
                    '1'

            }
        )

    }


    /* =========================================================
       HIDE RELATIVITY WORLD
       ========================================================= */

    hide() {

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

                }

            },
            550
        )

    }


    /* =========================================================
       UPDATE
       ========================================================= */

    update(delta) {

        if (
            !this.experimentActive
        ) {
            return
        }


        if (
            !Number.isFinite(delta)
        ) {
            return
        }


        /* =====================================================
           TIME DILATION
           ===================================================== */

        if (
            this.activeExperiment ===
            'timeDilation'
        ) {

            if (
                this.timeDilationExperiment
            ) {

                this.timeDilationExperiment.update(
                    delta
                )


                this.updateTimeDilationData()

            }

        }


        /* =====================================================
           SPACETIME
           ===================================================== */

        if (
            this.activeExperiment ===
            'spacetime'
        ) {

            if (
                this.spacetimeExperiment
            ) {

                this.spacetimeExperiment.update(
                    delta
                )


                this.updateSpacetimeData()

            }

        }

    }


    /* =========================================================
       RETURN TO PHYSICS
       ========================================================= */

    returnToPhysics() {

        if (
            this.isTransitioning ||
            this.experimentActive
        ) {
            return
        }


        this.isTransitioning =
            true


        this.hide()


        setTimeout(
            () => {

                if (
                    this.physicsWorldUI
                ) {

                    this.physicsWorldUI.show()

                }


                this.isTransitioning =
                    false

            },
            550
        )

    }


    /* =========================================================
       DESTROY
       ========================================================= */

    destroy() {

        this.isTransitioning =
            true


        /* =====================================================
           TIME DILATION
           ===================================================== */

        if (
            this.timeDilationExperiment
        ) {

            this.timeDilationExperiment.stop()

            this.timeDilationExperiment.destroy()

        }


        /* =====================================================
           SPACETIME
           ===================================================== */

        if (
            this.spacetimeExperiment
        ) {

            this.spacetimeExperiment.stop()

            this.spacetimeExperiment.destroy()

        }


        /* =====================================================
           RESTORE SCENE
           ===================================================== */

        this.restoreMainScene()


        /* =====================================================
           REMOVE UI
           ===================================================== */

        if (
            this.container
        ) {

            this.container.remove()

        }


        if (
            this.timeDilationUI
        ) {

            this.timeDilationUI.remove()

        }


        if (
            this.spacetimeUI
        ) {

            this.spacetimeUI.remove()

        }


        /* =====================================================
           CLEAR
           ===================================================== */

        this.sceneVisibilityState.clear()


        this.timeDilationExperiment =
            null

        this.spacetimeExperiment =
            null

        this.container =
            null

        this.timeDilationUI =
            null

        this.spacetimeUI =
            null

        this.activeExperiment =
            null

    }

}