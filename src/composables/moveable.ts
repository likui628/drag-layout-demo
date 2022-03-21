import type { Ref } from 'vue'

export function useMoveable(
  selectoRef: Ref<any>,
  comps: Ref<{ id: string; width: number; height: number }[]>,
) {
  const frameMap = ref(new Map())
  const isResizing = ref(false)
  const isGroupDragging = ref(false)

  const initTargetFrame = (target: any) => {
    const [x, y] = target.style.transform.match(/(\d+)/g)
    if (!frameMap.value.has(target)) {
      frameMap.value.set(target, {
        translate: [Number(x), Number(y)],
      })
    }
  }

  const onClickGroup = (e: any) => {
    selectoRef.value?.clickTarget(e.inputEvent, e.inputTarget)
  }

  const onDragStart = (e: any) => {
    const target = e.target
    initTargetFrame(target)

    const frame = frameMap.value.get(target)
    e.set(frame.translate)
  }

  const onDrag = (e: any) => {
    const target = e.target
    const frame = frameMap.value.get(target)

    frame.translate = e.beforeTranslate
    target.style.transform = `translate(${frame.translate[0]}px, ${frame.translate[1]}px)`
  }

  const onDragGroupStart = (e: any) => {
    isGroupDragging.value = true
    e.events.forEach((ev: any) => {
      const target = ev.target
      initTargetFrame(target)

      const frame = frameMap.value.get(target)
      ev.set(frame.translate)
    })
  }
  const onDragGroup = (e: any) => {
    e.events.forEach((ev: any) => {
      const target = ev.target
      const frame = frameMap.value.get(target)

      frame.translate = ev.beforeTranslate
      target.style.transform = `translate(${frame.translate[0]}px, ${frame.translate[1]}px)`
    })
  }

  const onDragGroupEnd = (e) => {
    isGroupDragging.value = false
    console.log(e)
  }

  const onResizeStart = (e: any) => {
    isResizing.value = true
    e.setOrigin(['%', '%'])
    const target = e.target
    initTargetFrame(target)

    const frame = frameMap.value.get(target)
    e.dragStart && e.dragStart.set(frame.translate)
  }

  const onResize = (e: any) => {
    const beforeTranslate = e.drag.beforeTranslate

    const target = e.target
    const frame = frameMap.value.get(target)

    frame.translate = beforeTranslate

    e.target.style.width = `${e.width}px`
    e.target.style.height = `${e.height}px`

    e.target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`
  }

  const onResizeEnd = ({ lastEvent }: any) => {
    isResizing.value = false
    if (lastEvent) {
      const curr = comps.value.find(item => item.id === lastEvent.target.dataset.id)
      if (curr) {
        curr.width = lastEvent.width
        curr.height = lastEvent.height
      }
    }
  }
  return {
    isResizing,
    isGroupDragging,
    onClickGroup,
    onDragStart,
    onDrag,
    onDragGroupStart,
    onDragGroup,
    onDragGroupEnd,
    onResizeStart,
    onResize,
    onResizeEnd,
  }
}
