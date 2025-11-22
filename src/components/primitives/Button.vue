<script>
import { BUTTON_VARIANT_CLASSES, BUTTON_VARIANTS } from "@/constants/buttons";

export default {
	name: "Button",

	data: () => ({
		BUTTON_VARIANTS,
		BUTTON_VARIANT_CLASSES,
	}),

	props: {
		icon: {
			type: Function,
			required: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		variant: {
			type: String,
			default: BUTTON_VARIANTS.PRIMARY,
			validator: (v) => Object.values(BUTTON_VARIANTS).includes(v), //Verifies if the variant is valid
		},
		onClick: {
			type: Function,
			required: false,
		},
		subtitle: {
			type: String,
			required: false,
		},
	},
};
</script>

<template>
  <button
    :class="[
      'flex justify-center px-6 py-4 gap-2 cursor-pointer items-center',
      BUTTON_VARIANT_CLASSES[variant]
    ]"
    @click="onClick"
  >
    <component
      v-if="icon"
      :is="icon"
      size="22"
    />

    <div class="flex flex-col text-left leading-tight">
      <span class="font-semibold">
        <slot/>
      </span>
      <span class="text-sm opacity-90">
        {{ subtitle }}
      </span>
    </div>
  </button>
</template>
