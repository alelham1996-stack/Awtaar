/* =========================================================
   AWTAAR — STAR BIRTH EXPERIMENT
   ========================================================= */

import * as THREE from 'three';
import './StarBirth.css';

import {
    t,
    getLanguage
} from '../locales/i18n.js';


/* =========================================================
   STAR BIRTH EXPERIMENT
   ========================================================= */

export default class StarBirthExperiment {

    constructor(scene = null, parent = null) {

        this.scene = scene;
        this.parent = parent;

        /* -------------------------------------------------
           STATE
        ------------------------------------------------- */

        this.visible = false;
        this.isRunning = false;

        this.currentPhase = 0;
        this.phaseCount = 5;

        this.phaseKeys = [
            'cloud',
            'collapse',
            'protostar',
            'fusion',
            'star'
        ];

        this.elapsed = 0;

        /* -------------------------------------------------
           DOM
        ------------------------------------------------- */

        this.root = null;
        this.canvasContainer = null;

        /* -------------------------------------------------
           THREE
        ------------------------------------------------- */

        this.threeScene = null;
        this.camera = null;
        this.renderer = null;

        /* -------------------------------------------------
           OBJECTS
        ------------------------------------------------- */

        this.starCloud = null;
        this.core = null;
        this.coreGlow = null;

        this.accretionDisk = null;

        this.outflow = null;

        this.fusionParticles = null;

        this.finalStar = null;
        this.finalGlow = null;
        this.finalHalo = null;

        this.energyRings = [];

        /* -------------------------------------------------
           CLOUD DATA
        ------------------------------------------------- */

        this.cloudPositions = null;
        this.cloudBasePositions = null;

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
        this.updateInformation();
    }


    /* =========================================================
       UI
       ========================================================= */

    createUI() {

        const oldRoot =
            document.getElementById(
                'awtaar-star-birth'
            );

        if (oldRoot) {
            oldRoot.remove();
        }


        this.root =
            document.createElement('div');

        this.root.id =
            'awtaar-star-birth';

        this.root.className =
            'awtaar-star-birth';


        this.root.innerHTML = `

            <div class="star-birth-header">

                <div class="star-birth-heading">

                    <div
                        class="star-birth-kicker"
                        data-i18n="astronomyWorld.stellar.birth.title">
                    </div>

                    <div
                        class="star-birth-description"
                        data-i18n="astronomyWorld.stellar.birth.description">
                    </div>

                </div>


                <button
                    class="star-birth-exit"
                    type="button"
                    data-i18n="astronomyWorld.stellar.birth.exit">
                </button>

            </div>


            <div class="star-birth-stage">

                <div
                    class="star-birth-canvas"
                    id="star-birth-canvas">
                </div>


                <div class="star-birth-information">

                    <div
                        class="star-birth-phase-number">
                        01
                    </div>

                    <div
                        class="star-birth-phase-title"
                        id="star-birth-phase-title">
                    </div>

                    <div
                        class="star-birth-phase-description"
                        id="star-birth-phase-description">
                    </div>

                </div>

            </div>


            <div class="star-birth-controls">

                <button
                    class="star-birth-reset"
                    id="star-birth-reset"
                    type="button"
                    data-i18n="astronomyWorld.stellar.birth.reset">
                </button>


                <button
                    class="star-birth-continue"
                    id="star-birth-continue"
                    type="button">
                </button>

            </div>

        `;


        document.body.appendChild(
            this.root
        );


        this.canvasContainer =
            this.root.querySelector(
                '#star-birth-canvas'
            );


        /* -------------------------------------------------
           EXIT
        ------------------------------------------------- */

        const exitButton =
            this.root.querySelector(
                '.star-birth-exit'
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
           RESET
        ------------------------------------------------- */

        const resetButton =
            this.root.querySelector(
                '#star-birth-reset'
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
                '#star-birth-continue'
            );

        if (continueButton) {

            continueButton.addEventListener(
                'click',
                () => {

                    if (
                        this.currentPhase >=
                        this.phaseCount - 1
                    ) {

                        this.reset();

                    } else {

                        this.nextPhase();

                    }

                }
            );
        }
    }


    /* =========================================================
       THREE SCENE
       ========================================================= */

    createThreeScene() {

        this.threeScene =
            new THREE.Scene();


        this.camera =
            new THREE.PerspectiveCamera(
                45,
                1,
                0.1,
                1000
            );

        this.camera.position.set(
            0,
            0,
            16
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


        if (this.canvasContainer) {

            this.canvasContainer.appendChild(
                this.renderer.domElement
            );

        }


        this.createCloud();
        this.createCore();
        this.createAccretionDisk();
        this.createFusionParticles();
        this.createOutflow();
        this.createFinalStar();
        this.createEnergyRings();


        this.resize();

        this.updateVisuals();

        this.render();
    }


    /* =========================================================
       MOLECULAR CLOUD
       ========================================================= */

    createCloud() {

        const geometry =
            new THREE.BufferGeometry();

        const count = 2600;

        const positions =
            new Float32Array(
                count * 3
            );


        this.cloudBasePositions =
            new Float32Array(
                count * 3
            );


        this.cloudPositions =
            positions;


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const radius =
                2.7 +
                Math.random() * 4.2;

            const theta =
                Math.random() *
                Math.PI *
                2;

            const phi =
                Math.acos(
                    2 * Math.random() - 1
                );


            const x =
                radius *
                Math.sin(phi) *
                Math.cos(theta);

            const y =
                radius *
                Math.sin(phi) *
                Math.sin(theta);

            const z =
                radius *
                Math.cos(phi);


            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;


            this.cloudBasePositions[i * 3] =
                x;

            this.cloudBasePositions[i * 3 + 1] =
                y;

            this.cloudBasePositions[i * 3 + 2] =
                z;
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

                color: 0xd9c9a3,

                size: 0.055,

                transparent: true,

                opacity: 0.68,

                depthWrite: false,

                blending:
                    THREE.AdditiveBlending

            });


        this.starCloud =
            new THREE.Points(
                geometry,
                material
            );


        this.threeScene.add(
            this.starCloud
        );
    }


    /* =========================================================
       PROTOSTAR CORE
       ========================================================= */

    createCore() {

        const geometry =
            new THREE.SphereGeometry(
                1,
                64,
                64
            );


        const material =
            new THREE.MeshBasicMaterial({

                color: 0xf3c969,

                transparent: true,

                opacity: 0

            });


        this.core =
            new THREE.Mesh(
                geometry,
                material
            );


        this.threeScene.add(
            this.core
        );


        const glowGeometry =
            new THREE.SphereGeometry(
                1.35,
                48,
                48
            );


        const glowMaterial =
            new THREE.MeshBasicMaterial({

                color: 0xd59c38,

                transparent: true,

                opacity: 0,

                side:
                    THREE.BackSide,

                blending:
                    THREE.AdditiveBlending

            });


        this.coreGlow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            );


        this.threeScene.add(
            this.coreGlow
        );
    }


    /* =========================================================
       ACCRETION DISK
       ========================================================= */

    createAccretionDisk() {

        const geometry =
            new THREE.RingGeometry(
                1.1,
                3.4,
                160
            );


        const material =
            new THREE.MeshBasicMaterial({

                color: 0xc99b4a,

                transparent: true,

                opacity: 0,

                side:
                    THREE.DoubleSide,

                blending:
                    THREE.AdditiveBlending

            });


        this.accretionDisk =
            new THREE.Mesh(
                geometry,
                material
            );


        this.accretionDisk.rotation.x =
            Math.PI / 2;


        this.threeScene.add(
            this.accretionDisk
        );
    }


    /* =========================================================
       FUSION PARTICLES
       ========================================================= */

    createFusionParticles() {

        const geometry =
            new THREE.BufferGeometry();

        const count = 420;

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
                Math.random() *
                1.1;

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

                color: 0xffe7a1,

                size: 0.045,

                transparent: true,

                opacity: 0,

                depthWrite: false,

                blending:
                    THREE.AdditiveBlending

            });


        this.fusionParticles =
            new THREE.Points(
                geometry,
                material
            );


        this.threeScene.add(
            this.fusionParticles
        );
    }


    /* =========================================================
       OUTFLOW
       ========================================================= */

    createOutflow() {

        const geometry =
            new THREE.BufferGeometry();

        const count = 500;

        const positions =
            new Float32Array(
                count * 3
            );


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const direction =
                Math.random() > 0.5
                    ? 1
                    : -1;

            const distance =
                Math.random() * 5.5;

            const spread =
                Math.random() * 0.22;


            positions[i * 3] =
                (Math.random() - 0.5) *
                spread;

            positions[i * 3 + 1] =
                direction *
                distance;

            positions[i * 3 + 2] =
                (Math.random() - 0.5) *
                spread;

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

                color: 0xf4d486,

                size: 0.035,

                transparent: true,

                opacity: 0,

                depthWrite: false,

                blending:
                    THREE.AdditiveBlending

            });


        this.outflow =
            new THREE.Points(
                geometry,
                material
            );


        this.threeScene.add(
            this.outflow
        );
    }


    /* =========================================================
       FINAL STAR
       ========================================================= */

    createFinalStar() {

        const geometry =
            new THREE.SphereGeometry(
                1,
                64,
                64
            );


        const material =
            new THREE.MeshBasicMaterial({

                color: 0xffe5a0,

                transparent: true,

                opacity: 0

            });


        this.finalStar =
            new THREE.Mesh(
                geometry,
                material
            );


        this.threeScene.add(
            this.finalStar
        );


        const glowGeometry =
            new THREE.SphereGeometry(
                1.35,
                48,
                48
            );


        const glowMaterial =
            new THREE.MeshBasicMaterial({

                color: 0xe0a94b,

                transparent: true,

                opacity: 0,

                side:
                    THREE.BackSide,

                blending:
                    THREE.AdditiveBlending

            });


        this.finalGlow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            );


        this.threeScene.add(
            this.finalGlow
        );


        const haloGeometry =
            new THREE.SphereGeometry(
                1.75,
                48,
                48
            );


        const haloMaterial =
            new THREE.MeshBasicMaterial({

                color: 0xc98b32,

                transparent: true,

                opacity: 0,

                side:
                    THREE.BackSide,

                blending:
                    THREE.AdditiveBlending

            });


        this.finalHalo =
            new THREE.Mesh(
                haloGeometry,
                haloMaterial
            );


        this.threeScene.add(
            this.finalHalo
        );
    }


    /* =========================================================
       ENERGY RINGS
       ========================================================= */

    createEnergyRings() {

        for (
            let i = 0;
            i < 3;
            i++
        ) {

            const geometry =
                new THREE.RingGeometry(
                    1.35 + i * 0.55,
                    1.37 + i * 0.55,
                    96
                );


            const material =
                new THREE.MeshBasicMaterial({

                    color: 0xf0c96b,

                    transparent: true,

                    opacity: 0,

                    side:
                        THREE.DoubleSide,

                    blending:
                        THREE.AdditiveBlending

                });


            const ring =
                new THREE.Mesh(
                    geometry,
                    material
                );


            ring.rotation.x =
                Math.PI / 2;


            ring.userData.offset =
                i * 0.7;


            this.energyRings.push(
                ring
            );


            this.threeScene.add(
                ring
            );
        }
    }


    /* =========================================================
       SHOW
       ========================================================= */

    show() {

        this.visible = true;
        this.isRunning = true;


        if (this.root) {

            this.root.style.display =
                'flex';

            requestAnimationFrame(
                () => {

                    if (this.root) {

                        this.root.classList.add(
                            'is-visible'
                        );

                    }

                }
            );

        }


        this.reset();

        this.resize();

        this.startAnimation();
    }


    /* =========================================================
       HIDE
       ========================================================= */

    hide() {

        this.visible = false;
        this.isRunning = false;


        if (this.root) {

            this.root.classList.remove(
                'is-visible'
            );

        }


        if (this.animationFrame) {

            cancelAnimationFrame(
                this.animationFrame
            );

            this.animationFrame = null;

        }
    }


    /* =========================================================
       START ANIMATION
       ========================================================= */

    startAnimation() {

        if (this.animationFrame) {

            cancelAnimationFrame(
                this.animationFrame
            );

        }


        const animate = () => {

            if (!this.visible) {
                return;
            }


            this.animationFrame =
                requestAnimationFrame(
                    animate
                );


            this.update(
                0.016
            );


            this.render();

        };


        animate();
    }


    /* =========================================================
       UPDATE
       ========================================================= */

    update(delta) {

        if (!this.visible) {
            return;
        }


        this.elapsed += delta;


        this.updateCloudCollapse();

        this.updateAccretionDisk();

        this.updateFusion();

        this.updateFinalStar();

        this.updateEnergyRings();

        this.updateVisuals();
    }


    /* =========================================================
       CLOUD COLLAPSE
       ========================================================= */

    updateCloudCollapse() {

        if (
            !this.starCloud ||
            !this.cloudBasePositions
        ) {
            return;
        }


        const positions =
            this.starCloud.geometry
                .attributes
                .position;


        let collapse = 0;


        if (this.currentPhase === 1) {

            collapse = 0.38;

        } else if (this.currentPhase === 2) {

            collapse = 0.72;

        } else if (this.currentPhase >= 3) {

            collapse = 0.9;

        }


        for (
            let i = 0;
            i < positions.count;
            i++
        ) {

            const ix = i * 3;

            const baseX =
                this.cloudBasePositions[ix];

            const baseY =
                this.cloudBasePositions[ix + 1];

            const baseZ =
                this.cloudBasePositions[ix + 2];


            let targetX =
                baseX *
                (1 - collapse);

            let targetY =
                baseY *
                (1 - collapse);

            let targetZ =
                baseZ *
                (1 - collapse);


            /* ---------------------------------------------
               Flatten material into an accretion structure
            --------------------------------------------- */

            if (collapse > 0.55) {

                targetY *=
                    1 -
                    (
                        (collapse - 0.55)
                        * 1.6
                    );

            }


            positions.array[ix] +=
                (
                    targetX -
                    positions.array[ix]
                ) * 0.035;


            positions.array[ix + 1] +=
                (
                    targetY -
                    positions.array[ix + 1]
                ) * 0.035;


            positions.array[ix + 2] +=
                (
                    targetZ -
                    positions.array[ix + 2]
                ) * 0.035;

        }


        positions.needsUpdate = true;
    }


    /* =========================================================
       ACCRETION DISK
       ========================================================= */

    updateAccretionDisk() {

        if (!this.accretionDisk) {
            return;
        }


        this.accretionDisk.rotation.z +=
            0.004;


        const material =
            this.accretionDisk.material;


        let opacity = 0;


        if (this.currentPhase === 1) {

            opacity = 0.06;

        } else if (this.currentPhase === 2) {

            opacity = 0.22;

        } else if (this.currentPhase === 3) {

            opacity = 0.42;

        } else if (this.currentPhase === 4) {

            opacity = 0.2;

        }


        material.opacity = opacity;
    }


    /* =========================================================
       FUSION
       ========================================================= */

    updateFusion() {

        if (!this.fusionParticles) {
            return;
        }


        this.fusionParticles.rotation.y +=
            0.01;


        this.fusionParticles.rotation.x +=
            0.004;


        const material =
            this.fusionParticles.material;


        if (this.currentPhase < 3) {

            material.opacity = 0;

            return;
        }


        if (this.currentPhase === 3) {

            material.opacity =
                0.55 +
                Math.sin(
                    this.elapsed * 4
                ) * 0.15;

        } else {

            material.opacity =
                0.25 +
                Math.sin(
                    this.elapsed * 2
                ) * 0.08;

        }
    }


    /* =========================================================
       FINAL STAR
       ========================================================= */

    updateFinalStar() {

        if (
            !this.finalStar ||
            !this.finalGlow ||
            !this.finalHalo
        ) {
            return;
        }


        if (this.currentPhase < 4) {

            this.finalStar.material.opacity =
                0;

            this.finalGlow.material.opacity =
                0;

            this.finalHalo.material.opacity =
                0;

            return;
        }


        const pulse =
            1 +
            Math.sin(
                this.elapsed * 2
            ) * 0.035;


        this.finalStar.scale.setScalar(
            pulse
        );


        this.finalGlow.scale.setScalar(
            1.25 * pulse
        );


        this.finalHalo.scale.setScalar(
            1.5 * pulse
        );


        this.finalStar.material.opacity =
            1;


        this.finalGlow.material.opacity =
            0.28 +
            Math.sin(
                this.elapsed * 2
            ) * 0.04;


        this.finalHalo.material.opacity =
            0.08 +
            Math.sin(
                this.elapsed * 1.5
            ) * 0.02;
    }


    /* =========================================================
       ENERGY RINGS
       ========================================================= */

    updateEnergyRings() {

        const active =
            this.currentPhase === 3;


        this.energyRings.forEach(
            (ring, index) => {

                if (!active) {

                    ring.material.opacity =
                        0;

                    return;

                }


                const pulse =
                    (
                        Math.sin(
                            this.elapsed * 3 +
                            ring.userData.offset
                        ) +
                        1
                    ) * 0.5;


                ring.material.opacity =
                    0.05 +
                    pulse * 0.08;


                ring.scale.setScalar(
                    1 +
                    pulse * 0.12
                );


                ring.rotation.z +=
                    0.004 *
                    (index + 1);

            }
        );
    }


    /* =========================================================
       VISUAL PHASE STATE
       ========================================================= */

    updateVisuals() {

        const phase =
            this.currentPhase;


        /* -------------------------------------------------
           CLOUD
        ------------------------------------------------- */

        if (this.starCloud) {

            let opacity = 0.68;


            if (phase === 1) {
                opacity = 0.48;
            }

            if (phase === 2) {
                opacity = 0.28;
            }

            if (phase === 3) {
                opacity = 0.12;
            }

            if (phase === 4) {
                opacity = 0.05;
            }


            this.starCloud.material.opacity =
                opacity;


            this.starCloud.rotation.y +=
                0.0008;

        }


        /* -------------------------------------------------
           PROTOSTAR
        ------------------------------------------------- */

        if (
            this.core &&
            this.coreGlow
        ) {

            let scale = 0.1;
            let opacity = 0;


            if (phase === 1) {

                scale = 0.32;
                opacity = 0.18;

            } else if (phase === 2) {

                scale =
                    0.58 +
                    Math.sin(
                        this.elapsed * 2
                    ) * 0.025;

                opacity = 0.48;

            } else if (phase === 3) {

                scale =
                    0.82 +
                    Math.sin(
                        this.elapsed * 4
                    ) * 0.05;

                opacity = 0.72;

            } else if (phase === 4) {

                scale = 0.35;
                opacity = 0;

            }


            this.core.scale.setScalar(
                scale
            );


            this.core.material.opacity =
                opacity;


            this.coreGlow.scale.setScalar(
                scale * 1.25
            );


            this.coreGlow.material.opacity =
                opacity * 0.22;

        }


        /* -------------------------------------------------
           OUTFLOW
        ------------------------------------------------- */

        if (this.outflow) {

            let opacity = 0;


            if (phase === 2) {
                opacity = 0.05;
            }

            if (phase === 3) {
                opacity = 0.22;
            }

            if (phase === 4) {
                opacity = 0.14;
            }


            this.outflow.material.opacity =
                opacity;


            this.outflow.rotation.y =
                Math.sin(
                    this.elapsed * 0.5
                ) * 0.035;

        }


        /* -------------------------------------------------
           FINAL STAR
        ------------------------------------------------- */

        if (phase === 4) {

            if (this.accretionDisk) {

                this.accretionDisk.material.opacity =
                    0.12;

            }

        }


        this.updateInformation();
    }


    /* =========================================================
       NEXT PHASE
       ========================================================= */

    nextPhase() {

        if (
            this.currentPhase >=
            this.phaseCount - 1
        ) {
            return;
        }


        this.currentPhase++;

        this.elapsed = 0;


        this.updateVisuals();

        this.updateInformation();
    }


    /* =========================================================
       RESET
       ========================================================= */

    reset() {

        this.currentPhase = 0;

        this.elapsed = 0;


        this.restoreCloud();


        this.updateVisuals();

        this.updateInformation();
    }


    /* =========================================================
       RESTORE CLOUD
       ========================================================= */

    restoreCloud() {

        if (
            !this.starCloud ||
            !this.cloudBasePositions
        ) {
            return;
        }


        const positions =
            this.starCloud.geometry
                .attributes
                .position;


        for (
            let i = 0;
            i < positions.count;
            i++
        ) {

            const ix = i * 3;


            positions.array[ix] =
                this.cloudBasePositions[ix];


            positions.array[ix + 1] =
                this.cloudBasePositions[ix + 1];


            positions.array[ix + 2] =
                this.cloudBasePositions[ix + 2];

        }


        positions.needsUpdate = true;
    }


    /* =========================================================
       INFORMATION
       ========================================================= */

    updateInformation() {

        if (!this.root) {
            return;
        }


        const phaseKey =
            this.phaseKeys[
                this.currentPhase
            ];


        const title =
            t(
                `astronomyWorld.stellar.birth.phases.${phaseKey}.title`
            );


        const description =
            t(
                `astronomyWorld.stellar.birth.phases.${phaseKey}.description`
            );


        const titleElement =
            this.root.querySelector(
                '#star-birth-phase-title'
            );


        const descriptionElement =
            this.root.querySelector(
                '#star-birth-phase-description'
            );


        const numberElement =
            this.root.querySelector(
                '.star-birth-phase-number'
            );


        const continueButton =
            this.root.querySelector(
                '#star-birth-continue'
            );


        if (titleElement) {

            titleElement.textContent =
                title;

        }


        if (descriptionElement) {

            descriptionElement.textContent =
                description;

        }


        if (numberElement) {

            numberElement.textContent =
                String(
                    this.currentPhase + 1
                ).padStart(
                    2,
                    '0'
                );

        }


        if (continueButton) {

            const last =
                this.currentPhase >=
                this.phaseCount - 1;


            continueButton.textContent =
                t(
                    last
                        ? 'astronomyWorld.stellar.birth.replay'
                        : 'astronomyWorld.stellar.birth.continue'
                );

        }
    }


    /* =========================================================
       LANGUAGE
       ========================================================= */

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


    /* =========================================================
       RESIZE
       ========================================================= */

    resize() {

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


    /* =========================================================
       RENDER
       ========================================================= */

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


    /* =========================================================
       CLOSE
       ========================================================= */

    close() {

        this.hide();


        if (
            this.parent &&
            typeof this.parent.returnToStellarWorld ===
                'function'
        ) {

            window.setTimeout(
                () => {

                    if (this.parent) {

                        this.parent.returnToStellarWorld();

                    }

                },
                500
            );
        }
    }


    /* =========================================================
       SET SCENE
       ========================================================= */

    setScene(scene) {

        this.scene = scene;
    }


    /* =========================================================
       DESTROY
       ========================================================= */

    destroy() {

        this.hide();


        window.removeEventListener(
            'resize',
            this.boundResize
        );


        /* -------------------------------------------------
           CLOUD
        ------------------------------------------------- */

        if (this.starCloud) {

            this.starCloud.geometry.dispose();

            this.starCloud.material.dispose();

            this.threeScene.remove(
                this.starCloud
            );

            this.starCloud = null;
        }


        /* -------------------------------------------------
           CORE
        ------------------------------------------------- */

        if (this.core) {

            this.core.geometry.dispose();

            this.core.material.dispose();

            this.threeScene.remove(
                this.core
            );

            this.core = null;
        }


        if (this.coreGlow) {

            this.coreGlow.geometry.dispose();

            this.coreGlow.material.dispose();

            this.threeScene.remove(
                this.coreGlow
            );

            this.coreGlow = null;
        }


        /* -------------------------------------------------
           ACCRETION DISK
        ------------------------------------------------- */

        if (this.accretionDisk) {

            this.accretionDisk.geometry.dispose();

            this.accretionDisk.material.dispose();

            this.threeScene.remove(
                this.accretionDisk
            );

            this.accretionDisk = null;
        }


        /* -------------------------------------------------
           FUSION
        ------------------------------------------------- */

        if (this.fusionParticles) {

            this.fusionParticles.geometry.dispose();

            this.fusionParticles.material.dispose();

            this.threeScene.remove(
                this.fusionParticles
            );

            this.fusionParticles = null;
        }


        /* -------------------------------------------------
           OUTFLOW
        ------------------------------------------------- */

        if (this.outflow) {

            this.outflow.geometry.dispose();

            this.outflow.material.dispose();

            this.threeScene.remove(
                this.outflow
            );

            this.outflow = null;
        }


        /* -------------------------------------------------
           FINAL STAR
        ------------------------------------------------- */

        if (this.finalStar) {

            this.finalStar.geometry.dispose();

            this.finalStar.material.dispose();

            this.threeScene.remove(
                this.finalStar
            );

            this.finalStar = null;
        }


        if (this.finalGlow) {

            this.finalGlow.geometry.dispose();

            this.finalGlow.material.dispose();

            this.threeScene.remove(
                this.finalGlow
            );

            this.finalGlow = null;
        }


        if (this.finalHalo) {

            this.finalHalo.geometry.dispose();

            this.finalHalo.material.dispose();

            this.threeScene.remove(
                this.finalHalo
            );

            this.finalHalo = null;
        }


        /* -------------------------------------------------
           ENERGY RINGS
        ------------------------------------------------- */

        this.energyRings.forEach(
            ring => {

                ring.geometry.dispose();

                ring.material.dispose();

                this.threeScene.remove(
                    ring
                );

            }
        );


        this.energyRings = [];


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
           RESET REFERENCES
        ------------------------------------------------- */

        this.canvasContainer = null;

        this.threeScene = null;
        this.camera = null;

        this.cloudPositions = null;
        this.cloudBasePositions = null;

        this.parent = null;
        this.scene = null;

        this.visible = false;
        this.isRunning = false;
    }
}