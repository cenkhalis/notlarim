// DELETE /api/notes/:id -> notu sil (sadece sahibi)
export default defineEventHandler(async (event) => {
  const uid = await requireUser(event)
  const id = getRouterParam(event, 'id')!

  // Başkasının notuysa 403, yoksa 404 fırlatır
  const ref = await getOwnNote(id, uid)
  await ref.delete()

  return { ok: true }
})
