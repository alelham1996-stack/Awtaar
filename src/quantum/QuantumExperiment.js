import * as THREE from 'three'


export default class QuantumExperiment {

    constructor() {

        /* =====================================================
           STATE
           ===================================================== */

        this.active = false
        this.paused = false
        this.time = 0

        this.emissionMode = 'continuous'

        this.slitOneOpen = true
        this.slitTwoOpen = true

        this.photonCount = 0
        this.detectedCount = 0

        /*
         * الحد الأقصى للفوتونات الموجودة
         * في التجربة في نفس اللحظة.
         *
         * لا يوقف الإطلاق بعد وصول العدد
         * الإجمالي إلى 900.
         */
        this.maxPhotons = 900

        this.spawnInterval = 0.055
        this.spawnTimer = 0

        this.emissionEnabled = true

        this.simulationStep = 0.01


        /* =====================================================
           INTERACTION STATE
           ===================================================== */

        this.pointer = new THREE.Vector2()

        this.pointerDown = false

        this.dragging = false

        this.pointerStart =
            new THREE.Vector2()

        this.pointerCurrent =
            new THREE.Vector2()

        this.dragDistance = 0

        /*
         * زاوية إطلاق الحزمة.
         *
         * 0 = أفقي
         */

        this.emissionAngle = 0

        this.targetEmissionAngle = 0

        this.maxEmissionAngle =
            THREE.MathUtils.degToRad(12)

        /*
         * تفاعل الشاشة
         */

        this.screenInteraction =
            new THREE.Vector3()

        this.screenInteractionStrength =
            0

        /*
         * آخر موضع للفأرة
         */

        this.lastPointerTime = 0


        /* =====================================================
           THREE.JS GROUPS
           ===================================================== */

        this.group =
            new THREE.Group()

        this.experimentGroup =
            new THREE.Group()

        this.group.add(
            this.experimentGroup
        )


        /* =====================================================
           COLLECTIONS
           ===================================================== */

        this.photons = []

        this.interferencePoints = []

        this.photonTrails = []

        this.interactionRipples = []


        /* =====================================================
           RAYCASTER
           ===================================================== */

        this.raycaster =
            new THREE.Raycaster()


        /* =====================================================
           CREATE EXPERIMENT
           ===================================================== */

        this.createEnvironment()

        this.createSource()

        this.createBeamGuide()

        this.createBarrier()

        this.createScreen()

        this.createScreenGlow()

        this.createInterferencePattern()


        /* =====================================================
           POINTER
           ===================================================== */

        this.handlePointerDown =
            this.handlePointerDown.bind(this)

        this.handlePointerMove =
            this.handlePointerMove.bind(this)

        this.handlePointerUp =
            this.handlePointerUp.bind(this)

        this.handleDoubleClick =
            this.handleDoubleClick.bind(this)

        this.handleKeyDown =
            this.handleKeyDown.bind(this)


        window.addEventListener(
            'pointerdown',
            this.handlePointerDown
        )

        window.addEventListener(
            'pointermove',
            this.handlePointerMove
        )

        window.addEventListener(
            'pointerup',
            this.handlePointerUp
        )

        window.addEventListener(
            'dblclick',
            this.handleDoubleClick
        )

        window.addEventListener(
            'keydown',
            this.handleKeyDown
        )


        this.group.visible =
            false
    }


    /* =========================================================
       ENVIRONMENT
       ========================================================= */

    createEnvironment() {

        const geometry =
            new THREE.PlaneGeometry(
                14,
                8
            )

        const material =
            new THREE.MeshBasicMaterial({

                color: 0x08070b,

                transparent: true,

                opacity: 0.16,

                side:
                    THREE.DoubleSide

            })

        this.environmentPlane =
            new THREE.Mesh(
                geometry,
                material
            )

        this.environmentPlane.rotation.x =
            -Math.PI / 2

        this.environmentPlane.position.y =
            -3.4

        this.experimentGroup.add(
            this.environmentPlane
        )


        const grid =
            new THREE.GridHelper(
                14,
                28,
                0x4b4028,
                0x19171c
            )

        grid.position.y =
            -3.38

        grid.material.transparent =
            true

        grid.material.opacity =
            0.12

        this.experimentGroup.add(
            grid
        )

        this.environmentGrid =
            grid
    }


    /* =========================================================
       PHOTON SOURCE
       ========================================================= */

    createSource() {

        this.source =
            new THREE.Group()

        this.source.position.set(
            -4.8,
            0,
            0
        )

        this.experimentGroup.add(
            this.source
        )


        /* =====================================================
           BODY
           ===================================================== */

        const bodyMaterial =
            new THREE.MeshBasicMaterial({

                color: 0x17151a,

                transparent: true,

                opacity: 0.96

            })


        const body =
            new THREE.Mesh(
                new THREE.CylinderGeometry(
                    0.34,
                    0.42,
                    1.35,
                    32
                ),
                bodyMaterial
            )


        body.rotation.z =
            Math.PI / 2

        body.position.x =
            -0.48

        this.source.add(
            body
        )

        this.sourceBody =
            body


        /* =====================================================
           BODY RINGS
           ===================================================== */

        const ringMaterial =
            new THREE.MeshBasicMaterial({

                color: 0xd9b867,

                transparent: true,

                opacity: 0.38,

                blending:
                    THREE.AdditiveBlending,

                depthWrite: false

            })


        this.sourceBodyRings = []


        const ringPositions = [

            -0.92,
            -0.62,
            -0.34

        ]


        ringPositions.forEach(
            (x) => {

                const ring =
                    new THREE.Mesh(
                        new THREE.TorusGeometry(
                            0.38,
                            0.018,
                            10,
                            48
                        ),
                        ringMaterial.clone()
                    )

                ring.rotation.y =
                    Math.PI / 2

                ring.position.x =
                    x

                this.source.add(
                    ring
                )

                this.sourceBodyRings.push(
                    ring
                )
            }
        )


        /* =====================================================
           FRONT CONE
           ===================================================== */

        const coneMaterial =
            new THREE.MeshBasicMaterial({

                color: 0x252126,

                transparent: true,

                opacity: 0.98

            })


        const cone =
            new THREE.Mesh(
                new THREE.CylinderGeometry(
                    0.30,
                    0.47,
                    0.52,
                    32,
                    1,
                    false
                ),
                coneMaterial
            )


        cone.rotation.z =
            Math.PI / 2

        cone.position.x =
            0.32

        this.source.add(
            cone
        )

        this.sourceCone =
            cone


        /* =====================================================
           FRONT RIM
           ===================================================== */

        const rim =
            new THREE.Mesh(
                new THREE.TorusGeometry(
                    0.30,
                    0.035,
                    12,
                    48
                ),
                new THREE.MeshBasicMaterial({

                    color: 0xe5c87e,

                    transparent: true,

                    opacity: 0.62,

                    blending:
                        THREE.AdditiveBlending,

                    depthWrite: false

                })
            )


        rim.rotation.y =
            Math.PI / 2

        rim.position.x =
            0.59

        this.source.add(
            rim
        )

        this.sourceRim =
            rim


        /* =====================================================
           EMISSION APERTURE
           ===================================================== */

        const aperture =
            new THREE.Mesh(
                new THREE.CircleGeometry(
                    0.235,
                    48
                ),
                new THREE.MeshBasicMaterial({

                    color: 0xfff0bd,

                    transparent: true,

                    opacity: 0.96,

                    blending:
                        THREE.AdditiveBlending,

                    depthWrite: false,

                    side:
                        THREE.DoubleSide

                })
            )


        aperture.rotation.y =
            Math.PI / 2

        aperture.position.x =
            0.605

        this.source.add(
            aperture
        )

        this.sourceAperture =
            aperture


        /* =====================================================
           INNER CORE
           ===================================================== */

        const core =
            new THREE.Mesh(
                new THREE.CircleGeometry(
                    0.11,
                    32
                ),
                new THREE.MeshBasicMaterial({

                    color: 0xffffff,

                    transparent: true,

                    opacity: 1,

                    blending:
                        THREE.AdditiveBlending,

                    depthWrite: false,

                    side:
                        THREE.DoubleSide

                })
            )


        core.rotation.y =
            Math.PI / 2

        core.position.x =
            0.615

        this.source.add(
            core
        )

        this.sourceCore =
            core


        /* =====================================================
           INNER GLOW
           ===================================================== */

        const glow =
            new THREE.Mesh(
                new THREE.CircleGeometry(
                    0.40,
                    48
                ),
                new THREE.MeshBasicMaterial({

                    color: 0xf1ca72,

                    transparent: true,

                    opacity: 0.08,

                    blending:
                        THREE.AdditiveBlending,

                    depthWrite: false,

                    side:
                        THREE.DoubleSide

                })
            )


        glow.rotation.y =
            Math.PI / 2

        glow.position.x =
            0.62

        this.source.add(
            glow
        )

        this.sourceGlow =
            glow


        /* =====================================================
           OUTER AURA
           ===================================================== */

        const outerGlow =
            new THREE.Mesh(
                new THREE.CircleGeometry(
                    0.68,
                    48
                ),
                new THREE.MeshBasicMaterial({

                    color: 0xd9ad55,

                    transparent: true,

                    opacity: 0.025,

                    blending:
                        THREE.AdditiveBlending,

                    depthWrite: false,

                    side:
                        THREE.DoubleSide

                })
            )


        outerGlow.rotation.y =
            Math.PI / 2

        outerGlow.position.x =
            0.63

        this.source.add(
            outerGlow
        )

        this.sourceOuterGlow =
            outerGlow


        /* =====================================================
           ENERGY RINGS
           ===================================================== */

        this.sourceEnergyRings = []


        const energyRingData = [

            {
                radius: 0.48,
                tube: 0.018,
                x: 0.72
            },

            {
                radius: 0.58,
                tube: 0.012,
                x: 0.87
            },

            {
                radius: 0.70,
                tube: 0.008,
                x: 1.03
            }

        ]


        energyRingData.forEach(
            (data, index) => {

                const energyRing =
                    new THREE.Mesh(
                        new THREE.TorusGeometry(
                            data.radius,
                            data.tube,
                            10,
                            64
                        ),
                        new THREE.MeshBasicMaterial({

                            color:
                                index === 0
                                    ? 0xffe6a5
                                    : 0xc99d49,

                            transparent: true,

                            opacity:
                                0.28 -
                                index * 0.06,

                            blending:
                                THREE.AdditiveBlending,

                            depthWrite: false

                        })
                    )


                energyRing.rotation.y =
                    Math.PI / 2

                energyRing.position.x =
                    data.x

                this.source.add(
                    energyRing
                )

                this.sourceEnergyRings.push(
                    energyRing
                )
            }
        )


        /* =====================================================
           EMISSION FLASH
           ===================================================== */

        const flash =
            new THREE.Mesh(
                new THREE.CircleGeometry(
                    0.30,
                    48
                ),
                new THREE.MeshBasicMaterial({

                    color: 0xffffff,

                    transparent: true,

                    opacity: 0,

                    blending:
                        THREE.AdditiveBlending,

                    depthWrite: false,

                    side:
                        THREE.DoubleSide

                })
            )


        flash.rotation.y =
            Math.PI / 2

        flash.position.x =
            0.64

        this.source.add(
            flash
        )

        this.sourceFlash =
            flash

        this.sourceFlashStrength =
            0


        /* =====================================================
           REAL EMISSION POINT
           ===================================================== */

        this.emissionPoint =
            new THREE.Vector3(
                0.605,
                0,
                0
            )


        this.emissionDirection =
            new THREE.Vector3(
                1,
                0,
                0
            )


        this.sourceEmissionMarker =
            new THREE.Object3D()

        this.sourceEmissionMarker.position.copy(
            this.emissionPoint
        )

        this.source.add(
            this.sourceEmissionMarker
        )


        this.emissionPulse =
            0
    }


    /* =========================================================
       BEAM GUIDE
       ========================================================= */

    createBeamGuide() {

        const beamGeometry =
            new THREE.PlaneGeometry(
                4.55,
                0.16
            )

        const beamMaterial =
            new THREE.MeshBasicMaterial({

                color: 0xf4d38a,

                transparent: true,

                opacity: 0.055,

                blending:
                    THREE.AdditiveBlending,

                depthWrite: false,

                side:
                    THREE.DoubleSide

            })


        this.sourceBeam =
            new THREE.Mesh(
                beamGeometry,
                beamMaterial
            )


        this.sourceBeam.position.set(
            -2.5,
            0,
            -0.04
        )

        this.experimentGroup.add(
            this.sourceBeam
        )


        const lineGeometry =
            new THREE.BufferGeometry().setFromPoints([

                new THREE.Vector3(
                    -4.195,
                    0,
                    0
                ),

                new THREE.Vector3(
                    -0.16,
                    0,
                    0
                )

            ])


        const lineMaterial =
            new THREE.LineBasicMaterial({

                color: 0xf8dfaa,

                transparent: true,

                opacity: 0.18,

                blending:
                    THREE.AdditiveBlending

            })


        this.sourceLine =
            new THREE.Line(
                lineGeometry,
                lineMaterial
            )


        this.experimentGroup.add(
            this.sourceLine
        )
    }


    /* =========================================================
       BARRIER
       ========================================================= */

    createBarrier() {

        this.barrier =
            new THREE.Group()


        const material =
            new THREE.MeshBasicMaterial({

                color: 0x111015,

                transparent: true,

                opacity: 0.96

            })


        const top =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.22,
                    2.28,
                    0.82
                ),
                material
            )


        top.position.set(
            0,
            2.55,
            0
        )

        this.barrier.add(
            top
        )


        const middle =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.22,
                    0.46,
                    0.82
                ),
                material
            )


        middle.position.set(
            0,
            0,
            0
        )

        this.barrier.add(
            middle
        )


        const bottom =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.22,
                    2.28,
                    0.82
                ),
                material
            )


        bottom.position.set(
            0,
            -2.55,
            0
        )

        this.barrier.add(
            bottom
        )


        const frameMaterial =
            new THREE.MeshBasicMaterial({

                color: 0xe4c276,

                transparent: true,

                opacity: 0.42,

                blending:
                    THREE.AdditiveBlending

            })


        const frame =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.28,
                    5.72,
                    0.88
                ),
                frameMaterial
            )


        this.barrier.add(
            frame
        )


        const topEdge =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.31,
                    0.025,
                    0.94
                ),
                frameMaterial
            )


        topEdge.position.y =
            2.87

        this.barrier.add(
            topEdge
        )


        const bottomEdge =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.31,
                    0.025,
                    0.94
                ),
                frameMaterial
            )


        bottomEdge.position.y =
            -2.87

        this.barrier.add(
            bottomEdge
        )


        const slitPositions = [
            0.42,
            -0.42
        ]


        this.slits = []


        slitPositions.forEach(
            (y, index) => {

                const slitMaterial =
                    new THREE.MeshBasicMaterial({

                        color: 0xffedbb,

                        transparent: true,

                        opacity: 0.95,

                        blending:
                            THREE.AdditiveBlending,

                        depthWrite: false

                    })


                const slit =
                    new THREE.Mesh(
                        new THREE.BoxGeometry(
                            0.045,
                            0.19,
                            0.88
                        ),
                        slitMaterial
                    )


                slit.position.set(
                    -0.145,
                    y,
                    0
                )


                slit.userData.isSlit =
                    true

                slit.userData.index =
                    index


                this.barrier.add(
                    slit
                )


                const slitGlowMaterial =
                    new THREE.MeshBasicMaterial({

                        color: 0xf4d38a,

                        transparent: true,

                        opacity: 0.10,

                        blending:
                            THREE.AdditiveBlending,

                        depthWrite: false

                    })


                const slitGlow =
                    new THREE.Mesh(
                        new THREE.BoxGeometry(
                            0.08,
                            0.30,
                            0.90
                        ),
                        slitGlowMaterial
                    )


                slitGlow.position.copy(
                    slit.position
                )


                slitGlow.userData.isSlitGlow =
                    true


                this.barrier.add(
                    slitGlow
                )


                this.slits.push({

                    main: slit,

                    glow: slitGlow

                })

            }
        )


        this.experimentGroup.add(
            this.barrier
        )


        this.updateSlitVisuals()
    }


    /* =========================================================
       SCREEN
       ========================================================= */

    createScreen() {

        const material =
            new THREE.MeshBasicMaterial({

                color: 0x28252d,

                transparent: true,

                opacity: 0.52,

                side:
                    THREE.DoubleSide

            })


        this.screen =
            new THREE.Mesh(
                new THREE.PlaneGeometry(
                    0.08,
                    6.2
                ),
                material
            )


        this.screen.position.set(
            4.4,
            0,
            0
        )


        this.screen.rotation.y =
            Math.PI / 2


        this.screen.userData.isScreen =
            true


        this.experimentGroup.add(
            this.screen
        )


        const frameMaterial =
            new THREE.MeshBasicMaterial({

                color: 0xe7c87f,

                transparent: true,

                opacity: 0.42,

                blending:
                    THREE.AdditiveBlending

            })


        this.screenFrame =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.12,
                    6.45,
                    0.16
                ),
                frameMaterial
            )


        this.screenFrame.position.set(
            4.4,
            0,
            0
        )


        this.experimentGroup.add(
            this.screenFrame
        )


        const centerGeometry =
            new THREE.BufferGeometry().setFromPoints([

                new THREE.Vector3(
                    4.33,
                    -2.9,
                    0.06
                ),

                new THREE.Vector3(
                    4.33,
                    2.9,
                    0.06
                )

            ])


        this.screenCenterLine =
            new THREE.Line(
                centerGeometry,
                new THREE.LineBasicMaterial({

                    color: 0xf5d991,

                    transparent: true,

                    opacity: 0.25

                })
            )


        this.experimentGroup.add(
            this.screenCenterLine
        )
    }


    /* =========================================================
       SCREEN GLOW
       ========================================================= */

    createScreenGlow() {

        const geometry =
            new THREE.PlaneGeometry(
                0.18,
                6.3
            )


        const material =
            new THREE.MeshBasicMaterial({

                color: 0xd6ad5c,

                transparent: true,

                opacity: 0.025,

                blending:
                    THREE.AdditiveBlending,

                depthWrite: false,

                side:
                    THREE.DoubleSide

            })


        this.screenGlow =
            new THREE.Mesh(
                geometry,
                material
            )


        this.screenGlow.position.set(
            4.31,
            0,
            0
        )


        this.screenGlow.rotation.y =
            Math.PI / 2


        this.experimentGroup.add(
            this.screenGlow
        )
    }


    /* =========================================================
       INTERFERENCE PATTERN
       ========================================================= */

    createInterferencePattern() {

        const geometry =
            new THREE.BufferGeometry()


        const count =
            900


        const positions =
            new Float32Array(
                count * 3
            )


        for (
            let i = 0;
            i < count;
            i++
        ) {

            positions[i * 3] =
                4.34

            positions[i * 3 + 1] =
                (
                    Math.random() - 0.5
                ) * 5.8

            positions[i * 3 + 2] =
                (
                    Math.random() - 0.5
                ) * 0.035
        }


        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(
                positions,
                3
            )
        )


        const material =
            new THREE.PointsMaterial({

                color: 0xf4d38a,

                size: 0.035,

                transparent: true,

                opacity: 0,

                blending:
                    THREE.AdditiveBlending,

                depthWrite: false

            })


        this.pattern =
            new THREE.Points(
                geometry,
                material
            )


        this.pattern.visible =
            false


        this.experimentGroup.add(
            this.pattern
        )
    }


    /* =========================================================
       SPAWN PHOTON
       ========================================================= */

    spawnPhoton() {

        if (
            !this.active ||
            this.photons.length >=
            this.maxPhotons
        ) {

            return null
        }


        if (
            !this.slitOneOpen &&
            !this.slitTwoOpen
        ) {

            return null
        }


        const geometry =
            new THREE.SphereGeometry(
                0.038,
                10,
                10
            )


        const material =
            new THREE.MeshBasicMaterial({

                color: 0xfff1c4,

                transparent: true,

                opacity: 0.96,

                blending:
                    THREE.AdditiveBlending,

                depthWrite: false

            })


        const photon =
            new THREE.Mesh(
                geometry,
                material
            )


        const worldEmission =
            new THREE.Vector3()

        this.source.localToWorld(
            worldEmission.copy(
                this.emissionPoint
            )
        )


        photon.position.copy(
            this.experimentGroup.worldToLocal(
                worldEmission
            )
        )


        photon.userData.speed =
            0.055 +
            Math.random() * 0.025


        photon.userData.phase =
            'source'


        photon.userData.slitY =
            this.chooseSlit()


        photon.userData.targetY =
            this.calculateDetectionPosition()


        photon.userData.waveOffset =
            Math.random() *
            Math.PI *
            2


        photon.userData.age =
            0


        photon.userData.angle =
            this.emissionAngle


        photon.userData.previousX =
            photon.position.x


        photon.userData.initialY =
            photon.position.y


        this.emissionPulse =
            1

        this.sourceFlashStrength =
            1


        this.experimentGroup.add(
            photon
        )


        this.photons.push(
            photon
        )


        this.photonCount++


        return photon
    }


    /* =========================================================
       CHOOSE SLIT
       ========================================================= */

    chooseSlit() {

        if (
            this.slitOneOpen &&
            !this.slitTwoOpen
        ) {

            return 0.42
        }


        if (
            !this.slitOneOpen &&
            this.slitTwoOpen
        ) {

            return -0.42
        }


        return Math.random() < 0.5
            ? 0.42
            : -0.42
    }


    /* =========================================================
       DETECTION POSITION
       ========================================================= */

    calculateDetectionPosition() {

        const maxY =
            2.78


        if (
            this.slitOneOpen &&
            this.slitTwoOpen
        ) {

            return this.calculateDoubleSlitPosition(
                maxY
            )
        }


        return this.calculateSingleSlitPosition(
            maxY
        )
    }


    /* =========================================================
       DOUBLE SLIT DISTRIBUTION
       ========================================================= */

    calculateDoubleSlitPosition(
        maxY
    ) {

        for (
            let attempt = 0;
            attempt < 100;
            attempt++
        ) {

            const candidate =
                (
                    Math.random() * 2 - 1
                ) * maxY


            const interference =
                Math.pow(
                    Math.cos(
                        candidate * 2.75
                    ),
                    2
                )


            const envelope =
                Math.pow(
                    Math.max(
                        0,
                        Math.cos(
                            candidate * 0.56
                        )
                    ),
                    2
                )


            const probability =
                interference *
                envelope


            if (
                Math.random() <
                probability
            ) {

                return candidate
            }
        }


        return (
            Math.random() * 2 - 1
        ) * maxY
    }


    /* =========================================================
       SINGLE SLIT DISTRIBUTION
       ========================================================= */

    calculateSingleSlitPosition(
        maxY
    ) {

        for (
            let attempt = 0;
            attempt < 80;
            attempt++
        ) {

            const candidate =
                (
                    Math.random() * 2 - 1
                ) * maxY


            const center =
                Math.exp(
                    -Math.pow(
                        candidate / 1.35,
                        2
                    )
                )


            const secondary =
                0.25 *
                Math.pow(
                    Math.cos(
                        candidate * 1.7
                    ),
                    2
                )


            const probability =
                Math.min(
                    1,
                    center +
                    secondary
                )


            if (
                Math.random() <
                probability
            ) {

                return candidate
            }
        }


        return (
            Math.random() * 2 - 1
        ) * maxY
    }


    /* =========================================================
       UPDATE PHOTONS
       ========================================================= */

    updatePhotons() {

        for (
            let i =
                this.photons.length - 1;
            i >= 0;
            i--
        ) {

            const photon =
                this.photons[i]


            photon.userData.age +=
                this.simulationStep


            /* =================================================
               SOURCE → SLIT
               ================================================= */

            if (
                photon.userData.phase ===
                'source'
            ) {

                photon.position.x +=
                    Math.cos(
                        photon.userData.angle
                    ) *
                    photon.userData.speed


                photon.position.y +=
                    Math.sin(
                        photon.userData.angle
                    ) *
                    photon.userData.speed


                if (
                    photon.position.x >=
                    -0.20
                ) {

                    photon.userData.phase =
                        'slit'
                }

                continue
            }


            /* =================================================
               SLIT
               ================================================= */

            if (
                photon.userData.phase ===
                'slit'
            ) {

                photon.position.x +=
                    photon.userData.speed


                const difference =
                    photon.userData.slitY -
                    photon.position.y


                photon.position.y +=
                    difference *
                    0.08


                if (
                    Math.abs(
                        difference
                    ) < 0.025
                ) {

                    photon.userData.phase =
                        'screen'
                }

                continue
            }


            /* =================================================
               SLIT → SCREEN
               ================================================= */

            photon.userData.phase =
                'screen'


            photon.position.x +=
                photon.userData.speed


            const totalDistance =
                4.35 -
                0.12


            const progress =
                THREE.MathUtils.clamp(
                    (
                        photon.position.x -
                        0.12
                    ) /
                    totalDistance,
                    0,
                    1
                )


            const startY =
                photon.userData.slitY


            const targetY =
                photon.userData.targetY


            photon.position.y =
                THREE.MathUtils.lerp(
                    startY,
                    targetY,
                    progress
                )


            photon.position.y +=
                Math.sin(
                    photon.userData.angle
                ) *
                progress *
                0.55


            const spread =
                Math.sin(
                    progress *
                    Math.PI
                )


            photon.position.y +=
                (
                    targetY -
                    startY
                ) *
                spread *
                0.035


            const pulse =
                1 +
                Math.sin(
                    this.time * 13 +
                    photon.userData.waveOffset
                ) *
                0.18


            photon.scale.set(
                pulse,
                pulse,
                pulse
            )


            /* =================================================
               TRAIL
               ================================================= */

            if (
                Math.random() < 0.18
            ) {

                this.createPhotonTrail(
                    photon
                )
            }


            /* =================================================
               DETECTION
               ================================================= */

            if (
                photon.position.x >=
                4.35
            ) {

                this.registerDetection(
                    photon.userData.targetY
                )


                this.experimentGroup.remove(
                    photon
                )


                photon.geometry.dispose()

                photon.material.dispose()


                this.photons.splice(
                    i,
                    1
                )
            }
        }
    }


    /* =========================================================
       PHOTON TRAIL
       ========================================================= */

    createPhotonTrail(
        photon
    ) {

        const geometry =
            new THREE.SphereGeometry(
                0.018,
                6,
                6
            )


        const material =
            new THREE.MeshBasicMaterial({

                color: 0xf4d38a,

                transparent: true,

                opacity: 0.22,

                blending:
                    THREE.AdditiveBlending,

                depthWrite: false

            })


        const trail =
            new THREE.Mesh(
                geometry,
                material
            )


        trail.position.copy(
            photon.position
        )


        trail.userData.life =
            1


        this.experimentGroup.add(
            trail
        )


        this.photonTrails.push(
            trail
        )


        if (
            this.photonTrails.length >
            180
        ) {

            const old =
                this.photonTrails.shift()


            this.experimentGroup.remove(
                old
            )


            old.geometry.dispose()

            old.material.dispose()
        }
    }


    /* =========================================================
       UPDATE PHOTON TRAILS
       ========================================================= */

    updatePhotonTrails() {

        for (
            let i =
                this.photonTrails.length - 1;
            i >= 0;
            i--
        ) {

            const trail =
                this.photonTrails[i]


            trail.userData.life -=
                0.035


            trail.material.opacity =
                0.22 *
                Math.max(
                    0,
                    trail.userData.life
                )


            const scale =
                Math.max(
                    0.1,
                    trail.userData.life
                )


            trail.scale.set(
                scale,
                scale,
                scale
            )


            if (
                trail.userData.life <=
                0
            ) {

                this.experimentGroup.remove(
                    trail
                )


                trail.geometry.dispose()

                trail.material.dispose()


                this.photonTrails.splice(
                    i,
                    1
                )
            }
        }
    }


    /* =========================================================
       REGISTER DETECTION
       ========================================================= */

    registerDetection(y) {

        this.detectedCount++


        const geometry =
            new THREE.SphereGeometry(
                0.025,
                8,
                8
            )


        const material =
            new THREE.MeshBasicMaterial({

                color: 0xf4d38a,

                transparent: true,

                opacity: 0.90,

                blending:
                    THREE.AdditiveBlending,

                depthWrite: false

            })


        const point =
            new THREE.Mesh(
                geometry,
                material
            )


        point.position.set(
            4.34,
            y,
            (
                Math.random() - 0.5
            ) * 0.10
        )


        point.scale.set(
            0.35,
            0.35,
            0.35
        )


        point.userData.life =
            0


        this.experimentGroup.add(
            point
        )


        this.interferencePoints.push(
            point
        )


        const glowGeometry =
            new THREE.SphereGeometry(
                0.075,
                8,
                8
            )


        const glowMaterial =
            new THREE.MeshBasicMaterial({

                color: 0xe6bf6d,

                transparent: true,

                opacity: 0.10,

                blending:
                    THREE.AdditiveBlending,

                depthWrite: false

            })


        const glow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            )


        glow.position.copy(
            point.position
        )


        glow.userData.isDetectionGlow =
            true

        glow.userData.life =
            0


        this.experimentGroup.add(
            glow
        )


        this.interferencePoints.push(
            glow
        )


        while (
            this.interferencePoints.length >
            1100
        ) {

            const oldPoint =
                this.interferencePoints.shift()


            this.experimentGroup.remove(
                oldPoint
            )


            if (
                oldPoint.geometry
            ) {

                oldPoint.geometry.dispose()
            }


            if (
                oldPoint.material
            ) {

                oldPoint.material.dispose()
            }
        }
    }


    /* =========================================================
       UPDATE DETECTION VISUALS
       ========================================================= */

    updateDetectionVisuals() {

        this.interferencePoints.forEach(
            (point) => {

                if (
                    !point.userData
                ) {

                    return
                }


                if (
                    point.userData.life !==
                    undefined
                ) {

                    point.userData.life +=
                        0.018


                    if (
                        point.userData.life <
                        1.5
                    ) {

                        const scale =
                            THREE.MathUtils.lerp(
                                0.35,
                                1,
                                Math.min(
                                    1,
                                    point.userData.life
                                )
                            )


                        point.scale.set(
                            scale,
                            scale,
                            scale
                        )
                    }


                    if (
                        point.userData.isDetectionGlow
                    ) {

                        point.material.opacity =
                            0.10 *
                            Math.max(
                                0.2,
                                Math.sin(
                                    point.userData.life *
                                    Math.PI
                                )
                            )
                    }
                }

            }
        )
    }


    /* =========================================================
       TOGGLE SLIT
       ========================================================= */

    toggleSlit(index) {

        if (
            index === 0
        ) {

            this.slitOneOpen =
                !this.slitOneOpen
        }


        if (
            index === 1
        ) {

            this.slitTwoOpen =
                !this.slitTwoOpen
        }


        this.updateSlitVisuals()

        this.spawnTimer =
            0


        return this.getSlitState()
    }


    /* =========================================================
       SET SLIT STATE
       ========================================================= */

    setSlitState(
        index,
        open
    ) {

        if (
            index === 0
        ) {

            this.slitOneOpen =
                Boolean(open)
        }


        if (
            index === 1
        ) {

            this.slitTwoOpen =
                Boolean(open)
        }


        this.updateSlitVisuals()

        return this.getSlitState()
    }


    /* =========================================================
       SLIT VISUALS
       ========================================================= */

    updateSlitVisuals() {

        if (
            !this.slits
        ) {

            return
        }


        const states = [

            this.slitOneOpen,

            this.slitTwoOpen

        ]


        this.slits.forEach(
            (slit, index) => {

                if (
                    !slit
                ) {

                    return
                }


                const state =
                    states[index]


                slit.main.visible =
                    true

                slit.glow.visible =
                    true


                slit.main.material.opacity =
                    state
                        ? 0.95
                        : 0.08


                slit.glow.material.opacity =
                    state
                        ? 0.12
                        : 0.015
            }
        )
    }


    /* =========================================================
       GET SLIT STATE
       ========================================================= */

    getSlitState() {

        return {

            slitOne:
                this.slitOneOpen,

            slitTwo:
                this.slitTwoOpen

        }
    }


    /* =========================================================
       SINGLE PHOTON
       ========================================================= */

    fireSinglePhoton() {

        if (
            !this.active ||
            this.paused
        ) {

            return null
        }


        return this.spawnPhoton()
    }


    /* =========================================================
       EMISSION CONTROL
       ========================================================= */

    setEmissionEnabled(
        enabled
    ) {

        this.emissionEnabled =
            Boolean(enabled)

        return this.emissionEnabled
    }


    /* =========================================================
       EMISSION MODE
       ========================================================= */

    setEmissionMode(
        mode
    ) {

        if (
            mode !== 'continuous' &&
            mode !== 'manual'
        ) {

            return
        }


        this.emissionMode =
            mode


        if (
            mode === 'manual'
        ) {

            this.emissionEnabled =
                false
        }


        if (
            mode === 'continuous'
        ) {

            this.emissionEnabled =
                true
        }
    }


    /* =========================================================
       RESET
       ========================================================= */

    resetExperiment() {

        this.clearPhotons()

        this.clearDetections()

        this.clearPhotonTrails()

        this.clearInteractionRipples()


        this.photonCount =
            0

        this.detectedCount =
            0

        this.spawnTimer =
            0

        this.time =
            0


        this.slitOneOpen =
            true

        this.slitTwoOpen =
            true


        this.emissionMode =
            'continuous'

        this.emissionEnabled =
            true

        this.paused =
            false


        this.emissionPulse =
            0

        this.sourceFlashStrength =
            0


        this.emissionAngle =
            0

        this.targetEmissionAngle =
            0


        this.screenInteractionStrength =
            0


        this.updateSlitVisuals()
    }


    /* =========================================================
       POINTER DOWN
       ========================================================= */

    handlePointerDown(
        event
    ) {

        if (
            !this.active
        ) {

            return
        }


        if (
            event.button !== 0
        ) {

            return
        }


        this.pointerDown =
            true

        this.dragging =
            false


        this.pointerStart.set(
            event.clientX,
            event.clientY
        )


        this.pointerCurrent.copy(
            this.pointerStart
        )


        this.dragDistance =
            0


        this.updatePointer(
            event
        )


        const hit =
            this.raycastExperiment(
                event
            )


        if (
            hit
        ) {

            if (
                hit.object.userData &&
                hit.object.userData.isSlit
            ) {

                const index =
                    hit.object.userData.index


                this.toggleSlit(
                    index
                )


                return
            }


            if (
                hit.object.userData &&
                hit.object.userData.isScreen
            ) {

                this.interactWithScreen(
                    hit.point
                )


                return
            }
        }
    }


    /* =========================================================
       POINTER MOVE
       ========================================================= */

    handlePointerMove(
        event
    ) {

        if (
            !this.active
        ) {

            return
        }


        this.updatePointer(
            event
        )


        if (
            !this.pointerDown
        ) {

            return
        }


        this.pointerCurrent.set(
            event.clientX,
            event.clientY
        )


        const dx =
            this.pointerCurrent.x -
            this.pointerStart.x


        const dy =
            this.pointerCurrent.y -
            this.pointerStart.y


        this.dragDistance =
            Math.sqrt(
                dx * dx +
                dy * dy
            )


        if (
            this.dragDistance >
            8
        ) {

            this.dragging =
                true
        }


        if (
            !this.dragging
        ) {

            return
        }


        const normalized =
            THREE.MathUtils.clamp(
                -dy / 180,
                -1,
                1
            )


        this.targetEmissionAngle =
            normalized *
            this.maxEmissionAngle
    }


    /* =========================================================
       POINTER UP
       ========================================================= */

    handlePointerUp() {

        this.pointerDown =
            false

        this.dragging =
            false

        this.dragDistance =
            0
    }


    /* =========================================================
       DOUBLE CLICK
       ========================================================= */

    handleDoubleClick(
        event
    ) {

        if (
            !this.active
        ) {

            return
        }


        const hit =
            this.raycastExperiment(
                event
            )


        if (
            !hit
        ) {

            return
        }


        if (
            hit.object.userData &&
            hit.object.userData.isScreen
        ) {

            this.targetEmissionAngle =
                0

            this.screenInteractionStrength =
                1
        }
    }


    /* =========================================================
       KEYBOARD
       ========================================================= */

    handleKeyDown(
        event
    ) {

        if (
            !this.active
        ) {

            return
        }


        if (
            event.code ===
            'Space'
        ) {

            event.preventDefault()

            this.paused =
                !this.paused

            return
        }


        if (
            event.code ===
            'KeyR'
        ) {

            this.resetExperiment()

            return
        }


        if (
            event.code ===
            'Digit1'
        ) {

            this.toggleSlit(
                0
            )

            return
        }


        if (
            event.code ===
            'Digit2'
        ) {

            this.toggleSlit(
                1
            )

            return
        }


        if (
            event.code ===
            'KeyF'
        ) {

            this.fireSinglePhoton()
        }
    }


    /* =========================================================
       UPDATE POINTER
       ========================================================= */

    updatePointer(
        event
    ) {

        const width =
            window.innerWidth

        const height =
            window.innerHeight


        this.pointer.x =
            (
                event.clientX /
                width
            ) * 2 - 1


        this.pointer.y =
            -(
                event.clientY /
                height
            ) * 2 + 1


        this.lastPointerTime =
            performance.now()
    }


    /* =========================================================
       RAYCAST
       ========================================================= */

    raycastExperiment(
        event
    ) {

        const width =
            window.innerWidth

        const height =
            window.innerHeight


        const mouse =
            new THREE.Vector2(

                (
                    event.clientX /
                    width
                ) * 2 - 1,

                -(
                    event.clientY /
                    height
                ) * 2 + 1

            )


        if (
            !this.camera
        ) {

            return null
        }


        this.raycaster.setFromCamera(
            mouse,
            this.camera
        )


        const objects = [

            ...this.slits.map(
                slit =>
                    slit.main
            ),

            this.screen

        ]


        const intersections =
            this.raycaster.intersectObjects(
                objects,
                true
            )


        if (
            intersections.length === 0
        ) {

            return null
        }


        return intersections[0]
    }


    /* =========================================================
       SET CAMERA
       ========================================================= */

    setCamera(
        camera
    ) {

        this.camera =
            camera
    }


    /* =========================================================
       SCREEN INTERACTION
       ========================================================= */

    interactWithScreen(
        point
    ) {

        if (
            !point
        ) {

            return
        }


        this.screenInteraction.copy(
            point
        )


        this.screenInteractionStrength =
            1


        this.createInteractionRipple(
            point
        )


        this.interferencePoints.forEach(
            (item) => {

                if (
                    !item ||
                    !item.position
                ) {

                    return
                }


                const distance =
                    Math.abs(
                        item.position.y -
                        point.y
                    )


                if (
                    distance < 0.45
                ) {

                    item.userData.life =
                        0
                }
            }
        )
    }


    /* =========================================================
       INTERACTION RIPPLE
       ========================================================= */

    createInteractionRipple(
        point
    ) {

        const geometry =
            new THREE.RingGeometry(
                0.05,
                0.075,
                32
            )


        const material =
            new THREE.MeshBasicMaterial({

                color: 0xffe5a3,

                transparent: true,

                opacity: 0.7,

                blending:
                    THREE.AdditiveBlending,

                depthWrite: false,

                side:
                    THREE.DoubleSide

            })


        const ripple =
            new THREE.Mesh(
                geometry,
                material
            )


        ripple.position.copy(
            point
        )


        ripple.rotation.y =
            Math.PI / 2


        ripple.userData.life =
            0


        this.experimentGroup.add(
            ripple
        )


        this.interactionRipples.push(
            ripple
        )
    }


    /* =========================================================
       UPDATE INTERACTION RIPPLES
       ========================================================= */

    updateInteractionRipples() {

        for (
            let i =
                this.interactionRipples.length - 1;
            i >= 0;
            i--
        ) {

            const ripple =
                this.interactionRipples[i]


            ripple.userData.life +=
                0.035


            const life =
                ripple.userData.life


            ripple.scale.set(
                1 + life * 4,
                1 + life * 4,
                1 + life * 4
            )


            ripple.material.opacity =
                0.7 *
                Math.max(
                    0,
                    1 - life
                )


            if (
                life >= 1
            ) {

                this.experimentGroup.remove(
                    ripple
                )


                ripple.geometry.dispose()

                ripple.material.dispose()


                this.interactionRipples.splice(
                    i,
                    1
                )
            }
        }
    }


    /* =========================================================
       UPDATE
       ========================================================= */

    update() {

        if (
            !this.active
        ) {

            return
        }


        if (
            this.paused
        ) {

            return
        }


        this.time +=
            this.simulationStep


        /* =====================================================
           EMISSION ANGLE
           ===================================================== */

        this.emissionAngle =
            THREE.MathUtils.lerp(
                this.emissionAngle,
                this.targetEmissionAngle,
                0.08
            )


        /* =====================================================
           CONTINUOUS EMISSION
           ===================================================== */

        if (
            this.emissionMode ===
                'continuous' &&
            this.emissionEnabled
        ) {

            this.spawnTimer +=
                this.simulationStep


            if (
                this.spawnTimer >=
                this.spawnInterval
            ) {

                this.spawnTimer =
                    0

                this.spawnPhoton()
            }
        }


        /* =====================================================
           PHOTONS
           ===================================================== */

        this.updatePhotons()


        /* =====================================================
           TRAILS
           ===================================================== */

        this.updatePhotonTrails()


        /* =====================================================
           DETECTIONS
           ===================================================== */

        this.updateDetectionVisuals()


        /* =====================================================
           INTERACTION
           ===================================================== */

        this.updateInteractionRipples()


        this.screenInteractionStrength =
            Math.max(
                0,
                this.screenInteractionStrength -
                0.035
            )


        /* =====================================================
           SOURCE PULSE
           ===================================================== */

        this.emissionPulse =
            Math.max(
                0,
                this.emissionPulse -
                0.08
            )


        this.sourceFlashStrength =
            Math.max(
                0,
                this.sourceFlashStrength -
                0.09
            )


        /* =====================================================
           SOURCE BODY
           ===================================================== */

        if (
            this.sourceBody
        ) {

            const pulse =
                1 +
                Math.sin(
                    this.time * 3
                ) *
                0.018


            this.sourceBody.scale.set(
                1,
                pulse,
                pulse
            )
        }


        /* =====================================================
           APERTURE
           ===================================================== */

        if (
            this.sourceAperture
        ) {

            const pulse =
                1 +
                Math.sin(
                    this.time * 7
                ) *
                0.08 +
                this.emissionPulse *
                0.25


            this.sourceAperture.scale.set(
                pulse,
                pulse,
                pulse
            )


            this.sourceAperture.material.opacity =
                0.72 +
                this.emissionPulse *
                0.28
        }


        /* =====================================================
           CORE
           ===================================================== */

        if (
            this.sourceCore
        ) {

            const pulse =
                1 +
                Math.sin(
                    this.time * 10
                ) *
                0.12 +
                this.emissionPulse *
                0.45


            this.sourceCore.scale.set(
                pulse,
                pulse,
                pulse
            )
        }


        /* =====================================================
           INNER GLOW
           ===================================================== */

        if (
            this.sourceGlow
        ) {

            const glow =
                1 +
                Math.sin(
                    this.time * 4
                ) *
                0.12 +
                this.emissionPulse *
                0.5


            this.sourceGlow.scale.set(
                glow,
                glow,
                glow
            )


            this.sourceGlow.material.opacity =
                0.055 +
                Math.sin(
                    this.time * 4
                ) *
                0.015 +
                this.emissionPulse *
                0.06
        }


        /* =====================================================
           OUTER AURA
           ===================================================== */

        if (
            this.sourceOuterGlow
        ) {

            const glow =
                1 +
                Math.sin(
                    this.time * 2
                ) *
                0.12 +
                this.emissionPulse *
                0.7


            this.sourceOuterGlow.scale.set(
                glow,
                glow,
                glow
            )


            this.sourceOuterGlow.material.opacity =
                0.018 +
                this.emissionPulse *
                0.045
        }


        /* =====================================================
           ENERGY RINGS
           ===================================================== */

        if (
            this.sourceEnergyRings
        ) {

            this.sourceEnergyRings.forEach(
                (ring, index) => {

                    if (
                        !ring
                    ) {

                        return
                    }


                    ring.rotation.x +=
                        0.002 +
                        index * 0.001


                    ring.rotation.z +=
                        0.004 +
                        index * 0.001


                    const pulse =
                        1 +
                        Math.sin(
                            this.time *
                            (
                                3 +
                                index
                            )
                        ) *
                        0.035 +
                        this.emissionPulse *
                        (
                            0.08 -
                            index * 0.015
                        )


                    ring.scale.set(
                        pulse,
                        pulse,
                        pulse
                    )


                    ring.material.opacity =
                        (
                            0.28 -
                            index * 0.06
                        ) +
                        this.emissionPulse *
                        0.18
                }
            )
        }


        /* =====================================================
           FLASH
           ===================================================== */

        if (
            this.sourceFlash
        ) {

            const flashScale =
                0.85 +
                this.sourceFlashStrength *
                0.55


            this.sourceFlash.scale.set(
                flashScale,
                flashScale,
                flashScale
            )


            this.sourceFlash.material.opacity =
                this.sourceFlashStrength *
                0.42
        }


        /* =====================================================
           SOURCE RIM
           ===================================================== */

        if (
            this.sourceRim
        ) {

            this.sourceRim.rotation.z +=
                0.004


            this.sourceRim.material.opacity =
                0.45 +
                this.emissionPulse *
                0.25
        }


        /* =====================================================
           BEAM GUIDE
           ===================================================== */

        if (
            this.sourceBeam
        ) {

            this.sourceBeam.material.opacity =
                0.045 +
                Math.sin(
                    this.time * 3
                ) *
                0.012 +
                this.emissionPulse *
                0.025


            this.sourceBeam.rotation.z =
                this.emissionAngle
        }


        /* =====================================================
           SOURCE LINE
           ===================================================== */

        if (
            this.sourceLine
        ) {

            this.sourceLine.rotation.z =
                this.emissionAngle
        }


        /* =====================================================
           SCREEN GLOW
           ===================================================== */

        if (
            this.screenGlow
        ) {

            this.screenGlow.material.opacity =
                0.018 +
                Math.sin(
                    this.time * 2.5
                ) *
                0.006 +
                this.screenInteractionStrength *
                0.10
        }


        /* =====================================================
           SCREEN FRAME
           ===================================================== */

        if (
            this.screenFrame
        ) {

            this.screenFrame.material.opacity =
                0.42 +
                this.screenInteractionStrength *
                0.25
        }


        /* =====================================================
           SLIT GLOW
           ===================================================== */

        if (
            this.slits
        ) {

            this.slits.forEach(
                (slit) => {

                    if (
                        !slit ||
                        !slit.glow
                    ) {

                        return
                    }


                    if (
                        slit.main.material.opacity >
                        0.5
                    ) {

                        slit.glow.material.opacity =
                            0.08 +
                            Math.sin(
                                this.time * 4
                            ) *
                            0.025
                    }

                }
            )
        }
    }


    /* =========================================================
       START
       ========================================================= */

    start() {

        this.active =
            true

        this.paused =
            false


        this.resetExperiment()


        this.group.visible =
            true
    }


    /* =========================================================
       STOP
       ========================================================= */

    stop() {

        this.active =
            false

        this.paused =
            false


        this.group.visible =
            false


        this.clearPhotons()

        this.clearPhotonTrails()

        this.clearInteractionRipples()
    }


    /* =========================================================
       CLEAR PHOTONS
       ========================================================= */

    clearPhotons() {

        this.photons.forEach(
            (photon) => {

                this.experimentGroup.remove(
                    photon
                )


                if (
                    photon.geometry
                ) {

                    photon.geometry.dispose()
                }


                if (
                    photon.material
                ) {

                    photon.material.dispose()
                }
            }
        )


        this.photons = []
    }


    /* =========================================================
       CLEAR TRAILS
       ========================================================= */

    clearPhotonTrails() {

        this.photonTrails.forEach(
            (trail) => {

                this.experimentGroup.remove(
                    trail
                )


                if (
                    trail.geometry
                ) {

                    trail.geometry.dispose()
                }


                if (
                    trail.material
                ) {

                    trail.material.dispose()
                }
            }
        )


        this.photonTrails = []
    }


    /* =========================================================
       CLEAR RIPPLE
       ========================================================= */

    clearInteractionRipples() {

        this.interactionRipples.forEach(
            (ripple) => {

                this.experimentGroup.remove(
                    ripple
                )


                if (
                    ripple.geometry
                ) {

                    ripple.geometry.dispose()
                }


                if (
                    ripple.material
                ) {

                    ripple.material.dispose()
                }
            }
        )


        this.interactionRipples = []
    }


    /* =========================================================
       CLEAR DETECTIONS
       ========================================================= */

    clearDetections() {

        this.interferencePoints.forEach(
            (point) => {

                this.experimentGroup.remove(
                    point
                )


                if (
                    point.geometry
                ) {

                    point.geometry.dispose()
                }


                if (
                    point.material
                ) {

                    point.material.dispose()
                }
            }
        )


        this.interferencePoints = []


        if (
            this.pattern
        ) {

            this.pattern.visible =
                false

            this.pattern.material.opacity =
                0
        }
    }


    /* =========================================================
       GET STATS
       ========================================================= */

    getStats() {

        return {

            sent:
                this.photonCount,

            detected:
                this.detectedCount,

            activePhotons:
                this.photons.length,

            slitOne:
                this.slitOneOpen,

            slitTwo:
                this.slitTwoOpen,

            emissionMode:
                this.emissionMode,

            emissionEnabled:
                this.emissionEnabled,

            paused:
                this.paused,

            emissionAngle:
                this.emissionAngle

        }
    }


    /* =========================================================
       DESTROY
       ========================================================= */

    destroy() {

        window.removeEventListener(
            'pointerdown',
            this.handlePointerDown
        )

        window.removeEventListener(
            'pointermove',
            this.handlePointerMove
        )

        window.removeEventListener(
            'pointerup',
            this.handlePointerUp
        )

        window.removeEventListener(
            'dblclick',
            this.handleDoubleClick
        )

        window.removeEventListener(
            'keydown',
            this.handleKeyDown
        )


        this.clearPhotons()

        this.clearPhotonTrails()

        this.clearInteractionRipples()

        this.clearDetections()


        this.group.traverse(
            (object) => {

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
                            (material) => {

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


        if (
            this.group.parent
        ) {

            this.group.parent.remove(
                this.group
            )
        }


        this.active =
            false

        this.paused =
            false
    }
}