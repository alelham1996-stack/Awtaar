import * as THREE from 'three'


export default class StarField {


    constructor(scene) {

        this.scene = scene

        this.createStars()

    }



    createStars() {


        const geometry = new THREE.BufferGeometry()


        const starCount = 12000


        const positions = new Float32Array(
            starCount * 3
        )


        const colors = new Float32Array(
            starCount * 3
        )



        for(let i = 0; i < starCount; i++) {


            const i3 = i * 3


            // توزيع النجوم في الفضاء

            positions[i3] =
                (Math.random() - 0.5) * 250


            positions[i3 + 1] =
                (Math.random() - 0.5) * 250


            positions[i3 + 2] =
                (Math.random() - 0.5) * 250



            // بعض النجوم ذهبية وبعضها بيضاء

            const golden =
                Math.random() > 0.75



            if(golden) {


                colors[i3] = 1.0
                colors[i3 + 1] = 0.65
                colors[i3 + 2] = 0.1


            }
            else {


                colors[i3] = 1.0
                colors[i3 + 1] = 1.0
                colors[i3 + 2] = 1.0


            }


        }



        geometry.setAttribute(

            'position',

            new THREE.BufferAttribute(
                positions,
                3
            )

        )



        geometry.setAttribute(

            'color',

            new THREE.BufferAttribute(
                colors,
                3
            )

        )



        const material = new THREE.PointsMaterial({

            size: 0.07,

            vertexColors: true,

            transparent: true,

            opacity: 0.9

        })



        this.stars = new THREE.Points(

            geometry,

            material

        )



        this.scene.add(

            this.stars

        )


    }



    update() {


        this.stars.rotation.y += 0.0004


    }


}