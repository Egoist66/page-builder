<script lang="ts" setup>
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Role } from '~~/prisma/generated/client'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UAvatar = resolveComponent('UAvatar')

interface User {
  id: number
  name: string
  email: string
  role: Role
}

definePageMeta({
  middleware: 'auth',
})

const users = ref<User[]>([])

function getRoleColor(role: Role) {
  switch (role) {
    case 'ADMIN': return 'error'
    case 'EDITOR': return 'warning'
    default: return 'neutral'
  }
}

const columns: TableColumn<User>[] = [
  {
    accessorKey: 'name',
    header: 'Пользователь',
    cell: ({ row }) => h('div', { class: 'flex items-center gap-3' }, [
      h(UAvatar, { alt: row.original.name, size: 'sm' }),
      h('span', { class: 'font-medium' }, row.getValue('name')),
    ]),
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Роль',
    cell: ({ row }) => {
      const role = row.getValue('role') as Role
      return h(UBadge, {
        color: getRoleColor(role),
        variant: 'soft',
      }, () => role)
    },
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
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Пользователи</h1>
        <p class="text-gray-500 mt-1">Управление пользователями системы</p>
      </div>
      <UButton icon="i-lucide-user-plus" color="primary">
        Добавить пользователя
      </UButton>
    </div>

    <UCard>
      <UTable v-if="users.length" :data="users" :columns="columns" />
      <div v-else class="text-center py-12 text-gray-500">
        <UIcon name="i-lucide-users" class="text-5xl mb-3" />
        <p class="text-lg">Нет пользователей</p>
      </div>
    </UCard>
  </div>
</template>
