<template>
  <div id="homeView">
    <a-layout>
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <div class="room-container">
          <div class="room-header">
            <h2>（╯°Д°）╯︵/(.□ . )</h2>
            <a-button
              type="primary"
              shape="circle"
              :icon="h(RetweetOutlined)"
              @click="handleRefresh"
            />
            <a-button
              type="primary"
              shape="circle"
              :icon="h(PlusOutlined)"
              @click="showAddModal = true"
            />
          </div>

          <a-spin :spinning="loading">
            <a-empty v-if="!loading && roomList.length === 0" description="暂无房间" />

            <div v-else class="room-list">
              <a-card v-for="room in roomList" :key="room.id" class="room-card" hoverable>
                <template #title>
                  <div class="room-title">
                    <span>{{ room.name }}</span>
                  </div>
                </template>

                <div class="room-info">
                  <p>
                    <span class="label">房间ID:</span>
                    <span>{{ room.id }}</span>
                  </p>
                  <p>
                    <span class="label">玩家数量:</span>
                    <span>{{ room.roomMembers?.length || 0 }} / {{ room.maxPlayers }}</span>
                  </p>
                  <p>
                    <span class="label">创建时间:</span>
                    <span>{{ formatTime(room.createdTime) }}</span>
                  </p>
                </div>

                <template #actions>
                  <a-button
                    type="primary"
                    @click="handleJoinRoom(room.id)"
                    :disabled="isRoomFull(room)"
                  >
                    {{ isRoomFull(room) ? '房间已满' : '加入房间' }}
                  </a-button>
                </template>
              </a-card>
            </div>
          </a-spin>

          <div class="pagination">
            <a-pagination
              v-model:current="current"
              v-model:page-size="pageSize"
              :total="total"
              show-size-changer
              :page-size-options="['10', '20', '50']"
              @change="loadRooms"
            />
          </div>
        </div>

        <RoomAddModal
          :open="showAddModal"
          :roomForm="roomForm"
          :confirmLoading="addLoading"
          @ok="handleAddRoom"
          @cancel="resetForm"
          @update:open="showAddModal = $event"
        />
        <RoomDetailModal
          v-model:open="modalVisible"
          :room="currentRoom"
          :members="roomMembers"
          :ready-loading="isReadyLoading"
          :is-current-user-ready="isCurrentUserReady"
          @cancel="handleQuitRoom"
          @ready="handleReady"
        />
      </a-layout-content>
      <a-layout-footer class="footer">
        <a href="https://www.github.com/Towerrrr" target="_blank"> Github : Towerrrr </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h, computed } from 'vue'
import { message } from 'ant-design-vue'
import GlobalHeader from '@/components/GlobalHeader.vue'
import RoomAddModal from '@/components/RoomAddModal.vue'
import RoomDetailModal from '@/components/RoomDetailModal.vue'
import {
  listRoomsUsingGet,
  joinRoomUsingGet,
  addRoomUsingPost,
  quitRoomUsingGet,
  getRoomUsingGet,
  startGameUsingGet,
  readyUsingPost,
} from '@/api/roomController'
import { batchGetUsersUsingPost, getLoginUserUsingGet } from '@/api/userController'
import { PlusOutlined, RetweetOutlined } from '@ant-design/icons-vue'
import { useWebSocket } from '@/composables/useWebSocket'
import { useLoginUserStore } from '@/stores/user'

const loading = ref(false)
const roomList = ref<API.Room[]>([])
const current = ref(1)
const pageSize = ref(10)
const total = ref(0)
const currentUserId = ref<number>()

const showAddModal = ref(false)
const addLoading = ref(false)
const roomForm = ref<API.RoomAddRequest>({
  name: '新房间',
  maxPlayers: 3,
})

const modalVisible = ref(false)
const currentRoom = ref<API.Room>()
const roomMembers = ref<RoomMember[]>([])
const isReadyLoading = ref(false)

const userStore = useLoginUserStore()


const loadRooms = async () => {
  loading.value = true
  try {
    const res = await listRoomsUsingGet({
      current: current.value,
      pageSize: pageSize.value,
    })

    if (res.data.code === 0 && res.data.data) {
      roomList.value = res.data.data
      total.value = res.data.data.length
    } else {
      message.error(res.data.message || '加载房间列表失败')
    }
  } catch (error) {
    message.error('加载房间列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}
const handleAddRoom = async () => {
  if (!roomForm.value.name || !roomForm.value.maxPlayers) {
    message.warning('请填写完整的房间信息')
    return
  }

  addLoading.value = true
  try {
    const res = await addRoomUsingPost(roomForm.value)
    if (res.data.code === 0 && res.data.data) {
      message.success('创建房间成功')
      showAddModal.value = false

      currentRoom.value = res.data.data

      let members: RoomMember[] = []
      const loginRes = await getLoginUserUsingGet()
      if (loginRes.data.code === 0 && loginRes.data.data) {
        const currentUserVO = loginRes.data.data
        members.push({
          userVo: currentUserVO,
          ready: false,
        })
      }
      roomMembers.value = members

      modalVisible.value = true
      if (currentRoom.value?.id !== undefined) {
        connect(currentRoom.value.id)
      } else {
        message.error('房间ID无效，无法连接 WebSocket')
      }

      resetForm()
      await loadRooms()
    } else {
      message.error(res.data.message || '创建房间失败')
    }
  } catch (error) {
    message.error('创建房间失败')
    console.error(error)
  } finally {
    addLoading.value = false
  }
}

const resetForm = () => {
  roomForm.value = {
    name: '新房间',
    maxPlayers: 3,
  }
}
const handleJoinRoom = async (roomId: number | undefined) => {
  if (!roomId) {
    message.warning('房间ID无效')
    return
  }

  try {
    const joinRes = await joinRoomUsingGet({ roomId })
    if (joinRes.data.code !== 0) {
      message.error(joinRes.data.message || '加入房间失败')
      return
    }
    message.success('加入房间成功')

    const { room, members } = await fetchRoomDetailAndMembers(roomId)
    currentRoom.value = room
    roomMembers.value = members

    modalVisible.value = true
    if (currentRoom.value?.id !== undefined) {
      connect(currentRoom.value.id)
    } else {
      message.error('房间ID无效，无法连接 WebSocket')
    }

    await loadRooms()
  } catch (error: any) {
    message.error(error.message || '加入房间失败')
    console.error(error)
  }
}

const handleQuitRoom = async () => {
  if (!currentRoom.value?.id) {
    modalVisible.value = false
    return
  }
  try {
    const res = await quitRoomUsingGet({ roomId: currentRoom.value.id })
    if (res.data.code === 0) {
      message.success('已退出房间')
      modalVisible.value = false
      disconnect()
      await loadRooms()
      roomMembers.value = []
      currentRoom.value = undefined
    } else {
      message.error(res.data.message || '退出房间失败')
    }
  } catch (error) {
    message.error('退出房间失败')
    console.error(error)
  }
}

const handleRefresh = () => {
  current.value = 1
  loadRooms()
}

const isRoomFull = (room: API.Room) => {
  if (!room.maxPlayers) return false
  return (room.roomMembers?.length || 0) >= room.maxPlayers
}

const formatTime = (timestamp: number | string | undefined) => {
  if (!timestamp) return '-'
  const date = new Date(Number(timestamp))
  return date.toLocaleString('zh-CN')
}

const handleWsMessage = async (data: any) => {
  if (!data?.type) return

  const roomId = currentRoom.value?.id
  if (!roomId) return

  switch (data.type) {
    case 'ROOM_STATE_CHANGED': {
      try {
        const { room, members } = await fetchRoomDetailAndMembers(roomId)
        currentRoom.value = room
        roomMembers.value = members
      } catch (error: any) {
        message.error(error.message || '刷新房间信息失败')
      }
      if (data.message && data.message.trim() !== '') {
        message.info(data.message)
      }
      break
    }
    default: {
      if (data.message && data.message.trim() !== '') {
        message.info(data.message)
      }
    }
  }
}
const { ws, connect, disconnect } = useWebSocket(handleWsMessage)

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
  return {
    room,
    members,
  }
}

const isCurrentUserReady = computed(() => {
  if (!currentUserId.value || roomMembers.value.length === 0) {
    return false;
  }

  const currentUser = roomMembers.value.find(
    (m) => m.userVo?.id === currentUserId.value
  );

  return currentUser?.ready ?? false;
});

const handleReady = async () => {
  if (!currentRoom.value?.id) {
    message.warning('房间ID无效，无法准备/取消准备')
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
      if (ws.value && ws.value.readyState === WebSocket.OPEN) {
        ws.value.send(
          JSON.stringify({
            type: 'ROOM_STATE_CHANGED',
            data: targetReady ? '用户准备状态改变' : '用户取消准备',
          }),
        )
      }
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

onMounted(async () => {
  await userStore.fetchLoginUser()
  currentUserId.value = userStore.loginUser.id
  loadRooms()
})
</script>

<style scoped>
.header {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  padding-inline: 16px;
  margin-bottom: 16px;
  color: unset;
  background: white;
  z-index: 100;
}

.content {
  margin-top: 64px;
  margin-bottom: 64px;
  padding: 24px;
  min-height: calc(100vh - 128px);
}

.room-container {
  max-width: 1200px;
  margin: 0 auto;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.room-header h2 {
  margin: 0;
}

.room-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.room-card {
  transition: all 0.3s;
}

.room-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.room-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.room-info p {
  margin: 8px 0;
  display: flex;
  justify-content: space-between;
}

.room-info .label {
  font-weight: 500;
  color: #666;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.footer {
  background: #efefef;
  padding: 16px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 100;
}
</style>
