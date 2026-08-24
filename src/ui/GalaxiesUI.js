import './galaxies.css'

import PhysicsGalaxyUI from './PhysicsGalaxyUI.js'

import {
    t,
    getLanguage
} from '../locales/i18n.js'


export default class GalaxiesUI {

    constructor(scene = null, explorationUI = null) {

        this.scene = scene

        this.explorationUI = explorationUI

        this.isTransitioning = false

        this.physicsGalaxyUI = new PhysicsGalaxyUI(
            this.scene,
            this
        )

        this.createUI()
    }


    createUI() {

        this.container = document.createElement('section')
        this.container.id = 'awtaar-galaxies'

        this.title = document.createElement('h2')
        this.title.textContent = t('galaxies.title')

        this.subtitle = document.createElement('p')
        this.subtitle.textContent = t('galaxies.subtitle')

        this.galaxies = document.createElement('div')
        this.galaxies.className = 'awtaar-galaxies-list'


        this.galaxyData = [

            {
                key: 'physics',
                translationKey: 'galaxies.physics',
                symbol: '∞'
            },

            {
                key: 'biology',
                translationKey: 'galaxies.biology',
                symbol: 'DNA'
            },

            {
                key: 'astronomy',
                translationKey: 'galaxies.astronomy',
                symbol: '✦'
            },

            {
                key: 'earth',
                translationKey: 'galaxies.earth',
                symbol: '◉'
            },

            {
                key: 'chemistry',
                translationKey: 'galaxies.chemistry',
                symbol: '⚗'
            }

        ]


        this.galaxyData.forEach((galaxy) => {

            const item = document.createElement('button')

            item.type = 'button'

            item.className = 'awtaar-galaxy'

            item.dataset.galaxy = galaxy.key


            const core = document.createElement('span')

            core.className = 'awtaar-galaxy-core'

            core.textContent = galaxy.symbol


            const name = document.createElement('span')

            name.className = 'awtaar-galaxy-name'

            name.textContent = t(
                galaxy.translationKey
            )


            item.appendChild(core)

            item.appendChild(name)


            item.addEventListener('click', (event) => {

                event.preventDefault()

                event.stopPropagation()


                if (this.isTransitioning) {

                    return

                }


                console.log(
                    `🌌 Galaxy clicked: ${galaxy.key}`
                )


                this.selectGalaxy(
                    galaxy.key,
                    t(galaxy.translationKey)
                )

            })


            this.galaxies.appendChild(item)

        })


        this.backButton = document.createElement('button')

        this.backButton.type = 'button'

        this.backButton.className =
            'awtaar-galaxies-back'

        this.backButton.textContent =
            t('common.back')


        this.backButton.addEventListener(
            'click',
            (event) => {

                event.preventDefault()

                event.stopPropagation()


                if (this.isTransitioning) {

                    return

                }


                this.returnToExploration()

            }
        )


        this.container.appendChild(this.title)

        this.container.appendChild(this.subtitle)

        this.container.appendChild(this.galaxies)

        this.container.appendChild(this.backButton)


        document.body.appendChild(this.container)


        this.container.style.opacity = '0'

        this.container.style.visibility = 'hidden'

        this.container.style.pointerEvents = 'none'


        this.updateLanguage()
    }


    updateLanguage() {

        this.title.textContent =
            t('galaxies.title')


        this.subtitle.textContent =
            t('galaxies.subtitle')


        const galaxyItems =
            this.galaxies.querySelectorAll(
                '.awtaar-galaxy'
            )


        galaxyItems.forEach((item, index) => {

            const galaxy =
                this.galaxyData[index]


            if (!galaxy) {

                return

            }


            const name =
                item.querySelector(
                    '.awtaar-galaxy-name'
                )


            if (name) {

                name.textContent =
                    t(galaxy.translationKey)

            }

        })


        this.backButton.textContent =
            t('common.back')


        this.container.dir =
            getLanguage() === 'ar'
                ? 'rtl'
                : 'ltr'


        if (
            this.physicsGalaxyUI &&
            typeof this.physicsGalaxyUI.updateLanguage === 'function'
        ) {

            this.physicsGalaxyUI.updateLanguage()

        }

    }


    show() {

        console.log(
            '🌌 Showing Awtaar Galaxies'
        )


        this.isTransitioning = false


        this.updateLanguage()


        this.container.style.display = 'flex'

        this.container.style.visibility = 'visible'

        this.container.style.pointerEvents = 'auto'


        const buttons =
            this.galaxies.querySelectorAll(
                '.awtaar-galaxy'
            )


        buttons.forEach((button) => {

            button.disabled = false

            button.style.pointerEvents = 'auto'

        })


        this.backButton.disabled = false


        requestAnimationFrame(() => {

            this.container.style.opacity = '1'

        })

    }


    hide() {

        this.container.style.opacity = '0'

        this.container.style.pointerEvents = 'none'


        const buttons =
            this.galaxies.querySelectorAll(
                '.awtaar-galaxy'
            )


        buttons.forEach((button) => {

            button.style.pointerEvents = 'none'

        })


        setTimeout(() => {

            if (
                this.container.style.opacity === '0'
            ) {

                this.container.style.visibility =
                    'hidden'

            }

        }, 700)

    }


    selectGalaxy(key, name) {

        console.log(
            `🌌 Awtaar Galaxy Selected: ${name}`
        )


        if (this.isTransitioning) {

            return

        }


        if (key === 'physics') {

            console.log(
                '∞ Opening Awtaar Physics Galaxy'
            )


            this.openPhysicsGalaxy()

            return

        }


        console.log(
            `🌌 Galaxy "${name}" is coming soon.`
        )

    }


    openPhysicsGalaxy() {

        if (this.isTransitioning) {

            return

        }


        if (!this.physicsGalaxyUI) {

            console.error(
                '❌ PhysicsGalaxyUI is not available'
            )

            return

        }


        console.log(
            '🌀 Preparing Physics Galaxy...'
        )


        this.isTransitioning = true


        const galaxyButtons =
            this.galaxies.querySelectorAll(
                '.awtaar-galaxy'
            )


        galaxyButtons.forEach((button) => {

            button.disabled = true

        })


        this.backButton.disabled = true


        this.hide()


        setTimeout(() => {

            console.log(
                '🌀 Opening Physics Galaxy'
            )


            if (
                typeof this.physicsGalaxyUI.updateLanguage === 'function'
            ) {

                this.physicsGalaxyUI.updateLanguage()

            }


            this.physicsGalaxyUI.show()


            this.isTransitioning = false

        }, 700)

    }


    returnToExploration() {

        if (this.isTransitioning) {

            return

        }


        console.log(
            '↩️ Returning to Exploration'
        )


        this.isTransitioning = true


        this.backButton.disabled = true


        this.hide()


        setTimeout(() => {

            if (this.explorationUI) {

                if (
                    typeof this.explorationUI.updateLanguage === 'function'
                ) {

                    this.explorationUI.updateLanguage()

                }


                if (
                    typeof this.explorationUI.show === 'function'
                ) {

                    this.explorationUI.show()

                }

            }


            this.isTransitioning = false

        }, 700)

    }


    /*
     * =====================================================
     * UPDATE
     * =====================================================
     *
     * تمرير delta إلى PhysicsGalaxyUI
     *
     * حتى تستمر سلسلة التحديث وصولًا إلى:
     *
     * PhysicsWorldUI
     *        ↓
     * RelativeWorldUI
     *        ↓
     * TimeDilationExperiment
     *
     * =====================================================
     */

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

    }

}