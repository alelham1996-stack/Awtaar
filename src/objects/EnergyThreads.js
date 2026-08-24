import * as THREE from 'three'


export default class EnergyThreads {


    constructor() {


        this.time = 0

        this.createThreads()


    }





    createThreads() {


        const count = 120


        const geometry =
            new THREE.BufferGeometry()



        const positions = []



        for(
            let i = 0;
            i < count;
            i++
        ) {



            const radius =
                1 +
                Math.random() * 1.8



            const angle =
                Math.random() *
                Math.PI *
                2



            const height =
                (Math.random() - 0.5)
                * 1.5




            positions.push(

                Math.cos(angle) * radius,

                height,

                Math.sin(angle) * radius

            )


        }





        geometry.setAttribute(

            'position',

            new THREE.Float32BufferAttribute(

                positions,

                3

            )

        )





        const material =
            new THREE.PointsMaterial({

                color: 0xffd27a,

                size: 0.035,

                transparent: true,

                opacity: 0.8,

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


        this.time += 0.02



        this.points.rotation.y += 0.004



        this.points.rotation.x =
            Math.sin(this.time * 0.5)
            * 0.002



        this.points.material.opacity =
            0.55 +
            Math.sin(this.time * 2)
            * 0.25



    }


}