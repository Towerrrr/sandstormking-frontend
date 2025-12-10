import { defineStore } from 'pinia'
import { ref, onUnmounted } from 'vue'
import config from '@/config'
import { initWsApi } from '@/websocket/wsApi'

export const useWsStore = defineStore('ws', () => {
  const ws = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const message = ref<any>(null) // 最近收到的一条消息

  function connect(roomId: number, onMessage?: (data: any) => void) {
    const host = config.WS_BASE_URL
    const url = `http://${host}/api/ws?roomId=${roomId}`

    ws.value = new WebSocket(url)

    ws.value.onopen = () => {
      isConnected.value = true
      console.log('WebSocket connected!')
    }
    ws.value.onmessage = (event) => {
      console.log('收到消息', event.data)
      try {
        const data = JSON.parse(event.data)
        message.value = data
        onMessage && onMessage(data)
      } catch (e) {
        // 非 JSON 消息
      }
    }
    ws.value.onerror = (err) => {
      isConnected.value = false
      console.error('WebSocket错误', err)
    }
    ws.value.onclose = () => {
      isConnected.value = false
      console.log('WebSocket关闭')
    }

    initWsApi(sendMessage)
  }

  function disconnect() {
    if (ws.value) {
      ws.value.close()
      ws.value = null
      isConnected.value = false
    }
  }

  function sendMessage(message: any) {
    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      ws.value.send(typeof message === 'string' ? message : JSON.stringify(message))
    } else {
      console.warn('WebSocket 未连接或已关闭，无法发送消息')
    }
  }

  return {
    ws,
    message,
    isConnected,
    connect,
    disconnect,
    sendMessage,
  }
})
