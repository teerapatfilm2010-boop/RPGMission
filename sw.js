/* Service worker ของ RPGMISSION · เปลี่ยนเลข VERSION ทุกครั้งที่อัปเดตหน้าเว็บ เพื่อให้เครื่องผู้ใช้โหลดของใหม่ */
const VERSION = 'v1';
const SHELL = 'rpg-shell-' + VERSION, RUNTIME = 'rpg-cdn-' + VERSION;
const PRECACHE = ['./', 'index.html', 'manifest.json', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png'];
const CDN = ['cdn.jsdelivr.net', 'cdn.tailwindcss.com', 'cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== SHELL && k !== RUNTIME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET') return;                                   // POST ไป Apps Script ไม่ผ่าน cache
  if (u.hostname === 'script.google.com' || u.hostname.endsWith('googleusercontent.com')) return;
  if (r.mode === 'navigate') {                                      // หน้าเว็บ: ลองเครือข่ายก่อน ไม่ได้ค่อยใช้ของในเครื่อง
    e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(SHELL).then(c => c.put('index.html', cp)); return res; })
      .catch(() => caches.match('index.html').then(m => m || caches.match('./'))));
    return;
  }
  if (u.origin === location.origin || CDN.includes(u.hostname)) {   // ไฟล์คงที่/CDN: ใช้ของเก่าทันที แล้วอัปเดตเบื้องหลัง
    e.respondWith(caches.open(u.origin === location.origin ? SHELL : RUNTIME).then(c => c.match(r).then(hit => {
      const net = fetch(r).then(res => { if (res && (res.ok || res.type === 'opaque')) c.put(r, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    })));
  }
});
