<template>
  <div class="comp circle" draggable="true" @dragstart="onDragStart($event,'circle')" />
  <div class="comp rect" draggable="true" @dragstart="onDragStart($event,'rect')" />
</template>
<script lang="ts" setup>
const onDragStart = (e: DragEvent, type: string) => {
  e.dataTransfer?.setData('text/html', type)
}
</script>

<style>
.comp {
    display: inline-block;
    margin: 10px;
    background: #eee;
    --color: #4af;
    border: 1px #eee;

}

.circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.rect {
    width: 60px;
    height: 40px;
}
</style>
