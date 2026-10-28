# Notlarım

Her kullanıcının sadece kendi notlarını görüp ekleyebildiği, düzenleyip silebildiği full stack bir not uygulaması.

- **Nuxt 4**: arayüz (`app/`) + REST API (`server/api/`)
- **Firebase Authentication**: e-posta/şifre ile giriş ve kayıt (tarayıcıda)
- **Firestore**: veritabanı (sadece sunucudan, `firebase-admin` ile)
- **Railway**: deploy

## Proje yapısı

```
app/
  app.vue                  # Ana bileşen + global stiller
  pages/login.vue          # Giriş / kayıt sayfası
  pages/index.vue          # Not listesi, ekleme, düzenleme, silme, çıkış
  plugins/firebase.client.ts  # Firebase istemci SDK'sını başlatır
  middleware/auth.global.ts   # Giriş yapmamış kullanıcıyı /login'e yönlendirir
  composables/useApi.ts       # API isteklerine "Authorization: Bearer <token>" ekler
server/
  utils/firebase.ts        # firebase-admin başlatma (Auth + Firestore)
  utils/auth.ts            # requireUser(): token doğrulama, yoksa/geçersizse 401
  utils/notes.ts           # Not yardımcıları (doğrulama, sahiplik kontrolü -> 403)
  api/notes/index.get.ts   # GET    /api/notes
  api/notes/index.post.ts  # POST   /api/notes
  api/notes/[id].put.ts    # PUT    /api/notes/:id
  api/notes/[id].delete.ts # DELETE /api/notes/:id
```

Firestore'da `notes` koleksiyonu kullanılır. Her dokümanın alanları: `userId`, `title`, `content`, `createdAt`, `updatedAt`.

## 1. Firebase projesini hazırlama

### Proje oluşturma
1. <https://console.firebase.google.com> adresine git, **Proje ekle** (Create a project) de.
2. Bir isim ver (ör. `notlarim`). Google Analytics'i kapatabilirsin. Projeyi oluştur.

### Authentication'ı etkinleştirme
1. Sol menüden **Build > Authentication** → **Get started**.
2. **Sign-in method** sekmesinde **Email/Password**'ü seç, **Enable** yap ve kaydet.

### Firestore'u etkinleştirme
1. Sol menüden **Build > Firestore Database** → **Create database**.
2. Bir konum seç (ör. `eur3 (europe-west)`).
3. **Production mode**'u seç. Bu uygulamada tarayıcı Firestore'a hiç doğrudan erişmez;
   tüm erişim sunucudaki `firebase-admin` ile olur (admin SDK güvenlik kurallarına takılmaz).
   Bu yüzden kuralları her şeyi kapalı bırakmak en güvenlisidir:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} { allow read, write: if false; }
     }
   }
   ```

### Web config'i alma (tarayıcı için)
1. **Proje ayarları** (sol üstteki dişli ⚙️) → **Genel** sekmesi.
2. En altta **Uygulamalarınız** → web simgesi **`</>`** ile bir web uygulaması ekle (Hosting'i işaretlemene gerek yok).
3. Gösterilen `firebaseConfig` içindeki değerleri not al:
   - `apiKey` → `NUXT_PUBLIC_FIREBASE_API_KEY`
   - `authDomain` → `NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `projectId` → `NUXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `appId` → `NUXT_PUBLIC_FIREBASE_APP_ID`

> Bu değerler gizli değildir, tarayıcıya zaten gönderilir. Güvenliği sunucudaki token doğrulaması sağlar.

### Service account anahtarını alma (sunucu için)
1. **Proje ayarları** → **Hizmet hesapları** (Service accounts) sekmesi.
2. **Yeni özel anahtar oluştur** (Generate new private key) → bir `.json` dosyası iner.
3. **Bu dosya gizlidir!** Asla repoya ekleme, kimseyle paylaşma.
4. İçeriğini tek satıra çevir (macOS/Linux terminalinde):
   ```bash
   node -e "console.log(JSON.stringify(require('./indirilen-dosya.json')))"
   ```
   Çıkan tek satırlık metin `NUXT_FIREBASE_SERVICE_ACCOUNT` değeridir.

## 2. Lokalde çalıştırma

Gereksinim: Node.js 20 veya üzeri.

```bash
cd ~/Desktop/notlarim
npm install
cp .env.example .env     # sonra .env içini doldur
npm run dev
```

`.env` içinde service account değerini **tek tırnak** içinde yaz:

```
NUXT_FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'
```

Tarayıcıda <http://localhost:3000> adresini aç, kayıt ol ve not eklemeye başla.

Production derlemesini denemek için:

```bash
npm run build
npm start
```

## 3. GitHub'a push etme

1. GitHub'da yeni ve boş bir repo oluştur (ör. `notlarim`). README eklemeden oluştur.
2. Proje klasöründe:
   ```bash
   cd ~/Desktop/notlarim
   git init
   git add .
   git status          # .env ve service account .json dosyasının listede OLMADIĞINDAN emin ol!
   git commit -m "İlk sürüm"
   git branch -M main
   git remote add origin https://github.com/KULLANICI_ADIN/notlarim.git
   git push -u origin main
   ```

## 4. Railway'de deploy etme

1. <https://railway.com> adresinde GitHub hesabınla giriş yap.
2. **New Project** → **Deploy from GitHub repo** → `notlarim` reposunu seç.
3. Railway projeyi Node uygulaması olarak tanır; `npm run build` ile derler, `npm start` ile başlatır.
   Nuxt sunucusu Railway'in verdiği `PORT` ortam değişkenini otomatik kullanır.
4. Servise tıkla → **Variables** sekmesi → şu değişkenleri ekle (değerler `.env` ile aynı):
   - `NUXT_PUBLIC_FIREBASE_API_KEY`
   - `NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NUXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NUXT_PUBLIC_FIREBASE_APP_ID`
   - `NUXT_FIREBASE_SERVICE_ACCOUNT` → tek satırlık JSON'u **tırnaksız** yapıştır
     (Railway'de dış tırnak gerekmez; `.env`'deki tek tırnakları alma).

   > İpucu: **Raw Editor** ile `.env` içeriğini toplu yapıştırabilirsin.
5. **Settings** → **Networking** → **Generate Domain** ile bir adres al (ör. `notlarim-production.up.railway.app`).
6. Değişkenleri ekledikten sonra Railway yeniden deploy eder. Etmezse **Deploy** butonuyla tetikle.

### Railway domain'ini Firebase'e ekleme
Firebase Auth sadece izin verilen alan adlarında çalışır:

1. Firebase Console → **Authentication** → **Settings** sekmesi → **Authorized domains**.
2. **Add domain** → Railway domain'ini yaz (ör. `notlarim-production.up.railway.app`, `https://` olmadan).

Artık uygulaman canlıda! 🎉

## API özeti

Tüm istekler `Authorization: Bearer <Firebase ID token>` başlığı ister. Yoksa veya geçersizse **401** döner.

| Metot  | Yol              | Açıklama                               |
|--------|------------------|----------------------------------------|
| GET    | `/api/notes`     | Kullanıcının notları (yeniden eskiye)  |
| POST   | `/api/notes`     | Yeni not (`{ title, content }`)        |
| PUT    | `/api/notes/:id` | Notu güncelle (`{ title, content }`)   |
| DELETE | `/api/notes/:id` | Notu sil                               |

Başka bir kullanıcının notunu güncellemeye/silmeye çalışmak **403**, olmayan bir not **404** döner.
