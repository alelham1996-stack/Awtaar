/* =========================================================
   AWTAAR — GEOLOGY WORLD UI
   ========================================================= */

import './geology-world.css';

import RockCycleExperiment from './RockCycleExperiment.js';
import RockCycleUI from './RockCycleUI.js';

import { t, getLanguage } from '../locales/i18n.js';


export default class GeologyWorldUI {

    constructor(earthWorldUI, scene = null) {

        this.earthWorldUI = earthWorldUI;
        this.scene = scene;

        this.container = null;
        this.experimentItems = [];

        /* -------------------------------------------------
           ROCK CYCLE
           -------------------------------------------------
           لا ننشئ التجربة هنا.
           
           سيتم إنشاؤها فقط عند الضغط على بطاقة
           دورة الصخور.
        ------------------------------------------------- */

        this.rockCycleExperiment = null;
        this.rockCycleUI = null;


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
            'awtaar-geology-world';


        /* -------------------------------------------------
           HEADER
        ------------------------------------------------- */

        const title =
            document.createElement('h2');

        title.className =
            'awtaar-earth-child-title';

        this.titleElement =
            title;


        const description =
            document.createElement('p');

        description.className =
            'awtaar-earth-child-description';

        this.descriptionElement =
            description;


        /* -------------------------------------------------
           EXPERIMENTS
        ------------------------------------------------- */

        const experiments =
            document.createElement('div');

        experiments.className =
            'awtaar-earth-child-experiments';

        this.experimentsContainer =
            experiments;


        const experimentData = [

            {
                id: 'rockCycle',
                symbol: '◈',
                translationKey:
                    'geologyWorld.experiments.rockCycle.title',
                descriptionKey:
                    'geologyWorld.experiments.rockCycle.description',
                available: true
            },

            {
                id: 'plateTectonics',
                symbol: '⇆',
                translationKey:
                    'geologyWorld.experiments.plateTectonics.title',
                descriptionKey:
                    'geologyWorld.experiments.plateTectonics.description',
                available: true
            },

            {
                id: 'erosion',
                symbol: '⌁',
                translationKey:
                    'geologyWorld.experiments.erosion.title',
                descriptionKey:
                    'geologyWorld.experiments.erosion.description',
                available: false
            },

            {
                id: 'earthLayers',
                symbol: '◎',
                translationKey:
                    'geologyWorld.experiments.earthLayers.title',
                descriptionKey:
                    'geologyWorld.experiments.earthLayers.description',
                available: false
            }
        ];


        this.experimentData =
            experimentData;


        experimentData.forEach(
            (experiment) => {

                const card =
                    document.createElement('button');

                card.type =
                    'button';

                card.className =
                    'awtaar-earth-child-card';

                card.dataset.experiment =
                    experiment.id;


                /* -------------------------------------------------
                   COMING SOON
                ------------------------------------------------- */

                if (!experiment.available) {

                    card.classList.add(
                        'is-coming-soon'
                    );

                    card.disabled =
                        true;
                }


                /* -------------------------------------------------
                   ICON
                ------------------------------------------------- */

                const core =
                    document.createElement('span');

                core.className =
                    'earth-child-card-core';

                core.textContent =
                    experiment.symbol;


                /* -------------------------------------------------
                   CONTENT
                ------------------------------------------------- */

                const content =
                    document.createElement('span');

                content.className =
                    'earth-child-card-content';


                const name =
                    document.createElement('span');

                name.className =
                    'earth-child-card-title';

                name.dataset.translationKey =
                    experiment.translationKey;


                const descriptionText =
                    document.createElement('span');

                descriptionText.className =
                    'earth-child-card-description';

                descriptionText.dataset.translationKey =
                    experiment.descriptionKey;


                content.appendChild(name);

                content.appendChild(
                    descriptionText
                );


                card.appendChild(core);

                card.appendChild(content);


                /* -------------------------------------------------
                   AVAILABLE EXPERIMENT
                ------------------------------------------------- */

                if (experiment.available) {

                    card.addEventListener(
                        'click',
                        () => {

                            this.selectExperiment(
                                experiment.id
                            );

                        }
                    );


                    this.experimentItems.push({

                        data: experiment,

                        element: card,

                        nameElement: name,

                        descriptionElement:
                            descriptionText,

                        statusElement: null
                    });

                }


                /* -------------------------------------------------
                   COMING SOON EXPERIMENT
                ------------------------------------------------- */

                else {

                    const status =
                        document.createElement('span');

                    status.className =
                        'earth-child-card-status';

                    status.dataset.status =
                        'coming-soon';


                    card.appendChild(
                        status
                    );


                    this.experimentItems.push({

                        data: experiment,

                        element: card,

                        nameElement: name,

                        descriptionElement:
                            descriptionText,

                        statusElement:
                            status
                    });
                }


                experiments.appendChild(
                    card
                );
            }
        );


        /* -------------------------------------------------
           BACK BUTTON
        ------------------------------------------------- */

        const backButton =
            document.createElement('button');

        backButton.type =
            'button';

        backButton.className =
            'awtaar-earth-child-back';

        this.backButton =
            backButton;


        backButton.addEventListener(
            'click',
            () => {

                this.returnToEarthWorld();

            }
        );


        /* -------------------------------------------------
           APPEND
        ------------------------------------------------- */

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


        /* -------------------------------------------------
           INITIAL STATE
        ------------------------------------------------- */

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


        /* -------------------------------------------------
           WORLD TITLE
        ------------------------------------------------- */

        if (this.titleElement) {

            this.titleElement.textContent =
                t(
                    'geologyWorld.title'
                );
        }


        /* -------------------------------------------------
           WORLD DESCRIPTION
        ------------------------------------------------- */

        if (this.descriptionElement) {

            this.descriptionElement.textContent =
                t(
                    'geologyWorld.description'
                );
        }


        /* -------------------------------------------------
           EXPERIMENT CARDS
        ------------------------------------------------- */

        this.experimentItems.forEach(
            (item) => {

                if (item.nameElement) {

                    item.nameElement.textContent =
                        t(
                            item.data.translationKey
                        );
                }


                if (item.descriptionElement) {

                    item.descriptionElement.textContent =
                        t(
                            item.data.descriptionKey
                        );
                }


                if (
                    !item.data.available &&
                    item.statusElement
                ) {

                    item.statusElement.textContent =
                        t(
                            'geologyWorld.comingSoon'
                        );
                }
            }
        );


        /* -------------------------------------------------
           BACK BUTTON
        ------------------------------------------------- */

        if (this.backButton) {

            this.backButton.textContent =
                t(
                    'geologyWorld.back'
                );
        }


        /* -------------------------------------------------
           ROCK CYCLE UI
           ------------------------------------------------- */

        if (
            this.rockCycleUI &&
            typeof this.rockCycleUI.updateLanguage ===
            'function'
        ) {

            this.rockCycleUI.updateLanguage();
        }
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


        requestAnimationFrame(
            () => {

                if (!this.container) return;

                this.container.style.opacity =
                    '1';
            }
        );
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


        window.setTimeout(
            () => {

                if (!this.container) return;

                this.container.style.visibility =
                    'hidden';

            },
            550
        );
    }


    /* =====================================================
       EXPERIMENT SELECTION
       ===================================================== */

    selectExperiment(experimentId) {

        switch (experimentId) {

            case 'rockCycle':

                this.openRockCycleExperiment();

                break;


            case 'plateTectonics':

                /*
                 * سيتم ربط تجربة حركة الصفائح
                 * لاحقًا عند بنائها.
                 */

                break;


            default:

                break;
        }
    }


    /* =====================================================
       CREATE ROCK CYCLE
       ===================================================== */

    createRockCycleExperiment() {

        /*
         * إذا كانت التجربة موجودة بالفعل
         * فلا ننشئ نسخة ثانية.
         */

        if (
            this.rockCycleExperiment &&
            this.rockCycleUI
        ) {

            return true;
        }


        /* -------------------------------------------------
           EXPERIMENT
        ------------------------------------------------- */

        this.rockCycleExperiment =
            new RockCycleExperiment(
                this.scene,
                document.body
            );


        /* -------------------------------------------------
           UI
        ------------------------------------------------- */

        this.rockCycleUI =
            new RockCycleUI(
                this,
                this.rockCycleExperiment
            );


        /* -------------------------------------------------
           LANGUAGE
        ------------------------------------------------- */

        if (
            this.rockCycleUI &&
            typeof this.rockCycleUI.updateLanguage ===
            'function'
        ) {

            this.rockCycleUI.updateLanguage();
        }


        return true;
    }


    /* =====================================================
       OPEN ROCK CYCLE EXPERIMENT
       ===================================================== */

    openRockCycleExperiment() {

        /*
         * ننشئ التجربة الآن فقط.
         *
         * هذا يمنع Canvas التجربة من الوجود
         * فوق عالم الأرض قبل الحاجة إليها.
         */

        if (
            !this.createRockCycleExperiment()
        ) {

            return;
        }


        /* -------------------------------------------------
           HIDE GEOLOGY WORLD
        ------------------------------------------------- */

        this.hide();


        /* -------------------------------------------------
           SHOW EXPERIMENT
        ------------------------------------------------- */

        window.setTimeout(
            () => {

                if (!this.rockCycleUI) return;


                if (
                    typeof this.rockCycleUI.show ===
                    'function'
                ) {

                    this.rockCycleUI.show();
                }

            },
            550
        );
    }


    /* =====================================================
       RETURN TO EARTH WORLD
       ===================================================== */

    returnToEarthWorld() {

        this.hide();


        window.setTimeout(
            () => {

                if (
                    this.earthWorldUI &&
                    typeof this.earthWorldUI.show ===
                    'function'
                ) {

                    this.earthWorldUI.show();
                }

            },
            550
        );
    }


    /* =====================================================
       UPDATE
       ===================================================== */

    update(delta) {

        /*
         * لا يوجد شيء لتحديثه قبل فتح التجربة.
         */

        if (
            this.rockCycleExperiment &&
            typeof this.rockCycleExperiment.update ===
            'function'
        ) {

            this.rockCycleExperiment.update(
                delta
            );
        }


        if (
            this.rockCycleUI &&
            typeof this.rockCycleUI.update ===
            'function'
        ) {

            this.rockCycleUI.update(
                delta
            );
        }
    }


    /* =====================================================
       SCENE
       ===================================================== */

    setScene(scene) {

        this.scene =
            scene;


        if (
            this.rockCycleExperiment &&
            typeof this.rockCycleExperiment.setScene ===
            'function'
        ) {

            this.rockCycleExperiment.setScene(
                scene
            );
        }


        if (
            this.rockCycleUI &&
            typeof this.rockCycleUI.setScene ===
            'function'
        ) {

            this.rockCycleUI.setScene(
                scene
            );
        }
    }


    /* =====================================================
       DESTROY
       ===================================================== */

    destroy() {

        this.experimentItems =
            [];


        /* -------------------------------------------------
           ROCK CYCLE UI
        ------------------------------------------------- */

        if (
            this.rockCycleUI &&
            typeof this.rockCycleUI.destroy ===
            'function'
        ) {

            this.rockCycleUI.destroy();

            this.rockCycleUI =
                null;
        }


        /* -------------------------------------------------
           ROCK CYCLE EXPERIMENT
        ------------------------------------------------- */

        if (
            this.rockCycleExperiment &&
            typeof this.rockCycleExperiment.destroy ===
            'function'
        ) {

            this.rockCycleExperiment.destroy();

            this.rockCycleExperiment =
                null;
        }


        /* -------------------------------------------------
           GEOLOGY WORLD
        ------------------------------------------------- */

        if (this.container) {

            this.container.remove();

            this.container =
                null;
        }
    }
}