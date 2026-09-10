import './galaxies.css'


import PhysicsGalaxyUI
    from './PhysicsGalaxyUI.js'


import BiologyWorldUI
    from '../biology/BiologyWorldUI.js'


import {
    t,
    getLanguage
} from '../locales/i18n.js'


export default class GalaxiesUI {


    constructor(
        scene = null,
        explorationUI = null
    ) {


        /* =====================================================
           REFERENCES
           ===================================================== */

        this.scene =
            scene

        this.explorationUI =
            explorationUI


        /* =====================================================
           STATE
           ===================================================== */

        this.isTransitioning =
            false


        /* =====================================================
           PHYSICS GALAXY
           ===================================================== */

        this.physicsGalaxyUI =
            new PhysicsGalaxyUI(
                this.scene,
                this
            )


        /* =====================================================
           BIOLOGY GALAXY
           =====================================================

           BiologyWorldUI is currently the first
           real world-level interface inside the
           Biology Galaxy.

           Later we can extend this with:
               CellWorldUI
               GeneticsWorldUI
               etc.

           ===================================================== */

        this.biologyWorldUI =
            new BiologyWorldUI(
                this,
                this.scene
            )


        /* =====================================================
           CREATE
           ===================================================== */

        this.createUI()

    }


    /* =========================================================
       CREATE UI
       ========================================================= */

    createUI() {


        /* =====================================================
           MAIN CONTAINER
           ===================================================== */

        this.container =
            document.createElement(
                'section'
            )

        this.container.id =
            'awtaar-galaxies'


        /* =====================================================
           TITLE
           ===================================================== */

        this.title =
            document.createElement(
                'h2'
            )

        this.title.textContent =
            t(
                'galaxies.title'
            )


        /* =====================================================
           SUBTITLE
           ===================================================== */

        this.subtitle =
            document.createElement(
                'p'
            )

        this.subtitle.textContent =
            t(
                'galaxies.subtitle'
            )


        /* =====================================================
           GALAXIES LIST
           ===================================================== */

        this.galaxies =
            document.createElement(
                'div'
            )

        this.galaxies.className =
            'awtaar-galaxies-list'


        /* =====================================================
           GALAXY DATA
           ===================================================== */

        this.galaxyData = [


            {
                key:
                    'physics',

                translationKey:
                    'galaxies.physics',

                symbol:
                    '∞'
            },


            {
                key:
                    'biology',

                translationKey:
                    'galaxies.biology',

                symbol:
                    'DNA'
            },


            {
                key:
                    'astronomy',

                translationKey:
                    'galaxies.astronomy',

                symbol:
                    '✦'
            },


            {
                key:
                    'earth',

                translationKey:
                    'galaxies.earth',

                symbol:
                    '◉'
            },


            {
                key:
                    'chemistry',

                translationKey:
                    'galaxies.chemistry',

                symbol:
                    '⚗'
            }

        ]


        /* =====================================================
           CREATE GALAXY BUTTONS
           ===================================================== */

        this.galaxyData.forEach(
            galaxy => {


                const item =
                    document.createElement(
                        'button'
                    )


                item.type =
                    'button'


                item.className =
                    'awtaar-galaxy'


                item.dataset.galaxy =
                    galaxy.key


                /* =================================================
                   CORE
                   ================================================= */

                const core =
                    document.createElement(
                        'span'
                    )

                core.className =
                    'awtaar-galaxy-core'

                core.textContent =
                    galaxy.symbol


                /* =================================================
                   NAME
                   ================================================= */

                const name =
                    document.createElement(
                        'span'
                    )

                name.className =
                    'awtaar-galaxy-name'

                name.textContent =
                    t(
                        galaxy.translationKey
                    )


                /* =================================================
                   BUILD BUTTON
                   ================================================= */

                item.appendChild(
                    core
                )

                item.appendChild(
                    name
                )


                /* =================================================
                   CLICK
                   ================================================= */

                item.addEventListener(
                    'click',
                    event => {


                        event.preventDefault()

                        event.stopPropagation()


                        if (
                            this.isTransitioning
                        ) {

                            return

                        }


                        console.log(
                            `🌌 Galaxy clicked: ${galaxy.key}`
                        )


                        this.selectGalaxy(
                            galaxy.key,
                            t(
                                galaxy.translationKey
                            )
                        )

                    }
                )


                this.galaxies.appendChild(
                    item
                )

            }
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
            'awtaar-galaxies-back'


        this.backButton.textContent =
            t(
                'common.back'
            )


        this.backButton.addEventListener(
            'click',
            event => {


                event.preventDefault()

                event.stopPropagation()


                if (
                    this.isTransitioning
                ) {

                    return

                }


                this.returnToExploration()

            }
        )


        /* =====================================================
           BUILD
           ===================================================== */

        this.container.appendChild(
            this.title
        )


        this.container.appendChild(
            this.subtitle
        )


        this.container.appendChild(
            this.galaxies
        )


        this.container.appendChild(
            this.backButton
        )


        /* =====================================================
           DOM
           ===================================================== */

        document.body.appendChild(
            this.container
        )


        /* =====================================================
           INITIAL STATE
           ===================================================== */

        this.container.style.opacity =
            '0'

        this.container.style.visibility =
            'hidden'

        this.container.style.pointerEvents =
            'none'


        /* =====================================================
           LANGUAGE
           ===================================================== */

        this.updateLanguage()

    }


    /* =========================================================
       UPDATE LANGUAGE
       ========================================================= */

    updateLanguage() {


        /* =====================================================
           DIRECTION
           ===================================================== */

        this.container.dir =
            getLanguage() === 'ar'
                ? 'rtl'
                : 'ltr'


        /* =====================================================
           GALAXY TITLE
           ===================================================== */

        if (
            this.title
        ) {

            this.title.textContent =
                t(
                    'galaxies.title'
                )

        }


        /* =====================================================
           GALAXY DESCRIPTION
           ===================================================== */

        if (
            this.subtitle
        ) {

            this.subtitle.textContent =
                t(
                    'galaxies.subtitle'
                )

        }


        /* =====================================================
           GALAXY NAMES
           ===================================================== */

        const galaxyItems =
            this.galaxies.querySelectorAll(
                '.awtaar-galaxy'
            )


        galaxyItems.forEach(
            (
                item,
                index
            ) => {


                const galaxy =
                    this.galaxyData[index]


                if (
                    !galaxy
                ) {

                    return

                }


                const name =
                    item.querySelector(
                        '.awtaar-galaxy-name'
                    )


                if (
                    name
                ) {

                    name.textContent =
                        t(
                            galaxy.translationKey
                        )

                }

            }
        )


        /* =====================================================
           BACK
           ===================================================== */

        if (
            this.backButton
        ) {

            this.backButton.textContent =
                t(
                    'common.back'
                )

        }


        /* =====================================================
           PHYSICS GALAXY
           ===================================================== */

        if (
            this.physicsGalaxyUI &&
            typeof this.physicsGalaxyUI.updateLanguage ===
            'function'
        ) {

            this.physicsGalaxyUI.updateLanguage()

        }


        /* =====================================================
           BIOLOGY GALAXY
           ===================================================== */

        if (
            this.biologyWorldUI &&
            typeof this.biologyWorldUI.updateLanguage ===
            'function'
        ) {

            this.biologyWorldUI.updateLanguage()

        }

    }


    /* =========================================================
       SHOW GALAXIES
       ========================================================= */

    show() {


        console.log(
            '🌌 Showing Awtaar Galaxies'
        )


        this.isTransitioning =
            false


        this.updateLanguage()


        /* =====================================================
           SHOW
           ===================================================== */

        this.container.style.display =
            'flex'


        this.container.style.visibility =
            'visible'


        this.container.style.pointerEvents =
            'auto'


        /* =====================================================
           ENABLE BUTTONS
           ===================================================== */

        const buttons =
            this.galaxies.querySelectorAll(
                '.awtaar-galaxy'
            )


        buttons.forEach(
            button => {

                button.disabled =
                    false

                button.style.pointerEvents =
                    'auto'

            }
        )


        if (
            this.backButton
        ) {

            this.backButton.disabled =
                false

        }


        /* =====================================================
           FADE IN
           ===================================================== */

        requestAnimationFrame(
            () => {

                this.container.style.opacity =
                    '1'

            }
        )

    }


    /* =========================================================
       HIDE GALAXIES
       ========================================================= */

    hide() {


        this.container.style.opacity =
            '0'


        this.container.style.pointerEvents =
            'none'


        /* =====================================================
           DISABLE GALAXY BUTTONS
           ===================================================== */

        const buttons =
            this.galaxies.querySelectorAll(
                '.awtaar-galaxy'
            )


        buttons.forEach(
            button => {

                button.style.pointerEvents =
                    'none'

            }
        )


        /* =====================================================
           HIDE AFTER TRANSITION
           ===================================================== */

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
            700
        )

    }


    /* =========================================================
       SELECT GALAXY
       ========================================================= */

    selectGalaxy(
        key,
        name
    ) {


        console.log(
            `🌌 Awtaar Galaxy Selected: ${name}`
        )


        if (
            this.isTransitioning
        ) {

            return

        }


        /* =====================================================
           PHYSICS
           ===================================================== */

        if (
            key ===
            'physics'
        ) {

            console.log(
                '∞ Opening Awtaar Physics Galaxy'
            )


            this.openPhysicsGalaxy()


            return

        }


        /* =====================================================
           BIOLOGY
           ===================================================== */

        if (
            key ===
            'biology'
        ) {

            console.log(
                '🧬 Opening Awtaar Biology Galaxy'
            )


            this.openBiologyGalaxy()


            return

        }


        /* =====================================================
           FUTURE GALAXIES
           ===================================================== */

        console.log(
            `🌌 Galaxy "${name}" is coming soon.`
        )

    }


    /* =========================================================
       OPEN PHYSICS GALAXY
       ========================================================= */

    openPhysicsGalaxy() {


        if (
            this.isTransitioning
        ) {

            return

        }


        if (
            !this.physicsGalaxyUI
        ) {

            console.error(
                '❌ PhysicsGalaxyUI is not available'
            )

            return

        }


        console.log(
            '🌀 Preparing Physics Galaxy...'
        )


        this.isTransitioning =
            true


        /* =====================================================
           DISABLE GALAXY BUTTONS
           ===================================================== */

        const galaxyButtons =
            this.galaxies.querySelectorAll(
                '.awtaar-galaxy'
            )


        galaxyButtons.forEach(
            button => {

                button.disabled =
                    true

            }
        )


        this.backButton.disabled =
            true


        /* =====================================================
           HIDE GALAXIES
           ===================================================== */

        this.hide()


        /* =====================================================
           ENTER PHYSICS
           ===================================================== */

        setTimeout(
            () => {


                console.log(
                    '🌀 Opening Physics Galaxy'
                )


                if (
                    typeof this.physicsGalaxyUI.updateLanguage ===
                    'function'
                ) {

                    this.physicsGalaxyUI.updateLanguage()

                }


                this.physicsGalaxyUI.show()


                this.isTransitioning =
                    false

            },
            700
        )

    }


    /* =========================================================
       OPEN BIOLOGY GALAXY
       ========================================================= */

    openBiologyGalaxy() {


        if (
            this.isTransitioning
        ) {

            return

        }


        if (
            !this.biologyWorldUI
        ) {

            console.error(
                '❌ BiologyWorldUI is not available'
            )

            return

        }


        console.log(
            '🧬 Preparing Biology Galaxy...'
        )


        this.isTransitioning =
            true


        /* =====================================================
           DISABLE GALAXY BUTTONS
           ===================================================== */

        const galaxyButtons =
            this.galaxies.querySelectorAll(
                '.awtaar-galaxy'
            )


        galaxyButtons.forEach(
            button => {

                button.disabled =
                    true

            }
        )


        this.backButton.disabled =
            true


        /* =====================================================
           HIDE GALAXIES
           ===================================================== */

        this.hide()


        /* =====================================================
           ENTER BIOLOGY
           ===================================================== */

        setTimeout(
            () => {


                console.log(
                    '🧬 Opening Biology Galaxy'
                )


                /* =================================================
                   MAKE SURE SCENE IS CURRENT
                   ================================================= */

                if (
                    typeof this.biologyWorldUI.setScene ===
                    'function'
                ) {

                    this.biologyWorldUI.setScene(
                        this.scene
                    )

                }


                /* =================================================
                   UPDATE LANGUAGE
                   ================================================= */

                if (
                    typeof this.biologyWorldUI.updateLanguage ===
                    'function'
                ) {

                    this.biologyWorldUI.updateLanguage()

                }


                /* =================================================
                   SHOW BIOLOGY WORLD SELECTOR
                   ================================================= */

                if (
                    typeof this.biologyWorldUI.show ===
                    'function'
                ) {

                    this.biologyWorldUI.show()

                }


                this.isTransitioning =
                    false

            },
            700
        )

    }


    /* =========================================================
       RETURN TO EXPLORATION
       ========================================================= */

    returnToExploration() {


        if (
            this.isTransitioning
        ) {

            return

        }


        console.log(
            '↩️ Returning to Exploration'
        )


        this.isTransitioning =
            true


        this.backButton.disabled =
            true


        this.hide()


        /* =====================================================
           RETURN
           ===================================================== */

        setTimeout(
            () => {


                if (
                    this.explorationUI
                ) {


                    if (
                        typeof this.explorationUI.updateLanguage ===
                        'function'
                    ) {

                        this.explorationUI.updateLanguage()

                    }


                    if (
                        typeof this.explorationUI.show ===
                        'function'
                    ) {

                        this.explorationUI.show()

                    }

                }


                this.isTransitioning =
                    false

            },
            700
        )

    }


    /* =========================================================
       RETURN FROM PHYSICS GALAXY
       ========================================================= */

    returnFromPhysicsGalaxy() {


        if (
            this.isTransitioning
        ) {

            return

        }


        this.isTransitioning =
            true


        if (
            this.physicsGalaxyUI
        ) {

            this.physicsGalaxyUI.hide()

        }


        setTimeout(
            () => {


                this.show()


                this.isTransitioning =
                    false

            },
            700
        )

    }


    /* =========================================================
       RETURN FROM BIOLOGY GALAXY
       ========================================================= */

    returnFromBiologyGalaxy() {


        if (
            this.isTransitioning
        ) {

            return

        }


        this.isTransitioning =
            true


        console.log(
            '↩️ Returning from Biology Galaxy'
        )


        /* =====================================================
           HIDE BIOLOGY
           ===================================================== */

        if (
            this.biologyWorldUI
        ) {

            if (
                typeof this.biologyWorldUI.hide ===
                'function'
            ) {

                this.biologyWorldUI.hide()

            }

        }


        /* =====================================================
           SHOW GALAXIES
           ===================================================== */

        setTimeout(
            () => {


                this.show()


                this.isTransitioning =
                    false

            },
            700
        )

    }


    /* =========================================================
       SET SCENE
       ========================================================= */

    setScene(
        scene
    ) {


        this.scene =
            scene


        /* =====================================================
           PHYSICS
           ===================================================== */

        if (
            this.physicsGalaxyUI &&
            typeof this.physicsGalaxyUI.setScene ===
            'function'
        ) {

            this.physicsGalaxyUI.setScene(
                scene
            )

        }


        /* =====================================================
           BIOLOGY
           ===================================================== */

        if (
            this.biologyWorldUI &&
            typeof this.biologyWorldUI.setScene ===
            'function'
        ) {

            this.biologyWorldUI.setScene(
                scene
            )

        }

    }


    /* =========================================================
       UPDATE
       ========================================================= */

    update(
        delta = 0
    ) {


        /* =====================================================
           PHYSICS
           ===================================================== */

        if (
            this.physicsGalaxyUI &&
            typeof this.physicsGalaxyUI.update ===
            'function'
        ) {

            this.physicsGalaxyUI.update(
                delta
            )

        }


        /* =====================================================
           BIOLOGY
           ===================================================== */

        if (
            this.biologyWorldUI &&
            typeof this.biologyWorldUI.update ===
            'function'
        ) {

            this.biologyWorldUI.update(
                delta
            )

        }

    }


    /* =========================================================
       DESTROY
       ========================================================= */

    destroy() {


        /* =====================================================
           PHYSICS
           ===================================================== */

        if (
            this.physicsGalaxyUI &&
            typeof this.physicsGalaxyUI.destroy ===
            'function'
        ) {

            this.physicsGalaxyUI.destroy()

        }


        /* =====================================================
           BIOLOGY
           ===================================================== */

        if (
            this.biologyWorldUI &&
            typeof this.biologyWorldUI.destroy ===
            'function'
        ) {

            this.biologyWorldUI.destroy()

        }


        /* =====================================================
           CONTAINER
           ===================================================== */

        if (
            this.container
        ) {

            this.container.remove()

        }

    }

}