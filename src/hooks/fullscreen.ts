// src/utils/fullscreen.ts

/**
 * 进入全屏
 * @param element - 需要全屏的元素，默认 document.documentElement
 */
export function enterFullScreen(element: HTMLElement = document.documentElement) {
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if ((element as any).webkitRequestFullscreen) {
    ;(element as any).webkitRequestFullscreen()
  } else if ((element as any).mozRequestFullScreen) {
    ;(element as any).mozRequestFullScreen()
  } else if ((element as any).msRequestFullscreen) {
    ;(element as any).msRequestFullscreen()
  }
}

/**
 * 退出全屏
 */
export function exitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if ((document as any).webkitExitFullscreen) {
    ;(document as any).webkitExitFullscreen()
  } else if ((document as any).mozCancelFullScreen) {
    ;(document as any).mozCancelFullScreen()
  } else if ((document as any).msExitFullscreen) {
    ;(document as any).msExitFullscreen()
  }
}

/**
 * 判断当前是否全屏
 */
export function isFullScreen() {
  return (
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement
  )
}
