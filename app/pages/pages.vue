<script lang="ts" setup>
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

interface Page {
  id: number
  title: string
  slug: string
  status: 'published' | 'draft'
  updatedAt: string
}

definePageMeta({
  middleware: 'auth',
})

const pages = ref<Page[]>([])

const columns: TableColumn<Page>[] = [
  {
    accessorKey: 'title',
    header: 'Название',
  },
  {
    accessorKey: 'slug',
    header: 'URL',
    cell: ({ row }) => h('code', { class: 'text-sm bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded' }, row.getValue('slug')),
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
    accessorKey: 'updatedAt',
    header: 'Обновлено',
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
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Страницы</h1>
        <p class="text-gray-500 mt-1">Управление страницами сайта</p>
      </div>
      <UButton icon="i-lucide-plus" color="primary">
        Новая страница
      </UButton>
    </div>

    <UCard>
      <UTable v-if="pages.length" :data="pages" :columns="columns" />
      <div v-else class="text-center py-12 text-gray-500">
        <UIcon name="i-lucide-file-text" class="text-5xl mb-3" />
        <p class="text-lg">Нет страниц</p>
        <p class="text-sm mt-1">Создайте первую страницу</p>
      </div>
    </UCard>
  </div>
</template>
