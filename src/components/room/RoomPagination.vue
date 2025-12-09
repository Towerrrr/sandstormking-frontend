<template>
  <div class="pagination">
    <a-pagination
      :current="current"
      :page-size="pageSize"
      :total="total"
      show-size-changer
      :page-size-options="['10', '20', '50']"
      @change="handleChange"
      @show-size-change="handleSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  current: number
  pageSize: number
  total: number
}>()

const emit = defineEmits<{
  'update:current': [value: number]
  'update:pageSize': [value: number]
  change: []
}>()

const handleChange = (page: number, size: number) => {
  emit('update:current', page)
  emit('update:pageSize', size)
  emit('change')
}

const handleSizeChange = (current: number, size: number) => {
  emit('update:current', current)
  emit('update:pageSize', size)
  emit('change')
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
</style>