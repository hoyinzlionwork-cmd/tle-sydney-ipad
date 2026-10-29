/* 離線快取：連線時走網路（永遠拿最新版並更新快取），離線時用裝置上的快取 */
const CACHE = "tle-syd-v12";
const ASSETS = ["./", "./index.html", "./app.js", "./manifest.json", "./icon.png", "./map.html", "./places.js", "./img/base.webp", "./img/map-qr.png", "./img/icons/bird.webp", "./img/icons/capybara.webp", "./img/icons/cassowary.webp", "./img/icons/dingo.webp", "./img/icons/echidna.webp", "./img/icons/emu.webp", "./img/icons/frog.webp", "./img/icons/goat.webp", "./img/icons/gorilla.webp", "./img/icons/kangaroo.webp", "./img/icons/koala.webp", "./img/icons/lemur.webp", "./img/icons/monkey.webp", "./img/icons/parrot.webp", "./img/icons/pelican.webp", "./img/icons/penguin.webp", "./img/icons/platypus.webp", "./img/icons/quokka.webp", "./img/icons/rabbit.webp", "./img/icons/seal.webp", "./img/icons/snake.webp", "./img/icons/spider.webp", "./img/icons/tasdevil.webp", "./img/icons/tortoise.webp", "./img/icons/wombat.webp",
  "./img/kv/bg.jpg", "./img/kv/title.png", "./img/kv/board.png", "./img/kv/sub.png", "./img/kv/opera.webp", "./img/kv/crux.webp", "./img/kv/logo.png", "./img/kv/mark.png", "./img/kv/star.png",
  "./img/espresso.jpg", "./img/latte.jpg", "./img/oj.jpg", "./img/red.jpg", "./img/sparkling.jpg", "./img/still.jpg", "./img/tea.jpg", "./img/white.jpg"];

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
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() =>
      caches.match(e.request, { ignoreSearch: true }).then(hit => hit || caches.match("./index.html"))
    )
  );
});
