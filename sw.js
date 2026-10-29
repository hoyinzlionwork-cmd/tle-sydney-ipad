/* 離線快取：連線時走網路（永遠拿最新版並更新快取），離線時用裝置上的快取 */
const CACHE = "tle-syd-v15";
const ASSETS = ["./", "./index.html", "./go.html", "./app.js", "./manifest.json", "./icon.png", "./map.html", "./places.js", "./img/base.webp", "./img/map-qr.png", "./img/icons/bird.webp", "./img/icons/capybara.webp", "./img/icons/cassowary.webp", "./img/icons/dingo.webp", "./img/icons/echidna.webp", "./img/icons/emu.webp", "./img/icons/frog.webp", "./img/icons/goat.webp", "./img/icons/gorilla.webp", "./img/icons/kangaroo.webp", "./img/icons/koala.webp", "./img/icons/lemur.webp", "./img/icons/monkey.webp", "./img/icons/parrot.webp", "./img/icons/pelican.webp", "./img/icons/penguin.webp", "./img/icons/platypus.webp", "./img/icons/quokka.webp", "./img/icons/rabbit.webp", "./img/icons/seal.webp", "./img/icons/snake.webp", "./img/icons/spider.webp", "./img/icons/tasdevil.webp", "./img/icons/tortoise.webp", "./img/icons/wombat.webp", "./img/icons/redpanda.webp", "./img/icons/otters.webp", "./img/icons/binturong.webp", "./img/icons/rhino.webp", "./img/icons/tiger.webp", "./img/icons/meerkat.webp", "./img/icons/giraffe.webp", "./img/icons/zebra.webp", "./img/icons/lion.webp", "./img/icons/chimp.webp", "./img/icons/fennec.webp", "./img/icons/waterbuffalo.webp", "./img/icons/pygmyhippo.webp", "./img/icons/sunbear.webp",
  "./img/kv/bg.jpg", "./img/kv/title.png", "./img/kv/board.png", "./img/kv/sub.png", "./img/kv/opera.webp", "./img/kv/crux.webp", "./img/kv/logo.png", "./img/kv/mark.png", "./img/kv/star.png",
  "./img/espresso.jpg", "./img/latte.jpg", "./img/oj.jpg", "./img/red.jpg", "./img/sparkling.jpg", "./img/still.jpg", "./img/tea.jpg", "./img/white.jpg"];

/* 安裝時直接向伺服器拿（cache:"reload"），不經瀏覽器 HTTP 快取，才不會把 GitHub Pages 10 分鐘內的舊檔裝進新版快取 */
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(async c => {
      await c.addAll(ASSETS.map(u => new Request(u, { cache: "reload" })));
    }).then(() => self.skipWaiting())
  );
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
/* 連線時：HTML／JS／JSON 一律先跟伺服器確認是不是最新（cache:"no-cache"，沒變就 304，很省），其餘走預設；離線時用快取。
 * 快取鍵去掉 t=（QR 入口帶的時間戳），不然每次掃都多存一份 */
const FRESH = /\.(html|js|json)(\?|$)|\/$/;
const keyOf = req => { const u = new URL(req.url); u.searchParams.delete("t"); return u.href; };
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const sameOrigin = new URL(e.request.url).origin === location.origin;
  const fresh = e.request.mode === "navigate" || (sameOrigin && FRESH.test(e.request.url));
  e.respondWith(
    fetch(fresh ? new Request(e.request, { cache: "no-cache" }) : e.request).then(res => {
      if (res.ok && sameOrigin) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(keyOf(e.request), copy)); }
      return res;
    }).catch(() =>
      caches.match(keyOf(e.request), { ignoreSearch: true }).then(hit => hit || caches.match("./index.html"))
    )
  );
});
