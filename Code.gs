// ═══════════════════════════════════════════════════════════════════
//  PAPAN BUNGA INDAH — Google Apps Script Backend
//  Code.gs  |  Versi 3.0
// ═══════════════════════════════════════════════════════════════════

// ── Konfigurasi Spreadsheet ──────────────────────────────────────────
const SPREADSHEET_ID = "GANTI_DENGAN_SPREADSHEET_ID_ANDA";

const SHEET_ORDERS   = "Orders";
const SHEET_SETTINGS = "Settings";

// ── Entry Point ─────────────────────────────────────────────────────
function doGet(e) {
  return HtmlService
    .createHtmlOutputFromFile("Index")
    .setTitle("Papan Bunga Indah")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag("viewport", "width=device-width, initial-scale=1.0");
}

// ═══════════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════════
function getOrCreateSheet_(name, headers) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length)
      .setFontWeight("bold")
      .setBackground("#7c3aed")
      .setFontColor("#ffffff");
    sh.setFrozenRows(1);
  }
  return sh;
}

function sheetToObjects_(sh) {
  const data = sh.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    return obj;
  });
}

function generateId_() {
  return "PB-" + new Date().getFullYear() +
    String(Date.now()).slice(-5);
}

// ═══════════════════════════════════════════════════════════════════
//  ORDERS
// ═══════════════════════════════════════════════════════════════════
const ORDER_HEADERS = [
  "id","nama","hp","alamat","jenis","ongkir","total",
  "status","tanggal","catatan","deliveryDate",
  "fotoNama","fotoTf","fotoBuktiKirim","createdAt"
];

function getOrders() {
  const sh = getOrCreateSheet_(SHEET_ORDERS, ORDER_HEADERS);
  return sheetToObjects_(sh);
}

function saveOrder(order) {
  const sh = getOrCreateSheet_(SHEET_ORDERS, ORDER_HEADERS);
  order.id        = order.id || generateId_();
  order.createdAt = order.createdAt || new Date().toISOString();
  order.status    = order.status || "antrean";
  order.tanggal   = order.tanggal ||
    new Date().toLocaleDateString("id-ID", { day:"numeric", month:"short" });

  const row = ORDER_HEADERS.map(h => order[h] || "");
  sh.appendRow(row);
  return { success: true, id: order.id };
}

function updateOrderStatus(id, status) {
  const sh = getOrCreateSheet_(SHEET_ORDERS, ORDER_HEADERS);
  const data = sh.getDataRange().getValues();
  const headers = data[0];
  const idIdx = headers.indexOf("id");
  const stIdx = headers.indexOf("status");
  for (let r = 1; r < data.length; r++) {
    if (data[r][idIdx] === id) {
      sh.getRange(r + 1, stIdx + 1).setValue(status);
      return { success: true };
    }
  }
  return { success: false, error: "Order tidak ditemukan" };
}

function updateOrderPhoto(id, photoType, photoData) {
  // photoType: "fotoTf" | "fotoBuktiKirim"
  const sh = getOrCreateSheet_(SHEET_ORDERS, ORDER_HEADERS);
  const data = sh.getDataRange().getValues();
  const headers = data[0];
  const idIdx = headers.indexOf("id");
  const ptIdx = headers.indexOf(photoType);
  if (ptIdx === -1) return { success: false, error: "Field foto tidak ditemukan" };
  for (let r = 1; r < data.length; r++) {
    if (data[r][idIdx] === id) {
      sh.getRange(r + 1, ptIdx + 1).setValue(photoData);
      return { success: true };
    }
  }
  return { success: false, error: "Order tidak ditemukan" };
}

// Update multiple fields at once (used for status + foto)
function updateOrderFields(id, fields) {
  const sh = getOrCreateSheet_(SHEET_ORDERS, ORDER_HEADERS);
  const data = sh.getDataRange().getValues();
  const headers = data[0];
  const idIdx = headers.indexOf("id");
  for (let r = 1; r < data.length; r++) {
    if (data[r][idIdx] === id) {
      Object.entries(fields).forEach(([key, value]) => {
        const colIdx = headers.indexOf(key);
        if (colIdx !== -1) {
          sh.getRange(r + 1, colIdx + 1).setValue(value);
        }
      });
      return { success: true };
    }
  }
  return { success: false, error: "Order tidak ditemukan" };
}

function deleteOrder(id) {
  const sh = getOrCreateSheet_(SHEET_ORDERS, ORDER_HEADERS);
  const data = sh.getDataRange().getValues();
  const idIdx = data[0].indexOf("id");
  for (let r = 1; r < data.length; r++) {
    if (data[r][idIdx] === id) {
      sh.deleteRow(r + 1);
      return { success: true };
    }
  }
  return { success: false };
}

// ── Update delivery date ─────────────────────────────────────────────
function updateDeliveryDate(id, deliveryDate) {
  const sh = getOrCreateSheet_(SHEET_ORDERS, ORDER_HEADERS);
  const data = sh.getDataRange().getValues();
  const headers = data[0];
  const idIdx = headers.indexOf("id");
  const ddIdx = headers.indexOf("deliveryDate");
  for (let r = 1; r < data.length; r++) {
    if (data[r][idIdx] === id) {
      sh.getRange(r + 1, ddIdx + 1).setValue(deliveryDate);
      return { success: true };
    }
  }
  return { success: false };
}

// ═══════════════════════════════════════════════════════════════════
//  SETTINGS
// ═══════════════════════════════════════════════════════════════════
const SETTINGS_HEADERS = ["key","value"];

const DEFAULT_SETTINGS = {
  namaToko      : "Papan Bunga Indah",
  noHp          : "08123456789",
  alamatToko    : "Jl. Melati Raya No. 10, Laweyan, Surakarta",
  kodeQris      : "",
  ongkirKecil   : 15000,
  ongkirBesar   : 25000,
  hargaKecil    : 250000,
  hargaBesar    : 450000,
  notifPesanan  : true,
  notifPembayaran: true,
  avatarToko    : "🌸",   // emoji or base64 image
  avatarIsImage : false,  // true jika avatar berupa gambar
};

function getSettings() {
  const sh = getOrCreateSheet_(SHEET_SETTINGS, SETTINGS_HEADERS);
  const rows = sheetToObjects_(sh);
  const result = { ...DEFAULT_SETTINGS };
  rows.forEach(r => { result[r.key] = r.value; });
  return result;
}

function saveSettings(settings) {
  const sh = getOrCreateSheet_(SHEET_SETTINGS, SETTINGS_HEADERS);
  const data = sh.getDataRange().getValues();
  const existing = {};
  const rowIndex = {};
  data.slice(1).forEach((row, i) => {
    existing[row[0]] = row[1];
    rowIndex[row[0]] = i + 2;
  });

  Object.entries(settings).forEach(([key, value]) => {
    if (rowIndex[key]) {
      sh.getRange(rowIndex[key], 2).setValue(value);
    } else {
      sh.appendRow([key, value]);
    }
  });
  return { success: true };
}

// ═══════════════════════════════════════════════════════════════════
//  ANALYTICS
// ═══════════════════════════════════════════════════════════════════
function getAnalytics() {
  const orders = getOrders();
  const now    = new Date();

  const days = [];
  for (let d = 6; d >= 0; d--) {
    const dt = new Date(now);
    dt.setDate(dt.getDate() - d);
    const label = dt.toLocaleDateString("id-ID", { weekday:"short" });
    const dateStr = dt.toISOString().split("T")[0];
    const val = orders
      .filter(o => o.status === "selesai" &&
        (o.createdAt || "").startsWith(dateStr))
      .reduce((s, o) => s + (Number(o.total) || 0) + (Number(o.ongkir) || 0), 0);
    days.push({ label, val });
  }

  const done   = orders.filter(o => o.status === "selesai");
  const bulan  = done.reduce((s, o) => s + (Number(o.total)||0) + (Number(o.ongkir)||0), 0);
  const besar  = orders.filter(o => o.jenis === "Besar").length;
  const kecil  = orders.filter(o => o.jenis === "Kecil").length;

  return { days, bulan, besar, kecil, total: orders.length, selesai: done.length };
}

// ═══════════════════════════════════════════════════════════════════
//  INIT (jalankan sekali untuk set-up sheet)
// ═══════════════════════════════════════════════════════════════════
function initSheets() {
  getOrCreateSheet_(SHEET_ORDERS, ORDER_HEADERS);
  getOrCreateSheet_(SHEET_SETTINGS, SETTINGS_HEADERS);

  const sh = SpreadsheetApp.openById(SPREADSHEET_ID)
    .getSheetByName(SHEET_ORDERS);
  if (sh.getLastRow() <= 1) {
    const samples = [
      ["PB-001","Ibu Rina Susanti","08123456789",
       "Jl. Melati No. 12, Laweyan","Besar",25000,450000,
       "antrean","16 Mei","Ucapan: Selamat Ulang Tahun",
       "2026-05-22","","","",new Date().toISOString()],
      ["PB-002","Bapak Ahmad Fauzi","08234567890",
       "Jl. Kenanga No. 5, Banjarsari","Kecil",15000,250000,
       "proses","15 Mei","Ucapan: Selamat Wisuda",
       "2026-05-21","","","",new Date().toISOString()],
      ["PB-003","Dian Lestari","08345678901",
       "Jl. Anggrek No. 8, Serengan","Besar",30000,500000,
       "selesai","13 Mei","Papan Duka Cita",
       "2026-05-13","","","",new Date(Date.now()-172800000).toISOString()],
      ["PB-004","Wahyu Pratama","08456789012",
       "Jl. Mawar No. 3, Pasar Kliwon","Kecil",20000,275000,
       "selesai","12 Mei","Grand Opening",
       "2026-05-12","","","",new Date(Date.now()-259200000).toISOString()],
    ];
    samples.forEach(r => sh.appendRow(r));
  }
  return "Sheet berhasil dibuat!";
}
