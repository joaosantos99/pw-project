<script>
  import {
    Flame,
    Target,
    Sun
  } from 'lucide-vue-next';

  export default {
    name: 'Header',

    components: {
      Flame,
      Target,
      Sun,
    },
  }
</script>

<template>
  <header class="flex items-center justify-between px-8 py-4 border-b border-solid">

    <div class="flex space-x-8">
      <!-- Streak -->
      <div class="flex space-x-4 items-center">
        <Flame
          color = "#E54B4F"
        />
        <div>
          <div>
            Streak
          </div>
          <div class="font-semibold">
            7 days
          </div>
        </div>
      </div>

      <!-- Daily Goal -->
      <div class="flex space-x-4 items-center">
        <Target />
        <div class="space-y-1">
          <div class="flex justify-between space-x-4">
            <div>Daily Goal</div>
            <div>2.5h/4h</div>
          </div>
          <div class="h-2 bg-neutral-200 rounded-xl overflow-hidden">
            <div class="bg-indigo-600 h-full w-1/2" id="progress-bar">
            </div>
          </div>
        </div>
      </div>
    </div>


    <Sun />

  </header>

</template>

<style scoped>

</style>
