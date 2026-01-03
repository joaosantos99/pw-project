<script>
  import { XIcon } from "lucide-vue-next";

  export default {
    name: "Modal",

    data: () => ({
      XIcon,
    }),

    props: {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: false,
      },
    },

    emits: ["close"],

    methods: {
      handleClose() {
        this.$emit("close");
      },
      handleBackdropClick(event) {
        if (event.target === event.currentTarget) {
          this.handleClose();
        }
      },
    },
  };
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black opacity-50 flex justify-center items-center"
      @click="handleBackdropClick"
    ></div>
    <div class="w-[420px] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-white border-brand-primary p-6">
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <span class="text-base font-semibold" v-if="title">{{ title }}</span>
          <button @click="handleClose" class="cursor-pointer">
            <component :is="XIcon" size="22"/>
          </button>
        </div>
        <div>
          <p v-if="description">{{ description }}</p>
        </div>
        <div>
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
