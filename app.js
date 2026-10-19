/* 導領e化平台 · 雪梨董事會 領隊 iPad App
 * 純前端 PWA：載入一次後可完全離線使用，不連任何 API、無後端。
 * 四個情境：喜鳳台電子酒單／Rockpool 飲品點選／Taronga Zoo 無尾熊紀念照／Taronga Zoo 園區地圖
 * 標示「待補」「示意」的內容請於「設定」頁或下方 CONFIG 填入實際資料。 */
"use strict";

/* ============================================================ ICONS */
const P = {
  back:'<path d="M14.5 5.5 8 12l6.5 6.5"/>',
  chev:'<path d="M9.5 5.5 16 12l-6.5 6.5"/>',
  wine:'<path d="M8 3h8l-.6 6.2a3.4 3.4 0 0 1-6.8 0z"/><path d="M12 12.6V20M8.5 20h7"/>',
  cup:'<path d="M6 8h11v6a5 5 0 0 1-10 0z"/><path d="M17 9h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M8 4c0 1-.8 1-.8 2M11.5 4c0 1-.8 1-.8 2"/>',
  camera:'<path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.2"/>',
  film:'<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 5v14M16 5v14M4 9h4M4 15h4M16 9h4M16 15h4"/>',
  map:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/>',
  share:'<path d="M12 15V4m0 0-3.5 3.5M12 4l3.5 3.5"/><path d="M5 12v8h14v-8"/>',
  trash:'<path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13"/>',
  pen:'<rect x="5" y="4" width="14" height="16" rx="2"/><path d="m9 14 5.5-5.5 1.5 1.5L10.5 15.5 8.7 16z"/>',
  team:'<circle cx="9" cy="8.5" r="2.6"/><path d="M4 19c.7-3.2 3-4.5 5-4.5s4.3 1.3 5 4.5"/><circle cx="16.5" cy="9" r="2.1"/><path d="M15.5 14.7c2 .2 3.9 1.4 4.5 4.3"/>',
  building:'<path d="M4 20V9l8-5 8 5v11"/><path d="M9 20v-6h6v6"/><path d="M4 20h16"/>',
  photo:'<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m4 17 5-4 3 2.5 3-3.5 5 5"/>',
  check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  x:'<path d="M6 6l12 12M18 6 6 18"/>',
};
const ic=(n,s)=>`<svg class="ic" viewBox="0 0 24 24" style="font-size:${s||18}px">${P[n]||""}</svg>`;
const STAR='<svg class="st" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 14 10 22 12 14 14 12 22 10 14 2 12 10 10Z" fill="currentColor"/></svg>';

/* ============================================================ 主視覺「星引南十字」共用圖形
 * 深藍星空、南十字座、一條細弧線、歌劇院帆影線稿、虹彩微光。
 * 首頁 hero、各頁頁首、主磁磚與紀念框都呼叫同一個 kvSvg()，風格才會一致。 */
function seeded(seed){ let s=(seed>>>0)||1; return ()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }
const CRUX=[[0,-1],[0.12,1],[-0.78,-0.08],[0.7,-0.32],[0.36,0.3]];   /* Gacrux、Acrux、Mimosa、δ Cru、ε Cru 的相對位置 */
const f1=v=>(+v).toFixed(1);
function sparkle(id,x,y,r,a=1){
  return `<path d="M${f1(x)} ${f1(y-r)} L${f1(x+r*.2)} ${f1(y-r*.2)} L${f1(x+r)} ${f1(y)} L${f1(x+r*.2)} ${f1(y+r*.2)} L${f1(x)} ${f1(y+r)} L${f1(x-r*.2)} ${f1(y+r*.2)} L${f1(x-r)} ${f1(y)} L${f1(x-r*.2)} ${f1(y-r*.2)}Z" fill="#fff" fill-opacity="${a}"/>`
       + `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r*1.7)}" fill="url(#${id}-glow)" opacity="${(a*.9).toFixed(2)}"/>`;
}
function operaSvg({x,y,s,a=.75,fill="#0A1F5C",fillA=.28}){ /* 歌劇院帆影線稿：四片帆由左至右漸高，細輪廓＋帆面肋線；帆面填色依底色深淺傳入 */
  const shells=[[0,.9,.55],[.42,1.05,.8],[.98,1.15,1],[1.78,.95,.72]];
  let g=`<path d="M${f1(x-s*.3)} ${f1(y)} H${f1(x+s*3.1)}" stroke="#fff" stroke-opacity="${(a*.6).toFixed(2)}" stroke-width="${(s*.006).toFixed(2)}" fill="none"/>`;
  shells.forEach(([dx,w,h])=>{
    const X=x+dx*s, W=w*s, H=h*s, ax=X+W*.66, ay=y-H;
    const d=`M${f1(X)} ${f1(y)} Q${f1(X+W*.12)} ${f1(y-H*.72)} ${f1(ax)} ${f1(ay)} Q${f1(X+W*.84)} ${f1(y-H*.62)} ${f1(X+W)} ${f1(y)}Z`;
    let rib=""; for(let k=1;k<6;k++) rib+=`M${f1(ax)} ${f1(ay)} L${f1(X+W*k/6)} ${f1(y)} `;
    g+=`<path d="${d}" fill="${fill}" fill-opacity="${fillA}" stroke="#fff" stroke-opacity="${a}" stroke-width="${(s*.013).toFixed(2)}" stroke-linejoin="round"/>`
     + `<path d="${rib}" fill="none" stroke="#fff" stroke-opacity="${(a*.45).toFixed(2)}" stroke-width="${(s*.005).toFixed(2)}"/>`;
  });
  return `<g>${g}</g>`;
}
/* o：id（同頁多個 svg 時避免漸層 id 撞名）、bg（false＝不畫底色，交給 CSS）、stars、seed、starBand（星星只分布在上方比例）、k（線條粗細倍率）、
 *    arc（弧線 path d）、crux {x,y,s}、opera {x,y,s,a}、flare [[x,y,r,color,opacity]]、blur、diag（底色斜向） */
function kvSvg(W,H,o={}){
  const id=o.id||"kv", rnd=seeded(o.seed||7), n=o.stars??Math.round(W*H/7000), k=o.k||1;
  let g=o.bg===false?"":`<rect width="${W}" height="${H}" fill="url(#${id}-sky)"/>`;
  (o.flare||[]).forEach(([fx,fy,fr,c,a])=>{ g+=`<circle cx="${fx}" cy="${fy}" r="${fr}" fill="${c}" opacity="${a}" filter="url(#${id}-blur)" style="mix-blend-mode:screen"/>`; });
  /* 星空兩族：多數細星（r 0.35–0.9）＋少數亮星（r 1.4–2.2 帶光暈），才有縱深 */
  const band=o.starBand??1, nf=Math.round(n*.85);
  for(let i=0;i<n;i++){ const x=rnd()*W, y=rnd()*H*band, bright=i>=nf;
    const r=(bright?1.4+rnd()*.8:0.35+rnd()*.55)*k, a=bright?0.7+rnd()*0.3:0.2+rnd()*0.35;
    if(bright) g+=`<circle cx="${f1(x)}" cy="${f1(y)}" r="${(r*1.6).toFixed(2)}" fill="url(#${id}-glow)" opacity=".25"/>`;
    g+=`<circle cx="${f1(x)}" cy="${f1(y)}" r="${r.toFixed(2)}" fill="#fff" fill-opacity="${a.toFixed(2)}"/>`; }
  if(o.arc) g+=`<path d="${o.arc}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="${(k*1.1).toFixed(2)}" stroke-linecap="round"/>`;
  if(o.crux){ const c=o.crux, p=CRUX.map(([px,py])=>[c.x+px*c.s,c.y+py*c.s]);
    g+=`<path d="M${f1(p[0][0])} ${f1(p[0][1])} L${f1(p[1][0])} ${f1(p[1][1])} M${f1(p[2][0])} ${f1(p[2][1])} L${f1(p[3][0])} ${f1(p[3][1])}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="${(c.s*.012).toFixed(2)}"/>`;
    p.forEach((q,i)=>{ g+=sparkle(id,q[0],q[1],(i===4?.035:i===1?.075:.06)*c.s); }); }
  if(o.opera) g+=operaSvg(o.opera);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs><linearGradient id="${id}-sky" x1="0" y1="0" x2="${o.diag?1:0}" y2="1"><stop offset="0" stop-color="#0A1F5C"/><stop offset=".6" stop-color="#1C3F8F"/><stop offset="1" stop-color="#3D6CC4"/></linearGradient>
<radialGradient id="${id}-glow"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<filter id="${id}-blur" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${o.blur||40}"/></filter></defs>${g}</svg>`;
}
/* 頁首用：只有星星、一條弧線、右側小南十字；底色由 CSS 漸層負責 */
const skySvg=(id,o={})=>kvSvg(900,120,Object.assign({id,bg:false,stars:80,seed:3,arc:"M-20 112 C 240 10, 620 -14, 930 76",crux:{x:842,y:58,s:30}},o)).replace("<svg ",'<svg class="sky" ');
const probe=src=>new Promise(res=>{ if(!src) return res(null); const im=new Image(); im.onload=()=>res(im); im.onerror=()=>res(null); im.src=src; });

/* ============================================================ CONFIG（待補處不自行填） */
const CONFIG = {
  tour:   "雪梨董事會",
  title:  "星引南十字",          /* 本次董事會主視覺標題（來自主視覺稿） */
  kicker: "2026 董事會 OUTING",
  sub:    "Sydney + Melbourne",
  dates:  "",                   /* 出團日期，例 "2026/xx/xx – xx/xx"，待補 */
  logo:   "",                   /* 雄獅旅遊 Logo，待補：去背 PNG 放到 app/img/logo.png 後把這裡填 "img/logo.png"，頁首與紀念照就會帶入；空白＝不印 */
  kv:     "",                   /* 主視覺原稿，待補：放到 app/img/kv.jpg 後填 "img/kv.jpg"，首頁 hero 會改用原稿當底圖；空白＝用程式重現的星空 */
  zooLine:"Taronga Zoo, Sydney",/* 紀念照第二行固定字樣 */
};

/* 以下三份清單皆可在「設定」頁直接修改，不必改程式 */
const DEFAULT_GUESTS = ["董事 A（示意）","董事 B（示意）","董事 C（示意）","董事 D（示意）"].join("\n");

/* 飲品：中文｜English｜備註（可空）｜圖檔（可空；示意圖為 AI 生成，正式照片待 Rockpool 提供） */
const DEFAULT_DRINKS = `氣泡水｜Sparkling Water｜｜img/sparkling.jpg
礦泉水｜Still Water｜｜img/still.jpg
柳橙汁｜Orange Juice｜｜img/oj.jpg
白酒｜White Wine｜｜img/white.jpg
紅酒｜Red Wine｜｜img/red.jpg
義式濃縮｜Espresso｜｜img/espresso.jpg
拿鐵｜Latte｜｜img/latte.jpg
熱茶｜Tea｜｜img/tea.jpg`;

/* 酒單：分類｜名稱｜產地／年份｜一句描述｜價格（可空）｜圖檔（可空） */
const DEFAULT_WINES = `香檳｜（示意）Champagne Brut NV｜法國 香檳區｜細緻氣泡、清爽開胃｜｜img/white.jpg
白酒｜（示意）Hunter Valley Semillon｜澳洲 獵人谷 2022｜柑橘與青草香，餘韻乾淨｜｜img/white.jpg
紅酒｜（示意）Barossa Shiraz｜澳洲 巴羅莎 2020｜黑莓、黑胡椒，酒體飽滿｜｜img/red.jpg
無酒精｜（示意）氣泡水 Sparkling Water｜｜佐餐解膩｜｜img/sparkling.jpg`;

/* ============================================================ STATE */
const SKEY = "tle_syd_v2";
let S = load();
function load(){
  try{ const s = JSON.parse(localStorage.getItem(SKEY)); if(s) return fill(s); }catch(e){}
  return fill({});
}
function fill(s){
  s.page ??= null; s.wineCat ??= "全部"; s.orders ??= {};
  s.guestsTxt ??= DEFAULT_GUESTS; s.drinksTxt ??= DEFAULT_DRINKS; s.winesTxt ??= DEFAULT_WINES;
  s.opera ??= {}; s.koala ??= { frame:"cross", guest:"", name:"", date:"" }; s.koala.frame="cross";
  return s;
}
function save(){ try{ localStorage.setItem(SKEY, JSON.stringify(S)); }catch(e){} }
const esc = s => String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const parseLines = txt => String(txt||"").split(/\r?\n/).map(l=>l.trim()).filter(Boolean).map(l=>l.split(/[｜|]/).map(x=>x.trim()));
const guests = () => parseLines(S.guestsTxt).map(r=>r[0]).filter(Boolean);
const drinks = () => parseLines(S.drinksTxt).map(r=>({zh:r[0],en:r[1]||r[0],note:r[2]||"",img:r[3]||""})).filter(d=>d.zh);
const wines  = () => parseLines(S.winesTxt).map(r=>({cat:r[0]||"其他",name:r[1]||"",origin:r[2]||"",desc:r[3]||"",price:r[4]||"",img:r[5]||""})).filter(w=>w.name);
function today(){ const d=new Date(); return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`; }

/* ============================================================ IndexedDB（照片、影片；file:// 時改記憶體備援） */
let idb=null;
const MEM={files:new Map(),photos:new Map()};
let memMode=false;
function idbOpen(){
  return new Promise(res=>{
    let done=false;
    const finish=(useMem)=>{ if(done) return; done=true; memMode=useMem; res(); };
    let rq;
    try{ rq = indexedDB.open("tlesyd", 1); }
    catch(e){ console.warn("IndexedDB 不可用，改用記憶體模式",e); return finish(true); }
    rq.onupgradeneeded = e=>{
      const db=e.target.result;
      if(!db.objectStoreNames.contains("files"))  db.createObjectStore("files",{keyPath:"id"});
      if(!db.objectStoreNames.contains("photos")) db.createObjectStore("photos",{keyPath:"id"});
    };
    rq.onsuccess=()=>{ idb=rq.result; finish(false); };
    rq.onerror=()=>{ console.warn("IndexedDB 開啟失敗，改用記憶體模式"); finish(true); };
    rq.onblocked=()=>finish(true);
    setTimeout(()=>finish(true),2500);
  });
}
const idbPut=(st,v)=>new Promise((res,rej)=>{
  if(memMode||!idb){ MEM[st].set(v.id,v); return res(); }
  try{ const t=idb.transaction(st,"readwrite"); t.objectStore(st).put(v); t.oncomplete=res; t.onerror=()=>rej(t.error); }
  catch(e){ memMode=true; MEM[st].set(v.id,v); res(); }
});
const idbAll=st=>new Promise((res,rej)=>{
  if(memMode||!idb) return res([...MEM[st].values()]);
  try{ const rq=idb.transaction(st).objectStore(st).getAll(); rq.onsuccess=()=>res(rq.result||[]); rq.onerror=()=>rej(rq.error); }
  catch(e){ memMode=true; res([...MEM[st].values()]); }
});
const idbDel=(st,id)=>new Promise((res,rej)=>{
  if(memMode||!idb){ MEM[st].delete(id); return res(); }
  try{ const t=idb.transaction(st,"readwrite"); t.objectStore(st).delete(id); t.oncomplete=res; t.onerror=()=>rej(t.error); }
  catch(e){ memMode=true; MEM[st].delete(id); res(); }
});
const idbClear=st=>new Promise((res,rej)=>{
  if(memMode||!idb){ MEM[st].clear(); return res(); }
  try{ const t=idb.transaction(st,"readwrite"); t.objectStore(st).clear(); t.oncomplete=res; t.onerror=()=>rej(t.error); }
  catch(e){ memMode=true; MEM[st].clear(); res(); }
});

/* ============================================================ SHELL */
const $=s=>document.querySelector(s);
function toast(msg){
  const t=$("#toast"); t.textContent=msg; t.classList.add("on");
  clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove("on"),1900);
}
function goPage(p){ S.page=p; save(); render(); }
function render(){
  stopCam();
  const hdr=$("#hdr"), scr=$("#screen");
  scr.innerHTML=""; hdr.innerHTML="";
  if(S.page && PAGES[S.page]) PAGES[S.page](hdr,scr);
  else renderHome(hdr,scr);
  scr.scrollTop=0;
}
function hbar(hdr,title,{back=true,right=""}={}){
  const parts=String(title).split(" · ");   /* 「地點 · 功能」：手機寬度只留功能名 */
  const ttl=parts.length>1?`<span class="pl">${esc(parts[0])} · </span>${esc(parts.slice(1).join(" · "))}`:esc(title);
  hdr.innerHTML=`<div class="hbar">${skySvg("hb")}<div class="row">
    <div class="hleft">${back?`<button class="backbtn">${ic("back",16)}</button>`:""}</div>
    <div class="htitle">${ttl}</div>
    <div class="hright">${right}</div>
  </div></div>`;
  const bk=hdr.querySelector(".backbtn");
  if(bk) bk.onclick=()=>goPage(null);
}
function openModal(title,body,btns,cls){
  const mb=$("#mbox");
  mb.className="mbox"+(cls?" "+cls:"");
  mb.innerHTML=`<div class="mh"><span class="t">${esc(title)}</span><button class="x">${ic("x",14)}</button></div>
    <div class="mb">${body}</div>
    ${btns&&btns.length?`<div class="mf"></div>`:""}`;
  mb.querySelector(".x").onclick=closeModal;
  if(btns) btns.forEach(([lb,cls,fn])=>{
    const b=document.createElement("button");
    b.className="btn "+cls; b.innerHTML=lb; b.onclick=fn;
    mb.querySelector(".mf").appendChild(b);
  });
  $("#modal").classList.add("on");
}
function closeModal(){ $("#modal").classList.remove("on"); if(modalOnClose){ const f=modalOnClose; modalOnClose=null; f(); } }
let modalOnClose=null;
$("#modal").addEventListener("click",e=>{ if(e.target.id==="modal") closeModal(); });
function confirmBox(msg,onOk){
  const mb=$("#mbox");
  mb.className="mbox confirm";
  mb.innerHTML=`<div class="mb">${esc(msg)}</div><div class="mf"></div>`;
  const mf=mb.querySelector(".mf");
  const no=document.createElement("button"); no.className="btn sec"; no.textContent="取消"; no.onclick=closeModal;
  const ok=document.createElement("button"); ok.className="btn pri"; ok.textContent="確定"; ok.onclick=()=>{ closeModal(); onOk(); };
  mf.append(no,ok);
  $("#modal").classList.add("on");
}
const PAGES={};

/* ============================================================ 首頁 */
function renderHome(hdr,scr){
  hdr.innerHTML=`<div class="hbar home">${skySvg("hh",{crux:null})}<div class="row">
    <div class="brand"><div class="lion" id="lionmark">獅</div><div class="bt"><div class="b1">導領e化平台</div><div class="b2">LEADER iPAD</div></div></div>
    <div class="hright"><button class="iconbtn" id="setbtn">${ic("gear",20)}</button></div>
  </div></div>`;
  hdr.querySelector("#setbtn").onclick=()=>goPage("settings");
  probe(CONFIG.logo).then(im=>{ const m=hdr.querySelector("#lionmark"); if(im&&m) m.innerHTML=`<img src="${esc(CONFIG.logo)}" alt="Lion Travel">`; });
  const hero=document.createElement("div");
  hero.className="hero";
  /* 寬螢幕與手機各一組構圖，viewBox 比例與 CSS aspect-ratio 一致，南十字與帆影不會被裁掉 */
  const wide=matchMedia("(min-width:768px)").matches;
  const heroSvg=wide?kvSvg(1200,360,{id:"hero",stars:260,seed:11,diag:true,
      arc:"M-40 250 C 300 20, 760 -60, 1240 60",
      crux:{x:1010,y:92,s:62},
      opera:{x:880,y:336,s:110,a:.8,fill:"#fff",fillA:.07},
      flare:[[40,330,220,"#BFE0FF",.45],[260,420,240,"#FFC9E0",.4],[150,210,120,"#FFE2B0",.35]]})
    :kvSvg(600,420,{id:"hero",stars:170,seed:11,diag:true,
      arc:"M-20 300 C 150 60, 380 -20, 620 120",
      crux:{x:480,y:110,s:52},
      opera:{x:380,y:412,s:70,a:.8,fill:"#fff",fillA:.07},
      flare:[[20,400,170,"#BFE0FF",.45],[200,460,180,"#FFC9E0",.4],[90,300,90,"#FFE2B0",.35]]});
  hero.innerHTML=`${heroSvg.replace("<svg ",'<svg class="sky" ')}
    <div class="ht">
      <div class="hk">${esc(CONFIG.kicker)}</div>
      <div class="hn">${esc(CONFIG.title)}</div>
      <div class="hs">${esc(CONFIG.sub)}</div>
      <div class="hd"><span>${esc(CONFIG.tour)}</span><span class="dot"></span><span>${CONFIG.dates?esc(CONFIG.dates):`出團日期 <span class="todo">待補</span>`}</span></div>
    </div>`;
  probe(CONFIG.kv).then(im=>{ if(im){ hero.classList.add("kv"); hero.style.backgroundImage=`url("${CONFIG.kv}")`; } });
  scr.appendChild(hero);
  const el=document.createElement("div");
  el.className="pagepad";
  const tiles=[
    ["wine",  "wine",   "01","喜鳳台",     "電子酒單",     "iPad 呈現酒單，董事自行瀏覽選擇，取代紙本"],
    ["drinks","cup",    "02","Rockpool",   "飲品點選",     "董事點選飲品，彙總後一次交給服務生"],
    ["koala", "camera", "03","Taronga Zoo","無尾熊紀念照", "拍照套上「星引南十字」紀念框，AirDrop 送到董事手機", true],
    ["zoo",   "map",    "04","Taronga Zoo","園區地圖",     "選動物就亮起位置；可分享給旅客手機用"],
  ];
  el.innerHTML=`<div class="tiles">${tiles.map(([id,icn,no,place,tt,td,main])=>`
    <div class="tile${main?" main":""}" data-p="${id}">
      ${main?kvSvg(400,220,{id:"t3",bg:false,stars:70,seed:5,crux:{x:300,y:60,s:26},arc:"M-10 200 C 110 70, 240 10, 420 30"}).replace("<svg ",'<svg class="sky" '):""}
      <span class="no">${no}</span>
      <div class="tic">${ic(icn,22)}</div>
      <div class="tp">${esc(place)}</div>
      <div class="tt">${esc(tt)}</div>
      <div class="td">${esc(td)}</div>
    </div>`).join("")}</div>
    <div class="setlink" id="setlink">設定：董事名單、飲品、酒單、重置</div>`;
  el.querySelectorAll(".tile").forEach(t=>t.onclick=()=>goPage(t.dataset.p));
  el.querySelector("#setlink").onclick=()=>goPage("settings");
  scr.appendChild(el);
}

/* ============================================================ 1 酒單 */
PAGES.wine=(hdr,scr)=>{
  hbar(hdr,"喜鳳台 · 酒單 Wine List");
  const list=wines();
  const cats=["全部",...new Set(list.map(w=>w.cat))];
  if(!cats.includes(S.wineCat)) S.wineCat="全部";
  const tb=document.createElement("div");
  tb.className="tabbar";
  tb.innerHTML=cats.map(c=>`<button class="tab${S.wineCat===c?" on":""}" data-c="${esc(c)}">${esc(c)}</button>`).join("");
  tb.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{ S.wineCat=t.dataset.c; save(); render(); });
  scr.appendChild(tb);
  const el=document.createElement("div");
  el.className="pagepad";
  const show=list.filter(w=>S.wineCat==="全部"||w.cat===S.wineCat);
  const demo=list.some(w=>w.name.includes("示意"));
  el.innerHTML=`${demo?`<div class="demo-note">酒單內容<b>待喜鳳台提供</b>，目前為示意資料（圖片為 AI 生成示意）。拿到正式酒單後到「設定」頁貼上即可。</div>`:""}
    ${show.length?"":`<div class="placeholder-page"><div class="big">${ic("wine",40)}</div><div class="tt">此分類尚無品項</div></div>`}
    ${show.map((w,i)=>`<div class="wine" data-i="${i}">
      <div class="wimg">${w.img?`<img src="${esc(w.img)}" alt="">`:ic(w.cat.includes("無酒精")?"cup":"wine",26)}</div>
      <div class="wm"><div class="wn">${esc(w.name)}</div>
        <div class="wo">${esc([w.cat,w.origin].filter(Boolean).join(" · "))}</div>
        ${w.desc?`<div class="wd">${esc(w.desc)}</div>`:""}</div>
      ${w.price?`<div class="wp">${esc(w.price)}</div>`:""}
    </div>`).join("")}`;
  el.querySelectorAll(".wine").forEach(r=>r.onclick=()=>{
    const w=show[+r.dataset.i];
    openModal(w.cat,`<div class="winedetail">${w.img?`<img src="${esc(w.img)}" alt="" style="width:100%;max-height:300px;object-fit:cover;border-radius:12px;margin-bottom:12px">`:""}<div class="wn">${esc(w.name)}</div>
      <div class="wo">${esc(w.origin||"產地／年份待補")}${w.price?` · ${esc(w.price)}`:""}</div>
      <div class="wd">${esc(w.desc||"描述待補")}</div></div>`,[["關閉","sec",closeModal]]);
  });
  scr.appendChild(el);
};

/* ============================================================ 2 飲品點選 */
const TEMP_EN={ "冰":"Iced", "熱":"Hot", "":"" };
const SEP="\u0001";   /* 彙總分組鍵的分隔字元：備註是自由輸入，不能用「|」 */
PAGES.drinks=(hdr,scr)=>{
  hbar(hdr,"Rockpool · 飲品點選");
  const gs=guests(), ds=drinks();
  const counts={};
  /* 以「飲品｜冷熱｜備註」分組：有備註的另成一列，服務生才看得到少冰、不加糖這類要求 */
  const notes={};
  gs.forEach(g=>{ const o=S.orders[g]; if(o&&o.drink){ const k=[o.drink,o.temp||"",(o.note||"").trim()].join(SEP); counts[k]=(counts[k]||0)+1; if(o.note) (notes[k]=notes[k]||[]).push(g); } });
  const n=Object.values(counts).reduce((a,b)=>a+b,0);
  const el=document.createElement("div");
  el.className="pagepad";
  el.innerHTML=`<p class="vs">董事於 iPad 瀏覽飲品並點選；領隊按「給服務生看」把英文彙總一次交給 Rockpool 服務生。${ds.length&&gs.length?"":"（名單或飲品尚未設定，請到「設定」頁填入）"}</p>
  ${S.drinksTxt===DEFAULT_DRINKS?`<div class="demo-note">飲品清單<b>待 Rockpool 提供</b>，目前 8 項為示意（照片為 AI 生成）。拿到正式清單後到「設定」頁貼上即可。</div>`:""}
  <div class="card"><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:9px">
      <b style="font-size:14px;flex:1;display:flex;align-items:center;gap:6px">${ic("cup",16)} 彙總（共 ${n} 杯）</b>
      <button class="btn pri" id="waiter" ${n?"":"disabled"}>${ic("team",16)} 給服務生看</button></div>
    <div class="ordsum">${Object.entries(counts).map(([k,c])=>{ const [d,t,nt]=k.split(SEP); return `<div class="oi">${esc(d)}${t?` <span class="pill gray">${t}</span>`:""}${nt?` <span class="pill navy">${esc(nt)}</span>`:""} × <b>${c}</b></div>`; }).join("")||`<span style="color:var(--ink2);font-size:13px">尚無點選</span>`}</div></div>
  <div class="card"><div style="font-weight:600;margin-bottom:6px;font-size:14px">董事點選</div><div id="rows"></div></div>
  <button class="btn sec" id="clr">清空全部</button>`;
  const rows=el.querySelector("#rows");
  gs.forEach(g=>{
    const o=S.orders[g];
    const r=document.createElement("div");
    r.className="ordrow";
    r.innerHTML=`<span class="who">${esc(g)}</span>
      <span class="what">${o&&o.drink?`${esc(o.drink)}${o.temp?`（${o.temp}）`:""}${o.note?` · ${esc(o.note)}`:""}`:"尚未點選"}</span>
      <button class="btn ${o&&o.drink?"sec":"pri"}" style="padding:10px 18px;font-size:14px">${o&&o.drink?"修改":"點選"}</button>`;
    r.querySelector("button").onclick=()=>openOrderModal(g);
    rows.appendChild(r);
  });
  el.querySelector("#clr").onclick=()=>confirmBox("清空全部飲品點選？",()=>{ S.orders={}; save(); render(); toast("已清空"); });
  el.querySelector("#waiter").onclick=()=>{
    const enRows=Object.entries(counts).map(([k,c])=>{ const [d,t,nt]=k.split(SEP); const dd=ds.find(x=>x.zh===d); return {en:dd?dd.en:d, t:TEMP_EN[t]||"", nt, who:(notes[k]||[]).join("、"), c}; });
    openModal("For the waiter · 給服務生看",`<div class="waiter"><h2>Drinks Order</h2><div class="sub">${esc(CONFIG.tour)} · ${gs.length} guests · ${n} drinks</div>
      ${enRows.map(r=>`<div class="wrow"><b>${r.c}</b><span>${esc(r.en)}</span>${r.t?`<span class="wt">${r.t}</span>`:""}${r.nt?`<span class="wt note">${esc(r.nt)}${r.who?`（${esc(r.who)}）`:""}</span>`:""}</div>`).join("")}
      <div class="tot">Total ${n}</div></div>`,[["關閉","sec",closeModal]]);
  };
  scr.appendChild(el);
};
function openOrderModal(g){
  const ds=drinks();
  const cur=S.orders[g]||{drink:null,temp:"",note:""};
  let sel={...cur};
  openModal(`${g} · 飲品`,`
    <div class="menu" id="mm">${ds.map(d=>`
      <div class="mitem${sel.drink===d.zh?" on":""}" data-d="${esc(d.zh)}">
        ${d.img?`<div class="mimg"><img src="${esc(d.img)}" alt=""></div>`:""}
        <div class="nm">${esc(d.zh)}</div><div class="en">${esc(d.en)}</div></div>`).join("")}</div>
    <div class="field" style="margin-top:14px"><label>冷／熱（可不選）</label>
      <div style="display:flex;gap:8px" id="tt">
        ${["","冰","熱"].map(t=>`<button class="tab${sel.temp===t?" on":""}" data-t="${t}">${t||"不指定"}</button>`).join("")}
      </div></div>
    <div class="field"><label>備註（可空）</label><input type="text" id="onote" value="${esc(sel.note||"")}" placeholder="會印在給服務生看的單子上，建議英文，例：less ice、no sugar"></div>
  `,[["取消點選","ghost",()=>{ delete S.orders[g]; save(); closeModal(); render(); }],
     ["確認","pri",()=>{
        if(!sel.drink){ toast("請先選飲品"); return; }
        sel.note=$("#onote").value.trim();
        S.orders[g]=sel; save(); closeModal(); render(); toast(`${g}：${sel.drink}${sel.temp?`（${sel.temp}）`:""}`);
     }]]);
  $("#mbox").querySelectorAll(".mitem").forEach(mi=>mi.onclick=()=>{
    sel.drink=mi.dataset.d;
    $("#mbox").querySelectorAll(".mitem").forEach(x=>x.classList.toggle("on",x.dataset.d===sel.drink));
  });
  $("#mbox").querySelectorAll("#tt .tab").forEach(t=>t.onclick=()=>{
    sel.temp=t.dataset.t;
    $("#mbox").querySelectorAll("#tt .tab").forEach(x=>x.classList.toggle("on",x.dataset.t===sel.temp));
  });
}

/* ============================================================ 3 無尾熊紀念照 */
/* 紀念框「星引南十字」：1600×2000（4:5）、無邊框。照片滿版；上緣淡入深藍星空、南十字座與一條細弧線，
 * 下緣深藍夜色托住文字；右下歌劇院帆影線稿、虹彩微光。疊層只算一次（renderOverlay），取景畫面、縮圖與合成共用。 */
const FW=1600, FH=2000;
const FONT='"PingFang TC","Microsoft JhengHei","Noto Sans TC",system-ui,sans-serif';
const SERIF='"Songti TC","Noto Serif TC","Source Han Serif TC","PMingLiU","Microsoft JhengHei",serif';
const SCRIPT='"Snell Roundhand","Savoye LET","Apple Chancery","Segoe Script","Brush Script MT",cursive';
const FULL={x:0,y:0,w:FW,h:FH};
function crossSvg(){
  return kvSvg(FW,FH,{id:"fr",bg:false,stars:260,seed:21,starBand:.24,k:1.7,blur:90,
    arc:"M-60 480 C 400 0, 1000 -160, 1660 220",
    crux:{x:1330,y:300,s:150},
    opera:{x:1010,y:1960,s:130,a:.7},
    flare:[[1480,1980,420,"#FFE2B0",.22],[1250,1900,260,"#FFC9E0",.16],[160,1960,320,"#BFE0FF",.14]]});
}
const FRAMES=[
  { id:"cross", name:"星引南十字",
    text:{align:"left",x:110,nameY:1836,line2Y:1900,nameColor:"#FFFFFF",line2Color:"rgba(255,255,255,.82)",nameSize:74,line2Size:34,maxW:1000,shadow:true,nameFont:FONT,nameWeight:600,nameSpacing:3},
    logo:{x:110,y:100,w:220,h:90},
    layers:[
      {type:"scrim",y0:0,y1:460,stops:[[0,"rgba(10,31,92,.68)"],[0.5,"rgba(10,31,92,.28)"],[1,"rgba(10,31,92,0)"]]},
      {type:"scrim",y0:1300,y1:2000,stops:[[0,"rgba(10,31,92,0)"],[0.45,"rgba(10,31,92,.72)"],[1,"rgba(8,24,70,.97)"]]},
      {type:"svg",svg:crossSvg},
      {type:"caption",text:"2026 董事會 OUTING · TARONGA ZOO, SYDNEY",x:110,y:1556,align:"left",color:"rgba(255,255,255,.8)",size:26,spacing:7},
      {type:"title",text:"星引南十字",x:110,y:1712,size:120,color:"#FFFFFF",spacing:14},
      {type:"script",text:"Sydney + Melbourne",x:"after",gap:40,y:1712,size:60,color:"rgba(255,255,255,.9)"},
      {type:"rule",x0:110,x1:1490,y:1752,color:"rgba(255,255,255,.36)"},
    ]},
];
const assetCache={};
function loadAsset(src){
  if(!assetCache[src]) assetCache[src]=new Promise(res=>{ const im=new Image(); im.onload=()=>res(im); im.onerror=()=>{ console.warn("素材缺少",src); res(null); }; im.src=src; });
  return assetCache[src];
}
function svgImage(svg){
  return new Promise((res,rej)=>{ const u=URL.createObjectURL(new Blob([svg],{type:"image/svg+xml"})); const im=new Image(); im.onload=()=>res(im); im.onerror=rej; im.src=u; });
}
/* 字距版文字（canvas letterSpacing 支援不一，手動逐字畫） */
function spacedText(ctx,text,x,y,align,spacing){
  const chars=[...text]; const ws=chars.map(c=>ctx.measureText(c).width);
  const total=ws.reduce((a,b)=>a+b,0)+spacing*(chars.length-1);
  let cx=align==="right"?x-total:align==="center"?x-total/2:x;
  ctx.textAlign="left";
  chars.forEach((c,i)=>{ ctx.fillText(c,cx,y); cx+=ws[i]+spacing; });
  return cx-spacing;   /* 文字結尾 x，給接在後面的元素用 */
}
async function renderOverlay(fr){
  const cv=document.createElement("canvas"); cv.width=FW; cv.height=FH;
  const ctx=cv.getContext("2d");
  let lastEnd=0;
  for(const L of fr.layers){
    if(L.type==="scrim"){
      const g=ctx.createLinearGradient(0,L.y0,0,L.y1); L.stops.forEach(([o,c])=>g.addColorStop(o,c));
      ctx.fillStyle=g; ctx.fillRect(0,L.y0,FW,L.y1-L.y0);
    }else if(L.type==="img"){
      const im=await loadAsset(L.src); if(!im) continue;
      const w=L.w, h=L.h||w*im.naturalHeight/im.naturalWidth;
      ctx.save(); ctx.globalAlpha=L.opacity??1;
      if(L.flip){ ctx.translate(L.x+w,L.y); ctx.scale(-1,1); ctx.drawImage(im,0,0,w,h); }
      else ctx.drawImage(im,L.x,L.y,w,h);
      ctx.restore();
    }else if(L.type==="rule"){
      ctx.fillStyle=L.color; ctx.fillRect(L.x0,L.y-1,L.x1-L.x0,2);
    }else if(L.type==="caption"){
      ctx.save(); ctx.fillStyle=L.color; ctx.font=`600 ${L.size}px Helvetica,Arial,${FONT}`;
      spacedText(ctx,L.text,L.x,L.y,L.align,L.spacing||0); ctx.restore();
    }else if(L.type==="title"){   /* 主視覺標題：細明體、字距寬、柔和陰影 */
      ctx.save(); ctx.fillStyle=L.color; ctx.font=`400 ${L.size}px ${SERIF}`;
      ctx.shadowColor="rgba(0,0,0,.35)"; ctx.shadowBlur=24; ctx.shadowOffsetY=4;
      lastEnd=spacedText(ctx,L.text,L.x,L.y,"left",L.spacing||0); ctx.restore();
    }else if(L.type==="script"){  /* 英文手寫體副標，可接在標題後面 */
      ctx.save(); ctx.fillStyle=L.color; ctx.font=`400 ${L.size}px ${SCRIPT}`; ctx.textAlign="left";   /* 手寫體本身就斜，不再加 italic */
      ctx.shadowColor="rgba(0,0,0,.3)"; ctx.shadowBlur=16; ctx.shadowOffsetY=3;
      ctx.fillText(L.text,L.x==="after"?lastEnd+(L.gap||30):L.x,L.y); ctx.restore();
    }else if(L.type==="svg"){
      ctx.drawImage(await svgImage(L.svg()),0,0,FW,FH);
    }
  }
  return cv;
}
const overlayCache={}, overlayUrl={};
function frameImage(fr){ return overlayCache[fr.id]||(overlayCache[fr.id]=renderOverlay(fr)); }
function frameUrl(fr){  /* 疊層縮圖（800×1000 PNG）給取景畫面與縮圖用 */
  return overlayUrl[fr.id]||(overlayUrl[fr.id]=frameImage(fr).then(cv=>new Promise(res=>{
    const s=document.createElement("canvas"); s.width=800; s.height=1000;
    s.getContext("2d").drawImage(cv,0,0,800,1000);
    s.toBlob(b=>res(URL.createObjectURL(b)),"image/png");
  })));
}
let logoImg=null, logoTried=false;
function logoImage(){
  if(!CONFIG.logo) return Promise.resolve(null);
  if(logoTried) return Promise.resolve(logoImg);
  logoTried=true;
  return new Promise(res=>{ const im=new Image(); im.onload=()=>{ logoImg=im; res(im); }; im.onerror=()=>res(null); im.src=CONFIG.logo; });
}
const srcW=s=>s.videoWidth||s.naturalWidth||s.width, srcH=s=>s.videoHeight||s.naturalHeight||s.height;
/* 合成：照片 cover 填滿視窗（可平移／縮放）→ 疊框 → 姓名與日期 → Logo */
async function compose(src,fr,opt,cv){
  cv=cv||document.createElement("canvas");
  cv.width=FW; cv.height=FH;
  const ctx=cv.getContext("2d");
  ctx.fillStyle="#fff"; ctx.fillRect(0,0,FW,FH);
  const sw=srcW(src), sh=srcH(src), {x,y,w,h}=fr.win||FULL;
  const base=Math.max(w/sw,h/sh)*(opt.zoom||1);
  const dw=sw*base, dh=sh*base;
  let ox=x+(w-dw)/2+(opt.dx||0), oy=y+(h-dh)/2+(opt.dy||0);
  ox=Math.min(x,Math.max(x+w-dw,ox)); oy=Math.min(y,Math.max(y+h-dh,oy));
  opt.dx=ox-(x+(w-dw)/2); opt.dy=oy-(y+(h-dh)/2);   /* 回寫夾限後的位移 */
  ctx.save(); ctx.beginPath(); ctx.rect(x,y,w,h); ctx.clip(); ctx.drawImage(src,ox,oy,dw,dh); ctx.restore();
  ctx.drawImage(await frameImage(fr),0,0);
  const t=fr.text;
  ctx.textAlign=t.align; ctx.textBaseline="alphabetic";
  if(t.shadow){ ctx.shadowColor="rgba(0,0,0,.45)"; ctx.shadowBlur=18; ctx.shadowOffsetY=4; }
  const fit=(txt,size,weight,fam,sp)=>{ let s=size; do{ ctx.font=`${weight} ${s}px ${fam}`; if(ctx.measureText(txt).width+(sp||0)*([...txt].length-1)<=t.maxW) break; s-=4; }while(s>24); };
  const name=(opt.name||"").trim(), line2=(opt.line2||"").trim();
  if(name){ ctx.fillStyle=t.nameColor; fit(name,t.nameSize,t.nameWeight||900,t.nameFont||FONT,t.nameSpacing);
    if(t.nameSpacing) spacedText(ctx,name,t.x,t.nameY,t.align,t.nameSpacing); else ctx.fillText(name,t.x,t.nameY); }
  if(line2){ ctx.fillStyle=t.line2Color; ctx.textAlign=t.align; fit(line2,t.line2Size,600,FONT); ctx.fillText(line2,t.x,name?t.line2Y:t.nameY-10); }
  ctx.shadowColor="transparent";
  const lg=await logoImage();
  if(lg&&fr.logo){ const L=fr.logo, s=Math.min(L.w/lg.naturalWidth,L.h/lg.naturalHeight), lw=lg.naturalWidth*s, lh=lg.naturalHeight*s;
    ctx.drawImage(lg,L.x+(L.w-lw)/2,L.y+(L.h-lh)/2,lw,lh); }
  return cv;
}
const toBlob=(cv,q)=>new Promise(r=>cv.toBlob(r,"image/jpeg",q||0.92));
function loadImage(file){
  return new Promise((res,rej)=>{ const u=URL.createObjectURL(file); const im=new Image(); im.onload=()=>res(im); im.onerror=rej; im.src=u; });
}
async function shareFile(file,title){
  if(navigator.canShare && navigator.canShare({files:[file]})){
    try{ await navigator.share({files:[file],title}); return true; }
    catch(e){ if(e&&e.name==="AbortError") return false; console.warn("share 失敗",e); }
  }
  const u=URL.createObjectURL(file);
  openModal("儲存到相簿",`<img src="${u}" style="max-width:100%;border-radius:12px;display:block;margin:0 auto">
    <p class="vs" style="margin-top:10px;text-align:center">此環境無法直接分享。iPad 上請<b>長按圖片 → 加入照片</b>；電腦上可<a href="${u}" download="${esc(file.name)}">下載</a>。</p>`,[["關閉","sec",closeModal]]);
  return false;
}

let camStream=null;
function stopCam(){ if(camStream){ camStream.getTracks().forEach(t=>t.stop()); camStream=null; } }
async function startCam(video){
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia) throw new Error("nocam");
  camStream=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:"environment"},width:{ideal:2560},height:{ideal:1920}}});
  video.srcObject=camStream;
  await video.play();
}

PAGES.koala=(hdr,scr)=>{
  hbar(hdr,"Taronga Zoo · 無尾熊紀念照");
  const K=S.koala; if(!K.date||!K.dateEdited) K.date=today();   /* 每次進頁都用今天；領隊手動改過才保留 */
  const fr=FRAMES.find(f=>f.id===K.frame)||FRAMES[0];
  const el=document.createElement("div");
  el.className="pagepad";
  el.innerHTML=`<p class="vs">董事與無尾熊合照後，iPad 直接套上「星引南十字」紀念框，立即 AirDrop 到董事手機。全程離線。</p>
  <div class="koala2">
    <div>
      <div class="card">
        <div class="ct">${STAR} 這張是誰的</div>
        <div class="field"><label>董事</label><select id="kg"><option value="">— 自行輸入 —</option>${guests().map(g=>`<option${K.guest===g?" selected":""}>${esc(g)}</option>`).join("")}</select></div>
        <div class="field"><label>照片上的姓名（可改、可留空）</label><input type="text" id="kn" value="${esc(K.name)}" placeholder="例：王大明 董事"></div>
        <div class="field" style="margin-bottom:0"><label>日期</label><input type="text" id="kd" value="${esc(K.date)}"></div>
      </div>
      <div class="card">
        <div class="ct">${STAR} 紀念框</div>
        <div class="framenote"><div class="fbox"><img id="frthumb" alt=""></div>
          <div><div class="fn">${esc(fr.name)}</div><div class="fd">依本次董事會主視覺發想：深藍星空與南十字座、一條星軌細線、歌劇院帆影與虹彩微光。照片滿版、無邊框，姓名與日期自動印上。</div></div></div>
      </div>
    </div>
    <div>
      <div class="card">
        <div class="ct">${STAR} 取景拍照</div>
        <div class="stagewrap"><div class="stage" id="stage">
          <video id="cam" playsinline muted autoplay style="left:0;top:0;width:100%;height:100%"></video>
          <img class="ov" id="ov" alt="">
          <div class="nocam" id="nocam" hidden></div>
        </div></div>
        <div class="camrow"><button class="shutter" id="shot" title="拍照"></button></div>
        <div class="btnrow" style="justify-content:center">
          <label class="camlbl">${ic("camera",16)} 用相機 App 拍<input type="file" accept="image/*" capture="environment" id="fcap"></label>
          <label class="camlbl">${ic("photo",16)} 從相簿選<input type="file" accept="image/*" id="fpick"></label>
        </div>
      </div>
    </div>
  </div>
  <h3 class="sect">已製作的紀念照</h3>
  <div class="gal" id="gal">讀取中…</div>`;
  scr.appendChild(el);

  const kg=el.querySelector("#kg"), kn=el.querySelector("#kn"), kd=el.querySelector("#kd");
  kg.onchange=()=>{ K.guest=kg.value; if(kg.value){ K.name=kg.value.replace(/（示意）/g,""); kn.value=K.name; } save(); };
  kn.oninput=()=>{ K.name=kn.value; save(); };
  kd.oninput=()=>{ K.date=kd.value; K.dateEdited=true; save(); };
  frameUrl(fr).then(u=>{ const ov=el.querySelector("#ov"), th=el.querySelector("#frthumb"); if(ov) ov.src=u; if(th) th.src=u; });

  const video=el.querySelector("#cam"), nocam=el.querySelector("#nocam"), shot=el.querySelector("#shot");
  startCam(video).catch(e=>{
    nocam.hidden=false; shot.style.display="none";
    nocam.innerHTML = e&&e.message==="nocam"
      ? `此環境無法即時預覽相機<br><small>（需以 HTTPS 開啟或加入主畫面）</small><br>請用下方「用相機 App 拍」，拍完一樣會套框。`
      : `相機未開啟：${esc(e&&e.message||e)}<br>請用下方「用相機 App 拍」。`;
  });
  shot.onclick=()=>{
    if(!video.videoWidth){ toast("相機尚未就緒"); return; }
    const snap=document.createElement("canvas"); snap.width=video.videoWidth; snap.height=video.videoHeight;
    snap.getContext("2d").drawImage(video,0,0);
    openCompose(snap,{zoomable:false});
  };
  const pick=async e=>{
    const f=e.target.files[0]; e.target.value=""; if(!f) return;
    try{ openCompose(await loadImage(f),{zoomable:true}); }catch(err){ toast("照片無法讀取"); }
  };
  el.querySelector("#fcap").onchange=pick;
  el.querySelector("#fpick").onchange=pick;
  renderGallery(el.querySelector("#gal"));
};
function koalaOpt(){
  const K=S.koala; return { name:(K.name||"").trim(), line2:[K.date||today(),CONFIG.zooLine].filter(Boolean).join("  ·  "), dx:0, dy:0, zoom:1 };
}
function openCompose(src,{zoomable}){
  const fr=FRAMES.find(f=>f.id===S.koala.frame)||FRAMES[0];
  const opt=koalaOpt();
  let file=null, busy=false, dirty=false;
  openModal("紀念照預覽",`<div class="compose">
      <canvas id="cc"></canvas>
      <div class="hint">拖曳照片調整位置${zoomable?"，下方拉桿縮放":""}</div>
      ${zoomable?`<input type="range" id="cz" min="1" max="2.2" step="0.01" value="1">`:""}
    </div>`,
    [["重拍","ghost",closeModal],
     [`${ic("check",16)} 存入紀念照`,"sec",async()=>{ await ensureFile(); await savePhoto(file,fr); toast("已存入紀念照"); }],
     [`${ic("share",16)} 分享／AirDrop`,"pri",async()=>{
        if(!file){ await ensureFile(); }
        const ok=await shareFile(file,`${opt.name||"紀念照"} · Taronga Zoo`);
        if(ok){ await savePhoto(file,fr); toast("已分享並存入紀念照"); }
     }]]);
  const cv=$("#cc"), cz=$("#cz");
  async function draw(){
    if(busy){ dirty=true; return; }
    busy=true;
    try{ await compose(src,fr,opt,cv); file=null; }
    finally{ busy=false; if(dirty){ dirty=false; draw(); } else makeFile(); }
  }
  async function makeFile(){ const b=await toBlob(cv); file=new File([b],`${(opt.name||"koala").replace(/[\\/:*?"<>|]/g,"")}_TarongaZoo.jpg`,{type:"image/jpeg"}); }
  async function ensureFile(){ while(busy) await new Promise(r=>setTimeout(r,50)); if(!file) await makeFile(); }
  draw();
  let drag=null;
  cv.addEventListener("pointerdown",e=>{ e.preventDefault(); cv.setPointerCapture(e.pointerId); drag={x:e.clientX,y:e.clientY,dx:opt.dx,dy:opt.dy}; });
  cv.addEventListener("pointermove",e=>{ if(!drag) return; const k=FW/cv.getBoundingClientRect().width;
    opt.dx=drag.dx+(e.clientX-drag.x)*k; opt.dy=drag.dy+(e.clientY-drag.y)*k; draw(); });
  cv.addEventListener("pointerup",()=>drag=null);
  cv.addEventListener("pointercancel",()=>drag=null);
  if(cz) cz.oninput=()=>{ opt.zoom=+cz.value; draw(); };
}
async function savePhoto(file,fr){
  const K=S.koala;
  await idbPut("photos",{ id:"k"+Date.now(), name:(K.name||"").trim()||"（未填姓名）", guest:K.guest||"", frame:fr.id, blob:file, ts:Date.now() });
  const gal=$("#gal"); if(gal) renderGallery(gal);
}
async function renderGallery(box){
  const list=(await idbAll("photos")).sort((a,b)=>b.ts-a.ts);
  box.innerHTML=list.length?"":`<div class="vs" style="grid-column:1/-1">尚無紀念照。拍一張就會出現在這裡，之後隨時可以重新分享。</div>`;
  list.forEach(rec=>{
    const u=URL.createObjectURL(rec.blob);
    const g=document.createElement("div");
    g.className="gi";
    g.innerHTML=`<img src="${u}" alt=""><div class="gn">${esc(rec.name)}</div><div class="gt">${new Date(rec.ts).toLocaleString("zh-TW",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"})}</div>`;
    g.onclick=()=>openModal(rec.name,`<img src="${u}" style="max-width:100%;max-height:62dvh;display:block;margin:0 auto;border-radius:12px">`,
      [["刪除","ghost",()=>confirmBox(`刪除「${rec.name}」這張紀念照？`,async()=>{ await idbDel("photos",rec.id); renderGallery(box); toast("已刪除"); })],
       ["關閉","sec",closeModal],
       [`${ic("share",16)} 分享／AirDrop`,"pri",()=>{ const f=rec.blob instanceof File?rec.blob:new File([rec.blob],`${rec.name}_TarongaZoo.jpg`,{type:"image/jpeg"}); shareFile(f,`${rec.name} · Taronga Zoo`); }]]);
    box.appendChild(g);
  });
}

/* ============================================================ 4 園區地圖（內嵌 map.html，同一份也分享給旅客） */
const MAP_URL=new URL("map.html",location.href).href.replace(/\?.*$/,"");
PAGES.zoo=(hdr,scr)=>{
  hbar(hdr,"Taronga Zoo · 園區地圖",{right:`<button class="btn pri" id="shareMap" style="padding:9px 14px;font-size:13px">${ic("share",15)} 分享給旅客</button>`});
  const page=document.createElement("div");
  page.className="zoopage";
  page.innerHTML=`<iframe class="zooframe" src="map.html?embed=1" title="Taronga Zoo map" allow="clipboard-write"></iframe>`;
  scr.appendChild(page);
  hdr.querySelector("#shareMap").onclick=()=>{
    openModal("分享園區地圖給旅客",`<div style="text-align:center">
        <img src="img/map-qr.png" alt="QR" style="width:min(300px,70vw);display:block;margin:0 auto 10px;border:1px solid var(--line);border-radius:12px;padding:8px">
        <div style="font-size:13px;color:var(--ink2);line-height:1.7">旅客用手機相機掃描即可開啟，不用安裝。<br>點選動物、表演或地點，地圖會亮起位置。</div>
        <div style="margin-top:10px;font-size:12px;color:var(--ink3);word-break:break-all;-webkit-user-select:text;user-select:text">${esc(MAP_URL)}</div>
      </div>`,
      [["複製連結","sec",async()=>{ try{ await navigator.clipboard.writeText(MAP_URL); toast("連結已複製"); }catch(e){ toast("請長按上方網址複製"); } }],
       [`${ic("share",15)} 傳送（AirDrop／LINE）`,"pri",async()=>{ if(navigator.share){ try{ await navigator.share({title:"Taronga Zoo 園區地圖",url:MAP_URL}); }catch(e){} } else toast("此環境不支援分享，請複製連結"); }]]);
  };
};

/* ============================================================ 設定 */
PAGES.settings=(hdr,scr)=>{
  hbar(hdr,"設定");
  const el=document.createElement("div");
  el.className="pagepad";
  el.innerHTML=`<div class="demo-note">此為<b>雪梨董事會 示範版</b>。名單、飲品、酒單都在這裡貼上即可，不必改程式；資料只存在這台 iPad。</div>
    <div class="card"><div class="field"><label>董事名單（每行一位）</label><textarea id="tg">${esc(S.guestsTxt)}</textarea></div></div>
    <div class="card"><div class="field"><label>Rockpool 飲品（中文｜English｜備註｜圖檔）</label><textarea id="td">${esc(S.drinksTxt)}</textarea></div></div>
    <div class="card"><div class="field"><label>喜鳳台 酒單（分類｜名稱｜產地／年份｜描述｜價格｜圖檔）</label><textarea id="tw" style="min-height:180px">${esc(S.winesTxt)}</textarea></div></div>
    <div class="btnrow"><button class="btn pri" id="sv">儲存</button><button class="btn sec" id="exp">匯出紀錄</button><button class="btn danger" id="rst">重置全部</button></div>
    <p class="vs" style="margin-top:16px">版本 tle-syd-v8 · 主視覺「星引南十字」。出團日期、雄獅 Logo（img/logo.png）、主視覺原稿（img/kv.jpg）都在 app.js 的 CONFIG 設定（待補）。</p>`;
  el.querySelector("#sv").onclick=()=>{ S.guestsTxt=$("#tg").value; S.drinksTxt=$("#td").value; S.winesTxt=$("#tw").value; save(); toast("已儲存"); };
  el.querySelector("#exp").onclick=()=>{
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([JSON.stringify(S,null,2)],{type:"application/json"}));
    a.download=`${CONFIG.tour}_紀錄.json`; a.click();
  };
  el.querySelector("#rst").onclick=()=>confirmBox("重置所有點選、名單設定、紀念照與匯入影片？",async()=>{
    localStorage.removeItem(SKEY);
    await idbClear("files"); await idbClear("photos");
    S=load(); render(); toast("已重置");
  });
  scr.appendChild(el);
};

/* ============================================================ BOOT */
(async function(){
  try{ await idbOpen(); }catch(e){ console.warn("儲存初始化失敗，以記憶體模式繼續",e); }
  const qp=new URLSearchParams(location.search).get("page");   /* ?page=wine 直接開到某一頁（測試、捷徑用） */
  if(qp!==null){ S.page=(qp&&PAGES[qp])?qp:null; save(); }
  try{ render(); }
  catch(e){
    console.error(e);
    document.getElementById("screen").innerHTML=
      '<div class="placeholder-page"><div class="big">!</div><div class="tt">載入發生問題</div>'+
      '<div class="dd">'+String(e&&e.message||e)+'</div></div>';
  }
  if(location.protocol!=="file:" && "serviceWorker" in navigator){
    try{ await navigator.serviceWorker.register("sw.js"); }catch(e){ console.warn("SW 註冊失敗",e); }
  }
})();
