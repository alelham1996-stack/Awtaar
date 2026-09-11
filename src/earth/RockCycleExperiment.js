/* =========================================================
   AWTAAR — ROCK CYCLE EXPERIMENT
   ========================================================= */

import * as THREE from 'three';


export default class RockCycleExperiment {

    constructor(scene = null, parent = null) {

        this.scene = scene;
        this.parent = parent;

        this.container = null;
        this.canvas = null;

        this.renderer = null;
        this.camera = null;

        this.root = null;

        this.isRunning = true;
        this.elapsed = 0;

        this.animationFrame = null;

        this.clock = new THREE.Clock();

        /* -------------------------------------------------
           CYCLE STATE
        ------------------------------------------------- */

        this.currentStage = 0;
        this.stageProgress = 0;

        this.stageDuration = 4.2;

        /*
         * The cycle is deliberately divided into
         * visible geological transformations.
         */
        this.stageNames = [
            'الصهارة',
            'الصخور النارية',
            'التجوية والتعرية',
            'الرواسب',
            'الصخور الرسوبية',
            'الحرارة والضغط',
            'الصخور المتحولة',
            'الانصهار'
        ];

        this.stageNamesEnglish = [
            'Magma',
            'Igneous Rock',
            'Weathering & Erosion',
            'Sediments',
            'Sedimentary Rock',
            'Heat & Pressure',
            'Metamorphic Rock',
            'Melting'
        ];

        this.stageDescriptions = [
            'صخور منصهرة شديدة الحرارة توجد في باطن الأرض.',
            'تتكون عندما تبرد الصهارة وتتصلب لتصبح صخرًا ناريًا.',
            'تتفكك الصخور بفعل الماء والرياح والجليد وعوامل التجوية.',
            'تنتقل الفتات الصخرية وتتراكم لتكوّن الرواسب.',
            'تتراكم الرواسب وتتماسك بفعل الضغط والتصخر.',
            'تتعرض الصخور لحرارة وضغط مرتفعين فتتغير بنيتها دون انصهار كامل.',
            'تتحول الصخور إلى صخور متحولة نتيجة الحرارة والضغط.',
            'تنصهر الصخور عند درجات حرارة مرتفعة وتعود إلى حالة الصهارة.'
        ];

        this.stageDescriptionsEnglish = [
            'Hot molten rock found deep inside Earth.',
            'Forms when magma cools and solidifies into igneous rock.',
            'Rocks are broken down by water, wind, ice, and weathering.',
            'Rock fragments are transported and accumulate as sediments.',
            'Sediments accumulate and become compacted and cemented.',
            'Heat and pressure transform rock without completely melting it.',
            'Rock becomes metamorphic through heat and pressure.',
            'Rock melts at high temperatures and returns to magma.'
        ];


        /* -------------------------------------------------
           MAIN OBJECTS
        ------------------------------------------------- */

        this.materialObject = null;

        this.materialRock = null;
        this.materialFragments = [];
        this.materialLayers = [];

        this.magmaPool = null;
        this.magmaGlow = null;

        this.transformationGroup = null;

        this.environmentObjects = [];

        this.ground = null;
        this.atmosphere = null;

        this.stageMarker = null;
        this.stageMarkerRing = null;

        this.transitionParticles = [];

        this.heatWaves = [];

        this.pressureRings = [];

        this.waterParticles = [];

        this.windParticles = [];

        this.sedimentParticles = [];

        this.meltingParticles = [];

        this.lastStage = -1;

        this.create();
    }


    /* =====================================================
       CREATE
       ===================================================== */

    create() {

        this.createContainer();

        this.createScene();

        this.createEnvironment();

        this.createTransformationObject();

        this.createStageMarker();

        this.animate();
    }


    /* =====================================================
       CONTAINER
       ===================================================== */

    createContainer() {

        this.container =
            document.createElement('div');

        this.container.id =
            'awtaar-rock-cycle-experiment';

        this.container.style.position =
            'absolute';

        this.container.style.inset =
            '0';

        this.container.style.width =
            '100%';

        this.container.style.height =
            '100%';

        this.container.style.overflow =
            'hidden';

        this.container.style.pointerEvents =
            'none';

        this.container.style.zIndex =
            '20';

        if (this.parent) {

            this.parent.appendChild(
                this.container
            );

        } else {

            document.body.appendChild(
                this.container
            );
        }
    }


    /* =====================================================
       THREE.JS SCENE
       ===================================================== */

    createScene() {

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

        this.renderer.setSize(
            this.container.clientWidth ||
            window.innerWidth,

            this.container.clientHeight ||
            window.innerHeight
        );

        this.renderer.outputColorSpace =
            THREE.SRGBColorSpace;

        this.renderer.setClearColor(
            0x000000,
            0
        );

        this.canvas =
            this.renderer.domElement;

        this.canvas.style.position =
            'absolute';

        this.canvas.style.inset =
            '0';

        this.canvas.style.width =
            '100%';

        this.canvas.style.height =
            '100%';

        this.canvas.style.pointerEvents =
            'none';

        this.container.appendChild(
            this.canvas
        );


        this.camera =
            new THREE.PerspectiveCamera(
                42,
                1,
                0.1,
                100
            );

        this.camera.position.set(
            0,
            0.4,
            15
        );

        this.camera.lookAt(
            0,
            0,
            0
        );


        this.root =
            new THREE.Group();

        this.scene =
            this.scene ||
            new THREE.Scene();

        this.scene.add(
            this.root
        );


        /* -------------------------------------------------
           LIGHTING
        ------------------------------------------------- */

        const ambientLight =
            new THREE.AmbientLight(
                0xffead0,
                1.8
            );

        this.root.add(
            ambientLight
        );


        const warmLight =
            new THREE.PointLight(
                0xff9d3d,
                4.2,
                28
            );

        warmLight.position.set(
            0,
            -1.5,
            5
        );

        this.root.add(
            warmLight
        );


        const upperLight =
            new THREE.PointLight(
                0xffd79a,
                2.4,
                24
            );

        upperLight.position.set(
            -5,
            5,
            4
        );

        this.root.add(
            upperLight
        );


        const coolLight =
            new THREE.PointLight(
                0x8a9db8,
                1.1,
                22
            );

        coolLight.position.set(
            5,
            2,
            2
        );

        this.root.add(
            coolLight
        );


        window.addEventListener(
            'resize',
            this.handleResize
        );
    }


    /* =====================================================
       ENVIRONMENT
       ===================================================== */

    createEnvironment() {

        /* -------------------------------------------------
           GROUND
        ------------------------------------------------- */

        const groundGeometry =
            new THREE.CircleGeometry(
                7.8,
                96
            );

        const groundMaterial =
            new THREE.MeshBasicMaterial({

                color: 0x24180f,

                transparent: true,

                opacity: 0.48,

                side: THREE.DoubleSide
            });

        this.ground =
            new THREE.Mesh(
                groundGeometry,
                groundMaterial
            );

        this.ground.scale.y =
            0.42;

        this.ground.position.set(
            0,
            -3.15,
            -1.5
        );

        this.root.add(
            this.ground
        );


        /* -------------------------------------------------
           GROUND RINGS
        ------------------------------------------------- */

        for (let i = 0; i < 3; i++) {

            const geometry =
                new THREE.RingGeometry(
                    3.0 + i * 1.2,
                    3.02 + i * 1.2,
                    96
                );

            const material =
                new THREE.MeshBasicMaterial({

                    color:
                        i === 0
                            ? 0xb07a42
                            : 0x745331,

                    transparent: true,

                    opacity:
                        0.16 -
                        i * 0.035,

                    side:
                        THREE.DoubleSide
                });

            const ring =
                new THREE.Mesh(
                    geometry,
                    material
                );

            ring.scale.y =
                0.34;

            ring.position.set(
                0,
                -2.95,
                -1
            );

            this.root.add(
                ring
            );

            this.environmentObjects.push(
                ring
            );
        }


        /* -------------------------------------------------
           ATMOSPHERIC DUST
        ------------------------------------------------- */

        const dustGeometry =
            new THREE.BufferGeometry();

        const dustCount = 220;

        const dustPositions =
            new Float32Array(
                dustCount * 3
            );

        for (
            let i = 0;
            i < dustCount;
            i++
        ) {

            const angle =
                Math.random() *
                Math.PI *
                2;

            const radius =
                2 +
                Math.random() * 7;

            dustPositions[
                i * 3
            ] =
                Math.cos(angle) *
                radius;

            dustPositions[
                i * 3 + 1
            ] =
                -1 +
                Math.random() * 6;

            dustPositions[
                i * 3 + 2
            ] =
                -1 +
                Math.random() * 2;
        }

        dustGeometry.setAttribute(
            'position',

            new THREE.BufferAttribute(
                dustPositions,
                3
            )
        );

        const dustMaterial =
            new THREE.PointsMaterial({

                color: 0xd1ad72,

                size: 0.028,

                transparent: true,

                opacity: 0.28,

                depthWrite: false
            });

        const dust =
            new THREE.Points(
                dustGeometry,
                dustMaterial
            );

        this.root.add(
            dust
        );

        this.environmentObjects.push(
            dust
        );


        /* -------------------------------------------------
           WATER PARTICLES
        ------------------------------------------------- */

        for (
            let i = 0;
            i < 30;
            i++
        ) {

            const geometry =
                new THREE.SphereGeometry(
                    0.025,
                    6,
                    6
                );

            const material =
                new THREE.MeshBasicMaterial({

                    color: 0x9dbfd0,

                    transparent: true,

                    opacity: 0
                });

            const particle =
                new THREE.Mesh(
                    geometry,
                    material
                );

            particle.position.set(
                -2.4 +
                    Math.random() * 4.8,

                -0.4 +
                    Math.random() * 2.5,

                0.5 +
                    Math.random() * 0.5
            );

            particle.userData.baseY =
                particle.position.y;

            this.root.add(
                particle
            );

            this.waterParticles.push(
                particle
            );
        }


        /* -------------------------------------------------
           WIND PARTICLES
        ------------------------------------------------- */

        for (
            let i = 0;
            i < 22;
            i++
        ) {

            const geometry =
                new THREE.SphereGeometry(
                    0.018,
                    6,
                    6
                );

            const material =
                new THREE.MeshBasicMaterial({

                    color: 0xd7c4a0,

                    transparent: true,

                    opacity: 0
                });

            const particle =
                new THREE.Mesh(
                    geometry,
                    material
                );

            particle.position.set(
                -5 +
                    Math.random() * 10,

                0.4 +
                    Math.random() * 3,

                0.3 +
                    Math.random() * 0.4
            );

            particle.userData.speed =
                0.5 +
                Math.random() * 0.8;

            this.root.add(
                particle
            );

            this.windParticles.push(
                particle
            );
        }
    }


    /* =====================================================
       MAIN TRANSFORMATION OBJECT
       ===================================================== */

    createTransformationObject() {

        this.transformationGroup =
            new THREE.Group();

        this.transformationGroup.position.set(
            0,
            0.2,
            1
        );

        this.root.add(
            this.transformationGroup
        );


        /* -------------------------------------------------
           ROCK
        ------------------------------------------------- */

        const rockGeometry =
            new THREE.IcosahedronGeometry(
                1.0,
                2
            );

        const rockMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x9a7655,

                roughness: 0.88,

                metalness: 0.03
            });

        this.materialRock =
            new THREE.Mesh(
                rockGeometry,
                rockMaterial
            );

        this.materialRock.rotation.set(
            0.25,
            0.45,
            0.1
        );

        this.transformationGroup.add(
            this.materialRock
        );


        /* -------------------------------------------------
           MAGMA
        ------------------------------------------------- */

        const magmaGeometry =
            new THREE.SphereGeometry(
                1.05,
                40,
                40
            );

        const magmaMaterial =
            new THREE.MeshStandardMaterial({

                color: 0xff6b20,

                emissive: 0xff3b08,

                emissiveIntensity: 2.4,

                roughness: 0.25,

                metalness: 0.02
            });

        this.magmaPool =
            new THREE.Mesh(
                magmaGeometry,
                magmaMaterial
            );

        this.magmaPool.scale.set(
            0.92,
            0.72,
            0.92
        );

        this.magmaPool.visible =
            false;

        this.transformationGroup.add(
            this.magmaPool
        );


        /* -------------------------------------------------
           MAGMA GLOW
        ------------------------------------------------- */

        const glowGeometry =
            new THREE.SphereGeometry(
                1.25,
                32,
                32
            );

        const glowMaterial =
            new THREE.MeshBasicMaterial({

                color: 0xff6320,

                transparent: true,

                opacity: 0.13,

                depthWrite: false
            });

        this.magmaGlow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            );

        this.magmaGlow.visible =
            false;

        this.transformationGroup.add(
            this.magmaGlow
        );


        /* -------------------------------------------------
           ROCK LAYERS
        ------------------------------------------------- */

        for (
            let i = 0;
            i < 4;
            i++
        ) {

            const geometry =
                new THREE.TorusGeometry(
                    0.7 +
                        i * 0.12,

                    0.035,

                    8,

                    40
                );

            const material =
                new THREE.MeshBasicMaterial({

                    color:
                        i % 2 === 0
                            ? 0xb88856
                            : 0x69503b,

                    transparent: true,

                    opacity: 0
                });

            const layer =
                new THREE.Mesh(
                    geometry,
                    material
                );

            layer.rotation.x =
                Math.PI * 0.5;

            this.transformationGroup.add(
                layer
            );

            this.materialLayers.push(
                layer
            );
        }


        /* -------------------------------------------------
           FRAGMENTS
        ------------------------------------------------- */

        for (
            let i = 0;
            i < 42;
            i++
        ) {

            const size =
                0.035 +
                Math.random() * 0.07;

            const geometry =
                new THREE.DodecahedronGeometry(
                    size,
                    0
                );

            const material =
                new THREE.MeshStandardMaterial({

                    color:
                        i % 3 === 0
                            ? 0xc19a69
                            : i % 3 === 1
                                ? 0x8e7157
                                : 0xd0b083,

                    roughness: 0.95
                });

            const fragment =
                new THREE.Mesh(
                    geometry,
                    material
                );

            const angle =
                Math.random() *
                Math.PI *
                2;

            const radius =
                0.8 +
                Math.random() * 1.2;

            fragment.position.set(
                Math.cos(angle) *
                    radius,

                Math.sin(angle) *
                    radius *
                    0.55,

                0.2 +
                    Math.random() *
                    0.5
            );

            fragment.userData.basePosition =
                fragment.position.clone();

            fragment.userData.phase =
                Math.random() *
                Math.PI *
                2;

            fragment.userData.radius =
                radius;

            fragment.visible =
                false;

            this.transformationGroup.add(
                fragment
            );

            this.materialFragments.push(
                fragment
            );
        }


        /* -------------------------------------------------
           TRANSFORMATION PARTICLES
        ------------------------------------------------- */

        for (
            let i = 0;
            i < 60;
            i++
        ) {

            const geometry =
                new THREE.SphereGeometry(
                    0.025 +
                        Math.random() * 0.025,

                    6,
                    6
                );

            const material =
                new THREE.MeshBasicMaterial({

                    color: 0xf0c77b,

                    transparent: true,

                    opacity: 0
                });

            const particle =
                new THREE.Mesh(
                    geometry,
                    material
                );

            particle.userData.angle =
                Math.random() *
                Math.PI *
                2;

            particle.userData.radius =
                0.8 +
                Math.random() * 1.5;

            particle.userData.speed =
                0.3 +
                Math.random() * 0.8;

            particle.userData.height =
                -0.8 +
                Math.random() * 1.8;

            this.transformationGroup.add(
                particle
            );

            this.transitionParticles.push(
                particle
            );
        }


        /* -------------------------------------------------
           HEAT WAVES
        ------------------------------------------------- */

        for (
            let i = 0;
            i < 4;
            i++
        ) {

            const geometry =
                new THREE.RingGeometry(
                    0.7 +
                        i * 0.35,

                    0.73 +
                        i * 0.35,

                    48
                );

            const material =
                new THREE.MeshBasicMaterial({

                    color: 0xff9b3d,

                    transparent: true,

                    opacity: 0,

                    side: THREE.DoubleSide
                });

            const ring =
                new THREE.Mesh(
                    geometry,
                    material
                );

            ring.position.z =
                -0.1;

            ring.scale.y =
                0.45;

            this.transformationGroup.add(
                ring
            );

            this.heatWaves.push(
                ring
            );
        }


        /* -------------------------------------------------
           PRESSURE RINGS
        ------------------------------------------------- */

        for (
            let i = 0;
            i < 3;
            i++
        ) {

            const geometry =
                new THREE.TorusGeometry(
                    1.3 +
                        i * 0.35,

                    0.025,

                    8,

                    48
                );

            const material =
                new THREE.MeshBasicMaterial({

                    color: 0xd5a965,

                    transparent: true,

                    opacity: 0
                });

            const ring =
                new THREE.Mesh(
                    geometry,
                    material
                );

            ring.rotation.x =
                Math.PI * 0.5;

            this.transformationGroup.add(
                ring
            );

            this.pressureRings.push(
                ring
            );
        }


        /* -------------------------------------------------
           SEDIMENT PARTICLES
        ------------------------------------------------- */

        for (
            let i = 0;
            i < 45;
            i++
        ) {

            const geometry =
                new THREE.SphereGeometry(
                    0.035 +
                        Math.random() * 0.04,

                    6,
                    6
                );

            const material =
                new THREE.MeshStandardMaterial({

                    color:
                        0x9a7b59,

                    roughness:
                        1
                });

            const particle =
                new THREE.Mesh(
                    geometry,
                    material
                );

            particle.position.set(
                -1.5 +
                    Math.random() * 3,

                -1.0 +
                    Math.random() * 1.6,

                0.4 +
                    Math.random() * 0.4
            );

            particle.userData.targetY =
                -0.5 +
                Math.random() * 0.7;

            particle.visible =
                false;

            this.transformationGroup.add(
                particle
            );

            this.sedimentParticles.push(
                particle
            );
        }


        /* -------------------------------------------------
           MELTING PARTICLES
        ------------------------------------------------- */

        for (
            let i = 0;
            i < 32;
            i++
        ) {

            const geometry =
                new THREE.SphereGeometry(
                    0.025 +
                        Math.random() * 0.035,

                    6,
                    6
                );

            const material =
                new THREE.MeshBasicMaterial({

                    color: 0xff6b20,

                    transparent: true,

                    opacity: 0
                });

            const particle =
                new THREE.Mesh(
                    geometry,
                    material
                );

            particle.userData.phase =
                Math.random() *
                Math.PI *
                2;

            particle.userData.radius =
                0.4 +
                Math.random() * 0.9;

            this.transformationGroup.add(
                particle
            );

            this.meltingParticles.push(
                particle
            );
        }
    }


    /* =====================================================
       STAGE MARKER
       ===================================================== */

    createStageMarker() {

        const group =
            new THREE.Group();

        group.position.set(
            0,
            -2.1,
            0.6
        );


        const ringGeometry =
            new THREE.RingGeometry(
                0.7,
                0.73,
                64
            );

        const ringMaterial =
            new THREE.MeshBasicMaterial({

                color: 0xd2a866,

                transparent: true,

                opacity: 0.45,

                side: THREE.DoubleSide
            });

        const ring =
            new THREE.Mesh(
                ringGeometry,
                ringMaterial
            );

        ring.scale.y =
            0.28;

        group.add(
            ring
        );


        const coreGeometry =
            new THREE.CircleGeometry(
                0.55,
                48
            );

        const coreMaterial =
            new THREE.MeshBasicMaterial({

                color: 0x24170e,

                transparent: true,

                opacity: 0.65
            });

        const core =
            new THREE.Mesh(
                coreGeometry,
                coreMaterial
            );

        core.scale.y =
            0.28;

        group.add(
            core
        );


        this.stageMarker =
            group;

        this.stageMarkerRing =
            ring;

        this.root.add(
            group
        );
    }


    /* =====================================================
       STAGE VISUAL RESET
       ===================================================== */

    resetVisualState() {

        if (this.materialRock) {

            this.materialRock.visible =
                false;

            this.materialRock.scale.setScalar(
                1
            );
        }


        if (this.magmaPool) {

            this.magmaPool.visible =
                false;

            this.magmaPool.scale.set(
                0.92,
                0.72,
                0.92
            );
        }


        if (this.magmaGlow) {

            this.magmaGlow.visible =
                false;
        }


        this.materialFragments.forEach(
            fragment => {

                fragment.visible =
                    false;
            }
        );


        this.materialLayers.forEach(
            layer => {

                layer.material.opacity =
                    0;
            }
        );


        this.transitionParticles.forEach(
            particle => {

                particle.material.opacity =
                    0;
            }
        );


        this.heatWaves.forEach(
            ring => {

                ring.material.opacity =
                    0;
            }
        );


        this.pressureRings.forEach(
            ring => {

                ring.material.opacity =
                    0;
            }
        );


        this.sedimentParticles.forEach(
            particle => {

                particle.visible =
                    false;
            }
        );


        this.meltingParticles.forEach(
            particle => {

                particle.material.opacity =
                    0;
            }
        );


        this.waterParticles.forEach(
            particle => {

                particle.material.opacity =
                    0;
            }
        );


        this.windParticles.forEach(
            particle => {

                particle.material.opacity =
                    0;
            }
        );
    }


    /* =====================================================
       STAGE CHANGE
       ===================================================== */

    applyStage(stageIndex) {

        this.resetVisualState();

        this.currentStage =
            stageIndex;

        this.lastStage =
            stageIndex;


        switch (stageIndex) {

            case 0:
                this.showMagma();
                break;

            case 1:
                this.showIgneous();
                break;

            case 2:
                this.showWeathering();
                break;

            case 3:
                this.showSediments();
                break;

            case 4:
                this.showSedimentary();
                break;

            case 5:
                this.showHeatPressure();
                break;

            case 6:
                this.showMetamorphic();
                break;

            case 7:
                this.showMelting();
                break;

            default:
                this.showMagma();
                break;
        }
    }


    /* =====================================================
       STAGE 1 — MAGMA
       ===================================================== */

    showMagma() {

        this.magmaPool.visible =
            true;

        this.magmaGlow.visible =
            true;

        this.magmaPool.scale.set(
            0.95,
            0.68,
            0.95
        );

        this.magmaPool.material.color.set(
            0xff6b20
        );

        this.magmaPool.material.emissive.set(
            0xff3508
        );

        this.magmaGlow.material.opacity =
            0.16;

        this.magmaPool.position.y =
            -0.2;

        this.transformationGroup.position.y =
            0.2;
    }


    /* =====================================================
       STAGE 2 — IGNEOUS
       ===================================================== */

    showIgneous() {

        this.materialRock.visible =
            true;

        this.materialRock.material.color.set(
            0x5c5148
        );

        this.materialRock.material.roughness =
            0.92;

        this.materialRock.scale.setScalar(
            1.0
        );

        this.transformationGroup.position.y =
            0.35;
    }


    /* =====================================================
       STAGE 3 — WEATHERING
       ===================================================== */

    showWeathering() {

        this.materialRock.visible =
            true;

        this.materialRock.material.color.set(
            0x826b55
        );

        this.materialRock.scale.setScalar(
            0.96
        );


        this.materialFragments.forEach(
            (fragment, index) => {

                fragment.visible =
                    true;

                const p =
                    fragment.userData
                        .basePosition;

                fragment.position.copy(
                    p
                );

                fragment.scale.setScalar(
                    0.35 +
                    (index % 4) * 0.08
                );
            }
        );


        this.waterParticles.forEach(
            particle => {

                particle.material.opacity =
                    0.55;
            }
        );


        this.windParticles.forEach(
            particle => {

                particle.material.opacity =
                    0.32;
            }
        );
    }


    /* =====================================================
       STAGE 4 — SEDIMENTS
       ===================================================== */

    showSediments() {

        this.materialRock.visible =
            false;


        this.sedimentParticles.forEach(
            particle => {

                particle.visible =
                    true;

                particle.material.color.set(
                    0xb18a61
                );
            }
        );


        this.transformationGroup.position.y =
            0.35;
    }


    /* =====================================================
       STAGE 5 — SEDIMENTARY
       ===================================================== */

    showSedimentary() {

        this.materialRock.visible =
            true;

        this.materialRock.material.color.set(
            0x9d805f
        );

        this.materialRock.material.roughness =
            1;


        this.materialLayers.forEach(
            (layer, index) => {

                layer.material.opacity =
                    0.55;

                layer.scale.setScalar(
                    0.92 +
                    index * 0.025
                );

                layer.position.y =
                    -0.45 +
                    index * 0.3;
            }
        );


        this.transformationGroup.position.y =
            0.45;
    }


    /* =====================================================
       STAGE 6 — HEAT & PRESSURE
       ===================================================== */

    showHeatPressure() {

        this.materialRock.visible =
            true;

        this.materialRock.material.color.set(
            0x86654d
        );


        this.heatWaves.forEach(
            (ring, index) => {

                ring.material.opacity =
                    0.12;

                ring.scale.setScalar(
                    0.7 +
                    index * 0.08
                );
            }
        );


        this.pressureRings.forEach(
            (ring, index) => {

                ring.material.opacity =
                    0.35 -
                    index * 0.06;
            }
        );


        this.transformationGroup.position.y =
            0.4;
    }


    /* =====================================================
       STAGE 7 — METAMORPHIC
       ===================================================== */

    showMetamorphic() {

        this.materialRock.visible =
            true;

        this.materialRock.material.color.set(
            0x665b57
        );

        this.materialRock.material.roughness =
            0.72;

        this.materialRock.scale.set(
            1.08,
            0.82,
            1.02
        );


        this.materialLayers.forEach(
            (layer, index) => {

                layer.material.opacity =
                    0.28;

                layer.rotation.z =
                    index * 0.35;
            }
        );


        this.pressureRings.forEach(
            ring => {

                ring.material.opacity =
                    0.18;
            }
        );


        this.transformationGroup.position.y =
            0.35;
    }


    /* =====================================================
       STAGE 8 — MELTING
       ===================================================== */

    showMelting() {

        this.materialRock.visible =
            true;

        this.materialRock.material.color.set(
            0xd15d28
        );

        this.materialRock.material.emissive.set(
            0x6b1908
        );

        this.materialRock.material.emissiveIntensity =
            1.5;


        this.magmaGlow.visible =
            true;

        this.magmaGlow.material.opacity =
            0.12;


        this.meltingParticles.forEach(
            particle => {

                particle.material.opacity =
                    0.65;
            }
        );


        this.heatWaves.forEach(
            ring => {

                ring.material.opacity =
                    0.22;
            }
        );


        this.transformationGroup.position.y =
            0.3;
    }


    /* =====================================================
       UPDATE
       ===================================================== */

    update(delta = null) {

        if (!this.root) return;


        if (delta === null) {

            delta =
                this.clock.getDelta();
        }


        if (!this.isRunning) {

            this.render();

            return;
        }


        this.elapsed += delta;


        /* -------------------------------------------------
           STAGE PROGRESS
        ------------------------------------------------- */

        this.stageProgress +=
            delta /
            this.stageDuration;


        if (this.stageProgress >= 1) {

            this.stageProgress = 0;

            this.currentStage =
                (
                    this.currentStage + 1
                ) %
                this.stageNames.length;

            this.applyStage(
                this.currentStage
            );
        }


        if (
            this.currentStage !==
            this.lastStage
        ) {

            this.applyStage(
                this.currentStage
            );
        }


        /* -------------------------------------------------
           MAIN OBJECT ANIMATION
        ------------------------------------------------- */

        this.updateMainObject(
            delta
        );


        /* -------------------------------------------------
           TRANSFORMATION PARTICLES
        ------------------------------------------------- */

        this.updateTransitionParticles(
            delta
        );


        /* -------------------------------------------------
           WATER
        ------------------------------------------------- */

        this.updateWater(
            delta
        );


        /* -------------------------------------------------
           WIND
        ------------------------------------------------- */

        this.updateWind(
            delta
        );


        /* -------------------------------------------------
           SEDIMENTS
        ------------------------------------------------- */

        this.updateSediments(
            delta
        );


        /* -------------------------------------------------
           HEAT
        ------------------------------------------------- */

        this.updateHeat(
            delta
        );


        /* -------------------------------------------------
           PRESSURE
        ------------------------------------------------- */

        this.updatePressure(
            delta
        );


        /* -------------------------------------------------
           MELTING
        ------------------------------------------------- */

        this.updateMelting(
            delta
        );


        /* -------------------------------------------------
           ENVIRONMENT
        ------------------------------------------------- */

        this.environmentObjects.forEach(
            (object, index) => {

                if (
                    object.isPoints ||
                    object.isMesh
                ) {

                    object.rotation.z +=
                        delta *
                        (
                            0.003 +
                            index * 0.001
                        );
                }
            }
        );


        /* -------------------------------------------------
           STAGE MARKER
        ------------------------------------------------- */

        if (this.stageMarkerRing) {

            const pulse =
                1 +
                Math.sin(
                    this.elapsed * 2.2
                ) * 0.07;

            this.stageMarkerRing
                .scale
                .set(
                    pulse,
                    pulse,
                    pulse
                );
        }


        this.render();
    }


    /* =====================================================
       MAIN OBJECT UPDATE
       ===================================================== */

    updateMainObject(delta) {

        if (!this.materialRock) return;


        const progress =
            this.stageProgress;


        /* -------------------------------------------------
           ROCK ROTATION
        ------------------------------------------------- */

        if (
            this.materialRock.visible
        ) {

            this.materialRock.rotation.y +=
                delta * 0.28;

            this.materialRock.rotation.x +=
                delta * 0.08;
        }


        /* -------------------------------------------------
           MAGMA MOTION
        ------------------------------------------------- */

        if (
            this.magmaPool &&
            this.magmaPool.visible
        ) {

            const pulse =
                1 +
                Math.sin(
                    this.elapsed * 2.8
                ) * 0.08;

            this.magmaPool.scale.set(
                0.95 * pulse,
                0.68 *
                    (
                        1 +
                        Math.sin(
                            this.elapsed * 2.4
                        ) * 0.06
                    ),
                0.95 * pulse
            );


            this.magmaPool.rotation.y +=
                delta * 0.18;


            if (this.magmaGlow) {

                this.magmaGlow.scale.setScalar(
                    1 +
                    Math.sin(
                        this.elapsed * 2
                    ) * 0.08
                );
            }
        }


        /* -------------------------------------------------
           WEATHERING BREAKDOWN
        ------------------------------------------------- */

        if (
            this.currentStage === 2 &&
            this.materialRock.visible
        ) {

            const breakAmount =
                Math.sin(
                    progress *
                    Math.PI
                );

            this.materialRock.scale.set(
                1 -
                    breakAmount * 0.16,

                1 -
                    breakAmount * 0.08,

                1 -
                    breakAmount * 0.16
            );
        }


        /* -------------------------------------------------
           SEDIMENTARY COMPRESSION
        ------------------------------------------------- */

        if (
            this.currentStage === 4
        ) {

            const compression =
                1 -
                Math.sin(
                    progress *
                    Math.PI
                ) * 0.12;

            this.materialRock.scale.y =
                compression;
        }


        /* -------------------------------------------------
           HEAT / PRESSURE
        ------------------------------------------------- */

        if (
            this.currentStage === 5
        ) {

            const deformation =
                Math.sin(
                    this.elapsed * 2.5
                ) * 0.04;

            this.materialRock.scale.set(
                1 +
                    deformation,

                0.92 -
                    deformation,

                1 +
                    deformation
            );
        }


        /* -------------------------------------------------
           METAMORPHIC
        ------------------------------------------------- */

        if (
            this.currentStage === 6
        ) {

            const pulse =
                1 +
                Math.sin(
                    this.elapsed * 1.8
                ) * 0.025;

            this.materialRock.scale.set(
                1.08 * pulse,
                0.82 * pulse,
                1.02 * pulse
            );
        }


        /* -------------------------------------------------
           MELTING
        ------------------------------------------------- */

        if (
            this.currentStage === 7
        ) {

            const melt =
                Math.sin(
                    progress *
                    Math.PI
                );

            this.materialRock.scale.set(
                1 +
                    melt * 0.18,

                1 -
                    melt * 0.28,

                1 +
                    melt * 0.12
            );


            this.materialRock.rotation.z =
                melt * 0.15;
        }
    }


    /* =====================================================
       TRANSITION PARTICLES
       ===================================================== */

    updateTransitionParticles(delta) {

        this.transitionParticles.forEach(
            particle => {

                const active =
                    (
                        this.currentStage === 0 ||
                        this.currentStage === 5 ||
                        this.currentStage === 7
                    );

                if (!active) {

                    particle.material.opacity =
                        THREE.MathUtils.lerp(
                            particle.material.opacity,
                            0,
                            0.08
                        );

                    return;
                }


                particle.material.opacity =
                    0.12 +
                    Math.sin(
                        this.elapsed *
                        particle.userData.speed *
                        2 +
                        particle.userData.phase
                    ) *
                    0.08;


                particle.userData.angle +=
                    delta *
                    particle.userData.speed;


                const radius =
                    particle.userData.radius;


                particle.position.set(

                    Math.cos(
                        particle.userData.angle
                    ) *
                    radius,

                    particle.userData.height +
                    Math.sin(
                        this.elapsed * 1.2 +
                        particle.userData.phase
                    ) *
                    0.18,

                    0.35 +
                    Math.sin(
                        particle.userData.angle
                    ) *
                    0.3
                );
            }
        );
    }


    /* =====================================================
       WATER UPDATE
       ===================================================== */

    updateWater(delta) {

        const active =
            this.currentStage === 2;


        this.waterParticles.forEach(
            particle => {

                const targetOpacity =
                    active
                        ? 0.55
                        : 0;

                particle.material.opacity =
                    THREE.MathUtils.lerp(
                        particle.material.opacity,
                        targetOpacity,
                        0.08
                    );


                if (active) {

                    particle.position.y =
                        particle.userData.baseY +
                        Math.sin(
                            this.elapsed * 1.5 +
                            particle.position.x
                        ) *
                        0.15;

                    particle.position.x +=
                        delta * 0.12;


                    if (
                        particle.position.x >
                        2.5
                    ) {

                        particle.position.x =
                            -2.5;
                    }
                }
            }
        );
    }


    /* =====================================================
       WIND UPDATE
       ===================================================== */

    updateWind(delta) {

        const active =
            this.currentStage === 2;


        this.windParticles.forEach(
            particle => {

                const targetOpacity =
                    active
                        ? 0.34
                        : 0;

                particle.material.opacity =
                    THREE.MathUtils.lerp(
                        particle.material.opacity,
                        targetOpacity,
                        0.08
                    );


                if (active) {

                    particle.position.x +=
                        delta *
                        particle.userData.speed;


                    particle.position.y +=
                        Math.sin(
                            this.elapsed +
                            particle.position.x
                        ) *
                        delta *
                        0.12;


                    if (
                        particle.position.x >
                        5
                    ) {

                        particle.position.x =
                            -5;
                    }
                }
            }
        );
    }


    /* =====================================================
       SEDIMENT UPDATE
       ===================================================== */

    updateSediments(delta) {

        const active =
            this.currentStage === 3 ||
            this.currentStage === 4;


        this.sedimentParticles.forEach(
            (particle, index) => {

                particle.visible =
                    active;


                if (!active) return;


                if (
                    this.currentStage === 3
                ) {

                    particle.position.y =
                        THREE.MathUtils.lerp(
                            particle.position.y,
                            particle.userData.targetY,
                            0.025
                        );

                } else {

                    const targetY =
                        -0.45 +
                        (
                            index % 5
                        ) *
                        0.16;

                    particle.position.y =
                        THREE.MathUtils.lerp(
                            particle.position.y,
                            targetY,
                            0.035
                        );
                }


                particle.rotation.x +=
                    delta * 0.3;

                particle.rotation.y +=
                    delta * 0.2;
            }
        );
    }


    /* =====================================================
       HEAT UPDATE
       ===================================================== */

    updateHeat(delta) {

        const active =
            this.currentStage === 5 ||
            this.currentStage === 6 ||
            this.currentStage === 7;


        this.heatWaves.forEach(
            (ring, index) => {

                const targetOpacity =
                    active
                        ? (
                            0.12 +
                            Math.sin(
                                this.elapsed * 2 +
                                index
                            ) *
                            0.04
                        )
                        : 0;

                ring.material.opacity =
                    THREE.MathUtils.lerp(
                        ring.material.opacity,
                        targetOpacity,
                        0.08
                    );


                if (active) {

                    const pulse =
                        1 +
                        Math.sin(
                            this.elapsed * 1.5 +
                            index
                        ) *
                        0.06;

                    ring.scale.set(
                        pulse,
                        pulse,
                        pulse
                    );
                }
            }
        );
    }


    /* =====================================================
       PRESSURE UPDATE
       ===================================================== */

    updatePressure(delta) {

        const active =
            this.currentStage === 5 ||
            this.currentStage === 6;


        this.pressureRings.forEach(
            (ring, index) => {

                const targetOpacity =
                    active
                        ? 0.28 -
                            index * 0.05
                        : 0;

                ring.material.opacity =
                    THREE.MathUtils.lerp(
                        ring.material.opacity,
                        targetOpacity,
                        0.08
                    );


                if (active) {

                    ring.rotation.z +=
                        delta *
                        (
                            0.12 +
                            index * 0.05
                        );

                    const pulse =
                        1 +
                        Math.sin(
                            this.elapsed * 1.8 +
                            index
                        ) *
                        0.04;

                    ring.scale.setScalar(
                        pulse
                    );
                }
            }
        );
    }


    /* =====================================================
       MELTING UPDATE
       ===================================================== */

    updateMelting(delta) {

        const active =
            this.currentStage === 7;


        this.meltingParticles.forEach(
            (particle, index) => {

                const targetOpacity =
                    active
                        ? 0.55
                        : 0;

                particle.material.opacity =
                    THREE.MathUtils.lerp(
                        particle.material.opacity,
                        targetOpacity,
                        0.08
                    );


                if (!active) return;


                const angle =
                    particle.userData.phase +
                    this.elapsed *
                    (
                        0.2 +
                        index * 0.002
                    );

                const radius =
                    particle.userData.radius *
                    (
                        0.8 +
                        Math.sin(
                            this.elapsed * 1.5 +
                            index
                        ) *
                        0.08
                    );


                particle.position.set(

                    Math.cos(angle) *
                    radius,

                    Math.sin(
                        this.elapsed * 1.4 +
                        index
                    ) *
                    0.5,

                    0.5 +
                    Math.sin(angle) *
                    0.35
                );


                particle.position.y -=
                    delta *
                    0.08;
            }
        );
    }


    /* =====================================================
       RENDER
       ===================================================== */

    render() {

        if (
            !this.renderer ||
            !this.camera
        ) {
            return;
        }

        this.renderer.render(
            this.scene,
            this.camera
        );
    }


    /* =====================================================
       START
       ===================================================== */

    start() {

        this.isRunning =
            true;

        this.clock.start();
    }


    /* =====================================================
       PAUSE
       ===================================================== */

    pause() {

        this.isRunning =
            false;
    }


    /* =====================================================
       TOGGLE
       ===================================================== */

    toggle() {

        this.isRunning =
            !this.isRunning;
    }


    /* =====================================================
       RESET
       ===================================================== */

    reset() {

        this.elapsed =
            0;

        this.currentStage =
            0;

        this.stageProgress =
            0;

        this.lastStage =
            -1;

        this.isRunning =
            true;


        if (this.materialRock) {

            this.materialRock.rotation.set(
                0.25,
                0.45,
                0.1
            );

            this.materialRock.scale.setScalar(
                1
            );

            this.materialRock.material.emissiveIntensity =
                0;
        }


        if (this.transformationGroup) {

            this.transformationGroup.position.set(
                0,
                0.2,
                1
            );
        }


        this.applyStage(
            0
        );


        this.clock.start();
    }


    /* =====================================================
       STAGE INFORMATION
       ===================================================== */

    getCurrentStage() {

        return {

            index:
                this.currentStage,

            name:
                this.stageNames[
                    this.currentStage
                ],

            nameEnglish:
                this.stageNamesEnglish[
                    this.currentStage
                ],

            /*
             * Keep several aliases so the existing
             * RockCycleUI can read the stage regardless
             * of its current naming convention.
             */

            english:
                this.stageNamesEnglish[
                    this.currentStage
                ],

            en:
                this.stageNamesEnglish[
                    this.currentStage
                ],

            nameEn:
                this.stageNamesEnglish[
                    this.currentStage
                ],

            description:
                this.stageDescriptions[
                    this.currentStage
                ],

            descriptionEnglish:
                this.stageDescriptionsEnglish[
                    this.currentStage
                ],

            descriptionEn:
                this.stageDescriptionsEnglish[
                    this.currentStage
                ],

            englishDescription:
                this.stageDescriptionsEnglish[
                    this.currentStage
                ],

            progress:
                this.stageProgress,

            total:
                this.stageNames.length
        };
    }


    /* =====================================================
       VISIBILITY
       ===================================================== */

    show() {

        if (!this.container) return;

        this.container.style.display =
            'block';

        this.container.style.visibility =
            'visible';

        this.container.style.opacity =
            '1';
    }


    hide() {

        if (!this.container) return;

        this.container.style.opacity =
            '0';

        this.container.style.visibility =
            'hidden';

        this.container.style.display =
            'none';
    }


    /* =====================================================
       SCENE
       ===================================================== */

    setScene(scene) {

        if (
            !scene ||
            scene === this.scene
        ) {
            return;
        }


        if (
            this.root &&
            this.scene
        ) {

            this.scene.remove(
                this.root
            );
        }


        this.scene =
            scene;


        if (this.root) {

            this.scene.add(
                this.root
            );
        }
    }


    /* =====================================================
       RESIZE
       ===================================================== */

    handleResize = () => {

        if (!this.container) {
            return;
        }


        const width =
            this.container.clientWidth ||
            window.innerWidth;

        const height =
            this.container.clientHeight ||
            window.innerHeight;


        if (this.camera) {

            this.camera.aspect =
                width / height;

            this.camera.updateProjectionMatrix();
        }


        if (this.renderer) {

            this.renderer.setSize(
                width,
                height,
                false
            );
        }
    };


    /* =====================================================
       ANIMATION LOOP
       ===================================================== */

    animate = () => {

        this.animationFrame =
            requestAnimationFrame(
                this.animate
            );


        const delta =
            Math.min(
                this.clock.getDelta(),
                0.05
            );


        this.update(
            delta
        );
    };


    /* =====================================================
       STOP
       ===================================================== */

    stop() {

        if (
            this.animationFrame
        ) {

            cancelAnimationFrame(
                this.animationFrame
            );

            this.animationFrame =
                null;
        }
    }


    /* =====================================================
       DESTROY
       ===================================================== */

    destroy() {

        this.stop();


        window.removeEventListener(
            'resize',
            this.handleResize
        );


        if (
            this.root &&
            this.scene
        ) {

            this.scene.remove(
                this.root
            );
        }


        if (this.root) {

            this.root.traverse(
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


        if (this.renderer) {

            this.renderer.dispose();

            this.renderer.forceContextLoss();

            if (
                this.renderer.domElement
            ) {

                this.renderer.domElement.remove();
            }
        }


        this.nodes = [];
        this.connections = [];

        this.materialFragments = [];
        this.materialLayers = [];

        this.transitionParticles = [];
        this.heatWaves = [];
        this.pressureRings = [];

        this.waterParticles = [];
        this.windParticles = [];

        this.sedimentParticles = [];
        this.meltingParticles = [];

        this.environmentObjects = [];


        if (this.container) {

            this.container.remove();

            this.container =
                null;
        }


        this.renderer =
            null;

        this.camera =
            null;

        this.root =
            null;

        this.materialRock =
            null;

        this.magmaPool =
            null;

        this.magmaGlow =
            null;

        this.transformationGroup =
            null;

        this.stageMarker =
            null;

        this.stageMarkerRing =
            null;
    }
}