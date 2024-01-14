<template>
  <div v-if="successMessage" class="p-4 mb-4 text-sm text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
    <span class="font-medium">{{ successMessage }}</span>
  </div>
</template>

<script>
export default {
  props: ['successMessage']
}
</script>