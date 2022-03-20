<template>
  <div class="container">
    <div
      ref="canvasRef"
      class="elements selecto-area"
      @dragenter.prevent
      @dragover.prevent
      @drop="onDrop"
    >
      <template v-for="comp in comps" :key="comp.id">
        <CompItem
          :id="comp.id"
          class="cube target"
          :width="comp.width"
          :height="comp.height"
          :left="comp.left"
          :top="comp.top"
          :type="comp.type"
        />
      </template>
    </div>
    <div class="comps">
      <Comps />
    </div>

    <Moveable
      ref="moveableRef"
      :target="targets"
      :draggable="true"
      :resizable="true"
      @click-group="onClickGroupMoveable"
      @drag="onDragMoveable"
      @drag-start="onDragStartMoveable"
      @drag-group-start="onDragGroupStartMoveable"
      @drag-group="onDragGroupMoveable"
      @resize-start="onResizeStartMoveable"
      @resize="onResizeMoveable"
      @resize-end="onResizeEndMoveable"
    />
    <Selecto
      ref="selectoRef"
      drag-container=".elements"
      :selectable-targets="['.target']"
      :toggle-continue-select="['shift']"
      @drag-start="onDragStartSelecto"
      @select-end="onSelectEndSelecto"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Moveable from 'vue3-moveable'
import { VueSelecto as Selecto } from 'vue3-selecto'
import { v4 as uuidv4 } from 'uuid'
import { useSelecto } from '~/composables/selecto'
import { useMoveable } from '~/composables/moveable'

interface CompInterface {
  id: string
  type: string
  width: number
  height: number
  left: number
  top: number
}

const comps = ref<CompInterface[]>([])
const canvasRef = ref<HTMLDivElement | null>(null)
const selectoRef = ref<any>(null)
const moveableRef = ref<any>(null)

const onDrop = (e: DragEvent) => {
  const rect = canvasRef.value?.getClientRects()[0]
  if (rect) {
    const type = e.dataTransfer?.getData('text/html') || 'rect'
    const left = e.clientX - rect.left
    const top = e.clientY - rect.top
    comps.value.push({
      id: uuidv4(),
      type,
      width: type === 'rect' ? 60 : 40,
      height: 40,
      top,
      left,
    })
  }
}

const {
  onClickGroup: onClickGroupMoveable,
  onDragStart: onDragStartMoveable,
  onDrag: onDragMoveable,
  onDragGroupStart: onDragGroupStartMoveable,
  onDragGroup: onDragGroupMoveable,
  onResizeStart: onResizeStartMoveable,
  onResize: onResizeMoveable,
  onResizeEnd: onResizeEndMoveable,
} = useMoveable(selectoRef, comps)

const {
  targets,
  onDragStart: onDragStartSelecto,
  onSelectEnd: onSelectEndSelecto,
} = useSelecto(moveableRef)
</script>

<style>
.container {
  position: relative;
  max-height: 800px;
  margin-top: 50px;
  display: flex;
}
.selecto-area {
  padding: 20px;
  width: 500px;
  height: 500px;
  margin-top: 40px;
  border: 2px solid #eee;
}
.comps {
  margin-top: 40px;
  padding: 20px;
  width: 100px;
  height: 500px;
  border: 2px solid #eee;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cube {
  display: inline-block;
  position: absolute;
  border-radius: 5px;
  margin: 10px;
  background: #eee;
  --color: #4af;
}

.empty.elements {
  border: none;
}
</style>
