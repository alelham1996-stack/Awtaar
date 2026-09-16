/* =========================================================
   AWTAAR — PLATFORM UI
   ========================================================= */

import ExplorationUI from './ExplorationUI.js'
import AuthService from '../auth/AuthService.js'

import {
    t,
    getLanguage,
    setLanguage
} from '../locales/i18n.js'


export default class PlatformUI {

    constructor(scene = null) {

        this.scene =
            scene

        /* =====================================================
           AUTH
           ===================================================== */

        this.authService =
            new AuthService()

        this.currentUser =
            null

        this.profileOpen =
            false

        this.profilePageOpen =
            false

        this.isSigningOut =
            false


        /* =====================================================
           EXPLORATION
           ===================================================== */

        this.explorationUI =
            new ExplorationUI(
                this.scene,
                this
            )


        /* =====================================================
           CREATE
           ===================================================== */

        this.createUI()
    }


    /* =========================================================
       CREATE UI
       ========================================================= */

    createUI() {

        /* =====================================================
           ROOT
           ===================================================== */

        this.container =
            document.createElement('div')

        this.container.id =
            'awtaar-platform'


        /* =====================================================
           HEADER
           ===================================================== */

        this.header =
            document.createElement('header')

        this.header.className =
            'awtaar-header'


        /* =====================================================
           LOGO
           ===================================================== */

        this.logo =
            document.createElement('div')

        this.logo.className =
            'awtaar-platform-logo'

        this.logo.textContent =
            'AWTAAR'


        /* =====================================================
           HEADER ACTIONS
           ===================================================== */

        this.headerActions =
            document.createElement('div')

        this.headerActions.className =
            'awtaar-header-actions'


        /* =====================================================
           LANGUAGE BUTTON
           ===================================================== */

        this.languageButton =
            document.createElement('button')

        this.languageButton.type =
            'button'

        this.languageButton.className =
            'awtaar-language-button'

        this.languageButton.textContent =
            getLanguage() === 'ar'
                ? 'EN'
                : 'AR'

        this.languageButton.setAttribute(
            'aria-label',
            'Change language'
        )

        this.languageButton.addEventListener(
            'click',
            (event) => {

                event.preventDefault()
                event.stopPropagation()

                this.toggleLanguage()
            }
        )


        /* =====================================================
           USER BUTTON
           ===================================================== */

        this.userButton =
            document.createElement('button')

        this.userButton.type =
            'button'

        this.userButton.className =
            'awtaar-user-button'

        this.userButton.setAttribute(
            'aria-expanded',
            'false'
        )

        this.userButton.setAttribute(
            'aria-haspopup',
            'true'
        )

        this.userButton.innerHTML = `
            <span class="awtaar-user-icon">
                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                >
                    <circle
                        cx="12"
                        cy="8"
                        r="3.15"
                    ></circle>

                    <path
                        d="
                            M5.8 19.1
                            C6.5 15.7
                            8.7 14
                            12 14
                            C15.3 14
                            17.5 15.7
                            18.2 19.1
                        "
                    ></path>
                </svg>
            </span>
        `

        this.userButton.addEventListener(
            'click',
            (event) => {

                event.preventDefault()
                event.stopPropagation()

                this.toggleProfile()
            }
        )


        /* =====================================================
           HEADER BUILD
           ===================================================== */

        this.headerActions.appendChild(
            this.languageButton
        )

        this.headerActions.appendChild(
            this.userButton
        )

        this.header.appendChild(
            this.logo
        )

        this.header.appendChild(
            this.headerActions
        )


        /* =====================================================
           PROFILE PANEL
           ===================================================== */

        this.createProfilePanel()


        /* =====================================================
           PROFILE PAGE
           ===================================================== */

        this.createProfilePage()


        /* =====================================================
           MAIN CONTENT
           ===================================================== */

        this.content =
            document.createElement('main')

        this.content.className =
            'awtaar-content'


        /* =====================================================
           TITLE
           ===================================================== */

        this.title =
            document.createElement('h1')

        this.title.textContent =
            t('platform.title')


        /* =====================================================
           DESCRIPTION
           ===================================================== */

        this.description =
            document.createElement('p')

        this.description.textContent =
            t('platform.description')


        /* =====================================================
           EXPLORE BUTTON
           ===================================================== */

        this.exploreButton =
            document.createElement('button')

        this.exploreButton.type =
            'button'

        this.exploreButton.className =
            'awtaar-explore-button'

        this.exploreButton.textContent =
            t('platform.explore')


        /* =====================================================
           CONTENT BUILD
           ===================================================== */

        this.content.appendChild(
            this.title
        )

        this.content.appendChild(
            this.description
        )

        this.content.appendChild(
            this.exploreButton
        )


        /* =====================================================
           PLATFORM BUILD
           ===================================================== */

        this.container.appendChild(
            this.header
        )

        this.container.appendChild(
            this.content
        )


        document.body.appendChild(
            this.container
        )


        /* =====================================================
           INITIAL STATE
           ===================================================== */

        this.container.style.opacity =
            '0'

        this.container.style.visibility =
            'hidden'

        this.container.style.pointerEvents =
            'none'


        /* =====================================================
           EXPLORE
           ===================================================== */

        this.exploreButton.addEventListener(
            'click',
            (event) => {

                event.preventDefault()
                event.stopPropagation()

                this.startExploration()
            }
        )


        /* =====================================================
           LANGUAGE
           ===================================================== */

        this.updateLanguage()


        /* =====================================================
           USER
           ===================================================== */

        this.loadCurrentUser()


        /* =====================================================
           OUTSIDE CLICK
           ===================================================== */

        this.handleDocumentClick =
            (event) => {

                if (!this.profileOpen) {
                    return
                }

                if (
                    this.profilePanel &&
                    this.profilePanel.contains(event.target)
                ) {
                    return
                }

                if (
                    this.userButton &&
                    this.userButton.contains(event.target)
                ) {
                    return
                }

                this.closeProfile()
            }

        document.addEventListener(
            'click',
            this.handleDocumentClick
        )


        /* =====================================================
           ESCAPE
           ===================================================== */

        this.handleKeyDown =
            (event) => {

                if (
                    event.key !== 'Escape'
                ) {
                    return
                }

                if (
                    this.profilePageOpen
                ) {
                    this.closeProfilePage()
                    return
                }

                if (
                    this.profileOpen
                ) {
                    this.closeProfile()
                }
            }

        document.addEventListener(
            'keydown',
            this.handleKeyDown
        )
    }


    /* =========================================================
       PROFILE PANEL
       ========================================================= */

    createProfilePanel() {

        this.profilePanel =
            document.createElement('div')

        this.profilePanel.className =
            'awtaar-profile-panel'

        this.profilePanel.setAttribute(
            'role',
            'dialog'
        )

        this.profilePanel.setAttribute(
            'aria-hidden',
            'true'
        )


        /* =====================================================
           PANEL HEADER
           ===================================================== */

        this.profileHeader =
            document.createElement('div')

        this.profileHeader.className =
            'awtaar-profile-header'


        /* =====================================================
           AVATAR
           ===================================================== */

        this.profileAvatar =
            document.createElement('div')

        this.profileAvatar.className =
            'awtaar-profile-avatar'

        this.profileAvatar.textContent =
            'A'


        /* =====================================================
           IDENTITY
           ===================================================== */

        this.profileIdentity =
            document.createElement('div')

        this.profileIdentity.className =
            'awtaar-profile-identity'


        this.profileName =
            document.createElement('div')

        this.profileName.className =
            'awtaar-profile-name'

        this.profileName.textContent =
            'أوتار'


        this.profileEmail =
            document.createElement('div')

        this.profileEmail.className =
            'awtaar-profile-email'

        this.profileEmail.textContent =
            ''


        this.profileIdentity.appendChild(
            this.profileName
        )

        this.profileIdentity.appendChild(
            this.profileEmail
        )


        this.profileHeader.appendChild(
            this.profileAvatar
        )

        this.profileHeader.appendChild(
            this.profileIdentity
        )


        /* =====================================================
           GUEST MESSAGE
           ===================================================== */

        this.guestSection =
            document.createElement('div')

        this.guestSection.className =
            'awtaar-guest-section'


        this.guestTitle =
            document.createElement('div')

        this.guestTitle.className =
            'awtaar-guest-title'


        this.guestDescription =
            document.createElement('div')

        this.guestDescription.className =
            'awtaar-guest-description'


        this.guestSection.appendChild(
            this.guestTitle
        )

        this.guestSection.appendChild(
            this.guestDescription
        )


        /* =====================================================
           LOGIN BUTTON
           ===================================================== */

        this.loginButton =
            document.createElement('button')

        this.loginButton.type =
            'button'

        this.loginButton.className =
            'awtaar-auth-action awtaar-auth-login'


        this.loginButton.addEventListener(
            'click',
            (event) => {

                event.preventDefault()
                event.stopPropagation()

                this.openAuth('login')
            }
        )


        /* =====================================================
           SIGNUP BUTTON
           ===================================================== */

        this.signupButton =
            document.createElement('button')

        this.signupButton.type =
            'button'

        this.signupButton.className =
            'awtaar-auth-action awtaar-auth-signup'


        this.signupButton.addEventListener(
            'click',
            (event) => {

                event.preventDefault()
                event.stopPropagation()

                this.openAuth('signup')
            }
        )


        /* =====================================================
           AUTH ACTIONS
           ===================================================== */

        this.guestActions =
            document.createElement('div')

        this.guestActions.className =
            'awtaar-guest-actions'

        this.guestActions.appendChild(
            this.loginButton
        )

        this.guestActions.appendChild(
            this.signupButton
        )


        /* =====================================================
           DIVIDER
           ===================================================== */

        this.profileDivider =
            document.createElement('div')

        this.profileDivider.className =
            'awtaar-profile-divider'


        /* =====================================================
           PROFILE BUTTON
           ===================================================== */

        this.profileButton =
            document.createElement('button')

        this.profileButton.type =
            'button'

        this.profileButton.className =
            'awtaar-profile-action'

        this.profileButton.innerHTML = `
            <span class="awtaar-action-icon">
                ◇
            </span>

            <span class="awtaar-profile-action-text">
                الملف الشخصي
            </span>
        `

        this.profileButton.addEventListener(
            'click',
            (event) => {

                event.preventDefault()
                event.stopPropagation()

                this.openProfilePage()
            }
        )


        /* =====================================================
           LOGOUT
           ===================================================== */

        this.logoutButton =
            document.createElement('button')

        this.logoutButton.type =
            'button'

        this.logoutButton.className =
            'awtaar-profile-logout'

        this.logoutButton.innerHTML = `
            <span class="awtaar-action-icon">
                ↪
            </span>

            <span class="awtaar-profile-logout-text">
                تسجيل الخروج
            </span>
        `

        this.logoutButton.addEventListener(
            'click',
            (event) => {

                event.preventDefault()
                event.stopPropagation()

                this.signOut()
            }
        )


        /* =====================================================
           PANEL BUILD
           ===================================================== */

        this.profilePanel.appendChild(
            this.profileHeader
        )

        this.profilePanel.appendChild(
            this.guestSection
        )

        this.profilePanel.appendChild(
            this.guestActions
        )

        this.profilePanel.appendChild(
            this.profileDivider
        )

        this.profilePanel.appendChild(
            this.profileButton
        )

        this.profilePanel.appendChild(
            this.logoutButton
        )


        this.container.appendChild(
            this.profilePanel
        )


        this.profilePanel.addEventListener(
            'click',
            (event) => {
                event.stopPropagation()
            }
        )
    }


    /* =========================================================
       PROFILE PAGE
       ========================================================= */

    createProfilePage() {

        this.profilePage =
            document.createElement('section')

        this.profilePage.className =
            'awtaar-profile-page'

        this.profilePage.setAttribute(
            'aria-hidden',
            'true'
        )


        /* =====================================================
           PAGE HEADER
           ===================================================== */

        this.profilePageHeader =
            document.createElement('div')

        this.profilePageHeader.className =
            'awtaar-profile-page-header'


        this.profileBackButton =
            document.createElement('button')

        this.profileBackButton.type =
            'button'

        this.profileBackButton.className =
            'awtaar-profile-back'

        this.profileBackButton.addEventListener(
            'click',
            (event) => {

                event.preventDefault()
                event.stopPropagation()

                this.closeProfilePage()
            }
        )


        this.profilePageTitle =
            document.createElement('h2')

        this.profilePageTitle.className =
            'awtaar-profile-page-title'


        this.profilePageSubtitle =
            document.createElement('p')

        this.profilePageSubtitle.className =
            'awtaar-profile-page-subtitle'


        this.profilePageHeader.appendChild(
            this.profileBackButton
        )

        this.profilePageHeader.appendChild(
            this.profilePageTitle
        )

        this.profilePageHeader.appendChild(
            this.profilePageSubtitle
        )


        /* =====================================================
           PROFILE HERO
           ===================================================== */

        this.profileHero =
            document.createElement('div')

        this.profileHero.className =
            'awtaar-profile-hero'


        this.profilePageAvatar =
            document.createElement('div')

        this.profilePageAvatar.className =
            'awtaar-profile-page-avatar'


        this.profilePageIdentity =
            document.createElement('div')

        this.profilePageIdentity.className =
            'awtaar-profile-page-identity'


        this.profilePageName =
            document.createElement('h3')

        this.profilePageName.className =
            'awtaar-profile-page-name'


        this.profilePageEmail =
            document.createElement('p')

        this.profilePageEmail.className =
            'awtaar-profile-page-email'


        this.profilePageIdentity.appendChild(
            this.profilePageName
        )

        this.profilePageIdentity.appendChild(
            this.profilePageEmail
        )


        this.profileHero.appendChild(
            this.profilePageAvatar
        )

        this.profileHero.appendChild(
            this.profilePageIdentity
        )


        /* =====================================================
           ACCOUNT INFORMATION
           ===================================================== */

        this.profileInfoCard =
            document.createElement('div')

        this.profileInfoCard.className =
            'awtaar-profile-info-card'


        this.profileInfoTitle =
            document.createElement('h3')

        this.profileInfoTitle.className =
            'awtaar-profile-section-title'


        this.profileInfoGrid =
            document.createElement('div')

        this.profileInfoGrid.className =
            'awtaar-profile-info-grid'


        this.profileUsernameInfo =
            this.createProfileInfoItem()

        this.profileEmailInfo =
            this.createProfileInfoItem()


        this.profileInfoGrid.appendChild(
            this.profileUsernameInfo.element
        )

        this.profileInfoGrid.appendChild(
            this.profileEmailInfo.element
        )


        this.profileInfoCard.appendChild(
            this.profileInfoTitle
        )

        this.profileInfoCard.appendChild(
            this.profileInfoGrid
        )


        /* =====================================================
           JOURNEY
           ===================================================== */

        this.profileJourneyCard =
            document.createElement('div')

        this.profileJourneyCard.className =
            'awtaar-profile-journey-card'


        this.profileJourneyTitle =
            document.createElement('h3')

        this.profileJourneyTitle.className =
            'awtaar-profile-section-title'


        this.profileJourneyDescription =
            document.createElement('p')

        this.profileJourneyDescription.className =
            'awtaar-profile-journey-description'


        /* =====================================================
           STATS
           ===================================================== */

        this.profileStats =
            document.createElement('div')

        this.profileStats.className =
            'awtaar-profile-stats'


        this.profileStatGalaxies =
            this.createProfileStat(
                '0'
            )

        this.profileStatWorlds =
            this.createProfileStat(
                '0'
            )

        this.profileStatExperiments =
            this.createProfileStat(
                '0'
            )


        this.profileStats.appendChild(
            this.profileStatGalaxies.element
        )

        this.profileStats.appendChild(
            this.profileStatWorlds.element
        )

        this.profileStats.appendChild(
            this.profileStatExperiments.element
        )


        this.profileJourneyCard.appendChild(
            this.profileJourneyTitle
        )

        this.profileJourneyCard.appendChild(
            this.profileJourneyDescription
        )

        this.profileJourneyCard.appendChild(
            this.profileStats
        )


        /* =====================================================
           EMPTY JOURNEY
           ===================================================== */

        this.profileJourneyEmpty =
            document.createElement('div')

        this.profileJourneyEmpty.className =
            'awtaar-profile-journey-empty'


        this.profileJourneyEmptyIcon =
            document.createElement('div')

        this.profileJourneyEmptyIcon.className =
            'awtaar-profile-journey-empty-icon'

        this.profileJourneyEmptyIcon.textContent =
            '✦'


        this.profileJourneyEmptyText =
            document.createElement('p')


        this.profileJourneyEmpty.appendChild(
            this.profileJourneyEmptyIcon
        )

        this.profileJourneyEmpty.appendChild(
            this.profileJourneyEmptyText
        )


        this.profileJourneyCard.appendChild(
            this.profileJourneyEmpty
        )


        /* =====================================================
           CLOSE / BACK ACTION
           ===================================================== */

        this.profilePageFooter =
            document.createElement('div')

        this.profilePageFooter.className =
            'awtaar-profile-page-footer'


        this.profileContinueButton =
            document.createElement('button')

        this.profileContinueButton.type =
            'button'

        this.profileContinueButton.className =
            'awtaar-profile-continue'


        this.profileContinueButton.addEventListener(
            'click',
            (event) => {

                event.preventDefault()
                event.stopPropagation()

                this.closeProfilePage()
            }
        )


        this.profilePageFooter.appendChild(
            this.profileContinueButton
        )


        /* =====================================================
           PAGE BUILD
           ===================================================== */

        this.profilePage.appendChild(
            this.profilePageHeader
        )

        this.profilePage.appendChild(
            this.profileHero
        )

        this.profilePage.appendChild(
            this.profileInfoCard
        )

        this.profilePage.appendChild(
            this.profileJourneyCard
        )

        this.profilePage.appendChild(
            this.profilePageFooter
        )


        this.container.appendChild(
            this.profilePage
        )


        this.profileBackButton.innerHTML = `
            <span class="awtaar-profile-back-icon">
                ←
            </span>

            <span class="awtaar-profile-back-text">
                العودة
            </span>
        `
    }


    /* =========================================================
       PROFILE INFO ITEM
       ========================================================= */

    createProfileInfoItem() {

        const element =
            document.createElement('div')

        element.className =
            'awtaar-profile-info-item'


        const label =
            document.createElement('span')

        label.className =
            'awtaar-profile-info-label'


        const value =
            document.createElement('strong')

        value.className =
            'awtaar-profile-info-value'


        element.appendChild(
            label
        )

        element.appendChild(
            value
        )


        return {
            element,
            label,
            value
        }
    }


    /* =========================================================
       PROFILE STAT
       ========================================================= */

    createProfileStat(valueText = '0') {

        const element =
            document.createElement('div')

        element.className =
            'awtaar-profile-stat'


        const value =
            document.createElement('strong')

        value.className =
            'awtaar-profile-stat-value'

        value.textContent =
            valueText


        const label =
            document.createElement('span')

        label.className =
            'awtaar-profile-stat-label'


        element.appendChild(
            value
        )

        element.appendChild(
            label
        )


        return {
            element,
            value,
            label
        }
    }


    /* =========================================================
       OPEN PROFILE PAGE
       ========================================================= */

    openProfilePage() {

        if (!this.currentUser) {
            return
        }

        this.closeProfile()

        this.updateProfilePage()

        this.profilePageOpen =
            true

        this.profilePage.classList.add(
            'open'
        )

        this.profilePage.setAttribute(
            'aria-hidden',
            'false'
        )

        this.profilePage.scrollTop =
            0
    }


    /* =========================================================
       CLOSE PROFILE PAGE
       ========================================================= */

    closeProfilePage() {

        this.profilePageOpen =
            false

        this.profilePage.classList.remove(
            'open'
        )

        this.profilePage.setAttribute(
            'aria-hidden',
            'true'
        )
    }


    /* =========================================================
       UPDATE PROFILE PAGE
       ========================================================= */

    updateProfilePage() {

        const isArabic =
            getLanguage() === 'ar'


        if (!this.currentUser) {
            return
        }


        const username =
            this.currentUser?.user_metadata?.username ||
            this.currentUser?.email?.split('@')[0] ||
            'AWTAAR'


        const email =
            this.currentUser?.email ||
            ''


        const firstLetter =
            username
                .charAt(0)
                .toUpperCase()


        /* =====================================================
           HEADER
           ===================================================== */

        this.profilePageTitle.textContent =
            isArabic
                ? 'ملفي في أوتار'
                : 'My Awtaar Profile'


        this.profilePageSubtitle.textContent =
            isArabic
                ? 'مساحتك الخاصة داخل رحلتك العلمية.'
                : 'Your personal space in your scientific journey.'


        this.profileBackButton.setAttribute(
            'aria-label',
            isArabic
                ? 'العودة'
                : 'Go back'
        )


        this.profileBackButton.querySelector(
            '.awtaar-profile-back-icon'
        ).textContent =
            isArabic
                ? '→'
                : '←'


        this.profileBackButton.querySelector(
            '.awtaar-profile-back-text'
        ).textContent =
            isArabic
                ? 'العودة'
                : 'Back'


        /* =====================================================
           HERO
           ===================================================== */

        this.profilePageAvatar.textContent =
            firstLetter

        this.profilePageName.textContent =
            username

        this.profilePageEmail.textContent =
            email


        /* =====================================================
           ACCOUNT INFORMATION
           ===================================================== */

        this.profileInfoTitle.textContent =
            isArabic
                ? 'معلومات الحساب'
                : 'Account information'


        this.profileUsernameInfo.label.textContent =
            isArabic
                ? 'اسم المستخدم'
                : 'Username'


        this.profileUsernameInfo.value.textContent =
            username


        this.profileEmailInfo.label.textContent =
            isArabic
                ? 'البريد الإلكتروني'
                : 'Email'


        this.profileEmailInfo.value.textContent =
            email


        /* =====================================================
           JOURNEY
           ===================================================== */

        this.profileJourneyTitle.textContent =
            isArabic
                ? 'رحلتي في أوتار'
                : 'My journey in Awtaar'


        this.profileJourneyDescription.textContent =
            isArabic
                ? 'هنا ستظهر آثار رحلتك العلمية مع مرور الوقت.'
                : 'Your scientific journey will gradually take shape here.'


        /* =====================================================
           STATS
           ===================================================== */

        this.profileStatGalaxies.label.textContent =
            isArabic
                ? 'المجرات المستكشفة'
                : 'Galaxies explored'


        this.profileStatWorlds.label.textContent =
            isArabic
                ? 'العوالم المستكشفة'
                : 'Worlds explored'


        this.profileStatExperiments.label.textContent =
            isArabic
                ? 'التجارب المكتملة'
                : 'Experiments completed'


        /* =====================================================
           EMPTY JOURNEY
           ===================================================== */

        this.profileJourneyEmptyText.textContent =
            isArabic
                ? 'لم تبدأ رحلتك الاستكشافية بعد. ابدأ باستكشاف أوتار، وستظهر رحلتك هنا.'
                : 'Your exploration has not begun yet. Start exploring Awtaar and your journey will appear here.'


        /* =====================================================
           FOOTER
           ===================================================== */

        this.profileContinueButton.textContent =
            isArabic
                ? 'متابعة الاستكشاف'
                : 'Continue exploring'
    }


    /* =========================================================
       LOAD CURRENT USER
       ========================================================= */

    async loadCurrentUser() {

        const user =
            await this.authService.getCurrentUser()

        this.setUser(
            user
        )
    }


    /* =========================================================
       SET USER
       ========================================================= */

    setUser(user = null) {

        this.currentUser =
            user || null


        if (!user) {

            this.closeProfilePage()

            this.profileAvatar.textContent =
                'A'

            this.profileName.textContent =
                getLanguage() === 'ar'
                    ? 'مرحبًا بك في أوتار'
                    : 'Welcome to Awtaar'

            this.profileEmail.textContent =
                getLanguage() === 'ar'
                    ? 'استكشف المنصة بحرية'
                    : 'Explore the platform freely'


            this.guestSection.style.display =
                'block'

            this.guestActions.style.display =
                'flex'

            this.profileDivider.style.display =
                'none'

            this.profileButton.style.display =
                'none'

            this.logoutButton.style.display =
                'none'

            this.updateGuestLanguage()

            return
        }


        const username =
            user?.user_metadata?.username ||
            user?.email?.split('@')[0] ||
            'AWTAAR'

        const email =
            user?.email ||
            ''


        this.profileAvatar.textContent =
            username
                .charAt(0)
                .toUpperCase()

        this.profileName.textContent =
            username

        this.profileEmail.textContent =
            email


        this.guestSection.style.display =
            'none'

        this.guestActions.style.display =
            'none'

        this.profileDivider.style.display =
            'block'

        this.profileButton.style.display =
            'flex'

        this.logoutButton.style.display =
            'flex'


        this.updateProfilePage()
    }


    /* =========================================================
       PROFILE TOGGLE
       ========================================================= */

    toggleProfile() {

        if (this.profileOpen) {
            this.closeProfile()
        } else {
            this.openProfile()
        }
    }


    /* =========================================================
       OPEN PROFILE
       ========================================================= */

    openProfile() {

        this.profileOpen =
            true

        this.profilePanel.classList.add(
            'open'
        )

        this.userButton.classList.add(
            'active'
        )

        this.userButton.setAttribute(
            'aria-expanded',
            'true'
        )

        this.profilePanel.setAttribute(
            'aria-hidden',
            'false'
        )
    }


    /* =========================================================
       CLOSE PROFILE
       ========================================================= */

    closeProfile() {

        this.profileOpen =
            false

        this.profilePanel.classList.remove(
            'open'
        )

        this.userButton.classList.remove(
            'active'
        )

        this.userButton.setAttribute(
            'aria-expanded',
            'false'
        )

        this.profilePanel.setAttribute(
            'aria-hidden',
            'true'
        )
    }


    /* =========================================================
       OPEN AUTH
       ========================================================= */

    openAuth(mode = 'login') {

        this.closeProfile()


        /*
         * Engine owns the single AuthUI instance.
         *
         * PlatformUI only asks Engine to open it.
         */

        window.dispatchEvent(
            new CustomEvent(
                'awtaar-open-auth',
                {
                    detail: {
                        mode
                    }
                }
            )
        )
    }


    /* =========================================================
       SIGN OUT
       ========================================================= */

    async signOut() {

        if (this.isSigningOut) {
            return
        }

        this.isSigningOut =
            true

        this.logoutButton.disabled =
            true

        const language =
            getLanguage()

        const originalHTML =
            this.logoutButton.innerHTML

        this.logoutButton.innerHTML = `
            <span class="awtaar-action-icon">
                …
            </span>

            <span>
                ${
                    language === 'ar'
                        ? 'جارٍ تسجيل الخروج'
                        : 'Signing out'
                }
            </span>
        `


        try {

            const result =
                await this.authService.signOut()


            if (!result.success) {

                console.error(
                    'Awtaar: Sign out failed.',
                    result.error
                )

                this.logoutButton.disabled =
                    false

                this.logoutButton.innerHTML =
                    originalHTML

                this.isSigningOut =
                    false

                return
            }


            /*
             * The platform remains visible.
             *
             * The user simply becomes a guest.
             */

            this.setUser(
                null
            )

            this.closeProfile()

        } catch (error) {

            console.error(
                'Awtaar: Unexpected sign out error.',
                error
            )

            this.logoutButton.disabled =
                false

            this.logoutButton.innerHTML =
                originalHTML
        }


        this.isSigningOut =
            false

        this.logoutButton.disabled =
            false
    }


    /* =========================================================
       TOGGLE LANGUAGE
       ========================================================= */

    toggleLanguage() {

        const currentLanguage =
            getLanguage()

        const newLanguage =
            currentLanguage === 'ar'
                ? 'en'
                : 'ar'


        setLanguage(
            newLanguage
        )

        this.updateLanguage()


        if (
            this.explorationUI &&
            typeof this.explorationUI.updateLanguage ===
            'function'
        ) {

            this.explorationUI.updateLanguage()
        }
    }


    /* =========================================================
       UPDATE LANGUAGE
       ========================================================= */

    updateLanguage() {

        const isArabic =
            getLanguage() === 'ar'


        this.title.textContent =
            t('platform.title')

        this.description.textContent =
            t('platform.description')

        this.exploreButton.textContent =
            t('platform.explore')


        this.languageButton.textContent =
            isArabic
                ? 'EN'
                : 'AR'


        this.container.dir =
            isArabic
                ? 'rtl'
                : 'ltr'


        this.userButton.setAttribute(
            'aria-label',
            isArabic
                ? 'فتح الحساب'
                : 'Open account'
        )


        if (this.currentUser) {

            const profileText =
                this.profileButton.querySelector(
                    '.awtaar-profile-action-text'
                )

            const logoutText =
                this.logoutButton.querySelector(
                    '.awtaar-profile-logout-text'
                )


            if (profileText) {

                profileText.textContent =
                    isArabic
                        ? 'الملف الشخصي'
                        : 'Profile'
            }


            if (logoutText) {

                logoutText.textContent =
                    isArabic
                        ? 'تسجيل الخروج'
                        : 'Sign out'
            }

            this.updateProfilePage()

        } else {

            this.updateGuestLanguage()
        }
    }


    /* =========================================================
       GUEST LANGUAGE
       ========================================================= */

    updateGuestLanguage() {

        const isArabic =
            getLanguage() === 'ar'


        this.guestTitle.textContent =
            isArabic
                ? 'استكشف أوتار بحرية'
                : 'Explore Awtaar freely'


        this.guestDescription.textContent =
            isArabic
                ? 'أنشئ حسابًا لحفظ تقدمك وإنجازاتك.'
                : 'Create an account to save your progress and achievements.'


        this.loginButton.textContent =
            isArabic
                ? 'تسجيل الدخول'
                : 'Sign in'


        this.signupButton.textContent =
            isArabic
                ? 'إنشاء حساب'
                : 'Create account'
    }


    /* =========================================================
       START EXPLORATION
       ========================================================= */

    startExploration() {

        console.log(
            '🌌 Awtaar Exploration Started'
        )


        this.exploreButton.disabled =
            true


        this.closeProfile()
        this.closeProfilePage()


        this.container.style.opacity =
            '0'

        this.container.style.pointerEvents =
            'none'


        setTimeout(
            () => {

                this.container.style.visibility =
                    'hidden'


                if (
                    this.explorationUI
                ) {

                    this.explorationUI.show()
                }

            },
            1200
        )
    }


    /* =========================================================
       SHOW
       ========================================================= */

    show() {

        this.updateLanguage()

        this.exploreButton.disabled =
            false

        this.loadCurrentUser()


        this.container.style.visibility =
            'visible'

        this.container.style.pointerEvents =
            'auto'


        requestAnimationFrame(
            () => {

                this.container.style.opacity =
                    '1'
            }
        )
    }


    /* =========================================================
       HIDE
       ========================================================= */

    hide() {

        this.closeProfile()
        this.closeProfilePage()

        this.container.style.opacity =
            '0'

        this.container.style.pointerEvents =
            'none'


        setTimeout(
            () => {

                this.container.style.visibility =
                    'hidden'

            },
            1200
        )
    }


    /* =========================================================
       UPDATE
       ========================================================= */

    update(delta) {

        if (
            this.explorationUI &&
            typeof this.explorationUI.update ===
            'function'
        ) {

            this.explorationUI.update(
                delta
            )
        }
    }


    /* =========================================================
       DESTROY
       ========================================================= */

    destroy() {

        if (
            this.handleDocumentClick
        ) {

            document.removeEventListener(
                'click',
                this.handleDocumentClick
            )
        }


        if (
            this.handleKeyDown
        ) {

            document.removeEventListener(
                'keydown',
                this.handleKeyDown
            )
        }


        if (
            this.explorationUI &&
            typeof this.explorationUI.destroy ===
            'function'
        ) {

            this.explorationUI.destroy()
        }


        if (
            this.container &&
            this.container.parentNode
        ) {

            this.container.parentNode.removeChild(
                this.container
            )
        }
    }
}