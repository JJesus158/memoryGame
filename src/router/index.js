import { createRouter, createWebHistory } from 'vue-router'
import Games from "@/singleGame/Games.vue";
import MemoryGame from "@/singleGame/Game.vue";

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
      name:'games',
      component: Games
    },
    {
      path: '/game',
      redirect: '/',
    },
    {
      path:'/game/:id',
      name: 'game',
      component: MemoryGame,
      props: route => ({ id: parseInt(route.params.id) })
    }
  ]
})

export default router
