// ".global" eki: her sayfa geçişinde otomatik çalışır.
export default defineNuxtRouteMiddleware(async (to) => {
  const { $auth } = useNuxtApp()

  // Sayfa ilk açıldığında Firebase'in kayıtlı oturumu yüklemesini bekle
  await $auth.authStateReady()
  const user = $auth.currentUser

  // Giriş yapmamış kullanıcı -> /login
  if (!user && to.path !== '/login') return navigateTo('/login')
  // Zaten giriş yapmış kullanıcı /login'e gelirse -> ana sayfa
  if (user && to.path === '/login') return navigateTo('/')
})
