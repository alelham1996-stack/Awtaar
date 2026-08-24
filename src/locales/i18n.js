import ar from './ar.js'
import en from './en.js'


/*
 * =====================================================
 * LANGUAGES
 * =====================================================
 */

const translations = {

    ar,
    en

}


/*
 * =====================================================
 * LANGUAGE STORAGE
 * =====================================================
 */

const LANGUAGE_STORAGE_KEY =
    'awtaar-language'


/*
 * =====================================================
 * GET INITIAL LANGUAGE
 * =====================================================
 *
 * نحاول أولًا قراءة اللغة المحفوظة.
 *
 * إذا لم توجد لغة محفوظة:
 * نستخدم العربية كلغة افتراضية.
 */

function getInitialLanguage() {

    try {

        const savedLanguage =
            localStorage.getItem(
                LANGUAGE_STORAGE_KEY
            )


        if (
            savedLanguage &&
            translations[savedLanguage]
        ) {

            return savedLanguage

        }

    } catch (error) {

        console.warn(
            'Awtaar language storage unavailable.',
            error
        )

    }


    return 'ar'
}


/*
 * =====================================================
 * CURRENT LANGUAGE
 * =====================================================
 */

let currentLanguage =
    getInitialLanguage()


/*
 * =====================================================
 * LEGACY KEYS
 * =====================================================
 *
 * نحافظ عليها حتى تعمل
 * الواجهات القديمة.
 */

const legacyKeys = {

    platformTitle:
        'platform.title',

    platformDescription:
        'platform.description',

    exploreButton:
        'platform.explore',


    explorationGalaxies:
        'exploration.galaxies',

    explorationPhenomena:
        'exploration.phenomena',

    explorationSimulation:
        'exploration.simulation',

    explorationDiscover:
        'exploration.discover',


    galaxiesTitle:
        'galaxies.title',

    galaxiesDescription:
        'galaxies.subtitle',

    galaxyPhysics:
        'galaxies.physics',

    galaxyBiology:
        'galaxies.biology',

    galaxyAstronomy:
        'galaxies.astronomy',

    galaxyEarth:
        'galaxies.earth',

    galaxyChemistry:
        'galaxies.chemistry',

    galaxiesBack:
        'common.back',


    physicsGalaxyTitle:
        'physicsGalaxy.title',

    physicsGalaxyDescription:
        'physicsGalaxy.description',

    physicsGalaxyStart:
        'physicsGalaxy.start',


    physicsWorldTitle:
        'physicsWorld.title',

    physicsWorldDescription:
        'physicsWorld.description',

    physicsWorldQuantum:
        'physicsWorld.quantum',

    physicsWorldRelativity:
        'physicsWorld.relativity',

    physicsWorldWaves:
        'physicsWorld.waves',

    physicsWorldEnergy:
        'physicsWorld.energy',

    physicsWorldMechanics:
        'physicsWorld.mechanics',

    physicsWorldBack:
        'physicsWorld.back',


    quantumTitle:
        'quantum.title',

    quantumDescription:
        'quantum.description',

    quantumExperimentStart:
        'quantum.experimentStart',

    quantumExperimentRunning:
        'quantum.experimentRunning',

    quantumBack:
        'quantum.back'

}


/*
 * =====================================================
 * NESTED VALUE
 * =====================================================
 *
 * مثال:
 *
 * galaxies.title
 *
 * يصبح:
 *
 * translations.en.galaxies.title
 */

function getNestedValue(
    object,
    path
) {

    const keys =
        path.split('.')


    let value =
        object


    for (
        const key of keys
    ) {

        if (
            value &&
            typeof value === 'object' &&
            key in value
        ) {

            value =
                value[key]

        } else {

            return null

        }

    }


    return value

}


/*
 * =====================================================
 * SET LANGUAGE
 * =====================================================
 */

export function setLanguage(
    language
) {

    /*
     * لا نفعل شيئًا إذا كانت اللغة
     * غير موجودة.
     */

    if (
        !translations[language]
    ) {

        return false

    }


    /*
     * تحديث اللغة الحالية
     */

    currentLanguage =
        language


    /*
     * حفظ اللغة
     */

    try {

        localStorage.setItem(
            LANGUAGE_STORAGE_KEY,
            language
        )

    } catch (error) {

        console.warn(
            'Unable to save Awtaar language.',
            error
        )

    }


    /*
     * إرسال حدث عام للنظام.
     *
     * هذا سيسمح للواجهات الحالية
     * والمستقبلية بمعرفة أن اللغة تغيرت.
     */

    window.dispatchEvent(
        new CustomEvent(
            'awtaar-language-change',
            {
                detail: {
                    language
                }
            }
        )
    )


    return true
}


/*
 * =====================================================
 * GET LANGUAGE
 * =====================================================
 */

export function getLanguage() {

    return currentLanguage

}


/*
 * =====================================================
 * TRANSLATION
 * =====================================================
 */

export function t(
    key
) {

    /*
     * أولًا:
     * حاول استخدام المفتاح مباشرة.
     *
     * مثال:
     *
     * galaxies.title
     */

    let value =
        getNestedValue(
            translations[currentLanguage],
            key
        )


    if (
        value !== null
    ) {

        return value

    }


    /*
     * ثانيًا:
     * تحقق من المفاتيح القديمة.
     *
     * مثال:
     *
     * platformTitle
     *
     * يتحول إلى:
     *
     * platform.title
     */

    const newKey =
        legacyKeys[key]


    if (
        newKey
    ) {

        value =
            getNestedValue(
                translations[currentLanguage],
                newKey
            )


        if (
            value !== null
        ) {

            return value

        }

    }


    /*
     * إذا لم نجد الترجمة:
     * نعيد المفتاح نفسه.
     */

    return key

}