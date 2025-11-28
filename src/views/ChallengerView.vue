<template>
  <div id="gameView">
    <div class="game-container">
      <!-- 顶部切换战场 -->
      <div class="top-tabs">
        <div
          v-for="tab in tabs"
          :key="tab"
          class="tab-item"
          :class="{ active: activeTab === tab }"
          @click="activeTab = tab"
        >
          {{ tab }}
        </div>
      </div>

      <!-- 游戏区域 -->
      <div class="game-area">
        <!-- 对手区域 (上方) -->
        <div class="player-area">
          <!-- 玩家场上区域 -->
          <div class="play-area">
            <div class="card-slot empty-slot"></div>
            <div class="deck-pile"></div>
            <a-avatar :size="56" class="player-avatar">
              <template #icon>
                <UserOutlined />
              </template>
            </a-avatar>
          </div>

          <!-- 玩家手牌区 -->
          <div class="hand-cards">
            <div class="battle-row">
              <div
                v-for="i in 3"
                :key="'player-' + i"
                class="card-slot empty-slot"
                @click="handleCardClick(i)"
              ></div>
            </div>
            <div class="battle-row">
              <div
                v-for="i in 2"
                :key="'player-' + i"
                class="card-slot empty-slot"
                @click="handleCardClick(i)"
              ></div>
              <div
                class="card-slot"
              ></div>
            </div>
          </div>
        </div>

        <!-- 中央战场区域 -->
        <div class="battlefield">
          <!-- 对手战场 -->
          <div class="battle-row opponent-battle">
            <div
              v-for="i in 4"
              :key="'opp-battle-' + i"
              class="battle-slot empty-battle-slot"
            ></div>
          </div>

          <!-- 玩家战场 -->
          <div class="battle-row player-battle">
            <div
              v-for="i in 4"
              :key="'player-battle-' + i"
              class="battle-slot empty-battle-slot"
            ></div>
          </div>
        </div>

        <!-- 玩家区域 (下方) -->
        <div class="player-area">
          <!-- 玩家场上区域 -->
          <div class="play-area">
            <div class="card-slot empty-slot"></div>
            <div class="deck-pile"></div>
            <a-avatar :size="56" class="player-avatar">
              <template #icon>
                <UserOutlined />
              </template>
            </a-avatar>
          </div>

          <!-- 玩家手牌区 -->
          <div class="hand-cards">
            <div class="battle-row">
              <div
                v-for="i in 3"
                :key="'player-' + i"
                class="card-slot empty-slot"
                @click="handleCardClick(i)"
              ></div>
            </div>
            <div class="battle-row">
              <div
                v-for="i in 3"
                :key="'player-' + i"
                class="card-slot empty-slot"
                @click="handleCardClick(i)"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部标签页切换 -->
      <!-- <div class="tab-bar">
        <a-tabs v-model:activeKey="activeTab1" centered>
          <a-tab-pane key="1" tab="手牌">
            <div class="tab-content">当前手牌信息</div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="战场">
            <div class="tab-content">战场状态信息</div>
          </a-tab-pane>
          <a-tab-pane key="3" tab="历史">
            <div class="tab-content">游戏历史记录</div>
          </a-tab-pane>
          <a-tab-pane key="4" tab="设置">
            <div class="tab-content">游戏设置选项</div>
          </a-tab-pane>
        </a-tabs>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'

const activeTab1 = ref('1')
const activeTab = ref(1)
const tabs = [1, 2, 3, 4]

const handleCardClick = (index: number) => {
  console.log('点击了卡牌:', index)
}
</script>

<style scoped>
.header {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  padding-inline: 16px;
  color: unset;
  background: white;
  z-index: 100;
}

.top-tabs {
  display: flex;
  height: 60px;
  background: white;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 300; /* 模仿手写体的轻盈感 */
  cursor: pointer;
  border-right: 1px solid #f0f0f0;
  transition: all 0.3s;
  position: relative;
}

.content {
  margin-top: 64px;
  margin-bottom: 64px;
  padding: 16px;
  min-height: calc(100vh - 128px);
  background: linear-gradient(180deg, #2d5016 0%, #4a7c2b 50%, #2d5016 100%);
}

.game-container {
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
}

/* 计分板 */
.score-board {
  display: flex;
  justify-content: center;
  gap: 80px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.score-item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  padding: 8px 16px;
  border: 2px solid #333;
  background: white;
  border-radius: 4px;
}

.score-number {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

/* 游戏区域 */
.game-area {
  background: linear-gradient(180deg, #3d6b20 0%, #5a8f35 50%, #3d6b20 100%);
  border-radius: 12px;
  padding: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  margin-bottom: 16px;
}

/* 对手区域 */
.opponent-area {
  margin-bottom: 20px;
}

.opponent-hand {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

/* 手牌 */
.hand-cards {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-slot {
  width: 60px;
  height: 96px;
  border: 2px solid #666;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  /* todo 下面是实验属性 */
  background-image: url('https://ark-1358327410.cos.ap-nanjing.myqcloud.com/%E9%AA%B7%E9%AB%85.png');
  background-size: cover;     /* 覆盖整个容器 */
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

/* 场上区域 */
.play-area {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0;
  padding: 0;
}

.opponent-play {
  flex-direction: row-reverse;
}

.deck-pile {
  width: 80px;
  height: 110px;
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
  margin: 0 0;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 0;
}

.battle-row {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 0 0;
}

.opponent-battle {
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
}

.battle-slot {
  width: 90px;
  height: 100px;
  border: 2px solid #666;
  border-radius: 8px;
  background: white;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.empty-battle-slot {
  background: rgba(255, 255, 255, 0.15);
  border: 2px dashed rgba(255, 255, 255, 0.3);
}

.battle-slot:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

/* 玩家区域 */
.player-area {
  display: flex;
}

/* 标签页 */
.tab-bar {
  background: white;
  border-radius: 8px;
  padding: 8px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.tab-content {
  padding: 16px;
  text-align: center;
  color: #666;
  min-height: 60px;
}

</style>
