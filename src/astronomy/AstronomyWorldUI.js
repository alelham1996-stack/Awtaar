/* =========================================================
   AWTAAR — ASTRONOMY WORLD UI
   ========================================================= */

import './astronomy-world.css';

import StellarWorldUI from './StellarWorldUI.js';
import CosmicWorldUI from './CosmicWorldUI.js';

import { t, getLanguage } from '../locales/i18n.js';


export default class AstronomyWorldUI {

    constructor(astronomyGalaxyUI, scene = null) {

        this.astronomyGalaxyUI = astronomyGalaxyUI;
        this.scene = scene;

        this.container = null;

        /* =====================================================
           TRANSITION TIMEOUT
           ===================================================== */

        this.transitionTimeout = null;


        this.stellarWorldUI = new StellarWorldUI(
            this,
            scene
        );

        this.cosmicWorldUI = new CosmicWorldUI(
            this,
            scene
        );

        this.worldItems = [];

        this.createUI();
        this.updateLanguage();
    }


    /* =========================================================
       CLEAR TRANSITION
       ========================================================= */

    clearTransition() {

        if (this.transitionTimeout !== null) {

            window.clearTimeout(
                this.transitionTimeout
            );

            this.transitionTimeout = null;
        }
    }


    /* =========================================================
       CREATE UI
       ========================================================= */

    createUI() {

        if (this.container) return;


        /* =====================================================
           MAIN CONTAINER
           ===================================================== */

        this.container = document.createElement('section');

        this.container.id =
            'awtaar-astronomy-world';


        /* =====================================================
           TITLE
           ===================================================== */

        const title = document.createElement('h2');

        title.className =
            'awtaar-astronomy-world-title';

        this.titleElement = title;


        /* =====================================================
           DESCRIPTION
           ===================================================== */

        const description =
            document.createElement('p');

        description.className =
            'awtaar-astronomy-world-description';

        this.descriptionElement =
            description;


        /* =====================================================
           WORLDS CONTAINER
           ===================================================== */

        const worlds =
            document.createElement('div');

        worlds.className =
            'awtaar-astronomy-worlds';

        this.worldsContainer =
            worlds;


        /* =====================================================
           WORLD DATA
           ===================================================== */

        const worldData = [

            /* -------------------------------------------------
               01 — STELLAR WORLD
               ------------------------------------------------- */

            {
                id: 'stellar',

                symbol: '✦',

                translationKey:
                    'astronomyWorld.stellar.title',

                available: true
            },


            /* -------------------------------------------------
               02 — COSMIC WORLD
               ------------------------------------------------- */

            {
                id: 'cosmic',

                symbol: '◉',

                translationKey:
                    'astronomyWorld.cosmic.title',

                available: true
            },


            /* -------------------------------------------------
               03 — PLANETARY WORLD
               ------------------------------------------------- */

            {
                id: 'planetary',

                symbol: '◌',

                translationKey:
                    'astronomyWorld.planetary',

                available: false
            },


            /* -------------------------------------------------
               04 — MOON WORLD
               ------------------------------------------------- */

            {
                id: 'moons',

                symbol: '☾',

                translationKey:
                    'astronomyWorld.moons',

                available: false
            },


            /* -------------------------------------------------
               05 — BLACK HOLE WORLD
               ------------------------------------------------- */

            {
                id: 'blackHoles',

                symbol: '●',

                translationKey:
                    'astronomyWorld.blackHoles',

                available: false
            },


            /* -------------------------------------------------
               06 — SMALL BODIES WORLD
               ------------------------------------------------- */

            {
                id: 'smallBodies',

                symbol: '✧',

                translationKey:
                    'astronomyWorld.smallBodies',

                available: false
            },


            /* -------------------------------------------------
               07 — OBSERVATION WORLD
               ------------------------------------------------- */

            {
                id: 'observation',

                symbol: '⌾',

                translationKey:
                    'astronomyWorld.observation',

                available: false
            },


            /* -------------------------------------------------
               08 — COSMIC PHENOMENA WORLD
               ------------------------------------------------- */

            {
                id: 'phenomena',

                symbol: '✺',

                translationKey:
                    'astronomyWorld.phenomena',

                available: false
            },


            /* -------------------------------------------------
               09 — SPACETIME WORLD
               ------------------------------------------------- */

            {
                id: 'spacetime',

                symbol: '∞',

                translationKey:
                    'astronomyWorld.spacetime',

                available: false
            },


            /* -------------------------------------------------
               10 — LIFE IN THE UNIVERSE WORLD
               ------------------------------------------------- */

            {
                id: 'life',

                symbol: '⌬',

                translationKey:
                    'astronomyWorld.life',

                available: false
            }

        ];


        this.worldData = worldData;


        /* =====================================================
           CREATE WORLD CARDS
           ===================================================== */

        worldData.forEach(
            (world) => {

                const button =
                    document.createElement('button');

                button.type = 'button';

                button.className =
                    'awtaar-astronomy-world-item';


                button.dataset.world =
                    world.id;


                if (!world.available) {

                    button.classList.add(
                        'is-coming-soon'
                    );

                    button.disabled = true;
                }


                /* =================================================
                   CORE
                   ================================================= */

                const core =
                    document.createElement('span');

                core.className =
                    'astronomy-world-core';

                core.textContent =
                    world.symbol;


                /* =================================================
                   WORLD NAME
                   ================================================= */

                const name =
                    document.createElement('span');

                name.className =
                    'astronomy-world-name';

                name.dataset.translationKey =
                    world.translationKey;


                /* =================================================
                   STATUS
                   ================================================= */

                const status =
                    document.createElement('span');

                status.className =
                    'astronomy-world-status';


                if (!world.available) {

                    status.dataset.status =
                        'coming-soon';

                }


                /* =================================================
                   CARD CONTENT
                   ================================================= */

                button.appendChild(core);

                button.appendChild(name);

                if (!world.available) {

                    button.appendChild(status);
                }


                /* =================================================
                   CLICK
                   ================================================= */

                if (world.available) {

                    button.addEventListener(
                        'click',
                        () => {

                            this.selectWorld(
                                world.id
                            );

                        }
                    );
                }


                worlds.appendChild(button);

                this.worldItems.push({
                    data: world,
                    element: button,
                    nameElement: name,
                    statusElement: status
                });

            }
        );


        /* =====================================================
           BACK BUTTON
           ===================================================== */

        const backButton =
            document.createElement('button');

        backButton.type = 'button';

        backButton.className =
            'awtaar-astronomy-world-back';

        this.backButton =
            backButton;


        backButton.addEventListener(
            'click',
            () => {

                this.returnToGalaxy();

            }
        );


        /* =====================================================
           APPEND
           ===================================================== */

        this.container.appendChild(title);

        this.container.appendChild(
            description
        );

        this.container.appendChild(
            worlds
        );

        this.container.appendChild(
            backButton
        );


        /* =====================================================
           INITIAL STATE
           ===================================================== */

        this.container.style.opacity = '0';

        this.container.style.visibility =
            'hidden';

        this.container.style.pointerEvents =
            'none';


        document.body.appendChild(
            this.container
        );
    }


    /* =========================================================
       UPDATE LANGUAGE
       ========================================================= */

    updateLanguage() {

        if (!this.container) return;


        const language =
            getLanguage();


        /* =====================================================
           DIRECTION
           ===================================================== */

        this.container.dir =
            language === 'ar'
                ? 'rtl'
                : 'ltr';


        /* =====================================================
           TITLE
           ===================================================== */

        if (this.titleElement) {

            this.titleElement.textContent =
                t('astronomyWorld.title');
        }


        /* =====================================================
           DESCRIPTION
           ===================================================== */

        if (this.descriptionElement) {

            this.descriptionElement.textContent =
                t('astronomyWorld.description');
        }


        /* =====================================================
           WORLD NAMES + STATUS
           ===================================================== */

        this.worldItems.forEach(
            (item) => {

                const key =
                    item.data.translationKey;


                if (item.nameElement) {

                    item.nameElement.textContent =
                        t(key);
                }


                if (
                    !item.data.available &&
                    item.statusElement
                ) {

                    item.statusElement.textContent =
                        t(
                            'astronomyWorld.comingSoon'
                        );
                }

            }
        );


        /* =====================================================
           BACK
           ===================================================== */

        if (this.backButton) {

            this.backButton.textContent =
                t('astronomyWorld.back');
        }


        /* =====================================================
           CHILD WORLDS
           ===================================================== */

        if (
            this.stellarWorldUI &&
            typeof this.stellarWorldUI.updateLanguage ===
            'function'
        ) {

            this.stellarWorldUI.updateLanguage();
        }


        if (
            this.cosmicWorldUI &&
            typeof this.cosmicWorldUI.updateLanguage ===
            'function'
        ) {

            this.cosmicWorldUI.updateLanguage();
        }
    }


    /* =========================================================
       SHOW
       ========================================================= */

    show() {

        if (!this.container) return;


        this.clearTransition();


        this.container.style.visibility =
            'visible';

        this.container.style.pointerEvents =
            'auto';


        requestAnimationFrame(
            () => {

                if (!this.container) return;

                this.container.style.opacity =
                    '1';
            }
        );
    }


    /* =========================================================
       HIDE
       ========================================================= */

    hide() {

        if (!this.container) return;


        this.clearTransition();


        this.container.style.opacity =
            '0';

        this.container.style.pointerEvents =
            'none';


        this.transitionTimeout =
            window.setTimeout(
                () => {

                    this.transitionTimeout =
                        null;

                    if (!this.container) return;

                    this.container.style.visibility =
                        'hidden';

                },
                550
            );
    }


    /* =========================================================
       SELECT WORLD
       ========================================================= */

    selectWorld(worldId) {

        switch (worldId) {

            case 'stellar':

                this.enterStellarWorld();

                break;


            case 'cosmic':

                this.enterCosmicWorld();

                break;


            default:

                break;
        }
    }


    /* =========================================================
       ENTER STELLAR WORLD
       ========================================================= */

    enterStellarWorld() {

        this.clearTransition();

        this.hide();

        this.transitionTimeout =
            window.setTimeout(
                () => {

                    this.transitionTimeout =
                        null;

                    if (
                        this.stellarWorldUI &&
                        typeof this.stellarWorldUI.show ===
                        'function'
                    ) {

                        this.stellarWorldUI.show();
                    }

                },
                550
            );
    }


    /* =========================================================
       ENTER COSMIC WORLD
       ========================================================= */

    enterCosmicWorld() {

        this.clearTransition();

        this.hide();

        this.transitionTimeout =
            window.setTimeout(
                () => {

                    this.transitionTimeout =
                        null;

                    if (
                        this.cosmicWorldUI &&
                        typeof this.cosmicWorldUI.show ===
                        'function'
                    ) {

                        this.cosmicWorldUI.show();
                    }

                },
                550
            );
    }


    /* =========================================================
       RETURN FROM STELLAR WORLD
       ========================================================= */

    returnFromStellarWorld() {

        this.clearTransition();


        if (
            this.stellarWorldUI &&
            typeof this.stellarWorldUI.hide ===
            'function'
        ) {

            this.stellarWorldUI.hide();
        }


        this.transitionTimeout =
            window.setTimeout(
                () => {

                    this.transitionTimeout =
                        null;

                    this.show();

                },
                550
            );
    }


    /* =========================================================
       RETURN FROM COSMIC WORLD
       ========================================================= */

    returnFromCosmicWorld() {

        this.clearTransition();


        if (
            this.cosmicWorldUI &&
            typeof this.cosmicWorldUI.hide ===
            'function'
        ) {

            this.cosmicWorldUI.hide();
        }


        this.transitionTimeout =
            window.setTimeout(
                () => {

                    this.transitionTimeout =
                        null;

                    this.show();

                },
                550
            );
    }


    /* =========================================================
       RETURN TO ASTRONOMY GALAXY
       ========================================================= */

    returnToGalaxy() {

        this.clearTransition();

        this.hide();


        this.transitionTimeout =
            window.setTimeout(
                () => {

                    this.transitionTimeout =
                        null;

                    if (
                        this.astronomyGalaxyUI &&
                        typeof this.astronomyGalaxyUI.show ===
                        'function'
                    ) {

                        this.astronomyGalaxyUI.show();
                    }

                },
                550
            );
    }


    /* =========================================================
       UPDATE
       ========================================================= */

    update(delta) {

        if (
            this.stellarWorldUI &&
            typeof this.stellarWorldUI.update ===
            'function'
        ) {

            this.stellarWorldUI.update(delta);
        }


        if (
            this.cosmicWorldUI &&
            typeof this.cosmicWorldUI.update ===
            'function'
        ) {

            this.cosmicWorldUI.update(delta);
        }
    }


    /* =========================================================
       SET SCENE
       ========================================================= */

    setScene(scene) {

        this.scene = scene;


        if (
            this.stellarWorldUI &&
            typeof this.stellarWorldUI.setScene ===
            'function'
        ) {

            this.stellarWorldUI.setScene(scene);
        }


        if (
            this.cosmicWorldUI &&
            typeof this.cosmicWorldUI.setScene ===
            'function'
        ) {

            this.cosmicWorldUI.setScene(scene);
        }
    }


    /* =========================================================
       DESTROY
       ========================================================= */

    destroy() {

        this.clearTransition();


        if (
            this.stellarWorldUI &&
            typeof this.stellarWorldUI.destroy ===
            'function'
        ) {

            this.stellarWorldUI.destroy();
        }


        if (
            this.cosmicWorldUI &&
            typeof this.cosmicWorldUI.destroy ===
            'function'
        ) {

            this.cosmicWorldUI.destroy();
        }


        this.worldItems = [];


        if (this.container) {

            this.container.remove();

            this.container = null;
        }
    }

}