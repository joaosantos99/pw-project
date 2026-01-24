<script>
import { Flame, Sun, Target, Menu } from "lucide-vue-next";

export default {
	name: "Header",

	components: {
		Flame,
		Target,
		Sun,
    Menu
	},

  methods: {
    showMenu() {
      this.$emit("show-menu");
    }
  }
};
</script>

<template>
  <header class="z-1 bg-brand-white fixed top-0 right-0 w-full lg:w-[calc(100%-280px)] flex items-center justify-between px-8 py-4 border-b border-solid">

    <div class="flex space-x-8 items-center">
      <div
        @click="showMenu"
        class="lg:hidden cursor-pointer"
      >
        <Menu/>
      </div>
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
