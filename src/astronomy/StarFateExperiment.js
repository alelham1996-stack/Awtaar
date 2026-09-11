/* =========================================================
   AWTAAR — STAR LIFE & FATE EXPERIMENT
   ========================================================= */

import * as THREE from 'three';

import './StarFate.css';

import { t, getLanguage } from '../locales/i18n.js';


export default class StarFateExperiment {

    constructor(scene = null, parent = null) {

        /*
         * =================================================
         * EXTERNAL REFERENCES
         * =================================================
         */

        this.scene =
            scene;

        this.parent =
            parent;


        /*
         * =================================================
         * EXPERIMENT REFERENCES
         * =================================================
         */

        this.experimentScene =
            null;

        this.container =
            null;

        this.canvas =
            null;

        this.renderer =
            null;

        this.camera =
            null;

        this.starGroup =
            null;

        this.starCore =
            null;

        this.starGlow =
            null;

        this.particles =
            null;


        /*
         * =================================================
         * ANIMATION
         * =================================================
         */

        this.animationFrame =
            null;

        this.lastTime =
            0;

        this.clock =
            new THREE.Clock();


        /*
         * =================================================
         * STATE
         * =================================================
         */

        this.isVisible =
            false;

        this.isRunning =
            false;

        this.currentPath =
            null;

        this.currentStage =
            0;

        this.stageProgress =
            0;

        this.stageDuration =
            4;

        this.stages =
            [];


        /*
         * =================================================
         * INITIALIZE
         * =================================================
         */

        this.createUI();

        this.createScene();

        this.updateLanguage();


        /*
         * =================================================
         * RESIZE
         * =================================================
         */

        window.addEventListener(
            'resize',
            this.handleResize
        );
    }


    /*
     * =====================================================
     * CREATE UI
     * =====================================================
     */

    createUI() {

        if (this.container) return;


        this.container =
            document.createElement('section');

        this.container.id =
            'awtaar-star-fate';

        this.container.className =
            'awtaar-star-fate';


        /*
         * =================================================
         * HEADER
         * =================================================
         */

        const header =
            document.createElement('div');

        header.className =
            'star-fate-header';


        const title =
            document.createElement('h1');

        title.className =
            'star-fate-title';

        this.titleElement =
            title;


        const description =
            document.createElement('p');

        description.className =
            'star-fate-description';

        this.descriptionElement =
            description;


        header.appendChild(
            title
        );

        header.appendChild(
            description
        );


        /*
         * =================================================
         * MAIN LAYOUT
         * =================================================
         */

        const main =
            document.createElement('div');

        main.className =
            'star-fate-main';

        this.mainElement =
            main;


        /*
         * =================================================
         * VISUAL STAGE
         * =================================================
         */

        const stage =
            document.createElement('div');

        stage.className =
            'star-fate-stage';

        this.stageElement =
            stage;


        const canvas =
            document.createElement('canvas');

        canvas.className =
            'star-fate-canvas';

        this.canvas =
            canvas;


        stage.appendChild(
            canvas
        );


        /*
         * =================================================
         * INFORMATION PANEL
         * =================================================
         */

        const info =
            document.createElement('div');

        info.className =
            'star-fate-info';

        this.infoElement =
            info;


        const stageTitle =
            document.createElement('h2');

        stageTitle.className =
            'star-fate-stage-title';

        this.stageTitleElement =
            stageTitle;


        const stageDescription =
            document.createElement('p');

        stageDescription.className =
            'star-fate-stage-description';

        this.stageDescriptionElement =
            stageDescription;


        /*
         * =================================================
         * MASS
         * =================================================
         */

        const massLabel =
            document.createElement('div');

        massLabel.className =
            'star-fate-mass-label';


        const massTitle =
            document.createElement('span');

        massTitle.className =
            'star-fate-mass-title';

        this.massTitleElement =
            massTitle;


        const massValue =
            document.createElement('span');

        massValue.className =
            'star-fate-mass-value';

        this.massValueElement =
            massValue;


        massLabel.appendChild(
            massTitle
        );

        massLabel.appendChild(
            massValue
        );


        info.appendChild(
            stageTitle
        );

        info.appendChild(
            stageDescription
        );

        info.appendChild(
            massLabel
        );


        /*
         * =================================================
         * PATH SELECTION
         * =================================================
         */

        const choice =
            document.createElement('div');

        choice.className =
            'star-fate-choice';

        this.choiceElement =
            choice;


        const choiceTitle =
            document.createElement('h3');

        choiceTitle.className =
            'star-fate-choice-title';

        this.choiceTitleElement =
            choiceTitle;


        const choiceButtons =
            document.createElement('div');

        choiceButtons.className =
            'star-fate-choice-buttons';

        this.choiceButtonsElement =
            choiceButtons;


        /*
         * =================================================
         * SUN-LIKE STAR
         * =================================================
         */

        const sunButton =
            document.createElement('button');

        sunButton.type =
            'button';

        sunButton.className =
            'star-fate-path-button';

        sunButton.dataset.path =
            'sun';


        const sunIcon =
            document.createElement('span');

        sunIcon.className =
            'star-fate-path-icon';

        sunIcon.textContent =
            '☉';


        const sunText =
            document.createElement('span');

        sunText.className =
            'star-fate-path-text';

        sunText.dataset.translationKey =
            'astronomyWorld.stellar.fate.paths.sun';


        sunButton.appendChild(
            sunIcon
        );

        sunButton.appendChild(
            sunText
        );


        sunButton.addEventListener(
            'click',
            () => {

                this.selectPath(
                    'sun'
                );
            }
        );


        /*
         * =================================================
         * MASSIVE STAR
         * =================================================
         */

        const massiveButton =
            document.createElement('button');

        massiveButton.type =
            'button';

        massiveButton.className =
            'star-fate-path-button';

        massiveButton.dataset.path =
            'massive';


        const massiveIcon =
            document.createElement('span');

        massiveIcon.className =
            'star-fate-path-icon';

        massiveIcon.textContent =
            '✦';


        const massiveText =
            document.createElement('span');

        massiveText.className =
            'star-fate-path-text';

        massiveText.dataset.translationKey =
            'astronomyWorld.stellar.fate.paths.massive';


        massiveButton.appendChild(
            massiveIcon
        );

        massiveButton.appendChild(
            massiveText
        );


        massiveButton.addEventListener(
            'click',
            () => {

                this.selectPath(
                    'massive'
                );
            }
        );


        choiceButtons.appendChild(
            sunButton
        );

        choiceButtons.appendChild(
            massiveButton
        );


        choice.appendChild(
            choiceTitle
        );

        choice.appendChild(
            choiceButtons
        );


        info.appendChild(
            choice
        );


        /*
         * =================================================
         * PROGRESS
         * =================================================
         */

        const progress =
            document.createElement('div');

        progress.className =
            'star-fate-progress';

        this.progressElement =
            progress;


        const progressBar =
            document.createElement('div');

        progressBar.className =
            'star-fate-progress-bar';

        this.progressBarElement =
            progressBar;


        progress.appendChild(
            progressBar
        );


        info.appendChild(
            progress
        );


        /*
         * =================================================
         * CONTROLS
         * =================================================
         */

        const controls =
            document.createElement('div');

        controls.className =
            'star-fate-controls';

        this.controlsElement =
            controls;


        /*
         * CONTINUE
         */

        const continueButton =
            document.createElement('button');

        continueButton.type =
            'button';

        continueButton.className =
            'star-fate-continue';

        this.continueButton =
            continueButton;


        continueButton.addEventListener(
            'click',
            () => {

                this.handleContinue();
            }
        );


        /*
         * RESET
         */

        const resetButton =
            document.createElement('button');

        resetButton.type =
            'button';

        resetButton.className =
            'star-fate-reset';

        this.resetButton =
            resetButton;


        resetButton.addEventListener(
            'click',
            () => {

                this.reset();
            }
        );


        /*
         * EXIT
         */

        const exitButton =
            document.createElement('button');

        exitButton.type =
            'button';

        exitButton.className =
            'star-fate-exit';

        this.exitButton =
            exitButton;


        exitButton.addEventListener(
            'click',
            () => {

                this.close();
            }
        );


        controls.appendChild(
            continueButton
        );

        controls.appendChild(
            resetButton
        );

        controls.appendChild(
            exitButton
        );


        info.appendChild(
            controls
        );


        /*
         * =================================================
         * BUILD MAIN
         * =================================================
         */

        main.appendChild(
            stage
        );

        main.appendChild(
            info
        );


        this.container.appendChild(
            header
        );

        this.container.appendChild(
            main
        );


        /*
         * =================================================
         * INITIAL STATE
         * =================================================
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


    /*
     * =====================================================
     * CREATE THREE.JS SCENE
     * =====================================================
     */

    createScene() {

        if (!this.canvas) return;


        /*
         * =================================================
         * DEDICATED EXPERIMENT SCENE
         * =================================================
         */

        this.experimentScene =
            new THREE.Scene();


        /*
         * =================================================
         * RENDERER
         * =================================================
         */

        this.renderer =
            new THREE.WebGLRenderer({
                canvas: this.canvas,
                antialias: true,
                alpha: true
            });


        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio || 1,
                2
            )
        );


        this.renderer.setSize(
            800,
            600,
            false
        );


        this.renderer.outputColorSpace =
            THREE.SRGBColorSpace;


        /*
         * =================================================
         * CAMERA
         * =================================================
         */

        this.camera =
            new THREE.PerspectiveCamera(
                45,
                800 / 600,
                0.1,
                100
            );


        this.camera.position.set(
            0,
            0,
            10
        );


        this.camera.lookAt(
            0,
            0,
            0
        );


        /*
         * =================================================
         * STAR GROUP
         * =================================================
         */

        this.starGroup =
            new THREE.Group();


        /*
         * =================================================
         * STAR CORE
         * =================================================
         */

        const coreGeometry =
            new THREE.SphereGeometry(
                1.25,
                64,
                64
            );


        const coreMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xffd36a
            });


        this.starCore =
            new THREE.Mesh(
                coreGeometry,
                coreMaterial
            );


        this.starGroup.add(
            this.starCore
        );


        /*
         * =================================================
         * STAR GLOW
         * =================================================
         */

        const glowGeometry =
            new THREE.SphereGeometry(
                1.65,
                48,
                48
            );


        const glowMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xffc857,
                transparent: true,
                opacity: 0.16,
                side: THREE.BackSide
            });


        this.starGlow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            );


        this.starGroup.add(
            this.starGlow
        );


        /*
         * =================================================
         * PARTICLES
         * =================================================
         */

        const particleCount =
            900;


        const particlePositions =
            new Float32Array(
                particleCount * 3
            );


        for (
            let i = 0;
            i < particleCount;
            i++
        ) {

            const radius =
                2.8 +
                Math.random() * 5.5;


            const theta =
                Math.random() *
                Math.PI *
                2;


            const phi =
                Math.acos(
                    2 * Math.random() - 1
                );


            particlePositions[
                i * 3
            ] =
                radius *
                Math.sin(phi) *
                Math.cos(theta);


            particlePositions[
                i * 3 + 1
            ] =
                radius *
                Math.sin(phi) *
                Math.sin(theta);


            particlePositions[
                i * 3 + 2
            ] =
                radius *
                Math.cos(phi);
        }


        const particleGeometry =
            new THREE.BufferGeometry();


        particleGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(
                particlePositions,
                3
            )
        );


        const particleMaterial =
            new THREE.PointsMaterial({
                color: 0xd8b56a,
                size: 0.025,
                transparent: true,
                opacity: 0.55,
                depthWrite: false
            });


        this.particles =
            new THREE.Points(
                particleGeometry,
                particleMaterial
            );


        this.starGroup.add(
            this.particles
        );


        /*
         * =================================================
         * LIGHT
         * =================================================
         */

        const ambient =
            new THREE.AmbientLight(
                0xffffff,
                1
            );


        this.starGroup.add(
            ambient
        );


        /*
         * =================================================
         * ADD STAR GROUP TO EXPERIMENT SCENE
         * =================================================
         */

        this.experimentScene.add(
            this.starGroup
        );
    }


    /*
     * =====================================================
     * SELECT PATH
     * =====================================================
     */

    selectPath(path) {

        if (
            path !== 'sun' &&
            path !== 'massive'
        ) {
            return;
        }


        this.currentPath =
            path;

        this.currentStage =
            0;

        this.stageProgress =
            0;

        this.isRunning =
            false;


        this.buildStages();


        this.updatePathButtons();

        this.updateStageUI();

        this.resetStarVisual();


        if (this.continueButton) {

            this.continueButton.disabled =
                false;
        }


        console.log(
            'Awtaar — Selected stellar path:',
            path
        );
    }


    /*
     * =====================================================
     * BUILD STAGES
     * =====================================================
     */

    buildStages() {

        if (this.currentPath === 'sun') {

            this.stages = [

                {
                    id: 'mainSequence',
                    mass: '1 M☉',
                    title:
                        'astronomyWorld.stellar.fate.stages.mainSequence.title',
                    description:
                        'astronomyWorld.stellar.fate.stages.mainSequence.description'
                },

                {
                    id: 'redGiant',
                    mass: '1 M☉',
                    title:
                        'astronomyWorld.stellar.fate.stages.redGiant.title',
                    description:
                        'astronomyWorld.stellar.fate.stages.redGiant.description'
                },

                {
                    id: 'planetaryNebula',
                    mass: '0.55 M☉',
                    title:
                        'astronomyWorld.stellar.fate.stages.planetaryNebula.title',
                    description:
                        'astronomyWorld.stellar.fate.stages.planetaryNebula.description'
                },

                {
                    id: 'whiteDwarf',
                    mass: '≈ 0.55 M☉',
                    title:
                        'astronomyWorld.stellar.fate.stages.whiteDwarf.title',
                    description:
                        'astronomyWorld.stellar.fate.stages.whiteDwarf.description'
                }

            ];

            return;
        }


        if (this.currentPath === 'massive') {

            this.stages = [

                {
                    id: 'massiveMainSequence',
                    mass: '≥ 8 M☉',
                    title:
                        'astronomyWorld.stellar.fate.stages.massiveMainSequence.title',
                    description:
                        'astronomyWorld.stellar.fate.stages.massiveMainSequence.description'
                },

                {
                    id: 'advancedFusion',
                    mass: '≥ 8 M☉',
                    title:
                        'astronomyWorld.stellar.fate.stages.advancedFusion.title',
                    description:
                        'astronomyWorld.stellar.fate.stages.advancedFusion.description'
                },

                {
                    id: 'ironCore',
                    mass: '≥ 8 M☉',
                    title:
                        'astronomyWorld.stellar.fate.stages.ironCore.title',
                    description:
                        'astronomyWorld.stellar.fate.stages.ironCore.description'
                },

                {
                    id: 'supernova',
                    mass: '≥ 8 M☉',
                    title:
                        'astronomyWorld.stellar.fate.stages.supernova.title',
                    description:
                        'astronomyWorld.stellar.fate.stages.supernova.description'
                },

                {
                    id: 'compactRemnant',
                    mass: {
                        ar: 'حسب الكتلة المتبقية',
                        en: 'Depends on the remaining mass'
                    },
                    title:
                        'astronomyWorld.stellar.fate.stages.compactRemnant.title',
                    description:
                        'astronomyWorld.stellar.fate.stages.compactRemnant.description'
                }

            ];
        }
    }


    /*
     * =====================================================
     * GET STAGE MASS
     * =====================================================
     */

    getStageMass(stage) {

        if (!stage) {
            return '—';
        }


        if (
            typeof stage.mass ===
            'string'
        ) {
            return stage.mass;
        }


        const language =
            getLanguage();


        return stage.mass[
            language
        ] ||
            stage.mass.en ||
            '—';
    }


    /*
     * =====================================================
     * HANDLE CONTINUE
     * =====================================================
     */

    handleContinue() {

        if (!this.currentPath) {
            return;
        }


        if (!this.stages.length) {
            return;
        }


        if (
            this.currentStage >=
            this.stages.length - 1
        ) {

            this.currentStage =
                0;

            this.stageProgress =
                0;

            this.resetStarVisual();

            this.updateStageUI();

            return;
        }


        this.currentStage++;

        this.stageProgress =
            0;

        this.resetStarVisual();

        this.updateStageUI();
    }


    /*
     * =====================================================
     * UPDATE STAGE UI
     * =====================================================
     */

    updateStageUI() {

        if (!this.stages.length) {

            if (this.stageTitleElement) {

                this.stageTitleElement.textContent =
                    getLanguage() === 'ar'
                        ? 'اختر مسار النجم'
                        : 'Choose a stellar path';
            }


            if (this.stageDescriptionElement) {

                this.stageDescriptionElement.textContent =
                    getLanguage() === 'ar'
                        ? 'تحدد كتلة النجم المسار الذي سيسلكه خلال حياته ونهايته.'
                        : 'A star’s mass determines the path it follows throughout its life and toward its final fate.';
            }


            if (this.massValueElement) {

                this.massValueElement.textContent =
                    '—';
            }


            if (this.continueButton) {

                this.continueButton.textContent =
                    getLanguage() === 'ar'
                        ? 'استمرار التجربة'
                        : 'Continue';
            }


            if (this.resetButton) {

                this.resetButton.textContent =
                    getLanguage() === 'ar'
                        ? 'إعادة التجربة'
                        : 'Reset';
            }


            return;
        }


        const stage =
            this.stages[
                this.currentStage
            ];


        if (!stage) return;


        if (this.stageTitleElement) {

            this.stageTitleElement.textContent =
                t(
                    stage.title
                );
        }


        if (this.stageDescriptionElement) {

            this.stageDescriptionElement.textContent =
                t(
                    stage.description
                );
        }


        if (this.massValueElement) {

            this.massValueElement.textContent =
                this.getStageMass(
                    stage
                );
        }


        this.updateProgress();


        if (this.continueButton) {

            if (
                this.currentStage >=
                this.stages.length - 1
            ) {

                this.continueButton.textContent =
                    t(
                        'astronomyWorld.stellar.fate.replay'
                    );

            } else {

                this.continueButton.textContent =
                    t(
                        'astronomyWorld.stellar.fate.continue'
                    );
            }
        }


        if (this.resetButton) {

            this.resetButton.textContent =
                t(
                    'astronomyWorld.stellar.fate.reset'
                );
        }
    }


    /*
     * =====================================================
     * UPDATE PROGRESS
     * =====================================================
     */

    updateProgress() {

        if (
            !this.progressBarElement ||
            !this.stages.length
        ) {
            return;
        }


        const total =
            this.stages.length - 1;


        const progress =
            total <= 0
                ? 100
                : (
                    this.currentStage /
                    total
                ) * 100;


        this.progressBarElement.style.width =
            `${Math.max(
                0,
                Math.min(
                    100,
                    progress
                )
            )}%`;
    }


    /*
     * =====================================================
     * UPDATE PATH BUTTONS
     * =====================================================
     */

    updatePathButtons() {

        if (!this.choiceButtonsElement) {
            return;
        }


        const buttons =
            this.choiceButtonsElement
                .querySelectorAll(
                    '.star-fate-path-button'
                );


        buttons.forEach(
            button => {

                const selected =
                    button.dataset.path ===
                    this.currentPath;


                button.classList.toggle(
                    'is-selected',
                    selected
                );
            }
        );
    }


    /*
     * =====================================================
     * RESET
     * =====================================================
     */

    reset() {

        this.currentPath =
            null;

        this.currentStage =
            0;

        this.stageProgress =
            0;

        this.stages =
            [];

        this.isRunning =
            false;


        this.updatePathButtons();

        this.resetStarVisual();

        this.updateStageUI();


        if (this.continueButton) {

            this.continueButton.disabled =
                false;
        }


        console.log(
            'Awtaar — Star Fate experiment reset'
        );
    }


    /*
     * =====================================================
     * RESET STAR VISUAL
     * =====================================================
     */

    resetStarVisual() {

        if (!this.starGroup) return;


        this.starGroup.visible =
            true;


        if (this.starCore) {

            this.starCore.scale.set(
                1,
                1,
                1
            );


            if (
                this.starCore.material
            ) {

                this.starCore.material.color.set(
                    0xffd36a
                );
            }
        }


        if (this.starGlow) {

            this.starGlow.scale.set(
                1,
                1,
                1
            );


            if (
                this.starGlow.material
            ) {

                this.starGlow.material.opacity =
                    0.16;
            }
        }


        if (this.particles) {

            this.particles.scale.set(
                1,
                1,
                1
            );

            this.particles.visible =
                true;
        }
    }


    /*
     * =====================================================
     * UPDATE STAR VISUAL
     * =====================================================
     */

    updateStarVisual(delta) {

        if (!this.starGroup) return;


        const time =
            performance.now() *
            0.001;


        /*
         * Gentle rotation
         */

        this.starGroup.rotation.y +=
            delta * 0.08;


        if (this.particles) {

            this.particles.rotation.y -=
                delta * 0.025;
        }


        /*
         * Idle breathing
         */

        if (
            this.starCore &&
            this.starGlow
        ) {

            const pulse =
                1 +
                Math.sin(
                    time * 1.5
                ) * 0.025;


            this.starCore.scale.set(
                pulse,
                pulse,
                pulse
            );


            const glowPulse =
                1 +
                Math.sin(
                    time * 1.1
                ) * 0.045;


            this.starGlow.scale.set(
                glowPulse,
                glowPulse,
                glowPulse
            );
        }


        /*
         * =================================================
         * STAGE-SPECIFIC VISUALS
         * =================================================
         */

        if (!this.stages.length) {
            return;
        }


        const stage =
            this.stages[
                this.currentStage
            ];


        if (!stage) return;


        switch (stage.id) {

            case 'mainSequence':

                this.updateMainSequenceVisual(
                    time
                );

                break;


            case 'redGiant':

                this.updateRedGiantVisual(
                    time
                );

                break;


            case 'planetaryNebula':

                this.updatePlanetaryNebulaVisual(
                    time
                );

                break;


            case 'whiteDwarf':

                this.updateWhiteDwarfVisual(
                    time
                );

                break;


            case 'massiveMainSequence':

                this.updateMassiveMainSequenceVisual(
                    time
                );

                break;


            case 'advancedFusion':

                this.updateAdvancedFusionVisual(
                    time
                );

                break;


            case 'ironCore':

                this.updateIronCoreVisual(
                    time
                );

                break;


            case 'supernova':

                this.updateSupernovaVisual(
                    time
                );

                break;


            case 'compactRemnant':

                this.updateCompactRemnantVisual(
                    time
                );

                break;
        }
    }


    /*
     * =====================================================
     * MAIN SEQUENCE
     * =====================================================
     */

    updateMainSequenceVisual(time) {

        if (!this.starCore) return;


        this.starCore.scale.set(
            1,
            1,
            1
        );


        this.starCore.material.color.set(
            0xffd36a
        );


        if (this.starGlow) {

            this.starGlow.scale.set(
                1,
                1,
                1
            );

            this.starGlow.material.opacity =
                0.16;
        }


        if (this.particles) {

            this.particles.scale.set(
                1,
                1,
                1
            );

            this.particles.visible =
                true;
        }
    }


    /*
     * =====================================================
     * RED GIANT
     * =====================================================
     */

    updateRedGiantVisual(time) {

        if (!this.starCore) return;


        const pulse =
            1.65 +
            Math.sin(
                time * 0.8
            ) * 0.06;


        this.starCore.scale.set(
            pulse,
            pulse,
            pulse
        );


        this.starCore.material.color.set(
            0xff8a42
        );


        if (this.starGlow) {

            const glow =
                1.65 +
                Math.sin(
                    time * 0.7
                ) * 0.08;


            this.starGlow.scale.set(
                glow,
                glow,
                glow
            );


            this.starGlow.material.opacity =
                0.22;
        }


        if (this.particles) {

            this.particles.visible =
                true;

            this.particles.scale.set(
                1.1,
                1.1,
                1.1
            );
        }
    }


    /*
     * =====================================================
     * PLANETARY NEBULA
     * =====================================================
     */

    updatePlanetaryNebulaVisual(time) {

        if (!this.starCore) return;


        this.starCore.scale.set(
            0.7,
            0.7,
            0.7
        );


        this.starCore.material.color.set(
            0xfff0b0
        );


        if (this.starGlow) {

            const glow =
                2.1 +
                Math.sin(
                    time * 0.8
                ) * 0.15;


            this.starGlow.scale.set(
                glow,
                glow,
                glow
            );


            this.starGlow.material.opacity =
                0.12;
        }


        if (this.particles) {

            this.particles.visible =
                true;

            const scale =
                1.15 +
                Math.sin(
                    time * 0.4
                ) * 0.05;


            this.particles.scale.set(
                scale,
                scale,
                scale
            );
        }
    }


    /*
     * =====================================================
     * WHITE DWARF
     * =====================================================
     */

    updateWhiteDwarfVisual(time) {

        if (!this.starCore) return;


        this.starCore.scale.set(
            0.48,
            0.48,
            0.48
        );


        this.starCore.material.color.set(
            0xf4f2ff
        );


        if (this.starGlow) {

            this.starGlow.scale.set(
                0.85,
                0.85,
                0.85
            );


            this.starGlow.material.opacity =
                0.08;
        }


        if (this.particles) {

            this.particles.visible =
                true;

            this.particles.scale.set(
                0.75,
                0.75,
                0.75
            );
        }
    }


    /*
     * =====================================================
     * MASSIVE MAIN SEQUENCE
     * =====================================================
     */

    updateMassiveMainSequenceVisual(time) {

        if (!this.starCore) return;


        const pulse =
            1.35 +
            Math.sin(
                time * 1.2
            ) * 0.04;


        this.starCore.scale.set(
            pulse,
            pulse,
            pulse
        );


        this.starCore.material.color.set(
            0xb8d8ff
        );


        if (this.starGlow) {

            this.starGlow.scale.set(
                1.6,
                1.6,
                1.6
            );


            this.starGlow.material.opacity =
                0.20;
        }


        if (this.particles) {

            this.particles.visible =
                true;

            this.particles.scale.set(
                1.15,
                1.15,
                1.15
            );
        }
    }


    /*
     * =====================================================
     * ADVANCED FUSION
     * =====================================================
     */

    updateAdvancedFusionVisual(time) {

        if (!this.starCore) return;


        const pulse =
            1.45 +
            Math.sin(
                time * 2.2
            ) * 0.08;


        this.starCore.scale.set(
            pulse,
            pulse,
            pulse
        );


        this.starCore.material.color.set(
            0xffb45c
        );


        if (this.starGlow) {

            this.starGlow.scale.set(
                1.8,
                1.8,
                1.8
            );


            this.starGlow.material.opacity =
                0.24;
        }


        if (this.particles) {

            this.particles.visible =
                true;

            this.particles.scale.set(
                1.25,
                1.25,
                1.25
            );
        }
    }


    /*
     * =====================================================
     * IRON CORE
     * =====================================================
     */

    updateIronCoreVisual(time) {

        if (!this.starCore) return;


        const pulse =
            1.2 +
            Math.sin(
                time * 3
            ) * 0.035;


        this.starCore.scale.set(
            pulse,
            pulse,
            pulse
        );


        this.starCore.material.color.set(
            0xc6c6c6
        );


        if (this.starGlow) {

            this.starGlow.scale.set(
                1.45,
                1.45,
                1.45
            );


            this.starGlow.material.opacity =
                0.18;
        }


        if (this.particles) {

            this.particles.visible =
                true;

            this.particles.scale.set(
                1.1,
                1.1,
                1.1
            );
        }
    }


    /*
     * =====================================================
     * SUPERNOVA
     * =====================================================
     */

    updateSupernovaVisual(time) {

        if (!this.starCore) return;


        const pulse =
            1.8 +
            Math.sin(
                time * 8
            ) * 0.25;


        this.starCore.scale.set(
            pulse,
            pulse,
            pulse
        );


        this.starCore.material.color.set(
            0xffffff
        );


        if (this.starGlow) {

            const glow =
                2.5 +
                Math.sin(
                    time * 5
                ) * 0.25;


            this.starGlow.scale.set(
                glow,
                glow,
                glow
            );


            this.starGlow.material.opacity =
                0.34;
        }


        if (this.particles) {

            this.particles.visible =
                true;

            const expansion =
                1.4 +
                (
                    Math.sin(
                        time * 0.8
                    ) + 1
                ) * 0.25;


            this.particles.scale.set(
                expansion,
                expansion,
                expansion
            );
        }
    }


    /*
     * =====================================================
     * COMPACT REMNANT
     * =====================================================
     */

    updateCompactRemnantVisual(time) {

        if (!this.starCore) return;


        this.starCore.scale.set(
            0.35,
            0.35,
            0.35
        );


        this.starCore.material.color.set(
            0xdde8ff
        );


        if (this.starGlow) {

            this.starGlow.scale.set(
                0.65,
                0.65,
                0.65
            );


            this.starGlow.material.opacity =
                0.05;
        }


        if (this.particles) {

            this.particles.visible =
                true;

            this.particles.scale.set(
                1.5,
                1.5,
                1.5
            );
        }
    }


    /*
     * =====================================================
     * RESIZE
     * =====================================================
     */

    resize() {

        if (
            !this.renderer ||
            !this.camera ||
            !this.stageElement
        ) {
            return;
        }


        const width =
            Math.max(
                1,
                this.stageElement.clientWidth
            );


        const height =
            Math.max(
                1,
                this.stageElement.clientHeight
            );


        this.camera.aspect =
            width /
            height;


        this.camera.updateProjectionMatrix();


        this.renderer.setSize(
            width,
            height,
            false
        );
    }


    /*
     * =====================================================
     * SHOW
     * =====================================================
     */

    show() {

        if (!this.container) return;


        this.isVisible =
            true;


        this.container.style.visibility =
            'visible';

        this.container.style.pointerEvents =
            'auto';


        this.updateLanguage();


        requestAnimationFrame(
            () => {

                if (!this.container) return;


                this.container.style.opacity =
                    '1';


                this.resize();


                /*
                 * Make sure the first frame is
                 * rendered immediately.
                 */

                this.update(
                    0
                );
            }
        );


        this.startAnimation();
    }


    /*
     * =====================================================
     * HIDE
     * =====================================================
     */

    hide() {

        if (!this.container) return;


        this.isVisible =
            false;


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


        this.stopAnimation();
    }


    /*
     * =====================================================
     * CLOSE
     * =====================================================
     */

    close() {

        console.log(
            'Awtaar — Closing Star Life and Fate experiment'
        );


        this.hide();


        window.setTimeout(
            () => {

                if (
                    this.parent &&
                    typeof this.parent.show ===
                    'function'
                ) {

                    this.parent.show();
                }

            },
            550
        );
    }


    /*
     * =====================================================
     * START ANIMATION
     * =====================================================
     */

    startAnimation() {

        if (this.animationFrame) return;


        this.lastTime =
            performance.now();


        const animate =
            time => {

                if (!this.container) return;


                const delta =
                    Math.min(
                        0.05,
                        (
                            time -
                            this.lastTime
                        ) / 1000
                    );


                this.lastTime =
                    time;


                if (this.isVisible) {

                    this.update(
                        delta
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
     * STOP ANIMATION
     * =====================================================
     */

    stopAnimation() {

        if (!this.animationFrame) return;


        cancelAnimationFrame(
            this.animationFrame
        );


        this.animationFrame =
            null;
    }


    /*
     * =====================================================
     * UPDATE
     * =====================================================
     */

    update(delta = 0) {

        if (
            !this.renderer ||
            !this.camera ||
            !this.experimentScene
        ) {
            return;
        }


        this.updateStarVisual(
            delta
        );


        this.renderer.render(
            this.experimentScene,
            this.camera
        );
    }


    /*
     * =====================================================
     * UPDATE LANGUAGE
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
                    'astronomyWorld.stellar.fate.title'
                );
        }


        if (this.descriptionElement) {

            this.descriptionElement.textContent =
                t(
                    'astronomyWorld.stellar.fate.description'
                );
        }


        if (this.choiceTitleElement) {

            this.choiceTitleElement.textContent =
                language === 'ar'
                    ? 'اختر كتلة النجم'
                    : 'Choose the star mass';
        }


        if (this.massTitleElement) {

            this.massTitleElement.textContent =
                language === 'ar'
                    ? 'كتلة النجم'
                    : 'Star Mass';
        }


        const translatedElements =
            this.container.querySelectorAll(
                '[data-translation-key]'
            );


        translatedElements.forEach(
            element => {

                const key =
                    element.dataset.translationKey;


                element.textContent =
                    t(key);
            }
        );


        if (this.exitButton) {

            this.exitButton.textContent =
                t(
                    'astronomyWorld.stellar.fate.exit'
                );
        }


        this.updateStageUI();
    }


    /*
     * =====================================================
     * SET SCENE
     * =====================================================
     *
     * Kept for compatibility with the rest
     * of the Awtaar architecture.
     *
     * The experiment itself renders from
     * experimentScene.
     */

    setScene(scene) {

        this.scene =
            scene;
    }


    /*
     * =====================================================
     * WINDOW RESIZE
     * =====================================================
     */

    handleResize = () => {

        if (!this.isVisible) {
            return;
        }


        this.resize();
    };


    /*
     * =====================================================
     * DESTROY
     * =====================================================
     */

    destroy() {

        this.stopAnimation();


        window.removeEventListener(
            'resize',
            this.handleResize
        );


        if (this.renderer) {

            this.renderer.dispose();

            this.renderer =
                null;
        }


        if (this.starCore) {

            if (
                this.starCore.geometry
            ) {

                this.starCore.geometry.dispose();
            }


            if (
                this.starCore.material
            ) {

                this.starCore.material.dispose();
            }
        }


        if (this.starGlow) {

            if (
                this.starGlow.geometry
            ) {

                this.starGlow.geometry.dispose();
            }


            if (
                this.starGlow.material
            ) {

                this.starGlow.material.dispose();
            }
        }


        if (this.particles) {

            if (
                this.particles.geometry
            ) {

                this.particles.geometry.dispose();
            }


            if (
                this.particles.material
            ) {

                this.particles.material.dispose();
            }
        }


        if (this.experimentScene) {

            this.experimentScene.clear();

            this.experimentScene =
                null;
        }


        if (this.container) {

            this.container.remove();

            this.container =
                null;
        }


        this.canvas =
            null;

        this.scene =
            null;

        this.parent =
            null;

        this.starGroup =
            null;

        this.starCore =
            null;

        this.starGlow =
            null;

        this.particles =
            null;

        this.stages =
            [];
    }
}