<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container" @click.stop>
          <!-- 标题栏 -->
          <div class="modal-header">
            <h3 class="modal-title">抽卡计划</h3>
            <button class="close-btn" @click="close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- 所有回合的抽卡选项列表 -->
          <div class="modal-body">
            <div v-if="roundsList.length > 0" class="rounds-container">
              <div
                v-for="roundData in roundsList"
                :key="roundData.round"
                class="round-section"
              >
                <h4 class="round-title">第 {{ roundData.round }} 回合</h4>
                <div class="options-list">
                  <div
                    v-for="option in roundData.options"
                    :key="`${roundData.round}-${option.id}`"
                    class="option-card"
                    @click="handleOptionSelect(roundData.round, option)"
                  >
                    <div class="option-header">
                      <span class="option-id">选项 {{ option.id }}</span>
                      <span class="option-level" :class="`level-${option.level}`">
                        {{ option.level }} 级
                      </span>
                    </div>
                    <div class="option-content">
                      <div class="draw-info">
                        <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <path d="M3 9h18M9 21V9"/>
                        </svg>
                        <span class="draw-count">抽 {{ option.drawCount }} 张卡</span>
                      </div>
                      <div class="fan-info">
                        <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                        <span class="fan-count">{{ option.fanCount }} 翻数</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="no-options">
              <p>暂无抽卡计划</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface DrawOption {
  id: number
  drawCount: number
  level: string
  fanCount: number
}

interface RoundData {
  round: string
  options: DrawOption[]
}

interface DrawSchedule {
  [round: string]: RoundData
}

const props = defineProps<{
  visible: boolean
  drawSchedules: DrawSchedule
}>()

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
  (e: 'select', round: string, option: DrawOption): void
}>()

// 将对象转换为数组并按回合排序
const roundsList = computed(() => {
  return Object.values(props.drawSchedules)
    .sort((a, b) => Number(a.round) - Number(b.round))
})

const close = () => {
  emit('update:visible', false)
}

const handleOverlayClick = () => {
  close()
}

const handleOptionSelect = (round: string, option: DrawOption) => {
  emit('select', round, option)
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
  max-width: 700px;
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

.rounds-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.round-section {
  background: rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(90, 143, 53, 0.3);
  border-radius: 12px;
  padding: 16px;
}

.round-title {
  margin: 0 0 12px 0;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(90, 143, 53, 0.3);
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border: 2px solid rgba(90, 143, 53, 0.5);
  border-radius: 10px;
  padding: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-card:hover {
  border-color: rgba(90, 143, 53, 0.8);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(90, 143, 53, 0.3);
}

.option-card:active {
  transform: translateX(2px);
}

.option-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.option-id {
  color: #fff;
  font-size: 15px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.option-level {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.level-A {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.level-B {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a39d 100%);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.level-C {
  background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.option-content {
  display: flex;
  gap: 20px;
}

.draw-info,
.fan-info {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #fff;
  font-size: 14px;
}

.icon {
  flex-shrink: 0;
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.5));
}

.draw-count,
.fan-count {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.no-options {
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
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
