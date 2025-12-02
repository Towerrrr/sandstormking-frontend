import config from '@/config'
import { ref, onUnmounted } from 'vue'

export function useWebSocket(onMessage?: (data: any) => void) {
  const ws = ref<WebSocket | null>(null)

  function connect(roomId: number) {
    const host = config.WS_BASE_URL
    const url = `http://${host}/api/ws?roomId=${roomId}`

    ws.value = new WebSocket(url)

    ws.value.onopen = () => {
      console.log('WebSocket connected!')
    }
    ws.value.onmessage = (event) => {
      console.log('收到消息', event.data)
      try {
        const data = JSON.parse(event.data)
        onMessage && onMessage(data)
      } catch (e) {
        // 非 JSON 消息
      }
    }
    ws.value.onerror = (err) => {
      console.error('WebSocket错误', err)
    }
    ws.value.onclose = () => {
      console.log('WebSocket关闭')
    }
  }

  function disconnect() {
    if (ws.value) {
      ws.value.close()
      ws.value = null
    }
  }

  function sendMessage(message: any) {
    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      ws.value.send(typeof message === 'string' ? message : JSON.stringify(message))
    } else {
      console.warn('WebSocket 未连接或已关闭，无法发送消息')
    }
  }

  onUnmounted(() => {
    disconnect()
  })

  return {
    ws,
    connect,
    disconnect,
    sendMessage,
  }
}
