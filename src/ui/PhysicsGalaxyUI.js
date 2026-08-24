import './physics-galaxy.css'

import PhysicsWorldUI from './PhysicsWorldUI.js'

import {
    t,
    getLanguage
} from '../locales/i18n.js'


export default class PhysicsGalaxyUI {

    constructor(
        scene = null,
        galaxiesUI = null
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
         * PARENT PAGE
         * =====================================================
         */

        this.galaxiesUI =
            galaxiesUI


        /*
         * =====================================================
         * CREATE UI
         * =====================================================
         */

        this.createUI()


        /*
         * =====================================================
         * CREATE PHYSICS WORLD
         * =====================================================
         */

        this.physicsWorldUI =
            new PhysicsWorldUI(
                this,
                this.scene
            )

    }


    /*
     * =====================================================
     * CREATE UI
     * =====================================================
     */

    createUI() {

        /*
         * MAIN CONTAINER
         */

        this.container =
            document.createElement('section')

        this.container.id =
            'awtaar-physics-galaxy'


        /*
         * =================================================
         * VISUAL CORE
         * =================================================
         */

        this.core =
            document.createElement('div')

        this.core.className =
            'physics-galaxy-core'


        this.core.innerHTML = `

            <div class="physics-orbit orbit-one"></div>

            <div class="physics-orbit orbit-two"></div>

            <div class="physics-core-light"></div>

        `


        /*
         * =================================================
         * CONTENT
         * =================================================
         */

        this.content =
            document.createElement('div')

        this.content.className =
            'physics-galaxy-content'


        /*
         * =================================================
         * SYMBOL
         * =================================================
         */

        this.symbol =
            document.createElement('div')

        this.symbol.className =
            'physics-galaxy-symbol'

        this.symbol.textContent =
            '∞'


        /*
         * =================================================
         * TITLE
         * =================================================
         */

        this.title =
            document.createElement('h1')

        this.title.textContent =
            t('physicsGalaxy.title')


        /*
         * =================================================
         * DESCRIPTION
         * =================================================
         */

        this.description =
            document.createElement('p')

        this.description.textContent =
            t('physicsGalaxy.description')


        /*
         * =================================================
         * START BUTTON
         * =================================================
         */

        this.startButton =
            document.createElement('button')

        this.startButton.type =
            'button'

        this.startButton.className =
            'physics-galaxy-start'

        this.startButton.textContent =
            t('physicsGalaxy.start')


        /*
         * =================================================
         * BACK BUTTON
         * =================================================
         */

        this.backButton =
            document.createElement('button')

        this.backButton.type =
            'button'

        this.backButton.className =
            'physics-galaxy-back'

        this.backButton.textContent =
            t('common.back')


        /*
         * =================================================
         * BUILD CONTENT
         * =================================================
         */

        this.content.appendChild(
            this.symbol
        )

        this.content.appendChild(
            this.title
        )

        this.content.appendChild(
            this.description
        )

        this.content.appendChild(
            this.startButton
        )

        this.content.appendChild(
            this.backButton
        )


        /*
         * =================================================
         * BUILD PAGE
         * =================================================
         */

        this.container.appendChild(
            this.core
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

        this.container.style.zIndex =
            '100'


        /*
         * =================================================
         * START BUTTON EVENT
         * =================================================
         */

        this.startButton.addEventListener(
            'click',
            (event) => {

                event.preventDefault()

                event.stopPropagation()

                this.startExploration()

            }
        )


        /*
         * =================================================
         * BACK BUTTON EVENT
         * =================================================
         */

        this.backButton.addEventListener(
            'click',
            (event) => {

                event.preventDefault()

                event.stopPropagation()

                this.returnToGalaxies()

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
     * UPDATE LANGUAGE
     * =====================================================
     */

    updateLanguage() {

        /*
         * تحديث اتجاه الصفحة
         */

        this.container.dir =
            getLanguage() === 'ar'
                ? 'rtl'
                : 'ltr'


        /*
         * العنوان
         */

        if (
            this.title
        ) {

            this.title.textContent =
                t('physicsGalaxy.title')

        }


        /*
         * الوصف
         */

        if (
            this.description
        ) {

            this.description.textContent =
                t('physicsGalaxy.description')

        }


        /*
         * زر البداية
         */

        if (
            this.startButton
        ) {

            this.startButton.textContent =
                t('physicsGalaxy.start')

        }


        /*
         * زر العودة
         */

        if (
            this.backButton
        ) {

            this.backButton.textContent =
                t('common.back')

        }


        /*
         * تحديث عالم الفيزياء أيضًا
         */

        if (
            this.physicsWorldUI &&
            typeof this.physicsWorldUI.updateLanguage ===
            'function'
        ) {

            this.physicsWorldUI.updateLanguage()

        }

    }


    /*
     * =====================================================
     * SHOW PHYSICS GALAXY
     * =====================================================
     */

    show() {

        console.log(
            '🌀 Showing Physics Galaxy'
        )


        /*
         * تحديث اللغة قبل الظهور
         */

        this.updateLanguage()


        /*
         * إخفاء عالم الفيزياء بالكامل
         */

        if (
            this.physicsWorldUI
        ) {

            this.physicsWorldUI.hide()

        }


        /*
         * إخفاء عالم الكم
         */

        if (
            this.physicsWorldUI &&
            this.physicsWorldUI.quantumWorldUI
        ) {

            this.physicsWorldUI
                .quantumWorldUI
                .hide()

        }


        /*
         * إخفاء تجربة Three.js
         */

        if (
            this.physicsWorldUI &&
            this.physicsWorldUI.quantumWorldUI &&
            this.physicsWorldUI.quantumWorldUI.experiment &&
            this.physicsWorldUI.quantumWorldUI.experiment.group
        ) {

            this.physicsWorldUI
                .quantumWorldUI
                .experiment
                .group
                .visible =
                false

        }


        /*
         * إظهار مجرة الفيزياء
         */

        this.container.style.display =
            'flex'

        this.container.style.visibility =
            'visible'

        this.container.style.pointerEvents =
            'auto'

        this.container.style.opacity =
            '1'

        this.container.style.zIndex =
            '100'


        /*
         * تفعيل الأزرار
         */

        this.startButton.disabled =
            false

        this.startButton.style.pointerEvents =
            'auto'

        this.backButton.disabled =
            false

        this.backButton.style.pointerEvents =
            'auto'


        /*
         * إعادة النص المترجم
         */

        this.startButton.textContent =
            t('physicsGalaxy.start')

    }


    /*
     * =====================================================
     * HIDE PHYSICS GALAXY
     * =====================================================
     */

    hide() {

        console.log(
            '🌀 Hiding Physics Galaxy'
        )


        /*
         * إخفاء الواجهة
         */

        this.container.style.opacity =
            '0'

        this.container.style.pointerEvents =
            'none'


        /*
         * تعطيل الأزرار
         */

        this.startButton.style.pointerEvents =
            'none'

        this.backButton.style.pointerEvents =
            'none'


        /*
         * إخفاء بعد انتهاء الانتقال
         */

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
            900
        )

    }


    /*
     * =====================================================
     * ENTER PHYSICS WORLD
     * =====================================================
     */

    startExploration() {

        console.log(
            '🌀 Entering Physics World'
        )


        /*
         * منع الضغط أثناء الانتقال
         */

        if (
            this.startButton.disabled
        ) {

            return

        }


        this.startButton.disabled =
            true


        /*
         * إخفاء مجرة الفيزياء
         */

        this.hide()


        /*
         * إظهار عالم الفيزياء
         */

        setTimeout(
            () => {

                if (
                    this.physicsWorldUI
                ) {

                    this.physicsWorldUI.show()

                }

            },
            900
        )

    }


    /*
     * =====================================================
     * RETURN TO GALAXIES
     * =====================================================
     */

    returnToGalaxies() {

        console.log(
            '↩️ Returning to Galaxies'
        )


        /*
         * تعطيل الزر مؤقتًا
         */

        this.backButton.disabled =
            true


        /*
         * إخفاء المجرة
         */

        this.hide()


        /*
         * العودة إلى GalaxiesUI
         */

        setTimeout(
            () => {

                if (
                    this.galaxiesUI
                ) {

                    this.galaxiesUI.show()

                }

            },
            900
        )

    }


    /*
     * =====================================================
     * UPDATE
     * =====================================================
     *
     * هذا هو الجزء الجديد المهم.
     *
     * PhysicsGalaxyUI
     *        ↓
     * PhysicsWorldUI
     *
     * ومن PhysicsWorldUI ستستمر السلسلة إلى:
     *
     * RelativeWorldUI
     *        ↓
     * TimeDilationExperiment
     *
     * =====================================================
     */

    update(delta = 0) {

        if (
            this.physicsWorldUI &&
            typeof this.physicsWorldUI.update ===
            'function'
        ) {

            this.physicsWorldUI.update(
                delta
            )

        }

    }

}