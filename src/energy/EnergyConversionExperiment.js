import * as THREE from 'three'
import { t } from '../locales/i18n.js'


/* =========================================================
   AWTAAR — ENERGY CONVERSION EXPERIMENT
   =========================================================

   Educational model:

   CHEMICAL ENERGY
          ↓
       BATTERY
          ↓
   ELECTRICAL ENERGY
          ↓
        WIRE
          ↓
      LIGHT BULB
          ↓
     LIGHT + HEAT

   Visual principle:

   The transformation must be visually understandable.

   The bulb does NOT turn on immediately.

   Instead:

   1. Battery contains chemical energy.
   2. Electrical energy begins moving through the circuit.
   3. Energy reaches the bulb.
   4. Bulb filament gradually heats up.
   5. Light appears gradually.
   6. Heat becomes visible around the bulb.
   7. The bulb settles into a stable glowing state.

   ========================================================= */


export default class EnergyConversionExperiment {


    constructor(
        options = {}
    ) {


        /* =====================================================
           REFERENCES
           ===================================================== */

        this.scene =
            options.scene || null

        this.parent =
            options.parent || null


        /* =====================================================
           STATE
           ===================================================== */

        this.active =
            false

        this.paused =
            false

        this.time =
            0

        this.conversionSpeed =
            1


        /* =====================================================
           ENERGY MODEL
           ===================================================== */

        this.inputEnergy =
            100

        this.conversionEfficiency =
            0.82

        this.outputEnergy =
            this.inputEnergy *
            this.conversionEfficiency


        /* =====================================================
           MAIN GROUP
           ===================================================== */

        this.group =
            new THREE.Group()

        this.group.name =
            'AwtaarEnergyConversion'


        /* =====================================================
           SUB GROUPS
           ===================================================== */

        this.batteryGroup =
            new THREE.Group()

        this.wireGroup =
            new THREE.Group()

        this.bulbGroup =
            new THREE.Group()

        this.energyGroup =
            new THREE.Group()

        this.lightGroup =
            new THREE.Group()

        this.heatGroup =
            new THREE.Group()

        this.labelGroup =
            new THREE.Group()


        this.group.add(
            this.batteryGroup
        )

        this.group.add(
            this.wireGroup
        )

        this.group.add(
            this.bulbGroup
        )

        this.group.add(
            this.energyGroup
        )

        this.group.add(
            this.lightGroup
        )

        this.group.add(
            this.heatGroup
        )

        this.group.add(
            this.labelGroup
        )


        /* =====================================================
           VISUAL SETTINGS
           ===================================================== */

        this.worldScale =
            1


        this.batteryPosition =
            new THREE.Vector3(
                -5.2,
                0,
                0
            )


        this.bulbPosition =
            new THREE.Vector3(
                4.7,
                0,
                0
            )


        /* =====================================================
           ENERGY PARTICLES
           ===================================================== */

        this.energyParticles =
            []

        this.maxEnergyParticles =
            32

        this.particleProgress =
            0


        /* =====================================================
           LIGHT PARTICLES
           ===================================================== */

        this.lightParticles =
            []

        this.maxLightParticles =
            24


        /* =====================================================
           HEAT PARTICLES
           ===================================================== */

        this.heatParticles =
            []

        this.maxHeatParticles =
            18


        /* =====================================================
           BULB STATE
           ===================================================== */

        /*
         * bulbGlow:
         *
         * 0 = completely off
         * 1 = full brightness
         */

        this.bulbGlow =
            0


        /*
         * bulbActivation:
         *
         * Controls the gradual transformation
         * from electrical energy to light.
         */

        this.bulbActivation =
            0


        /*
         * How long it takes before the bulb
         * begins visibly responding.
         */

        this.bulbActivationDelay =
            1.15


        /*
         * How long the bulb takes to reach
         * approximately full brightness.
         */

        this.bulbActivationDuration =
            3.8


        /*
         * Heat intensity follows the bulb,
         * but remains slightly delayed.
         */

        this.heatIntensity =
            0


        /* =====================================================
           TEMPORARY OBJECT REFERENCES
           ===================================================== */

        this.batteryBody =
            null

        this.batteryPositive =
            null

        this.batteryNegative =
            null

        this.batteryCore =
            null

        this.bulbGlass =
            null

        this.bulbFilament =
            null

        this.bulbGlowMesh =
            null

        this.bulbHalo =
            null

        this.bulbLight =
            null


        /* =====================================================
           CLOCK
           ===================================================== */

        this.clock =
            new THREE.Clock()


        /* =====================================================
           BUILD
           ===================================================== */

        this.buildExperiment()

    }


    /* =========================================================
       BUILD EXPERIMENT
       ========================================================= */

    buildExperiment() {

        this.createBattery()

        this.createCircuit()

        this.createBulb()

        this.createEnergyParticles()

        this.createLightParticles()

        this.createHeatParticles()

        this.createLabels()

        this.createAmbientGlow()


        this.group.position.set(
            0,
            0,
            0
        )


        this.group.rotation.set(
            0,
            0,
            0
        )

    }


    /* =========================================================
       BATTERY
       ========================================================= */

    createBattery() {

        const battery =
            new THREE.Group()


        battery.position.copy(
            this.batteryPosition
        )


        /* =====================================================
           BODY
           ===================================================== */

        const bodyGeometry =
            new THREE.CapsuleGeometry(
                0.85,
                1.65,
                8,
                24
            )


        const bodyMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0x34343d,

                metalness:
                    0.55,

                roughness:
                    0.34,

                emissive:
                    0x08080c,

                emissiveIntensity:
                    0.25

            })


        this.batteryBody =
            new THREE.Mesh(
                bodyGeometry,
                bodyMaterial
            )


        this.batteryBody.rotation.z =
            Math.PI / 2


        battery.add(
            this.batteryBody
        )


        /* =====================================================
           POSITIVE TERMINAL
           ===================================================== */

        const terminalGeometry =
            new THREE.CylinderGeometry(
                0.23,
                0.23,
                0.24,
                24
            )


        const positiveMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0xffc95c,

                emissive:
                    0xffa52c,

                emissiveIntensity:
                    0.55,

                metalness:
                    0.5,

                roughness:
                    0.28

            })


        this.batteryPositive =
            new THREE.Mesh(
                terminalGeometry,
                positiveMaterial
            )


        this.batteryPositive.rotation.z =
            Math.PI / 2


        this.batteryPositive.position.x =
            1.02


        battery.add(
            this.batteryPositive
        )


        /* =====================================================
           NEGATIVE TERMINAL
           ===================================================== */

        const negativeMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0x8f9099,

                metalness:
                    0.5,

                roughness:
                    0.35

            })


        this.batteryNegative =
            new THREE.Mesh(
                terminalGeometry,
                negativeMaterial
            )


        this.batteryNegative.rotation.z =
            Math.PI / 2


        this.batteryNegative.position.x =
            -1.02


        battery.add(
            this.batteryNegative
        )


        /* =====================================================
           BATTERY INNER GLOW
           ===================================================== */

        const glowGeometry =
            new THREE.SphereGeometry(
                0.66,
                24,
                24
            )


        const glowMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0xffbd55,

                transparent:
                    true,

                opacity:
                    0.08,

                blending:
                    THREE.AdditiveBlending,

                depthWrite:
                    false

            })


        const glow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            )


        battery.add(
            glow
        )


        this.batteryGroup.add(
            battery
        )


        /* =====================================================
           BATTERY ENERGY CORE
           ===================================================== */

        const coreGeometry =
            new THREE.SphereGeometry(
                0.22,
                20,
                20
            )


        const coreMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0xffcf6a

            })


        const core =
            new THREE.Mesh(
                coreGeometry,
                coreMaterial
            )


        battery.add(
            core
        )


        this.batteryCore =
            core

    }


    /* =========================================================
       CIRCUIT
       ========================================================= */

    createCircuit() {

        const pointsTop = [

            new THREE.Vector3(
                -4.15,
                0.65,
                0
            ),

            new THREE.Vector3(
                -2.6,
                0.65,
                0
            ),

            new THREE.Vector3(
                -1.5,
                1.25,
                0
            ),

            new THREE.Vector3(
                1.2,
                1.25,
                0
            ),

            new THREE.Vector3(
                2.5,
                0.75,
                0
            ),

            new THREE.Vector3(
                4.0,
                0.75,
                0
            )

        ]


        const pointsBottom = [

            new THREE.Vector3(
                4.0,
                -0.75,
                0
            ),

            new THREE.Vector3(
                2.5,
                -0.75,
                0
            ),

            new THREE.Vector3(
                1.2,
                -1.25,
                0
            ),

            new THREE.Vector3(
                -1.5,
                -1.25,
                0
            ),

            new THREE.Vector3(
                -2.6,
                -0.65,
                0
            ),

            new THREE.Vector3(
                -4.15,
                -0.65,
                0
            )

        ]


        this.topCurve =
            new THREE.CatmullRomCurve3(
                pointsTop
            )


        this.bottomCurve =
            new THREE.CatmullRomCurve3(
                pointsBottom
            )


        this.createWire(
            this.topCurve
        )


        this.createWire(
            this.bottomCurve
        )


        this.createConnectionPoint(
            -4.15,
            0.65
        )


        this.createConnectionPoint(
            -4.15,
            -0.65
        )


        this.createConnectionPoint(
            4.0,
            0.75
        )


        this.createConnectionPoint(
            4.0,
            -0.75
        )

    }


    /* =========================================================
       CREATE WIRE
       ========================================================= */

    createWire(
        curve
    ) {

        const geometry =
            new THREE.TubeGeometry(
                curve,
                80,
                0.045,
                10,
                false
            )


        const material =
            new THREE.MeshStandardMaterial({

                color:
                    0x6d6e78,

                metalness:
                    0.65,

                roughness:
                    0.3,

                emissive:
                    0x15151d,

                emissiveIntensity:
                    0.3

            })


        const wire =
            new THREE.Mesh(
                geometry,
                material
            )


        this.wireGroup.add(
            wire
        )

    }


    /* =========================================================
       CONNECTION POINT
       ========================================================= */

    createConnectionPoint(
        x,
        y
    ) {

        const geometry =
            new THREE.SphereGeometry(
                0.09,
                16,
                16
            )


        const material =
            new THREE.MeshBasicMaterial({

                color:
                    0xffd16a

            })


        const point =
            new THREE.Mesh(
                geometry,
                material
            )


        point.position.set(
            x,
            y,
            0
        )


        this.wireGroup.add(
            point
        )

    }


    /* =========================================================
       BULB
       ========================================================= */

    createBulb() {

        const bulb =
            new THREE.Group()


        bulb.position.copy(
            this.bulbPosition
        )


        /* =====================================================
           SOCKET
           ===================================================== */

        const socketGeometry =
            new THREE.CylinderGeometry(
                0.55,
                0.62,
                0.65,
                32
            )


        const socketMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0x42434d,

                metalness:
                    0.7,

                roughness:
                    0.3

            })


        const socket =
            new THREE.Mesh(
                socketGeometry,
                socketMaterial
            )


        socket.rotation.z =
            Math.PI / 2


        socket.position.x =
            0.25


        bulb.add(
            socket
        )


        /* =====================================================
           GLASS
           ===================================================== */

        const glassGeometry =
            new THREE.SphereGeometry(
                1.05,
                40,
                40
            )


        const glassMaterial =
            new THREE.MeshPhysicalMaterial({

                color:
                    0xfff2c7,

                transparent:
                    true,

                opacity:
                    0.22,

                transmission:
                    0.65,

                roughness:
                    0.12,

                metalness:
                    0,

                emissive:
                    0xffa82d,

                emissiveIntensity:
                    0.02,

                side:
                    THREE.DoubleSide

            })


        this.bulbGlass =
            new THREE.Mesh(
                glassGeometry,
                glassMaterial
            )


        this.bulbGlass.position.x =
            -0.55


        bulb.add(
            this.bulbGlass
        )


        /* =====================================================
           FILAMENT
           ===================================================== */

        const filamentCurve =
            new THREE.CatmullRomCurve3([

                new THREE.Vector3(
                    -0.18,
                    -0.28,
                    0
                ),

                new THREE.Vector3(
                    -0.42,
                    0.28,
                    0
                ),

                new THREE.Vector3(
                    -0.66,
                    -0.28,
                    0
                ),

                new THREE.Vector3(
                    -0.9,
                    0.28,
                    0
                )

            ])


        const filamentGeometry =
            new THREE.TubeGeometry(
                filamentCurve,
                30,
                0.055,
                10,
                false
            )


        const filamentMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0x553817

            })


        this.bulbFilament =
            new THREE.Mesh(
                filamentGeometry,
                filamentMaterial
            )


        bulb.add(
            this.bulbFilament
        )


        /* =====================================================
           BULB GLOW
           ===================================================== */

        const glowGeometry =
            new THREE.SphereGeometry(
                1.45,
                32,
                32
            )


        const glowMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0xffb52e,

                transparent:
                    true,

                opacity:
                    0,

                blending:
                    THREE.AdditiveBlending,

                depthWrite:
                    false

            })


        this.bulbGlowMesh =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            )


        this.bulbGlowMesh.position.x =
            -0.55


        bulb.add(
            this.bulbGlowMesh
        )


        /* =====================================================
           LIGHT
           ===================================================== */

        this.bulbLight =
            new THREE.PointLight(
                0xffc75b,
                0,
                8,
                2
            )


        this.bulbLight.position.set(
            -0.55,
            0,
            0.35
        )


        bulb.add(
            this.bulbLight
        )


        /* =====================================================
           BULB HALO
           ===================================================== */

        const haloGeometry =
            new THREE.SphereGeometry(
                1.8,
                32,
                32
            )


        const haloMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0xffc75b,

                transparent:
                    true,

                opacity:
                    0,

                blending:
                    THREE.AdditiveBlending,

                depthWrite:
                    false

            })


        this.bulbHalo =
            new THREE.Mesh(
                haloGeometry,
                haloMaterial
            )


        this.bulbHalo.position.x =
            -0.55


        bulb.add(
            this.bulbHalo
        )


        this.bulbGroup.add(
            bulb
        )

    }


    /* =========================================================
       ENERGY PARTICLES
       ========================================================= */

    createEnergyParticles() {

        for (
            let i = 0;
            i < this.maxEnergyParticles;
            i++
        ) {

            const geometry =
                new THREE.SphereGeometry(
                    0.075,
                    12,
                    12
                )


            const material =
                new THREE.MeshBasicMaterial({

                    color:
                        0xffcf69,

                    transparent:
                        true,

                    opacity:
                        0.95

                })


            const particle =
                new THREE.Mesh(
                    geometry,
                    material
                )


            particle.userData.progress =
                i /
                this.maxEnergyParticles


            particle.userData.offset =
                Math.random() *
                0.08


            particle.userData.phase =
                Math.random() *
                Math.PI *
                2


            this.energyGroup.add(
                particle
            )


            this.energyParticles.push(
                particle
            )

        }

    }


    /* =========================================================
       LIGHT PARTICLES
       ========================================================= */

    createLightParticles() {

        for (
            let i = 0;
            i < this.maxLightParticles;
            i++
        ) {

            const geometry =
                new THREE.SphereGeometry(
                    0.045,
                    10,
                    10
                )


            const material =
                new THREE.MeshBasicMaterial({

                    color:
                        0xffe6a0,

                    transparent:
                        true,

                    opacity:
                        0

                })


            const particle =
                new THREE.Mesh(
                    geometry,
                    material
                )


            particle.userData.angle =
                Math.random() *
                Math.PI *
                2


            particle.userData.radius =
                0.8 +
                Math.random() *
                1.6


            particle.userData.speed =
                0.25 +
                Math.random() *
                0.45


            particle.userData.height =
                (
                    Math.random() -
                    0.5
                ) *
                0.8


            this.lightGroup.add(
                particle
            )


            this.lightParticles.push(
                particle
            )

        }

    }


    /* =========================================================
       HEAT PARTICLES
       ========================================================= */

    createHeatParticles() {

        for (
            let i = 0;
            i < this.maxHeatParticles;
            i++
        ) {

            const geometry =
                new THREE.SphereGeometry(
                    0.035,
                    10,
                    10
                )


            const material =
                new THREE.MeshBasicMaterial({

                    color:
                        0xff8b4a,

                    transparent:
                        true,

                    opacity:
                        0

                })


            const particle =
                new THREE.Mesh(
                    geometry,
                    material
                )


            particle.userData.angle =
                Math.random() *
                Math.PI *
                2


            particle.userData.radius =
                0.65 +
                Math.random() *
                0.9


            particle.userData.height =
                Math.random()


            particle.userData.speed =
                0.2 +
                Math.random() *
                0.35


            this.heatGroup.add(
                particle
            )


            this.heatParticles.push(
                particle
            )

        }

    }


    /* =========================================================
       LABELS
       ========================================================= */

    createLabels() {

        /* =====================================================
           CHEMICAL ENERGY
           ===================================================== */

        const batteryLabel =
            this.createTextSprite(
                t(
                    'energyWorld.conversion.labels.chemicalEnergy'
                ),
                0.64
            )


        batteryLabel.position.set(
            -5.2,
            -1.65,
            0.2
        )


        this.labelGroup.add(
            batteryLabel
        )


        /* =====================================================
           ELECTRICAL ENERGY
           ===================================================== */

        const electricLabel =
            this.createTextSprite(
                t(
                    'energyWorld.conversion.labels.electricalEnergy'
                ),
                0.62
            )


        electricLabel.position.set(
            0,
            1.72,
            0.2
        )


        this.labelGroup.add(
            electricLabel
        )


        /* =====================================================
           LIGHT BULB
           ===================================================== */

        const bulbLabel =
            this.createTextSprite(
                t(
                    'energyWorld.conversion.labels.electricBulb'
                ),
                0.64
            )


        bulbLabel.position.set(
            4.7,
            -1.7,
            0.2
        )


        this.labelGroup.add(
            bulbLabel
        )


        /* =====================================================
           OUTPUT
           ===================================================== */

        const lightLabel =
            this.createTextSprite(
                t(
                    'energyWorld.conversion.labels.lightHeat'
                ),
                0.58
            )


        lightLabel.position.set(
            5.65,
            1.75,
            0.2
        )


        this.labelGroup.add(
            lightLabel
        )

    }


    /* =========================================================
       TEXT SPRITE
       =========================================================

       The labels are rendered directly inside Three.js.

       Increased:

       - Canvas resolution
       - Font size
       - Font weight
       - Sprite scale
       - Text opacity
       - Shadow clarity

       This makes Arabic labels significantly clearer
       without changing the actual experiment geometry.

       ========================================================= */

    createTextSprite(
        text,
        scale = 0.45
    ) {

        const canvas =
            document.createElement(
                'canvas'
            )


        /*
         * Higher resolution prevents Arabic
         * characters from becoming blurry.
         */

        canvas.width =
            1024

        canvas.height =
            256


        const context =
            canvas.getContext(
                '2d'
            )


        context.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        )


        /*
         * Larger and heavier Tajawal font.
         */

        context.font =
            '600 52px Tajawal, Arial, sans-serif'


        context.textAlign =
            'center'


        context.textBaseline =
            'middle'


        /*
         * Clear white text.
         */

        context.fillStyle =
            'rgba(255,255,255,0.96)'


        /*
         * Soft golden shadow keeps the
         * text readable against the scene.
         */

        context.shadowColor =
            'rgba(255,190,80,0.42)'


        context.shadowBlur =
            10


        context.shadowOffsetX =
            0


        context.shadowOffsetY =
            2


        context.fillText(
            text,
            canvas.width / 2,
            canvas.height / 2
        )


        /* =====================================================
           TEXTURE
           ===================================================== */

        const texture =
            new THREE.CanvasTexture(
                canvas
            )


        texture.needsUpdate =
            true


        texture.minFilter =
            THREE.LinearFilter


        texture.magFilter =
            THREE.LinearFilter


        texture.generateMipmaps =
            false


        /* =====================================================
           MATERIAL
           ===================================================== */

        const material =
            new THREE.SpriteMaterial({

                map:
                    texture,

                transparent:
                    true,

                depthTest:
                    false,

                depthWrite:
                    false

            })


        /* =====================================================
           SPRITE
           ===================================================== */

        const sprite =
            new THREE.Sprite(
                material
            )


        /*
         * Larger physical size inside
         * the Three.js world.
         */

        sprite.scale.set(
            scale * 3.4,
            scale * 0.9,
            1
        )


        /*
         * Keep labels in front of the
         * experiment visual layer.
         */

        sprite.renderOrder =
            20


        return sprite

    }


    /* =========================================================
       AMBIENT GLOW
       ========================================================= */

    createAmbientGlow() {

        const geometry =
            new THREE.SphereGeometry(
                7,
                32,
                32
            )


        const material =
            new THREE.MeshBasicMaterial({

                color:
                    0xffbd55,

                transparent:
                    true,

                opacity:
                    0.012,

                blending:
                    THREE.AdditiveBlending,

                depthWrite:
                    false

            })


        const glow =
            new THREE.Mesh(
                geometry,
                material
            )


        glow.position.set(
            0,
            0,
            -1
        )


        this.group.add(
            glow
        )

    }


    /* =========================================================
       ADD TO SCENE
       ========================================================= */

    addToScene(
        scene = null
    ) {

        if (
            scene
        ) {

            this.scene =
                scene

        }


        if (
            !this.scene
        ) {

            return

        }


        if (
            !this.group.parent
        ) {

            this.scene.add(
                this.group
            )

        }


        this.reset()

    }


    /* =========================================================
       START
       ========================================================= */

    start() {

        this.active =
            true

        this.paused =
            false

        this.clock.start()

        this.group.visible =
            true


        /*
         * Start with the bulb completely OFF.
         */

        this.bulbActivation =
            0

        this.bulbGlow =
            0

        this.heatIntensity =
            0


        this.resetEnergyParticles()

        this.resetLightParticles()

        this.resetHeatParticles()

    }


    /* =========================================================
       PAUSE
       ========================================================= */

    pause() {

        this.paused =
            true

    }


    /* =========================================================
       RESUME
       ========================================================= */

    resume() {

        this.paused =
            false

    }


    /* =========================================================
       STOP
       ========================================================= */

    stop() {

        this.active =
            false

        this.paused =
            false


        this.clock.stop()

    }


    /* =========================================================
       RESET
       ========================================================= */

    reset() {

        this.time =
            0

        this.particleProgress =
            0

        this.bulbGlow =
            0

        this.bulbActivation =
            0

        this.heatIntensity =
            0


        this.active =
            false

        this.paused =
            false


        this.resetEnergyParticles()

        this.resetLightParticles()

        this.resetHeatParticles()


        if (
            this.bulbLight
        ) {

            this.bulbLight.intensity =
                0

        }


        if (
            this.bulbGlowMesh
        ) {

            this.bulbGlowMesh.material.opacity =
                0

        }


        if (
            this.bulbHalo
        ) {

            this.bulbHalo.material.opacity =
                0

        }


        if (
            this.bulbFilament
        ) {

            this.bulbFilament.material.color.setHex(
                0x553817
            )

        }


        if (
            this.bulbGlass
        ) {

            this.bulbGlass.material.emissiveIntensity =
                0.02

        }

    }


    /* =========================================================
       RESET ENERGY PARTICLES
       ========================================================= */

    resetEnergyParticles() {

        this.energyParticles.forEach(
            (
                particle,
                index
            ) => {

                particle.userData.progress =
                    index /
                    this.maxEnergyParticles


                this.positionEnergyParticle(
                    particle
                )

            }
        )

    }


    /* =========================================================
       RESET LIGHT PARTICLES
       ========================================================= */

    resetLightParticles() {

        this.lightParticles.forEach(
            particle => {

                particle.material.opacity =
                    0

            }
        )

    }


    /* =========================================================
       RESET HEAT PARTICLES
       ========================================================= */

    resetHeatParticles() {

        this.heatParticles.forEach(
            particle => {

                particle.material.opacity =
                    0

            }
        )

    }


    /* =========================================================
       POSITION ENERGY PARTICLE
       ========================================================= */

    positionEnergyParticle(
        particle
    ) {

        const progress =
            particle.userData.progress


        let point


        if (
            progress < 0.5
        ) {

            const localProgress =
                progress * 2


            point =
                this.topCurve.getPointAt(
                    localProgress
                )

        }
        else {

            const localProgress =
                (
                    progress -
                    0.5
                ) *
                2


            point =
                this.bottomCurve.getPointAt(
                    1 -
                    localProgress
                )

        }


        particle.position.copy(
            point
        )


        particle.position.z =
            0.12


        const offset =
            Math.sin(
                this.time * 4 +
                particle.userData.phase
            ) *
            0.035


        particle.position.y +=
            offset

    }


    /* =========================================================
       UPDATE
       ========================================================= */

    update(
        delta = 0
    ) {

        if (
            !this.active ||
            this.paused
        ) {

            return

        }


        const safeDelta =
            Math.min(
                delta,
                0.05
            )


        const speed =
            this.conversionSpeed


        this.time +=
            safeDelta *
            speed


        /* =====================================================
           ENERGY FLOW
           ===================================================== */

        this.particleProgress +=
            safeDelta *
            0.075 *
            speed


        if (
            this.particleProgress >= 1
        ) {

            this.particleProgress -=
                1

        }


        this.energyParticles.forEach(
            (
                particle,
                index
            ) => {

                particle.userData.progress =
                    (
                        this.particleProgress +
                        index /
                        this.maxEnergyParticles
                    ) % 1


                this.positionEnergyParticle(
                    particle
                )

            }
        )


        /* =====================================================
           BULB RESPONSE
           ===================================================== */

        this.updateBulb(
            safeDelta
        )


        /* =====================================================
           LIGHT
           ===================================================== */

        this.updateLightParticles(
            safeDelta
        )


        /* =====================================================
           HEAT
           ===================================================== */

        this.updateHeatParticles(
            safeDelta
        )


        /* =====================================================
           BATTERY
           ===================================================== */

        this.updateBattery(
            safeDelta
        )

    }


    /* =========================================================
       UPDATE BULB
       =========================================================

       New behavior:

       The bulb starts OFF.

       First:
           electrical energy travels

       Then:
           a short delay

       Then:
           the filament gradually heats

       Finally:
           light reaches stable brightness.

       ========================================================= */

    updateBulb(
        delta
    ) {

        /* =====================================================
           ACTIVATION DELAY
           ===================================================== */

        if (
            this.time <=
            this.bulbActivationDelay
        ) {

            this.bulbActivation =
                0

        }
        else {

            const activationTime =
                this.time -
                this.bulbActivationDelay


            this.bulbActivation =
                THREE.MathUtils.clamp(
                    activationTime /
                    this.bulbActivationDuration,
                    0,
                    1
                )


            /*
             * Smoothstep makes the transition
             * visually softer and more natural.
             */

            this.bulbActivation =
                this.bulbActivation *
                this.bulbActivation *
                (
                    3 -
                    2 *
                    this.bulbActivation
                )

        }


        /* =====================================================
           TARGET GLOW
           ===================================================== */

        const stableGlow =
            0.78


        const pulse =
            Math.sin(
                this.time * 4
            ) *
            0.055


        const targetGlow =
            THREE.MathUtils.clamp(
                (
                    stableGlow +
                    pulse
                ) *
                this.bulbActivation,
                0,
                1
            )


        /* =====================================================
           SMOOTH BULB RESPONSE
           ===================================================== */

        this.bulbGlow =
            THREE.MathUtils.lerp(
                this.bulbGlow,
                targetGlow,
                delta *
                (
                    1.5 +
                    this.conversionSpeed *
                    0.5
                )
            )


        /* =====================================================
           LIGHT
           ===================================================== */

        if (
            this.bulbLight
        ) {

            this.bulbLight.intensity =
                this.bulbGlow *
                2.2

        }


        /* =====================================================
           GLOW MESH
           ===================================================== */

        if (
            this.bulbGlowMesh
        ) {

            this.bulbGlowMesh.material.opacity =
                this.bulbGlow *
                0.095

        }


        /* =====================================================
           HALO
           ===================================================== */

        if (
            this.bulbHalo
        ) {

            this.bulbHalo.material.opacity =
                this.bulbGlow *
                0.045

        }


        /* =====================================================
           FILAMENT
           ===================================================== */

        if (
            this.bulbFilament
        ) {

            const brightness =
                Math.floor(
                    45 +
                    this.bulbGlow *
                    210
                )


            const green =
                Math.floor(
                    30 +
                    this.bulbGlow *
                    190
                )


            const blue =
                Math.floor(
                    20 +
                    this.bulbGlow *
                    65
                )


            const color =
                (
                    brightness <<
                    16
                ) |
                (
                    green <<
                    8
                ) |
                blue


            this.bulbFilament.material.color.setHex(
                color
            )

        }


        /* =====================================================
           GLASS EMISSION
           ===================================================== */

        if (
            this.bulbGlass
        ) {

            this.bulbGlass.material.emissiveIntensity =
                0.02 +
                this.bulbGlow *
                0.22

        }


        /* =====================================================
           HEAT RESPONSE
           ===================================================== */

        const targetHeat =
            this.bulbGlow *
            0.82


        this.heatIntensity =
            THREE.MathUtils.lerp(
                this.heatIntensity,
                targetHeat,
                delta *
                1.4
            )

    }


    /* =========================================================
       LIGHT PARTICLES
       ========================================================= */

    updateLightParticles(
        delta
    ) {

        this.lightParticles.forEach(
            particle => {

                particle.userData.angle +=
                    delta *
                    particle.userData.speed *
                    this.conversionSpeed


                const angle =
                    particle.userData.angle


                const radius =
                    particle.userData.radius


                particle.position.x =
                    this.bulbPosition.x +
                    -0.55 +
                    Math.cos(angle) *
                    radius


                particle.position.y =
                    Math.sin(angle) *
                    radius


                particle.position.z =
                    Math.sin(
                        angle * 2
                    ) *
                    0.35


                /*
                 * Light particles are invisible
                 * while the bulb is OFF.
                 */

                particle.material.opacity =
                    this.bulbGlow *
                    0.65

            }
        )

    }


    /* =========================================================
       HEAT PARTICLES
       ========================================================= */

    updateHeatParticles(
        delta
    ) {

        this.heatParticles.forEach(
            particle => {

                particle.userData.height +=
                    delta *
                    particle.userData.speed *
                    this.conversionSpeed


                if (
                    particle.userData.height >
                    1
                ) {

                    particle.userData.height =
                        0

                }


                const angle =
                    particle.userData.angle


                const radius =
                    particle.userData.radius


                particle.position.x =
                    this.bulbPosition.x +
                    -0.55 +
                    Math.cos(angle) *
                    radius *
                    (
                        0.4 +
                        particle.userData.height *
                        0.5
                    )


                particle.position.y =
                    particle.userData.height *
                    1.5 +
                    0.35


                particle.position.z =
                    Math.sin(angle) *
                    0.25


                /*
                 * Heat becomes visible only
                 * after the bulb starts glowing.
                 */

                particle.material.opacity =
                    (
                        0.08 +
                        this.heatIntensity *
                        0.18
                    ) *
                    (
                        1 -
                        particle.userData.height *
                        0.55
                    )

            }
        )

    }


    /* =========================================================
       BATTERY ANIMATION
       ========================================================= */

    updateBattery(
        delta
    ) {

        if (
            !this.batteryCore
        ) {

            return

        }


        const pulse =
            1 +
            Math.sin(
                this.time * 3
            ) *
            0.08


        this.batteryCore.scale.set(
            pulse,
            pulse,
            pulse
        )

    }


    /* =========================================================
       CONVERSION SPEED
       ========================================================= */

    setConversionSpeed(
        value
    ) {

        const numericValue =
            Number(
                value
            )


        if (
            !Number.isFinite(
                numericValue
            )
        ) {

            return

        }


        this.conversionSpeed =
            THREE.MathUtils.clamp(
                numericValue,
                0.1,
                3
            )

    }


    /* =========================================================
       ENERGY DATA
       ========================================================= */

    getEnergyData() {

        return {

            inputEnergy:
                this.inputEnergy,

            conversionEfficiency:
                this.conversionEfficiency,

            outputEnergy:
                this.outputEnergy

        }

    }


    /* =========================================================
       REMOVE FROM SCENE
       ========================================================= */

    removeFromScene() {

        if (
            this.group &&
            this.group.parent
        ) {

            this.group.parent.remove(
                this.group
            )

        }

    }


    /* =========================================================
       SET SCENE
       ========================================================= */

    setScene(
        scene
    ) {

        this.scene =
            scene || null

    }


    /* =========================================================
       DESTROY
       ========================================================= */

    destroy() {

        this.stop()

        this.removeFromScene()


        this.group.traverse(
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
                                    material.map
                                ) {

                                    material.map.dispose()

                                }


                                material.dispose()

                            }
                        )

                    }
                    else {

                        if (
                            object.material.map
                        ) {

                            object.material.map.dispose()

                        }


                        object.material.dispose()

                    }

                }

            }
        )


        this.energyParticles =
            []

        this.lightParticles =
            []

        this.heatParticles =
            []


        this.scene =
            null

        this.parent =
            null

    }

}