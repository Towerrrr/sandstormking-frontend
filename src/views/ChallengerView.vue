<template>
  <div id="challengerView">
    <!-- 切换战场、战场历史、游戏说明、全屏按钮 -->
    <div class="header">
      <img style="height: 48px" src="../assets/logo.png" alt="logo" />
      <img style="height: 48px" src="../assets/logo.png" alt="logo" />
      <div>第 1 回合<br />构筑阶段</div>
      <img style="height: 48px" src="../assets/logo.png" alt="logo" />
      <FullscreenToggle />
    </div>

    <!-- 对手区域 -->
    <PlayerCardArea
      :deckFirst="true"
      :deckSlotEmpty="false"
      restKeyPrefix="player-rest"
      @cardClick="handleCardClick"
      @deckClick="show = true"
    />
    <div class="player-info">
      <a-avatar :size="56" class="player-avatar">
        <template #icon>
          <UserOutlined />
        </template>
      </a-avatar>
    </div>

    <!-- 中央战场区域 -->
    <div class="battlefield">
      <CardSlot :empty="true" />
      <a-avatar :size="56" class="player-avatar">
        <template #icon>
          <UserOutlined />
        </template>
      </a-avatar>
      <CardSlot :empty="true" />
    </div>

    <!-- 我方区域 -->
    <div class="player-info">
      <a-avatar :size="56" class="player-avatar">
        <template #icon>
          <UserOutlined />
        </template>
      </a-avatar>
    </div>

    <PlayerCardArea
      :deckFirst="false"
      :deckSlotEmpty="true"
      restKeyPrefix="self-rest"
      @cardClick="handleCardClick"
      @deckClick="show = true"
    />
  </div>

  <CardPileModal
    :visible="show"
    :slots="cardSlots"
    @update:visible="show = $event"
    @select="handleSelect"
  />
</template>

<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue'
import FullscreenToggle from '@/components/challenger/FullscreenToggle.vue'
import CardSlot from '@/components/challenger/CardSlot.vue'
import PlayerCardArea from '@/components/challenger/PlayerCardArea.vue'
import CardPileModal from '@/components/challenger/CardPileModal.vue'
import { ref } from 'vue'

const show = ref(false)
const cardSlots = ref([
  { empty: false, cardBack: false },
  { empty: false, cardBack: true },
  { empty: true, cardBack: false },
])

function handleSelect(idx: number) {
  alert('选择了第 ' + (idx + 1) + ' 个卡槽')
}
const handleCardClick = (index: number) => {
  console.log('点击了卡牌:', index)
}
</script>

<style scoped>
#challengerView {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #3d6b20 0%, #5a8f35 50%, #3d6b20 100%);
  padding: 12px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.header {
  display: flex;
  justify-content: space-between;
}

.player-card-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
.player-avatar {
  background: #f0f0f0;
}

.battlefield {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
</style>