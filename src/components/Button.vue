<script>
  import { BUTTON_VARIANTS, BUTTON_VARIANT_CLASSES } from '../constants/buttons'

  export default {
    name: 'Button',

    data: () => ({
      BUTTON_VARIANTS,
      BUTTON_VARIANT_CLASSES,
    }),
  
    props: ({
      icon: {
        type: Function,
          required: false,
        },
      disable: {
        type: Boolean,
        default: false
      },
      variant: {
        type: String,
        default: BUTTON_VARIANTS.PRIMARY,
        validator: (v) => Object.values(BUTTON_VARIANTS).includes(v) //Verifies if the variant is valid
      },
      onClick: {
        type: Function,
        required: false 
      }
    }) 
  }
</script>

<template>
  <button
    :class="['flex px-4 py-3 gap-2 cursor-pointer', BUTTON_VARIANT_CLASSES[variant]]"
    @click="onClick"
  >
    <component
      :is="icon"
      size="22"
    />
    <slot/>
  </button>
</template>

