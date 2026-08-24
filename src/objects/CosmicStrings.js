import * as THREE from 'three'


export default class CosmicStrings {


    constructor() {

        this.time = 0

        /*
         * تم إيقاف الأوتار الخارجية.
         *
         * نحتفظ بالمجموعة حتى يبقى
         * Universe.js متوافقًا معها
         * بدون الحاجة إلى تعديل أي ملف آخر.
         */

        this.group = new THREE.Group()

        this.mesh = this.group

    }


    update() {

        /*
         * لا يوجد تأثير بصري هنا.
         */

        this.time += 0.01

    }


}