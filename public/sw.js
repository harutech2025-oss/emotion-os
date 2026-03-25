const CACHE_NAME = "emotion-os-v1";

const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/apple-touch-icon.png",
  "/icon-48x48.png",
  "/icon-72x72.png",
  "/icon-96x96.png",
  "/icon-120x120.png",
  "/icon-152x152.png",
  "/icon-180x180.png",
  "/icon-192x192.png",
  "/icon-512x512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // GET 요청만 처리
  if (request.method !== "GET") return;

  // 페이지 이동 요청: 네트워크 우선, 실패하면 캐시의 "/" 반환
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/"))
    );
    return;
  }

  const url = new URL(request.url);

  // 같은 출처 요청만 캐시 처리
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;

        return fetch(request).then((response) => {
          // 정상 응답만 캐시에 저장
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        });
      })
    );
  }
});
