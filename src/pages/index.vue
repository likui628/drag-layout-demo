<template>
  <div class="container">
    <div class="toolbox">
      <button @click="onScrollCenter">
        Scroll Center
      </button>
    </div>
    <div class="main">
      <InfiniteViewer
        ref="viewerRef"
        class="elements infinite-viewer"
        @dragenter.prevent
        @dragover.prevent
        @drop="onDrop"
        @scroll="onViewerScroll"
      >
        <div ref="canvasRef" class="selecto-area">
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
          <Moveable
            ref="moveableRef"
            :target="targets"
            :draggable="true"
            :resizable="true"
            :snappable="true"
            :element-guidelines="guidelines"
            :is-display-snap-digit="false"
            :scrollable="true"
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
      </InfiniteViewer>

      <div class="comps">
        <Comps />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Moveable from 'vue3-moveable'
import { VueSelecto as Selecto } from 'vue3-selecto'
import { VueInfiniteViewer as InfiniteViewer } from 'vue3-infinite-viewer'
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

const scale = ref(1)
const comps = ref<CompInterface[]>([])
const canvasRef = ref<HTMLDivElement | null>(null)
const viewerRef = ref<any>(null)
const selectoRef = ref<any>(null)
const moveableRef = ref<any>(null)

const onScrollCenter = () => {
  viewerRef.value.scrollCenter()
}

const onViewerScroll = () => {
  selectoRef.value.checkScroll()
}

const onDrop = (e: DragEvent) => {
  const rect = canvasRef.value?.getClientRects()[0]
  if (rect) {
    const type = e.dataTransfer?.getData('text/html') || 'rect'
    const width = type === 'rect' ? 60 : 40
    const height = 40
    const left = (e.clientX - rect.left - width / 2) / scale.value
    const top = (e.clientY - rect.top - height / 2) / scale.value

    comps.value.push({
      id: uuidv4(),
      type,
      width,
      height,
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

const guidelines = ref<HTMLDivElement[]>([])

watch([() => comps.value.length, targets], () => {
  nextTick(() => {
    guidelines.value = []
    const targetIds = targets.value.map(item => item.dataset.id)

    const nodeList = document.querySelectorAll('.target')
    const tempList = Array.from(nodeList) as HTMLDivElement[]

    tempList.filter(item => !targetIds.includes(item.dataset.id))
      .forEach((node) => {
        guidelines.value.push(node)
      })
  })
}, { deep: true })
</script>

<style>
.container {
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 20px;
}

.toolbox {
  display: flex;
  align-items: center;
  padding: 10px;
}

.main {
  display: flex;
  padding: 10px;
}

.elements {
  border: 2px solid #eee;
}

.infinite-viewer {
  width: 500px;
  height: 500px;
}

.selecto-area {
  width: 100%;
  height: 100%;
}
.comps {
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
