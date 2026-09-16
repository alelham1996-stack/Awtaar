/* =========================================================
   AWTAAR — AUTH UI
   Supabase Authentication Interface
   ========================================================= */

import './auth.css'

import AuthService from './AuthService.js'

import {
    t,
    getLanguage
} from '../locales/i18n.js'


export default class AuthUI {

    constructor() {

        this.auth =
            new AuthService()

        this.container =
            null

        this.mode =
            'login'

        this.create()

    }


    /* =====================================================
       CREATE
       ===================================================== */

    create() {

        this.container =
            document.createElement('section')

        this.container.id =
            'awtaar-auth'

        this.container.className =
            'awtaar-auth'

        this.container.dir =
            getLanguage() === 'ar'
                ? 'rtl'
                : 'ltr'


        this.container.innerHTML = `

            <div class="awtaar-auth-background">

                <div class="awtaar-auth-glow"></div>

                <div class="awtaar-auth-particles"></div>

            </div>


            <div class="awtaar-auth-card">

                <div class="awtaar-auth-brand">

                    <div class="awtaar-auth-logo">
                        AWTAAR
                    </div>

                    <div
                        class="awtaar-auth-tagline"
                        data-auth-text="tagline"
                    >
                        رحلتك إلى المعرفة تبدأ هنا
                    </div>

                </div>


                <div class="awtaar-auth-tabs">

                    <button
                        type="button"
                        class="awtaar-auth-tab active"
                        data-auth-mode="login"
                    >
                        تسجيل الدخول
                    </button>

                    <button
                        type="button"
                        class="awtaar-auth-tab"
                        data-auth-mode="signup"
                    >
                        إنشاء حساب
                    </button>

                </div>


                <form
                    class="awtaar-auth-form"
                    novalidate
                >


                    <div
                        class="awtaar-auth-field signup-field"
                        data-signup-only
                    >

                        <label
                            for="awtaar-auth-username"
                            data-auth-text="username"
                        >
                            اسم المستخدم
                        </label>

                        <input
                            id="awtaar-auth-username"
                            type="text"
                            autocomplete="username"
                            maxlength="40"
                        >

                    </div>


                    <div class="awtaar-auth-field">

                        <label
                            for="awtaar-auth-email"
                            data-auth-text="email"
                        >
                            البريد الإلكتروني
                        </label>

                        <input
                            id="awtaar-auth-email"
                            type="email"
                            autocomplete="email"
                            required
                        >

                    </div>


                    <div class="awtaar-auth-field">

                        <label
                            for="awtaar-auth-password"
                            data-auth-text="password"
                        >
                            كلمة المرور
                        </label>

                        <input
                            id="awtaar-auth-password"
                            type="password"
                            autocomplete="current-password"
                            minlength="6"
                            required
                        >

                    </div>


                    <div
                        class="awtaar-auth-field signup-field"
                        data-signup-only
                    >

                        <label
                            for="awtaar-auth-confirm-password"
                            data-auth-text="confirmPassword"
                        >
                            تأكيد كلمة المرور
                        </label>

                        <input
                            id="awtaar-auth-confirm-password"
                            type="password"
                            autocomplete="new-password"
                            minlength="6"
                        >

                    </div>


                    <div
                        class="awtaar-auth-message"
                        aria-live="polite"
                    ></div>


                    <button
                        type="submit"
                        class="awtaar-auth-submit"
                    >
                        تسجيل الدخول
                    </button>


                </form>


                <div class="awtaar-auth-footer">

                    <button
                        type="button"
                        class="awtaar-auth-language"
                        data-auth-language
                    >
                        English
                    </button>

                </div>

            </div>

        `


        document.body.appendChild(
            this.container
        )


        this.cacheElements()

        this.bindEvents()

        this.applyLanguage()

    }


    /* =====================================================
       CACHE ELEMENTS
       ===================================================== */

    cacheElements() {

        this.form =
            this.container.querySelector(
                '.awtaar-auth-form'
            )

        this.usernameInput =
            this.container.querySelector(
                '#awtaar-auth-username'
            )

        this.emailInput =
            this.container.querySelector(
                '#awtaar-auth-email'
            )

        this.passwordInput =
            this.container.querySelector(
                '#awtaar-auth-password'
            )

        this.confirmPasswordInput =
            this.container.querySelector(
                '#awtaar-auth-confirm-password'
            )

        this.submitButton =
            this.container.querySelector(
                '.awtaar-auth-submit'
            )

        this.message =
            this.container.querySelector(
                '.awtaar-auth-message'
            )

        this.languageButton =
            this.container.querySelector(
                '[data-auth-language]'
            )

        this.tabs =
            this.container.querySelectorAll(
                '[data-auth-mode]'
            )

        this.signupFields =
            this.container.querySelectorAll(
                '[data-signup-only]'
            )

    }


    /* =====================================================
       EVENTS
       ===================================================== */

    bindEvents() {

        this.tabs.forEach(
            tab => {

                tab.addEventListener(
                    'click',
                    () => {

                        this.setMode(
                            tab.dataset.authMode
                        )

                    }
                )

            }
        )


        this.form.addEventListener(
            'submit',
            event => {

                event.preventDefault()

                this.submit()

            }
        )


        this.languageButton.addEventListener(
            'click',
            () => {

                this.toggleLanguage()

            }
        )

    }


    /* =====================================================
       SET MODE
       ===================================================== */

    setMode(mode) {

        this.mode =
            mode === 'signup'
                ? 'signup'
                : 'login'


        this.clearMessage()


        this.tabs.forEach(
            tab => {

                tab.classList.toggle(
                    'active',
                    tab.dataset.authMode ===
                    this.mode
                )

            }
        )


        this.signupFields.forEach(
            field => {

                field.style.display =
                    this.mode === 'signup'
                        ? ''
                        : 'none'

            }
        )


        if (
            this.mode === 'signup'
        ) {

            this.submitButton.textContent =
                this.getText(
                    'createAccount'
                )

            this.passwordInput.autocomplete =
                'new-password'

        } else {

            this.submitButton.textContent =
                this.getText(
                    'login'
                )

            this.passwordInput.autocomplete =
                'current-password'

        }

    }


    /* =====================================================
       SUBMIT
       ===================================================== */

    async submit() {

        this.clearMessage()

        const email =
            this.emailInput.value.trim()

        const password =
            this.passwordInput.value

        if (!email) {

            this.showMessage(
                this.getText(
                    'enterEmail'
                ),
                'error'
            )

            this.emailInput.focus()

            return

        }


        if (!password) {

            this.showMessage(
                this.getText(
                    'enterPassword'
                ),
                'error'
            )

            this.passwordInput.focus()

            return

        }


        this.setLoading(
            true
        )


        try {

            if (
                this.mode === 'signup'
            ) {

                await this.createAccount(
                    email,
                    password
                )

            } else {

                await this.login(
                    email,
                    password
                )

            }

        } catch (error) {

            console.error(
                'Awtaar Auth UI:',
                error
            )

            this.showMessage(
                this.getErrorMessage(
                    error
                ),
                'error'
            )

        } finally {

            this.setLoading(
                false
            )

        }

    }


    /* =====================================================
       CREATE ACCOUNT
       ===================================================== */

    async createAccount(
        email,
        password
    ) {

        const username =
            this.usernameInput.value.trim()

        const confirmPassword =
            this.confirmPasswordInput.value


        if (!username) {

            this.showMessage(
                this.getText(
                    'enterUsername'
                ),
                'error'
            )

            this.usernameInput.focus()

            return

        }


        if (
            password.length < 6
        ) {

            this.showMessage(
                this.getText(
                    'passwordTooShort'
                ),
                'error'
            )

            return

        }


        if (
            password !==
            confirmPassword
        ) {

            this.showMessage(
                this.getText(
                    'passwordMismatch'
                ),
                'error'
            )

            this.confirmPasswordInput.focus()

            return

        }


        const result =
            await this.auth.signUp(
                email,
                password,
                username
            )


        if (!result.success) {

            throw result.error

        }


        /*
         * Supabase may require email
         * confirmation before creating
         * an authenticated session.
         */

        if (
            result.session
        ) {

            this.showMessage(
                this.getText(
                    'accountCreated'
                ),
                'success'
            )

            this.dispatchAuthSuccess(
                result.user
            )

        } else {

            this.showMessage(
                this.getText(
                    'checkEmail'
                ),
                'success'
            )

            this.form.reset()

        }

    }


    /* =====================================================
       LOGIN
       ===================================================== */

    async login(
        email,
        password
    ) {

        const result =
            await this.auth.signIn(
                email,
                password
            )


        if (!result.success) {

            throw result.error

        }


        this.showMessage(
            this.getText(
                'loginSuccess'
            ),
            'success'
        )


        this.dispatchAuthSuccess(
            result.user
        )

    }


    /* =====================================================
       AUTH SUCCESS
       ===================================================== */

    dispatchAuthSuccess(
        user
    ) {

        window.dispatchEvent(

            new CustomEvent(
                'awtaar-auth-success',
                {
                    detail: {
                        user
                    }
                }
            )

        )

    }


    /* =====================================================
       LOADING
       ===================================================== */

    setLoading(
        loading
    ) {

        this.submitButton.disabled =
            loading


        if (loading) {

            this.submitButton.textContent =
                this.getText(
                    'loading'
                )

        } else {

            this.submitButton.textContent =
                this.mode === 'signup'
                    ? this.getText(
                        'createAccount'
                    )
                    : this.getText(
                        'login'
                    )

        }

    }


    /* =====================================================
       MESSAGE
       ===================================================== */

    showMessage(
        message,
        type = 'error'
    ) {

        this.message.textContent =
            message

        this.message.className =
            `awtaar-auth-message ${type}`

    }


    clearMessage() {

        this.message.textContent =
            ''

        this.message.className =
            'awtaar-auth-message'

    }


    /* =====================================================
       LANGUAGE
       ===================================================== */

    applyLanguage() {

        const language =
            getLanguage()


        this.container.dir =
            language === 'ar'
                ? 'rtl'
                : 'ltr'


        const isArabic =
            language === 'ar'


        const usernameLabel =
            this.container.querySelector(
                '[data-auth-text="username"]'
            )

        const emailLabel =
            this.container.querySelector(
                '[data-auth-text="email"]'
            )

        const passwordLabel =
            this.container.querySelector(
                '[data-auth-text="password"]'
            )

        const confirmLabel =
            this.container.querySelector(
                '[data-auth-text="confirmPassword"]'
            )

        const tagline =
            this.container.querySelector(
                '[data-auth-text="tagline"]'
            )


        if (usernameLabel) {

            usernameLabel.textContent =
                isArabic
                    ? 'اسم المستخدم'
                    : 'Username'

        }


        if (emailLabel) {

            emailLabel.textContent =
                isArabic
                    ? 'البريد الإلكتروني'
                    : 'Email'

        }


        if (passwordLabel) {

            passwordLabel.textContent =
                isArabic
                    ? 'كلمة المرور'
                    : 'Password'

        }


        if (confirmLabel) {

            confirmLabel.textContent =
                isArabic
                    ? 'تأكيد كلمة المرور'
                    : 'Confirm password'

        }


        if (tagline) {

            tagline.textContent =
                isArabic
                    ? 'رحلتك إلى المعرفة تبدأ هنا'
                    : 'Your journey to knowledge begins here'

        }


        this.tabs.forEach(
            tab => {

                if (
                    tab.dataset.authMode ===
                    'login'
                ) {

                    tab.textContent =
                        isArabic
                            ? 'تسجيل الدخول'
                            : 'Sign in'

                } else {

                    tab.textContent =
                        isArabic
                            ? 'إنشاء حساب'
                            : 'Create account'

                }

            }
        )


        this.languageButton.textContent =
            isArabic
                ? 'English'
                : 'العربية'


        this.setMode(
            this.mode
        )

    }


    /* =====================================================
       TOGGLE LANGUAGE
       ===================================================== */

    toggleLanguage() {

        /*
         * We intentionally do not change the
         * global Awtaar language here yet.
         *
         * The authentication interface follows
         * the existing language system.
         */

        console.log(
            'Awtaar Auth: language toggle requested.'
        )

    }


    /* =====================================================
       TEXT
       ===================================================== */

    getText(
        key
    ) {

        const language =
            getLanguage()


        const texts = {

            ar: {

                login:
                    'تسجيل الدخول',

                createAccount:
                    'إنشاء حساب',

                loading:
                    'جارٍ المعالجة...',

                enterEmail:
                    'يرجى إدخال البريد الإلكتروني.',

                enterPassword:
                    'يرجى إدخال كلمة المرور.',

                enterUsername:
                    'يرجى إدخال اسم المستخدم.',

                passwordTooShort:
                    'يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل.',

                passwordMismatch:
                    'كلمتا المرور غير متطابقتين.',

                accountCreated:
                    'تم إنشاء حسابك بنجاح.',

                checkEmail:
                    'تم إنشاء الحساب. تحقق من بريدك الإلكتروني لتأكيد الحساب.',

                loginSuccess:
                    'تم تسجيل الدخول بنجاح.'

            },


            en: {

                login:
                    'Sign in',

                createAccount:
                    'Create account',

                loading:
                    'Processing...',

                enterEmail:
                    'Please enter your email address.',

                enterPassword:
                    'Please enter your password.',

                enterUsername:
                    'Please enter a username.',

                passwordTooShort:
                    'Password must contain at least 6 characters.',

                passwordMismatch:
                    'Passwords do not match.',

                accountCreated:
                    'Your account has been created successfully.',

                checkEmail:
                    'Account created. Check your email to confirm your account.',

                loginSuccess:
                    'Signed in successfully.'

            }

        }


        return (
            texts[language]?.[key] ||
            texts.en[key] ||
            key
        )

    }


    /* =====================================================
       ERROR MESSAGE
       ===================================================== */

    getErrorMessage(
        error
    ) {

        const message =
            error?.message ||
            String(error || '')


        const language =
            getLanguage()


        if (
            language === 'ar'
        ) {

            if (
                message.toLowerCase()
                    .includes('invalid login credentials')
            ) {

                return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.'

            }


            if (
                message.toLowerCase()
                    .includes('user already registered')
            ) {

                return 'هذا البريد الإلكتروني مستخدم بالفعل.'

            }


            if (
                message.toLowerCase()
                    .includes('password should be at least')
            ) {

                return 'كلمة المرور قصيرة جدًا.'

            }


            if (
                message.toLowerCase()
                    .includes('invalid email')
            ) {

                return 'يرجى إدخال بريد إلكتروني صحيح.'

            }

        }


        return message ||
            (
                language === 'ar'
                    ? 'حدث خطأ أثناء تنفيذ العملية.'
                    : 'Something went wrong.'
            )

    }


    /* =====================================================
       SHOW
       ===================================================== */

    show() {

        if (!this.container) {

            return

        }


        this.container.classList.add(
            'is-visible'
        )

    }


    /* =====================================================
       HIDE
       ===================================================== */

    hide() {

        if (!this.container) {

            return

        }


        this.container.classList.remove(
            'is-visible'
        )

    }


    /* =====================================================
       DESTROY
       ===================================================== */

    destroy() {

        if (
            this.container
        ) {

            this.container.remove()

        }


        this.container =
            null

    }

}