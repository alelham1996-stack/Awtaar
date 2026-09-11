/* =========================================================
   AWTAAR — WATER WORLD UI
   ========================================================= */

import { t, getLanguage } from '../locales/i18n.js';


export default class WaterWorldUI {

    constructor(earthWorldUI, scene = null) {

        this.earthWorldUI = earthWorldUI;
        this.scene = scene;

        this.container = null;
        this.experimentItems = [];

        this.createUI();
        this.updateLanguage();
    }


    createUI() {

        if (this.container) return;

        this.container = document.createElement('section');
        this.container.id = 'awtaar-water-world';


        /* -------------------------------------------------
           HEADER
        ------------------------------------------------- */

        const title = document.createElement('h2');

        title.className = 'awtaar-earth-child-title';
        this.titleElement = title;


        const description = document.createElement('p');

        description.className = 'awtaar-earth-child-description';
        this.descriptionElement = description;


        /* -------------------------------------------------
           EXPERIMENTS
        ------------------------------------------------- */

        const experiments = document.createElement('div');

        experiments.className = 'awtaar-earth-child-experiments';
        this.experimentsContainer = experiments;


        const experimentData = [

            {
                id: 'waterCycle',
                symbol: '≈',
                translationKey: 'waterWorld.experiments.waterCycle.title',
                descriptionKey: 'waterWorld.experiments.waterCycle.description',
                available: true
            },

            {
                id: 'waterStates',
                symbol: '◌',
                translationKey: 'waterWorld.experiments.waterStates.title',
                descriptionKey: 'waterWorld.experiments.waterStates.description',
                available: true
            },

            {
                id: 'oceanCurrents',
                symbol: '≋',
                translationKey: 'waterWorld.experiments.oceanCurrents.title',
                descriptionKey: 'waterWorld.experiments.oceanCurrents.description',
                available: false
            },

            {
                id: 'waterErosion',
                symbol: '⌁',
                translationKey: 'waterWorld.experiments.waterErosion.title',
                descriptionKey: 'waterWorld.experiments.waterErosion.description',
                available: false
            }
        ];


        this.experimentData = experimentData;


        experimentData.forEach((experiment) => {

            const card = document.createElement('button');

            card.type = 'button';
            card.className = 'awtaar-earth-child-card';
            card.dataset.experiment = experiment.id;


            if (!experiment.available) {

                card.classList.add('is-coming-soon');
                card.disabled = true;
            }


            const core = document.createElement('span');

            core.className = 'earth-child-card-core';
            core.textContent = experiment.symbol;


            const content = document.createElement('span');

            content.className = 'earth-child-card-content';


            const name = document.createElement('span');

            name.className = 'earth-child-card-title';
            name.dataset.translationKey = experiment.translationKey;


            const descriptionText = document.createElement('span');

            descriptionText.className =
                'earth-child-card-description';

            descriptionText.dataset.translationKey =
                experiment.descriptionKey;


            content.appendChild(name);
            content.appendChild(descriptionText);


            card.appendChild(core);
            card.appendChild(content);


            if (!experiment.available) {

                const status = document.createElement('span');

                status.className = 'earth-child-card-status';
                status.dataset.status = 'coming-soon';

                card.appendChild(status);


                this.experimentItems.push({
                    data: experiment,
                    element: card,
                    nameElement: name,
                    descriptionElement: descriptionText,
                    statusElement: status
                });

            } else {

                card.addEventListener('click', () => {

                    this.selectExperiment(experiment.id);

                });


                this.experimentItems.push({
                    data: experiment,
                    element: card,
                    nameElement: name,
                    descriptionElement: descriptionText,
                    statusElement: null
                });
            }


            experiments.appendChild(card);
        });


        /* -------------------------------------------------
           BACK BUTTON
        ------------------------------------------------- */

        const backButton = document.createElement('button');

        backButton.type = 'button';
        backButton.className = 'awtaar-earth-child-back';

        this.backButton = backButton;


        backButton.addEventListener('click', () => {

            this.returnToEarthWorld();

        });


        /* -------------------------------------------------
           APPEND
        ------------------------------------------------- */

        this.container.appendChild(title);
        this.container.appendChild(description);
        this.container.appendChild(experiments);
        this.container.appendChild(backButton);


        /* -------------------------------------------------
           INITIAL STATE
        ------------------------------------------------- */

        this.container.style.opacity = '0';
        this.container.style.visibility = 'hidden';
        this.container.style.pointerEvents = 'none';


        document.body.appendChild(this.container);
    }


    updateLanguage() {

        if (!this.container) return;

        const language = getLanguage();

        this.container.dir = language === 'ar'
            ? 'rtl'
            : 'ltr';


        if (this.titleElement) {

            this.titleElement.textContent =
                t('waterWorld.title');
        }


        if (this.descriptionElement) {

            this.descriptionElement.textContent =
                t('waterWorld.description');
        }


        this.experimentItems.forEach((item) => {

            if (item.nameElement) {

                item.nameElement.textContent =
                    t(item.data.translationKey);
            }


            if (item.descriptionElement) {

                item.descriptionElement.textContent =
                    t(item.data.descriptionKey);
            }


            if (
                !item.data.available &&
                item.statusElement
            ) {

                item.statusElement.textContent =
                    t('waterWorld.comingSoon');
            }
        });


        if (this.backButton) {

            this.backButton.textContent =
                t('waterWorld.back');
        }
    }


    show() {

        if (!this.container) return;

        this.container.style.visibility = 'visible';
        this.container.style.pointerEvents = 'auto';


        requestAnimationFrame(() => {

            if (!this.container) return;

            this.container.style.opacity = '1';

        });
    }


    hide() {

        if (!this.container) return;

        this.container.style.opacity = '0';
        this.container.style.pointerEvents = 'none';


        window.setTimeout(() => {

            if (!this.container) return;

            this.container.style.visibility = 'hidden';

        }, 550);
    }


    selectExperiment(experimentId) {

        switch (experimentId) {

            case 'waterCycle':

                /*
                 * سيتم ربط تجربة دورة المياه هنا
                 * بعد إنشاء ملف التجربة.
                 */

                break;


            case 'waterStates':

                /*
                 * سيتم ربط تجربة حالات الماء هنا
                 * بعد إنشاء ملف التجربة.
                 */

                break;


            default:

                break;
        }
    }


    returnToEarthWorld() {

        this.hide();


        window.setTimeout(() => {

            if (
                this.earthWorldUI &&
                typeof this.earthWorldUI.show === 'function'
            ) {

                this.earthWorldUI.show();
            }

        }, 550);
    }


    update(delta) {

        /*
         * ستُمرر تحديثات التجارب هنا لاحقًا.
         */
    }


    setScene(scene) {

        this.scene = scene;
    }


    destroy() {

        this.experimentItems = [];


        if (this.container) {

            this.container.remove();
            this.container = null;
        }
    }
}