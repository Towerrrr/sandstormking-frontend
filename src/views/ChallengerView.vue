<template>
  <div id="challengerView">
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
          <!-- 手牌、休息区、消耗牌堆 -->
          <div class="player-card-area">
            <div class="battle-row">
              <div
                v-for="i in 3"
                :key="'player-' + i"
                class="card-slot empty-slot"
                @click="handleCardClick(i)"
              ></div>
              <div class="deck-pile"></div>
            </div>
            <div class="battle-row">
              <div
                v-for="i in 3"
                :key="'player-' + i"
                class="card-slot empty-slot"
                @click="handleCardClick(i)"
              ></div>
              <div class="card-slot empty-slot"></div>
            </div>
          </div>

          <!-- 玩家信息 -->
          <div class="player-info">
            <a-avatar :size="56" class="player-avatar">
              <template #icon>
                <UserOutlined />
              </template>
            </a-avatar>

            <a-button
              type="text"
              :title="isFullscreenActive ? '退出全屏' : '全屏'"
              class="fullscreen-btn"
              @click="handleFullscreen"
            >
              <FullscreenOutlined />
            </a-button>
          </div>
        </div>

        <!-- 中央战场区域 -->
        <div class="battlefield">
          <!-- 对手战场 -->
          <div class="card-slot empty-slot"></div>

          <!-- 玩家战场 -->
          <div class="card-slot empty-slot"></div>
        </div>

        <!-- 我方区域 (下方) -->
        <div class="player-area">
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
            <div class="battle-row">
              <div
                v-for="i in 3"
                :key="'player-' + i"
                class="card-slot empty-slot"
                @click="handleCardClick(i)"
              ></div>
              <div class="deck-pile"></div>
            </div>
            <div class="battle-row">
              <div
                v-for="i in 3"
                :key="'player-' + i"
                class="card-slot empty-slot"
                @click="handleCardClick(i)"
              ></div>
              <div class="card-slot empty-slot"></div>
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
import { UserOutlined, FullscreenOutlined } from '@ant-design/icons-vue'
import { enterFullScreen, isFullScreen, exitFullScreen } from '@/hooks/fullscreen'

const activeTab1 = ref('1')
const activeTab = ref(1)
const tabs = [1, 2, 3, 4]

const isFullscreenActive = ref(false)

const handleFullscreen = () => {
  if (isFullScreen()) {
    exitFullScreen()
    isFullscreenActive.value = false
  } else {
    enterFullScreen()
    isFullscreenActive.value = true
  }
}

// 监听全屏变化，保证按钮状态同步
document.addEventListener('fullscreenchange', () => {
  isFullscreenActive.value = !!isFullScreen()
})
const handleCardClick = (index: number) => {
  console.log('点击了卡牌:', index)
}
</script>

<style scoped>
#challengerView {
  height: 100%;
}

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

/* 游戏区域 */
.game-area {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #3d6b20 0%, #5a8f35 50%, #3d6b20 100%);
  padding: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  margin-bottom: 16px;
}

.player-card-area {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-slot {
  width: 70px;
  height: 90px;
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

/* 场上区域 */
.play-area {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0;
  padding: 0;
}

.deck-pile {
  width: 70px;
  height: 90px;
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

/* 玩家区域 */
.player-area {
  display: flex;
  flex-direction: column;
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
