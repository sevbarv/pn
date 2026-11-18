(()=>{
'use strict';
const types=[
['Культура принадлежности','Традиции, личные связи и ощущение «своих» определяют отношения в коллективе','Какую роль в работе играют принадлежность к группе, сложившиеся обычаи и личная преданность'],
['Культура силы','Решения сосредоточены у руководителя или узкой группы — основа взаимодействия связана с властью и подчинением','Как проявляются централизация решений, конкуренция за расположение руководства и отношение к ошибкам'],
['Культура правил','Работа строится на регламентах, иерархии и предсказуемых процедурах','Насколько устойчивы формальные правила и одинаково ли они применяются к сотрудникам и руководителям'],
['Культура успеха','Главные ориентиры — результат, эффективность и достижение целей','Как в коллективе относятся к конкуренции, личным достижениям и изменению правил ради результата'],
['Культура согласия','Взаимодействие опирается на доверие, взаимную поддержку и учёт разных точек зрения','Как принимаются совместные решения и насколько ценится вклад человека в командную работу'],
['Культура синтеза','Самостоятельность и компетентность помогают гибко объединять усилия под задачи','Как распределяются роли, поддерживается самоорганизация и учитываются взаимосвязи между задачами']
];
const buttons=[...document.querySelectorAll('[data-culture-type]')];const panel=document.getElementById('culture-type-description');
function show(i){if(!Number.isInteger(i)||!types[i])return;buttons.forEach((b,n)=>b.setAttribute('aria-pressed',String(n===i)));types.forEach((_,n)=>{const c=document.getElementById('culture-point-'+n);c.setAttribute('r',n===i?'10':'7');c.setAttribute('fill',n===i?'#0079c2':'white');});panel.replaceChildren();for(const [tag,cls,text] of [['span','eyebrow blue',String(i+1).padStart(2,'0')+' / КУЛЬТУРНЫЙ ПРОФИЛЬ'],['h3','',types[i][0]],['p','',types[i][1]],['span','type-question','Что исследуем'],['p','',types[i][2]]]){const el=document.createElement(tag);if(cls)el.className=cls;el.textContent=text;panel.appendChild(el);}}
buttons.forEach((button,i)=>{button.addEventListener('click',()=>show(i));button.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight'||e.key==='ArrowDown')next=(i+1)%types.length;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')next=(i+types.length-1)%types.length;else return;e.preventDefault();show(next);buttons[next].focus();});});
})();
