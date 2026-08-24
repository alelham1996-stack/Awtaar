export default class CameraSystem {


    constructor(camera) {


        this.camera = camera


        // نقطة البداية البعيدة

        this.startZ = 18

        this.targetZ = 5


        this.camera.position.z =
            this.startZ



        // التقدم

        this.progress = 0


        // مدة الحركة

        this.duration = 1



        this.finished = false


    }




    update() {


        if(!this.finished) {


            this.progress += 0.0025



            if(this.progress >= 1) {


                this.progress = 1

                this.finished = true


            }



            // Ease In Out

            const ease =
                this.easeInOut(
                    this.progress
                )



            this.camera.position.z =
                this.startZ +
                (
                    this.targetZ -
                    this.startZ
                )
                *
                ease



            // حركة كونية خفيفة

            this.camera.position.x =
                Math.sin(
                    this.progress * Math.PI
                )
                *
                0.25



            this.camera.rotation.y =
                Math.sin(
                    this.progress * Math.PI
                )
                *
                0.03



        }


    }




    easeInOut(t) {


        return t < 0.5

            ?

            2 * t * t

            :

            1 -
            Math.pow(
                -2 * t + 2,
                2
            )
            /
            2


    }



}