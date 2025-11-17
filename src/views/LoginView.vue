<script>
  import ContentHeader from '../components/ContentHeader.vue'
  import Button from '../components/primitives/Button.vue'
  import PageWrapper from '../components/PageWrapper.vue'
  import Card from '../components/primitives/Card.vue'
  import InputField from '../components/primitives/InputField.vue'
  import { LAYOUTS } from '../constants/layout'

  export default {
    name: 'LoginView',

    components: {
      ContentHeader,
      Button,
      PageWrapper,
      Card,
      InputField,
    },

    data: () => ({
      LAYOUTS,
    }),
  }
</script>

<template>
  <PageWrapper :layout="LAYOUTS.NAKED">
    <div class="w-full h-screen flex items-center justify-center">
      <div class="w-full max-w-md flex flex-col gap-8">
        <img src="../assets/logo.svg" alt="logo" class="w-full max-w-[320px] h-full object-contain mx-auto" />
        <Card title="Login" subtitle="Login to your account to get started">
          <form class="flex flex-col gap-4">
              <InputField
              id="email"
              label="Email"
              placeholder="Enter your email"
              type="email"
            />
            <InputField
              id="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />
            <Button variant="primary" type="submit">Login</Button>
          </form>
        </Card>
        <p class="text-center">Don't have an account? <RouterLink class="text-center text-bold" to="/signup">Sign Up</RouterLink></p>
      </div>
    </div>
  </PageWrapper>
</template>
