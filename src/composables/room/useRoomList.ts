import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { listRoomsUsingGet, addRoomUsingPost } from '@/api/roomController'
import { getLoginUserUsingGet } from '@/api/userController'

export function useRoomList() {
  const loading = ref(false)
  const roomList = ref<API.Room[]>([])
  const current = ref(1)
  const pageSize = ref(10)
  const total = ref(0)

  const showAddModal = ref(false)
  const addLoading = ref(false)
  const roomForm = ref<API.RoomAddRequest>({
    name: '新房间',
    maxPlayers: 2,
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

  const handleAddRoom = async (): Promise<API.Room | null> => {
    if (!roomForm.value.name || !roomForm.value.maxPlayers) {
      message.warning('请填写完整的房间信息')
      return null
    }

    addLoading.value = true
    try {
      const res = await addRoomUsingPost(roomForm.value)
      if (res.data.code === 0 && res.data.data) {
        message.success('创建房间成功')
        showAddModal.value = false
        resetForm()
        await loadRooms()
        return res.data.data
      } else {
        message.error(res.data.message || '创建房间失败')
        return null
      }
    } catch (error) {
      message.error('创建房间失败')
      console.error(error)
      return null
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

  const handleRefresh = () => {
    current.value = 1
    loadRooms()
  }

  return {
    loading,
    roomList,
    current,
    pageSize,
    total,
    showAddModal,
    addLoading,
    roomForm,
    loadRooms,
    handleAddRoom,
    resetForm,
    handleRefresh,
  }
}
