import Universe from './Universe.js'


export default class World {

    constructor(scene) {

        this.scene =
            scene

        this.universe =
            new Universe(
                this.scene
            )

    }


    // =========================================
    // UPDATE
    // =========================================

    update(delta = 0) {

        if (
            this.universe
        ) {

            this.universe.update(
                delta
            )

        }

    }

}