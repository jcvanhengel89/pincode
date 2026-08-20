const CACHE_NAME = "pincode-pwa-v3";
const REFRESH_SCRIPT = "./refresh.js?v=3";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  REFRESH_SCRIPT,
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));

    await self.clients.claim();

    // Herlaad geopende Pincode-vensters één keer zodra een nieuwe worker actief is.
    // Daardoor krijgt ook een eerste bezoek meteen de nieuwste UI, zonder handmatig cache wissen.
    const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    await Promise.all(clients.map(client => {
      try {
        return client.navigate(client.url);
      } catch {
        return Promise.resolve();
      }
    }));
  })());
});

self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

async function withRefreshControl(response) {
  if (!response) return response;
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  let html = await response.text();
  if (!html.includes("refresh.js")) {
    html = html.replace("</body>", `<script src="${REFRESH_SCRIPT}"></script>\n</body>`);
  }

  const headers = new Headers(response.headers);
  headers.set("content-type", "text/html; charset=utf-8");
  headers.delete("content-length");

  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const request = event.request;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    try {
      // Online: altijd eerst de nieuwste versie ophalen.
      const response = await fetch(request, { cache: "no-store" });
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      }
      return request.mode === "navigate" ? withRefreshControl(response) : response;
    } catch (error) {
      // Offline: terugvallen op de laatst opgeslagen versie.
      let cached = await caches.match(request);
      if (!cached && request.mode === "navigate") {
        cached = await caches.match("./index.html");
      }
      if (cached) {
        return request.mode === "navigate" ? withRefreshControl(cached) : cached;
      }
      throw error;
    }
  })());
});
