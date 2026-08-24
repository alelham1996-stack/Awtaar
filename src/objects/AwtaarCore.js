import * as THREE from 'three'


export default class AwtaarCore {


    constructor() {

        this.time = 0

        // قوة الاستيقاظ
        this.awakening = 0

        // حالة نبضة الاستيقاظ
        this.awakeningPulse = 0

        this.createCore()

        this.createEnergyShell()

        this.createGlow()

    }


    createCore() {

        const geometry =
            new THREE.IcosahedronGeometry(
                1,
                6
            )


        this.positionAttribute =
            geometry.attributes.position


        this.originalPositions = []


        for (
            let i = 0;
            i < this.positionAttribute.count;
            i++
        ) {

            this.originalPositions.push({

                x: this.positionAttribute.getX(i),

                y: this.positionAttribute.getY(i),

                z: this.positionAttribute.getZ(i)

            })

        }


        const material =
            new THREE.MeshStandardMaterial({

                color: 0x030201,

                roughness: 0.22,

                metalness: 0.9,

                emissive: 0x1a0b02,

                emissiveIntensity: 0.22

            })


        this.mesh =
            new THREE.Mesh(

                geometry,

                material

            )


        this.mesh.scale.set(
            1,
            1,
            1
        )

    }


    createEnergyShell() {

        const geometry =
            new THREE.IcosahedronGeometry(
                1.08,
                4
            )


        const material =
            new THREE.MeshBasicMaterial({

                color: 0xd49a32,

                transparent: true,

                opacity: 0.045,

                blending:
                    THREE.AdditiveBlending,

                depthWrite: false

            })


        this.shell =
            new THREE.Mesh(

                geometry,

                material

            )


        this.mesh.add(

            this.shell

        )

    }


    createGlow() {

        const geometry =
            new THREE.SphereGeometry(
                1.32,
                32,
                32
            )


        const material =
            new THREE.MeshBasicMaterial({

                color: 0xc88a28,

                transparent: true,

                opacity: 0.018,

                blending:
                    THREE.AdditiveBlending,

                depthWrite: false

            })


        this.glow =
            new THREE.Mesh(

                geometry,

                material

            )


        this.mesh.add(

            this.glow

        )


        // ضوء ذهبي خفيف داخل القلب

        this.coreLight =
            new THREE.PointLight(

                0xd49a32,

                0.45,

                4

            )


        this.coreLight.position.set(

            0,

            0,

            0

        )


        this.mesh.add(

            this.coreLight

        )

    }


    awaken() {

        // بداية نبضة الاستيقاظ

        this.awakening = 1

        this.awakeningPulse = 1

    }


    update() {

        this.time += 0.02


        /*
         * حركة سطح النواة
         */

        const positions =
            this.mesh.geometry.attributes.position


        for (
            let i = 0;
            i < positions.count;
            i++
        ) {

            const original =
                this.originalPositions[i]


            const wave =
                Math.sin(

                    this.time * 1.8 +

                    original.x * 5 +

                    original.y * 5 +

                    original.z * 5

                ) * 0.035


            positions.setXYZ(

                i,

                original.x +
                original.x * wave,

                original.y +
                original.y * wave,

                original.z +
                original.z * wave

            )

        }


        positions.needsUpdate = true


        this.mesh.geometry.computeVertexNormals()


        /*
         * دوران بطيء جدًا
         */

        this.mesh.rotation.y += 0.0012

        this.mesh.rotation.x += 0.0006


        /*
         * نبض طبيعي هادئ
         */

        const naturalPulse =
            1 +
            Math.sin(this.time * 1.2) * 0.008


        this.mesh.scale.set(

            naturalPulse,

            naturalPulse,

            naturalPulse

        )


        /*
         * نبضة الاستيقاظ
         */

        if (this.awakeningPulse > 0) {

            this.awakeningPulse -= 0.008


            if (this.awakeningPulse < 0) {

                this.awakeningPulse = 0

            }


            const pulse =
                Math.sin(
                    (1 - this.awakeningPulse)
                    *
                    Math.PI
                )


            this.shell.material.opacity =

                0.045 +

                pulse * 0.12


            this.glow.material.opacity =

                0.018 +

                pulse * 0.045


            this.mesh.material.emissiveIntensity =

                0.22 +

                pulse * 0.75


            this.coreLight.intensity =

                0.45 +

                pulse * 1.5

        }


        /*
         * بعد انتهاء الاستيقاظ
         * تعود الطاقة إلى مستوى هادئ
         */

        else {

            const breathing =
                Math.sin(
                    this.time * 1.2
                ) * 0.5 + 0.5


            this.shell.material.opacity =

                0.042 +
                breathing * 0.008


            this.glow.material.opacity =

                0.016 +
                breathing * 0.004


            this.mesh.material.emissiveIntensity =

                0.2 +
                breathing * 0.04


            this.coreLight.intensity =

                0.4 +
                breathing * 0.08

        }


        /*
         * حركة الهالة
         */

        const glowScale =

            1 +

            Math.sin(
                this.time * 1.1
            )
            *
            0.018


        this.glow.scale.set(

            glowScale,

            glowScale,

            glowScale

        )


        /*
         * حركة الغلاف
         */

        this.shell.rotation.y -= 0.0018

        this.shell.rotation.z += 0.0006

    }


}