// ═══════════════════════════════════════════════════════
//  PAPAN BUNGA INDAH — Konfigurasi
//  Edit file ini dengan kredensial Google API kamu
// ═══════════════════════════════════════════════════════

const CONFIG = {
  // Spreadsheet ID dari URL Google Sheets kamu
  // https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_DI_SINI/edit
  SPREADSHEET_ID: 'GANTI_DENGAN_SPREADSHEET_ID_KAMU',

  // API Key dari Google Cloud Console (untuk read data)
  API_KEY: 'GANTI_DENGAN_API_KEY_KAMU',

  // OAuth 2.0 Client ID (untuk login & write data)
  CLIENT_ID: 'GANTI_DENGAN_CLIENT_ID_KAMU.apps.googleusercontent.com',

  // Nama sheet di dalam Spreadsheet
  SHEET_ORDERS:   'Orders',
  SHEET_SETTINGS: 'Settings',

  // OAuth scope yang dibutuhkan
  SCOPES: 'https://www.googleapis.com/auth/spreadsheets',

  // Default pengaturan toko (digunakan jika sheet Settings kosong)
  DEFAULT_SETTINGS: {
    namaToko:       'Papan Bunga Indah',
    noHp:           '08123456789',
    alamatToko:     'Jl. Melati Raya No. 10, Laweyan, Surakarta',
    kodeQris:       '',
    ongkirKecil:    15000,
    ongkirBesar:    25000,
    hargaKecil:     250000,
    hargaBesar:     450000,
    notifPesanan:   true,
    notifPembayaran:true,
    avatarToko:     '🌸',
    avatarIsImage:  false,
  },

  // Header kolom Orders sheet
  ORDER_HEADERS: [
    'id','nama','hp','alamat','jenis','ongkir','total',
    'status','tanggal','catatan','deliveryDate',
    'fotoNama','fotoTf','fotoBuktiKirim','createdAt'
  ],
};
