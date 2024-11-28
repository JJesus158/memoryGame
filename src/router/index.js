import { createRouter, createWebHistory } from 'vue-router'
import NewGame from "@/singleGame/CreateGame.vue";
import Game from "@/singleGame/Game.vue";
import Games from "@/Games.vue";
import Login from "@/Login.vue";
import {useAuthStore} from "@/stores/auth.js";

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

  next()
})

export default router
