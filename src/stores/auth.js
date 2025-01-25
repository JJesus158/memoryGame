import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
import { useRouter } from 'vue-router'

import * as response from "autoprefixer";

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter()
    const storeError = useErrorStore()
    const socket = inject('socket')

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

    const getFirstLastName = (fullName) => {
        const names = fullName.trim().split(' ')
        const firstName = names[0] ?? ''
        const lastName = names.length > 1 ? names[names.length -1 ] : ''
        return (firstName + ' ' + lastName).trim()
    }

    const userFirstLastName = computed(() => {
        return getFirstLastName(userName.value)
    })

    const userEmail = computed(() => {
        return user.value ? user.value.email : ''
    })

    const userType = computed(() => {
        return user.value ? user.value.type : ''
    })

    const userBlocked = computed(() => {
        return user.value ? user.value.blocked : false
    })

    const userNickName = computed(() => {
        return user.value? user.value.nickname : ''
    })

        const userPassword = computed(() => {
            return user.value ? user.value.password : ''
        })

    const userPhoto = computed(() => {
        return user.value ? user.value.photo : avatarNoneAssetURL;

    })


    const clearUser = () => {
        resetIntervalToRefreshToken()
        if (user.value) {
            socket.emit('logout', user.value)
        }
        user.value = null
        token.value = ''
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
            socket.emit('login', user.value)
            repeatRefreshToken() // Ensure this function is defined and doesn't throw
            await router.push({ name: 'home' })
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

    const refreshUserInfo = async () => {
        const responseUser = await axios.get('users/me')
        user.value = responseUser.data.data
        return user.value
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
                socket.emit('login', user.value)
                repeatRefreshToken()
                return true
            } catch {
                clearUser()
                return false
            }
        }
        return false
    }

    const registerProfile = async (userInfo) => {
        storeError.resetMessages()
        console.log(userInfo)
        try {
            const response = await axios.post('auth/register', userInfo)
            toast({
                description: 'Your Profile has been updated correctly!',
            })
            return response.data.data
        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error updating project!')
            return false
        }
    }

    const updateProfile = async function (userInfo) {
        storeError.resetMessages()
        console.log(userInfo)
        try {
            const response = await axios.patch('users/me', userInfo)
            toast({
                description: 'Your Profile has been updated correctly!',
            })
            user.value = response.data.data
            return response.data.data
        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error updating project!')
            return false
        }
    }



    const deleteAccount = async function () {
        storeError.resetMessages()
        try {
            await axios.delete('users/me/' + userId)
            return true
        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error deleting the account!')
            return false
        }
    }

    return {
        user, userId,userName, userEmail, userType, userPhoto,
        login, logout, restoreToken, userBalance, userNickName, userBlocked, deleteAccount, userPassword, updateProfile, registerProfile, refreshUserInfo, getFirstLastName
    }
})