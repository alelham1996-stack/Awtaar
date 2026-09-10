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


        // =========================================
        // REGISTER UNIVERSE ON SHARED SCENE
        // =========================================

        if (
            this.scene
        ) {

            this.scene.userData =
                this.scene.userData || {}

            this.scene.userData.awtaarUniverse =
                this

        }


        this.time =
            0


        // =========================================
        // EXPERIMENT MODE
        // =========================================

        this.experimentMode =
            false


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
    // HIDE AWTAAR BACKGROUND
    // =========================================

    hideAwtaarBackground() {

        // =======================================
        // النجوم
        // =======================================

        if (
            this.starField
        ) {

            /*
             * StarField is created directly in
             * the shared scene, therefore we hide
             * its actual object rather than touching
             * the experiment.
             */

            if (
                this.starField.points
            ) {

                this.starField.points.visible =
                    false

            }

            if (
                this.starField.group
            ) {

                this.starField.group.visible =
                    false

            }

            if (
                this.starField.mesh
            ) {

                this.starField.mesh.visible =
                    false

            }

        }


        // =======================================
        // السديم
        // =======================================

        if (
            this.nebula
        ) {

            if (
                this.nebula.points
            ) {

                this.nebula.points.visible =
                    false

            }

            if (
                this.nebula.group
            ) {

                this.nebula.group.visible =
                    false

            }

            if (
                this.nebula.mesh
            ) {

                this.nebula.mesh.visible =
                    false

            }

        }


        // =======================================
        // مجموعة الكون الرئيسية
        // =======================================

        /*
         * We DO NOT hide the entire group here.
         *
         * The experiment may be attached
         * to the same scene and must remain visible.
         *
         * Instead, hide only Awtaar's visual objects.
         */


        // =======================================
        // الغبار الكوني
        // =======================================

        if (
            this.cosmicDust?.points
        ) {

            this.cosmicDust.points.visible =
                false

        }


        // =======================================
        // خيوط الطاقة
        // =======================================

        if (
            this.energyThreads?.points
        ) {

            this.energyThreads.points.visible =
                false

        }


        // =======================================
        // قلب أوتار
        // =======================================

        if (
            this.awtaarCore?.mesh
        ) {

            this.awtaarCore.mesh.visible =
                false

        }


        // =======================================
        // المجرات
        // =======================================

        if (
            this.galaxySystem?.group
        ) {

            this.galaxySystem.group.visible =
                false

        }

    }


    // =========================================
    // SHOW AWTAAR BACKGROUND
    // =========================================

    showAwtaarBackground() {

        // =======================================
        // النجوم
        // =======================================

        if (
            this.starField
        ) {

            if (
                this.starField.points
            ) {

                this.starField.points.visible =
                    true

            }

            if (
                this.starField.group
            ) {

                this.starField.group.visible =
                    true

            }

            if (
                this.starField.mesh
            ) {

                this.starField.mesh.visible =
                    true

            }

        }


        // =======================================
        // السديم
        // =======================================

        if (
            this.nebula
        ) {

            if (
                this.nebula.points
            ) {

                this.nebula.points.visible =
                    true

            }

            if (
                this.nebula.group
            ) {

                this.nebula.group.visible =
                    true

            }

            if (
                this.nebula.mesh
            ) {

                this.nebula.mesh.visible =
                    true

            }

        }


        // =======================================
        // الغبار الكوني
        // =======================================

        if (
            this.cosmicDust?.points
        ) {

            this.cosmicDust.points.visible =
                true

        }


        // =======================================
        // خيوط الطاقة
        // =======================================

        if (
            this.energyThreads?.points
        ) {

            this.energyThreads.points.visible =
                true

        }


        // =======================================
        // قلب أوتار
        // =======================================

        if (
            this.awtaarCore?.mesh
        ) {

            this.awtaarCore.mesh.visible =
                true

        }


        // =======================================
        // المجرات
        // =======================================

        if (
            this.galaxySystem?.group
        ) {

            this.galaxySystem.group.visible =
                true

        }

    }


    // =========================================
    // EXPERIMENT MODE
    // =========================================

    setExperimentMode(
        enabled
    ) {

        this.experimentMode =
            Boolean(enabled)


        if (
            this.experimentMode
        ) {

            this.hideAwtaarBackground()

        }
        else {

            this.showAwtaarBackground()

        }

    }


    // =========================================
    // UPDATE
    // =========================================

    update(
        delta = 0
    ) {

        // =======================================
        // الزمن الحقيقي
        // =======================================

        this.time +=
            delta


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