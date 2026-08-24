import ar from '../locales/ar.js'

import en from '../locales/en.js'


export default class LanguageSystem {

    constructor() {

        /*
         * اللغات المتاحة
         */

        this.languages = {

            ar: ar,

            en: en

        }


        /*
         * قراءة اللغة المحفوظة
         */

        const savedLanguage =
            localStorage.getItem(
                'awtaar-language'
            )


        /*
         * اللغة الافتراضية
         */

        this.currentLanguage =
            savedLanguage &&
            this.languages[savedLanguage]

                ? savedLanguage

                : 'ar'


        /*
         * تطبيق اللغة
         */

        this.applyDirection()


        console.log(
            `🌐 Awtaar Language: ${this.currentLanguage}`
        )

    }


    /*
     * الحصول على اللغة الحالية
     */

    getLanguage() {

        return this.currentLanguage

    }


    /*
     * الحصول على بيانات اللغة
     */

    getTranslations() {

        return this.languages[
            this.currentLanguage
        ]

    }


    /*
     * الحصول على نص محدد
     *
     * مثال:
     *
     * language.get('platform.title')
     */

    get(path) {

        const translations =
            this.getTranslations()


        const parts =
            path.split('.')


        let value =
            translations


        for (
            const part of parts
        ) {

            if (
                value &&
                value[part] !== undefined
            ) {

                value =
                    value[part]

            }

            else {

                console.warn(
                    `🌐 Missing translation: ${path}`
                )

                return path

            }

        }


        return value

    }


    /*
     * تغيير اللغة
     */

    setLanguage(
        language
    ) {

        /*
         * التأكد من وجود اللغة
         */

        if (
            !this.languages[language]
        ) {

            console.warn(
                `🌐 Language "${language}" is not available.`
            )

            return

        }


        /*
         * منع إعادة تحميل غير ضرورية
         */

        if (
            this.currentLanguage ===
            language
        ) {

            return

        }


        /*
         * حفظ اللغة

         */

        this.currentLanguage =
            language


        localStorage.setItem(
            'awtaar-language',
            language
        )


        /*
         * تحديث الاتجاه

         */

        this.applyDirection()


        /*
         * إعلام الواجهة

         */

        window.dispatchEvent(

            new CustomEvent(
                'awtaar-language-changed',
                {

                    detail: {

                        language:
                            language

                    }

                }
            )

        )


        console.log(
            `🌐 Awtaar Language Changed: ${language}`
        )

    }


    /*
     * تغيير اتجاه الصفحة

     */

    applyDirection() {

        const translations =
            this.getTranslations()


        document.documentElement.lang =
            translations.language


        document.documentElement.dir =
            translations.direction


        document.body.dir =
            translations.direction

    }


    /*
     * تبديل اللغة

     */

    toggleLanguage() {

        const nextLanguage =
            this.currentLanguage === 'ar'

                ? 'en'

                : 'ar'


        this.setLanguage(
            nextLanguage
        )

    }

}