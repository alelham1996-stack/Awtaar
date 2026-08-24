import * as THREE from 'three'


export default class Nebula {


    constructor(scene) {

        this.scene = scene

        this.createNebula()

    }



    createNebula() {


        const geometry = new THREE.BufferGeometry()


        const particleCount = 9000


        const positions = new Float32Array(
            particleCount * 3
        )


        const colors = new Float32Array(
            particleCount * 3
        )



        for(let i = 0; i < particleCount; i++) {


            const i3 = i * 3


            // زاوية الحلزون

            const angle =
                i * 0.02 +
                Math.random() * 0.5



            // المسافة من المركز

            const radius =
                Math.random() * 10 + 2



            // انحناء حلزوني

            const spiral =
                angle + radius * 0.15



            positions[i3] =
                Math.cos(spiral) * radius



            positions[i3 + 1] =
                (Math.random() - 0.5) *
                (radius * 0.25)



            positions[i3 + 2] =
                Math.sin(spiral) * radius



            // ألوان أوتار

            const gold =
                Math.random()


            if(gold > 0.25) {


                colors[i3] = 1.0
                colors[i3 + 1] = 0.65
                colors[i3 + 2] = 0.12


            }
            else {


                colors[i3] = 0.35
                colors[i3 + 1] = 0.22
                colors[i3 + 2] = 0.05


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

            size: 0.06,

            vertexColors: true,

            transparent: true,

            opacity: 0.45,

            blending:
                THREE.AdditiveBlending

        })



        this.mesh =
            new THREE.Points(
                geometry,
                material
            )


        this.mesh.rotation.x = 0.5


        this.scene.add(
            this.mesh
        )


    }



    update() {


        this.mesh.rotation.y += 0.0008

        this.mesh.rotation.z += 0.0002


    }


}