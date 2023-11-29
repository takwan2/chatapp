<script setup>
import TheSidebar from './layout/TheSidebar.vue'
import TalkRooms from './talk_room/talkRooms.vue'

// export default {
//   components: {
//     TheSidebar
//   }
// };
</script>

<template>
  <div class="flex">
    <TheSidebar class="flex-none h-screen w-14"></TheSidebar>
    <TalkRooms class="flex-auto h-screen"></TalkRooms>
  </div>
</template>

<style scoped>

</style>
