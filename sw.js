/* 離線快取：連線時走網路（永遠拿最新版並更新快取），離線時用裝置上的快取 */
const CACHE = "tle-syd-v2";
const ASSETS = ["./", "./index.html", "./app.js", "./manifest.json", "./icon.png",
  "./img/espresso.jpg", "./img/euca.webp", "./img/koala.webp", "./img/latte.jpg", "./img/oj.jpg", "./img/opera.webp", "./img/red.jpg", "./img/sparkle.webp", "./img/sparkling.jpg", "./img/still.jpg", "./img/tea.jpg", "./img/white.jpg"];
/* 歌劇院影片：盡力快取，檔案不存在或太大也不影響 App 安裝 */
const MEDIA = ["./media/design.mp4", "./media/build.mp4", "./media/arch.mp4"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(async c => {
      await c.addAll(ASSETS);
      for (const m of MEDIA) { try { await c.add(m); } catch (_) {} }
    }).then(() => self.skipWaiting())
  );
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  /* 影片用 Range 請求，快取優先 */
  if (e.request.url.includes("/media/")) {
    e.respondWith(caches.match(e.request, { ignoreSearch: true, ignoreVary: true }).then(hit => hit || fetch(e.request)));
    return;
  }
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() =>
      caches.match(e.request, { ignoreSearch: true }).then(hit => hit || caches.match("./index.html"))
    )
  );
});
