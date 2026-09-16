/* =========================================================
   AWTAAR — CHEMISTRY WORLD UI
   ========================================================= */

import './chemistry-world.css';

import AtomicStructureExperiment from './atomic/AtomicStructureExperiment.js';

import ChemicalBondsExperiment from './bonds/ChemicalBondsExperiment.js';

import {
    t,
    getLanguage
} from '../locales/i18n.js';


export default class ChemistryWorldUI {

    /* =====================================================
       CONSTRUCTOR
       ===================================================== */

    constructor(
        parentUI = null,
        scene = null
    ) {

        this.parentUI =
            parentUI;

        this.scene =
            scene;


        /* =================================================
           UI
           ================================================= */

        this.container =
            null;

        this.experimentsContainer =
            null;

        this.experimentItems =
            [];


        /* =================================================
           EXPERIMENTS
           ================================================= */

        this.atomicStructureExperiment =
            null;

        this.chemicalBondsExperiment =
            null;


        /* =================================================
           INITIALIZE
           ================================================= */

        this.createUI();

        this.updateLanguage();


        /* =================================================
           ATOMIC STRUCTURE EXPERIMENT
           ================================================= */

        this.atomicStructureExperiment =
            new AtomicStructureExperiment(
                this.scene,
                this
            );


        /* =================================================
           CHEMICAL BONDS EXPERIMENT
           ================================================= */

        this.chemicalBondsExperiment =
            new ChemicalBondsExperiment(
                this.scene,
                this
            );

    }


    /* =====================================================
       CREATE UI
       ===================================================== */

    createUI() {

        this.container =
            document.createElement('section');

        this.container.id =
            'awtaar-chemistry-world';

        this.container.className =
            'awtaar-chemistry-world';


        /*
         * خلفية العالم الزرقاء.
         */

        this.container.style.background =
            'linear-gradient(180deg, rgba(4, 15, 42, 0.90) 0%, rgba(3, 10, 29, 0.94) 48%, rgba(2, 7, 20, 0.97) 100%)';


        /* =================================================
           TITLE
           ================================================= */

        const title =
            document.createElement('h1');

        title.className =
            'awtaar-chemistry-title';

        title.dataset.i18n =
            'chemistryWorld.title';


        /* =================================================
           DESCRIPTION
           ================================================= */

        const description =
            document.createElement('p');

        description.className =
            'awtaar-chemistry-description';

        description.dataset.i18n =
            'chemistryWorld.description';


        /* =================================================
           EXPERIMENTS
           ================================================= */

        this.experimentsContainer =
            document.createElement('div');

        this.experimentsContainer.className =
            'awtaar-chemistry-experiments';


        const experiments = [

            {
                id: 'atomicStructure',
                symbol: '⚛',
                available: true
            },

            {
                id: 'chemicalBonds',
                symbol: '⟷',
                available: true
            },

            {
                id: 'periodicTable',
                symbol: '▦',
                available: false
            },

            {
                id: 'chemicalReactions',
                symbol: '⇌',
                available: false
            },

            {
                id: 'acidsBases',
                symbol: 'pH',
                available: false
            },

            {
                id: 'crystals',
                symbol: '◇',
                available: false
            }

        ];


        experiments.forEach(
            experiment => {

                const card =
                    document.createElement('button');

                card.type =
                    'button';

                card.className =
                    'awtaar-chemistry-experiment';

                card.dataset.experiment =
                    experiment.id;


                if (!experiment.available) {

                    card.classList.add(
                        'locked'
                    );

                    card.disabled =
                        true;

                }


                /* =========================================
                   SYMBOL
                   ========================================= */

                const symbol =
                    document.createElement('div');

                symbol.className =
                    'awtaar-chemistry-experiment-symbol';

                symbol.textContent =
                    experiment.symbol;


                /* =========================================
                   CONTENT
                   ========================================= */

                const content =
                    document.createElement('div');

                content.className =
                    'awtaar-chemistry-experiment-content';


                const experimentTitle =
                    document.createElement('h2');

                experimentTitle.className =
                    'awtaar-chemistry-experiment-title';

                experimentTitle.dataset.i18n =
                    `chemistryWorld.experiments.${experiment.id}.title`;


                const experimentDescription =
                    document.createElement('p');

                experimentDescription.className =
                    'awtaar-chemistry-experiment-description';

                experimentDescription.dataset.i18n =
                    `chemistryWorld.experiments.${experiment.id}.description`;


                const status =
                    document.createElement('span');

                status.className =
                    'awtaar-chemistry-experiment-status';

                status.dataset.i18n =
                    experiment.available
                        ? 'chemistryWorld.available'
                        : 'chemistryWorld.locked';


                content.appendChild(
                    experimentTitle
                );

                content.appendChild(
                    experimentDescription
                );

                content.appendChild(
                    status
                );


                card.appendChild(
                    symbol
                );

                card.appendChild(
                    content
                );


                /* =========================================
                   SELECT
                   ========================================= */

                if (experiment.available) {

                    card.addEventListener(
                        'click',
                        () => {

                            this.selectExperiment(
                                experiment.id
                            );

                        }
                    );

                }


                this.experimentsContainer.appendChild(
                    card
                );

                this.experimentItems.push(
                    {
                        id: experiment.id,
                        element: card
                    }
                );

            }
        );


        /* =================================================
           BACK BUTTON
           ================================================= */

        const backButton =
            document.createElement('button');

        backButton.type =
            'button';

        backButton.className =
            'awtaar-chemistry-back';

        backButton.dataset.i18n =
            'chemistryWorld.back';


        backButton.addEventListener(
            'click',
            () => {

                this.returnToParent();

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
            this.experimentsContainer
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
       UPDATE LANGUAGE
       ===================================================== */

    updateLanguage() {

        if (
            !this.container
        ) {
            return;
        }


        const language =
            getLanguage();


        const isArabic =
            language === 'ar';


        this.container.dir =
            isArabic
                ? 'rtl'
                : 'ltr';


        /* =================================================
           MAIN TEXT
           ================================================= */

        const title =
            this.container.querySelector(
                '.awtaar-chemistry-title'
            );


        if (title) {

            title.textContent =
                t(
                    'chemistryWorld.title'
                );

        }


        const description =
            this.container.querySelector(
                '.awtaar-chemistry-description'
            );


        if (description) {

            description.textContent =
                t(
                    'chemistryWorld.description'
                );

        }


        /* =================================================
           EXPERIMENT CARDS
           ================================================= */

        this.experimentItems.forEach(
            item => {

                const title =
                    item.element.querySelector(
                        '.awtaar-chemistry-experiment-title'
                    );


                const description =
                    item.element.querySelector(
                        '.awtaar-chemistry-experiment-description'
                    );


                const status =
                    item.element.querySelector(
                        '.awtaar-chemistry-experiment-status'
                    );


                if (title) {

                    title.textContent =
                        t(
                            `chemistryWorld.experiments.${item.id}.title`
                        );

                }


                if (description) {

                    description.textContent =
                        t(
                            `chemistryWorld.experiments.${item.id}.description`
                        );

                }


                if (status) {

                    status.textContent =
                        item.element.classList.contains(
                            'locked'
                        )
                            ? t(
                                'chemistryWorld.locked'
                            )
                            : t(
                                'chemistryWorld.available'
                            );

                }

            }
        );


        /* =================================================
           BACK BUTTON
           ================================================= */

        const backButton =
            this.container.querySelector(
                '.awtaar-chemistry-back'
            );


        if (backButton) {

            backButton.textContent =
                t(
                    'chemistryWorld.back'
                );

        }


        /* =================================================
           ATOMIC STRUCTURE LANGUAGE
           ================================================= */

        if (
            this.atomicStructureExperiment &&
            typeof this.atomicStructureExperiment.updateLanguage ===
            'function'
        ) {

            this.atomicStructureExperiment.updateLanguage();

        }


        /* =================================================
           CHEMICAL BONDS LANGUAGE
           ================================================= */

        if (
            this.chemicalBondsExperiment &&
            typeof this.chemicalBondsExperiment.updateLanguage ===
            'function'
        ) {

            this.chemicalBondsExperiment.updateLanguage();

        }

    }


    /* =====================================================
       SELECT EXPERIMENT
       ===================================================== */

    selectExperiment(
        experimentId
    ) {

        if (
            !experimentId
        ) {
            return;
        }


        /* =================================================
           ATOMIC STRUCTURE
           ================================================= */

        if (
            experimentId ===
            'atomicStructure'
        ) {

            /*
             * أولًا نخفي عالم الكيمياء نفسه.
             */

            this.hide();


            /*
             * ثم نخفي الواجهة الأب
             * (GalaxiesUI)
             *
             * حتى لا تبقى واجهة أوتار خلف التجربة.
             */

            if (
                this.parentUI &&
                typeof this.parentUI.hide ===
                'function'
            ) {

                this.parentUI.hide();

            }


            /*
             * الآن نفتح تجربة الذرة
             * وحدها فوق المشهد.
             */

            if (
                this.atomicStructureExperiment &&
                typeof this.atomicStructureExperiment.show ===
                'function'
            ) {

                this.atomicStructureExperiment.show();

            }

            return;

        }


        /* =================================================
           CHEMICAL BONDS
           ================================================= */

        if (
            experimentId ===
            'chemicalBonds'
        ) {

            /*
             * نفس التسلسل للتجربة الثانية
             * عندما يتم بناؤها.
             */

            this.hide();


            if (
                this.parentUI &&
                typeof this.parentUI.hide ===
                'function'
            ) {

                this.parentUI.hide();

            }


            if (
                this.chemicalBondsExperiment &&
                typeof this.chemicalBondsExperiment.show ===
                'function'
            ) {

                this.chemicalBondsExperiment.show();

            }

            return;

        }

    }


    /* =====================================================
       SHOW
       ===================================================== */

    show() {

        if (
            !this.container
        ) {
            return;
        }


        /* =================================================
           SHOW UI
           ================================================= */

        this.container.style.visibility =
            'visible';

        this.container.style.pointerEvents =
            'auto';


        requestAnimationFrame(
            () => {

                if (
                    this.container
                ) {

                    this.container.style.opacity =
                        '1';

                }

            }
        );


        this.experimentItems.forEach(
            item => {

                item.element.style.opacity =
                    '1';

            }
        );

    }


    /* =====================================================
       HIDE
       ===================================================== */

    hide() {

        if (
            !this.container
        ) {
            return;
        }


        this.container.style.opacity =
            '0';

        this.container.style.pointerEvents =
            'none';


        setTimeout(
            () => {

                if (
                    this.container &&
                    this.container.style.opacity === '0'
                ) {

                    this.container.style.visibility =
                        'hidden';

                }

            },
            550
        );

    }


    /* =====================================================
       RETURN TO PARENT
       ===================================================== */

    returnToParent() {

        this.hide();


        setTimeout(
            () => {

                if (
                    this.parentUI &&
                    typeof this.parentUI.show ===
                    'function'
                ) {

                    this.parentUI.show();

                }

            },
            550
        );

    }


    /* =====================================================
       UPDATE
       ===================================================== */

    update(
        delta = 0.016
    ) {

        /* =================================================
           ATOMIC STRUCTURE
           ================================================= */

        if (
            this.atomicStructureExperiment &&
            typeof this.atomicStructureExperiment.update ===
            'function'
        ) {

            this.atomicStructureExperiment.update(
                delta
            );

        }


        /* =================================================
           CHEMICAL BONDS
           ================================================= */

        if (
            this.chemicalBondsExperiment &&
            typeof this.chemicalBondsExperiment.update ===
            'function'
        ) {

            this.chemicalBondsExperiment.update(
                delta
            );

        }

    }


    /* =====================================================
       SET SCENE
       ===================================================== */

    setScene(
        scene
    ) {

        this.scene =
            scene;


        /* =================================================
           ATOMIC STRUCTURE SCENE
           ================================================= */

        if (
            this.atomicStructureExperiment &&
            typeof this.atomicStructureExperiment.setScene ===
            'function'
        ) {

            this.atomicStructureExperiment.setScene(
                scene
            );

        }


        /* =================================================
           CHEMICAL BONDS SCENE
           ================================================= */

        if (
            this.chemicalBondsExperiment &&
            typeof this.chemicalBondsExperiment.setScene ===
            'function'
        ) {

            this.chemicalBondsExperiment.setScene(
                scene
            );

        }

    }


    /* =====================================================
       DESTROY
       ===================================================== */

    destroy() {

        /* =================================================
           ATOMIC STRUCTURE
           ================================================= */

        if (
            this.atomicStructureExperiment &&
            typeof this.atomicStructureExperiment.destroy ===
            'function'
        ) {

            this.atomicStructureExperiment.destroy();

        }


        /* =================================================
           CHEMICAL BONDS
           ================================================= */

        if (
            this.chemicalBondsExperiment &&
            typeof this.chemicalBondsExperiment.destroy ===
            'function'
        ) {

            this.chemicalBondsExperiment.destroy();

        }


        this.atomicStructureExperiment =
            null;

        this.chemicalBondsExperiment =
            null;


        /* =================================================
           REMOVE UI
           ================================================= */

        if (
            this.container &&
            this.container.parentNode
        ) {

            this.container.parentNode.removeChild(
                this.container
            );

        }


        this.container =
            null;

        this.experimentsContainer =
            null;

        this.experimentItems =
            [];

        this.scene =
            null;

        this.parentUI =
            null;

    }

}