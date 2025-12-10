<template>
  <div
    :class="['card-slot', { 'empty-slot': empty, 'card-back': cardBack }]"
    @click="handleClick"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  empty?: boolean
  cardBack?: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const handleClick = () => {
  emit('click')
}
</script>

<style scoped>
.card-slot {
  width: 69px;
  height: 92px;
  border: 2px solid #666;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  /* todo 下面是实验属性 */
  background-image: url('https://ark-1358327410.cos.ap-nanjing.myqcloud.com/%E9%AA%B7%E9%AB%85.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.card-slot:hover {
  transform: translateY(-8px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.card-back {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  cursor: default;
}

.card-back:hover {
  transform: none;
}

.empty-slot {
  background: rgba(255, 255, 255, 0.2);
  border: 2px dashed rgba(255, 255, 255, 0.4);
}
</style>