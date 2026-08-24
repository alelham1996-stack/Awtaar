import * as THREE from 'three'

import Galaxy from './Galaxy.js'


export default class GalaxySystem {

    constructor() {

        this.time = 0

        this.group =
            new THREE.Group()

        /*
         * المجرات ستتم إضافتها لاحقًا
         *
         * حاليًا نترك النظام جاهزًا
         * بدون إظهار مجرة داخل الكون الرئيسي.
         */

        this.createGalaxies()

    }


    createGalaxies() {

        /*
         * لا ننشئ أي مجرة الآن.
         *
         * المجرات ستظهر لاحقًا داخل
         * نظام المجرات الخاص بالمنصة.
         */

    }


    update() {

        this.time += 0.01


        /*
         * دوران النظام
         */

        this.group.rotation.y += 0.001


        /*
         * تحديث المجرات
         * عندما تتم إضافتها لاحقًا.
         */

        if(this.physicsGalaxy) {

            this.physicsGalaxy.update()

        }

    }

}