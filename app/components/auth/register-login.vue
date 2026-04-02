<script setup lang="ts">
defineProps<{
  isLoginMode?: boolean
  isLoading?: boolean
}>()

const form = defineModel<{
  email: string
  password: string
  name?: string
}>('form', { required: true })
</script>

<template>
  <div>
    <UFormField v-if="!isLoginMode" label="Имя">
      <UInput
        v-model="form.name"
        placeholder="Ваше имя"
        icon="i-lucide-user"
        size="xl"
        class="w-full"

      />
    </UFormField>

    <UFormField label="Email" required>
      <UInput
        v-model="form.email"
        type="email"
        placeholder="email@example.com"
        icon="i-lucide-mail"
        size="xl"
        class="w-full"
        autocomplete="email"
      />
    </UFormField>

    <UFormField label="Пароль" required>
      <UInput
        v-model="form.password"
        type="password"
        placeholder="••••••••"
        icon="i-lucide-lock"
        size="xl"
        class="w-full"
        autocomplete="current-password"
      />
    </UFormField>

    <UButton class="mt-5" type="submit" block size="lg" color="primary" :loading="isLoading">
      {{ isLoginMode ? "Войти" : "Зарегистрироваться" }}
    </UButton>
  </div>
</template>

<style scoped></style>
