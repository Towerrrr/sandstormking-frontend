<template>
  <div id="homeView">
    <a-layout>
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content>Content</a-layout-content>
      <a-layout-footer class="footer">
        <a href="https://www.github.com/Towerrrr" target="_blank"> Github : Towerrrr </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
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
}

.footer {
  background: #efefef;
  padding: 16px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}

</style>
