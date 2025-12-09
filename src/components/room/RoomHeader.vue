<template>
  <div class="room-header">
    <h2>(╯°□°)╯︵/(. □ . )</h2>
    <div class="header-actions">
      <a-button
        type="primary"
        shape="circle"
        :icon="h(RetweetOutlined)"
        @click="$emit('refresh')"
      />
      <a-button
        type="primary"
        shape="circle"
        :icon="h(PlusOutlined)"
        @click="$emit('add')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { PlusOutlined, RetweetOutlined } from '@ant-design/icons-vue'

defineEmits<{
  refresh: []
  add: []
}>()
</script>

<style scoped>
.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.room-header h2 {
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 8px;
}
</style>