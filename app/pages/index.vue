<script setup lang="ts">
import { signOut } from 'firebase/auth'

// API'den gelen not yapısı
interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

const { $auth } = useNuxtApp()
const api = useApi()

const notes = ref<Note[]>([])
const loading = ref(true)
const error = ref('')

// Yeni not formu
const newTitle = ref('')
const newContent = ref('')
const saving = ref(false)

// Düzenlenen notun id'si ve geçici değerleri
const editingId = ref<string | null>(null)
const editTitle = ref('')
const editContent = ref('')

// Hata mesajını API cevabından çıkar
function showError(e: any) {
  error.value = e?.data?.message || e?.message || 'Bir hata oluştu.'
}

async function loadNotes() {
  loading.value = true
  error.value = ''
  try {
    notes.value = await api<Note[]>('/api/notes')
  } catch (e) {
    showError(e)
  } finally {
    loading.value = false
  }
}

async function addNote() {
  saving.value = true
  error.value = ''
  try {
    const note = await api<Note>('/api/notes', {
      method: 'POST',
      body: { title: newTitle.value, content: newContent.value },
    })
    notes.value.unshift(note) // en yeni not en üstte
    newTitle.value = ''
    newContent.value = ''
  } catch (e) {
    showError(e)
  } finally {
    saving.value = false
  }
}

function startEdit(note: Note) {
  editingId.value = note.id
  editTitle.value = note.title
  editContent.value = note.content
}

async function saveEdit(id: string) {
  error.value = ''
  try {
    const updated = await api<Note>(`/api/notes/${id}`, {
      method: 'PUT',
      body: { title: editTitle.value, content: editContent.value },
    })
    // Listedeki eski notu güncel haliyle değiştir
    notes.value = notes.value.map((n) => (n.id === id ? updated : n))
    editingId.value = null
  } catch (e) {
    showError(e)
  }
}

async function removeNote(id: string) {
  if (!confirm('Bu not silinsin mi?')) return
  error.value = ''
  try {
    await api(`/api/notes/${id}`, { method: 'DELETE' })
    notes.value = notes.value.filter((n) => n.id !== id)
  } catch (e) {
    showError(e)
  }
}

async function logout() {
  await signOut($auth)
  await navigateTo('/login')
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('tr-TR')
}

// Sayfa açılınca notları yükle
onMounted(loadNotes)
</script>

<template>
  <div>
    <header>
      <div>
        <h1>Notlarım</h1>
        <p class="muted">{{ $auth.currentUser?.email }}</p>
      </div>
      <button class="secondary" @click="logout">Çıkış yap</button>
    </header>

    <!-- Yeni not ekleme formu -->
    <form class="card new-note" @submit.prevent="addNote">
      <input v-model="newTitle" placeholder="Başlık" maxlength="200" required>
      <textarea v-model="newContent" placeholder="Notunu yaz..." maxlength="10000" />
      <button type="submit" :disabled="saving">{{ saving ? 'Ekleniyor...' : 'Not ekle' }}</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>

    <p v-if="loading" class="muted">Yükleniyor...</p>
    <p v-else-if="notes.length === 0" class="muted">Henüz notun yok. İlk notunu yukarıdan ekle.</p>

    <ul class="notes">
      <li v-for="note in notes" :key="note.id" class="card">
        <!-- Düzenleme modu -->
        <form v-if="editingId === note.id" class="edit" @submit.prevent="saveEdit(note.id)">
          <input v-model="editTitle" maxlength="200" required>
          <textarea v-model="editContent" maxlength="10000" />
          <div class="actions">
            <button type="submit">Kaydet</button>
            <button type="button" class="secondary" @click="editingId = null">Vazgeç</button>
          </div>
        </form>

        <!-- Görüntüleme modu -->
        <template v-else>
          <h3>{{ note.title }}</h3>
          <p class="content">{{ note.content }}</p>
          <div class="footer">
            <span class="muted">{{ formatDate(note.updatedAt) }}</span>
            <div class="actions">
              <button class="secondary" @click="startEdit(note)">Düzenle</button>
              <button class="danger" @click="removeNote(note.id)">Sil</button>
            </div>
          </div>
        </template>
      </li>
    </ul>
  </div>
</template>

<style scoped>
header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
header .muted { margin: 4px 0 0; }
.new-note, .edit { display: flex; flex-direction: column; gap: 10px; }
.new-note button { align-self: flex-end; }
.notes { list-style: none; padding: 0; margin: 20px 0 0; display: flex; flex-direction: column; gap: 12px; }
h3 { margin: 0 0 6px; }
.content { margin: 0 0 12px; white-space: pre-wrap; word-break: break-word; }
.footer { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.actions { display: flex; gap: 8px; justify-content: flex-end; }
</style>
