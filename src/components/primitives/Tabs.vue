<script>
  export default {
    name: "Tabs",

    props: {
      tabs: {
        type: Array,
        required: true,
      },
      activeTab: {
        type: String,
        required: false,
        default: null,
      },
    },

    emits: ["tabClick"],

    methods: {
      handleTabClick(tabValue) {
        this.$emit("tabClick", tabValue);
      },
    },
  };
</script>

<template>
  <div class="inline-block bg-brand-gray p-1">
    <div class="flex gap-1">
      <button
        class="text-brand-primary w-36 py-2 cursor-pointer"
        v-for="tab in tabs"
        :key="tab.value"
        :class="{ 'bg-brand-white': activeTab === tab.value }"
        @click="handleTabClick(tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>
