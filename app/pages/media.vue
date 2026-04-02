<script lang="ts" setup>
interface MediaItem {
  id: number
  name: string
  type: 'image' | 'video' | 'document'
  size: string
  url: string
}

definePageMeta({
  middleware: 'auth',
})

const mediaItems = ref<MediaItem[]>([])

function getIcon(type: string) {
  switch (type) {
    case 'image': return 'i-lucide-image'
    case 'video': return 'i-lucide-video'
    case 'document': return 'i-lucide-file-text'
    default: return 'i-lucide-file'
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Медиа</h1>
        <p class="text-gray-500 mt-1">Библиотека медиафайлов</p>
      </div>
      <UButton icon="i-lucide-upload" color="primary">
        Загрузить
      </UButton>
    </div>

    <div v-if="mediaItems.length" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <div
        v-for="item in mediaItems"
        :key="item.id"
        class="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div class="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <UIcon :name="getIcon(item.type)" class="text-4xl text-gray-400" />
        </div>
        <div class="p-3">
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ item.name }}</p>
          <p class="text-xs text-gray-500">{{ item.size }}</p>
        </div>
        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <UButton icon="i-lucide-eye" variant="solid" size="sm" />
          <UButton icon="i-lucide-trash-2" variant="solid" color="error" size="sm" />
        </div>
      </div>
    </div>

    <UCard v-else>
      <div class="text-center py-12 text-gray-500">
        <UIcon name="i-lucide-image" class="text-5xl mb-3" />
        <p class="text-lg">Нет медиафайлов</p>
        <p class="text-sm mt-1">Загрузите первый файл</p>
      </div>
    </UCard>
  </div>
</template>
