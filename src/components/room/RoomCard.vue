<template>
  <a-card class="room-card" hoverable>
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
        @click="$emit('join')"
        :disabled="isRoomFull"
      >
        {{ isRoomFull ? '房间已满' : '加入房间' }}
      </a-button>
    </template>
  </a-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatTime } from '@/utils/timeUtils'

const props = defineProps<{
  room: API.Room
}>()

defineEmits<{
  join: []
}>()

const isRoomFull = computed(() => {
  if (!props.room.maxPlayers) return false
  return (props.room.roomMembers?.length || 0) >= props.room.maxPlayers
})
</script>

<style scoped>
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
</style>