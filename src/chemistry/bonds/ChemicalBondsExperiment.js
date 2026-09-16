/* =========================================================
   AWTAAR — CHEMICAL BONDS EXPERIMENT
   =========================================================

   Interactive educational laboratory for chemical bonding.

   Main bonding models:

   1. Covalent
      - H₂
      - Shared electrons
      - Electron sharing region

   2. Ionic
      - NaCl
      - Electron transfer
      - Na⁺ / Cl⁻
      - Electrostatic attraction

   3. Metallic
      - Simplified metallic lattice
      - Delocalized electrons

   4. Polar Covalent
      - H₂O
      - Unequal electron sharing
      - Partial charges

   5. Coordinate Covalent
      - NH₄⁺
      - Shared pair donated by one atom

   The visual models are educational simplifications.
   They are not literal molecular orbital representations.

   ========================================================= */

import * as THREE from 'three'
import './chemical-bonds.css'

import {
    t,
    getLanguage
} from '../../locales/i18n.js'


export default class ChemicalBondsExperiment {

    /* =====================================================
       CONSTRUCTOR
       ===================================================== */

    constructor(
        scene = null,
        parent = null
    ) {

        this.scene = scene
        this.parent = parent

        this.renderScene = new THREE.Scene()

        /*
         * The WebGL scene now owns the visual background.
         *
         * This prevents the experiment container's translucent
         * CSS background from dimming the rendered atoms.
         */
        this.renderScene.background =
            new THREE.Color(0x020817)

        /*
         * Keep fog for the distant environment only.
         *
         * Atom materials explicitly disable fog below.
         */
        this.renderScene.fog =
            new THREE.FogExp2(
                0x020817,
                0.035
            )


        /* -------------------------------------------------
           CAMERA
           ------------------------------------------------- */

        this.camera =
            new THREE.PerspectiveCamera(
                45,
                window.innerWidth /
                window.innerHeight,
                0.1,
                100
            )

        this.camera.position.set(
            0,
            0.6,
            15
        )


        /* -------------------------------------------------
           RENDERER
           ------------------------------------------------- */

        this.renderer =
            new THREE.WebGLRenderer({
                antialias: true,
                alpha: false
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

        this.renderer.outputColorSpace =
            THREE.SRGBColorSpace

        this.renderer.domElement.className =
            'awtaar-chemical-bonds-renderer'

        this.renderer.domElement.style.position =
            'fixed'

        this.renderer.domElement.style.inset =
            '0'

        this.renderer.domElement.style.width =
            '100vw'

        this.renderer.domElement.style.height =
            '100vh'

        this.renderer.domElement.style.zIndex =
            '19999'

        this.renderer.domElement.style.pointerEvents =
            'auto'

        this.renderer.domElement.style.display =
            'none'

        document.body.appendChild(
            this.renderer.domElement
        )


        /* -------------------------------------------------
           STATE
           ------------------------------------------------- */

        this.visible = false

        this.activeBond =
            'covalent'

        this.modelGroup = null

        this.interactiveObjects = []

        this.hoveredObject = null

        this.elapsed = 0

        this.isAnimatingTransition =
            false

        this.transitionProgress =
            1

        this.transitionFrom =
            'covalent'

        this.transitionTo =
            'covalent'


        /*
         * Permanent atom brightness.
         *
         * Atom bodies use MeshBasicMaterial, therefore
         * their brightness is completely independent from
         * scene lighting and model rotation.
         */
        this.atomBaseBrightness =
            1


        /* -------------------------------------------------
           LANGUAGE
           ------------------------------------------------- */

        this.language =
            getLanguage()


        /* -------------------------------------------------
           CREATE
           ------------------------------------------------- */

        this.createLights()

        this.createEnvironment()

        this.createUI()

        this.createEvents()

        this.buildBondModel(
            this.activeBond
        )

        this.updateLanguage()


        /* -------------------------------------------------
           INITIAL STATE
           ------------------------------------------------- */

        this.hideImmediate()
    }


    /* =====================================================
       LIGHTING
       ===================================================== */

    createLights() {

        const ambient =
            new THREE.AmbientLight(
                0x9bb8d8,
                1.8
            )

        this.renderScene.add(
            ambient
        )


        const keyLight =
            new THREE.PointLight(
                0xe0bd76,
                5.5,
                40
            )

        keyLight.position.set(
            0,
            4,
            7
        )

        this.renderScene.add(
            keyLight
        )


        const blueLight =
            new THREE.PointLight(
                0x4d8dff,
                3,
                30
            )

        blueLight.position.set(
            -6,
            -2,
            5
        )

        this.renderScene.add(
            blueLight
        )


        const violetLight =
            new THREE.PointLight(
                0x6d5cff,
                2.5,
                30
            )

        violetLight.position.set(
            6,
            2,
            4
        )

        this.renderScene.add(
            violetLight
        )
    }


    /* =====================================================
       ENVIRONMENT
       ===================================================== */

    createEnvironment() {

        this.environmentGroup =
            new THREE.Group()

        this.renderScene.add(
            this.environmentGroup
        )


        const particleGeometry =
            new THREE.BufferGeometry()

        const particleCount = 500

        const positions =
            new Float32Array(
                particleCount * 3
            )

        for (
            let i = 0;
            i < particleCount;
            i++
        ) {

            const radius =
                12 + Math.random() * 18

            const theta =
                Math.random() *
                Math.PI * 2

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
        }


        particleGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(
                positions,
                3
            )
        )


        const particleMaterial =
            new THREE.PointsMaterial({
                color: 0x54749d,
                size: 0.035,
                transparent: true,
                opacity: 0.35,
                depthWrite: false
            })


        this.environmentParticles =
            new THREE.Points(
                particleGeometry,
                particleMaterial
            )

        this.environmentGroup.add(
            this.environmentParticles
        )
    }


    /* =====================================================
       UI
       ===================================================== */

    createUI() {

        this.container =
            document.createElement(
                'section'
            )

        this.container.className =
            'awtaar-chemical-bonds-experiment'

        this.container.setAttribute(
            'dir',
            this.language === 'ar'
                ? 'rtl'
                : 'ltr'
        )


        /*
         * IMPORTANT
         *
         * The CSS file provides the visual shell of the
         * experiment, but its translucent full-screen
         * background can sit above the WebGL canvas.
         *
         * The actual background is therefore rendered by
         * Three.js. The container itself is transparent.
         */
        this.container.style.background =
            'transparent'


        /* -------------------------------------------------
           TOP BAR
           ------------------------------------------------- */

        this.topbar =
            document.createElement(
                'div'
            )

        this.topbar.className =
            'awtaar-bonds-topbar'


        this.title =
            document.createElement(
                'h1'
            )

        this.title.className =
            'awtaar-bonds-title'


        this.description =
            document.createElement(
                'p'
            )

        this.description.className =
            'awtaar-bonds-description'


        this.backButton =
            document.createElement(
                'button'
            )

        this.backButton.className =
            'awtaar-bonds-back'

        this.backButton.type =
            'button'


        this.topbar.appendChild(
            this.title
        )

        this.topbar.appendChild(
            this.description
        )

        this.topbar.appendChild(
            this.backButton
        )

        this.container.appendChild(
            this.topbar
        )


        /* -------------------------------------------------
           BOND SELECTOR
           ------------------------------------------------- */

        this.selector =
            document.createElement(
                'div'
            )

        this.selector.className =
            'awtaar-bonds-selector'


        this.selectorTitle =
            document.createElement(
                'div'
            )

        this.selectorTitle.className =
            'awtaar-bonds-selector-title'


        this.selectorButtons =
            document.createElement(
                'div'
            )

        this.selectorButtons.className =
            'awtaar-bonds-selector-buttons'


        const bonds = [
            {
                id: 'covalent',
                symbol: 'H₂'
            },
            {
                id: 'ionic',
                symbol: 'NaCl'
            },
            {
                id: 'metallic',
                symbol: 'e⁻'
            },
            {
                id: 'polar',
                symbol: 'H₂O'
            },
            {
                id: 'coordinate',
                symbol: 'NH₄⁺'
            }
        ]


        this.bondButtons = {}


        bonds.forEach(
            bond => {

                const button =
                    document.createElement(
                        'button'
                    )

                button.type =
                    'button'

                button.className =
                    'awtaar-bond-button'

                button.dataset.bond =
                    bond.id


                const symbol =
                    document.createElement(
                        'span'
                    )

                symbol.className =
                    'awtaar-bond-button-symbol'

                symbol.textContent =
                    bond.symbol


                const label =
                    document.createElement(
                        'span'
                    )

                label.className =
                    'awtaar-bond-button-label'


                button.appendChild(
                    symbol
                )

                button.appendChild(
                    label
                )


                button.addEventListener(
                    'click',
                    () => {

                        this.selectBond(
                            bond.id
                        )
                    }
                )


                this.selectorButtons.appendChild(
                    button
                )

                this.bondButtons[
                    bond.id
                ] = {
                    button,
                    label
                }
            }
        )


        this.selector.appendChild(
            this.selectorTitle
        )

        this.selector.appendChild(
            this.selectorButtons
        )

        this.container.appendChild(
            this.selector
        )


        /* -------------------------------------------------
           INFORMATION PANEL
           ------------------------------------------------- */

        this.infoPanel =
            document.createElement(
                'div'
            )

        this.infoPanel.className =
            'awtaar-bonds-info'


        this.infoName =
            document.createElement(
                'div'
            )

        this.infoName.className =
            'awtaar-bonds-info-name'


        this.infoText =
            document.createElement(
                'div'
            )

        this.infoText.className =
            'awtaar-bonds-info-text'


        this.infoPanel.appendChild(
            this.infoName
        )

        this.infoPanel.appendChild(
            this.infoText
        )

        this.container.appendChild(
            this.infoPanel
        )


        /* -------------------------------------------------
           HINT
           ------------------------------------------------- */

        this.hint =
            document.createElement(
                'div'
            )

        this.hint.className =
            'awtaar-bonds-hint'


        this.container.appendChild(
            this.hint
        )


        /* -------------------------------------------------
           RESET
           ------------------------------------------------- */

        this.resetButton =
            document.createElement(
                'button'
            )

        this.resetButton.type =
            'button'

        this.resetButton.className =
            'awtaar-bonds-reset'


        this.container.appendChild(
            this.resetButton
        )


        document.body.appendChild(
            this.container
        )
    }


    /* =====================================================
       LANGUAGE
       ===================================================== */

    getText() {

        if (
            this.language === 'ar'
        ) {

            return {

                selector:
                    'نوع الرابطة',

                covalent:
                    'تساهمية',

                ionic:
                    'أيونية',

                metallic:
                    'فلزية',

                polar:
                    'تساهمية قطبية',

                coordinate:
                    'تناسقية',

                covalentName:
                    'الرابطة التساهمية',

                ionicName:
                    'الرابطة الأيونية',

                metallicName:
                    'الرابطة الفلزية',

                polarName:
                    'الرابطة التساهمية القطبية',

                coordinateName:
                    'الرابطة التناسقية',

                covalentInfo:
                    'تتشارك الذرات زوجًا من الإلكترونات لتكوين رابطة مستقرة.',

                ionicInfo:
                    'ينتقل إلكترون من ذرة إلى أخرى، فتتكون أيونات متجاذبة كهربائيًا.',

                metallicInfo:
                    'تتشارك ذرات الفلز في إلكترونات تكافؤ حرة الحركة داخل الشبكة الفلزية.',

                polarInfo:
                    'تتشارك الذرات الإلكترونات بشكل غير متساوٍ بسبب اختلاف السالبية الكهربائية.',

                coordinateInfo:
                    'تتكون الرابطة عندما تمنح ذرة واحدة زوجًا من الإلكترونات المشتركة.',

                hint:
                    'اختر نوع الرابطة لاستكشاف طريقة تكوّنها.',

                reset:
                    'إعادة التجربة',

                back:
                    'العودة إلى الروابط الكيميائية'

            }
        }


        return {

            selector:
                'Bond Type',

            covalent:
                'Covalent',

            ionic:
                'Ionic',

            metallic:
                'Metallic',

            polar:
                'Polar Covalent',

            coordinate:
                'Coordinate',

            covalentName:
                'Covalent Bond',

            ionicName:
                'Ionic Bond',

            metallicName:
                'Metallic Bond',

            polarName:
                'Polar Covalent Bond',

            coordinateName:
                'Coordinate Covalent Bond',

            covalentInfo:
                'Atoms share a pair of electrons to form a stable bond.',

            ionicInfo:
                'An electron is transferred from one atom to another, creating oppositely charged ions.',

            metallicInfo:
                'Metal atoms share delocalized valence electrons throughout the metallic lattice.',

            polarInfo:
                'Atoms share electrons unequally because of differences in electronegativity.',

            coordinateInfo:
                'One atom donates both electrons of the shared pair.',

            hint:
                'Choose a bond type to explore how it forms.',

            reset:
                'Reset Experiment',

            back:
                'Back to Chemical Bonds'

        }
    }


    updateLanguage() {

        this.language =
            getLanguage()


        const text =
            this.getText()


        this.container.setAttribute(
            'dir',
            this.language === 'ar'
                ? 'rtl'
                : 'ltr'
        )


        this.title.textContent =
            t(
                'chemistryWorld.experiments.chemicalBonds.title'
            )


        this.description.textContent =
            t(
                'chemistryWorld.experiments.chemicalBonds.description'
            )


        this.backButton.textContent =
            text.back


        this.selectorTitle.textContent =
            text.selector


        this.hint.textContent =
            text.hint


        this.resetButton.textContent =
            text.reset


        this.bondButtons.covalent.label.textContent =
            text.covalent

        this.bondButtons.ionic.label.textContent =
            text.ionic

        this.bondButtons.metallic.label.textContent =
            text.metallic

        this.bondButtons.polar.label.textContent =
            text.polar

        this.bondButtons.coordinate.label.textContent =
            text.coordinate


        this.updateInfo()
    }


    /* =====================================================
       INFO
       ===================================================== */

    updateInfo() {

        const text =
            this.getText()


        const names = {

            covalent:
                text.covalentName,

            ionic:
                text.ionicName,

            metallic:
                text.metallicName,

            polar:
                text.polarName,

            coordinate:
                text.coordinateName

        }


        const descriptions = {

            covalent:
                text.covalentInfo,

            ionic:
                text.ionicInfo,

            metallic:
                text.metallicInfo,

            polar:
                text.polarInfo,

            coordinate:
                text.coordinateInfo

        }


        this.infoName.textContent =
            names[this.activeBond]


        this.infoText.textContent =
            descriptions[this.activeBond]


        Object.values(
            this.bondButtons
        ).forEach(
            item => {

                item.button.classList.remove(
                    'active'
                )
            }
        )


        if (
            this.bondButtons[
                this.activeBond
            ]
        ) {

            this.bondButtons[
                this.activeBond
            ].button.classList.add(
                'active'
            )
        }
    }


    /* =====================================================
       SELECT BOND
       ===================================================== */

    selectBond(
        type
    ) {

        if (
            type === this.activeBond &&
            !this.isAnimatingTransition
        ) {
            return
        }


        this.transitionFrom =
            this.activeBond

        this.transitionTo =
            type

        this.transitionProgress =
            0

        this.isAnimatingTransition =
            true


        this.activeBond =
            type


        this.updateInfo()
    }


    /* =====================================================
       BUILD MODEL
       ===================================================== */

    buildBondModel(
        type
    ) {

        if (
            this.modelGroup
        ) {

            this.disposeObject(
                this.modelGroup
            )

            this.renderScene.remove(
                this.modelGroup
            )
        }


        this.interactiveObjects =
            []

        this.hoveredObject =
            null


        this.modelGroup =
            new THREE.Group()


        this.renderScene.add(
            this.modelGroup
        )


        switch (type) {

            case 'ionic':

                this.buildIonicModel()

                break


            case 'metallic':

                this.buildMetallicModel()

                break


            case 'polar':

                this.buildPolarModel()

                break


            case 'coordinate':

                this.buildCoordinateModel()

                break


            case 'covalent':
            default:

                this.buildCovalentModel()

                break
        }
    }


    /* =====================================================
       ATOM MATERIALS
       ===================================================== */

    createAtomMaterial(
        color
    ) {

        /*
         * MeshBasicMaterial guarantees that atom color
         * does not depend on scene lighting.
         *
         * fog:false is equally important:
         *
         * MeshBasicMaterial can still be affected by
         * scene fog unless fog is explicitly disabled.
         *
         * The atom therefore keeps the same visual color
         * while the model rotates.
         */

        return new THREE.MeshBasicMaterial({

            color,

            toneMapped: false,

            fog: false
        })
    }


    createElectronMaterial(
        color = 0x8dccff
    ) {

        return new THREE.MeshStandardMaterial({
            color,
            emissive: color,
            emissiveIntensity: 2.8,
            metalness: 0.1,
            roughness: 0.18
        })
    }


    /* =====================================================
       ATOM
       ===================================================== */

    createAtom(
        radius,
        color,
        position,
        label = ''
    ) {

        const group =
            new THREE.Group()


        /* -------------------------------------------------
           Main atom
           ------------------------------------------------- */

        const geometry =
            new THREE.SphereGeometry(
                radius,
                64,
                64
            )


        const material =
            this.createAtomMaterial(
                color
            )


        const mesh =
            new THREE.Mesh(
                geometry,
                material
            )


        mesh.position.copy(
            position
        )


        mesh.userData.isBondAtom =
            true

        mesh.userData.label =
            label

        mesh.userData.baseColor =
            new THREE.Color(
                color
            )


        group.add(
            mesh
        )


        /* -------------------------------------------------
           Clean atom halo
           ------------------------------------------------- */

        const glowGeometry =
            new THREE.SphereGeometry(
                radius * 1.20,
                40,
                40
            )


        const glowMaterial =
            new THREE.MeshBasicMaterial({
                color,
                transparent: true,
                opacity: 0.13,
                depthWrite: false,
                side: THREE.BackSide,
                toneMapped: false,
                fog: false
            })


        const glow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            )


        mesh.add(
            glow
        )


        /* -------------------------------------------------
           Very subtle outer highlight
           ------------------------------------------------- */

        const highlightGeometry =
            new THREE.SphereGeometry(
                radius * 1.035,
                48,
                48
            )


        const highlightMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.045,
                depthWrite: false,
                side: THREE.BackSide,
                toneMapped: false,
                fog: false
            })


        const highlight =
            new THREE.Mesh(
                highlightGeometry,
                highlightMaterial
            )


        mesh.add(
            highlight
        )


        this.interactiveObjects.push(
            mesh
        )


        return group
    }


    /* =====================================================
       ATOM LABEL
       ===================================================== */

    createAtomLabel(
        group,
        position,
        text,
        color = '#ffffff'
    ) {

        const canvas =
            document.createElement(
                'canvas'
            )

        canvas.width = 768
        canvas.height = 384


        const ctx =
            canvas.getContext(
                '2d'
            )


        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        )


        ctx.font =
            '700 118px Arial'

        ctx.textAlign =
            'center'

        ctx.textBaseline =
            'middle'


        ctx.lineWidth =
            20

        ctx.lineJoin =
            'round'

        ctx.strokeStyle =
            'rgba(2, 8, 23, 0.98)'

        ctx.strokeText(
            text,
            384,
            192
        )


        ctx.shadowColor =
            color

        ctx.shadowBlur =
            8

        ctx.fillStyle =
            color

        ctx.fillText(
            text,
            384,
            192
        )


        ctx.shadowBlur =
            0

        ctx.fillStyle =
            color

        ctx.fillText(
            text,
            384,
            192
        )


        const texture =
            new THREE.CanvasTexture(
                canvas
            )


        texture.colorSpace =
            THREE.SRGBColorSpace

        texture.needsUpdate =
            true


        const material =
            new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
                opacity: 1,
                depthWrite: false,
                depthTest: false,
                toneMapped: false
            })


        const sprite =
            new THREE.Sprite(
                material
            )


        sprite.position.copy(
            position
        )

        sprite.scale.set(
            1.85,
            0.92,
            1
        )


        group.add(
            sprite
        )


        return sprite
    }


    /* =====================================================
       ELECTRON
       ===================================================== */

    createElectron(
        position,
        color = 0x8dccff,
        scale = 1
    ) {

        const geometry =
            new THREE.SphereGeometry(
                0.13,
                32,
                32
            )


        const material =
            this.createElectronMaterial(
                color
            )


        const electron =
            new THREE.Mesh(
                geometry,
                material
            )


        electron.position.copy(
            position
        )

        electron.scale.setScalar(
            scale
        )


        electron.userData.isElectron =
            true


        electron.userData.baseEmissiveIntensity =
            2.8


        this.interactiveObjects.push(
            electron
        )


        return electron
    }


    /* =====================================================
       BOND LINE
       ===================================================== */

    createBondLine(
        start,
        end,
        color = 0xe0bd76,
        radius = 0.055
    ) {

        const direction =
            new THREE.Vector3()
                .subVectors(
                    end,
                    start
                )

        const length =
            direction.length()


        const visibleRadius =
            Math.max(
                radius,
                0.045
            )


        const geometry =
            new THREE.CylinderGeometry(
                visibleRadius,
                visibleRadius,
                length,
                32
            )


        const material =
            new THREE.MeshBasicMaterial({
                color,
                transparent: true,
                opacity: 0.98,
                depthWrite: true,
                toneMapped: false,
                fog: false
            })


        const line =
            new THREE.Mesh(
                geometry,
                material
            )


        line.position
            .copy(start)
            .add(
                end
                    .clone()
                    .sub(start)
                    .multiplyScalar(0.5)
            )


        line.quaternion.setFromUnitVectors(
            new THREE.Vector3(
                0,
                1,
                0
            ),
            direction.normalize()
        )


        return line
    }


    /* =====================================================
       DIRECTION ARROW
       ===================================================== */

    createDirectionArrow(
        group,
        start,
        end,
        color = 0xe0bd76,
        headLength = 0.28,
        headWidth = 0.16
    ) {

        const direction =
            new THREE.Vector3()
                .subVectors(
                    end,
                    start
                )
                .normalize()


        const length =
            start.distanceTo(
                end
            )


        const arrow =
            new THREE.ArrowHelper(
                direction,
                start,
                length,
                color,
                headLength,
                headWidth
            )


        arrow.line.material.transparent =
            true

        arrow.line.material.opacity =
            0.92

        arrow.line.material.color.set(
            color
        )

        arrow.line.material.toneMapped =
            false

        arrow.line.material.fog =
            false


        arrow.cone.material.transparent =
            true

        arrow.cone.material.opacity =
            1

        arrow.cone.material.color.set(
            color
        )

        arrow.cone.material.toneMapped =
            false

        arrow.cone.material.fog =
            false


        group.add(
            arrow
        )


        return arrow
    }


    /* =====================================================
       ELECTROSTATIC ATTRACTION
       ===================================================== */

    createElectrostaticAttraction(
        group,
        left,
        right
    ) {

        const leftStart =
            left.clone()

        leftStart.x += 1.35


        const leftEnd =
            left.clone()

        leftEnd.x += 0.72


        const rightStart =
            right.clone()

        rightStart.x -= 1.35


        const rightEnd =
            right.clone()

        rightEnd.x -= 0.72


        const leftArrow =
            this.createDirectionArrow(
                group,
                leftStart,
                leftEnd,
                0x8dccff,
                0.24,
                0.13
            )


        const rightArrow =
            this.createDirectionArrow(
                group,
                rightStart,
                rightEnd,
                0x8dccff,
                0.24,
                0.13
            )


        leftArrow.line.material.opacity =
            0.70

        rightArrow.line.material.opacity =
            0.70


        const fieldGeometry =
            new THREE.TorusGeometry(
                1.45,
                0.018,
                12,
                80
            )


        const fieldMaterial =
            new THREE.MeshBasicMaterial({
                color: 0x6fa9ff,
                transparent: true,
                opacity: 0.12,
                depthWrite: false,
                toneMapped: false,
                fog: false
            })


        const field =
            new THREE.Mesh(
                fieldGeometry,
                fieldMaterial
            )


        field.rotation.y =
            Math.PI / 2

        field.position.set(
            0,
            0,
            0.05
        )


        group.add(
            field
        )


        this.ionicAttractionArrows = [
            leftArrow,
            rightArrow
        ]


        this.ionicElectricField =
            field
    }


    /* =====================================================
       COVALENT
       ===================================================== */

    buildCovalentModel() {

        const group =
            this.modelGroup


        const left =
            new THREE.Vector3(
                -2.2,
                0,
                0
            )

        const right =
            new THREE.Vector3(
                2.2,
                0,
                0
            )


        const hydrogenColor =
            0xe9f0f8


        group.add(
            this.createAtom(
                1.15,
                hydrogenColor,
                left,
                'H'
            )
        )


        group.add(
            this.createAtom(
                1.15,
                hydrogenColor,
                right,
                'H'
            )
        )


        this.createAtomLabel(
            group,
            new THREE.Vector3(
                -2.2,
                1.55,
                0
            ),
            'H'
        )


        this.createAtomLabel(
            group,
            new THREE.Vector3(
                2.2,
                1.55,
                0
            ),
            'H'
        )


        const electron1 =
            this.createElectron(
                new THREE.Vector3(
                    -0.38,
                    0.25,
                    0.45
                )
            )

        const electron2 =
            this.createElectron(
                new THREE.Vector3(
                    0.38,
                    -0.25,
                    0.45
                )
            )


        group.add(
            electron1
        )

        group.add(
            electron2
        )


        const fieldGeometry =
            new THREE.TorusGeometry(
                0.82,
                0.055,
                16,
                64
            )


        const fieldMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xe0bd76,
                transparent: true,
                opacity: 0.34,
                depthWrite: false,
                toneMapped: false,
                fog: false
            })


        const field =
            new THREE.Mesh(
                fieldGeometry,
                fieldMaterial
            )


        field.rotation.y =
            Math.PI / 2


        group.add(
            field
        )


        const sharedGlowGeometry =
            new THREE.SphereGeometry(
                0.62,
                32,
                32
            )


        const sharedGlowMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xe0bd76,
                transparent: true,
                opacity: 0.055,
                depthWrite: false,
                toneMapped: false,
                fog: false
            })


        const sharedGlow =
            new THREE.Mesh(
                sharedGlowGeometry,
                sharedGlowMaterial
            )


        sharedGlow.scale.set(
            1.7,
            0.72,
            0.72
        )


        group.add(
            sharedGlow
        )


        const leftArrow =
            this.createDirectionArrow(
                group,
                new THREE.Vector3(
                    -1.25,
                    -0.95,
                    0.15
                ),
                new THREE.Vector3(
                    -0.58,
                    -0.38,
                    0.25
                ),
                0xe0bd76,
                0.22,
                0.13
            )


        const rightArrow =
            this.createDirectionArrow(
                group,
                new THREE.Vector3(
                    1.25,
                    -0.95,
                    0.15
                ),
                new THREE.Vector3(
                    0.58,
                    -0.38,
                    0.25
                ),
                0xe0bd76,
                0.22,
                0.13
            )


        this.covalentSharingArrows = [
            leftArrow,
            rightArrow
        ]


        this.covalentElectrons = [
            electron1,
            electron2
        ]

        this.covalentField =
            field

        this.covalentSharedGlow =
            sharedGlow
    }


    /* =====================================================
       IONIC
       ===================================================== */

    buildIonicModel() {

        const group =
            this.modelGroup


        const sodium =
            new THREE.Vector3(
                -2.4,
                0,
                0
            )

        const chlorine =
            new THREE.Vector3(
                2.4,
                0,
                0
            )


        group.add(
            this.createAtom(
                1.25,
                0xb8bdc7,
                sodium,
                'Na'
            )
        )


        group.add(
            this.createAtom(
                1.4,
                0x78c4d5,
                chlorine,
                'Cl'
            )
        )


        this.createAtomLabel(
            group,
            new THREE.Vector3(
                -2.4,
                1.65,
                0
            ),
            'Na'
        )


        this.createAtomLabel(
            group,
            new THREE.Vector3(
                2.4,
                1.8,
                0
            ),
            'Cl'
        )


        const electron =
            this.createElectron(
                new THREE.Vector3(
                    -0.65,
                    0.55,
                    0.4
                ),
                0xffd86a,
                1.15
            )


        group.add(
            electron
        )


        const pathStart =
            new THREE.Vector3(
                -1.15,
                1.7,
                0
            )

        const pathEnd =
            new THREE.Vector3(
                1.15,
                1.7,
                0
            )


        const path =
            this.createBondLine(
                pathStart,
                pathEnd,
                0xe0bd76,
                0.045
            )


        path.material.opacity =
            0.62


        group.add(
            path
        )


        const transferArrow =
            this.createDirectionArrow(
                group,
                new THREE.Vector3(
                    -1.15,
                    1.7,
                    0.02
                ),
                new THREE.Vector3(
                    1.15,
                    1.7,
                    0.02
                ),
                0xe0bd76,
                0.38,
                0.20
            )


        this.ionicTransferArrow =
            transferArrow


        this.createAtomLabel(
            group,
            new THREE.Vector3(
                0,
                2.45,
                0
            ),
            'e⁻',
            '#ffd86a'
        )


        const sodiumCharge =
            this.createCharge(
                group,
                new THREE.Vector3(
                    -2.4,
                    1.72,
                    0
                ),
                '+'
            )


        const chlorineCharge =
            this.createCharge(
                group,
                new THREE.Vector3(
                    2.4,
                    1.88,
                    0
                ),
                '−'
            )


        sodiumCharge.material.opacity =
            0

        chlorineCharge.material.opacity =
            0


        this.ionicSodiumCharge =
            sodiumCharge

        this.ionicChlorineCharge =
            chlorineCharge


        this.createElectrostaticAttraction(
            group,
            sodium,
            chlorine
        )


        this.ionicElectron =
            electron

        this.ionicStart =
            new THREE.Vector3(
                -0.65,
                0.55,
                0.4
            )

        this.ionicEnd =
            new THREE.Vector3(
                0.65,
                0.55,
                0.4
            )
    }


    /* =====================================================
       METALLIC
       ===================================================== */

    buildMetallicModel() {

        const group =
            this.modelGroup


        const metalColor =
            0xd8ad62


        this.metallicElectrons =
            []


        for (
            let x = -3;
            x <= 3;
            x += 2
        ) {

            for (
                let y = -2;
                y <= 2;
                y += 2
            ) {

                const atom =
                    this.createAtom(
                        0.72,
                        metalColor,
                        new THREE.Vector3(
                            x,
                            y,
                            0
                        ),
                        'M'
                    )


                group.add(
                    atom
                )
            }
        }


        for (
            let x = -3;
            x < 3;
            x += 2
        ) {

            for (
                let y = -2;
                y <= 2;
                y += 2
            ) {

                group.add(
                    this.createBondLine(
                        new THREE.Vector3(
                            x + 0.72,
                            y,
                            0
                        ),
                        new THREE.Vector3(
                            x + 1.28,
                            y,
                            0
                        ),
                        0xb48a4b,
                        0.045
                    )
                )
            }
        }


        for (
            let x = -3;
            x <= 3;
            x += 2
        ) {

            for (
                let y = -2;
                y < 2;
                y += 2
            ) {

                group.add(
                    this.createBondLine(
                        new THREE.Vector3(
                            x,
                            y + 0.72,
                            0
                        ),
                        new THREE.Vector3(
                            x,
                            y + 1.28,
                            0
                        ),
                        0xb48a4b,
                        0.045
                    )
                )
            }
        }


        for (
            let i = 0;
            i < 28;
            i++
        ) {

            const electron =
                this.createElectron(
                    new THREE.Vector3(
                        -4.2 +
                        Math.random() * 8.4,

                        -3 +
                        Math.random() * 6,

                        0.55 +
                        Math.random() * 0.6
                    ),
                    0x8dccff,
                    0.75
                )


            group.add(
                electron
            )

            this.metallicElectrons.push(
                electron
            )
        }
    }


    /* =====================================================
       POLAR COVALENT
       ===================================================== */

    buildPolarModel() {

        const group =
            this.modelGroup


        const oxygen =
            new THREE.Vector3(
                0,
                0.35,
                0
            )

        const hydrogenLeft =
            new THREE.Vector3(
                -2.35,
                -1.15,
                0
            )

        const hydrogenRight =
            new THREE.Vector3(
                2.35,
                -1.15,
                0
            )


        group.add(
            this.createAtom(
                1.3,
                0xe06a6a,
                oxygen,
                'O δ−'
            )
        )


        group.add(
            this.createAtom(
                0.82,
                0xe8edf4,
                hydrogenLeft,
                'H δ+'
            )
        )


        group.add(
            this.createAtom(
                0.82,
                0xe8edf4,
                hydrogenRight,
                'H δ+'
            )
        )


        group.add(
            this.createBondLine(
                oxygen,
                hydrogenLeft,
                0xe0bd76,
                0.075
            )
        )


        group.add(
            this.createBondLine(
                oxygen,
                hydrogenRight,
                0xe0bd76,
                0.075
            )
        )


        const electron1 =
            this.createElectron(
                new THREE.Vector3(
                    -0.72,
                    -0.15,
                    0.55
                ),
                0x8dccff,
                0.85
            )

        const electron2 =
            this.createElectron(
                new THREE.Vector3(
                    0.72,
                    -0.15,
                    0.55
                ),
                0x8dccff,
                0.85
            )


        group.add(
            electron1
        )

        group.add(
            electron2
        )


        this.createCharge(
            group,
            new THREE.Vector3(
                0,
                1.9,
                0
            ),
            'δ−'
        )


        this.createCharge(
            group,
            new THREE.Vector3(
                -2.35,
                -2.05,
                0
            ),
            'δ+'
        )


        this.createCharge(
            group,
            new THREE.Vector3(
                2.35,
                -2.05,
                0
            ),
            'δ+'
        )
    }


    /* =====================================================
       COORDINATE COVALENT
       ===================================================== */

    buildCoordinateModel() {

        const group =
            this.modelGroup


        const nitrogen =
            new THREE.Vector3(
                0,
                0,
                0
            )


        group.add(
            this.createAtom(
                1.35,
                0x62a7df,
                nitrogen,
                'N'
            )
        )


        const hydrogens = [
            new THREE.Vector3(
                0,
                2.7,
                0
            ),

            new THREE.Vector3(
                2.55,
                0.8,
                0
            ),

            new THREE.Vector3(
                -2.55,
                0.8,
                0
            ),

            new THREE.Vector3(
                0,
                -2.7,
                0
            )
        ]


        hydrogens.forEach(
            position => {

                group.add(
                    this.createAtom(
                        0.72,
                        0xe8edf4,
                        position,
                        'H'
                    )
                )


                group.add(
                    this.createBondLine(
                        nitrogen,
                        position,
                        0xe0bd76,
                        0.075
                    )
                )
            }
        )


        const pair1 =
            this.createElectron(
                new THREE.Vector3(
                    -0.28,
                    -0.65,
                    0.65
                ),
                0xffd86a,
                0.9
            )


        const pair2 =
            this.createElectron(
                new THREE.Vector3(
                    0.28,
                    -0.65,
                    0.65
                ),
                0xffd86a,
                0.9
            )


        group.add(
            pair1
        )

        group.add(
            pair2
        )


        this.coordinatePair = [
            pair1,
            pair2
        ]
    }


    /* =====================================================
       CHARGE LABEL
       ===================================================== */

    createCharge(
        group,
        position,
        text
    ) {

        const canvas =
            document.createElement(
                'canvas'
            )

        canvas.width = 384
        canvas.height = 192


        const ctx =
            canvas.getContext(
                '2d'
            )


        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        )


        ctx.font =
            'bold 76px Arial'

        ctx.textAlign =
            'center'

        ctx.textBaseline =
            'middle'


        ctx.lineWidth =
            14

        ctx.lineJoin =
            'round'

        ctx.strokeStyle =
            'rgba(2, 8, 23, 0.98)'

        ctx.strokeText(
            text,
            192,
            96
        )


        ctx.fillStyle =
            '#f0c96f'

        ctx.shadowColor =
            '#f0c96f'

        ctx.shadowBlur =
            8

        ctx.fillText(
            text,
            192,
            96
        )


        ctx.shadowBlur =
            0

        ctx.fillText(
            text,
            192,
            96
        )


        const texture =
            new THREE.CanvasTexture(
                canvas
            )


        texture.colorSpace =
            THREE.SRGBColorSpace


        const material =
            new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
                opacity: 1,
                depthWrite: false,
                depthTest: false,
                toneMapped: false
            })


        const sprite =
            new THREE.Sprite(
                material
            )


        sprite.position.copy(
            position
        )

        sprite.scale.set(
            1.28,
            0.64,
            1
        )


        group.add(
            sprite
        )


        return sprite
    }


    /* =====================================================
       EVENTS
       ===================================================== */

    createEvents() {

        this.onResize =
            () => {

                this.camera.aspect =
                    window.innerWidth /
                    window.innerHeight

                this.camera.updateProjectionMatrix()


                this.renderer.setSize(
                    window.innerWidth,
                    window.innerHeight
                )
            }


        window.addEventListener(
            'resize',
            this.onResize
        )


        this.onPointerMove =
            event => {

                this.handlePointerMove(
                    event
                )
            }


        this.onPointerDown =
            event => {

                this.handlePointerClick(
                    event
                )
            }


        this.renderer.domElement.addEventListener(
            'pointermove',
            this.onPointerMove
        )


        this.renderer.domElement.addEventListener(
            'pointerdown',
            this.onPointerDown
        )


        this.backButton.addEventListener(
            'click',
            () => {

                this.returnToWorld()
            }
        )


        this.resetButton.addEventListener(
            'click',
            () => {

                this.reset()
            }
        )


        this.onLanguageChange =
            () => {

                this.updateLanguage()
            }


        window.addEventListener(
            'awtaar-language-change',
            this.onLanguageChange
        )
    }


    /* =====================================================
       POINTER
       ===================================================== */

    getPointer(
        event
    ) {

        const rect =
            this.renderer
                .domElement
                .getBoundingClientRect()


        return new THREE.Vector2(
            (
                (
                    event.clientX -
                    rect.left
                ) /
                rect.width
            ) * 2 - 1,

            -(
                (
                    event.clientY -
                    rect.top
                ) /
                rect.height
            ) * 2 + 1
        )
    }


    handlePointerMove(
        event
    ) {

        const pointer =
            this.getPointer(
                event
            )


        const raycaster =
            new THREE.Raycaster()


        raycaster.setFromCamera(
            pointer,
            this.camera
        )


        const intersections =
            raycaster.intersectObjects(
                this.interactiveObjects,
                true
            )


        if (
            intersections.length
        ) {

            const object =
                intersections[0].object


            this.renderer.domElement.style.cursor =
                'pointer'


            if (
                this.hoveredObject !==
                object
            ) {

                this.clearHover()

                this.hoveredObject =
                    object

                this.applyHover(
                    object
                )
            }

        } else {

            this.renderer.domElement.style.cursor =
                'default'

            this.clearHover()
        }
    }


    handlePointerClick(
        event
    ) {

        const pointer =
            this.getPointer(
                event
            )


        const raycaster =
            new THREE.Raycaster()


        raycaster.setFromCamera(
            pointer,
            this.camera
        )


        const intersections =
            raycaster.intersectObjects(
                this.interactiveObjects,
                true
            )


        if (
            !intersections.length
        ) {
            return
        }


        const object =
            intersections[0].object


        if (
            object.userData.isElectron
        ) {

            this.highlightElectron(
                object
            )

            return
        }


        if (
            object.userData.isBondAtom
        ) {

            this.highlightAtom(
                object
            )
        }
    }


    /* =====================================================
       HOVER
       ===================================================== */

    applyHover(
        object
    ) {

        if (
            object.userData.isElectron
        ) {

            object.scale.setScalar(
                1.35
            )

            if (
                object.material
            ) {

                object.material.emissiveIntensity =
                    5
            }
        }


        if (
            object.userData.isBondAtom
        ) {

            object.scale.setScalar(
                1.08
            )


            if (
                object.material &&
                object.userData.baseColor
            ) {

                object.material.color
                    .copy(
                        object.userData.baseColor
                    )
                    .offsetHSL(
                        0,
                        0,
                        0.12
                    )
            }
        }
    }


    clearHover() {

        if (
            !this.hoveredObject
        ) {
            return
        }


        const object =
            this.hoveredObject


        if (
            object.userData.isElectron
        ) {

            object.scale.setScalar(
                1
            )

            if (
                object.material
            ) {

                object.material.emissiveIntensity =
                    object.userData.baseEmissiveIntensity ??
                    2.8
            }
        }


        if (
            object.userData.isBondAtom
        ) {

            object.scale.setScalar(
                1
            )


            if (
                object.material &&
                object.userData.baseColor
            ) {

                object.material.color.copy(
                    object.userData.baseColor
                )
            }
        }


        this.hoveredObject =
            null
    }


    /* =====================================================
       HIGHLIGHT
       ===================================================== */

    highlightElectron(
        object
    ) {

        object.scale.setScalar(
            1.55
        )

        object.material.emissiveIntensity =
            5
    }


    highlightAtom(
        object
    ) {

        object.scale.setScalar(
            1.15
        )


        if (
            object.material &&
            object.userData.baseColor
        ) {

            object.material.color
                .copy(
                    object.userData.baseColor
                )
                .offsetHSL(
                    0,
                    0,
                    0.22
                )
        }
    }


    /* =====================================================
       RESET
       ===================================================== */

    reset() {

        this.activeBond =
            this.activeBond

        this.isAnimatingTransition =
            false

        this.transitionProgress =
            1

        this.buildBondModel(
            this.activeBond
        )

        this.updateInfo()
    }


    /* =====================================================
       UPDATE
       ===================================================== */

    update(
        delta = 0.016
    ) {

        if (
            !this.visible
        ) {
            return
        }


        this.elapsed +=
            delta


        /* -------------------------------------------------
           Environment
           ------------------------------------------------- */

        if (
            this.environmentParticles
        ) {

            this.environmentParticles.rotation.y +=
                delta * 0.012

            this.environmentParticles.rotation.x +=
                delta * 0.004
        }


        /* -------------------------------------------------
           Transition
           ------------------------------------------------- */

        if (
            this.isAnimatingTransition
        ) {

            this.transitionProgress +=
                delta * 1.8


            if (
                this.transitionProgress >= 1
            ) {

                this.transitionProgress =
                    1

                this.isAnimatingTransition =
                    false

                this.buildBondModel(
                    this.transitionTo
                )
            }
        }


        /* -------------------------------------------------
           Covalent animation
           ------------------------------------------------- */

        if (
            this.activeBond ===
            'covalent' &&
            this.covalentElectrons
        ) {

            const time =
                this.elapsed * 2.2


            this.covalentElectrons[0]
                .position.x =
                -0.38 +
                Math.sin(time) * 0.10

            this.covalentElectrons[0]
                .position.y =
                0.25 +
                Math.sin(time) * 0.16


            this.covalentElectrons[1]
                .position.x =
                0.38 +
                Math.sin(time + Math.PI) * 0.10

            this.covalentElectrons[1]
                .position.y =
                -0.25 +
                Math.sin(
                    time + Math.PI
                ) * 0.16


            if (
                this.covalentField
            ) {

                this.covalentField.rotation.z +=
                    delta * 0.45

                this.covalentField.material.opacity =
                    0.24 +
                    Math.sin(
                        this.elapsed * 2
                    ) * 0.08
            }


            if (
                this.covalentSharedGlow
            ) {

                const pulse =
                    1 +
                    Math.sin(
                        this.elapsed * 2.5
                    ) * 0.08

                this.covalentSharedGlow
                    .scale.set(
                        1.7 * pulse,
                        0.72 * pulse,
                        0.72 * pulse
                    )
            }


            if (
                this.covalentSharingArrows
            ) {

                const opacity =
                    0.52 +
                    Math.sin(
                        this.elapsed * 2
                    ) * 0.18


                this.covalentSharingArrows
                    .forEach(
                        arrow => {

                            arrow.line.material.opacity =
                                opacity

                            arrow.cone.material.opacity =
                                opacity + 0.12
                        }
                    )
            }
        }


        /* -------------------------------------------------
           Ionic electron transfer
           ------------------------------------------------- */

        if (
            this.activeBond ===
            'ionic' &&
            this.ionicElectron
        ) {

            const progress =
                (
                    Math.sin(
                        this.elapsed * 1.15
                    ) + 1
                ) / 2


            this.ionicElectron.position.lerpVectors(
                this.ionicStart,
                this.ionicEnd,
                progress
            )


            this.ionicElectron.position.y +=
                Math.sin(
                    this.elapsed * 3
                ) * 0.12


            const chargeProgress =
                THREE.MathUtils.smoothstep(
                    progress,
                    0.58,
                    0.92
                )


            if (
                this.ionicSodiumCharge
            ) {

                this.ionicSodiumCharge
                    .material
                    .opacity =
                    chargeProgress
            }


            if (
                this.ionicChlorineCharge
            ) {

                this.ionicChlorineCharge
                    .material
                    .opacity =
                    chargeProgress
            }


            if (
                this.ionicTransferArrow
            ) {

                const pulse =
                    0.62 +
                    Math.sin(
                        this.elapsed * 3
                    ) * 0.20


                this.ionicTransferArrow
                    .line.material.opacity =
                    pulse

                this.ionicTransferArrow
                    .cone.material.opacity =
                    Math.min(
                        pulse + 0.18,
                        1
                    )
            }


            if (
                this.ionicAttractionArrows
            ) {

                const attraction =
                    chargeProgress *
                    (
                        0.45 +
                        Math.sin(
                            this.elapsed * 2
                        ) * 0.12
                    )


                this.ionicAttractionArrows
                    .forEach(
                        arrow => {

                            arrow.line.material.opacity =
                                attraction

                            arrow.cone.material.opacity =
                                attraction + 0.08
                        }
                    )
            }


            if (
                this.ionicElectricField
            ) {

                this.ionicElectricField.material.opacity =
                    chargeProgress *
                    (
                        0.10 +
                        Math.sin(
                            this.elapsed * 2.2
                        ) * 0.035
                    )

                this.ionicElectricField.rotation.z +=
                    delta * 0.3
            }
        }


        /* -------------------------------------------------
           Metallic electron sea
           ------------------------------------------------- */

        if (
            this.activeBond ===
            'metallic' &&
            this.metallicElectrons
        ) {

            this.metallicElectrons.forEach(
                (
                    electron,
                    index
                ) => {

                    electron.position.x +=
                        delta *
                        (
                            0.35 +
                            (index % 3) *
                            0.08
                        )


                    if (
                        electron.position.x >
                        4.5
                    ) {

                        electron.position.x =
                            -4.5
                    }


                    electron.position.y +=
                        Math.sin(
                            this.elapsed * 1.5 +
                            index
                        ) *
                        delta *
                        0.15
                }
            )
        }


        /* -------------------------------------------------
           Coordinate pair
           ------------------------------------------------- */

        if (
            this.activeBond ===
            'coordinate' &&
            this.coordinatePair
        ) {

            const pulse =
                1 +
                Math.sin(
                    this.elapsed * 2.4
                ) * 0.12


            this.coordinatePair.forEach(
                electron => {

                    electron.scale.setScalar(
                        0.9 * pulse
                    )
                }
            )
        }


        /* -------------------------------------------------
           Model rotation
           ------------------------------------------------- */

        if (
            this.modelGroup &&
            !this.isAnimatingTransition
        ) {

            this.modelGroup.rotation.y =
                Math.sin(
                    this.elapsed * 0.18
                ) * 0.08

            this.modelGroup.rotation.x =
                Math.sin(
                    this.elapsed * 0.14
                ) * 0.025
        }


        /* -------------------------------------------------
           Render
           ------------------------------------------------- */

        this.renderer.render(
            this.renderScene,
            this.camera
        )
    }


    /* =====================================================
       SHOW
       ===================================================== */

    show() {

        this.visible =
            true


        this.renderer.domElement.style.display =
            'block'


        this.container.style.visibility =
            'visible'

        this.container.style.pointerEvents =
            'auto'

        this.container.style.opacity =
            '1'

        /*
         * Keep the container transparent so its full-screen
         * background cannot dim the WebGL scene.
         */
        this.container.style.background =
            'transparent'


        this.updateLanguage()


        return this
    }


    /* =====================================================
       HIDE
       ===================================================== */

    hide() {

        this.visible =
            false


        this.container.style.opacity =
            '0'

        this.container.style.pointerEvents =
            'none'


        window.setTimeout(
            () => {

                if (
                    !this.visible
                ) {

                    this.container.style.visibility =
                        'hidden'

                    this.renderer.domElement.style.display =
                        'none'
                }

            },
            550
        )


        return this
    }


    /* =====================================================
       IMMEDIATE HIDE
       ===================================================== */

    hideImmediate() {

        this.visible =
            false


        this.container.style.opacity =
            '0'

        this.container.style.visibility =
            'hidden'

        this.container.style.pointerEvents =
            'none'

        this.container.style.background =
            'transparent'

        this.renderer.domElement.style.display =
            'none'
    }


    /* =====================================================
       RETURN TO WORLD
       ===================================================== */

    returnToWorld() {

        this.hide()


        window.setTimeout(
            () => {

                if (
                    this.parent &&
                    typeof this.parent.show ===
                    'function'
                ) {

                    this.parent.show()
                }

            },
            550
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
    }


    /* =====================================================
       DISPOSE
       ===================================================== */

    disposeObject(
        object
    ) {

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

                    if (
                        Array.isArray(
                            child.material
                        )
                    ) {

                        child.material.forEach(
                            material => {

                                if (
                                    material.map
                                ) {

                                    material.map.dispose()
                                }

                                material.dispose()
                            }
                        )

                    } else {

                        if (
                            child.material.map
                        ) {

                            child.material.map.dispose()
                        }

                        child.material.dispose()
                    }
                }
            }
        )
    }


    /* =====================================================
       DESTROY
       ===================================================== */

    destroy() {

        window.removeEventListener(
            'resize',
            this.onResize
        )


        window.removeEventListener(
            'awtaar-language-change',
            this.onLanguageChange
        )


        this.renderer.domElement.removeEventListener(
            'pointermove',
            this.onPointerMove
        )


        this.renderer.domElement.removeEventListener(
            'pointerdown',
            this.onPointerDown
        )


        if (
            this.modelGroup
        ) {

            this.disposeObject(
                this.modelGroup
            )
        }


        if (
            this.environmentGroup
        ) {

            this.disposeObject(
                this.environmentGroup
            )
        }


        if (
            this.renderer
        ) {

            this.renderer.dispose()
        }


        if (
            this.renderer.domElement &&
            this.renderer.domElement.parentNode
        ) {

            this.renderer.domElement.parentNode.removeChild(
                this.renderer.domElement
            )
        }


        if (
            this.container &&
            this.container.parentNode
        ) {

            this.container.parentNode.removeChild(
                this.container
            )
        }


        this.modelGroup =
            null

        this.environmentGroup =
            null

        this.interactiveObjects =
            []

        this.renderer =
            null
    }
}