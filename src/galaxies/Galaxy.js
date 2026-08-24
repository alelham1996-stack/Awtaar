import * as THREE from 'three'


export default class Galaxy {


    constructor(options = {}) {


        this.name =
            options.name || "Unknown"



        this.color =
            options.color || 0xffffff



        this.position =
            options.position ||
            new THREE.Vector3()





        this.createGalaxy()



    }






    createGalaxy() {



        const geometry =
            new THREE.BufferGeometry()



        const positions = []



        const count = 400



        for(
            let i = 0;
            i < count;
            i++
        ) {



            const radius =
                Math.random() * 1.5



            const angle =
                Math.random()
                *
                Math.PI
                *
                2





            positions.push(

                Math.cos(angle)
                *
                radius,


                (Math.random()-0.5)
                *
                0.3,


                Math.sin(angle)
                *
                radius

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

                color: this.color,

                size: 0.02,

                transparent: true,

                opacity: 0.8,

                blending:
                THREE.AdditiveBlending

            })





        this.mesh =
            new THREE.Points(

                geometry,

                material

            )



        this.mesh.position.copy(

            this.position

        )


    }





    update() {


        this.mesh.rotation.y += 0.002


    }


}