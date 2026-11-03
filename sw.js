// Service worker do Painel MBFT. Versão gerada pelo build: 9c96600a1e-2
const CACHE = 'mbft-9c96600a1e-2';
const ARQUIVOS = ['./', 'index.html', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png'];

// instalação: guarda todos os arquivos do app, sempre da rede ('reload'): sem isso o cache HTTP
// do navegador pode entregar a versão anterior, que ficaria guardada sob a versão nova
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(ARQUIVOS.map(u => new Request(u, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});

// ativação: apaga as versões antigas guardadas
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith('mbft-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// cada pedido: entrega o que está guardado; se não houver, busca na rede
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request).catch(() => caches.match('index.html')))
  );
});
