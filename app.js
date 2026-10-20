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
let STAR='';   /* 區塊標題前的小星，等 KV 定義後指定 */

/* ============================================================ 主視覺「星引南十字」元素
 * 設計師提供的去背 PNG（Drive 資料夾），由 tools/prep_kv.py 處理到 app/img/kv/。程式不自己畫圖，首頁、頁首、磁磚、紀念框、
 * 旅客地圖頁首與 App 圖示都用同一批檔案。 */
const KV={bg:"img/kv/bg.jpg",title:"img/kv/title.png",board:"img/kv/board.png",sub:"img/kv/sub.png",
          opera:"img/kv/opera.webp",crux:"img/kv/crux.webp",logo:"img/kv/logo.png",mark:"img/kv/mark.png",star:"img/kv/star.png"};
const STAR_IMG=(cls="st")=>`<img class="${cls}" src="${KV.star}" alt="" aria-hidden="true">`;   /* 南十字裁下的一顆星，當小裝飾用 */
STAR=STAR_IMG();

/* ============================================================ CONFIG（待補處不自行填） */
const CONFIG = {
  tour:   "雪梨董事會",
  title:  "星引南十字",          /* 本次董事會主視覺標題（來自主視覺稿） */
  kicker: "2026 董事會 OUTING",
  sub:    "Sydney + Melbourne",
  dates:  "2026.11.04 出發",     /* 出團日期（使用者 2026-10-20 告知） */
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
/* 紀念照用的英文日期：07 NOV 2026 */
function dateEN(){ const d=new Date(), M=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]; return `${String(d.getDate()).padStart(2,"0")} ${M[d.getMonth()]} ${d.getFullYear()}`; }
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
  const t=$("#toast"); t.innerHTML=STAR_IMG("ts")+esc(msg); t.classList.add("on");
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
function hbar(hdr,title,{back=true,right="",hero=null}={}){
  const parts=String(title).split(" · ");   /* 「地點 · 功能」：手機寬度只留功能名 */
  const ttl=parts.length>1?`<span class="pl">${esc(parts[0])} · </span>${esc(parts.slice(1).join(" · "))}`:esc(title);
  /* hero：頁首往下延伸成主視覺漸層帶，放場地名（細明體）與英文小字、南十字 */
  const sub=hero?`<div class="row hsub"><div><div class="hz">${esc(hero.zh)}</div><div class="he">${esc(hero.en)}</div></div><img class="hcrux" src="${KV.crux}" alt=""></div>`:"";
  hdr.innerHTML=`<div class="hbar${hero?" tall":""}"><div class="row">
    <div class="hleft">${back?`<button class="backbtn">${ic("back",16)}</button>`:""}</div>
    <div class="htitle">${ttl}</div>
    <div class="hright">${right}</div>
  </div>${sub}</div>`;
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
function closeModal(){ $("#modal").classList.remove("on"); const cc=$("#cc"); if(cc){ cc.width=cc.height=0; }   /* 釋放預覽畫布（原尺寸很大） */ if(modalOnClose){ const f=modalOnClose; modalOnClose=null; f(); } }
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
  hdr.innerHTML=`<div class="hbar home"><div class="row">
    <div class="brand"><div class="lion"><img src="${KV.mark}" alt="雄獅旅遊"></div><div class="bt"><div class="b1">導領e化平台</div><div class="b2">LEADER iPAD</div></div></div>
    <div class="hright"><button class="iconbtn" id="setbtn">${ic("gear",20)}</button></div>
  </div></div>`;
  hdr.querySelector("#setbtn").onclick=()=>goPage("settings");
  /* hero：主視覺底圖（CSS background）＋設計師的南十字、歌劇院、標題字、英文字 */
  const hero=document.createElement("div");
  hero.className="hero";
  hero.innerHTML=`<img class="kvc" src="${KV.crux}" alt=""><img class="kvo" src="${KV.opera}" alt="">
    <div class="ht">
      <img class="kvb" src="${KV.board}" alt="${esc(CONFIG.kicker)}">
      <img class="kvt" src="${KV.title}" alt="${esc(CONFIG.title)}">
      <img class="kvs" src="${KV.sub}" alt="${esc(CONFIG.sub)}">
      <div class="hd"><span>${esc(CONFIG.tour)}</span><span class="dot"></span><span>${CONFIG.dates?esc(CONFIG.dates):`出團日期 <span class="todo">待補</span>`}</span></div>
    </div>`;
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
      ${main?`<img class="kvc" src="${KV.crux}" alt="">`:""}
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
  hbar(hdr,"電子酒單",{hero:{zh:"喜鳳台",en:"WINE LIST"}});
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
  hbar(hdr,"飲品點選",{hero:{zh:"Rockpool",en:"DRINKS ORDER"}});
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
/* 紀念框「星引南十字」：輸出尺寸＝照片原尺寸（最長邊上限 4096），不裁切。疊層以 1600×2000 的設計稿為基準，
 * k＝min(W/1600, H/2000)，每層用 anchor 釘在邊上：tl／tr／bl／br；x＝到左（或右）邊的距離、y＝到上（或下）邊的距離，
 * 都是設計稿單位；右／下錨點量的是元素的右／下緣。band 層鋪滿整個寬度。
 * imgfade／imgmask 的 sx/sy/sw/sh 是底圖 bg.jpg（2400×1710）上的裁切範圍，貼上時以 cover 填滿目的框。 */
const DW=1600, DH=2000, MAX_SIDE=4096;
const FONT='"PingFang TC","Microsoft JhengHei","Noto Sans TC",system-ui,sans-serif';
const FRAMES=[
  { id:"cross", name:"星引南十字",
    text:{x:230,yb:88,size:36,maxW:760,color:"rgba(255,255,255,.9)"},   /* 日期行：距左 230、基線距底 88 */
    layers:[
      /* 四邊星空暗角：照片像嵌在夜空裡（中心透明、往四角漸深；中上段人臉處幾乎不壓） */
      {type:"imgmask",src:KV.bg,sx:1150,sy:0,sw:1250,sh:1562,full:true,r0:.58,r1:1,a0:0,a1:.6},
      /* 上緣星空帶（薄）：約 21%，不壓到人臉 */
      {type:"imgfade",src:KV.bg,sx:1000,sy:0,sw:1400,sh:368,band:"top",h:420,fade:[[0,.96],[.4,.55],[1,0]]},
      /* 下緣夜空帶＋加深托字 */
      {type:"imgfade",src:KV.bg,sx:1200,sy:40,sw:1200,sh:450,band:"bottom",h:600,fade:[[0,0],[.32,.86],[1,1]]},
      {type:"scrim",band:"bottom",h:400,stops:[[0,"rgba(8,24,70,0)"],[1,"rgba(8,24,70,.5)"]]},
      /* 右下虹彩光：主視覺的水晶折射，以 screen 打在歌劇院後面（允許出血） */
      {type:"imgmask",src:KV.bg,sx:150,sy:850,sw:1500,sh:860,anchor:"br",x:-200,y:-120,w:1160,h:720,r0:0,r1:.55,a0:.9,a1:0,blend:"screen",opacity:.85},
      {type:"img",src:KV.crux,anchor:"tr",x:130,y:96,w:160},
      {type:"img",src:KV.mark,anchor:"tl",x:110,y:96,w:96},
      {type:"img",src:KV.opera,anchor:"br",x:0,y:146,w:660,opacity:.96},   /* 底邊與 Sydney + Melbourne 的底切齊（設計師回饋） */
      /* 標題字組：文字軸線一律 x=230（飾線尾巴延到 110 的邊界，與左上雄獅同一條線） */
      {type:"img",src:KV.board,anchor:"bl",x:230,y:428,w:300,opacity:.92},
      {type:"img",src:KV.title,anchor:"bl",x:110,y:202,w:640},
      {type:"img",src:KV.sub,anchor:"bl",x:230,y:146,w:400,opacity:.95},
    ]},
];
const assetCache={};
function loadAsset(src){
  if(!assetCache[src]) assetCache[src]=new Promise(res=>{ const im=new Image(); im.onload=()=>res(im); im.onerror=()=>{ console.warn("素材缺少",src); res(null); }; im.src=src; });
  return assetCache[src];
}
/* 把底圖裁切範圍以 cover 方式畫滿 dw×dh 的暫存畫布；align 決定多出來的部分往哪裁 */
function coverDraw(im,L,dw,dh,align){
  const t=document.createElement("canvas"); t.width=Math.max(1,Math.round(dw)); t.height=Math.max(1,Math.round(dh)); const tc=t.getContext("2d");
  const sc=Math.max(t.width/L.sw,t.height/L.sh), w=L.sw*sc, h=L.sh*sc;
  const ox=(t.width-w)/2, oy=align==="top"?0:align==="bottom"?t.height-h:(t.height-h)/2;
  tc.drawImage(im,L.sx,L.sy,L.sw,L.sh,ox,oy,w,h);
  return t;
}
/* 依畫面尺寸算出一層的目的框（像素） */
function placeOf(L,W,H,k,imW,imH){
  let w,h;
  if(L.full){ return {x:0,y:0,w:W,h:H}; }
  if(L.band){ h=L.h*k; return {x:0,y:L.band==="top"?0:H-h,w:W,h}; }
  w=L.w*k; h=L.h!=null?L.h*k:w*imH/imW;
  const x=L.anchor[1]==="r"?W-L.x*k-w:L.x*k, y=L.anchor[0]==="b"?H-L.y*k-h:L.y*k;
  return {x,y,w,h};
}
async function renderOverlay(fr,W,H){
  const cv=document.createElement("canvas"); cv.width=W; cv.height=H;
  const ctx=cv.getContext("2d"), k=Math.min(W/DW,H/DH);
  for(const L of fr.layers){
    if(L.type==="scrim"){
      const P=placeOf(L,W,H,k); const g=ctx.createLinearGradient(0,P.y,0,P.y+P.h); L.stops.forEach(([o,c])=>g.addColorStop(o,c));
      ctx.fillStyle=g; ctx.fillRect(P.x,P.y,P.w,P.h);
    }else if(L.type==="img"){
      const im=await loadAsset(L.src); if(!im) continue;
      const P=placeOf(L,W,H,k,im.naturalWidth,im.naturalHeight);
      ctx.save(); ctx.globalAlpha=L.opacity??1; ctx.drawImage(im,P.x,P.y,P.w,P.h); ctx.restore();
    }else if(L.type==="imgmask"){   /* 裁一塊底圖 cover 貼滿，套放射狀遮罩（中心 a0 → 邊緣 a1），可指定混合模式 */
      const im=await loadAsset(L.src); if(!im) continue;
      const P=placeOf(L,W,H,k,im.naturalWidth,im.naturalHeight), t=coverDraw(im,L,P.w,P.h,"center"), tc=t.getContext("2d");
      tc.globalCompositeOperation="destination-in";
      const R=Math.hypot(t.width,t.height)/2, g=tc.createRadialGradient(t.width/2,t.height/2,R*L.r0,t.width/2,t.height/2,R*L.r1);
      g.addColorStop(0,`rgba(0,0,0,${L.a0})`); g.addColorStop(1,`rgba(0,0,0,${L.a1})`); tc.fillStyle=g; tc.fillRect(0,0,t.width,t.height);
      ctx.save(); ctx.globalAlpha=L.opacity??1; ctx.globalCompositeOperation=L.blend||"source-over"; ctx.drawImage(t,P.x,P.y); ctx.restore();
    }else if(L.type==="imgfade"){   /* 從主視覺底圖裁一塊 cover 鋪滿整寬，上下漸隱後貼上 */
      const im=await loadAsset(L.src); if(!im) continue;
      const P=placeOf(L,W,H,k), t=coverDraw(im,L,P.w,P.h,L.band), tc=t.getContext("2d");
      tc.globalCompositeOperation="destination-in";
      const g=tc.createLinearGradient(0,0,0,t.height); L.fade.forEach(([o,a])=>g.addColorStop(o,`rgba(0,0,0,${a})`)); tc.fillStyle=g; tc.fillRect(0,0,t.width,t.height);
      ctx.save(); ctx.globalAlpha=L.opacity??1; ctx.drawImage(t,P.x,P.y); ctx.restore();
    }
  }
  return cv;
}
/* 疊層快取：以尺寸為鍵，只留最近 4 組 */
const overlayCache=new Map();
function frameImage(fr,W,H){
  const key=`${fr.id}@${W}x${H}`;
  if(!overlayCache.has(key)){ overlayCache.set(key,renderOverlay(fr,W,H));
    if(overlayCache.size>2){ const old=overlayCache.keys().next().value; overlayCache.get(old).then(cv=>{ cv.width=cv.height=0; }); overlayCache.delete(old); } }   /* 全尺寸畫布很大，只留 2 組並立刻釋放 */
  return overlayCache.get(key);
}
const overlayUrl={};
function frameUrl(fr,W,H){   /* 疊層預覽（PNG blob URL）給取景畫面與縮圖用；預設直式 3:4 */
  W=W||1200; H=H||1600; const key=`${fr.id}@${W}x${H}`;
  return overlayUrl[key]||(overlayUrl[key]=frameImage(fr,W,H).then(cv=>new Promise(res=>cv.toBlob(b=>res(URL.createObjectURL(b)),"image/png"))));
}
const srcW=s=>s.videoWidth||s.naturalWidth||s.width, srcH=s=>s.videoHeight||s.naturalHeight||s.height;
/* 合成：畫布＝照片原尺寸（最長邊上限 4096）→ 疊框 → 日期行 */
async function compose(src,fr,opt,cv){
  cv=cv||document.createElement("canvas");
  let W=srcW(src), H=srcH(src); const m=Math.max(W,H); if(m>MAX_SIDE){ W=Math.round(W*MAX_SIDE/m); H=Math.round(H*MAX_SIDE/m); }
  cv.width=W; cv.height=H;
  const ctx=cv.getContext("2d");
  ctx.drawImage(src,0,0,W,H);
  ctx.drawImage(await frameImage(fr,W,H),0,0);
  const k=Math.min(W/DW,H/DH), t=fr.text, line2=(opt.line2||"").trim();
  if(line2){
    ctx.save(); ctx.fillStyle=t.color; ctx.textAlign="left"; ctx.textBaseline="alphabetic";
    ctx.shadowColor="rgba(0,0,0,.45)"; ctx.shadowBlur=18*k; ctx.shadowOffsetY=4*k;
    let fs=t.size*k; do{ ctx.font=`600 ${fs}px ${FONT}`; if(ctx.measureText(line2).width<=t.maxW*k) break; fs-=2; }while(fs>12);
    ctx.fillText(line2,t.x*k,H-t.yb*k); ctx.restore();
  }
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
  hbar(hdr,"無尾熊紀念照",{hero:{zh:"Taronga Zoo",en:"KOALA PHOTO"}});
  const K=S.koala; K.date=today();   /* 照片只印當天日期與 Taronga Zoo，不印姓名、不用選人 */
  const fr=FRAMES.find(f=>f.id===K.frame)||FRAMES[0];
  const el=document.createElement("div");
  el.className="pagepad";
  el.innerHTML=`<p class="vs">董事與無尾熊合照後，iPad 直接套上「星引南十字」紀念框，立即 AirDrop 到董事手機。全程離線。</p>
  <div class="koala2">
    <div>
      <div class="card">
        <div class="ct">${STAR} 紀念框</div>
        <div class="framenote"><div class="fbox"><img id="frthumb" alt=""></div>
          <div><div class="fn">${esc(fr.name)}</div><div class="fd">使用本次董事會主視覺的原始元素：星空底圖、南十字座、歌劇院、「星引南十字」標題字與雄獅 Logo。照片滿版、無邊框，自動印上日期（${esc(dateEN())} · ${esc(CONFIG.zooLine)}）。</div></div></div>
      </div>
      <h3 class="sect">已製作的紀念照</h3>
      <div class="gal" id="gal">讀取中…</div>
    </div>
    <div>
      <div class="card">
        <div class="ct">${STAR} 取景拍照</div>
        <div class="stagewrap"><div class="stage" id="stage">
          <video id="cam" playsinline muted autoplay style="left:0;top:0;width:100%;height:100%"></video>
          <img class="ov" id="ov" alt="">
          <div class="nocam" id="nocam" hidden></div>
          <button class="shutter" id="shot" title="拍照"></button>
        </div></div>
        <div class="camrow"></div>
        <div class="btnrow" style="justify-content:center">
          <label class="camlbl">${ic("camera",16)} 用相機 App 拍<input type="file" accept="image/*" capture="environment" id="fcap"></label>
          <label class="camlbl">${ic("photo",16)} 從相簿選<input type="file" accept="image/*" id="fpick"></label>
        </div>
      </div>
    </div>
  </div>`;
  scr.appendChild(el);

  let ovSeq=0;   /* 疊層預覽：只接受最新一次的結果，避免預設 3:4 版晚到蓋掉相機比例版 */
  const setOv=(W,H)=>{ const seq=++ovSeq; return frameUrl(fr,W,H).then(u=>{ const ov=el.querySelector("#ov"); if(ov&&seq===ovSeq) ov.src=u; return u; }); };
  setOv().then(u=>{ const th=el.querySelector("#frthumb"); if(th) th.src=u; });

  const video=el.querySelector("#cam"), nocam=el.querySelector("#nocam"), shot=el.querySelector("#shot"), stage=el.querySelector("#stage");
  let lastVw=0, lastVh=0;
  const fitStage=()=>{   /* 取景框比例＝相機畫面比例，所見即所得；轉向時 iPad 只發 resize 不發 loadedmetadata，所以兩個都掛 */
    const vw=video.videoWidth, vh=video.videoHeight; if(!vw||!vh||(vw===lastVw&&vh===lastVh)) return; lastVw=vw; lastVh=vh;
    stage.style.aspectRatio=`${vw} / ${vh}`;
    const sc=1600/Math.max(vw,vh); setOv(Math.round(vw*sc),Math.round(vh*sc));
  };
  video.addEventListener("loadedmetadata",fitStage); video.addEventListener("resize",fitStage);
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
    openCompose(snap);
  };
  const pick=async e=>{
    const f=e.target.files[0]; e.target.value=""; if(!f) return;
    try{ openCompose(await loadImage(f)); }catch(err){ toast("照片無法讀取"); }
  };
  el.querySelector("#fcap").onchange=pick;
  el.querySelector("#fpick").onchange=pick;
  renderGallery(el.querySelector("#gal"));
};
function koalaOpt(){
  return { line2:[dateEN(),CONFIG.zooLine].filter(Boolean).join(" · ") };
}
function openCompose(src){
  const fr=FRAMES.find(f=>f.id===S.koala.frame)||FRAMES[0];
  const opt=koalaOpt();
  let file=null;
  openModal("紀念照預覽",`<div class="compose">
      <canvas id="cc"></canvas>
      <div class="hint" id="chint">合成中…</div>
    </div>`,
    [["重拍","ghost",closeModal],
     [`${ic("check",16)} 存入紀念照`,"sec",async()=>{ await ensureFile(); await savePhoto(file,fr); toast("已存入紀念照"); }],
     [`${ic("share",16)} 分享／AirDrop`,"pri",async()=>{
        await ensureFile();
        const ok=await shareFile(file,"星引南十字 · Taronga Zoo");
        if(ok){ await savePhoto(file,fr); toast("已分享並存入紀念照"); }
     }]]);
  const cv=$("#cc");
  const ready=compose(src,fr,opt,cv).then(()=>{ const h=$("#chint"); if(h) h.textContent=`照片以原尺寸輸出 ${cv.width}×${cv.height}，不裁切`; return makeFile(); });
  async function makeFile(){ const b=await toBlob(cv); file=new File([b],`TarongaZoo_${stamp()}.jpg`,{type:"image/jpeg"}); }
  async function ensureFile(){ await ready; if(!file) await makeFile(); }
}
const stamp=()=>{ const d=new Date(); return `${today()}_${String(d.getHours()).padStart(2,"0")}${String(d.getMinutes()).padStart(2,"0")}${String(d.getSeconds()).padStart(2,"0")}`; };
async function savePhoto(file,fr){
  const d=new Date(), label=`紀念照 ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;   /* 日期由 .gt 顯示，標題只放時間 */
  await idbPut("photos",{ id:"k"+Date.now(), name:label, guest:"", frame:fr.id, blob:file, ts:Date.now() });
  const gal=$("#gal"); if(gal) renderGallery(gal);
}
async function renderGallery(box){
  const list=(await idbAll("photos")).sort((a,b)=>b.ts-a.ts);
  box.innerHTML=list.length?"":`<div class="vs" style="grid-column:1/-1">尚無紀念照。拍一張就會出現在這裡，之後隨時可以重新分享。</div>`;
  list.forEach(rec=>{
    const u=URL.createObjectURL(rec.blob);
    const g=document.createElement("div");
    g.className="gi";
    g.innerHTML=`<img src="${u}" alt=""><div class="gn">${esc(rec.name)}</div><div class="gt">${new Date(rec.ts).toLocaleDateString("zh-TW",{year:"numeric",month:"numeric",day:"numeric"})}</div>`;
    g.onclick=()=>openModal(rec.name,`<img src="${u}" style="max-width:100%;max-height:62dvh;display:block;margin:0 auto;border-radius:12px">`,
      [["刪除","ghost",()=>confirmBox(`刪除「${rec.name}」這張紀念照？`,async()=>{ await idbDel("photos",rec.id); renderGallery(box); toast("已刪除"); })],
       ["關閉","sec",closeModal],
       [`${ic("share",16)} 分享／AirDrop`,"pri",()=>{ const f=rec.blob instanceof File?rec.blob:new File([rec.blob],`TarongaZoo_${String(rec.name).replace(/\D/g,"")}.jpg`,{type:"image/jpeg"}); shareFile(f,`${rec.name} · Taronga Zoo`); }]]);
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
    <p class="vs" style="margin-top:16px">版本 tle-syd-v10 · 主視覺「星引南十字」（元素在 img/kv/）。出團日期在 app.js 的 CONFIG 設定（待補）。</p>`;
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
