import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import {useErrorStore} from "@/stores/error.js";


export const useUserStore = defineStore('user', () => {
    const listOfUsers = ref([])
    const storeError = useErrorStore();
    const totalPages = ref(1);


    const loadUsers = async (currentPage) => {
        const response = await axios.get("/users", {
            params: {
                page: currentPage
            }
        });


        totalPages.value = response.data.meta.last_page;

        listOfUsers.value = response.data.data.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            type: user.type,
            nickname: user.nickname,
            blocked: user.blocked,
            brain_coins_balance: user.brain_coins_balance,
            photoFileName: user.photoFileName,
        }));
    }

    const getIndexOfUser= (userId) => {
        return listOfUsers.value.findIndex((p) => p.id === userId)
    }


    const fetchUser = async (userId) => {
        storeError.resetMessages()
        const response = await axios.get('users/' + userId)
        const index = getIndexOfUser(userId)
        if (index > -1) {
            // Instead of a direct assignment, object is cloned/copied to the array
            // This ensures that the object in the array is not the same as the object fetched
            listOfUsers.value[index] = Object.assign({}, response.data.data)
        }
        return response.data.data
    }

    const insertUser = async (user) => {
        storeError.resetMessages()
        try {
            const response = await axios.post('/users', user)
            console.log(response.data.data)
            listOfUsers.value.push(response.data.data)
            toast({
                description: `Please verify the email!`
            })
            return response.data.data
        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error creating user!')
            return false
        }
    }


    const updateUser = async (user) => {
        storeError.resetMessages()
        try {
            console.log(user)
            console.log(user.id)
            const response = await axios.put('users/' + user.id, user)
            const index = getIndexOfUser(user.id)
            if (index > -1) {
                // Instead of a direct assignment, object is cloned/copied to the array
                // This ensures that the object in the array is not the same as the object fetched
                listOfUsers.value[index] = Object.assign({}, response.data.data)
            }
            toast({
                description: 'User has been updated correctly!',
            })
            return response.data.data
        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error updating project!')
            return false
        }
    }

  


    const deleteUser = async (user) => {
        storeError.resetMessages()
        try {
            await axios.delete('users/' + user.id)
            const index = getIndexOfUser(user.id)
            if (index > -1) {
                listOfUsers.value.splice(index, 1);
            }
            toast({
                description: 'User has been updated correctly!',
            })
            return true
        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error deleting user!')
            return false
        }
    }

    const blockUser = async (user) => {
        storeError.resetMessages();
        try {
            const response= await axios.patch(`users/${user.id}`, { action: 'block' }); // Indicate the specific action in the request body
            const index = getIndexOfUser(user.id)
            if (index > -1) {
                // Instead of a direct assignment, object is cloned/copied to the array
                // This ensures that the object in the array is not the same as the object fetched
                listOfUsers.value[index] = Object.assign({}, response.data.data)
            }
            toast({
                description: 'User has been updated correctly!',
            })
        } catch (e) {
            storeError.setErrorMessages(
                e.response?.data?.message || 'Unexpected error occurred.',
                e.response?.data?.errors || [],
                e.response?.status || 500,
                'Error blocking user!'
            );
            return false;
        }
    };

    const unblockUser = async (user) => {
        storeError.resetMessages();
        try {
            const response= await axios.patch(`users/${user.id}`, { action: 'unblock' }); // Indicate the specific action in the request body
            const index = getIndexOfUser(user.id)
            if (index > -1) {
                // Instead of a direct assignment, object is cloned/copied to the array
                // This ensures that the object in the array is not the same as the object fetched
                listOfUsers.value[index] = Object.assign({}, response.data.data)
            }
            toast({
                description: 'User has been updated correctly!',
            })
        } catch (e) {
            storeError.setErrorMessages(
                e.response?.data?.message || 'Unexpected error occurred.',
                e.response?.data?.errors || [],
                e.response?.status || 500,
                'Error unblocking user!'
            );
            return false;
        }
    };





    return{loadUsers, listOfUsers, insertUser, fetchUser, updateUser,blockUser, unblockUser, deleteUser,totalPages};
});