const VERSION = "crew-registry-__APP_VERSION__";
const SHELL_CACHE = `${VERSION}-shell`;
const STATIC_CACHE = `${VERSION}-static`;
const PRECACHE_URLS = __PRECACHE_URLS__;
const MAX_SAVED_PAGES = 30;

async function trimSavedPages(cache) {
  const keys = await cache.keys();
  const pages = keys.filter((request) => request.mode === "navigate");
  while (pages.length > MAX_SAVED_PAGES) {
    await cache.delete(pages.shift());
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter((name) => name.startsWith("crew-registry-") && ![SHELL_CACHE, STATIC_CACHE].includes(name))
      .map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(SHELL_CACHE);
          await cache.put(request, response.clone());
          await trimSavedPages(cache);
          if (url.pathname === "/") await cache.put("/index.html", response.clone());
        }
        return response;
      } catch {
        return (await caches.match(request)) || (await caches.match("/offline.html")) || Response.error();
      }
    })());
    return;
  }

  const isStatic = /\.(?:js|css|svg|png|jpg|jpeg|webp|ico|woff2?)$/i.test(url.pathname)
    || url.pathname.endsWith(".webmanifest");
  if (!isStatic) return;

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(STATIC_CACHE);
        await cache.put(request, response.clone());
      }
      return response;
    } catch {
      return Response.error();
    }
  })());
});

