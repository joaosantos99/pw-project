<script>
  import {
    BookMarkedIcon,
    BookOpenIcon,
    LayoutDashboardIcon,
    TimerIcon,
    TargetIcon,
    UserIcon,
  } from 'lucide-vue-next'

  import MenuItem from './MenuItem.vue'

  export default {
    name: 'Sidebar',

    components: {
      MenuItem,
    },

    data() {
      return {
        menuItems: [
          {
            icon: LayoutDashboardIcon,
            label: 'Home',
            to: '/',
          },
          {
            icon: TimerIcon,
            label: 'Timer',
            to: '/timer',
          },
          {
            icon: TargetIcon,
            label: 'Goals',
            to: '/goals',
          },
          {
            icon: BookMarkedIcon,
            label: 'Subjects',
            to: '/subjects',
          },
          {
            icon: BookOpenIcon,
            label: 'Sessions',
            to: '/sessions',
          },
          {
            icon: UserIcon,
            label: 'Profile',
            to: '/profile',
          },
        ],
      }
    },

    methods: {
      isActivePath(path) {
        if (path === '/') {
          return this.$route.fullPath === '/'
        }

        return this.$route.fullPath.includes(path)
      },
    },

    setup() {
      return {
        LayoutDashboardIcon,
        TimerIcon,
        TargetIcon,
        BookMarkedIcon,
        BookOpenIcon,
        UserIcon,
      }
    },
  }
</script>

<template>
  <aside class="max-w-[280px] w-full h-screen border-r border-brand-primary">
    <div class="h-full flex flex-col justify-between p-6">
      <div class="flex flex-col gap-6">
        <section>
          <img src="../assets/logo.svg" alt="logo" class="w-full h-full object-contain" />
        </section>
        <section class="flex flex-col gap-2">
          <MenuItem
            v-for="item in menuItems"
            :key="item.label"
            :icon="item.icon"
            :label="item.label"
            :to="item.to"
            :is-active="isActivePath(item.to)"
          />
        </section>
      </div>
      <section class="border-t border-brand-primary">
        <p class="text-xs text-center pt-4">Track your learning journey!</p>
      </section>
    </div>
  </aside>
</template>
