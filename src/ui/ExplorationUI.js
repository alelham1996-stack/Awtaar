/* =========================================================
   AWTAAR — EXPLORATION UI
   PREMIUM SCIENTIFIC GATEWAY
   ========================================================= */

import './exploration.css'

import GalaxiesUI from './GalaxiesUI.js'

import {
    t,
    getLanguage
} from '../locales/i18n.js'


export default class ExplorationUI {

    constructor(
        scene = null,
        platformUI = null
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
         * PLATFORM
         * =====================================================
         */

        this.platformUI =
            platformUI


        /*
         * =====================================================
         * GALAXIES
         * =====================================================
         */

        this.galaxiesUI =
            new GalaxiesUI(
                this.scene,
                this
            )


        /*
         * =====================================================
         * CREATE UI
         * =====================================================
         */

        this.createUI()

    }


    /*
     * =========================================================
     * CREATE UI
     * =========================================================
     */

    createUI() {

        /*
         * الصفحة الرئيسية
         */

        this.container =
            document.createElement('div')

        this.container.id =
            'awtaar-exploration'


        /*
         * =====================================================
         * HEADER
         * =====================================================
         */

        this.header =
            document.createElement('div')

        this.header.className =
            'awtaar-exploration-header'


        this.title =
            document.createElement('h1')

        this.title.className =
            'awtaar-exploration-title'

        this.title.textContent =
            t(
                'exploration.title'
            )


        this.subtitle =
            document.createElement('p')

        this.subtitle.className =
            'awtaar-exploration-subtitle'

        this.subtitle.textContent =
            t(
                'exploration.subtitle'
            )


        this.header.appendChild(
            this.title
        )

        this.header.appendChild(
            this.subtitle
        )


        /*
         * =====================================================
         * SPACE GATEWAYS
         * =====================================================
         */

        this.navigation =
            document.createElement('nav')

        this.navigation.className =
            'awtaar-exploration-nav'


        /*
         * =====================================================
         * SECTIONS
         * =====================================================
         */

        this.items = [

            /*
             * المجرات
             */

            {
                key: 'galaxies',

                translationKey:
                    'exploration.galaxies',

                iconType:
                    'galaxies',

                available:
                    true

            },


            /*
             * عالم وتر
             */

            {
                key: 'watar',

                translationKey:
                    'exploration.watar',

                iconType:
                    'watar',

                available:
                    false

            }

        ]


        /*
         * =====================================================
         * CREATE GATEWAYS
         * =====================================================
         */

        this.items.forEach(
            (item) => {

                const button =
                    document.createElement('button')


                button.type =
                    'button'


                button.className =
                    'awtaar-exploration-item'


                button.dataset.section =
                    item.key


                /*
                 * حالة العنصر
                 */

                if (
                    !item.available
                ) {

                    button.classList.add(
                        'coming-soon'
                    )

                } else {

                    button.classList.add(
                        'available'
                    )

                }


                /*
                 * =================================================
                 * المدار
                 * =================================================
                 */

                const orbit =
                    document.createElement('span')

                orbit.className =
                    'awtaar-exploration-orbit'


                /*
                 * =================================================
                 * نقاط ضوء صغيرة
                 * =================================================
                 */

                const particleOne =
                    document.createElement('span')

                particleOne.className =
                    'awtaar-orbit-particle'


                const particleTwo =
                    document.createElement('span')

                particleTwo.className =
                    'awtaar-orbit-particle'


                orbit.appendChild(
                    particleOne
                )

                orbit.appendChild(
                    particleTwo
                )


                /*
                 * =================================================
                 * CORE
                 * =================================================
                 */

                const core =
                    document.createElement('span')

                core.className =
                    'awtaar-exploration-core'


                /*
                 * =================================================
                 * ICON
                 * =================================================
                 */

                const icon =
                    document.createElement('span')

                icon.className =
                    'awtaar-exploration-icon'

                icon.classList.add(
                    `awtaar-exploration-icon-${item.iconType}`
                )


                /*
                 * SVG الخاص بكل عالم
                 */

                icon.innerHTML =
                    this.createIcon(
                        item.iconType
                    )


                /*
                 * =================================================
                 * TEXT
                 * =================================================
                 */

                const content =
                    document.createElement('span')

                content.className =
                    'awtaar-exploration-content'


                const name =
                    document.createElement('span')

                name.className =
                    'awtaar-exploration-name'

                name.textContent =
                    t(
                        item.translationKey
                    )


                content.appendChild(
                    name
                )


                /*
                 * =================================================
                 * COMING SOON
                 * =================================================
                 */

                if (
                    !item.available
                ) {

                    const status =
                        document.createElement('span')

                    status.className =
                        'awtaar-exploration-status'

                    status.textContent =
                        t(
                            'common.comingSoon'
                        )


                    content.appendChild(
                        status
                    )

                }


                /*
                 * =================================================
                 * BUILD GATEWAY
                 * =================================================
                 */

                core.appendChild(
                    icon
                )

                orbit.appendChild(
                    core
                )

                button.appendChild(
                    orbit
                )

                button.appendChild(
                    content
                )


                /*
                 * =================================================
                 * INTERACTION
                 * =================================================
                 */

                button.addEventListener(
                    'click',
                    () => {

                        this.selectSection(
                            item.key,
                            button
                        )

                    }
                )


                this.navigation.appendChild(
                    button
                )

            }
        )


        /*
         * =====================================================
         * BACK BUTTON
         * =====================================================
         */

        this.backButton =
            document.createElement('button')

        this.backButton.type =
            'button'

        this.backButton.className =
            'awtaar-exploration-back'

        this.backButton.textContent =
            t(
                'common.home'
            )


        this.backButton.addEventListener(
            'click',
            () => {

                this.returnToPlatform()

            }
        )


        /*
         * =====================================================
         * ASSEMBLE
         * =====================================================
         */

        this.container.appendChild(
            this.header
        )

        this.container.appendChild(
            this.navigation
        )

        this.container.appendChild(
            this.backButton
        )


        document.body.appendChild(
            this.container
        )


        /*
         * =====================================================
         * INITIAL STATE
         * =====================================================
         */

        this.container.style.opacity =
            '0'

        this.container.style.visibility =
            'hidden'

        this.container.style.pointerEvents =
            'none'


        /*
         * =====================================================
         * LANGUAGE
         * =====================================================
         */

        this.updateLanguage()

    }


    /*
     * =========================================================
     * CREATE ICON
     * =========================================================
     */

    createIcon(
        type
    ) {

        /*
         * =====================================================
         * GALAXIES
         * =====================================================
         */

        if (
            type === 'galaxies'
        ) {

            return `

                <svg
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >

                    <defs>

                        <linearGradient
                            id="awtaarGalaxyGold"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="1"
                        >

                            <stop
                                offset="0%"
                                stop-color="#f7d994"
                            />

                            <stop
                                offset="45%"
                                stop-color="#d4aa5a"
                            />

                            <stop
                                offset="100%"
                                stop-color="#73501c"
                            />

                        </linearGradient>

                    </defs>


                    <!-- Main galactic orbit -->

                    <ellipse
                        cx="50"
                        cy="50"
                        rx="36"
                        ry="15"
                        transform="rotate(-24 50 50)"
                        fill="none"
                        stroke="url(#awtaarGalaxyGold)"
                        stroke-width="2"
                        opacity="0.95"
                    />


                    <!-- Secondary orbit -->

                    <ellipse
                        cx="50"
                        cy="50"
                        rx="28"
                        ry="11"
                        transform="rotate(35 50 50)"
                        fill="none"
                        stroke="#d4aa5a"
                        stroke-width="1.2"
                        opacity="0.48"
                    />


                    <!-- Galactic core -->

                    <circle
                        cx="50"
                        cy="50"
                        r="7"
                        fill="url(#awtaarGalaxyGold)"
                    />


                    <circle
                        cx="50"
                        cy="50"
                        r="3"
                        fill="#fff0c8"
                    />


                    <!-- Stars -->

                    <circle
                        cx="25"
                        cy="35"
                        r="1.7"
                        fill="#f5d88f"
                    />

                    <circle
                        cx="76"
                        cy="67"
                        r="1.5"
                        fill="#d4aa5a"
                    />

                    <circle
                        cx="69"
                        cy="28"
                        r="1.2"
                        fill="#fff0c8"
                    />

                    <circle
                        cx="31"
                        cy="72"
                        r="1.1"
                        fill="#d4aa5a"
                    />

                </svg>
            `

        }


        /*
         * =====================================================
         * WATAR
         * =====================================================
         */

        if (
            type === 'watar'
        ) {

            return `

                <svg
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >

                    <defs>

                        <linearGradient
                            id="awtaarWatarGold"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="1"
                        >

                            <stop
                                offset="0%"
                                stop-color="#f4d58d"
                            />

                            <stop
                                offset="50%"
                                stop-color="#d4aa5a"
                            />

                            <stop
                                offset="100%"
                                stop-color="#76531f"
                            />

                        </linearGradient>

                    </defs>


                    <!-- String / cosmic wave -->

                    <path
                        d="
                            M 13 58
                            C 23 25,
                              38 25,
                              50 50
                            C 62 75,
                              77 75,
                              87 42
                        "
                        fill="none"
                        stroke="url(#awtaarWatarGold)"
                        stroke-width="3"
                        stroke-linecap="round"
                    />


                    <!-- Second dimensional thread -->

                    <path
                        d="
                            M 15 42
                            C 27 70,
                              39 70,
                              50 50
                            C 61 30,
                              74 30,
                              85 58
                        "
                        fill="none"
                        stroke="#8f6929"
                        stroke-width="1.4"
                        stroke-linecap="round"
                        opacity="0.72"
                    />


                    <!-- Central energy point -->

                    <circle
                        cx="50"
                        cy="50"
                        r="5"
                        fill="#e9c979"
                    />

                    <circle
                        cx="50"
                        cy="50"
                        r="9"
                        fill="none"
                        stroke="#d4aa5a"
                        stroke-width="1"
                        opacity="0.35"
                    />

                </svg>
            `

        }


        return ''

    }


    /*
     * =========================================================
     * UPDATE LANGUAGE
     * =========================================================
     */

    updateLanguage() {

        /*
         * العنوان
         */

        if (
            this.title
        ) {

            this.title.textContent =
                t(
                    'exploration.title'
                )

        }


        /*
         * الوصف
         */

        if (
            this.subtitle
        ) {

            this.subtitle.textContent =
                t(
                    'exploration.subtitle'
                )

        }


        /*
         * البوابات
         */

        const buttons =
            this.navigation.querySelectorAll(
                '.awtaar-exploration-item'
            )


        buttons.forEach(
            (button, index) => {

                const item =
                    this.items[index]


                if (
                    !item
                ) {

                    return

                }


                const name =
                    button.querySelector(
                        '.awtaar-exploration-name'
                    )


                const status =
                    button.querySelector(
                        '.awtaar-exploration-status'
                    )


                if (
                    name
                ) {

                    name.textContent =
                        t(
                            item.translationKey
                        )

                }


                if (
                    status
                ) {

                    status.textContent =
                        t(
                            'common.comingSoon'
                        )

                }

            }
        )


        /*
         * العودة
         */

        this.backButton.textContent =
            t(
                'common.home'
            )


        /*
         * اتجاه الصفحة
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
         * تحديث المجرات
         */

        if (
            this.galaxiesUI &&
            this.galaxiesUI.updateLanguage
        ) {

            this.galaxiesUI.updateLanguage()

        }

    }


    /*
     * =========================================================
     * SHOW
     * =========================================================
     */

    show() {

        this.updateLanguage()


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
     * =========================================================
     * HIDE
     * =========================================================
     */

    hide() {

        this.container.style.opacity =
            '0'

        this.container.style.pointerEvents =
            'none'


        setTimeout(
            () => {

                this.container.style.visibility =
                    'hidden'

            },
            800
        )

    }


    /*
     * =========================================================
     * RETURN TO PLATFORM
     * =========================================================
     */

    returnToPlatform() {

        console.log(
            '↩️ Returning to Awtaar Platform'
        )


        this.backButton.disabled =
            true


        this.hide()


        setTimeout(
            () => {

                this.backButton.disabled =
                    false


                if (
                    this.platformUI
                ) {

                    if (
                        this.platformUI.updateLanguage
                    ) {

                        this.platformUI.updateLanguage()

                    }


                    this.platformUI.show()

                }

            },
            800
        )

    }


    /*
     * =========================================================
     * SELECT SECTION
     * =========================================================
     */

    selectSection(
        section,
        activeButton
    ) {

        /*
         * =====================================================
         * GALAXIES
         * =====================================================
         */

        if (
            section === 'galaxies'
        ) {

            console.log(
                '🌌 Opening Awtaar Galaxies'
            )


            this.hide()


            setTimeout(
                () => {

                    if (
                        this.galaxiesUI
                    ) {

                        if (
                            this.galaxiesUI.updateLanguage
                        ) {

                            this.galaxiesUI.updateLanguage()

                        }


                        this.galaxiesUI.show()

                    }

                },
                800
            )


            return

        }


        /*
         * =====================================================
         * WATAR
         * =====================================================
         */

        if (
            section === 'watar'
        ) {

            console.log(
                '🧵 Watar World — Coming Soon'
            )


            if (
                activeButton
            ) {

                activeButton.classList.add(
                    'pulse'
                )


                setTimeout(
                    () => {

                        activeButton.classList.remove(
                            'pulse'
                        )

                    },
                    700
                )

            }


            return

        }

    }


    /*
     * =========================================================
     * UPDATE
     * =========================================================
     */

    update(
        delta = 0
    ) {

        if (
            this.galaxiesUI &&
            typeof this.galaxiesUI.update ===
            'function'
        ) {

            this.galaxiesUI.update(
                delta
            )

        }

    }

}