import './galaxies.css'

import PhysicsGalaxyUI from './PhysicsGalaxyUI.js'
import BiologyWorldUI from '../biology/BiologyWorldUI.js'
import AstronomyWorldUI from '../astronomy/AstronomyWorldUI.js'
import EarthWorldUI from '../earth/EarthWorldUI.js'
import ChemistryWorldUI from '../chemistry/ChemistryWorldUI.js'

import { t, getLanguage } from '../locales/i18n.js'


export default class GalaxiesUI {

    constructor(scene = null, explorationUI = null) {

        this.scene = scene
        this.explorationUI = explorationUI

        this.isTransitioning = false

        // =========================================================
        // TRANSITION TIMEOUT
        // =========================================================

        this.transitionTimeout = null

        // =========================================================
        // CHILD WORLDS
        // =========================================================

        this.physicsGalaxyUI =
            new PhysicsGalaxyUI(
                this.scene,
                this
            )

        this.biologyWorldUI =
            new BiologyWorldUI(
                this,
                this.scene
            )

        this.astronomyWorldUI =
            new AstronomyWorldUI(
                this,
                this.scene
            )

        this.earthWorldUI =
            new EarthWorldUI(
                this,
                this.scene
            )

        this.chemistryWorldUI =
            new ChemistryWorldUI(
                this,
                this.scene
            )

        // =========================================================
        // CREATE UI
        // =========================================================

        this.createUI()
    }


    // =============================================================
    // CLEAR TRANSITION
    // =============================================================

    clearTransition() {

        if (this.transitionTimeout !== null) {

            window.clearTimeout(
                this.transitionTimeout
            )

            this.transitionTimeout = null
        }
    }


    // =============================================================
    // HIDE ALL CHILD WORLDS
    // =============================================================

    hideAllWorlds() {

        const worlds = [

            this.physicsGalaxyUI,
            this.biologyWorldUI,
            this.astronomyWorldUI,
            this.earthWorldUI,
            this.chemistryWorldUI

        ]


        worlds.forEach(world => {

            if (
                world &&
                typeof world.hide === 'function'
            ) {

                world.hide()
            }

        })
    }


    // =============================================================
    // CREATE UI
    // =============================================================

    createUI() {

        const old =
            document.getElementById(
                'awtaar-galaxies'
            )

        if (old) {
            old.remove()
        }


        this.container =
            document.createElement('section')

        this.container.id =
            'awtaar-galaxies'

        this.container.className =
            'awtaar-galaxies'

        this.container.style.display =
            'none'


        // =========================================================
        // HEADER
        // =========================================================

        const header =
            document.createElement('div')

        header.className =
            'awtaar-galaxies-header'


        this.title =
            document.createElement('h1')

        this.title.className =
            'awtaar-galaxies-title'

        this.title.textContent =
            t('galaxies.title')


        this.subtitle =
            document.createElement('p')

        this.subtitle.className =
            'awtaar-galaxies-subtitle'

        this.subtitle.textContent =
            t('galaxies.subtitle')


        header.appendChild(this.title)
        header.appendChild(this.subtitle)


        // =========================================================
        // GALAXIES GRID
        // =========================================================

        this.galaxiesGrid =
            document.createElement('div')

        this.galaxiesGrid.className =
            'awtaar-galaxies-grid'


        const galaxyData = [

            {
                key: 'physics',
                icon: '∞',
                name: t('galaxies.physics')
            },

            {
                key: 'biology',
                icon: 'DNA',
                name: t('galaxies.biology')
            },

            {
                key: 'astronomy',
                icon: '✦',
                name: t('galaxies.astronomy')
            },

            {
                key: 'earth',
                icon: '◉',
                name: t('galaxies.earth')
            },

            {
                key: 'chemistry',
                icon: '⚗',
                name: t('galaxies.chemistry')
            }

        ]


        this.galaxyButtons = {}


        galaxyData.forEach(data => {

            const button =
                document.createElement('button')

            button.type = 'button'

            button.className =
                'awtaar-galaxy-card'

            button.dataset.galaxy =
                data.key


            const icon =
                document.createElement('div')

            icon.className =
                'awtaar-galaxy-icon'

            icon.textContent =
                data.icon


            const name =
                document.createElement('div')

            name.className =
                'awtaar-galaxy-name'

            name.textContent =
                data.name


            button.appendChild(icon)
            button.appendChild(name)


            button.addEventListener(
                'click',
                () => {

                    if (this.isTransitioning) {
                        return
                    }

                    this.selectGalaxy(
                        data.key,
                        name.textContent
                    )
                }
            )


            this.galaxiesGrid.appendChild(button)

            this.galaxyButtons[data.key] =
                button
        })


        // =========================================================
        // BACK BUTTON
        // =========================================================

        this.backButton =
            document.createElement('button')

        this.backButton.type =
            'button'

        this.backButton.className =
            'awtaar-galaxies-back'

        this.backButton.textContent =
            t('common.back')


        this.backButton.addEventListener(
            'click',
            () => {

                if (this.isTransitioning) {
                    return
                }

                this.returnToExploration()
            }
        )


        // =========================================================
        // ASSEMBLE
        // =========================================================

        this.container.appendChild(header)

        this.container.appendChild(
            this.galaxiesGrid
        )

        this.container.appendChild(
            this.backButton
        )


        document.body.appendChild(
            this.container
        )


        // =========================================================
        // INITIAL LANGUAGE
        // =========================================================

        this.updateLanguage()
    }


    // =============================================================
    // UPDATE LANGUAGE
    // =============================================================

    updateLanguage() {

        const language =
            getLanguage()

        const isArabic =
            language === 'ar'


        if (!this.container) {
            return
        }


        this.container.dir =
            isArabic
                ? 'rtl'
                : 'ltr'


        if (this.title) {

            this.title.textContent =
                t('galaxies.title')
        }


        if (this.subtitle) {

            this.subtitle.textContent =
                t('galaxies.subtitle')
        }


        // ---------------------------------------------------------
        // Galaxy names
        // ---------------------------------------------------------

        const galaxyNames = {

            physics:
                t('galaxies.physics'),

            biology:
                t('galaxies.biology'),

            astronomy:
                t('galaxies.astronomy'),

            earth:
                t('galaxies.earth'),

            chemistry:
                t('galaxies.chemistry')
        }


        Object.entries(
            this.galaxyButtons
        ).forEach(
            ([key, button]) => {

                const name =
                    button.querySelector(
                        '.awtaar-galaxy-name'
                    )

                if (name) {

                    name.textContent =
                        galaxyNames[key]
                }
            }
        )


        if (this.backButton) {

            this.backButton.textContent =
                t('common.back')
        }


        // ---------------------------------------------------------
        // Child worlds
        // ---------------------------------------------------------

        if (
            this.physicsGalaxyUI &&
            typeof this.physicsGalaxyUI.updateLanguage === 'function'
        ) {

            this.physicsGalaxyUI.updateLanguage()
        }


        if (
            this.biologyWorldUI &&
            typeof this.biologyWorldUI.updateLanguage === 'function'
        ) {

            this.biologyWorldUI.updateLanguage()
        }


        if (
            this.astronomyWorldUI &&
            typeof this.astronomyWorldUI.updateLanguage === 'function'
        ) {

            this.astronomyWorldUI.updateLanguage()
        }


        if (
            this.earthWorldUI &&
            typeof this.earthWorldUI.updateLanguage === 'function'
        ) {

            this.earthWorldUI.updateLanguage()
        }


        if (
            this.chemistryWorldUI &&
            typeof this.chemistryWorldUI.updateLanguage === 'function'
        ) {

            this.chemistryWorldUI.updateLanguage()
        }
    }


    // =============================================================
    // SHOW
    // =============================================================

    show() {

        if (!this.container) {
            return
        }


        this.clearTransition()

        this.isTransitioning = false


        this.container.style.display =
            'flex'


        requestAnimationFrame(() => {

            if (!this.container) {
                return
            }

            this.container.classList.add(
                'visible'
            )
        })


        Object.values(
            this.galaxyButtons
        ).forEach(button => {

            button.disabled = false
        })


        if (this.backButton) {

            this.backButton.disabled =
                false
        }
    }


    // =============================================================
    // HIDE
    // =============================================================

    hide() {

        if (!this.container) {
            return
        }


        this.container.classList.remove(
            'visible'
        )


        setTimeout(() => {

            if (
                this.container &&
                !this.container.classList.contains(
                    'visible'
                )
            ) {

                this.container.style.display =
                    'none'
            }

        }, 600)
    }


    // =============================================================
    // SELECT GALAXY
    // =============================================================

    selectGalaxy(key, name) {

        if (this.isTransitioning) {
            return
        }


        switch (key) {

            case 'physics':

                this.openPhysicsGalaxy()
                break


            case 'biology':

                this.openBiologyGalaxy()
                break


            case 'astronomy':

                this.openAstronomyWorld()
                break


            case 'earth':

                this.openEarthWorld()
                break


            case 'chemistry':

                this.openChemistryWorld()
                break


            default:

                console.warn(
                    'Unknown galaxy:',
                    key
                )

                break
        }
    }


    // =============================================================
    // OPEN PHYSICS
    // =============================================================

    openPhysicsGalaxy() {

        if (
            !this.physicsGalaxyUI ||
            this.isTransitioning
        ) {

            return
        }


        this.clearTransition()

        this.isTransitioning = true


        Object.values(
            this.galaxyButtons
        ).forEach(button => {

            button.disabled = true
        })


        if (this.backButton) {
            this.backButton.disabled = true
        }


        // ---------------------------------------------------------
        // Hide all other worlds first
        // ---------------------------------------------------------

        this.hideAllWorlds()


        this.hide()


        this.transitionTimeout =
            window.setTimeout(() => {

                this.transitionTimeout = null


                if (!this.physicsGalaxyUI) {

                    this.isTransitioning = false
                    return
                }


                if (
                    typeof this.physicsGalaxyUI.setScene ===
                    'function'
                ) {

                    this.physicsGalaxyUI.setScene(
                        this.scene
                    )
                }


                if (
                    typeof this.physicsGalaxyUI.updateLanguage ===
                    'function'
                ) {

                    this.physicsGalaxyUI.updateLanguage()
                }


                this.physicsGalaxyUI.show()


                this.isTransitioning = false

            }, 700)
    }


    // =============================================================
    // OPEN BIOLOGY
    // =============================================================

    openBiologyGalaxy() {

        if (
            !this.biologyWorldUI ||
            this.isTransitioning
        ) {

            return
        }


        this.clearTransition()

        this.isTransitioning = true


        Object.values(
            this.galaxyButtons
        ).forEach(button => {

            button.disabled = true
        })


        if (this.backButton) {
            this.backButton.disabled = true
        }


        // ---------------------------------------------------------
        // Hide all other worlds first
        // ---------------------------------------------------------

        this.hideAllWorlds()


        this.hide()


        this.transitionTimeout =
            window.setTimeout(() => {

                this.transitionTimeout = null


                if (!this.biologyWorldUI) {

                    this.isTransitioning = false
                    return
                }


                if (
                    typeof this.biologyWorldUI.setScene ===
                    'function'
                ) {

                    this.biologyWorldUI.setScene(
                        this.scene
                    )
                }


                if (
                    typeof this.biologyWorldUI.updateLanguage ===
                    'function'
                ) {

                    this.biologyWorldUI.updateLanguage()
                }


                this.biologyWorldUI.show()


                this.isTransitioning = false

            }, 700)
    }


    // =============================================================
    // OPEN ASTRONOMY
    // =============================================================

    openAstronomyWorld() {

        if (
            !this.astronomyWorldUI ||
            this.isTransitioning
        ) {

            return
        }


        this.clearTransition()

        this.isTransitioning = true


        Object.values(
            this.galaxyButtons
        ).forEach(button => {

            button.disabled = true
        })


        if (this.backButton) {
            this.backButton.disabled = true
        }


        // ---------------------------------------------------------
        // Hide all other worlds first
        // ---------------------------------------------------------

        this.hideAllWorlds()


        this.hide()


        this.transitionTimeout =
            window.setTimeout(() => {

                this.transitionTimeout = null


                if (!this.astronomyWorldUI) {

                    this.isTransitioning = false
                    return
                }


                if (
                    typeof this.astronomyWorldUI.setScene ===
                    'function'
                ) {

                    this.astronomyWorldUI.setScene(
                        this.scene
                    )
                }


                if (
                    typeof this.astronomyWorldUI.updateLanguage ===
                    'function'
                ) {

                    this.astronomyWorldUI.updateLanguage()
                }


                this.astronomyWorldUI.show()


                this.isTransitioning = false

            }, 700)
    }


    // =============================================================
    // OPEN EARTH
    // =============================================================

    openEarthWorld() {

        if (
            !this.earthWorldUI ||
            this.isTransitioning
        ) {

            return
        }


        this.clearTransition()

        this.isTransitioning = true


        Object.values(
            this.galaxyButtons
        ).forEach(button => {

            button.disabled = true
        })


        if (this.backButton) {
            this.backButton.disabled = true
        }


        // ---------------------------------------------------------
        // Hide all other worlds first
        // ---------------------------------------------------------

        this.hideAllWorlds()


        this.hide()


        this.transitionTimeout =
            window.setTimeout(() => {

                this.transitionTimeout = null


                if (!this.earthWorldUI) {

                    this.isTransitioning = false
                    return
                }


                if (
                    typeof this.earthWorldUI.setScene ===
                    'function'
                ) {

                    this.earthWorldUI.setScene(
                        this.scene
                    )
                }


                if (
                    typeof this.earthWorldUI.updateLanguage ===
                    'function'
                ) {

                    this.earthWorldUI.updateLanguage()
                }


                this.earthWorldUI.show()


                this.isTransitioning = false

            }, 700)
    }


    // =============================================================
    // OPEN CHEMISTRY
    // =============================================================

    openChemistryWorld() {

        if (
            !this.chemistryWorldUI ||
            this.isTransitioning
        ) {

            return
        }


        this.clearTransition()

        this.isTransitioning = true


        Object.values(
            this.galaxyButtons
        ).forEach(button => {

            button.disabled = true
        })


        if (this.backButton) {
            this.backButton.disabled = true
        }


        // ---------------------------------------------------------
        // Hide all other worlds first
        // ---------------------------------------------------------

        this.hideAllWorlds()


        // ---------------------------------------------------------
        // Hide Galaxies UI
        // ---------------------------------------------------------

        this.hide()


        // ---------------------------------------------------------
        // Hide Exploration UI
        //
        // This prevents the main Awtaar interface from remaining
        // visible behind the Chemistry / Atomic experiment.
        // ---------------------------------------------------------

        if (
            this.explorationUI &&
            typeof this.explorationUI.hide ===
            'function'
        ) {

            this.explorationUI.hide()
        }


        this.transitionTimeout =
            window.setTimeout(() => {

                this.transitionTimeout = null


                if (!this.chemistryWorldUI) {

                    this.isTransitioning = false
                    return
                }


                if (
                    typeof this.chemistryWorldUI.setScene ===
                    'function'
                ) {

                    this.chemistryWorldUI.setScene(
                        this.scene
                    )
                }


                if (
                    typeof this.chemistryWorldUI.updateLanguage ===
                    'function'
                ) {

                    this.chemistryWorldUI.updateLanguage()
                }


                this.chemistryWorldUI.show()


                this.isTransitioning = false

            }, 700)
    }


    // =============================================================
    // RETURN FROM PHYSICS
    // =============================================================

    returnFromPhysicsGalaxy() {

        if (this.isTransitioning) {
            return
        }


        this.clearTransition()

        this.isTransitioning = true


        if (this.physicsGalaxyUI) {

            this.physicsGalaxyUI.hide()
        }


        this.transitionTimeout =
            window.setTimeout(() => {

                this.transitionTimeout = null

                this.show()

                this.isTransitioning = false

            }, 700)
    }


    // =============================================================
    // RETURN FROM BIOLOGY
    // =============================================================

    returnFromBiologyGalaxy() {

        if (this.isTransitioning) {
            return
        }


        this.clearTransition()

        this.isTransitioning = true


        if (this.biologyWorldUI) {

            this.biologyWorldUI.hide()
        }


        this.transitionTimeout =
            window.setTimeout(() => {

                this.transitionTimeout = null

                this.show()

                this.isTransitioning = false

            }, 700)
    }


    // =============================================================
    // RETURN FROM ASTRONOMY
    // =============================================================

    returnFromAstronomyWorld() {

        if (this.isTransitioning) {
            return
        }


        this.clearTransition()

        this.isTransitioning = true


        if (this.astronomyWorldUI) {

            this.astronomyWorldUI.hide()
        }


        this.transitionTimeout =
            window.setTimeout(() => {

                this.transitionTimeout = null

                this.show()

                this.isTransitioning = false

            }, 700)
    }


    // =============================================================
    // RETURN FROM EARTH
    // =============================================================

    returnFromEarthWorld() {

        if (this.isTransitioning) {
            return
        }


        this.clearTransition()

        this.isTransitioning = true


        if (this.earthWorldUI) {

            this.earthWorldUI.hide()
        }


        this.transitionTimeout =
            window.setTimeout(() => {

                this.transitionTimeout = null

                this.show()

                this.isTransitioning = false

            }, 700)
    }


    // =============================================================
    // RETURN FROM CHEMISTRY
    // =============================================================

    returnFromChemistryWorld() {

        if (this.isTransitioning) {
            return
        }


        this.clearTransition()

        this.isTransitioning = true


        if (this.chemistryWorldUI) {

            this.chemistryWorldUI.hide()
        }


        this.transitionTimeout =
            window.setTimeout(() => {

                this.transitionTimeout = null

                this.show()

                this.isTransitioning = false

            }, 700)
    }


    // =============================================================
    // RETURN TO EXPLORATION
    // =============================================================

    returnToExploration() {

        if (this.isTransitioning) {
            return
        }


        this.clearTransition()

        this.isTransitioning = true


        this.hide()


        this.transitionTimeout =
            window.setTimeout(() => {

                this.transitionTimeout = null


                if (
                    this.explorationUI &&
                    typeof this.explorationUI.show ===
                    'function'
                ) {

                    this.explorationUI.show()
                }


                this.isTransitioning = false

            }, 700)
    }


    // =============================================================
    // SET SCENE
    // =============================================================

    setScene(scene) {

        this.scene = scene


        if (
            this.physicsGalaxyUI &&
            typeof this.physicsGalaxyUI.setScene ===
            'function'
        ) {

            this.physicsGalaxyUI.setScene(
                scene
            )
        }


        if (
            this.biologyWorldUI &&
            typeof this.biologyWorldUI.setScene ===
            'function'
        ) {

            this.biologyWorldUI.setScene(
                scene
            )
        }


        if (
            this.astronomyWorldUI &&
            typeof this.astronomyWorldUI.setScene ===
            'function'
        ) {

            this.astronomyWorldUI.setScene(
                scene
            )
        }


        if (
            this.earthWorldUI &&
            typeof this.earthWorldUI.setScene ===
            'function'
        ) {

            this.earthWorldUI.setScene(
                scene
            )
        }


        if (
            this.chemistryWorldUI &&
            typeof this.chemistryWorldUI.setScene ===
            'function'
        ) {

            this.chemistryWorldUI.setScene(
                scene
            )
        }
    }


    // =============================================================
    // UPDATE
    // =============================================================

    update(delta = 0) {

        if (
            this.physicsGalaxyUI &&
            typeof this.physicsGalaxyUI.update ===
            'function'
        ) {

            this.physicsGalaxyUI.update(
                delta
            )
        }


        if (
            this.biologyWorldUI &&
            typeof this.biologyWorldUI.update ===
            'function'
        ) {

            this.biologyWorldUI.update(
                delta
            )
        }


        if (
            this.astronomyWorldUI &&
            typeof this.astronomyWorldUI.update ===
            'function'
        ) {

            this.astronomyWorldUI.update(
                delta
            )
        }


        if (
            this.earthWorldUI &&
            typeof this.earthWorldUI.update ===
            'function'
        ) {

            this.earthWorldUI.update(
                delta
            )
        }


        if (
            this.chemistryWorldUI &&
            typeof this.chemistryWorldUI.update ===
            'function'
        ) {

            this.chemistryWorldUI.update(
                delta
            )
        }
    }


    // =============================================================
    // DESTROY
    // =============================================================

    destroy() {

        // ---------------------------------------------------------
        // Clear transition
        // ---------------------------------------------------------

        this.clearTransition()


        // ---------------------------------------------------------
        // Physics
        // ---------------------------------------------------------

        if (
            this.physicsGalaxyUI &&
            typeof this.physicsGalaxyUI.destroy ===
            'function'
        ) {

            this.physicsGalaxyUI.destroy()
        }


        // ---------------------------------------------------------
        // Biology
        // ---------------------------------------------------------

        if (
            this.biologyWorldUI &&
            typeof this.biologyWorldUI.destroy ===
            'function'
        ) {

            this.biologyWorldUI.destroy()
        }


        // ---------------------------------------------------------
        // Astronomy
        // ---------------------------------------------------------

        if (
            this.astronomyWorldUI &&
            typeof this.astronomyWorldUI.destroy ===
            'function'
        ) {

            this.astronomyWorldUI.destroy()
        }


        // ---------------------------------------------------------
        // Earth
        // ---------------------------------------------------------

        if (
            this.earthWorldUI &&
            typeof this.earthWorldUI.destroy ===
            'function'
        ) {

            this.earthWorldUI.destroy()
        }


        // ---------------------------------------------------------
        // Chemistry
        // ---------------------------------------------------------

        if (
            this.chemistryWorldUI &&
            typeof this.chemistryWorldUI.destroy ===
            'function'
        ) {

            this.chemistryWorldUI.destroy()
        }


        // ---------------------------------------------------------
        // Main container
        // ---------------------------------------------------------

        if (this.container) {

            this.container.remove()

            this.container = null
        }


        this.galaxyButtons = {}

        this.physicsGalaxyUI = null
        this.biologyWorldUI = null
        this.astronomyWorldUI = null
        this.earthWorldUI = null
        this.chemistryWorldUI = null
        this.explorationUI = null
        this.scene = null
    }
}