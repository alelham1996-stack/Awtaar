/* =========================================================
   AWTAAR — MECHANICS WORLD UI
   =========================================================

   World:
   ⚙️ Mechanics

   Experiments:
   1. Newton's Laws — القوة التي تحرك العالم
   2. Collision — لحظة الاصطدام

   ARCHITECTURE:

   PhysicsWorldUI
        ↓
   MechanicsWorldUI
        ↓
   ├── NewtonLawsExperiment
   └── CollisionExperiment

   MechanicsWorldUI owns:
   - Mechanics world selector
   - Experiment opening / closing
   - Scene connection
   - World navigation

   NewtonLawsExperiment owns:
   - Three.js experiment
   - Experiment group
   - Experiment controls
   - Experiment HTML UI

   CollisionExperiment owns:
   - Three.js experiment
   - Experiment group
   - Experiment controls
   - Experiment HTML UI

   ========================================================= */


/* =========================================================
   CSS
   ========================================================= */

import './NewtonLaws.css'
import './MechanicsWorld.css'


/* =========================================================
   EXPERIMENTS
   ========================================================= */

import NewtonLawsExperiment
    from './NewtonLawsExperiment.js'

import CollisionExperiment
    from './CollisionExperiment.js'


/* =========================================================
   LANGUAGE
   ========================================================= */

import {
    t,
    getLanguage
} from '../locales/i18n.js'


/* =========================================================
   MECHANICS WORLD UI
   ========================================================= */

export default class MechanicsWorldUI {


    /* =========================================================
       CONSTRUCTOR
       ========================================================= */

    constructor(
        physicsWorldUI,
        scene = null
    ) {

        /* =====================================================
           REFERENCES
           ===================================================== */

        this.physicsWorldUI =
            physicsWorldUI || null


        this.scene =
            scene || null


        /* =====================================================
           STATE
           ===================================================== */

        this.isVisible =
            false


        this.isTransitioning =
            false


        this.isExperimentOpen =
            false


        this.activeExperiment =
            null


        /* =====================================================
           DOM
           ===================================================== */

        this.container =
            null

        this.header =
            null

        this.title =
            null

        this.subtitle =
            null

        this.experiments =
            null

        this.hint =
            null

        this.backButton =
            null


        /* =====================================================
           EXPERIMENT CARDS
           ===================================================== */

        this.newtonCard =
            null


        this.collisionCard =
            null


        /* =====================================================
           NEWTON EXPERIMENT

           constructor(scene = null, parent = null)
           ===================================================== */

        this.newtonLawsExperiment =
            new NewtonLawsExperiment(
                null,
                this
            )


        /* =====================================================
           COLLISION EXPERIMENT

           constructor(scene = null, parent = null)
           ===================================================== */

        this.collisionExperiment =
            new CollisionExperiment(
                null,
                this
            )


        /* =====================================================
           CREATE UI
           ===================================================== */

        this.createUI()


        /* =====================================================
           LANGUAGE
           ===================================================== */

        this.updateLanguage()


        /* =====================================================
           EXPERIMENT UIs HIDDEN
           ===================================================== */

        this.hideNewtonExperimentUI()

        this.hideCollisionExperimentUI()


        /* =====================================================
           RESIZE
           ===================================================== */

        this.handleResize =
            () => {

                this.updateResponsiveLayout()

            }


        window.addEventListener(
            'resize',
            this.handleResize
        )


        this.updateResponsiveLayout()


        /* =====================================================
           LANGUAGE CHANGE LISTENER
           ===================================================== */

        this.handleLanguageChange =
            () => {

                this.updateLanguage()

            }


        window.addEventListener(
            'awtaar-language-change',
            this.handleLanguageChange
        )


        /* =====================================================
           DEBUG
           ===================================================== */

        console.log(
            '⚙️ MechanicsWorldUI initialized'
        )

        console.log(
            '⚙️ Mechanics scene at initialization:',
            this.scene
        )
    }


    /* =========================================================
       TRANSLATION
       ========================================================= */

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

        } catch (
            error
        ) {

            console.warn(
                '⚠️ Mechanics translation failed:',
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


    /* =========================================================
       CREATE UI
       ========================================================= */

    createUI() {

        /* =====================================================
           ROOT
           ===================================================== */

        this.container =
            document.createElement(
                'div'
            )


        this.container.className =
            'mechanics-world-container'


        this.container.dir =
            'rtl'


        /*
           IMPORTANT:

           These inline values guarantee that the Mechanics
           selector cannot remain hidden because of a missing
           or conflicting CSS file.
        */

        this.container.style.position =
            'fixed'


        this.container.style.inset =
            '0'


        this.container.style.width =
            '100vw'


        this.container.style.height =
            '100vh'


        this.container.style.zIndex =
            '2500'


        this.container.style.display =
            'none'


        this.container.style.visibility =
            'hidden'


        this.container.style.opacity =
            '0'


        this.container.style.pointerEvents =
            'none'


        this.container.style.boxSizing =
            'border-box'


        /* =====================================================
           HEADER
           ===================================================== */

        this.header =
            document.createElement(
                'div'
            )


        this.header.className =
            'mechanics-world-header'


        /* =====================================================
           TITLE
           ===================================================== */

        this.title =
            document.createElement(
                'div'
            )


        this.title.className =
            'mechanics-world-title'


        /* =====================================================
           SUBTITLE
           ===================================================== */

        this.subtitle =
            document.createElement(
                'div'
            )


        this.subtitle.className =
            'mechanics-world-subtitle'


        this.header.appendChild(
            this.title
        )


        this.header.appendChild(
            this.subtitle
        )


        /* =====================================================
           BACK BUTTON
           ===================================================== */

        this.backButton =
            document.createElement(
                'button'
            )


        this.backButton.type =
            'button'


        this.backButton.className =
            'mechanics-world-back'


        this.backButton.addEventListener(
            'click',
            event => {

                event.preventDefault()

                event.stopPropagation()

                this.returnFromMechanics()

            }
        )


        this.header.appendChild(
            this.backButton
        )


        /* =====================================================
           EXPERIMENTS
           ===================================================== */

        this.experiments =
            document.createElement(
                'div'
            )


        this.experiments.className =
            'mechanics-experiments'


        /* =====================================================
           NEWTON
           ===================================================== */

        this.newtonCard =
            this.createExperimentCard({

                type:
                    'newton',

                icon:
                    '⚙️',

                title:
                    this.tx(
                        'mechanicsWorld.newton.title',
                        'القوة التي تحرك العالم',
                        'The Force That Moves the World'
                    ),

                description:
                    this.tx(
                        'mechanicsWorld.newton.description',
                        'اكتشف كيف تغيّر القوة والكتلة حركة الجسم.',
                        'Discover how force and mass change the motion of an object.'
                    ),

                available:
                    true

            })


        /* =====================================================
           COLLISION
           ===================================================== */

        this.collisionCard =
            this.createExperimentCard({

                type:
                    'collision',

                icon:
                    '◉',

                title:
                    this.tx(
                        'mechanicsWorld.collision.title',
                        'لحظة الاصطدام',
                        'The Moment of Collision'
                    ),

                description:
                    this.tx(
                        'mechanicsWorld.collision.description',
                        'اكتشف ماذا يحدث للزخم والطاقة عند التصادم.',
                        'Discover what happens to momentum and energy when objects collide.'
                    ),

                available:
                    true

            })


        /* =====================================================
           APPEND CARDS
           ===================================================== */

        this.experiments.appendChild(
            this.newtonCard
        )


        this.experiments.appendChild(
            this.collisionCard
        )


        /* =====================================================
           HINT
           ===================================================== */

        this.hint =
            document.createElement(
                'div'
            )


        this.hint.className =
            'mechanics-world-hint'


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


        document.body.appendChild(
            this.container
        )


        console.log(
            '⚙️ Mechanics UI DOM created:',
            this.container
        )
    }


    /* =========================================================
       CREATE EXPERIMENT CARD
       ========================================================= */

    createExperimentCard(
        options
    ) {

        const card =
            document.createElement(
                'button'
            )


        card.type =
            'button'


        card.className =
            'mechanics-experiment-card'


        card.dataset.experiment =
            options.type


        /* =====================================================
           BASIC BUTTON RESET

           Protects the card from browser defaults if the
           Mechanics CSS is incomplete.
        ===================================================== */

        card.style.boxSizing =
            'border-box'


        card.style.cursor =
            options.available
                ? 'pointer'
                : 'default'


        /* =====================================================
           DISABLED
           ===================================================== */

        if (
            !options.available
        ) {

            card.classList.add(
                'is-disabled'
            )


            card.disabled =
                true
        }


        /* =====================================================
           ICON
           ===================================================== */

        const icon =
            document.createElement(
                'div'
            )


        icon.className =
            'mechanics-experiment-icon'


        icon.textContent =
            options.icon


        /* =====================================================
           CONTENT
           ===================================================== */

        const content =
            document.createElement(
                'div'
            )


        content.className =
            'mechanics-experiment-content'


        /* =====================================================
           TITLE
           ===================================================== */

        const title =
            document.createElement(
                'div'
            )


        title.className =
            'mechanics-experiment-title'


        title.textContent =
            options.title


        /* =====================================================
           DESCRIPTION
           ===================================================== */

        const description =
            document.createElement(
                'div'
            )


        description.className =
            'mechanics-experiment-description'


        description.textContent =
            options.description


        content.appendChild(
            title
        )


        content.appendChild(
            description
        )


        /* =====================================================
           COMING SOON

           Only displayed when the experiment is actually
           unavailable.
           ===================================================== */

        if (
            !options.available
        ) {

            const lock =
                document.createElement(
                    'span'
                )


            lock.className =
                'mechanics-experiment-lock'


            lock.textContent =
                this.tx(
                    'mechanicsWorld.comingSoon',
                    'قريبًا',
                    'Coming soon'
                )


            content.appendChild(
                lock
            )
        }


        /* =====================================================
           ARROW
           ===================================================== */

        const arrow =
            document.createElement(
                'span'
            )


        arrow.className =
            'mechanics-experiment-arrow'


        /*
           Arabic:
           ←

           English:
           →
        */

        arrow.textContent =
            getLanguage() === 'en'
                ? '→'
                : '←'


        /* =====================================================
           BUILD
           ===================================================== */

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
           NEWTON CLICK
           ===================================================== */

        if (
            options.available &&
            options.type === 'newton'
        ) {

            card.addEventListener(
                'click',
                event => {

                    event.preventDefault()

                    event.stopPropagation()

                    this.openNewtonLaws()

                }
            )
        }


        /* =====================================================
           COLLISION CLICK
           ===================================================== */

        if (
            options.available &&
            options.type === 'collision'
        ) {

            card.addEventListener(
                'click',
                event => {

                    event.preventDefault()

                    event.stopPropagation()

                    this.openCollision()

                }
            )
        }


        return card
    }


    /* =========================================================
       UPDATE EXPERIMENT CARD LANGUAGE
       ========================================================= */

    updateExperimentCardsLanguage() {

        const language =
            typeof getLanguage === 'function'
                ? getLanguage()
                : 'ar'


        /* =====================================================
           NEWTON CARD
           ===================================================== */

        if (
            this.newtonCard
        ) {

            const title =
                this.newtonCard.querySelector(
                    '.mechanics-experiment-title'
                )


            const description =
                this.newtonCard.querySelector(
                    '.mechanics-experiment-description'
                )


            const arrow =
                this.newtonCard.querySelector(
                    '.mechanics-experiment-arrow'
                )


            if (
                title
            ) {

                title.textContent =
                    this.tx(
                        'mechanicsWorld.newton.title',
                        'القوة التي تحرك العالم',
                        'The Force That Moves the World'
                    )
            }


            if (
                description
            ) {

                description.textContent =
                    this.tx(
                        'mechanicsWorld.newton.description',
                        'اكتشف كيف تغيّر القوة والكتلة حركة الجسم.',
                        'Discover how force and mass change the motion of an object.'
                    )
            }


            if (
                arrow
            ) {

                arrow.textContent =
                    language === 'en'
                        ? '→'
                        : '←'
            }
        }


        /* =====================================================
           COLLISION CARD
           ===================================================== */

        if (
            this.collisionCard
        ) {

            const title =
                this.collisionCard.querySelector(
                    '.mechanics-experiment-title'
                )


            const description =
                this.collisionCard.querySelector(
                    '.mechanics-experiment-description'
                )


            const arrow =
                this.collisionCard.querySelector(
                    '.mechanics-experiment-arrow'
                )


            if (
                title
            ) {

                title.textContent =
                    this.tx(
                        'mechanicsWorld.collision.title',
                        'لحظة الاصطدام',
                        'The Moment of Collision'
                    )
            }


            if (
                description
            ) {

                description.textContent =
                    this.tx(
                        'mechanicsWorld.collision.description',
                        'اكتشف ماذا يحدث للزخم والطاقة عند التصادم.',
                        'Discover what happens to momentum and energy when objects collide.'
                    )
            }


            if (
                arrow
            ) {

                arrow.textContent =
                    language === 'en'
                        ? '→'
                        : '←'
            }
        }
    }


    /* =========================================================
       UPDATE LANGUAGE
       ========================================================= */

    updateLanguage() {

        const language =
            typeof getLanguage === 'function'
                ? getLanguage()
                : 'ar'


        /* =====================================================
           DIRECTION
           ===================================================== */

        if (
            this.container
        ) {

            this.container.dir =
                language === 'en'
                    ? 'ltr'
                    : 'rtl'
        }


        /* =====================================================
           TITLE
           ===================================================== */

        if (
            this.title
        ) {

            this.title.textContent =
                this.tx(
                    'mechanicsWorld.title',
                    'عالم الميكانيكا',
                    'Mechanics World'
                )
        }


        /* =====================================================
           SUBTITLE
           ===================================================== */

        if (
            this.subtitle
        ) {

            this.subtitle.textContent =
                this.tx(
                    'mechanicsWorld.description',
                    'حيث تتحول القوة إلى حركة',
                    'Where force becomes motion'
                )
        }


        /* =====================================================
           HINT
           ===================================================== */

        if (
            this.hint
        ) {

            this.hint.textContent =
                this.tx(
                    'mechanicsWorld.hint',
                    'اختر تجربة لتبدأ الاكتشاف',
                    'Choose an experiment to begin'
                )
        }


        /* =====================================================
           BACK BUTTON
           ===================================================== */

        if (
            this.backButton
        ) {

            this.backButton.textContent =
                this.tx(
                    'mechanicsWorld.back',
                    'العودة',
                    'Back'
                )
        }


        /* =====================================================
           EXPERIMENT CARDS
           ===================================================== */

        this.updateExperimentCardsLanguage()


        /* =====================================================
           NEWTON EXPERIMENT LANGUAGE
           ===================================================== */

        if (
            this.newtonLawsExperiment &&
            typeof this.newtonLawsExperiment.updateLanguage ===
            'function'
        ) {

            try {

                this.newtonLawsExperiment
                    .updateLanguage()

            } catch (
                error
            ) {

                console.warn(
                    '⚠️ Mechanics: Newton language update failed.',
                    error
                )
            }
        }


        /* =====================================================
           COLLISION EXPERIMENT LANGUAGE
           ===================================================== */

        if (
            this.collisionExperiment &&
            typeof this.collisionExperiment.updateLanguage ===
            'function'
        ) {

            try {

                this.collisionExperiment
                    .updateLanguage()

            } catch (
                error
            ) {

                console.warn(
                    '⚠️ Mechanics: Collision language update failed.',
                    error
                )
            }
        }
    }


    /* =========================================================
       OPEN

       PhysicsWorldUI can call open() or show().
       ========================================================= */

    open() {

        console.log(
            '⚙️ MechanicsWorldUI.open()'
        )

        this.show()
    }


    /* =========================================================
       SHOW
       ========================================================= */

    show() {

        if (
            !this.container
        ) {

            console.error(
                '❌ MechanicsWorldUI: container does not exist.'
            )

            return
        }


        /* =====================================================
           DO NOT SHOW SELECTOR OVER EXPERIMENT
           ===================================================== */

        if (
            this.isExperimentOpen
        ) {

            console.warn(
                '⚠️ MechanicsWorldUI.show(): experiment is open.'
            )

            return
        }


        console.log(
            '⚙️ MechanicsWorldUI.show()'
        )


        this.updateLanguage()


        this.hideNewtonExperimentUI()

        this.hideCollisionExperimentUI()


        /* =====================================================
           FORCE VISIBILITY
           ===================================================== */

        this.container.style.display =
            'flex'


        this.container.style.visibility =
            'visible'


        this.container.style.pointerEvents =
            'auto'


        this.container.style.zIndex =
            '2500'


        this.container.style.opacity =
            '1'


        this.container.classList.remove(
            'is-hidden'
        )


        this.container.classList.remove(
            'is-entering'
        )


        /* =====================================================
           FORCE CHILDREN VISIBILITY
           ===================================================== */

        if (
            this.header
        ) {

            this.header.style.visibility =
                'visible'
        }


        if (
            this.experiments
        ) {

            this.experiments.style.visibility =
                'visible'
        }


        if (
            this.hint
        ) {

            this.hint.style.visibility =
                'visible'
        }


        this.isVisible =
            true


        /* =====================================================
           DEBUG
           ===================================================== */

        console.log(
            '⚙️ Mechanics selector is now visible.'
        )

        console.log(
            '⚙️ Mechanics container:',
            this.container
        )
    }


    /* =========================================================
       HIDE
       ========================================================= */

    hide() {

        if (
            !this.container
        ) {

            return
        }


        this.container.style.opacity =
            '0'


        this.container.style.pointerEvents =
            'none'


        this.container.style.visibility =
            'hidden'


        this.container.style.display =
            'none'


        this.isVisible =
            false
    }


    /* =========================================================
       OPEN NEWTON
       ========================================================= */

    openNewtonLaws() {

        /* =====================================================
           PROTECTION
           ===================================================== */

        if (
            this.isTransitioning
        ) {

            return
        }


        if (
            this.isExperimentOpen
        ) {

            return
        }


        if (
            !this.newtonLawsExperiment
        ) {

            console.error(
                '❌ Mechanics: NewtonLawsExperiment missing.'
            )

            return
        }


        /* =====================================================
           SCENE
           ===================================================== */

        if (
            !this.scene
        ) {

            console.error(
                '❌ Mechanics: REAL THREE.JS SCENE IS NULL.'
            )

            console.error(
                '❌ PhysicsWorldUI → MechanicsWorldUI scene connection failed.'
            )

            return
        }


        console.log(
            '⚙️ Mechanics: opening Newton experiment.'
        )


        console.log(
            '⚙️ Mechanics scene:',
            this.scene
        )


        /* =====================================================
           STATE
           ===================================================== */

        this.isTransitioning =
            true


        this.isExperimentOpen =
            true


        this.activeExperiment =
            'newton'


        /* =====================================================
           HIDE SELECTOR
           ===================================================== */

        this.hide()


        /* =====================================================
           UNIVERSE
           ===================================================== */

        this.enterExperimentMode()


        /* =====================================================
           CONNECT SCENE
           ===================================================== */

        if (
            typeof this.newtonLawsExperiment.setScene ===
            'function'
        ) {

            this.newtonLawsExperiment.setScene(
                this.scene
            )
        }


        /* =====================================================
           ADD TO SCENE
           ===================================================== */

        this.addExperimentToScene(
            this.newtonLawsExperiment
        )


        /* =====================================================
           FORCE THREE.JS VISIBILITY
           ===================================================== */

        this.forceExperimentVisibility(
            this.newtonLawsExperiment
        )


        /* =====================================================
           RESET
           ===================================================== */

        if (
            typeof this.newtonLawsExperiment.reset ===
            'function'
        ) {

            this.newtonLawsExperiment.reset()
        }


        /* =====================================================
           START

           Newton keeps its existing behavior.
           ===================================================== */

        if (
            typeof this.newtonLawsExperiment.start ===
            'function'
        ) {

            this.newtonLawsExperiment.start()
        }


        /* =====================================================
           SHOW EXPERIMENT UI
           ===================================================== */

        this.showNewtonExperimentUI()


        /* =====================================================
           END TRANSITION
           ===================================================== */

        requestAnimationFrame(
            () => {

                this.isTransitioning =
                    false

            }
        )
    }


    /* =========================================================
       OPEN COLLISION
       ========================================================= */

    openCollision() {

        /* =====================================================
           PROTECTION
           ===================================================== */

        if (
            this.isTransitioning
        ) {

            return
        }


        if (
            this.isExperimentOpen
        ) {

            return
        }


        if (
            !this.collisionExperiment
        ) {

            console.error(
                '❌ Mechanics: CollisionExperiment missing.'
            )

            return
        }


        /* =====================================================
           SCENE
           ===================================================== */

        if (
            !this.scene
        ) {

            console.error(
                '❌ Mechanics: REAL THREE.JS SCENE IS NULL.'
            )

            console.error(
                '❌ PhysicsWorldUI → MechanicsWorldUI scene connection failed.'
            )

            return
        }


        console.log(
            '⚙️ Mechanics: opening Collision experiment.'
        )


        console.log(
            '⚙️ Mechanics scene:',
            this.scene
        )


        /* =====================================================
           STATE
           ===================================================== */

        this.isTransitioning =
            true


        this.isExperimentOpen =
            true


        this.activeExperiment =
            'collision'


        /* =====================================================
           HIDE SELECTOR
           ===================================================== */

        this.hide()


        /* =====================================================
           UNIVERSE
           ===================================================== */

        this.enterExperimentMode()


        /* =====================================================
           CONNECT SCENE
           ===================================================== */

        if (
            typeof this.collisionExperiment.setScene ===
            'function'
        ) {

            this.collisionExperiment.setScene(
                this.scene
            )
        }


        /* =====================================================
           ADD TO SCENE
           ===================================================== */

        this.addExperimentToScene(
            this.collisionExperiment
        )


        /* =====================================================
           FORCE THREE.JS VISIBILITY
           ===================================================== */

        this.forceExperimentVisibility(
            this.collisionExperiment
        )


        /* =====================================================
           RESET

           IMPORTANT:

           We intentionally DO NOT call start() here.

           Collision must open in a ready state and wait
           for the learner to press the Start Collision
           button inside the experiment UI.
           ===================================================== */

        if (
            typeof this.collisionExperiment.reset ===
            'function'
        ) {

            this.collisionExperiment.reset()
        }


        /* =====================================================
           SHOW EXPERIMENT UI
           ===================================================== */

        this.showCollisionExperimentUI()


        /* =====================================================
           END TRANSITION
           ===================================================== */

        requestAnimationFrame(
            () => {

                this.isTransitioning =
                    false

            }
        )
    }


    /* =========================================================
       ENTER EXPERIMENT MODE
       ========================================================= */

    enterExperimentMode() {

        const universe =
            this.scene &&
            this.scene.userData
                ? this.scene.userData.awtaarUniverse
                : null


        if (
            universe &&
            typeof universe.setExperimentMode ===
            'function'
        ) {

            try {

                universe.setExperimentMode(
                    true
                )

            } catch (
                error
            ) {

                console.warn(
                    '⚠️ Mechanics: setExperimentMode(true) failed.',
                    error
                )
            }
        }
    }


    /* =========================================================
       EXIT EXPERIMENT MODE
       ========================================================= */

    exitExperimentMode() {

        const universe =
            this.scene &&
            this.scene.userData
                ? this.scene.userData.awtaarUniverse
                : null


        if (
            universe &&
            typeof universe.setExperimentMode ===
            'function'
        ) {

            try {

                universe.setExperimentMode(
                    false
                )

            } catch (
                error
            ) {

                console.warn(
                    '⚠️ Mechanics: setExperimentMode(false) failed.',
                    error
                )
            }
        }
    }


    /* =========================================================
       ADD EXPERIMENT TO SCENE
       ========================================================= */

    addExperimentToScene(
        experiment
    ) {

        if (
            !experiment ||
            !this.scene
        ) {

            return
        }


        if (
            typeof experiment.addToScene ===
            'function'
        ) {

            experiment.addToScene(
                this.scene
            )

            return
        }


        if (
            experiment.group
        ) {

            if (
                experiment.group.parent !==
                this.scene
            ) {

                this.scene.add(
                    experiment.group
                )
            }
        }
    }


    /* =========================================================
       FORCE EXPERIMENT VISIBILITY
       ========================================================= */

    forceExperimentVisibility(
        experiment
    ) {

        if (
            !experiment ||
            !experiment.group
        ) {

            return
        }


        experiment.group.visible =
            true


        experiment
            .group
            .traverse(
                object => {

                    object.visible =
                        true

                }
            )
    }


    /* =========================================================
       SHOW NEWTON UI
       ========================================================= */

    showNewtonExperimentUI() {

        if (
            !this.newtonLawsExperiment
        ) {

            return
        }


        if (
            typeof this.newtonLawsExperiment.show ===
            'function'
        ) {

            this.newtonLawsExperiment.show()

            return
        }


        const element =
            document.querySelector(
                '.newton-laws-container'
            )


        if (
            !element
        ) {

            console.warn(
                '⚠️ Newton UI element not found.'
            )

            return
        }


        element.style.display =
            'block'


        element.style.visibility =
            'visible'


        element.style.pointerEvents =
            'auto'


        element.style.opacity =
            '1'


        element.style.zIndex =
            '3000'
    }


    /* =========================================================
       HIDE NEWTON UI
       ========================================================= */

    hideNewtonExperimentUI() {

        if (
            !this.newtonLawsExperiment
        ) {

            return
        }


        if (
            typeof this.newtonLawsExperiment.hide ===
            'function'
        ) {

            this.newtonLawsExperiment.hide()

            return
        }


        const element =
            document.querySelector(
                '.newton-laws-container'
            )


        if (
            !element
        ) {

            return
        }


        element.style.display =
            'none'


        element.style.visibility =
            'hidden'


        element.style.pointerEvents =
            'none'


        element.style.opacity =
            '0'
    }


    /* =========================================================
       SHOW COLLISION UI
       ========================================================= */

    showCollisionExperimentUI() {

        if (
            !this.collisionExperiment
        ) {

            return
        }


        if (
            typeof this.collisionExperiment.show ===
            'function'
        ) {

            this.collisionExperiment.show()

            return
        }


        const element =
            document.querySelector(
                '.collision-experiment'
            )


        if (
            !element
        ) {

            console.warn(
                '⚠️ Collision UI element not found.'
            )

            return
        }


        element.style.display =
            'block'


        element.style.visibility =
            'visible'


        element.style.pointerEvents =
            'auto'


        element.style.opacity =
            '1'


        element.style.zIndex =
            '3000'
    }


    /* =========================================================
       HIDE COLLISION UI
       ========================================================= */

    hideCollisionExperimentUI() {

        if (
            !this.collisionExperiment
        ) {

            return
        }


        if (
            typeof this.collisionExperiment.hide ===
            'function'
        ) {

            this.collisionExperiment.hide()

            return
        }


        const element =
            document.querySelector(
                '.collision-experiment'
            )


        if (
            !element
        ) {

            return
        }


        element.style.display =
            'none'


        element.style.visibility =
            'hidden'


        element.style.pointerEvents =
            'none'


        element.style.opacity =
            '0'
    }


    /* =========================================================
       STOP EXPERIMENT
       ========================================================= */

    stopExperiment(
        experiment
    ) {

        if (
            !experiment
        ) {

            return
        }


        if (
            typeof experiment.stop ===
            'function'
        ) {

            try {

                experiment.stop()

            } catch (
                error
            ) {

                console.warn(
                    '⚠️ Mechanics: experiment stop failed.',
                    error
                )
            }
        }
    }


    /* =========================================================
       REMOVE EXPERIMENT GROUP
       ========================================================= */

    removeExperimentFromScene(
        experiment
    ) {

        if (
            !experiment ||
            !experiment.group
        ) {

            return
        }


        const group =
            experiment.group


        if (
            group.parent
        ) {

            group.parent.remove(
                group
            )
        }
    }


    /* =========================================================
       RETURN TO WORLD

       Kept for compatibility with older Newton code.
       ========================================================= */

    returnToWorld() {

        console.log(
            '⚙️ MechanicsWorldUI.returnToWorld()'
        )

        this.closeExperiment()
    }


    /* =========================================================
       CLOSE EXPERIMENT
       ========================================================= */

    closeExperiment() {

        if (
            !this.isExperimentOpen
        ) {

            return
        }


        if (
            this.isTransitioning
        ) {

            return
        }


        console.log(
            '⚙️ Mechanics: closing experiment.',
            this.activeExperiment
        )


        this.isTransitioning =
            true


        /* =====================================================
           STOP ACTIVE EXPERIMENT
           ===================================================== */

        if (
            this.activeExperiment ===
            'newton'
        ) {

            this.stopExperiment(
                this.newtonLawsExperiment
            )

        } else if (
            this.activeExperiment ===
            'collision'
        ) {

            this.stopExperiment(
                this.collisionExperiment
            )
        }


        /* =====================================================
           HIDE EXPERIMENT UIs
           ===================================================== */

        this.hideNewtonExperimentUI()

        this.hideCollisionExperimentUI()


        /* =====================================================
           REMOVE ACTIVE EXPERIMENT GROUP
           ===================================================== */

        if (
            this.activeExperiment ===
            'newton'
        ) {

            this.removeExperimentFromScene(
                this.newtonLawsExperiment
            )

        } else if (
            this.activeExperiment ===
            'collision'
        ) {

            this.removeExperimentFromScene(
                this.collisionExperiment
            )
        }


        /* =====================================================
           EXIT EXPERIMENT MODE
           ===================================================== */

        this.exitExperimentMode()


        /* =====================================================
           RESET STATE
           ===================================================== */

        this.isExperimentOpen =
            false


        this.activeExperiment =
            null


        /* =====================================================
           SHOW MECHANICS SELECTOR
           ===================================================== */

        this.show()


        requestAnimationFrame(
            () => {

                this.isTransitioning =
                    false

            }
        )
    }


    /* =========================================================
       RETURN FROM MECHANICS
       ========================================================= */

    returnFromMechanics() {

        console.log(
            '⚙️ MechanicsWorldUI.returnFromMechanics()'
        )


        /* =====================================================
           EXPERIMENT OPEN
           ===================================================== */

        if (
            this.isExperimentOpen
        ) {

            this.closeExperiment()

            return
        }


        /* =====================================================
           HIDE MECHANICS
           ===================================================== */

        this.hide()


        /* =====================================================
           RETURN TO PHYSICS WORLD
           ===================================================== */

        if (
            this.physicsWorldUI &&
            typeof this.physicsWorldUI.returnFromMechanics ===
            'function'
        ) {

            this.physicsWorldUI
                .returnFromMechanics()

            return
        }


        /* =====================================================
           FALLBACK
           ===================================================== */

        if (
            this.physicsWorldUI &&
            typeof this.physicsWorldUI.show ===
            'function'
        ) {

            this.physicsWorldUI.show()
        }
    }


    /* =========================================================
       SET SCENE
       ========================================================= */

    setScene(
        scene
    ) {

        this.scene =
            scene || null


        console.log(
            '⚙️ MechanicsWorldUI: REAL SCENE RECEIVED:',
            this.scene
        )


        /* =====================================================
           NEWTON
           ===================================================== */

        if (
            this.newtonLawsExperiment &&
            typeof this.newtonLawsExperiment.setScene ===
            'function'
        ) {

            this.newtonLawsExperiment.setScene(
                this.scene
            )
        }


        /* =====================================================
           COLLISION
           ===================================================== */

        if (
            this.collisionExperiment &&
            typeof this.collisionExperiment.setScene ===
            'function'
        ) {

            this.collisionExperiment.setScene(
                this.scene
            )
        }
    }


    /* =========================================================
       UPDATE
       ========================================================= */

    update(
        delta
    ) {

        /* =====================================================
           NO EXPERIMENT
           ===================================================== */

        if (
            !this.isExperimentOpen
        ) {

            return
        }


        /* =====================================================
           NEWTON
           ===================================================== */

        if (
            this.activeExperiment ===
            'newton'
        ) {

            if (
                this.newtonLawsExperiment &&
                typeof this.newtonLawsExperiment.update ===
                'function'
            ) {

                this.newtonLawsExperiment.update(
                    delta
                )
            }


            return
        }


        /* =====================================================
           COLLISION
           ===================================================== */

        if (
            this.activeExperiment ===
            'collision'
        ) {

            if (
                this.collisionExperiment &&
                typeof this.collisionExperiment.update ===
                'function'
            ) {

                this.collisionExperiment.update(
                    delta
                )
            }


            return
        }
    }


    /* =========================================================
       RESPONSIVE
       ========================================================= */

    updateResponsiveLayout() {

        if (
            !this.container
        ) {

            return
        }


        if (
            window.innerWidth < 900
        ) {

            this.container.classList.add(
                'is-compact'
            )

        } else {

            this.container.classList.remove(
                'is-compact'
            )
        }
    }


    /* =========================================================
       DESTROY
       ========================================================= */

    destroy() {

        console.log(
            '🗑️ MechanicsWorldUI: destroy'
        )


        /* =====================================================
           RESIZE
           ===================================================== */

        if (
            this.handleResize
        ) {

            window.removeEventListener(
                'resize',
                this.handleResize
            )


            this.handleResize =
                null
        }


        /* =====================================================
           LANGUAGE
           ===================================================== */

        if (
            this.handleLanguageChange
        ) {

            window.removeEventListener(
                'awtaar-language-change',
                this.handleLanguageChange
            )


            this.handleLanguageChange =
                null
        }


        /* =====================================================
           NEWTON
           ===================================================== */

        if (
            this.newtonLawsExperiment
        ) {

            this.stopExperiment(
                this.newtonLawsExperiment
            )


            this.removeExperimentFromScene(
                this.newtonLawsExperiment
            )


            if (
                typeof this.newtonLawsExperiment.destroy ===
                'function'
            ) {

                this.newtonLawsExperiment.destroy()
            }


            this.newtonLawsExperiment =
                null
        }


        /* =====================================================
           COLLISION
           ===================================================== */

        if (
            this.collisionExperiment
        ) {

            this.stopExperiment(
                this.collisionExperiment
            )


            this.removeExperimentFromScene(
                this.collisionExperiment
            )


            if (
                typeof this.collisionExperiment.destroy ===
                'function'
            ) {

                this.collisionExperiment.destroy()
            }


            this.collisionExperiment =
                null
        }


        /* =====================================================
           DOM
           ===================================================== */

        if (
            this.container
        ) {

            this.container.remove()

            this.container =
                null
        }


        /* =====================================================
           STATE
           ===================================================== */

        this.scene =
            null


        this.physicsWorldUI =
            null


        this.isVisible =
            false


        this.isTransitioning =
            false


        this.isExperimentOpen =
            false


        this.activeExperiment =
            null


        this.newtonCard =
            null


        this.collisionCard =
            null
    }
}