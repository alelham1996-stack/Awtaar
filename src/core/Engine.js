import * as THREE from 'three'

import World from '../world/World.js'

import CameraSystem from '../systems/CameraSystem.js'
import LanguageSystem from '../systems/LanguageSystem.js'
import AwtaarIntro from '../ui/AwtaarIntro.js'
import PlatformUI from '../ui/PlatformUI.js'

import AuthUI from '../auth/AuthUI.js'
import AuthService from '../auth/AuthService.js'

import '../ui/platform.css'
import '../ui/exploration.css'
import '../ui/galaxies.css'


export default class Engine {

    constructor() {

        /*
         * =====================================================
         * AUTH PREVIEW MODE
         * =====================================================
         *
         * افتح:
         *
         * http://localhost:5173/?auth=preview
         *
         * لرؤية شاشة تسجيل الدخول فقط.
         */

        this.authPreviewMode =
            new URLSearchParams(
                window.location.search
            ).get('auth') === 'preview'


        // =====================================================
        // LANGUAGE
        // =====================================================

        this.languageSystem =
            new LanguageSystem()


        // =====================================================
        // THREE.JS SCENE
        // =====================================================

        this.createScene()
        this.createCamera()
        this.createRenderer()
        this.createLights()


        // =====================================================
        // INTRO
        // =====================================================

        this.intro =
            new AwtaarIntro()


        // =====================================================
        // AUTH UI
        // =====================================================
        //
        // ننشئ AuthUI مرة واحدة فقط.
        // PlatformUI سيتواصل معه عن طريق الأحداث.
        //

        this.authUI =
            new AuthUI()


        // =====================================================
        // AUTH SERVICE
        // =====================================================

        this.authService =
            new AuthService()


        // =====================================================
        // AUTH STATE
        // =====================================================

        this.isAuthenticated =
            false

        this.authReady =
            false

        this.awtaarReady =
            false

        this.authSubscription =
            null


        // =====================================================
        // PLATFORM UI
        // =====================================================

        this.platformUI =
            new PlatformUI(
                this.scene,
                this.languageSystem
            )


        /*
         * في بداية التشغيل نخفي المنصة
         * إلى أن يصبح عالم أوتار جاهزًا.
         *
         * ملاحظة:
         * هذا لا علاقة له بتسجيل الدخول.
         */

        this.platformUI.container.style.opacity =
            '0'

        this.platformUI.container.style.visibility =
            'hidden'

        this.platformUI.container.style.pointerEvents =
            'none'

        this.platformUI.container.style.transition =
            'opacity 1.2s ease, visibility 1.2s ease'


        // =====================================================
        // CAMERA
        // =====================================================

        this.cameraSystem =
            new CameraSystem(
                this.camera
            )


        // =====================================================
        // WORLD
        // =====================================================

        this.world =
            new World(
                this.scene
            )


        // =====================================================
        // CLOCK
        // =====================================================

        this.clock =
            new THREE.Clock()


        // =====================================================
        // AUTH SUCCESS
        // =====================================================

        this.authSuccessHandler =
            (
                event
            ) => {

                const user =
                    event.detail?.user || null


                this.isAuthenticated =
                    Boolean(
                        user
                    )


                /*
                 * -------------------------------------------------
                 * تحديث مستخدم المنصة فورًا
                 * -------------------------------------------------
                 */

                if (
                    this.platformUI &&
                    typeof this.platformUI.setUser ===
                    'function'
                ) {

                    this.platformUI.setUser(
                        user
                    )

                }


                /*
                 * -------------------------------------------------
                 * إذا كنا في وضع المعاينة
                 * ونجح تسجيل الدخول:
                 *
                 * نخرج من وضع المعاينة.
                 * -------------------------------------------------
                 */

                if (
                    this.authPreviewMode &&
                    this.isAuthenticated
                ) {

                    this.authPreviewMode =
                        false


                    const cleanUrl =
                        window.location.origin +
                        window.location.pathname


                    window.history.replaceState(
                        {},
                        document.title,
                        cleanUrl
                    )

                }


                /*
                 * -------------------------------------------------
                 * إغلاق AuthUI فور نجاح الدخول
                 * -------------------------------------------------
                 */

                if (
                    this.isAuthenticated &&
                    this.authUI
                ) {

                    this.authUI.hide()

                }


                /*
                 * -------------------------------------------------
                 * تحديث المنصة فورًا
                 * -------------------------------------------------
                 */

                this.updateAccessState()

            }


        window.addEventListener(
            'awtaar-auth-success',
            this.authSuccessHandler
        )


        // =====================================================
        // OPEN AUTH EVENT
        // =====================================================
        //
        // PlatformUI لا ينشئ AuthUI جديدًا.
        // عندما يضغط المستخدم على تسجيل الدخول أو إنشاء حساب،
        // يرسل PlatformUI هذا الحدث، وEngine يفتح AuthUI
        // الرئيسي الموجود هنا.
        //

        this.openAuthHandler =
            (
                event
            ) => {

                if (
                    this.authPreviewMode
                ) {
                    return
                }


                if (
                    !this.authUI
                ) {
                    return
                }


                const mode =
                    event.detail?.mode || 'login'


                this.authUI.show()


                /*
                 * إذا طلب PlatformUI إنشاء حساب
                 */

                if (
                    mode === 'signup' &&
                    typeof this.authUI.showSignup ===
                    'function'
                ) {

                    this.authUI.showSignup()

                }

            }


        window.addEventListener(
            'awtaar-open-auth',
            this.openAuthHandler
        )


        // =====================================================
        // AUTH STATE CHANGE
        // =====================================================
        //
        // هذا مهم جدًا:
        //
        // Supabase يستطيع تغيير الجلسة مباشرة،
        // لذلك لا نحتاج إلى Reload.
        //

        this.awtaarAuthStateHandler =
            (
                event
            ) => {

                const session =
                    event.detail?.session || null


                const user =
                    event.detail?.user ||
                    session?.user ||
                    null


                this.isAuthenticated =
                    Boolean(
                        user ||
                        session
                    )


                if (
                    this.platformUI &&
                    typeof this.platformUI.setUser ===
                    'function'
                ) {

                    this.platformUI.setUser(
                        user
                    )

                }


                this.updateAccessState()

            }


        window.addEventListener(
            'awtaar-auth-state-change',
            this.awtaarAuthStateHandler
        )


        // =====================================================
        // AWTAAR READY
        // =====================================================

        this.awtaarReadyHandler =
            () => {

                this.awakenCore()

                this.awtaarReady =
                    true

                this.updateAccessState()

            }


        window.addEventListener(
            'awtaar-ready',
            this.awtaarReadyHandler
        )


        // =====================================================
        // AUTHENTICATION
        // =====================================================

        this.initializeAuthentication()


        // =====================================================
        // RENDER
        // =====================================================

        this.render()


        console.log(
            '🚀 Awtaar Engine Started'
        )

    }


    // =========================================================
    // AUTHENTICATION
    // =========================================================

    async initializeAuthentication() {

        /*
         * =====================================================
         * AUTH PREVIEW
         * =====================================================
         *
         * في وضع المعاينة:
         * لا نستخدم الجلسة الموجودة.
         * نعرض شاشة الدخول فقط.
         */

        if (
            this.authPreviewMode
        ) {

            console.log(
                '🌌 Awtaar Auth Preview Mode'
            )


            this.authReady =
                true

            this.isAuthenticated =
                false


            this.authUI.show()


            this.updateAccessState()


            return

        }


        // =====================================================
        // NORMAL MODE
        // =====================================================
        //
        // نقرأ الجلسة الموجودة إن وجدت.
        // لكن عدم وجود جلسة لا يمنع دخول المنصة.
        //

        try {

            const session =
                await this.authService.getSession()


            this.isAuthenticated =
                Boolean(
                    session
                )


            /*
             * تحديث مستخدم المنصة
             */

            if (
                this.platformUI &&
                typeof this.platformUI.setUser ===
                'function'
            ) {

                this.platformUI.setUser(
                    session?.user || null
                )

            }

        }
        catch (
            error
        ) {

            console.error(
                'Awtaar Auth: Failed to initialize session.',
                error
            )

            this.isAuthenticated =
                false

        }


        this.authReady =
            true


        // =====================================================
        // AUTH STATE LISTENER
        // =====================================================

        this.authSubscription =
            this.authService.onAuthStateChange(
                (
                    event,
                    session
                ) => {

                    /*
                     * ---------------------------------------------
                     * SIGNED OUT
                     * ---------------------------------------------
                     *
                     * تسجيل الخروج لا يعيد المستخدم إلى شاشة الدخول.
                     *
                     * يعود إلى المنصة كزائر.
                     */

                    if (
                        event ===
                        'SIGNED_OUT'
                    ) {

                        this.isAuthenticated =
                            false


                        if (
                            this.platformUI &&
                            typeof this.platformUI.setUser ===
                            'function'
                        ) {

                            this.platformUI.setUser(
                                null
                            )

                        }


                        /*
                         * إغلاق AuthUI إذا كان ظاهرًا
                         */

                        if (
                            this.authUI
                        ) {

                            this.authUI.hide()

                        }


                        /*
                         * إرسال حالة موحدة للواجهة
                         */

                        window.dispatchEvent(
                            new CustomEvent(
                                'awtaar-auth-state-change',
                                {
                                    detail: {
                                        user: null,
                                        session: null,
                                        authenticated: false
                                    }
                                }
                            )
                        )


                        this.updateAccessState()


                        return

                    }


                    /*
                     * ---------------------------------------------
                     * SIGNED IN
                     * ---------------------------------------------
                     */

                    if (
                        event ===
                        'SIGNED_IN'
                    ) {

                        this.isAuthenticated =
                            Boolean(
                                session
                            )


                        if (
                            this.platformUI &&
                            typeof this.platformUI.setUser ===
                            'function'
                        ) {

                            this.platformUI.setUser(
                                session?.user || null
                            )

                        }


                        if (
                            this.authUI
                        ) {

                            this.authUI.hide()

                        }


                        window.dispatchEvent(
                            new CustomEvent(
                                'awtaar-auth-state-change',
                                {
                                    detail: {
                                        user:
                                            session?.user || null,

                                        session:
                                            session || null,

                                        authenticated:
                                            Boolean(session)
                                    }
                                }
                            )
                        )


                        this.updateAccessState()


                        return

                    }


                    /*
                     * ---------------------------------------------
                     * INITIAL SESSION
                     * TOKEN REFRESH
                     * USER UPDATED
                     * ---------------------------------------------
                     */

                    if (
                        session
                    ) {

                        this.isAuthenticated =
                            true


                        if (
                            this.platformUI &&
                            typeof this.platformUI.setUser ===
                            'function'
                        ) {

                            this.platformUI.setUser(
                                session.user || null
                            )

                        }


                        window.dispatchEvent(
                            new CustomEvent(
                                'awtaar-auth-state-change',
                                {
                                    detail: {
                                        user:
                                            session.user || null,

                                        session:
                                            session,

                                        authenticated:
                                            true
                                    }
                                }
                            )
                        )


                        if (
                            this.authUI
                        ) {

                            this.authUI.hide()

                        }

                    }


                    this.updateAccessState()

                }
            )


        /*
         * =====================================================
         * INITIAL ACCESS UPDATE
         * =====================================================
         */

        this.updateAccessState()

    }


    // =========================================================
    // ACCESS STATE
    // =========================================================

    updateAccessState() {

        /*
         * =====================================================
         * AUTH PREVIEW
         * =====================================================
         *
         * المعاينة فقط هي الحالة التي تمنع ظهور المنصة.
         */

        if (
            this.authPreviewMode
        ) {

            this.platformUI.container.style.opacity =
                '0'

            this.platformUI.container.style.visibility =
                'hidden'

            this.platformUI.container.style.pointerEvents =
                'none'


            if (
                this.authUI
            ) {

                this.authUI.show()

            }


            return

        }


        // =====================================================
        // WAIT FOR AWTAAR
        // =====================================================
        //
        // ننتظر فقط حتى تصبح المنصة جاهزة.
        //
        // لا ننتظر تسجيل الدخول.
        //

        if (
            !this.awtaarReady
        ) {

            this.platformUI.container.style.opacity =
                '0'

            this.platformUI.container.style.visibility =
                'hidden'

            this.platformUI.container.style.pointerEvents =
                'none'


            return

        }


        // =====================================================
        // GUEST OR AUTHENTICATED
        // =====================================================
        //
        // كلاهما يدخل المنصة.
        //
        // الفرق فقط أن المستخدم المسجل سيملك ملفه الشخصي.
        //

        if (
            this.authUI
        ) {

            this.authUI.hide()

        }


        this.platformUI.container.style.visibility =
            'visible'


        requestAnimationFrame(
            () => {

                this.platformUI.container.style.opacity =
                    '1'

                this.platformUI.container.style.pointerEvents =
                    'auto'

            }
        )

    }


    // =========================================================
    // AWTAAR CORE
    // =========================================================

    awakenCore() {

        if (
            this.world &&
            this.world.universe &&
            this.world.universe.awtaarCore
        ) {

            this.world.universe.awtaarCore.awaken()

        }

    }


    // =========================================================
    // SCENE
    // =========================================================

    createScene() {

        this.scene =
            new THREE.Scene()


        this.scene.background =
            new THREE.Color(
                0x050510
            )

    }


    // =========================================================
    // CAMERA
    // =========================================================

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


        this.scene.userData =
            this.scene.userData || {}


        this.scene.userData.camera =
            this.camera

    }


    // =========================================================
    // RENDERER
    // =========================================================

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


    // =========================================================
    // LIGHTS
    // =========================================================

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


    // =========================================================
    // RENDER LOOP
    // =========================================================

    render() {

        requestAnimationFrame(
            () => this.render()
        )


        const delta =
            Math.min(
                this.clock.getDelta(),
                0.05
            )


        // -----------------------------------------------------
        // CAMERA
        // -----------------------------------------------------

        if (
            this.cameraSystem
        ) {

            this.cameraSystem.update()

        }


        // -----------------------------------------------------
        // WORLD
        // -----------------------------------------------------

        if (
            this.world
        ) {

            this.world.update(
                delta
            )

        }


        // -----------------------------------------------------
        // PLATFORM UI
        // -----------------------------------------------------

        if (
            this.platformUI &&
            typeof this.platformUI.update ===
            'function'
        ) {

            this.platformUI.update(
                delta
            )

        }


        // -----------------------------------------------------
        // RENDER
        // -----------------------------------------------------

        this.renderer.render(
            this.scene,
            this.camera
        )

    }


    // =========================================================
    // DESTROY
    // =========================================================

    destroy() {

        /*
         * إزالة أحداث المصادقة
         */

        if (
            this.authSuccessHandler
        ) {

            window.removeEventListener(
                'awtaar-auth-success',
                this.authSuccessHandler
            )

        }


        if (
            this.openAuthHandler
        ) {

            window.removeEventListener(
                'awtaar-open-auth',
                this.openAuthHandler
            )

        }


        if (
            this.awtaarAuthStateHandler
        ) {

            window.removeEventListener(
                'awtaar-auth-state-change',
                this.awtaarAuthStateHandler
            )

        }


        if (
            this.awtaarReadyHandler
        ) {

            window.removeEventListener(
                'awtaar-ready',
                this.awtaarReadyHandler
            )

        }


        /*
         * إلغاء اشتراك Supabase
         */

        if (
            this.authSubscription
        ) {

            this.authService.unsubscribe(
                this.authSubscription
            )

            this.authSubscription =
                null

        }


        /*
         * تدمير AuthUI
         */

        if (
            this.authUI &&
            typeof this.authUI.destroy ===
            'function'
        ) {

            this.authUI.destroy()

        }


        /*
         * تدمير PlatformUI
         */

        if (
            this.platformUI &&
            typeof this.platformUI.destroy ===
            'function'
        ) {

            this.platformUI.destroy()

        }


        /*
         * إزالة renderer
         */

        if (
            this.renderer &&
            this.renderer.domElement
        ) {

            this.renderer.domElement.remove()

        }

    }

}