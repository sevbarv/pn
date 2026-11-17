'use strict';
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const escapeHTML = s => String(s).replace(/\.\s*$/,'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])).replace(/\n/g,'<br>');
const normalize = s => s.toLocaleLowerCase('ru').replace(/ё/g,'е').trim();

const strategy = (()=>{
if(!$('#bets-list'))return null;
$('#bets-list').innerHTML = CONTENT.bets.map((b,i)=>`<details class="bet" id="bet-${i+1}"><summary><span class="bet-n">0${i+1}</span><span class="bet-label ${b[1]==='Ставка'?'core':''}">${b[1].toUpperCase()}</span><h3>${escapeHTML(b[0])}</h3><span class="plus" aria-hidden="true">+</span></summary><p>${escapeHTML(b[2])}</p></details>`).join('');

const tabs = $('#indicator-tabs');
tabs.innerHTML = CONTENT.indicators.map((p,i)=>`<button role="tab" id="priority-${i}" aria-controls="indicator-panel" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-priority="${i}"><span>0${i+1}</span>${escapeHTML(p.title)}</button>`).join('');
function selectPriority(i,focus = false){
  const p = CONTENT.indicators[i];
  $$('[role=tab]',tabs).forEach((b,n)=>{b.setAttribute('aria-selected',String(n===i));b.tabIndex=n===i?0:-1;});
  const panel=$('#indicator-panel');
  panel.setAttribute('aria-labelledby',`priority-${i}`);
  panel.innerHTML=`<div class="panel-heading"><h3>${escapeHTML(p.title)}</h3><div class="year-labels"><span>2026 · БАЗА</span><span>2030 · ЦЕЛЬ</span></div></div>`+p.metrics.map(m=>`<article class="metric"><div><h4>${escapeHTML(m[0])}</h4>${m[3]?`<small>${escapeHTML(m[3])}</small>`:''}</div><div class="metric-values ${/[А-Яа-я]/.test(m[1]+m[2])?'word':''} ${m[1].length>7?'range':''}"><span><span class="sr-only">База 2026: </span>${escapeHTML(m[1])}</span><span class="metric-arrow" aria-hidden="true">→</span><strong><span class="sr-only">Цель 2030: </span>${escapeHTML(m[2])}</strong></div></article>`).join('');
  if(focus){const b=$(`#priority-${i}`);b.focus();b.scrollIntoView({block:'nearest',inline:'nearest',behavior:'auto'});}
}
selectPriority(0);
tabs.addEventListener('click',e=>{const b=e.target.closest('[data-priority]');if(b)selectPriority(Number(b.dataset.priority));});
tabs.addEventListener('keydown',e=>{
  const n=Number(e.target.dataset.priority);if(!Number.isInteger(n))return;
  let i=n;
  if(e.key==='ArrowDown'||e.key==='ArrowRight')i=(n+1)%CONTENT.indicators.length;
  else if(e.key==='ArrowUp'||e.key==='ArrowLeft')i=(n-1+CONTENT.indicators.length)%CONTENT.indicators.length;
  else if(e.key==='Home')i=0;
  else if(e.key==='End')i=CONTENT.indicators.length-1;
  else return;
  e.preventDefault();selectPriority(i,true);
});
const tabsMedia=matchMedia('(max-width:640px)');
function setOrientation(){tabs.setAttribute('aria-orientation',tabsMedia.matches?'horizontal':'vertical');}
setOrientation();tabsMedia.addEventListener('change',setOrientation);
$('#secondary-rows').innerHTML=CONTENT.secondary.map((r,n)=>{
if(n===12||n===13)return `<tr><th scope="row">${escapeHTML(r[0])}</th><td colspan="4">По результатам исследования корпоративной культуры 2026 года</td><td>${escapeHTML(r[5])}</td></tr>`;
if(n===14)return `<tr><th scope="row">${escapeHTML(r[0])}</th><td colspan="4">Переход от текущего (2026) к целевому (2030) типу</td><td>По группам работников</td></tr>`;
return `<tr>${r.map((s,i)=>i===0?`<th scope="row">${escapeHTML(s)}</th>`:`<td>${escapeHTML(s)}</td>`).join('')}</tr>`;
}).join('');

$('#decisions-list').innerHTML=CONTENT.decisions.map(d=>{
  const iso=d.date.includes('.')?d.date.split('.').reverse().join('-'):'';
  return `<details class="decision" id="decision-${d.id}" data-group="${d.group}"><summary><span class="decision-num">${String(d.id).padStart(2,'0')}</span><span class="decision-title">${escapeHTML(d.title)}</span>${iso?`<time datetime="${iso}">${escapeHTML(d.date)}</time>`:'<span class="no-date">Без срока</span>'}<span class="plus" aria-hidden="true">+</span></summary><div class="decision-content"><p>${escapeHTML(d.text)}</p><dl class="decision-meta"><dt>Ответственный</dt><dd>${d.owner==='-'?'Не указан в протоколе':escapeHTML(d.owner).replace(/\n/g,'<br>')}</dd></dl></div></details>`;
}).join('');
let decisionFilter='all';
function filterDecisions(){
  const q=normalize($('#decision-query').value);let count=0;
  CONTENT.decisions.forEach(d=>{
    const show=(decisionFilter==='all'||d.group===decisionFilter)&&normalize([d.title,d.text,d.owner,d.date].join(' ')).includes(q);
    $(`#decision-${d.id}`).hidden=!show;if(show)count++;
  });
  $('#decision-empty').hidden=count>0;
  $('#decision-count').textContent=`Показано поручений: ${count} из ${CONTENT.decisions.length}`;
}
$$('.filter').forEach(b=>b.addEventListener('click',()=>{
  decisionFilter=b.dataset.filter;
  $$('.filter').forEach(f=>{const selected=f===b;f.classList.toggle('active',selected);f.setAttribute('aria-pressed',String(selected));});
  filterDecisions();
}));
$('#decision-query').addEventListener('input',filterDecisions);filterDecisions();
function resetDecisionFilter(){decisionFilter='all';$('#decision-query').value='';$$('.filter').forEach(b=>{const on=b.dataset.filter==='all';b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});filterDecisions();}


return {selectPriority,resetDecisionFilter};
})();
const menu=$('#mobile-nav'), menuButton=$('.menu-toggle');
function closeMenu(){menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Открыть меню');}
menuButton.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');});
$$('a',menu).forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){closeMenu();menuButton.focus();}});
matchMedia('(min-width:961px)').addEventListener('change',e=>{if(e.matches)closeMenu();});

const searchIndex=[
{title:'Управление персоналом в стратегии',text:'Люди условия труда талант карьера самореализация ТОП-10 hh.ru среднемесячная заработная плата 211,6 300',href:'index.html#hr-strategy',type:'Стратегия 2027–2030'},
{title:'Стратегия развития 2027–2030',text:'Миссия видение ценности ориентиры',href:'strategy.html#strategy',type:'Направление HR-сессии'},
{title:'Корпоративная культура — материалы будут добавлены',text:'Ценности работа команда культура',href:'culture.html',type:'Направление HR-сессии'},
{title:'КЭДО — материалы будут добавлены',text:'Кадровый электронный документооборот',href:'kedo.html',type:'Направление HR-сессии'},
{title:'Обучение и развитие — материалы будут добавлены',text:'Компетенции профессиональный рост персонала',href:'learning.html',type:'Направление HR-сессии'},
{title:'Люди и культура в стратегии',text:'Топ-команда администрация филиалы культура успеха творчества согласия правила преданности вовлеченность лояльность',href:'index.html#hr-culture',type:'Презентация стратегии'},
{title:'Презентация стратегии · PDF',text:'Скачать приложение стратегия документ',href:'strategy.html#documents',type:'Материалы стратегии'},
{title:'Протокол стратегической сессии · DOCX',text:'Скачать протокол 8 9 октября 2026',href:'strategy.html#documents',type:'Дополнения к стратегии'},
...CONTENT.bets.map((b,i)=>({title:b[0],text:b[2],href:`strategy.html#bet-${i+1}`,type:'Стратегические ставки'})),
...CONTENT.indicators.flatMap((p,i)=>p.metrics.map(m=>({title:m[0],text:[p.title,...m].join(' '),href:`strategy.html?priority=${i}#indicators`,priority:i,type:'Показатели стратегии'}))),
...CONTENT.secondary.map(r=>({title:r[0],text:r.join(' '),href:'strategy.html?secondary=1#indicators',secondary:true,type:'Дополнительные показатели стратегии'})),
...CONTENT.decisions.map(d=>({title:d.title,text:[d.text,d.owner,d.date].join(' '),href:`strategy.html#decision-${d.id}`,type:`Протокол · Поручение ${String(d.id).padStart(2,'0')} · ${d.date==='-'?'Без срока':d.date}`}))
];
const dialog=$('#search-dialog');let resultItems=[];
function openSearch(){closeMenu();if(!dialog.open)dialog.showModal();document.body.style.overflow='hidden';$('#global-search').focus();}
function closeSearch(){dialog.close();}
$$('.search-toggle').forEach(b=>b.addEventListener('click',openSearch));$('.close-search').addEventListener('click',closeSearch);
dialog.addEventListener('close',()=>{document.body.style.overflow='';});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeSearch();}});
$('#global-search').addEventListener('input',()=>{
  const words=normalize($('#global-search').value).split(/\s+/).filter(Boolean);
  resultItems=words.length?searchIndex.filter(r=>words.every(w=>normalize(r.title+' '+r.text).includes(w))):[];
  $('#search-status').textContent=!words.length?'Введите слово или фразу':resultItems.length?`Найдено: ${resultItems.length}`:'Ничего не найдено — попробуйте другое слово';
  $('#search-results').innerHTML=resultItems.map((r,i)=>`<a class="search-result" href="${r.href}" data-result="${i}"><small>${escapeHTML(r.type)}</small><strong>${escapeHTML(r.title)}</strong></a>`).join('');
});
$('#search-results').addEventListener('click',e=>{
const a=e.target.closest('[data-result]');if(!a)return;const r=resultItems[Number(a.dataset.result)];const target=new URL(r.href,location.href);const current=new URL(location.href);closeSearch();
if(target.pathname===current.pathname){e.preventDefault();history.pushState(null,'',target.pathname+target.search+target.hash);applyStrategyLocation();requestAnimationFrame(()=>revealHash(target.hash,true));}
});
document.addEventListener('keydown',e=>{const editing=/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)||document.activeElement.isContentEditable;if((e.key==='k'&&(e.ctrlKey||e.metaKey))||(e.key==='/'&&!editing)){e.preventDefault();openSearch();}});
function revealHash(hash,focus=false){
 if(!hash||hash==='#')return;const target=document.getElementById(hash.slice(1));if(!target)return;
 if(target.matches('.decision'))strategy?.resetDecisionFilter();
 if(target.tagName==='DETAILS')target.open=true;
 if(focus){const focusTarget=target.tagName==='DETAILS'?$('summary',target):target;if(!focusTarget.hasAttribute('tabindex')&&focusTarget.tagName!=='SUMMARY')focusTarget.tabIndex=-1;focusTarget.focus({preventScroll:true});}
 target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});
}
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(a&&!a.matches('.search-result')){const hash=a.getAttribute('href');if(/^#(decision-|bet-)/.test(hash)){e.preventDefault();history.replaceState(null,'',hash);revealHash(hash,true);}}});
window.addEventListener('hashchange',()=>revealHash(location.hash));
function applyStrategyLocation(){if(!strategy)return;const params=new URLSearchParams(location.search);const value=params.get('priority');if(value!==null&&/^\d+$/.test(value)&&Number(value)<CONTENT.indicators.length)strategy.selectPriority(Number(value));if(params.get('secondary')==='1')$('#indicators .secondary-indicators').open=true;}
applyStrategyLocation();
if(location.hash)requestAnimationFrame(()=>revealHash(location.hash));
window.addEventListener('popstate',()=>{applyStrategyLocation();revealHash(location.hash);});
const sectionLinks=$$('.section-nav a');
const activeObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){sectionLinks.forEach(a=>{const on=a.hash==='#'+entry.target.id;a.classList.toggle('current',on);if(on)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}}},{rootMargin:'-155px 0px -55% 0px',threshold:0});
['strategy','bets','indicators','decisions','documents'].forEach(id=>{const el=$('#'+id);if(el)activeObserver.observe(el);});
