// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: true },

  // Sayfalar tarayıcıda render edilir (SPA). Firebase Auth oturumu tarayıcıda
  // tutulduğu için bu en basit yol. API (server/api) yine Node sunucusunda çalışır.
  ssr: false,

  app: {
    head: {
      title: 'Notlarım',
      htmlAttrs: { lang: 'tr' },
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },

  // Ortam değişkenleri buraya otomatik eşlenir:
  //   NUXT_FIREBASE_SERVICE_ACCOUNT       -> firebaseServiceAccount (sadece sunucu)
  //   NUXT_PUBLIC_FIREBASE_API_KEY        -> public.firebaseApiKey  (tarayıcı da görür)
  runtimeConfig: {
    // Gizli: sadece sunucu tarafında okunabilir
    firebaseServiceAccount: '',
    // Herkese açık: tarayıcıya gönderilir (Firebase web config gizli değildir)
    public: {
      firebaseApiKey: '',
      firebaseAuthDomain: '',
      firebaseProjectId: '',
      firebaseAppId: '',
    },
  },
})
