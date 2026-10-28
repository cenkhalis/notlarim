import type { DocumentSnapshot } from 'firebase-admin/firestore'
import type { H3Event } from 'h3'

export const NOTES = 'notes'

// Firestore dokümanını istemciye gönderilecek düz nesneye çevirir
export function toNote(doc: DocumentSnapshot) {
  const data = doc.data()!
  return {
    id: doc.id,
    title: data.title as string,
    content: data.content as string,
    createdAt: data.createdAt.toDate().toISOString(),
    updatedAt: data.updatedAt.toDate().toISOString(),
  }
}

// İstek gövdesinden title ve content'i okuyup doğrular
export async function readNoteBody(event: H3Event) {
  const body = await readBody(event)
  const title = typeof body?.title === 'string' ? body.title.trim() : ''
  const content = typeof body?.content === 'string' ? body.content : ''

  if (!title) throw createError({ statusCode: 400, message: 'Başlık boş olamaz' })
  if (title.length > 200) throw createError({ statusCode: 400, message: 'Başlık çok uzun' })
  if (content.length > 10000) throw createError({ statusCode: 400, message: 'İçerik çok uzun' })

  return { title, content }
}

// Notu getirir; yoksa 404, başka kullanıcıya aitse 403 fırlatır
export async function getOwnNote(id: string, uid: string) {
  const ref = db().collection(NOTES).doc(id)
  const snap = await ref.get()

  if (!snap.exists) throw createError({ statusCode: 404, message: 'Not bulunamadı' })
  if (snap.data()!.userId !== uid) {
    throw createError({ statusCode: 403, message: 'Bu not size ait değil' })
  }
  return ref
}
