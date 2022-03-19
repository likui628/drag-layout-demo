<template>
  <div class="container">
    <div className="elements selecto-area">
      <div v-for="i in 20" :key="i" class="cube target" />
    </div>
    <div className="empty elements" />
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

const moveableRef = ref<any>(null)
const selectoRef = ref<any>(null)

const frameMap = ref(new Map())
const targets = ref<HTMLDivElement[]>([])

// Moveable handler
const onClickGroupMoveable = (e: any) => {
  selectoRef.value?.clickTarget(e.inputEvent, e.inputTarget)
}

const onDragStartMoveable = (e: any) => {
  const target = e.target

  if (!frameMap.value.has(target)) {
    frameMap.value.set(target, {
      translate: [0, 0],
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

    if (!frameMap.value.has(target)) {
      frameMap.value.set(target, {
        translate: [0, 0],
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

// Selecto handler
const onDragStartSelecto = (e: any) => {
  const moveable = moveableRef.value
  const target = e.inputEvent.target
  if (moveable.isMoveableElement(target) || targets.value.some(t => t === target || t.contains(target)))
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
}

.cube {
    display: inline-block;
    border-radius: 5px;
    width: 40px;
    height: 40px;
    margin: 10px;
    background: #eee;
    --color: #4af;
}

.elements {
    margin-top: 40px;
    border: 2px solid #eee;
}

.selecto-area {
    padding: 20px;
    width: 500px;
    height: 500px;
}

.empty.elements {
    border: none;
}
</style>
