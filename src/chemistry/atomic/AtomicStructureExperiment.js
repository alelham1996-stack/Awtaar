/* =========================================================
   AWTAAR — ATOMIC STRUCTURE EXPERIMENT
   بنية الذرة
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

        this.scene = scene
        this.parent = parent

        this.container = null

        this.atomicGroup = null
        this.nucleusGroup = null
        this.electronGroup = null
        this.orbitGroup = null

        this.protons = []
        this.neutrons = []
        this.electrons = []
        this.orbits = []

        this.elapsed = 0

        this.isVisible = false
        this.isDestroyed = false

        this.selectedParticle = null

        this.language = getLanguage()

        this.atomScale = 1

        this.createUI()
        this.createAtom()

        this.updateLanguage()

        this.hide()
    }


    /* =====================================================
       CREATE UI
       ===================================================== */

    createUI() {

        this.container =
            document.createElement('section')

        this.container.id =
            'awtaar-atomic-structure'

        this.container.className =
            'awtaar-atomic-structure'


        /* =================================================
           EXPERIMENT LAYER
           ================================================= */

        /*
         * التجربة يجب أن تكون طبقة مستقلة فوق
         * جميع واجهات المنصة والعالم.
         */

        this.container.style.position =
            'fixed'

        this.container.style.top =
            '0'

        this.container.style.right =
            '0'

        this.container.style.bottom =
            '0'

        this.container.style.left =
            '0'

        this.container.style.width =
            '100vw'

        this.container.style.height =
            '100vh'

        this.container.style.zIndex =
            '20000'


        /* =================================================
           TOP BAR
           ================================================= */

        const topBar =
            document.createElement('div')

        topBar.className =
            'awtaar-atomic-topbar'


        /* =================================================
           TITLE
           ================================================= */

        this.titleElement =
            document.createElement('h1')

        this.titleElement.className =
            'awtaar-atomic-title'

        topBar.appendChild(
            this.titleElement
        )


        /* =================================================
           BACK BUTTON
           ================================================= */

        this.backButton =
            document.createElement('button')

        this.backButton.type =
            'button'

        this.backButton.className =
            'awtaar-atomic-back'

        this.backButton.addEventListener(
            'click',
            () => this.returnToWorld()
        )

        topBar.appendChild(
            this.backButton
        )


        this.container.appendChild(
            topBar
        )


        /* =================================================
           INTRO
           ================================================= */

        this.introPanel =
            document.createElement('div')

        this.introPanel.className =
            'awtaar-atomic-intro'


        this.descriptionElement =
            document.createElement('p')

        this.descriptionElement.className =
            'awtaar-atomic-description'

        this.introPanel.appendChild(
            this.descriptionElement
        )


        this.container.appendChild(
            this.introPanel
        )


        /* =================================================
           INFORMATION PANEL
           ================================================= */

        this.infoPanel =
            document.createElement('div')

        this.infoPanel.className =
            'awtaar-atomic-info'


        this.infoTitle =
            document.createElement('div')

        this.infoTitle.className =
            'awtaar-atomic-info-title'

        this.infoPanel.appendChild(
            this.infoTitle
        )


        this.infoDescription =
            document.createElement('div')

        this.infoDescription.className =
            'awtaar-atomic-info-description'

        this.infoPanel.appendChild(
            this.infoDescription
        )


        this.infoPanel.style.opacity =
            '0'

        this.container.appendChild(
            this.infoPanel
        )


        /* =================================================
           LEGEND
           ================================================= */

        this.legend =
            document.createElement('div')

        this.legend.className =
            'awtaar-atomic-legend'


        this.protonLegend =
            this.createLegendItem(
                'proton',
                'atomicStructure.proton'
            )

        this.neutronLegend =
            this.createLegendItem(
                'neutron',
                'atomicStructure.neutron'
            )

        this.electronLegend =
            this.createLegendItem(
                'electron',
                'atomicStructure.electron'
            )


        this.container.appendChild(
            this.legend
        )


        /* =================================================
           CONTROL BUTTON
           ================================================= */

        this.controlPanel =
            document.createElement('div')

        this.controlPanel.className =
            'awtaar-atomic-controls'


        this.resetButton =
            document.createElement('button')

        this.resetButton.type =
            'button'

        this.resetButton.className =
            'awtaar-atomic-control'

        this.resetButton.addEventListener(
            'click',
            () => this.resetAtom()
        )


        this.resetButtonText =
            document.createElement('span')

        this.resetButton.appendChild(
            this.resetButtonText
        )


        this.controlPanel.appendChild(
            this.resetButton
        )

        this.container.appendChild(
            this.controlPanel
        )


        /* =================================================
           BODY
           ================================================= */

        document.body.appendChild(
            this.container
        )
    }


    /* =====================================================
       LEGEND ITEM
       ===================================================== */

    createLegendItem(
        type,
        translationKey
    ) {

        const item =
            document.createElement('div')

        item.className =
            `awtaar-atomic-legend-item ${type}`


        const dot =
            document.createElement('span')

        dot.className =
            'awtaar-atomic-legend-dot'

        item.appendChild(
            dot
        )


        const label =
            document.createElement('span')

        label.className =
            'awtaar-atomic-legend-label'

        label.dataset.translationKey =
            translationKey

        item.appendChild(
            label
        )


        this.legend.appendChild(
            item
        )

        return label
    }


    /* =====================================================
       CREATE ATOM
       ===================================================== */

    createAtom() {

        if (!this.scene)
            return


        this.atomicGroup =
            new THREE.Group()

        this.atomicGroup.name =
            'AwtaarAtomicStructure'


        this.atomicGroup.position.set(
            0,
            0,
            0
        )


        /* =================================================
           ORBITS
           ================================================= */

        this.createOrbits()


        /* =================================================
           NUCLEUS
           ================================================= */

        this.nucleusGroup =
            new THREE.Group()

        this.nucleusGroup.name =
            'AtomicNucleus'

        this.atomicGroup.add(
            this.nucleusGroup
        )


        this.createNucleus()


        /* =================================================
           ELECTRONS
           ================================================= */

        this.electronGroup =
            new THREE.Group()

        this.electronGroup.name =
            'AtomicElectrons'

        this.atomicGroup.add(
            this.electronGroup
        )


        this.createElectrons()


        this.scene.add(
            this.atomicGroup
        )


        this.atomicGroup.visible =
            false
    }


    /* =====================================================
       ORBITS
       ===================================================== */

    createOrbits() {

        this.orbitGroup =
            new THREE.Group()

        this.orbitGroup.name =
            'AtomicOrbits'

        this.atomicGroup.add(
            this.orbitGroup
        )


        const orbitData = [
            {
                radius: 2.5,
                tilt: 0.0
            },
            {
                radius: 3.55,
                tilt: 0.35
            },
            {
                radius: 4.55,
                tilt: -0.3
            }
        ]


        orbitData.forEach(
            (data, index) => {

                const curve =
                    new THREE.EllipseCurve(
                        0,
                        0,
                        data.radius,
                        data.radius * 0.72,
                        0,
                        Math.PI * 2,
                        false,
                        0
                    )


                const points =
                    curve.getPoints(160)


                const geometry =
                    new THREE.BufferGeometry()
                        .setFromPoints(points)


                const material =
                    new THREE.LineBasicMaterial({
                        color: 0x5f7cff,
                        transparent: true,
                        opacity:
                            index === 0
                                ? 0.30
                                : 0.18,
                        depthWrite: false
                    })


                const orbit =
                    new THREE.LineLoop(
                        geometry,
                        material
                    )


                orbit.rotation.x =
                    data.tilt

                orbit.rotation.y =
                    index * 0.42


                orbit.userData.baseOpacity =
                    material.opacity


                this.orbitGroup.add(
                    orbit
                )

                this.orbits.push(
                    orbit
                )
            }
        )
    }


    /* =====================================================
       NUCLEUS
       ===================================================== */

    createNucleus() {

        const protonGeometry =
            new THREE.SphereGeometry(
                0.43,
                24,
                24
            )


        const neutronGeometry =
            new THREE.SphereGeometry(
                0.43,
                24,
                24
            )


        const protonMaterial =
            new THREE.MeshStandardMaterial({
                color: 0xc9a24b,
                emissive: 0x5a4210,
                emissiveIntensity: 0.7,
                roughness: 0.28,
                metalness: 0.45
            })


        const neutronMaterial =
            new THREE.MeshStandardMaterial({
                color: 0xb8bfd4,
                emissive: 0x31374a,
                emissiveIntensity: 0.55,
                roughness: 0.32,
                metalness: 0.28
            })


        const particles = [
            {
                type: 'proton',
                position: [-0.48, 0.22, 0.10]
            },
            {
                type: 'proton',
                position: [0.48, -0.18, 0.12]
            },
            {
                type: 'proton',
                position: [0.02, 0.52, -0.16]
            },
            {
                type: 'proton',
                position: [-0.08, -0.52, -0.12]
            },
            {
                type: 'neutron',
                position: [-0.50, -0.22, -0.18]
            },
            {
                type: 'neutron',
                position: [0.45, 0.20, -0.20]
            },
            {
                type: 'neutron',
                position: [0.18, 0.04, 0.48]
            },
            {
                type: 'neutron',
                position: [-0.16, 0.00, -0.48]
            }
        ]


        particles.forEach(
            particle => {

                const isProton =
                    particle.type === 'proton'


                const mesh =
                    new THREE.Mesh(
                        isProton
                            ? protonGeometry
                            : neutronGeometry,
                        isProton
                            ? protonMaterial
                            : neutronMaterial
                    )


                mesh.position.set(
                    particle.position[0],
                    particle.position[1],
                    particle.position[2]
                )


                mesh.userData.type =
                    particle.type

                mesh.userData.basePosition =
                    mesh.position.clone()


                mesh.userData.phase =
                    Math.random() * Math.PI * 2


                mesh.userData.amplitude =
                    0.035 +
                    Math.random() * 0.035


                mesh.userData.baseScale =
                    1


                this.nucleusGroup.add(
                    mesh
                )


                if (isProton)
                    this.protons.push(mesh)
                else
                    this.neutrons.push(mesh)
            }
        )


        const nucleusGlow =
            new THREE.PointLight(
                0xc9a24b,
                1.8,
                7
            )

        nucleusGlow.position.set(
            0,
            0,
            0
        )

        this.nucleusGroup.add(
            nucleusGlow
        )
    }


    /* =====================================================
       ELECTRONS
       ===================================================== */

    createElectrons() {

        const geometry =
            new THREE.SphereGeometry(
                0.16,
                20,
                20
            )


        const material =
            new THREE.MeshBasicMaterial({
                color: 0x8fb6ff,
                transparent: true,
                opacity: 0.98
            })


        const electronData = [
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
            {
                orbit: 1,
                angle: 0,
                speed: 0.82
            },
            {
                orbit: 1,
                angle: Math.PI,
                speed: 0.82
            },
            {
                orbit: 1,
                angle: Math.PI * 0.5,
                speed: 0.82
            },
            {
                orbit: 1,
                angle: Math.PI * 1.5,
                speed: 0.82
            },
            {
                orbit: 2,
                angle: 0,
                speed: 0.58
            },
            {
                orbit: 2,
                angle: Math.PI,
                speed: 0.58
            }
        ]


        electronData.forEach(
            data => {

                const electron =
                    new THREE.Mesh(
                        geometry,
                        material
                    )


                electron.userData.orbit =
                    data.orbit

                electron.userData.angle =
                    data.angle

                electron.userData.speed =
                    data.speed

                electron.userData.phase =
                    Math.random() * Math.PI * 2


                this.electronGroup.add(
                    electron
                )

                this.electrons.push(
                    electron
                )
            }
        )
    }


    /* =====================================================
       UPDATE
       ===================================================== */

    update(delta = 0.016) {

        if (
            this.isDestroyed ||
            !this.atomicGroup ||
            !this.isVisible
        )
            return


        const safeDelta =
            Math.min(
                Math.max(delta, 0.001),
                0.05
            )


        this.elapsed +=
            safeDelta


        /* =================================================
           NUCLEUS MOTION
           ================================================= */

        const nucleusParticles = [
            ...this.protons,
            ...this.neutrons
        ]


        nucleusParticles.forEach(
            particle => {

                const phase =
                    particle.userData.phase

                const amplitude =
                    particle.userData.amplitude


                particle.position.x =
                    particle.userData.basePosition.x +
                    Math.sin(
                        this.elapsed * 1.5 +
                        phase
                    ) *
                    amplitude


                particle.position.y =
                    particle.userData.basePosition.y +
                    Math.cos(
                        this.elapsed * 1.2 +
                        phase
                    ) *
                    amplitude


                particle.position.z =
                    particle.userData.basePosition.z +
                    Math.sin(
                        this.elapsed * 1.1 +
                        phase
                    ) *
                    amplitude
            }
        )


        /* =================================================
           ELECTRONS
           ================================================= */

        this.electrons.forEach(
            electron => {

                const orbitIndex =
                    electron.userData.orbit

                const orbit =
                    this.orbits[orbitIndex]

                if (!orbit)
                    return


                const radius =
                    2.5 +
                    orbitIndex * 1.05


                const verticalScale =
                    0.72


                const angle =
                    electron.userData.angle +
                    this.elapsed *
                    electron.userData.speed


                const x =
                    Math.cos(angle) *
                    radius


                const z =
                    Math.sin(angle) *
                    radius


                const y =
                    Math.sin(angle) *
                    radius *
                    verticalScale *
                    Math.sin(
                        orbit.rotation.x +
                        0.8
                    )


                electron.position.set(
                    x,
                    y,
                    z
                )


                const pulse =
                    1 +
                    Math.sin(
                        this.elapsed * 4 +
                        electron.userData.phase
                    ) *
                    0.14


                electron.scale.setScalar(
                    pulse
                )
            }
        )


        /* =================================================
           ORBIT PULSE
           ================================================= */

        this.orbits.forEach(
            (orbit, index) => {

                const material =
                    orbit.material

                material.opacity =
                    orbit.userData.baseOpacity +
                    Math.sin(
                        this.elapsed * 1.4 +
                        index
                    ) *
                    0.035
            }
        )


        /* =================================================
           SLOW ATOM ROTATION
           ================================================= */

        this.atomicGroup.rotation.y =
            Math.sin(
                this.elapsed * 0.15
            ) *
            0.08


        this.atomicGroup.rotation.x =
            Math.sin(
                this.elapsed * 0.11
            ) *
            0.025
    }


    /* =====================================================
       SHOW
       ===================================================== */

    show() {

        if (this.isDestroyed)
            return


        this.isVisible = true


        if (this.atomicGroup)
            this.atomicGroup.visible =
                true


        if (this.container) {

            this.container.style.visibility =
                'visible'

            this.container.style.pointerEvents =
                'auto'


            /*
             * نضمن بقاء التجربة فوق واجهات المنصة
             * حتى لو قامت واجهة أخرى بتغيير z-index.
             */

            this.container.style.zIndex =
                '20000'


            requestAnimationFrame(
                () => {

                    if (!this.container)
                        return

                    this.container.style.opacity =
                        '1'
                }
            )
        }
    }


    /* =====================================================
       HIDE
       ===================================================== */

    hide() {

        this.isVisible = false


        if (this.atomicGroup)
            this.atomicGroup.visible =
                false


        if (this.container) {

            this.container.style.opacity =
                '0'

            this.container.style.pointerEvents =
                'none'


            window.setTimeout(
                () => {

                    if (
                        this.container &&
                        !this.isVisible
                    ) {

                        this.container.style.visibility =
                            'hidden'
                    }

                },
                550
            )
        }
    }


    /* =====================================================
       RETURN TO CHEMISTRY WORLD
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
       RESET
       ===================================================== */

    resetAtom() {

        this.elapsed = 0

        this.selectedParticle = null

        this.infoPanel.style.opacity =
            '0'


        this.electrons.forEach(
            electron => {

                electron.scale.setScalar(
                    1
                )
            }
        )
    }


    /* =====================================================
       LANGUAGE
       ===================================================== */

    updateLanguage() {

        this.language =
            getLanguage()


        if (this.titleElement) {

            this.titleElement.textContent =
                t(
                    'chemistryWorld.experiments.atomicStructure.title'
                )
        }


        if (this.descriptionElement) {

            this.descriptionElement.textContent =
                t(
                    'chemistryWorld.experiments.atomicStructure.description'
                )
        }


        if (this.backButton) {

            this.backButton.textContent =
                t(
                    'chemistryWorld.back'
                )
        }


        if (this.resetButtonText) {

            this.resetButtonText.textContent =
                this.language === 'ar'
                    ? 'إعادة التجربة'
                    : 'Reset Experiment'
        }


        if (this.infoTitle) {

            this.infoTitle.textContent =
                this.language === 'ar'
                    ? 'الذرة'
                    : 'Atom'
        }


        if (this.infoDescription) {

            this.infoDescription.textContent =
                this.language === 'ar'
                    ? 'الذرة هي الوحدة الأساسية للمادة، وتتكون من نواة تحتوي على البروتونات والنيوترونات، وتحيط بها الإلكترونات.'
                    : 'An atom is the basic unit of matter. It contains a nucleus made of protons and neutrons, surrounded by electrons.'
        }


        const protonLabel =
            this.legend.querySelector(
                '.proton .awtaar-atomic-legend-label'
            )

        const neutronLabel =
            this.legend.querySelector(
                '.neutron .awtaar-atomic-legend-label'
            )

        const electronLabel =
            this.legend.querySelector(
                '.electron .awtaar-atomic-legend-label'
            )


        if (protonLabel) {

            protonLabel.textContent =
                this.language === 'ar'
                    ? 'بروتون'
                    : 'Proton'
        }


        if (neutronLabel) {

            neutronLabel.textContent =
                this.language === 'ar'
                    ? 'نيوترون'
                    : 'Neutron'
        }


        if (electronLabel) {

            electronLabel.textContent =
                this.language === 'ar'
                    ? 'إلكترون'
                    : 'Electron'
        }


        if (this.container) {

            this.container.dir =
                this.language === 'ar'
                    ? 'rtl'
                    : 'ltr'
        }
    }


    /* =====================================================
       SET SCENE
       ===================================================== */

    setScene(scene) {

        if (this.scene === scene)
            return


        if (
            this.atomicGroup &&
            this.scene
        ) {

            this.scene.remove(
                this.atomicGroup
            )
        }


        this.scene =
            scene


        if (!this.scene)
            return


        this.protons = []
        this.neutrons = []
        this.electrons = []
        this.orbits = []


        this.nucleusGroup = null
        this.electronGroup = null
        this.orbitGroup = null


        this.createAtom()


        if (
            !this.isVisible &&
            this.atomicGroup
        ) {

            this.atomicGroup.visible =
                false
        }
    }


    /* =====================================================
       DESTROY
       ===================================================== */

    destroy() {

        if (this.isDestroyed)
            return


        this.isDestroyed = true
        this.isVisible = false


        if (
            this.scene &&
            this.atomicGroup
        ) {

            this.scene.remove(
                this.atomicGroup
            )
        }


        if (this.atomicGroup) {

            this.atomicGroup.traverse(
                object => {

                    if (
                        object.geometry &&
                        typeof object.geometry.dispose ===
                        'function'
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
                                        typeof material.dispose ===
                                        'function'
                                    ) {

                                        material.dispose()
                                    }
                                }
                            )

                        } else if (
                            typeof object.material.dispose ===
                            'function'
                        ) {

                            object.material.dispose()
                        }
                    }
                }
            )
        }


        if (this.container) {

            this.container.remove()

            this.container = null
        }


        this.atomicGroup = null
        this.nucleusGroup = null
        this.electronGroup = null
        this.orbitGroup = null

        this.protons = []
        this.neutrons = []
        this.electrons = []
        this.orbits = []

        this.scene = null
        this.parent = null
    }
}