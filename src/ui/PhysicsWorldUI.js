import './physics-world.css'

import QuantumWorldUI
    from './QuantumWorldUI.js'

import RelativeWorldUI
    from './RelativeWorldUI.js'

import WavesWorldUI
    from '../waves/WavesWorldUI.js'

import {
    t,
    getLanguage
} from '../locales/i18n.js'


/* =========================================================
   AWTAAR — PHYSICS WORLD UI
   ========================================================= */

export default class PhysicsWorldUI {


    constructor(
        physicsGalaxyUI,
        scene = null
    ) {


        /* =====================================================
           REFERENCES
           ===================================================== */

        this.physicsGalaxyUI =
            physicsGalaxyUI


        this.scene =
            scene


        console.log(
            '🌌 PhysicsWorldUI: constructor',
            {
                scene: this.scene
            }
        )


        /* =====================================================
           STATE
           ===================================================== */

        this.isTransitioning =
            false


        this.container =
            null


        this.title =
            null


        this.subtitle =
            null


        this.worlds =
            null


        this.backButton =
            null


        /* =====================================================
           QUANTUM
           ===================================================== */

        this.quantumWorldUI =
            new QuantumWorldUI(
                this,
                this.scene
            )


        /* =====================================================
           RELATIVITY
           ===================================================== */

        this.relativeWorldUI =
            new RelativeWorldUI(
                this,
                this.scene
            )


        /* =====================================================
           WAVES
           ===================================================== */

        console.log(
            '🌊 PhysicsWorldUI: creating WavesWorldUI...'
        )


        this.wavesWorldUI =
            new WavesWorldUI(
                this,
                this.scene
            )


        console.log(
            '🌊 PhysicsWorldUI: WavesWorldUI created',
            this.wavesWorldUI
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


        this.container =
            document.createElement(
                'section'
            )


        this.container.id =
            'awtaar-physics-world'


        this.container.style.position =
            'fixed'


        this.container.style.inset =
            '0'


        this.container.style.zIndex =
            '200'


        this.container.style.pointerEvents =
            'none'


        /* =====================================================
           TITLE
           ===================================================== */

        this.title =
            document.createElement(
                'h2'
            )


        this.subtitle =
            document.createElement(
                'p'
            )


        /* =====================================================
           WORLDS
           ===================================================== */

        this.worlds =
            document.createElement(
                'div'
            )


        this.worlds.className =
            'awtaar-physics-worlds'


        this.worldData = [

            {
                key:
                    'quantum',

                translationKey:
                    'physicsWorld.quantum',

                symbol:
                    'Ψ'
            },

            {
                key:
                    'relativity',

                translationKey:
                    'physicsWorld.relativity',

                symbol:
                    'c²'
            },

            {
                key:
                    'waves',

                translationKey:
                    'physicsWorld.waves',

                symbol:
                    '〰'
            },

            {
                key:
                    'energy',

                translationKey:
                    'physicsWorld.energy',

                symbol:
                    'E'
            },

            {
                key:
                    'mechanics',

                translationKey:
                    'physicsWorld.mechanics',

                symbol:
                    '⚙'
            }

        ]


        this.worldData.forEach(
            world => {


                const item =
                    document.createElement(
                        'button'
                    )


                item.type =
                    'button'


                item.className =
                    'awtaar-physics-world-item'


                item.dataset.world =
                    world.key


                const core =
                    document.createElement(
                        'span'
                    )


                core.className =
                    'physics-world-core'


                core.textContent =
                    world.symbol


                const name =
                    document.createElement(
                        'span'
                    )


                name.className =
                    'physics-world-name'


                item.appendChild(
                    core
                )


                item.appendChild(
                    name
                )


                item.addEventListener(
                    'click',
                    event => {


                        event.preventDefault()

                        event.stopPropagation()


                        console.log(
                            '🌌 Physics World clicked:',
                            world.key
                        )


                        if (
                            this.isTransitioning
                        ) {

                            console.log(
                                '⏳ PhysicsWorldUI: transition already running'
                            )

                            return

                        }


                        this.selectWorld(
                            world.key
                        )

                    }
                )


                this.worlds.appendChild(
                    item
                )

            }
        )


        /* =====================================================
           BACK
           ===================================================== */

        this.backButton =
            document.createElement(
                'button'
            )


        this.backButton.type =
            'button'


        this.backButton.className =
            'awtaar-physics-world-back'


        this.backButton.addEventListener(
            'click',
            event => {


                event.preventDefault()

                event.stopPropagation()


                this.returnToGalaxy()

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
            this.worlds
        )


        this.container.appendChild(
            this.backButton
        )


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
       LANGUAGE
       ========================================================= */

    updateLanguage() {


        const language =
            getLanguage()


        if (
            !this.container
        ) {

            return

        }


        this.container.dir =
            language === 'ar'
                ? 'rtl'
                : 'ltr'


        this.title.textContent =
            t(
                'physicsWorld.title'
            )


        this.subtitle.textContent =
            t(
                'physicsWorld.description'
            )


        const items =
            this.worlds.querySelectorAll(
                '.awtaar-physics-world-item'
            )


        items.forEach(
            (
                item,
                index
            ) => {


                const world =
                    this.worldData[index]


                if (
                    !world
                ) {

                    return

                }


                const name =
                    item.querySelector(
                        '.physics-world-name'
                    )


                if (
                    name
                ) {

                    name.textContent =
                        t(
                            world.translationKey
                        )

                }

            }
        )


        this.backButton.textContent =
            t(
                'physicsWorld.back'
            )


        /* =====================================================
           CHILD UI LANGUAGE
           ===================================================== */

        if (
            this.quantumWorldUI &&
            typeof this.quantumWorldUI.updateLanguage ===
            'function'
        ) {

            this.quantumWorldUI.updateLanguage()

        }


        if (
            this.relativeWorldUI &&
            typeof this.relativeWorldUI.updateLanguage ===
            'function'
        ) {

            this.relativeWorldUI.updateLanguage()

        }


        if (
            this.wavesWorldUI &&
            typeof this.wavesWorldUI.updateLanguage ===
            'function'
        ) {

            this.wavesWorldUI.updateLanguage()

        }

    }


    /* =========================================================
       SHOW
       ========================================================= */

    show() {


        console.log(
            '🌌 PhysicsWorldUI: SHOW'
        )


        this.updateLanguage()


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

                if (
                    this.container
                ) {

                    this.container.style.opacity =
                        '1'

                }

            }
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


        console.log(
            '🌌 PhysicsWorldUI: HIDE'
        )


        this.container.style.opacity =
            '0'


        this.container.style.pointerEvents =
            'none'


        setTimeout(
            () => {


                if (
                    this.container &&
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
       SELECT WORLD
       ========================================================= */

    selectWorld(
        key
    ) {


        if (
            this.isTransitioning
        ) {

            console.log(
                '⏳ PhysicsWorldUI: selectWorld blocked by transition'
            )

            return

        }


        console.log(
            '🌌 PhysicsWorldUI: SELECT WORLD:',
            key
        )


        /* =====================================================
           QUANTUM
           ===================================================== */

        if (
            key ===
            'quantum'
        ) {

            this.enterQuantumWorld()

            return

        }


        /* =====================================================
           RELATIVITY
           ===================================================== */

        if (
            key ===
            'relativity'
        ) {

            this.enterRelativityWorld()

            return

        }


        /* =====================================================
           WAVES
           ===================================================== */

        if (
            key ===
            'waves'
        ) {

            console.log(
                '🌊 PhysicsWorldUI: WAVES SELECTED'
            )


            this.enterWavesWorld()

            return

        }


        /* =====================================================
           FUTURE WORLDS
           ===================================================== */

        console.log(
            `🌌 Physics World "${key}" Coming Soon`
        )

    }


    /* =========================================================
       ENTER QUANTUM
       ========================================================= */

    enterQuantumWorld() {


        if (
            !this.quantumWorldUI
        ) {

            console.error(
                '❌ PhysicsWorldUI: quantumWorldUI is missing'
            )

            return

        }


        this.isTransitioning =
            true


        this.hide()


        setTimeout(
            () => {


                this.quantumWorldUI.show()


                this.isTransitioning =
                    false

            },
            550
        )

    }


    /* =========================================================
       ENTER RELATIVITY
       ========================================================= */

    enterRelativityWorld() {


        if (
            !this.relativeWorldUI
        ) {

            console.error(
                '❌ PhysicsWorldUI: relativeWorldUI is missing'
            )

            return

        }


        this.isTransitioning =
            true


        this.hide()


        setTimeout(
            () => {


                this.relativeWorldUI.show()


                this.isTransitioning =
                    false

            },
            550
        )

    }


    /* =========================================================
       ENTER WAVES
       ========================================================= */

    enterWavesWorld() {


        console.log(
            '🌊 STEP 1 — enterWavesWorld() CALLED'
        )


        if (
            !this.wavesWorldUI
        ) {

            console.error(
                '❌ STEP 1 FAILED — wavesWorldUI is NULL'
            )

            return

        }


        console.log(
            '🌊 STEP 2 — wavesWorldUI EXISTS',
            this.wavesWorldUI
        )


        this.isTransitioning =
            true


        this.hide()


        setTimeout(
            () => {


                console.log(
                    '🌊 STEP 3 — 550ms TRANSITION FINISHED'
                )


                console.log(
                    '🌊 STEP 4 — wavesWorldUI.open TYPE:',
                    typeof this.wavesWorldUI.open
                )


                if (
                    typeof this.wavesWorldUI.open ===
                    'function'
                ) {

                    console.log(
                        '🌊 STEP 5 — CALLING wavesWorldUI.open()'
                    )


                    this.wavesWorldUI.open()

                }

                else {

                    console.error(
                        '❌ STEP 5 FAILED — wavesWorldUI.open() DOES NOT EXIST'
                    )

                }


                this.isTransitioning =
                    false

            },
            550
        )

    }


    /* =========================================================
       RETURN FROM QUANTUM
       ========================================================= */

    returnFromQuantum() {


        if (
            this.isTransitioning
        ) {

            return

        }


        this.isTransitioning =
            true


        if (
            this.quantumWorldUI &&
            typeof this.quantumWorldUI.hide ===
            'function'
        ) {

            this.quantumWorldUI.hide()

        }


        setTimeout(
            () => {


                this.show()


                this.isTransitioning =
                    false

            },
            550
        )

    }


    /* =========================================================
       RETURN FROM RELATIVITY
       ========================================================= */

    returnFromRelativity() {


        if (
            this.isTransitioning
        ) {

            return

        }


        this.isTransitioning =
            true


        if (
            this.relativeWorldUI
        ) {

            this.relativeWorldUI.hide()

        }


        setTimeout(
            () => {


                this.show()


                this.isTransitioning =
                    false

            },
            550
        )

    }


    /* =========================================================
       RETURN FROM WAVES
       ========================================================= */

    returnFromWaves() {


        console.log(
            '🌊 PhysicsWorldUI: RETURN FROM WAVES'
        )


        if (
            this.isTransitioning
        ) {

            return

        }


        this.isTransitioning =
            true


        if (
            this.wavesWorldUI &&
            typeof this.wavesWorldUI.close ===
            'function'
        ) {

            this.wavesWorldUI.close()

        }


        setTimeout(
            () => {


                this.show()


                this.isTransitioning =
                    false

            },
            550
        )

    }


    /* =========================================================
       RETURN TO GALAXY
       ========================================================= */

    returnToGalaxy() {


        if (
            this.isTransitioning
        ) {

            return

        }


        this.isTransitioning =
            true


        this.hide()


        setTimeout(
            () => {


                if (
                    this.physicsGalaxyUI &&
                    typeof this.physicsGalaxyUI.show ===
                    'function'
                ) {

                    this.physicsGalaxyUI.show()

                }


                this.isTransitioning =
                    false

            },
            550
        )

    }


    /* =========================================================
       UPDATE
       ========================================================= */

    update(
        delta
    ) {


        /* =====================================================
           QUANTUM WORLD
           ===================================================== */

        if (
            this.quantumWorldUI &&
            typeof this.quantumWorldUI.update ===
            'function'
        ) {

            this.quantumWorldUI.update(
                delta
            )

        }


        /* =====================================================
           RELATIVITY WORLD
           ===================================================== */

        if (
            this.relativeWorldUI &&
            typeof this.relativeWorldUI.update ===
            'function'
        ) {

            this.relativeWorldUI.update(
                delta
            )

        }


        /* =====================================================
           WAVES WORLD
           ===================================================== */

        if (
            this.wavesWorldUI &&
            typeof this.wavesWorldUI.update ===
            'function'
        ) {

            this.wavesWorldUI.update(
                delta
            )

        }

    }


    /* =========================================================
       SET SCENE
       ========================================================= */

    setScene(
        scene
    ) {


        console.log(
            '🌌 PhysicsWorldUI: setScene()',
            scene
        )


        this.scene =
            scene || null


        if (
            this.quantumWorldUI &&
            typeof this.quantumWorldUI.setScene ===
            'function'
        ) {

            this.quantumWorldUI.setScene(
                this.scene
            )

        }


        if (
            this.relativeWorldUI &&
            typeof this.relativeWorldUI.setScene ===
            'function'
        ) {

            this.relativeWorldUI.setScene(
                this.scene
            )

        }


        if (
            this.wavesWorldUI &&
            typeof this.wavesWorldUI.setScene ===
            'function'
        ) {

            this.wavesWorldUI.setScene(
                this.scene
            )

        }

    }


    /* =========================================================
       DESTROY
       ========================================================= */

    destroy() {


        console.log(
            '🗑️ PhysicsWorldUI: DESTROY'
        )


        /* =====================================================
           WAVES
           ===================================================== */

        if (
            this.wavesWorldUI
        ) {

            if (
                typeof this.wavesWorldUI.destroy ===
                'function'
            ) {

                this.wavesWorldUI.destroy()

            }

            this.wavesWorldUI =
                null

        }


        /* =====================================================
           RELATIVITY
           ===================================================== */

        if (
            this.relativeWorldUI
        ) {

            if (
                typeof this.relativeWorldUI.destroy ===
                'function'
            ) {

                this.relativeWorldUI.destroy()

            }

            this.relativeWorldUI =
                null

        }


        /* =====================================================
           QUANTUM
           ===================================================== */

        if (
            this.quantumWorldUI
        ) {

            if (
                typeof this.quantumWorldUI.destroy ===
                'function'
            ) {

                this.quantumWorldUI.destroy()

            }

            this.quantumWorldUI =
                null

        }


        /* =====================================================
           CONTAINER
           ===================================================== */

        if (
            this.container
        ) {

            this.container.remove()

            this.container =
                null

        }


        this.scene =
            null


        this.physicsGalaxyUI =
            null

    }

}