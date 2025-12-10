<template>
  <img
    :src="logoSrc"
    alt="fullscreen toggle"
    class="fullscreen-toggle"
    @click="toggleFullscreen"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { enterFullScreen, isFullScreen, exitFullScreen } from '@/hooks/fullscreen'
import fullscreenIcon from '@/assets/fullscreen.png'

const logoSrc = ref(fullscreenIcon)
const isFullscreenActive = ref(false)

const updateFullscreenState = () => {
  isFullscreenActive.value = !!isFullScreen()
}

const toggleFullscreen = () => {
  if (isFullScreen()) {
    exitFullScreen()
  } else {
    enterFullScreen()
  }
  // 更新状态
  updateFullscreenState()
}

// 监听全屏变化事件
onMounted(() => {
  document.addEventListener('fullscreenchange', updateFullscreenState)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', updateFullscreenState)
})
</script>

<style scoped>
.fullscreen-toggle {
  height: 48px;
  transition: background-color 0.3s;
  cursor: pointer;
}

.fullscreen-toggle:active {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>