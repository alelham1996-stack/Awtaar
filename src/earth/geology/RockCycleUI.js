/* =========================================================
   AWTAAR — ROCK CYCLE UI
   ========================================================= */

import './RockCycle.css';

import { t, getLanguage } from '../../locales/i18n.js';

export default class RockCycleUI {

    constructor(geologyWorldUI, experiment) {

        this.geologyWorldUI = geologyWorldUI;
        this.experiment = experiment;

        this.container = null;

        this.titleElement = null;
        this.descriptionElement = null;

        this.stageLabelElement = null;
        this.stageNameElement = null;
        this.stageDescriptionElement = null;

        this.progressFillElement = null;

        this.pauseButton = null;
        this.resetButton = null;
        this.exitButton = null;

        this.isRunning = true;

        this.lastStageIndex = -1;

        this.isDestroyed = false;

        this.createUI();
        this.updateLanguage();
    }


    /* =====================================================
       CREATE UI
       ===================================================== */

    createUI() {

        if (this.container) return;


        this.container = document.createElement('section');

        this.container.id =
            'awtaar-rock-cycle-ui';


        /* -------------------------------------------------
           IMPORTANT:
           Keep the UI above the Three.js canvas.
        ------------------------------------------------- */

        this.container.style.position = 'fixed';
        this.container.style.inset = '0';
        this.container.style.width = '100%';
        this.container.style.height = '100%';

        this.container.style.zIndex = '100';

        this.container.style.pointerEvents = 'none';

        this.container.style.boxSizing = 'border-box';


        this.container.dir =
            getLanguage() === 'ar'
                ? 'rtl'
                : 'ltr';


        /* -------------------------------------------------
           HEADER
        ------------------------------------------------- */

        const header =
            document.createElement('div');

        header.className =
            'rock-cycle-header';

        header.style.pointerEvents =
            'none';


        const title =
            document.createElement('h1');

        title.className =
            'rock-cycle-title';

        this.titleElement = title;


        const description =
            document.createElement('p');

        description.className =
            'rock-cycle-description';

        this.descriptionElement = description;


        header.appendChild(title);
        header.appendChild(description);


        /* -------------------------------------------------
           STAGE INFORMATION
        ------------------------------------------------- */

        const stagePanel =
            document.createElement('div');

        stagePanel.className =
            'rock-cycle-stage-panel';

        stagePanel.style.pointerEvents =
            'none';


        const stageLabel =
            document.createElement('div');

        stageLabel.className =
            'rock-cycle-stage-label';

        this.stageLabelElement =
            stageLabel;


        const stageName =
            document.createElement('div');

        stageName.className =
            'rock-cycle-stage-name';

        this.stageNameElement =
            stageName;


        const stageDescription =
            document.createElement('div');

        stageDescription.className =
            'rock-cycle-stage-description';

        this.stageDescriptionElement =
            stageDescription;


        stagePanel.appendChild(stageLabel);
        stagePanel.appendChild(stageName);
        stagePanel.appendChild(stageDescription);


        /* -------------------------------------------------
           PROGRESS
        ------------------------------------------------- */

        const progress =
            document.createElement('div');

        progress.className =
            'rock-cycle-progress';

        progress.style.pointerEvents =
            'none';


        const progressFill =
            document.createElement('div');

        progressFill.className =
            'rock-cycle-progress-fill';

        this.progressFillElement =
            progressFill;


        progress.appendChild(progressFill);


        /* -------------------------------------------------
           CONTROLS
        ------------------------------------------------- */

        const controls =
            document.createElement('div');

        controls.className =
            'rock-cycle-controls';

        controls.style.pointerEvents =
            'auto';


        /* -------------------------------------------------
           PAUSE / CONTINUE
        ------------------------------------------------- */

        const pauseButton =
            document.createElement('button');

        pauseButton.type = 'button';

        pauseButton.className =
            'rock-cycle-button primary';

        this.pauseButton =
            pauseButton;


        pauseButton.addEventListener(
            'click',
            () => {

                this.togglePlayback();

            }
        );


        /* -------------------------------------------------
           RESET
        ------------------------------------------------- */

        const resetButton =
            document.createElement('button');

        resetButton.type = 'button';

        resetButton.className =
            'rock-cycle-button';

        this.resetButton =
            resetButton;


        resetButton.addEventListener(
            'click',
            () => {

                this.resetExperiment();

            }
        );


        controls.appendChild(
            pauseButton
        );

        controls.appendChild(
            resetButton
        );


        /* -------------------------------------------------
           EXIT
        ------------------------------------------------- */

        const exitButton =
            document.createElement('button');

        exitButton.type = 'button';

        exitButton.className =
            'rock-cycle-exit';

        this.exitButton =
            exitButton;

        exitButton.style.pointerEvents =
            'auto';


        exitButton.addEventListener(
            'click',
            () => {

                this.exitExperiment();

            }
        );


        /* -------------------------------------------------
           APPEND
        ------------------------------------------------- */

        this.container.appendChild(
            header
        );

        this.container.appendChild(
            stagePanel
        );

        this.container.appendChild(
            progress
        );

        this.container.appendChild(
            controls
        );

        this.container.appendChild(
            exitButton
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

        if (
            !this.container ||
            this.isDestroyed
        ) {
            return;
        }


        const language =
            getLanguage();


        this.container.dir =
            language === 'ar'
                ? 'rtl'
                : 'ltr';


        /* -------------------------------------------------
           TITLE
        ------------------------------------------------- */

        if (this.titleElement) {

            this.titleElement.textContent =
                t(
                    'geologyWorld.experiments.rockCycle.title'
                );
        }


        /* -------------------------------------------------
           DESCRIPTION
        ------------------------------------------------- */

        if (this.descriptionElement) {

            this.descriptionElement.textContent =
                t(
                    'geologyWorld.experiments.rockCycle.description'
                );
        }


        /* -------------------------------------------------
           STAGE LABEL
        ------------------------------------------------- */

        if (this.stageLabelElement) {

            this.stageLabelElement.textContent =
                language === 'ar'
                    ? 'المرحلة الحالية'
                    : 'CURRENT STAGE';
        }


        /* -------------------------------------------------
           PAUSE / CONTINUE
        ------------------------------------------------- */

        if (this.pauseButton) {

            this.pauseButton.textContent =
                this.isRunning

                    ? (
                        language === 'ar'
                            ? 'إيقاف التجربة'
                            : 'Pause Experiment'
                    )

                    : (
                        language === 'ar'
                            ? 'استمرار التجربة'
                            : 'Continue Experiment'
                    );
        }


        /* -------------------------------------------------
           RESET
        ------------------------------------------------- */

        if (this.resetButton) {

            this.resetButton.textContent =
                language === 'ar'
                    ? 'إعادة التجربة'
                    : 'Restart Experiment';
        }


        /* -------------------------------------------------
           EXIT
        ------------------------------------------------- */

        if (this.exitButton) {

            this.exitButton.textContent =
                language === 'ar'
                    ? 'العودة إلى عالم الجيولوجيا'
                    : 'Back to Geology World';
        }


        this.updateStage();
    }


    /* =====================================================
       STAGE
       ===================================================== */

    updateStage() {

        if (
            this.isDestroyed ||
            !this.experiment ||
            !this.stageNameElement ||
            !this.stageDescriptionElement
        ) {

            return;
        }


        const language =
            getLanguage();


        let stage = null;


        if (
            typeof this.experiment.getCurrentStage ===
            'function'
        ) {

            stage =
                this.experiment.getCurrentStage();
        }


        if (!stage) return;


        let stageName = '';

        let stageDescription = '';


        if (typeof stage === 'string') {

            stageName = stage;

        } else {

            if (language === 'ar') {

                stageName =
                    stage.arabic ||
                    stage.ar ||
                    stage.nameAr ||
                    stage.name ||
                    '';

                stageDescription =
                    stage.descriptionAr ||
                    stage.arabicDescription ||
                    stage.description ||
                    '';

            } else {

                stageName =
                    stage.english ||
                    stage.en ||
                    stage.nameEn ||
                    stage.name ||
                    '';

                stageDescription =
                    stage.descriptionEn ||
                    stage.englishDescription ||
                    stage.description ||
                    '';
            }
        }


        this.stageNameElement.textContent =
            stageName;


        this.stageDescriptionElement.textContent =
            stageDescription;


        /* -------------------------------------------------
           PROGRESS
        ------------------------------------------------- */

        let stageIndex = 0;

        let totalStages = 8;


        if (typeof stage === 'object') {

            if (
                Number.isFinite(stage.index)
            ) {

                stageIndex =
                    stage.index;
            }


            if (
                Number.isFinite(stage.total)
            ) {

                totalStages =
                    stage.total;
            }
        }


        if (totalStages <= 0) {

            totalStages = 8;
        }


        const progress =
            Math.max(
                0,
                Math.min(
                    100,
                    (
                        (stageIndex + 1) /
                        totalStages
                    ) * 100
                )
            );


        if (this.progressFillElement) {

            this.progressFillElement.style.width =
                `${progress}%`;
        }


        this.lastStageIndex =
            stageIndex;
    }


    /* =====================================================
       PLAYBACK
       ===================================================== */

    togglePlayback() {

        if (
            !this.experiment ||
            this.isDestroyed
        ) {
            return;
        }


        if (this.isRunning) {

            if (
                typeof this.experiment.pause ===
                'function'
            ) {

                this.experiment.pause();
            }


            this.isRunning = false;

        } else {

            if (
                typeof this.experiment.start ===
                'function'
            ) {

                this.experiment.start();
            }


            this.isRunning = true;
        }


        this.updateLanguage();
    }


    /* =====================================================
       RESET
       ===================================================== */

    resetExperiment() {

        if (
            !this.experiment ||
            this.isDestroyed
        ) {
            return;
        }


        if (
            typeof this.experiment.reset ===
            'function'
        ) {

            this.experiment.reset();
        }


        this.isRunning = true;

        this.lastStageIndex = -1;


        if (
            typeof this.experiment.start ===
            'function'
        ) {

            this.experiment.start();
        }


        this.updateLanguage();
    }


    /* =====================================================
       SHOW
       ===================================================== */

    show() {

        if (
            !this.container ||
            this.isDestroyed
        ) {
            return;
        }


        this.container.style.visibility =
            'visible';

        this.container.style.pointerEvents =
            'none';


        requestAnimationFrame(() => {

            if (
                !this.container ||
                this.isDestroyed
            ) {
                return;
            }

            this.container.style.opacity =
                '1';

        });


        if (
            this.experiment &&
            typeof this.experiment.show ===
            'function'
        ) {

            this.experiment.show();
        }


        if (
            this.experiment &&
            typeof this.experiment.start ===
            'function'
        ) {

            this.experiment.start();
        }


        this.isRunning = true;

        this.updateLanguage();


        requestAnimationFrame(() => {

            if (
                !this.container ||
                this.isDestroyed
            ) {
                return;
            }


            this.container.style.pointerEvents =
                'none';


            const controls =
                this.container.querySelector(
                    '.rock-cycle-controls'
                );

            if (controls) {

                controls.style.pointerEvents =
                    'auto';
            }


            if (this.exitButton) {

                this.exitButton.style.pointerEvents =
                    'auto';
            }
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

        this.container.style.visibility =
            'hidden';


        if (
            this.experiment &&
            typeof this.experiment.pause ===
            'function'
        ) {

            this.experiment.pause();
        }


        if (
            this.experiment &&
            typeof this.experiment.hide ===
            'function'
        ) {

            this.experiment.hide();
        }
    }


    /* =====================================================
       EXIT
       ===================================================== */

    exitExperiment() {

        if (this.isDestroyed) {
            return;
        }


        /*
         * First hide the experiment immediately.
         * This prevents any frame from remaining visible
         * while returning to Geology World.
         */
        this.hide();


        /*
         * Give the UI a moment to finish its transition,
         * then completely destroy the experiment.
         */
        window.setTimeout(() => {

            if (this.isDestroyed) {
                return;
            }


            const geologyWorld =
                this.geologyWorldUI;


            /*
             * Destroy Three.js experiment completely.
             */
            if (
                this.experiment &&
                typeof this.experiment.destroy ===
                'function'
            ) {

                this.experiment.destroy();
            }


            /*
             * Remove the UI itself.
             */
            this.destroy();


            /*
             * Clear references held by GeologyWorldUI.
             *
             * This is important because the next time
             * Rock Cycle is opened it must create a fresh
             * experiment instead of reusing a destroyed one.
             */
            if (geologyWorld) {

                if (
                    geologyWorld.rockCycleExperiment ===
                    this.experiment
                ) {

                    geologyWorld.rockCycleExperiment =
                        null;
                }


                if (
                    geologyWorld.rockCycleUI ===
                    this
                ) {

                    geologyWorld.rockCycleUI =
                        null;
                }
            }


            /*
             * Finally return to Geology World.
             */
            if (
                geologyWorld &&
                typeof geologyWorld.show ===
                'function'
            ) {

                geologyWorld.show();
            }

        }, 550);
    }


    /* =====================================================
       UPDATE
       ===================================================== */

    update(delta) {

        if (
            !this.container ||
            this.isDestroyed
        ) {
            return;
        }


        if (
            this.container.style.visibility ===
            'hidden'
        ) {

            return;
        }


        this.updateStage();
    }


    /* =====================================================
       SCENE
       ===================================================== */

    setScene(scene) {

        if (
            this.experiment &&
            typeof this.experiment.setScene ===
            'function'
        ) {

            this.experiment.setScene(scene);
        }
    }


    /* =====================================================
       DESTROY
       ===================================================== */

    destroy() {

        if (this.isDestroyed) {
            return;
        }


        this.isDestroyed = true;


        /*
         * Stop experiment logic.
         */
        if (
            this.experiment &&
            typeof this.experiment.pause ===
            'function'
        ) {

            this.experiment.pause();
        }


        /*
         * Destroy Three.js completely.
         *
         * This removes:
         * - animation loop
         * - renderer
         * - canvas
         * - scene objects
         * - geometries
         * - materials
         */
        if (
            this.experiment &&
            typeof this.experiment.destroy ===
            'function'
        ) {

            this.experiment.destroy();
        }


        /*
         * Remove the UI from the DOM.
         */
        if (this.container) {

            this.container.remove();

            this.container =
                null;
        }


        this.titleElement = null;
        this.descriptionElement = null;

        this.stageLabelElement = null;
        this.stageNameElement = null;
        this.stageDescriptionElement = null;

        this.progressFillElement = null;

        this.pauseButton = null;
        this.resetButton = null;
        this.exitButton = null;


        this.experiment = null;
        this.geologyWorldUI = null;
    }
}