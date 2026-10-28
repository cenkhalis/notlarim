import { initializeApp, getApps, cert, type App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

// firebase-admin uygulamasını ilk ihtiyaç anında bir kez başlatır.
// server/utils içindeki fonksiyonlar API dosyalarında otomatik import edilir.
function getAdminApp(): App {
  if (getApps().length) return getApps()[0]!

  const raw = useRuntimeConfig().firebaseServiceAccount as unknown
  if (!raw) {
    throw createError({ statusCode: 500, message: 'NUXT_FIREBASE_SERVICE_ACCOUNT tanımlı değil' })
  }

  // Nuxt, JSON görünümlü ortam değişkenlerini bazen kendisi nesneye çevirir;
  // bu yüzden hem string hem nesne durumunu destekliyoruz.
  // runtimeConfig salt okunurdur; değiştirebilmek için kopyasını alıyoruz.
  const serviceAccount = typeof raw === 'string' ? JSON.parse(raw) : { ...(raw as Record<string, string>) }

  // Tek satıra çevrilirken "\n"ler kaçışlı kalmış olabilir; gerçek satır sonuna çevir
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n')
  }

  return initializeApp({ credential: cert(serviceAccount) })
}

export const adminAuth = () => getAuth(getAdminApp())
export const db = () => getFirestore(getAdminApp())
