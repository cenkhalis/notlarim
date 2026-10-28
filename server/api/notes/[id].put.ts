import { Timestamp } from 'firebase-admin/firestore'

// PUT /api/notes/:id -> notu güncelle (sadece sahibi)
export default defineEventHandler(async (event) => {
  const uid = await requireUser(event)
  const id = getRouterParam(event, 'id')!

  // Önce sahiplik kontrolü: başkasının notuysa 403
  const ref = await getOwnNote(id, uid)
  const { title, content } = await readNoteBody(event)

  await ref.update({ title, content, updatedAt: Timestamp.now() })
  return toNote(await ref.get())
})
