import { message } from 'ant-design-vue'
import { useWsStore } from '@/stores/ws'
import { WSMessageTypeEnum } from '@/websocket/MessageTypeEnums'
import { onMounted, onUnmounted, type Ref } from 'vue'

interface UseRoomWebSocketOptions {
  currentRoom: Ref<API.Room | undefined>
  onRoomStateChanged: () => Promise<void>
  onStartGame: (body: any) => void
}

export function useRoomWebSocket(options: UseRoomWebSocketOptions) {
  const { currentRoom, onRoomStateChanged, onStartGame } = options
  const wsStore = useWsStore()

  const handleWsMessage = async (data: any) => {
    if (!data?.type) return

    const roomId = currentRoom.value?.id
    if (!roomId) return

    switch (data.type) {
      case WSMessageTypeEnum.ROOM_STATE_CHANGED: {
        await onRoomStateChanged()
        if (data.message && data.message.trim() !== '') {
          message.info(data.message)
        }
        break
      }
      case WSMessageTypeEnum.START_GAME: {
        onStartGame(data.gameMessage.body)
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
