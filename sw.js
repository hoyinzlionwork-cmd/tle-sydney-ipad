/* 離線快取：連線時走網路（永遠拿最新版並更新快取），離線時用裝置上的快取 */
const CACHE = "tle-syd-v3";
const ASSETS = ["./", "./index.html", "./app.js", "./manifest.json", "./icon.png",
  "./img/espresso.jpg", "./img/euca.webp", "./img/koala.webp", "./img/latte.jpg", "./img/oj.jpg", "./img/opera.webp", "./img/red.jpg", "./img/sparkle.webp", "./img/sparkling.jpg", "./img/still.jpg", "./img/tea.jpg", "./img/white.jpg", "./img/zoomap.webp"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(async c => {
      await c.addAll(ASSETS);
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
