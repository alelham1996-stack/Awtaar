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
// Validate Environment
// =========================================================

if (
    !SUPABASE_URL ||
    !SUPABASE_PUBLISHABLE_KEY
) {

    console.error(
        'Awtaar Auth: Supabase environment variables are missing.'
    )

}


// =========================================================
// Supabase Client
// =========================================================

const supabase =
    createClient(

        SUPABASE_URL,

        SUPABASE_PUBLISHABLE_KEY

    )


// =========================================================
// AuthService
// =========================================================

export default class AuthService {


    // =====================================================
    // Get Current User
    // =====================================================

    async getCurrentUser() {

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