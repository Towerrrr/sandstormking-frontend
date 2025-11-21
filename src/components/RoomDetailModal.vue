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
        <span class="label">最大玩家数：</span>
        <span>{{ room?.maxPlayers }}</span>
      </div>
      <div class="info-row">
        <span class="label">房主：</span>
        <span>{{ room?.ownerName }}</span>
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
            :key="member.id"
            class="avatar-item"
          >
            <a-avatar :src="member.userAvatar" :size="48" />
            <div class="name">{{ member.userName ?? '无名' }}</div>
          </div>
          <!-- 补齐最多8个头像位，空位显示加号灰色头像 -->
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
        <a-button type="primary" block @click="onReady" :loading="readyLoading">
          准备
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'

const props = defineProps<{
  open: boolean
  room?: {
    id?: number
    name?: string
    maxPlayers?: number
    ownerName?: string
    createdTime?: number | string
  }
  members: API.UserVO[]
  readyLoading?: boolean
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
</style>