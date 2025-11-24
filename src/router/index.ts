import { createRouter, createWebHistory } from 'vue-router'
import UserLoginView from '@/views/user/UserLoginView.vue'
import UserRegisterView from '@/views/user/UserRegisterView.vue'
import HomeView from '@/views/HomeView.vue'
import ChallengerView from '@/views/ChallengerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/user/login',
      name: '用户登录',
      component: UserLoginView,
    },
    {
      path: '/user/register',
      name: '用户注册',
      component: UserRegisterView,
    },
    {
      path: '/challenger',
      name: '挑战者',
      component: ChallengerView,
    }
  ],
})

export default router
