import { onMounted, onUnmounted, type Ref } from 'vue'

function useClickOutside(
    elementRef: Ref<HTMLElement | undefined>,
    clickOutsideCallback?: Function
) {
  function handler(e: MouseEvent) {
      if (!elementRef.value) return

      if (!elementRef.value.contains(e.target as HTMLElement)) {
        clickOutsideCallback?.()
      }
  }

  onMounted(() => {
    document.addEventListener('click', handler)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })
}

export default useClickOutside


