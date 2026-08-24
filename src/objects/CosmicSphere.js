import * as THREE from 'three'

export default class CosmicSphere {

    constructor() {

        const geometry = new THREE.SphereGeometry(
            1,
            64,
            64
        )


        const material = new THREE.MeshStandardMaterial({

            color: 0xff0000,
            roughness: 0.4,
            metalness: 0.2

        })


        this.mesh = new THREE.Mesh(
            geometry,
            material
        )


        // سرعة دوران الجسم
        this.speed = 0.03

    }


update() {

    this.mesh.rotation.y += 0.03
    this.mesh.rotation.x += 0.02

    this.mesh.position.x =
        Math.sin(Date.now() * 0.002)

}

}