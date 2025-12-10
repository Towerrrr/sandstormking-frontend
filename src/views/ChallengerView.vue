<template>
  <div id="challengerView">
    <!-- 切换战场、战场历史、游戏说明、全屏按钮 -->
    <div class="header">
      <img style="height: 48px" src="../assets/logo.png" alt="logo" />
      <img style="height: 48px" src="../assets/logo.png" alt="logo" />
      <div style="color: white">第 {{ currentRound }} 回合<br />{{ displayedPhase }}</div>
      <img style="height: 48px" :src="logoSrc" alt="logo" @click="showDrawSchedule = true" />
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

  <DrawScheduleModal
    :visible="showDrawSchedule"
    :drawSchedules="drawSchedules"
    @update:visible="showDrawSchedule = $event"
    @select="handleDrawScheduleSelect"
  />
</template>

<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue'
import FullscreenToggle from '@/components/challenger/FullscreenToggle.vue'
import CardSlot from '@/components/challenger/CardSlot.vue'
import PlayerCardArea from '@/components/challenger/PlayerCardArea.vue'
import CardPileModal from '@/components/challenger/CardPileModal.vue'
import DrawScheduleModal from '@/components/challenger/DrawScheduleModal.vue'
import { computed, onMounted, ref } from 'vue'
import { useChallenger } from '@/websocket/useWsApi'
import { useChallengerWebSocket } from '@/composables/challenger/useChallengerWebSocket'
import { useRoute } from 'vue-router'
import { PhaseEnum } from '@/constant/challenger'
import questionIcon from '@/assets/question.png'

const logoSrc = ref(questionIcon)
const route = useRoute()
const roomId = Number(route.params.roomId)

const currentRound = ref(1)
const currentPhase = ref('')
const displayedPhase = computed(() => {
  const phaseMap: Record<string, string> = {
    [PhaseEnum.BUILD] : '构筑阶段',
    [PhaseEnum.BATTLE]: '战斗阶段'
  }

  return phaseMap[currentPhase.value] || currentPhase.value
})
const currentBattlefield = ref('GREEN')

const show = ref(false)
const showDrawSchedule = ref(false)
const cardSlots = ref([
  { empty: false, cardBack: false },
  { empty: false, cardBack: true },
])

const drawSchedules = ref<any>({})

const {
  wsChallengerGetRoomState,
  wsChallengerGetBattlefield,
  wsChallengerBuildDeck,
  wsChallengerDiscardCard,
  wsChallengerEndGame,
  wsChallengerGetPlayer,
  wsChallengerReadyBattle,
} = useChallenger()

useChallengerWebSocket({
  roomId,
  onGetPlayer: (body: any): void => {
    return
  },
  onGetRoomState: (body: any): void => {
    currentRound.value = body.currentRound
    // 保存抽卡计划数据
    if (body.drawSchedules) {
      drawSchedules.value = body.drawSchedules
      console.log('抽卡计划',  JSON.stringify(body.drawSchedules, null, 2))
    }
    return
  },
  onGetBattlefield: (body: any): void => {
    currentPhase.value = body.currentPhase
    return
  },
  onBuildDeck: (body: any): void => {
    return
  },
  onReadyBattle: (body: any): void => {
    return
  },
  onDiscardCard: (body: any): void => {
    return
  },
  onEndGame: (body: any): void => {
    return
  },
})

onMounted(() => {
  wsChallengerGetRoomState()
  wsChallengerGetBattlefield(currentBattlefield.value)
})

function handleSelect(idx: number) {
  alert('选择了第 ' + (idx + 1) + ' 个卡槽')
}

function handleDrawScheduleSelect(round: string, option: any) {
  console.log(`第 ${round} 回合 - 选择了抽卡方案:`, option)
  alert(`第 ${round} 回合 - 选择了方案 ${option.id}: 抽 ${option.drawCount} 张 ${option.level} 级卡`)
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
