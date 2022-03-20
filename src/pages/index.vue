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
// Moveable handler
const selectoRef = ref<any>(null)
const frameMap = ref(new Map())

const onClickGroupMoveable = (e: any) => {
  selectoRef.value?.clickTarget(e.inputEvent, e.inputTarget)
}

const onDragStartMoveable = (e: any) => {
  const target = e.target

  const [x, y] = target.style.transform.match(/(\d+)/g)
  if (!frameMap.value.has(target)) {
    frameMap.value.set(target, {
      translate: [Number(x), Number(y)],
    })
  }
  const frame = frameMap.value.get(target)
  e.set(frame.translate)
}

const onDragMoveable = (e: any) => {
  const target = e.target
  const frame = frameMap.value.get(target)

  frame.translate = e.beforeTranslate
  target.style.transform = `translate(${frame.translate[0]}px, ${frame.translate[1]}px)`
}

const onDragGroupStartMoveable = (e: any) => {
  e.events.forEach((ev: any) => {
    const target = ev.target

    const [x, y] = target.style.transform.match(/(\d+)/g)
    if (!frameMap.value.has(target)) {
      frameMap.value.set(target, {
        translate: [Number(x), Number(y)],
      })
    }
    const frame = frameMap.value.get(target)
    ev.set(frame.translate)
  })
}
const onDragGroupMoveable = (e: any) => {
  e.events.forEach((ev: any) => {
    const target = ev.target
    const frame = frameMap.value.get(target)

    frame.translate = ev.beforeTranslate
    target.style.transform = `translate(${frame.translate[0]}px, ${frame.translate[1]}px)`
  })
}

const onResizeStartMoveable = (e: any) => {
  e.setOrigin(['%', '%'])
  const target = e.target

  if (!frameMap.value.has(target)) {
    frameMap.value.set(target, {
      translate: [0, 0],
    })
  }

  const frame = frameMap.value.get(target)
  e.dragStart && e.dragStart.set(frame.translate)
}

const onResizeMoveable = (e: any) => {
  const beforeTranslate = e.drag.beforeTranslate

  const target = e.target
  const frame = frameMap.value.get(target)

  frame.translate = beforeTranslate

  e.target.style.width = `${e.width}px`
  e.target.style.height = `${e.height}px`

  e.target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`
}

const onResizeEndMoveable = ({ lastEvent }: any) => {
  if (lastEvent) {
    const curr = comps.value.find(item => item.id === lastEvent.target.dataset.id)
    if (curr) {
      curr.width = lastEvent.width
      curr.height = lastEvent.height
    }
  }
}

// Selecto handler
const targets = ref<HTMLDivElement[]>([])
const moveableRef = ref<any>(null)

const onDragStartSelecto = (e: any) => {
  const moveable = moveableRef.value
  const target = e.inputEvent.target
  if (moveable.isMoveableElement(target)
    || targets.value.some(t => t === target
      || t.contains(target)))
    e.stop()
}
const onSelectEndSelecto = (e: any) => {
  const moveable = moveableRef.value
  targets.value = [...e.selected]

  if (e.isDragStart) {
    e.inputEvent.preventDefault()

    setTimeout(() => {
      moveable.dragStart(e.inputEvent)
    })
  }
}
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
