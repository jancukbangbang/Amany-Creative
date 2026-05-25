# 🌸 Amany Creative — GitHub Pages

Aplikasi manajemen pesanan papan bunga berbasis web, dihosting di GitHub Pages dengan Google Sheets API v4 sebagai backend data.

---

## ⚡ Setup Cepat

### 1. Fork / Clone repo ini
```bash
git clone https://github.com/USERNAME/papan-bunga-indah.git
cd papan-bunga-indah
```

### 2. Buat Google Spreadsheet

1. Buka [Google Sheets](https://sheets.google.com) → buat spreadsheet baru
2. Beri nama: **Amany Creative - Data**
3. Copy **Spreadsheet ID** dari URL:
   ```
   https://docs.google.com/spreadsheets/d/1LA6IIO-39G3EydZrfWlivjAzx4eFQrP6LjpzbPC5f9A/edit
   ```

### 3. Aktifkan Google Sheets API

1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Buat project baru (atau gunakan yang ada)
3. **APIs & Services → Enable APIs → cari "Google Sheets API" → Enable**
4. **APIs & Services → Credentials → Create Credentials → API Key**
5. Copy API Key yang dibuat

> ⚠️ **Batasi API Key** ke Sheets API saja dan domain GitHub Pages kamu untuk keamanan.

### 4. Atur OAuth 2.0 (untuk write access)

1. **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
2. Application type: **Web application**
3. Authorized JavaScript origins: `https://USERNAME.github.io`
4. Authorized redirect URIs: `https://USERNAME.github.io/papan-bunga-indah/`
5. Copy **Client ID**

### 5. Edit `config.js`

Buka file `config.js` dan isi:

```javascript
const CONFIG = {
  SPREADSHEET_ID: '1LA6IIO-39G3EydZrfWlivjAzx4eFQrP6LjpzbPC5f9A',
  API_KEY:        'GANTI_DENGAN_API_KEY_KAMU',
  CLIENT_ID:      'GANTI_DENGAN_CLIENT_ID_KAMU.apps.googleusercontent.com',
};
```

### 6. Aktifkan GitHub Pages

1. Repo → **Settings → Pages**
2. Source: **GitHub Actions**
3. Push ke branch `main` → otomatis deploy

---

## 📁 Struktur File

```
papan-bunga-indah/
├── index.html          ← Aplikasi utama
├── config.js           ← Konfigurasi API (EDIT INI)
├── api.js              ← Google Sheets API wrapper
├── .github/
│   └── workflows/
│       └── deploy.yml  ← Auto deploy ke GitHub Pages
└── README.md
```

## 🔐 Keamanan

- API Key hanya untuk **read** data publik (tidak ada data sensitif)
- OAuth Client ID untuk **write** — hanya akun Google kamu yang bisa login
- Jangan commit credential pribadi ke repo publik
- Batasi API Key di Google Cloud Console ke domain GitHub Pages kamu

## 📊 Struktur Google Spreadsheet

Sheet **Orders** (dibuat otomatis saat pertama login):
| id | nama | hp | alamat | jenis | ongkir | total | status | tanggal | catatan | deliveryDate | fotoNama | fotoTf | fotoBuktiKirim | createdAt |

Sheet **Settings** (dibuat otomatis):
| key | value |
