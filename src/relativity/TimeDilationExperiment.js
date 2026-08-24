import * as THREE from 'three'


export default class TimeDilationExperiment {

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

        /*
         * الزمن العام للتجربة.
         *
         * هذا ليس زمن الراصد أو المسافر،
         * بل زمن المحاكاة الداخلي.
         */

        this.time =
            0


        /*
         * Observer Time
         *
         * الزمن المقاس بواسطة الراصد
         * في الإطار المرجعي المختار.
         */

        this.observerTime =
            0


        /*
         * Proper Time
         *
         * الزمن الذي تقيسه ساعة المسافر
         * الموجودة مع المركبة.
         */

        this.properTime =
            0


        /* =====================================================
           RELATIVITY
           ===================================================== */

        /*
         * السرعة كنسبة من سرعة الضوء.
         *
         * 0.0 = سكون
         * 0.5 = 50% من c
         * 0.9 = 90% من c
         * 0.999 = اقتراب شديد من c
         */

        this.velocity =
            0.80


        /*
         * معامل لورنتز
         */

        this.gamma =
            this.calculateGamma(
                this.velocity
            )


        /* =====================================================
           MOUSE
           ===================================================== */

        this.mouseX =
            0

        this.mouseY =
            0

        this.targetMouseX =
            0

        this.targetMouseY =
            0


        this.mouseEnabled =
            true


        this.boundMouseMove =
            this.handleMouseMove.bind(this)


        window.addEventListener(
            'mousemove',
            this.boundMouseMove,
            { passive: true }
        )


        /* =====================================================
           THREE GROUP
           ===================================================== */

        this.group =
            new THREE.Group()

        this.group.name =
            'AwtaarTimeDilationExperiment'

        this.group.visible =
            false


        /* =====================================================
           WORLD
           ===================================================== */

        this.worldGroup =
            new THREE.Group()

        this.worldGroup.name =
            'TimeDilationWorld'

        this.group.add(
            this.worldGroup
        )


        /* =====================================================
           SHIP
           ===================================================== */

        this.shipGroup =
            new THREE.Group()

        this.shipGroup.name =
            'RelativityShip'

        this.group.add(
            this.shipGroup
        )


        /* =====================================================
           CLOCKS
           ===================================================== */

        this.clocksGroup =
            new THREE.Group()

        this.clocksGroup.name =
            'RelativityClocks'

        this.group.add(
            this.clocksGroup
        )


        /* =====================================================
           LIGHTING
           ===================================================== */

        this.lightsGroup =
            new THREE.Group()

        this.lightsGroup.name =
            'TimeDilationLights'

        this.group.add(
            this.lightsGroup
        )


        /* =====================================================
           REFERENCES
           ===================================================== */

        this.ship =
            null

        this.stars =
            null

        this.energyTrail =
            null

        this.observerClock =
            null

        this.travelerClock =
            null

        this.observerSecondHand =
            null

        this.observerMinuteHand =
            null

        this.travelerSecondHand =
            null

        this.travelerMinuteHand =
            null


        /* =====================================================
           INITIALIZE
           ===================================================== */

        this.createEnvironment()

        this.createLights()

        this.createStars()

        this.createPath()

        this.createShip()

        this.createClocks()

        this.createClockHands()

        this.updateRelativity()

    }


    /* =========================================================
       GAMMA
       ========================================================= */

    calculateGamma(velocity) {

        const v =
            THREE.MathUtils.clamp(
                velocity,
                0,
                0.999999
            )


        return (
            1 /
            Math.sqrt(
                1 - v * v
            )
        )

    }


    /* =========================================================
       RELATIVITY
       ========================================================= */

    updateRelativity() {

        this.gamma =
            this.calculateGamma(
                this.velocity
            )

    }


    /* =========================================================
       MOUSE
       ========================================================= */

    handleMouseMove(event) {

        if (
            !this.mouseEnabled
        ) {

            return

        }


        /*
         * Normalized coordinates:
         *
         * -1 = left / bottom
         * +1 = right / top
         */

        this.targetMouseX =
            (
                event.clientX /
                window.innerWidth
            ) *
            2 -
            1


        this.targetMouseY =
            -(
                (
                    event.clientY /
                    window.innerHeight
                ) *
                2 -
                1
            )

    }


    /* =========================================================
       ENVIRONMENT
       ========================================================= */

    createEnvironment() {

        const planeGeometry =
            new THREE.PlaneGeometry(
                42,
                20
            )


        const planeMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0x0b0b10,

                transparent:
                    true,

                opacity:
                    0.42,

                side:
                    THREE.DoubleSide

            })


        const plane =
            new THREE.Mesh(
                planeGeometry,
                planeMaterial
            )


        plane.rotation.x =
            -Math.PI / 2

        plane.position.y =
            -3


        this.worldGroup.add(
            plane
        )


        /* =====================================================
           GRID
           ===================================================== */

        const grid =
            new THREE.GridHelper(
                42,
                42,
                0x5f5542,
                0x211f25
            )


        grid.position.y =
            -2.96


        if (
            Array.isArray(
                grid.material
            )
        ) {

            grid.material.forEach(
                material => {

                    material.transparent =
                        true

                    material.opacity =
                        0.18

                }
            )

        }
        else {

            grid.material.transparent =
                true

            grid.material.opacity =
                0.18

        }


        this.worldGroup.add(
            grid
        )

    }


    /* =========================================================
       LIGHTS
       ========================================================= */

    createLights() {

        const ambient =
            new THREE.AmbientLight(
                0xf5ead0,
                1.6
            )


        this.lightsGroup.add(
            ambient
        )


        const keyLight =
            new THREE.DirectionalLight(
                0xf5ead0,
                2.2
            )


        keyLight.position.set(
            4,
            7,
            8
        )


        this.lightsGroup.add(
            keyLight
        )


        const fillLight =
            new THREE.PointLight(
                0xd8c8a6,
                12,
                20
            )


        fillLight.position.set(
            -5,
            2,
            4
        )


        this.lightsGroup.add(
            fillLight
        )

    }


    /* =========================================================
       STARS
       ========================================================= */

    createStars() {

        const count =
            520


        const geometry =
            new THREE.BufferGeometry()


        const positions =
            new Float32Array(
                count * 3
            )


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const index =
                i * 3


            positions[index] =
                (
                    Math.random() - 0.5
                ) * 42


            positions[index + 1] =
                (
                    Math.random() - 0.5
                ) * 20


            positions[index + 2] =
                (
                    Math.random() - 0.5
                ) * 8

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

                color:
                    0xf5ead0,

                size:
                    0.055,

                transparent:
                    true,

                opacity:
                    0.78,

                depthWrite:
                    false

            })


        this.stars =
            new THREE.Points(
                geometry,
                material
            )


        this.worldGroup.add(
            this.stars
        )

    }


    /* =========================================================
       PATH
       ========================================================= */

    createPath() {

        const points = [

            new THREE.Vector3(
                -18,
                -1.85,
                0
            ),

            new THREE.Vector3(
                18,
                -1.85,
                0
            )

        ]


        const geometry =
            new THREE.BufferGeometry()
                .setFromPoints(
                    points
                )


        const material =
            new THREE.LineBasicMaterial({

                color:
                    0xc7b894,

                transparent:
                    true,

                opacity:
                    0.32

            })


        this.path =
            new THREE.Line(
                geometry,
                material
            )


        this.worldGroup.add(
            this.path
        )


        /* =====================================================
           DISTANCE MARKERS
           ===================================================== */

        for (
            let i = -17;
            i <= 17;
            i++
        ) {

            const tickGeometry =
                new THREE.BufferGeometry()
                    .setFromPoints([

                        new THREE.Vector3(
                            i,
                            -1.85,
                            -0.03
                        ),

                        new THREE.Vector3(
                            i,
                            -1.58,
                            -0.03
                        )

                    ])


            const tickMaterial =
                new THREE.LineBasicMaterial({

                    color:
                        0xa99b7d,

                    transparent:
                        true,

                    opacity:
                        0.20

                })


            const tick =
                new THREE.Line(
                    tickGeometry,
                    tickMaterial
                )


            this.worldGroup.add(
                tick
            )

        }

    }


    /* =========================================================
       SHIP
       ========================================================= */

    createShip() {

        const ship =
            new THREE.Group()


        ship.name =
            'RelativityShipBody'


        /* =====================================================
           BODY
           ===================================================== */

        const bodyGeometry =
            new THREE.CapsuleGeometry(
                0.42,
                1.35,
                8,
                20
            )


        const bodyMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0xd8c8a6,

                metalness:
                    0.72,

                roughness:
                    0.22,

                emissive:
                    0x302719,

                emissiveIntensity:
                    0.55

            })


        const body =
            new THREE.Mesh(
                bodyGeometry,
                bodyMaterial
            )


        body.rotation.z =
            -Math.PI / 2


        ship.add(
            body
        )


        /* =====================================================
           NOSE
           ===================================================== */

        const noseGeometry =
            new THREE.ConeGeometry(
                0.42,
                0.82,
                32
            )


        const noseMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0xf5ead0,

                metalness:
                    0.80,

                roughness:
                    0.16,

                emissive:
                    0x292318,

                emissiveIntensity:
                    0.30

            })


        const nose =
            new THREE.Mesh(
                noseGeometry,
                noseMaterial
            )


        nose.rotation.z =
            -Math.PI / 2


        nose.position.x =
            1.05


        ship.add(
            nose
        )


        /* =====================================================
           ENGINE CORE
           ===================================================== */

        const engineGeometry =
            new THREE.SphereGeometry(
                0.20,
                24,
                24
            )


        const engineMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0xffdca0

            })


        const engine =
            new THREE.Mesh(
                engineGeometry,
                engineMaterial
            )


        engine.position.x =
            -1.02


        ship.add(
            engine
        )


        /* =====================================================
           ENGINE GLOW
           ===================================================== */

        const glowGeometry =
            new THREE.SphereGeometry(
                0.52,
                24,
                24
            )


        const glowMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0xffdca0,

                transparent:
                    true,

                opacity:
                    0.16,

                depthWrite:
                    false

            })


        const glow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            )


        glow.position.x =
            -1.02


        ship.add(
            glow
        )


        /* =====================================================
           SHIP POSITION
           ===================================================== */

        ship.position.set(
            -7,
            -1.0,
            0
        )


        this.shipGroup.add(
            ship
        )


        this.ship =
            ship


        /* =====================================================
           TRAIL
           ===================================================== */

        const trailPoints = []


        for (
            let i = 0;
            i < 38;
            i++
        ) {

            trailPoints.push(
                new THREE.Vector3(
                    -i * 0.20,
                    0,
                    0
                )
            )

        }


        const trailGeometry =
            new THREE.BufferGeometry()
                .setFromPoints(
                    trailPoints
                )


        const trailMaterial =
            new THREE.LineBasicMaterial({

                color:
                    0xffdca0,

                transparent:
                    true,

                opacity:
                    0.22

            })


        this.energyTrail =
            new THREE.Line(
                trailGeometry,
                trailMaterial
            )


        this.energyTrail.position.set(
            -7,
            -1.0,
            0
        )


        this.shipGroup.add(
            this.energyTrail
        )

    }


    /* =========================================================
       CLOCKS
       ========================================================= */

    createClocks() {

        this.observerClock =
            this.createClock(
                -7,
                1.25
            )


        this.travelerClock =
            this.createClock(
                7,
                1.25
            )


        this.clocksGroup.add(
            this.observerClock
        )


        this.clocksGroup.add(
            this.travelerClock
        )

    }


    /* =========================================================
       CREATE CLOCK
       ========================================================= */

    createClock(x, y) {

        const clock =
            new THREE.Group()


        /* =====================================================
           OUTER AURA
           ===================================================== */

        const auraGeometry =
            new THREE.RingGeometry(
                1.18,
                1.28,
                64
            )


        const auraMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0xcbbd9a,

                transparent:
                    true,

                opacity:
                    0.16,

                side:
                    THREE.DoubleSide

            })


        const aura =
            new THREE.Mesh(
                auraGeometry,
                auraMaterial
            )


        clock.add(
            aura
        )


        /* =====================================================
           RING
           ===================================================== */

        const ringGeometry =
            new THREE.RingGeometry(
                1.02,
                1.12,
                64
            )


        const ringMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0xd8c8a6,

                transparent:
                    true,

                opacity:
                    0.72,

                side:
                    THREE.DoubleSide

            })


        const ring =
            new THREE.Mesh(
                ringGeometry,
                ringMaterial
            )


        clock.add(
            ring
        )


        /* =====================================================
           FACE
           ===================================================== */

        const faceGeometry =
            new THREE.CircleGeometry(
                1.0,
                64
            )


        const faceMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0x08080d,

                side:
                    THREE.DoubleSide

            })


        const face =
            new THREE.Mesh(
                faceGeometry,
                faceMaterial
            )


        face.position.z =
            0.01


        clock.add(
            face
        )


        /* =====================================================
           TICKS
           ===================================================== */

        for (
            let i = 0;
            i < 12;
            i++
        ) {

            const angle =
                (
                    i / 12
                ) *
                Math.PI *
                2


            const tickGeometry =
                new THREE.BoxGeometry(
                    0.025,
                    0.14,
                    0.025
                )


            const tickMaterial =
                new THREE.MeshBasicMaterial({

                    color:
                        0xbeb08f

                })


            const tick =
                new THREE.Mesh(
                    tickGeometry,
                    tickMaterial
                )


            tick.position.x =
                Math.sin(angle) *
                0.82


            tick.position.y =
                Math.cos(angle) *
                0.82


            tick.rotation.z =
                -angle


            tick.position.z =
                0.035


            clock.add(
                tick
            )

        }


        /* =====================================================
           CENTER
           ===================================================== */

        const centerGeometry =
            new THREE.CircleGeometry(
                0.075,
                20
            )


        const centerMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0xf5ead0

            })


        const center =
            new THREE.Mesh(
                centerGeometry,
                centerMaterial
            )


        center.position.z =
            0.08


        clock.add(
            center
        )


        clock.position.set(
            x,
            y,
            0
        )


        return clock

    }


    /* =========================================================
       HANDS
       ========================================================= */

    createClockHands() {

        const observerHands =
            this.createHands()


        this.observerSecondHand =
            observerHands.second

        this.observerMinuteHand =
            observerHands.minute


        this.observerClock.add(
            observerHands.group
        )


        const travelerHands =
            this.createHands()


        this.travelerSecondHand =
            travelerHands.second

        this.travelerMinuteHand =
            travelerHands.minute


        this.travelerClock.add(
            travelerHands.group
        )

    }


    /* =========================================================
       CREATE HANDS
       ========================================================= */

    createHands() {

        const group =
            new THREE.Group()


        /* SECOND */

        const secondGeometry =
            new THREE.BoxGeometry(
                0.035,
                0.72,
                0.025
            )


        const secondMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0xf5ead0

            })


        const second =
            new THREE.Mesh(
                secondGeometry,
                secondMaterial
            )


        second.position.y =
            0.34


        group.add(
            second
        )


        /* MINUTE */

        const minuteGeometry =
            new THREE.BoxGeometry(
                0.065,
                0.52,
                0.03
            )


        const minuteMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0xa99b7d

            })


        const minute =
            new THREE.Mesh(
                minuteGeometry,
                minuteMaterial
            )


        minute.position.y =
            0.24


        group.add(
            minute
        )


        group.position.z =
            0.10


        return {

            group,

            second,

            minute

        }

    }


    /* =========================================================
       VELOCITY
       ========================================================= */

    setVelocity(value) {

        this.velocity =
            THREE.MathUtils.clamp(
                value,
                0,
                0.999
            )


        this.updateRelativity()

    }


    /* =========================================================
       DATA
       ========================================================= */

    getRelativityData() {

        return {

            velocity:
                this.velocity,

            gamma:
                this.gamma,

            observerTime:
                this.observerTime,

            properTime:
                this.properTime,

            /*
             * معدل مرور الزمن للمسافر
             * مقارنة بزمن الراصد.
             *
             * عند v = 0:
             * rate = 1
             *
             * عند v = 0.56c:
             * rate ≈ 0.828
             *
             * عند v → c:
             * rate → 0
             */

            timeRate:
                1 /
                this.gamma

        }

    }


    /* =========================================================
       CLOCK UPDATE
       ========================================================= */

    updateClocks(delta) {

        /*
         * =====================================================
         * OBSERVER CLOCK
         * =====================================================
         *
         * الراصد في الإطار المرجعي المختار.
         *
         * كل ثانية محاكاة = ثانية للراصد.
         */

        this.observerTime +=
            delta


        /*
         * =====================================================
         * TRAVELER CLOCK
         * =====================================================
         *
         * هذه هي النقطة الفيزيائية الأساسية.
         *
         * dτ = dt / γ
         *
         * وبالتالي لا نقسم الزمن الكامل على γ
         * في كل إطار.
         *
         * بل نضيف فقط الجزء الزمني الحالي:
         *
         * properTime += delta / gamma
         *
         * وهذا صحيح حتى أثناء تغيير السرعة
         * من خلال شريط التحكم.
         */

        const properDelta =
            delta /
            this.gamma


        this.properTime +=
            properDelta


        /*
         * =====================================================
         * OBSERVER SECOND HAND
         * =====================================================
         */

        if (
            this.observerSecondHand
        ) {

            this.observerSecondHand.rotation.z =
                -(
                    this.observerTime *
                    Math.PI *
                    2 /
                    60
                )

        }


        /*
         * =====================================================
         * OBSERVER MINUTE HAND
         * =====================================================
         */

        if (
            this.observerMinuteHand
        ) {

            this.observerMinuteHand.rotation.z =
                -(
                    this.observerTime *
                    Math.PI *
                    2 /
                    3600
                )

        }


        /*
         * =====================================================
         * TRAVELER SECOND HAND
         * =====================================================
         */

        if (
            this.travelerSecondHand
        ) {

            this.travelerSecondHand.rotation.z =
                -(
                    this.properTime *
                    Math.PI *
                    2 /
                    60
                )

        }


        /*
         * =====================================================
         * TRAVELER MINUTE HAND
         * =====================================================
         */

        if (
            this.travelerMinuteHand
        ) {

            this.travelerMinuteHand.rotation.z =
                -(
                    this.properTime *
                    Math.PI *
                    2 /
                    3600
                )

        }

    }


    /* =========================================================
       MOUSE INTERACTION
       ========================================================= */

    updateMouse(delta) {

        if (
            !this.ship
        ) {

            return

        }


        /*
         * Smooth mouse movement.
         */

        this.mouseX +=
            (
                this.targetMouseX -
                this.mouseX
            ) *
            Math.min(
                delta * 5,
                1
            )


        this.mouseY +=
            (
                this.targetMouseY -
                this.mouseY
            ) *
            Math.min(
                delta * 5,
                1
            )


        /*
         * The mouse controls the ship's
         * vertical position and slight depth.
         */

        const targetY =
            -1 +
            this.mouseY *
            1.15


        this.ship.position.y +=
            (
                targetY -
                this.ship.position.y
            ) *
            Math.min(
                delta * 5,
                1
            )


        /*
         * Mouse X adds a subtle steering
         * influence without replacing the
         * relativistic forward movement.
         */

        const steering =
            this.mouseX *
            0.55


        this.ship.rotation.z +=
            (
                -steering -
                this.ship.rotation.z
            ) *
            Math.min(
                delta * 4,
                1
            )


        /*
         * Slight depth movement.
         */

        this.ship.position.z =
            this.mouseX *
            0.55

    }


    /* =========================================================
       SHIP UPDATE
       ========================================================= */

    updateShip(delta) {

        if (
            !this.ship
        ) {

            return

        }


        /*
         * هذا مجرد مقياس بصري لحركة المركبة.
         *
         * لا نستخدمه لحساب الزمن النسبي.
         *
         * الفيزياء الزمنية تعتمد فقط على:
         *
         * velocity
         * gamma
         * observerTime
         * properTime
         */

        const visualSpeed =
            1.4 +
            this.velocity *
            5.5


        this.ship.position.x +=
            visualSpeed *
            delta


        /*
         * Keep the ship inside the visible
         * experimental corridor.
         */

        if (
            this.ship.position.x >
            9
        ) {

            this.ship.position.x =
                -9

        }


        /*
         * Engine animation.
         */

        const glow =
            this.ship.children[3]


        if (glow) {

            glow.scale.setScalar(
                1 +
                Math.sin(
                    this.time * 12
                ) *
                0.16
            )


            glow.material.opacity =
                0.12 +
                (
                    Math.sin(
                        this.time * 12
                    ) *
                    0.04
                )

        }


        /*
         * Engine core pulse.
         */

        const engine =
            this.ship.children[2]


        if (engine) {

            const scale =
                1 +
                Math.sin(
                    this.time * 14
                ) *
                0.12


            engine.scale.setScalar(
                scale
            )

        }


        /*
         * Trail animation.
         */

        if (
            this.energyTrail
        ) {

            this.energyTrail.position.x =
                this.ship.position.x


            this.energyTrail.position.y =
                this.ship.position.y


            this.energyTrail.position.z =
                this.ship.position.z


            this.energyTrail.material.opacity =
                0.14 +
                Math.sin(
                    this.time * 10
                ) *
                0.05

        }

    }


    /* =========================================================
       STARS UPDATE
       ========================================================= */

    updateStars(delta) {

        if (
            !this.stars
        ) {

            return

        }


        /*
         * Visual relativistic motion.
         *
         * هذا تأثير بصري فقط،
         * وليس جزءًا من حساب الزمن.
         */

        this.stars.rotation.y +=
            delta *
            (
                0.008 +
                this.velocity *
                0.055
            )

    }


    /* =========================================================
       WORLD MOTION
       ========================================================= */

    updateWorld(delta) {

        /*
         * Subtle forward movement of the
         * spacetime grid.
         */

        if (
            this.path
        ) {

            this.path.material.opacity =
                0.27 +
                Math.sin(
                    this.time * 1.5
                ) *
                0.04

        }

    }


    /* =========================================================
       UPDATE
       ========================================================= */

    update(delta) {

        if (
            !this.active ||
            this.paused
        ) {

            return

        }


        /*
         * Prevent huge jumps if the browser
         * tab was temporarily inactive.
         */

        const safeDelta =
            Math.min(
                delta,
                0.05
            )


        /*
         * Simulation time.
         */

        this.time +=
            safeDelta


        /*
         * Update Lorentz factor BEFORE
         * calculating the traveler's time.
         */

        this.updateRelativity()


        /*
         * Mouse interaction.
         */

        this.updateMouse(
            safeDelta
        )


        /*
         * Relativistic clocks.
         */

        this.updateClocks(
            safeDelta
        )


        /*
         * Visual ship movement.
         */

        this.updateShip(
            safeDelta
        )


        /*
         * Visual star motion.
         */

        this.updateStars(
            safeDelta
        )


        /*
         * Visual world motion.
         */

        this.updateWorld(
            safeDelta
        )

    }


    /* =========================================================
       START
       ========================================================= */

    start() {

        this.active =
            true

        this.paused =
            false

    }


    /* =========================================================
       PAUSE
       ========================================================= */

    pause() {

        if (
            !this.active
        ) {

            return

        }


        this.paused =
            true

    }


    /* =========================================================
       RESUME
       ========================================================= */

    resume() {

        if (
            !this.active
        ) {

            return

        }


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

    }


    /* =========================================================
       RESET
       ========================================================= */

    reset() {

        this.time =
            0

        this.observerTime =
            0

        this.properTime =
            0


        this.mouseX =
            0

        this.mouseY =
            0

        this.targetMouseX =
            0

        this.targetMouseY =
            0


        if (
            this.ship
        ) {

            this.ship.position.set(
                -7,
                -1,
                0
            )


            this.ship.rotation.set(
                0,
                0,
                0
            )

        }


        if (
            this.energyTrail
        ) {

            this.energyTrail.position.set(
                -7,
                -1,
                0
            )

        }


        if (
            this.observerSecondHand
        ) {

            this.observerSecondHand.rotation.z =
                0

        }


        if (
            this.observerMinuteHand
        ) {

            this.observerMinuteHand.rotation.z =
                0

        }


        if (
            this.travelerSecondHand
        ) {

            this.travelerSecondHand.rotation.z =
                0

        }


        if (
            this.travelerMinuteHand
        ) {

            this.travelerMinuteHand.rotation.z =
                0

        }


        /*
         * Recalculate gamma after reset
         * in case velocity was changed.
         */

        this.updateRelativity()

    }


    /* =========================================================
       ADD TO SCENE
       ========================================================= */

    addToScene(scene = null) {

        const target =
            scene ||
            this.scene


        if (!target) {

            console.warn(
                '⚠️ TimeDilationExperiment: Scene unavailable'
            )

            return

        }


        if (
            this.group.parent !==
            target
        ) {

            target.add(
                this.group
            )

        }

    }


    /* =========================================================
       REMOVE
       ========================================================= */

    removeFromScene(scene = null) {

        const target =
            scene ||
            this.scene


        if (!target) {

            return

        }


        target.remove(
            this.group
        )

    }


    /* =========================================================
       VISIBILITY
       ========================================================= */

    setVisible(visible) {

        this.group.visible =
            visible

    }


    /* =========================================================
       DESTROY
       ========================================================= */

    destroy() {

        this.stop()


        window.removeEventListener(
            'mousemove',
            this.boundMouseMove
        )


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


        this.ship =
            null

        this.stars =
            null

        this.energyTrail =
            null

        this.observerClock =
            null

        this.travelerClock =
            null

        this.observerSecondHand =
            null

        this.observerMinuteHand =
            null

        this.travelerSecondHand =
            null

        this.travelerMinuteHand =
            null

    }

}