import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createStore } from 'vuex';
import App from './App.vue'
import './index.css'
import signup from './user/signup.vue'
import login from './user/login.vue'
import chat from './talk_room/talkRooms.vue'
import NotFound from './common/NotFound.vue'

const routes = [
  { path: '/signup', component: signup },
  { path: '/login', component: login },
  { path: '/', component: chat , meta: { requiresAuth: true }},
  { path: '/:catchAll(.*)', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next('/login');
  } else {
    next();
  }
});

function isLoggedIn() {
  const token = getCookie("token");
  return !!token; 
}

function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
      }
  }
  return null;
}

const store = createStore({
  state() {
    return {
      signupMessage: '',
    };
  },
  mutations: {
    setSignupMessage (state, signupMessage) {
      state.signupMessage = signupMessage
    }
  }
});

createApp(App).use(router).use(store).mount('#app')
