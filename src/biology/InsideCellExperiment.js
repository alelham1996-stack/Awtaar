/* =========================================================
   AWTAAR — BIOLOGY GALAXY
   INSIDE THE CELL
   =========================================================

   تجربة استكشافية ثلاثية الأبعاد داخل خلية حيوانية.

   Features:
   - Dedicated Three.js scene
   - Interactive camera
   - Mouse / touch orbit
   - Clickable organelles
   - Organelles highlight on selection
   - Information panel
   - Reset camera
   - Intro sequence
   - Elegant biological visual identity
   - Responsive renderer
   - Full cleanup / destroy support

   ========================================================= */

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import {
    t,
    getLanguage
} from '../locales/i18n.js'


export default class InsideCellExperiment {

    /* =====================================================
       CONSTRUCTOR
       ===================================================== */

    constructor(scene = null, parent = null) {

        this.scene = scene
        this.parent = parent

        this.active = false
        this.destroyed = false

        this.time = 0
        this.introTime = 0
        this.introDuration = 2.8

        this.selectedOrganelle = null
        this.hoveredOrganelle = null

        this.organelleMeshes = []

        this.backgroundParticles = null

        this.pointer = new THREE.Vector2()
        this.raycaster = new THREE.Raycaster()

        this.mouseDown = false

        this.defaultCameraPosition = new THREE.Vector3(
            0,
            1.2,
            15
        )

        this.defaultTarget = new THREE.Vector3(
            0,
            0,
            0
        )

        /*
         * Language change listener.
         * The experiment keeps its visual state and only
         * refreshes the textual interface.
         */

        this.languageChangeHandler =
            () => this.updateLanguage()


        this.createScene()
        this.createCamera()
        this.createRenderer()
        this.createLights()
        this.createEnvironment()
        this.createCell()
        this.createUI()
        this.createEvents()

        window.addEventListener(
            'awtaar-language-change',
            this.languageChangeHandler
        )

        this.resize()
    }


    /* =====================================================
       SCENE
       ===================================================== */

    createScene() {

        this.renderScene = new THREE.Scene()

        this.renderScene.background = new THREE.Color(
            0x02080a
        )

        this.renderScene.fog = new THREE.FogExp2(
            0x02080a,
            0.035
        )
    }


    /* =====================================================
       CAMERA
       ===================================================== */

    createCamera() {

        this.camera = new THREE.PerspectiveCamera(
            42,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )

        this.camera.position.copy(
            this.defaultCameraPosition
        )

        this.camera.lookAt(
            this.defaultTarget
        )
    }


    /* =====================================================
       RENDERER
       ===================================================== */

    createRenderer() {

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        })

        this.renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        )

        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        )

        this.renderer.outputColorSpace =
            THREE.SRGBColorSpace

        this.renderer.toneMapping =
            THREE.ACESFilmicToneMapping

        this.renderer.toneMappingExposure = 1.15

        this.renderer.domElement.className =
            'awtaar-inside-cell-canvas'

        this.renderer.domElement.style.position =
            'fixed'

        this.renderer.domElement.style.inset =
            '0'

        this.renderer.domElement.style.width =
            '100%'

        this.renderer.domElement.style.height =
            '100%'

        this.renderer.domElement.style.zIndex =
            '2101'

        this.renderer.domElement.style.pointerEvents =
            'auto'

        document.body.appendChild(
            this.renderer.domElement
        )


        /* -------------------------------------------------
           ORBIT CONTROLS
           ------------------------------------------------- */

        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        )

        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.055

        this.controls.enablePan = false

        this.controls.minDistance = 7
        this.controls.maxDistance = 23

        this.controls.minPolarAngle = 0.45
        this.controls.maxPolarAngle =
            Math.PI - 0.45

        this.controls.target.copy(
            this.defaultTarget
        )
    }


    /* =====================================================
       LIGHTING
       ===================================================== */

    createLights() {

        const ambient =
            new THREE.AmbientLight(
                0x8fffe0,
                1.4
            )

        this.renderScene.add(
            ambient
        )


        const keyLight =
            new THREE.PointLight(
                0x8affd0,
                75,
                40,
                2
            )

        keyLight.position.set(
            4,
            7,
            8
        )

        this.renderScene.add(
            keyLight
        )


        /*
         * Dedicated light for the nucleus.
         * This keeps the blue nucleus visible
         * even when the camera rotates.
         */

        const nucleusLight =
            new THREE.PointLight(
                0x8ab8ff,
                80,
                22,
                2
            )

        nucleusLight.position.set(
            0,
            1,
            4
        )

        this.renderScene.add(
            nucleusLight
        )


        const goldLight =
            new THREE.PointLight(
                0xffd98a,
                32,
                24,
                2
            )

        goldLight.position.set(
            -7,
            2,
            -4
        )

        this.renderScene.add(
            goldLight
        )


        const rimLight =
            new THREE.PointLight(
                0x27e6a3,
                50,
                30,
                2
            )

        rimLight.position.set(
            -5,
            -4,
            7
        )

        this.renderScene.add(
            rimLight
        )
    }


    /* =====================================================
       ENVIRONMENT
       ===================================================== */

    createEnvironment() {

        const particleCount = 900

        const positions =
            new Float32Array(
                particleCount * 3
            )

        const sizes =
            new Float32Array(
                particleCount
            )

        for (
            let i = 0;
            i < particleCount;
            i++
        ) {

            const radius =
                10 + Math.random() * 18

            const theta =
                Math.random() * Math.PI * 2

            const phi =
                Math.acos(
                    2 * Math.random() - 1
                )

            positions[i * 3] =
                radius *
                Math.sin(phi) *
                Math.cos(theta)

            positions[i * 3 + 1] =
                radius *
                Math.cos(phi)

            positions[i * 3 + 2] =
                radius *
                Math.sin(phi) *
                Math.sin(theta)

            sizes[i] =
                0.4 +
                Math.random() * 1.1
        }


        const geometry =
            new THREE.BufferGeometry()

        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(
                positions,
                3
            )
        )

        geometry.setAttribute(
            'size',
            new THREE.BufferAttribute(
                sizes,
                1
            )
        )


        const material =
            new THREE.PointsMaterial({

                color: 0x58d9af,

                size: 0.045,

                transparent: true,

                opacity: 0.35,

                depthWrite: false,

                blending:
                    THREE.AdditiveBlending
            })


        this.backgroundParticles =
            new THREE.Points(
                geometry,
                material
            )

        this.renderScene.add(
            this.backgroundParticles
        )
    }


    /* =====================================================
       CELL
       ===================================================== */

    createCell() {

        this.cellGroup =
            new THREE.Group()

        this.renderScene.add(
            this.cellGroup
        )


        this.createCellMembrane()

        this.createCytoplasm()

        this.createNucleus()

        this.createMitochondria()

        this.createEndoplasmicReticulum()

        this.createGolgi()

        this.createLysosomes()

        this.createRibosomes()

        this.createCentrosome()
    }


    /* =====================================================
       CELL MEMBRANE
       ===================================================== */

    createCellMembrane() {

        const geometry =
            new THREE.SphereGeometry(
                6.1,
                96,
                64
            )


        const material =
            new THREE.MeshPhysicalMaterial({

                color: 0x155d4d,

                transparent: true,

                opacity: 0.16,

                roughness: 0.16,

                metalness: 0.05,

                transmission: 0.25,

                thickness: 0.6,

                side: THREE.DoubleSide
            })


        this.cellMembrane =
            new THREE.Mesh(
                geometry,
                material
            )

        this.cellMembrane.name =
            'cell-membrane'

        this.cellGroup.add(
            this.cellMembrane
        )


        const shellGeometry =
            new THREE.SphereGeometry(
                6.15,
                64,
                48
            )

        const shellMaterial =
            new THREE.MeshBasicMaterial({

                color: 0x44e0ad,

                transparent: true,

                opacity: 0.07,

                side: THREE.BackSide,

                blending:
                    THREE.AdditiveBlending,

                depthWrite: false
            })


        const shell =
            new THREE.Mesh(
                shellGeometry,
                shellMaterial
            )

        this.cellGroup.add(
            shell
        )


        const outlineGeometry =
            new THREE.SphereGeometry(
                6.13,
                64,
                48
            )

        const outlineMaterial =
            new THREE.MeshBasicMaterial({

                color: 0x72ffd2,

                wireframe: true,

                transparent: true,

                opacity: 0.11
            })


        const outline =
            new THREE.Mesh(
                outlineGeometry,
                outlineMaterial
            )

        this.cellGroup.add(
            outline
        )
    }


    /* =====================================================
       CYTOPLASM
       ===================================================== */

    createCytoplasm() {

        const geometry =
            new THREE.SphereGeometry(
                5.72,
                64,
                48
            )


        const material =
            new THREE.MeshPhysicalMaterial({

                color: 0x0b302a,

                transparent: true,

                opacity: 0.42,

                roughness: 0.8,

                metalness: 0,

                transmission: 0.08,

                side: THREE.DoubleSide
            })


        this.cytoplasm =
            new THREE.Mesh(
                geometry,
                material
            )

        this.cytoplasm.name =
            'cytoplasm'

        this.cellGroup.add(
            this.cytoplasm
        )
    }


    /* =====================================================
       NUCLEUS
       ===================================================== */

    createNucleus() {

        const nucleusGroup =
            new THREE.Group()

        nucleusGroup.name =
            'nucleus-group'


        /*
         * The nucleus is moved slightly forward
         * so it remains visually readable.
         */

        nucleusGroup.position.set(
            0,
            0.25,
            0.45
        )

        this.cellGroup.add(
            nucleusGroup
        )


        /*
         * Main spherical nucleus
         */

        const geometry =
            new THREE.SphereGeometry(
                2.05,
                64,
                48
            )


        const material =
            new THREE.MeshPhysicalMaterial({

                /*
                 * Clear deep blue identity
                 */

                color: 0x3f8cff,

                /*
                 * Blue internal glow
                 */

                emissive: 0x0b3d9c,

                emissiveIntensity: 0.95,

                transparent: true,

                opacity: 0.96,

                roughness: 0.22,

                metalness: 0.06
            })


        const nucleus =
            new THREE.Mesh(
                geometry,
                material
            )

        nucleus.name =
            'nucleus'

        nucleus.userData.organelle =
            'nucleus'


        nucleusGroup.add(
            nucleus
        )


        this.registerOrganelle(
            nucleus,
            'nucleus'
        )


        /*
         * Nuclear membrane
         */

        const membraneGeometry =
            new THREE.SphereGeometry(
                2.13,
                64,
                48
            )

        const membraneMaterial =
            new THREE.MeshBasicMaterial({

                color: 0x83baff,

                transparent: true,

                opacity: 0.22,

                wireframe: true
            })


        const membrane =
            new THREE.Mesh(
                membraneGeometry,
                membraneMaterial
            )

        nucleusGroup.add(
            membrane
        )


        /*
         * Nucleolus
         */

        const nucleolusGeometry =
            new THREE.SphereGeometry(
                0.48,
                32,
                24
            )

        const nucleolusMaterial =
            new THREE.MeshStandardMaterial({

                color: 0xffd889,

                emissive: 0x6b4810,

                emissiveIntensity: 0.55,

                roughness: 0.35
            })


        const nucleolus =
            new THREE.Mesh(
                nucleolusGeometry,
                nucleolusMaterial
            )

        nucleolus.position.set(
            -0.35,
            0.25,
            1.8
        )

        nucleusGroup.add(
            nucleolus
        )
    }


    /* =====================================================
       MITOCHONDRIA
       ===================================================== */

    createMitochondria() {

        const positions = [

            [ 3.1,  1.8,  1.4 ],
            [-3.3,  1.5,  1.7 ],
            [ 3.4, -1.7,  0.8 ],
            [-3.2, -2.0,  0.9 ],
            [ 1.8,  3.1, -1.2 ],
            [-1.8,  3.0, -1.0 ],
            [ 2.9, -0.2, -2.8 ],
            [-2.8,  0.1, -2.6 ]

        ]


        positions.forEach(
            (position, index) => {

                const group =
                    new THREE.Group()

                group.name =
                    `mitochondria-${index}`

                group.position.set(
                    ...position
                )

                group.rotation.set(
                    Math.random() * 0.7,
                    Math.random() * 0.7,
                    Math.random() * Math.PI
                )


                const geometry =
                    new THREE.CapsuleGeometry(
                        0.38,
                        1.15,
                        8,
                        20
                    )


                const material =
                    new THREE.MeshStandardMaterial({

                        color: 0xc79245,

                        emissive: 0x4d2d08,

                        emissiveIntensity: 0.55,

                        roughness: 0.38,

                        metalness: 0.08
                    })


                const mitochondrion =
                    new THREE.Mesh(
                        geometry,
                        material
                    )

                mitochondrion.scale.set(
                    1,
                    1,
                    0.65
                )

                mitochondrion.name =
                    `mitochondria-${index}`

                mitochondrion.userData.organelle =
                    'mitochondria'


                group.add(
                    mitochondrion
                )

                this.cellGroup.add(
                    group
                )

                this.registerOrganelle(
                    mitochondrion,
                    'mitochondria'
                )


                for (
                    let i = 0;
                    i < 4;
                    i++
                ) {

                    const fold =
                        new THREE.TorusGeometry(
                            0.26,
                            0.045,
                            8,
                            18,
                            Math.PI
                        )

                    const foldMaterial =
                        new THREE.MeshBasicMaterial({

                            color: 0xffe1a0,

                            transparent: true,

                            opacity: 0.55
                        })


                    const foldMesh =
                        new THREE.Mesh(
                            fold,
                            foldMaterial
                        )

                    foldMesh.rotation.y =
                        Math.PI / 2

                    foldMesh.position.z =
                        -0.3 +
                        i * 0.2

                    mitochondrion.add(
                        foldMesh
                    )
                }
            }
        )
    }


    /* =====================================================
       ENDOPLASMIC RETICULUM
       ===================================================== */

    createEndoplasmicReticulum() {

        const group =
            new THREE.Group()

        group.name =
            'endoplasmic-reticulum'

        group.rotation.set(
            0.4,
            -0.2,
            0.35
        )

        this.cellGroup.add(
            group
        )


        const material =
            new THREE.MeshStandardMaterial({

                color: 0x3dbb92,

                emissive: 0x073d2c,

                emissiveIntensity: 0.45,

                roughness: 0.42
            })


        const tubeMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x5ce1b0,

                emissive: 0x0c503a,

                emissiveIntensity: 0.5,

                roughness: 0.32
            })


        for (
            let i = 0;
            i < 9;
            i++
        ) {

            const curve =
                new THREE.CatmullRomCurve3([

                    new THREE.Vector3(
                        -2.5,
                        -1.3 + i * 0.35,
                        0.3
                    ),

                    new THREE.Vector3(
                        -1.4,
                        -0.9 + i * 0.4,
                        0.7
                    ),

                    new THREE.Vector3(
                        -0.5,
                        -1.5 + i * 0.35,
                        0.4
                    ),

                    new THREE.Vector3(
                        0.5,
                        -1.0 + i * 0.28,
                        0.9
                    ),

                    new THREE.Vector3(
                        1.6,
                        -1.4 + i * 0.32,
                        0.5
                    )

                ])


            const tubeGeometry =
                new THREE.TubeGeometry(
                    curve,
                    32,
                    0.07,
                    8,
                    false
                )


            const tube =
                new THREE.Mesh(
                    tubeGeometry,
                    tubeMaterial
                )

            tube.userData.organelle =
                'endoplasmic-reticulum'

            group.add(
                tube
            )

            this.registerOrganelle(
                tube,
                'endoplasmic-reticulum'
            )
        }


        for (
            let i = 0;
            i < 5;
            i++
        ) {

            const sheetGeometry =
                new THREE.SphereGeometry(
                    0.9,
                    24,
                    12
                )

            const sheet =
                new THREE.Mesh(
                    sheetGeometry,
                    material
                )

            sheet.scale.set(
                1.5,
                0.12,
                0.55
            )

            sheet.position.set(
                -1.4 + i * 0.75,
                0.1 + i * 0.38,
                0.4
            )

            sheet.rotation.z =
                0.35

            sheet.userData.organelle =
                'endoplasmic-reticulum'

            group.add(
                sheet
            )

            this.registerOrganelle(
                sheet,
                'endoplasmic-reticulum'
            )
        }
    }


    /* =====================================================
       GOLGI
       ===================================================== */

    createGolgi() {

        const group =
            new THREE.Group()

        group.name =
            'golgi'

        group.position.set(
            2.1,
            -1.1,
            1.8
        )

        group.rotation.set(
            0.2,
            -0.35,
            -0.2
        )

        this.cellGroup.add(
            group
        )


        const material =
            new THREE.MeshStandardMaterial({

                color: 0x9c65d8,

                emissive: 0x35134d,

                emissiveIntensity: 0.45,

                roughness: 0.36,

                metalness: 0.04
            })


        for (
            let i = 0;
            i < 7;
            i++
        ) {

            const curve =
                new THREE.CatmullRomCurve3([

                    new THREE.Vector3(
                        -0.9,
                        i * 0.22,
                        0
                    ),

                    new THREE.Vector3(
                        -0.35,
                        i * 0.22 + 0.12,
                        0.12
                    ),

                    new THREE.Vector3(
                        0.35,
                        i * 0.22 + 0.1,
                        0
                    ),

                    new THREE.Vector3(
                        0.9,
                        i * 0.22,
                        -0.08
                    )

                ])


            const geometry =
                new THREE.TubeGeometry(
                    curve,
                    24,
                    0.11,
                    8,
                    false
                )


            const mesh =
                new THREE.Mesh(
                    geometry,
                    material
                )

            mesh.userData.organelle =
                'golgi'

            group.add(
                mesh
            )

            this.registerOrganelle(
                mesh,
                'golgi'
            )
        }


        for (
            let i = 0;
            i < 6;
            i++
        ) {

            const vesicleGeometry =
                new THREE.SphereGeometry(
                    0.13 +
                    Math.random() * 0.08,
                    16,
                    12
                )

            const vesicleMaterial =
                new THREE.MeshStandardMaterial({

                    color: 0xd9a8ff,

                    emissive: 0x5b2a7c,

                    emissiveIntensity: 0.6
                })


            const vesicle =
                new THREE.Mesh(
                    vesicleGeometry,
                    vesicleMaterial
                )

            vesicle.position.set(
                1.0 +
                Math.random() * 0.55,

                Math.random() * 1.25,

                -0.15 +
                Math.random() * 0.45
            )

            vesicle.userData.organelle =
                'golgi'

            group.add(
                vesicle
            )

            this.registerOrganelle(
                vesicle,
                'golgi'
            )
        }
    }


    /* =====================================================
       LYSOSOMES
       ===================================================== */

    createLysosomes() {

        const positions = [

            [ 3.4,  2.5, -0.8 ],
            [-3.7,  0.2,  0.4 ],
            [ 2.6, -2.7, -0.9 ],
            [-2.4, -2.9, -1.0 ],
            [ 0.7,  3.2,  1.4 ],
            [-0.8,  2.8, -2.0 ]

        ]


        positions.forEach(
            (position, index) => {

                const geometry =
                    new THREE.SphereGeometry(
                        0.34,
                        24,
                        18
                    )

                const material =
                    new THREE.MeshStandardMaterial({

                        color: 0x8e6cdb,

                        emissive: 0x33205e,

                        emissiveIntensity: 0.75,

                        roughness: 0.28
                    })


                const lysosome =
                    new THREE.Mesh(
                        geometry,
                        material
                    )

                lysosome.position.set(
                    ...position
                )

                lysosome.name =
                    `lysosome-${index}`

                lysosome.userData.organelle =
                    'lysosome'

                this.cellGroup.add(
                    lysosome
                )

                this.registerOrganelle(
                    lysosome,
                    'lysosome'
                )
            }
        )
    }


    /* =====================================================
       RIBOSOMES
       ===================================================== */

    createRibosomes() {

        const count = 70

        for (
            let i = 0;
            i < count;
            i++
        ) {

            const geometry =
                new THREE.SphereGeometry(
                    0.065,
                    12,
                    8
                )

            const material =
                new THREE.MeshStandardMaterial({

                    color: 0xffd36f,

                    emissive: 0x69480b,

                    emissiveIntensity: 0.55,

                    roughness: 0.3
                })


            const ribosome =
                new THREE.Mesh(
                    geometry,
                    material
                )


            let x
            let y
            let z

            do {

                x =
                    (Math.random() - 0.5) *
                    9

                y =
                    (Math.random() - 0.5) *
                    8

                z =
                    (Math.random() - 0.5) *
                    8

            } while (
                Math.sqrt(
                    x * x +
                    y * y +
                    z * z
                ) > 5.1
            )


            ribosome.position.set(
                x,
                y,
                z
            )

            ribosome.name =
                `ribosome-${i}`

            ribosome.userData.organelle =
                'ribosome'

            this.cellGroup.add(
                ribosome
            )

            this.registerOrganelle(
                ribosome,
                'ribosome'
            )
        }
    }


    /* =====================================================
       CENTROSOME
       ===================================================== */

    createCentrosome() {

        const group =
            new THREE.Group()

        group.name =
            'centrosome'

        group.position.set(
            -1.8,
            -2.4,
            2.2
        )

        group.rotation.set(
            0.2,
            0.4,
            0.3
        )

        this.cellGroup.add(
            group
        )


        const material =
            new THREE.MeshStandardMaterial({

                color: 0x70b7ff,

                emissive: 0x123d70,

                emissiveIntensity: 0.75,

                roughness: 0.28
            })


        for (
            let i = 0;
            i < 2;
            i++
        ) {

            const geometry =
                new THREE.CylinderGeometry(
                    0.18,
                    0.18,
                    1.25,
                    16
                )

            const centriole =
                new THREE.Mesh(
                    geometry,
                    material
                )

            centriole.rotation.z =
                Math.PI / 2

            centriole.rotation.y =
                i === 0
                    ? 0.3
                    : -0.7

            centriole.position.x =
                i * 0.45

            centriole.name =
                `centriole-${i}`

            centriole.userData.organelle =
                'centrosome'

            group.add(
                centriole
            )

            this.registerOrganelle(
                centriole,
                'centrosome'
            )
        }
    }


    /* =====================================================
       ORGANELLE REGISTRATION
       ===================================================== */

    registerOrganelle(
        mesh,
        type
    ) {

        mesh.userData.organelle =
            type

        mesh.userData.baseScale =
            mesh.scale.clone()

        mesh.userData.baseEmissive =
            mesh.material &&
            mesh.material.emissive
                ? mesh.material.emissive.clone()
                : null

        mesh.userData.baseEmissiveIntensity =
            mesh.material &&
            typeof mesh.material.emissiveIntensity ===
                'number'
                ? mesh.material.emissiveIntensity
                : 0

        this.organelleMeshes.push(
            mesh
        )
    }


    /* =====================================================
       UI
       ===================================================== */

    createUI() {

        this.uiRoot =
            document.createElement(
                'section'
            )

        this.uiRoot.className =
            'awtaar-inside-cell-ui'

        this.uiRoot.dir =
            getLanguage() === 'ar'
                ? 'rtl'
                : 'ltr'


        this.uiRoot.innerHTML = `

            <div class="awtaar-cell-topbar">

                <div class="awtaar-cell-title-group">

                    <div class="awtaar-cell-eyebrow">
                        ${t('biology.cell.eyebrow')}
                    </div>

                    <div class="awtaar-cell-title">
                        ${t('biology.cell.title')}
                    </div>

                    <div class="awtaar-cell-subtitle">
                        ${t('biology.cell.subtitle')}
                    </div>

                </div>


                <button
                    class="awtaar-cell-close"
                    type="button"
                    aria-label="${t('biology.cell.exit')}"
                >
                    <span>×</span>
                    <strong>${t('biology.cell.exit')}</strong>
                </button>

            </div>


            <div class="awtaar-cell-intro">

                <div class="awtaar-cell-intro-line">
                    ${t('biology.cell.intro')}
                </div>

                <div class="awtaar-cell-intro-main">
                    ${t('biology.cell.introMain')}
                </div>

            </div>


            <div class="awtaar-cell-controls">

                <button
                    class="awtaar-cell-control"
                    data-action="reset"
                    type="button"
                >
                    <span class="control-icon">↻</span>
                    <span>${t('biology.cell.replay')}</span>
                </button>

            </div>


            <div class="awtaar-cell-info">

                <div class="awtaar-cell-info-kicker">
                    ${t('biology.cell.infoKicker')}
                </div>

                <div class="awtaar-cell-info-title">
                    ${t('biology.cell.infoTitle')}
                </div>

                <div class="awtaar-cell-info-description">
                    ${t('biology.cell.infoDescription')}
                </div>

            </div>


            <div class="awtaar-cell-selected">

                <div class="awtaar-cell-selected-kicker">
                    ${t('biology.cell.selectedKicker')}
                </div>

                <div class="awtaar-cell-selected-title">
                    —
                </div>

                <div class="awtaar-cell-selected-description">
                    —
                </div>

            </div>


            <div class="awtaar-cell-bottom-hint">
                <span>${this.getHintPart(0)}</span>
                <span>•</span>
                <span>${this.getHintPart(1)}</span>
                <span>•</span>
                <span>${this.getHintPart(2)}</span>
            </div>

        `


        document.body.appendChild(
            this.uiRoot
        )


        this.injectStyles()

        this.cacheUI()

        this.setInitialInfo()
    }


    /* =====================================================
       HINT PARTS
       ===================================================== */

    getHintPart(
        index
    ) {

        const hint =
            t('biology.cell.hint')


        const parts =
            hint
                .split('•')
                .map(
                    part =>
                        part.trim()
                )


        return (
            parts[index] ||
            ''
        )
    }


    /* =====================================================
       CACHE UI
       ===================================================== */

    cacheUI() {

        this.eyebrowElement =
            this.uiRoot.querySelector(
                '.awtaar-cell-eyebrow'
            )


        this.titleElement =
            this.uiRoot.querySelector(
                '.awtaar-cell-title'
            )


        this.subtitleElement =
            this.uiRoot.querySelector(
                '.awtaar-cell-subtitle'
            )


        this.closeButton =
            this.uiRoot.querySelector(
                '.awtaar-cell-close'
            )


        this.closeButtonText =
            this.uiRoot.querySelector(
                '.awtaar-cell-close strong'
            )


        this.introLineElement =
            this.uiRoot.querySelector(
                '.awtaar-cell-intro-line'
            )


        this.introMainElement =
            this.uiRoot.querySelector(
                '.awtaar-cell-intro-main'
            )


        this.resetButton =
            this.uiRoot.querySelector(
                '[data-action="reset"]'
            )


        this.resetButtonText =
            this.resetButton
                ? this.resetButton.querySelector(
                    'span:not(.control-icon)'
                )
                : null


        this.infoKickerElement =
            this.uiRoot.querySelector(
                '.awtaar-cell-info-kicker'
            )


        this.infoTitleElement =
            this.uiRoot.querySelector(
                '.awtaar-cell-info-title'
            )


        this.infoDescriptionElement =
            this.uiRoot.querySelector(
                '.awtaar-cell-info-description'
            )


        this.selectedPanel =
            this.uiRoot.querySelector(
                '.awtaar-cell-selected'
            )


        this.selectedKickerElement =
            this.uiRoot.querySelector(
                '.awtaar-cell-selected-kicker'
            )


        this.selectedTitle =
            this.uiRoot.querySelector(
                '.awtaar-cell-selected-title'
            )


        this.selectedDescription =
            this.uiRoot.querySelector(
                '.awtaar-cell-selected-description'
            )


        this.hintElements =
            this.uiRoot.querySelectorAll(
                '.awtaar-cell-bottom-hint span'
            )
    }


    /* =====================================================
       UPDATE LANGUAGE
       ===================================================== */

    updateLanguage() {

        if (
            !this.uiRoot
        ) {
            return
        }


        const language =
            getLanguage()


        this.uiRoot.dir =
            language === 'ar'
                ? 'rtl'
                : 'ltr'


        if (
            this.eyebrowElement
        ) {

            this.eyebrowElement.textContent =
                t('biology.cell.eyebrow')
        }


        if (
            this.titleElement
        ) {

            this.titleElement.textContent =
                t('biology.cell.title')
        }


        if (
            this.subtitleElement
        ) {

            this.subtitleElement.textContent =
                t('biology.cell.subtitle')
        }


        if (
            this.closeButton
        ) {

            this.closeButton.setAttribute(
                'aria-label',
                t('biology.cell.exit')
            )
        }


        if (
            this.closeButtonText
        ) {

            this.closeButtonText.textContent =
                t('biology.cell.exit')
        }


        if (
            this.introLineElement
        ) {

            this.introLineElement.textContent =
                t('biology.cell.intro')
        }


        if (
            this.introMainElement
        ) {

            this.introMainElement.textContent =
                t('biology.cell.introMain')
        }


        if (
            this.resetButtonText
        ) {

            this.resetButtonText.textContent =
                t('biology.cell.replay')
        }


        if (
            this.infoKickerElement
        ) {

            this.infoKickerElement.textContent =
                t('biology.cell.infoKicker')
        }


        if (
            this.infoTitleElement
        ) {

            this.infoTitleElement.textContent =
                t('biology.cell.infoTitle')
        }


        if (
            this.infoDescriptionElement
        ) {

            this.infoDescriptionElement.textContent =
                t('biology.cell.infoDescription')
        }


        if (
            this.selectedKickerElement
        ) {

            this.selectedKickerElement.textContent =
                t('biology.cell.selectedKicker')
        }


        /*
         * Keep the original three-part hint layout
         * while translating each part.
         */

        if (
            this.hintElements &&
            this.hintElements.length >= 5
        ) {

            const parts =
                t('biology.cell.hint')
                    .split('•')
                    .map(
                        part =>
                            part.trim()
                    )


            if (
                parts[0]
            ) {

                this.hintElements[0].textContent =
                    parts[0]
            }


            if (
                parts[2]
            ) {

                this.hintElements[2].textContent =
                    parts[2]
            }


            if (
                parts[4]
            ) {

                this.hintElements[4].textContent =
                    parts[4]
            }
        }


        /*
         * If an organelle is currently selected,
         * refresh its title and description immediately.
         */

        if (
            this.selectedOrganelle
        ) {

            const info =
                this.getOrganelleInfo(
                    this.selectedOrganelle
                )


            if (
                this.selectedTitle
            ) {

                this.selectedTitle.textContent =
                    info.title
            }


            if (
                this.selectedDescription
            ) {

                this.selectedDescription.textContent =
                    info.description
            }
        }
    }


    /* =====================================================
       INITIAL INFO
       ===================================================== */

    setInitialInfo() {

        this.selectedPanel.classList.remove(
            'visible'
        )
    }


    /* =====================================================
       EVENTS
       ===================================================== */

    createEvents() {

        this.onResize =
            () => this.resize()

        this.onPointerMove =
            event =>
                this.handlePointerMove(
                    event
                )

        this.onPointerDown =
            event =>
                this.handlePointerDown(
                    event
                )

        this.onPointerUp =
            event =>
                this.handlePointerUp(
                    event
                )

        this.onClick =
            event =>
                this.handleClick(
                    event
                )


        window.addEventListener(
            'resize',
            this.onResize
        )

        this.renderer.domElement.addEventListener(
            'pointermove',
            this.onPointerMove
        )

        this.renderer.domElement.addEventListener(
            'pointerdown',
            this.onPointerDown
        )

        window.addEventListener(
            'pointerup',
            this.onPointerUp
        )

        this.renderer.domElement.addEventListener(
            'click',
            this.onClick
        )


        this.closeButton.addEventListener(
            'click',
            () => this.close()
        )


        this.resetButton.addEventListener(
            'click',
            () => this.resetView()
        )
    }


    /* =====================================================
       POINTER
       ===================================================== */

    handlePointerDown() {

        this.mouseDown = true
    }


    handlePointerUp() {

        this.mouseDown = false
    }


    handlePointerMove(
        event
    ) {

        if (
            !this.active
        ) {
            return
        }


        const rect =
            this.renderer.domElement.getBoundingClientRect()


        this.pointer.x =
            (
                event.clientX -
                rect.left
            ) /
                rect.width *
                2 -
                1

        this.pointer.y =
            -(
                (
                    event.clientY -
                    rect.top
                ) /
                    rect.height *
                    2 -
                    1
            )


        this.raycaster.setFromCamera(
            this.pointer,
            this.camera
        )


        const intersects =
            this.raycaster.intersectObjects(
                this.organelleMeshes,
                true
            )


        let hovered =
            null


        if (
            intersects.length
        ) {

            for (
                const hit
                of intersects
            ) {

                const object =
                    hit.object

                const type =
                    object.userData.organelle

                if (
                    type
                ) {

                    hovered =
                        type

                    break
                }
            }
        }


        this.hoveredOrganelle =
            hovered


        this.renderer.domElement.style.cursor =
            hovered
                ? 'pointer'
                : 'grab'
    }


    /* =====================================================
       CLICK
       ===================================================== */

    handleClick(
        event
    ) {

        if (
            !this.active
        ) {
            return
        }


        const rect =
            this.renderer.domElement.getBoundingClientRect()


        this.pointer.x =
            (
                event.clientX -
                rect.left
            ) /
                rect.width *
                2 -
                1

        this.pointer.y =
            -(
                (
                    event.clientY -
                    rect.top
                ) /
                    rect.height *
                    2 -
                    1
            )


        this.raycaster.setFromCamera(
            this.pointer,
            this.camera
        )


        const intersects =
            this.raycaster.intersectObjects(
                this.organelleMeshes,
                true
            )


        let selected =
            null


        for (
            const hit
            of intersects
        ) {

            let object =
                hit.object

            while (
                object &&
                !object.userData.organelle &&
                object.parent
            ) {

                object =
                    object.parent
            }


            if (
                object &&
                object.userData.organelle
            ) {

                selected =
                    object.userData.organelle

                break
            }
        }


        /*
         * Screen-space fallback for small organelles.
         */

        if (
            !selected
        ) {

            selected =
                this.findClosestOrganelle(
                    event.clientX,
                    event.clientY
                )
        }


        if (
            selected
        ) {

            this.selectOrganelle(
                selected
            )
        }
    }


    /* =====================================================
       SCREEN SPACE ORGANELLE PICKING
       ===================================================== */

    findClosestOrganelle(
        clientX,
        clientY
    ) {

        const rect =
            this.renderer.domElement.getBoundingClientRect()


        const threshold =
            window.innerWidth < 800
                ? 55
                : 42


        let closest =
            null

        let closestDistance =
            Infinity


        const worldPosition =
            new THREE.Vector3()


        this.organelleMeshes.forEach(
            mesh => {

                if (
                    !mesh.visible
                ) {
                    return
                }


                mesh.getWorldPosition(
                    worldPosition
                )


                const projected =
                    worldPosition.clone()


                projected.project(
                    this.camera
                )


                if (
                    projected.z < -1 ||
                    projected.z > 1
                ) {
                    return
                }


                const x =
                    (
                        projected.x *
                        0.5 +
                        0.5
                    ) *
                    rect.width +
                    rect.left


                const y =
                    (
                        -projected.y *
                        0.5 +
                        0.5
                    ) *
                    rect.height +
                    rect.top


                const distance =
                    Math.hypot(
                        clientX - x,
                        clientY - y
                    )


                if (
                    distance <
                    threshold &&
                    distance <
                    closestDistance
                ) {

                    closestDistance =
                        distance

                    closest =
                        mesh.userData.organelle
                }
            }
        )


        return closest
    }


    /* =====================================================
       SELECT ORGANELLE
       ===================================================== */

    selectOrganelle(
        type
    ) {

        if (
            !type
        ) {
            return
        }


        this.selectedOrganelle =
            type


        const info =
            this.getOrganelleInfo(
                type
            )


        this.selectedTitle.textContent =
            info.title

        this.selectedDescription.textContent =
            info.description


        this.selectedPanel.classList.add(
            'visible'
        )


        this.highlightOrganelles(
            type
        )


        this.dispatchEvent(
            'awtaar-cell-organelle-selected',
            {
                type,
                title: info.title
            }
        )
    }


    /* =====================================================
       ORGANELLE INFO
       ===================================================== */

    getOrganelleInfo(
        type
    ) {

        const data = {

            nucleus: {

                title:
                    t(
                        'biology.cell.organelles.nucleus.title'
                    ),

                description:
                    t(
                        'biology.cell.organelles.nucleus.description'
                    )
            },


            mitochondria: {

                title:
                    t(
                        'biology.cell.organelles.mitochondria.title'
                    ),

                description:
                    t(
                        'biology.cell.organelles.mitochondria.description'
                    )
            },


            'endoplasmic-reticulum': {

                title:
                    t(
                        'biology.cell.organelles.endoplasmicReticulum.title'
                    ),

                description:
                    t(
                        'biology.cell.organelles.endoplasmicReticulum.description'
                    )
            },


            golgi: {

                title:
                    t(
                        'biology.cell.organelles.golgi.title'
                    ),

                description:
                    t(
                        'biology.cell.organelles.golgi.description'
                    )
            },


            lysosome: {

                title:
                    t(
                        'biology.cell.organelles.lysosome.title'
                    ),

                description:
                    t(
                        'biology.cell.organelles.lysosome.description'
                    )
            },


            ribosome: {

                title:
                    t(
                        'biology.cell.organelles.ribosome.title'
                    ),

                description:
                    t(
                        'biology.cell.organelles.ribosome.description'
                    )
            },


            centrosome: {

                title:
                    t(
                        'biology.cell.organelles.centrosome.title'
                    ),

                description:
                    t(
                        'biology.cell.organelles.centrosome.description'
                    )
            }

        }


        return (
            data[type] ||
            {
                title:
                    t(
                        'biology.cell.organelles.fallback.title'
                    ),

                description:
                    t(
                        'biology.cell.organelles.fallback.description'
                    )
            }
        )
    }


    /* =====================================================
       HIGHLIGHT
       ===================================================== */

    highlightOrganelles(
        type
    ) {

        this.organelleMeshes.forEach(
            mesh => {

                const material =
                    mesh.material


                if (
                    !material ||
                    !material.emissive
                ) {
                    return
                }


                const meshType =
                    mesh.userData.organelle


                if (
                    meshType === type
                ) {

                    material.emissive.set(
                        0x42ffd0
                    )

                    material.emissiveIntensity =
                        1.5

                    mesh.scale.copy(
                        mesh.userData.baseScale
                    )

                    mesh.scale.multiplyScalar(
                        1.16
                    )

                } else {

                    if (
                        mesh.userData.baseEmissive
                    ) {

                        material.emissive.copy(
                            mesh.userData.baseEmissive
                        )
                    }

                    material.emissiveIntensity =
                        mesh.userData.baseEmissiveIntensity

                    mesh.scale.copy(
                        mesh.userData.baseScale
                    )
                }
            }
        )
    }


    /* =====================================================
       INTRO
       ===================================================== */

    updateIntroState() {

        if (
            !this.introElement
        ) {
            return
        }


        if (
            this.introTime >=
            this.introDuration
        ) {

            this.introElement.classList.add(
                'hidden'
            )

        } else {

            this.introElement.classList.remove(
                'hidden'
            )
        }
    }


    /* =====================================================
       SHOW
       ===================================================== */

    show() {

        if (
            this.destroyed
        ) {
            return
        }


        this.active = true

        this.introTime = 0

        this.uiRoot.style.display =
            'block'

        this.renderer.domElement.style.display =
            'block'


        this.resetView()

        this.startIntro()


        this.renderer.render(
            this.renderScene,
            this.camera
        )
    }


    /* =====================================================
       START INTRO
       ===================================================== */

    startIntro() {

        this.introTime = 0

        this.cellGroup.scale.setScalar(
            0.72
        )

        this.cellGroup.position.y =
            -0.6

        this.cellGroup.rotation.y =
            -0.4


        this.updateIntroState()
    }


    /* =====================================================
       HIDE
       ===================================================== */

    hide() {

        this.active = false


        if (
            this.uiRoot
        ) {

            this.uiRoot.style.display =
                'none'
        }


        if (
            this.renderer
        ) {

            this.renderer.domElement.style.display =
                'none'
        }
    }


    /* =====================================================
       CLOSE
       ===================================================== */

    close() {

        this.hide()


        if (
            this.parent &&
            typeof this.parent.closeActiveExperiment ===
                'function'
        ) {

            this.parent.closeActiveExperiment()
        }


        this.dispatchEvent(
            'awtaar-cell-experiment-closed'
        )
    }


    /* =====================================================
       RESET VIEW
       ===================================================== */

    resetView() {

        this.selectedOrganelle =
            null

        this.hoveredOrganelle =
            null


        if (
            this.selectedPanel
        ) {

            this.selectedPanel.classList.remove(
                'visible'
            )
        }


        if (
            this.selectedTitle
        ) {

            this.selectedTitle.textContent =
                '—'
        }


        if (
            this.selectedDescription
        ) {

            this.selectedDescription.textContent =
                '—'
        }


        this.organelleMeshes.forEach(
            mesh => {

                if (
                    mesh.material &&
                    mesh.material.emissive &&
                    mesh.userData.baseEmissive
                ) {

                    mesh.material.emissive.copy(
                        mesh.userData.baseEmissive
                    )

                    mesh.material.emissiveIntensity =
                        mesh.userData.baseEmissiveIntensity
                }

                if (
                    mesh.userData.baseScale
                ) {

                    mesh.scale.copy(
                        mesh.userData.baseScale
                    )
                }
            }
        )


        this.camera.position.copy(
            this.defaultCameraPosition
        )

        this.controls.target.copy(
            this.defaultTarget
        )

        this.controls.update()


        this.cellGroup.rotation.set(
            0,
            0,
            0
        )

        this.cellGroup.position.set(
            0,
            0,
            0
        )

        this.cellGroup.scale.setScalar(
            1
        )
    }


    /* =====================================================
       RESIZE
       ===================================================== */

    resize() {

        if (
            !this.camera ||
            !this.renderer
        ) {
            return
        }


        const width =
            window.innerWidth

        const height =
            window.innerHeight


        this.camera.aspect =
            width / height

        this.camera.updateProjectionMatrix()


        this.renderer.setSize(
            width,
            height
        )
    }


    /* =====================================================
       UPDATE
       ===================================================== */

    update(
        delta = 0.016
    ) {

        if (
            this.destroyed ||
            !this.active
        ) {
            return
        }


        delta =
            Math.min(
                delta,
                0.05
            )


        this.time += delta


        /* -------------------------------------------------
           INTRO ANIMATION
           ------------------------------------------------- */

        if (
            this.introTime <
            this.introDuration
        ) {

            this.introTime += delta


            const progress =
                Math.min(
                    this.introTime /
                    this.introDuration,
                    1
                )


            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    3
                )


            this.cellGroup.scale.setScalar(
                THREE.MathUtils.lerp(
                    0.72,
                    1,
                    eased
                )
            )


            this.cellGroup.position.y =
                THREE.MathUtils.lerp(
                    -0.6,
                    0,
                    eased
                )


            this.cellGroup.rotation.y =
                THREE.MathUtils.lerp(
                    -0.4,
                    0,
                    eased
                )


            this.updateIntroState()
        }


        /* -------------------------------------------------
           CELL AMBIENT MOTION
           ------------------------------------------------- */

        this.cellGroup.rotation.y +=
            delta * 0.025


        this.cellGroup.position.y =
            Math.sin(
                this.time * 0.45
            ) * 0.055


        /* -------------------------------------------------
           NUCLEUS PULSE
           ------------------------------------------------- */

        const nucleus =
            this.organelleMeshes.find(
                mesh =>
                    mesh.userData.organelle ===
                    'nucleus'
            )


        if (
            nucleus &&
            nucleus.material
        ) {

            const pulse =
                0.82 +
                Math.sin(
                    this.time * 1.4
                ) * 0.12


            nucleus.material.emissiveIntensity =
                this.selectedOrganelle ===
                'nucleus'
                    ? 1.5
                    : pulse
        }


        /* -------------------------------------------------
           BACKGROUND PARTICLES
           ------------------------------------------------- */

        if (
            this.backgroundParticles
        ) {

            this.backgroundParticles.rotation.y +=
                delta * 0.008

            this.backgroundParticles.rotation.x +=
                delta * 0.002
        }


        /* -------------------------------------------------
           ORGANELLE SUBTLE MOTION
           ------------------------------------------------- */

        this.organelleMeshes.forEach(
            (mesh, index) => {

                const type =
                    mesh.userData.organelle


                if (
                    type ===
                    'mitochondria'
                ) {

                    mesh.rotation.z +=
                        delta *
                        0.025
                }


                if (
                    type ===
                    'lysosome'
                ) {

                    const pulse =
                        1 +
                        Math.sin(
                            this.time *
                            1.4 +
                            index
                        ) *
                        0.025

                    const base =
                        mesh.userData.baseScale

                    mesh.scale.copy(
                        base
                    )

                    if (
                        this.selectedOrganelle !==
                        type
                    ) {

                        mesh.scale.multiplyScalar(
                            pulse
                        )
                    }
                }
            }
        )


        this.controls.update()


        this.renderer.render(
            this.renderScene,
            this.camera
        )
    }


    /* =====================================================
       EVENT DISPATCH
       ===================================================== */

    dispatchEvent(
        name,
        detail = {}
    ) {

        document.dispatchEvent(
            new CustomEvent(
                name,
                {
                    detail
                }
            )
        )
    }


    /* =====================================================
       SET SCENE
       ===================================================== */

    setScene(
        scene
    ) {

        this.scene =
            scene

        return this
    }


    /* =====================================================
       SET PARENT
       ===================================================== */

    setParent(
        parent
    ) {

        this.parent =
            parent

        return this
    }


    /* =====================================================
       IS ACTIVE
       ===================================================== */

    isOpen() {

        return this.active
    }


    /* =====================================================
       STYLES
       ===================================================== */

    injectStyles() {

        if (
            document.getElementById(
                'awtaar-inside-cell-styles'
            )
        ) {
            return
        }


        const style =
            document.createElement(
                'style'
            )

        style.id =
            'awtaar-inside-cell-styles'


        style.textContent = `

            .awtaar-inside-cell-ui {

                position: fixed;

                inset: 0;

                z-index: 2102;

                pointer-events: none;

                color: #effff8;

                font-family:
                    "Tajawal",
                    sans-serif;

            }


            .awtaar-cell-topbar {

                position: absolute;

                top: 0;

                left: 0;

                right: 0;

                height: 92px;

                padding:
                    22px 30px;

                display: flex;

                align-items: flex-start;

                justify-content:
                    space-between;

                pointer-events: none;

            }


            .awtaar-cell-title-group {

                text-align: right;

            }


            .awtaar-cell-eyebrow {

                color:
                    rgba(105,226,184,.62);

                font-size: 9px;

                letter-spacing: 2.5px;

                font-weight: 500;

                margin-bottom: 4px;

            }


            .awtaar-cell-title {

                color: #effff8;

                font-size: 24px;

                font-weight: 500;

                line-height: 1.15;

                text-shadow:
                    0 2px 18px
                    rgba(0,0,0,.35);

            }


            .awtaar-cell-subtitle {

                color:
                    rgba(220,255,242,.45);

                font-size: 10px;

                font-weight: 300;

                margin-top: 5px;

            }


            .awtaar-cell-close {

                pointer-events: auto;

                border: 1px solid
                    rgba(130,235,202,.18);

                background:
                    rgba(3,17,15,.48);

                color:
                    rgba(230,255,247,.75);

                border-radius: 11px;

                min-width: 88px;

                height: 38px;

                display: flex;

                align-items: center;

                justify-content: center;

                gap: 7px;

                cursor: pointer;

                backdrop-filter:
                    blur(12px);

                transition:
                    background .2s ease,
                    border-color .2s ease,
                    transform .2s ease;

            }


            .awtaar-cell-close:hover {

                background:
                    rgba(8,34,29,.7);

                border-color:
                    rgba(130,235,202,.35);

                transform:
                    translateY(-1px);

            }


            .awtaar-cell-close span {

                font-size: 19px;

                line-height: 1;

                font-weight: 300;

            }


            .awtaar-cell-close strong {

                font-size: 10px;

                font-weight: 400;

            }


            .awtaar-cell-intro {

                position: absolute;

                left: 50%;

                top: 50%;

                transform:
                    translate(-50%, -50%);

                text-align: center;

                pointer-events: none;

                transition:
                    opacity .65s ease,
                    transform .65s ease;

                z-index: 5;

            }


            .awtaar-cell-intro.hidden {

                opacity: 0;

                transform:
                    translate(-50%, -50%)
                    scale(.96);

            }


            .awtaar-cell-intro-line {

                color:
                    rgba(160,255,222,.58);

                font-size: 12px;

                letter-spacing: 2px;

                margin-bottom: 8px;

            }


            .awtaar-cell-intro-main {

                color: #effff8;

                font-size: 29px;

                font-weight: 400;

                text-shadow:
                    0 0 35px
                    rgba(65,230,180,.25);

            }


            .awtaar-cell-controls {

                position: absolute;

                left: 28px;

                bottom: 28px;

                display: flex;

                flex-direction: column;

                gap: 8px;

                pointer-events: auto;

            }


            .awtaar-cell-control {

                height: 38px;

                padding:
                    0 13px;

                border:
                    1px solid
                    rgba(111,231,190,.16);

                background:
                    rgba(3,17,15,.54);

                color:
                    rgba(224,255,244,.64);

                border-radius: 10px;

                display: flex;

                align-items: center;

                gap: 8px;

                cursor: pointer;

                font-family:
                    "Tajawal",
                    sans-serif;

                font-size: 10px;

                font-weight: 400;

                backdrop-filter:
                    blur(10px);

                transition:
                    background .2s ease,
                    border-color .2s ease,
                    color .2s ease,
                    transform .2s ease;

            }


            .awtaar-cell-control:hover {

                background:
                    rgba(8,35,29,.72);

                border-color:
                    rgba(111,231,190,.32);

                color:
                    #eafff7;

                transform:
                    translateY(-1px);

            }


            .awtaar-cell-control
            .control-icon {

                font-size: 16px;

                opacity: .8;

            }


            .awtaar-cell-info {

                position: absolute;

                right: 28px;

                bottom: 28px;

                width: 255px;

                padding:
                    15px 17px;

                border-right:
                    1px solid
                    rgba(108,230,184,.24);

                background:
                    linear-gradient(
                        90deg,
                        rgba(4,17,15,.03),
                        rgba(4,17,15,.48)
                    );

                text-align: right;

            }


            .awtaar-cell-info-kicker {

                color: #62dcae;

                font-size: 9px;

                letter-spacing: 1.5px;

                margin-bottom: 7px;

                font-weight: 600;

            }


            .awtaar-cell-info-title {

                color: #effff8;

                font-size: 15px;

                font-weight: 500;

                margin-bottom: 5px;

            }


            .awtaar-cell-info-description {

                color:
                    rgba(224,255,244,.54);

                font-size: 11px;

                line-height: 1.7;

                font-weight: 300;

            }


            .awtaar-cell-selected {

                position: absolute;

                left: 50%;

                top: 50%;

                transform:
                    translate(-50%, 155px);

                width: 270px;

                text-align: center;

                opacity: 0;

                transition:
                    opacity .35s ease,
                    transform .35s ease;

                pointer-events: none;

            }


            .awtaar-cell-selected.visible {

                opacity: 1;

                transform:
                    translate(-50%, 135px);

            }


            .awtaar-cell-selected-kicker {

                color: #6be4b7;

                font-size: 9px;

                letter-spacing: 2px;

                margin-bottom: 5px;

            }


            .awtaar-cell-selected-title {

                color: #f1fff9;

                font-size: 18px;

                font-weight: 500;

                margin-bottom: 4px;

            }


            .awtaar-cell-selected-description {

                color:
                    rgba(225,255,245,.58);

                font-size: 11px;

                line-height: 1.65;

                font-weight: 300;

            }


            .awtaar-cell-bottom-hint {

                position: absolute;

                left: 50%;

                bottom: 18px;

                transform:
                    translateX(-50%);

                color:
                    rgba(198,245,228,.35);

                font-size: 9px;

                white-space: nowrap;

                display: flex;

                align-items: center;

                pointer-events: none;

            }


            .awtaar-cell-bottom-hint span {

                margin: 0 7px;

                color:
                    rgba(108,230,184,.45);

            }


            @media (
                max-width: 900px
            ) {

                .awtaar-cell-topbar {

                    padding:
                        18px 18px;

                }


                .awtaar-cell-title {

                    font-size: 20px;

                }


                .awtaar-cell-subtitle {

                    font-size: 9px;

                }


                .awtaar-cell-info {

                    right: 16px;

                    bottom: 18px;

                    width: 220px;

                }


                .awtaar-cell-controls {

                    left: 16px;

                    bottom: 18px;

                }


                .awtaar-cell-bottom-hint {

                    display: none;

                }

            }


            @media (
                max-width: 620px
            ) {

                .awtaar-cell-title {

                    font-size: 18px;

                }


                .awtaar-cell-subtitle {

                    max-width: 190px;

                    line-height: 1.5;

                }


                .awtaar-cell-close {

                    min-width: 70px;

                    height: 34px;

                }


                .awtaar-cell-close strong {

                    display: none;

                }


                .awtaar-cell-info {

                    width: 185px;

                    padding:
                        11px 12px;

                }


                .awtaar-cell-info-title {

                    font-size: 12px;

                }


                .awtaar-cell-info-description {

                    font-size: 9px;

                }


                .awtaar-cell-selected {

                    width: 220px;

                }


                .awtaar-cell-selected-title {

                    font-size: 16px;

                }

            }

        `


        document.head.appendChild(
            style
        )
    }


    /* =====================================================
       DESTROY
       ===================================================== */

    destroy() {

        if (
            this.destroyed
        ) {
            return
        }


        this.destroyed = true

        this.active = false


        window.removeEventListener(
            'resize',
            this.onResize
        )


        window.removeEventListener(
            'awtaar-language-change',
            this.languageChangeHandler
        )


        if (
            this.renderer
        ) {

            this.renderer.domElement.removeEventListener(
                'pointermove',
                this.onPointerMove
            )

            this.renderer.domElement.removeEventListener(
                'pointerdown',
                this.onPointerDown
            )

            this.renderer.domElement.removeEventListener(
                'click',
                this.onClick
            )
        }


        window.removeEventListener(
            'pointerup',
            this.onPointerUp
        )


        if (
            this.controls
        ) {

            this.controls.dispose()
        }


        if (
            this.renderer
        ) {

            this.renderer.dispose()

            if (
                this.renderer.domElement.parentNode
            ) {

                this.renderer.domElement.parentNode.removeChild(
                    this.renderer.domElement
                )
            }
        }


        this.disposeObject(
            this.renderScene
        )


        if (
            this.uiRoot &&
            this.uiRoot.parentNode
        ) {

            this.uiRoot.parentNode.removeChild(
                this.uiRoot
            )
        }


        const style =
            document.getElementById(
                'awtaar-inside-cell-styles'
            )


        if (
            style
        ) {

            style.remove()
        }
    }


    /* =====================================================
       DISPOSE OBJECT
       ===================================================== */

    disposeObject(
        object
    ) {

        if (
            !object
        ) {
            return
        }


        object.traverse(
            child => {

                if (
                    child.geometry
                ) {

                    child.geometry.dispose()
                }


                if (
                    child.material
                ) {

                    const materials =
                        Array.isArray(
                            child.material
                        )
                            ? child.material
                            : [child.material]


                    materials.forEach(
                        material => {

                            if (
                                material.map
                            ) {

                                material.map.dispose()
                            }


                            if (
                                material.normalMap
                            ) {

                                material.normalMap.dispose()
                            }


                            if (
                                material.roughnessMap
                            ) {

                                material.roughnessMap.dispose()
                            }


                            if (
                                material.metalnessMap
                            ) {

                                material.metalnessMap.dispose()
                            }


                            material.dispose()
                        }
                    )
                }
            }
        )
    }
}