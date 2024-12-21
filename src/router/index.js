import { createRouter, createWebHistory } from 'vue-router'
import NewGame from "@/components/singlePlayer/CreateGame.vue";
import Game from "@/components/singlePlayer/Game.vue";
import Games from "@/components/history/Games.vue";
import Login from "@/Login.vue";
import {useAuthStore} from "@/stores/auth.js";
import Transaction from "@/components/transactions/Transaction.vue";
import UserProfile from "@/components/user/UserProfile.vue";
import ProfileUpdateForm from "@/components/user/ProfileUpdateForm.vue";
import Register from "@/components/user/Register.vue";
import AnonymousGame from "@/components/singlePlayer/AnonymousGame.vue";
import ErrorPage from "@/components/ErrorPage.vue";
import Dashboard from "@/Dashboard.vue";
import UsersList from "@/components/history/UsersList.vue";
import RegisterAdmin from "@/components/user/RegisterAdmin.vue";
import MultiPlayerGames from '@/components/multiPlayer/MultiPlayerGames.vue';
import MultiGame from '@/components/multiPlayer/MultiGame.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Dashboard,
    },
    {
      path: '/games',
      name:'games',
      component: Games
    },
    {
      path: '/newgame',
      name: 'newgame',
      component: NewGame
    },
    {
      path:'/games/:id',
      name: 'game',
      component: Game,
      props: route => ({ id: parseInt(route.params.id) })
    },
    {
      path:'/login',
      name: 'login',
      component: Login
    },
    {
      path: '/shop',
      name: 'shop',
      component: Transaction
    },
    {
      path:'/me',
      name: 'me',
      component: UserProfile
    },
    {
      path: '/me/edit',
      name: 'editMe',
      component: ProfileUpdateForm
    },
    {
      path:'/register',
      name: 'register',
      component: Register
    },
    {
      path: '/guestGame',
      name: 'guestGame',
      component: AnonymousGame
    },
    {
      path: '/multi',
      name: 'multi',
      component: MultiPlayerGames
    },
    {
      path: '/multigame',
      name: 'multigame',
      component: MultiGame
    },
    {
      path: '/error/:errorCode',
      name: 'ErrorPage',
      component: ErrorPage
    },
    {
      path: '/users',
      name: 'users',
      component: UsersList
    },
    {
      path: '/register',
      name: 'registerAdmin',
      component: RegisterAdmin
    }

  ]
})

let handlingFirstRoute = true

router.beforeEach(async (to, from, next) => {
  const storeAuth = useAuthStore()

  if (handlingFirstRoute) {
    handlingFirstRoute = false
    await storeAuth.restoreToken()
  }

  if (((to.name === 'games') && (!storeAuth.user))) {
    next({ name: 'login' })
    return
  }

  if (((to.name === 'shop') && (!storeAuth.user))) {
    next({ name: 'login' })
    return
  }

  if (((to.name === 'me') && (!storeAuth.user))) {
    next({ name: 'login' })
    return
  }

  if (((to.name === 'game') && (!storeAuth.user))) {
    next({ name: 'login' })
    return
  }

  if (((to.name === 'multi') && (!storeAuth.user))) {
    next({ name: 'login' })
    return
  }

  if (((to.name === 'multigame') && (!storeAuth.user))) {
    next({ name: 'login' })
    return
  }

  next()
})


export default router
