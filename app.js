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
};
const ic=(n,s)=>`<svg class="ic" viewBox="0 0 24 24" style="font-size:${s||18}px">${P[n]||""}</svg>`;

/* ============================================================ CONFIG（待補處不自行填） */
const CONFIG = {
  tour:   "雪梨董事會",
  dates:  "",                   /* 出團日期，例 "2026/xx/xx – xx/xx"，待補 */
  logo:   "",                   /* 公司 Logo 檔名（放在 app/ 內，例 "logo.png"），待補；空白＝紀念照不印 Logo */
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
  s.opera ??= {}; s.koala ??= { frame:"harbour", guest:"", name:"", date:"" }; if(s.koala.frame==="white") s.koala.frame="koala";
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
  hdr.innerHTML=`<div class="hbar">
    <div class="hleft">${back?`<button class="backbtn">${ic("back",16)}</button>`:""}</div>
    <div class="htitle">${esc(title)}</div>
    <div class="hright">${right}</div>
  </div>`;
  const bk=hdr.querySelector(".backbtn");
  if(bk) bk.onclick=()=>goPage(null);
}
function openModal(title,body,btns,cls){
  const mb=$("#mbox");
  mb.className="mbox"+(cls?" "+cls:"");
  mb.innerHTML=`<div class="mh"><span class="t">${esc(title)}</span><button class="x">✕</button></div>
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
  hdr.innerHTML=`<div class="hbar">
    <div class="brand"><div class="lion">獅</div><div class="bt"><div class="b1">導領e化平台</div><div class="b2">LEADER iPAD</div></div></div>
    <div class="hright"><button class="iconbtn" id="setbtn">${ic("gear",20)}</button></div>
  </div>`;
  hdr.querySelector("#setbtn").onclick=()=>goPage("settings");
  const hero=document.createElement("div");
  hero.className="hero";
  hero.innerHTML=`<div class="hk">帶團中</div><div class="hn">${esc(CONFIG.tour)}</div>
    <div class="hd">${CONFIG.dates?esc(CONFIG.dates):`出團日期 <span class="todo">待補</span>`} · 雪梨 Sydney</div>`;
  scr.appendChild(hero);
  const el=document.createElement("div");
  el.className="pagepad";
  const tiles=[
    ["wine",  "wine",   "1","喜鳳台",     "電子酒單",     "iPad 呈現酒單，董事自行瀏覽選擇，取代紙本"],
    ["drinks","cup",    "2","Rockpool",   "飲品點選",     "董事點選飲品，彙總後一次交給服務生"],
    ["koala", "camera", "3","Taronga Zoo","無尾熊紀念照", "拍照套上專屬紀念框，AirDrop 送到董事手機", true],
    ["zoo",   "map",    "4","Taronga Zoo","園區地圖",     "官方地圖可縮放，Keeper Talk 時刻一鍵定位"],
  ];
  el.innerHTML=`<div class="tiles">${tiles.map(([id,icn,no,place,tt,td,main])=>`
    <div class="tile${main?" main":""}" data-p="${id}">
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
    ${show.length?"":`<div class="placeholder-page"><div class="big">🍷</div><div class="tt">此分類尚無品項</div></div>`}
    ${show.map((w,i)=>`<div class="wine" data-i="${i}">
      <div class="wimg">${w.img?`<img src="${esc(w.img)}" alt="">`:(w.cat.includes("香檳")?"🥂":w.cat.includes("白")?"🥂":w.cat.includes("紅")?"🍷":w.cat.includes("烈")?"🥃":"🥤")}</div>
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
PAGES.drinks=(hdr,scr)=>{
  hbar(hdr,"Rockpool · 飲品點選");
  const gs=guests(), ds=drinks();
  const counts={};
  gs.forEach(g=>{ const o=S.orders[g]; if(o&&o.drink){ const k=`${o.drink}|${o.temp||""}`; counts[k]=(counts[k]||0)+1; } });
  const n=Object.values(counts).reduce((a,b)=>a+b,0);
  const el=document.createElement("div");
  el.className="pagepad";
  el.innerHTML=`<p class="vs">董事於 iPad 瀏覽飲品並點選；領隊按「給服務生看」把英文彙總一次交給 Rockpool 服務生。${ds.length&&gs.length?"":"（名單或飲品尚未設定，請到「設定」頁填入）"}</p>
  <div class="card"><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:9px">
      <b style="font-size:14px;flex:1">📊 彙總（共 ${n} 杯）</b>
      <button class="btn pri" id="waiter" ${n?"":"disabled"}>${ic("team",16)} 給服務生看</button></div>
    <div class="ordsum">${Object.entries(counts).map(([k,c])=>{ const [d,t]=k.split("|"); return `<div class="oi">${esc(d)}${t?` <span class="pill gray">${t}</span>`:""} × <b>${c}</b></div>`; }).join("")||`<span style="color:#8E8E93;font-size:13px">尚無點選</span>`}</div></div>
  <div class="card"><div style="font-weight:800;margin-bottom:6px;font-size:14px">董事點選</div><div id="rows"></div></div>
  <button class="btn sec" id="clr">清空全部</button>`;
  const rows=el.querySelector("#rows");
  gs.forEach(g=>{
    const o=S.orders[g];
    const r=document.createElement("div");
    r.className="ordrow";
    r.innerHTML=`<span class="who">${esc(g)}</span>
      <span class="what">${o&&o.drink?`${esc(o.drink)}${o.temp?`（${o.temp}）`:""}${o.note?` · ${esc(o.note)}`:""}`:"尚未點選"}</span>
      <button class="btn ${o&&o.drink?"sec":"pri"}" style="padding:7px 14px;font-size:13px">${o&&o.drink?"修改":"點選"}</button>`;
    r.querySelector("button").onclick=()=>openOrderModal(g);
    rows.appendChild(r);
  });
  el.querySelector("#clr").onclick=()=>confirmBox("清空全部飲品點選？",()=>{ S.orders={}; save(); render(); toast("已清空"); });
  el.querySelector("#waiter").onclick=()=>{
    const enRows=Object.entries(counts).map(([k,c])=>{ const [d,t]=k.split("|"); const dd=ds.find(x=>x.zh===d); return {en:dd?dd.en:d, t:TEMP_EN[t]||"", c}; });
    openModal("For the waiter · 給服務生看",`<div class="waiter"><h2>Drinks Order</h2><div class="sub">${esc(CONFIG.tour)} · ${gs.length} guests · ${n} drinks</div>
      ${enRows.map(r=>`<div class="wrow"><b>${r.c}</b><span>${esc(r.en)}</span>${r.t?`<span class="wt">${r.t}</span>`:""}</div>`).join("")}
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
    <div class="field"><label>備註（可空）</label><input type="text" id="onote" value="${esc(sel.note||"")}" placeholder="例：少冰、不加糖"></div>
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
/* 紀念框：1600×2000（4:5）無邊框設計。照片滿版，疊上漸層、AI 生成去背素材（img/*.webp）與文字。
 * 疊層只算一次（renderOverlay），同時供即時取景畫面、縮圖與合成使用。 */
const FW=1600, FH=2000;
const FONT='"PingFang TC","Microsoft JhengHei","Noto Sans TC",system-ui,sans-serif';
const FULL={x:0,y:0,w:FW,h:FH};
function bridgeSvg(){ /* 雪梨港灣大橋剪影（夕陽框用） */
  const deck=1950, top=1830, x0=40, x1=1560, cx=800, hw=760;
  const arch=x=>deck-(deck-top)*(1-Math.pow((x-cx)/hw,2));
  let d=`M${x0} ${deck}`;
  for(let x=x0;x<=x1;x+=20) d+=` L${x} ${arch(x).toFixed(1)}`;
  let hang="";
  for(let x=160;x<=1440;x+=80) hang+=`M${x} ${arch(x).toFixed(1)} V${deck} `;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${FW}" height="${FH}" viewBox="0 0 ${FW} ${FH}">
    <g stroke="#FFFFFF" stroke-opacity=".42" fill="none" stroke-linecap="round">
    <path d="${d}" stroke-width="8"/><path d="M${x0} ${deck} H${x1}" stroke-width="5"/><path d="${hang}" stroke-width="2"/>
    <rect x="20" y="${deck-90}" width="44" height="120" fill="#FFFFFF" fill-opacity=".42" stroke="none"/>
    <rect x="1536" y="${deck-90}" width="44" height="120" fill="#FFFFFF" fill-opacity=".42" stroke="none"/></g></svg>`;
}
const CAP_ZOO="TARONGA ZOO · SYDNEY", CAP_SYD="SYDNEY · AUSTRALIA";
const FRAMES=[
  { id:"harbour", name:"海港夜色",
    text:{align:"right",x:1500,nameY:1800,line2Y:1868,nameColor:"#FFFFFF",line2Color:"#E2C77A",nameSize:92,line2Size:38,maxW:860,shadow:true},
    logo:{x:1300,y:1892,w:200,h:80},
    layers:[
      {type:"scrim",y0:1100,y1:2000,stops:[[0,"rgba(11,37,69,0)"],[0.45,"rgba(11,37,69,.74)"],[1,"rgba(11,37,69,.97)"]]},
      {type:"scrim",y0:0,y1:460,stops:[[0,"rgba(11,37,69,.5)"],[1,"rgba(11,37,69,0)"]]},
      {type:"img",src:"img/sparkle.webp",x:880,y:30,w:720,h:720,opacity:.8},
      {type:"img",src:"img/opera.webp",x:80,y:1700,w:600,opacity:1},
      {type:"caption",text:CAP_SYD,x:1500,y:1676,align:"right",color:"rgba(226,199,122,.9)",size:27,spacing:8},
      {type:"rule",x0:620,x1:1500,y:1700,color:"rgba(226,199,122,.5)"},
    ]},
  { id:"euca", name:"尤加利",
    text:{align:"left",x:100,nameY:1800,line2Y:1868,nameColor:"#2F4A33",line2Color:"#6B7F6E",nameSize:92,line2Size:38,maxW:980},
    logo:{x:100,y:1892,w:200,h:80},
    layers:[
      {type:"scrim",y0:1250,y1:2000,stops:[[0,"rgba(250,247,240,0)"],[0.5,"rgba(250,247,240,.86)"],[1,"rgba(250,247,240,.98)"]]},
      {type:"img",src:"img/euca.webp",x:-150,y:-130,w:780,opacity:.96},
      {type:"img",src:"img/euca.webp",x:1120,y:1500,w:580,opacity:.92,flip:true},
      {type:"caption",text:CAP_ZOO,x:100,y:1700,align:"left",color:"#4F6F52",size:27,spacing:10},
    ]},
  { id:"koala", name:"無尾熊",
    text:{align:"left",x:100,nameY:1800,line2Y:1868,nameColor:"#333336",line2Color:"#8E8E93",nameSize:92,line2Size:38,maxW:900},
    logo:{x:100,y:1892,w:200,h:80},
    layers:[
      {type:"scrim",y0:1320,y1:2000,stops:[[0,"rgba(255,255,255,0)"],[0.45,"rgba(255,255,255,.9)"],[1,"rgba(255,255,255,1)"]]},
      {type:"img",src:"img/koala.webp",x:1030,y:1500,w:540,opacity:1},
      {type:"caption",text:CAP_ZOO,x:100,y:1700,align:"left",color:"#8E8E93",size:27,spacing:10},
    ]},
  { id:"sunset", name:"雪梨夕陽",
    text:{align:"center",x:800,nameY:1770,line2Y:1838,nameColor:"#FFFFFF",line2Color:"#FFF3E0",nameSize:92,line2Size:38,maxW:1200,shadow:true},
    logo:{x:1300,y:30,w:200,h:80},
    layers:[
      {type:"scrim",y0:1050,y1:2000,stops:[[0,"rgba(244,132,95,0)"],[0.5,"rgba(214,96,98,.62)"],[1,"rgba(91,63,140,.96)"]]},
      {type:"img",src:"img/sparkle.webp",x:0,y:1200,w:1600,h:800,opacity:.5},
      {type:"svg",svg:bridgeSvg},
      {type:"caption",text:CAP_SYD,x:800,y:1690,align:"center",color:"rgba(255,255,255,.85)",size:27,spacing:8},
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
}
async function renderOverlay(fr){
  const cv=document.createElement("canvas"); cv.width=FW; cv.height=FH;
  const ctx=cv.getContext("2d");
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
  const fit=(txt,size,weight)=>{ let s=size; do{ ctx.font=`${weight} ${s}px ${FONT}`; if(ctx.measureText(txt).width<=t.maxW) break; s-=4; }while(s>24); };
  const name=(opt.name||"").trim(), line2=(opt.line2||"").trim();
  if(name){ ctx.fillStyle=t.nameColor; fit(name,t.nameSize,900); ctx.fillText(name,t.x,t.nameY); }
  if(line2){ ctx.fillStyle=t.line2Color; fit(line2,t.line2Size,600); ctx.fillText(line2,t.x,name?t.line2Y:t.nameY-10); }
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
  const K=S.koala; if(!K.date) K.date=today();
  const fr=FRAMES.find(f=>f.id===K.frame)||FRAMES[0];
  const el=document.createElement("div");
  el.className="pagepad";
  el.innerHTML=`<p class="vs">董事與無尾熊合照後，iPad 直接套上專屬紀念框，立即 AirDrop 到董事手機。全程離線；四款無邊框紀念框的插畫素材為出發前以 AI 生成。</p>
  <div class="koala2">
    <div>
      <div class="card">
        <div style="font-weight:800;font-size:14px;margin-bottom:10px">① 這張是誰的</div>
        <div class="field"><label>董事</label><select id="kg"><option value="">— 自行輸入 —</option>${guests().map(g=>`<option${K.guest===g?" selected":""}>${esc(g)}</option>`).join("")}</select></div>
        <div class="field"><label>照片上的姓名（可改、可留空）</label><input type="text" id="kn" value="${esc(K.name)}" placeholder="例：王大明 董事"></div>
        <div class="field" style="margin-bottom:0"><label>日期</label><input type="text" id="kd" value="${esc(K.date)}"></div>
      </div>
      <div class="card">
        <div style="font-weight:800;font-size:14px;margin-bottom:6px">② 選紀念框</div>
        <div class="frames" id="frs">${FRAMES.map(f=>`<div class="fr${f.id===fr.id?" on":""}" data-f="${f.id}"><div class="fbox"><img data-f="${f.id}" alt=""></div><div class="fn">${esc(f.name)}</div></div>`).join("")}</div>
      </div>
    </div>
    <div>
      <div class="card">
        <div style="font-weight:800;font-size:14px;margin-bottom:10px">③ 取景拍照</div>
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
  kd.oninput=()=>{ K.date=kd.value; save(); };
  el.querySelectorAll(".fr").forEach(f=>f.onclick=()=>{ K.frame=f.dataset.f; save(); render(); });
  FRAMES.forEach(f=>frameUrl(f).then(u=>{ const im=el.querySelector(`.fbox img[data-f="${f.id}"]`); if(im) im.src=u; }));
  frameUrl(fr).then(u=>{ const ov=el.querySelector("#ov"); if(ov) ov.src=u; });

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

/* ============================================================ 4 園區地圖（Taronga Zoo 官方地圖） */
const ZOO_IMG="img/zoomap.webp", ZOO_W=4048, ZOO_H=2863;
/* 格線中心像素座標（由官方地圖 PDF 的格線文字位置算出）：欄 1–17、列 A–M */
const ZOO_COLS={1:92,2:276,3:460,4:644,5:828,6:1012,7:1196,8:1380,9:1564,10:1748,11:1932,12:2116,13:2300,14:2484,15:2669,16:2852,17:3037};
const ZOO_ROWS={A:94,B:284,C:477,D:667,E:859,F:1053,G:1242,H:1434,I:1626,J:1818,K:2010,L:2203,M:2394};
function gridXY(ref){
  const m=/^(\d{1,2})([A-M])$/i.exec(String(ref).trim()); if(!m) return null;
  const x=ZOO_COLS[+m[1]], y=ZOO_ROWS[m[2].toUpperCase()]; return x&&y?{x,y}:null;
}
/* 官方地圖右欄 Presentations, Talks & Encounters（時刻以當日現場公告為準）：時間、名稱、中文、格線 */
const ZOO_TALKS=[
  ["10:40am","Rhino Keeper Talk","犀牛","12F"],
  ["11:00am","Reptile Keeper Talk","爬蟲 · ARC Roof","8H"],
  ["11:00am","Seals for the Wild","海獅表演","9F"],
  ["11:00am–12:55pm","Koala Encounter","無尾熊近距離合照 · 票券於 Top Plaza Shop（7L）購買","3K"],
  ["11:30am","Meerkat Keeper Talk","狐獴","14I"],
  ["12:00pm","Lion Keeper Talk","獅子","16K"],
  ["12:00pm","Free Flight Birds","飛鳥表演","16G"],
  ["12:15pm","Chimpanzee Keeper Talk","黑猩猩","14K"],
  ["1:00pm","Dingo Keeper Talk","澳洲野犬","4J"],
  ["1:20pm","Giraffe Keeper Talk","長頸鹿 · Waterhole","12I"],
  ["1:40pm","Capybara Keeper Talk","水豚","8I"],
  ["2:00pm","Seals for the Wild","海獅表演","9F"],
  ["2:00pm","Farmyard Feed","農場餵食","3C"],
  ["2:15pm","Cassowary Keeper Talk","食火雞","7I"],
  ["2:20pm","Gorilla Keeper Talk","大猩猩","10G"],
  ["2:30pm","Koala Keeper Talk","無尾熊","4J"],
  ["2:40pm","Penguin Keeper Talk","企鵝","9E"],
  ["3:00pm","Free Flight Birds","飛鳥表演","16G"],
];
/* 快速定位：名稱、格線（多個以逗號分隔）。格線代號取自官方地圖圖例；標「約」者為依地圖位置估計 */
const ZOO_SPOTS=[
  ["無尾熊合照 Koala Encounter","3K"],
  ["購票 Top Plaza Shop","7L"],
  ["正門 Main Entrance（約）","4L"],
  ["Zoo Entry（約）","9K"],
  ["渡輪 Ferry（約）","15A"],
  ["Sky Safari 下站（約）","6L"],
  ["廁所 Toilets","5D,7L,4J,8D,11E,11H,12G"],
  ["火車站 Train Station","6F,10K"],
  ["咖啡／餐飲 Café","7L,12G,5E"],
  ["Selfie with a View","12K,5E,15E,16G"],
  ["飲水 Water Refill","8L,10L,11F,12J,10I,16G,5D,3C,4K"],
  ["公車站 Bus Stop","4M,15B"],
];
PAGES.zoo=(hdr,scr)=>{
  hbar(hdr,"Taronga Zoo · 園區地圖");
  const page=document.createElement("div");
  page.className="zoopage";
  page.innerHTML=`<div class="zoochips">${ZOO_SPOTS.map((s,i)=>{ const refs=s[1].split(","); return `<button class="zchip" data-i="${i}">${esc(s[0])}<b>${esc(refs[0])}${refs.length>1?` +${refs.length-1}`:""}</b></button>`; }).join("")}</div>
    <div class="mapwrap" id="mapwrap">
      <div class="maplayer" id="maplayer"><img src="${ZOO_IMG}" width="${ZOO_W}" height="${ZOO_H}" alt="Taronga Zoo map"><div id="pins"></div></div>
      <div class="mapctl"><button id="zin" title="放大">＋</button><button id="zout" title="縮小">－</button><button id="zfit" style="font-size:12.5px">全圖</button></div>
      <div class="maphint">雙指縮放 · 拖曳移動 · 點兩下放大</div>
    </div>
    <div class="sched" id="sched">
      <div class="sh">🕐 Keeper Talks & Encounters<span style="font-weight:600">（官方地圖時刻，以現場公告為準）</span><span class="cnt">${ZOO_TALKS.length} 場 ▾</span></div>
      <div class="sl">${ZOO_TALKS.map((t,i)=>`<div class="srow" data-i="${i}"><span class="st">${esc(t[0])}</span><span class="sn">${esc(t[1])}<small>${esc(t[2])}</small></span><span class="sg">${esc(t[3])}</span></div>`).join("")}</div>
    </div>`;
  scr.appendChild(page);

  const wrap=page.querySelector("#mapwrap"), layer=page.querySelector("#maplayer"), pins=page.querySelector("#pins");
  const MAX=2.5;
  let sc=0.2, tx=0, ty=0, minSc=0.1;
  const apply=()=>{ layer.style.transform=`translate(${tx}px,${ty}px) scale(${sc})`; pins.querySelectorAll(".pin").forEach(p=>p.style.transform=`scale(${1/sc})`); };
  const clamp=()=>{ const W=wrap.clientWidth,H=wrap.clientHeight,w=ZOO_W*sc,h=ZOO_H*sc;
    tx = w<=W ? (W-w)/2 : Math.min(0,Math.max(W-w,tx));
    ty = h<=H ? (H-h)/2 : Math.min(0,Math.max(H-h,ty)); };
  const fit=()=>{ const W=wrap.clientWidth,H=wrap.clientHeight; if(!W||!H) return; sc=Math.min(W/ZOO_W,H/ZOO_H); minSc=sc; clamp(); apply(); };
  const zoomAt=(f,cx,cy)=>{ const ns=Math.min(Math.max(sc*f,minSc),MAX), k=ns/sc; tx=cx-(cx-tx)*k; ty=cy-(cy-ty)*k; sc=ns; clamp(); apply(); };
  const goTo=(x,y,s)=>{ const W=wrap.clientWidth,H=wrap.clientHeight; sc=Math.min(Math.max(s||Math.max(minSc*2.6,0.42),minSc),MAX); tx=W/2-x*sc; ty=H/2-y*sc; clamp(); apply(); };
  const showPins=(refs,label)=>{
    const pts=refs.map(r=>({r,p:gridXY(r)})).filter(o=>o.p);
    pins.innerHTML=pts.map(o=>`<div class="pin pulse" style="left:${o.p.x}px;top:${o.p.y}px"><span class="pinlbl">${esc(label)} ${esc(o.r)}</span></div>`).join("");
    if(!pts.length) return;
    if(pts.length===1) goTo(pts[0].p.x,pts[0].p.y);
    else{ const xs=pts.map(o=>o.p.x),ys=pts.map(o=>o.p.y); const x0=Math.min(...xs)-250,x1=Math.max(...xs)+250,y0=Math.min(...ys)-250,y1=Math.max(...ys)+250;
      const s=Math.min(wrap.clientWidth/(x1-x0),wrap.clientHeight/(y1-y0)); goTo((x0+x1)/2,(y0+y1)/2,s); }
  };
  /* 手勢：單指拖曳、雙指縮放、點兩下放大；桌機滾輪縮放 */
  const pts=new Map(); let start=null, lastTap=0, moved=false;
  const snap=()=>{ const a=[...pts.values()]; if(a.length>=2) return {n:2,d:Math.hypot(a[1].x-a[0].x,a[1].y-a[0].y),mx:(a[0].x+a[1].x)/2,my:(a[0].y+a[1].y)/2,sc,tx,ty};
    if(a.length===1) return {n:1,x:a[0].x,y:a[0].y,tx,ty}; return null; };
  wrap.addEventListener("pointerdown",e=>{ e.preventDefault(); wrap.setPointerCapture(e.pointerId); pts.set(e.pointerId,{x:e.clientX,y:e.clientY}); start=snap(); moved=false; });
  wrap.addEventListener("pointermove",e=>{
    if(!pts.has(e.pointerId)) return;
    pts.set(e.pointerId,{x:e.clientX,y:e.clientY}); const cur=snap(); if(!start||!cur||cur.n!==start.n){ start=snap(); return; }
    const r=wrap.getBoundingClientRect();
    if(cur.n===2){ const ns=Math.min(Math.max(start.sc*cur.d/start.d,minSc),MAX), k=ns/start.sc, mx=start.mx-r.left, my=start.my-r.top;
      tx=mx-(mx-start.tx)*k+(cur.mx-start.mx); ty=my-(my-start.ty)*k+(cur.my-start.my); sc=ns; moved=true; }
    else{ const dx=cur.x-start.x, dy=cur.y-start.y; if(Math.hypot(dx,dy)>6) moved=true; tx=start.tx+dx; ty=start.ty+dy; }
    clamp(); apply();
  });
  const up=e=>{
    if(!pts.has(e.pointerId)) return;
    pts.delete(e.pointerId);
    if(pts.size===0 && !moved){ const now=Date.now(); const r=wrap.getBoundingClientRect();
      if(now-lastTap<320){ zoomAt(sc>minSc*1.8?minSc/sc:2.4,e.clientX-r.left,e.clientY-r.top); lastTap=0; } else lastTap=now; }
    start=snap();
  };
  wrap.addEventListener("pointerup",up); wrap.addEventListener("pointercancel",up);
  wrap.addEventListener("wheel",e=>{ e.preventDefault(); const r=wrap.getBoundingClientRect(); zoomAt(e.deltaY<0?1.15:1/1.15,e.clientX-r.left,e.clientY-r.top); },{passive:false});
  page.querySelector("#zin").onclick=()=>zoomAt(1.4,wrap.clientWidth/2,wrap.clientHeight/2);
  page.querySelector("#zout").onclick=()=>zoomAt(1/1.4,wrap.clientWidth/2,wrap.clientHeight/2);
  page.querySelector("#zfit").onclick=()=>{ pins.innerHTML=""; page.querySelectorAll(".zchip.on,.srow.hi").forEach(x=>x.classList.remove("on","hi")); fit(); };
  page.querySelectorAll(".zchip").forEach(c=>c.onclick=()=>{
    const s=ZOO_SPOTS[+c.dataset.i]; page.querySelectorAll(".zchip").forEach(x=>x.classList.toggle("on",x===c)); page.querySelectorAll(".srow.hi").forEach(x=>x.classList.remove("hi"));
    showPins(s[1].split(","),s[0].replace(/（約）/,""));
  });
  const sched=page.querySelector("#sched");
  sched.querySelector(".sh").onclick=()=>sched.classList.toggle("open");
  page.querySelectorAll(".srow").forEach(r=>r.onclick=()=>{
    const t=ZOO_TALKS[+r.dataset.i]; page.querySelectorAll(".srow").forEach(x=>x.classList.toggle("hi",x===r)); page.querySelectorAll(".zchip.on").forEach(x=>x.classList.remove("on"));
    showPins([t[3]],`${t[0]} ${t[1]}`);
  });
  requestAnimationFrame(fit);
  const img=layer.querySelector("img"); img.onload=()=>{ if(!pins.children.length) fit(); };
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
    <div class="btnrow"><button class="btn pri" id="sv">儲存</button><button class="btn sec" id="exp">匯出紀錄</button><button class="btn sec" id="rst" style="color:var(--red)">重置全部</button></div>
    <p class="vs" style="margin-top:16px">版本 tle-syd-v1 · 出團日期與 Logo 在 app.js 的 CONFIG 設定（待補）。</p>`;
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
  try{ render(); }
  catch(e){
    console.error(e);
    document.getElementById("screen").innerHTML=
      '<div class="placeholder-page"><div class="big">⚠️</div><div class="tt">載入發生問題</div>'+
      '<div class="dd">'+String(e&&e.message||e)+'</div></div>';
  }
  if(location.protocol!=="file:" && "serviceWorker" in navigator){
    try{ await navigator.serviceWorker.register("sw.js"); }catch(e){ console.warn("SW 註冊失敗",e); }
  }
})();
