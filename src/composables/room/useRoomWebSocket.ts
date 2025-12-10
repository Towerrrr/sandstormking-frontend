import { message } from 'ant-design-vue'
import { useWebSocket } from '@/websocket/useWebSocket'
import { WSMessageTypeEnum } from '@/websocket/MessageTypeEnums'
import type { Ref } from 'vue'

interface UseRoomWebSocketOptions {
  currentRoom: Ref<API.Room | undefined>
  onRoomStateChanged: () => Promise<void>
  onStartGame: (body: any) => void
}

export function useRoomWebSocket(options: UseRoomWebSocketOptions) {
  const { currentRoom, onRoomStateChanged, onStartGame } = options

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

  const { ws, connect, disconnect, sendMessage } = useWebSocket(handleWsMessage)

  return {
    ws,
    connect,
    disconnect,
    sendMessage,
  }
}
