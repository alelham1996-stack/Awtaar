import * as THREE from 'three'


export default class QuantumSuperposition {

    /*
     * =====================================================
     * QUANTUM SUPERPOSITION
     * AWTAAR INTERACTIVE EXPERIMENT
     * =====================================================
     *
     * الفكرة:
     *
     * النظام الكمي يوجد في حالتين محتملتين
     * في الوقت نفسه.
     *
     * حركة المؤشر تؤثر على المجال.
     *
     * النقر = قياس
     *
     * القياس يؤدي إلى انهيار الحالة
     * إلى حالة واحدة.
     *
     * =====================================================
     */

    constructor() {

        /*
         * =================================================
         * STATE
         * =================================================
         */

        this.active =
            false

        this.paused =
            false

        this.time =
            0

        this.measured =
            false

        this.measureTimer =
            0

        this.collapsedState =
            0


        /*
         * =================================================
         * MOUSE
         * =================================================
         */

        this.mouseX =
            0

        this.mouseY =
            0

        this.targetMouseX =
            0

        this.targetMouseY =
            0

        this.mouseInfluence =
            0


        /*
         * =================================================
         * INTERACTION
         * =================================================
         */

        this.interactionEnabled =
            true


        /*
         * =================================================
         * MAIN GROUP
         * =================================================
         */

        this.group =
            new THREE.Group()


        this.experimentGroup =
            new THREE.Group()


        this.group.add(
            this.experimentGroup
        )


        /*
         * =================================================
         * COMPONENTS
         * =================================================
         */

        this.probabilityCloud =
            null


        this.core =
            null


        this.coreGlow =
            null


        this.stateParticles =
            []


        this.stateOrbits =
            []


        this.waveRings =
            []


        this.energyThreads =
            []


        this.stateLabels =
            []


        /*
         * =================================================
         * COLORS — AWTAAR
         * =================================================
         */

        this.colors = {

            /*
             * ذهبي أوتار
             */

            gold:
                0xd6b56a,


            /*
             * ذهبي فاتح
             */

            goldBright:
                0xf1d99a,


            /*
             * لؤلؤي
             */

            pearl:
                0xf4ead2,


            /*
             * أبيض دافئ
             */

            white:
                0xfff9ec,


            /*
             * أسود كوني
             */

            black:
                0x050505,


            /*
             * ذهبي داكن
             */

            darkGold:
                0x8d6b2f

        }


        /*
         * =================================================
         * BUILD
         * =================================================
         */

        this.createEnvironment()

        this.createProbabilityCloud()

        this.createCore()

        this.createStateParticles()

        this.createStateOrbits()

        this.createWaveRings()

        this.createEnergyThreads()


        /*
         * =================================================
         * INTERACTION
         * =================================================
         */

        this.handlePointerMove =
            this.handlePointerMove.bind(
                this
            )


        this.handlePointerDown =
            this.handlePointerDown.bind(
                this
            )


        this.handleKeyDown =
            this.handleKeyDown.bind(
                this
            )


        window.addEventListener(
            'pointermove',
            this.handlePointerMove,
            { passive: true }
        )


        window.addEventListener(
            'pointerdown',
            this.handlePointerDown
        )


        window.addEventListener(
            'keydown',
            this.handleKeyDown
        )

    }


    /*
     * =====================================================
     * ENVIRONMENT
     * =====================================================
     */

    createEnvironment() {

        /*
         * منصة دائرية داكنة جدًا
         */

        const geometry =
            new THREE.CircleGeometry(
                7,
                96
            )


        const material =
            new THREE.MeshBasicMaterial({

                color:
                    this.colors.black,

                transparent:
                    true,

                opacity:
                    0.7,

                depthWrite:
                    false

            })


        const plane =
            new THREE.Mesh(
                geometry,
                material
            )


        plane.rotation.x =
            -Math.PI / 2


        plane.position.y =
            -3.0


        this.experimentGroup.add(
            plane
        )


        /*
         * دائرة ذهبية رفيعة جدًا
         */

        const ringGeometry =
            new THREE.RingGeometry(
                4.2,
                4.215,
                128
            )


        const ringMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    this.colors.gold,

                transparent:
                    true,

                opacity:
                    0.22,

                side:
                    THREE.DoubleSide,

                blending:
                    THREE.AdditiveBlending,

                depthWrite:
                    false

            })


        const ring =
            new THREE.Mesh(
                ringGeometry,
                ringMaterial
            )


        ring.rotation.x =
            -Math.PI / 2


        ring.position.y =
            -2.96


        this.experimentGroup.add(
            ring
        )

    }


    /*
     * =====================================================
     * PROBABILITY CLOUD
     * =====================================================
     */

    createProbabilityCloud() {

        const count =
            1100


        const positions =
            new Float32Array(
                count * 3
            )


        const sizes =
            new Float32Array(
                count
            )


        for (
            let i = 0;
            i < count;
            i++
        ) {

            /*
             * توزيع احتمالي دائري
             */

            const theta =
                Math.random() *
                Math.PI *
                2


            const phi =
                Math.acos(
                    2 * Math.random() - 1
                )


            const radius =
                Math.pow(
                    Math.random(),
                    0.62
                ) * 2.8


            const x =
                Math.sin(phi) *
                Math.cos(theta) *
                radius


            const y =
                Math.cos(phi) *
                radius


            const z =
                Math.sin(phi) *
                Math.sin(theta) *
                radius


            positions[i * 3] =
                x


            positions[i * 3 + 1] =
                y


            positions[i * 3 + 2] =
                z


            sizes[i] =
                0.5 +
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

                color:
                    this.colors.pearl,

                size:
                    0.045,

                transparent:
                    true,

                opacity:
                    0.38,

                blending:
                    THREE.AdditiveBlending,

                depthWrite:
                    false

            })


        this.probabilityCloud =
            new THREE.Points(
                geometry,
                material
            )


        this.experimentGroup.add(
            this.probabilityCloud
        )

    }


    /*
     * =====================================================
     * CORE
     * =====================================================
     */

    createCore() {

        /*
         * المركز
         */

        const geometry =
            new THREE.SphereGeometry(
                0.34,
                48,
                48
            )


        const material =
            new THREE.MeshBasicMaterial({

                color:
                    this.colors.pearl,

                transparent:
                    true,

                opacity:
                    0.98

            })


        this.core =
            new THREE.Mesh(
                geometry,
                material
            )


        this.experimentGroup.add(
            this.core
        )


        /*
         * الهالة
         */

        const glowGeometry =
            new THREE.SphereGeometry(
                0.78,
                48,
                48
            )


        const glowMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    this.colors.goldBright,

                transparent:
                    true,

                opacity:
                    0.13,

                blending:
                    THREE.AdditiveBlending,

                depthWrite:
                    false

            })


        this.coreGlow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            )


        this.core.add(
            this.coreGlow
        )

    }


    /*
     * =====================================================
     * STATE PARTICLES
     * =====================================================
     */

    createStateParticles() {

        /*
         * حالتان محتملتان
         */

        const stateCount =
            2


        for (
            let state = 0;
            state < stateCount;
            state++
        ) {

            const group =
                new THREE.Group()


            /*
             * الحالة الأولى يسار
             * الحالة الثانية يمين
             */

            group.position.x =
                state === 0
                    ? -2.6
                    : 2.6


            /*
             * لون الحالتين:
             *
             * الأولى:
             * ذهبي
             *
             * الثانية:
             * لؤلؤي
             */

            const color =
                state === 0
                    ? this.colors.gold
                    : this.colors.pearl


            /*
             * الجسيمات
             */

            for (
                let i = 0;
                i < 110;
                i++
            ) {

                const geometry =
                    new THREE.SphereGeometry(
                        0.018 +
                        Math.random() * 0.045,
                        8,
                        8
                    )


                const material =
                    new THREE.MeshBasicMaterial({

                        color:
                            color,

                        transparent:
                            true,

                        opacity:
                            0.35 +
                            Math.random() * 0.5,

                        blending:
                            THREE.AdditiveBlending,

                        depthWrite:
                            false

                    })


                const particle =
                    new THREE.Mesh(
                        geometry,
                        material
                    )


                const angle =
                    Math.random() *
                    Math.PI *
                    2


                const radius =
                    0.35 +
                    Math.random() *
                    1.15


                particle.position.x =
                    Math.cos(angle) *
                    radius


                particle.position.y =
                    (
                        Math.random() -
                        0.5
                    ) * 1.8


                particle.position.z =
                    Math.sin(angle) *
                    radius


                particle.userData.angle =
                    angle


                particle.userData.radius =
                    radius


                particle.userData.speed =
                    0.25 +
                    Math.random() *
                    0.8


                particle.userData.phase =
                    Math.random() *
                    Math.PI *
                    2


                group.add(
                    particle
                )

            }


            this.experimentGroup.add(
                group
            )


            this.stateParticles.push(
                group
            )

        }

    }


    /*
     * =====================================================
     * STATE ORBITS
     * =====================================================
     */

    createStateOrbits() {

        for (
            let state = 0;
            state < 2;
            state++
        ) {

            const geometry =
                new THREE.RingGeometry(
                    1.15,
                    1.17,
                    96
                )


            const material =
                new THREE.MeshBasicMaterial({

                    color:
                        state === 0
                            ? this.colors.gold
                            : this.colors.pearl,

                    transparent:
                        true,

                    opacity:
                        0.32,

                    side:
                        THREE.DoubleSide,

                    blending:
                        THREE.AdditiveBlending,

                    depthWrite:
                        false

                })


            const orbit =
                new THREE.Mesh(
                    geometry,
                    material
                )


            orbit.position.x =
                state === 0
                    ? -2.6
                    : 2.6


            orbit.rotation.x =
                Math.PI / 2


            orbit.rotation.z =
                state === 0
                    ? 0.25
                    : -0.25


            orbit.userData.state =
                state


            this.experimentGroup.add(
                orbit
            )


            this.stateOrbits.push(
                orbit
            )

        }

    }


    /*
     * =====================================================
     * WAVE RINGS
     * =====================================================
     */

    createWaveRings() {

        for (
            let i = 0;
            i < 7;
            i++
        ) {

            const radius =
                0.75 +
                i * 0.42


            const geometry =
                new THREE.RingGeometry(
                    radius,
                    radius + 0.012,
                    128
                )


            const material =
                new THREE.MeshBasicMaterial({

                    color:
                        i % 2 === 0
                            ? this.colors.gold
                            : this.colors.pearl,

                    transparent:
                        true,

                    opacity:
                        0.16 -
                        i * 0.014,

                    side:
                        THREE.DoubleSide,

                    blending:
                        THREE.AdditiveBlending,

                    depthWrite:
                        false

                })


            const ring =
                new THREE.Mesh(
                    geometry,
                    material
                )


            ring.rotation.x =
                Math.PI / 2


            ring.userData.offset =
                i * 0.55


            ring.userData.baseRadius =
                radius


            this.experimentGroup.add(
                ring
            )


            this.waveRings.push(
                ring
            )

        }

    }


    /*
     * =====================================================
     * ENERGY THREADS
     * =====================================================
     */

    createEnergyThreads() {

        for (
            let i = 0;
            i < 16;
            i++
        ) {

            const points =
                []


            const phase =
                Math.random() *
                Math.PI *
                2


            const height =
                3.8 +
                Math.random() *
                1.5


            for (
                let j = 0;
                j < 45;
                j++
            ) {

                const t =
                    j / 44


                const angle =
                    phase +
                    t *
                    Math.PI *
                    2


                const radius =
                    0.25 +
                    t * 2.8


                const x =
                    Math.cos(angle) *
                    radius


                const y =
                    (
                        t -
                        0.5
                    ) *
                    height


                const z =
                    Math.sin(angle) *
                    radius


                points.push(
                    new THREE.Vector3(
                        x,
                        y,
                        z
                    )
                )

            }


            const geometry =
                new THREE.BufferGeometry()
                    .setFromPoints(
                        points
                    )


            const material =
                new THREE.LineBasicMaterial({

                    color:
                        i % 3 === 0
                            ? this.colors.gold
                            : this.colors.pearl,

                    transparent:
                        true,

                    opacity:
                        0.07 +
                        Math.random() * 0.06,

                    blending:
                        THREE.AdditiveBlending,

                    depthWrite:
                        false

                })


            const line =
                new THREE.Line(
                    geometry,
                    material
                )


            line.userData.phase =
                phase


            line.userData.speed =
                0.08 +
                Math.random() *
                0.22


            this.experimentGroup.add(
                line
            )


            this.energyThreads.push(
                line
            )

        }

    }


    /*
     * =====================================================
     * POINTER MOVE
     * =====================================================
     */

    handlePointerMove(
        event
    ) {

        if (
            !this.active
        ) {

            return

        }


        /*
         * تحويل المؤشر إلى
         * -1 ... +1
         */

        this.targetMouseX =
            (
                event.clientX /
                window.innerWidth
            ) * 2 - 1


        this.targetMouseY =
            -(
                event.clientY /
                window.innerHeight
            ) * 2 + 1

    }


    /*
     * =====================================================
     * POINTER DOWN
     * =====================================================
     */

    handlePointerDown(
        event
    ) {

        if (
            !this.active ||
            this.paused ||
            !this.interactionEnabled
        ) {

            return

        }


        /*
         * لا نريد أن يؤدي الضغط
         * على أزرار الواجهة إلى القياس.
         */

        const target =
            event.target


        if (
            target &&
            typeof target.closest ===
            'function'
        ) {

            if (
                target.closest(
                    'button'
                ) ||
                target.closest(
                    'input'
                ) ||
                target.closest(
                    'a'
                )
            ) {

                return

            }

        }


        /*
         * إذا لم يتم القياس بعد:
         *
         * النقر = قياس
         */

        if (
            !this.measured
        ) {

            this.measure()

        }

    }


    /*
     * =====================================================
     * KEYBOARD
     * =====================================================
     */

    handleKeyDown(
        event
    ) {

        if (
            !this.active
        ) {

            return

        }


        /*
         * R = Reset
         */

        if (
            event.key === 'r' ||
            event.key === 'R'
        ) {

            this.reset()

        }


        /*
         * Space = Pause
         */

        if (
            event.code === 'Space'
        ) {

            event.preventDefault()

            this.togglePause()

        }

    }


    /*
     * =====================================================
     * START
     * =====================================================
     */

    start() {

        this.active =
            true

        this.paused =
            false

        this.time =
            0

        this.measureTimer =
            0

        this.measured =
            false


        /*
         * بداية عشوائية للحالة
         */

        this.collapsedState =
            Math.random() < 0.5
                ? 0
                : 1


        /*
         * إعادة كل شيء
         */

        this.resetVisualState()


        this.experimentGroup.visible =
            true

    }


    /*
     * =====================================================
     * STOP
     * =====================================================
     */

    stop() {

        this.active =
            false

        this.paused =
            false

        this.measured =
            false

        this.measureTimer =
            0


        if (
            this.experimentGroup
        ) {

            this.experimentGroup.visible =
                false

        }

    }


    /*
     * =====================================================
     * MEASURE
     * =====================================================
     */

    measure() {

        if (
            !this.active ||
            this.measured
        ) {

            return

        }


        this.measured =
            true


        this.measureTimer =
            0


        /*
         * =================================================
         * اختيار الحالة بناءً على المؤشر
         * =================================================
         *
         * إذا كان المؤشر أقرب إلى اليسار:
         * الحالة الأولى أكثر احتمالًا.
         *
         * إذا كان أقرب إلى اليمين:
         * الحالة الثانية أكثر احتمالًا.
         *
         */

        const leftInfluence =
            Math.max(
                0,
                -this.mouseX
            )


        const rightInfluence =
            Math.max(
                0,
                this.mouseX
            )


        const probabilityLeft =
            0.5 +
            leftInfluence * 0.25 -
            rightInfluence * 0.25


        this.collapsedState =
            Math.random() <
            probabilityLeft
                ? 0
                : 1

    }


    /*
     * =====================================================
     * UPDATE
     * =====================================================
     */

    update(
        delta = 0.016
    ) {

        if (
            !this.active ||
            this.paused
        ) {

            return

        }


        this.time +=
            delta


        /*
         * حركة سلسة للمؤشر
         */

        this.mouseX +=
            (
                this.targetMouseX -
                this.mouseX
            ) *
            Math.min(
                delta * 6,
                1
            )


        this.mouseY +=
            (
                this.targetMouseY -
                this.mouseY
            ) *
            Math.min(
                delta * 6,
                1
            )


        /*
         * شدة التأثير
         */

        this.mouseInfluence =
            Math.min(
                1,
                Math.sqrt(
                    this.mouseX *
                    this.mouseX +
                    this.mouseY *
                    this.mouseY
                )
            )


        /*
         * =================================================
         * SUPERPOSITION
         * =================================================
         */

        if (
            !this.measured
        ) {

            this.updateSuperposition(
                delta
            )

        }

        /*
         * =================================================
         * MEASUREMENT
         * =================================================
         */

        else {

            this.updateMeasurement(
                delta
            )

        }

    }


    /*
     * =====================================================
     * UPDATE SUPERPOSITION
     * =====================================================
     */

    updateSuperposition(
        delta
    ) {

        /*
         * =================================================
         * GLOBAL ROTATION
         * =================================================
         */

        this.experimentGroup.rotation.y +=
            delta * 0.035


        /*
         * تأثير الماوس
         */

        this.experimentGroup.rotation.x =
            THREE.MathUtils.lerp(
                this.experimentGroup.rotation.x,
                this.mouseY * 0.08,
                delta * 3
            )


        /*
         * =================================================
         * PROBABILITY CLOUD
         * =================================================
         */

        if (
            this.probabilityCloud
        ) {

            this.probabilityCloud.rotation.y +=
                delta * 0.14


            this.probabilityCloud.rotation.z +=
                delta * 0.035


            const pulse =
                1 +
                Math.sin(
                    this.time * 2
                ) * 0.055 +
                this.mouseInfluence * 0.08


            this.probabilityCloud.scale.set(
                pulse,
                pulse,
                pulse
            )


            this.probabilityCloud.material.opacity =
                0.34 +
                this.mouseInfluence * 0.12

        }


        /*
         * =================================================
         * CORE
         * =================================================
         */

        if (
            this.core
        ) {

            const pulse =
                1 +
                Math.sin(
                    this.time * 3.2
                ) * 0.07 +
                this.mouseInfluence * 0.09


            this.core.scale.set(
                pulse,
                pulse,
                pulse
            )


            this.core.position.x =
                this.mouseX * 0.12


            this.core.position.y =
                this.mouseY * 0.08

        }


        /*
         * =================================================
         * CORE GLOW
         * =================================================
         */

        if (
            this.coreGlow
        ) {

            const glowPulse =
                1 +
                Math.sin(
                    this.time * 2.4
                ) * 0.12 +
                this.mouseInfluence * 0.2


            this.coreGlow.scale.set(
                glowPulse,
                glowPulse,
                glowPulse
            )


            this.coreGlow.material.opacity =
                0.09 +
                this.mouseInfluence * 0.09

        }


        /*
         * =================================================
         * STATE PARTICLES
         * =================================================
         */

        this.stateParticles.forEach(
            (
                group,
                stateIndex
            ) => {

                const direction =
                    stateIndex === 0
                        ? 1
                        : -1


                group.rotation.y +=
                    delta *
                    0.25 *
                    direction


                /*
                 * الحالة اليسرى أو اليمنى
                 * تتفاعل مع الماوس.
                 */

                const stateInfluence =
                    stateIndex === 0
                        ? Math.max(
                            0,
                            -this.mouseX
                        )
                        : Math.max(
                            0,
                            this.mouseX
                        )


                const dynamicScale =
                    1 +
                    stateInfluence *
                    0.16


                group.scale.set(
                    dynamicScale,
                    dynamicScale,
                    dynamicScale
                )


                group.children.forEach(
                    (
                        particle
                    ) => {

                        const angle =
                            particle.userData.angle +
                            this.time *
                            particle.userData.speed


                        const radius =
                            particle.userData.radius +
                            Math.sin(
                                this.time * 1.4 +
                                particle.userData.phase
                            ) *
                            0.07


                        particle.position.x =
                            Math.cos(
                                angle
                            ) *
                            radius


                        particle.position.z =
                            Math.sin(
                                angle
                            ) *
                            radius


                        particle.position.y =
                            Math.sin(
                                this.time *
                                particle.userData.speed +
                                particle.userData.phase
                            ) *
                            0.6

                    }
                )

            }
        )


        /*
         * =================================================
         * STATE ORBITS
         * =================================================
         */

        this.stateOrbits.forEach(
            (
                orbit,
                index
            ) => {

                orbit.rotation.z +=
                    delta *
                    (
                        index === 0
                            ? 0.08
                            : -0.08
                    )


                const influence =
                    index === 0
                        ? Math.max(
                            0,
                            -this.mouseX
                        )
                        : Math.max(
                            0,
                            this.mouseX
                        )


                const scale =
                    1 +
                    influence *
                    0.22


                orbit.scale.set(
                    scale,
                    scale,
                    scale
                )


                orbit.material.opacity =
                    0.24 +
                    influence * 0.25

            }
        )


        /*
         * =================================================
         * WAVE RINGS
         * =================================================
         */

        this.waveRings.forEach(
            (
                ring,
                index
            ) => {

                const pulse =
                    1 +
                    Math.sin(
                        this.time * 1.5 +
                        ring.userData.offset
                    ) *
                    0.055


                ring.scale.set(
                    pulse,
                    pulse,
                    pulse
                )


                ring.rotation.z +=
                    delta *
                    (
                        index % 2 === 0
                            ? 0.05
                            : -0.05
                    )

            }
        )


        /*
         * =================================================
         * ENERGY THREADS
         * =================================================
         */

        this.energyThreads.forEach(
            (
                thread
            ) => {

                thread.rotation.y +=
                    delta *
                    thread.userData.speed


                thread.rotation.x =
                    Math.sin(
                        this.time * 0.25 +
                        thread.userData.phase
                    ) *
                    0.12


                /*
                 * الماوس يغير انحناء المجال
                 */

                thread.rotation.z =
                    this.mouseX *
                    0.025

            }
        )

    }


    /*
     * =====================================================
     * UPDATE MEASUREMENT
     * =====================================================
     */

    updateMeasurement(
        delta
    ) {

        this.measureTimer +=
            delta


        const progress =
            Math.min(
                this.measureTimer / 1.25,
                1
            )


        /*
         * Ease
         */

        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            )


        /*
         * =================================================
         * PROBABILITY CLOUD
         * =================================================
         */

        if (
            this.probabilityCloud &&
            this.probabilityCloud.material
        ) {

            this.probabilityCloud.material.opacity =
                0.34 *
                (
                    1 -
                    eased
                )

        }


        /*
         * =================================================
         * OTHER STATE
         * =================================================
         */

        const selected =
            this.collapsedState


        const other =
            selected === 0
                ? 1
                : 0


        if (
            this.stateParticles[other]
        ) {

            const scale =
                Math.max(
                    0.001,
                    1 - eased
                )


            this.stateParticles[other].scale.set(
                scale,
                scale,
                scale
            )


            this.stateParticles[other].children.forEach(
                (
                    particle
                ) => {

                    if (
                        particle.material
                    ) {

                        particle.material.opacity =
                            (
                                0.6 *
                                (1 - eased)
                            )

                    }

                }
            )

        }


        /*
         * =================================================
         * SELECTED STATE
         * =================================================
         */

        if (
            this.stateParticles[selected]
        ) {

            const scale =
                1 +
                eased *
                0.28


            this.stateParticles[selected].scale.set(
                scale,
                scale,
                scale
            )


            this.stateParticles[selected].rotation.y +=
                delta *
                0.45


            this.stateParticles[selected].children.forEach(
                (
                    particle
                ) => {

                    if (
                        particle.material
                    ) {

                        particle.material.opacity =
                            0.5 +
                            eased * 0.45

                    }

                }
            )

        }


        /*
         * =================================================
         * ORBITS
         * =================================================
         */

        this.stateOrbits.forEach(
            (
                orbit,
                index
            ) => {

                if (
                    index === selected
                ) {

                    orbit.scale.set(
                        1 +
                        eased * 0.3,
                        1 +
                        eased * 0.3,
                        1 +
                        eased * 0.3
                    )


                    orbit.material.opacity =
                        0.3 +
                        eased * 0.35

                }

                else {

                    orbit.material.opacity =
                        Math.max(
                            0,
                            0.3 *
                            (1 - eased)
                        )

                }

            }
        )


        /*
         * =================================================
         * WAVE COLLAPSE
         * =================================================
         */

        this.waveRings.forEach(
            (
                ring
            ) => {

                if (
                    ring.material
                ) {

                    ring.material.opacity =
                        Math.max(
                            0,
                            (
                                0.16 -
                                ring.userData.offset *
                                0.012
                            ) *
                            (
                                1 -
                                eased
                            )
                        )

                }

            }
        )


        /*
         * =================================================
         * CORE
         * =================================================
         */

        if (
            this.core
        ) {

            const pulse =
                1 +
                Math.sin(
                    this.time * 8
                ) *
                0.1 *
                eased


            this.core.scale.set(
                pulse,
                pulse,
                pulse
            )

        }


        /*
         * =================================================
         * GOLDEN FLASH
         * =================================================
         */

        if (
            this.coreGlow
        ) {

            const pulse =
                1 +
                eased *
                0.45


            this.coreGlow.scale.set(
                pulse,
                pulse,
                pulse
            )


            this.coreGlow.material.opacity =
                0.12 +
                eased * 0.16

        }


        /*
         * =================================================
         * ENERGY FIELD
         * =================================================
         */

        this.energyThreads.forEach(
            (
                thread
            ) => {

                thread.visible =
                    progress < 0.75

            }
        )


        /*
         * =================================================
         * AFTER COLLAPSE
         * =================================================
         */

        if (
            progress >= 1
        ) {

            this.energyThreads.forEach(
                (
                    thread
                ) => {

                    thread.visible =
                        false

                }
            )

        }

    }


    /*
     * =====================================================
     * TOGGLE PAUSE
     * =====================================================
     */

    togglePause() {

        this.paused =
            !this.paused

    }


    /*
     * =====================================================
     * RESET
     * =====================================================
     */

    reset() {

        this.measured =
            false

        this.measureTimer =
            0

        this.collapsedState =
            Math.random() < 0.5
                ? 0
                : 1


        this.resetVisualState()

    }


    /*
     * =====================================================
     * RESET VISUAL STATE
     * =====================================================
     */

    resetVisualState() {

        /*
         * Probability cloud
         */

        if (
            this.probabilityCloud
        ) {

            this.probabilityCloud.visible =
                true


            this.probabilityCloud.scale.set(
                1,
                1,
                1
            )


            if (
                this.probabilityCloud.material
            ) {

                this.probabilityCloud.material.opacity =
                    0.38

            }

        }


        /*
         * State particles
         */

        this.stateParticles.forEach(
            (
                group
            ) => {

                group.visible =
                    true


                group.scale.set(
                    1,
                    1,
                    1
                )


                group.children.forEach(
                    (
                        particle
                    ) => {

                        if (
                            particle.material
                        ) {

                            particle.material.opacity =
                                0.6

                        }

                    }
                )

            }
        )


        /*
         * Orbits
         */

        this.stateOrbits.forEach(
            (
                orbit
            ) => {

                orbit.visible =
                    true


                orbit.scale.set(
                    1,
                    1,
                    1
                )


                if (
                    orbit.material
                ) {

                    orbit.material.opacity =
                        0.32

                }

            }
        )


        /*
         * Wave rings
         */

        this.waveRings.forEach(
            (
                ring
            ) => {

                ring.visible =
                    true


                ring.scale.set(
                    1,
                    1,
                    1
                )


                if (
                    ring.material
                ) {

                    ring.material.opacity =
                        0.16

                }

            }
        )


        /*
         * Energy threads
         */

        this.energyThreads.forEach(
            (
                thread
            ) => {

                thread.visible =
                    true

            }
        )


        /*
         * Core
         */

        if (
            this.core
        ) {

            this.core.scale.set(
                1,
                1,
                1
            )

        }


        /*
         * Glow
         */

        if (
            this.coreGlow
        ) {

            this.coreGlow.scale.set(
                1,
                1,
                1
            )


            this.coreGlow.material.opacity =
                0.13

        }

    }


    /*
     * =====================================================
     * DESTROY
     * =====================================================
     */

    destroy() {

        /*
         * إزالة التفاعلات
         */

        window.removeEventListener(
            'pointermove',
            this.handlePointerMove
        )


        window.removeEventListener(
            'pointerdown',
            this.handlePointerDown
        )


        window.removeEventListener(
            'keydown',
            this.handleKeyDown
        )


        /*
         * إيقاف التجربة
         */

        this.stop()


        /*
         * التخلص من الموارد
         */

        this.experimentGroup.traverse(
            (
                object
            ) => {

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
                            (
                                material
                            ) => {

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


        /*
         * تنظيف المصفوفات
         */

        this.stateParticles =
            []

        this.stateOrbits =
            []

        this.waveRings =
            []

        this.energyThreads =
            []


        this.probabilityCloud =
            null


        this.core =
            null


        this.coreGlow =
            null


        /*
         * تنظيف المجموعة
         */

        this.group.clear()

    }

}