<template>
  <a-modal
    :open="open"
    title="创建房间"
    :confirm-loading="confirmLoading"
    @ok="onOk"
    @cancel="onCancel"
    @update:open="onUpdateOpen"
  >
    <a-form
      :model="roomForm"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-item label="房间名称" required>
        <a-input
          v-model:value="roomForm.name"
          placeholder="请输入房间名称"
          :maxlength="20"
        />
      </a-form-item>
      <a-form-item label="最大玩家数" required>
        <a-input-number
          v-model:value="roomForm.maxPlayers"
          :min="2"
          :max="10"
          placeholder="请输入最大玩家数"
          style="width: 100%"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  open: boolean
  roomForm: {
    name?: string
    maxPlayers?: number
  }
  confirmLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'ok'): void
  (e: 'cancel'): void
}>()

function onOk() {
  emit('ok')
}

function onCancel() {
  emit('cancel')
  emit('update:open', false)
}

function onUpdateOpen(val: boolean) {
  emit('update:open', val)
}
</script>