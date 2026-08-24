import ExplorationUI from './ExplorationUI.js'

import {
    t,
    getLanguage,
    setLanguage
} from '../locales/i18n.js'


export default class PlatformUI {


    constructor(
        scene = null
    ) {

        /*
         * =====================================================
         * SCENE
         * =====================================================
         */

        this.scene =
            scene


        /*
         * =====================================================
         * EXPLORATION UI
         * =====================================================
         */

        this.explorationUI =
            new ExplorationUI(
                this.scene,
                this
            )


        /*
         * =====================================================
         * CREATE PLATFORM UI
         * =====================================================
         */

        this.createUI()

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
            document.createElement('div')

        this.container.id =
            'awtaar-platform'


        /*
         * =================================================
         * HEADER
         * =================================================
         */

        this.header =
            document.createElement('header')

        this.header.className =
            'awtaar-header'


        /*
         * =================================================
         * LOGO
         * =================================================
         */

        this.logo =
            document.createElement('div')

        this.logo.className =
            'awtaar-platform-logo'

        this.logo.textContent =
            'AWTAAR'


        /*
         * =================================================
         * LANGUAGE BUTTON
         * =================================================
         */

        this.languageButton =
            document.createElement('button')

        this.languageButton.className =
            'awtaar-language-button'

        this.languageButton.textContent =
            getLanguage() === 'ar'
                ? 'EN'
                : 'AR'


        /*
         * LANGUAGE EVENT
         * =================================================
         */

        this.languageButton.addEventListener(
            'click',
            () => {

                this.toggleLanguage()

            }
        )


        /*
         * =================================================
         * MENU BUTTON
         * =================================================
         */

        this.menuButton =
            document.createElement('button')

        this.menuButton.className =
            'awtaar-menu-button'

        this.menuButton.setAttribute(
            'aria-label',
            'Open menu'
        )


        /*
         * MENU LINES
         * =================================================
         */

        this.menuButton.innerHTML =
            '<span></span>' +
            '<span></span>' +
            '<span></span>'


        /*
         * MENU EVENT
         * =================================================
         */

        this.menuButton.addEventListener(
            'click',
            () => {

                this.toggleMenu()

            }
        )


        /*
         * =================================================
         * BUILD HEADER
         * =================================================
         */

        this.header.appendChild(
            this.logo
        )

        this.header.appendChild(
            this.languageButton
        )

        this.header.appendChild(
            this.menuButton
        )


        /*
         * =================================================
         * CREATE MENU
         * =================================================
         */

        this.createMenu()


        /*
         * =================================================
         * MAIN CONTENT
         * =================================================
         */

        this.content =
            document.createElement('main')

        this.content.className =
            'awtaar-content'


        /*
         * TITLE
         * =================================================
         */

        this.title =
            document.createElement('h1')

        this.title.textContent =
            t(
                'platform.title'
            )


        /*
         * DESCRIPTION
         * =================================================
         */

        this.description =
            document.createElement('p')

        this.description.textContent =
            t(
                'platform.description'
            )


        /*
         * =================================================
         * EXPLORE BUTTON
         * =================================================
         */

        this.exploreButton =
            document.createElement('button')

        this.exploreButton.className =
            'awtaar-explore-button'

        this.exploreButton.textContent =
            t(
                'platform.explore'
            )


        /*
         * =================================================
         * BUILD CONTENT
         * =================================================
         */

        this.content.appendChild(
            this.title
        )

        this.content.appendChild(
            this.description
        )

        this.content.appendChild(
            this.exploreButton
        )


        /*
         * =================================================
         * BUILD PLATFORM
         * =================================================
         */

        this.container.appendChild(
            this.header
        )

        this.container.appendChild(
            this.content
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

        this.container.style.opacity =
            '0'

        this.container.style.visibility =
            'hidden'

        this.container.style.pointerEvents =
            'none'


        /*
         * =================================================
         * EXPLORE BUTTON EVENT
         * =================================================
         */

        this.exploreButton.addEventListener(
            'click',
            () => {

                this.startExploration()

            }
        )


        /*
         * =================================================
         * INITIAL LANGUAGE
         * =================================================
         */

        this.updateLanguage()

    }


    /*
     * =====================================================
     * CREATE MENU
     * =====================================================
     */

    createMenu() {

        /*
         * =================================================
         * MENU CONTAINER
         * =================================================
         */

        this.menu =
            document.createElement('div')

        this.menu.className =
            'awtaar-platform-menu'


        /*
         * =================================================
         * MENU TITLE
         * =================================================
         */

        this.menuTitle =
            document.createElement('div')

        this.menuTitle.className =
            'awtaar-platform-menu-title'

        this.menuTitle.textContent =
            t(
                'menu.title'
            )


        this.menu.appendChild(
            this.menuTitle
        )


        /*
         * =================================================
         * MENU ITEMS
         * =================================================
         */

        this.menuItems = [

            {
                key: 'home',
                translation: 'menu.home'
            },

            {
                key: 'galaxies',
                translation: 'menu.galaxies'
            },

            {
                key: 'phenomena',
                translation: 'menu.phenomena'
            },

            {
                key: 'simulation',
                translation: 'menu.simulation'
            },

            {
                key: 'discover',
                translation: 'menu.discover'
            },

            {
                key: 'about',
                translation: 'menu.about'
            }

        ]


        /*
         * =================================================
         * MENU BUTTONS
         * =================================================
         */

        this.menuButtons = []


        /*
         * =================================================
         * CREATE MENU BUTTONS
         * =================================================
         */

        this.menuItems.forEach(
            (item) => {

                const button =
                    document.createElement('button')


                button.className =
                    'awtaar-platform-menu-item'


                button.dataset.menu =
                    item.key


                button.textContent =
                    t(
                        item.translation
                    )


                /*
                 * BUTTON EVENT
                 */

                button.addEventListener(
                    'click',
                    () => {

                        this.selectMenuItem(
                            item.key
                        )

                    }
                )


                /*
                 * ADD BUTTON
                 */

                this.menu.appendChild(
                    button
                )


                this.menuButtons.push(
                    button
                )

            }
        )


        /*
         * =================================================
         * ADD MENU TO PLATFORM
         * =================================================
         */

        this.container.appendChild(
            this.menu
        )

    }


    /*
     * =====================================================
     * TOGGLE MENU
     * =====================================================
     */

    toggleMenu() {

        if (
            this.menu.classList.contains(
                'open'
            )
        ) {

            this.closeMenu()

        } else {

            this.openMenu()

        }

    }


    /*
     * =====================================================
     * OPEN MENU
     * =====================================================
     */

    openMenu() {

        this.menu.classList.add(
            'open'
        )

        this.menuButton.classList.add(
            'active'
        )

        this.menuButton.setAttribute(
            'aria-label',
            'Close menu'
        )

    }


    /*
     * =====================================================
     * CLOSE MENU
     * =====================================================
     */

    closeMenu() {

        this.menu.classList.remove(
            'open'
        )

        this.menuButton.classList.remove(
            'active'
        )

        this.menuButton.setAttribute(
            'aria-label',
            'Open menu'
        )

    }


    /*
     * =====================================================
     * SELECT MENU ITEM
     * =====================================================
     */

    selectMenuItem(
        key
    ) {

        /*
         * CLOSE MENU FIRST
         */

        this.closeMenu()


        /*
         * =================================================
         * HOME
         * =================================================
         */

        if (
            key === 'home'
        ) {

            this.show()

            return

        }


        /*
         * =================================================
         * GALAXIES
         * =================================================
         */

        if (
            key === 'galaxies'
        ) {

            this.startExploration()

            return

        }


        /*
         * =================================================
         * PHENOMENA
         * =================================================
         */

        if (
            key === 'phenomena'
        ) {

            console.log(
                '🌌 Awtaar Phenomena'
            )

            return

        }


        /*
         * =================================================
         * SIMULATION
         * =================================================
         */

        if (
            key === 'simulation'
        ) {

            console.log(
                '🧪 Awtaar Simulation'
            )

            return

        }


        /*
         * =================================================
         * DISCOVER
         * =================================================
         */

        if (
            key === 'discover'
        ) {

            console.log(
                '✦ Awtaar Discover'
            )

            return

        }


        /*
         * =================================================
         * ABOUT
         * =================================================
         */

        if (
            key === 'about'
        ) {

            console.log(
                '∞ About Awtaar'
            )

        }

    }


    /*
     * =====================================================
     * TOGGLE LANGUAGE
     * =====================================================
     */

    toggleLanguage() {

        const currentLanguage =
            getLanguage()


        const newLanguage =
            currentLanguage === 'ar'
                ? 'en'
                : 'ar'


        /*
         * SET LANGUAGE
         */

        setLanguage(
            newLanguage
        )


        /*
         * UPDATE PLATFORM
         */

        this.updateLanguage()


        /*
         * UPDATE EXPLORATION
         */

        if (
            this.explorationUI &&
            this.explorationUI.updateLanguage
        ) {

            this.explorationUI.updateLanguage()

        }

    }


    /*
     * =====================================================
     * UPDATE LANGUAGE
     * =====================================================
     */

    updateLanguage() {

        /*
         * =================================================
         * TITLE
         * =================================================
         */

        this.title.textContent =
            t(
                'platform.title'
            )


        /*
         * =================================================
         * DESCRIPTION
         * =================================================
         */

        this.description.textContent =
            t(
                'platform.description'
            )


        /*
         * =================================================
         * EXPLORE BUTTON
         * =================================================
         */

        this.exploreButton.textContent =
            t(
                'platform.explore'
            )


        /*
         * =================================================
         * LANGUAGE BUTTON
         * =================================================
         */

        this.languageButton.textContent =
            getLanguage() === 'ar'
                ? 'EN'
                : 'AR'


        /*
         * =================================================
         * DIRECTION
         * =================================================
         */

        if (
            getLanguage() === 'ar'
        ) {

            this.container.dir =
                'rtl'

        } else {

            this.container.dir =
                'ltr'

        }


        /*
         * =================================================
         * MENU TITLE
         * =================================================
         */

        if (
            this.menuTitle
        ) {

            this.menuTitle.textContent =
                t(
                    'menu.title'
                )

        }


        /*
         * =================================================
         * MENU ITEMS
         * =================================================
         */

        if (
            this.menuButtons
        ) {

            this.menuButtons.forEach(
                (
                    button,
                    index
                ) => {

                    const item =
                        this.menuItems[index]


                    if (
                        item
                    ) {

                        button.textContent =
                            t(
                                item.translation
                            )

                    }

                }
            )

        }

    }


    /*
     * =====================================================
     * START EXPLORATION
     * =====================================================
     */

    startExploration() {

        console.log(
            '🌌 Awtaar Exploration Started'
        )


        /*
         * =================================================
         * PREVENT REPEATED CLICK
         * =================================================
         */

        this.exploreButton.disabled =
            true


        /*
         * =================================================
         * CLOSE MENU
         * =================================================
         */

        this.closeMenu()


        /*
         * =================================================
         * HIDE PLATFORM
         * =================================================
         */

        this.container.style.opacity =
            '0'

        this.container.style.pointerEvents =
            'none'


        /*
         * =================================================
         * OPEN EXPLORATION
         * =================================================
         */

        setTimeout(
            () => {

                this.container.style.visibility =
                    'hidden'


                if (
                    this.explorationUI
                ) {

                    this.explorationUI.show()

                }

            },
            1200
        )

    }


    /*
     * =====================================================
     * SHOW PLATFORM
     * =====================================================
     */

    show() {

        /*
         * UPDATE LANGUAGE
         */

        this.updateLanguage()


        /*
         * ENABLE EXPLORE BUTTON
         */

        this.exploreButton.disabled =
            false


        /*
         * SHOW PLATFORM
         */

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


    /*
     * =====================================================
     * HIDE PLATFORM
     * =====================================================
     */

    hide() {

        /*
         * CLOSE MENU
         */

        this.closeMenu()


        /*
         * FADE OUT
         */

        this.container.style.opacity =
            '0'

        this.container.style.pointerEvents =
            'none'


        /*
         * HIDE COMPLETELY
         */

        setTimeout(
            () => {

                this.container.style.visibility =
                    'hidden'

            },
            1200
        )

    }


    /*
     * =====================================================
     * UPDATE
     * =====================================================
     */

    update(delta) {

        if (
            this.explorationUI &&
            typeof this.explorationUI.update ===
            'function'
        ) {

            this.explorationUI.update(
                delta
            )

        }

    }

}