import config from '@/config'
import { ref, onUnmounted } from 'vue'

export function useWebSocket(onMessage?: (data: any) => void) {
  const ws = ref<WebSocket | null>(null)

  function connect(roomId: number) {
    // todo 后续看一下怎么改
    // const host = window.location.host
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

  onUnmounted(() => {
    disconnect()
  })

  return {
    ws,
    connect,
    disconnect,
  }
}
