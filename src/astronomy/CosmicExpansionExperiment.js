/* =========================================================
   AWTAAR — COSMIC EXPANSION EXPERIMENT
   ========================================================= */

import * as THREE from 'three';

import './cosmic-expansion.css';

import { t, getLanguage } from '../locales/i18n.js';


export default class CosmicExpansionExperiment {

    constructor(scene = null, parent = null) {

        this.scene = scene;
        this.parent = parent;

        this.container = null;

        this.canvasContainer = null;

        this.infoElement = null;

        this.statusElement = null;

        this.valueElement = null;

        this.slider = null;

        this.continueButton = null;

        this.resetButton = null;

        this.exitButton = null;


        /* =================================================
           STATE
           ================================================= */

        this.expansionProgress = 0;

        this.targetExpansion = 0;

        this.expansionSpeed = 0.35;

        this.isRunning = true;


        /* =================================================
           THREE
           ================================================= */

        this.experimentScene = null;

        this.camera = null;

        this.renderer = null;

        this.galaxies = [];

        this.galaxyGroup = null;

        this.grid = null;

        this.starField = null;

        this.dustField = null;

        this.animationId = null;

        this.lastTime = 0;


        /* =================================================
           RESIZE
           ================================================= */

        this.handleResize =
            this.handleResize.bind(this);


        /* =================================================
           CREATE
           ================================================= */

        this.createUI();

        this.createThreeScene();

        this.updateLanguage();

        this.reset();

        window.addEventListener(
            'resize',
            this.handleResize
        );

    }


    /* =====================================================
       CREATE UI
       ===================================================== */

    createUI() {

        if (this.container) return;


        this.container =
            document.createElement('section');

        this.container.id =
            'awtaar-cosmic-expansion';


        /* =================================================
           HEADER
           ================================================= */

        const header =
            document.createElement('div');

        header.className =
            'cosmic-expansion-header';


        const title =
            document.createElement('h2');

        title.className =
            'cosmic-expansion-title';

        this.titleElement =
            title;


        const description =
            document.createElement('p');

        description.className =
            'cosmic-expansion-description';

        this.descriptionElement =
            description;


        const exitButton =
            document.createElement('button');

        exitButton.type = 'button';

        exitButton.className =
            'cosmic-expansion-exit';

        this.exitButton =
            exitButton;


        exitButton.addEventListener(
            'click',
            () => {

                this.close();

            }
        );


        header.appendChild(title);

        header.appendChild(description);

        header.appendChild(exitButton);


        /* =================================================
           MAIN
           ================================================= */

        const main =
            document.createElement('div');

        main.className =
            'cosmic-expansion-main';


        /* =================================================
           VISUAL
           ================================================= */

        const visual =
            document.createElement('div');

        visual.className =
            'cosmic-expansion-visual';

        this.canvasContainer =
            visual;


        /* =================================================
           INFORMATION
           ================================================= */

        const information =
            document.createElement('div');

        information.className =
            'cosmic-expansion-information';


        const status =
            document.createElement('div');

        status.className =
            'cosmic-expansion-status';

        this.statusElement =
            status;


        const info =
            document.createElement('p');

        info.className =
            'cosmic-expansion-info';

        this.infoElement =
            info;


        const value =
            document.createElement('div');

        value.className =
            'cosmic-expansion-value';

        this.valueElement =
            value;


        information.appendChild(status);

        information.appendChild(info);

        information.appendChild(value);


        main.appendChild(visual);

        main.appendChild(information);


        /* =================================================
           CONTROLS
           ================================================= */

        const controls =
            document.createElement('div');

        controls.className =
            'cosmic-expansion-controls';


        /* ---------------------------------------------
           SLIDER
           --------------------------------------------- */

        const sliderWrapper =
            document.createElement('div');

        sliderWrapper.className =
            'cosmic-expansion-slider-wrapper';


        const slider =
            document.createElement('input');

        slider.type = 'range';

        slider.min = '0';

        slider.max = '1';

        slider.step = '0.001';

        slider.value = '0';

        slider.className =
            'cosmic-expansion-slider';

        this.slider =
            slider;


        slider.addEventListener(
            'input',
            () => {

                this.targetExpansion =
                    Number(slider.value);

                this.expansionProgress =
                    this.targetExpansion;

                this.updateUniverseVisuals();

            }
        );


        sliderWrapper.appendChild(
            slider
        );


        /* ---------------------------------------------
           BUTTONS
           --------------------------------------------- */

        const buttons =
            document.createElement('div');

        buttons.className =
            'cosmic-expansion-buttons';


        const continueButton =
            document.createElement('button');

        continueButton.type = 'button';

        continueButton.className =
            'cosmic-expansion-button cosmic-expansion-continue';

        this.continueButton =
            continueButton;


        continueButton.addEventListener(
            'click',
            () => {

                this.toggleRunning();

            }
        );


        const resetButton =
            document.createElement('button');

        resetButton.type = 'button';

        resetButton.className =
            'cosmic-expansion-button cosmic-expansion-reset';

        this.resetButton =
            resetButton;


        resetButton.addEventListener(
            'click',
            () => {

                this.reset();

            }
        );


        buttons.appendChild(
            continueButton
        );

        buttons.appendChild(
            resetButton
        );


        controls.appendChild(
            sliderWrapper
        );

        controls.appendChild(
            buttons
        );


        /* =================================================
           APPEND
           ================================================= */

        this.container.appendChild(
            header
        );

        this.container.appendChild(
            main
        );

        this.container.appendChild(
            controls
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
       THREE SCENE
       ===================================================== */

    createThreeScene() {

        this.experimentScene =
            new THREE.Scene();


        this.experimentScene.background =
            new THREE.Color(
                0x050510
            );


        /* =================================================
           CAMERA
           ================================================= */

        this.camera =
            new THREE.PerspectiveCamera(
                45,
                1,
                0.1,
                200
            );


        this.camera.position.set(
            0,
            0,
            18
        );


        this.camera.lookAt(
            0,
            0,
            0
        );


        /* =================================================
           RENDERER
           ================================================= */

        this.renderer =
            new THREE.WebGLRenderer({
                antialias: true,
                alpha: true
            });


        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        );


        this.renderer.setSize(
            100,
            100
        );


        this.renderer.outputColorSpace =
            THREE.SRGBColorSpace;


        this.renderer.domElement.className =
            'cosmic-expansion-canvas';


        this.canvasContainer.appendChild(
            this.renderer.domElement
        );


        /* =================================================
           GALAXY GROUP
           ================================================= */

        this.galaxyGroup =
            new THREE.Group();


        this.experimentScene.add(
            this.galaxyGroup
        );


        /* =================================================
           CREATE GALAXIES
           ================================================= */

        this.createGalaxies();


        /* =================================================
           STAR FIELD
           ================================================= */

        this.createStarField();


        /* =================================================
           COSMIC DUST
           ================================================= */

        this.createDustField();


        /* =================================================
           SPACE GRID
           ================================================= */

        this.createGrid();


        this.handleResize();

        this.startAnimation();

    }


    /* =====================================================
       CREATE GALAXIES
       ===================================================== */

    createGalaxies() {

        const galaxyCount = 38;


        for (
            let i = 0;
            i < galaxyCount;
            i++
        ) {

            const angle =
                (i / galaxyCount) *
                Math.PI *
                2;


            /*
             * Final distance.

             * These are deliberately spread over a wide
             * volume so the universe eventually fills the
             * visual area.
             */

            const radius =
                2.0 +
                Math.random() * 6.5;


            const y =
                (Math.random() - 0.5) *
                7;


            const x =
                Math.cos(angle) *
                radius;


            const z =
                Math.sin(angle) *
                radius;


            const group =
                new THREE.Group();


            /*
             * IMPORTANT:
             *
             * The galaxy starts extremely close to the
             * center. Its final position is stored separately.
             */

            group.position.set(
                0,
                0,
                0
            );


            /* -----------------------------------------
               CORE
               ----------------------------------------- */

            const coreGeometry =
                new THREE.SphereGeometry(
                    0.075,
                    8,
                    8
                );


            const coreMaterial =
                new THREE.MeshBasicMaterial({
                    color: 0xf0d48a
                });


            const core =
                new THREE.Mesh(
                    coreGeometry,
                    coreMaterial
                );


            group.add(core);


            /* -----------------------------------------
               GALAXY DISC
               ----------------------------------------- */

            const points = [];


            const arms = 2;

            const particles = 70;


            for (
                let j = 0;
                j < particles;
                j++
            ) {

                const particleRadius =
                    Math.random() *
                    0.38;


                const arm =
                    j % arms;


                const theta =
                    particleRadius * 9 +
                    arm * Math.PI +
                    Math.random() * 0.8;


                points.push(
                    new THREE.Vector3(
                        Math.cos(theta) *
                            particleRadius,

                        (Math.random() - 0.5) *
                            0.025,

                        Math.sin(theta) *
                            particleRadius
                    )
                );

            }


            const geometry =
                new THREE.BufferGeometry()
                    .setFromPoints(points);


            const material =
                new THREE.PointsMaterial({
                    color: 0xe8d9b4,
                    size: 0.025,
                    transparent: true,
                    opacity: 0.72,
                    depthWrite: false
                });


            const disc =
                new THREE.Points(
                    geometry,
                    material
                );


            group.add(disc);


            /* -----------------------------------------
               ROTATION
               ----------------------------------------- */

            group.rotation.x =
                Math.random() *
                Math.PI;


            group.rotation.y =
                Math.random() *
                Math.PI;


            this.galaxyGroup.add(
                group
            );


            this.galaxies.push({

                object: group,

                /*
                 * Final position in the expanding universe.
                 */

                finalPosition:
                    new THREE.Vector3(
                        x,
                        y,
                        z
                    ),

                rotationSpeed:
                    0.05 +
                    Math.random() * 0.1

            });

        }

    }


    /* =====================================================
       STAR FIELD
       ===================================================== */

    createStarField() {

        const positions = [];

        const count = 1100;


        for (
            let i = 0;
            i < count;
            i++
        ) {

            /*
             * Store stars in their final expanded
             * positions.

             * They will begin compressed near the
             * center and spread outward.
             */

            positions.push(
                (Math.random() - 0.5) *
                    28,

                (Math.random() - 0.5) *
                    20,

                (Math.random() - 0.5) *
                    28
            );

        }


        const geometry =
            new THREE.BufferGeometry();


        geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(
                positions,
                3
            )
        );


        const material =
            new THREE.PointsMaterial({
                color: 0xffffff,
                size: 0.028,
                transparent: true,
                opacity: 0.65,
                depthWrite: false
            });


        this.starField =
            new THREE.Points(
                geometry,
                material
            );


        /*
         * Begin almost invisible and concentrated.
         */

        this.starField.scale.set(
            0.025,
            0.025,
            0.025
        );


        this.experimentScene.add(
            this.starField
        );

    }


    /* =====================================================
       COSMIC DUST
       ===================================================== */

    createDustField() {

        const positions = [];

        const count = 650;


        for (
            let i = 0;
            i < count;
            i++
        ) {

            /*
             * Dust occupies a slightly smaller volume
             * than the stars, creating depth.
             */

            positions.push(
                (Math.random() - 0.5) *
                    22,

                (Math.random() - 0.5) *
                    16,

                (Math.random() - 0.5) *
                    22
            );

        }


        const geometry =
            new THREE.BufferGeometry();


        geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(
                positions,
                3
            )
        );


        const material =
            new THREE.PointsMaterial({
                color: 0xbca878,
                size: 0.018,
                transparent: true,
                opacity: 0.28,
                depthWrite: false,
                blending:
                    THREE.AdditiveBlending
            });


        this.dustField =
            new THREE.Points(
                geometry,
                material
            );


        /*
         * Dust starts almost completely concentrated
         * at the beginning.
         */

        this.dustField.scale.set(
            0.02,
            0.02,
            0.02
        );


        this.experimentScene.add(
            this.dustField
        );

    }


    /* =====================================================
       GRID
       ===================================================== */

    createGrid() {

        const size = 16;

        const divisions = 16;


        const geometry =
            new THREE.BufferGeometry();


        const positions = [];


        for (
            let i = 0;
            i <= divisions;
            i++
        ) {

            const p =
                -size / 2 +
                (size / divisions) *
                i;


            positions.push(
                -size / 2,
                0,
                p,

                size / 2,
                0,
                p
            );


            positions.push(
                p,
                0,
                -size / 2,

                p,
                0,
                size / 2
            );

        }


        geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(
                positions,
                3
            )
        );


        const material =
            new THREE.LineBasicMaterial({
                color: 0x8f7840,
                transparent: true,
                opacity: 0.12
            });


        this.grid =
            new THREE.LineSegments(
                geometry,
                material
            );


        this.grid.rotation.x =
            Math.PI * 0.5;


        this.grid.position.y =
            -3.2;


        this.experimentScene.add(
            this.grid
        );

    }


    /* =====================================================
       ANIMATION
       ===================================================== */

    startAnimation() {

        if (this.animationId) return;


        this.lastTime =
            performance.now();


        const animate =
            (time) => {

                this.animationId =
                    requestAnimationFrame(
                        animate
                    );


                const delta =
                    Math.min(
                        (time -
                            this.lastTime) /
                            1000,
                        0.05
                    );


                this.lastTime =
                    time;


                this.update(delta);

                this.renderer.render(
                    this.experimentScene,
                    this.camera
                );

            };


        this.animationId =
            requestAnimationFrame(
                animate
            );

    }


    /* =====================================================
       UPDATE
       ===================================================== */

    update(delta) {

        if (!this.experimentScene) return;


        /* ---------------------------------------------
           EXPANSION
           --------------------------------------------- */

        if (this.isRunning) {

            const difference =
                this.targetExpansion -
                this.expansionProgress;


            this.expansionProgress +=
                difference *
                Math.min(
                    delta * 3,
                    1
                );


            this.targetExpansion +=
                this.expansionSpeed *
                delta *
                0.035;


            if (
                this.targetExpansion > 1
            ) {

                this.targetExpansion =
                    1;

            }

        }


        this.updateUniverseVisuals(
            delta
        );


        /* ---------------------------------------------
           STAR FIELD
           --------------------------------------------- */

        if (this.starField) {

            this.starField.rotation.y +=
                delta *
                0.008;

        }


        /* ---------------------------------------------
           DUST
           --------------------------------------------- */

        if (this.dustField) {

            this.dustField.rotation.y -=
                delta *
                0.004;

            this.dustField.rotation.x +=
                delta *
                0.0015;

        }


        /* ---------------------------------------------
           GALAXIES ROTATION
           --------------------------------------------- */

        this.galaxies.forEach(
            (galaxy) => {

                galaxy.object.rotation.y +=
                    galaxy.rotationSpeed *
                    delta;

            }
        );


        /* ---------------------------------------------
           INFO
           --------------------------------------------- */

        this.updateValue();

    }


    /* =====================================================
       UNIVERSE VISUALS
       ===================================================== */

    updateUniverseVisuals() {

        const expansion =
            THREE.MathUtils.clamp(
                this.expansionProgress,
                0,
                1
            );


        /*
         * Smooth easing.

         * This gives the early universe a compact state,
         * followed by a gradual and elegant expansion.
         */

        const easedExpansion =
            expansion *
            expansion *
            (
                3 -
                2 * expansion
            );


        /* =================================================
           GALAXIES
           ================================================= */

        this.galaxies.forEach(
            (galaxy) => {

                /*
                 * At the beginning:
                 *
                 * 0.03 = almost everything at the center.
                 *
                 * At the end:
                 *
                 * 1.0 = final cosmic position.
                 */

                const distanceFactor =
                    THREE.MathUtils.lerp(
                        0.025,
                        1,
                        easedExpansion
                    );


                galaxy.object.position.copy(
                    galaxy.finalPosition
                );


                galaxy.object.position.multiplyScalar(
                    distanceFactor
                );


                /*
                 * Galaxies also become visually clearer
                 * as the universe expands.
                 */

                const galaxyScale =
                    THREE.MathUtils.lerp(
                        0.18,
                        1,
                        easedExpansion
                    );


                galaxy.object.scale.set(
                    galaxyScale,
                    galaxyScale,
                    galaxyScale
                );

            }
        );


        /* =================================================
           STARS
           ================================================= */

        if (this.starField) {

            const starScale =
                THREE.MathUtils.lerp(
                    0.025,
                    1,
                    easedExpansion
                );


            this.starField.scale.set(
                starScale,
                starScale,
                starScale
            );


            this.starField.material.opacity =
                THREE.MathUtils.lerp(
                    0.12,
                    0.65,
                    easedExpansion
                );

        }


        /* =================================================
           COSMIC DUST
           ================================================= */

        if (this.dustField) {

            const dustScale =
                THREE.MathUtils.lerp(
                    0.02,
                    1,
                    easedExpansion
                );


            this.dustField.scale.set(
                dustScale,
                dustScale,
                dustScale
            );


            this.dustField.material.opacity =
                THREE.MathUtils.lerp(
                    0.06,
                    0.28,
                    easedExpansion
                );

        }


        /* =================================================
           GRID
           ================================================= */

        if (this.grid) {

            const gridScale =
                THREE.MathUtils.lerp(
                    0.12,
                    1,
                    easedExpansion
                );


            this.grid.scale.set(
                gridScale,
                gridScale,
                gridScale
            );


            this.grid.material.opacity =
                THREE.MathUtils.lerp(
                    0.02,
                    0.12,
                    easedExpansion
                );

        }


        /*
         * Subtle global movement.
         * This is intentionally very slow so that the
         * expansion remains the visual focus.
         */

        if (this.galaxyGroup) {

            this.galaxyGroup.rotation.y +=
                0.0005;

        }


        this.updateValue();

    }


    /* =====================================================
       VALUE
       ===================================================== */

    updateValue() {

        if (!this.valueElement) return;


        const percentage =
            Math.round(
                this.expansionProgress *
                100
            );


        this.valueElement.textContent =
            `${percentage}%`;

    }


    /* =====================================================
       RUN / PAUSE
       ===================================================== */

    toggleRunning() {

        this.isRunning =
            !this.isRunning;


        this.updateLanguage();

    }


    /* =====================================================
       RESET
       ===================================================== */

    reset() {

        this.expansionProgress =
            0;

        this.targetExpansion =
            0;

        this.isRunning =
            true;


        if (this.slider) {

            this.slider.value =
                '0';

        }


        /*
         * Return galaxies to the very beginning:
         * almost a single point in the center.
         */

        if (this.galaxies) {

            this.galaxies.forEach(
                (galaxy) => {

                    galaxy.object.position.set(
                        0,
                        0,
                        0
                    );

                    galaxy.object.scale.set(
                        0.18,
                        0.18,
                        0.18
                    );

                }
            );

        }


        /* ---------------------------------------------
           RESET STARS
           --------------------------------------------- */

        if (this.starField) {

            this.starField.scale.set(
                0.025,
                0.025,
                0.025
            );

            this.starField.material.opacity =
                0.12;

        }


        /* ---------------------------------------------
           RESET DUST
           --------------------------------------------- */

        if (this.dustField) {

            this.dustField.scale.set(
                0.02,
                0.02,
                0.02
            );

            this.dustField.material.opacity =
                0.06;

        }


        /* ---------------------------------------------
           RESET GRID
           --------------------------------------------- */

        if (this.grid) {

            this.grid.scale.set(
                0.12,
                0.12,
                0.12
            );

        }


        this.updateValue();

        this.updateLanguage();

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
                    'astronomyWorld.cosmic.expansion.title'
                );

        }


        /* ---------------------------------------------
           DESCRIPTION
           --------------------------------------------- */

        if (this.descriptionElement) {

            this.descriptionElement.textContent =
                t(
                    'astronomyWorld.cosmic.expansion.description'
                );

        }


        /* ---------------------------------------------
           STATUS
           --------------------------------------------- */

        if (this.statusElement) {

            this.statusElement.textContent =
                this.isRunning
                    ? t(
                        'astronomyWorld.cosmic.expansion.running'
                    )
                    : t(
                        'astronomyWorld.cosmic.expansion.paused'
                    );

        }


        /* ---------------------------------------------
           INFO
           --------------------------------------------- */

        if (this.infoElement) {

            this.infoElement.textContent =
                t(
                    'astronomyWorld.cosmic.expansion.info'
                );

        }


        /* ---------------------------------------------
           CONTINUE
           --------------------------------------------- */

        if (this.continueButton) {

            this.continueButton.textContent =
                this.isRunning
                    ? t(
                        'astronomyWorld.cosmic.expansion.pause'
                    )
                    : t(
                        'astronomyWorld.cosmic.expansion.continue'
                    );

        }


        /* ---------------------------------------------
           RESET
           --------------------------------------------- */

        if (this.resetButton) {

            this.resetButton.textContent =
                t(
                    'astronomyWorld.cosmic.expansion.reset'
                );

        }


        /* ---------------------------------------------
           EXIT
           --------------------------------------------- */

        if (this.exitButton) {

            this.exitButton.textContent =
                t(
                    'astronomyWorld.cosmic.expansion.exit'
                );

        }


        this.updateValue();

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


            this.handleResize();

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
       CLOSE
       ===================================================== */

    close() {

        this.hide();


        window.setTimeout(() => {

            if (
                this.parent &&
                typeof this.parent
                    .returnToCosmicWorld ===
                    'function'
            ) {

                this.parent
                    .returnToCosmicWorld();

            }

        }, 550);

    }


    /* =====================================================
       SET SCENE
       ===================================================== */

    setScene(scene) {

        this.scene =
            scene;

    }


    /* =====================================================
       RESIZE
       ===================================================== */

    handleResize() {

        if (
            !this.renderer ||
            !this.camera ||
            !this.canvasContainer
        ) {

            return;

        }


        const width =
            Math.max(
                this.canvasContainer.clientWidth,
                1
            );


        const height =
            Math.max(
                this.canvasContainer.clientHeight,
                1
            );


        this.camera.aspect =
            width / height;


        this.camera.updateProjectionMatrix();


        this.renderer.setSize(
            width,
            height,
            false
        );

    }


    /* =====================================================
       DESTROY
       ===================================================== */

    destroy() {

        if (this.animationId) {

            cancelAnimationFrame(
                this.animationId
            );

            this.animationId =
                null;

        }


        window.removeEventListener(
            'resize',
            this.handleResize
        );


        /* ---------------------------------------------
           GALAXIES
           --------------------------------------------- */

        this.galaxies.forEach(
            (galaxy) => {

                galaxy.object.traverse(
                    (object) => {

                        if (
                            object.geometry
                        ) {

                            object.geometry
                                .dispose();

                        }


                        if (
                            object.material
                        ) {

                            if (
                                Array.isArray(
                                    object.material
                                )
                            ) {

                                object.material.forEach(
                                    (material) => {

                                        material.dispose();

                                    }
                                );

                            } else {

                                object.material
                                    .dispose();

                            }

                        }

                    }
                );

            }
        );


        /* ---------------------------------------------
           STAR FIELD
           --------------------------------------------- */

        if (this.starField) {

            this.starField.geometry.dispose();

            this.starField.material.dispose();

        }


        /* ---------------------------------------------
           DUST FIELD
           --------------------------------------------- */

        if (this.dustField) {

            this.dustField.geometry.dispose();

            this.dustField.material.dispose();

        }


        /* ---------------------------------------------
           GRID
           --------------------------------------------- */

        if (this.grid) {

            this.grid.geometry.dispose();

            this.grid.material.dispose();

        }


        /* ---------------------------------------------
           RENDERER
           --------------------------------------------- */

        if (this.renderer) {

            this.renderer.dispose();

            if (
                this.renderer.domElement
            ) {

                this.renderer.domElement.remove();

            }

            this.renderer =
                null;

        }


        /* ---------------------------------------------
           DOM
           --------------------------------------------- */

        if (this.container) {

            this.container.remove();

            this.container =
                null;

        }


        this.galaxies = [];

        this.galaxyGroup = null;

        this.experimentScene = null;

        this.camera = null;

        this.starField = null;

        this.dustField = null;

        this.grid = null;

    }

}