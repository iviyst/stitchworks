// Stitchworks offline cache. Change VERSION whenever you upload a new index.html.
const VERSION='stitchworks-gh-v4';
const CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-180.png','icon-maskable-512.png','fabric.jpg','factory-keyart.jpg','grunge-block-height.jpg','grunge-block.jpg','grunge-enamel-height.jpg','grunge-enamel.jpg','grunge-steel-height.jpg','grunge-steel.jpg','grunge-tile-height.jpg','grunge-tile-roughness.jpg','grunge-tile.jpg','wood.jpg','zippa-model.txt','zippa-mr.jpg','zippa-scare.mp4','zippa-skin.jpg'];
const CDN=/^https:\/\/(cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)\//;
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VERSION).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  // pages: network first so new uploads show up, cache as fallback offline
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(VERSION).then(x=>x.put('index.html',c));return res}).catch(()=>caches.match('index.html')));return}
  // same-origin files and the three.js / font CDNs: cache first. Multiplayer traffic is never touched.
  if(u.origin===location.origin||CDN.test(r.url)){e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const c=res.clone();caches.open(VERSION).then(x=>x.put(r,c))}return res})))}
});
