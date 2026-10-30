(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const behavior = () => reducedMotion.matches ? 'instant' : 'smooth';
  const areaMap = document.querySelector('#recommended-areas');
  let mapInitialized = false;
  function initializeAreaMap() {
    if (mapInitialized || !areaMap || !window.L) return;
    mapInitialized = true;
    const stage = areaMap.querySelector('.area-map-canvas');
    const options = [...areaMap.querySelectorAll('[data-area]')];
    const popups = [...areaMap.querySelectorAll('[data-popup]')];
    const locations = [
      {lat:25.1850,lng:55.2630,radius:1000,label:'Business Bay'},
      {lat:25.2075,lng:55.3445,radius:950,label:'Creek Harbour'},
      {lat:25.0935,lng:55.1400,radius:750,label:'Dubai Harbour'},
      {lat:25.0555,lng:55.2085,radius:1250,label:'JVC'},
      {lat:25.1138,lng:55.1390,radius:1900,label:'Palm Jumeirah'},
      {lat:25.1972,lng:55.2744,radius:800,label:'Downtown'}
    ];
    const map = L.map(stage, {scrollWheelZoom:false,dragging:!window.matchMedia('(pointer:coarse), (max-width:900px)').matches,zoomControl:false,minZoom:10,maxZoom:17,zoomSnap:.5,zoomDelta:.5,fadeAnimation:!reducedMotion.matches,zoomAnimation:!reducedMotion.matches});
    L.control.zoom({position:'topright',zoomInTitle:'拡大',zoomOutTitle:'縮小'}).addTo(map);
    L.control.scale({position:'bottomleft',imperial:false}).addTo(map);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    // Neutral district labels add context without suggesting additional recommendations.
    [
      ['Dubai Marina',25.073,55.133],['JLT',25.066,55.151],
      ['Al Barsha',25.110,55.204],['Dubai Hills',25.101,55.259],
      ['Jumeirah',25.218,55.248],['Deira',25.271,55.325],
      ['Bur Dubai',25.251,55.298],['Meydan',25.159,55.307],
      ['Al Quoz',25.152,55.225],['Jebel Ali',25.008,55.107],
      ['Mirdif',25.216,55.419],['Al Jaddaf',25.219,55.327]
    ].forEach(([name,lat,lng])=>L.marker([lat,lng],{
      interactive:false,keyboard:false,zIndexOffset:-1000,
      icon:L.divIcon({className:'map-context-label',html:`<span>${name}</span>`,iconSize:[100,16],iconAnchor:[50,8]})
    }).addTo(map));
    const overviewBounds = L.latLngBounds([[25.025,55.102],[25.256,55.380]]);
    const fitOverview = () => map.fitBounds(overviewBounds,{padding:[30,30],animate:false});
    fitOverview();
    let selected = null;
    let ignoreFocus = false;
    let lastTrigger;
    const markers=[];
    const circles=[];
    const positionPopup = () => {};
    const closePopup = (restore=false) => {
      selected=null;
      popups.forEach(p=>{p.hidden=true;});
      options.forEach(o=>o.setAttribute('aria-expanded','false'));
      markers.forEach(m=>{m.getElement()?.classList.remove('is-active');m.getElement()?.setAttribute('aria-expanded','false');});
      circles.forEach(c=>c.setStyle({fillOpacity:.14,weight:1.5}));
      if(restore && lastTrigger){ignoreFocus=true;lastTrigger.focus();ignoreFocus=false;}
    };
    const showArea = (id,trigger,pan=false,activate=false) => {
      selected=String(id);
      if(trigger) lastTrigger=trigger;
      popups.forEach(p=>{p.hidden=p.dataset.popup!==selected;});
      options.forEach(o=>o.setAttribute('aria-expanded',String(o.dataset.area===selected)));
      markers.forEach((m,i)=>{m.getElement()?.classList.toggle('is-active',i===Number(id));m.getElement()?.setAttribute('aria-expanded',String(i===Number(id)));});
      circles.forEach((c,i)=>c.setStyle({fillOpacity:i===Number(id) ? .28 : .14,weight:i===Number(id)?2.5:1.5}));
      if(pan) map.panInside([locations[id].lat,locations[id].lng],{padding:[70,70],animate:!reducedMotion.matches});
      positionPopup();
      if(activate) {
        const popup=popups[Number(id)];
        popup.querySelector('h3').focus({preventScroll:true});
        if(window.matchMedia('(max-width:900px)').matches) popup.scrollIntoView({behavior:behavior(),block:'center'});
      }
    };
    areaMap.classList.add('map-ready','geographic-map');
    closePopup();
    locations.forEach((location,i)=>{
      const center=[location.lat,location.lng];
      const circle=L.circle(center,{bubblingMouseEvents:false,radius:location.radius,color:'#aa8548',weight:1.5,fillColor:'#b89a67',fillOpacity:.14}).addTo(map);
      circles.push(circle);
      circle.on('mouseover',()=>{if(!areaMap.querySelector('.area-map-popup:focus-within'))showArea(i);});
      circle.on('click',()=>showArea(i,markers[i].getElement(),false,true));
      const icon=L.divIcon({className:'geo-area-marker',html:`<span>${String(i+1).padStart(2,'0')}</span><small>${location.label}</small>`,iconSize:[44,44],iconAnchor:[22,22]});
      const marker=L.marker(center,{icon,keyboard:true,title:popups[i].querySelector('h3').textContent,riseOnHover:true}).addTo(map);
      markers.push(marker);
      const element=marker.getElement();
      element.setAttribute('aria-label',popups[i].querySelector('h3').textContent);
      element.setAttribute('aria-controls',`area-popup-${i}`);
      element.setAttribute('aria-expanded','false');
      element.dataset.areaMarker=String(i);
      marker.on('mouseover',()=>{if(!areaMap.querySelector('.area-map-popup:focus-within'))showArea(i,element);});
      marker.on('click',()=>showArea(i,element,false,true));
      element.addEventListener('keydown',event=>{if(event.key===' '){event.preventDefault();showArea(i,element,false,true);}});
    });
    options.forEach(option=>{
      option.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse' && !areaMap.querySelector('.area-map-popup:focus-within'))showArea(option.dataset.area,option);});
      option.addEventListener('click',()=>showArea(option.dataset.area,option,true,true));
    });
    popups.forEach(popup=>{
      popup.querySelector('.map-popup-close').addEventListener('click',()=>closePopup(true));
      popup.querySelector('img').addEventListener('load',positionPopup);
    });
    areaMap.querySelector('.map-reset').addEventListener('click',()=>{closePopup();fitOverview();});
    areaMap.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();closePopup(true);}});
    document.addEventListener('pointerdown',event=>{if(!areaMap.contains(event.target))closePopup();});
    map.on('click',()=>closePopup());
    map.on('move zoom',positionPopup);
    new ResizeObserver(()=>{map.invalidateSize({pan:false});}).observe(stage);
    showArea(0);
    const mapTouch=areaMap.querySelector('.map-touch-toggle');
    mapTouch.addEventListener('click',()=>{
      const enabled=!map.dragging.enabled();
      if(enabled) map.dragging.enable(); else map.dragging.disable();
      stage.classList.toggle('is-interactive',enabled);
      mapTouch.setAttribute('aria-pressed',String(enabled));
      mapTouch.textContent=enabled?'スクロールに戻る':'地図を操作';
    });
  }
  if(areaMap) {
    if('IntersectionObserver' in window) {
      const mapObserver=new IntersectionObserver(entries=>{
        if(entries.some(entry=>entry.isIntersecting)){initializeAreaMap();mapObserver.disconnect();}
      },{rootMargin:'600px'});
      mapObserver.observe(areaMap);
    } else initializeAreaMap();
  }
  const messagePassages = [...document.querySelectorAll('.letter-passage')];
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const messageObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        messageObserver.unobserve(entry.target);
      });
    }, {threshold: 0, rootMargin: '0px 0px -8% 0px'});
    messagePassages.forEach(passage => {
      passage.classList.add('letter-reveal');
      messageObserver.observe(passage);
    });
    reducedMotion.addEventListener('change', event => {
      if (!event.matches) return;
      messageObserver.disconnect();
      messagePassages.forEach(passage => passage.classList.add('is-visible'));
    });
  }
  const header = document.querySelector('#header');
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#mobile-menu');
  const main = document.querySelector('main');
  const footer = document.querySelector('.site-footer');
  const mobileCTA = document.querySelector('#mobile-conversion');
  function closeMenu(returnFocus = false) {
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'メニューを開く');
    document.body.classList.remove('menu-open');
    main.inert = false; footer.inert = false; mobileCTA.inert = false;
    if (returnFocus) toggle.focus();
  }
  toggle.addEventListener('click', () => {
    if (!menu.hidden) { closeMenu(true); return; }
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'メニューを閉じる');
    document.body.classList.add('menu-open');
    main.inert = true; footer.inert = true; mobileCTA.inert = true;
    menu.querySelector('a').focus();
  });
  menu.addEventListener('click', e => {
    const link=e.target.closest('a');
    if(!link) return;
    closeMenu();
    const href=link.getAttribute('href');
    if(href?.startsWith('#')) {
      const target=document.querySelector(href);
      const focusTarget=target?.querySelector('h2') || target;
      if(focusTarget){e.preventDefault();history.pushState(null,'',href);focusTarget.setAttribute('tabindex','-1');focusTarget.focus({preventScroll:true});target.scrollIntoView({behavior:behavior(),block:'start'});}
    }
  });
  document.addEventListener('keydown', e => {
    if (menu.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); closeMenu(true); }
    if (e.key === 'Tab') {
      const focusable = [toggle, ...menu.querySelectorAll('a')];
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  const desktop = window.matchMedia('(min-width: 901px)');
  desktop.addEventListener('change', e => { if (e.matches) closeMenu(); });
  const updateHeader = () => header.classList.toggle('is-fixed', window.scrollY > 100);
  window.addEventListener('scroll', updateHeader, {passive: true});
  updateHeader();
  const firstCTA = document.querySelector('#start');
  // Anchor jumps can skip the first CTA without changing its intersection state.
  // Re-check its position after scrolling so mobile actions still appear.
  let stickyFrame = 0;
  const updateStickyCTA = () => {
    stickyFrame = 0;
    const fullSizeActionVisible=[...document.querySelectorAll('.conversion .button')].some(button=>{
      const rect=button.getBoundingClientRect();return rect.top>80 && rect.bottom<innerHeight-80;
    });
    mobileCTA.hidden = firstCTA.getBoundingClientRect().bottom > 0 || fullSizeActionVisible;
  };
  const scheduleStickyCTA = () => {
    if (!stickyFrame) stickyFrame = requestAnimationFrame(updateStickyCTA);
  };
  window.addEventListener('scroll', scheduleStickyCTA, {passive:true});
  window.addEventListener('resize', scheduleStickyCTA);
  updateStickyCTA();
  // Section navigation is a guide, with one active destination at a time.
  const sectionLinks=[...document.querySelectorAll('.desktop-nav a[href^="#"],.discovery-nav a')];
  const sections=[...new Set(sectionLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean))];
  const updateSectionNav=()=>{
    let current=null;
    sections.forEach(section=>{if(section.getBoundingClientRect().top<innerHeight*.45)current=section.id;});
    sectionLinks.forEach(link=>{if(link.getAttribute('href')===`#${current}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
  };
  let navFrame=0;
  window.addEventListener('scroll',()=>{if(!navFrame)navFrame=requestAnimationFrame(()=>{navFrame=0;updateSectionNav();});},{passive:true});
  updateSectionNav();
  document.querySelectorAll('.gallery').forEach(gallery=>{
    const track=gallery.querySelector('.gallery-track');
    const cards=[...track.children];
    const prev=gallery.querySelector('.prev'),next=gallery.querySelector('.next');
    const status=gallery.querySelector('.gallery-status'),playback=gallery.querySelector('.gallery-playback');
    const selectors=[...gallery.querySelectorAll('[data-property]')];
    const videos=[...gallery.querySelectorAll('.property-video')].map(video=>({video,frame:video.closest('.property-backdrop'),index:cards.indexOf(video.closest('.property-card'))}));
    let active=0,paused=reducedMotion.matches,inView=false,hovering=false,focusWithin=false,manualSelection=false,advanceTimer,scrollTimer;
    const getIndex=()=>{
      const edge=track.getBoundingClientRect().left;
      let nearest=0,distance=Infinity;
      cards.forEach((card,i)=>{const delta=Math.abs(card.getBoundingClientRect().left-edge);if(delta<distance){distance=delta;nearest=i;}});
      return nearest;
    };
    const rotationRunning=()=>inView&&!paused&&!hovering&&!focusWithin&&!manualSelection&&!document.hidden;
    const videoRunning=()=>inView&&!paused&&!document.hidden;
    const sync=()=>{
      clearTimeout(advanceTimer);
      playback.textContent=paused?'再生':'一時停止';
      playback.setAttribute('aria-label',paused?'動画と自動切り替えを再生':'動画と自動切り替えを一時停止');
      status.setAttribute('aria-live',rotationRunning()?'off':'polite');
      videos.forEach(({video,frame,index})=>{
        if(videoRunning()&&active===index){
          if(!video.dataset.sourceReady){
            const source=video.querySelector('source');
            if(window.matchMedia('(max-width:700px)').matches&&source?.dataset.mobileSrc)source.src=source.dataset.mobileSrc;
            video.dataset.sourceReady='true';video.load();
          }
          if(video.paused)video.play().catch(()=>frame.classList.remove('is-playing'));
        }else{video.pause();frame.classList.remove('is-playing');}
      });
      if(rotationRunning())advanceTimer=setTimeout(()=>go((active+1)%cards.length),10000);
    };
    const update=()=>{
      active=getIndex();
      prev.disabled=active===0;next.disabled=active===cards.length-1;
      status.textContent=`${String(active+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
      cards.forEach((card,i)=>{card.inert=i!==active;card.setAttribute('aria-hidden',String(i!==active));});
      selectors.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===active)));
      sync();
    };
    function go(index,manual=false){
      if(manual)manualSelection=true;
      const card=cards[Math.max(0,Math.min(cards.length-1,index))];
      track.scrollTo({left:track.scrollLeft+card.getBoundingClientRect().left-track.getBoundingClientRect().left,behavior:behavior()});
      sync();
    }
    prev.addEventListener('click',()=>go(active-1,true));next.addEventListener('click',()=>go(active+1,true));
    selectors.forEach(button=>button.addEventListener('click',()=>go(Number(button.dataset.property),true)));
    track.addEventListener('keydown',event=>{
      if(event.target!==track||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();go(event.key==='Home'?0:event.key==='End'?cards.length-1:active+(event.key==='ArrowRight'?1:-1),true);
    });
    track.addEventListener('pointerdown',event=>{if(event.pointerType==='touch'){manualSelection=true;sync();}},{passive:true});
    track.addEventListener('scroll',()=>{clearTimeout(scrollTimer);scrollTimer=setTimeout(update,90);},{passive:true});
    playback.addEventListener('click',()=>{paused=!paused;if(!paused)manualSelection=false;sync();});
    gallery.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){hovering=true;sync();}});
    gallery.addEventListener('pointerleave',()=>{hovering=false;sync();});
    gallery.addEventListener('focusin',event=>{focusWithin=true;if(event.target.matches(':focus-visible')&&event.target!==playback)manualSelection=true;sync();});
    gallery.addEventListener('focusout',event=>{if(!gallery.contains(event.relatedTarget)){focusWithin=false;sync();}});
    videos.forEach(({video,frame,index})=>{
      video.addEventListener('playing',()=>{if(videoRunning()&&active===index)frame.classList.add('is-playing');else video.pause();});
      video.addEventListener('error',()=>frame.classList.remove('is-playing'));
    });
    document.addEventListener('visibilitychange',sync);
    reducedMotion.addEventListener('change',event=>{if(event.matches)paused=true;sync();});
    if('IntersectionObserver' in window)new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync();},{threshold:0}).observe(track);else inView=true;
    new ResizeObserver(update).observe(track);
    update();
  });
})();
