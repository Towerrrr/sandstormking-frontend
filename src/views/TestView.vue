<template>
  <div
    style="
      max-width: 500px;
      margin: 2rem auto;
      padding: 2rem;
      border: 1px solid #eee;
      border-radius: 8px;
    "
  >
    <div style="margin-bottom: 1rem">
      <div>
        <input v-model="roomId" type="number" placeholder="输入房间号" style="padding: 4px 8px" />
        <button @click="connect" :disabled="wsConnected">连接 WebSocket</button>
      </div>

      <button @click="disconnect" :disabled="!wsConnected">断开连接</button>
      <button @click="sendInfoMsg" :disabled="!wsConnected">发送 Info 消息</button>
      <button @click="sendErrorMsg" :disabled="!wsConnected">发送 Error 消息</button>
      <button @click="sendStartGame" :disabled="!wsConnected">开始游戏</button>
      <button @click="sendChallengerGetPlayer" :disabled="!wsConnected">获取玩家信息</button>
      <button @click="sendChallengerGetBattlefield" :disabled="!wsConnected">获取战场信息</button>
      <button @click="sendChallengerGetRoomState" :disabled="!wsConnected">获取房间信息</button>
      <button @click="sendChallengerEndGame" :disabled="!wsConnected">结束游戏</button>
      <button @click="sendChallengerReadyBattle" :disabled="!wsConnected">准备战斗</button>
      <button @click="showCardMap" :disabled="!wsConnected">显示卡牌数据</button>

      <div>
        <input
          v-model="cardInstanceIdsInput"
          placeholder="卡牌ID，逗号分隔"
          style="padding: 4px 8px"
        />
        <button @click="sendChallengerBuildDeck" :disabled="!wsConnected">构筑卡组</button>
        <button @click="sendChallengerDiscardCard" :disabled="!wsConnected">弃置卡牌</button>
      </div>
    </div>
    <div style="margin-top: 2rem">
      <h3>收到的消息：</h3>
      <pre style="background: #f7f7f9; padding: 1em; border-radius: 4px; min-height: 60px">{{
        lastMsg
      }}</pre>
    </div>
    <div style="margin-top: 2rem">
      <h3>卡牌数据：</h3>
      <pre style="background: #f0f0f0; padding: 1em; border-radius: 4px; min-height: 100px">{{
        cardMapData
      }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useWebSocket } from '@/websocket/useWebSocket'
import {
  wsInfoMessage,
  wsErrorMessage,
  wsStartGame,
  wsChallengerEndGame,
  wsChallengerReadyBattle,
  wsChallengerDiscardCard,
  wsChallengerBuildDeck,
  wsChallengerGetPlayer,
  wsChallengerGetBattlefield,
  wsChallengerGetRoomState,
} from '@/websocket/wsApi'
import type { BuildDeckRequest } from '@/websocket/types'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/user'
import { WSMessageTypeEnum } from '@/websocket/MessageTypeEnums'
import { useCardMapStore } from '@/stores/card'

const router = useRouter()
const userStore = useLoginUserStore()
const cardMapStore = useCardMapStore()

const roomId = ref<number | null>(null)
const lastMsg = ref('')

const wsConnected = ref(false)
const cardInstanceIdsInput = ref<string>('')

const currentBattlefield = ref<string>('GREEN')

const buildDeckRequest = ref<BuildDeckRequest>({
  optionId: 1,
  selectedCardInstanceIds: [],
})

const cardMapData = ref('')

const {
  ws,
  connect: wsConnect,
  disconnect,
  sendMessage,
} = useWebSocket((data) => {
  if (!data?.type) return
  switch (data.type) {
    case WSMessageTypeEnum.START_GAME: {
      if (data.gameMessage?.body) {
        try {
          const parsedBody = JSON.parse(data.gameMessage.body)
          cardMapStore.setCardMap(parsedBody)
        } catch (e) {
          console.error('Failed to parse gameMessage.body:', e)
        }
      }
      formatAndSetMessage(data)
      break
    }
    default:
      formatAndSetMessage(data)
  }
})

onMounted(async () => {
  await userStore.fetchLoginUser()

  if (userStore.loginUser.userName === '未登录') {
    router.push('/user/login')
  }
})

function formatAndSetMessage(data: any) {
  if (data?.gameMessage?.body) {
    try {
      const parsedBody = JSON.parse(data.gameMessage.body)
      lastMsg.value = JSON.stringify(
        {
          ...data,
          gameMessage: {
            ...data.gameMessage,
            body: parsedBody,
          },
        },
        null,
        2,
      )
    } catch (e) {
      console.error('Failed to parse gameMessage.body as JSON:', e)
      lastMsg.value = JSON.stringify(data, null, 2)
    }
  } else {
    lastMsg.value = JSON.stringify(data, null, 2)
  }
}

function connect() {
  if (roomId.value) {
    wsConnect(roomId.value)
    ws.value!.onopen = () => {
      wsConnected.value = true
      lastMsg.value = 'WebSocket 已连接'
    }
    ws.value!.onclose = () => {
      wsConnected.value = false
      lastMsg.value = 'WebSocket 已关闭'
    }
  } else {
    alert('请输入房间号')
  }
}

function sendInfoMsg() {
  sendMessage(wsInfoMessage('这是一条测试 Info 消息'))
}

function sendErrorMsg() {
  sendMessage(wsErrorMessage('这是一条测试 Error 消息'))
}

function sendStartGame() {
  if (roomId.value !== null) {
    sendMessage(wsStartGame(roomId.value))
  } else {
    alert('请先输入有效的房间号')
  }
}

function sendChallengerGetPlayer() {
  sendMessage(wsChallengerGetPlayer())
}

function sendChallengerGetBattlefield() {
  sendMessage(wsChallengerGetBattlefield(currentBattlefield.value))
}

function sendChallengerGetRoomState() {
  sendMessage(wsChallengerGetRoomState())
}

function sendChallengerBuildDeck() {
  const ids = cardInstanceIdsInput.value
    .split(',')
    .map((id) => parseInt(id.trim()))
    .filter((id) => !isNaN(id))

  buildDeckRequest.value.selectedCardInstanceIds = ids
  sendMessage(wsChallengerBuildDeck(buildDeckRequest.value))
}

function sendChallengerDiscardCard() {
  if (cardInstanceIdsInput.value) {
    const ids = cardInstanceIdsInput.value
      .split(',')
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id))
    sendMessage(wsChallengerDiscardCard(ids))
  } else {
    alert('请输入要弃置的卡牌ID')
  }
}

function sendChallengerEndGame() {
  sendMessage(wsChallengerEndGame())
}

function sendChallengerReadyBattle() {
  sendMessage(wsChallengerReadyBattle(currentBattlefield.value))
}

function showCardMap() {
  console.log('原始 cardMap 数据:', cardMapStore.cardMap)
  console.log('JSON 序列化后的数据:', JSON.stringify(cardMapStore.cardMap))
  cardMapData.value = JSON.stringify(cardMapStore.cardMap, null, 2)
}
</script>
