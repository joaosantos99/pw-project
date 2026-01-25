<script>
  export default {
    name: "SelectField",

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
        required: false,
        default: "",
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
      options: {
        type: Array,
        required: true,
      },
      error: {
        type: String,
        required: false,
      },
    },

    emits: ["update:modelValue"],

    methods: {
      handleChange(event) {
        this.$emit("update:modelValue", event.target.value);
      },
    },
  };
  </script>

  <template>
    <div class="flex flex-col gap-1">
      <label :for="id" class="text-sm">{{ label }}</label>
      <select
        class="w-full text-sm p-2 border border-brand-primary"
        :id="id"
        :name="name"
        :value="modelValue"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${id}-error` : undefined"
        @change="handleChange"
      >
        <option value="" disabled v-if="placeholder">{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <p
        v-if="error"
        :id="`${id}-error`"
        class="text-sm text-brand-secondary"
        role="alert"
      >
        {{ error }}
      </p>
    </div>
  </template>
