<script lang="ts" setup>

definePageMeta({
  layout: false,
});

const { login, register, isAuthenticated } = useAuth();

const isLoginMode = ref<boolean>(true);
const isLoading = ref<boolean>(false);
const error = ref<string>("");

const form = reactive<{ email: string; password: string; name?: string }>({
  email: "",
  password: "",
  name: "",
});

watchEffect(() => {
  if (isAuthenticated.value) {
    navigateTo("/");
  }
});

async function handleSubmit() {
  error.value = "";
  isLoading.value = true;

  try {
    if (isLoginMode.value) {
      await login(form.email, form.password);
    } else {
      await register(form.email, form.password, form.name || undefined);
    }
    await navigateTo("/");
  } catch (e: unknown) {
    const err = e as { data?: { message?: string }; message?: string };
    error.value = err.data?.message || err.message || "Произошла ошибка";
  } finally {
    isLoading.value = false;
  }
}

function toggleMode() {
  isLoginMode.value = !isLoginMode.value;
  error.value = "";
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4"
  >
    <UCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-2xl font-bold text-center">
          {{ isLoginMode ? "Вход" : "Регистрация" }}
        </h1>
      </template>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <UAlert
          v-if="error"
          color="error"
          variant="soft"
          :title="error"
          icon="i-lucide-alert-circle"
        />

        <LazyAuthRegisterLogin
          v-model:form="form"
          :is-login-mode="isLoginMode"
          :is-loading="isLoading"
        />
      </form>

      <template #footer>
        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
          {{ isLoginMode ? "Нет аккаунта?" : "Уже есть аккаунт?" }}
          <UButton variant="link" :padded="false" @click="toggleMode">
            {{ isLoginMode ? "Зарегистрироваться" : "Войти" }}
          </UButton>
        </p>
      </template>
    </UCard>
  </div>
</template>
