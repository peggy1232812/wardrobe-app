'use client';

import { useState, useRef, useCallback, useEffect } from "react";

/* ─── TOKENS ────────────────────────────────────────────────── */
const C = {
  obsidian:"#121212", surface:"#1E1E1E", card:"#252525",
  gold:"#C5A059", goldLight:"#D4AF37", goldDim:"#7A6030",
  goldGlow:"rgba(197,160,89,0.18)", goldLine:"rgba(197,160,89,0.25)",
  text:"#F2EDE6", textSub:"#9A9590", textMuted:"#5A5550",
  border:"rgba(255,255,255,0.07)", red:"#E05555", redDim:"rgba(224,85,85,0.15)",
};

/* ─── SEED DATA ─────────────────────────────────────────────── */
const ITEMS_INIT = [
  {id:1,  name:"Silk Slip Dress",     brand:"Totême",         cat:"洋裝", price:1850, worn:7,  emoji:"·", color:"#6B4E71"},
  {id:2,  name:"Tailored Blazer",     brand:"The Row",        cat:"外套", price:4200, worn:12, emoji:"·", color:"#2C2C2C"},
  {id:3,  name:"Cashmere Knit",       brand:"Loro Piana",     cat:"上衣", price:2800, worn:18, emoji:"·", color:"#C4A882"},
  {id:4,  name:"Wide-leg Trousers",   brand:"Lemaire",        cat:"下著", price:1580, worn:9,  emoji:"·", color:"#4A4440"},
  {id:5,  name:"Ballet Flats",        brand:"Repetto",        cat:"鞋履", price:980,  worn:22, emoji:"·", color:"#D4A5A5"},
  {id:6,  name:"Structured Tote",     brand:"Polène",         cat:"配件", price:1250, worn:30, emoji:"·", color:"#8B7355"},
  {id:7,  name:"Linen Shirt Dress",   brand:"Arket",          cat:"洋裝", price:620,  worn:4,  emoji:"·", color:"#E8DCC8"},
  {id:8,  name:"Leather Mini Skirt",  brand:"Saint Laurent",  cat:"下著", price:3500, worn:2,  emoji:"·", color:"#1A1A1A"},
  {id:9,  name:"Slingback Heels",     brand:"Manolo Blahnik", cat:"鞋履", price:5200, worn:1,  emoji:"·", color:"#C8A882"},
  {id:10, name:"Pearl Drop Earrings", brand:"Mikimoto",       cat:"配件", price:6800, worn:5,  emoji:"·", color:"#F0EDE8"},
];
const DIARY_INIT = {
  "2026-05-20":{note:"Brand strategy meeting", itemIds:[2,3,4,6], photo:null},
  "2026-05-18":{note:"Brunch at Le Bernardin", itemIds:[1,5,10],  photo:null},
  "2026-05-15":{note:"Board presentation",     itemIds:[2,4,9,10],photo:null},
};
const CATS   = ["全部","上衣","下著","外套","洋裝","鞋履","配件"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];


// Currency/Language config
const CURRENCY_OPTIONS = [
  { code:"TWD", symbol:"NT$",  label:"台幣",   country:"🇹🇼 台灣",    lang:"zh-TW", rate:1        },
  { code:"MYR", symbol:"RM",   label:"馬幣",   country:"🇲🇾 馬來西亞", lang:"zh-TW", rate:0.1408   },
  { code:"AUD", symbol:"A$",   label:"澳幣",   country:"🇦🇺 澳大利亞", lang:"zh-TW", rate:0.0496   },
  { code:"EUR", symbol:"€",    label:"歐元",   country:"🇮🇪 愛爾蘭",  lang:"zh-TW", rate:0.0286   },
  { code:"HKD", symbol:"HK$",  label:"港幣",   country:"🇭🇰 香港",   lang:"zh-TW", rate:0.244    },
  { code:"CNY", symbol:"¥",    label:"人民幣",  country:"🇨🇳 中國",   lang:"zh-CN", rate:0.224    },
];
let _currency = CURRENCY_OPTIONS[0];
const setCurrencyGlobal = (c) => { _currency = c; };
const convertPrice = (twdAmt) => {
  const v = twdAmt * _currency.rate;
  if (_currency.code === "TWD") return Math.round(v).toLocaleString();
  return v >= 1000 ? Math.round(v).toLocaleString() : v.toFixed(1).replace(/\.0$/, "");
};
const fmt = n => _currency.symbol + " " + convertPrice(n);

async function fetchLiveRates() {
  try {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/TWD");
    if (!res.ok) return;
    const data = await res.json();
    const r = data.rates;
    CURRENCY_OPTIONS.forEach(c => {
      if (r[c.code] !== undefined) c.rate = r[c.code];
    });
    const cur = CURRENCY_OPTIONS.find(x => x.code === _currency.code);
    if (cur) _currency = { ..._currency, rate: cur.rate };
  } catch {}
}
const cpw = i => i.worn > 0 ? Math.round(i.price / i.worn) : i.price;

/* ─── GLOBAL CSS ────────────────────────────────────────────── */
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;margin:0;padding:0}
  ::-webkit-scrollbar{display:none}
  body{background:#121212}
  input,textarea,select{font-family:inherit;background:transparent;outline:none;border:none;font-size:16px}
  button{font-family:inherit;cursor:pointer;border:none;background:none}
  input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes scaleIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}
  @keyframes slideUp{from{opacity:0;transform:translateY(50px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes splashIn{0%{opacity:0;transform:scale(0.88) translateY(20px)}60%{opacity:1;transform:scale(1.03) translateY(-4px)}100%{opacity:1;transform:scale(1) translateY(0)}}
  @keyframes splashFade{0%{opacity:1}100%{opacity:0;pointer-events:none}}
  @keyframes waveIn{0%{opacity:0;transform:translateY(18px)}100%{opacity:1;transform:translateY(0)}}
  @keyframes shimmerGold{0%{background-position:-200% center}100%{background-position:200% center}}
  .fadeUp{animation:fadeUp .35s ease both}
  .scaleIn{animation:scaleIn .25s ease both}
  .slideUp{animation:slideUp .32s cubic-bezier(.32,.72,0,1) both}
`;

/* ─── SPLASH SCREEN ─────────────────────────────────────────── */
const ORBS = [
  { color:"#f4a7c3", size:220, x:"-10%",  y:"-8%",   dur:7  },
  { color:"#c5a0f5", size:180, x:"65%",   y:"-5%",   dur:9  },
  { color:"#f9c784", size:150, x:"75%",   y:"55%",   dur:6  },
  { color:"#80d4f7", size:200, x:"-15%",  y:"60%",   dur:8  },
  { color:"#f4a7c3", size:100, x:"45%",   y:"75%",   dur:11 },
  { color:"#a8e6cf", size:130, x:"10%",   y:"30%",   dur:10 },
  { color:"#ffd6e0", size:160, x:"55%",   y:"20%",   dur:7.5},
  { color:"#b5ead7", size:90,  x:"80%",   y:"80%",   dur:9  },
  { color:"#c7ceea", size:140, x:"20%",   y:"82%",   dur:8  },
  { color:"#ffb7b2", size:110, x:"38%",   y:"-12%",  dur:6.5},
];

function SplashScreen({ onDone }) {
  const TAGLINE = "Your digital wardrobe ✨";
  const [showTag,  setShowTag]  = useState(false);
  const [showBtn,  setShowBtn]  = useState(false);
  const [leaving,  setLeaving]  = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowTag(true), 900);
    const t2 = setTimeout(() => setShowBtn(true), 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleEnter = () => {
    setLeaving(true);
    setTimeout(onDone, 620);
  };

  return (
    <div
      onClick={handleEnter}
      style={{
        position:"fixed", inset:0, zIndex:999,
        background:"#0e0a12",
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        overflow:"hidden",
        transition: leaving ? "opacity .6s ease" : "none",
        opacity: leaving ? 0 : 1,
        cursor:"pointer",
      }}
    >
      {ORBS.map((o, i) => (
        <div key={i} style={{
          position:"absolute",
          left:o.x, top:o.y,
          width:o.size, height:o.size,
          borderRadius:"50%",
          background:`radial-gradient(circle at 40% 40%, ${o.color}55 0%, ${o.color}00 70%)`,
          filter:"blur(38px)",
          animation:`spin ${o.dur}s linear infinite`,
          opacity:0.6,
        }}/>
      ))}
      <div style={{position:"relative",zIndex:10,textAlign:"center"}}>
        <h1 style={{fontSize:48,fontFamily:"'Cormorant Garamond',serif",fontWeight:300,color:C.text,marginBottom:8,animation:"fadeUp .5s ease both"}}>WARDROBE</h1>
        {showTag && <p style={{fontSize:14,color:C.textSub,letterSpacing:2,animation:"fadeUp .5s ease both"}}>{TAGLINE}</p>}
        {showBtn && <button onClick={handleEnter} style={{marginTop:32,padding:"12px 24px",border:`1px solid ${C.gold}`,borderRadius:6,color:C.gold,fontSize:12,letterSpacing:2,cursor:"pointer",transition:"all .3s ease",animation:"fadeUp .5s ease both"}} onMouseEnter={e=>e.target.style.background=C.goldGlow} onMouseLeave={e=>e.target.style.background="none"}>ENTER</button>}
      </div>
    </div>
  );
}

function LoginScreen({ onLogin, accounts, setAccounts }) {
  const [newName, setNewName] = useState("");

  return (
    <div style={{position:"fixed",inset:0,zIndex:998,background:C.obsidian,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <style>{G}</style>
      <h2 style={{fontSize:24,fontFamily:"'Cormorant Garamond',serif",color:C.gold,marginBottom:32}}>Select Account</h2>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:32}}>
        {accounts.map(acc=>(
          <button key={acc.id} onClick={()=>onLogin(acc.name)} style={{padding:"12px 24px",border:`1px solid ${C.gold}`,borderRadius:8,color:C.text,fontSize:14,cursor:"pointer",transition:"all .3s",background:C.card}}>{acc.avatar} {acc.name}</button>
        ))}
      </div>
      <div style={{display:"flex",gap:8}}>
        <input type="text" value={newName} onChange={e=>setNewName(e.target.value)} placeholder="New account name" style={{padding:"8px 12px",border:`1px solid ${C.border}`,borderRadius:6,color:C.text,background:C.surface}}/>
        <button onClick={()=>{if(newName){setAccounts([...accounts,{id:Math.max(...accounts.map(a=>a.id))+1,name:newName,avatar:"👤"}]);setNewName("");onLogin(newName);}}} style={{padding:"8px 12px",border:`1px solid ${C.gold}`,borderRadius:6,color:C.gold,cursor:"pointer"}}>Add</button>
      </div>
    </div>
  );
}

function ItemImg({item,size=40}){return <div style={{width:size,height:size,borderRadius:8,background:item.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size/2,color:C.text}}>{item.emoji}</div>;}

function OOTDTab({items,diary,setDiary,setItems,onOpenLog}){
  const [expanded,setExpanded]=useState(null);
  const entries=Object.entries(diary).sort((a,b)=>new Date(b[0])-new Date(a[0]));
  return <div style={{padding:"16px",paddingTop:0}}>
    <h2 style={{fontSize:16,fontFamily:"'Cormorant Garamond',serif",color:C.gold,marginBottom:16}}>OOTD Journal</h2>
    {entries.map(([date,ootd])=>{const d=new Date(date);const formatted=`${MONTHS[d.getMonth()]} ${d.getDate()}`;return <div key={date} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:12,cursor:"pointer"}} onClick={()=>setExpanded(expanded===date?null:date)}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={{fontSize:12,color:C.gold}}>{formatted}</span>
        <span style={{fontSize:12,color:C.textMuted}}>{ootd.itemIds.length} items</span>
      </div>
      <p style={{fontSize:13,color:C.text,marginBottom:expanded===date?12:0}}>{ootd.note}</p>
      {expanded===date && <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {ootd.itemIds.map(id=>{const item=items.find(i=>i.id===id);return item?<div key={id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}><ItemImg item={item} size={48}/><span style={{fontSize:9,color:C.textMuted,textAlign:"center",maxWidth:48}}>{item.name}</span></div>:null;})}
      </div>}
    </div>;})}
  </div>;
}

function ProfileTab({items,setItems,onOpenLog,username,setUsername,onLogout,accounts,setAccounts}){
  const total=items.reduce((sum,i)=>sum+i.price,0);
  const totalWorn=items.reduce((sum,i)=>sum+i.worn,0);
  const [hidden,setHidden]=useState(false);
  const top5=[...items].sort((a,b)=>cpw(a)-cpw(b)).slice(0,5);
  const cold5=[...items].sort((a,b)=>a.worn-b.worn).slice(0,5);
  const catCounts=CATS.map(cat=>({cat,count:cat==="全部"?items.length:items.filter(i=>i.cat===cat).length}));
  const maxC=Math.max(...catCounts.map(d=>d.count));
  return <div style={{padding:"16px"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
      <h2 style={{fontSize:18,fontFamily:"'Cormorant Garamond',serif",color:C.gold}}>PROFILE</h2>
      <button onClick={onLogout} style={{fontSize:11,color:C.textMuted,border:`1px solid ${C.border}`,borderRadius:4,padding:"6px 12px",cursor:"pointer"}}>Logout</button>
    </div>
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px",marginBottom:20}}>
      <div style={{fontSize:10,color:C.textMuted,letterSpacing:2,marginBottom:8}}>ACCOUNT</div>
      <div style={{fontSize:16,color:C.text,fontFamily:"'Cormorant Garamond',serif",marginBottom:16}}>{username}</div>
      <input type="text" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Edit name" style={{width:"100%",padding:"8px",border:`1px solid ${C.border}`,borderRadius:6,color:C.text,background:C.surface,marginBottom:12}}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
      {[{label:"總金額",value:hidden?"••••":fmt(total)},{label:"平均每件成本",value:hidden?"••••":fmt(Math.round(total/Math.max(items.length,1)))},{label:"平均單次費用",value:hidden?"••••":(totalWorn>0?fmt(Math.round(total/totalWorn)):"—")},{label:"總穿著次數",value:hidden?"••••":totalWorn}].map(d=><div key={d.label} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px"}}><div style={{fontSize:9,color:C.textMuted,letterSpacing:2,marginBottom:6}}>{d.label}</div><div style={{fontSize:14,color:C.text}}>{d.value}</div></div>)}
    </div>
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"20px",marginBottom:14}}>
      <div style={{fontSize:10,color:C.gold,letterSpacing:4,marginBottom:18}}>類別分佈</div>
      {catCounts.filter(d=>d.count>0).map(d=><div key={d.cat} style={{marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:11,color:C.textSub}}>{d.cat}</span><span style={{fontSize:11,color:C.textMuted}}>{d.count}</span></div><div style={{height:3,background:C.surface,borderRadius:2}}><div style={{height:"100%",borderRadius:2,width:`${(d.count/maxC)*100}%`,background:`linear-gradient(90deg,${C.goldDim},${C.gold})`}}/></div></div>)}
    </div>
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"20px",marginBottom:14}}>
      <div style={{fontSize:10,color:C.gold,letterSpacing:4,marginBottom:5}}>高 CP 值 TOP 5</div>
      <div style={{fontSize:9,color:C.textMuted,marginBottom:16,letterSpacing:1}}>單次穿著成本最低</div>
      {top5.map((item,i)=><div key={item.id} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:`1px solid ${C.border}`}}><div style={{fontSize:11,color:C.gold,width:16,textAlign:"center"}}>#{i+1}</div><ItemImg item={item} size={28}/><div style={{flex:1}}><div style={{fontSize:12,color:C.text}}>{item.name}</div><div style={{fontSize:9,color:C.textMuted,marginTop:2}}>{item.brand} · ×{item.worn}</div></div><div style={{fontSize:11,color:C.gold}}>{hidden?"••":fmt(cpw(item))}<span style={{fontSize:9,color:C.textMuted,marginLeft:3}}>/次</span></div></div>)}
    </div>
  </div>;
}

function BottomNav({tab,setTab,onAddItem,onAddOOTD}){
  return <div style={{position:"absolute",bottom:0,left:0,right:0,height:82,display:"flex",alignItems:"flex-start",justifyContent:"space-around",background:`linear-gradient(180deg,transparent,${C.obsidian})`,borderTop:`1px solid ${C.border}`,paddingTop:8}}>
    <button onClick={()=>setTab("ootd")} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,color:tab==="ootd"?C.gold:C.textMuted,fontSize:11}}>📔 OOTD</button>
    <button onClick={onAddItem} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,color:C.gold,fontSize:11}}>➕ ADD</button>
    <button onClick={()=>setTab("profile")} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,color:tab==="profile"?C.gold:C.textMuted,fontSize:11}}>👤 ME</button>
  </div>;
}

function AddSheet({onClose,onAddItem}){
  const [name,setName]=useState("");
  const [brand,setBrand]=useState("");
  const [cat,setCat]=useState("上衣");
  const [price,setPrice]=useState("");
  const [color,setColor]=useState("#C4A882");
  const handleSave=()=>{if(name&&price){onAddItem({id:Math.random(),name,brand,cat,price:parseInt(price),worn:0,emoji:"·",color});onClose();}};
  return <div style={{position:"fixed",inset:0,zIndex:500,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-end"}} onClick={onClose}>
    <div style={{width:"100%",background:C.obsidian,border:`1px solid ${C.border}`,borderRadius:"16px 16px 0 0",padding:"24px",animation:"slideUp .3s ease"}} onClick={e=>e.stopPropagation()}>
      <h3 style={{fontSize:16,color:C.gold,marginBottom:16}}>ADD NEW ITEM</h3>
      <input type="text" placeholder="Item name" value={name} onChange={e=>setName(e.target.value)} style={{width:"100%",padding:"10px",marginBottom:12,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.text}}/>
      <input type="text" placeholder="Brand" value={brand} onChange={e=>setBrand(e.target.value)} style={{width:"100%",padding:"10px",marginBottom:12,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.text}}/>
      <select value={cat} onChange={e=>setCat(e.target.value)} style={{width:"100%",padding:"10px",marginBottom:12,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.text}}>
        {CATS.slice(1).map(c=><option key={c} value={c}>{c}</option>)}
      </select>
      <input type="number" placeholder="Price (TWD)" value={price} onChange={e=>setPrice(e.target.value)} style={{width:"100%",padding:"10px",marginBottom:12,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.text}}/>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        <input type="color" value={color} onChange={e=>setColor(e.target.value)} style={{width:50,height:40,border:`1px solid ${C.border}`,borderRadius:6,cursor:"pointer"}}/>
        <div style={{flex:1,background:color,borderRadius:6,border:`1px solid ${C.border}`}}/>
      </div>
      <button onClick={handleSave} style={{width:"100%",padding:"12px",background:C.gold,color:C.obsidian,borderRadius:8,fontWeight:500,cursor:"pointer"}}>Save</button>
    </div>
  </div>;
}

function LogModal({items,preSelected=[],onClose,onSave}){
  const [selected,setSelected]=useState(preSelected);
  const [note,setNote]=useState("");
  const toggle=id=>setSelected(selected.includes(id)?selected.filter(x=>x!==id):[...selected,id]);
  return <div style={{position:"fixed",inset:0,zIndex:500,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-end"}} onClick={onClose}>
    <div style={{width:"100%",background:C.obsidian,border:`1px solid ${C.border}`,borderRadius:"16px 16px 0 0",padding:"24px",maxHeight:"80vh",overflowY:"auto",animation:"slideUp .3s ease"}} onClick={e=>e.stopPropagation()}>
      <h3 style={{fontSize:16,color:C.gold,marginBottom:16}}>LOG TODAY</h3>
      <textarea placeholder="What happened today?" value={note} onChange={e=>setNote(e.target.value)} style={{width:"100%",padding:"10px",marginBottom:16,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,minHeight:60,resize:"none"}}/>
      <div style={{marginBottom:16}}>
        <div style={{fontSize:12,color:C.textMuted,marginBottom:12}}>SELECT ITEMS</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(80px,1fr))",gap:8}}>
          {items.map(item=><div key={item.id} onClick={()=>toggle(item.id)} style={{padding:12,background:selected.includes(item.id)?C.gold:C.surface,border:`1px solid ${selected.includes(item.id)?C.gold:C.border}`,borderRadius:8,cursor:"pointer",textAlign:"center"}}><ItemImg item={item} size={32}/><div style={{fontSize:9,color:selected.includes(item.id)?C.obsidian:C.textMuted,marginTop:4}}>{item.name}</div></div>)}
        </div>
      </div>
      <button onClick={()=>onSave(selected,note,null)} style={{width:"100%",padding:"12px",background:C.gold,color:C.obsidian,borderRadius:8,fontWeight:500,cursor:"pointer"}}>Save Log</button>
    </div>
  </div>;
}

export default function App() {
  const [screen,setScreen]=useState("splash");
  const [username,setUsername]=useState("");
  const [accounts,setAccounts]=useState(ACCOUNTS_DEFAULT);
  const [tab,setTab]=useState("ootd");
  const [items,setItems]=useState(ITEMS_INIT);
  const [diary,setDiary]=useState(DIARY_INIT);
  const [showAddItem,setShowAddItem]=useState(false);
  const [showAddOOTD,setShowAddOOTD]=useState(false);
  const [logModal,setLogModal]=useState(null);

  useEffect(()=>{fetchLiveRates();},[]);

  const openLog=preSelected=>setLogModal({preSelected});
  const saveLog=(itemIds,note,photo)=>{
    const today=new Date().toISOString().split("T")[0];
    setDiary(p=>({...p,[today]:{itemIds,note,photo}}));
    setItems(p=>p.map(i=>itemIds.includes(i.id)?{...i,worn:i.worn+1}:i));
    setLogModal(null);
  };

  return <div style={{background:C.obsidian,color:C.text,width:"100%",maxWidth:480,margin:"0 auto",position:"relative",height:"100svh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
    <style>{G}</style>
    <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:1,opacity:0.025,backgroundImage:'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',backgroundSize:"200px"}}/>
    <div style={{height:1,background:`linear-gradient(90deg,transparent,${C.gold},transparent)`,flexShrink:0,position:"relative",zIndex:2}}/>
    {screen==="app" && <>
      <div style={{flex:1,minHeight:0,overflowY:"auto",overflowX:"hidden",position:"relative",zIndex:2,paddingBottom:82}}>
        {tab==="ootd" && <OOTDTab items={items} diary={diary} setDiary={setDiary} setItems={setItems} onOpenLog={openLog}/>}
        {tab==="profile" && <ProfileTab items={items} setItems={setItems} onOpenLog={openLog} username={username} setUsername={setUsername} onLogout={()=>setScreen("login")} accounts={accounts} setAccounts={setAccounts}/>}
      </div>
      <div style={{flexShrink:0,position:"relative",zIndex:200}}>
        <BottomNav tab={tab} setTab={setTab} onAddItem={()=>setShowAddItem(true)} onAddOOTD={()=>setShowAddOOTD(true)}/>
      </div>
      {showAddItem && <AddSheet onClose={()=>setShowAddItem(false)} onAddItem={i=>setItems(p=>[i,...p])}/>}
      {showAddOOTD && <LogModal items={items} preSelected={[]} onClose={()=>setShowAddOOTD(false)} onSave={saveLog}/>}
      {logModal && <LogModal items={items} preSelected={logModal.preSelected} onClose={()=>setLogModal(null)} onSave={saveLog}/>}
    </>}
    {screen==="splash" && <SplashScreen onDone={()=>setScreen("login")}/>}
    {screen==="login" && <LoginScreen onLogin={name=>{setUsername(name);setScreen("app");}} accounts={accounts} setAccounts={setAccounts}/>}
  </div>;
}
