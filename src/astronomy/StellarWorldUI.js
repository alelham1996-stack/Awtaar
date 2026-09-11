/* =========================================================
   AWTAAR — STELLAR WORLD UI
   ========================================================= */

import './stellar-world.css';

import { t, getLanguage } from '../locales/i18n.js';

import StarBirthExperiment
    from './StarBirthExperiment.js';

import StarFateExperiment
    from './StarFateExperiment.js';


export default class StellarWorldUI {

    constructor(astronomyWorldUI, scene = null) {

        this.astronomyWorldUI =
            astronomyWorldUI;

        this.scene =
            scene;

        this.container =
            null;

        this.starBirthExperiment =
            null;

        this.starFateExperiment =
            null;

        this.starLayers = [];

        this.animationFrame =
            null;

        this.lastTime =
            0;

        this.createUI();
        this.updateLanguage();
    }


    createUI() {

        if (this.container) return;

        this.container =
            document.createElement('section');

        this.container.id =
            'awtaar-stellar-world';

        this.container.className =
            'awtaar-stellar-world';


        this.createStarField();


        const atmosphere =
            document.createElement('div');

        atmosphere.className =
            'stellar-atmosphere';

        this.container.appendChild(
            atmosphere
        );


        const content =
            document.createElement('div');

        content.className =
            'stellar-content';

        this.contentElement =
            content;


        const header =
            document.createElement('div');

        header.className =
            'stellar-header';


        const title =
            document.createElement('h2');

        title.className =
            'awtaar-stellar-world-title';

        this.titleElement =
            title;


        const description =
            document.createElement('p');

        description.className =
            'awtaar-stellar-world-description';

        this.descriptionElement =
            description;


        header.appendChild(title);
        header.appendChild(description);


        const experiments =
            document.createElement('div');

        experiments.className =
            'awtaar-stellar-experiments';

        this.experimentsContainer =
            experiments;


        /*
         * =====================================================
         * STAR BIRTH CARD
         * =====================================================
         */

        const birthButton =
            this.createExperimentCard(
                'birth',
                '✦',
                'astronomyWorld.stellar.birth.cardTitle'
            );


        birthButton.addEventListener(
            'click',
            () => {

                console.log(
                    'Awtaar — Opening Star Birth experiment'
                );

                this.openStarBirthExperiment();
            }
        );


        /*
         * =====================================================
         * STAR LIFE & FATE CARD
         * =====================================================
         */

        const fateButton =
            this.createExperimentCard(
                'fate',
                '☼',
                'astronomyWorld.stellar.fate.cardTitle'
            );


        fateButton.addEventListener(
            'click',
            () => {

                console.log(
                    'Awtaar — Opening Star Life and Fate experiment'
                );

                this.openStarFateExperiment();
            }
        );


        experiments.appendChild(
            birthButton
        );

        experiments.appendChild(
            fateButton
        );


        /*
         * =====================================================
         * BACK BUTTON
         * =====================================================
         */

        const backButton =
            document.createElement('button');

        backButton.type =
            'button';

        backButton.className =
            'awtaar-stellar-world-back';

        this.backButton =
            backButton;


        backButton.addEventListener(
            'click',
            () => {

                this.returnToAstronomy();
            }
        );


        content.appendChild(header);

        content.appendChild(
            experiments
        );

        content.appendChild(
            backButton
        );


        this.container.appendChild(
            content
        );


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


    createStarField() {

        const starField =
            document.createElement('div');

        starField.className =
            'stellar-star-field';


        const layers = [

            {
                className:
                    'stellar-stars stellar-stars-back',

                count:
                    55
            },

            {
                className:
                    'stellar-stars stellar-stars-mid',

                count:
                    35
            },

            {
                className:
                    'stellar-stars stellar-stars-front',

                count:
                    20
            }
        ];


        layers.forEach(
            layerData => {

                const layer =
                    document.createElement('div');

                layer.className =
                    layerData.className;


                for (
                    let i = 0;
                    i < layerData.count;
                    i++
                ) {

                    const star =
                        document.createElement('span');

                    star.className =
                        'stellar-star';


                    const size =
                        1 +
                        Math.random() * 2.2;

                    const left =
                        Math.random() * 100;

                    const top =
                        Math.random() * 100;

                    const opacity =
                        0.25 +
                        Math.random() * 0.65;

                    const duration =
                        8 +
                        Math.random() * 14;

                    const delay =
                        Math.random() * -18;


                    star.style.width =
                        `${size}px`;

                    star.style.height =
                        `${size}px`;

                    star.style.left =
                        `${left}%`;

                    star.style.top =
                        `${top}%`;

                    star.style.opacity =
                        opacity;

                    star.style.animationDuration =
                        `${duration}s`;

                    star.style.animationDelay =
                        `${delay}s`;


                    layer.appendChild(
                        star
                    );
                }


                starField.appendChild(
                    layer
                );

                this.starLayers.push(
                    layer
                );
            }
        );


        /*
         * =====================================================
         * DISTANT STARS
         * =====================================================
         */

        const distantStars =
            document.createElement('div');

        distantStars.className =
            'stellar-distant-stars';


        for (
            let i = 0;
            i < 8;
            i++
        ) {

            const star =
                document.createElement('span');

            star.className =
                'stellar-distant-star';


            star.style.left =
                `${8 + Math.random() * 84}%`;

            star.style.top =
                `${8 + Math.random() * 82}%`;

            star.style.animationDelay =
                `${Math.random() * -6}s`;

            star.style.animationDuration =
                `${4 + Math.random() * 5}s`;


            distantStars.appendChild(
                star
            );
        }


        starField.appendChild(
            distantStars
        );

        this.container.appendChild(
            starField
        );
    }


    createExperimentCard(
        id,
        symbol,
        translationKey
    ) {

        const button =
            document.createElement('button');

        button.type =
            'button';

        button.className =
            'awtaar-stellar-experiment';

        button.dataset.experiment =
            id;


        const icon =
            document.createElement('span');

        icon.className =
            'stellar-experiment-icon';

        icon.textContent =
            symbol;


        const content =
            document.createElement('span');

        content.className =
            'stellar-experiment-content';


        const name =
            document.createElement('span');

        name.className =
            'stellar-experiment-name';

        name.dataset.translationKey =
            translationKey;


        const line =
            document.createElement('span');

        line.className =
            'stellar-experiment-line';


        content.appendChild(
            name
        );

        content.appendChild(
            line
        );


        const arrow =
            document.createElement('span');

        arrow.className =
            'stellar-experiment-arrow';

        arrow.textContent =
            '↗';


        button.appendChild(
            icon
        );

        button.appendChild(
            content
        );

        button.appendChild(
            arrow
        );


        return button;
    }


    /*
     * =====================================================
     * OPEN STAR BIRTH
     * =====================================================
     */

    openStarBirthExperiment() {

        console.log(
            'Awtaar — Opening Star Birth experiment'
        );


        this.hide();


        window.setTimeout(
            () => {

                if (!this.starBirthExperiment) {

                    this.starBirthExperiment =
                        new StarBirthExperiment(
                            this.scene,
                            this
                        );
                }


                if (
                    this.starBirthExperiment &&
                    typeof this.starBirthExperiment.show ===
                    'function'
                ) {

                    this.starBirthExperiment.show();
                }

            },
            550
        );
    }


    /*
     * =====================================================
     * RETURN FROM STAR BIRTH
     * =====================================================
     */

    returnToStellarWorld() {

        console.log(
            'Awtaar — Returning to Stellar World'
        );


        if (
            this.starBirthExperiment &&
            typeof this.starBirthExperiment.hide ===
            'function'
        ) {

            this.starBirthExperiment.hide();
        }


        if (
            this.starFateExperiment &&
            typeof this.starFateExperiment.hide ===
            'function'
        ) {

            this.starFateExperiment.hide();
        }


        window.setTimeout(
            () => {

                this.show();

            },
            550
        );
    }


    /*
     * =====================================================
     * OPEN STAR LIFE & FATE
     * =====================================================
     */

    openStarFateExperiment() {

        console.log(
            'Awtaar — Opening Star Life and Fate experiment'
        );


        this.hide();


        window.setTimeout(
            () => {

                if (!this.starFateExperiment) {

                    this.starFateExperiment =
                        new StarFateExperiment(
                            this.scene,
                            this
                        );
                }


                if (
                    this.starFateExperiment &&
                    typeof this.starFateExperiment.show ===
                    'function'
                ) {

                    this.starFateExperiment.show();
                }

            },
            550
        );
    }


    /*
     * =====================================================
     * LANGUAGE
     * =====================================================
     */

    updateLanguage() {

        if (!this.container) return;


        const language =
            getLanguage();


        this.container.dir =
            language === 'ar'
                ? 'rtl'
                : 'ltr';


        if (this.titleElement) {

            this.titleElement.textContent =
                t(
                    'astronomyWorld.stellar.title'
                );
        }


        if (this.descriptionElement) {

            this.descriptionElement.textContent =
                t(
                    'astronomyWorld.stellar.description'
                );
        }


        const names =
            this.container.querySelectorAll(
                '[data-translation-key]'
            );


        names.forEach(
            element => {

                const key =
                    element.dataset.translationKey;

                element.textContent =
                    t(key);
            }
        );


        if (this.backButton) {

            this.backButton.textContent =
                t(
                    'astronomyWorld.back'
                );
        }


        /*
         * تحديث لغة تجربة ميلاد النجم
         */

        if (
            this.starBirthExperiment &&
            typeof this.starBirthExperiment.updateLanguage ===
            'function'
        ) {

            this.starBirthExperiment.updateLanguage();
        }


        /*
         * تحديث لغة تجربة حياة النجم ومصيره
         */

        if (
            this.starFateExperiment &&
            typeof this.starFateExperiment.updateLanguage ===
            'function'
        ) {

            this.starFateExperiment.updateLanguage();
        }
    }


    /*
     * =====================================================
     * SHOW
     * =====================================================
     */

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


        this.updateLanguage();

        this.startAtmosphereAnimation();
    }


    /*
     * =====================================================
     * HIDE
     * =====================================================
     */

    hide() {

        if (!this.container) return;


        this.container.style.opacity =
            '0';

        this.container.style.pointerEvents =
            'none';


        this.stopAtmosphereAnimation();


        window.setTimeout(
            () => {

                if (!this.container) return;

                this.container.style.visibility =
                    'hidden';

            },
            550
        );
    }


    /*
     * =====================================================
     * ATMOSPHERE ANIMATION
     * =====================================================
     */

    startAtmosphereAnimation() {

        if (this.animationFrame) return;


        this.lastTime =
            performance.now();


        const animate =
            time => {

                if (!this.container) return;


                const delta =
                    (time - this.lastTime) /
                    1000;


                this.lastTime =
                    time;


                if (
                    this.container.style.visibility !==
                    'hidden'
                ) {

                    const drift =
                        Math.sin(
                            time * 0.00008
                        ) * 8;


                    this.container.style
                        .setProperty(
                            '--stellar-drift',
                            `${drift}px`
                        );
                }


                this.animationFrame =
                    requestAnimationFrame(
                        animate
                    );
            };


        this.animationFrame =
            requestAnimationFrame(
                animate
            );
    }


    /*
     * =====================================================
     * STOP ATMOSPHERE ANIMATION
     * =====================================================
     */

    stopAtmosphereAnimation() {

        if (!this.animationFrame) return;


        cancelAnimationFrame(
            this.animationFrame
        );

        this.animationFrame =
            null;
    }


    /*
     * =====================================================
     * RETURN TO ASTRONOMY WORLD
     * =====================================================
     */

    returnToAstronomy() {

        this.hide();


        window.setTimeout(
            () => {

                if (
                    this.astronomyWorldUI &&
                    typeof this.astronomyWorldUI.show ===
                    'function'
                ) {

                    this.astronomyWorldUI.show();
                }

            },
            550
        );
    }


    /*
     * =====================================================
     * UPDATE
     * =====================================================
     */

    update(delta = 0) {

        /*
         * Reserved for future stellar experiments.
         */
    }


    /*
     * =====================================================
     * SET SCENE
     * =====================================================
     */

    setScene(scene) {

        this.scene =
            scene;


        if (
            this.starBirthExperiment &&
            typeof this.starBirthExperiment.setScene ===
            'function'
        ) {

            this.starBirthExperiment.setScene(
                scene
            );
        }


        if (
            this.starFateExperiment &&
            typeof this.starFateExperiment.setScene ===
            'function'
        ) {

            this.starFateExperiment.setScene(
                scene
            );
        }
    }


    /*
     * =====================================================
     * DESTROY
     * =====================================================
     */

    destroy() {

        this.stopAtmosphereAnimation();


        /*
         * STAR BIRTH
         */

        if (this.starBirthExperiment) {

            if (
                typeof this.starBirthExperiment.destroy ===
                'function'
            ) {

                this.starBirthExperiment.destroy();
            }


            this.starBirthExperiment =
                null;
        }


        /*
         * STAR FATE
         */

        if (this.starFateExperiment) {

            if (
                typeof this.starFateExperiment.destroy ===
                'function'
            ) {

                this.starFateExperiment.destroy();
            }


            this.starFateExperiment =
                null;
        }


        if (this.container) {

            this.container.remove();

            this.container =
                null;
        }


        this.starLayers =
            [];

        this.astronomyWorldUI =
            null;

        this.scene =
            null;
    }
}