<script>
  import { LogOutIcon } from 'lucide-vue-next'
  import { mapActions } from 'pinia'

  import ContentHeader from '../components/ContentHeader.vue'
  import Button from '../components/primitives/Button.vue'
  import PageWrapper from '../components/PageWrapper.vue'
  import { useAuthStore } from '../stores/auth'

  export default {
    name: 'ProfileView',

    components: {
      ContentHeader,
      Button,
      PageWrapper,
    },

    data: () => ({
      LogOutIcon,
    }),

    methods: {
      ...mapActions(useAuthStore, ['logout']),
      async handleLogout() {
        await this.logout()
        this.$router.push('/login')
      },
    },
  }
</script>

<template>
  <PageWrapper>
    <ContentHeader
      title="Profile & Settings"
      paragraph="Manage your account and preferences"
      buttonLabel="Logout"
      :buttonIcon="LogOutIcon"
      :onClick="handleLogout"
    />
    <div class="flex flex-col gap-6"></div>
  </PageWrapper>
</template>
