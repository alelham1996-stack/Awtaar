/* =========================================================
   AWTAAR — GENETICS WORLD
   DNA — THE CODE OF LIFE
   =========================================================

   🧬 DNA — شفرة الحياة

   Scientific focus:
   - Double helix
   - Sugar-phosphate backbones
   - Base pairs
   - A ↔ T
   - C ↔ G
   - Genetic information is encoded by base sequence

   ========================================================= */

import * as THREE from 'three'
import './DNAExperiment.css'
import { t, getLanguage } from '../../locales/i18n.js'


/* =========================================================
   DNA EXPERIMENT
   ========================================================= */

export default class DNAExperiment {

    constructor(scene = null, parentUI = null) {

        console.log(
            '🧬 DNAExperiment: CONSTRUCTOR START'
        )

        this.scene =
            scene

        this.parentUI =
            parentUI

        this.camera =
            null


        /* -------------------------------------------------
           STATE
           ------------------------------------------------- */

        this.visible =
            false

        this.destroyed =
            false

        this.paused =
            false

        this.time =
            0

        this.rotationSpeed =
            0.22

        this.hoveredPair =
            null

        this.selectedPair =
            null


        /* -------------------------------------------------
           UNIVERSE STATE
           ------------------------------------------------- */

        this.universe =
            null

        this.backgroundHidden =
            false


        /* -------------------------------------------------
           THREE GROUPS
           ------------------------------------------------- */

        this.root =
            new THREE.Group()

        this.root.name =
            'AwtaarDNAExperiment'


        this.dnaGroup =
            new THREE.Group()

        this.dnaGroup.name =
            'DNA_DoubleHelix'


        this.backboneGroup =
            new THREE.Group()

        this.backboneGroup.name =
            'DNA_Backbones'


        this.basePairGroup =
            new THREE.Group()

        this.basePairGroup.name =
            'DNA_BasePairs'


        this.highlightGroup =
            new THREE.Group()

        this.highlightGroup.name =
            'DNA_Highlights'


        this.root.add(
            this.dnaGroup
        )


        this.dnaGroup.add(
            this.backboneGroup
        )


        this.dnaGroup.add(
            this.basePairGroup
        )


        this.dnaGroup.add(
            this.highlightGroup
        )


        /* -------------------------------------------------
           DNA PARAMETERS
           ------------------------------------------------- */

        this.pairCount =
            28

        this.helixHeight =
            10.5

        this.helixRadius =
            2.25

        this.turns =
            3.6

        this.backboneRadius =
            0.075

        this.baseRadius =
            0.17

        this.rungRadius =
            0.055


        /*
           حجم DNA داخل عالم أوتار.

           1.0 = الحجم الأصلي الكبير
           0.55 = حجم مناسب للتجربة
        */

        this.dnaScale =
            0.55


        /* -------------------------------------------------
           BASE SEQUENCE
           ------------------------------------------------- */

        this.basePairs = [

            ['A', 'T'],
            ['C', 'G'],
            ['G', 'C'],
            ['T', 'A'],
            ['A', 'T'],
            ['C', 'G'],
            ['T', 'A'],
            ['G', 'C'],
            ['A', 'T'],
            ['C', 'G'],
            ['G', 'C'],
            ['T', 'A'],
            ['A', 'T'],
            ['G', 'C'],
            ['C', 'G'],
            ['T', 'A'],
            ['A', 'T'],
            ['C', 'G'],
            ['G', 'C'],
            ['T', 'A'],
            ['C', 'G'],
            ['A', 'T'],
            ['G', 'C'],
            ['T', 'A'],
            ['A', 'T'],
            ['C', 'G'],
            ['G', 'C'],
            ['A', 'T']

        ]


        /* -------------------------------------------------
           INTERACTION
           ------------------------------------------------- */

        this.raycaster =
            new THREE.Raycaster()


        this.pointer =
            new THREE.Vector2(
                999,
                999
            )


        this.interactivePairs =
            []


        this.pairMeshes =
            new Map()


        /*
           Canvas الخاص بـ Three.js.

           نربط التفاعل به مباشرة بدل window
           حتى تكون إحداثيات Raycaster دقيقة.
        */

        this.canvas =
            null


        /* -------------------------------------------------
           DOM
           ------------------------------------------------- */

        this.container =
            null

        this.infoPanel =
            null

        this.selectedLabel =
            null

        this.selectedDescription =
            null

        this.statusElement =
            null

        this.pauseButton =
            null

        this.resetButton =
            null

        this.exitButton =
            null


        /* -------------------------------------------------
           LANGUAGE
           ------------------------------------------------- */

        this.handleLanguageChange =
            () => this.updateLanguage()


        window.addEventListener(
            'awtaar-language-change',
            this.handleLanguageChange
        )


        /* -------------------------------------------------
           BUILD
           ------------------------------------------------- */

        this.createSceneStructure()

        this.createInterface()

        this.createDNA()

        this.setupInteraction()

        this.updateLanguage()

        this.hide()


        console.log(
            '🧬 DNAExperiment: CONSTRUCTOR COMPLETE'
        )
    }


    /* =====================================================
       SCENE
       ===================================================== */

    createSceneStructure() {

        if (!this.scene) {

            console.warn(
                '⚠️ DNAExperiment: scene not provided yet'
            )

            return
        }


        if (
            this.root.parent !== this.scene
        ) {

            this.scene.add(
                this.root
            )
        }


        /*
           موقع DNA داخل المشهد.
        */

        this.root.position.set(
            0,
            0,
            0
        )


        /*
           الحجم الأساسي للتجربة.
        */

        this.root.scale.setScalar(
            this.dnaScale
        )


        this.root.visible =
            false


        /* -------------------------------------------------
           CAMERA
           ------------------------------------------------- */

        if (
            this.scene.userData &&
            this.scene.userData.camera
        ) {

            this.camera =
                this.scene.userData.camera

            console.log(
                '🧬 DNAExperiment: CAMERA FOUND FROM SCENE'
            )
        }


        /* -------------------------------------------------
           UNIVERSE
           ------------------------------------------------- */

        if (
            this.scene.userData &&
            this.scene.userData.awtaarUniverse
        ) {

            this.universe =
                this.scene.userData.awtaarUniverse

        }
    }


    /* =====================================================
       INTERFACE
       ===================================================== */

    createInterface() {

        this.container =
            document.createElement('section')


        this.container.className =
            'awtaar-dna-experiment'


        this.container.setAttribute(
            'aria-label',
            'DNA — The Code of Life'
        )


        /* -------------------------------------------------
           HEADER
           ------------------------------------------------- */

        const header =
            document.createElement('header')


        header.className =
            'dna-experiment-header'


        const titleArea =
            document.createElement('div')


        titleArea.className =
            'dna-experiment-title-area'


        const eyebrow =
            document.createElement('div')


        eyebrow.className =
            'dna-experiment-eyebrow'


        eyebrow.textContent =
            'AWTAAR • GENETICS'


        const title =
            document.createElement('h2')


        title.className =
            'dna-experiment-title'


        title.textContent =
            'شفرة الحياة'


        const description =
            document.createElement('p')


        description.className =
            'dna-experiment-description'


        description.textContent =
            'اكتشف كيف تُخزّن بنية DNA المعلومات الوراثية داخل ترتيب دقيق من القواعد.'


        titleArea.appendChild(
            eyebrow
        )


        titleArea.appendChild(
            title
        )


        titleArea.appendChild(
            description
        )


        /* -------------------------------------------------
           EXIT
           ------------------------------------------------- */

        this.exitButton =
            document.createElement('button')


        this.exitButton.type =
            'button'


        this.exitButton.className =
            'dna-exit-button'


        this.exitButton.innerHTML =
            `
                <span class="dna-exit-arrow">←</span>
                <span class="dna-exit-text">عالم الجينات</span>
            `


        this.exitButton.setAttribute(
            'aria-label',
            'العودة إلى عالم الجينات'
        )


        this.exitButton.addEventListener(
            'click',
            event => {

                event.preventDefault()

                event.stopPropagation()

                this.returnToGeneticsWorld()

            }
        )


        header.appendChild(
            titleArea
        )


        header.appendChild(
            this.exitButton
        )


        /* -------------------------------------------------
           INFO PANEL
           ------------------------------------------------- */

        this.infoPanel =
            document.createElement('aside')


        this.infoPanel.className =
            'dna-experiment-info'


        const infoTitle =
            document.createElement('div')


        infoTitle.className =
            'dna-info-title'


        infoTitle.textContent =
            'القواعد الوراثية'


        const legend =
            document.createElement('div')


        legend.className =
            'dna-base-legend'


        const bases = [

            ['A', 'adenine'],
            ['T', 'thymine'],
            ['C', 'cytosine'],
            ['G', 'guanine']

        ]


        bases.forEach(
            ([symbolText, nameKey]) => {

                const item =
                    document.createElement('div')


                item.className =
                    'dna-base-item'


                const symbol =
                    document.createElement('span')


                symbol.className =
                    `dna-base-symbol dna-base-${symbolText.toLowerCase()}`


                symbol.textContent =
                    symbolText


                const name =
                    document.createElement('span')


                name.className =
                    'dna-base-name'


                name.dataset.dnaBaseKey =
                    nameKey


                name.textContent =
                    t(
                        `biology.dna.bases.${nameKey}`
                    )


                item.appendChild(
                    symbol
                )


                item.appendChild(
                    name
                )


                legend.appendChild(
                    item
                )

            }
        )


        this.selectedLabel =
            document.createElement('div')


        this.selectedLabel.className =
            'dna-selected-pair'


        this.selectedLabel.textContent =
            'اختر زوجًا من القواعد'


        this.selectedDescription =
            document.createElement('div')


        this.selectedDescription.className =
            'dna-selected-description'


        this.selectedDescription.textContent =
            'اضغط على أحد أزواج القواعد في جزيء DNA لاستكشاف العلاقة بينهما.'


        this.statusElement =
            document.createElement('div')


        this.statusElement.className =
            'dna-experiment-status'


        this.statusElement.textContent =
            'التجربة تعمل'


        this.infoPanel.appendChild(
            infoTitle
        )


        this.infoPanel.appendChild(
            legend
        )


        this.infoPanel.appendChild(
            this.selectedLabel
        )


        this.infoPanel.appendChild(
            this.selectedDescription
        )


        this.infoPanel.appendChild(
            this.statusElement
        )


        /* -------------------------------------------------
           CONTROLS
           ------------------------------------------------- */

        const controls =
            document.createElement('div')


        controls.className =
            'dna-experiment-controls'


        this.pauseButton =
            document.createElement('button')


        this.pauseButton.type =
            'button'


        this.pauseButton.className =
            'dna-control-button'


        this.pauseButton.textContent =
            'إيقاف الحركة'


        this.resetButton =
            document.createElement('button')


        this.resetButton.type =
            'button'


        this.resetButton.className =
            'dna-control-button'


        this.resetButton.textContent =
            'إعادة التجربة'


        this.pauseButton.addEventListener(
            'click',
            event => {

                event.preventDefault()

                event.stopPropagation()

                this.togglePause()

            }
        )


        this.resetButton.addEventListener(
            'click',
            event => {

                event.preventDefault()

                event.stopPropagation()

                this.reset()

            }
        )


        controls.appendChild(
            this.pauseButton
        )


        controls.appendChild(
            this.resetButton
        )


        /* -------------------------------------------------
           ASSEMBLY
           ------------------------------------------------- */

        this.container.appendChild(
            header
        )


        this.container.appendChild(
            this.infoPanel
        )


        this.container.appendChild(
            controls
        )


        document.body.appendChild(
            this.container
        )
    }


    /* =====================================================
       LANGUAGE
       ===================================================== */

    updateLanguage() {

        if (
            !this.container
        ) {

            return
        }


        const language =
            getLanguage()


        const isArabic =
            language === 'ar'


        /* -------------------------------------------------
           DIRECTION
           ------------------------------------------------- */

        this.container.dir =
            isArabic
                ? 'rtl'
                : 'ltr'


        this.container.style.direction =
            isArabic
                ? 'rtl'
                : 'ltr'


        this.container.lang =
            language


        /* -------------------------------------------------
           ROOT
           ------------------------------------------------- */

        this.container.setAttribute(
            'aria-label',
            t('biology.dna.ariaLabel')
        )


        /* -------------------------------------------------
           HEADER
           ------------------------------------------------- */

        const eyebrow =
            this.container.querySelector(
                '.dna-experiment-eyebrow'
            )


        if (eyebrow) {

            eyebrow.textContent =
                t('biology.dna.eyebrow')
        }


        const title =
            this.container.querySelector(
                '.dna-experiment-title'
            )


        if (title) {

            title.textContent =
                t('biology.dna.title')
        }


        const description =
            this.container.querySelector(
                '.dna-experiment-description'
            )


        if (description) {

            description.textContent =
                t('biology.dna.description')
        }


        /* -------------------------------------------------
           EXIT
           ------------------------------------------------- */

        const exitText =
            this.container.querySelector(
                '.dna-exit-text'
            )


        if (exitText) {

            exitText.textContent =
                t('biology.dna.exit')
        }


        if (this.exitButton) {

            this.exitButton.setAttribute(
                'aria-label',
                t('biology.dna.exitAria')
            )
        }


        /* -------------------------------------------------
           INFO TITLE
           ------------------------------------------------- */

        const infoTitle =
            this.container.querySelector(
                '.dna-info-title'
            )


        if (infoTitle) {

            infoTitle.textContent =
                t('biology.dna.infoTitle')
        }


        /* -------------------------------------------------
           BASE LEGEND
           ------------------------------------------------- */

        const baseNames =
            this.container.querySelectorAll(
                '[data-dna-base-key]'
            )


        baseNames.forEach(
            element => {

                const key =
                    element.dataset.dnaBaseKey


                if (!key) {

                    return
                }


                element.textContent =
                    t(
                        `biology.dna.bases.${key}`
                    )
            }
        )


        /* -------------------------------------------------
           SELECTED INFORMATION
           ------------------------------------------------- */

        if (
            this.selectedPair === null
        ) {

            if (this.selectedLabel) {

                this.selectedLabel.textContent =
                    t(
                        'biology.dna.selected.emptyTitle'
                    )
            }


            if (this.selectedDescription) {

                this.selectedDescription.textContent =
                    t(
                        'biology.dna.selected.emptyDescription'
                    )
            }

        } else {

            const pair =
                this.pairMeshes.get(
                    this.selectedPair
                )


            if (pair) {

                this.updateSelectedInfo(
                    pair.data.leftBase,
                    pair.data.rightBase
                )
            }
        }


        /* -------------------------------------------------
           STATUS
           ------------------------------------------------- */

        if (this.statusElement) {

            if (
                this.paused
            ) {

                this.statusElement.textContent =
                    t(
                        'biology.dna.status.paused'
                    )

            } else if (
                this.selectedPair !== null
            ) {

                this.statusElement.textContent =
                    t(
                        'biology.dna.selected.pairStatus'
                    ).replace(
                        '{pair}',
                        String(
                            this.selectedPair + 1
                        )
                    )

            } else {

                this.statusElement.textContent =
                    t(
                        'biology.dna.status.running'
                    )
            }
        }


        /* -------------------------------------------------
           CONTROLS
           ------------------------------------------------- */

        if (this.pauseButton) {

            this.pauseButton.textContent =
                this.paused
                    ? t(
                        'biology.dna.controls.resume'
                    )
                    : t(
                        'biology.dna.controls.pause'
                    )
        }


        if (this.resetButton) {

            this.resetButton.textContent =
                t(
                    'biology.dna.controls.reset'
                )
        }
    }


    /* =====================================================
       DNA
       ===================================================== */

    createDNA() {

        if (!this.root) {
            return
        }


        const leftPoints =
            []

        const rightPoints =
            []


        for (
            let i = 0;
            i <= 180;
            i++
        ) {

            const progress =
                i / 180


            const y =
                -this.helixHeight / 2 +
                progress *
                this.helixHeight


            const angle =
                progress *
                Math.PI *
                2 *
                this.turns


            const x =
                Math.cos(angle) *
                this.helixRadius


            const z =
                Math.sin(angle) *
                this.helixRadius


            leftPoints.push(
                new THREE.Vector3(
                    x,
                    y,
                    z
                )
            )


            rightPoints.push(
                new THREE.Vector3(
                    -x,
                    y,
                    -z
                )
            )
        }


        const leftCurve =
            new THREE.CatmullRomCurve3(
                leftPoints
            )


        const rightCurve =
            new THREE.CatmullRomCurve3(
                rightPoints
            )


        /* -------------------------------------------------
           BACKBONES
           ------------------------------------------------- */

        const leftGeometry =
            new THREE.TubeGeometry(
                leftCurve,
                180,
                this.backboneRadius,
                8,
                false
            )


        const rightGeometry =
            new THREE.TubeGeometry(
                rightCurve,
                180,
                this.backboneRadius,
                8,
                false
            )


        const leftMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0x8fd6ae,

                emissive:
                    0x285c46,

                emissiveIntensity:
                    0.8,

                metalness:
                    0.15,

                roughness:
                    0.32

            })


        const rightMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0xbedfc9,

                emissive:
                    0x315746,

                emissiveIntensity:
                    0.7,

                metalness:
                    0.12,

                roughness:
                    0.3

            })


        const leftBackbone =
            new THREE.Mesh(
                leftGeometry,
                leftMaterial
            )


        const rightBackbone =
            new THREE.Mesh(
                rightGeometry,
                rightMaterial
            )


        this.backboneGroup.add(
            leftBackbone
        )


        this.backboneGroup.add(
            rightBackbone
        )


        /* -------------------------------------------------
           BASE MATERIALS
           ------------------------------------------------- */

        const baseGeometry =
            new THREE.SphereGeometry(
                this.baseRadius,
                20,
                20
            )


        const materials = {

            A:
                new THREE.MeshStandardMaterial({

                    color:
                        0x9fdab7,

                    emissive:
                        0x397c59,

                    emissiveIntensity:
                        0.85,

                    roughness:
                        0.28,

                    metalness:
                        0.08

                }),

            T:
                new THREE.MeshStandardMaterial({

                    color:
                        0xe2eadf,

                    emissive:
                        0x718e7a,

                    emissiveIntensity:
                        0.65,

                    roughness:
                        0.3,

                    metalness:
                        0.06

                }),

            C:
                new THREE.MeshStandardMaterial({

                    color:
                        0x79c79d,

                    emissive:
                        0x2d7652,

                    emissiveIntensity:
                        0.9,

                    roughness:
                        0.28,

                    metalness:
                        0.08

                }),

            G:
                new THREE.MeshStandardMaterial({

                    color:
                        0xc8d9cf,

                    emissive:
                        0x587766,

                    emissiveIntensity:
                        0.7,

                    roughness:
                        0.32,

                    metalness:
                        0.08

                })

        }


        /* -------------------------------------------------
           PAIRS
           ------------------------------------------------- */

        for (
            let i = 0;
            i < this.pairCount;
            i++
        ) {

            const progress =
                i /
                (this.pairCount - 1)


            const y =
                -this.helixHeight / 2 +
                progress *
                this.helixHeight


            const angle =
                progress *
                Math.PI *
                2 *
                this.turns


            const x =
                Math.cos(angle) *
                this.helixRadius


            const z =
                Math.sin(angle) *
                this.helixRadius


            const leftPosition =
                new THREE.Vector3(
                    x,
                    y,
                    z
                )


            const rightPosition =
                new THREE.Vector3(
                    -x,
                    y,
                    -z
                )


            const pair =
                this.basePairs[i]


            const leftBase =
                this.createBase(
                    pair[0],
                    leftPosition,
                    baseGeometry,
                    materials[pair[0]],
                    i
                )


            const rightBase =
                this.createBase(
                    pair[1],
                    rightPosition,
                    baseGeometry,
                    materials[pair[1]],
                    i
                )


            this.basePairGroup.add(
                leftBase
            )


            this.basePairGroup.add(
                rightBase
            )


            const rung =
                this.createRung(
                    leftPosition,
                    rightPosition,
                    pair,
                    i
                )


            this.basePairGroup.add(
                rung
            )


            const pairData = {

                index:
                    i,

                leftBase:
                    pair[0],

                rightBase:
                    pair[1]

            }


            this.pairMeshes.set(
                i,
                {
                    index:
                        i,

                    leftBase:
                        leftBase,

                    rightBase:
                        rightBase,

                    rung:
                        rung,

                    data:
                        pairData
                }
            )


            this.interactivePairs.push(
                leftBase
            )


            this.interactivePairs.push(
                rightBase
            )


            this.interactivePairs.push(
                rung
            )
        }


        this.dnaGroup.rotation.y =
            Math.PI * 0.08
    }


    /* =====================================================
       BASE
       ===================================================== */

    createBase(
        base,
        position,
        geometry,
        material,
        index
    ) {

        const mesh =
            new THREE.Mesh(
                geometry,
                material.clone()
            )


        mesh.position.copy(
            position
        )


        mesh.userData = {

            type:
                'base',

            base:
                base,

            pairIndex:
                index,

            interactive:
                true

        }


        return mesh
    }


    /* =====================================================
       RUNG
       ===================================================== */

    createRung(
        start,
        end,
        pair,
        index
    ) {

        const direction =
            new THREE.Vector3()


        direction.subVectors(
            end,
            start
        )


        const length =
            direction.length()


        /*
           A–T = رابطتان هيدروجينيتان
           C–G = ثلاث روابط هيدروجينية
        */

        const bondCount =
            (
                pair[0] === 'A' &&
                pair[1] === 'T'
            ) ||
            (
                pair[0] === 'T' &&
                pair[1] === 'A'
            )
                ? 2
                : 3


        const bondOffset =
            0.28


        const geometry =
            new THREE.CylinderGeometry(
                this.rungRadius,
                this.rungRadius,
                length,
                10
            )


        /*
           نستخدم نفس المادة لكل الروابط
           حتى تبقى الإضاءة والتحديد متزامنين.
        */

        const material =
            new THREE.MeshStandardMaterial({

                color:
                    pair[0] === 'A'
                        ? 0x8fcdb0
                        : 0x92b9a3,

                emissive:
                    pair[0] === 'A'
                        ? 0x315c47
                        : 0x29483b,

                emissiveIntensity:
                    0.65,

                roughness:
                    0.4,

                metalness:
                    0.05

            })


        const mesh =
            new THREE.Mesh(
                geometry,
                material
            )


        mesh.position
            .copy(start)
            .add(end)
            .multiplyScalar(0.5)


        mesh.quaternion.setFromUnitVectors(
            new THREE.Vector3(
                0,
                1,
                0
            ),
            direction.normalize()
        )


        /*
           الرابط الأساسي يمثل أحد الروابط
           الهيدروجينية.

           نزيحه قليلًا عن المركز حتى تصبح
           الروابط منفصلة بصريًا.
        */

        geometry.translate(
            -bondOffset,
            0,
            0
        )


        /*
           الرابط الثاني.
        */

        const secondBond =
            new THREE.Mesh(
                geometry.clone(),
                material
            )


        secondBond.position.set(
            bondOffset,
            0,
            0
        )


        mesh.add(
            secondBond
        )


        /*
           إذا كان الزوج C–G نضيف الرابط الثالث.
        */

        if (
            bondCount === 3
        ) {

            const thirdBond =
                new THREE.Mesh(
                    geometry.clone(),
                    material
                )


            thirdBond.position.set(
                bondOffset * 2,
                0,
                0
            )


            mesh.add(
                thirdBond
            )
        }


        mesh.userData = {

            type:
                'basePair',

            pairIndex:
                index,

            index:
                index,

            leftBase:
                pair[0],

            rightBase:
                pair[1],

            interactive:
                true

        }


        return mesh
    }


    /* =====================================================
       INTERACTION
       ===================================================== */

    setupInteraction() {

        /*
           نحصل على Canvas الحقيقي الخاص بـ Three.js.

           Engine.js يضيف renderer.domElement
           مباشرة إلى body، لذلك هذا هو الهدف
           الصحيح للتفاعل مع المجسمات.
        */

        this.canvas =
            document.querySelector(
                'canvas'
            )


        if (!this.canvas) {

            console.warn(
                '⚠️ DNAExperiment: Three.js canvas not found'
            )

            return
        }


        /* -------------------------------------------------
           POINTER MOVE
           ------------------------------------------------- */

        this.onPointerMove =
            event => {

                if (
                    this.destroyed ||
                    !this.visible
                ) {

                    return
                }


                this.updatePointer(
                    event
                )


                this.checkIntersection()
            }


        /* -------------------------------------------------
           CLICK
           ------------------------------------------------- */

        this.onPointerClick =
            event => {

                if (
                    this.destroyed ||
                    !this.visible
                ) {

                    return
                }


                /*
                   لا نعتبر الضغط على عناصر
                   الواجهة ضغطًا على DNA.
                */

                if (
                    event.target &&
                    event.target.closest &&
                    event.target.closest(
                        '.dna-experiment-header, .dna-experiment-info, .dna-experiment-controls'
                    )
                ) {

                    return
                }


                this.updatePointer(
                    event
                )


                this.checkIntersection()


                this.selectHoveredPair()
            }


        /* -------------------------------------------------
           LISTEN DIRECTLY TO THREE.JS CANVAS
           ------------------------------------------------- */

        this.canvas.addEventListener(
            'pointermove',
            this.onPointerMove
        )


        this.canvas.addEventListener(
            'click',
            this.onPointerClick
        )


        console.log(
            '🧬 DNAExperiment: CANVAS INTERACTION READY'
        )
    }


    /* =====================================================
       POINTER
       ===================================================== */

    updatePointer(event) {

        if (!this.canvas) {

            return
        }


        const rect =
            this.canvas.getBoundingClientRect()


        if (
            rect.width === 0 ||
            rect.height === 0
        ) {

            return
        }


        /*
           تحويل إحداثيات الشاشة إلى إحداثيات
           Canvas دقيقة.

           هذا أهم تعديل في التفاعل.
        */

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
    }


    /* =====================================================
       CAMERA
       ===================================================== */

    setCamera(camera) {

        this.camera =
            camera || null


        console.log(
            '🧬 DNAExperiment: CAMERA SET',
            !!this.camera
        )
    }


    /* =====================================================
       GET CAMERA
       ===================================================== */

    getCamera() {

        if (this.camera) {

            return this.camera
        }


        if (
            this.scene &&
            this.scene.userData &&
            this.scene.userData.camera
        ) {

            this.camera =
                this.scene.userData.camera

            return this.camera
        }


        return null
    }


    /* =====================================================
       RAYCAST
       ===================================================== */

    checkIntersection() {

        const camera =
            this.getCamera()


        if (!camera) {

            console.warn(
                '⚠️ DNAExperiment: Raycaster camera missing'
            )

            return
        }


        if (
            !this.root ||
            !this.root.visible
        ) {

            return
        }


        this.raycaster.setFromCamera(
            this.pointer,
            camera
        )


        /*
           نبحث داخل جميع العناصر التفاعلية.

           recursive = true
           حتى لا نفشل إذا أصبحت بعض العناصر
           داخل Group مستقبلًا.
        */

        const hits =
            this.raycaster.intersectObjects(
                this.interactivePairs,
                true
            )


        if (
            !hits ||
            hits.length === 0
        ) {

            this.setHoveredPair(
                null
            )

            return
        }


        let pairIndex =
            null


        /*
           نبحث عن pairIndex على العنصر
           أو على أحد الآباء.
        */

        for (
            const hit of hits
        ) {

            let object =
                hit.object


            while (
                object &&
                object !== this.root
            ) {

                if (
                    object.userData &&
                    object.userData.pairIndex !== undefined
                ) {

                    pairIndex =
                        object.userData.pairIndex

                    break
                }


                object =
                    object.parent
            }


            if (
                pairIndex !== null
            ) {

                break
            }
        }


        if (
            pairIndex === null
        ) {

            this.setHoveredPair(
                null
            )

            return
        }


        this.setHoveredPair(
            pairIndex
        )
    }


    /* =====================================================
       HOVER
       ===================================================== */

    setHoveredPair(index) {

        if (
            this.hoveredPair === index
        ) {

            return
        }


        /*
           إذا كان الزوج السابق ليس هو الزوج المحدد،
           نزيل إضاءة الـ hover فقط.
        */

        if (
            this.hoveredPair !== null &&
            this.hoveredPair !== this.selectedPair
        ) {

            this.setPairHighlight(
                this.hoveredPair,
                false
            )
        }


        this.hoveredPair =
            index


        if (
            index !== null
        ) {

            this.setPairHighlight(
                index,
                true
            )
        }
    }


    /* =====================================================
       SELECT
       ===================================================== */

    selectHoveredPair() {

        if (
            this.hoveredPair === null
        ) {

            return
        }


        const pair =
            this.pairMeshes.get(
                this.hoveredPair
            )


        if (!pair) {

            return
        }


        /*
           إزالة الإضاءة الخاصة بالاختيار السابق
           إذا كان مختلفًا عن الجديد.
        */

        if (
            this.selectedPair !== null &&
            this.selectedPair !== this.hoveredPair
        ) {

            this.setPairHighlight(
                this.selectedPair,
                false
            )
        }


        this.selectedPair =
            this.hoveredPair


        /*
           نضمن بقاء الزوج المختار مضيئًا.
        */

        this.setPairHighlight(
            this.selectedPair,
            true
        )


        this.updateSelectedInfo(
            pair.data.leftBase,
            pair.data.rightBase
        )
    }


    /* =====================================================
       HIGHLIGHT
       ===================================================== */

    setPairHighlight(
        index,
        active
    ) {

        const pair =
            this.pairMeshes.get(
                index
            )


        if (!pair) {

            return
        }


        const objects = [

            pair.leftBase,
            pair.rightBase,
            pair.rung

        ]


        objects.forEach(
            object => {

                if (
                    !object ||
                    !object.material
                ) {

                    return
                }


                object.material.emissiveIntensity =
                    active
                        ? 1.8
                        : 0.7


                object.scale.setScalar(
                    active
                        ? 1.45
                        : 1
                )

            }
        )
    }


    /* =====================================================
       CLEAR ALL HIGHLIGHTS
       ===================================================== */

    clearAllHighlights() {

        this.pairMeshes.forEach(
            pair => {

                const objects = [

                    pair.leftBase,
                    pair.rightBase,
                    pair.rung

                ]


                objects.forEach(
                    object => {

                        if (
                            !object ||
                            !object.material
                        ) {

                            return
                        }


                        object.material.emissiveIntensity =
                            0.7


                        object.scale.setScalar(
                            1
                        )

                    }
                )
            }
        )
    }


    /* =====================================================
       INFO
       ===================================================== */

    updateSelectedInfo(
        left,
        right
    ) {

        if (
            !this.selectedLabel ||
            !this.selectedDescription
        ) {

            return
        }


        this.selectedLabel.textContent =
            `${left}  ↔  ${right}`


        const pairKey =
            `${left.toLowerCase()}${right.toLowerCase()}`


        let description =
            t(
                `biology.dna.pairs.${pairKey}`
            )


        if (
            description ===
            `biology.dna.pairs.${pairKey}`
        ) {

            description =
                t(
                    'biology.dna.pairs.fallback'
                )
        }


        this.selectedDescription.textContent =
            description


        /*
           تفعيل حالة المعلومات في الواجهة.
        */

        if (this.infoPanel) {

            this.infoPanel.classList.add(
                'is-selected'
            )
        }


        if (this.statusElement) {

            this.statusElement.textContent =
                t(
                    'biology.dna.selected.pairStatus'
                ).replace(
                    '{pair}',
                    String(
                        this.selectedPair + 1
                    )
                )
        }
    }


    /* =====================================================
       PAUSE
       ===================================================== */

    togglePause() {

        this.paused =
            !this.paused


        if (this.pauseButton) {

            this.pauseButton.textContent =
                this.paused
                    ? t(
                        'biology.dna.controls.resume'
                    )
                    : t(
                        'biology.dna.controls.pause'
                    )
        }


        if (this.statusElement) {

            this.statusElement.textContent =
                this.paused
                    ? t(
                        'biology.dna.status.paused'
                    )
                    : this.selectedPair !== null
                        ? t(
                            'biology.dna.selected.pairStatus'
                        ).replace(
                            '{pair}',
                            String(
                                this.selectedPair + 1
                            )
                        )
                        : t(
                            'biology.dna.status.running'
                        )
        }
    }


    /* =====================================================
       RESET
       ===================================================== */

    reset() {

        this.time =
            0


        this.paused =
            false


        this.hoveredPair =
            null


        this.selectedPair =
            null


        /*
           تنظيف كل الإضاءات.
        */

        this.clearAllHighlights()


        if (this.dnaGroup) {

            this.dnaGroup.rotation.set(
                0,
                Math.PI * 0.08,
                0
            )


            this.dnaGroup.scale.setScalar(
                1
            )
        }


        /*
           نعيد حجم DNA الأساسي
           لأن root هو المسؤول عن الحجم.
        */

        if (this.root) {

            this.root.scale.setScalar(
                this.dnaScale
            )
        }


        if (this.pauseButton) {

            this.pauseButton.textContent =
                t(
                    'biology.dna.controls.pause'
                )
        }


        if (this.statusElement) {

            this.statusElement.textContent =
                t(
                    'biology.dna.status.running'
                )
        }


        if (this.selectedLabel) {

            this.selectedLabel.textContent =
                t(
                    'biology.dna.selected.emptyTitle'
                )
        }


        if (this.selectedDescription) {

            this.selectedDescription.textContent =
                t(
                    'biology.dna.selected.emptyDescription'
                )
        }


        if (this.infoPanel) {

            this.infoPanel.classList.remove(
                'is-selected'
            )
        }
    }


    /* =====================================================
       HIDE AWTAAR BACKGROUND
       ===================================================== */

    hideAwtaarBackground() {

        if (
            !this.scene
        ) {

            return
        }


        /*
           نحصل على Universe المسجل من Universe.js
        */

        this.universe =
            this.scene.userData?.awtaarUniverse ||
            this.universe


        if (
            this.universe &&
            typeof this.universe.setExperimentMode ===
            'function'
        ) {

            this.universe.setExperimentMode(
                true
            )


            this.backgroundHidden =
                true


            console.log(
                '🧬 DNAExperiment: AWTAAR BACKGROUND HIDDEN'
            )
        }
    }


    /* =====================================================
       RESTORE AWTAAR BACKGROUND
       ===================================================== */

    restoreAwtaarBackground() {

        if (
            !this.backgroundHidden
        ) {

            return
        }


        if (
            this.universe &&
            typeof this.universe.setExperimentMode ===
            'function'
        ) {

            this.universe.setExperimentMode(
                false
            )


            console.log(
                '🧬 DNAExperiment: AWTAAR BACKGROUND RESTORED'
            )
        }


        this.backgroundHidden =
            false
    }


    /* =====================================================
       RETURN
       ===================================================== */

    returnToGeneticsWorld() {

        if (
            this.destroyed
        ) {

            return
        }


        if (
            this.parentUI &&
            typeof this.parentUI.returnFromDNAExperiment ===
            'function'
        ) {

            this.parentUI.returnFromDNAExperiment()

            return
        }


        this.hide()
    }


    /* =====================================================
       UPDATE
       ===================================================== */

    update(delta = 0) {

        if (
            this.destroyed ||
            !this.visible ||
            this.paused
        ) {

            return
        }


        this.time +=
            delta


        if (this.dnaGroup) {

            this.dnaGroup.rotation.y +=
                delta *
                this.rotationSpeed


            const breathing =
                1 +
                Math.sin(
                    this.time * 1.15
                ) *
                0.012


            this.dnaGroup.scale.x =
                breathing


            this.dnaGroup.scale.z =
                breathing
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


        this.visible =
            true


        /*
           إخفاء عالم أوتار الأساسي
           حتى تكون تجربة DNA هي العنصر الرئيسي.
        */

        this.hideAwtaarBackground()


        /*
           تحديث الكاميرا من المشهد إذا لم تكن
           قد وصلت من GeneticsWorldUI.
        */

        this.getCamera()


        /*
           إعادة الحصول على Canvas في حال
           تغير DOM أثناء فتح التجربة.
        */

        if (!this.canvas) {

            this.canvas =
                document.querySelector(
                    'canvas'
                )
        }


        if (this.container) {

            this.container.style.display =
                'block'


            this.container.style.visibility =
                'visible'


            this.container.style.opacity =
                '1'


            /*
               طبقة التجربة لا تمنع الـCanvas
               من استقبال النقرات.

               عناصر الواجهة نفسها تملك
               pointer-events: auto
               في CSS.
            */

            this.container.style.pointerEvents =
                'none'
        }


        if (this.root) {

            this.root.visible =
                true


            this.root.scale.setScalar(
                this.dnaScale
            )
        }


        console.log(
            '🧬 DNAExperiment: SHOW'
        )
    }


    /* =====================================================
       HIDE
       ===================================================== */

    hide() {

        this.visible =
            false


        if (this.container) {

            this.container.style.opacity =
                '0'


            this.container.style.visibility =
                'hidden'


            this.container.style.pointerEvents =
                'none'
        }


        if (this.root) {

            this.root.visible =
                false
        }
    }


    /* =====================================================
       SET SCENE
       ===================================================== */

    setScene(scene) {

        if (
            this.scene === scene
        ) {

            /*
               حتى إذا كان المشهد نفسه،
               نحدّث الكاميرا وUniverse.
            */

            if (
                this.scene
            ) {

                this.camera =
                    this.scene.userData?.camera ||
                    this.camera

                this.universe =
                    this.scene.userData?.awtaarUniverse ||
                    this.universe
            }

            return
        }


        /*
           إذا كان DNA مرتبطًا بمشهد قديم،
           نزيله أولًا.
        */

        if (
            this.scene &&
            this.root.parent === this.scene
        ) {

            this.scene.remove(
                this.root
            )
        }


        this.scene =
            scene || null


        if (
            this.scene
        ) {

            this.scene.add(
                this.root
            )


            this.camera =
                this.scene.userData?.camera ||
                null


            this.universe =
                this.scene.userData?.awtaarUniverse ||
                null


            this.root.visible =
                this.visible
        }
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


        console.log(
            '🧬 DNAExperiment: DESTROY'
        )


        /*
           إعادة خلفية أوتار قبل تدمير التجربة.
        */

        this.restoreAwtaarBackground()


        this.destroyed =
            true


        this.visible =
            false


        /* -------------------------------------------------
           REMOVE LANGUAGE EVENT
           ------------------------------------------------- */

        window.removeEventListener(
            'awtaar-language-change',
            this.handleLanguageChange
        )


        /* -------------------------------------------------
           REMOVE EVENTS
           ------------------------------------------------- */

        if (
            this.canvas &&
            this.onPointerMove
        ) {

            this.canvas.removeEventListener(
                'pointermove',
                this.onPointerMove
            )
        }


        if (
            this.canvas &&
            this.onPointerClick
        ) {

            this.canvas.removeEventListener(
                'click',
                this.onPointerClick
            )
        }


        /* -------------------------------------------------
           DISPOSE THREE
           ------------------------------------------------- */

        if (this.root) {

            this.root.traverse(
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

                                    if (
                                        material &&
                                        material.dispose
                                    ) {

                                        material.dispose()
                                    }
                                }
                            )

                        } else {

                            object.material.dispose()
                        }
                    }
                }
            )


            if (
                this.root.parent
            ) {

                this.root.parent.remove(
                    this.root
                )
            }
        }


        /* -------------------------------------------------
           REMOVE DOM
           ------------------------------------------------- */

        if (
            this.container
        ) {

            this.container.remove()
        }


        /* -------------------------------------------------
           CLEAR REFERENCES
           ------------------------------------------------- */

        this.interactivePairs =
            []


        this.pairMeshes.clear()


        this.scene =
            null


        this.camera =
            null


        this.universe =
            null


        this.parentUI =
            null


        this.canvas =
            null


        this.container =
            null


        this.infoPanel =
            null


        this.selectedLabel =
            null


        this.selectedDescription =
            null


        this.statusElement =
            null


        this.pauseButton =
            null


        this.resetButton =
            null


        this.exitButton =
            null


        this.handleLanguageChange =
            null


        this.root =
            null


        this.dnaGroup =
            null


        this.backboneGroup =
            null


        this.basePairGroup =
            null


        this.highlightGroup =
            null
    }
}