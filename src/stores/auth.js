import { defineStore } from 'pinia'

import { getLocalStorage, setLocalStorage, removeLocalStorage } from '../utils/localStorage'

export const useAuthStore = defineStore('auth', {
  state: () => ({ auth: getLocalStorage('auth') }),
  getters: {
    isAuthenticated: (state) => !!state.auth
  },
  actions: {
    async login(user, session) {
      const auth = { user, session }

      delete auth.user.password

      setLocalStorage('auth', { user , session })
      this.auth = auth
    },
    async logout() {
      removeLocalStorage('auth')
      this.auth = null
    },
    async signup(user, session) {
      const auth = { user, session }

      delete auth.user.password

      setLocalStorage('auth', { user , session })
      this.auth = auth
    },
  },
});
