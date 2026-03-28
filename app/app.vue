<script lang="ts" setup>
const colorMode = useColorMode();



const getApiData = async () => {
  await $fetch('/api/posts')
}
</script>

<template>
  <div>
    <UButton @click="getApiData" :color="'success'" icon="i-lucide-rocket" size="md" variant="outline"
      >Button</UButton
    > 

   <div>
     <UButton
      @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
    >
      Переключить тему
    </UButton>
   </div>
  </div>
</template>
