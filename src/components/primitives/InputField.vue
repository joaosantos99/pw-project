<script>
export default {
	name: "InputField",

	props: {
		id: {
			type: String,
			required: true,
		},
		label: {
			type: String,
			required: true,
		},
		placeholder: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		modelValue: {
			type: [String, Number],
			required: false,
			default: "",
		},
		error: {
			type: String,
			required: false,
		},
	},

	emits: ["update:modelValue"],

	methods: {
		handleInput(event) {
			this.$emit("update:modelValue", event.target.value);
		},
	},
};
</script>

<template>
  <div class="flex flex-col gap-1">
    <label :for="id" class="text-sm">{{ label }}</label>
    <input
      class="w-full text-sm p-2 border border-brand-primary"
      :id="id"
      :name="name"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      @input="handleInput"
    />
    <p class="text-sm text-brand-secondary" v-if="error">{{ error }}</p>
  </div>
</template>
