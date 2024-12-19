import { createRouter, createWebHistory } from 'vue-router'
import NewGame from "@/singleGame/CreateGame.vue";
import Game from "@/singleGame/Game.vue";
import Games from "@/History/Games.vue";
import Login from "@/Login.vue";
import {useAuthStore} from "@/stores/auth.js";
import Transaction from "@/Transactions/Transaction.vue";
import UserProfile from "@/user/UserProfile.vue";
import ProfileUpdateForm from "@/user/ProfileUpdateForm.vue";
import Register from "@/user/Register.vue";
import AnonymousGame from "@/singleGame/AnonymousGame.vue";
import ErrorPage from "@/components/ErrorPage.vue";
import {Home} from "lucide-vue-next";
import Dashboard from "@/Dashboard.vue";
import UsersList from "@/History/UsersList.vue";
import RegisterAdmin from "@/user/RegisterAdmin.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
      /*
    {
      path: '/tasks',
      redirect: { name: 'tasks' }
    },
    {
      path: '/projects',
      name: 'projects',
      component: Projects
    },
    {
      path: '/tasks/:id',
      name: 'updateTask',
      component: TaskUpdate,
      props: route => ({ id: parseInt(route.params.id) })
    },
    {
      path: '/projects/:id',
      name: 'updateProject',
      component: ProjectUpdate,
      props: route => ({ id: parseInt(route.params.id) })
    },
    {
      path: '/projects/new',
      name: 'createProject',
      component: ProjectCreate,
    },

       */
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

  next()
})


export default router
