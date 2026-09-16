/* =========================================================
   AWTAAR — ATOMIC STRUCTURE EXPERIMENT
   =========================================================

   Scientific model:

   Carbon-12
   - 6 protons
   - 6 neutrons
   - 6 electrons
   - Electron configuration: 2 + 4

   The orbital rings are a simplified educational
   visualization of electron energy levels.
   They are NOT literal electron trajectories.

   ========================================================= */

import * as THREE from 'three'
import './atomic-structure.css'

import {
    t,
    getLanguage
} from '../../locales/i18n.js'


export default class AtomicStructureExperiment {

    /* =====================================================
       CONSTRUCTOR
       ===================================================== */

    constructor(
        scene = null,
        parent = null
    ) {

        this.scene =
            scene

        this.parent =
            parent

        this.active =
            false

        this.destroyed =
            false

        this.elapsed =
            0

        this.atomScale =
            1

        this.selectedParticle =
            null

        this.orbitsVisible =
            true

        /*
         * Dedicated Three.js scene.
         *
         * This experiment must remain visually independent
         * from the main Awtaar scene.
         */

        this.renderScene =
            new THREE.Scene()

        this.camera =
            null

        this.renderer =
            null

        this.atomicGroup =
            null

        this.nucleusGroup =
            null

        this.orbitGroup =
            null

        this.environmentGroup =
            null

        this.protons =
            []

        this.neutrons =
            []

        this.electrons =
            []

        this.orbits =
            []

        this.interactiveObjects =
            []

        this.pointer =
            new THREE.Vector2()

        this.raycaster =
            new THREE.Raycaster()

        this.language =
            getLanguage()

        this.container =
            null

        this.ui =
            null

        this.infoTitle =
            null

        this.infoDescription =
            null

        this.legendButtons =
            {}

        this.resetButton =
            null

        this.orbitButton =
            null

        this.backButton =
            null

        this.hint =
            null

        this.resizeHandler =
            () => this.resize()

        this.languageHandler =
            () => this.updateLanguage()


        /*
         * Build experiment.
         */

        this.createScene()

        this.createCamera()

        this.createRenderer()

        this.createLights()

        this.createEnvironment()

        this.createAtom()

        this.createUI()

        this.createEvents()


        /*
         * Initial hidden state.
         */

        this.renderer.domElement.style.display =
            'none'

        this.container.style.display =
            'none'
    }


    /* =====================================================
       SCENE
       ===================================================== */

    createScene() {

        this.renderScene =
            new THREE.Scene()

        this.renderScene.background =
            new THREE.Color(0x020817)

        this.renderScene.fog =
            new THREE.FogExp2(
                0x020817,
                0.018
            )
    }


    /* =====================================================
       CAMERA
       ===================================================== */

    createCamera() {

        this.camera =
            new THREE.PerspectiveCamera(
                42,
                window.innerWidth /
                window.innerHeight,
                0.1,
                100
            )

        this.camera.position.set(
            0,
            0.4,
            15
        )
    }


    /* =====================================================
       RENDERER
       ===================================================== */

    createRenderer() {

        this.renderer =
            new THREE.WebGLRenderer({
                antialias: true,
                alpha: false,
                powerPreference: 'high-performance'
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

        this.renderer.toneMapping =
            THREE.ACESFilmicToneMapping

        this.renderer.toneMappingExposure =
            1.15

        this.renderer.domElement.className =
            'awtaar-atomic-canvas'

        this.renderer.domElement.style.position =
            'fixed'

        this.renderer.domElement.style.inset =
            '0'

        this.renderer.domElement.style.width =
            '100%'

        this.renderer.domElement.style.height =
            '100%'

        this.renderer.domElement.style.zIndex =
            '19999'

        this.renderer.domElement.style.pointerEvents =
            'auto'

        document.body.appendChild(
            this.renderer.domElement
        )
    }


    /* =====================================================
       LIGHTS
       ===================================================== */

    createLights() {

        const ambient =
            new THREE.AmbientLight(
                0x7894c9,
                1.15
            )

        this.renderScene.add(
            ambient
        )


        const blueLight =
            new THREE.PointLight(
                0x4d8dff,
                5,
                30
            )

        blueLight.position.set(
            -5,
            3,
            7
        )

        this.renderScene.add(
            blueLight
        )


        const goldLight =
            new THREE.PointLight(
                0xdcb35d,
                4,
                25
            )

        goldLight.position.set(
            5,
            -2,
            6
        )

        this.renderScene.add(
            goldLight
        )


        const backLight =
            new THREE.PointLight(
                0x3568c5,
                3,
                25
            )

        backLight.position.set(
            0,
            5,
            -5
        )

        this.renderScene.add(
            backLight
        )
    }


    /* =====================================================
       ENVIRONMENT
       ===================================================== */

    createEnvironment() {

        this.environmentGroup =
            new THREE.Group()

        const geometry =
            new THREE.BufferGeometry()

        const positions =
            []

        for (
            let i = 0;
            i < 500;
            i++
        ) {

            const radius =
                12 +
                Math.random() * 14

            const theta =
                Math.random() *
                Math.PI *
                2

            const phi =
                Math.acos(
                    2 * Math.random() - 1
                )

            positions.push(
                radius *
                Math.sin(phi) *
                Math.cos(theta),

                radius *
                Math.sin(phi) *
                Math.sin(theta),

                radius *
                Math.cos(phi)
            )
        }

        geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(
                positions,
                3
            )
        )

        const material =
            new THREE.PointsMaterial({
                color: 0x6f8fc7,
                size: 0.035,
                transparent: true,
                opacity: 0.42,
                depthWrite: false
            })

        const particles =
            new THREE.Points(
                geometry,
                material
            )

        this.environmentGroup.add(
            particles
        )

        this.renderScene.add(
            this.environmentGroup
        )
    }


    /* =====================================================
       ATOM
       ===================================================== */

    createAtom() {

        this.atomicGroup =
            new THREE.Group()

        this.orbitGroup =
            new THREE.Group()

        this.nucleusGroup =
            new THREE.Group()

        this.atomicGroup.add(
            this.orbitGroup
        )

        this.atomicGroup.add(
            this.nucleusGroup
        )

        this.renderScene.add(
            this.atomicGroup
        )

        this.createOrbits()

        this.createNucleus()

        this.createElectrons()

        this.atomicGroup.scale.setScalar(
            this.atomScale
        )
    }


    /* =====================================================
       ORBITS
       =====================================================

       Simplified energy-level visualization:

       Shell 1
       - 2 electrons

       Shell 2
       - 4 electrons

       There is intentionally NO third shell.
       ===================================================== */

    createOrbits() {

        const orbitDefinitions = [
            {
                radius: 2.65,
                tiltX: 0,
                tiltZ: 0,
                opacity: 0.34
            },
            {
                radius: 3.65,
                tiltX: 0.38,
                tiltZ: 0.12,
                opacity: 0.27
            }
        ]


        orbitDefinitions.forEach(
            definition => {

                const curve =
                    new THREE.EllipseCurve(
                        0,
                        0,
                        definition.radius,
                        definition.radius,
                        0,
                        Math.PI * 2,
                        false,
                        0
                    )

                const points =
                    curve.getPoints(160)

                const geometry =
                    new THREE.BufferGeometry()
                        .setFromPoints(
                            points.map(
                                point =>
                                    new THREE.Vector3(
                                        point.x,
                                        point.y,
                                        0
                                    )
                            )
                        )

                const material =
                    new THREE.LineBasicMaterial({
                        color: 0x6c9cff,
                        transparent: true,
                        opacity:
                            definition.opacity,
                        depthWrite: false
                    })

                const line =
                    new THREE.LineLoop(
                        geometry,
                        material
                    )

                line.rotation.x =
                    definition.tiltX

                line.rotation.z =
                    definition.tiltZ

                this.orbitGroup.add(
                    line
                )

                this.orbits.push(
                    line
                )
            }
        )
    }


    /* =====================================================
       NUCLEUS
       ===================================================== */

    createNucleus() {

        /*
         * Carbon-12 nucleus:
         *
         * 6 protons
         * 6 neutrons
         */

        const nucleusGlow =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    1.02,
                    32,
                    32
                ),
                new THREE.MeshBasicMaterial({
                    color: 0xdcb35d,
                    transparent: true,
                    opacity: 0.08,
                    blending:
                        THREE.AdditiveBlending,
                    depthWrite: false
                })
            )

        this.nucleusGroup.add(
            nucleusGlow
        )


        const nucleusLight =
            new THREE.PointLight(
                0xdcb35d,
                2.5,
                8
            )

        this.nucleusGroup.add(
            nucleusLight
        )


        /*
         * Twelve nucleons arranged compactly.
         */

        const nucleons = [
            /* protons */
            {
                type: 'proton',
                position: [-0.42, 0.38, 0.18]
            },
            {
                type: 'proton',
                position: [0.40, 0.34, -0.16]
            },
            {
                type: 'proton',
                position: [-0.48, -0.28, -0.18]
            },
            {
                type: 'proton',
                position: [0.44, -0.34, 0.20]
            },
            {
                type: 'proton',
                position: [0.00, 0.02, 0.42]
            },
            {
                type: 'proton',
                position: [0.02, -0.02, -0.42]
            },

            /* neutrons */
            {
                type: 'neutron',
                position: [-0.12, 0.48, -0.38]
            },
            {
                type: 'neutron',
                position: [0.15, 0.48, 0.36]
            },
            {
                type: 'neutron',
                position: [-0.18, -0.48, 0.34]
            },
            {
                type: 'neutron',
                position: [0.18, -0.48, -0.36]
            },
            {
                type: 'neutron',
                position: [-0.54, 0.02, 0]
            },
            {
                type: 'neutron',
                position: [0.54, 0.02, 0]
            }
        ]


        nucleons.forEach(
            nucleon => {

                const isProton =
                    nucleon.type === 'proton'

                const material =
                    new THREE.MeshStandardMaterial({
                        color:
                            isProton
                                ? 0xdcb35d
                                : 0xb9c0ca,
                        emissive:
                            isProton
                                ? 0x8d6a24
                                : 0x525b66,
                        emissiveIntensity:
                            isProton
                                ? 1.3
                                : 0.8,
                        metalness: 0.28,
                        roughness: 0.34
                    })

                const particle =
                    new THREE.Mesh(
                        new THREE.SphereGeometry(
                            0.31,
                            24,
                            24
                        ),
                        material
                    )

                particle.position.set(
                    nucleon.position[0],
                    nucleon.position[1],
                    nucleon.position[2]
                )

                particle.userData.type =
                    nucleon.type

                particle.userData.originalScale =
                    1

                particle.userData.originalEmissive =
                    material.emissive.getHex()

                particle.userData.originalIntensity =
                    material.emissiveIntensity

                this.nucleusGroup.add(
                    particle
                )

                this.interactiveObjects.push(
                    particle
                )

                if (isProton) {

                    this.protons.push(
                        particle
                    )

                } else {

                    this.neutrons.push(
                        particle
                    )
                }
            }
        )
    }


    /* =====================================================
       ELECTRONS
       ===================================================== */

    createElectrons() {

        /*
         * Carbon-12:
         *
         * First shell  = 2
         * Second shell = 4
         *
         * Total = 6 electrons
         */

        const electronDefinitions = [
            /* first shell */
            {
                orbit: 0,
                angle: 0,
                speed: 1.25
            },
            {
                orbit: 0,
                angle: Math.PI,
                speed: 1.25
            },

            /* second shell */
            {
                orbit: 1,
                angle: 0,
                speed: 0.90
            },
            {
                orbit: 1,
                angle: Math.PI,
                speed: 0.90
            },
            {
                orbit: 1,
                angle: Math.PI / 2,
                speed: 0.90
            },
            {
                orbit: 1,
                angle: Math.PI * 1.5,
                speed: 0.90
            }
        ]


        electronDefinitions.forEach(
            definition => {

                const material =
                    new THREE.MeshStandardMaterial({
                        color: 0x62a9ff,
                        emissive: 0x2b79ff,
                        emissiveIntensity: 2.2,
                        metalness: 0.15,
                        roughness: 0.22
                    })

                const electron =
                    new THREE.Mesh(
                        new THREE.SphereGeometry(
                            0.17,
                            20,
                            20
                        ),
                        material
                    )

                electron.userData.type =
                    'electron'

                electron.userData.orbit =
                    definition.orbit

                electron.userData.angle =
                    definition.angle

                electron.userData.initialAngle =
                    definition.angle

                electron.userData.speed =
                    definition.speed

                electron.userData.originalScale =
                    1

                electron.userData.originalEmissive =
                    material.emissive.getHex()

                electron.userData.originalIntensity =
                    material.emissiveIntensity

                /*
                 * Dedicated glow light.
                 *
                 * This makes electron selection
                 * visually obvious.
                 */

                const glowLight =
                    new THREE.PointLight(
                        0x62a9ff,
                        1.8,
                        3.5
                    )

                electron.userData.glowLight =
                    glowLight

                this.atomicGroup.add(
                    electron
                )

                this.atomicGroup.add(
                    glowLight
                )

                this.electrons.push(
                    electron
                )

                this.interactiveObjects.push(
                    electron
                )
            }
        )


        this.updateElectronPositions()
    }


    /* =====================================================
       ELECTRON POSITIONS
       ===================================================== */

    updateElectronPositions() {

        const orbitData = [
            {
                radius: 2.65,
                tiltX: 0,
                tiltZ: 0
            },
            {
                radius: 3.65,
                tiltX: 0.38,
                tiltZ: 0.12
            }
        ]


        this.electrons.forEach(
            electron => {

                const data =
                    orbitData[
                        electron.userData.orbit
                    ]

                const angle =
                    electron.userData.angle

                const position =
                    new THREE.Vector3(
                        data.radius *
                        Math.cos(angle),

                        data.radius *
                        Math.sin(angle),

                        0
                    )

                /*
                 * Apply the same orbital tilt
                 * used by the visible orbit ring.
                 */

                position.applyEuler(
                    new THREE.Euler(
                        data.tiltX,
                        0,
                        data.tiltZ
                    )
                )

                electron.position.copy(
                    position
                )

                if (
                    electron.userData.glowLight
                ) {

                    electron.userData.glowLight
                        .position.copy(
                            electron.position
                        )
                }
            }
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

        this.container.id =
            'awtaar-atomic-structure'

        this.container.className =
            'awtaar-atomic-experiment'

        /*
         * Important:
         * HTML direction belongs to the UI,
         * not to Three.js.
         */

        this.container.dir =
            this.language === 'ar'
                ? 'rtl'
                : 'ltr'


        this.ui =
            document.createElement(
                'div'
            )

        this.ui.className =
            'awtaar-atomic-ui'


        /* =================================================
           TOP BAR
           ================================================= */

        const topbar =
            document.createElement(
                'div'
            )

        topbar.className =
            'awtaar-atomic-topbar'


        const heading =
            document.createElement(
                'div'
            )

        heading.className =
            'awtaar-atomic-heading'


        const eyebrow =
            document.createElement(
                'div'
            )

        eyebrow.className =
            'awtaar-atomic-eyebrow'

        this.eyebrow =
            eyebrow


        const title =
            document.createElement(
                'h1'
            )

        title.className =
            'awtaar-atomic-title'

        this.title =
            title


        const description =
            document.createElement(
                'div'
            )

        description.className =
            'awtaar-atomic-description'

        this.description =
            description


        heading.appendChild(
            eyebrow
        )

        heading.appendChild(
            title
        )

        heading.appendChild(
            description
        )


        this.backButton =
            document.createElement(
                'button'
            )

        this.backButton.className =
            'awtaar-atomic-back'


        topbar.appendChild(
            heading
        )

        topbar.appendChild(
            this.backButton
        )


        /* =================================================
           STAGE
           ================================================= */

        const stage =
            document.createElement(
                'div'
            )

        stage.className =
            'awtaar-atomic-stage'


        this.hint =
            document.createElement(
                'div'
            )

        this.hint.className =
            'awtaar-atomic-hint'


        stage.appendChild(
            this.hint
        )


        /* =================================================
           INFO PANEL
           ================================================= */

        const info =
            document.createElement(
                'div'
            )

        info.className =
            'awtaar-atomic-info'


        const kicker =
            document.createElement(
                'div'
            )

        kicker.className =
            'awtaar-atomic-info-kicker'

        this.infoKicker =
            kicker


        this.infoTitle =
            document.createElement(
                'h2'
            )

        this.infoTitle.className =
            'awtaar-atomic-info-title'


        this.infoDescription =
            document.createElement(
                'div'
            )

        this.infoDescription.className =
            'awtaar-atomic-info-description'


        info.appendChild(
            kicker
        )

        info.appendChild(
            this.infoTitle
        )

        info.appendChild(
            this.infoDescription
        )


        /* =================================================
           LEGEND
           ================================================= */

        const legend =
            document.createElement(
                'div'
            )

        legend.className =
            'awtaar-atomic-legend'


        this.legendButtons.proton =
            this.createLegendButton(
                'proton'
            )

        this.legendButtons.neutron =
            this.createLegendButton(
                'neutron'
            )

        this.legendButtons.electron =
            this.createLegendButton(
                'electron'
            )


        legend.appendChild(
            this.legendButtons.proton
        )

        legend.appendChild(
            this.legendButtons.neutron
        )

        legend.appendChild(
            this.legendButtons.electron
        )


        /* =================================================
           CONTROLS
           ================================================= */

        const controls =
            document.createElement(
                'div'
            )

        controls.className =
            'awtaar-atomic-controls'


        this.resetButton =
            document.createElement(
                'button'
            )

        this.resetButton.className =
            'awtaar-atomic-control awtaar-atomic-reset'


        this.orbitButton =
            document.createElement(
                'button'
            )

        this.orbitButton.className =
            'awtaar-atomic-control awtaar-atomic-orbit-toggle'


        controls.appendChild(
            this.resetButton
        )

        controls.appendChild(
            this.orbitButton
        )


        /* =================================================
           ASSEMBLE
           ================================================= */

        this.ui.appendChild(
            topbar
        )

        this.ui.appendChild(
            stage
        )

        this.ui.appendChild(
            info
        )

        this.ui.appendChild(
            legend
        )

        this.ui.appendChild(
            controls
        )

        this.container.appendChild(
            this.ui
        )

        document.body.appendChild(
            this.container
        )


        this.setDefaultInfo()

        this.updateLanguage()
    }


    /* =====================================================
       LEGEND BUTTON
       ===================================================== */

    createLegendButton(
        type
    ) {

        const button =
            document.createElement(
                'button'
            )

        button.className =
            'awtaar-atomic-legend-item'

        button.dataset.particle =
            type


        const dot =
            document.createElement(
                'span'
            )

        dot.className =
            'awtaar-atomic-legend-dot'


        const label =
            document.createElement(
                'span'
            )


        button.appendChild(
            dot
        )

        button.appendChild(
            label
        )


        button.addEventListener(
            'click',
            () => {
                this.selectParticleType(
                    type
                )
            }
        )


        button._label =
            label


        return button
    }


    /* =====================================================
       DEFAULT INFO
       ===================================================== */

    setDefaultInfo() {

        const arabic =
            this.language === 'ar'


        this.infoKicker.textContent =
            arabic
                ? 'كربون-12'
                : 'CARBON-12'


        this.infoTitle.textContent =
            arabic
                ? 'ذرة كربون متعادلة'
                : 'Neutral Carbon Atom'


        this.infoDescription.textContent =
            arabic
                ? 'تتكوّن هذه الذرة من 6 بروتونات و6 نيوترونات و6 إلكترونات. تتوزع الإلكترونات على مستويين للطاقة: إلكترونان في المستوى الأول وأربعة في المستوى الثاني.'
                : 'This neutral carbon atom contains 6 protons, 6 neutrons, and 6 electrons. The electrons are arranged in two energy levels: 2 in the first shell and 4 in the second.'
    }


    /* =====================================================
       PARTICLE SELECTION
       ===================================================== */

    selectParticleType(
        type
    ) {

        this.clearSelection()

        this.selectedParticle =
            type


        const particles =
            type === 'proton'
                ? this.protons
                : type === 'neutron'
                    ? this.neutrons
                    : this.electrons


        particles.forEach(
            particle => {

                const material =
                    particle.material

                particle.userData.originalScale =
                    particle.scale.x

                particle.userData.originalEmissive =
                    material.emissive.getHex()

                particle.userData.originalIntensity =
                    material.emissiveIntensity


                if (
                    type === 'electron'
                ) {

                    /*
                     * Strong electron highlight.
                     */

                    particle.scale.setScalar(
                        1.55
                    )

                    material.emissive.set(
                        0x8dccff
                    )

                    material.emissiveIntensity =
                        5.0


                    if (
                        particle.userData.glowLight
                    ) {

                        particle.userData.glowLight
                            .color.set(
                                0x62a9ff
                            )

                        particle.userData.glowLight
                            .intensity =
                                5.5
                    }

                } else {

                    particle.scale.setScalar(
                        1.35
                    )

                    material.emissive.set(
                        type === 'proton'
                            ? 0xffd978
                            : 0xe0e5eb
                    )

                    material.emissiveIntensity =
                        type === 'proton'
                            ? 4.0
                            : 2.8
                }
            }
        )


        this.updateLegendActiveState(
            type
        )


        const arabic =
            this.language === 'ar'


        if (
            type === 'proton'
        ) {

            this.infoKicker.textContent =
                arabic
                    ? 'البروتون'
                    : 'PROTON'

            this.infoTitle.textContent =
                arabic
                    ? 'شحنة موجبة'
                    : 'Positive Charge'

            this.infoDescription.textContent =
                arabic
                    ? 'يوجد البروتون داخل النواة ويحمل شحنة كهربائية موجبة. عدد البروتونات هو الذي يحدد هوية العنصر؛ والكربون هنا يمتلك 6 بروتونات.'
                    : 'A proton is found in the nucleus and carries a positive electric charge. The number of protons defines the element; carbon has 6 protons.'
        }


        if (
            type === 'neutron'
        ) {

            this.infoKicker.textContent =
                arabic
                    ? 'النيوترون'
                    : 'NEUTRON'

            this.infoTitle.textContent =
                arabic
                    ? 'شحنة متعادلة'
                    : 'Neutral Charge'

            this.infoDescription.textContent =
                arabic
                    ? 'يوجد النيوترون داخل النواة ولا يحمل شحنة كهربائية. اختلاف عدد النيوترونات يصنع نظائر مختلفة للعنصر.'
                    : 'A neutron is found inside the nucleus and carries no electric charge. Changing the number of neutrons produces different isotopes of the same element.'
        }


        if (
            type === 'electron'
        ) {

            this.infoKicker.textContent =
                arabic
                    ? 'الإلكترون'
                    : 'ELECTRON'

            this.infoTitle.textContent =
                arabic
                    ? 'شحنة سالبة'
                    : 'Negative Charge'

            this.infoDescription.textContent =
                arabic
                    ? 'الإلكترون يحمل شحنة سالبة ويوجد في مستويات طاقة حول النواة. إلكترونات المستوى الخارجي هي الأكثر ارتباطًا بالروابط والتفاعلات الكيميائية.'
                    : 'An electron carries a negative charge and occupies energy levels around the nucleus. Outer-shell electrons are especially important for chemical bonding and reactions.'
        }
    }


    /* =====================================================
       CLEAR SELECTION
       ===================================================== */

    clearSelection() {

        const allParticles = [
            ...this.protons,
            ...this.neutrons,
            ...this.electrons
        ]


        allParticles.forEach(
            particle => {

                const material =
                    particle.material

                const originalScale =
                    particle.userData.originalScale ||
                    1

                const originalEmissive =
                    particle.userData.originalEmissive

                const originalIntensity =
                    particle.userData.originalIntensity


                particle.scale.setScalar(
                    originalScale
                )


                if (
                    originalEmissive !==
                    undefined
                ) {

                    material.emissive.setHex(
                        originalEmissive
                    )
                }


                if (
                    originalIntensity !==
                    undefined
                ) {

                    material.emissiveIntensity =
                        originalIntensity
                }


                if (
                    particle.userData.glowLight
                ) {

                    particle.userData.glowLight
                        .intensity =
                            1.8
                }
            }
        )


        this.selectedParticle =
            null


        this.updateLegendActiveState(
            null
        )
    }


    /* =====================================================
       LEGEND ACTIVE STATE
       ===================================================== */

    updateLegendActiveState(
        type
    ) {

        Object.entries(
            this.legendButtons
        ).forEach(
            ([key, button]) => {

                button.classList.toggle(
                    'is-active',
                    key === type
                )
            }
        )
    }


    /* =====================================================
       EVENTS
       ===================================================== */

    createEvents() {

        this.renderer.domElement.addEventListener(
            'pointermove',
            event => {

                this.pointer.x =
                    (
                        event.clientX /
                        window.innerWidth
                    ) * 2 - 1

                this.pointer.y =
                    -(
                        event.clientY /
                        window.innerHeight
                    ) * 2 + 1
            }
        )


        this.renderer.domElement.addEventListener(
            'pointerdown',
            event => {

                if (
                    !this.active
                ) {
                    return
                }

                this.pointer.x =
                    (
                        event.clientX /
                        window.innerWidth
                    ) * 2 - 1

                this.pointer.y =
                    -(
                        event.clientY /
                        window.innerHeight
                    ) * 2 + 1

                this.handlePointerClick()
            }
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
                this.resetAtom()
            }
        )


        this.orbitButton.addEventListener(
            'click',
            () => {
                this.toggleOrbits()
            }
        )


        window.addEventListener(
            'resize',
            this.resizeHandler
        )

        window.addEventListener(
            'awtaar-language-change',
            this.languageHandler
        )
    }


    /* =====================================================
       POINTER INTERACTION
       ===================================================== */

    handlePointerClick() {

        this.raycaster.setFromCamera(
            this.pointer,
            this.camera
        )

        const intersections =
            this.raycaster.intersectObjects(
                this.interactiveObjects,
                false
            )


        if (
            intersections.length === 0
        ) {
            return
        }


        const object =
            intersections[0].object

        const type =
            object.userData.type


        if (
            type
        ) {

            this.selectParticleType(
                type
            )
        }
    }


    /* =====================================================
       ORBITS
       ===================================================== */

    toggleOrbits() {

        this.orbitsVisible =
            !this.orbitsVisible


        this.orbits.forEach(
            orbit => {

                orbit.visible =
                    this.orbitsVisible
            }
        )


        this.orbitButton.classList.toggle(
            'is-active',
            this.orbitsVisible
        )


        const arabic =
            this.language === 'ar'


        this.orbitButton.textContent =
            this.orbitsVisible
                ? (
                    arabic
                        ? 'إخفاء مستويات الطاقة'
                        : 'Hide Energy Levels'
                )
                : (
                    arabic
                        ? 'إظهار مستويات الطاقة'
                        : 'Show Energy Levels'
                )
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


        this.active =
            true


        this.language =
            getLanguage()


        this.container.dir =
            this.language === 'ar'
                ? 'rtl'
                : 'ltr'


        this.renderer.domElement.style.display =
            'block'

        this.container.style.display =
            'block'


        this.updateLanguage()

        this.resize()
    }


    /* =====================================================
       HIDE
       ===================================================== */

    hide() {

        this.active =
            false


        if (
            this.renderer
        ) {

            this.renderer.domElement.style.display =
                'none'
        }


        if (
            this.container
        ) {

            this.container.style.display =
                'none'
        }
    }


    /* =====================================================
       RETURN TO WORLD
       ===================================================== */

    returnToWorld() {

        this.hide()


        if (
            this.parent &&
            typeof this.parent.show === 'function'
        ) {

            this.parent.show()
        }
    }


    /* =====================================================
       RESET
       ===================================================== */

    resetAtom() {

        this.elapsed =
            0

        this.clearSelection()

        this.orbitsVisible =
            true


        this.orbits.forEach(
            orbit => {

                orbit.visible =
                    true
            }
        )


        this.atomicGroup.rotation.set(
            0,
            0,
            0
        )

        this.atomicGroup.scale.setScalar(
            1
        )


        this.electrons.forEach(
            electron => {

                electron.userData.angle =
                    electron.userData.initialAngle
            }
        )


        this.updateElectronPositions()

        this.orbitButton.classList.add(
            'is-active'
        )

        this.updateLanguage()
    }


    /* =====================================================
       INITIAL ELECTRON ANGLE
       ===================================================== */

    getInitialElectronAngle(
        electron
    ) {

        return (
            electron.userData.initialAngle ||
            0
        )
    }


    /* =====================================================
       LANGUAGE
       ===================================================== */

    updateLanguage() {

        this.language =
            getLanguage()


        const arabic =
            this.language === 'ar'


        /*
         * IMPORTANT:
         *
         * This controls the HTML interface direction.
         * It has no effect on the Three.js atom itself.
         */

        if (
            this.container
        ) {

            this.container.dir =
                arabic
                    ? 'rtl'
                    : 'ltr'
        }


        if (
            this.eyebrow
        ) {

            this.eyebrow.textContent =
                arabic
                    ? 'مختبر الكيمياء'
                    : 'CHEMISTRY LAB'
        }


        if (
            this.title
        ) {

            this.title.textContent =
                t(
                    'chemistryWorld.experiments.atomicStructure.title'
                )
        }


        if (
            this.description
        ) {

            this.description.textContent =
                t(
                    'chemistryWorld.experiments.atomicStructure.description'
                )
        }


        if (
            this.backButton
        ) {

            this.backButton.textContent =
                t(
                    'chemistryWorld.back'
                )
        }


        if (
            this.hint
        ) {

            this.hint.textContent =
                arabic
                    ? 'اضغط على البروتون أو النيوترون أو الإلكترون لاستكشاف دوره'
                    : 'Select a proton, neutron, or electron to explore its role'
        }


        if (
            this.resetButton
        ) {

            this.resetButton.textContent =
                arabic
                    ? 'إعادة التجربة'
                    : 'Reset Experiment'
        }


        if (
            this.legendButtons.proton
        ) {

            this.legendButtons.proton._label.textContent =
                arabic
                    ? 'البروتون'
                    : 'Proton'
        }


        if (
            this.legendButtons.neutron
        ) {

            this.legendButtons.neutron._label.textContent =
                arabic
                    ? 'النيوترون'
                    : 'Neutron'
        }


        if (
            this.legendButtons.electron
        ) {

            this.legendButtons.electron._label.textContent =
                arabic
                    ? 'الإلكترون'
                    : 'Electron'
        }


        if (
            this.orbitButton
        ) {

            this.orbitButton.textContent =
                this.orbitsVisible
                    ? (
                        arabic
                            ? 'إخفاء مستويات الطاقة'
                            : 'Hide Energy Levels'
                    )
                    : (
                        arabic
                            ? 'إظهار مستويات الطاقة'
                            : 'Show Energy Levels'
                    )
        }


        /*
         * Preserve selected particle information.
         */

        if (
            this.selectedParticle
        ) {

            const selected =
                this.selectedParticle

            this.setDefaultInfo()

            this.selectParticleType(
                selected
            )

        } else {

            this.setDefaultInfo()
        }
    }


    /* =====================================================
       UPDATE
       ===================================================== */

    update(
        delta = 0.016
    ) {

        if (
            !this.active ||
            this.destroyed
        ) {

            return
        }


        this.elapsed +=
            delta


        /*
         * Subtle nucleus movement.
         */

        this.nucleusGroup.rotation.y =
            Math.sin(
                this.elapsed * 0.35
            ) * 0.025


        /*
         * Electron movement.
         */

        this.electrons.forEach(
            electron => {

                electron.userData.angle +=
                    delta *
                    electron.userData.speed


                const isSelected =
                    this.selectedParticle ===
                    'electron'


                /*
                 * Keep selected electrons strongly visible.
                 */

                if (
                    !isSelected
                ) {

                    const pulse =
                        1 +
                        Math.sin(
                            this.elapsed * 3.2 +
                            electron.userData.angle
                        ) *
                        0.07

                    electron.scale.setScalar(
                        pulse
                    )

                    electron.material
                        .emissiveIntensity =
                            2.2

                    if (
                        electron.userData.glowLight
                    ) {

                        electron.userData.glowLight
                            .intensity =
                                1.8
                    }

                } else {

                    /*
                     * Maintain selection highlight.
                     */

                    electron.scale.setScalar(
                        1.55
                    )

                    electron.material
                        .emissiveIntensity =
                            5.0

                    if (
                        electron.userData.glowLight
                    ) {

                        electron.userData.glowLight
                            .intensity =
                                5.5
                    }
                }
            }
        )


        this.updateElectronPositions()


        /*
         * Very slow atom rotation.
         */

        this.atomicGroup.rotation.y +=
            delta * 0.045


        /*
         * Soft orbital pulse.
         */

        this.orbits.forEach(
            (orbit, index) => {

                const baseOpacity =
                    index === 0
                        ? 0.34
                        : 0.27

                orbit.material.opacity =
                    this.orbitsVisible
                        ? (
                            baseOpacity +
                            Math.sin(
                                this.elapsed * 1.4 +
                                index
                            ) * 0.025
                        )
                        : 0
            }
        )


        /*
         * Environment rotation.
         */

        if (
            this.environmentGroup
        ) {

            this.environmentGroup.rotation.y +=
                delta * 0.006
        }


        this.renderer.render(
            this.renderScene,
            this.camera
        )
    }


    /* =====================================================
       SELECTED PARTICLES
       ===================================================== */

    getSelectedParticles() {

        if (
            !this.selectedParticle
        ) {

            return []
        }


        if (
            this.selectedParticle ===
            'proton'
        ) {

            return this.protons
        }


        if (
            this.selectedParticle ===
            'neutron'
        ) {

            return this.neutrons
        }


        if (
            this.selectedParticle ===
            'electron'
        ) {

            return this.electrons
        }


        return []
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


        this.camera.aspect =
            window.innerWidth /
            window.innerHeight

        this.camera.updateProjectionMatrix()


        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        )

        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        )
    }


    /* =====================================================
       SET SCENE
       ===================================================== */

    setScene(
        scene
    ) {

        /*
         * Kept for compatibility with
         * the existing Awtaar architecture.

         * The experiment deliberately renders
         * through its own dedicated scene.
         */

        this.scene =
            scene
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


        this.destroyed =
            true

        this.active =
            false


        window.removeEventListener(
            'resize',
            this.resizeHandler
        )

        window.removeEventListener(
            'awtaar-language-change',
            this.languageHandler
        )


        /*
         * Dispose Three.js resources.
         */

        this.renderScene.traverse(
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

                    } else {

                        object.material.dispose()
                    }
                }
            }
        )


        if (
            this.renderer
        ) {

            this.renderer.dispose()

            if (
                this.renderer.domElement &&
                this.renderer.domElement.parentNode
            ) {

                this.renderer.domElement.parentNode
                    .removeChild(
                        this.renderer.domElement
                    )
            }
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
    }
}