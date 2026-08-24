import * as THREE from 'three'

import World from '../world/World.js'

import CameraSystem from '../systems/CameraSystem.js'

import LanguageSystem from '../systems/LanguageSystem.js'

import AwtaarIntro from '../ui/AwtaarIntro.js'

import PlatformUI from '../ui/PlatformUI.js'

import '../ui/platform.css'
import '../ui/exploration.css'
import '../ui/galaxies.css'


export default class Engine {

    constructor() {

        // =========================================
        // اللغة
        // =========================================

        this.languageSystem =
            new LanguageSystem()


        // =========================================
        // إنشاء المشهد
        // =========================================

        this.createScene()


        // =========================================
        // إنشاء الكاميرا
        // =========================================

        this.createCamera()


        // =========================================
        // إنشاء Renderer
        // =========================================

        this.createRenderer()


        // =========================================
        // الإضاءة
        // =========================================

        this.createLights()


        // =========================================
        // مقدمة أوتار
        // =========================================

        this.intro =
            new AwtaarIntro()


        // =========================================
        // واجهة المنصة
        // =========================================

        this.platformUI =
            new PlatformUI(
                this.scene,
                this.languageSystem
            )


        // =========================================
        // إخفاء المنصة أثناء المقدمة
        // =========================================

        this.platformUI.container.style.opacity =
            '0'

        this.platformUI.container.style.visibility =
            'hidden'

        this.platformUI.container.style.pointerEvents =
            'none'

        this.platformUI.container.style.transition =
            'opacity 1.2s ease, visibility 1.2s ease'


        // =========================================
        // نظام الكاميرا
        // =========================================

        this.cameraSystem =
            new CameraSystem(
                this.camera
            )


        // =========================================
        // إنشاء العالم
        // =========================================

        this.world =
            new World(
                this.scene
            )


        // =========================================
        // CLOCK
        // =========================================

        this.clock =
            new THREE.Clock()


        // =========================================
        // انتهاء المقدمة
        // =========================================

        window.addEventListener(

            'awtaar-ready',

            () => {

                this.awakenCore()


                // =====================================
                // إظهار واجهة المنصة
                // =====================================

                this.platformUI.container.style.visibility =
                    'visible'


                requestAnimationFrame(() => {

                    this.platformUI.container.style.opacity =
                        '1'

                    this.platformUI.container.style.pointerEvents =
                        'auto'

                })

            }

        )


        // =========================================
        // بدء المحرك
        // =========================================

        this.render()


        console.log(
            '🚀 Awtaar Engine Started'
        )

    }


    // =============================================
    // إيقاظ النواة
    // =============================================

    awakenCore() {

        if (
            this.world &&
            this.world.universe &&
            this.world.universe.awtaarCore
        ) {

            this.world.universe.awtaarCore.awaken()

        }

    }


    // =============================================
    // إنشاء المشهد
    // =============================================

    createScene() {

        this.scene =
            new THREE.Scene()


        this.scene.background =
            new THREE.Color(
                0x050510
            )

    }


    // =============================================
    // إنشاء الكاميرا
    // =============================================

    createCamera() {

        this.camera =
            new THREE.PerspectiveCamera(

                75,

                window.innerWidth /
                window.innerHeight,

                0.1,

                1000

            )


        this.camera.position.z =
            18

    }


    // =============================================
    // إنشاء Renderer
    // =============================================

    createRenderer() {

        this.renderer =
            new THREE.WebGLRenderer({

                antialias: true

            })


        this.renderer.setSize(

            window.innerWidth,

            window.innerHeight

        )


        this.renderer.setPixelRatio(

            Math.min(
                window.devicePixelRatio,
                2
            )

        )


        document.body.appendChild(

            this.renderer.domElement

        )

    }


    // =============================================
    // الإضاءة
    // =============================================

    createLights() {

        const light =
            new THREE.DirectionalLight(

                0xffffff,

                3

            )


        light.position.set(

            3,
            3,
            5

        )


        this.scene.add(
            light
        )


        const ambient =
            new THREE.AmbientLight(

                0xffffff,

                0.5

            )


        this.scene.add(
            ambient
        )

    }


    // =============================================
    // حلقة الرسم
    // =============================================

    render() {

        requestAnimationFrame(

            () => this.render()

        )


        // =========================================
        // الزمن الحقيقي بين الإطارات
        // =========================================

        const delta =
            Math.min(
                this.clock.getDelta(),
                0.05
            )


        // =========================================
        // تحديث الكاميرا
        // =========================================

        if (
            this.cameraSystem
        ) {

            this.cameraSystem.update()

        }


        // =========================================
        // تحديث العالم
        // =========================================

        if (
            this.world
        ) {

            this.world.update(
                delta
            )

        }


        // =========================================
        // تحديث واجهة المنصة
        //
        // مهم جدًا للتجارب التفاعلية
        // =========================================

        if (
            this.platformUI &&
            typeof this.platformUI.update ===
            'function'
        ) {

            this.platformUI.update(
                delta
            )

        }


        // =========================================
        // رسم المشهد
        // =========================================

        this.renderer.render(

            this.scene,

            this.camera

        )

    }

}