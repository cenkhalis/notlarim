import type { H3Event } from 'h3'

// İstekteki "Authorization: Bearer <token>" başlığını firebase-admin ile doğrular.
// Başarılıysa kullanıcının uid'sini döner, değilse 401 hatası fırlatır.
export async function requireUser(event: H3Event): Promise<string> {
  const header = getHeader(event, 'authorization') || ''
  const [scheme, token] = header.split(' ')

  // Not: "statusMessage" Türkçe karakterleri sildiği için hata metnini "message" ile veriyoruz
  if (scheme !== 'Bearer' || !token) {
    throw createError({ statusCode: 401, message: 'Giriş yapmanız gerekiyor' })
  }

  // try dışında: service account hatası 401 değil 500 olarak görünsün
  const auth = adminAuth()

  try {
    // Token'ın imzasını, süresini ve projeye ait olduğunu kontrol eder
    const decoded = await auth.verifyIdToken(token)
    return decoded.uid
  } catch {
    throw createError({ statusCode: 401, message: 'Geçersiz veya süresi dolmuş oturum' })
  }
}
