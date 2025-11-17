<script>
  export default {
    name: 'InputField',

    props: {
      id: {
        type: String,
        required: true
      },
      label: {
        type: String,
        required: true
      },
      placeholder: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true
      },
    },
  }
</script>

<template>
  <div class="flex flex-col gap-2">
    <label :for="id" class="text-sm">{{ label }}</label>
    <input
      class="w-full text-sm p-2 border border-brand-primary"
      :id="id"
      :type="type"
      :value="value"
      :placeholder="placeholder"
    />
  </div>
</template>
