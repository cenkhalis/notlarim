import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Firebase istemci SDK'sını tarayıcıda bir kez başlatır.
// ".client" eki: bu eklenti sadece tarayıcıda çalışır.
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public

  // Hot reload sırasında iki kez başlatmamak için mevcut uygulamayı kullan
  const app = getApps().length
    ? getApp()
    : initializeApp({
        apiKey: config.firebaseApiKey,
        authDomain: config.firebaseAuthDomain,
        projectId: config.firebaseProjectId,
        appId: config.firebaseAppId,
      })

  // Bileşenlerde useNuxtApp().$auth ile erişilir
  return { provide: { auth: getAuth(app) } }
})
