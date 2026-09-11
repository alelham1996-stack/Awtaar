/* =========================================================
   AWTAAR — COSMIC WORLD UI
   ========================================================= */

import './cosmic-world.css';

import { t, getLanguage } from '../locales/i18n.js';

import GravitationalLensingExperiment
    from './GravitationalLensingExperiment.js';

import CosmicExpansionExperiment
    from './CosmicExpansionExperiment.js';


export default class CosmicWorldUI {

    constructor(astronomyWorldUI, scene = null) {

        this.astronomyWorldUI = astronomyWorldUI;
        this.scene = scene;

        this.container = null;

        this.experimentItems = [];


        /* =================================================
           EXPERIMENT INSTANCES
           ================================================= */

        this.lensingExperiment = null;

        this.expansionExperiment = null;


        this.createUI();
        this.updateLanguage();

    }


    /* =====================================================
       CREATE UI
       ===================================================== */

    createUI() {

        if (this.container) return;


        this.container =
            document.createElement('section');

        this.container.id =
            'awtaar-cosmic-world';


        /* =================================================
           TITLE
           ================================================= */

        const title =
            document.createElement('h2');

        title.className =
            'awtaar-cosmic-world-title';

        this.titleElement = title;


        /* =================================================
           DESCRIPTION
           ================================================= */

        const description =
            document.createElement('p');

        description.className =
            'awtaar-cosmic-world-description';

        this.descriptionElement =
            description;


        /* =================================================
           EXPERIMENTS CONTAINER
           ================================================= */

        const experiments =
            document.createElement('div');

        experiments.className =
            'awtaar-cosmic-world-experiments';

        this.experimentsContainer =
            experiments;


        /* =================================================
           EXPERIMENT DATA
           ================================================= */

        const experimentData = [

            {
                id: 'lensing',

                symbol: '◉',

                translationKey:
                    'astronomyWorld.cosmic.lensing.cardTitle'
            },

            {
                id: 'expansion',

                symbol: '∞',

                translationKey:
                    'astronomyWorld.cosmic.expansion.cardTitle'
            }

        ];


        this.experimentData =
            experimentData;


        /* =================================================
           CREATE EXPERIMENT CARDS
           ================================================= */

        experimentData.forEach((experiment) => {

            const card =
                document.createElement('button');

            card.type = 'button';

            card.className =
                'awtaar-cosmic-world-experiment';

            card.dataset.experiment =
                experiment.id;


            /* ---------------------------------------------
               SYMBOL
               --------------------------------------------- */

            const symbol =
                document.createElement('span');

            symbol.className =
                'cosmic-experiment-symbol';

            symbol.textContent =
                experiment.symbol;


            /* ---------------------------------------------
               NAME
               --------------------------------------------- */

            const name =
                document.createElement('span');

            name.className =
                'cosmic-experiment-name';

            name.dataset.translationKey =
                experiment.translationKey;


            /* ---------------------------------------------
               APPEND
               --------------------------------------------- */

            card.appendChild(symbol);

            card.appendChild(name);


            /* ---------------------------------------------
               CLICK
               --------------------------------------------- */

            card.addEventListener('click', () => {

                this.selectExperiment(
                    experiment.id
                );

            });


            experiments.appendChild(card);


            this.experimentItems.push({

                data: experiment,

                element: card,

                nameElement: name

            });

        });


        /* =================================================
           BACK BUTTON
           ================================================= */

        const backButton =
            document.createElement('button');

        backButton.type = 'button';

        backButton.className =
            'awtaar-cosmic-world-back';

        this.backButton =
            backButton;


        backButton.addEventListener(
            'click',
            () => {

                this.returnToAstronomy();

            }
        );


        /* =================================================
           APPEND
           ================================================= */

        this.container.appendChild(
            title
        );

        this.container.appendChild(
            description
        );

        this.container.appendChild(
            experiments
        );

        this.container.appendChild(
            backButton
        );


        /* =================================================
           INITIAL STATE
           ================================================= */

        this.container.style.opacity =
            '0';

        this.container.style.visibility =
            'hidden';

        this.container.style.pointerEvents =
            'none';


        document.body.appendChild(
            this.container
        );

    }


    /* =====================================================
       LANGUAGE
       ===================================================== */

    updateLanguage() {

        if (!this.container) return;


        const language =
            getLanguage();


        this.container.dir =
            language === 'ar'
                ? 'rtl'
                : 'ltr';


        /* ---------------------------------------------
           TITLE
           --------------------------------------------- */

        if (this.titleElement) {

            this.titleElement.textContent =
                t(
                    'astronomyWorld.cosmic.title'
                );

        }


        /* ---------------------------------------------
           DESCRIPTION
           --------------------------------------------- */

        if (this.descriptionElement) {

            this.descriptionElement.textContent =
                t(
                    'astronomyWorld.cosmic.description'
                );

        }


        /* ---------------------------------------------
           EXPERIMENTS
           --------------------------------------------- */

        this.experimentItems.forEach(
            (item) => {

                if (!item.nameElement) return;


                const value =
                    t(
                        item.data.translationKey
                    );


                /*
                   Prevent [object Object]
                   if a translation object is
                   accidentally returned.
                */

                if (
                    typeof value === 'string'
                ) {

                    item.nameElement.textContent =
                        value;

                } else {

                    /*
                       Safe fallback for the
                       expansion card.
                    */

                    if (
                        item.data.id ===
                        'expansion'
                    ) {

                        item.nameElement.textContent =
                            language === 'ar'
                                ? 'تمدد الكون'
                                : 'Universe Expansion';

                    }

                }

            }
        );


        /* ---------------------------------------------
           BACK
           --------------------------------------------- */

        if (this.backButton) {

            this.backButton.textContent =
                t(
                    'astronomyWorld.back'
                );

        }


        /* ---------------------------------------------
           UPDATE LENSING
           --------------------------------------------- */

        if (
            this.lensingExperiment &&
            typeof this.lensingExperiment
                .updateLanguage === 'function'
        ) {

            this.lensingExperiment
                .updateLanguage();

        }


        /* ---------------------------------------------
           UPDATE EXPANSION
           --------------------------------------------- */

        if (
            this.expansionExperiment &&
            typeof this.expansionExperiment
                .updateLanguage === 'function'
        ) {

            this.expansionExperiment
                .updateLanguage();

        }

    }


    /* =====================================================
       SELECT EXPERIMENT
       ===================================================== */

    selectExperiment(experimentId) {

        switch (experimentId) {


            /* =============================================
               GRAVITATIONAL LENSING
               ============================================= */

            case 'lensing':

                this.openLensingExperiment();

                break;


            /* =============================================
               UNIVERSE EXPANSION
               ============================================= */

            case 'expansion':

                this.openExpansionExperiment();

                break;


            default:

                break;

        }

    }


    /* =====================================================
       OPEN GRAVITATIONAL LENSING
       ===================================================== */

    openLensingExperiment() {

        this.hide();


        if (!this.lensingExperiment) {

            this.lensingExperiment =
                new GravitationalLensingExperiment(
                    this.scene,
                    this
                );

        }


        window.setTimeout(() => {

            if (
                this.lensingExperiment &&
                typeof this.lensingExperiment.show
                    === 'function'
            ) {

                this.lensingExperiment.show();

            }

        }, 500);

    }


    /* =====================================================
       OPEN COSMIC EXPANSION
       ===================================================== */

    openExpansionExperiment() {

        this.hide();


        /* ---------------------------------------------
           CREATE EXPERIMENT ON FIRST OPEN
           --------------------------------------------- */

        if (!this.expansionExperiment) {

            this.expansionExperiment =
                new CosmicExpansionExperiment(
                    this.scene,
                    this
                );

        }


        /* ---------------------------------------------
           SHOW EXPERIMENT
           --------------------------------------------- */

        window.setTimeout(() => {

            if (
                this.expansionExperiment &&
                typeof this.expansionExperiment.show
                    === 'function'
            ) {

                this.expansionExperiment.show();

            }

        }, 500);

    }


    /* =====================================================
       RETURN FROM COSMIC EXPERIMENT
       ===================================================== */

    returnToCosmicWorld() {

        this.show();

    }


    /* =====================================================
       SHOW
       ===================================================== */

    show() {

        if (!this.container) return;


        this.container.style.visibility =
            'visible';

        this.container.style.pointerEvents =
            'auto';


        requestAnimationFrame(() => {

            if (!this.container) return;

            this.container.style.opacity =
                '1';

        });

    }


    /* =====================================================
       HIDE
       ===================================================== */

    hide() {

        if (!this.container) return;


        this.container.style.opacity =
            '0';

        this.container.style.pointerEvents =
            'none';


        window.setTimeout(() => {

            if (!this.container) return;

            this.container.style.visibility =
                'hidden';

        }, 550);

    }


    /* =====================================================
       RETURN TO ASTRONOMY WORLD
       ===================================================== */

    returnToAstronomy() {

        this.hide();


        window.setTimeout(() => {

            if (
                this.astronomyWorldUI &&
                typeof this.astronomyWorldUI.show
                    === 'function'
            ) {

                this.astronomyWorldUI.show();

            }

        }, 550);

    }


    /* =====================================================
       UPDATE
       ===================================================== */

    update(delta) {

        /*
           Cosmic experiments manage their
           own animation loops.
        */

    }


    /* =====================================================
       SET SCENE
       ===================================================== */

    setScene(scene) {

        this.scene = scene;


        /* ---------------------------------------------
           LENSING
           --------------------------------------------- */

        if (
            this.lensingExperiment &&
            typeof this.lensingExperiment
                .setScene === 'function'
        ) {

            this.lensingExperiment.setScene(
                scene
            );

        }


        /* ---------------------------------------------
           EXPANSION
           --------------------------------------------- */

        if (
            this.expansionExperiment &&
            typeof this.expansionExperiment
                .setScene === 'function'
        ) {

            this.expansionExperiment.setScene(
                scene
            );

        }

    }


    /* =====================================================
       DESTROY
       ===================================================== */

    destroy() {

        this.experimentItems = [];


        /* ---------------------------------------------
           DESTROY LENSING
           --------------------------------------------- */

        if (this.lensingExperiment) {

            if (
                typeof this.lensingExperiment.destroy
                    === 'function'
            ) {

                this.lensingExperiment.destroy();

            }

            this.lensingExperiment = null;

        }


        /* ---------------------------------------------
           DESTROY EXPANSION
           --------------------------------------------- */

        if (this.expansionExperiment) {

            if (
                typeof this.expansionExperiment.destroy
                    === 'function'
            ) {

                this.expansionExperiment.destroy();

            }

            this.expansionExperiment = null;

        }


        /* ---------------------------------------------
           REMOVE COSMIC WORLD
           --------------------------------------------- */

        if (this.container) {

            this.container.remove();

            this.container = null;

        }

    }

}