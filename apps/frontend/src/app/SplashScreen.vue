<script setup lang="ts">
</script>

<template>
  <div id="splash-screen" class="splash-screen">
    <div class="splash-screen__logo">
      <img alt="Logo" src="/favicon.svg" class="splash-screen__logo-image">
    </div>
  </div>
</template>

<style scoped lang="scss">
.splash-screen {
  background-color: #f7f7f8;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 9990;
  transition: opacity 0.3s;
}
.splash-screen__logo {
  width: 100px;
  height: 100px;
  background-color: #fff;
  border: 1px solid #d6d7e7;
  border-radius: 100px;
  padding: 40px;
  box-sizing: content-box;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: scaleBack 5s ease-out;
  animation-delay: 500ms;
}
.splash-screen__logo-image {
  width: 100%;
}

@keyframes scaleBack {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.8);
  }
  100% {
    transform: scale(1);
  }
}
</style>
