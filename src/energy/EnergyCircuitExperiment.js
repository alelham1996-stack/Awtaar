import * as THREE from 'three'


/* =========================================================
   AWTAAR — ENERGY CIRCUIT EXPERIMENT
   =========================================================

   Guided discovery:

   0  Basic circuit — switch open
   1  Basic circuit — switch closed
   2  Basic circuit — switch open again

   3  Series circuit — switch closed
   4  Series circuit — switch open

   5  Parallel circuit — main switch closed
   6  Parallel circuit — first branch open

   7  Complete

   The experiment deliberately contains no sliders,
   particle counters, or control-panel logic.

   ========================================================= */


export default class EnergyCircuitExperiment {


    /* =========================================================
       CONSTRUCTOR
       ========================================================= */

    constructor(options = {}) {


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

        this.step =
            0


        /* =====================================================
           CIRCUIT STATE
           ===================================================== */

        this.circuitType =
            'basic'

        this.switchClosed =
            false

        this.seriesOpen =
            false

        this.parallelBranchOpen =
            false


        /* =====================================================
           ROOT GROUP
           ===================================================== */

        this.group =
            new THREE.Group()

        this.group.name =
            'AwtaarEnergyCircuit'


        /* =====================================================
           INTERNAL GROUPS
           ===================================================== */

        this.circuitGroup =
            new THREE.Group()

        this.wireGroup =
            new THREE.Group()

        this.componentGroup =
            new THREE.Group()

        this.glowGroup =
            new THREE.Group()

        this.indicatorGroup =
            new THREE.Group()


        this.group.add(
            this.circuitGroup
        )

        this.circuitGroup.add(
            this.wireGroup
        )

        this.circuitGroup.add(
            this.componentGroup
        )

        this.circuitGroup.add(
            this.glowGroup
        )

        this.circuitGroup.add(
            this.indicatorGroup
        )


        /* =====================================================
           COLORS
           ===================================================== */

        this.colors = {

            wire:
                0x7c8594,

            wireActive:
                0xf4c95d,

            wireInactive:
                0x414957,

            battery:
                0x303642,

            batteryEdge:
                0x8f98a8,

            positive:
                0xf4c95d,

            negative:
                0x788294,

            switchMetal:
                0xa6afbd,

            switchActive:
                0xf4c95d,

            contact:
                0xe4e8ef,

            lampOff:
                0x596270,

            lampOn:
                0xffdf78,

            lampGlow:
                0xffc84d,

            current:
                0xffd66a
        }


        /* =====================================================
           REFERENCES
           ===================================================== */

        this.battery =
            null

        this.switch =
            null

        this.seriesSwitch =
            null

        this.parallelMainSwitch =
            null

        this.lamps =
            []

        this.wires =
            []

        this.glows =
            []

        this.indicators =
            []


        /* =====================================================
           INITIAL CIRCUIT
           ===================================================== */

        this.createBasicCircuit()

        this.applyStep(
            0
        )

    }


    /* =========================================================
       CIRCUIT BUILDERS
       ========================================================= */


    /* =========================================================
       BASIC CIRCUIT
       ========================================================= */

    createBasicCircuit() {

        this.clearCircuit()

        this.circuitType =
            'basic'


        this.battery =
            this.createBattery(
                -4.5,
                0
            )


        this.switch =
            this.createSwitch(
                0,
                2.35
            )


        this.lamps = [

            this.createLamp(
                4.5,
                0
            )

        ]


        /* -----------------------------------------------------
           TOP PATH
           ----------------------------------------------------- */

        this.addWire(
            new THREE.Vector3(
                -4.5,
                0,
                0
            ),
            new THREE.Vector3(
                -4.5,
                2.35,
                0
            )
        )


        this.addWire(
            new THREE.Vector3(
                -4.5,
                2.35,
                0
            ),
            new THREE.Vector3(
                -1.15,
                2.35,
                0
            )
        )


        this.addWire(
            new THREE.Vector3(
                1.15,
                2.35,
                0
            ),
            new THREE.Vector3(
                4.5,
                2.35,
                0
            )
        )


        this.addWire(
            new THREE.Vector3(
                4.5,
                2.35,
                0
            ),
            new THREE.Vector3(
                4.5,
                0.95,
                0
            )
        )


        /* -----------------------------------------------------
           BOTTOM PATH
           ----------------------------------------------------- */

        this.addWire(
            new THREE.Vector3(
                4.5,
                -0.95,
                0
            ),
            new THREE.Vector3(
                4.5,
                -2.35,
                0
            )
        )


        this.addWire(
            new THREE.Vector3(
                4.5,
                -2.35,
                0
            ),
            new THREE.Vector3(
                -4.5,
                -2.35,
                0
            )
        )


        this.addWire(
            new THREE.Vector3(
                -4.5,
                -2.35,
                0
            ),
            new THREE.Vector3(
                -4.5,
                0,
                0
            )
        )


        this.createCurrentIndicator(
            'basic'
        )


        this.updateVisualState()

    }


    /* =========================================================
       SERIES CIRCUIT
       ========================================================= */

    createSeriesCircuit() {

        this.clearCircuit()

        this.circuitType =
            'series'


        this.battery =
            this.createBattery(
                -4.8,
                0
            )


        this.lamps = [

            this.createLamp(
                -1.55,
                0
            ),

            this.createLamp(
                2.15,
                0
            )

        ]


        /*
           Physical switch in the upper path.

           Layout:

           Battery
              |
           Switch
              |
           Lamp 1
              |
           Lamp 2
              |
           return
        */

        this.seriesSwitch =
            this.createSwitch(
                -4.8,
                2.25
            )


        /* -----------------------------------------------------
           LEFT SIDE
           ----------------------------------------------------- */

        this.addWire(
            new THREE.Vector3(
                -4.8,
                0,
                0
            ),
            new THREE.Vector3(
                -4.8,
                2.25,
                0
            )
        )


        this.addWire(
            new THREE.Vector3(
                -4.8,
                2.25,
                0
            ),
            new THREE.Vector3(
                -5.85,
                2.25,
                0
            )
        )


        this.addWire(
            new THREE.Vector3(
                -3.75,
                2.25,
                0
            ),
            new THREE.Vector3(
                -1.55,
                2.25,
                0
            )
        )


        this.addWire(
            new THREE.Vector3(
                -1.55,
                2.25,
                0
            ),
            new THREE.Vector3(
                -1.55,
                0.95,
                0
            )
        )


        /* -----------------------------------------------------
           FIRST LAMP → SECOND LAMP
           ----------------------------------------------------- */

        this.addWire(
            new THREE.Vector3(
                -1.55,
                -0.95,
                0
            ),
            new THREE.Vector3(
                -1.55,
                -1.7,
                0
            )
        )


        this.addWire(
            new THREE.Vector3(
                -1.55,
                -1.7,
                0
            ),
            new THREE.Vector3(
                2.15,
                -1.7,
                0
            )
        )


        this.addWire(
            new THREE.Vector3(
                2.15,
                -1.7,
                0
            ),
            new THREE.Vector3(
                2.15,
                -0.95,
                0
            )
        )


        /* -----------------------------------------------------
           SECOND LAMP → RETURN
           ----------------------------------------------------- */

        this.addWire(
            new THREE.Vector3(
                2.15,
                0.95,
                0
            ),
            new THREE.Vector3(
                2.15,
                2.25,
                0
            )
        )


        this.addWire(
            new THREE.Vector3(
                2.15,
                2.25,
                0
            ),
            new THREE.Vector3(
                3.5,
                2.25,
                0
            )
        )


        this.addWire(
            new THREE.Vector3(
                3.5,
                2.25,
                0
            ),
            new THREE.Vector3(
                4.8,
                2.25,
                0
            )
        )


        this.addWire(
            new THREE.Vector3(
                4.8,
                2.25,
                0
            ),
            new THREE.Vector3(
                4.8,
                -2.4,
                0
            )
        )


        this.addWire(
            new THREE.Vector3(
                4.8,
                -2.4,
                0
            ),
            new THREE.Vector3(
                -4.8,
                -2.4,
                0
            )
        )


        this.addWire(
            new THREE.Vector3(
                -4.8,
                -2.4,
                0
            ),
            new THREE.Vector3(
                -4.8,
                0,
                0
            )
        )


        this.createCurrentIndicator(
            'series'
        )


        this.updateVisualState()

    }


    /* =========================================================
       PARALLEL CIRCUIT
       ========================================================= */

    createParallelCircuit() {

        this.clearCircuit()

        this.circuitType =
            'parallel'


        this.battery =
            this.createBattery(
                -5,
                0
            )


        this.lamps = [

            this.createLamp(
                1.8,
                1.75
            ),

            this.createLamp(
                1.8,
                -1.75
            )

        ]


        /*
           Main switch controls the complete circuit.

           After the main switch:

                   ┌── Lamp 1 ──┐
           Battery ── Switch    ├── Return
                   └── Lamp 2 ──┘

           During step 6 only the first branch opens.
        */


        this.parallelMainSwitch =
            this.createSwitch(
                -1.8,
                2.7
            )


        /* -----------------------------------------------------
           BATTERY → MAIN SWITCH
           ----------------------------------------------------- */

        this.addWire(
            new THREE.Vector3(
                -5,
                0,
                0
            ),
            new THREE.Vector3(
                -5,
                2.7,
                0
            )
        )


        this.addWire(
            new THREE.Vector3(
                -5,
                2.7,
                0
            ),
            new THREE.Vector3(
                -2.85,
                2.7,
                0
            )
        )


        /* -----------------------------------------------------
           MAIN SWITCH → RIGHT RAIL
           ----------------------------------------------------- */

        this.addWire(
            new THREE.Vector3(
                -0.75,
                2.7,
                0
            ),
            new THREE.Vector3(
                1.8,
                2.7,
                0
            )
        )


        /* -----------------------------------------------------
           UPPER BRANCH
           ----------------------------------------------------- */

        this.addWire(
            new THREE.Vector3(
                1.8,
                2.7,
                0
            ),
            new THREE.Vector3(
                1.8,
                2.35,
                0
            )
        )


        const upperBranch =
            this.addWire(
                new THREE.Vector3(
                    1.8,
                    2.35,
                    0
                ),
                new THREE.Vector3(
                    1.8,
                    1.15,
                    0
                ),
                'branch1'
            )


        upperBranch.role =
            'branch1'


        /* -----------------------------------------------------
           LOWER BRANCH
           ----------------------------------------------------- */

        this.addWire(
            new THREE.Vector3(
                1.8,
                -1.15,
                0
            ),
            new THREE.Vector3(
                1.8,
                -2.35,
                0
            ),
            'branch2'
        )


        /* -----------------------------------------------------
           RIGHT RETURN RAIL
           ----------------------------------------------------- */

        this.addWire(
            new THREE.Vector3(
                1.8,
                -2.35,
                0
            ),
            new THREE.Vector3(
                1.8,
                -2.7,
                0
            )
        )


        this.addWire(
            new THREE.Vector3(
                1.8,
                -2.7,
                0
            ),
            new THREE.Vector3(
                -5,
                -2.7,
                0
            )
        )


        this.addWire(
            new THREE.Vector3(
                -5,
                -2.7,
                0
            ),
            new THREE.Vector3(
                -5,
                0,
                0
            )
        )


        this.createCurrentIndicator(
            'parallel'
        )


        this.updateVisualState()

    }


    /* =========================================================
       COMPONENTS
       ========================================================= */


    createBattery(x, y) {

        const battery =
            new THREE.Group()


        battery.position.set(
            x,
            y,
            0
        )


        /* -----------------------------------------------------
           BODY
           ----------------------------------------------------- */

        const body =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    1.55,
                    1.0,
                    0.72
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        this.colors.battery,

                    metalness:
                        0.65,

                    roughness:
                        0.3,

                    emissive:
                        0x07090d,

                    emissiveIntensity:
                        0.25

                })

            )


        body.scale.y =
            0.9


        battery.add(
            body
        )


        /* -----------------------------------------------------
           POSITIVE TERMINAL
           ----------------------------------------------------- */

        const positive =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    0.16,
                    0.16,
                    0.28,
                    24
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        this.colors.positive,

                    emissive:
                        this.colors.positive,

                    emissiveIntensity:
                        0.55,

                    metalness:
                        0.55,

                    roughness:
                        0.25

                })

            )


        positive.rotation.z =
            Math.PI / 2


        positive.position.x =
            0.92


        battery.add(
            positive
        )


        /* -----------------------------------------------------
           NEGATIVE TERMINAL
           ----------------------------------------------------- */

        const negative =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    0.16,
                    0.16,
                    0.28,
                    24
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        this.colors.negative,

                    metalness:
                        0.55,

                    roughness:
                        0.32

                })

            )


        negative.rotation.z =
            Math.PI / 2


        negative.position.x =
            -0.92


        battery.add(
            negative
        )


        /* -----------------------------------------------------
           ENERGY CORE
           ----------------------------------------------------- */

        const core =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.18,
                    20,
                    20
                ),

                new THREE.MeshBasicMaterial({

                    color:
                        this.colors.current

                })

            )


        core.position.z =
            0.38


        battery.add(
            core
        )


        this.componentGroup.add(
            battery
        )


        return battery

    }


    /* =========================================================
       SWITCH
       ========================================================= */

    createSwitch(x, y) {

        const group =
            new THREE.Group()


        group.position.set(
            x,
            y,
            0
        )


        /* -----------------------------------------------------
           CONTACT MATERIAL
           ----------------------------------------------------- */

        const contactMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    this.colors.contact,

                metalness:
                    0.8,

                roughness:
                    0.2

            })


        /* -----------------------------------------------------
           LEFT CONTACT
           ----------------------------------------------------- */

        const left =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.11,
                    20,
                    20
                ),

                contactMaterial

            )


        left.position.x =
            -1.05


        group.add(
            left
        )


        /* -----------------------------------------------------
           RIGHT CONTACT
           ----------------------------------------------------- */

        const right =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.11,
                    20,
                    20
                ),

                contactMaterial

            )


        right.position.x =
            1.05


        group.add(
            right
        )


        /* -----------------------------------------------------
           SWITCH ARM
           ----------------------------------------------------- */

        const arm =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    2.05,
                    0.13,
                    0.13
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        this.colors.switchMetal,

                    metalness:
                        0.85,

                    roughness:
                        0.2,

                    emissive:
                        0x07090d,

                    emissiveIntensity:
                        0.2

                })

            )


        arm.position.x =
            0


        arm.position.y =
            -0.02


        group.add(
            arm
        )


        group.arm =
            arm

        group.left =
            left

        group.right =
            right


        this.componentGroup.add(
            group
        )


        return group

    }


    /* =========================================================
       LAMP
       ========================================================= */

    createLamp(x, y) {

        const lamp =
            new THREE.Group()


        lamp.position.set(
            x,
            y,
            0
        )


        /* -----------------------------------------------------
           SOCKET
           ----------------------------------------------------- */

        const socket =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    0.5,
                    0.58,
                    0.55,
                    32
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        this.colors.lampOff,

                    metalness:
                        0.7,

                    roughness:
                        0.3

                })

            )


        socket.rotation.z =
            Math.PI / 2


        socket.position.x =
            0.3


        lamp.add(
            socket
        )


        /* -----------------------------------------------------
           BULB
           ----------------------------------------------------- */

        const bulb =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.9,
                    36,
                    36
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        this.colors.lampOff,

                    emissive:
                        this.colors.lampOff,

                    emissiveIntensity:
                        0.03,

                    transparent:
                        true,

                    opacity:
                        0.95,

                    roughness:
                        0.18

                })

            )


        bulb.position.x =
            -0.45


        lamp.add(
            bulb
        )


        /* -----------------------------------------------------
           GLOW
           ----------------------------------------------------- */

        const glow =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    1.28,
                    32,
                    32
                ),

                new THREE.MeshBasicMaterial({

                    color:
                        this.colors.lampGlow,

                    transparent:
                        true,

                    opacity:
                        0,

                    blending:
                        THREE.AdditiveBlending,

                    depthWrite:
                        false

                })

            )


        glow.position.x =
            -0.45


        lamp.add(
            glow
        )


        /* -----------------------------------------------------
           LIGHT
           ----------------------------------------------------- */

        const light =
            new THREE.PointLight(
                this.colors.lampGlow,
                0,
                5,
                2
            )


        light.position.x =
            -0.45


        lamp.add(
            light
        )


        lamp.socket =
            socket

        lamp.bulb =
            bulb

        lamp.glow =
            glow

        lamp.light =
            light

        lamp.isOn =
            false


        this.componentGroup.add(
            lamp
        )


        return lamp

    }


    /* =========================================================
       WIRES
       ========================================================= */

    addWire(
        start,
        end,
        role = 'normal'
    ) {

        const direction =
            new THREE.Vector3()
                .subVectors(
                    end,
                    start
                )


        const length =
            direction.length()


        const midpoint =
            new THREE.Vector3()
                .addVectors(
                    start,
                    end
                )
                .multiplyScalar(
                    0.5
                )


        const geometry =
            new THREE.CylinderGeometry(
                0.055,
                0.055,
                length,
                10
            )


        const material =
            new THREE.MeshStandardMaterial({

                color:
                    this.colors.wire,

                metalness:
                    0.55,

                roughness:
                    0.32,

                transparent:
                    true,

                opacity:
                    0.9,

                emissive:
                    0x090b10,

                emissiveIntensity:
                    0.25

            })


        const wire =
            new THREE.Mesh(
                geometry,
                material
            )


        wire.position.copy(
            midpoint
        )


        wire.quaternion.setFromUnitVectors(

            new THREE.Vector3(
                0,
                1,
                0
            ),

            direction.normalize()

        )


        wire.role =
            role


        wire.visible =
            true


        this.wireGroup.add(
            wire
        )


        this.wires.push(
            wire
        )


        return wire

    }


    /* =========================================================
       CURRENT INDICATOR
       ========================================================= */

    createCurrentIndicator(type) {

        const points =

            type === 'parallel'

                ? [

                    new THREE.Vector3(
                        -4.1,
                        2.7,
                        0.18
                    ),

                    new THREE.Vector3(
                        -1.8,
                        2.7,
                        0.18
                    ),

                    new THREE.Vector3(
                        1.8,
                        2.0,
                        0.18
                    ),

                    new THREE.Vector3(
                        1.8,
                        -2.0,
                        0.18
                    ),

                    new THREE.Vector3(
                        -3.7,
                        -2.7,
                        0.18
                    )

                ]

                : type === 'series'

                    ? [

                        new THREE.Vector3(
                            -4.1,
                            2.25,
                            0.18
                        ),

                        new THREE.Vector3(
                            2.8,
                            2.25,
                            0.18
                        ),

                        new THREE.Vector3(
                            4.4,
                            -2.4,
                            0.18
                        ),

                        new THREE.Vector3(
                            -4.4,
                            -2.4,
                            0.18
                        )

                    ]

                    : [

                        new THREE.Vector3(
                            -4.2,
                            2.35,
                            0.18
                        ),

                        new THREE.Vector3(
                            3.9,
                            2.35,
                            0.18
                        ),

                        new THREE.Vector3(
                            4.5,
                            -2.35,
                            0.18
                        ),

                        new THREE.Vector3(
                            -4.2,
                            -2.35,
                            0.18
                        )

                    ]


        const curve =
            new THREE.CatmullRomCurve3(
                points
            )


        const geometry =
            new THREE.TubeGeometry(
                curve,
                48,
                0.07,
                8,
                false
            )


        const material =
            new THREE.MeshBasicMaterial({

                color:
                    this.colors.current,

                transparent:
                    true,

                opacity:
                    0,

                blending:
                    THREE.AdditiveBlending,

                depthWrite:
                    false

            })


        const indicator =
            new THREE.Mesh(
                geometry,
                material
            )


        indicator.userData.type =
            type


        this.indicatorGroup.add(
            indicator
        )


        this.indicators.push(
            indicator
        )

    }


    /* =========================================================
       STATE / VISUALS
       ========================================================= */


    applyStep(step) {

        this.step =
            Math.max(
                0,
                Math.min(
                    7,
                    step
                )
            )


        if (
            this.step === 0 ||
            this.step === 1 ||
            this.step === 2
        ) {

            if (
                this.circuitType !==
                'basic'
            ) {

                this.createBasicCircuit()

            }

        }

        else if (
            this.step === 3 ||
            this.step === 4
        ) {

            if (
                this.circuitType !==
                'series'
            ) {

                this.createSeriesCircuit()

            }

        }

        else {

            if (
                this.circuitType !==
                'parallel'
            ) {

                this.createParallelCircuit()

            }

        }


        this.updateVisualState()

    }


    /* =========================================================
       UPDATE VISUAL STATE
       ========================================================= */

    updateVisualState() {


        /* =====================================================
           BASIC
           ===================================================== */

        if (
            this.circuitType ===
            'basic'
        ) {

            const closed =
                this.step === 1


            this.switchClosed =
                closed


            this.seriesOpen =
                false


            this.parallelBranchOpen =
                false


            if (
                this.switch
            ) {

                this.updateSwitchVisual(
                    this.switch,
                    closed
                )

            }


            this.setLampState(
                this.lamps[0],
                closed
            )


            this.setWiresActive(
                closed
            )


            this.setIndicatorActive(
                closed
            )

        }


        /* =====================================================
           SERIES
           ===================================================== */

        if (
            this.circuitType ===
            'series'
        ) {

            const open =
                this.step === 4


            this.seriesOpen =
                open


            this.switchClosed =
                !open


            this.parallelBranchOpen =
                false


            if (
                this.seriesSwitch
            ) {

                this.updateSwitchVisual(
                    this.seriesSwitch,
                    !open
                )

            }


            this.setLampState(
                this.lamps[0],
                !open
            )


            this.setLampState(
                this.lamps[1],
                !open
            )


            this.setWiresActive(
                !open
            )


            this.setIndicatorActive(
                !open
            )

        }


        /* =====================================================
           PARALLEL
           ===================================================== */

        if (
            this.circuitType ===
            'parallel'
        ) {

            const firstOpen =
                this.step === 6


            this.parallelBranchOpen =
                firstOpen


            /*
               Main switch remains CLOSED
               throughout the parallel demonstration.
            */

            this.switchClosed =
                true


            this.seriesOpen =
                false


            if (
                this.parallelMainSwitch
            ) {

                this.updateSwitchVisual(
                    this.parallelMainSwitch,
                    true
                )

            }


            /*
               Upper lamp:
               OFF when branch 1 is open.
            */

            this.setLampState(
                this.lamps[0],
                !firstOpen
            )


            /*
               Lower lamp:
               always ON while main switch
               remains closed.
            */

            this.setLampState(
                this.lamps[1],
                true
            )


            this.setWiresActive(
                true
            )


            const branch1 =
                this.wires.find(
                    wire =>
                        wire.role ===
                        'branch1'
                )


            if (
                branch1
            ) {

                branch1.visible =
                    !firstOpen


                branch1.material.color.setHex(

                    firstOpen

                        ? this.colors.wireInactive

                        : this.colors.wireActive

                )

            }


            this.setIndicatorActive(
                true
            )

        }


        /* =====================================================
           FINAL STATE
           ===================================================== */

        if (
            this.step === 7
        ) {

            if (
                this.circuitType ===
                'parallel'
            ) {

                this.setLampState(
                    this.lamps[0],
                    true
                )


                this.setLampState(
                    this.lamps[1],
                    true
                )

            }


            this.setWiresActive(
                true
            )


            this.setIndicatorActive(
                true
            )

        }

    }


    /* =========================================================
       SWITCH VISUAL
       ========================================================= */

    updateSwitchVisual(
        switchObject,
        closed
    ) {

        if (
            !switchObject ||
            !switchObject.arm
        ) {

            return

        }


        /*
           Closed:
           arm horizontal

           Open:
           arm lifted
        */

        switchObject.arm.rotation.z =
            closed
                ? 0
                : -0.34


        switchObject.arm.material.color.setHex(

            closed

                ? this.colors.switchActive

                : this.colors.switchMetal

        )


        switchObject.arm.material.emissive.setHex(

            closed

                ? this.colors.switchActive

                : 0x07090d

        )


        switchObject.arm.material.emissiveIntensity =
            closed
                ? 0.65
                : 0.2

    }


    /* =========================================================
       LAMP STATE
       ========================================================= */

    setLampState(
        lamp,
        on
    ) {

        if (
            !lamp
        ) {

            return

        }


        lamp.isOn =
            on


        if (
            on
        ) {

            lamp.bulb.material.color.setHex(
                this.colors.lampOn
            )


            lamp.bulb.material.emissive.setHex(
                this.colors.lampGlow
            )


            lamp.bulb.material.emissiveIntensity =
                1.65


            lamp.socket.material.color.setHex(
                this.colors.lampOn
            )


            lamp.glow.material.opacity =
                0.16


            lamp.light.intensity =
                2.2

        }

        else {

            lamp.bulb.material.color.setHex(
                this.colors.lampOff
            )


            lamp.bulb.material.emissive.setHex(
                this.colors.lampOff
            )


            lamp.bulb.material.emissiveIntensity =
                0.02


            lamp.socket.material.color.setHex(
                this.colors.lampOff
            )


            lamp.glow.material.opacity =
                0


            lamp.light.intensity =
                0

        }

    }


    /* =========================================================
       WIRES ACTIVE / INACTIVE
       ========================================================= */

    setWiresActive(
        active
    ) {

        for (
            const wire of this.wires
        ) {

            wire.visible =
                true


            wire.material.color.setHex(

                active

                    ? this.colors.wireActive

                    : this.colors.wireInactive

            )


            wire.material.emissive.setHex(

                active

                    ? this.colors.wireActive

                    : 0x090b10

            )


            wire.material.emissiveIntensity =

                active

                    ? 0.5

                    : 0.18


            wire.material.opacity =

                active

                    ? 1

                    : 0.68

        }

    }


    /* =========================================================
       CURRENT INDICATOR
       ========================================================= */

    setIndicatorActive(
        active
    ) {

        for (
            const indicator of this.indicators
        ) {

            indicator.material.opacity =

                active

                    ? 0.16

                    : 0

        }

    }


    /* =========================================================
       STEP DATA
       ========================================================= */

    getStepData() {

        const descriptions = {

            0: {

                type:
                    'basic',

                statusKey:
                    'open',

                titleKey:
                    'question',

                actionKey:
                    'switch'

            },


            1: {

                type:
                    'basic',

                statusKey:
                    'closed',

                titleKey:
                    'completePath',

                actionKey:
                    'switch'

            },


            2: {

                type:
                    'basic',

                statusKey:
                    'stopped',

                titleKey:
                    'whatHappened',

                actionKey:
                    'trySeries'

            },


            3: {

                type:
                    'series',

                statusKey:
                    'series',

                titleKey:
                    'onePath',

                actionKey:
                    'switch'

            },


            4: {

                type:
                    'series',

                statusKey:
                    'broken',

                titleKey:
                    'seriesBreak',

                actionKey:
                    'tryParallel'

            },


            5: {

                type:
                    'parallel',

                statusKey:
                    'parallel',

                titleKey:
                    'morePaths',

                actionKey:
                    'openBranch'

            },


            6: {

                type:
                    'parallel',

                statusKey:
                    'branchOpen',

                titleKey:
                    'parallelResult',

                actionKey:
                    'restart'

            },


            7: {

                type:
                    'parallel',

                statusKey:
                    'complete',

                titleKey:
                    'secret',

                actionKey:
                    'restart'

            }

        }


        return {

            step:
                this.step,

            ...descriptions[
                this.step
            ]

        }

    }


    /* =========================================================
       ADVANCE
       ========================================================= */

    advance() {

        if (
            !this.active
        ) {

            return this.getStepData()

        }


        if (
            this.step >= 7
        ) {

            return this.reset()

        }


        this.applyStep(
            this.step + 1
        )


        return this.getStepData()

    }


    /* =========================================================
       START
       ========================================================= */

    start() {

        this.active =
            true


        this.paused =
            false


        this.time =
            0


        this.applyStep(
            0
        )


        return this.getStepData()

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
       RESET
       ========================================================= */

    reset() {

        this.active =
            true


        this.paused =
            false


        this.time =
            0


        this.step =
            0


        this.circuitType =
            'basic'


        this.switchClosed =
            false


        this.seriesOpen =
            false


        this.parallelBranchOpen =
            false


        this.applyStep(
            0
        )


        return this.getStepData()

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


        this.time +=
            delta


        /* -----------------------------------------------------
           LAMP PULSE
           ----------------------------------------------------- */

        for (
            const lamp of this.lamps
        ) {

            if (
                !lamp.isOn
            ) {

                continue

            }


            const pulse =
                0.14 +
                Math.sin(
                    this.time * 2.5
                ) * 0.025


            lamp.glow.material.opacity =
                pulse


            lamp.light.intensity =
                2.0 +
                Math.sin(
                    this.time * 2.2
                ) * 0.2

        }


        /* -----------------------------------------------------
           CURRENT INDICATOR MOTION
           ----------------------------------------------------- */

        for (
            const indicator of this.indicators
        ) {

            if (
                indicator.material.opacity <= 0
            ) {

                continue

            }


            indicator.rotation.z =
                Math.sin(
                    this.time * 0.25
                ) * 0.01

        }

    }


    /* =========================================================
       SCENE
       ========================================================= */

    addToScene(
        scene = null
    ) {

        const target =
            scene ||
            this.scene


        if (
            !target
        ) {

            return

        }


        if (
            !this.group.parent
        ) {

            target.add(
                this.group
            )

        }


        this.scene =
            target

    }


    /* =========================================================
       REMOVE FROM SCENE
       ========================================================= */

    removeFromScene() {

        if (
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
            scene ||
            null


        if (
            this.active
        ) {

            this.addToScene(
                this.scene
            )

        }

    }


    /* =========================================================
       CLEAR CIRCUIT
       ========================================================= */

    clearCircuit() {

        const groups = [

            this.componentGroup,

            this.wireGroup,

            this.glowGroup,

            this.indicatorGroup

        ]


        for (
            const group of groups
        ) {

            while (
                group.children.length
            ) {

                const object =
                    group.children.pop()


                this.disposeObject(
                    object
                )

            }

        }


        this.battery =
            null


        this.switch =
            null


        this.seriesSwitch =
            null


        this.parallelMainSwitch =
            null


        this.lamps =
            []


        this.wires =
            []


        this.glows =
            []


        this.indicators =
            []

    }


    /* =========================================================
       DISPOSE OBJECT
       ========================================================= */

    disposeObject(
        object
    ) {

        if (
            object.children &&
            object.children.length
        ) {

            const children =
                [
                    ...object.children
                ]


            for (
                const child of children
            ) {

                this.disposeObject(
                    child
                )

            }

        }


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
                    material =>
                        material.dispose()
                )

            }

            else {

                object.material.dispose()

            }

        }

    }


    /* =========================================================
       STOP
       ========================================================= */

    stop() {

        this.active =
            false


        this.paused =
            false

    }


    /* =========================================================
       DESTROY
       ========================================================= */

    destroy() {

        this.stop()


        this.removeFromScene()


        this.clearCircuit()


        this.group.clear()


        this.parent =
            null


        this.scene =
            null

    }

}