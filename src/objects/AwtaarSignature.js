import * as THREE from 'three'


export default class AwtaarSignature {


    constructor() {

        this.time = 0

        this.group = new THREE.Group()

        this.createInfinity()


    }


    createInfinity() {


        const material =
            new THREE.MeshBasicMaterial({

                color: 0xf4d38a,

                transparent: true,

                opacity: 0.82

            })


        /*
         * الخط الأول:
         * الحلقة اليسرى من رمز ∞
         */

        const leftCurve =
            new THREE.CubicBezierCurve3(

                new THREE.Vector3(0, 0, 0),

                new THREE.Vector3(-0.75, 0.95, 0),

                new THREE.Vector3(-1.55, -0.95, 0),

                new THREE.Vector3(0, 0, 0)

            )


        const leftGeometry =
            new THREE.TubeGeometry(

                leftCurve,

                64,

                0.012,

                8,

                false

            )


        const leftLine =
            new THREE.Mesh(

                leftGeometry,

                material

            )


        /*
         * الخط الثاني:
         * الحلقة اليمنى من رمز ∞
         */

        const rightCurve =
            new THREE.CubicBezierCurve3(

                new THREE.Vector3(0, 0, 0),

                new THREE.Vector3(0.75, 0.95, 0),

                new THREE.Vector3(1.55, -0.95, 0),

                new THREE.Vector3(0, 0, 0)

            )


        const rightGeometry =
            new THREE.TubeGeometry(

                rightCurve,

                64,

                0.012,

                8,

                false

            )


        const rightLine =
            new THREE.Mesh(

                rightGeometry,

                material

            )


        /*
         * نضع الخطين داخل المجموعة
         */

        this.group.add(leftLine)

        this.group.add(rightLine)


        /*
         * ميل بسيط لإعطاء إحساس ثلاثي الأبعاد
         */

        this.group.rotation.z = -0.08

        this.group.rotation.x = 0.12


        this.leftLine = leftLine

        this.rightLine = rightLine

        this.material = material


    }


    update() {


        this.time += 0.01


        /*
         * دوران هادئ جدًا
         */

        this.group.rotation.y += 0.002


        /*
         * نبض خفيف جدًا للضوء
         */

        this.material.opacity =
            0.72 +
            Math.sin(this.time * 2) * 0.08


    }


}