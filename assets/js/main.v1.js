
(function(){
  'use strict';
  var $=function(id){return document.getElementById(id)};

  /* меню */
  var drawer=$('drawer'), burger=$('burger'), closeBtn=$('drawerClose'), lastFocus=null;
  function openD(){ if(!drawer||!burger) return; lastFocus=document.activeElement;
    drawer.classList.add('is-open'); drawer.setAttribute('aria-hidden','false');
    burger.setAttribute('aria-expanded','true'); document.body.style.overflow='hidden';
    var f=drawer.querySelector('a,button'); if(f) f.focus(); }
  function closeD(){ if(!drawer||!burger) return; drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden','true'); burger.setAttribute('aria-expanded','false');
    document.body.style.overflow=''; if(lastFocus&&lastFocus.focus) lastFocus.focus(); }
  if(burger) burger.addEventListener('click',function(){ drawer.classList.contains('is-open')?closeD():openD(); });
  if(closeBtn) closeBtn.addEventListener('click',closeD);
  if(drawer) drawer.addEventListener('click',function(e){ if(e.target.tagName==='A') closeD(); });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&drawer&&drawer.classList.contains('is-open')) closeD();
    if(e.key==='Tab'&&drawer&&drawer.classList.contains('is-open')){
      var f=drawer.querySelectorAll('a,button'), first=f[0], last=f[f.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  window.addEventListener('resize',function(){ if(window.innerWidth>1049&&drawer&&drawer.classList.contains('is-open')) closeD(); });

  /* ---------- планировщик участка ---------- */
  var ITEMS={
    stele:{t:'Памятник из гранита',d:'Стела на цоколе, форма и размер — по проекту'},
    curb:{t:'Цоколь',d:'Основание под стелу, гранит или бетон с облицовкой'},
    fence:{t:'Ограда',d:'Сварная или гранитная, по периметру участка'},
    plitka:{t:'Плитка',d:'Гранитная или тротуарная, с подушкой и уклонами'},
    cvetnik:{t:'Цветник',d:'Гранитный бордюр и грунт под посадку'},
    vaza:{t:'Ваза, лампада',d:'На постаменте или в плите, с креплением'}
  };
  var plan=$('plan');
  function planUpdate(){
    if(!plan) return;
    var on={}, rows=[];
    document.querySelectorAll('.pctrl input[type=checkbox]').forEach(function(cb){
      on[cb.getAttribute('data-el')]=cb.checked;
      if(cb.checked) rows.push('<div class="planout__i"><b>·</b><span>'+ITEMS[cb.getAttribute('data-el')].t+'</span></div>');
    });
    ['stele','curb','fence','plitka','cvetnik','vaza'].forEach(function(k){
      var g=document.querySelector('#plan [data-el="'+k+'"]');
      if(g) g.style.display=on[k]?'':'none';
    });
    var list=$('planlist');
    if(list){
      list.innerHTML = rows.length ? rows.join('')
        : '<div class="planout__i"><b>·</b><span>Отметьте элементы слева: схема участка соберётся сразу</span></div>';
    }
    var wa=$('planwa');
    if(wa){
      var names=Object.keys(ITEMS).filter(function(k){return on[k];}).map(function(k){return ITEMS[k].t;});
      wa.href='https://wa.me/375298533334?text='+encodeURIComponent(
        'Заявка с сайта: благоустройство участка\nСостав: '+(names.length?names.join(', '):'нужна консультация'));
      wa.textContent=names.length?('Отправить состав в WhatsApp ('+names.length+')'):'Написать в WhatsApp';
    }
  }
  if(plan){
    document.querySelectorAll('.pctrl input[type=checkbox]').forEach(function(cb){
      cb.addEventListener('change',planUpdate);
    });
    planUpdate();
  }

  /* ---------- сезоны ухода ---------- */
  var SEASON={
    vesna:{t:'Весна',l:['Снятие зимних укрытий и защитных материалов','Очистка плитки и цоколя от песка и реагентов',
      'Проверка крепления стелы и ограды после морозов','Обновление гравия и подготовка цветника',
      'Посадка цветов, если это оговорено в уходе']},
    leto:{t:'Лето',l:['Полив цветника в засушливые периоды','Прополка и подсадка растений',
      'Мойка памятника и плитки мягким составом','Проверка гравировки и состояния полировки',
      'Подготовка к осенним работам по благоустройству']},
    osen:{t:'Осень',l:['Уборка листвы и растительных остатков','Подготовка участка к зиме',
      'Консервация цветника, укрытие посадок','Проверка водоотведения и уклонов плитки',
      'Финальная уборка перед закрытием сезона']},
    zima:{t:'Зима',l:['Расчистка снега на участке и подходах','Аккуратная уборка без жёсткого скребка по граниту',
      'Контроль состояния ограды и креплений','При необходимости — разовые выезды по заявке',
      'Работа по графику, согласованному с вами']}
  };
  var seasonBox=$('season');
  function paintSeason(key){
    var btns=document.querySelectorAll('.seasons button');
    for(var i=0;i<btns.length;i++) btns[i].setAttribute('aria-pressed', btns[i].getAttribute('data-s')===key?'true':'false');
    var d=SEASON[key]; if(!d||!seasonBox) return;
    seasonBox.innerHTML='<h3>'+d.t+'</h3><span class="mono">что входит в уход</span><ul>'
      +d.l.map(function(x){return '<li>'+x+'</li>';}).join('')+'</ul>';
  }
  if(seasonBox){
    var sb=document.querySelectorAll('.seasons button');
    for(var i=0;i<sb.length;i++) sb[i].addEventListener('click',function(){ paintSeason(this.getAttribute('data-s')); });
    paintSeason('vesna');
  }

  /* ---------- форма ---------- */
  var form=$('lead-form');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var g=function(id){var el=$(id);return el?el.value.trim():''};
      var name=g('lname'), phone=g('lphone'), what=g('lwhat'), msg=g('lmsg'), ok=$('lead-ok');
      if(!name||!phone){ if(ok){ok.textContent='Укажите имя и телефон'; ok.classList.add('on');} return; }
      var text='Заявка с сайта\nИмя: '+name+'\nТелефон: '+phone+'\nВопрос: '+what+(msg?'\nДетали: '+msg:'');
      if(ok){ ok.textContent='Открываем WhatsApp с готовым сообщением…'; ok.classList.add('on'); }
      window.open('https://wa.me/375298533334?text='+encodeURIComponent(text),'_blank');
    });
  }
})();
