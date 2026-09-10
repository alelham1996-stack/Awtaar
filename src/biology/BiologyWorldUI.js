/* =========================================================
   AWTAAR — BIOLOGY WORLD UI
   =========================================================

   Biology Galaxy
        │
        └── BiologyWorldUI
              ├── 🧫 Cell World              AVAILABLE
              ├── 🧬 Genetics World           AVAILABLE
              ├── ⚡ Life Energy World        LOCKED
              ├── 🫀 Human Body World         LOCKED
              ├── 🌿 Ecology World            LOCKED
              └── 🧬 Evolution & Diversity   LOCKED

   Architecture:

   BiologyGalaxyUI
        ↓
   BiologyWorldUI
        ├── CellWorldUI
        └── GeneticsWorldUI

   IMPORTANT:
   BiologyWorldUI directly owns the child world instances.
   No external event is required to open Cell World
   or Genetics World.

   DEBUG VERSION
   ---------------------------------------------------------
   This version contains explicit lifecycle logs so that
   failures in the Biology → Child World chain
   cannot remain silent.
   ========================================================= */

import './BiologyWorld.css'

import CellWorldUI from './CellWorldUI.js'

import GeneticsWorldUI from './genetics/GeneticsWorldUI.js'

import {
    t,
    getLanguage
} from '../locales/i18n.js'


/* =========================================================
   BIOLOGY WORLD UI
   ========================================================= */

export default class BiologyWorldUI {


    /* =====================================================
       CONSTRUCTOR
       ===================================================== */

    constructor(
        biologyGalaxyUI = null,
        scene = null
    ) {

        console.log(
            '🧬 BiologyWorldUI: CONSTRUCTOR START',
            {
                biologyGalaxyUI,
                scene
            }
        )


        this.biologyGalaxyUI =
            biologyGalaxyUI

        this.scene =
            scene


        /* -------------------------------------------------
           STATE
           ------------------------------------------------- */

        this.visible =
            false

        this.transitioning =
            false

        this.destroyed =
            false

        this.activeWorld =
            null


        /* -------------------------------------------------
           CHILD WORLDS
           ------------------------------------------------- */

        this.cellWorldUI =
            null

        this.geneticsWorldUI =
            null

        this.lifeEnergyWorldUI =
            null

        this.humanBodyWorldUI =
            null

        this.ecologyWorldUI =
            null

        this.evolutionWorldUI =
            null


        /* -------------------------------------------------
           DOM
           ------------------------------------------------- */

        this.container =
            null

        this.eyebrowElement =
            null

        this.titleElement =
            null

        this.descriptionElement =
            null

        this.backButton =
            null

        this.worldsContainer =
            null

        this.hintElement =
            null


        this.worldElements =
            new Map()


        /* -------------------------------------------------
           BUILD UI
           ------------------------------------------------- */

        try {

            this.createUI()

            console.log(
                '🧬 BiologyWorldUI: UI CREATED',
                this.container
            )

        } catch (error) {

            console.error(
                '❌ BiologyWorldUI: createUI FAILED',
                error
            )

            throw error
        }


        /* -------------------------------------------------
           CREATE CELL WORLD
           ------------------------------------------------- */

        try {

            this.createCellWorld()

            console.log(
                '🧬 BiologyWorldUI: CellWorldUI CREATED',
                this.cellWorldUI
            )

        } catch (error) {

            console.error(
                '❌ BiologyWorldUI: CELLWORLD CREATION FAILED',
                error
            )

            /*
             * Do not silently continue with a broken child.
             * The Biology World itself can still exist, but
             * the exact problem will now be visible in Console.
             */

            this.cellWorldUI =
                null
        }


        /* -------------------------------------------------
           CREATE GENETICS WORLD
           ------------------------------------------------- */

        try {

            this.createGeneticsWorld()

            console.log(
                '🧬 BiologyWorldUI: GeneticsWorldUI CREATED',
                this.geneticsWorldUI
            )

        } catch (error) {

            console.error(
                '❌ BiologyWorldUI: GENETICSWORLD CREATION FAILED',
                error
            )

            this.geneticsWorldUI =
                null
        }


        /* -------------------------------------------------
           LANGUAGE
           ------------------------------------------------- */

        this.updateLanguage()


        console.log(
            '🧬 BiologyWorldUI: CONSTRUCTOR COMPLETE'
        )
    }


    /* =====================================================
       TRANSLATION HELPER
       ===================================================== */

    translate(
        key,
        fallback
    ) {

        try {

            const value =
                t(key)

            if (
                value &&
                typeof value === 'string' &&
                value !== key
            ) {

                return value
            }

        } catch (error) {

            console.warn(
                '⚠️ BiologyWorldUI translation fallback:',
                key,
                error
            )
        }

        return fallback
    }


    /* =====================================================
       CREATE UI
       ===================================================== */

    createUI() {

        /* -------------------------------------------------
           ROOT
           ------------------------------------------------- */

        this.container =
            document.createElement('section')

        this.container.id =
            'awtaar-biology-world'

        this.container.className =
            'awtaar-biology-world'

        this.container.setAttribute(
            'aria-label',
            'Biology World'
        )


        /* -------------------------------------------------
           HEADER
           ------------------------------------------------- */

        const header =
            document.createElement('header')

        header.className =
            'biology-world-header'


        /* -------------------------------------------------
           EYEBROW
           ------------------------------------------------- */

        this.eyebrowElement =
            document.createElement('div')

        this.eyebrowElement.className =
            'biology-world-eyebrow'

        this.eyebrowElement.textContent =
            this.translate(
                'biologyWorld.eyebrow',
                'BIOLOGY GALAXY'
            )


        /* -------------------------------------------------
           TITLE
           ------------------------------------------------- */

        this.titleElement =
            document.createElement('h2')

        this.titleElement.className =
            'biology-world-title'

        this.titleElement.textContent =
            this.translate(
                'biologyWorld.title',
                'عالم الأحياء'
            )


        /* -------------------------------------------------
           DESCRIPTION
           ------------------------------------------------- */

        this.descriptionElement =
            document.createElement('p')

        this.descriptionElement.className =
            'biology-world-description'

        this.descriptionElement.textContent =
            this.translate(
                'biologyWorld.description',
                'استكشف أسرار الحياة من الخلية إلى الجينات والتنوع الحيوي.'
            )


        /* -------------------------------------------------
           BACK BUTTON
           ------------------------------------------------- */

        this.backButton =
            document.createElement('button')

        this.backButton.type =
            'button'

        this.backButton.className =
            'biology-world-back'

        this.backButton.textContent =
            this.translate(
                'biologyWorld.back',
                'العودة إلى مجرة الأحياء'
            )


        this.backButton.addEventListener(
            'click',
            event => {

                event.preventDefault()
                event.stopPropagation()

                console.log(
                    '🧬 BiologyWorldUI: BACK TO GALAXY CLICKED'
                )

                this.returnToGalaxy()
            }
        )


        /* -------------------------------------------------
           HEADER ASSEMBLY
           ------------------------------------------------- */

        header.appendChild(
            this.eyebrowElement
        )

        header.appendChild(
            this.titleElement
        )

        header.appendChild(
            this.descriptionElement
        )

        header.appendChild(
            this.backButton
        )


        this.container.appendChild(
            header
        )


        /* =================================================
           WORLDS
           ================================================= */

        this.worldsContainer =
            document.createElement('div')

        this.worldsContainer.className =
            'biology-worlds'


        const worldData = [

            /* ------------------------------------------------
               CELL
               ------------------------------------------------ */

            {
                key: 'cell',

                symbol: '🧫',

                titleKey:
                    'biologyWorld.cell',

                title:
                    'عالم الخلية',

                descriptionKey:
                    'biologyWorld.cellDescription',

                description:
                    'اكتشف البنية الدقيقة للخلية وكيف تعمل مكوناتها معًا.',

                available:
                    true,

                position:
                    'cell'
            },


            /* ------------------------------------------------
               GENETICS
               ------------------------------------------------ */

            {
                key: 'genetics',

                symbol: '🧬',

                titleKey:
                    'biologyWorld.genetics',

                title:
                    'عالم الجينات',

                descriptionKey:
                    'biologyWorld.geneticsDescription',

                description:
                    'اكتشف كيف تحمل الجينات شفرة الحياة وكيف تتحول إلى صفات.',

                available:
                    true,

                position:
                    'genetics'
            },


            /* ------------------------------------------------
               LIFE ENERGY
               ------------------------------------------------ */

            {
                key: 'lifeEnergy',

                symbol: '⚡',

                titleKey:
                    'biologyWorld.lifeEnergy',

                title:
                    'عالم طاقة الحياة',

                descriptionKey:
                    'biologyWorld.lifeEnergyDescription',

                description:
                    'رحلة إلى الطاقة التي تجعل العمليات الحيوية ممكنة.',

                available:
                    false,

                position:
                    'life-energy'
            },


            /* ------------------------------------------------
               HUMAN BODY
               ------------------------------------------------ */

            {
                key: 'humanBody',

                symbol: '🫀',

                titleKey:
                    'biologyWorld.humanBody',

                title:
                    'عالم جسم الإنسان',

                descriptionKey:
                    'biologyWorld.humanBodyDescription',

                description:
                    'استكشف أجهزة الجسم وكيف تعمل معًا في منظومة واحدة.',

                available:
                    false,

                position:
                    'human-body'
            },


            /* ------------------------------------------------
               ECOLOGY
               ------------------------------------------------ */

            {
                key: 'ecology',

                symbol: '🌿',

                titleKey:
                    'biologyWorld.ecology',

                title:
                    'عالم البيئة',

                descriptionKey:
                    'biologyWorld.ecologyDescription',

                description:
                    'افهم العلاقات بين الكائنات والبيئة والنظم البيئية.',

                available:
                    false,

                position:
                    'ecology'
            },


            /* ------------------------------------------------
               EVOLUTION
               ------------------------------------------------ */

            {
                key: 'evolution',

                symbol: '🧬',

                titleKey:
                    'biologyWorld.evolution',

                title:
                    'عالم التطور والتنوع',

                descriptionKey:
                    'biologyWorld.evolutionDescription',

                description:
                    'اكتشف كيف ظهر التنوع الحيوي وتغير عبر الزمن.',

                available:
                    false,

                position:
                    'evolution'
            }

        ]


        worldData.forEach(
            world => {

                this.createWorld(
                    world
                )
            }
        )


        this.container.appendChild(
            this.worldsContainer
        )


        /* =================================================
           CENTRAL BIOLOGY CORE
           ================================================= */

        const core =
            document.createElement('div')

        core.className =
            'biology-world-core'


        const coreGlow =
            document.createElement('div')

        coreGlow.className =
            'biology-world-core-glow'


        const coreOrb =
            document.createElement('div')

        coreOrb.className =
            'biology-world-core-orb'


        const coreSymbol =
            document.createElement('span')

        coreSymbol.className =
            'biology-world-core-symbol'

        coreSymbol.textContent =
            '✦'


        const coreName =
            document.createElement('span')

        coreName.className =
            'biology-world-core-name'

        coreName.textContent =
            this.translate(
                'biologyWorld.core',
                'الحياة'
            )


        coreOrb.appendChild(
            coreSymbol
        )

        coreOrb.appendChild(
            coreName
        )

        core.appendChild(
            coreGlow
        )

        core.appendChild(
            coreOrb
        )

        this.container.appendChild(
            core
        )


        /* =================================================
           HINT
           ================================================= */

        this.hintElement =
            document.createElement('div')

        this.hintElement.className =
            'biology-world-hint'

        this.hintElement.textContent =
            this.translate(
                'biologyWorld.hint',
                'اختر عالمًا لبدء الاستكشاف'
            )

        this.container.appendChild(
            this.hintElement
        )


        /* =================================================
           INITIAL STATE
           ================================================= */

        this.container.style.setProperty(
            'opacity',
            '0',
            'important'
        )

        this.container.style.setProperty(
            'visibility',
            'hidden',
            'important'
        )

        this.container.style.setProperty(
            'pointer-events',
            'none',
            'important'
        )

        this.container.style.setProperty(
            'z-index',
            '2100',
            'important'
        )


        /* =================================================
           APPEND
           ================================================= */

        document.body.appendChild(
            this.container
        )


        console.log(
            '🧬 BiologyWorldUI: ROOT APPENDED',
            {
                element: this.container,
                parent: this.container.parentElement
            }
        )
    }


    /* =====================================================
       CREATE CELL WORLD
       ===================================================== */

    createCellWorld() {

        console.log(
            '🧫 BiologyWorldUI: createCellWorld() START'
        )


        if (
            this.destroyed
        ) {

            console.warn(
                '⚠️ BiologyWorldUI: cannot create CellWorldUI because BiologyWorldUI is destroyed.'
            )

            return
        }


        if (
            this.cellWorldUI
        ) {

            console.log(
                '🧫 BiologyWorldUI: CellWorldUI already exists'
            )

            return
        }


        /* -------------------------------------------------
           CREATE
           ------------------------------------------------- */

        console.log(
            '🧫 BiologyWorldUI: creating new CellWorldUI...'
        )


        try {

            this.cellWorldUI =
                new CellWorldUI(
                    this,
                    this.scene
                )

        } catch (error) {

            console.error(
                '❌ BiologyWorldUI: ERROR CREATING CellWorldUI',
                error
            )

            this.cellWorldUI =
                null

            throw error
        }


        console.log(
            '🧫 BiologyWorldUI: CellWorldUI INSTANCE READY',
            this.cellWorldUI
        )


        /* -------------------------------------------------
           PASS SCENE
           ------------------------------------------------- */

        if (
            this.cellWorldUI &&
            typeof this.cellWorldUI.setScene ===
            'function'
        ) {

            console.log(
                '🧫 BiologyWorldUI: passing scene to CellWorldUI'
            )

            this.cellWorldUI.setScene(
                this.scene
            )
        }


        /* -------------------------------------------------
           HIDE UNTIL NEEDED
           ------------------------------------------------- */

        if (
            this.cellWorldUI &&
            typeof this.cellWorldUI.hide ===
            'function'
        ) {

            console.log(
                '🧬 BiologyWorldUI: hiding CellWorldUI until selected'
            )

            this.cellWorldUI.hide()
        }


        console.log(
            '🧫 BiologyWorldUI: createCellWorld() COMPLETE'
        )
    }


    /* =====================================================
       CREATE GENETICS WORLD
       ===================================================== */

    createGeneticsWorld() {

        console.log(
            '🧬 BiologyWorldUI: createGeneticsWorld() START'
        )


        if (
            this.destroyed
        ) {

            console.warn(
                '⚠️ BiologyWorldUI: cannot create GeneticsWorldUI because BiologyWorldUI is destroyed.'
            )

            return
        }


        if (
            this.geneticsWorldUI
        ) {

            console.log(
                '🧬 BiologyWorldUI: GeneticsWorldUI already exists'
            )

            return
        }


        /* -------------------------------------------------
           CREATE
           ------------------------------------------------- */

        console.log(
            '🧬 BiologyWorldUI: creating new GeneticsWorldUI...'
        )


        try {

            this.geneticsWorldUI =
                new GeneticsWorldUI(
                    this,
                    this.scene
                )

        } catch (error) {

            console.error(
                '❌ BiologyWorldUI: ERROR CREATING GeneticsWorldUI',
                error
            )

            this.geneticsWorldUI =
                null

            throw error
        }


        console.log(
            '🧬 BiologyWorldUI: GeneticsWorldUI INSTANCE READY',
            this.geneticsWorldUI
        )


        /* -------------------------------------------------
           PASS SCENE
           ------------------------------------------------- */

        if (
            this.geneticsWorldUI &&
            typeof this.geneticsWorldUI.setScene ===
            'function'
        ) {

            console.log(
                '🧬 BiologyWorldUI: passing scene to GeneticsWorldUI'
            )

            this.geneticsWorldUI.setScene(
                this.scene
            )
        }


        /* -------------------------------------------------
           HIDE UNTIL NEEDED
           ------------------------------------------------- */

        if (
            this.geneticsWorldUI &&
            typeof this.geneticsWorldUI.hide ===
            'function'
        ) {

            console.log(
                '🧬 BiologyWorldUI: hiding GeneticsWorldUI until selected'
            )

            this.geneticsWorldUI.hide()
        }


        console.log(
            '🧬 BiologyWorldUI: createGeneticsWorld() COMPLETE'
        )
    }


    /* =====================================================
       CREATE WORLD CARD
       ===================================================== */

    createWorld(world) {

        const button =
            document.createElement('button')

        button.type =
            'button'

        button.className =
            'biology-world-item'

        button.dataset.world =
            world.key

        button.dataset.position =
            world.position


        if (!world.available) {

            button.classList.add(
                'is-locked'
            )

            button.setAttribute(
                'aria-disabled',
                'true'
            )

        } else {

            button.classList.add(
                'is-available'
            )
        }


        /* -------------------------------------------------
           ORBIT
           ------------------------------------------------- */

        const orbit =
            document.createElement('span')

        orbit.className =
            'biology-world-item-orbit'


        const number =
            document.createElement('span')

        number.className =
            'biology-world-item-number'

        number.textContent =
            String(
                this.worldElements.size + 1
            ).padStart(
                2,
                '0'
            )


        /* -------------------------------------------------
           CORE
           ------------------------------------------------- */

        const cardCore =
            document.createElement('span')

        cardCore.className =
            'biology-world-item-core'


        /* -------------------------------------------------
           SYMBOL
           ------------------------------------------------- */

        const symbol =
            document.createElement('span')

        symbol.className =
            'biology-world-item-symbol'

        symbol.textContent =
            world.symbol


        /* -------------------------------------------------
           CONTENT
           ------------------------------------------------- */

        const content =
            document.createElement('span')

        content.className =
            'biology-world-item-content'


        const title =
            document.createElement('span')

        title.className =
            'biology-world-item-title'

        title.textContent =
            this.translate(
                world.titleKey,
                world.title
            )


        const description =
            document.createElement('span')

        description.className =
            'biology-world-item-description'

        description.textContent =
            this.translate(
                world.descriptionKey,
                world.description
            )


        const status =
            document.createElement('span')

        status.className =
            'biology-world-item-status'


        status.textContent =
            world.available
                ? this.translate(
                    'biologyWorld.available',
                    'متاح للاستكشاف'
                )
                : this.translate(
                    'biologyWorld.comingSoon',
                    'سيفتح لاحقًا'
                )


        /* -------------------------------------------------
           LOCK / OPEN ICON
           ------------------------------------------------- */

        const lock =
            document.createElement('span')

        lock.className =
            'biology-world-item-lock'

        lock.textContent =
            world.available
                ? '↗'
                : '🔒'


        /* -------------------------------------------------
           ASSEMBLE
           ------------------------------------------------- */

        cardCore.appendChild(
            symbol
        )

        content.appendChild(
            title
        )

        content.appendChild(
            description
        )

        content.appendChild(
            status
        )

        orbit.appendChild(
            number
        )

        orbit.appendChild(
            cardCore
        )

        button.appendChild(
            orbit
        )

        button.appendChild(
            content
        )

        button.appendChild(
            lock
        )


        /* -------------------------------------------------
           CLICK
           ------------------------------------------------- */

        button.addEventListener(
            'click',
            event => {

                event.preventDefault()
                event.stopPropagation()


                console.log(
                    '🧬 BiologyWorldUI: WORLD CLICKED',
                    world.key
                )


                this.selectWorld(
                    world.key
                )
            }
        )


        /* -------------------------------------------------
           HOVER
           ------------------------------------------------- */

        button.addEventListener(
            'mouseenter',
            () => {

                if (!world.available) {
                    return
                }

                this.container
                    ?.classList
                    .add(
                        `biology-focus-${world.key}`
                    )
            }
        )


        button.addEventListener(
            'mouseleave',
            () => {

                this.container
                    ?.classList
                    .remove(
                        `biology-focus-${world.key}`
                    )
            }
        )


        /* -------------------------------------------------
           ADD
           ------------------------------------------------- */

        this.worldsContainer.appendChild(
            button
        )


        this.worldElements.set(
            world.key,
            {
                button,
                title,
                description,
                status,
                lock,
                data: world
            }
        )
    }


    /* =====================================================
       UPDATE LANGUAGE
       ===================================================== */

    updateLanguage() {

        if (
            this.destroyed
        ) {
            return
        }


        const language =
            getLanguage()

        const isArabic =
            language === 'ar'


        /* -------------------------------------------------
           DIRECTION
           ------------------------------------------------- */

        if (this.container) {

            this.container.dir =
                isArabic
                    ? 'rtl'
                    : 'ltr'
        }


        /* -------------------------------------------------
           HEADER
           ------------------------------------------------- */

        if (this.eyebrowElement) {

            this.eyebrowElement.textContent =
                this.translate(
                    'biologyWorld.eyebrow',
                    'BIOLOGY GALAXY'
                )
        }


        if (this.titleElement) {

            this.titleElement.textContent =
                this.translate(
                    'biologyWorld.title',
                    'عالم الأحياء'
                )
        }


        if (this.descriptionElement) {

            this.descriptionElement.textContent =
                this.translate(
                    'biologyWorld.description',
                    'استكشف أسرار الحياة من الخلية إلى الجينات والتنوع الحيوي.'
                )
        }


        if (this.backButton) {

            this.backButton.textContent =
                this.translate(
                    'biologyWorld.back',
                    'العودة إلى مجرة الأحياء'
                )
        }


        if (this.hintElement) {

            this.hintElement.textContent =
                this.translate(
                    'biologyWorld.hint',
                    'اختر عالمًا لبدء الاستكشاف'
                )
        }


        /* -------------------------------------------------
           CORE
           ------------------------------------------------- */

        const coreName =
            this.container?.querySelector(
                '.biology-world-core-name'
            )


        if (coreName) {

            coreName.textContent =
                this.translate(
                    'biologyWorld.core',
                    'الحياة'
                )
        }


        /* -------------------------------------------------
           WORLD CARDS
           ------------------------------------------------- */

        this.worldElements.forEach(
            item => {

                const world =
                    item.data


                item.title.textContent =
                    this.translate(
                        world.titleKey,
                        world.title
                    )


                item.description.textContent =
                    this.translate(
                        world.descriptionKey,
                        world.description
                    )


                item.status.textContent =
                    world.available
                        ? this.translate(
                            'biologyWorld.available',
                            'متاح للاستكشاف'
                        )
                        : this.translate(
                            'biologyWorld.comingSoon',
                            'سيفتح لاحقًا'
                        )


                item.lock.textContent =
                    world.available
                        ? '↗'
                        : '🔒'
            }
        )


        /* -------------------------------------------------
           CHILD WORLDS
           ------------------------------------------------- */

        this.updateChildLanguage(
            this.cellWorldUI
        )

        this.updateChildLanguage(
            this.geneticsWorldUI
        )

        this.updateChildLanguage(
            this.lifeEnergyWorldUI
        )

        this.updateChildLanguage(
            this.humanBodyWorldUI
        )

        this.updateChildLanguage(
            this.ecologyWorldUI
        )

        this.updateChildLanguage(
            this.evolutionWorldUI
        )
    }


    /* =====================================================
       UPDATE CHILD LANGUAGE
       ===================================================== */

    updateChildLanguage(worldUI) {

        if (
            worldUI &&
            typeof worldUI.updateLanguage ===
            'function'
        ) {

            worldUI.updateLanguage()
        }
    }


    /* =====================================================
       SHOW
       ===================================================== */

    show() {

        console.log(
            '🧬 BiologyWorldUI: SHOW START'
        )


        if (
            this.destroyed
        ) {

            console.warn(
                '⚠️ BiologyWorldUI: SHOW ABORTED — destroyed'
            )

            return
        }


        if (
            !this.container
        ) {

            console.error(
                '❌ BiologyWorldUI: SHOW ABORTED — container missing'
            )

            return
        }


        this.updateLanguage()


        this.visible =
            true

        this.transitioning =
            false

        this.activeWorld =
            null


        /* -------------------------------------------------
           FORCE VISIBILITY
           ------------------------------------------------- */

        this.container.style.setProperty(
            'display',
            'block',
            'important'
        )

        this.container.style.setProperty(
            'visibility',
            'visible',
            'important'
        )

        this.container.style.setProperty(
            'pointer-events',
            'auto',
            'important'
        )

        this.container.style.setProperty(
            'z-index',
            '2100',
            'important'
        )


        /* -------------------------------------------------
           FORCE REFLOW
           ------------------------------------------------- */

        void this.container.offsetWidth


        requestAnimationFrame(
            () => {

                if (
                    !this.container ||
                    this.destroyed
                ) {
                    return
                }


                this.container.style.setProperty(
                    'opacity',
                    '1',
                    'important'
                )


                console.log(
                    '🧬 BiologyWorldUI: SHOW COMPLETE',
                    {
                        visible: this.visible,
                        display: this.container.style.display,
                        visibility: this.container.style.visibility,
                        opacity: this.container.style.opacity,
                        zIndex: this.container.style.zIndex
                    }
                )
            }
        )
    }


    /* =====================================================
       HIDE
       ===================================================== */

    hide() {

        if (
            this.destroyed ||
            !this.container
        ) {
            return
        }


        console.log(
            '🧬 BiologyWorldUI: HIDE'
        )


        this.visible =
            false


        this.container.style.setProperty(
            'opacity',
            '0',
            'important'
        )

        this.container.style.setProperty(
            'pointer-events',
            'none',
            'important'
        )


        window.setTimeout(
            () => {

                if (
                    !this.container ||
                    this.visible
                ) {
                    return
                }


                this.container.style.setProperty(
                    'visibility',
                    'hidden',
                    'important'
                )

            },
            550
        )
    }


    /* =====================================================
       SELECT WORLD
       ===================================================== */

    selectWorld(key) {

        console.log(
            '🧬 BiologyWorldUI: SELECT WORLD',
            key
        )


        if (
            this.destroyed
        ) {

            console.warn(
                '⚠️ BiologyWorldUI: selectWorld aborted — destroyed'
            )

            return
        }


        if (
            this.transitioning
        ) {

            console.warn(
                '⚠️ BiologyWorldUI: selectWorld aborted — transitioning'
            )

            return
        }


        const item =
            this.worldElements.get(
                key
            )


        if (!item) {

            console.error(
                '❌ BiologyWorldUI: world item not found:',
                key
            )

            return
        }


        const world =
            item.data


        console.log(
            '🧬 BiologyWorldUI: WORLD DATA',
            world
        )


        /* -------------------------------------------------
           LOCKED
           ------------------------------------------------- */

        if (
            !world.available
        ) {

            console.log(
                '🔒 BiologyWorldUI: WORLD LOCKED',
                key
            )


            this.showLockedFeedback(
                item.button
            )

            return
        }


        /* -------------------------------------------------
           TRANSITION
           ------------------------------------------------- */

        this.transitioning =
            true

        this.activeWorld =
            key


        item.button.classList.add(
            'is-opening'
        )


        /* -------------------------------------------------
           CELL WORLD
           ------------------------------------------------- */

        if (
            key === 'cell'
        ) {

            console.log(
                '🧫 BiologyWorldUI: CELL WORLD SELECTED'
            )


            this.openCellWorld()

            return
        }


        /* -------------------------------------------------
           GENETICS WORLD
           ------------------------------------------------- */

        if (
            key === 'genetics'
        ) {

            console.log(
                '🧬 BiologyWorldUI: GENETICS WORLD SELECTED'
            )


            this.openGeneticsWorld()

            return
        }


        /* -------------------------------------------------
           UNKNOWN
           ------------------------------------------------- */

        console.warn(
            '⚠️ BiologyWorldUI: unknown world key:',
            key
        )


        item.button.classList.remove(
            'is-opening'
        )


        this.activeWorld =
            null

        this.transitioning =
            false
    }


    /* =====================================================
       OPEN CELL WORLD
       ===================================================== */

    openCellWorld() {

        console.log(
            '🧫 BiologyWorldUI: OPEN CELL WORLD START'
        )


        if (
            this.destroyed
        ) {

            console.warn(
                '⚠️ BiologyWorldUI: openCellWorld aborted — destroyed'
            )

            this.transitioning =
                false

            return
        }


        /* -------------------------------------------------
           ENSURE CHILD EXISTS
           ------------------------------------------------- */

        if (
            !this.cellWorldUI
        ) {

            console.log(
                '🧫 BiologyWorldUI: CellWorldUI missing — creating now'
            )


            try {

                this.createCellWorld()

            } catch (error) {

                console.error(
                    '❌ BiologyWorldUI: FAILED TO CREATE CELL WORLD',
                    error
                )

                this.transitioning =
                    false

                return
            }
        }


        /* -------------------------------------------------
           VERIFY
           ------------------------------------------------- */

        if (
            !this.cellWorldUI
        ) {

            console.error(
                '❌ BiologyWorldUI: CellWorldUI could not be created.'
            )


            this.transitioning =
                false

            return
        }


        console.log(
            '🧫 BiologyWorldUI: CellWorldUI VERIFIED',
            this.cellWorldUI
        )


        /* -------------------------------------------------
           PASS SCENE
           ------------------------------------------------- */

        if (
            typeof this.cellWorldUI.setScene ===
            'function'
        ) {

            console.log(
                '🧫 BiologyWorldUI: SETTING SCENE ON CELL WORLD'
            )


            this.cellWorldUI.setScene(
                this.scene
            )
        }


        /* -------------------------------------------------
           HIDE BIOLOGY WORLD
           ------------------------------------------------- */

        console.log(
            '🧬 BiologyWorldUI: HIDING BIOLOGY WORLD'
        )


        this.hide()


        /* -------------------------------------------------
           OPEN CELL WORLD
           ------------------------------------------------- */

        window.setTimeout(
            () => {

                console.log(
                    '🧫 BiologyWorldUI: CELL WORLD TRANSITION CALLBACK'
                )


                if (
                    this.destroyed
                ) {

                    console.warn(
                        '⚠️ BiologyWorldUI: transition cancelled — destroyed'
                    )

                    return
                }


                if (
                    !this.cellWorldUI
                ) {

                    console.error(
                        '❌ BiologyWorldUI: CellWorldUI disappeared during transition'
                    )

                    this.transitioning =
                        false

                    return
                }


                if (
                    typeof this.cellWorldUI.show !==
                    'function'
                ) {

                    console.error(
                        '❌ BiologyWorldUI: CellWorldUI.show() is missing'
                    )

                    this.transitioning =
                        false

                    return
                }


                console.log(
                    '🧫 BiologyWorldUI: CALLING CellWorldUI.show()'
                )


                try {

                    this.cellWorldUI.show()

                } catch (error) {

                    console.error(
                        '❌ BiologyWorldUI: CellWorldUI.show() FAILED',
                        error
                    )

                    this.transitioning =
                        false

                    return
                }


                itemReset.call(
                    this
                )


                this.transitioning =
                    false


                console.log(
                    '🧫 BiologyWorldUI: OPEN CELL WORLD COMPLETE'
                )

            },
            550
        )


        function itemReset() {

            const cellItem =
                this.worldElements.get(
                    'cell'
                )


            if (
                cellItem &&
                cellItem.button
            ) {

                cellItem.button.classList.remove(
                    'is-opening'
                )
            }
        }
    }


    /* =====================================================
       OPEN GENETICS WORLD
       ===================================================== */

    openGeneticsWorld() {

        console.log(
            '🧬 BiologyWorldUI: OPEN GENETICS WORLD START'
        )


        if (
            this.destroyed
        ) {

            console.warn(
                '⚠️ BiologyWorldUI: openGeneticsWorld aborted — destroyed'
            )

            this.transitioning =
                false

            return
        }


        /* -------------------------------------------------
           ENSURE CHILD EXISTS
           ------------------------------------------------- */

        if (
            !this.geneticsWorldUI
        ) {

            console.log(
                '🧬 BiologyWorldUI: GeneticsWorldUI missing — creating now'
            )


            try {

                this.createGeneticsWorld()

            } catch (error) {

                console.error(
                    '❌ BiologyWorldUI: FAILED TO CREATE GENETICS WORLD',
                    error
                )

                this.transitioning =
                    false

                return
            }
        }


        /* -------------------------------------------------
           VERIFY
           ------------------------------------------------- */

        if (
            !this.geneticsWorldUI
        ) {

            console.error(
                '❌ BiologyWorldUI: GeneticsWorldUI could not be created.'
            )

            this.transitioning =
                false

            return
        }


        console.log(
            '🧬 BiologyWorldUI: GeneticsWorldUI VERIFIED',
            this.geneticsWorldUI
        )


        /* -------------------------------------------------
           PASS SCENE
           ------------------------------------------------- */

        if (
            typeof this.geneticsWorldUI.setScene ===
            'function'
        ) {

            console.log(
                '🧬 BiologyWorldUI: SETTING SCENE ON GENETICS WORLD'
            )

            this.geneticsWorldUI.setScene(
                this.scene
            )
        }


        /* -------------------------------------------------
           HIDE BIOLOGY WORLD
           ------------------------------------------------- */

        console.log(
            '🧬 BiologyWorldUI: HIDING BIOLOGY WORLD'
        )


        this.hide()


        /* -------------------------------------------------
           OPEN GENETICS WORLD
           ------------------------------------------------- */

        window.setTimeout(
            () => {

                console.log(
                    '🧬 BiologyWorldUI: GENETICS WORLD TRANSITION CALLBACK'
                )


                if (
                    this.destroyed
                ) {

                    console.warn(
                        '⚠️ BiologyWorldUI: transition cancelled — destroyed'
                    )

                    return
                }


                if (
                    !this.geneticsWorldUI
                ) {

                    console.error(
                        '❌ BiologyWorldUI: GeneticsWorldUI disappeared during transition'
                    )

                    this.transitioning =
                        false

                    return
                }


                if (
                    typeof this.geneticsWorldUI.show !==
                    'function'
                ) {

                    console.error(
                        '❌ BiologyWorldUI: GeneticsWorldUI.show() is missing'
                    )

                    this.transitioning =
                        false

                    return
                }


                console.log(
                    '🧬 BiologyWorldUI: CALLING GeneticsWorldUI.show()'
                )


                try {

                    this.geneticsWorldUI.show()

                } catch (error) {

                    console.error(
                        '❌ BiologyWorldUI: GeneticsWorldUI.show() FAILED',
                        error
                    )

                    this.transitioning =
                        false

                    return
                }


                const geneticsItem =
                    this.worldElements.get(
                        'genetics'
                    )


                if (
                    geneticsItem &&
                    geneticsItem.button
                ) {

                    geneticsItem.button.classList.remove(
                        'is-opening'
                    )
                }


                this.transitioning =
                    false


                console.log(
                    '🧬 BiologyWorldUI: OPEN GENETICS WORLD COMPLETE'
                )

            },
            550
        )
    }


    /* =====================================================
       LOCKED FEEDBACK
       ===================================================== */

    showLockedFeedback(button) {

        if (!button) {
            return
        }


        button.classList.remove(
            'is-locked-pulse'
        )


        void button.offsetWidth


        button.classList.add(
            'is-locked-pulse'
        )


        window.setTimeout(
            () => {

                button.classList.remove(
                    'is-locked-pulse'
                )

            },
            650
        )
    }


    /* =====================================================
       RETURN FROM CELL WORLD
       ===================================================== */

    returnFromCellWorld() {

        console.log(
            '🧬 BiologyWorldUI: RETURN FROM CELL WORLD'
        )


        if (
            this.destroyed
        ) {
            return
        }


        this.activeWorld =
            null

        this.transitioning =
            false


        if (
            this.cellWorldUI &&
            typeof this.cellWorldUI.hide ===
            'function'
        ) {

            this.cellWorldUI.hide()
        }


        this.show()
    }


    /* =====================================================
       RETURN FROM GENETICS WORLD
       ===================================================== */

    returnFromGeneticsWorld() {

        console.log(
            '🧬 BiologyWorldUI: RETURN FROM GENETICS WORLD'
        )


        if (
            this.destroyed
        ) {
            return
        }


        this.activeWorld =
            null

        this.transitioning =
            false


        if (
            this.geneticsWorldUI &&
            typeof this.geneticsWorldUI.hide ===
            'function'
        ) {

            this.geneticsWorldUI.hide()
        }


        this.show()
    }


    /* =====================================================
       RETURN TO GALAXY
       ===================================================== */

    returnToGalaxy() {

        console.log(
            '🧬 BiologyWorldUI: RETURN TO BIOLOGY GALAXY'
        )


        if (
            this.destroyed ||
            this.transitioning
        ) {
            return
        }


        this.transitioning =
            true


        this.activeWorld =
            null


        /* -------------------------------------------------
           CLOSE CELL WORLD
           ------------------------------------------------- */

        if (
            this.cellWorldUI &&
            typeof this.cellWorldUI.hide ===
            'function'
        ) {

            this.cellWorldUI.hide()
        }


        /* -------------------------------------------------
           CLOSE FUTURE WORLDS
           ------------------------------------------------- */

        this.closeChildWorld(
            this.geneticsWorldUI
        )

        this.closeChildWorld(
            this.lifeEnergyWorldUI
        )

        this.closeChildWorld(
            this.humanBodyWorldUI
        )

        this.closeChildWorld(
            this.ecologyWorldUI
        )

        this.closeChildWorld(
            this.evolutionWorldUI
        )


        this.hide()


        window.setTimeout(
            () => {

                if (
                    this.destroyed
                ) {
                    return
                }


                this.transitioning =
                    false


                if (
                    this.biologyGalaxyUI &&
                    typeof this.biologyGalaxyUI.show ===
                    'function'
                ) {

                    console.log(
                        '🧬 BiologyWorldUI: CALLING BiologyGalaxyUI.show()'
                    )


                    this.biologyGalaxyUI.show()

                    return
                }


                window.dispatchEvent(
                    new CustomEvent(
                        'awtaar:return-to-biology-galaxy'
                    )
                )

            },
            550
        )
    }


    /* =====================================================
       CLOSE CHILD WORLD
       ===================================================== */

    closeChildWorld(worldUI) {

        if (!worldUI) {
            return
        }


        if (
            typeof worldUI.close ===
            'function'
        ) {

            worldUI.close()

            return
        }


        if (
            typeof worldUI.hide ===
            'function'
        ) {

            worldUI.hide()
        }
    }


    /* =====================================================
       UPDATE
       ===================================================== */

    update(delta = 0) {

        if (
            this.destroyed
        ) {
            return
        }


        /*
         * IMPORTANT:
         *
         * BiologyWorldUI may be hidden while CellWorldUI
         * or GeneticsWorldUI is visible.
         *
         * Therefore we MUST NOT check this.visible here.
         */

        this.updateChild(
            this.cellWorldUI,
            delta
        )


        this.updateChild(
            this.geneticsWorldUI,
            delta
        )


        this.updateChild(
            this.lifeEnergyWorldUI,
            delta
        )


        this.updateChild(
            this.humanBodyWorldUI,
            delta
        )


        this.updateChild(
            this.ecologyWorldUI,
            delta
        )


        this.updateChild(
            this.evolutionWorldUI,
            delta
        )
    }


    /* =====================================================
       UPDATE CHILD
       ===================================================== */

    updateChild(
        worldUI,
        delta
    ) {

        if (
            worldUI &&
            typeof worldUI.update ===
            'function'
        ) {

            worldUI.update(
                delta
            )
        }
    }


    /* =====================================================
       SET SCENE
       ===================================================== */

    setScene(scene) {

        console.log(
            '🧬 BiologyWorldUI: SET SCENE',
            scene
        )


        this.scene =
            scene


        this.setChildScene(
            this.cellWorldUI,
            scene
        )


        this.setChildScene(
            this.geneticsWorldUI,
            scene
        )


        this.setChildScene(
            this.lifeEnergyWorldUI,
            scene
        )


        this.setChildScene(
            this.humanBodyWorldUI,
            scene
        )


        this.setChildScene(
            this.ecologyWorldUI,
            scene
        )


        this.setChildScene(
            this.evolutionWorldUI,
            scene
        )
    }


    /* =====================================================
       SET CHILD SCENE
       ===================================================== */

    setChildScene(
        worldUI,
        scene
    ) {

        if (
            worldUI &&
            typeof worldUI.setScene ===
            'function'
        ) {

            worldUI.setScene(
                scene
            )
        }
    }


    /* =====================================================
       REGISTER CELL WORLD
       ===================================================== */

    setCellWorldUI(worldUI) {

        console.log(
            '🧫 BiologyWorldUI: setCellWorldUI()',
            worldUI
        )


        this.cellWorldUI =
            worldUI || null


        if (this.cellWorldUI) {

            if (
                typeof this.cellWorldUI.setBiologyWorld ===
                'function'
            ) {

                this.cellWorldUI.setBiologyWorld(
                    this
                )
            }


            this.setChildScene(
                this.cellWorldUI,
                this.scene
            )
        }
    }


    /* =====================================================
       REGISTER GENETICS WORLD
       ===================================================== */

    setGeneticsWorldUI(worldUI) {

        console.log(
            '🧬 BiologyWorldUI: setGeneticsWorldUI()',
            worldUI
        )


        this.geneticsWorldUI =
            worldUI || null


        if (this.geneticsWorldUI) {

            if (
                typeof this.geneticsWorldUI.setBiologyWorld ===
                'function'
            ) {

                this.geneticsWorldUI.setBiologyWorld(
                    this
                )
            }


            this.setChildScene(
                this.geneticsWorldUI,
                this.scene
            )
        }
    }


    /* =====================================================
       FUTURE WORLD REGISTRATION
       ===================================================== */

    setLifeEnergyWorldUI(worldUI) {

        this.lifeEnergyWorldUI =
            worldUI || null


        if (this.lifeEnergyWorldUI) {

            this.setChildScene(
                this.lifeEnergyWorldUI,
                this.scene
            )
        }
    }


    setHumanBodyWorldUI(worldUI) {

        this.humanBodyWorldUI =
            worldUI || null


        if (this.humanBodyWorldUI) {

            this.setChildScene(
                this.humanBodyWorldUI,
                this.scene
            )
        }
    }


    setEcologyWorldUI(worldUI) {

        this.ecologyWorldUI =
            worldUI || null


        if (this.ecologyWorldUI) {

            this.setChildScene(
                this.ecologyWorldUI,
                this.scene
            )
        }
    }


    setEvolutionWorldUI(worldUI) {

        this.evolutionWorldUI =
            worldUI || null


        if (this.evolutionWorldUI) {

            this.setChildScene(
                this.evolutionWorldUI,
                this.scene
            )
        }
    }


    /* =====================================================
       OPEN STATE
       ===================================================== */

    isOpen() {

        return (
            this.visible === true &&
            this.destroyed === false
        )
    }


    /* =====================================================
       DESTROY
       ===================================================== */

    destroy() {

        console.log(
            '🧬 BiologyWorldUI: DESTROY'
        )


        if (
            this.destroyed
        ) {
            return
        }


        this.destroyed =
            true

        this.transitioning =
            false


        /* -------------------------------------------------
           DESTROY CHILD WORLDS
           ------------------------------------------------- */

        const children = [

            this.cellWorldUI,

            this.geneticsWorldUI,

            this.lifeEnergyWorldUI,

            this.humanBodyWorldUI,

            this.ecologyWorldUI,

            this.evolutionWorldUI

        ]


        children.forEach(
            worldUI => {

                if (
                    worldUI &&
                    typeof worldUI.destroy ===
                    'function'
                ) {

                    try {

                        worldUI.destroy()

                    } catch (error) {

                        console.error(
                            '❌ BiologyWorldUI: child destroy failed',
                            error
                        )
                    }
                }
            }
        )


        /* -------------------------------------------------
           CLEAR REFERENCES
           ------------------------------------------------- */

        this.cellWorldUI =
            null

        this.geneticsWorldUI =
            null

        this.lifeEnergyWorldUI =
            null

        this.humanBodyWorldUI =
            null

        this.ecologyWorldUI =
            null

        this.evolutionWorldUI =
            null


        /* -------------------------------------------------
           CLEAR DOM
           ------------------------------------------------- */

        this.worldElements.clear()


        if (
            this.container
        ) {

            this.container.remove()
        }


        /* -------------------------------------------------
           NULL REFERENCES
           ------------------------------------------------- */

        this.container =
            null

        this.eyebrowElement =
            null

        this.titleElement =
            null

        this.descriptionElement =
            null

        this.backButton =
            null

        this.worldsContainer =
            null

        this.hintElement =
            null

        this.biologyGalaxyUI =
            null

        this.scene =
            null
    }
}