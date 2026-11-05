/* Service worker ขั้นต่ำ: ให้ Chrome ถือว่าติดตั้งได้ · ไม่แคชข้อมูล เพื่อให้ได้ข้อมูลล่าสุดจาก Apps Script เสมอ */
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => { /* ผ่านไปยังเครือข่ายตามปกติ */ });
