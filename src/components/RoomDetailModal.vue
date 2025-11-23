<template>
  <a-modal
    :open="open"
    title="房间详情"
    :footer="null"
    @cancel="onCancel"
    @update:open="onUpdateOpen"
    width="500px"
  >
    <div class="room-detail">
      <div class="info-row">
        <span class="label">房间名称：</span>
        <span>{{ room?.name }}</span>
      </div>
      <div class="info-row">
        <span class="label">房间ID：</span>
        <span>{{ room?.id }}</span>
      </div>
      <div class="info-row">
        <span class="label">房主：</span>
        <span v-if="ownerLoading">加载中...</span>
        <span v-else>{{ ownerUser?.userName || '无名' }}</span>
      </div>
      <div class="info-row">
        <span class="label">创建时间：</span>
        <span>{{ formatTime(room?.createdTime) }}</span>
      </div>

      <div class="member-list">
        <div class="member-title">成员({{ members.length }}/{{ room?.maxPlayers || 8 }})</div>
        <div class="avatars">
          <div
            v-for="member in members"
            :key="member.userVo?.id"
            :class="['avatar-item', {
              'avatar-owner': isOwner(member),
              'avatar-ready': isReady(member),
              'avatar-unready': !isReady(member) && !isOwner(member),
            }]"
          >
            <a-avatar :src="member.userVo?.userAvatar" :size="48" />
            <div class="name">{{ member.userVo?.userName ?? '无名' }}</div>
          </div>
          <div
            v-for="i in emptySlots"
            :key="'empty-' + i"
            class="avatar-item avatar-empty"
          >
            <a-avatar :size="48" style="background: #f0f0f0;">
              <template #icon>
                <PlusOutlined />
              </template>
            </a-avatar>
            <div class="name" style="color:#aaa">空位</div>
          </div>
        </div>
      </div>
      <div class="footer-btn">
        <a-button
          type="primary"
          :danger="props.isCurrentUserReady"
          block
          @click="onReady"
          :loading="readyLoading"
        >
          {{ props.isCurrentUserReady ? '取消准备' : '准备' }}
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref, watch } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { getUserVoByIdUsingGet } from '@/api/userController'

const ownerUser = ref<API.UserVO | null>(null)
const ownerLoading = ref(false)

const props = defineProps<{
  open: boolean
  room?: {
    id?: number
    name?: string
    maxPlayers?: number
    ownerId?: number
    createdTime?: number | string
  }
  members: RoomMember[]
  readyLoading?: boolean
  isCurrentUserReady?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'cancel'): void
  (e: 'ready'): void
}>()

const emptySlots = computed(() => {
  return (props.room?.maxPlayers || 8) - props.members.length
})

function onCancel() {
  emit('cancel')
  emit('update:open', false)
}

function onUpdateOpen(val: boolean) {
  emit('update:open', val)
}

function onReady() {
  emit('ready')
}

function formatTime(timestamp: number | string | undefined) {
  if (!timestamp) return '-'
  const date = new Date(Number(timestamp))
  return date.toLocaleString('zh-CN')
}

function isOwner(member: RoomMember) {
  return member.userVo?.id === props.room?.ownerId;
}

function isReady(member: RoomMember) {
  return !!member.ready;
}
async function fetchOwnerUser(ownerId?: number) {
  if (!ownerId) {
    ownerUser.value = null
    return
  }
  ownerLoading.value = true
  try {
    const res = await getUserVoByIdUsingGet({ id: ownerId })
    ownerUser.value = res.data?.data ?? null
  } finally {
    ownerLoading.value = false
  }
}

watch(
  () => props.room?.ownerId,
  (ownerId) => {
    fetchOwnerUser(ownerId)
  },
  { immediate: true }
)
</script>

<style scoped>
.room-detail {
  padding: 8px 0 0 0;
}
.info-row {
  display: flex;
  margin-bottom: 8px;
  font-size: 15px;
}
.label {
  width: 90px;
  color: #888;
  font-weight: 500;
}
.member-list {
  margin: 18px 0 12px 0;
}
.member-title {
  font-weight: 500;
  margin-bottom: 8px;
}
.avatars {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.avatar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 62px;
}
.avatar-item .name {
  margin-top: 4px;
  font-size: 13px;
  text-align: center;
  max-width: 56px;
  word-break: break-all;
}
.avatar-empty .name {
  color: #aaa;
}
.footer-btn {
  margin-top: 24px;
}
.avatar-item {
  border: 2px solid transparent;
  border-radius: 50%;
  box-sizing: border-box;
  padding: 2px;
  transition: border 0.2s;
}
.avatar-owner {
  border-color: #ffd600 !important;
}
.avatar-ready {
  border-color: #52c41a !important;
}
.avatar-unready {
  border-color: #ff4d4f !important;
}
</style>