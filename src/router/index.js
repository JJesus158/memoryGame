import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

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
