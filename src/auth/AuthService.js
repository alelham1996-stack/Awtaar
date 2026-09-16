/* =========================================================
   AWTAAR — AUTH SERVICE
   Supabase Authentication
   ========================================================= */

import { createClient } from '@supabase/supabase-js'


// =========================================================
// Supabase Configuration
// =========================================================

const SUPABASE_URL =
    import.meta.env.VITE_SUPABASE_URL

const SUPABASE_PUBLISHABLE_KEY =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY


// =========================================================
// Supabase Availability
// =========================================================

const SUPABASE_ENABLED =
    Boolean(
        SUPABASE_URL &&
        SUPABASE_PUBLISHABLE_KEY
    )


if (!SUPABASE_ENABLED) {

    console.warn(
        'Awtaar Auth: Supabase environment variables are missing. Auth is disabled.'
    )

}


// =========================================================
// Supabase Client
// =========================================================

const supabase =
    SUPABASE_ENABLED
        ? createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        )
        : null


// =========================================================
// AuthService
// =========================================================

export default class AuthService {


    // =====================================================
    // Get Current User
    // =====================================================

    async getCurrentUser() {

        if (!supabase) {

            return null

        }


        const {
            data,
            error
        } =
            await supabase.auth.getUser()


        if (error) {

            return null

        }


        return data?.user || null

    }


    // =====================================================
    // Get Current Session
    // =====================================================

    async getSession() {

        if (!supabase) {

            return null

        }


        const {
            data,
            error
        } =
            await supabase.auth.getSession()


        if (error) {

            console.error(
                'Awtaar Auth: Failed to get session.',
                error
            )

            return null

        }


        return data?.session || null

    }


    // =====================================================
    // Create Account
    // =====================================================

    async signUp(
        email,
        password,
        username
    ) {

        const cleanEmail =
            String(email || '')
                .trim()
                .toLowerCase()


        const cleanUsername =
            String(username || '')
                .trim()


        if (
            !cleanEmail ||
            !password ||
            !cleanUsername
        ) {

            return {

                success: false,

                user: null,

                session: null,

                error:
                    'Missing required fields.'

            }

        }


        if (!supabase) {

            return {

                success: false,

                user: null,

                session: null,

                error:
                    'Authentication is currently unavailable.'

            }

        }


        const {
            data,
            error
        } =
            await supabase.auth.signUp({

                email:
                    cleanEmail,

                password,

                options: {

                    data: {

                        username:
                            cleanUsername

                    }

                }

            })


        if (error) {

            console.error(
                'Awtaar Auth: Sign up failed.',
                error
            )


            return {

                success: false,

                user: null,

                session: null,

                error

            }

        }


        return {

            success: true,

            user:
                data?.user || null,

            session:
                data?.session || null,

            error: null

        }

    }


    // =====================================================
    // Sign In
    // =====================================================

    async signIn(
        email,
        password
    ) {

        const cleanEmail =
            String(email || '')
                .trim()
                .toLowerCase()


        if (
            !cleanEmail ||
            !password
        ) {

            return {

                success: false,

                user: null,

                session: null,

                error:
                    'Email and password are required.'

            }

        }


        if (!supabase) {

            return {

                success: false,

                user: null,

                session: null,

                error:
                    'Authentication is currently unavailable.'

            }

        }


        const {
            data,
            error
        } =
            await supabase.auth.signInWithPassword({

                email:
                    cleanEmail,

                password

            })


        if (error) {

            console.error(
                'Awtaar Auth: Sign in failed.',
                error
            )


            return {

                success: false,

                user: null,

                session: null,

                error

            }

        }


        return {

            success: true,

            user:
                data?.user || null,

            session:
                data?.session || null,

            error: null

        }

    }


    // =====================================================
    // Sign Out
    // =====================================================

    async signOut() {

        if (!supabase) {

            return {

                success: true,

                error: null

            }

        }


        const {
            error
        } =
            await supabase.auth.signOut()


        if (error) {

            console.error(
                'Awtaar Auth: Sign out failed.',
                error
            )


            return {

                success: false,

                error

            }

        }


        return {

            success: true,

            error: null

        }

    }


    // =====================================================
    // Auth State Listener
    // =====================================================

    onAuthStateChange(
        callback
    ) {

        if (!supabase) {

            return null

        }


        const {
            data
        } =
            supabase.auth.onAuthStateChange(

                (
                    event,
                    session
                ) => {

                    if (
                        typeof callback ===
                        'function'
                    ) {

                        callback(
                            event,
                            session
                        )

                    }

                }

            )


        return data?.subscription || null

    }


    // =====================================================
    // Remove Auth Listener
    // =====================================================

    unsubscribe(
        subscription
    ) {

        if (
            subscription &&
            typeof subscription.unsubscribe ===
            'function'
        ) {

            subscription.unsubscribe()

        }

    }


    // =====================================================
    // Get Username
    // =====================================================

    async getUsername() {

        const user =
            await this.getCurrentUser()


        if (!user) {

            return null

        }


        return (
            user.user_metadata?.username ||
            null
        )

    }


}


// =========================================================
// Shared Supabase Client
// =========================================================

export {
    supabase
}