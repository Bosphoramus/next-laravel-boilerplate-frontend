import useSWR, { mutate } from 'swr'
import api from '~/lib/api'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter()

    const { data: user, error } = useSWR('/api/user', async () => {
        try {
            const res = await api.get('/api/user')
            return res.data
        } catch (error) {
            if (error.response.status != 409) throw error
            router.push('/verify-email')
        }
    }, { shouldRetryOnError: false })

    const csrf = async () => await api.get('/sanctum/csrf-cookie')

    const register = async ({ setErrors, ...props }) => {
        await csrf()

        try {
            await api.post('/register', props)
            mutate('/api/user')
        } catch (error) {
            if (error.response.status != 422) throw error
            setErrors(Object.values(error.response.data.errors))
        }
    }

    const login = async ({ setErrors, ...props }) => {
        await csrf()

        try {
            await api.post('/login', props)
            mutate('/api/user')
        } catch (error) {
            if (error.response.status != 422) throw error
            setErrors(Object.values(error.response.data.errors))
        }
    }

    const forgotPassword = async ({ setErrors, setStatus, email }) => {
        await csrf()

        try {
            const response = await api.post('/forgot-password', { email })
            setStatus(response.data.status)
        } catch (error) {
            if (error.response.status != 422) throw error
            setErrors(Object.values(error.response.data.errors))
        }

    }

    const resetPassword = async ({ setErrors, setStatus, ...props }) => {
        await csrf()

        try {
            const response = await api.post('/reset-password', { token: router.query.token, ...props })
            setStatus(response.data.status)

            setTimeout(function () {
                router.push('/login')
            }, 1500)
        } catch (error) {
            if (error.response.status != 422) throw error
            setErrors(Object.values(error.response.data.errors))
        }

    }

    const resendEmailVerification = async ({ setStatus }) => {
        await api.post('/email/verification-notification')
        setStatus(response.data.status)
    }

    const logout = async (redirectAfterLogout = '/login') => {
        if (!error) {
            await api.post('/logout')
            mutate('/api/user', null, false)
        }

        router.push(redirectAfterLogout)
    }

    useEffect(() => {
        if (middleware == 'guest' && redirectIfAuthenticated && user) router.push(redirectIfAuthenticated)
        if (middleware == 'auth' && error) logout()
    }, [user, error])

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
    }
}
