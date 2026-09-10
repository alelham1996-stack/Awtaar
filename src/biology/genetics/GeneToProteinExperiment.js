/* =========================================================
   AWTAAR — GENETICS WORLD
   GENE TO PROTEIN EXPERIMENT
   من الجين إلى البروتين
   ========================================================= */

import * as THREE from 'three'
import './GeneToProtein.css'

import {
    t,
    getLanguage
} from '../../locales/i18n.js'


export default class GeneToProteinExperiment {

    /* =====================================================
       CONSTRUCTOR
       ===================================================== */

    constructor(scene = null, parent = null) {

        this.scene = scene
        this.parent = parent

        this.camera = null

        this.container = null
        this.canvas = null

        this.renderer = null
        this.experimentScene = null
        this.experimentCamera = null

        this.animationFrame = null
        this.clock = new THREE.Clock()

        this.visible = false
        this.running = false
        this.destroyed = false

        this.currentStage = 0
        this.stageProgress = 0

        /* -------------------------------------------------
           VISUAL TRANSITION
           ------------------------------------------------- */

        this.transitionActive = false
        this.transitionProgress = 1
        this.transitionDuration = 0.9

        this.stageVisualState = {
            dna: 0,
            gene: 0,
            mrna: 0,
            ribosome: 0,
            trna: 0,
            protein: 0
        }

        this.languageHandler = () => {
            this.updateLanguage()
        }

        this.handleResize = () => {
            this.resize()
        }

        this.handlePointerMove = (event) => {
            this.onPointerMove(event)
        }

        this.handlePointerDown = (event) => {
            this.onPointerDown(event)
        }

        this.raycaster = new THREE.Raycaster()
        this.pointer = new THREE.Vector2()

        this.interactiveObjects = []

        this.dnaGroup = null
        this.geneGroup = null
        this.mrnaGroup = null
        this.ribosomeGroup = null
        this.trnaGroup = null
        this.proteinGroup = null

        this.progressGroup = null

        this.infoTitleElement = null
        this.infoTextElement = null
        this.stageTitleElement = null
        this.stageDescriptionElement = null

        this.playButton = null
        this.resetButton = null
        this.exitButton = null

        this.stageElements = []

        this.createUI()
        this.createScene()
        this.createExperiment()

        window.addEventListener(
            'awtaar-language-change',
            this.languageHandler
        )

        window.addEventListener(
            'resize',
            this.handleResize
        )

        if (this.renderer) {

            this.renderer.domElement.addEventListener(
                'pointermove',
                this.handlePointerMove
            )

            this.renderer.domElement.addEventListener(
                'pointerdown',
                this.handlePointerDown
            )
        }

        this.updateLanguage()
    }


    /* =====================================================
       TRANSLATION HELPER
       ===================================================== */

    translate(key, fallback = '') {

        const value = t(key)

        if (
            value === key ||
            value === undefined ||
            value === null
        ) {
            return fallback
        }

        return value
    }


    /* =====================================================
       UI
       ===================================================== */

    createUI() {

        this.container =
            document.createElement('div')

        this.container.id =
            'awtaar-gene-protein-experiment'

        this.container.className =
            'awtaar-gene-protein-experiment'

        this.container.setAttribute(
            'aria-label',
            'Gene to Protein Experiment'
        )


        /* -------------------------------------------------
           ATMOSPHERE
           ------------------------------------------------- */

        const atmosphere =
            document.createElement('div')

        atmosphere.className =
            'awtaar-gene-protein-atmosphere'

        this.container.appendChild(
            atmosphere
        )


        /* -------------------------------------------------
           HEADER
           ------------------------------------------------- */

        const header =
            document.createElement('header')

        header.className =
            'awtaar-gene-protein-header'


        const titleArea =
            document.createElement('div')

        titleArea.className =
            'awtaar-gene-protein-title-area'


        this.eyebrowElement =
            document.createElement('div')

        this.eyebrowElement.className =
            'awtaar-gene-protein-eyebrow'

        titleArea.appendChild(
            this.eyebrowElement
        )


        this.titleElement =
            document.createElement('h1')

        this.titleElement.className =
            'awtaar-gene-protein-title'

        titleArea.appendChild(
            this.titleElement
        )


        this.descriptionElement =
            document.createElement('p')

        this.descriptionElement.className =
            'awtaar-gene-protein-description'

        titleArea.appendChild(
            this.descriptionElement
        )


        header.appendChild(
            titleArea
        )


        /* -------------------------------------------------
           EXIT BUTTON
           ------------------------------------------------- */

        this.exitButton =
            document.createElement('button')

        this.exitButton.className =
            'awtaar-gene-protein-exit'

        this.exitButton.type =
            'button'

        this.exitButton.addEventListener(
            'click',
            () => this.exit()
        )

        header.appendChild(
            this.exitButton
        )

        this.container.appendChild(
            header
        )


        /* -------------------------------------------------
           STAGE NAVIGATION
           ------------------------------------------------- */

        const stageBar =
            document.createElement('div')

        stageBar.className =
            'awtaar-gene-protein-stage-bar'


        const stages = [
            {
                number: '01',
                key: 'dna'
            },
            {
                number: '02',
                key: 'transcription'
            },
            {
                number: '03',
                key: 'mrna'
            },
            {
                number: '04',
                key: 'translation'
            },
            {
                number: '05',
                key: 'protein'
            }
        ]


        stages.forEach(
            (stage, index) => {

                const item =
                    document.createElement('button')

                item.type =
                    'button'

                item.className =
                    'awtaar-gene-protein-stage'

                item.dataset.stage =
                    String(index)

                item.innerHTML = `
                    <span class="stage-number">
                        ${stage.number}
                    </span>

                    <span
                        class="stage-label"
                        data-stage-key="${stage.key}"
                    ></span>
                `

                item.addEventListener(
                    'click',
                    () => {
                        this.goToStage(index)
                    }
                )

                this.stageElements.push(item)

                stageBar.appendChild(
                    item
                )
            }
        )

        this.container.appendChild(
            stageBar
        )


        /* -------------------------------------------------
           INFO PANEL
           ------------------------------------------------- */

        const infoPanel =
            document.createElement('div')

        infoPanel.className =
            'awtaar-gene-protein-info-panel'


        this.stageTitleElement =
            document.createElement('h2')

        this.stageTitleElement.className =
            'awtaar-gene-protein-stage-title'

        infoPanel.appendChild(
            this.stageTitleElement
        )


        this.stageDescriptionElement =
            document.createElement('p')

        this.stageDescriptionElement.className =
            'awtaar-gene-protein-stage-description'

        infoPanel.appendChild(
            this.stageDescriptionElement
        )


        const infoDivider =
            document.createElement('div')

        infoDivider.className =
            'awtaar-gene-protein-info-divider'

        infoPanel.appendChild(
            infoDivider
        )


        this.infoTitleElement =
            document.createElement('h3')

        this.infoTitleElement.className =
            'awtaar-gene-protein-info-title'

        infoPanel.appendChild(
            this.infoTitleElement
        )


        this.infoTextElement =
            document.createElement('p')

        this.infoTextElement.className =
            'awtaar-gene-protein-info-text'

        infoPanel.appendChild(
            this.infoTextElement
        )


        this.container.appendChild(
            infoPanel
        )


        /* -------------------------------------------------
           CONTROLS
           ------------------------------------------------- */

        const controls =
            document.createElement('div')

        controls.className =
            'awtaar-gene-protein-controls'

        /*
         * رفع شريط التحكم بشكل أوضح حتى يبقى
         * بعيدًا عن منطقة الأشكال ثلاثية الأبعاد.
         *
         * نستخدم translate بدل تعديل layout
         * حتى لا نؤثر في بقية الواجهة.
         */
        controls.style.transform =
            'translateY(-90px)'


        this.playButton =
            document.createElement('button')

        this.playButton.type =
            'button'

        this.playButton.className =
            'awtaar-gene-protein-control primary'

        this.playButton.addEventListener(
            'click',
            () => this.toggleRunning()
        )

        controls.appendChild(
            this.playButton
        )


        this.resetButton =
            document.createElement('button')

        this.resetButton.type =
            'button'

        this.resetButton.className =
            'awtaar-gene-protein-control'

        this.resetButton.addEventListener(
            'click',
            () => this.reset()
        )

        controls.appendChild(
            this.resetButton
        )


        this.container.appendChild(
            controls
        )


        /* -------------------------------------------------
           HINT
           ------------------------------------------------- */

        this.hintElement =
            document.createElement('div')

        this.hintElement.className =
            'awtaar-gene-protein-hint'

        this.container.appendChild(
            this.hintElement
        )


        document.body.appendChild(
            this.container
        )


        this.container.style.zIndex =
            '1001'
    }


    /* =====================================================
       THREE.JS SCENE
       ===================================================== */

    createScene() {

        this.experimentScene =
            new THREE.Scene()

        this.experimentScene.background =
            new THREE.Color(
                0x07100c
            )

        /*
         * ضباب خفيف يعطي إحساسًا أعمق بالمسافة
         * دون أن يخفي التفاصيل.
         */
        this.experimentScene.fog =
            new THREE.FogExp2(
                0x07100c,
                0.018
            )


        this.experimentCamera =
            new THREE.PerspectiveCamera(
                45,
                window.innerWidth /
                window.innerHeight,
                0.1,
                100
            )

        /*
         * تقريب الكاميرا قليلًا حتى تصبح
         * الأشكال أوضح وأكبر بصريًا.
         */
        this.experimentCamera.position.set(
            0,
            0.7,
            16.5
        )


        this.renderer =
            new THREE.WebGLRenderer({
                antialias: true,
                alpha: true
            })

        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        )

        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        )

        this.renderer.domElement.className =
            'awtaar-gene-protein-canvas'

        this.renderer.domElement.style.position =
            'fixed'

        this.renderer.domElement.style.inset =
            '0'

        this.renderer.domElement.style.zIndex =
            '1000'

        this.renderer.domElement.style.pointerEvents =
            'auto'


        document.body.appendChild(
            this.renderer.domElement
        )


        /* -------------------------------------------------
           LIGHTING
           ------------------------------------------------- */

        const ambient =
            new THREE.AmbientLight(
                0xd6eadc,
                1.25
            )

        this.experimentScene.add(
            ambient
        )


        const keyLight =
            new THREE.PointLight(
                0x7fbd94,
                2.7,
                45
            )

        keyLight.position.set(
            5,
            8,
            11
        )

        this.experimentScene.add(
            keyLight
        )


        const fillLight =
            new THREE.PointLight(
                0x6a9eb0,
                1.5,
                35
            )

        fillLight.position.set(
            -7,
            -3,
            9
        )

        this.experimentScene.add(
            fillLight
        )


        const warmLight =
            new THREE.PointLight(
                0xd2b27a,
                1.15,
                28
            )

        warmLight.position.set(
            5,
            -5,
            5
        )

        this.experimentScene.add(
            warmLight
        )


        const rimLight =
            new THREE.PointLight(
                0xb8c9b5,
                1.35,
                30
            )

        rimLight.position.set(
            0,
            -5,
            -6
        )

        this.experimentScene.add(
            rimLight
        )
    }


    /* =====================================================
       EXPERIMENT
       ===================================================== */

    createExperiment() {

        this.createDNA()

        this.createGene()

        this.createMRNA()

        this.createRibosome()

        this.createTRNA()

        this.createProtein()

        this.createProgressLine()

        this.setStageVisibility(
            this.currentStage,
            false
        )
    }


    /* =====================================================
       MATERIAL HELPERS
       ===================================================== */

    createOrganicMaterial(
        color,
        emissive,
        intensity = 0.45,
        roughness = 0.34,
        metalness = 0.08
    ) {

        return new THREE.MeshStandardMaterial({
            color,
            emissive,
            emissiveIntensity: intensity,
            roughness,
            metalness
        })
    }


    makeTransparentGroup(group) {

        if (!group) {
            return
        }

        group.traverse(
            object => {

                if (!object.material) {
                    return
                }

                const materials =
                    Array.isArray(
                        object.material
                    )
                        ? object.material
                        : [object.material]

                materials.forEach(
                    material => {

                        material.transparent =
                            true

                        material.opacity =
                            1
                    }
                )
            }
        )
    }


    setGroupOpacity(
        group,
        opacity
    ) {

        if (!group) {
            return
        }

        group.traverse(
            object => {

                if (!object.material) {
                    return
                }

                const materials =
                    Array.isArray(
                        object.material
                    )
                        ? object.material
                        : [object.material]

                materials.forEach(
                    material => {

                        material.transparent =
                            true

                        material.opacity =
                            THREE.MathUtils.clamp(
                                opacity,
                                0,
                                1
                            )
                    }
                )
            }
        )
    }


    setGroupScale(
        group,
        scale
    ) {

        if (!group) {
            return
        }

        group.scale.setScalar(
            scale
        )
    }


    /* =====================================================
       DNA
       ===================================================== */

    createDNA() {

        this.dnaGroup =
            new THREE.Group()

        this.dnaGroup.position.set(
            -4.2,
            0.25,
            0
        )

        this.experimentScene.add(
            this.dnaGroup
        )


        const basePairs = [
            ['A', 'T'],
            ['C', 'G'],
            ['G', 'C'],
            ['T', 'A'],
            ['A', 'T'],
            ['C', 'G']
        ]


        const turns = 2.25
        const radius = 1.18
        const height = 7.1
        const segments = 64


        /* -------------------------------------------------
           HELIX ONE
           ------------------------------------------------- */

        const curve1Points = []
        const curve2Points = []


        for (
            let i = 0;
            i <= segments;
            i++
        ) {

            const p =
                i / segments

            const y =
                p * height -
                height / 2

            const angle =
                p *
                Math.PI *
                turns


            curve1Points.push(
                new THREE.Vector3(
                    Math.cos(angle) * radius,
                    y,
                    Math.sin(angle) * radius
                )
            )


            curve2Points.push(
                new THREE.Vector3(
                    Math.cos(angle + Math.PI) * radius,
                    y,
                    Math.sin(angle + Math.PI) * radius
                )
            )
        }


        const curve1 =
            new THREE.CatmullRomCurve3(
                curve1Points
            )

        const curve2 =
            new THREE.CatmullRomCurve3(
                curve2Points
            )


        /*
         * DNA — أخضر زمردي طبيعي
         */
        const backboneMaterial =
            this.createOrganicMaterial(
                0x3f8f67,
                0x123d28,
                0.55,
                0.32,
                0.12
            )


        const backboneMaterial2 =
            this.createOrganicMaterial(
                0x5a9f76,
                0x173e2b,
                0.48,
                0.34,
                0.1
            )


        const tubeGeometry1 =
            new THREE.TubeGeometry(
                curve1,
                96,
                0.115,
                14,
                false
            )


        const tubeGeometry2 =
            new THREE.TubeGeometry(
                curve2,
                96,
                0.115,
                14,
                false
            )


        const backbone1 =
            new THREE.Mesh(
                tubeGeometry1,
                backboneMaterial
            )

        const backbone2 =
            new THREE.Mesh(
                tubeGeometry2,
                backboneMaterial2
            )


        this.dnaGroup.add(
            backbone1,
            backbone2
        )


        /* -------------------------------------------------
           BASE PAIRS
           ------------------------------------------------- */

        for (
            let i = 0;
            i < 7;
            i++
        ) {

            const p =
                i / 6

            const y =
                p * height -
                height / 2

            const angle =
                p *
                Math.PI *
                turns


            const x1 =
                Math.cos(angle) *
                radius

            const z1 =
                Math.sin(angle) *
                radius


            const x2 =
                Math.cos(angle + Math.PI) *
                radius

            const z2 =
                Math.sin(angle + Math.PI) *
                radius


            const pairIndex =
                i %
                basePairs.length

            const pair =
                basePairs[pairIndex]


            const pairGroup =
                new THREE.Group()

            pairGroup.position.set(
                0,
                y,
                0
            )


            /*
             * القواعد تتناوب بين:
             * أخضر هادئ / أزرق مخضر
             */
            const firstColor =
                i % 2 === 0
                    ? 0xb5cfae
                    : 0x76aeb0

            const secondColor =
                i % 2 === 0
                    ? 0x8fb8a0
                    : 0x9abfbd


            const baseMaterial1 =
                this.createOrganicMaterial(
                    firstColor,
                    0x244d3a,
                    0.35,
                    0.3,
                    0.06
                )


            const baseMaterial2 =
                this.createOrganicMaterial(
                    secondColor,
                    0x274c4a,
                    0.32,
                    0.31,
                    0.06
                )


            const baseGeometry =
                new THREE.CapsuleGeometry(
                    0.14,
                    0.5,
                    7,
                    14
                )


            const base1 =
                new THREE.Mesh(
                    baseGeometry,
                    baseMaterial1
                )

            base1.position.set(
                x1,
                0,
                z1
            )


            const base2 =
                new THREE.Mesh(
                    baseGeometry,
                    baseMaterial2
                )

            base2.position.set(
                x2,
                0,
                z2
            )


            /* -------------------------------------------------
               CONNECTOR
               ------------------------------------------------- */

            const start =
                new THREE.Vector3(
                    x1,
                    0,
                    z1
                )

            const end =
                new THREE.Vector3(
                    x2,
                    0,
                    z2
                )

            const direction =
                new THREE.Vector3()
                    .subVectors(
                        end,
                        start
                    )

            const length =
                direction.length()


            const connectorGeometry =
                new THREE.CylinderGeometry(
                    0.055,
                    0.055,
                    length,
                    10
                )


            const connectorMaterial =
                new THREE.MeshStandardMaterial({
                    color: 0xc7c7a6,
                    emissive: 0x3f4936,
                    emissiveIntensity: 0.25,
                    roughness: 0.38,
                    metalness: 0.06,
                    transparent: true,
                    opacity: 0.9
                })


            const connector =
                new THREE.Mesh(
                    connectorGeometry,
                    connectorMaterial
                )


            connector.quaternion.setFromUnitVectors(
                new THREE.Vector3(0, 1, 0),
                direction.normalize()
            )


            pairGroup.add(
                base1,
                base2,
                connector
            )


            pairGroup.userData = {
                type: 'basePair',
                first: pair[0],
                second: pair[1]
            }


            this.interactiveObjects.push(
                pairGroup
            )

            this.dnaGroup.add(
                pairGroup
            )
        }


        /* -------------------------------------------------
           SUBTLE DEPTH RINGS
           ------------------------------------------------- */

        const ringMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x497d62,
                emissive: 0x172f22,
                emissiveIntensity: 0.28,
                roughness: 0.4,
                metalness: 0.1,
                transparent: true,
                opacity: 0.3
            })


        for (
            let i = 0;
            i < 7;
            i++
        ) {

            const y =
                (i / 6) *
                height -
                height / 2

            const ring =
                new THREE.Mesh(
                    new THREE.TorusGeometry(
                        radius,
                        0.018,
                        6,
                        32
                    ),
                    ringMaterial.clone()
                )

            ring.rotation.x =
                Math.PI / 2

            ring.position.y =
                y

            this.dnaGroup.add(
                ring
            )
        }


        this.makeTransparentGroup(
            this.dnaGroup
        )
    }


    /* =====================================================
       GENE
       ===================================================== */

    createGene() {

        this.geneGroup =
            new THREE.Group()

        this.geneGroup.position.set(
            -0.8,
            0.2,
            0.2
        )

        this.experimentScene.add(
            this.geneGroup
        )


        const length = 3.5
        const radius = 0.7
        const points1 = []
        const points2 = []


        for (
            let i = 0;
            i <= 32;
            i++
        ) {

            const p =
                i / 32

            const x =
                p * length -
                length / 2

            const angle =
                p *
                Math.PI *
                2.2


            points1.push(
                new THREE.Vector3(
                    x,
                    Math.cos(angle) * radius,
                    Math.sin(angle) * radius
                )
            )


            points2.push(
                new THREE.Vector3(
                    x,
                    Math.cos(angle + Math.PI) * radius,
                    Math.sin(angle + Math.PI) * radius
                )
            )
        }


        const curve1 =
            new THREE.CatmullRomCurve3(
                points1
            )

        const curve2 =
            new THREE.CatmullRomCurve3(
                points2
            )


        /*
         * Gene — تركوازي طبيعي
         */
        const geneMaterial =
            this.createOrganicMaterial(
                0x5faaa0,
                0x183f3a,
                0.45,
                0.3,
                0.1
            )


        const geneMaterial2 =
            this.createOrganicMaterial(
                0x7e9f72,
                0x263e27,
                0.38,
                0.34,
                0.08
            )


        const tube1 =
            new THREE.Mesh(
                new THREE.TubeGeometry(
                    curve1,
                    64,
                    0.09,
                    12,
                    false
                ),
                geneMaterial
            )


        const tube2 =
            new THREE.Mesh(
                new THREE.TubeGeometry(
                    curve2,
                    64,
                    0.09,
                    12,
                    false
                ),
                geneMaterial2
            )


        this.geneGroup.add(
            tube1,
            tube2
        )


        /* -------------------------------------------------
           GENE MARKERS
           ------------------------------------------------- */

        const markerColors = [
            0xd0c39b,
            0x88aaa0,
            0xa6a978,
            0xb4c4a7
        ]


        for (
            let i = 0;
            i < 8;
            i++
        ) {

            const p =
                i / 7

            const x =
                p * length -
                length / 2

            const angle =
                p *
                Math.PI *
                2.2


            const marker =
                new THREE.Mesh(
                    new THREE.IcosahedronGeometry(
                        0.13,
                        1
                    ),
                    new THREE.MeshStandardMaterial({
                        color:
                            markerColors[
                                i % markerColors.length
                            ],
                        emissive: 0x344337,
                        emissiveIntensity: 0.28,
                        roughness: 0.3,
                        metalness: 0.1
                    })
                )


            marker.position.set(
                x,
                Math.cos(angle) * radius,
                Math.sin(angle) * radius
            )

            this.geneGroup.add(
                marker
            )
        }


        this.geneGroup.userData = {
            type: 'gene'
        }


        this.interactiveObjects.push(
            this.geneGroup
        )


        this.makeTransparentGroup(
            this.geneGroup
        )
    }


    /* =====================================================
       mRNA
       ===================================================== */

    createMRNA() {

        this.mrnaGroup =
            new THREE.Group()

        this.mrnaGroup.position.set(
            2.8,
            2.1,
            0
        )

        this.experimentScene.add(
            this.mrnaGroup
        )


        const points = []


        for (
            let i = 0;
            i < 14;
            i++
        ) {

            points.push(
                new THREE.Vector3(
                    i * 0.42 - 2.7,
                    Math.sin(i * 0.72) * 0.28,
                    Math.cos(i * 0.52) * 0.12
                )
            )
        }


        const curve =
            new THREE.CatmullRomCurve3(
                points
            )


        /*
         * mRNA — أزرق مخضر
         */
        const backbone =
            new THREE.Mesh(
                new THREE.TubeGeometry(
                    curve,
                    64,
                    0.05,
                    10,
                    false
                ),
                this.createOrganicMaterial(
                    0x4f8f91,
                    0x173f42,
                    0.42,
                    0.34,
                    0.08
                )
            )


        this.mrnaGroup.add(
            backbone
        )


        const mrnaColors = [
            0x8eb8ad,
            0x6d9ea0,
            0xb0b895,
            0x7fa6a2
        ]


        for (
            let i = 0;
            i < points.length;
            i++
        ) {

            const nucleotide =
                new THREE.Mesh(
                    new THREE.IcosahedronGeometry(
                        0.18,
                        2
                    ),
                    new THREE.MeshStandardMaterial({
                        color:
                            mrnaColors[
                                i % mrnaColors.length
                            ],
                        emissive: 0x214a47,
                        emissiveIntensity: 0.3,
                        roughness: 0.3,
                        metalness: 0.08
                    })
                )


            nucleotide.position.copy(
                points[i]
            )


            nucleotide.userData = {
                type: 'mrnaBase',
                index: i
            }


            this.mrnaGroup.add(
                nucleotide
            )

            this.interactiveObjects.push(
                nucleotide
            )
        }


        this.makeTransparentGroup(
            this.mrnaGroup
        )
    }


    /* =====================================================
       RIBOSOME
       ===================================================== */

    createRibosome() {

        this.ribosomeGroup =
            new THREE.Group()

        this.ribosomeGroup.position.set(
            4.0,
            -1.7,
            0
        )

        this.experimentScene.add(
            this.ribosomeGroup
        )


        const upperGeometry =
            new THREE.SphereGeometry(
                1.42,
                40,
                28
            )


        const lowerGeometry =
            new THREE.SphereGeometry(
                1.08,
                40,
                28
            )


        /*
         * Ribosome — بنفسجي عضوي داكن
         */
        const upperMaterial =
            this.createOrganicMaterial(
                0x756d83,
                0x292036,
                0.38,
                0.35,
                0.1
            )


        const lowerMaterial =
            this.createOrganicMaterial(
                0x8c7b91,
                0x34233b,
                0.34,
                0.37,
                0.08
            )


        const upper =
            new THREE.Mesh(
                upperGeometry,
                upperMaterial
            )

        upper.scale.set(
            1,
            0.62,
            1
        )

        upper.position.y =
            0.55


        const lower =
            new THREE.Mesh(
                lowerGeometry,
                lowerMaterial
            )

        lower.scale.set(
            1,
            0.55,
            1
        )

        lower.position.y =
            -0.42


        this.ribosomeGroup.add(
            upper,
            lower
        )


        /* -------------------------------------------------
           INTERNAL CHANNEL
           ------------------------------------------------- */

        const channel =
            new THREE.Mesh(
                new THREE.TorusGeometry(
                    0.48,
                    0.06,
                    10,
                    32
                ),
                new THREE.MeshStandardMaterial({
                    color: 0xb4a8a0,
                    emissive: 0x423831,
                    emissiveIntensity: 0.35,
                    roughness: 0.3,
                    metalness: 0.1
                })
            )

        channel.rotation.x =
            Math.PI / 2

        channel.position.y =
            0.05


        this.ribosomeGroup.add(
            channel
        )


        /*
         * نقطة داخلية داكنة تعطي إحساسًا
         * بوجود قناة حقيقية داخل الريبوسوم.
         */
        const innerCore =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    0.27,
                    24,
                    20
                ),
                new THREE.MeshStandardMaterial({
                    color: 0x302934,
                    emissive: 0x120e14,
                    emissiveIntensity: 0.2,
                    roughness: 0.5,
                    metalness: 0.02
                })
            )

        innerCore.position.z =
            0.02

        innerCore.position.y =
            0.05


        this.ribosomeGroup.add(
            innerCore
        )


        this.ribosomeGroup.userData = {
            type: 'ribosome'
        }


        this.interactiveObjects.push(
            this.ribosomeGroup
        )


        this.makeTransparentGroup(
            this.ribosomeGroup
        )
    }


    /* =====================================================
       tRNA
       ===================================================== */

    createTRNA() {

        this.trnaGroup =
            new THREE.Group()

        this.trnaGroup.position.set(
            5.7,
            -1.2,
            0
        )

        this.experimentScene.add(
            this.trnaGroup
        )


        for (
            let i = 0;
            i < 4;
            i++
        ) {

            const trna =
                new THREE.Group()


            trna.position.set(
                0,
                i * 1.15 - 1.8,
                0
            )


            /*
             * tRNA — كريمي ذهبي هادئ
             */
            const stemMaterial =
                this.createOrganicMaterial(
                    0xc4b58d,
                    0x4b3d24,
                    0.32,
                    0.38,
                    0.08
                )


            const stem =
                new THREE.Mesh(
                    new THREE.CapsuleGeometry(
                        0.13,
                        0.72,
                        8,
                        14
                    ),
                    stemMaterial
                )


            stem.rotation.z =
                -0.25


            trna.add(
                stem
            )


            /*
             * الذراع العلوي
             */

            const arm =
                new THREE.Mesh(
                    new THREE.CapsuleGeometry(
                        0.10,
                        0.42,
                        8,
                        12
                    ),
                    stemMaterial.clone()
                )


            arm.rotation.z =
                Math.PI / 2.7

            arm.position.set(
                0.2,
                0.15,
                0
            )


            trna.add(
                arm
            )


            /*
             * الحمض الأميني
             * بلون وردي/خوخي هادئ.
             */
            const amino =
                new THREE.Mesh(
                    new THREE.IcosahedronGeometry(
                        0.3,
                        2
                    ),
                    new THREE.MeshStandardMaterial({
                        color: 0xc49b91,
                        emissive: 0x49312e,
                        emissiveIntensity: 0.32,
                        roughness: 0.3,
                        metalness: 0.08
                    })
                )


            amino.position.set(
                0.22,
                0.65,
                0
            )


            amino.userData = {
                type: 'trna',
                index: i
            }


            trna.add(
                amino
            )


            this.trnaGroup.add(
                trna
            )

            this.interactiveObjects.push(
                trna
            )
        }


        this.makeTransparentGroup(
            this.trnaGroup
        )
    }


    /* =====================================================
       PROTEIN
       ===================================================== */

    createProtein() {

        this.proteinGroup =
            new THREE.Group()

        this.proteinGroup.position.set(
            7.0,
            2.5,
            0
        )

        this.experimentScene.add(
            this.proteinGroup
        )


        const aminoCount = 18
        const points = []


        for (
            let i = 0;
            i < aminoCount;
            i++
        ) {

            const angle =
                i * 0.72

            const radius =
                0.48 +
                i * 0.045


            points.push(
                new THREE.Vector3(
                    Math.cos(angle) * radius,
                    Math.sin(angle) * radius,
                    Math.sin(i * 0.5) * 0.55
                )
            )
        }


        /* -------------------------------------------------
           PROTEIN CHAIN
           ------------------------------------------------- */

        const curve =
            new THREE.CatmullRomCurve3(
                points
            )


        const chain =
            new THREE.Mesh(
                new THREE.TubeGeometry(
                    curve,
                    80,
                    0.06,
                    10,
                    false
                ),
                this.createOrganicMaterial(
                    0x81708c,
                    0x34283d,
                    0.32,
                    0.38,
                    0.1
                )
            )


        this.proteinGroup.add(
            chain
        )


        /* -------------------------------------------------
           AMINO ACIDS
           ------------------------------------------------- */

        const proteinColors = [
            0xb99b92,
            0x9d88a4,
            0xb5aa7d,
            0x739b94,
            0xc0a49d,
            0x8e8199
        ]


        for (
            let i = 0;
            i < aminoCount;
            i++
        ) {

            const amino =
                new THREE.Mesh(
                    new THREE.IcosahedronGeometry(
                        0.23 +
                        (i % 3) * 0.018,
                        2
                    ),
                    new THREE.MeshStandardMaterial({
                        color:
                            proteinColors[
                                i % proteinColors.length
                            ],
                        emissive: 0x332a31,
                        emissiveIntensity: 0.28,
                        roughness: 0.32,
                        metalness: 0.08
                    })
                )


            amino.position.copy(
                points[i]
            )


            amino.userData = {
                type: 'aminoAcid',
                index: i
            }


            this.proteinGroup.add(
                amino
            )

            this.interactiveObjects.push(
                amino
            )
        }


        this.proteinGroup.userData = {
            type: 'protein'
        }


        this.interactiveObjects.push(
            this.proteinGroup
        )


        this.makeTransparentGroup(
            this.proteinGroup
        )
    }


    /* =====================================================
       PROGRESS LINE
       ===================================================== */

    createProgressLine() {

        this.progressGroup =
            new THREE.Group()

        this.progressGroup.position.y =
            -5

        this.experimentScene.add(
            this.progressGroup
        )


        const points = [
            new THREE.Vector3(-5, 0, 0),
            new THREE.Vector3(5, 0, 0)
        ]


        const geometry =
            new THREE.BufferGeometry()
                .setFromPoints(
                    points
                )


        const material =
            new THREE.LineBasicMaterial({
                color: 0x6f8f7c,
                transparent: true,
                opacity: 0.25
            })


        const line =
            new THREE.Line(
                geometry,
                material
            )


        this.progressGroup.add(
            line
        )
    }


    /* =====================================================
       STAGES
       ===================================================== */

    goToStage(stage) {

        if (
            stage < 0 ||
            stage > 4
        ) {
            return
        }


        this.currentStage =
            stage

        this.stageProgress =
            0

        this.setStageVisibility(
            stage,
            true
        )

        this.updateStageUI()
    }


    setStageVisibility(
        stage,
        animate = true
    ) {

        const groups = {
            dna: this.dnaGroup,
            gene: this.geneGroup,
            mrna: this.mrnaGroup,
            ribosome: this.ribosomeGroup,
            trna: this.trnaGroup,
            protein: this.proteinGroup
        }


        const target = {
            dna:
                stage >= 0
                    ? 1
                    : 0,

            gene:
                stage >= 1
                    ? 1
                    : 0,

            mrna:
                stage >= 2
                    ? 1
                    : 0,

            ribosome:
                stage >= 3
                    ? 1
                    : 0,

            trna:
                stage >= 3
                    ? 1
                    : 0,

            protein:
                stage >= 4
                    ? 1
                    : 0
        }


        Object.keys(groups).forEach(
            key => {

                const group =
                    groups[key]

                if (!group) {
                    return
                }


                group.visible =
                    target[key] > 0


                if (!animate) {

                    this.stageVisualState[key] =
                        target[key]

                    this.setGroupOpacity(
                        group,
                        target[key]
                    )

                    this.setGroupScale(
                        group,
                        target[key] > 0
                            ? 1
                            : 0.35
                    )

                    return
                }


                if (
                    target[key] > 0 &&
                    this.stageVisualState[key] === 0
                ) {

                    this.stageVisualState[key] =
                        0.001

                    group.visible =
                        true

                    this.setGroupOpacity(
                        group,
                        0
                    )

                    this.setGroupScale(
                        group,
                        0.35
                    )
                }


                if (
                    target[key] === 0
                ) {

                    this.stageVisualState[key] =
                        0

                    group.visible =
                        false

                    this.setGroupOpacity(
                        group,
                        0
                    )

                    this.setGroupScale(
                        group,
                        0.35
                    )
                }
            }
        )


        this.transitionActive =
            animate

        this.transitionProgress =
            animate
                ? 0
                : 1
    }


    updateStageTransition(delta) {

        if (!this.transitionActive) {
            return
        }


        this.transitionProgress +=
            delta /
            this.transitionDuration


        const progress =
            THREE.MathUtils.clamp(
                this.transitionProgress,
                0,
                1
            )


        const eased =
            progress *
            progress *
            (3 - 2 * progress)


        const groups = {
            dna: this.dnaGroup,
            gene: this.geneGroup,
            mrna: this.mrnaGroup,
            ribosome: this.ribosomeGroup,
            trna: this.trnaGroup,
            protein: this.proteinGroup
        }


        Object.keys(groups).forEach(
            key => {

                const group =
                    groups[key]

                if (!group) {
                    return
                }


                const target =
                    this.stageVisualState[key]


                if (target > 0) {

                    const opacity =
                        eased

                    const scale =
                        0.35 +
                        eased * 0.65


                    group.visible =
                        true

                    this.setGroupOpacity(
                        group,
                        opacity
                    )

                    this.setGroupScale(
                        group,
                        scale
                    )
                }
            }
        )


        if (progress >= 1) {

            this.transitionActive =
                false


            Object.keys(groups).forEach(
                key => {

                    const group =
                        groups[key]

                    if (!group) {
                        return
                    }

                    const target =
                        this.stageVisualState[key]

                    if (target > 0) {

                        group.visible =
                            true

                        this.setGroupOpacity(
                            group,
                            1
                        )

                        this.setGroupScale(
                            group,
                            1
                        )
                    }
                }
            )
        }
    }


    /* =====================================================
       RUNNING
       ===================================================== */

    toggleRunning() {

        this.running =
            !this.running

        this.updateControlLabels()
    }


    /* =====================================================
       RESET
       ===================================================== */

    reset() {

        this.currentStage =
            0

        this.stageProgress =
            0

        this.running =
            false

        this.transitionActive =
            false

        this.transitionProgress =
            1


        this.stageVisualState = {
            dna: 1,
            gene: 0,
            mrna: 0,
            ribosome: 0,
            trna: 0,
            protein: 0
        }


        this.clock.start()


        this.setStageVisibility(
            0,
            false
        )


        this.updateStageUI()

        this.updateControlLabels()

        this.clearInfo()
    }


    /* =====================================================
       POINTER
       ===================================================== */

    onPointerMove(event) {

        if (
            !this.renderer ||
            !this.experimentCamera
        ) {
            return
        }


        const rect =
            this.renderer
                .domElement
                .getBoundingClientRect()


        this.pointer.x =
            (
                (event.clientX - rect.left) /
                rect.width
            ) * 2 - 1


        this.pointer.y =
            -(
                (event.clientY - rect.top) /
                rect.height
            ) * 2 + 1


        this.raycaster.setFromCamera(
            this.pointer,
            this.experimentCamera
        )


        const intersections =
            this.raycaster.intersectObjects(
                this.interactiveObjects,
                true
            )


        this.renderer.domElement.style.cursor =
            intersections.length
                ? 'pointer'
                : 'default'
    }


    onPointerDown(event) {

        if (
            !this.renderer ||
            !this.experimentCamera
        ) {
            return
        }


        const rect =
            this.renderer
                .domElement
                .getBoundingClientRect()


        this.pointer.x =
            (
                (event.clientX - rect.left) /
                rect.width
            ) * 2 - 1


        this.pointer.y =
            -(
                (event.clientY - rect.top) /
                rect.height
            ) * 2 + 1


        this.raycaster.setFromCamera(
            this.pointer,
            this.experimentCamera
        )


        const intersections =
            this.raycaster.intersectObjects(
                this.interactiveObjects,
                true
            )


        if (
            intersections.length === 0
        ) {
            return
        }


        let object =
            intersections[0].object


        while (
            object.parent &&
            !object.userData.type
        ) {

            object =
                object.parent
        }


        this.showObjectInfo(
            object
        )
    }


    /* =====================================================
       OBJECT INFORMATION
       ===================================================== */

    showObjectInfo(object) {

        const type =
            object.userData.type


        if (type === 'basePair') {

            const first =
                object.userData.first

            const second =
                object.userData.second


            this.infoTitleElement.textContent =
                this.translate(
                    'biology.geneToProtein.info.basePair.title',
                    'Base Pair'
                )


            this.infoTextElement.textContent =
                this.translate(
                    'biology.geneToProtein.info.basePair.text',
                    `${first} ↔ ${second}`
                )

            return
        }


        if (type === 'gene') {

            this.infoTitleElement.textContent =
                this.translate(
                    'biology.geneToProtein.info.gene.title',
                    'Gene'
                )


            this.infoTextElement.textContent =
                this.translate(
                    'biology.geneToProtein.info.gene.text',
                    'A gene is a segment of DNA that contains information used to build a functional product.'
                )

            return
        }


        if (type === 'mrnaBase') {

            this.infoTitleElement.textContent =
                this.translate(
                    'biology.geneToProtein.info.mrna.title',
                    'mRNA'
                )


            this.infoTextElement.textContent =
                this.translate(
                    'biology.geneToProtein.info.mrna.text',
                    'mRNA carries a copy of genetic information from DNA toward the ribosome.'
                )

            return
        }


        if (type === 'ribosome') {

            this.infoTitleElement.textContent =
                this.translate(
                    'biology.geneToProtein.info.ribosome.title',
                    'Ribosome'
                )


            this.infoTextElement.textContent =
                this.translate(
                    'biology.geneToProtein.info.ribosome.text',
                    'The ribosome reads mRNA and helps assemble the amino-acid chain.'
                )

            return
        }


        if (type === 'trna') {

            this.infoTitleElement.textContent =
                this.translate(
                    'biology.geneToProtein.info.trna.title',
                    'tRNA'
                )


            this.infoTextElement.textContent =
                this.translate(
                    'biology.geneToProtein.info.trna.text',
                    'tRNA brings the appropriate amino acid during translation.'
                )

            return
        }


        if (type === 'aminoAcid') {

            this.infoTitleElement.textContent =
                this.translate(
                    'biology.geneToProtein.info.aminoAcid.title',
                    'Amino Acid'
                )


            this.infoTextElement.textContent =
                this.translate(
                    'biology.geneToProtein.info.aminoAcid.text',
                    'Amino acids are the building blocks that form proteins.'
                )

            return
        }


        if (type === 'protein') {

            this.infoTitleElement.textContent =
                this.translate(
                    'biology.geneToProtein.info.protein.title',
                    'Protein'
                )


            this.infoTextElement.textContent =
                this.translate(
                    'biology.geneToProtein.info.protein.text',
                    'The amino-acid chain folds into a functional protein.'
                )
        }
    }


    clearInfo() {

        if (this.infoTitleElement) {

            this.infoTitleElement.textContent =
                this.translate(
                    'biology.geneToProtein.info.default.title',
                    'Explore the process'
                )
        }


        if (this.infoTextElement) {

            this.infoTextElement.textContent =
                this.translate(
                    'biology.geneToProtein.info.default.text',
                    'Select an element in the scene to learn more.'
                )
        }
    }


    /* =====================================================
       STAGE UI
       ===================================================== */

    updateStageUI() {

        const stageKeys = [
            'dna',
            'transcription',
            'mrna',
            'translation',
            'protein'
        ]


        this.stageElements.forEach(
            (element, index) => {

                element.classList.toggle(
                    'active',
                    index === this.currentStage
                )


                element.classList.toggle(
                    'completed',
                    index < this.currentStage
                )
            }
        )


        const stageKey =
            stageKeys[
                this.currentStage
            ]


        this.stageTitleElement.textContent =
            this.translate(
                `biology.geneToProtein.stages.${stageKey}.title`,
                ''
            )


        this.stageDescriptionElement.textContent =
            this.translate(
                `biology.geneToProtein.stages.${stageKey}.description`,
                ''
            )
    }


    updateControlLabels() {

        if (!this.playButton) {
            return
        }


        this.playButton.textContent =
            this.running
                ? this.translate(
                    'biology.geneToProtein.controls.pause',
                    'Pause'
                )
                : this.translate(
                    'biology.geneToProtein.controls.resume',
                    'Resume'
                )


        this.resetButton.textContent =
            this.translate(
                'biology.geneToProtein.controls.reset',
                'Reset'
            )


        this.exitButton.textContent =
            this.translate(
                'biology.geneToProtein.controls.exit',
                'Exit'
            )


        this.hintElement.textContent =
            this.translate(
                'biology.geneToProtein.hint',
                'Follow the journey of genetic information.'
            )
    }


    /* =====================================================
       LANGUAGE
       ===================================================== */

    updateLanguage() {

        const language =
            getLanguage()


        if (!this.container) {
            return
        }


        this.container.dir =
            language === 'ar'
                ? 'rtl'
                : 'ltr'


        this.container.lang =
            language


        this.eyebrowElement.textContent =
            this.translate(
                'biology.geneToProtein.eyebrow',
                'AWTAAR • GENE TO PROTEIN'
            )


        this.titleElement.textContent =
            this.translate(
                'biology.geneToProtein.title',
                'From Gene to Protein'
            )


        this.descriptionElement.textContent =
            this.translate(
                'biology.geneToProtein.description',
                'Follow the journey of genetic information from DNA to a functional protein.'
            )


        const stageKeys = [
            'dna',
            'transcription',
            'mrna',
            'translation',
            'protein'
        ]


        this.stageElements.forEach(
            (element, index) => {

                const label =
                    element.querySelector(
                        '.stage-label'
                    )

                if (!label) {
                    return
                }


                const key =
                    stageKeys[index]


                label.textContent =
                    this.translate(
                        `biology.geneToProtein.stages.${key}.short`,
                        key
                    )
            }
        )


        this.updateStageUI()

        this.updateControlLabels()
    }


    /* =====================================================
       ANIMATION
       ===================================================== */

    update(delta = 0.016) {

        if (
            !this.visible ||
            this.destroyed
        ) {
            return
        }


        /* -------------------------------------------------
           STAGE TRANSITION
           ------------------------------------------------- */

        this.updateStageTransition(
            delta
        )


        /* -------------------------------------------------
           AUTOMATIC PROGRESSION
           ------------------------------------------------- */

        if (this.running) {

            this.stageProgress +=
                delta * 0.25


            if (
                this.stageProgress >= 1
            ) {

                this.stageProgress =
                    0


                if (
                    this.currentStage <
                    4
                ) {

                    this.currentStage++


                    this.setStageVisibility(
                        this.currentStage,
                        true
                    )


                    this.updateStageUI()
                }
                else {

                    this.running =
                        false

                    this.updateControlLabels()
                }
            }
        }


        const elapsed =
            performance.now() *
            0.001


        /* -------------------------------------------------
           DNA
           ------------------------------------------------- */

        if (this.dnaGroup) {

            this.dnaGroup.rotation.y +=
                delta * 0.12
        }


        /* -------------------------------------------------
           GENE
           ------------------------------------------------- */

        if (this.geneGroup) {

            this.geneGroup.rotation.y =
                Math.sin(
                    elapsed * 0.65
                ) * 0.16

            this.geneGroup.rotation.z =
                Math.sin(
                    elapsed * 0.45
                ) * 0.08
        }


        /* -------------------------------------------------
           mRNA
           ------------------------------------------------- */

        if (this.mrnaGroup) {

            this.mrnaGroup.rotation.z +=
                delta * 0.09

            this.mrnaGroup.position.y =
                2.1 +
                Math.sin(
                    elapsed * 1.2
                ) * 0.08
        }


        /* -------------------------------------------------
           RIBOSOME
           ------------------------------------------------- */

        if (this.ribosomeGroup) {

            this.ribosomeGroup.rotation.y +=
                delta * 0.13

            this.ribosomeGroup.rotation.x =
                Math.sin(
                    elapsed * 0.55
                ) * 0.05
        }


        /* -------------------------------------------------
           tRNA
           ------------------------------------------------- */

        if (this.trnaGroup) {

            this.trnaGroup.children.forEach(
                (trna, index) => {

                    trna.position.x =
                        Math.sin(
                            elapsed * 1.2 +
                            index * 0.8
                        ) * 0.22

                    trna.rotation.z =
                        Math.sin(
                            elapsed * 0.9 +
                            index
                        ) * 0.08
                }
            )
        }


        /* -------------------------------------------------
           PROTEIN
           ------------------------------------------------- */

        if (this.proteinGroup) {

            this.proteinGroup.rotation.y +=
                delta * 0.16

            this.proteinGroup.rotation.x =
                Math.sin(
                    elapsed * 0.55
                ) * 0.14

            this.proteinGroup.position.y =
                2.5 +
                Math.sin(
                    elapsed * 0.9
                ) * 0.1
        }


        /* -------------------------------------------------
           RENDER
           ------------------------------------------------- */

        if (
            this.renderer &&
            this.experimentScene &&
            this.experimentCamera
        ) {

            this.renderer.render(
                this.experimentScene,
                this.experimentCamera
            )
        }
    }


    /* =====================================================
       RESIZE
       ===================================================== */

    resize() {

        if (
            !this.renderer ||
            !this.experimentCamera
        ) {
            return
        }


        const width =
            window.innerWidth

        const height =
            window.innerHeight


        this.experimentCamera.aspect =
            width / height


        this.experimentCamera.updateProjectionMatrix()


        this.renderer.setSize(
            width,
            height
        )
    }


    /* =====================================================
       SHOW
       ===================================================== */

    show() {

        if (
            this.destroyed ||
            !this.container
        ) {
            return
        }


        this.visible =
            true


        this.container.classList.add(
            'is-visible'
        )


        this.container.classList.remove(
            'is-hidden'
        )


        this.container.style.display =
            'block'


        this.container.style.zIndex =
            '1001'


        if (this.renderer) {

            this.renderer.domElement.style.display =
                'block'

            this.renderer.domElement.style.zIndex =
                '1000'
        }


        this.clock.start()

        this.updateLanguage()

        this.renderOnce()
    }


    /* =====================================================
       HIDE
       ===================================================== */

    hide() {

        this.visible =
            false


        if (this.container) {

            this.container.classList.add(
                'is-hidden'
            )
        }


        if (this.renderer) {

            this.renderer.domElement.style.display =
                'none'
        }
    }


    /* =====================================================
       RENDER ONCE
       ===================================================== */

    renderOnce() {

        if (
            !this.renderer ||
            !this.experimentScene ||
            !this.experimentCamera
        ) {
            return
        }


        this.renderer.render(
            this.experimentScene,
            this.experimentCamera
        )
    }


    /* =====================================================
       EXIT
       ===================================================== */

    exit() {

        if (
            this.parent &&
            typeof this.parent.returnFromGeneToProteinExperiment === 'function'
        ) {

            this.parent
                .returnFromGeneToProteinExperiment()

            return
        }


        this.hide()
    }


    /* =====================================================
       DESTROY
       ===================================================== */

    destroy() {

        if (this.destroyed) {
            return
        }


        this.destroyed =
            true

        this.visible =
            false


        window.removeEventListener(
            'awtaar-language-change',
            this.languageHandler
        )


        window.removeEventListener(
            'resize',
            this.handleResize
        )


        if (this.renderer) {

            this.renderer.domElement.removeEventListener(
                'pointermove',
                this.handlePointerMove
            )


            this.renderer.domElement.removeEventListener(
                'pointerdown',
                this.handlePointerDown
            )
        }


        if (this.animationFrame) {

            cancelAnimationFrame(
                this.animationFrame
            )


            this.animationFrame =
                null
        }


        if (this.renderer) {

            this.renderer.dispose()


            if (
                this.renderer.domElement &&
                this.renderer.domElement.parentNode
            ) {

                this.renderer
                    .domElement
                    .parentNode
                    .removeChild(
                        this.renderer.domElement
                    )
            }
        }


        if (this.experimentScene) {

            this.experimentScene.traverse(
                object => {

                    if (
                        object.geometry
                    ) {

                        object.geometry.dispose()
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

                                    material.dispose()
                                }
                            )

                        }
                        else {

                            object.material.dispose()
                        }
                    }
                }
            )
        }


        if (
            this.container &&
            this.container.parentNode
        ) {

            this.container.parentNode
                .removeChild(
                    this.container
                )
        }


        this.interactiveObjects = []

        this.experimentScene =
            null

        this.experimentCamera =
            null

        this.renderer =
            null

        this.container =
            null
    }
}