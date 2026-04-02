<script lang="ts" setup>
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

interface Post {
  id: number
  title: string
  status: 'published' | 'draft'
  author: string
  createdAt: string
}

definePageMeta({
  middleware: 'auth',
})

const posts = ref<Post[]>([])

const columns: TableColumn<Post>[] = [
  {
    accessorKey: 'title',
    header: 'Название',
  },
  {
    accessorKey: 'author',
    header: 'Автор',
  },
  {
    accessorKey: 'status',
    header: 'Статус',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return h(UBadge, {
        color: status === 'published' ? 'success' : 'warning',
        variant: 'soft',
      }, () => status === 'published' ? 'Опубликовано' : 'Черновик')
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Создано',
  },
  {
    id: 'actions',
    meta: { class: { td: 'text-right' } },
    cell: () => h('div', { class: 'flex items-center justify-end gap-1' }, [
      h(UButton, { icon: 'i-lucide-edit', variant: 'ghost', size: 'sm' }),
      h(UButton, { icon: 'i-lucide-trash-2', variant: 'ghost', color: 'error', size: 'sm' }),
    ]),
  },
]
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Записи</h1>
        <p class="text-gray-500 mt-1">Управление записями блога</p>
      </div>
      <UButton icon="i-lucide-plus" color="primary">
        Новая запись
      </UButton>
    </div>

    <UCard>
      <UTable v-if="posts.length" :data="posts" :columns="columns" />
      <div v-else class="text-center py-12 text-gray-500">
        <UIcon name="i-lucide-pen-square" class="text-5xl mb-3" />
        <p class="text-lg">Нет записей</p>
        <p class="text-sm mt-1">Создайте первую запись</p>
      </div>
    </UCard>
  </div>
</template>
