import { onMounted, onBeforeUnmount } from 'vue'

export function useDisableMobilePullToRefresh() {
  let startY = 0

  const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent)

  const handleTouchStart = (e: TouchEvent) => {
    startY = e.touches[0].clientY
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (window.scrollY === 0 && e.touches[0].clientY > startY) {
      e.preventDefault()
    }
  }

  onMounted(() => {
    if (isMobile) {
      document.body.addEventListener('touchstart', handleTouchStart, { passive: false })
      document.body.addEventListener('touchmove', handleTouchMove, { passive: false })
    }
  })

  onBeforeUnmount(() => {
    if (isMobile) {
      document.body.removeEventListener('touchstart', handleTouchStart)
      document.body.removeEventListener('touchmove', handleTouchMove)
    }
  })
}
