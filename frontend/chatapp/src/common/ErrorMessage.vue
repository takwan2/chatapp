<template>
  <div v-if="errorMessage" class="p-4 mb-4 text-sm text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
    <span class="font-medium">{{ errorMessage }}</span>
  </div>
</template>

<script>
export default {
  props: ['errorMessage']
}
</script>