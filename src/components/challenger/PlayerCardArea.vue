<template>
  <div class="player-card-area">
    <!-- 顶部/底部牌区顺序可根据传入的 props 变化 -->
    <div v-if="deckFirst" class="deck-section">
      <CardSlot :empty="deckSlotEmpty" />
      <div class="deck-pile"></div>
    </div>

    <div class="rest-zone">
      <div class="rest-zone-row">
        <CardSlot
          v-for="i in 3"
          :key="restKeyPrefix + '-1-' + i"
          :empty="true"
          @click="handleCardClick(i)"
        />
      </div>
      <div class="rest-zone-row">
        <CardSlot
          v-for="i in 3"
          :key="restKeyPrefix + '-2-' + i"
          :empty="true"
          @click="handleCardClick(i)"
        />
      </div>
    </div>

    <div v-if="!deckFirst" class="deck-section">
      <div class="deck-pile"></div>
      <CardSlot :empty="deckSlotEmpty" />
    </div>
  </div>
</template>

<script setup lang="ts">
import CardSlot from '@/components/challenger/CardSlot.vue'

const props = defineProps<{
  deckFirst?: boolean           // 牌堆在前还是在后（对手 true，自己 false）
  deckSlotEmpty?: boolean       // 牌堆旁边的 CardSlot 是否 empty
  restKeyPrefix?: string        // key 前缀，避免 key 重复
}>()

const emits = defineEmits(['cardClick'])

const handleCardClick = (index: number) => {
  emits('cardClick', index)
}
</script>

<style scoped>
.player-card-area {
  display: flex;
  justify-content: space-between;
}

.deck-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
}

.rest-zone {
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  gap: 10px;
  padding: 10px;
}

.rest-zone-row {
  display: flex;
  gap: 10px;
}

.deck-pile {
  width: 69px;
  height: 92px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 2px solid #444;
  border-radius: 8px;
  box-shadow:
    2px 2px 0 rgba(0, 0, 0, 0.3),
    4px 4px 0 rgba(0, 0, 0, 0.2),
    6px 6px 0 rgba(0, 0, 0, 0.1);
  position: relative;
}

.deck-pile::after {
  content: '牌堆';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 14px;
}
</style>