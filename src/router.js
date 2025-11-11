import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from './views/HomeView.vue'
import TimerView from './views/TimerView.vue'
import GoalsView from './views/GoalsView.vue'
import SubjectsView from './views/SubjectsView.vue'
import SessionsView from './views/SessionsView.vue'
import ProfileView from './views/ProfileView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/timer', component: TimerView },
  { path: '/goals', component: GoalsView },
  { path: '/subjects', component: SubjectsView },
  { path: '/sessions', component: SessionsView },
  { path: '/profile', component: ProfileView },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
