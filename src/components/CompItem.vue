<template>
  <div
    ref="el"
    style="left:0;top:0"
    :style="{
      width: props.width + 'px',
      height: props.height + 'px',
      'border-radius': props.type === 'circle' ? '50%' : '',
    }"
    :data-id="props.id"
  />
</template>
<script lang="ts" setup>
const props = defineProps<{
  id: string
  width: number
  height: number
  left: number
  top: number
  type: string
}>()

const el = ref()

onMounted(() => {
  el.value.style.transform = `translate(${props.left}px, ${props.top}px)`
})
</script>
