/* =========================================================
   AWTAAR — WATER WORLD UI
   ========================================================= */

import './water-world.css';

import { t, getLanguage } from '../locales/i18n.js';

import WaterCycleExperiment from './WaterCycleExperiment.js';
import SurfaceTensionExperiment from './SurfaceTensionExperiment.js';


export default class WaterWorldUI {

    constructor(earthWorldUI, scene = null) {

        this.earthWorldUI = earthWorldUI;
        this.scene = scene;

        this.container = null;
        this.experimentsContainer = null;
        this.experimentItems = [];


        /*
         * تجربة دورة الماء
         *
         * سيتم إنشاؤها عند فتح التجربة
         * وليس عند إنشاء عالم المياه.
         */

        this.waterCycleExperiment = null;


        /*
         * تجربة التوتر السطحي
         *
         * سيتم إنشاؤها عند فتح التجربة
         * وليس عند إنشاء عالم المياه.
         */

        this.surfaceTensionExperiment = null;


        this.createUI();
        this.updateLanguage();
    }


    /* =====================================================
       CREATE UI
       ===================================================== */

    createUI() {

        if (this.container) return;


        /*
         * الحاوية الرئيسية
         */

        this.container = document.createElement('section');

        this.container.id =
            'awtaar-water-world';

        this.container.className =
            'awtaar-water-world';

        this.container.style.display =
            'flex';

        this.container.style.flexDirection =
            'column';

        this.container.style.alignItems =
            'center';


        /*
         * العنوان
         */

        const title =
            document.createElement('h2');

        title.className =
            'awtaar-earth-child-title';

        this.titleElement =
            title;


        /*
         * الوصف
         */

        const description =
            document.createElement('p');

        description.className =
            'awtaar-earth-child-description';

        this.descriptionElement =
            description;


        /*
         * بطاقات التجارب
         */

        const experiments =
            document.createElement('div');

        experiments.className =
            'awtaar-earth-child-experiments';

        experiments.style.display =
            'grid';

        experiments.style.width =
            'min(1180px, 100%)';

        experiments.style.position =
            'relative';

        experiments.style.zIndex =
            '2';

        this.experimentsContainer =
            experiments;


        /*
         * بيانات التجارب
         */

        const experimentData = [

            {
                id: 'waterCycle',

                symbol: '≈',

                translationKey:
                    'waterWorld.experiments.waterCycle.title',

                descriptionKey:
                    'waterWorld.experiments.waterCycle.description',

                available: true
            },


            {
                id: 'surfaceTension',

                symbol: '◇',

                translationKey:
                    'waterWorld.experiments.surfaceTension.title',

                descriptionKey:
                    'waterWorld.experiments.surfaceTension.description',

                available: true
            },


            {
                id: 'waterStates',

                symbol: '◌',

                translationKey:
                    'waterWorld.experiments.waterStates.title',

                descriptionKey:
                    'waterWorld.experiments.waterStates.description',

                available: false
            },


            {
                id: 'oceanCurrents',

                symbol: '≋',

                translationKey:
                    'waterWorld.experiments.oceanCurrents.title',

                descriptionKey:
                    'waterWorld.experiments.oceanCurrents.description',

                available: false
            },


            {
                id: 'groundwater',

                symbol: '▽',

                translationKey:
                    'waterWorld.experiments.groundwater.title',

                descriptionKey:
                    'waterWorld.experiments.groundwater.description',

                available: false
            },


            {
                id: 'waterErosion',

                symbol: '⌁',

                translationKey:
                    'waterWorld.experiments.waterErosion.title',

                descriptionKey:
                    'waterWorld.experiments.waterErosion.description',

                available: false
            }

        ];


        this.experimentData =
            experimentData;


        /*
         * إنشاء البطاقات
         */

        experimentData.forEach((experiment) => {

            const card =
                document.createElement('button');

            card.type =
                'button';

            card.className =
                'awtaar-earth-child-card';

            card.dataset.experiment =
                experiment.id;

            card.style.display =
                'flex';

            card.style.position =
                'relative';

            card.style.visibility =
                'visible';

            card.style.pointerEvents =
                experiment.available
                    ? 'auto'
                    : 'none';

            card.style.zIndex =
                '2';


            /*
             * البطاقات المغلقة
             */

            if (!experiment.available) {

                card.classList.add(
                    'is-coming-soon'
                );

                card.disabled =
                    true;
            }


            /*
             * الرمز
             */

            const core =
                document.createElement('span');

            core.className =
                'earth-child-card-core';

            core.textContent =
                experiment.symbol;


            /*
             * المحتوى
             */

            const content =
                document.createElement('span');

            content.className =
                'earth-child-card-content';


            /*
             * اسم التجربة
             */

            const name =
                document.createElement('span');

            name.className =
                'earth-child-card-title';

            name.dataset.translationKey =
                experiment.translationKey;


            /*
             * وصف التجربة
             */

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


            /*
             * حالة التجربة المغلقة
             */

            let status = null;

            if (!experiment.available) {

                status =
                    document.createElement('span');

                status.className =
                    'earth-child-card-status';

                status.dataset.status =
                    'coming-soon';

                card.appendChild(status);
            }


            /*
             * التجارب المتاحة
             */

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


            /*
             * حفظ العنصر
             */

            this.experimentItems.push({

                data: experiment,

                element: card,

                nameElement: name,

                descriptionElement:
                    descriptionText,

                statusElement: status

            });


            experiments.appendChild(
                card
            );

        });


        /*
         * زر العودة
         */

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


        /*
         * تركيب الواجهة
         */

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


        /*
         * الحالة الابتدائية
         */

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


        /*
         * العنوان
         */

        if (this.titleElement) {

            this.titleElement.textContent =
                t('waterWorld.title');
        }


        /*
         * الوصف
         */

        if (this.descriptionElement) {

            this.descriptionElement.textContent =
                t('waterWorld.description');
        }


        /*
         * التجارب
         */

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
                            'waterWorld.comingSoon'
                        );
                }

            }
        );


        /*
         * زر العودة
         */

        if (this.backButton) {

            this.backButton.textContent =
                t('waterWorld.back');
        }


        /*
         * تحديث لغة تجربة دورة الماء
         */

        if (
            this.waterCycleExperiment &&
            typeof this.waterCycleExperiment.updateLanguage === 'function'
        ) {

            this.waterCycleExperiment.updateLanguage();
        }


        /*
         * تحديث لغة تجربة التوتر السطحي
         */

        if (
            this.surfaceTensionExperiment &&
            typeof this.surfaceTensionExperiment.updateLanguage === 'function'
        ) {

            this.surfaceTensionExperiment.updateLanguage();
        }
    }


    /* =====================================================
       SHOW
       ===================================================== */

    show() {

        if (!this.container) return;


        /*
         * إظهار عالم المياه
         */

        this.container.style.visibility =
            'visible';

        this.container.style.pointerEvents =
            'auto';


        if (this.experimentsContainer) {

            this.experimentsContainer.style.display =
                'grid';

            this.experimentsContainer.style.visibility =
                'visible';

            this.experimentsContainer.style.opacity =
                '1';
        }


        this.experimentItems.forEach(
            (item) => {

                if (!item.element) return;

                item.element.style.display =
                    'flex';

                item.element.style.visibility =
                    'visible';
            }
        );


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
       SELECT EXPERIMENT
       ===================================================== */

    selectExperiment(experimentId) {

        switch (experimentId) {


            /* =================================================
               WATER CYCLE
               ================================================= */

            case 'waterCycle': {

                /*
                 * إخفاء عالم المياه
                 */

                this.hide();


                /*
                 * إنشاء التجربة عند أول تشغيل فقط
                 */

                if (!this.waterCycleExperiment) {

                    this.waterCycleExperiment =
                        new WaterCycleExperiment(
                            this.scene,
                            document.body
                        );


                    /*
                     * عند الخروج من التجربة
                     * نعود إلى عالم المياه.
                     */

                    this.waterCycleExperiment
                        .setEarthWorldUI(this);
                }


                /*
                 * عرض التجربة
                 */

                this.waterCycleExperiment.show();

                break;
            }


            /* =================================================
               SURFACE TENSION
               ================================================= */

            case 'surfaceTension': {

                /*
                 * إخفاء عالم المياه
                 */

                this.hide();


                /*
                 * إنشاء تجربة التوتر السطحي
                 * عند أول تشغيل فقط
                 */

                if (!this.surfaceTensionExperiment) {

                    this.surfaceTensionExperiment =
                        new SurfaceTensionExperiment(
                            this.scene,
                            document.body
                        );


                    /*
                     * عند الخروج من التجربة
                     * نعود إلى عالم المياه.
                     */

                    this.surfaceTensionExperiment
                        .setEarthWorldUI(this);
                }


                /*
                 * عرض التجربة
                 */

                this.surfaceTensionExperiment.show();

                break;
            }


            /* =================================================
               WATER STATES
               ================================================= */

            case 'waterStates':

                break;


            /* =================================================
               OCEAN CURRENTS
               ================================================= */

            case 'oceanCurrents':

                break;


            /* =================================================
               GROUNDWATER
               ================================================= */

            case 'groundwater':

                break;


            /* =================================================
               WATER EROSION
               ================================================= */

            case 'waterErosion':

                break;


            default:

                break;
        }
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
                    typeof this.earthWorldUI.show === 'function'
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
         * تمرير التحديث إلى تجربة دورة الماء
         */

        if (
            this.waterCycleExperiment &&
            typeof this.waterCycleExperiment.update === 'function'
        ) {

            this.waterCycleExperiment.update(
                delta
            );
        }


        /*
         * تمرير التحديث إلى تجربة التوتر السطحي
         */

        if (
            this.surfaceTensionExperiment &&
            typeof this.surfaceTensionExperiment.update === 'function'
        ) {

            this.surfaceTensionExperiment.update(
                delta
            );
        }
    }


    /* =====================================================
       SET SCENE
       ===================================================== */

    setScene(scene) {

        this.scene =
            scene;


        /*
         * تحديث المشهد داخل تجربة دورة الماء
         */

        if (
            this.waterCycleExperiment &&
            typeof this.waterCycleExperiment.setScene === 'function'
        ) {

            this.waterCycleExperiment.setScene(
                scene
            );
        }


        /*
         * تحديث المشهد داخل تجربة التوتر السطحي
         */

        if (
            this.surfaceTensionExperiment &&
            typeof this.surfaceTensionExperiment.setScene === 'function'
        ) {

            this.surfaceTensionExperiment.setScene(
                scene
            );
        }
    }


    /* =====================================================
       DESTROY
       ===================================================== */

    destroy() {

        /*
         * تدمير تجربة دورة الماء
         */

        if (
            this.waterCycleExperiment &&
            typeof this.waterCycleExperiment.destroy === 'function'
        ) {

            this.waterCycleExperiment.destroy();

            this.waterCycleExperiment =
                null;
        }


        /*
         * تدمير تجربة التوتر السطحي
         */

        if (
            this.surfaceTensionExperiment &&
            typeof this.surfaceTensionExperiment.destroy === 'function'
        ) {

            this.surfaceTensionExperiment.destroy();

            this.surfaceTensionExperiment =
                null;
        }


        /*
         * تنظيف البطاقات
         */

        this.experimentItems = [];

        this.experimentsContainer =
            null;


        /*
         * إزالة عالم المياه
         */

        if (this.container) {

            this.container.remove();

            this.container =
                null;
        }
    }
}