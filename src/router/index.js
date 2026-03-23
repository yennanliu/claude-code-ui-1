import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import ProjectDetailView from '../views/ProjectDetailView.vue'
import SessionDetailView from '../views/SessionDetailView.vue'
import StatsView from '../views/StatsView.vue'
import AppLayout from '../layouts/AppLayout.vue'

const routes = [
  {
    path: '/',
    component: LandingView
  },
  {
    path: '/projects',
    component: AppLayout,
    children: [
      {
        path: '',
        component: ProjectsView
      },
      {
        path: ':projectId',
        component: ProjectDetailView
      },
      {
        path: ':projectId/sessions/:sessionId',
        component: SessionDetailView
      }
    ]
  },
  {
    path: '/sessions/:sessionId',
    component: AppLayout,
    children: [
      {
        path: '',
        component: SessionDetailView
      }
    ]
  },
  {
    path: '/stats',
    component: AppLayout,
    children: [
      {
        path: '',
        component: StatsView
      }
    ]
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
