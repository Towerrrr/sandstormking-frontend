import { defineStore } from 'pinia'
import { ref } from 'vue'
import config from '@/config'
import { initWsApi } from '@/websocket/useWsApi'

type MessageListener = (data: any) => void

export const useWsStore = defineStore('ws', () => {
  const ws = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const message = ref<any>(null) // 最近收到的一条消息

  const listeners = new Set<MessageListener>()

  function addListener(listener: MessageListener) {
    listeners.add(listener)
  }

  function removeListener(listener: MessageListener) {
    listeners.delete(listener)
  }

  function connect(roomId: number) {
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
        // 新增：通知所有监听器
        listeners.forEach((fn) => fn(data))
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
    listeners.clear() // 可选：断开时清空所有监听器
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
    addListener,
    removeListener,
  }
})
