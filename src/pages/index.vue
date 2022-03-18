<template>
  <div class="container">
    <div class="target">
      Target1
    </div>
    <div class="target target1">
      Target2
    </div>
    <button @click="toggleDraggable">
      Toggle {{ draggable }}
    </button>
    <moveable
      :target="['.target1']"
      :draggable="draggable"
      :throttle-drag="1"
      :edge-draggable="false"
      :start-drag-rotate="0"
      :throttle-drag-rotate="0"
      @drag="onDrag"
      @drag-group="onDragGroup"
    />
  </div>
</template>

<script setup lang="ts">
import Moveable from 'vue3-moveable'
const draggable = ref(false)

const onDrag = ({ target, transform }: any) => {
  target.style.transform = transform
}

const onDragGroup = ({ targets, events }: any) => {
  events.forEach((ev: any) => {
    ev.target!.style.transform = ev.transform
  })
}

const toggleDraggable = () => {
  draggable.value = !draggable.value
}
</script>

<style>
.container {
  position: relative;
  margin-top: 50px;
}
.target {
  position: absolute;
  width: 100px;
  height: 100px;
  top: 150px;
  left: 100px;
  line-height: 100px;
  text-align: center;
  background: #ee8;
  color: #333;
  font-weight: bold;
  border: 1px solid #333;
  box-sizing: border-box;
}

.target1{
  top: 150px;
  left: 250px;
}

</style>
