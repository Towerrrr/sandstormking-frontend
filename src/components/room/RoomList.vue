<template>
  <div class="room-list">
    <RoomCard
      v-for="room in rooms"
      :key="room.id"
      :room="room"
      @join="$emit('join', room.id)"
    />
  </div>
</template>

<script setup lang="ts">
import RoomCard from './RoomCard.vue'

defineProps<{
  rooms: API.Room[]
}>()

defineEmits<{
  join: [roomId: number | undefined]
}>()
</script>

<style scoped>
.room-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}
</style>