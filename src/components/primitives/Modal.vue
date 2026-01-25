<script>
  import { XIcon } from "lucide-vue-next";

  export default {
    name: "Modal",

    data: () => ({
      XIcon,
      previousActiveElement: null,
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

    mounted() {
      this.previousActiveElement = document.activeElement;
      this.$nextTick(() => {
        const modalElement = this.$refs.dialogElement;
        if (modalElement) {
          modalElement.focus();
        }
        document.body.style.overflow = "hidden";
      });
    },

    beforeUnmount() {
      document.body.style.overflow = "";
      if (this.previousActiveElement) {
        this.previousActiveElement.focus();
      }
    },

    methods: {
      handleClose() {
        this.$emit("close");
      },
      handleBackdropClick(event) {
        if (event.target === event.currentTarget) {
          this.handleClose();
        }
      },
      handleKeyDown(event) {
        if (event.key === "Escape") {
          this.handleClose();
        }
      },
    },
  };
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed z-2 inset-0 bg-black opacity-50 flex justify-center items-center"
      @click="handleBackdropClick"
      role="presentation"
    ></div>
    <div
      ref="dialogElement"
      class="w-[420px] z-2 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-white border-brand-primary p-6"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="title ? 'modal-title' : undefined"
      :aria-describedby="description ? 'modal-description' : undefined"
      tabindex="-1"
      @keydown="handleKeyDown"
    >
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <h2 v-if="title" id="modal-title" class="text-base font-semibold">{{ title }}</h2>
          <button
            @click="handleClose"
            class="cursor-pointer"
            aria-label="Close dialog"
          >
            <component :is="XIcon" size="22" aria-hidden="true"/>
          </button>
        </div>
        <div>
          <p v-if="description" id="modal-description">{{ description }}</p>
        </div>
        <div>
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
