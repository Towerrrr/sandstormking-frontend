<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container" @click.stop>
          <!-- 标题栏 -->
          <div class="modal-header">
            <h3 class="modal-title">选择卡牌</h3>
            <button class="close-btn" @click="close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- 卡槽列表 -->
          <div class="modal-body">
            <div class="card-slot-list">
              <CardSlot
                v-for="(slot, idx) in slots"
                :key="idx"
                :empty="slot.empty"
                :cardBack="slot.cardBack"
                @click="handleSlotClick(idx)"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import CardSlot from './CardSlot.vue'

const props = defineProps<{
  visible: boolean
  slots: Array<{ empty?: boolean, cardBack?: boolean }>
}>()

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
  (e: 'select', idx: number): void
}>()

const close = () => {
  emit('update:visible', false)
}

const handleOverlayClick = () => {
  close()
}

const handleSlotClick = (idx: number) => {
  emit('select', idx)
  close()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: linear-gradient(135deg, #2d5016 0%, #3d6b20 50%, #2d5016 100%);
  border: 3px solid #5a8f35;
  border-radius: 16px;
  box-shadow:
    0 0 20px rgba(90, 143, 53, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 2px solid rgba(90, 143, 53, 0.3);
  background: rgba(0, 0, 0, 0.2);
}

.modal-title {
  margin: 0;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #fff;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.1);
}

.close-btn:active {
  transform: scale(0.95);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
}

.card-slot-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  align-items: center;
}

/* 过渡动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-container {
  transform: scale(0.9) translateY(-20px);
}

.modal-fade-leave-to .modal-container {
  transform: scale(0.9) translateY(20px);
}

/* 滚动条样式 */
.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: rgba(90, 143, 53, 0.5);
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: rgba(90, 143, 53, 0.7);
}
</style>