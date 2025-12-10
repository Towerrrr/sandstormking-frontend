import { message } from 'ant-design-vue'
import { useWsStore } from '@/stores/ws'
import { ChallengerMessageTypeEnum } from '@/websocket/MessageTypeEnums'
import { onMounted, onUnmounted, type Ref } from 'vue'

interface UseChallengerWebSocketOptions {
  currentRoom: Ref<API.Room | undefined>
  onGetRoomState: (body: any) => void
  onGetBattlefield: (body: any) => void
  onGetPlayer: (body: any) => void
  onBuildDeck: (body: any) => void
  onReadyBattle: (body: any) => void
  onDiscardCard: (body: any) => void
  onEndGame: (body: any) => void
}

export function useChallengerWebSocket(options: UseChallengerWebSocketOptions) {
  const {
    currentRoom,
    onGetRoomState,
    onGetBattlefield,
    onGetPlayer,
    onBuildDeck,
    onReadyBattle,
    onDiscardCard,
    onEndGame,
  } = options
  const wsStore = useWsStore()

  const handleWsMessage = async (data: any) => {
    if (!data?.type) return

    const roomId = currentRoom.value?.id
    if (!roomId) return

    switch (data.type) {
      case ChallengerMessageTypeEnum.GET_ROOM_STATE: {
        onGetRoomState(data.gameMessage.body)
        break
      }
      case ChallengerMessageTypeEnum.GET_BATTLEFIELD: {
        onGetBattlefield(data.gameMessage.body)
        break
      }
      case ChallengerMessageTypeEnum.GET_PLAYER: {
        onGetPlayer(data.gameMessage.body)
        break
      }
      case ChallengerMessageTypeEnum.BUILD_DECK: {
        onBuildDeck(data.gameMessage.body)
        break
      }
      case ChallengerMessageTypeEnum.READY_BATTLE: {
        onReadyBattle(data.gameMessage.body)
        break
      }
      case ChallengerMessageTypeEnum.DISCARD_CARD: {
        onDiscardCard(data.gameMessage.body)
        break
      }
      case ChallengerMessageTypeEnum.END_GAME: {
        onEndGame(data.gameMessage.body)
        break
      }
      default: {
        if (data.message && data.message.trim() !== '') {
          message.info(data.message)
        }
      }
    }
  }

  onMounted(() => {
    wsStore.addListener(handleWsMessage)
  })
  onUnmounted(() => {
    wsStore.removeListener(handleWsMessage)
  })

  function connect(roomId: number) {
    wsStore.connect(roomId)
  }

  return {
    ws: wsStore.ws,
    connect,
    disconnect: wsStore.disconnect,
    sendMessage: wsStore.sendMessage,
  }
}
