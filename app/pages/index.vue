<script lang="ts" setup>

interface Stat {
  label: string
  value: number
  icon: string
  color: 'primary' | 'success' | 'warning' | 'info'
}

interface Activity {
  action: string
  item: string
  time: string
  icon: string
}

definePageMeta({
  middleware: 'auth',
})

const { user, isAdmin, isEditor } = useAuth()

const stats = ref<Stat[]>([
  { label: 'Страницы', value: 0, icon: 'i-lucide-file-text', color: 'primary' },
  { label: 'Записи', value: 0, icon: 'i-lucide-pen-square', color: 'success' },
  { label: 'Медиа', value: 0, icon: 'i-lucide-image', color: 'warning' },
  { label: 'Пользователи', value: 0, icon: 'i-lucide-users', color: 'info' },
])

const recentActivity = ref<Activity[]>([])

const quickActions = [
  { label: 'Новая страница', icon: 'i-lucide-file-plus', to: '/pages' },
  { label: 'Новая запись', icon: 'i-lucide-pen-square', to: '/posts' },
  { label: 'Загрузить медиа', icon: 'i-lucide-upload', to: '/media' },
]
</script>

<template>
  <div class="space-y-6">
    <!-- Welcome section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Добро пожаловать, {{ user?.name || 'Пользователь' }}!
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          Панель управления сайтом
        </p>
      </div>
      <div class="flex items-center gap-2">
        <UBadge
          :color="isAdmin ? 'error' : isEditor ? 'warning' : 'neutral'"
          variant="soft"
          size="lg"
        >
          {{ user?.role }}
        </UBadge>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <UCard v-for="stat in stats" :key="stat.label" class="relative overflow-hidden">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-1">{{ stat.value }}</p>
          </div>
          <div
            :class="[
              'w-12 h-12 rounded-xl flex items-center justify-center',
              stat.color === 'primary' && 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
              stat.color === 'success' && 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
              stat.color === 'warning' && 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
              stat.color === 'info' && 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400',
            ]"
          >
            <UIcon :name="stat.icon" class="text-2xl" />
          </div>
        </div>
      </UCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Quick actions -->
      <UCard>
        <template #header>
          <h2 class="font-semibold text-gray-900 dark:text-white">Быстрые действия</h2>
        </template>
        <div class="space-y-2">
          <NuxtLink
            v-for="action in quickActions"
            :key="action.label"
            :to="action.to"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <UIcon :name="action.icon" class="text-primary-600 dark:text-primary-400 text-xl" />
            </div>
            <span class="font-medium text-gray-700 dark:text-gray-300">{{ action.label }}</span>
            <UIcon name="i-lucide-chevron-right" class="ml-auto text-gray-400" />
          </NuxtLink>
        </div>
      </UCard>

      <!-- Recent activity -->
      <UCard class="lg:col-span-2">
        <template #header>
          <h2 class="font-semibold text-gray-900 dark:text-white">Последняя активность</h2>
        </template>
        <div v-if="recentActivity.length" class="space-y-4">
          <div
            v-for="(activity, index) in recentActivity"
            :key="index"
            class="flex items-center gap-4"
          >
            <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <UIcon :name="activity.icon" class="text-gray-600 dark:text-gray-400" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900 dark:text-white">
                {{ activity.action }}
                <span class="font-medium">"{{ activity.item }}"</span>
              </p>
              <p class="text-xs text-gray-500">{{ activity.time }}</p>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          <UIcon name="i-lucide-activity" class="text-4xl mb-2" />
          <p>Нет активности</p>
        </div>
      </UCard>
    </div>

    <!-- Editor/Admin sections -->
    <div v-if="isEditor || isAdmin" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <UCard v-if="isEditor">
        <template #header>
          <h2 class="font-semibold text-gray-900 dark:text-white">Черновики</h2>
        </template>
        <div class="text-center py-8 text-gray-500">
          <UIcon name="i-lucide-file-edit" class="text-4xl mb-2" />
          <p>Нет черновиков</p>
        </div>
      </UCard>

      <UCard v-if="isAdmin">
        <template #header>
          <h2 class="font-semibold text-gray-900 dark:text-white">Системные уведомления</h2>
        </template>
        <div class="text-center py-8 text-gray-500">
          <UIcon name="i-lucide-bell" class="text-4xl mb-2" />
          <p>Нет уведомлений</p>
        </div>
      </UCard>
    </div>
  </div>
</template>
