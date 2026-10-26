'use strict';
document.documentElement.classList.add('js');
const menu = document.querySelector('.menu-toggle');
const nav = document.getElementById('main-nav');
function closeMenu(restoreFocus=false){menu?.setAttribute('aria-expanded','false');nav?.classList.remove('is-open');if(restoreFocus)menu?.focus();}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>closeMenu()));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true')closeMenu(true);});
const form=document.getElementById('word-form');
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
