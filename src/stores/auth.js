import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
import { useRouter } from 'vue-router'
import avatarNoneAssetURL from '@/assets/miscellaneous_small/20.png'

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter()
    const storeError = useErrorStore()
    const user = ref(null)
    const token = ref('')

    const userId = computed(() => {
        return user.value ? user.value.id : ''
    })

    const userBalance = computed(() => {
        return user.value ? user.value.brain_coins_balance : '';
    })

    const userName = computed(() => {
        return user.value ? user.value.name : ''
    })

    const userFirstLastName = computed(() => {
        const names = userName.value.trim().split(' ')
        const firstName = names[0] ?? ''
        const lastName = names.length > 1 ? names[names.length -1 ] : ''
        return (firstName + ' ' + lastName).trim()
    })

    const userEmail = computed(() => {
        return user.value ? user.value.email : ''
    })

    const userType = computed(() => {
        return user.value ? user.value.type : ''
    })

    const userGender = computed(() => {
        return user.value ? user.value.gender : ''
    })

    const userPhotoUrl = computed(() => {
        const photoFile = user.value ? user.value.photoFileName ?? '' : ''
        if (photoFile) {
            return axios.defaults.baseURL.replaceAll("/api", photoFile)
        }
        return avatarNoneAssetURL
    })

// This function is "private" - not exported by the store
    const clearUser = () => {
        resetIntervalToRefreshToken()
        user.value = null
        localStorage.removeItem('token')
        axios.defaults.headers.common.Authorization = ''
    }

    const login = async (credentials) => {
        try {
            const responseLogin = await axios.post('auth/login', credentials)
            if (!responseLogin.data || !responseLogin.data.token) {
                throw new Error("Login response doesn't contain token")
            }
            token.value = responseLogin.data.token
            localStorage.setItem('token', token.value)
            axios.defaults.headers.common.Authorization = 'Bearer ' + token.value
            const responseUser = await axios.get('users/me')
            user.value = responseUser.data.data
            repeatRefreshToken() // Ensure this function is defined and doesn't throw
            await router.push({ name: 'newgame' })
            return user.value
        } catch (e) {
            console.error("Error during login:", e)
            storeError.setErrorMessages(
                e.message || 'An error occurred during login',
                e.response?.data?.errors || {},
                e.response?.status || 500,
                'Authentication Error!'
            )
            return false
        }
    }

    const logout = async () => {
        storeError.resetMessages()
        try {
            await axios.post('auth/logout')
            clearUser()
            return true
        } catch (e) {
            clearUser()
            storeError.setErrorMessages(e.response.data.message, [], e.response.status,
                'Authentication Error!')
            return false
        }
    }

// These 2 functions and intervalToRefreshToken variable are "private" - not exported
    let intervalToRefreshToken = null
    const resetIntervalToRefreshToken = () => {
        if (intervalToRefreshToken) {
            clearInterval(intervalToRefreshToken)
        }
        intervalToRefreshToken = null
    }

    const repeatRefreshToken = () => {
        if (intervalToRefreshToken) {
            clearInterval(intervalToRefreshToken)
        }
        intervalToRefreshToken = setInterval(async () => {
            try {
                const response = await axios.post('auth/refreshtoken')
                token.value = response.data.token
                axios.defaults.headers.common.Authorization = 'Bearer ' + token.value
                return true
            } catch (e) {
                clearUser()
                storeError.setErrorMessages(e.response.data.message,
                    e.response.data.errors, e.response.status, 'Authentication Error!')
                return false
            }
        }, 1000 * 60 * 110)

        return intervalToRefreshToken
    }

    const restoreToken = async function () {
        let storedToken = localStorage.getItem('token')
        if (storedToken) {
            try {
                token.value = storedToken
                axios.defaults.headers.common.Authorization = 'Bearer ' + token.value
                const responseUser = await axios.get('users/me')
                user.value = responseUser.data.data
                repeatRefreshToken()
                return true
            } catch {
                clearUser()
                return false
            }
        }
        return false
    }

    return {
        user, userId,userName, userEmail, userType, userGender, userPhotoUrl,
        login, logout, restoreToken, userBalance
    }
})