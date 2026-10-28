<script setup lang="ts">
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth'

const { $auth } = useNuxtApp()

// "login" = giriş formu, "register" = kayıt formu
const mode = ref<'login' | 'register'>('login')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

// Firebase hata kodlarını Türkçe mesajlara çevir
function errorMessage(code: string) {
  const messages: Record<string, string> = {
    'auth/invalid-email': 'Geçersiz e-posta adresi.',
    'auth/invalid-credential': 'E-posta veya şifre hatalı.',
    'auth/email-already-in-use': 'Bu e-posta zaten kayıtlı.',
    'auth/weak-password': 'Şifre en az 6 karakter olmalı.',
    'auth/too-many-requests': 'Çok fazla deneme yapıldı, biraz bekleyin.',
  }
  return messages[code] ?? 'Bir hata oluştu, tekrar deneyin.'
}

async function submit() {
  error.value = ''
  loading.value = true
  try {
    if (mode.value === 'login') {
      await signInWithEmailAndPassword($auth, email.value, password.value)
    } else {
      // Kayıt başarılı olursa Firebase kullanıcıyı otomatik giriş yaptırır
      await createUserWithEmailAndPassword($auth, email.value, password.value)
    }
    await navigateTo('/')
  } catch (e: any) {
    error.value = errorMessage(e?.code)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="card login">
    <h1>Notlarım</h1>
    <p class="muted">{{ mode === 'login' ? 'Hesabına giriş yap' : 'Yeni hesap oluştur' }}</p>

    <form @submit.prevent="submit">
      <input v-model="email" type="email" placeholder="E-posta" autocomplete="email" required>
      <input
        v-model="password"
        type="password"
        placeholder="Şifre"
        :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
        minlength="6"
        required
      >
      <button type="submit" :disabled="loading">
        {{ loading ? 'Bekleyin...' : mode === 'login' ? 'Giriş yap' : 'Kayıt ol' }}
      </button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>

    <p class="switch">
      <template v-if="mode === 'login'">
        Hesabın yok mu? <a href="#" @click.prevent="mode = 'register'">Kayıt ol</a>
      </template>
      <template v-else>
        Zaten hesabın var mı? <a href="#" @click.prevent="mode = 'login'">Giriş yap</a>
      </template>
    </p>
  </div>
</template>

<style scoped>
.login { max-width: 380px; margin: 60px auto 0; }
form { display: flex; flex-direction: column; gap: 10px; margin-top: 16px; }
.switch { margin: 16px 0 0; font-size: 14px; }
a { color: #4f46e5; }
</style>
