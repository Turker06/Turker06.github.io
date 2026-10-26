'use strict';
document.documentElement.classList.add('js');
const menu = document.querySelector('.menu-toggle');
const nav = document.getElementById('main-nav');
function closeMenu(restoreFocus=false){menu?.setAttribute('aria-expanded','false');nav?.classList.remove('is-open');if(restoreFocus)menu?.focus();}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>closeMenu()));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true')closeMenu(true);});
const form=document.getElementById('word-form');
// Image links remain useful without JavaScript; the dialog adds keyboard-friendly inspection.
const shots=[...document.querySelectorAll('a[data-lightbox]')];
if(shots.length){
 const dialog=document.createElement('dialog');dialog.className='lightbox';dialog.setAttribute('aria-label','Görseli büyüt');
 dialog.innerHTML='<div class="lightbox-bar"><p>GÖRSEL GALERİSİ <span class="lightbox-count"></span></p><button type="button" class="lightbox-close" aria-label="Görseli kapat">Kapat ×</button></div><img class="lightbox-image" alt=""><div class="lightbox-bottom"><button type="button" class="lightbox-prev" aria-label="Önceki görsel">←</button><p class="lightbox-caption" role="status" aria-live="polite"></p><button type="button" class="lightbox-next" aria-label="Sonraki görsel">→</button></div>';
 document.body.append(dialog);
 let group=[],position=0,trigger=null,previousOverflow='';
 const picture=dialog.querySelector('img'),caption=dialog.querySelector('.lightbox-caption'),counter=dialog.querySelector('.lightbox-count');
 const previous=dialog.querySelector('.lightbox-prev'),next=dialog.querySelector('.lightbox-next');
 function render(){const a=group[position];picture.src=a.href;picture.alt=a.querySelector('img')?.alt||'';caption.textContent=a.dataset.caption||picture.alt;counter.textContent=' · '+(position+1)+' / '+group.length;previous.disabled=next.disabled=group.length<2;}
 function step(n){position=(position+n+group.length)%group.length;render();}
 for(const a of shots)a.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();trigger=a;group=shots.filter(s=>s.dataset.lightbox===a.dataset.lightbox);position=group.indexOf(a);render();previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();dialog.querySelector('.lightbox-close').focus();});
 dialog.querySelector('.lightbox-close').addEventListener('click',()=>dialog.close());
 previous.addEventListener('click',()=>step(-1));next.addEventListener('click',()=>step(1));
 dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();step(-1);}if(e.key==='ArrowRight'){e.preventDefault();step(1);}});
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;trigger?.focus();});
}
for(const button of document.querySelectorAll('[data-gallery-prev],[data-gallery-next]'))button.addEventListener('click',()=>{const backward=button.hasAttribute('data-gallery-prev');const gallery=document.getElementById(backward?button.dataset.galleryPrev:button.dataset.galleryNext);gallery?.scrollBy({left:gallery.clientWidth*(backward?-.8:.8),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});});
if(form){
 const input=document.getElementById('word');
 const status=document.getElementById('word-status');
 const progress=document.getElementById('progress');
 const cells=[...document.querySelectorAll('#found-words li')];
 const targets=['AL','EL','EK','KALE'];
 const found=new Set();
 const say=message=>{status.textContent=message;};
 form.addEventListener('submit',event=>{
  event.preventDefault();
  const word=input.value.trim().toLocaleUpperCase('tr-TR');
  if(!word){say('Önce bir kelime yaz.');input.focus();return;}
  if(found.has(word)){say(word+' zaten bulundu. Diğer hedefleri düşün.');input.select();return;}
  const letters=[...word];
  if(letters.some(c=>!'KALE'.includes(c))||new Set(letters).size!==letters.length){say('Yalnızca K, A, L, E harflerini kullan; her harf bir kez kullanılabilir.');input.select();return;}
  const i=targets.indexOf(word);
  if(i===-1){say('Bu alıştırmanın dört hedefinden biri değil. Bu, yazdığın sözcüğün Türkçede yanlış olduğu anlamına gelmez.');input.select();return;}
  found.add(word);cells[i].textContent=word+' ✓';cells[i].classList.add('found');progress.textContent=found.size+' / 4 bulundu';
  say(found.size===4?'Dört hedefi de buldun! AL, EL, EK ve KALE. Başlangıç harfini değiştirmek yeni olasılıkları görmene yardımcı oldu.':word+' bulundu. '+(4-found.size)+' hedef kaldı.');input.value='';input.focus();
 });
 document.getElementById('reset-puzzle').addEventListener('click',()=>{found.clear();cells.forEach((cell,i)=>{cell.textContent=(i===3?'4':'2')+' harf · hedef '+(i+1);cell.classList.remove('found');});progress.textContent='0 / 4 bulundu';input.value='';say('Alıştırma sıfırlandı. İki harfli üç kelime ve dört harfli bir kelime arıyoruz.');input.focus();});
}
