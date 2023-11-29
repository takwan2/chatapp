<script setup>
import { ChatBubbleOvalLeftEllipsisIcon, EllipsisHorizontalIcon } from '@heroicons/vue/24/solid'

</script>

<template>
  <div class="py-5 bg-gray-800 grid">
    <ul class="grid auto-rows-min gap-5 justify-center">
      <li>
        <ChatBubbleOvalLeftEllipsisIcon class="w-7 h-7 text-white"></ChatBubbleOvalLeftEllipsisIcon>
      </li>
      <li>
        <ChatBubbleOvalLeftEllipsisIcon class="w-7 h-7 text-white"></ChatBubbleOvalLeftEllipsisIcon>
      </li>
    </ul>
    <ul class="mt-auto grid auto-rows-min gap-3 justify-center">
      <li>
        <EllipsisHorizontalIcon class="w-7 h-7 text-white"></EllipsisHorizontalIcon>
      </li>
    </ul>
    <!-- <div class="flex justify-center">
    </div> -->
  </div>
</template>

<style scoped>

</style>