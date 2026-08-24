import * as THREE from 'three'


export default class CosmicDust {


    constructor() {


        this.time = 0


        this.createDust()


    }





    createDust() {


        const count = 900



        const geometry =
            new THREE.BufferGeometry()



        const positions = []

        const sizes = []




        for(
            let i = 0;
            i < count;
            i++
        ) {


            const radius =
                2 +
                Math.random() * 5



            const angle =
                Math.random() *
                Math.PI *
                2



            const height =
                (Math.random() - 0.5)
                * 3




            positions.push(

                Math.cos(angle) * radius,

                height,

                Math.sin(angle) * radius

            )



            sizes.push(

                Math.random()

            )


        }





        geometry.setAttribute(

            'position',

            new THREE.Float32BufferAttribute(

                positions,

                3

            )

        )





        geometry.setAttribute(

            'size',

            new THREE.Float32BufferAttribute(

                sizes,

                1

            )

        )





        const material =
            new THREE.PointsMaterial({

                color: 0xd9b45a,

                size: 0.025,

                transparent: true,

                opacity: 0.65,

                blending:
                THREE.AdditiveBlending

            })





        this.points =
            new THREE.Points(

                geometry,

                material

            )



    }






    update() {


        this.time += 0.01



        this.points.rotation.y += 0.001



        this.points.rotation.x =
            Math.sin(this.time * 0.3)
            * 0.001



        this.points.material.opacity =
            0.5 +
            Math.sin(this.time)
            * 0.15



    }


}