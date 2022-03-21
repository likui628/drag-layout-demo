import type { Ref } from 'vue'

export function useSelecto(moveableRef: Ref<any>, isResizing: Ref<boolean>, isGroupDragging: Ref<boolean>) {
  const targets = ref<HTMLDivElement[]>([])

  const onDragStart = (e: any) => {
    const moveable = moveableRef.value
    const target = e.inputEvent.target
    if (isResizing.value
      || isGroupDragging.value
      || moveable.isMoveableElement(target)
      || targets.value.some(t => t === target || t.contains(target)))
      e.stop()
  }

  const onSelectEnd = (e: any) => {
    const moveable = moveableRef.value

    targets.value = [...e.selected]

    if (e.isDragStart) {
      e.inputEvent.preventDefault()

      setTimeout(() => {
        moveable.dragStart(e.inputEvent)
      })
    }
  }
  return {
    targets,
    onDragStart,
    onSelectEnd,
  }
}
