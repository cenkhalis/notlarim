import { Timestamp } from 'firebase-admin/firestore'

// POST /api/notes -> yeni not ekle
export default defineEventHandler(async (event) => {
  const uid = await requireUser(event)
  const { title, content } = await readNoteBody(event)

  const now = Timestamp.now()
  const ref = await db().collection(NOTES).add({
    userId: uid, // notun sahibi; token'dan gelir, istemciye güvenmeyiz
    title,
    content,
    createdAt: now,
    updatedAt: now,
  })

  setResponseStatus(event, 201)
  return toNote(await ref.get())
})
