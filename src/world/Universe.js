import * as THREE from 'three'

import AwtaarCore from '../objects/AwtaarCore.js'
import Nebula from '../objects/Nebula.js'
import StarField from '../systems/StarField.js'
import CosmicStrings from '../objects/CosmicStrings.js'
import CosmicDust from '../objects/CosmicDust.js'
import EnergyThreads from '../objects/EnergyThreads.js'

import GalaxySystem from '../galaxies/GalaxySystem.js'


export default class Universe {

    constructor(scene) {

        this.scene =
            scene

        this.time =
            0


        // =========================================
        // المجموعة الرئيسية للكون
        // =========================================

        this.group =
            new THREE.Group()

        this.scene.add(
            this.group
        )


        // =========================================
        // النجوم
        // =========================================

        this.starField =
            new StarField(
                this.scene
            )


        // =========================================
        // السديم
        // =========================================

        this.nebula =
            new Nebula(
                this.scene
            )


        // =========================================
        // الغبار الكوني
        // =========================================

        this.cosmicDust =
            new CosmicDust()

        this.group.add(
            this.cosmicDust.points
        )


        // =========================================
        // خيوط الطاقة
        // =========================================

        this.energyThreads =
            new EnergyThreads()

        this.group.add(
            this.energyThreads.points
        )


        // =========================================
        // قلب أوتار
        // =========================================

        this.awtaarCore =
            new AwtaarCore()

        this.group.add(
            this.awtaarCore.mesh
        )


        // =========================================
        // الأوتار حول القلب
        // =========================================

        this.cosmicStrings =
            new CosmicStrings()

        this.awtaarCore.mesh.add(
            this.cosmicStrings.mesh
        )


        // =========================================
        // نظام المجرات
        // =========================================

        this.galaxySystem =
            new GalaxySystem()

        this.group.add(
            this.galaxySystem.group
        )

    }


    // =========================================
    // UPDATE
    // =========================================

    update(delta = 0) {

        // =======================================
        // الزمن الحقيقي
        // =======================================

        this.time += delta


        // =======================================
        // انجراف الكون
        // =======================================

        this.group.rotation.y +=
            delta * 0.024


        this.group.rotation.x =
            Math.sin(
                this.time * 0.2
            ) * 0.002


        // =======================================
        // النجوم
        // =======================================

        if (
            this.starField
        ) {

            this.starField.update()

        }


        // =======================================
        // السديم
        // =======================================

        if (
            this.nebula
        ) {

            this.nebula.update()

        }


        // =======================================
        // الغبار الكوني
        // =======================================

        if (
            this.cosmicDust
        ) {

            this.cosmicDust.update()

        }


        // =======================================
        // خيوط الطاقة
        // =======================================

        if (
            this.energyThreads
        ) {

            this.energyThreads.update()

        }


        // =======================================
        // النواة
        // =======================================

        if (
            this.awtaarCore
        ) {

            this.awtaarCore.update()

        }


        // =======================================
        // الأوتار
        // =======================================

        if (
            this.cosmicStrings
        ) {

            this.cosmicStrings.update()

        }


        // =======================================
        // المجرات
        // =======================================

        if (
            this.galaxySystem
        ) {

            this.galaxySystem.update()

        }

    }

}