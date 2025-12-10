<template>
  <div id="homeView">
    <a-layout>
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <div class="room-container">
          <RoomHeader @refresh="handleRefresh" @add="showAddModal = true" />

          <a-spin :spinning="loading">
            <a-empty v-if="!loading && roomList.length === 0" description="暂无房间" />

            <RoomList v-else :rooms="roomList" @join="handleJoinRoom" />
          </a-spin>

          <RoomPagination
            v-model:current="current"
            v-model:page-size="pageSize"
            :total="total"
            @change="loadRooms"
          />
        </div>

        <RoomAddModal
          :open="showAddModal"
          :room-form="roomForm"
          :confirm-loading="addLoading"
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
          :is-owner="isOwner"
          @cancel="handleQuitRoom"
          @ready="handleReady(sendMessage)"
          @start-game="handleStartGame"
        />
      </a-layout-content>
      <a-layout-footer class="footer">
        <a href="https://www.github.com/Towerrrr" target="_blank"> Github : Towerrrr </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import GlobalHeader from '@/components/room/GlobalHeader.vue'
import RoomHeader from '@/components/room/RoomHeader.vue'
import RoomList from '@/components/room/RoomList.vue'
import RoomPagination from '@/components/room/RoomPagination.vue'
import RoomAddModal from '@/components/room/RoomAddModal.vue'
import RoomDetailModal from '@/components/room/RoomDetailModal.vue'
import { useLoginUserStore } from '@/stores/user'
import { useRoomList } from '@/composables/room/useRoomList'
import { useRoomDetail } from '@/composables/room/useRoomDetail'
import { useRoomWebSocket } from '@/composables/room/useRoomWebSocket'
import { useCardMapStore } from '@/stores/card'
import router from '@/router'

const userStore = useLoginUserStore()
const cardMapStore = useCardMapStore()

const {
  loading,
  roomList,
  current,
  pageSize,
  total,
  showAddModal,
  addLoading,
  roomForm,
  loadRooms,
  handleAddRoom: addRoom,
  resetForm,
  handleRefresh,
} = useRoomList()

const {
  modalVisible,
  currentRoom,
  roomMembers,
  isReadyLoading,
  isCurrentUserReady,
  isOwner,
  currentUserId,
  handleJoinRoom: joinRoom,
  handleQuitRoom: quitRoom,
  handleReady,
  handleStartGame,
  refreshRoomDetail,
} = useRoomDetail()

const { connect, disconnect, sendMessage } = useRoomWebSocket({
  currentRoom,
  onRoomStateChanged: async () => {
    await refreshRoomDetail()
    await loadRooms()
  },
  onStartGame: (body: any) => {
    const parsedBody = JSON.parse(body)
    cardMapStore.setCardMap(parsedBody)

    if (currentRoom.value?.id) {
      router.push(`/challenger/${currentRoom.value.id}`)
    } else {
      message.error('房间ID无效，无法进入游戏')
    }
    message.success('游戏开始')
  },
})

const handleAddRoom = async () => {
  const room = await addRoom()
  if (room) {
    currentRoom.value = room

    if (room.id !== undefined) {
      await refreshRoomDetail()
      modalVisible.value = true
      connect(room.id)
    }
  }
}

const handleJoinRoom = async (roomId: number | undefined) => {
  if (roomId === undefined) {
    message.error('房间ID无效')
    return
  }
  const success = await joinRoom(roomId)
  if (success) {
    modalVisible.value = true
    if (currentRoom.value?.id !== undefined) {
      connect(currentRoom.value.id)
    }
    await loadRooms()
  }
}

const handleQuitRoom = async () => {
  const success = await quitRoom()
  if (success) {
    modalVisible.value = false
    disconnect()
    await loadRooms()
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
