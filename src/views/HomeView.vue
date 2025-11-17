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
            <a-button type="primary" shape="circle" :icon="h(RetweetOutlined)" @click="handleRefresh" />
            <a-button type="primary" shape="circle" :icon="h(PlusOutlined)" @click="showAddModal = true" />
          </div>

          <a-spin :spinning="loading">
            <a-empty v-if="!loading && roomList.length === 0" description="暂无房间" />

            <div v-else class="room-list">
              <a-card
                v-for="room in roomList"
                :key="room.id"
                class="room-card"
                hoverable
              >
                <template #title>
                  <div class="room-title">
                    <span>{{ room.name }}</span>
                    <a-tag v-if="room.ownerId === currentUserId" color="blue">
                      房主
                    </a-tag>
                  </div>
                </template>

                <div class="room-info">
                  <p>
                    <span class="label">房间ID:</span>
                    <span>{{ room.id }}</span>
                  </p>
                  <p>
                    <span class="label">玩家数量:</span>
                    <span>{{ room.playerIds?.length || 0 }} / {{ room.maxPlayers }}</span>
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
      </a-layout-content>
      <a-layout-footer class="footer">
        <a href="https://www.github.com/Towerrrr" target="_blank"> Github : Towerrrr </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { message } from 'ant-design-vue'
import GlobalHeader from '@/components/GlobalHeader.vue'
import RoomAddModal from '@/components/RoomAddModal.vue'
import { listRoomsUsingGet, joinRoomUsingGet, addRoomUsingPost } from '@/api/roomController'
import { PlusOutlined, RetweetOutlined } from '@ant-design/icons-vue';

const loading = ref(false)
const roomList = ref<API.Room[]>([])
const current = ref(1)
const pageSize = ref(10)
const total = ref(0)
const currentUserId = ref<number>()

const showAddModal = ref(false)
const addLoading = ref(false)
const roomForm = ref<API.RoomAddRequest>({
  name: '',
  maxPlayers: 3
})

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
    if (res.data.code === 0) {
      message.success('创建房间成功')
      showAddModal.value = false
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
    name: '',
    maxPlayers: 3
  }
}
const handleJoinRoom = async (roomId: number | undefined) => {
  if (!roomId) {
    message.warning('房间ID无效')
    return
  }

  try {
    const res = await joinRoomUsingGet({ roomId })
    if (res.data.code === 0) {
      // todo 加入房间逻辑
      message.success('加入房间成功')
      await loadRooms()
    } else {
      message.error(res.data.message || '加入房间失败')
    }
  } catch (error) {
    message.error('加入房间失败')
    console.error(error)
  }
}

const handleRefresh = () => {
  current.value = 1
  loadRooms()
}

const isRoomFull = (room: API.Room) => {
  if (!room.maxPlayers) return false
  return (room.playerIds?.length || 0) >= room.maxPlayers
}

const formatTime = (timestamp: number | string | undefined) => {
  if (!timestamp) return '-'
  const date = new Date(Number(timestamp))
  return date.toLocaleString('zh-CN')
}

onMounted(() => {
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