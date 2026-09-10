import './physics-world.css'


import QuantumWorldUI
    from './QuantumWorldUI.js'


import RelativeWorldUI
    from './RelativeWorldUI.js'


import WavesWorldUI
    from '../waves/WavesWorldUI.js'


import EnergyWorldUI
    from '../energy/EnergyWorldUI.js'


import MechanicsWorldUI
    from '../mechanics/MechanicsWorldUI.js'


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
           QUANTUM WORLD
           ===================================================== */

        this.quantumWorldUI =
            new QuantumWorldUI(
                this,
                this.scene
            )



        /* =====================================================
           RELATIVITY WORLD
           ===================================================== */

        this.relativeWorldUI =
            new RelativeWorldUI(
                this,
                this.scene
            )



        /* =====================================================
           WAVES WORLD
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
           ENERGY WORLD
           ===================================================== */

        console.log(
            '⚡ PhysicsWorldUI: creating EnergyWorldUI...'
        )


        this.energyWorldUI =
            new EnergyWorldUI(
                this,
                this.scene
            )


        console.log(
            '⚡ PhysicsWorldUI: EnergyWorldUI created',
            this.energyWorldUI
        )



        /* =====================================================
           MECHANICS WORLD
           ===================================================== */

        console.log(
            '⚙️ PhysicsWorldUI: creating MechanicsWorldUI...'
        )


        this.mechanicsWorldUI =
            new MechanicsWorldUI(
                this,
                this.scene
            )


        console.log(
            '⚙️ PhysicsWorldUI: MechanicsWorldUI created',
            this.mechanicsWorldUI
        )



        /* =====================================================
           CREATE UI
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



        /* =====================================================
           WORLD DATA
           ===================================================== */

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



        /* =====================================================
           CREATE WORLD BUTTONS
           ===================================================== */

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



                /* =================================================
                   CORE
                   ================================================= */

                const core =
                    document.createElement(
                        'span'
                    )


                core.className =
                    'physics-world-core'


                core.textContent =
                    world.symbol



                /* =================================================
                   NAME
                   ================================================= */

                const name =
                    document.createElement(
                        'span'
                    )


                name.className =
                    'physics-world-name'



                /* =================================================
                   BUILD ITEM
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
           BACK BUTTON
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
           BUILD CONTAINER
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



        /* =====================================================
           TITLE
           ===================================================== */

        this.title.textContent =
            t(
                'physicsWorld.title'
            )



        /* =====================================================
           DESCRIPTION
           ===================================================== */

        this.subtitle.textContent =
            t(
                'physicsWorld.description'
            )



        /* =====================================================
           WORLD NAMES
           ===================================================== */

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



        /* =====================================================
           BACK
           ===================================================== */

        this.backButton.textContent =
            t(
                'physicsWorld.back'
            )



        /* =====================================================
           QUANTUM LANGUAGE
           ===================================================== */

        if (
            this.quantumWorldUI &&
            typeof this.quantumWorldUI.updateLanguage ===
            'function'
        ) {

            this.quantumWorldUI.updateLanguage()

        }



        /* =====================================================
           RELATIVITY LANGUAGE
           ===================================================== */

        if (
            this.relativeWorldUI &&
            typeof this.relativeWorldUI.updateLanguage ===
            'function'
        ) {

            this.relativeWorldUI.updateLanguage()

        }



        /* =====================================================
           WAVES LANGUAGE
           ===================================================== */

        if (
            this.wavesWorldUI &&
            typeof this.wavesWorldUI.updateLanguage ===
            'function'
        ) {

            this.wavesWorldUI.updateLanguage()

        }



        /* =====================================================
           ENERGY LANGUAGE
           ===================================================== */

        if (
            this.energyWorldUI &&
            typeof this.energyWorldUI.updateLanguage ===
            'function'
        ) {

            this.energyWorldUI.updateLanguage()

        }



        /* =====================================================
           MECHANICS LANGUAGE
           ===================================================== */

        if (
            this.mechanicsWorldUI &&
            typeof this.mechanicsWorldUI.updateLanguage ===
            'function'
        ) {

            this.mechanicsWorldUI.updateLanguage()

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
                '⏳ PhysicsWorldUI: selectWorld blocked'
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

            this.enterWavesWorld()

            return

        }



        /* =====================================================
           ENERGY
           ===================================================== */

        if (
            key ===
            'energy'
        ) {

            this.enterEnergyWorld()

            return

        }



        /* =====================================================
           MECHANICS
           ===================================================== */

        if (
            key ===
            'mechanics'
        ) {

            this.enterMechanicsWorld()

            return

        }



        /* =====================================================
           UNKNOWN
           ===================================================== */

        console.log(
            `🌌 Physics World "${key}" Coming Soon`
        )

    }



    /* =========================================================
       ENTER QUANTUM WORLD
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
       ENTER RELATIVITY WORLD
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
       ENTER WAVES WORLD
       ========================================================= */

    enterWavesWorld() {


        if (
            !this.wavesWorldUI
        ) {

            console.error(
                '❌ PhysicsWorldUI: wavesWorldUI is missing'
            )

            return

        }



        this.isTransitioning =
            true



        this.hide()



        setTimeout(
            () => {


                if (
                    typeof this.wavesWorldUI.open ===
                    'function'
                ) {

                    this.wavesWorldUI.open()

                }
                else if (
                    typeof this.wavesWorldUI.show ===
                    'function'
                ) {

                    this.wavesWorldUI.show()

                }



                this.isTransitioning =
                    false

            },
            550
        )

    }



    /* =========================================================
       ENTER ENERGY WORLD
       ========================================================= */

    enterEnergyWorld() {


        console.log(
            '⚡ PhysicsWorldUI: ENTER ENERGY WORLD'
        )



        if (
            !this.energyWorldUI
        ) {

            console.error(
                '❌ PhysicsWorldUI: energyWorldUI is missing'
            )

            return

        }



        this.isTransitioning =
            true



        this.hide()



        setTimeout(
            () => {


                console.log(
                    '⚡ PhysicsWorldUI: opening Energy World'
                )



                if (
                    typeof this.energyWorldUI.open ===
                    'function'
                ) {

                    this.energyWorldUI.open()

                }
                else if (
                    typeof this.energyWorldUI.show ===
                    'function'
                ) {

                    this.energyWorldUI.show()

                }



                this.isTransitioning =
                    false

            },
            550
        )

    }



    /* =========================================================
       ENTER MECHANICS WORLD
       ========================================================= */

    enterMechanicsWorld() {


        console.log(
            '⚙️ PhysicsWorldUI: ENTER MECHANICS WORLD'
        )



        if (
            !this.mechanicsWorldUI
        ) {

            console.error(
                '❌ PhysicsWorldUI: mechanicsWorldUI is missing'
            )

            return

        }



        this.isTransitioning =
            true



        this.hide()



        setTimeout(
            () => {


                console.log(
                    '⚙️ PhysicsWorldUI: opening Mechanics World'
                )



                if (
                    typeof this.mechanicsWorldUI.open ===
                    'function'
                ) {

                    this.mechanicsWorldUI.open()

                }
                else if (
                    typeof this.mechanicsWorldUI.show ===
                    'function'
                ) {

                    this.mechanicsWorldUI.show()

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
            this.relativeWorldUI &&
            typeof this.relativeWorldUI.hide ===
            'function'
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
            this.wavesWorldUI
        ) {

            if (
                typeof this.wavesWorldUI.close ===
                'function'
            ) {

                this.wavesWorldUI.close()

            }
            else if (
                typeof this.wavesWorldUI.hide ===
                'function'
            ) {

                this.wavesWorldUI.hide()

            }

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
       RETURN FROM ENERGY
       ========================================================= */

    returnFromEnergy() {


        console.log(
            '⚡ PhysicsWorldUI: RETURN FROM ENERGY'
        )



        if (
            this.isTransitioning
        ) {

            return

        }



        this.isTransitioning =
            true



        if (
            this.energyWorldUI &&
            typeof this.energyWorldUI.hide ===
            'function'
        ) {

            this.energyWorldUI.hide()

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
       RETURN FROM MECHANICS
       ========================================================= */

    returnFromMechanics() {


        console.log(
            '⚙️ PhysicsWorldUI: RETURN FROM MECHANICS'
        )



        if (
            this.isTransitioning
        ) {

            return

        }



        this.isTransitioning =
            true



        if (
            this.mechanicsWorldUI
        ) {

            if (
                typeof this.mechanicsWorldUI.closeExperiment ===
                'function' &&
                this.mechanicsWorldUI.isExperimentOpen
            ) {

                this.mechanicsWorldUI.closeExperiment()

            }
            else if (
                typeof this.mechanicsWorldUI.hide ===
                'function'
            ) {

                this.mechanicsWorldUI.hide()

            }

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



        /* =====================================================
           CLOSE MECHANICS IF NECESSARY
           ===================================================== */

        if (
            this.mechanicsWorldUI &&
            this.mechanicsWorldUI.isExperimentOpen &&
            typeof this.mechanicsWorldUI.closeExperiment ===
            'function'
        ) {

            this.mechanicsWorldUI.closeExperiment()

        }



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



        /* =====================================================
           ENERGY WORLD
           ===================================================== */

        if (
            this.energyWorldUI &&
            typeof this.energyWorldUI.update ===
            'function'
        ) {

            this.energyWorldUI.update(
                delta
            )

        }



        /* =====================================================
           MECHANICS WORLD
           ===================================================== */

        if (
            this.mechanicsWorldUI &&
            typeof this.mechanicsWorldUI.update ===
            'function'
        ) {

            this.mechanicsWorldUI.update(
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



        /* =====================================================
           QUANTUM
           ===================================================== */

        if (
            this.quantumWorldUI &&
            typeof this.quantumWorldUI.setScene ===
            'function'
        ) {

            this.quantumWorldUI.setScene(
                this.scene
            )

        }



        /* =====================================================
           RELATIVITY
           ===================================================== */

        if (
            this.relativeWorldUI &&
            typeof this.relativeWorldUI.setScene ===
            'function'
        ) {

            this.relativeWorldUI.setScene(
                this.scene
            )

        }



        /* =====================================================
           WAVES
           ===================================================== */

        if (
            this.wavesWorldUI &&
            typeof this.wavesWorldUI.setScene ===
            'function'
        ) {

            this.wavesWorldUI.setScene(
                this.scene
            )

        }



        /* =====================================================
           ENERGY
           ===================================================== */

        if (
            this.energyWorldUI &&
            typeof this.energyWorldUI.setScene ===
            'function'
        ) {

            this.energyWorldUI.setScene(
                this.scene
            )

        }



        /* =====================================================
           MECHANICS
           ===================================================== */

        if (
            this.mechanicsWorldUI &&
            typeof this.mechanicsWorldUI.setScene ===
            'function'
        ) {

            this.mechanicsWorldUI.setScene(
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
           MECHANICS
           ===================================================== */

        if (
            this.mechanicsWorldUI
        ) {


            if (
                typeof this.mechanicsWorldUI.destroy ===
                'function'
            ) {

                this.mechanicsWorldUI.destroy()

            }


            this.mechanicsWorldUI =
                null

        }



        /* =====================================================
           ENERGY
           ===================================================== */

        if (
            this.energyWorldUI
        ) {


            if (
                typeof this.energyWorldUI.destroy ===
                'function'
            ) {

                this.energyWorldUI.destroy()

            }


            this.energyWorldUI =
                null

        }



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



        /* =====================================================
           REFERENCES
           ===================================================== */

        this.scene =
            null


        this.physicsGalaxyUI =
            null

    }

}