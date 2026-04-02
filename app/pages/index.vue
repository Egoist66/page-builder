<script lang="ts" setup>
import { useAuth } from '~~/composables/useAuth';

definePageMeta({
  middleware: 'auth',
})

const { user, logout, isAdmin, isEditor } = useAuth()
const colorMode = useColorMode()
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
    <div class="max-w-4xl mx-auto">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold">Page Builder</h1>
            <div class="flex items-center gap-2">
              <UButton
                :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
                variant="ghost"
                @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
              />
              <UButton
                color="error"
                variant="soft"
                icon="i-lucide-log-out"
                @click="logout"
              >
                Выйти
              </UButton>
            </div>
          </div>
        </template>

        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <UAvatar
              :alt="user?.name || user?.email || ''"
              size="lg"
            />
            <div>
              <p class="font-medium text-lg">{{ user?.name || 'Пользователь' }}</p>
              <p class="text-gray-500">{{ user?.email }}</p>
            </div>
            <UBadge
              :color="isAdmin ? 'error' : isEditor ? 'warning' : 'neutral'"
              variant="soft"
              class="ml-auto"
            >
              {{ user?.role }}
            </UBadge>
          </div>

          <USeparator />

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UCard variant="soft">
              <div class="text-center">
                <UIcon name="i-lucide-file-text" class="text-3xl mb-2" />
                <p class="font-medium">Страницы</p>
                <p class="text-sm text-gray-500">Управление страницами</p>
              </div>
            </UCard>

            <UCard v-if="isEditor" variant="soft">
              <div class="text-center">
                <UIcon name="i-lucide-edit" class="text-3xl mb-2" />
                <p class="font-medium">Редактор</p>
                <p class="text-sm text-gray-500">Создание контента</p>
              </div>
            </UCard>

            <UCard v-if="isAdmin" variant="soft">
              <div class="text-center">
                <UIcon name="i-lucide-settings" class="text-3xl mb-2" />
                <p class="font-medium">Настройки</p>
                <p class="text-sm text-gray-500">Администрирование</p>
              </div>
            </UCard>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
