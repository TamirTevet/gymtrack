const CACHE='gymtrack-v3';
self.addEventListener('install', e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./manifest.webmanifest'])));});
self.addEventListener('activate', e=>{e.waitUntil((async()=>{
  const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
})());});
self.addEventListener('fetch', e=>{
  const req=e.request;
  const isHTML=req.mode==='navigate'||(req.headers.get('accept')||'').includes('text/html');
  if(isHTML){
    e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',cp));return r;})
      .catch(()=>caches.match('./index.html').then(r=>r||caches.match('./'))));
  } else {
    e.respondWith(caches.match(req).then(r=>r||fetch(req)));
  }
});
self.addEventListener('notificationclick', e=>{e.notification.close();e.waitUntil((async()=>{
  const cs=await clients.matchAll({type:'window',includeUncontrolled:true});
  for(const c of cs){if('focus'in c)return c.focus();}
  if(clients.openWindow)return clients.openWindow('./');
})());});
