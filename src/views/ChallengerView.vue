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

    <!-- 对手区域 (上方) -->
    <!-- 手牌、休息区、消耗牌堆 -->
    <div class="player-card-area">
      <div class="deck-section">
        <div class="card-slot empty-slot"></div>
        <div class="deck-pile"></div>
      </div>

      <div class="rest-zone">
        <div class="rest-zone-row">
          <div
            v-for="i in 3"
            :key="'player-' + i"
            class="card-slot empty-slot"
            @click="handleCardClick(i)"
          ></div>
        </div>
        <div class="rest-zone-row">
          <div
            v-for="i in 3"
            :key="'player-' + i"
            class="card-slot empty-slot"
            @click="handleCardClick(i)"
          ></div>
        </div>
      </div>
    </div>

    <!-- 玩家信息 -->
    <div class="player-info">
      <a-avatar :size="56" class="player-avatar">
        <template #icon>
          <UserOutlined />
        </template>
      </a-avatar>
    </div>

    <!-- 中央战场区域 -->
    <div class="battlefield">
      <div class="card-slot empty-slot"></div>

      <a-avatar :size="56" class="player-avatar">
        <template #icon>
          <UserOutlined />
        </template>
      </a-avatar>

      <div class="card-slot empty-slot"></div>
    </div>

    <!-- 我方区域 (下方) -->
    <!-- 玩家信息 -->
    <div class="player-info">
      <a-avatar :size="56" class="player-avatar">
        <template #icon>
          <UserOutlined />
        </template>
      </a-avatar>
    </div>

    <!-- 手牌、休息区、消耗牌堆 -->
    <div class="player-card-area">
      <div class="rest-zone">
        <div class="rest-zone-row">
          <div
            v-for="i in 3"
            :key="'player-' + i"
            class="card-slot empty-slot"
            @click="handleCardClick(i)"
          ></div>
        </div>
        <div class="rest-zone-row">
          <div
            v-for="i in 3"
            :key="'player-' + i"
            class="card-slot empty-slot"
            @click="handleCardClick(i)"
          ></div>
        </div>
      </div>

      <div class="deck-section">
        <div class="deck-pile"></div>
        <div class="card-slot empty-slot"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue'
import FullscreenToggle from '@/components/challenger/FullscreenToggle.vue'

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

.card-slot {
  width: 69px;
  height: 92px;
  border: 2px solid #666;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  /* todo 下面是实验属性 */
  background-image: url('https://ark-1358327410.cos.ap-nanjing.myqcloud.com/%E9%AA%B7%E9%AB%85.png');
  background-size: cover; /* 覆盖整个容器 */
  background-position: center; /* 居中显示 */
  background-repeat: no-repeat;
}

.card-slot:hover {
  transform: translateY(-8px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.card-back {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  cursor: default;
}

.card-back:hover {
  transform: none;
}

.empty-slot {
  background: rgba(255, 255, 255, 0.2);
  border: 2px dashed rgba(255, 255, 255, 0.4);
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

.player-avatar {
  background: #f0f0f0;
}

/* 战场区域 */
.battlefield {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

</style>
