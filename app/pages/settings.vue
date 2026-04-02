<script lang="ts" setup>
definePageMeta({
  middleware: 'auth',
})

const settings = reactive({
  siteName: 'Page Builder',
  siteDescription: 'Система управления контентом',
  language: 'ru',
  timezone: 'Europe/Moscow',
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Настройки</h1>
      <p class="text-gray-500 mt-1">Общие настройки системы</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <UCard>
          <template #header>
            <h2 class="font-semibold text-gray-900 dark:text-white">Основные настройки</h2>
          </template>

          <div class="space-y-4">
            <UFormField label="Название сайта">
              <UInput v-model="settings.siteName" size="lg" />
            </UFormField>

            <UFormField label="Описание сайта">
              <UTextarea v-model="settings.siteDescription" :rows="3" />
            </UFormField>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Язык">
                <USelect
                  v-model="settings.language"
                  :items="[
                    { label: 'Русский', value: 'ru' },
                    { label: 'English', value: 'en' },
                  ]"
                  size="lg"
                />
              </UFormField>

              <UFormField label="Часовой пояс">
                <USelect
                  v-model="settings.timezone"
                  :items="[
                    { label: 'Москва (UTC+3)', value: 'Europe/Moscow' },
                    { label: 'Лондон (UTC+0)', value: 'Europe/London' },
                  ]"
                  size="lg"
                />
              </UFormField>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end">
              <UButton color="primary">Сохранить изменения</UButton>
            </div>
          </template>
        </UCard>
      </div>

      <div class="space-y-6">
        <UCard>
          <template #header>
            <h2 class="font-semibold text-gray-900 dark:text-white">Информация</h2>
          </template>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Версия</span>
              <span class="font-medium">1.0.0</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Nuxt</span>
              <span class="font-medium">4.4.2</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Vue</span>
              <span class="font-medium">3.5.31</span>
            </div>
          </div>
        </UCard>

        <UCard color="error" variant="soft">
          <template #header>
            <h2 class="font-semibold text-red-700 dark:text-red-400">Опасная зона</h2>
          </template>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Очистка кэша удалит все временные файлы системы.
          </p>
          <UButton color="error" variant="soft" block>
            Очистить кэш
          </UButton>
        </UCard>
      </div>
    </div>
  </div>
</template>
