// GET /api/notes -> giriş yapan kullanıcının notları (yeniden eskiye)
export default defineEventHandler(async (event) => {
  const uid = await requireUser(event)

  // Sadece bu kullanıcıya ait notlar
  const snap = await db().collection(NOTES).where('userId', '==', uid).get()

  // Sıralamayı burada yapıyoruz; Firestore'da where + orderBy birlikte
  // kullanılırsa ayrıca "composite index" oluşturmak gerekirdi.
  return snap.docs
    .map(toNote)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
})
