type ApiOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: Record<string, unknown>
}

// API'ye istek atan yardımcı: her isteğe Firebase ID token'ını ekler.
export function useApi() {
  const { $auth } = useNuxtApp()

  return async <T>(url: string, options: ApiOptions = {}): Promise<T> => {
    const user = $auth.currentUser
    if (!user) throw new Error('Oturum bulunamadı')

    // getIdToken süresi dolmuşsa token'ı kendisi yeniler
    const token = await user.getIdToken()

    return $fetch<T>(url, {
      ...options,
      headers: { Authorization: `Bearer ${token}` },
    })
  }
}
