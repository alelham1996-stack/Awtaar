/* =========================================================
   AWTAAR — GRAVITATIONAL LENSING EXPERIMENT
   ========================================================= */

import * as THREE from 'three';

import './GravitationalLensing.css';

import {
    t,
    getLanguage
} from '../locales/i18n.js';


/* =========================================================
   GRAVITATIONAL LENSING EXPERIMENT
   ========================================================= */

export default class GravitationalLensingExperiment {

    constructor(scene = null, parent = null) {

        this.scene = scene;
        this.parent = parent;

        /* -------------------------------------------------
           STATE
        ------------------------------------------------- */

        this.visible = false;
        this.isRunning = false;

        this.elapsed = 0;

        this.beta = 0;
        this.targetBeta = 0;

        this.thetaE = 1.65;

        this.animationSpeed = 0.9;


        /* -------------------------------------------------
           DOM
        ------------------------------------------------- */

        this.root = null;

        this.canvasContainer = null;

        this.betaSlider = null;

        this.betaValue = null;

        this.statusTitle = null;

        this.statusDescription = null;


        /* -------------------------------------------------
           THREE
        ------------------------------------------------- */

        this.threeScene = null;

        this.camera = null;

        this.renderer = null;


        /* -------------------------------------------------
           OBJECTS
        ------------------------------------------------- */

        this.lens = null;

        this.lensGlow = null;

        this.lensHalo = null;

        this.source = null;

        this.sourceGlow = null;

        this.sourceGalaxy = null;

        this.starField = null;

        this.starFieldFar = null;


        /* -------------------------------------------------
           LENSED IMAGES
        ------------------------------------------------- */

        this.imagePositive = null;

        this.imageNegative = null;

        this.imagePositiveGlow = null;

        this.imageNegativeGlow = null;


        /* -------------------------------------------------
           EINSTEIN RING
        ------------------------------------------------- */

        this.einsteinRing = null;

        this.einsteinRingGlow = null;


        /* -------------------------------------------------
           LIGHT PATHS
        ------------------------------------------------- */

        this.lightPaths = [];

        this.lightParticles = [];


        /* -------------------------------------------------
           SOURCE DATA
        ------------------------------------------------- */

        this.sourceBasePosition =
            new THREE.Vector3(
                0,
                0,
                -7
            );


        /* -------------------------------------------------
           ANIMATION
        ------------------------------------------------- */

        this.animationFrame = null;

        this.boundResize =
            this.resize.bind(this);


        /* -------------------------------------------------
           CREATE
        ------------------------------------------------- */

        this.createUI();

        this.createThreeScene();


        window.addEventListener(
            'resize',
            this.boundResize
        );


        this.updateLanguage();

        this.updateLensingState();

    }


    /* =====================================================
       UI
       ===================================================== */

    createUI() {

        const oldRoot =
            document.getElementById(
                'awtaar-gravitational-lensing'
            );


        if (oldRoot) {

            oldRoot.remove();

        }


        this.root =
            document.createElement('div');


        this.root.id =
            'awtaar-gravitational-lensing';


        this.root.className =
            'awtaar-gravitational-lensing';


        this.root.innerHTML = `

            <div class="gravitational-lensing-header">

                <div class="gravitational-lensing-heading">

                    <div
                        class="gravitational-lensing-kicker"
                        data-i18n="astronomyWorld.cosmic.lensing.title">
                    </div>

                    <div
                        class="gravitational-lensing-description"
                        data-i18n="astronomyWorld.cosmic.lensing.description">
                    </div>

                </div>


                <button
                    class="gravitational-lensing-exit"
                    type="button"
                    data-i18n="astronomyWorld.cosmic.lensing.exit">
                </button>

            </div>


            <div class="gravitational-lensing-stage">

                <div
                    class="gravitational-lensing-canvas"
                    id="gravitational-lensing-canvas">
                </div>


                <div class="gravitational-lensing-information">

                    <div
                        class="gravitational-lensing-status-label"
                        data-i18n="astronomyWorld.cosmic.lensing.statusLabel">
                    </div>


                    <div
                        class="gravitational-lensing-status-title"
                        id="gravitational-lensing-status-title">
                    </div>


                    <div
                        class="gravitational-lensing-status-description"
                        id="gravitational-lensing-status-description">
                    </div>

                </div>

            </div>


            <div class="gravitational-lensing-controls">

                <div class="gravitational-lensing-control-group">

                    <div class="gravitational-lensing-control-heading">

                        <span
                            data-i18n="astronomyWorld.cosmic.lensing.alignment">
                        </span>

                        <span
                            id="gravitational-lensing-beta-value">
                            0.00
                        </span>

                    </div>


                    <input
                        id="gravitational-lensing-beta"
                        class="gravitational-lensing-slider"
                        type="range"
                        min="0"
                        max="3"
                        step="0.01"
                        value="0"
                    />

                </div>


                <button
                    id="gravitational-lensing-reset"
                    class="gravitational-lensing-reset"
                    type="button"
                    data-i18n="astronomyWorld.cosmic.lensing.reset">
                </button>


                <button
                    id="gravitational-lensing-continue"
                    class="gravitational-lensing-continue"
                    type="button"
                    data-i18n="astronomyWorld.cosmic.lensing.continue">
                </button>

            </div>

        `;


        document.body.appendChild(
            this.root
        );


        this.canvasContainer =
            this.root.querySelector(
                '#gravitational-lensing-canvas'
            );


        this.betaSlider =
            this.root.querySelector(
                '#gravitational-lensing-beta'
            );


        this.betaValue =
            this.root.querySelector(
                '#gravitational-lensing-beta-value'
            );


        this.statusTitle =
            this.root.querySelector(
                '#gravitational-lensing-status-title'
            );


        this.statusDescription =
            this.root.querySelector(
                '#gravitational-lensing-status-description'
            );


        /* -------------------------------------------------
           EXIT
        ------------------------------------------------- */

        const exitButton =
            this.root.querySelector(
                '.gravitational-lensing-exit'
            );


        if (exitButton) {

            exitButton.addEventListener(
                'click',
                () => {

                    this.close();

                }
            );

        }


        /* -------------------------------------------------
           SLIDER
        ------------------------------------------------- */

        if (this.betaSlider) {

            this.betaSlider.addEventListener(
                'input',
                () => {

                    const value =
                        parseFloat(
                            this.betaSlider.value
                        );


                    this.targetBeta =
                        Number.isFinite(value)
                            ? value
                            : 0;

                }
            );

        }


        /* -------------------------------------------------
           RESET
        ------------------------------------------------- */

        const resetButton =
            this.root.querySelector(
                '#gravitational-lensing-reset'
            );


        if (resetButton) {

            resetButton.addEventListener(
                'click',
                () => {

                    this.reset();

                }
            );

        }


        /* -------------------------------------------------
           CONTINUE
        ------------------------------------------------- */

        const continueButton =
            this.root.querySelector(
                '#gravitational-lensing-continue'
            );


        if (continueButton) {

            continueButton.addEventListener(
                'click',
                () => {

                    this.demoAlignment();

                }
            );

        }

    }


    /* =====================================================
       THREE SCENE
       ===================================================== */

    createThreeScene() {

        this.threeScene =
            new THREE.Scene();


        this.camera =
            new THREE.PerspectiveCamera(
                42,
                1,
                0.1,
                1000
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


        this.renderer =
            new THREE.WebGLRenderer({

                antialias: true,

                alpha: true

            });


        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio || 1,
                2
            )
        );


        this.renderer.setClearColor(
            0x000000,
            0
        );


        this.renderer.domElement.style.display =
            'block';

        this.renderer.domElement.style.width =
            '100%';

        this.renderer.domElement.style.height =
            '100%';


        if (this.canvasContainer) {

            /*
               Guarantee a usable visual area even if
               the surrounding layout has not calculated
               its height yet.
            */

            this.canvasContainer.style.minHeight =
                '420px';

            this.canvasContainer.style.position =
                'relative';


            this.canvasContainer.appendChild(
                this.renderer.domElement
            );

        }


        this.createStarField();

        this.createLens();

        this.createSource();

        this.createLensingImages();

        this.createEinsteinRing();

        this.createLightPaths();


        this.resize();

        this.updateVisuals();

        this.render();

    }


    /* =====================================================
       STAR FIELD
       ===================================================== */

    createStarField() {

        const geometry =
            new THREE.BufferGeometry();


        const count = 1200;


        const positions =
            new Float32Array(
                count * 3
            );


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const radius =
                12 +
                Math.random() * 22;


            const theta =
                Math.random() *
                Math.PI *
                2;


            const phi =
                Math.acos(
                    2 * Math.random() - 1
                );


            positions[i * 3] =
                radius *
                Math.sin(phi) *
                Math.cos(theta);


            positions[i * 3 + 1] =
                radius *
                Math.sin(phi) *
                Math.sin(theta);


            positions[i * 3 + 2] =
                radius *
                Math.cos(phi);

        }


        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(
                positions,
                3
            )
        );


        const material =
            new THREE.PointsMaterial({

                color: 0xded7c7,

                size: 0.045,

                transparent: true,

                opacity: 0.58,

                depthWrite: false,

                blending:
                    THREE.AdditiveBlending

            });


        this.starField =
            new THREE.Points(
                geometry,
                material
            );


        this.threeScene.add(
            this.starField
        );


        /* -------------------------------------------------
           FAR STARS
        ------------------------------------------------- */

        const farGeometry =
            new THREE.BufferGeometry();


        const farCount = 500;


        const farPositions =
            new Float32Array(
                farCount * 3
            );


        for (
            let i = 0;
            i < farCount;
            i++
        ) {

            const radius =
                25 +
                Math.random() * 20;


            const theta =
                Math.random() *
                Math.PI *
                2;


            const phi =
                Math.acos(
                    2 * Math.random() - 1
                );


            farPositions[i * 3] =
                radius *
                Math.sin(phi) *
                Math.cos(theta);


            farPositions[i * 3 + 1] =
                radius *
                Math.sin(phi) *
                Math.sin(theta);


            farPositions[i * 3 + 2] =
                radius *
                Math.cos(phi);

        }


        farGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(
                farPositions,
                3
            )
        );


        const farMaterial =
            new THREE.PointsMaterial({

                color: 0x918aa5,

                size: 0.025,

                transparent: true,

                opacity: 0.35,

                depthWrite: false,

                blending:
                    THREE.AdditiveBlending

            });


        this.starFieldFar =
            new THREE.Points(
                farGeometry,
                farMaterial
            );


        this.threeScene.add(
            this.starFieldFar
        );

    }


    /* =====================================================
       GRAVITATIONAL LENS
       ===================================================== */

    createLens() {

        /* -------------------------------------------------
           CENTRAL MASS
        ------------------------------------------------- */

        const geometry =
            new THREE.SphereGeometry(
                1.05,
                64,
                64
            );


        const material =
            new THREE.MeshBasicMaterial({

                color: 0x020204

            });


        this.lens =
            new THREE.Mesh(
                geometry,
                material
            );


        this.threeScene.add(
            this.lens
        );


        /* -------------------------------------------------
           GOLDEN GLOW
        ------------------------------------------------- */

        const glowGeometry =
            new THREE.SphereGeometry(
                1.28,
                64,
                64
            );


        const glowMaterial =
            new THREE.MeshBasicMaterial({

                color: 0xc89a4b,

                transparent: true,

                opacity: 0.22,

                side:
                    THREE.BackSide,

                blending:
                    THREE.AdditiveBlending

            });


        this.lensGlow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            );


        this.threeScene.add(
            this.lensGlow
        );


        /* -------------------------------------------------
           OUTER HALO
        ------------------------------------------------- */

        const haloGeometry =
            new THREE.SphereGeometry(
                1.65,
                64,
                64
            );


        const haloMaterial =
            new THREE.MeshBasicMaterial({

                color: 0x8068aa,

                transparent: true,

                opacity: 0.07,

                side:
                    THREE.BackSide,

                blending:
                    THREE.AdditiveBlending

            });


        this.lensHalo =
            new THREE.Mesh(
                haloGeometry,
                haloMaterial
            );


        this.threeScene.add(
            this.lensHalo
        );


        /* -------------------------------------------------
           MASS RING
        ------------------------------------------------- */

        const ringGeometry =
            new THREE.RingGeometry(
                1.08,
                1.12,
                128
            );


        const ringMaterial =
            new THREE.MeshBasicMaterial({

                color: 0xd4aa5e,

                transparent: true,

                opacity: 0.38,

                side:
                    THREE.DoubleSide,

                blending:
                    THREE.AdditiveBlending

            });


        const massRing =
            new THREE.Mesh(
                ringGeometry,
                ringMaterial
            );


        /*
           IMPORTANT:
           The camera looks along the Z axis.
           Therefore the ring must remain in the XY
           plane. Do NOT rotate it by PI / 2.
        */

        massRing.position.z =
            0.02;


        this.threeScene.add(
            massRing
        );

    }


    /* =====================================================
       DISTANT SOURCE
       ===================================================== */

    createSource() {

        const geometry =
            new THREE.SphereGeometry(
                0.18,
                32,
                32
            );


        const material =
            new THREE.MeshBasicMaterial({

                color: 0xffe6a6

            });


        this.source =
            new THREE.Mesh(
                geometry,
                material
            );


        this.source.position.copy(
            this.sourceBasePosition
        );


        this.threeScene.add(
            this.source
        );


        /* -------------------------------------------------
           SOURCE GLOW
        ------------------------------------------------- */

        const glowGeometry =
            new THREE.SphereGeometry(
                0.42,
                32,
                32
            );


        const glowMaterial =
            new THREE.MeshBasicMaterial({

                color: 0xf0c96b,

                transparent: true,

                opacity: 0.28,

                side:
                    THREE.BackSide,

                blending:
                    THREE.AdditiveBlending

            });


        this.sourceGlow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            );


        this.sourceGlow.position.copy(
            this.sourceBasePosition
        );


        this.threeScene.add(
            this.sourceGlow
        );


        /* -------------------------------------------------
           SOURCE GALAXY
        ------------------------------------------------- */

        const galaxyGeometry =
            new THREE.BufferGeometry();


        const count = 260;


        const positions =
            new Float32Array(
                count * 3
            );


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const radius =
                Math.pow(
                    Math.random(),
                    0.7
                ) * 0.8;


            const angle =
                Math.random() *
                Math.PI *
                2;


            const spread =
                (
                    Math.random() -
                    0.5
                ) *
                0.16;


            positions[i * 3] =
                Math.cos(angle) *
                radius;


            positions[i * 3 + 1] =
                Math.sin(angle) *
                radius *
                0.48;


            positions[i * 3 + 2] =
                spread;

        }


        galaxyGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(
                positions,
                3
            )
        );


        const galaxyMaterial =
            new THREE.PointsMaterial({

                color: 0xe1c27d,

                size: 0.028,

                transparent: true,

                opacity: 0.72,

                depthWrite: false,

                blending:
                    THREE.AdditiveBlending

            });


        this.sourceGalaxy =
            new THREE.Points(
                galaxyGeometry,
                galaxyMaterial
            );


        this.sourceGalaxy.position.copy(
            this.sourceBasePosition
        );


        this.threeScene.add(
            this.sourceGalaxy
        );

    }


    /* =====================================================
       LENSED IMAGES
       ===================================================== */

    createLensingImages() {

        const geometry =
            new THREE.SphereGeometry(
                0.14,
                24,
                24
            );


        const material =
            new THREE.MeshBasicMaterial({

                color: 0xffdf91,

                transparent: true,

                opacity: 0

            });


        this.imagePositive =
            new THREE.Mesh(
                geometry,
                material
            );


        this.threeScene.add(
            this.imagePositive
        );


        /* -------------------------------------------------
           NEGATIVE IMAGE
        ------------------------------------------------- */

        const negativeGeometry =
            new THREE.SphereGeometry(
                0.14,
                24,
                24
            );


        const negativeMaterial =
            new THREE.MeshBasicMaterial({

                color: 0xf0d28b,

                transparent: true,

                opacity: 0

            });


        this.imageNegative =
            new THREE.Mesh(
                negativeGeometry,
                negativeMaterial
            );


        this.threeScene.add(
            this.imageNegative
        );


        /* -------------------------------------------------
           GLOWS
        ------------------------------------------------- */

        this.imagePositiveGlow =
            this.createGlowSphere(
                0.34,
                0xf1c96d,
                0
            );


        this.imageNegativeGlow =
            this.createGlowSphere(
                0.34,
                0xd6ad5c,
                0
            );


        this.threeScene.add(
            this.imagePositiveGlow
        );


        this.threeScene.add(
            this.imageNegativeGlow
        );

    }


    /* =====================================================
       GLOW SPHERE
       ===================================================== */

    createGlowSphere(
        radius,
        color,
        opacity
    ) {

        const geometry =
            new THREE.SphereGeometry(
                radius,
                32,
                32
            );


        const material =
            new THREE.MeshBasicMaterial({

                color,

                transparent: true,

                opacity,

                side:
                    THREE.BackSide,

                blending:
                    THREE.AdditiveBlending

            });


        return new THREE.Mesh(
            geometry,
            material
        );

    }


    /* =====================================================
       EINSTEIN RING
       ===================================================== */

    createEinsteinRing() {

        const geometry =
            new THREE.RingGeometry(
                this.thetaE - 0.045,
                this.thetaE + 0.045,
                160
            );


        const material =
            new THREE.MeshBasicMaterial({

                color: 0xffdfa0,

                transparent: true,

                opacity: 0,

                side:
                    THREE.DoubleSide,

                blending:
                    THREE.AdditiveBlending,

                depthWrite: false

            });


        this.einsteinRing =
            new THREE.Mesh(
                geometry,
                material
            );


        /*
           IMPORTANT:
           Camera is positioned on +Z and looks toward
           the origin, so the ring must face the camera.
        */

        this.einsteinRing.position.z =
            0.12;


        this.threeScene.add(
            this.einsteinRing
        );


        /* -------------------------------------------------
           RING GLOW
        ------------------------------------------------- */

        const glowGeometry =
            new THREE.RingGeometry(
                this.thetaE - 0.15,
                this.thetaE + 0.15,
                160
            );


        const glowMaterial =
            new THREE.MeshBasicMaterial({

                color: 0xd7aa58,

                transparent: true,

                opacity: 0,

                side:
                    THREE.DoubleSide,

                blending:
                    THREE.AdditiveBlending,

                depthWrite: false

            });


        this.einsteinRingGlow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            );


        this.einsteinRingGlow.position.z =
            0.10;


        this.threeScene.add(
            this.einsteinRingGlow
        );

    }


    /* =====================================================
       LIGHT PATHS
       ===================================================== */

    createLightPaths() {

        const pathDefinitions = [

            {
                side: 1,
                height: 2.2
            },

            {
                side: -1,
                height: 2.2
            },

            {
                side: 1,
                height: 2.9
            },

            {
                side: -1,
                height: 2.9
            }

        ];


        pathDefinitions.forEach(
            definition => {

                const curve =
                    new THREE.CatmullRomCurve3([

                        new THREE.Vector3(
                            -7,
                            definition.side *
                            definition.height,
                            -2
                        ),

                        new THREE.Vector3(
                            -3.5,
                            definition.side *
                            1.9,
                            0
                        ),

                        new THREE.Vector3(
                            0,
                            definition.side *
                            2.2,
                            1
                        ),

                        new THREE.Vector3(
                            3.5,
                            definition.side *
                            1.9,
                            0
                        ),

                        new THREE.Vector3(
                            7,
                            definition.side *
                            definition.height,
                            -2
                        )

                    ]);


                const points =
                    curve.getPoints(100);


                const geometry =
                    new THREE.BufferGeometry()
                        .setFromPoints(
                            points
                        );


                const material =
                    new THREE.LineBasicMaterial({

                        color: 0xd9b66b,

                        transparent: true,

                        opacity: 0.22,

                        depthWrite: false,

                        blending:
                            THREE.AdditiveBlending

                    });


                const line =
                    new THREE.Line(
                        geometry,
                        material
                    );


                line.userData.side =
                    definition.side;


                line.userData.baseHeight =
                    definition.height;


                this.lightPaths.push(
                    line
                );


                this.threeScene.add(
                    line
                );


                /* -----------------------------------------
                   PARTICLE
                ----------------------------------------- */

                const particleGeometry =
                    new THREE.SphereGeometry(
                        0.055,
                        12,
                        12
                    );


                const particleMaterial =
                    new THREE.MeshBasicMaterial({

                        color: 0xffe5a0,

                        transparent: true,

                        opacity: 0.9,

                        blending:
                            THREE.AdditiveBlending

                    });


                const particle =
                    new THREE.Mesh(
                        particleGeometry,
                        particleMaterial
                    );


                particle.userData.curve =
                    curve;


                particle.userData.progress =
                    Math.random();


                this.lightParticles.push(
                    particle
                );


                this.threeScene.add(
                    particle
                );

            }
        );

    }


    /* =====================================================
       SHOW
       ===================================================== */

    show() {

        this.visible = true;

        this.isRunning = true;


        if (this.root) {

            this.root.style.display =
                'flex';


            this.root.style.visibility =
                'visible';


            this.root.style.pointerEvents =
                'auto';


            requestAnimationFrame(
                () => {

                    if (this.root) {

                        this.root.classList.add(
                            'is-visible'
                        );

                    }

                    /*
                       The layout has now become visible.
                       Resize again after the browser has
                       calculated the actual dimensions.
                    */

                    this.resize();

                    this.render();

                }
            );

        }


        this.reset();

        this.resize();

        this.startAnimation();

    }


    /* =====================================================
       HIDE
       ===================================================== */

    hide() {

        this.visible = false;

        this.isRunning = false;


        if (this.root) {

            this.root.classList.remove(
                'is-visible'
            );

            this.root.style.pointerEvents =
                'none';

        }


        if (this.animationFrame) {

            cancelAnimationFrame(
                this.animationFrame
            );

            this.animationFrame = null;

        }

    }


    /* =====================================================
       START ANIMATION
       ===================================================== */

    startAnimation() {

        if (this.animationFrame) {

            cancelAnimationFrame(
                this.animationFrame
            );

        }


        let previousTime =
            performance.now();


        const animate = (
            currentTime
        ) => {

            if (!this.visible) {

                return;

            }


            this.animationFrame =
                requestAnimationFrame(
                    animate
                );


            const delta =
                Math.min(
                    (
                        currentTime -
                        previousTime
                    ) / 1000,
                    0.05
                );


            previousTime =
                currentTime;


            this.update(
                delta
            );


            this.render();

        };


        this.animationFrame =
            requestAnimationFrame(
                animate
            );

    }


    /* =====================================================
       UPDATE
       ===================================================== */

    update(delta) {

        if (!this.visible) {

            return;

        }


        this.elapsed +=
            delta *
            this.animationSpeed;


        this.beta +=
            (
                this.targetBeta -
                this.beta
            ) *
            Math.min(
                delta * 6,
                1
            );


        this.updateSource();

        this.updateLensedImages();

        this.updateEinsteinRing();

        this.updateLightPaths();

        this.updateStarField();

        this.updateVisuals();

    }


    /* =====================================================
       SOURCE
       ===================================================== */

    updateSource() {

        if (
            !this.source ||
            !this.sourceGlow ||
            !this.sourceGalaxy
        ) {

            return;

        }


        const y =
            this.beta *
            1.7;


        this.source.position.set(
            this.sourceBasePosition.x,
            y,
            this.sourceBasePosition.z
        );


        this.sourceGlow.position.copy(
            this.source.position
        );


        this.sourceGalaxy.position.copy(
            this.source.position
        );


        this.sourceGalaxy.rotation.z +=
            0.002;


        const pulse =
            1 +
            Math.sin(
                this.elapsed * 3
            ) *
            0.06;


        this.sourceGlow.scale.setScalar(
            pulse
        );

    }


    /* =====================================================
       LENSED IMAGE CALCULATION
       ===================================================== */

    calculateLensedImages() {

        const beta =
            this.beta;


        const thetaE =
            this.thetaE;


        const discriminant =
            Math.sqrt(
                beta * beta +
                4 *
                thetaE *
                thetaE
            );


        const thetaPositive =
            (
                beta +
                discriminant
            ) / 2;


        const thetaNegative =
            (
                beta -
                discriminant
            ) / 2;


        return {

            positive:
                thetaPositive,

            negative:
                thetaNegative

        };

    }


    /* =====================================================
       LENSED IMAGES
       ===================================================== */

    updateLensedImages() {

        if (
            !this.imagePositive ||
            !this.imageNegative
        ) {

            return;

        }


        const images =
            this.calculateLensedImages();


        const scale =
            1.0;


        const yPositive =
            images.positive *
            scale;


        const yNegative =
            images.negative *
            scale;


        this.imagePositive.position.set(
            0,
            yPositive,
            2
        );


        this.imageNegative.position.set(
            0,
            yNegative,
            2
        );


        this.imagePositiveGlow.position.copy(
            this.imagePositive.position
        );


        this.imageNegativeGlow.position.copy(
            this.imageNegative.position
        );


        const alignment =
            Math.max(
                0,
                1 -
                this.beta / 0.75
            );


        const imageOpacity =
            Math.min(
                1,
                Math.max(
                    0,
                    0.12 +
                    (
                        1 -
                        alignment
                    ) *
                    0.88
                )
            );


        this.imagePositive.material.opacity =
            imageOpacity;


        this.imageNegative.material.opacity =
            imageOpacity;


        this.imagePositiveGlow.material.opacity =
            imageOpacity *
            0.3;


        this.imageNegativeGlow.material.opacity =
            imageOpacity *
            0.3;

    }


    /* =====================================================
       EINSTEIN RING
       ===================================================== */

    updateEinsteinRing() {

        if (
            !this.einsteinRing ||
            !this.einsteinRingGlow
        ) {

            return;

        }


        const alignment =
            Math.max(
                0,
                1 -
                this.beta / 0.75
            );


        const pulse =
            1 +
            Math.sin(
                this.elapsed * 2.2
            ) *
            0.025;


        this.einsteinRing.scale.setScalar(
            pulse
        );


        this.einsteinRingGlow.scale.setScalar(
            pulse
        );


        this.einsteinRing.material.opacity =
            alignment *
            (
                0.78 +
                Math.sin(
                    this.elapsed * 2
                ) *
                0.08
            );


        this.einsteinRingGlow.material.opacity =
            alignment *
            0.24;

    }


    /* =====================================================
       LIGHT PATHS
       ===================================================== */

    updateLightPaths() {

        this.lightParticles.forEach(
            particle => {

                const curve =
                    particle.userData.curve;


                particle.userData.progress +=
                    0.003;


                if (
                    particle.userData.progress >
                    1
                ) {

                    particle.userData.progress =
                        0;

                }


                const position =
                    curve.getPointAt(
                        particle.userData.progress
                    );


                particle.position.copy(
                    position
                );

            }
        );


        this.lightPaths.forEach(
            line => {

                const side =
                    line.userData.side;


                const baseHeight =
                    line.userData.baseHeight;


                const alignment =
                    Math.max(
                        0,
                        1 -
                        this.beta / 3
                    );


                line.material.opacity =
                    0.10 +
                    alignment *
                    (
                        baseHeight === 2.2
                            ? 0.18
                            : 0.10
                    );


                line.rotation.z =
                    Math.sin(
                        this.elapsed * 0.45 +
                        side
                    ) *
                    0.004;

            }
        );

    }


    /* =====================================================
       STAR FIELD
       ===================================================== */

    updateStarField() {

        if (this.starField) {

            this.starField.rotation.y +=
                0.00012;

            this.starField.rotation.x +=
                0.00003;

        }


        if (this.starFieldFar) {

            this.starFieldFar.rotation.y -=
                0.00004;

        }

    }


    /* =====================================================
       VISUAL STATE
       ===================================================== */

    updateVisuals() {

        const pulse =
            1 +
            Math.sin(
                this.elapsed * 1.5
            ) *
            0.025;


        if (this.lensGlow) {

            this.lensGlow.scale.setScalar(
                pulse
            );

            this.lensGlow.material.opacity =
                0.19 +
                Math.sin(
                    this.elapsed * 1.5
                ) *
                0.025;

        }


        if (this.lensHalo) {

            this.lensHalo.scale.setScalar(
                1.02 *
                pulse
            );

            this.lensHalo.material.opacity =
                0.055 +
                Math.sin(
                    this.elapsed
                ) *
                0.012;

        }


        this.updateInformation();

    }


    /* =====================================================
       INFORMATION
       ===================================================== */

    updateInformation() {

        if (
            !this.statusTitle ||
            !this.statusDescription
        ) {

            return;

        }


        let titleKey =
            'astronomyWorld.cosmic.lensing.states.aligned.title';


        let descriptionKey =
            'astronomyWorld.cosmic.lensing.states.aligned.description';


        if (this.beta > 0.08) {

            titleKey =
                'astronomyWorld.cosmic.lensing.states.lensed.title';


            descriptionKey =
                'astronomyWorld.cosmic.lensing.states.lensed.description';

        }


        if (this.beta > 1.8) {

            titleKey =
                'astronomyWorld.cosmic.lensing.states.offset.title';


            descriptionKey =
                'astronomyWorld.cosmic.lensing.states.offset.description';

        }


        this.statusTitle.textContent =
            t(titleKey);


        this.statusDescription.textContent =
            t(descriptionKey);


        if (this.betaValue) {

            this.betaValue.textContent =
                this.beta.toFixed(2);

        }

    }


    /* =====================================================
       DEMO ALIGNMENT
       ===================================================== */

    demoAlignment() {

        this.targetBeta =
            2.4;


        window.setTimeout(
            () => {

                if (!this.visible) {

                    return;

                }


                this.targetBeta =
                    1.1;

            },
            1600
        );


        window.setTimeout(
            () => {

                if (!this.visible) {

                    return;

                }


                this.targetBeta =
                    0;

            },
            3200
        );

    }


    /* =====================================================
       RESET
       ===================================================== */

    reset() {

        this.beta =
            0;


        this.targetBeta =
            0;


        this.elapsed =
            0;


        if (this.betaSlider) {

            this.betaSlider.value =
                '0';

        }


        this.updateSource();

        this.updateLensedImages();

        this.updateEinsteinRing();

        this.updateVisuals();

        this.render();

    }


    /* =====================================================
       LANGUAGE
       ===================================================== */

    updateLanguage() {

        if (!this.root) {

            return;

        }


        const language =
            getLanguage();


        this.root.setAttribute(
            'dir',
            language === 'ar'
                ? 'rtl'
                : 'ltr'
        );


        const translatedElements =
            this.root.querySelectorAll(
                '[data-i18n]'
            );


        translatedElements.forEach(
            element => {

                const key =
                    element.getAttribute(
                        'data-i18n'
                    );


                if (!key) {

                    return;

                }


                element.textContent =
                    t(key);

            }
        );


        this.updateInformation();

    }


    /* =====================================================
       RESIZE
       ===================================================== */

    resize() {

        if (
            !this.renderer ||
            !this.camera ||
            !this.canvasContainer
        ) {

            return;

        }


        /*
           Read the actual visible dimensions.

           If the browser has not calculated the height
           yet, use the guaranteed minimum visual height.
        */

        const width =
            Math.max(
                this.canvasContainer.clientWidth,
                this.canvasContainer.offsetWidth,
                1
            );


        const height =
            Math.max(
                this.canvasContainer.clientHeight,
                this.canvasContainer.offsetHeight,
                420
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


    /* =====================================================
       RENDER
       ===================================================== */

    render() {

        if (
            !this.renderer ||
            !this.threeScene ||
            !this.camera
        ) {

            return;

        }


        this.renderer.render(
            this.threeScene,
            this.camera
        );

    }


    /* =====================================================
       CLOSE
       ===================================================== */

    close() {

        this.hide();


        if (
            this.parent &&
            typeof this.parent.returnToCosmicWorld ===
                'function'
        ) {

            window.setTimeout(
                () => {

                    if (this.parent) {

                        this.parent.returnToCosmicWorld();

                    }

                },
                500
            );

        }

    }


    /* =====================================================
       SET SCENE
       ===================================================== */

    setScene(scene) {

        this.scene =
            scene;

    }


    /* =====================================================
       UPDATE LENSING STATE
       ===================================================== */

    updateLensingState() {

        this.updateSource();

        this.updateLensedImages();

        this.updateEinsteinRing();

        this.updateVisuals();

    }


    /* =====================================================
       DESTROY
       ===================================================== */

    destroy() {

        this.hide();


        window.removeEventListener(
            'resize',
            this.boundResize
        );


        /* -------------------------------------------------
           THREE OBJECT CLEANUP
        ------------------------------------------------- */

        if (this.threeScene) {

            this.threeScene.traverse(
                object => {

                    if (
                        object.geometry
                    ) {

                        object.geometry.dispose();

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
                                material => {

                                    material.dispose();

                                }
                            );

                        } else {

                            object.material.dispose();

                        }

                    }

                }
            );

        }


        /* -------------------------------------------------
           RENDERER
        ------------------------------------------------- */

        if (this.renderer) {

            this.renderer.dispose();


            if (
                this.renderer.domElement &&
                this.renderer.domElement.parentNode
            ) {

                this.renderer.domElement.parentNode
                    .removeChild(
                        this.renderer.domElement
                    );

            }


            this.renderer = null;

        }


        /* -------------------------------------------------
           DOM
        ------------------------------------------------- */

        if (this.root) {

            this.root.remove();

            this.root = null;

        }


        /* -------------------------------------------------
           RESET
        ------------------------------------------------- */

        this.canvasContainer = null;

        this.betaSlider = null;

        this.betaValue = null;

        this.statusTitle = null;

        this.statusDescription = null;

        this.threeScene = null;

        this.camera = null;

        this.scene = null;

        this.parent = null;

        this.lightPaths = [];

        this.lightParticles = [];

        this.visible = false;

        this.isRunning = false;

    }

}