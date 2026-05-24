'use client';

import { useState, useRef, useCallback, useEffect } from "react";

const C = {
  obsidian: "#121212", surface: "#1E1E1E", card: "#252525",
  gold: "#C5A059", goldLight: "#D4AF37", goldDim: "#7A6030",
  goldGlow: "rgba(197,160,89,0.18)", goldLine: "rgba(197,160,89,0.25)",
  text: "#F2EDE6", textSub: "#9A9590", textMuted: "#5A5550",
  border: "rgba(255,255,255,0.07)", red: "#E05555", redDim: "rgba(224,85,85,0.15)",
};

const ITEMS_INIT = [
  { id: 1, name: "Silk Slip Dress", brand: "Totême", cat: "洋裝", price: 18500, worn: 7, color: "#d4a5a5" },
  { id: 2, name: "Tailored Blazer", brand: "The Row", cat: "外套", price: 42000, worn: 12, color: "#4a4a4a" },
  { id: 3, name: "Cashmere Knit", brand: "Loro Piana", cat: "上衣", price: 28000, worn: 18, color: "#e8d7c3" },
  { id: 4, name: "Wide-leg Trousers", brand: "Lemaire", cat: "下著", price: 15800, worn: 9, color: "#3a3a3a" },
  { id: 5, name: "Ballet Flats", brand: "Repetto", cat: "鞋履", price: 9800, worn: 22, color: "#d4a5a5" },
  { id: 6, name: "Structured Tote", brand: "Polène", cat: "配件", price: 12500, worn: 30, color: "#8b7355" },
  { id: 7, name: "Linen Shirt Dress", brand: "Arket", cat: "洋裝", price: 6200, worn: 4, color: "#f5f1e8" },
  { id: 8, name: "Leather Mini Skirt", brand: "Saint Laurent", cat: "下著", price: 35000, worn: 2, color: "#1a1a1a" },
  { id: 9, name: "Slingback Heels", brand: "Manolo Blahnik", cat: "鞋履", price: 52000, worn: 1, color: "#8b4513" },
  { id: 10, name: "Pearl Drop Earrings", brand: "Mikimoto", cat: "配件", price: 68000, worn: 5, color: "#f5f1e8" },
];

const DIARY_INIT = {
  "2026-05-20": { note: "Brand strategy meeting", itemIds: [2, 3, 4, 6], photo: null },
  "2026-05-18": { note: "Brunch at Le Bernardin", itemIds: [1, 5, 10], photo: null },
  "2026-05-15": { note: "Board presentation", itemIds: [2, 4, 9, 10], photo: null },
};

const CATS = ["全部", "上衣", "下著", "外套", "洋裝", "鞋履", "配件"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const CURRENCY_OPTIONS = [
  { code: "TWD", symbol: "NT$", label: "台幣", country: "🇹🇼 台灣", lang: "zh-TW", rate: 1 },
  { code: "MYR", symbol: "RM", label: "馬幣", country: "🇲🇾 馬來西亞", lang: "zh-TW", rate: 0.1408 },
  { code: "AUD", symbol: "A$", label: "澳幣", country: "🇦🇺 澳大利亞", lang: "zh-TW", rate: 0.0496 },
  { code: "EUR", symbol: "€", label: "歐元", country: "🇮🇪 愛爾蘭", lang: "zh-TW", rate: 0.0286 },
  { code: "HKD", symbol: "HK$", label: "港幣", country: "🇭🇰 香港", lang: "zh-TW", rate: 0.244 },
  { code: "CNY", symbol: "¥", label: "人民幣", country: "🇨🇳 中國", lang: "zh-CN", rate: 0.224 },
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

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; margin: 0; padding: 0; }
  ::-webkit-scrollbar { display: none; }
  body { background: #121212; }
  input, textarea, select { font-family: inherit; background: transparent; outline: none; border: none; font-size: 16px; color: #F2EDE6; }
  button { font-family: inherit; cursor: pointer; border: none; background: none; }
  input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  @keyframes loginShake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-8px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-8px); } 80% { transform: translateX(8px); } }
  @keyframes loginIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .fadeUp { animation: fadeUp 0.35s ease both; }
  .scaleIn { animation: scaleIn 0.25s ease both; }
  .slideUp { animation: slideUp 0.32s cubic-bezier(0.32, 0.72, 0, 1) both; }
`;

const ORBS = [
  { color: "#f4a7c3", size: 220, x: "-10%", y: "-8%", dur: 7 },
  { color: "#c5a0f5", size: 180, x: "65%", y: "-5%", dur: 9 },
  { color: "#f9c784", size: 150, x: "75%", y: "55%", dur: 6 },
  { color: "#80d4f7", size: 200, x: "-15%", y: "60%", dur: 8 },
];

function SplashScreen({ onDone }) {
  const [leaving, setLeaving] = useState(false);
  const handleEnter = () => { setLeaving(true); setTimeout(onDone, 600); };
  return (
    <div onClick={handleEnter} style={{ position: "fixed", inset: 0, zIndex: 999, background: "linear-gradient(135deg, #0e0a12 0%, #1a1420 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", transition: leaving ? "opacity .6s ease" : "none", opacity: leaving ? 0 : 1, cursor: "pointer" }}>
      {ORBS.map((o, i) => <div key={i} style={{ position: "absolute", left: o.x, top: o.y, width: o.size, height: o.size, borderRadius: "50%", background: `radial-gradient(circle at 40% 40%, ${o.color}55 0%, ${o.color}00 70%)`, filter: "blur(38px)", animation: `spin ${o.dur}s linear infinite`, opacity: 0.6 }} />)}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
        <h1 style={{ fontSize: 48, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "#F2EDE6", marginBottom: 8, animation: "fadeUp 0.5s ease both" }}>WARDROBE</h1>
        <p style={{ fontSize: 14, color: "#9A9590", letterSpacing: 1, marginBottom: 32, fontFamily: "'DM Sans', sans-serif", animation: "fadeUp 0.6s ease both" }}>Your digital wardrobe ✨</p>
        <button onClick={handleEnter} style={{ padding: "12px 24px", border: "1px solid #C5A059", borderRadius: 6, color: "#C5A059", fontSize: 12, letterSpacing: 2, cursor: "pointer", transition: "all 0.3s ease", animation: "fadeUp 0.7s ease both" }}>ENTER</button>
      </div>
    </div>
  );
}

const ACCOUNTS_DEFAULT = [
  { username: "Sylvia", password: "sylvia123" },
  { username: "Chu", password: "chu123" },
];

function LoginScreen({ onLogin, accounts, setAccounts }) {
  const [mode, setMode] = useState("login");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [shaking, setShaking] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [hiName, setHiName] = useState("");

  const shake = msg => { setErr(msg); setShaking(true); setTimeout(() => setShaking(false), 480); };
  const reset = () => { setUser(""); setPass(""); setPass2(""); setErr(""); setSuccess(""); };
  const switchMode = m => { setMode(m); reset(); };

  const submit = () => {
    if (!user.trim() || !pass) { shake("請填寫所有欄位"); return; }
    if (mode === "login") {
      const match = accounts.find(a => a.username.toLowerCase() === user.trim().toLowerCase() && a.password === pass);
      if (match) {
        setHiName(match.username);
        setTimeout(() => { setLeaving(true); setTimeout(() => onLogin(match.username), 560); }, 900);
      } else { shake("帳號或密碼不正確 "); }
    } else {
      if (pass.length < 4) { shake("密碼至少需要 4 個字元"); return; }
      if (pass !== pass2) { shake("兩次密碼不相符"); return; }
      const exists = accounts.find(a => a.username.toLowerCase() === user.trim().toLowerCase());
      if (exists) { setErr("此帳號名稱已被使用，請換一個"); setShaking(true); setTimeout(() => setShaking(false), 480); return; }
      const newAcc = { username: user.trim(), password: pass };
      setAccounts(p => [...p, newAcc]);
      setSuccess(`✓ 帳號 ${newAcc.username} 建立成功！`);
      setTimeout(() => { switchMode("login"); setUser(newAcc.username); }, 1400);
    }
  };

  const onKey = e => { if (e.key === "Enter") submit(); };

  if (hiName) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 998, background: "#0e0a12", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", transition: leaving ? "opacity .56s ease" : "none", opacity: leaving ? 0 : 1 }}>
        {ORBS.map((o, i) => <div key={i} style={{ position: "absolute", left: o.x, top: o.y, width: o.size, height: o.size, borderRadius: "50%", background: `radial-gradient(circle at 40% 40%, ${o.color}55 0%, ${o.color}00 70%)`, filter: "blur(38px)", animation: `spin ${o.dur}s linear infinite`, opacity: 0.6 }} />)}
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", animation: "loginIn .5s ease both" }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}> </div>
          <div style={{ fontSize: 36, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: C.gold, marginBottom: 8 }}>Hi, {hiName}</div>
          <div style={{ fontSize: 11, color: C.textMuted, letterSpacing: 4, fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>WELCOME BACK</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 998, background: "#0e0a12", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {ORBS.map((o, i) => <div key={i} style={{ position: "absolute", left: o.x, top: o.y, width: o.size, height: o.size, borderRadius: "50%", background: `radial-gradient(circle at 40% 40%, ${o.color}55 0%, ${o.color}00 70%)`, filter: "blur(38px)", animation: `spin ${o.dur}s linear infinite`, opacity: 0.6 }} />)}
      <style>{`@keyframes loginShake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-8px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-8px); } 80% { transform: translateX(8px); } } @keyframes loginIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }} />
      <div style={{ position: "relative", zIndex: 2, width: "88%", maxWidth: 360, animation: "loginIn .32s cubic-bezier(0.32, 0.72, 0, 1) both" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}><h2 style={{ fontSize: 24, fontFamily: "'Cormorant Garamond', serif", color: C.gold, marginBottom: 12 }}>選擇帳號</h2></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {accounts.map(acc => <button key={acc.username} onClick={() => { setUser(acc.username); setPass(acc.password); setErr(""); }} style={{ padding: "12px 24px", border: `1px solid ${C.gold}`, borderRadius: 8, color: C.text, fontSize: 14, cursor: "pointer", background: C.card, transition: "all 0.3s" }}>{acc.username}</button>)}
        </div>
        <div style={{ display: "flex", background: "rgba(30,30,30,0.7)", borderRadius: 30, padding: 4, marginBottom: 16 }}>
          {["login", "register"].map(m => <button key={m} onClick={() => switchMode(m)} style={{ flex: 1, padding: "9px 0", borderRadius: 26, background: mode === m ? `linear-gradient(135deg, ${C.gold}, ${C.goldLight})` : "transparent", color: mode === m ? C.obsidian : C.textMuted, fontSize: 12, fontWeight: mode === m ? 600 : 300, letterSpacing: 2, fontFamily: "'DM Sans', sans-serif", transition: "all .22s" }}>{m === "login" ? "登入" : "註冊"}</button>)}
        </div>
        <div style={{ background: "rgba(30,30,30,0.85)", border: `1px solid ${C.goldLine}`, borderRadius: 22, padding: "26px 24px 28px", animation: shaking ? "loginShake .45s ease" : "none" }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 7, fontFamily: "'DM Sans', sans-serif" }}>USERNAME</div>
            <input value={user} onChange={e => { setUser(e.target.value); setErr(""); }} onKeyDown={onKey} placeholder="輸入帳號" autoCapitalize="none" style={{ width: "100%", boxSizing: "border-box", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px" }} />
          </div>
          <div style={{ marginBottom: mode === "register" ? 14 : err || success ? 10 : 22 }}>
            <div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 7, fontFamily: "'DM Sans', sans-serif" }}>PASSWORD</div>
            <div style={{ position: "relative" }}>
              <input value={pass} onChange={e => { setPass(e.target.value); setErr(""); }} onKeyDown={onKey} placeholder="輸入密碼" type={showPw ? "text" : "password"} style={{ width: "100%", boxSizing: "border-box", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px" }} />
              <button onClick={() => setShowPw(p => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", color: C.textMuted, fontSize: 14, cursor: "pointer" }}>{showPw ? "🙈" : "👁️"}</button>
            </div>
          </div>
          {mode === "register" && <div style={{ marginBottom: err || success ? 10 : 22 }}><div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 7, fontFamily: "'DM Sans', sans-serif" }}>CONFIRM</div><input value={pass2} onChange={e => { setPass2(e.target.value); setErr(""); }} onKeyDown={onKey} placeholder="再次輸入密碼" type={showPw ? "text" : "password"} style={{ width: "100%", boxSizing: "border-box", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px" }} /></div>}
          {err && <div style={{ fontSize: 11, color: C.red, marginBottom: 14, fontFamily: "'DM Sans', sans-serif" }}>{err}</div>}
          {success && <div style={{ fontSize: 11, color: "#7ed87e", marginBottom: 14, fontFamily: "'DM Sans', sans-serif" }}>{success}</div>}
          <button onClick={submit} style={{ width: "100%", padding: "14px", background: user && pass ? `linear-gradient(135deg, ${C.gold}, ${C.goldLight})` : "rgba(197,160,89,0.2)", color: user && pass ? C.obsidian : C.textMuted, border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, letterSpacing: 2, fontFamily: "'DM Sans', sans-serif", cursor: user && pass ? "pointer" : "default", transition: "all .2s", boxShadow: user && pass ? `0 6px 22px rgba(197,160,89,0.35)` : "none" }}>{mode === "login" ? "進入衣櫃 →" : "建立帳號 →"}</button>
        </div>
      </div>
    </div>
  );
}

const IcoOOTD = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 10L12 4L17 10"/><path d="M5 14H19V20C19 21 18 22 17 22H7C6 22 5 21 5 20V14Z"/></svg>);
const IcoProfile = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M5 20C5 17 8 15 12 15C16 15 19 17 19 20"/></svg>);

function BottomNav({ tab, setTab, onAddItem, onAddOOTD }) {
  const [showMenu, setShowMenu] = useState(false);
  const NAV = [
    { key: "ootd", label: "OOTD", Icon: IcoOOTD },
    { key: "__add__", label: "", Icon: null },
    { key: "profile", label: "我", Icon: IcoProfile },
  ];
  return (
    <>
      {showMenu && <div style={{ position: "fixed", inset: 0, zIndex: 190, background: "rgba(0,0,0,0.6)" }} onClick={() => setShowMenu(false)}><div className="slideUp" onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: C.surface, borderRadius: "24px 24px 0 0", border: `1px solid ${C.goldLine}`, borderBottom: "none", padding: "20px 24px 48px" }}><div style={{ width: 36, height: 3, background: C.goldLine, borderRadius: 2, margin: "0 auto", marginBottom: 20 }} /><div style={{ fontSize: 13, color: C.textMuted, letterSpacing: 2, textAlign: "center", marginBottom: 16 }}>新增</div><div style={{ display: "flex", gap: 12 }}><button onClick={() => { setShowMenu(false); onAddOOTD(); }} style={{ flex: 1, padding: "16px", border: `1px solid ${C.goldLine}`, borderRadius: 12, color: C.text, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}><div style={{ fontSize: 20, marginBottom: 6 }}>📸</div>新增 OOTD</button><button onClick={() => { setShowMenu(false); onAddItem(); }} style={{ flex: 1, padding: "16px", border: `1px solid ${C.goldLine}`, borderRadius: 12, color: C.text, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}><div style={{ fontSize: 20, marginBottom: 6 }}>👗</div>新增單品</button></div></div></div>}
      <nav style={{ width: "100%", background: "rgba(18,18,18,0.97)", backdropFilter: "blur(24px)", borderTop: `1px solid ${C.goldLine}`, display: "flex", alignItems: "center", justifyContent: "space-around", padding: "10px 0 28px" }}>
        {NAV.map(n => {
          if (n.key === "__add__") return <button key="add" onClick={() => setShowMenu(m => !m)} style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`, color: C.obsidian, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", transform: "translateY(-14px)", boxShadow: `0 6px 28px rgba(197,160,89,0.55)` }}>+</button>;
          const active = tab === n.key;
          return <button key={n.key} onClick={() => setTab(n.key)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: active ? C.gold : C.textMuted, transition: "color .2s", padding: "0 32px" }}><n.Icon /><span style={{ fontSize: 9, letterSpacing: 1.5, fontFamily: "'DM Sans', sans-serif", fontWeight: active ? 600 : 300 }}>{n.label}</span>{active && <div style={{ width: 18, height: 1.5, background: C.gold, borderRadius: 1 }} />}</button>;
        })}
      </nav>
    </>
  );
}

function ItemImg({ item, size = 52 }) {
  if (item.img) return <img src={item.img} style={{ width: size, height: size, objectFit: "contain" }} alt={item.name} />;
  const initial = (item.brand || item.name || "?")[0].toUpperCase();
  return <div style={{ width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg, ${item.color}88, ${item.color}44)`, border: `1px solid ${item.color}66`, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: size * 0.38, color: "#F2EDE6", fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold" }}>{initial}</span></div>;
}

function ItemCard({ item, selMode, selected, onToggle, onClick, delay = 0 }) {
  const hasPic = !!item.img;
  return <div className="fadeUp" style={{ animationDelay: `${delay}ms` }} onClick={() => selMode ? onToggle(item.id) : onClick(item)}><div style={{ background: C.card, borderRadius: 16, border: `1px solid ${selected ? C.gold : C.border}`, position: "relative", overflow: "hidden", cursor: "pointer" }}>{selMode && <div style={{ position: "absolute", top: 9, left: 9, zIndex: 10, width: 22, height: 22, borderRadius: "50%", background: selected ? C.gold : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>{selected && <span style={{ color: C.obsidian, fontSize: 11, fontWeight: 700 }}>✓</span>}</div>}<div style={{ height: 160, background: hasPic ? "#0a0a0a" : `radial-gradient(ellipse at 50% 30%, ${item.color}33, transparent)`, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.img ? <img src={item.img} style={{ width: "100%", height: "100%", objectFit: "contain" }} alt={item.name} /> : <span style={{ fontSize: 36, color: "#F2EDE699", fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold" }}>{(item.brand || "?")[0].toUpperCase()}</span>}</div><div style={{ padding: "11px 13px 0" }}><div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 3, fontFamily: "'DM Sans', sans-serif" }}>{item.brand}</div><div style={{ fontSize: 13, color: C.text, fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}>{item.name}</div><div style={{ margin: "0 10px 11px", borderRadius: 8, background: "rgba(255,255,255,0.03)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>{[{ l: "次數", v: `${item.worn}×` }, { l: "原價", v: `${Math.round(item.price / 1000)}k` }, { l: "均次", v: fmt(cpw(item)) }].map((s, i) => <div key={s.l} style={{ textAlign: "center", padding: "6px 2px", borderLeft: i > 0 ? `1px solid ${C.border}` : "none" }}><div style={{ fontSize: 8, color: C.textMuted, letterSpacing: 1.5, marginBottom: 2, fontFamily: "'DM Sans', sans-serif" }}>{s.l}</div><div style={{ fontSize: 11, color: i === 0 ? C.gold : i === 2 ? C.goldLight : C.textSub, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{s.v}</div></div>)}</div></div></div></div>;
}

function DetailSheet({ item, items, onClose, onDelete, onLogWear, onAddWear }) {
  const idx = items.findIndex(i => i.id === item.id);
  const [cur, setCur] = useState(idx >= 0 ? idx : 0);
  const it = items[cur] || item;
  const goPrev = e => { e.stopPropagation(); setCur(c => Math.max(0, c - 1)); };
  const goNext = e => { e.stopPropagation(); setCur(c => Math.min(items.length - 1, c + 1)); };
  return <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.82)", display: "flex", alignItems: "flex-end" }} onClick={onClose}><div className="slideUp" onClick={e => e.stopPropagation()} style={{ background: C.surface, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto", borderRadius: "24px 24px 0 0" }}><div style={{ position: "sticky", top: 0, background: C.surface, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px" }}><button onClick={goPrev} disabled={cur === 0} style={{ color: cur === 0 ? C.textMuted : C.gold, fontSize: 22 }}>‹</button><div style={{ textAlign: "center" }}><div style={{ width: 38, height: 3, background: C.goldLine, borderRadius: 2, margin: "0 auto", marginBottom: 4 }} /><span style={{ fontSize: 9, color: C.textMuted, letterSpacing: 2, fontFamily: "'DM Sans', sans-serif" }}>{cur + 1} / {items.length}</span></div><button onClick={goNext} disabled={cur === items.length - 1} style={{ color: cur === items.length - 1 ? C.textMuted : C.gold, fontSize: 22 }}>›</button></div><div style={{ height: 240, background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>{it.img ? <img src={it.img} style={{ height: "100%", objectFit: "contain" }} alt={it.name} /> : <span style={{ fontSize: 80, color: "#F2EDE644", fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold" }}>{(it.brand || "?")[0].toUpperCase()}</span>}</div><div style={{ padding: "20px 24px 64px" }}><div style={{ fontSize: 10, color: C.gold, letterSpacing: 4, marginBottom: 5, fontFamily: "'DM Sans', sans-serif" }}>{it.brand}</div><div style={{ fontSize: 24, color: C.text, fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, marginBottom: 20 }}>{it.name}</div><div style={{ background: `linear-gradient(135deg, ${C.goldGlow}, transparent)`, border: `1px solid ${C.goldLine}`, borderRadius: 14, padding: "16px", display: "flex", justifyContent: "space-between", marginBottom: 20 }}><div><div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 5, fontFamily: "'DM Sans', sans-serif" }}>CP值</div><div style={{ fontSize: 26, color: C.text, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{fmt(cpw(it))}</div></div><div style={{ textAlign: "right" }}><div style={{ fontSize: 9, color: C.textMuted, letterSpacing: 2, marginBottom: 5, fontFamily: "'DM Sans', sans-serif" }}>頻率</div><div style={{ fontSize: 14, color: it.worn >= 15 ? C.gold : it.worn >= 8 ? C.goldLight : it.worn >= 3 ? C.textSub : C.textMuted, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{it.worn >= 15 ? "極高" : it.worn >= 8 ? "高" : it.worn >= 3 ? "中" : "低"}</div></div></div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>{[{ l: "類別", v: it.cat }, { l: "購入金額", v: fmt(it.price) }, { l: "使用次數", v: `${it.worn} 次` }].map(d => <div key={d.l} style={{ background: C.card, borderRadius: 10, padding: "12px 10px" }}><div style={{ fontSize: 8, color: C.textMuted, letterSpacing: 2, marginBottom: 5, fontFamily: "'DM Sans', sans-serif" }}>{d.l}</div><div style={{ fontSize: 11, color: C.text, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{d.v}</div></div>)}</div><button onClick={() => onAddWear(it.id)} style={{ width: "100%", padding: "16px", borderRadius: 12, marginBottom: 12, background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`, color: C.obsidian, fontSize: 15, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, letterSpacing: 2, boxShadow: `0 6px 24px rgba(197,160,89,0.42)` }}>＋ 增加使用次數</button><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}><button onClick={() => { onLogWear(it.id); onClose(); }} style={{ padding: "12px 0", borderRadius: 10, border: `1px solid ${C.goldLine}`, color: C.gold, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>記錄今日穿搭</button><button onClick={() => onDelete(it.id)} style={{ padding: "12px 0", borderRadius: 10, background: C.redDim, color: C.red, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>刪除單品</button></div><div style={{ background: C.card, borderRadius: 12, padding: "16px", border: `1px solid ${C.border}` }}><div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>成本預測</div>{[5, 10, 20].map(n => <div key={n} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ fontSize: 11, color: C.textSub, fontFamily: "'DM Sans', sans-serif" }}>再穿 {n} 次</span><span style={{ fontSize: 11, color: C.gold, fontFamily: "'DM Sans', sans-serif" }}>{fmt(Math.round(it.price / (it.worn + n)))}</span></div>)}</div></div></div></div>;
}

function ConfirmDelete({ count, onConfirm, onCancel }) {
  return <div style={{ position: "fixed", inset: 0, zIndex: 600, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}><div className="scaleIn" style={{ background: C.surface, borderRadius: 20, padding: "32px 28px" }}><div style={{ fontSize: 28, marginBottom: 14, color: C.red, fontFamily: "'DM Sans', sans-serif" }}>⚠️</div><div style={{ fontSize: 18, color: C.text, fontFamily: "'Cormorant Garamond', serif", marginBottom: 8 }}>刪除 {count} 件單品？</div><div style={{ fontSize: 11, color: C.textMuted, marginBottom: 26, fontFamily: "'DM Sans', sans-serif" }}>此操作無法復原</div><div style={{ display: "flex", gap: 10 }}><button onClick={onCancel} style={{ flex: 1, padding: "13px", borderRadius: 10, border: `1px solid ${C.border}`, color: C.textMuted, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>取消</button><button onClick={onConfirm} style={{ flex: 1, padding: "13px", borderRadius: 10, background: C.red, color: "#fff", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", fontWeight: 600 }}>確認刪除</button></div></div></div>;
}

function LogModal({ items, preSelected, onClose, onSave }) {
  const [sel, setSel] = useState(preSelected || []);
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState(null);
  const camRef = useRef();
  const galleryRef = useRef();
  const toggle = id => setSel(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const readFile = f => { if (!f) return; const r = new FileReader(); r.onload = ev => setPhoto(ev.target.result); r.readAsDataURL(f); };
  return <div style={{ position: "fixed", inset: 0, zIndex: 550, background: "rgba(0,0,0,0.82)", display: "flex", alignItems: "flex-end" }} onClick={onClose}><div className="slideUp" style={{ background: C.surface, borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480, border: `1px solid ${C.goldLine}`, borderBottom: "none", height: "90vh", overflowY: "auto", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}><div style={{ flexShrink: 0 }}><div style={{ textAlign: "center", padding: "14px 0 6px" }}><div style={{ width: 38, height: 3, background: C.goldLine, borderRadius: 2, margin: "0 auto" }} /></div><div style={{ padding: "0 24px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ fontSize: 22, color: C.text, fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}>記錄穿搭</div><button onClick={onClose} style={{ color: C.textMuted, fontSize: 20, cursor: "pointer" }}>✕</button></div></div><div style={{ flex: 1, overflowY: "auto", padding: "0 0 0 0" }}><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, padding: "0 24px 20px" }}>{items.map(item => { const isSel = sel.includes(item.id); return <button key={item.id} onClick={() => toggle(item.id)} style={{ padding: "12px", borderRadius: 12, border: `1px solid ${isSel ? C.gold : C.border}`, background: C.card, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}><ItemImg item={item} size={28} /><div style={{ overflow: "hidden" }}><div style={{ fontSize: 12, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div><div style={{ fontSize: 9, color: C.gold, fontFamily: "'DM Sans', sans-serif", letterSpacing: 1 }}>{item.brand}</div></div></button>; })}</div><div style={{ padding: "0 24px 20px" }}><div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>OOTD 照片</div>{photo ? <div style={{ borderRadius: 14, overflow: "hidden", marginBottom: 12, position: "relative", height: 160 }}><img src={photo} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} /><button onClick={() => setPhoto(null)} style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.65)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 10px", fontSize: 12, cursor: "pointer" }}>✕ 移除</button></div> : <div style={{ height: 80, background: C.card, border: `1.5px dashed ${C.goldDim}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}><div style={{ textAlign: "center", color: C.textMuted }}><div style={{ fontSize: 11, fontFamily: "'DM Sans', sans-serif", letterSpacing: 2, marginBottom: 4 }}>📷 點擊上傳</div><div style={{ fontSize: 10, fontFamily: "'DM Sans', sans-serif", letterSpacing: 1 }}>或使用下方按鈕</div></div></div>}<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}><button onClick={() => camRef.current.click()} style={{ padding: "12px 0", borderRadius: 10, border: `1px solid ${C.goldLine}`, color: C.gold, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>拍照</button><button onClick={() => galleryRef.current.click()} style={{ padding: "12px 0", borderRadius: 10, border: `1px solid ${C.border}`, color: C.textMuted, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>選圖片</button></div><input ref={camRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={e => readFile(e.target.files?.[0])} /><input ref={galleryRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => readFile(e.target.files?.[0])} /></div><div style={{ padding: "0 24px 20px" }}><div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>備註</div><input value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Team meeting, coffee date…" style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px", fontFamily: "'DM Sans', sans-serif", color: C.text }} /></div><div style={{ padding: "0 24px 60px" }}><button onClick={() => onSave(sel, note, photo)} disabled={sel.length === 0} style={{ width: "100%", padding: "15px", background: sel.length > 0 ? `linear-gradient(135deg, ${C.gold}, ${C.goldLight})` : C.card, color: sel.length > 0 ? C.obsidian : C.textMuted, borderRadius: 12, fontSize: 13, letterSpacing: 2, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, transition: "all .2s", cursor: sel.length > 0 ? "pointer" : "default" }}>記錄 ✓{sel.length > 0 ? ` (${sel.length} 件)` : ""}</button></div></div></div></div>;
}

function AddSheet({ onClose, onAddItem }) {
  return <div style={{ position: "fixed", inset: 0, zIndex: 600, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "flex-end" }}><div className="slideUp" style={{ background: C.surface, borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480 }}><ItemStep onBack={null} onClose={onClose} onAdd={onAddItem} /></div></div>;
}

function ItemStep({ onBack, onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", brand: "", cat: "上衣", price: "", img: null, color: "#d4a5a5" });
  const [tried, setTried] = useState(false);
  const fileRef = useRef();
  const camRef = useRef();
  const BRANDS = ["Totême", "The Row", "Lemaire", "Arket", "COS", "ZARA", "& Other Stories", "Saint Laurent"];
  const handleFile = useCallback(file => { if (!file) return; const r = new FileReader(); r.onload = ev => setForm(p => ({ ...p, img: ev.target.result })); r.readAsDataURL(file); }, []);
  const err = { name: tried && !form.name.trim(), brand: tried && !form.brand.trim(), price: tried && !form.price };
  const fb = e => `1px solid ${e ? "rgba(224,85,85,0.6)" : C.border}`;
  const submit = () => { setTried(true); if (!form.name.trim() || !form.brand.trim() || !form.price) return; onAdd({ ...form, id: Date.now(), price: parseInt(form.price) || 0, worn: 0 }); onClose(); };
  return <div style={{ padding: "0 24px 48px" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", marginBottom: 20 }}><div style={{ width: 38, height: 3, background: C.goldLine, borderRadius: 2 }} /><button onClick={onClose} style={{ color: C.textMuted, fontSize: 20, cursor: "pointer" }}>✕</button></div><div style={{ marginBottom: 20 }}><div style={{ fontSize: 9, color: C.gold, letterSpacing: 4, marginBottom: 3, fontFamily: "'DM Sans', sans-serif" }}>新增單品</div><div style={{ fontSize: 20, color: C.text, fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}>Add Item</div></div><div onClick={() => fileRef.current.click()} style={{ height: 180, background: "#0a0a0a", border: `1.5px dashed ${C.goldDim}`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, cursor: "pointer", position: "relative", overflow: "hidden" }}>{form.img ? <><img src={form.img} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} alt="preview" /><button onClick={e => { e.stopPropagation(); setForm(p => ({ ...p, img: null })); }} style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,0.7)", border: "none", color: "#fff", borderRadius: 8, padding: "4px 8px", fontSize: 10, cursor: "pointer" }}>移除</button></> : <div style={{ textAlign: "center" }}><div style={{ fontSize: 11, color: C.goldDim, letterSpacing: 3, marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>📷 上傳照片</div><div style={{ fontSize: 12, color: C.textSub, letterSpacing: 1, fontFamily: "'DM Sans', sans-serif" }}>或按下方按鈕</div></div>}</div><input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(e.target.files?.[0])} /><input ref={camRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={e => handleFile(e.target.files?.[0])} /><button onClick={() => camRef.current.click()} style={{ width: "100%", padding: "11px", marginBottom: 16, borderRadius: 10, border: `1px solid ${C.border}`, color: C.textMuted, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>📸 拍照</button>{[{ label: "品項名稱", key: "name", placeholder: "e.g. Silk Slip Dress", hasErr: err.name }, { label: "品牌", key: "brand", placeholder: "e.g. The Row", hasErr: err.brand }, { label: "購入金額 (NT$)", key: "price", placeholder: "0", hasErr: err.price, type: "number" }].map(f => <div key={f.key} style={{ marginBottom: 14 }}><div style={{ fontSize: 9, color: f.hasErr ? C.red : C.gold, letterSpacing: 3, marginBottom: 7, fontFamily: "'DM Sans', sans-serif" }}>{f.label}</div><input type={f.type || "text"} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ width: "100%", background: C.card, border: fb(f.hasErr), borderRadius: 10, padding: "10px", fontFamily: "'DM Sans', sans-serif", color: C.text }} />{f.hasErr && <div style={{ fontSize: 10, color: C.red, marginTop: 5, fontFamily: "'DM Sans', sans-serif" }}>必填欄位</div>}</div>)}<div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>{BRANDS.map(b => <button key={b} onClick={() => setForm(p => ({ ...p, brand: b }))} style={{ padding: "4px 12px", borderRadius: 20, border: `1px solid ${form.brand === b ? C.gold : C.border}`, color: form.brand === b ? C.gold : C.textMuted, fontSize: 10, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>{b}</button>)}</div><div style={{ marginBottom: 24 }}><div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>類別</div><div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>{CATS.slice(1).map(c => <button key={c} onClick={() => setForm(p => ({ ...p, cat: c }))} style={{ padding: "7px 16px", borderRadius: 20, fontSize: 11, border: `1px solid ${form.cat === c ? C.gold : C.border}`, color: form.cat === c ? C.obsidian : C.text, background: form.cat === c ? C.gold : "transparent", fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>{c}</button>)}</div></div><button onClick={submit} style={{ width: "100%", padding: 15, borderRadius: 12, background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`, color: C.obsidian, fontSize: 13, letterSpacing: 2, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: "pointer" }}>新增 →</button></div>;
}

function WardrobeInner({ items, setItems, onOpenLog, onBack }) {
  const [cat, setCat] = useState("全部");
  const [selMode, setSelMode] = useState(false);
  const [sel, setSel] = useState([]);
  const [detail, setDetail] = useState(null);
  const [confirmDel, setConfirmDel] = useState(false);
  const filtered = cat === "全部" ? items : items.filter(i => i.cat === cat);
  const toggleSel = id => setSel(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const allSel = filtered.length > 0 && filtered.every(i => sel.includes(i.id));
  const doDelete = () => { setItems(p => p.filter(i => !sel.includes(i.id))); setSel([]); setSelMode(false); };
  return <div style={{ paddingBottom: 20 }}><div style={{ padding: "22px 22px 0" }}><div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}><button onClick={onBack} style={{ color: C.gold, fontSize: 22, padding: "0 2px", flexShrink: 0, cursor: "pointer" }}>‹</button><div style={{ flex: 1 }}><div style={{ fontSize: 10, color: C.gold, letterSpacing: 5, marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>衣櫃</div><div style={{ fontSize: 28, color: C.text, fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}>{filtered.length} 件單品</div></div><div style={{ display: "flex", gap: 8 }}>{selMode ? <><button onClick={() => setSel(allSel ? [] : filtered.map(i => i.id))} style={{ fontSize: 11, color: C.gold, padding: "6px 12px", borderRadius: 20, border: `1px solid ${C.gold}`, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>{allSel ? "取消全選" : "全選"}</button>{sel.length > 0 && <button onClick={() => setConfirmDel(true)} style={{ fontSize: 11, color: C.red, padding: "6px 12px", borderRadius: 20, border: `1px solid ${C.red}`, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>刪除 ({sel.length})</button>}<button onClick={() => { setSelMode(false); setSel([]); }} style={{ fontSize: 11, color: C.textMuted, padding: "6px 12px", borderRadius: 20, border: `1px solid ${C.border}`, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>完成</button></> : <button onClick={() => setSelMode(true)} style={{ fontSize: 11, color: C.textSub, padding: "6px 12px", borderRadius: 20, border: `1px solid ${C.border}`, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>編輯</button>}</div></div><div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 14 }}>{CATS.map(c => <button key={c} onClick={() => setCat(c)} style={{ padding: "6px 16px", borderRadius: 20, fontSize: 11, border: `1px solid ${cat === c ? C.gold : C.border}`, color: cat === c ? C.obsidian : C.textMuted, background: cat === c ? C.gold : "transparent", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", whiteSpace: "nowrap" }}>{c}</button>)}</div></div><div style={{ padding: "0 22px 10px", fontSize: 10, color: C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{filtered.length > 0 ? `${filtered.length} 件` : "沒有單品"}</div><div style={{ padding: "0 22px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>{filtered.map((item, i) => <ItemCard key={item.id} item={item} selMode={selMode} selected={sel.includes(item.id)} onToggle={toggleSel} onClick={setDetail} delay={i * 30} />)}</div>{detail && <DetailSheet item={detail} items={filtered} onClose={() => setDetail(null)} onDelete={id => { setItems(p => p.filter(i => i.id !== id)); setDetail(null); }} onLogWear={id => onOpenLog([id])} onAddWear={id => { setItems(p => p.map(i => i.id === id ? { ...i, worn: i.worn + 1 } : i)); }} />}{confirmDel && <ConfirmDelete count={sel.length} onConfirm={doDelete} onCancel={() => setConfirmDel(false)} />}</div>;
}

function OOTDTab({ items, diary, setDiary, setItems, onOpenLog }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState(null);
  const [showLog, setShowLog] = useState(false);
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [...Array(firstDay).fill(null), ...Array(daysInMonth).fill(0).map((_, i) => i + 1)];
  const monthStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`;
  const dateKey = d => `${monthStr}-${String(d).padStart(2, "0")}`;
  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };
  const selEntry = selected ? diary[dateKey(selected)] : null;
  const selIds = selEntry?.itemIds || [];
  const saveLog = (itemIds, note, photo) => { const k = dateKey(selected || today.getDate()); setDiary(p => ({ ...p, [k]: { itemIds, note, photo } })); setItems(p => p.map(i => itemIds.includes(i.id) ? { ...i, worn: i.worn + 1 } : i)); setShowLog(false); };
  return <div style={{ paddingBottom: 20 }}><div style={{ padding: "28px 22px 0" }}><div style={{ fontSize: 11, color: C.textMuted, letterSpacing: 3, marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>日誌</div><div style={{ fontSize: 28, color: C.text, fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, marginBottom: 8 }}>OOTD</div><div style={{ fontSize: 11, color: C.textMuted, letterSpacing: 3, marginBottom: 20, fontFamily: "'DM Sans', sans-serif" }}>{MONTHS[viewMonth]} {viewYear}</div><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}><button onClick={prevMonth} style={{ color: C.gold, fontSize: 22, padding: "0 6px", cursor: "pointer" }}>‹</button><div style={{ fontSize: 14, color: C.text, letterSpacing: 4, fontFamily: "'Cormorant Garamond', serif" }}>{MONTHS[viewMonth]}</div><button onClick={nextMonth} style={{ color: C.gold, fontSize: 22, padding: "0 6px", cursor: "pointer" }}>›</button></div><div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 8 }}>{["日", "一", "二", "三", "四", "五", "六"].map(d => <div key={d} style={{ textAlign: "center", fontSize: 9, color: C.textMuted, letterSpacing: 1, fontFamily: "'DM Sans', sans-serif" }}>{d}</div>)}</div><div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 5, marginBottom: 20 }}>{cells.map((d, i) => { if (!d) return <div key={"e" + i} />; const entry = diary[dateKey(d)]; const eid = entry?.itemIds?.[0]; const fi = eid ? items.find(it => it.id === eid) : null; const isToday = d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear(); const isSel = selected === d; return <div key={d} onClick={() => setSelected(d === selected ? null : d)} style={{ borderRadius: 10, background: entry?.photo ? "transparent" : isSel ? `linear-gradient(135deg,${C.gold}20,${C.goldLight}10)` : C.card, border: `1.5px solid ${isSel ? C.gold : isToday ? C.goldDim : C.border}`, cursor: "pointer", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: "7px 0 5px", minHeight: 52, position: "relative" }}>{entry?.photo && <img src={entry.photo} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }} />}<span style={{ fontSize: 11, color: isToday ? C.gold : isSel ? C.goldLight : C.text, fontWeight: 600, position: "relative", zIndex: 1 }}>{d}</span>{!entry?.photo && (entry ? <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.gold, marginTop: 2 }} /> : null)}</div>; })}</div>{selected && <div style={{ background: C.card, border: `1px solid ${C.goldLine}`, borderRadius: 16, padding: "16px", marginBottom: 20 }}><div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>{dateKey(selected)}</div>{selEntry ? <><{selEntry.photo && <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 12, height: 200 }}><img src={selEntry.photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>}<div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>{selIds.map(id => { const it = items.find(i => i.id === id); return it ? <div key={id} style={{ display: "flex", alignItems: "center", gap: 6, background: C.surface, borderRadius: 8, padding: "6px 10px" }}><div style={{ width: 14, height: 14, borderRadius: "50%", background: it.color }} /><span style={{ fontSize: 11, color: C.textSub, fontFamily: "'DM Sans', sans-serif" }}>{it.name}</span></div> : null; })}</div>{selEntry.note && <div style={{ fontSize: 11, color: C.textMuted, fontStyle: "italic", marginBottom: 12 }}>"{selEntry.note}"</div>}<button onClick={() => setShowLog(true)} style={{ marginTop: 12, fontSize: 11, color: C.gold, padding: "6px 12px", border: `1px solid ${C.goldLine}`, borderRadius: 8, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>編輯</button></> : <div><div style={{ fontSize: 13, color: C.textMuted, marginBottom: 14, fontFamily: "'DM Sans', sans-serif" }}>沒有記錄</div><button onClick={() => setShowLog(true)} style={{ width: "100%", padding: "12px", borderRadius: 10, border: `1px solid ${C.goldLine}`, color: C.gold, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>＋ 記錄穿搭 & OOTD</button></div>}</div>}</div><div style={{ padding: "0 22px 20px" }}><button onClick={() => { setSelected(today.getDate()); setShowLog(true); }} style={{ width: "100%", padding: "14px", borderRadius: 12, background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`, color: C.obsidian, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: "pointer" }}>＋ 記錄今天穿搭</button></div>{showLog && <LogModal items={items} preSelected={selEntry?.itemIds || []} onClose={() => setShowLog(false)} onSave={saveLog} />}</div>;
}

function CurrencySelector({ currency, onChange }) {
  const [open, setOpen] = useState(false);
  return <div style={{ position: "relative" }}><button onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: C.card, border: `1px solid ${open ? C.gold : C.border}`, borderRadius: 12, cursor: "pointer", width: "100%", transition: "border-color .2s" }}><span style={{ fontSize: 18 }}>{currency.country.split(" ")[0]}</span><div style={{ flex: 1, textAlign: "left" }}><div style={{ fontSize: 12, color: C.text, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{currency.country.split(" ").slice(1).join(" ")}</div><div style={{ fontSize: 10, color: C.gold, fontFamily: "'DM Sans', sans-serif", letterSpacing: 1 }}>{currency.symbol} · {currency.label}</div></div><div style={{ color: C.gold, fontSize: 14, transition: "transform .2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>▼</div></button>{open && <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: C.surface, border: `1px solid ${C.goldLine}`, borderRadius: 12, overflow: "hidden", zIndex: 50, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>{CURRENCY_OPTIONS.map(opt => <button key={opt.code} onClick={() => { onChange(opt); setOpen(false); }} style={{ width: "100%", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, background: opt.code === currency.code ? C.goldGlow : "transparent", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}><span style={{ fontSize: 18 }}>{opt.country.split(" ")[0]}</span><div style={{ flex: 1, textAlign: "left" }}><div style={{ fontSize: 12, color: C.text, fontFamily: "'DM Sans', sans-serif" }}>{opt.country.split(" ").slice(1).join(" ")}</div><div style={{ fontSize: 10, color: C.textMuted, fontFamily: "'DM Sans', sans-serif", letterSpacing: 1 }}>{opt.symbol} {opt.label}</div></div>{opt.code === currency.code && <div style={{ color: C.gold, fontSize: 12 }}>✓</div>}</button>)}</div>}</div>;
}

function SettingsPanel({ onClose, currency, onCurrencyChange, username, setUsername, accounts, setAccounts }) {
  const [tab, setTab] = useState("currency");
  const [newUser, setNewUser] = useState(username);
  const [userErr, setUserErr] = useState("");
  const [userOk, setUserOk] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPass2, setNewPass2] = useState("");
  const [passErr, setPassErr] = useState("");
  const [passOk, setPassOk] = useState("");
  const saveUsername = () => { const trimmed = newUser.trim(); if (!trimmed) { setUserErr("帳號名稱不可為空"); return; } if (trimmed.toLowerCase() === username.toLowerCase()) { setUserErr("與目前帳號名稱相同"); return; } const dup = accounts.find(a => a.username.toLowerCase() === trimmed.toLowerCase()); if (dup) { setUserErr("此帳號名稱已被使用"); return; } setAccounts(p => p.map(a => a.username === username ? { ...a, username: trimmed } : a)); setUsername(trimmed); setUserOk("✓ 帳號名稱已更新"); setUserErr(""); setTimeout(() => setUserOk(""), 2000); };
  const savePassword = () => { const cur = accounts.find(a => a.username === username); if (!cur) return; if (cur.password !== oldPass) { setPassErr("目前密碼不正確"); return; } if (newPass.length < 4) { setPassErr("新密碼至少需要 4 個字元"); return; } if (newPass !== newPass2) { setPassErr("兩次密碼不相符"); return; } setAccounts(p => p.map(a => a.username === username ? { ...a, password: newPass } : a)); setPassOk("✓ 密碼已更新"); setPassErr(""); setOldPass(""); setNewPass(""); setNewPass2(""); setTimeout(() => setPassOk(""), 2000); };
  const TABS = [{ key: "currency", label: "幣別地區" }, { key: "username", label: "更改帳號名" }, { key: "password", label: "更改密碼" }];
  return <div style={{ position: "fixed", inset: 0, zIndex: 700, background: C.surface, display: "flex", flexDirection: "column" }}><div style={{ flexShrink: 0, padding: "52px 24px 14px", display: "flex", alignItems: "center" }}><button onClick={onClose} style={{ color: C.gold, fontSize: 22, marginRight: 16, lineHeight: 1, cursor: "pointer" }}>‹</button><div style={{ fontSize: 17, color: C.text, fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}>設定</div></div><div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}><div style={{ display: "flex", gap: 8, padding: "14px 24px 0", flexShrink: 0 }}>{TABS.map(t => <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: "7px 14px", borderRadius: 20, fontSize: 11, background: tab === t.key ? `linear-gradient(135deg, ${C.gold}, ${C.goldLight})` : "transparent", border: tab === t.key ? "none" : `1px solid ${C.border}`, color: tab === t.key ? C.obsidian : C.textMuted, fontFamily: "'DM Sans', sans-serif", transition: "all .2s", cursor: "pointer" }}>{t.label}</button>)}</div><div style={{ flex: 1, overflowY: "auto", padding: "20px 24px 48px" }}>{tab === "currency" && <div><div style={{ fontSize: 11, color: C.textMuted, marginBottom: 14, fontFamily: "'DM Sans', sans-serif" }}>選擇幣別後，所有金額將自動換算顯示</div><CurrencySelector currency={currency} onChange={onCurrencyChange} /><div style={{ marginTop: 14, padding: "12px 14px", background: C.card, borderRadius: 10, fontSize: 10 }}><div style={{ color: C.gold, letterSpacing: 3, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>即時匯率</div>{CURRENCY_OPTIONS.filter(o => o.code !== "TWD").map(o => <div key={o.code} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}><span style={{ fontSize: 11, color: C.textSub, fontFamily: "'DM Sans', sans-serif" }}>{o.label}</span><span style={{ fontSize: 11, color: o.code === currency.code ? C.gold : C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>1 NT$ = {(1 / o.rate).toFixed(3)} {o.code}</span></div>)}</div></div>}{tab === "username" && <div><div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>帳號名稱</div><input value={newUser} onChange={e => { setNewUser(e.target.value); setUserErr(""); setUserOk(""); }} placeholder="輸入新帳號名稱" style={{ width: "100%", boxSizing: "border-box", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px", fontFamily: "'DM Sans', sans-serif", color: C.text, marginBottom: 12 }} />{userErr && <div style={{ fontSize: 12, color: C.red, marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>{userErr}</div>}{userOk && <div style={{ fontSize: 12, color: "#7ed87e", marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>{userOk}</div>}<button onClick={saveUsername} style={{ width: "100%", padding: "13px", background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`, color: C.obsidian, borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: "pointer" }}>儲存</button></div>}{tab === "password" && <div>{[{ label: "目前密碼", val: oldPass, set: setOldPass }, { label: "新密碼", val: newPass, set: setNewPass }, { label: "確認新密碼", val: newPass2, set: setNewPass2 }].map((f, i) => <div key={f.label} style={{ marginBottom: 14 }}><div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 7, fontFamily: "'DM Sans', sans-serif" }}>{f.label}</div><input type="password" value={f.val} onChange={e => { f.set(e.target.value); setPassErr(""); setPassOk(""); }} placeholder="••••••" style={{ width: "100%", boxSizing: "border-box", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px", fontFamily: "'DM Sans', sans-serif", color: C.text }} /></div>)}{passErr && <div style={{ fontSize: 12, color: C.red, marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>{passErr}</div>}{passOk && <div style={{ fontSize: 12, color: "#7ed87e", marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>{passOk}</div>}<button onClick={savePassword} style={{ width: "100%", padding: "13px", background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`, color: C.obsidian, borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: "pointer" }}>更改密碼</button></div>}</div></div></div>;
}

function ProfileTab({ items, setItems, onOpenLog, username, setUsername, onLogout, accounts, setAccounts }) {
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [currency, setCurrency] = useState(CURRENCY_OPTIONS[0]);
  const [showSettings, setShowSettings] = useState(false);
  const handleCurrencyChange = c => { setCurrency(c); setCurrencyGlobal(c); };
  if (showWardrobe) return <WardrobeInner items={items} setItems={setItems} onOpenLog={onOpenLog} onBack={() => setShowWardrobe(false)} />;
  const total = items.reduce((s, i) => s + i.price, 0);
  const totalWorn = items.reduce((s, i) => s + i.worn, 0);
  const top5 = [...items].filter(i => i.worn > 0).sort((a, b) => cpw(a) - cpw(b)).slice(0, 5);
  const cold5 = [...items].sort((a, b) => a.worn - b.worn).slice(0, 5);
  const catCounts = CATS.slice(1).map(c => ({ cat: c, count: items.filter(i => i.cat === c).length }));
  const maxC = Math.max(...catCounts.map(d => d.count), 1);
  return <div style={{ paddingBottom: 20 }}><div style={{ padding: "28px 22px 0" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}><div><div style={{ fontSize: 10, color: C.gold, letterSpacing: 5, marginBottom: 5, fontFamily: "'DM Sans', sans-serif" }}>我</div><div style={{ fontSize: 30, color: C.text, fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}>Hi, {username ? username : "我"}</div></div><div style={{ display: "flex", gap: 8, marginTop: 8 }}><button onClick={() => setShowSettings(true)} style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${C.border}`, color: C.gold, fontSize: 10, fontFamily: "'DM Sans', sans-serif", letterSpacing: 1, cursor: "pointer" }}>設定</button>{onLogout && <button onClick={onLogout} style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${C.border}`, color: C.textMuted, fontSize: 10, fontFamily: "'DM Sans', sans-serif", letterSpacing: 1, cursor: "pointer" }}>登出</button>}</div></div><button onClick={() => setShowWardrobe(true)} style={{ width: "100%", marginBottom: 16, padding: "0", border: `1px solid ${C.goldLine}`, borderRadius: 20, overflow: "hidden", cursor: "pointer", background: `linear-gradient(135deg, #1a1a14, ${C.surface})`, display: "block", textAlign: "left" }}><div style={{ display: "flex", alignItems: "center", padding: "20px 22px" }}><div style={{ flex: 1 }}><div style={{ fontSize: 9, color: C.gold, letterSpacing: 4, marginBottom: 5, fontFamily: "'DM Sans', sans-serif" }}>我的衣櫃</div><div style={{ fontSize: 20, color: C.text, fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}>{items.length} 件</div><div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>按此查看詳情</div></div><div style={{ display: "flex", gap: -8, marginRight: 12 }}>{items.slice(0, 4).map((it, i) => <div key={it.id} style={{ width: 40, height: 40, borderRadius: 10, background: it.img ? "transparent" : it.color, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}><ItemImg item={it} size={34} /></div>)}</div><div style={{ color: C.gold, fontSize: 22 }}>›</div></div></button><div style={{ background: `linear-gradient(135deg, ${C.surface}, #1a1a14)`, border: `1px solid ${C.goldLine}`, borderRadius: 20, padding: "16px", position: "relative", overflow: "hidden", marginBottom: 16 }}><div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: C.goldGlow, opacity: 0.5 }} /><div style={{ fontSize: 10, color: C.gold, letterSpacing: 4, marginBottom: 14, fontFamily: "'DM Sans', sans-serif" }}>資產總額</div><div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}><div style={{ fontSize: 28, color: C.text, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{hidden ? "•••••" : fmt(total)}</div><button onClick={() => setHidden(h => !h)} style={{ color: C.textMuted, fontSize: 11, padding: "4px 8px", border: `1px solid ${C.border}`, borderRadius: 6, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>{hidden ? "顯示" : "隱藏"}</button></div><div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Sans', sans-serif", letterSpacing: 1 }}>{items.length} 件單品</div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16, marginTop: 12 }}>{[{ label: "平均每件成本", value: hidden ? "••••" : fmt(Math.round(total / Math.max(items.length, 1))) }, { label: "平均單次費用", value: hidden ? "••••" : (totalWorn > 0 ? fmt(Math.round(total / totalWorn)) : "-") }].map(d => <div key={d.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px" }}><div style={{ fontSize: 9, color: C.textMuted, letterSpacing: 2, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>{d.label}</div><div style={{ fontSize: 14, color: C.text, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{d.value}</div></div>)}</div></div><div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px", marginBottom: 16 }}><div style={{ fontSize: 10, color: C.gold, letterSpacing: 4, marginBottom: 18, fontFamily: "'DM Sans', sans-serif" }}>分類分佈</div>{catCounts.filter(d => d.count > 0).map(d => <div key={d.cat} style={{ marginBottom: 12 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 11, color: C.textSub, fontFamily: "'DM Sans', sans-serif", letterSpacing: 1 }}>{d.cat}</span><span style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{d.count} 件</span></div><div style={{ height: 3, background: C.surface, borderRadius: 2 }}><div style={{ height: "100%", borderRadius: 2, width: `${(d.count / maxC) * 100}%`, background: `linear-gradient(90deg, ${C.gold}, ${C.goldLight})` }} /></div></div>)}</div><div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px", marginBottom: 16 }}><div style={{ fontSize: 10, color: C.gold, letterSpacing: 4, marginBottom: 5, fontFamily: "'DM Sans', sans-serif" }}>CP 值最高 TOP 5</div><div style={{ fontSize: 9, color: C.textMuted, marginBottom: 16, letterSpacing: 1, fontFamily: "'DM Sans', sans-serif" }}>每件均次成本最低</div>{top5.map((item, i) => <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < top5.length - 1 ? `1px solid ${C.border}` : "none" }}><div style={{ fontSize: 11, color: C.gold, width: 16, textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{i + 1}</div><ItemImg item={item} size={28} /><div style={{ flex: 1 }}><div style={{ fontSize: 12, color: C.text, fontFamily: "'Cormorant Garamond', serif" }}>{item.name}</div><div style={{ fontSize: 9, color: C.textMuted, marginTop: 2, fontFamily: "'DM Sans', sans-serif" }}>{item.brand}</div></div><div style={{ fontSize: 11, color: C.gold, fontFamily: "'DM Sans', sans-serif" }}>{hidden ? "••••" : fmt(cpw(item))}</div></div>)}</div><div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px" }}><div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 4, marginBottom: 5, fontFamily: "'DM Sans', sans-serif" }}>冷櫃單品 TOP 5</div><div style={{ fontSize: 9, color: C.textMuted, marginBottom: 16, letterSpacing: 1, fontFamily: "'DM Sans', sans-serif" }}>穿搭次數最少</div>{cold5.map((item, i) => <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < cold5.length - 1 ? `1px solid ${C.border}` : "none" }}><div style={{ fontSize: 11, color: C.textMuted, width: 16, textAlign: "center", fontFamily: "'DM Sans', sans-serif" }}>{i + 1}</div><div style={{ opacity: 0.55 }}><ItemImg item={item} size={28} /></div><div style={{ flex: 1 }}><div style={{ fontSize: 12, color: C.textSub, fontFamily: "'Cormorant Garamond', serif" }}>{item.name}</div><div style={{ fontSize: 9, color: C.textMuted, marginTop: 2, fontFamily: "'DM Sans', sans-serif" }}>{item.brand}</div></div><div style={{ fontSize: 10, color: item.worn === 0 ? C.red : C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{item.worn === 0 ? "未穿" : `${item.worn}×`}</div></div>)}</div></div>{showSettings && <SettingsPanel onClose={() => setShowSettings(false)} currency={currency} onCurrencyChange={handleCurrencyChange} username={username} setUsername={setUsername} accounts={accounts} setAccounts={setAccounts} />}</div>;
}

export default function App() {
  const [screen, setScreen] = useState("splash");
  const [username, setUsername] = useState("");
  const [accounts, setAccounts] = useState(ACCOUNTS_DEFAULT);
  useEffect(() => { fetchLiveRates(); }, []);
  const [tab, setTab] = useState("ootd");
  const [items, setItems] = useState(ITEMS_INIT);
  const [diary, setDiary] = useState(DIARY_INIT);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddOOTD, setShowAddOOTD] = useState(false);
  const [logModal, setLogModal] = useState(null);
  const openLog = (preSelected) => setLogModal({ preSelected });
  const saveLog = (itemIds, note, photo) => {
    const today = new Date().toISOString().split("T")[0];
    setDiary(p => ({ ...p, [today]: { itemIds, note, photo } }));
    setItems(p => p.map(i => itemIds.includes(i.id) ? { ...i, worn: i.worn + 1 } : i));
    setLogModal(null);
  };
  return (
    <div style={{ background: C.obsidian, color: C.text, width: "100%", maxWidth: 480, margin: "0 auto", position: "relative", height: "100svh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{G}</style>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.025, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />
      <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, zIndex: 1 }} />
      {screen === "app" && <>
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden", position: "relative", zIndex: 2, paddingBottom: 82 }}>
          {tab === "ootd" && <OOTDTab items={items} diary={diary} setDiary={setDiary} setItems={setItems} onOpenLog={openLog} />}
          {tab === "profile" && <ProfileTab items={items} setItems={setItems} onOpenLog={openLog} username={username} setUsername={setUsername} onLogout={() => setScreen("login")} accounts={accounts} setAccounts={setAccounts} />}
        </div>
        <div style={{ flexShrink: 0, position: "relative", zIndex: 200 }}>
          <BottomNav tab={tab} setTab={setTab} onAddItem={() => setShowAddItem(true)} onAddOOTD={() => setShowAddOOTD(true)} />
        </div>
        {showAddItem && <AddSheet onClose={() => setShowAddItem(false)} onAddItem={i => setItems(p => [...p, i])} />}
        {showAddOOTD && <LogModal items={items} preSelected={[]} onClose={() => setShowAddOOTD(false)} onSave={saveLog} />}
        {logModal && <LogModal items={items} preSelected={logModal.preSelected} onClose={() => setLogModal(null)} onSave={saveLog} />}
      </>}
      {screen === "splash" && <SplashScreen onDone={() => setScreen("login")} />}
      {screen === "login" && <LoginScreen onLogin={name => { setUsername(name); setScreen("app"); }} accounts={accounts} setAccounts={setAccounts} />}
    </div>
  );
}
