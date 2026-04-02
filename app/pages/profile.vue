<script lang="ts" setup>


definePageMeta({
  middleware: 'auth',
})

const { user } = useAuth()

const profile = reactive({
  name: user.value?.name || '',
  email: user.value?.email || '',
})

watch(() => user.value, (newUser) => {
  if (newUser) {
    profile.name = newUser.name || ''
    profile.email = newUser.email || ''
  }
}, { immediate: true })
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Профиль</h1>
      <p class="text-gray-500 mt-1">Настройки вашего аккаунта</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <UCard class="lg:col-span-2">
        <template #header>
          <h2 class="font-semibold text-gray-900 dark:text-white">Личные данные</h2>
        </template>

        <div class="space-y-4">
          <UFormField label="Имя">
            <UInput v-model="profile.name" size="lg" icon="i-lucide-user" />
          </UFormField>

          <UFormField label="Email">
            <UInput v-model="profile.email" type="email" size="lg" icon="i-lucide-mail" disabled />
          </UFormField>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton color="primary">Сохранить</UButton>
          </div>
        </template>
      </UCard>

      <div class="space-y-6">
        <UCard>
          <div class="text-center">
            <UAvatar :alt="user?.name || user?.email || ''" size="3xl" class="mx-auto" />
            <h3 class="mt-4 font-semibold text-lg text-gray-900 dark:text-white">
              {{ user?.name || 'Пользователь' }}
            </h3>
            <p class="text-gray-500">{{ user?.email }}</p>
            <UBadge
              :color="user?.role === 'ADMIN' ? 'error' : user?.role === 'EDITOR' ? 'warning' : 'neutral'"
              variant="soft"
              class="mt-2"
            >
              {{ user?.role }}
            </UBadge>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="font-semibold text-gray-900 dark:text-white">Безопасность</h2>
          </template>
          <UButton variant="soft" block icon="i-lucide-key">
            Изменить пароль
          </UButton>
        </UCard>
      </div>
    </div>
  </div>
</template>
