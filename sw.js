const CACHE_NAME = 'matrezan-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// Instalação: guarda os ficheiros estruturais no cache do celular
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Ativação: limpa caches antigos se você atualizar a versão
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
});

// Intercepta as requisições
self.addEventListener('fetch', event => {
  // Ignora a chamada da planilha do Google para garantir que os dados venham sempre frescos
  if (event.request.url.includes('script.google.com')) {
      return;
  }
  
  // Para o resto (layout), tenta usar a rede; se falhar (offline), usa o cache
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});