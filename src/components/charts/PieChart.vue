<script>
import { VisXYContainer, VisArea } from '@unovis/vue'

const svgDefs = `
    <linearGradient id="gradient" gradientTransform="rotate(90)">
      <stop offset="20%" stop-color="#051937" />
      <stop offset="40%" stop-color="#004d7a" />
      <stop offset="60%" stop-color="#008793" />
      <stop offset="80%" stop-color="#00bf72" />
    </linearGradient>
  `
const x = (d) =>  d.x
const y = (d) =>  d.y
</script>

<template>
  <VisXYContainer :svgDefs="svgDefs" :data="data">
    <VisArea :x="x" :y="y" color="url(#gradient)" />
  </VisXYContainer>
</template>