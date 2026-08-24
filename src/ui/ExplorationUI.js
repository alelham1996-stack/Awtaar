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
         * مشهد Three.js
         */

        this.scene =
            scene


        /*
         * الصفحة الرئيسية
         */

        this.platformUI =
            platformUI


        /*
         * إنشاء واجهة المجرات
         */

        this.galaxiesUI =
            new GalaxiesUI(
                this.scene,
                this
            )


        /*
         * إنشاء واجهة الاستكشاف
         */

        this.createUI()

    }


    /*
     * إنشاء الواجهة
     */

    createUI() {

        this.container =
            document.createElement('div')

        this.container.id =
            'awtaar-exploration'


        /*
         * شريط الاستكشاف
         */

        this.navigation =
            document.createElement('nav')

        this.navigation.className =
            'awtaar-exploration-nav'


        /*
         * عناصر الاستكشاف
         */

        this.items = [

            {
                key: 'galaxies',
                translationKey:
                    'exploration.galaxies'
            },

            {
                key: 'phenomena',
                translationKey:
                    'exploration.phenomena'
            },

            {
                key: 'simulation',
                translationKey:
                    'exploration.simulation'
            },

            {
                key: 'discover',
                translationKey:
                    'exploration.discover'
            }

        ]


        /*
         * إنشاء عناصر التنقل
         */

        this.items.forEach(
            (item, index) => {

                const button =
                    document.createElement('button')


                button.className =
                    'awtaar-exploration-item'


                button.dataset.section =
                    item.key


                button.textContent =
                    t(
                        item.translationKey
                    )


                if (
                    index === 0
                ) {

                    button.classList.add(
                        'active'
                    )

                }


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
         * زر العودة
         */

        this.backButton =
            document.createElement('button')

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
         * تجميع الواجهة
         */

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
         * الحالة الابتدائية
         */

        this.container.style.opacity =
            '0'

        this.container.style.visibility =
            'hidden'

        this.container.style.pointerEvents =
            'none'


        this.updateLanguage()

    }


    /*
     * تحديث اللغة
     */

    updateLanguage() {

        const buttons =
            this.navigation.querySelectorAll(
                '.awtaar-exploration-item'
            )


        buttons.forEach(
            (button, index) => {

                const item =
                    this.items[index]


                if (
                    item
                ) {

                    button.textContent =
                        t(
                            item.translationKey
                        )

                }

            }
        )


        this.backButton.textContent =
            t(
                'common.home'
            )


        if (
            getLanguage() === 'ar'
        ) {

            this.container.dir =
                'rtl'

        } else {

            this.container.dir =
                'ltr'

        }


        if (
            this.galaxiesUI &&
            this.galaxiesUI.updateLanguage
        ) {

            this.galaxiesUI.updateLanguage()

        }

    }


    /*
     * إظهار واجهة الاستكشاف
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
     * إخفاء واجهة الاستكشاف
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
     * العودة إلى الصفحة الرئيسية
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
     * اختيار القسم
     */

    selectSection(
        section,
        activeButton
    ) {

        const buttons =
            this.navigation.querySelectorAll(
                '.awtaar-exploration-item'
            )


        buttons.forEach(
            (button) => {

                button.classList.remove(
                    'active'
                )

            }
        )


        activeButton.classList.add(
            'active'
        )


        /*
         * =========================
         * المجرات
         * =========================
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
         * =========================
         * الظواهر
         * =========================
         */

        if (
            section === 'phenomena'
        ) {

            console.log(
                '✨ Phenomena section selected'
            )

            return

        }


        /*
         * =========================
         * المحاكاة
         * =========================
         */

        if (
            section === 'simulation'
        ) {

            console.log(
                '🧪 Simulation section selected'
            )

            return

        }


        /*
         * =========================
         * الاكتشاف
         * =========================
         */

        if (
            section === 'discover'
        ) {

            console.log(
                '🔭 Discover section selected'
            )

            return

        }

    }


    /*
     * =====================================================
     * UPDATE
     * =====================================================
     *
     * هذه هي الإضافة المهمة.
     *
     * تمرر delta إلى GalaxiesUI
     * حتى تستمر سلسلة التحديث إلى
     * PhysicsGalaxyUI ثم PhysicsWorldUI
     * ثم تجربة تمدد الزمن.
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