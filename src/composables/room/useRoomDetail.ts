import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import {
  joinRoomUsingGet,
  quitRoomUsingGet,
  getRoomUsingGet,
  startGameUsingGet,
  readyUsingPost,
} from '@/api/roomController'
import { batchGetUsersUsingPost } from '@/api/userController'
import type { InitGameRequest } from '@/websocket/types'
import { useWsMessages } from '@/websocket/useWsApi'

const { wsStartGame } = useWsMessages()
export function useRoomDetail() {
  const modalVisible = ref(false)
  const currentRoom = ref<API.Room>()
  const roomMembers = ref<RoomMember[]>([])
  const isReadyLoading = ref(false)
  const currentUserId = ref<number>()

  const fetchRoomDetailAndMembers = async (roomId: number) => {
    const detailRes = await getRoomUsingGet({ roomId })
    if (detailRes.data.code !== 0 || !detailRes.data.data) {
      throw new Error(detailRes.data.message || '获取房间详情失败')
    }
    const room = detailRes.data.data

    let members: RoomMember[] = []
    const roomMembersArr = room.roomMembers
    if (roomMembersArr && roomMembersArr.length > 0) {
      const userIdList = roomMembersArr
        .map((m: API.RoomMember) => m.userId)
        .filter((id): id is number => id !== undefined)
      if (userIdList.length > 0) {
        const userRes = await batchGetUsersUsingPost({ userIdList })
        if (userRes.data.code === 0 && userRes.data.data) {
          members = roomMembersArr.map((roomMember: API.RoomMember) => ({
            userVo: userRes.data.data?.find((user) => user.id === roomMember.userId) || undefined,
            ready: roomMember.ready,
          }))
        } else {
          throw new Error(userRes.data.message || '获取成员信息失败')
        }
      }
    }
    return { room, members }
  }

  const refreshRoomDetail = async () => {
    if (!currentRoom.value?.id) return
    try {
      const { room, members } = await fetchRoomDetailAndMembers(currentRoom.value.id)
      currentRoom.value = room
      roomMembers.value = members
    } catch (error: any) {
      message.error(error.message || '刷新房间信息失败')
    }
  }

  const handleJoinRoom = async (roomId: number | undefined): Promise<boolean> => {
    if (!roomId) {
      message.warning('房间ID无效')
      return false
    }

    try {
      const joinRes = await joinRoomUsingGet({ roomId })
      if (joinRes.data.code !== 0) {
        message.error(joinRes.data.message || '加入房间失败')
        return false
      }
      message.success('加入房间成功')

      const { room, members } = await fetchRoomDetailAndMembers(roomId)
      currentRoom.value = room
      roomMembers.value = members

      return true
    } catch (error: any) {
      message.error(error.message || '加入房间失败')
      console.error(error)
      return false
    }
  }

  const handleQuitRoom = async (): Promise<boolean> => {
    if (!currentRoom.value?.id) {
      return true
    }
    try {
      const res = await quitRoomUsingGet({ roomId: currentRoom.value.id })
      if (res.data.code === 0) {
        message.success('已退出房间')
        roomMembers.value = []
        currentRoom.value = undefined
        return true
      } else {
        message.error(res.data.message || '退出房间失败')
        return false
      }
    } catch (error) {
      message.error('退出房间失败')
      console.error(error)
      return false
    }
  }

  const handleReady = async (sendWsMessage: (msg: any) => void) => {
    if (!currentRoom.value?.id) {
      message.warning('房间ID无效,无法准备/取消准备')
      return
    }
    const targetReady = !isCurrentUserReady.value
    isReadyLoading.value = true
    try {
      const res = await readyUsingPost({
        ready: targetReady,
        roomId: currentRoom.value.id,
      })
      if (res.data.code === 0) {
        message.success(targetReady ? '已准备' : '已取消准备')
        sendWsMessage({
          type: 'ROOM_STATE_CHANGED',
          message: targetReady ? '用户准备状态改变' : '用户取消准备',
        })
      } else {
        message.error(res.data.message || (targetReady ? '准备失败' : '取消准备失败'))
      }
    } catch (error) {
      message.error(targetReady ? '准备失败' : '取消准备失败')
      console.error(error)
    } finally {
      isReadyLoading.value = false
    }
  }

  const handleStartGame = async (initGameRequest: InitGameRequest) => {
    const roomId = currentRoom.value?.id
    if (roomId === undefined) {
      message.warning('房间ID无效,无法开始游戏')
      return
    }

    isReadyLoading.value = true
    try {
      const { room, members } = await fetchRoomDetailAndMembers(roomId)
      currentRoom.value = room
      roomMembers.value = members

      const notReadyMembers = members.filter((m) => m.userVo?.id !== room.ownerId && !m.ready)
      if (notReadyMembers.length > 0) {
        message.warning('还有成员未准备,无法开始游戏')
        return
      }

      const res = await startGameUsingGet({ roomId })
      if (res.data.code === 0) {
        wsStartGame(initGameRequest)
      } else {
        message.error(res.data.message || '开始游戏失败')
      }
    } catch (error) {
      message.error('开始游戏失败')
      console.error(error)
    } finally {
      isReadyLoading.value = false
    }
  }

  const isCurrentUserReady = computed(() => {
    if (!currentUserId.value || roomMembers.value.length === 0) {
      return false
    }
    const currentUser = roomMembers.value.find((m) => m.userVo?.id === currentUserId.value)
    return currentUser?.ready ?? false
  })

  const isOwner = computed<boolean | undefined>(() => {
    if (currentUserId.value === undefined || currentRoom.value?.ownerId === undefined) {
      return undefined
    }
    return currentRoom.value.ownerId === currentUserId.value
  })

  return {
    modalVisible,
    currentRoom,
    roomMembers,
    isReadyLoading,
    isCurrentUserReady,
    isOwner,
    currentUserId,
    handleJoinRoom,
    handleQuitRoom,
    handleReady,
    handleStartGame,
    refreshRoomDetail,
  }
}
