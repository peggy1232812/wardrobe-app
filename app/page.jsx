'use client';

import { useState, useRef, useCallback, useEffect } from "react";

// ─── I18N ────────────────────────────────────────────────────
const LANGS = [
  { code: "zh-TW", label: "繁中", flag: "🇹🇼" },
  { code: "zh-CN", label: "简中", flag: "🇨🇳" },
  { code: "en",    label: "EN",   flag: "🌐" },
  { code: "ja",    label: "日本語", flag: "🇯🇵" },
];

const T = {
  "zh-TW": {
    appName: "WARDROBE", tagline: "Your digital wardrobe ✨", enter: "ENTER",
    selectAccount: "選擇帳號", login: "登入", register: "註冊",
    username: "USERNAME", password: "PASSWORD", confirm: "CONFIRM",
    enterWardrobe: "進入衣櫃 →", createAccount: "建立帳號 →",
    enteringWardrobe: "ENTERING YOUR WARDROBE",
    fillAll: "請填寫所有欄位", wrongPass: "帳號或密碼不正確",
    passMin4: "密碼至少 4 個字元", passMismatch: "兩次密碼不相符",
    nameTaken: "帳號名稱已被使用", accountCreated: (n) => `✓ 帳號 ${n} 建立成功！`,
    ootdLabel: "OUTFIT OF THE DAY", journal: "日誌",
    recordToday: "＋ 記錄今天穿搭", recordOOTD: "＋ 記錄穿搭",
    noRecord: "這天還沒記錄穿搭", edit: "編輯",
    weekDays: ["日","一","二","三","四","五","六"],
    recordOutfit: "記錄穿搭", remark: "備註", remarkPH: "e.g. Team meeting, coffee date…",
    save: (n) => `記錄 ✓ ${n > 0 ? `(${n} 件)` : ""}`,
    myProfile: "MY PROFILE", myWardrobe: "MY WARDROBE",
    totalAsset: "TOTAL ASSET", show: "顯示", hide: "隱藏", logout: "登出",
    avgPerItem: "平均每件", avgPerWear: "平均單次",
    catStats: "分類統計", highCP: "高 CP 值單品",
    coldShelf: "冷門單品", wornTimes: (n) => `穿 ${n} 次`,
    neverWorn: "未穿", items: (n) => `${n} Items`,
    totalValue: (v) => `總資產 ${v}`,
    addNew: "新增", addOOTD: "新增 OOTD", addItem: "新增單品",
    wardrobeTitle: "MY WARDROBE", editBtn: "編輯",
    selectAll: "全選", cancelAll: "取消全選", deleteN: (n) => `刪除 ${n}`, done: "完成",
    pieces: (n) => `${n} 件`,
    cats: ["全部","上衣","下著","外套","洋裝","鞋履","配件"],
    detail: "DETAIL", avgWear: "平均單次", cp: "CP",
    cpHigh: "極高", cpGood: "高", cpMid: "中", cpLow: "低",
    category: "類別", purchasePrice: "購入金額", wearCount: "使用次數",
    addWear: "＋ 增加使用次數", recordToday2: "記錄今日穿搭", deleteItem: "刪除單品",
    costForecast: "COST FORECAST", wearMore: (n) => `再穿 ${n} 次`,
    brand: "BRAND",
    addItemTitle: "新增單品", addToWardrobe: "Add to Wardrobe",
    itemName: "品項名稱", brandLabel: "品牌", purchaseAmt: "購入金額 (NT$)",
    itemNamePH: "e.g. Silk Slip Dress", brandPH: "e.g. The Row",
    required: "此欄為必填", addItemBtn: "新增單品",
    currency: "幣別", settings: "設定",
    confirmDelete: "確認刪除？",
    confirmDeleteMsg: (n) => `將刪除選定的 ${n} 件單品，此操作無法復原。`,
    cancel: "取消", delete: "刪除",
  },
  "zh-CN": {
    appName: "WARDROBE", tagline: "Your digital wardrobe ✨", enter: "进入",
    selectAccount: "选择账号", login: "登录", register: "注册",
    username: "USERNAME", password: "PASSWORD", confirm: "确认密码",
    enterWardrobe: "进入衣橱 →", createAccount: "创建账号 →",
    enteringWardrobe: "ENTERING YOUR WARDROBE",
    fillAll: "请填写所有栏位", wrongPass: "账号或密码不正确",
    passMin4: "密码至少 4 个字符", passMismatch: "两次密码不一致",
    nameTaken: "账号名称已被使用", accountCreated: (n) => `✓ 账号 ${n} 创建成功！`,
    ootdLabel: "OUTFIT OF THE DAY", journal: "日志",
    recordToday: "＋ 记录今天穿搭", recordOOTD: "＋ 记录穿搭",
    noRecord: "这天还没记录穿搭", edit: "编辑",
    weekDays: ["日","一","二","三","四","五","六"],
    recordOutfit: "记录穿搭", remark: "备注", remarkPH: "e.g. Team meeting, coffee date…",
    save: (n) => `记录 ✓ ${n > 0 ? `(${n} 件)` : ""}`,
    myProfile: "MY PROFILE", myWardrobe: "MY WARDROBE",
    totalAsset: "TOTAL ASSET", show: "显示", hide: "隐藏", logout: "退出",
    avgPerItem: "平均每件", avgPerWear: "平均单次",
    catStats: "分类统计", highCP: "高 CP 值单品",
    coldShelf: "冷门单品", wornTimes: (n) => `穿 ${n} 次`,
    neverWorn: "未穿", items: (n) => `${n} Items`,
    totalValue: (v) => `总资产 ${v}`,
    addNew: "新增", addOOTD: "新增 OOTD", addItem: "新增单品",
    wardrobeTitle: "MY WARDROBE", editBtn: "编辑",
    selectAll: "全选", cancelAll: "取消全选", deleteN: (n) => `删除 ${n}`, done: "完成",
    pieces: (n) => `${n} 件`,
    cats: ["全部","上衣","下装","外套","连衣裙","鞋履","配件"],
    detail: "DETAIL", avgWear: "平均单次", cp: "CP",
    cpHigh: "极高", cpGood: "高", cpMid: "中", cpLow: "低",
    category: "类别", purchasePrice: "购入金额", wearCount: "使用次数",
    addWear: "＋ 增加使用次数", recordToday2: "记录今日穿搭", deleteItem: "删除单品",
    costForecast: "COST FORECAST", wearMore: (n) => `再穿 ${n} 次`,
    brand: "BRAND",
    addItemTitle: "新增单品", addToWardrobe: "Add to Wardrobe",
    itemName: "品项名称", brandLabel: "品牌", purchaseAmt: "购入金额 (NT$)",
    itemNamePH: "e.g. Silk Slip Dress", brandPH: "e.g. The Row",
    required: "此栏为必填", addItemBtn: "新增单品",
    currency: "货币", settings: "设置",
    confirmDelete: "确认删除？",
    confirmDeleteMsg: (n) => `将删除选定的 ${n} 件单品，此操作无法还原。`,
    cancel: "取消", delete: "删除",
  },
  "en": {
    appName: "WARDROBE", tagline: "Your digital wardrobe ✨", enter: "ENTER",
    selectAccount: "Select Account", login: "Login", register: "Sign Up",
    username: "USERNAME", password: "PASSWORD", confirm: "CONFIRM",
    enterWardrobe: "Enter Wardrobe →", createAccount: "Create Account →",
    enteringWardrobe: "ENTERING YOUR WARDROBE",
    fillAll: "Please fill in all fields", wrongPass: "Incorrect username or password",
    passMin4: "Password must be at least 4 characters", passMismatch: "Passwords do not match",
    nameTaken: "Username already taken", accountCreated: (n) => `✓ Account ${n} created!`,
    ootdLabel: "OUTFIT OF THE DAY", journal: "Journal",
    recordToday: "+ Log Today's Outfit", recordOOTD: "+ Log Outfit",
    noRecord: "No outfit logged for this day", edit: "Edit",
    weekDays: ["Su","Mo","Tu","We","Th","Fr","Sa"],
    recordOutfit: "Log Outfit", remark: "Note", remarkPH: "e.g. Team meeting, coffee date…",
    save: (n) => `Save ✓ ${n > 0 ? `(${n} items)` : ""}`,
    myProfile: "MY PROFILE", myWardrobe: "MY WARDROBE",
    totalAsset: "TOTAL ASSET", show: "Show", hide: "Hide", logout: "Logout",
    avgPerItem: "Avg / Item", avgPerWear: "Avg / Wear",
    catStats: "By Category", highCP: "Best Value Items",
    coldShelf: "Rarely Worn", wornTimes: (n) => `Worn ${n}×`,
    neverWorn: "Never worn", items: (n) => `${n} Items`,
    totalValue: (v) => `Total ${v}`,
    addNew: "Add", addOOTD: "Add OOTD", addItem: "Add Item",
    wardrobeTitle: "MY WARDROBE", editBtn: "Edit",
    selectAll: "Select All", cancelAll: "Deselect", deleteN: (n) => `Delete ${n}`, done: "Done",
    pieces: (n) => `${n} items`,
    cats: ["All","Tops","Bottoms","Outerwear","Dresses","Shoes","Accessories"],
    detail: "DETAIL", avgWear: "Avg / Wear", cp: "VALUE",
    cpHigh: "Excellent", cpGood: "Good", cpMid: "Fair", cpLow: "Low",
    category: "Category", purchasePrice: "Price Paid", wearCount: "Times Worn",
    addWear: "+ Add Wear", recordToday2: "Log in OOTD", deleteItem: "Delete Item",
    costForecast: "COST FORECAST", wearMore: (n) => `After ${n} more wears`,
    brand: "BRAND",
    addItemTitle: "New Item", addToWardrobe: "Add to Wardrobe",
    itemName: "Item Name", brandLabel: "Brand", purchaseAmt: "Price Paid (NT$)",
    itemNamePH: "e.g. Silk Slip Dress", brandPH: "e.g. The Row",
    required: "This field is required", addItemBtn: "Add Item",
    currency: "Currency", settings: "Settings",
    confirmDelete: "Confirm Delete?",
    confirmDeleteMsg: (n) => `Delete ${n} selected item(s)? This cannot be undone.`,
    cancel: "Cancel", delete: "Delete",
  },
  "ja": {
    appName: "WARDROBE", tagline: "Your digital wardrobe ✨", enter: "入る",
    selectAccount: "アカウント選択", login: "ログイン", register: "新規登録",
    username: "USERNAME", password: "PASSWORD", confirm: "確認",
    enterWardrobe: "ワードローブへ →", createAccount: "アカウント作成 →",
    enteringWardrobe: "ENTERING YOUR WARDROBE",
    fillAll: "すべて入力してください", wrongPass: "ユーザー名またはパスワードが違います",
    passMin4: "パスワードは4文字以上", passMismatch: "パスワードが一致しません",
    nameTaken: "このユーザー名は使用中です", accountCreated: (n) => `✓ アカウント ${n} を作成しました！`,
    ootdLabel: "OUTFIT OF THE DAY", journal: "日記",
    recordToday: "＋ 今日のコーデを記録", recordOOTD: "＋ コーデを記録",
    noRecord: "この日のコーデはまだ未記録", edit: "編集",
    weekDays: ["日","月","火","水","木","金","土"],
    recordOutfit: "コーデ記録", remark: "メモ", remarkPH: "e.g. 会議, デート…",
    save: (n) => `保存 ✓ ${n > 0 ? `(${n} 件)` : ""}`,
    myProfile: "MY PROFILE", myWardrobe: "MY WARDROBE",
    totalAsset: "TOTAL ASSET", show: "表示", hide: "非表示", logout: "ログアウト",
    avgPerItem: "平均単価", avgPerWear: "平均着用費",
    catStats: "カテゴリ別", highCP: "コスパ優秀",
    coldShelf: "着用少ないアイテム", wornTimes: (n) => `${n}回着用`,
    neverWorn: "未着用", items: (n) => `${n} アイテム`,
    totalValue: (v) => `総資産 ${v}`,
    addNew: "追加", addOOTD: "OOTD追加", addItem: "アイテム追加",
    wardrobeTitle: "MY WARDROBE", editBtn: "編集",
    selectAll: "全選択", cancelAll: "選択解除", deleteN: (n) => `${n}件削除`, done: "完了",
    pieces: (n) => `${n} 件`,
    cats: ["全部","トップス","ボトムス","アウター","ワンピース","シューズ","アクセ"],
    detail: "DETAIL", avgWear: "平均着用費", cp: "コスパ",
    cpHigh: "最高", cpGood: "良い", cpMid: "普通", cpLow: "低い",
    category: "カテゴリ", purchasePrice: "購入金額", wearCount: "着用回数",
    addWear: "＋ 着用回数を増やす", recordToday2: "今日のOOTDに記録", deleteItem: "削除",
    costForecast: "COST FORECAST", wearMore: (n) => `あと${n}回着用後`,
    brand: "BRAND",
    addItemTitle: "アイテム追加", addToWardrobe: "Add to Wardrobe",
    itemName: "アイテム名", brandLabel: "ブランド", purchaseAmt: "購入金額 (NT$)",
    itemNamePH: "e.g. シルクドレス", brandPH: "e.g. The Row",
    required: "必須項目", addItemBtn: "追加する",
    currency: "通貨", settings: "設定",
    confirmDelete: "削除しますか？",
    confirmDeleteMsg: (n) => `選択した ${n} 件を削除します。この操作は元に戻せません。`,
    cancel: "キャンセル", delete: "削除",
  },
};

// ─── COLORS ──────────────────────────────────────────────────
const C = {
  obsidian: "#121212", surface: "#1E1E1E", card: "#252525",
  gold: "#C5A059", goldLight: "#D4AF37", goldDim: "#7A6030",
  goldGlow: "rgba(197,160,89,0.18)", goldLine: "rgba(197,160,89,0.25)",
  text: "#F2EDE6", textSub: "#9A9590", textMuted: "#5A5550",
  border: "rgba(255,255,255,0.07)", red: "#E05555", redDim: "rgba(224,85,85,0.15)",
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const ITEMS_INIT = [
  { id: 1, name: "Silk Slip Dress", brand: "Totême", cat: "洋裝", price: 18500, worn: 7, color: "#c5a059" },
  { id: 2, name: "Tailored Blazer", brand: "The Row", cat: "外套", price: 42000, worn: 12, color: "#d4af37" },
  { id: 3, name: "Cashmere Knit", brand: "Loro Piana", cat: "上衣", price: 28000, worn: 18, color: "#f2ede6" },
  { id: 4, name: "Wide-leg Trousers", brand: "Lemaire", cat: "下著", price: 15800, worn: 9, color: "#9a9590" },
  { id: 5, name: "Ballet Flats", brand: "Repetto", cat: "鞋履", price: 9800, worn: 22, color: "#a8e6cf" },
  { id: 6, name: "Structured Tote", brand: "Polène", cat: "配件", price: 12500, worn: 30, color: "#ffd6e0" },
  { id: 7, name: "Linen Shirt Dress", brand: "Arket", cat: "洋裝", price: 6200, worn: 4, color: "#ffb7b2" },
  { id: 8, name: "Leather Mini Skirt", brand: "Saint Laurent", cat: "下著", price: 35000, worn: 2, color: "#2a2a2a" },
  { id: 9, name: "Slingback Heels", brand: "Manolo Blahnik", cat: "鞋履", price: 52000, worn: 1, color: "#c7ceea" },
  { id: 10, name: "Pearl Drop Earrings", brand: "Mikimoto", cat: "配件", price: 68000, worn: 5, color: "#f4a7c3" },
];

const DIARY_INIT = {
  "2026-05-20": { note: "Brand strategy meeting", itemIds: [2, 3, 4, 6], photo: null },
  "2026-05-18": { note: "Brunch at Le Bernardin", itemIds: [1, 5, 10], photo: null },
  "2026-05-15": { note: "Board presentation", itemIds: [2, 4, 9, 10], photo: null },
};

const CURRENCY_OPTIONS = [
  { code: "TWD", symbol: "NT$", label: "台幣", country: "🇹🇼 台灣", rate: 1 },
  { code: "MYR", symbol: "RM",  label: "馬幣", country: "🇲🇾 馬來西亞", rate: 0.1408 },
  { code: "AUD", symbol: "A$",  label: "澳幣", country: "🇦🇺 澳大利亞", rate: 0.0496 },
  { code: "EUR", symbol: "€",   label: "歐元", country: "🇮🇪 愛爾蘭", rate: 0.0286 },
  { code: "HKD", symbol: "HK$", label: "港幣", country: "🇭🇰 香港", rate: 0.244 },
  { code: "CNY", symbol: "¥",   label: "人民幣", country: "🇨🇳 中國", rate: 0.224 },
];

let _currency = CURRENCY_OPTIONS[0];
const setCurrencyGlobal = (c) => { _currency = c; };
const fmt = (n) => {
  const v = n * _currency.rate;
  const s = _currency.code === "TWD" ? Math.round(v).toLocaleString() : (v >= 1000 ? Math.round(v).toLocaleString() : v.toFixed(1).replace(/\.0$/, ""));
  return _currency.symbol + " " + s;
};
const cpw = i => i.worn > 0 ? Math.round(i.price / i.worn) : i.price;

const ORBS = [
  { color: "#f4a7c3", size: 220, x: "-10%", y: "-8%", dur: 7 },
  { color: "#c5a0f5", size: 180, x: "65%",  y: "-5%", dur: 9 },
  { color: "#f9c784", size: 150, x: "75%",  y: "55%", dur: 6 },
  { color: "#80d4f7", size: 200, x: "-15%", y: "60%", dur: 8 },
  { color: "#a8e6cf", size: 130, x: "10%",  y: "30%", dur: 10 },
  { color: "#ffd6e0", size: 160, x: "55%",  y: "20%", dur: 7.5 },
];

const ACCOUNTS_DEFAULT = [
  { username: "Sylvia", password: "sylvia123" },
  { username: "Chu",    password: "chu123" },
];

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  ::-webkit-scrollbar { display: none; }
  input, textarea { font-family: inherit; outline: none; border: none; font-size: 15px; color: #F2EDE6; background: transparent; }
  button { font-family: inherit; cursor: pointer; border: none; background: none; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);} }
  @keyframes scaleIn { from{opacity:0;transform:scale(0.96);}to{opacity:1;transform:scale(1);} }
  @keyframes slideUp { from{opacity:0;transform:translateY(50px);}to{opacity:1;transform:translateY(0);} }
  @keyframes orbSpin { to{transform:rotate(360deg);} }
  @keyframes fadeSlideUp { from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);} }
  @keyframes btnPop { 0%{opacity:0;transform:scale(0.88) translateY(10px);}60%{transform:scale(1.08);}100%{opacity:1;transform:scale(1);} }
  @keyframes loginShake { 0%,100%{transform:translateX(0);}20%{transform:translateX(-8px);}40%{transform:translateX(8px);}60%{transform:translateX(-4px);}80%{transform:translateX(4px);} }
  .fadeUp { animation: fadeUp 0.35s ease both; }
  .scaleIn { animation: scaleIn 0.25s ease both; }
  .slideUp { animation: slideUp 0.32s cubic-bezier(0.32,0.72,0,1) both; }
`;

// ─── LANG SWITCHER ────────────────────────────────────────────
function LangSwitcher({ lang, setLang }) {
  const [open, setOpen] = useState(false);
  const cur = LANGS.find(l => l.code === lang);
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: "flex", alignItems: "center", gap: 5,
        padding: "5px 12px", borderRadius: 20,
        border: `1px solid ${open ? C.gold : C.border}`,
        color: C.gold, fontSize: 11, fontFamily: "'DM Sans',sans-serif",
        transition: "border-color .2s",
      }}>
        <span>{cur.flag}</span>
        <span>{cur.label}</span>
        <span style={{ fontSize: 8, opacity: 0.7 }}>▼</span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: C.surface, border: `1px solid ${C.goldLine}`, borderRadius: 12, overflow: "hidden", zIndex: 999, minWidth: 110, boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
          {LANGS.map(l => (
            <button key={l.code} onClick={() => { setLang(l.code); setOpen(false); }} style={{
              width: "100%", padding: "10px 14px", display: "flex", alignItems: "center", gap: 8,
              background: l.code === lang ? C.goldGlow : "transparent",
              borderBottom: `1px solid ${C.border}`,
            }}>
              <span>{l.flag}</span>
              <span style={{ fontSize: 12, color: C.text, fontFamily: "'DM Sans',sans-serif" }}>{l.label}</span>
              {l.code === lang && <span style={{ marginLeft: "auto", color: C.gold, fontSize: 12 }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SPLASH ───────────────────────────────────────────────────
function SplashScreen({ onDone, lang, setLang }) {
  const t = T[lang];
  const [showBtn, setShowBtn] = useState(false);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => { const tm = setTimeout(() => setShowBtn(true), 1000); return () => clearTimeout(tm); }, []);
  const go = () => { setLeaving(true); setTimeout(onDone, 500); };
  return (
    <div onClick={go} style={{ position: "fixed", inset: 0, zIndex: 999, background: "linear-gradient(135deg,#0e0a12,#1a1420)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", opacity: leaving ? 0 : 1, transition: "opacity .5s ease", cursor: "pointer" }}>
      {ORBS.map((o, i) => (
        <div key={i} style={{ position: "absolute", left: o.x, top: o.y, width: o.size, height: o.size, borderRadius: "50%", background: `radial-gradient(circle at 40% 40%, ${o.color}55 0%, ${o.color}00 70%)`, filter: "blur(38px)", animation: `orbSpin ${o.dur}s linear infinite`, opacity: 0.6 }} />
      ))}
      {/* Lang switcher top-right */}
      <div style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }} onClick={e => e.stopPropagation()}>
        <LangSwitcher lang={lang} setLang={setLang} />
      </div>
      <div style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
        <h1 style={{ fontSize: 48, fontFamily: "'Cormorant Garamond',serif", fontWeight: 300, color: "#F2EDE6", marginBottom: 8, animation: "fadeSlideUp .6s .2s ease both" }}>{t.appName}</h1>
        <p style={{ fontSize: 14, color: "#9A9590", letterSpacing: 1, marginBottom: 32, fontFamily: "'DM Sans',sans-serif", animation: "fadeSlideUp .6s .45s ease both" }}>{t.tagline}</p>
        {showBtn && (
          <button onClick={e => { e.stopPropagation(); go(); }} style={{ padding: "12px 28px", border: "1px solid #C5A059", borderRadius: 6, color: "#C5A059", fontSize: 12, letterSpacing: 2, animation: "btnPop .55s ease both" }}>
            {t.enter}
          </button>
        )}
      </div>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${C.gold},transparent)` }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${C.gold},transparent)` }} />
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────
function LoginScreen({ onLogin, accounts, setAccounts, lang, setLang }) {
  const t = T[lang];
  const [mode, setMode] = useState("login");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [shaking, setShaking] = useState(false);
  const [hiName, setHiName] = useState("");

  const shake = msg => { setErr(msg); setShaking(true); setTimeout(() => setShaking(false), 480); };
  const reset = () => { setUser(""); setPass(""); setPass2(""); setErr(""); setOk(""); };

  const submit = () => {
    if (!user.trim() || !pass) { shake(t.fillAll); return; }
    if (mode === "login") {
      const m = accounts.find(a => a.username.toLowerCase() === user.trim().toLowerCase() && a.password === pass);
      if (m) { setHiName(m.username); setTimeout(() => onLogin(m.username), 1200); }
      else shake(t.wrongPass);
    } else {
      if (pass.length < 4) { shake(t.passMin4); return; }
      if (pass !== pass2) { shake(t.passMismatch); return; }
      if (accounts.find(a => a.username.toLowerCase() === user.trim().toLowerCase())) { shake(t.nameTaken); return; }
      const newAcc = { username: user.trim(), password: pass };
      setAccounts(p => [...p, newAcc]);
      setOk(t.accountCreated(newAcc.username));
      setTimeout(() => { setMode("login"); reset(); setUser(newAcc.username); }, 1400);
    }
  };

  if (hiName) return (
    <div style={{ position: "fixed", inset: 0, zIndex: 998, background: "#0e0a12", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {ORBS.map((o, i) => <div key={i} style={{ position: "absolute", left: o.x, top: o.y, width: o.size, height: o.size, borderRadius: "50%", background: `radial-gradient(circle at 40% 40%, ${o.color}55 0%, ${o.color}00 70%)`, filter: "blur(38px)", animation: `orbSpin ${o.dur}s linear infinite`, opacity: 0.6 }} />)}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", animation: "fadeSlideUp .5s ease both" }}>
        <div style={{ fontSize: 52, marginBottom: 14 }}>👋</div>
        <div style={{ fontSize: 36, fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", color: C.gold, marginBottom: 12 }}>Hi, {hiName}</div>
        <div style={{ fontSize: 11, color: C.textMuted, letterSpacing: 4, fontFamily: "'DM Sans',sans-serif" }}>{t.enteringWardrobe}</div>
      </div>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 998, background: "#0e0a12", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {ORBS.map((o, i) => <div key={i} style={{ position: "absolute", left: o.x, top: o.y, width: o.size, height: o.size, borderRadius: "50%", background: `radial-gradient(circle at 40% 40%, ${o.color}55 0%, ${o.color}00 70%)`, filter: "blur(38px)", animation: `orbSpin ${o.dur}s linear infinite`, opacity: 0.6 }} />)}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${C.gold},transparent)` }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${C.gold},transparent)` }} />
      {/* Lang switcher top-right */}
      <div style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}>
        <LangSwitcher lang={lang} setLang={setLang} />
      </div>
      <div style={{ position: "relative", zIndex: 2, width: "88%", maxWidth: 360 }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 24, fontFamily: "'Cormorant Garamond',serif", color: C.gold }}>{t.selectAccount}</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
          {accounts.map(acc => (
            <button key={acc.username} onClick={() => { setUser(acc.username); setPass(acc.password); setErr(""); }} style={{ padding: "12px 24px", border: `1px solid ${C.gold}`, borderRadius: 8, color: C.text, fontSize: 14, background: C.card }}>
              {acc.username}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", background: "rgba(30,30,30,0.7)", borderRadius: 30, padding: 4, marginBottom: 14 }}>
          {["login", "register"].map(m => (
            <button key={m} onClick={() => { setMode(m); reset(); }} style={{ flex: 1, padding: "9px 0", borderRadius: 26, background: mode === m ? `linear-gradient(135deg,${C.gold},${C.goldLight})` : "transparent", color: mode === m ? C.obsidian : C.textMuted, fontSize: 12, fontWeight: mode === m ? 600 : 300, letterSpacing: 2, fontFamily: "'DM Sans',sans-serif" }}>
              {m === "login" ? t.login : t.register}
            </button>
          ))}
        </div>
        <div style={{ background: "rgba(30,30,30,0.85)", border: `1px solid ${C.goldLine}`, borderRadius: 22, padding: "24px 22px 26px", animation: shaking ? "loginShake .45s ease" : "none" }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 6, fontFamily: "'DM Sans',sans-serif" }}>{t.username}</div>
            <input value={user} onChange={e => { setUser(e.target.value); setErr(""); }} onKeyDown={e => e.key === "Enter" && submit()} placeholder={t.username.toLowerCase()} autoCapitalize="none" style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px", color: C.text }} />
          </div>
          <div style={{ marginBottom: mode === "register" ? 12 : 20, position: "relative" }}>
            <div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 6, fontFamily: "'DM Sans',sans-serif" }}>{t.password}</div>
            <input value={pass} onChange={e => { setPass(e.target.value); setErr(""); }} onKeyDown={e => e.key === "Enter" && submit()} placeholder="••••••" type={showPw ? "text" : "password"} style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 40px 10px 10px", color: C.text }} />
            <button onClick={() => setShowPw(p => !p)} style={{ position: "absolute", right: 10, bottom: 10, color: C.textMuted, fontSize: 14 }}>{showPw ? "🙈" : "👁️"}</button>
          </div>
          {mode === "register" && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 6, fontFamily: "'DM Sans',sans-serif" }}>{t.confirm}</div>
              <input value={pass2} onChange={e => { setPass2(e.target.value); setErr(""); }} onKeyDown={e => e.key === "Enter" && submit()} placeholder="••••••" type={showPw ? "text" : "password"} style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px", color: C.text }} />
            </div>
          )}
          {err && <div style={{ fontSize: 11, color: C.red, marginBottom: 12 }}>{err}</div>}
          {ok && <div style={{ fontSize: 11, color: "#7ed87e", marginBottom: 12 }}>{ok}</div>}
          <button onClick={submit} style={{ width: "100%", padding: "14px", background: user && pass ? `linear-gradient(135deg,${C.gold},${C.goldLight})` : "rgba(197,160,89,0.2)", color: user && pass ? C.obsidian : C.textMuted, borderRadius: 12, fontSize: 14, fontWeight: 600, letterSpacing: 1, fontFamily: "'DM Sans',sans-serif" }}>
            {mode === "login" ? t.enterWardrobe : t.createAccount}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── BOTTOM NAV ───────────────────────────────────────────────
function BottomNav({ tab, setTab, onAddItem, onAddOOTD, t }) {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <>
      {showMenu && (
        <div style={{ position: "fixed", inset: 0, zIndex: 190, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setShowMenu(false)}>
          <div className="slideUp" onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 480, background: C.surface, borderRadius: "24px 24px 0 0", border: `1px solid ${C.goldLine}`, borderBottom: "none", padding: "20px 24px 48px" }}>
            <div style={{ width: 36, height: 3, background: C.goldLine, borderRadius: 2, margin: "0 auto 20px" }} />
            <div style={{ fontSize: 11, color: C.textMuted, letterSpacing: 3, textAlign: "center", marginBottom: 20, fontFamily: "'DM Sans',sans-serif" }}>{t.addNew}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button onClick={() => { setShowMenu(false); onAddOOTD(); }} style={{ padding: "20px 16px", borderRadius: 16, border: `1px solid ${C.goldLine}`, color: C.gold, fontFamily: "'DM Sans',sans-serif", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 28 }}>📸</span>
                <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>{t.addOOTD}</span>
              </button>
              <button onClick={() => { setShowMenu(false); onAddItem(); }} style={{ padding: "20px 16px", borderRadius: 16, border: `1px solid ${C.goldLine}`, color: C.gold, fontFamily: "'DM Sans',sans-serif", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 28 }}>👗</span>
                <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>{t.addItem}</span>
              </button>
            </div>
          </div>
        </div>
      )}
      <nav style={{ width: "100%", background: "rgba(18,18,18,0.97)", backdropFilter: "blur(24px)", borderTop: `1px solid ${C.goldLine}`, display: "flex", alignItems: "center", justifyContent: "space-around", padding: "10px 0 20px", overflow: "visible", position: "relative" }}>
        <button onClick={() => setTab("ootd")} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: tab === "ootd" ? C.gold : C.textMuted, padding: "0 32px" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 3h12v8H6z"/><path d="M7 11l2 8h6l2-8"/><circle cx="8" cy="6" r="1"/></svg>
          <span style={{ fontSize: 9, letterSpacing: 1.5, fontFamily: "'DM Sans',sans-serif" }}>OOTD</span>
          {tab === "ootd" && <div style={{ width: 18, height: 1.5, background: C.gold, borderRadius: 1 }} />}
        </button>
        <button onClick={() => setShowMenu(m => !m)} style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg,${C.gold},${C.goldLight})`, color: C.obsidian, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", marginTop: -28, boxShadow: `0 4px 20px rgba(197,160,89,0.6)`, flexShrink: 0 }}>+</button>
        <button onClick={() => setTab("profile")} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: tab === "profile" ? C.gold : C.textMuted, padding: "0 32px" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6"/></svg>
          <span style={{ fontSize: 9, letterSpacing: 1.5, fontFamily: "'DM Sans',sans-serif" }}>{t.myProfile.split(" ")[0]}</span>
          {tab === "profile" && <div style={{ width: 18, height: 1.5, background: C.gold, borderRadius: 1 }} />}
        </button>
      </nav>
    </>
  );
}

// ─── ITEM IMG ─────────────────────────────────────────────────
function ItemImg({ item, size = 52 }) {
  const initial = (item.brand || item.name || "?")[0].toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg,${item.color}88,${item.color}44)`, border: `1px solid ${item.color}66`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontSize: size * 0.38, color: "#F2EDE6", fontFamily: "'Cormorant Garamond',serif", fontWeight: 300 }}>{initial}</span>
    </div>
  );
}

// ─── QUICK EDIT SHEET ────────────────────────────────────────
function QuickEditSheet({ item, onClose, onSave, t }) {
  const [form, setForm] = useState({ name: item.name, brand: item.brand, cat: item.cat, price: String(item.price), worn: String(item.worn), img: item.img || null });
  const imgRef = useRef();
  const camRef = useRef();
  const BRANDS = ["Totême","The Row","Lemaire","Arket","COS","ZARA","Saint Laurent"];
  const CATS_BASE = ["上衣","下著","外套","洋裝","鞋履","配件"];
  const readFile = f => {
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => setForm(p => ({ ...p, img: ev.target.result }));
    r.readAsDataURL(f);
  };
  const save = () => {
    onSave(item.id, {
      name: form.name.trim() || item.name,
      brand: form.brand.trim() || item.brand,
      cat: form.cat,
      price: parseInt(form.price) || item.price,
      worn: parseInt(form.worn) >= 0 ? parseInt(form.worn) : item.worn,
      img: form.img,
    });
    onClose();
  };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 600, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div className="slideUp" onClick={e => e.stopPropagation()} style={{ background: C.surface, width: "100%", maxWidth: 480, borderRadius: "24px 24px 0 0", border: `1px solid ${C.goldLine}`, borderBottom: "none", height: "90vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* 頂部 */}
        <div style={{ flexShrink: 0, padding: "14px 24px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ width: 38, height: 3, background: C.goldLine, borderRadius: 2 }} />
            <button onClick={onClose} style={{ color: C.textMuted, fontSize: 20, lineHeight: 1 }}>✕</button>
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 9, color: C.gold, letterSpacing: 4, marginBottom: 2, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>EDIT ITEM</div>
            <div style={{ fontSize: 18, color: C.text, fontFamily: "'Cormorant Garamond',serif" }}>{item.brand} · {item.name}</div>
          </div>
        </div>

        {/* 捲動內容 */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}>

          {/* 圖片 */}
          <div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>商品圖片</div>
          {form.img ? (
            <div style={{ borderRadius: 14, overflow: "hidden", marginBottom: 10, position: "relative", height: 160, background: "#0a0a0a" }}>
              <img src={form.img} style={{ width: "100%", height: "100%", objectFit: "contain" }} alt="preview" />
              <button onClick={() => setForm(p => ({ ...p, img: null }))} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.65)", borderRadius: 8, padding: "4px 10px", color: C.text, fontSize: 11, fontFamily: "'DM Sans',sans-serif" }}>✕ 移除</button>
            </div>
          ) : (
            <div style={{ height: 80, background: C.card, border: `1.5px dashed ${C.goldDim}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Sans',sans-serif" }}>尚未上傳圖片</span>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
            <button onClick={() => camRef.current.click()} style={{ padding: "11px 0", borderRadius: 10, border: `1px solid ${C.goldLine}`, color: C.gold, fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>📷 拍照</button>
            <button onClick={() => imgRef.current.click()} style={{ padding: "11px 0", borderRadius: 10, border: `1px solid ${C.border}`, color: C.textMuted, fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>🖼️ 選圖片</button>
          </div>
          <input ref={camRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={e => readFile(e.target.files?.[0])} />
          <input ref={imgRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => readFile(e.target.files?.[0])} />

          {/* 文字欄位 */}
          {[
            { label: t.itemName, key: "name", placeholder: "e.g. Silk Slip Dress" },
            { label: t.brandLabel, key: "brand", placeholder: "e.g. The Row" },
            { label: `${t.purchasePrice} (NT$)`, key: "price", type: "number" },
            { label: t.wearCount, key: "worn", type: "number" },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 6, fontFamily: "'DM Sans',sans-serif" }}>{f.label}</div>
              <input type={f.type || "text"} value={form[f.key]} placeholder={f.placeholder} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                style={{ width: "100%", background: C.card, border: `1px solid ${C.goldLine}`, borderRadius: 10, padding: "11px", color: C.text, fontFamily: "'DM Sans',sans-serif", boxSizing: "border-box" }} />
            </div>
          ))}

          {/* 品牌快選 */}
          <div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>品牌快選</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {BRANDS.map(b => (
              <button key={b} onClick={() => setForm(p => ({ ...p, brand: b }))} style={{ padding: "5px 12px", borderRadius: 20, fontSize: 10, background: form.brand === b ? C.gold : C.card, color: form.brand === b ? C.obsidian : C.textMuted, border: `1px solid ${form.brand === b ? C.gold : C.border}`, fontFamily: "'DM Sans',sans-serif" }}>{b}</button>
            ))}
          </div>

          {/* 分類 */}
          <div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>{t.category}</div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 20 }}>
            {CATS_BASE.map(c => (
              <button key={c} onClick={() => setForm(p => ({ ...p, cat: c }))} style={{ padding: "7px 14px", borderRadius: 20, fontSize: 10, background: form.cat === c ? C.gold : C.card, color: form.cat === c ? C.obsidian : C.textMuted, border: `1px solid ${form.cat === c ? C.gold : C.border}`, fontFamily: "'DM Sans',sans-serif" }}>{c}</button>
            ))}
          </div>
        </div>

        {/* 固定底部 */}
        <div style={{ flexShrink: 0, padding: "12px 24px 36px", borderTop: `1px solid ${C.border}` }}>
          <button onClick={save} style={{ width: "100%", padding: "15px", borderRadius: 12, background: `linear-gradient(135deg,${C.gold},${C.goldLight})`, color: C.obsidian, fontSize: 14, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, letterSpacing: 1 }}>
            ✓ 儲存修改
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ITEM CARD ────────────────────────────────────────────────
function ItemCard({ item, selMode, selected, onToggle, onClick, onEdit, delay = 0, t }) {
  const [showEdit, setShowEdit] = useState(false);
  return (
    <div className="fadeUp" style={{ animationDelay: `${delay}ms` }} onClick={() => selMode && onToggle(item.id)}>
      <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${selected ? C.gold : C.border}`, position: "relative", cursor: selMode ? "pointer" : "default" }}>

        {/* 選取勾勾 */}
        {selMode && (
          <div style={{ position: "absolute", top: 9, left: 9, zIndex: 10, width: 22, height: 22, borderRadius: "50%", background: selected ? `linear-gradient(135deg,${C.gold},${C.goldLight})` : C.card, border: `1px solid ${selected ? C.gold : C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {selected && <span style={{ color: C.obsidian, fontSize: 11, fontWeight: 700 }}>✓</span>}
          </div>
        )}

        {/* 編輯鈕 — 右上角 */}
        {!selMode && (
          <button onClick={e => { e.stopPropagation(); setShowEdit(true); }} style={{ position: "absolute", top: 9, right: 9, zIndex: 10, width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, cursor: "pointer" }}>
            ✏️
          </button>
        )}

        {/* 圖片區 */}
        <div style={{ height: 160, background: item.img ? "#0a0a0a" : `radial-gradient(ellipse at 50% 30%, ${item.color}44, transparent)`, borderRadius: "16px 16px 0 0", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          {item.img
            ? <img src={item.img} style={{ width: "100%", height: "100%", objectFit: "contain" }} alt={item.name} />
            : <span style={{ fontSize: 40, color: "#F2EDE699", fontFamily: "'Cormorant Garamond',serif", fontWeight: 300 }}>{(item.brand || "?")[0].toUpperCase()}</span>
          }
          {/* 詳細頁箭頭 */}
          {!selMode && (
            <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(10px)", borderRadius: 8, padding: "4px 8px" }}>
              <div onClick={e => { e.stopPropagation(); onClick(item); }} style={{ cursor: "pointer", color: C.gold, fontSize: 16 }}>›</div>
            </div>
          )}
        </div>

        {/* 文字區 */}
        <div style={{ padding: "11px 13px 0" }}>
          <div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 3, fontFamily: "'DM Sans',sans-serif" }}>{t.brand}</div>
          <div style={{ fontSize: 13, color: C.text, fontFamily: "'Cormorant Garamond',serif", marginBottom: 8 }}>{item.brand}</div>
          <div style={{ margin: "0 0 11px", borderRadius: 8, background: "rgba(255,255,255,0.03)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
            {[`${item.worn}×`, `${Math.round(item.price/1000)}k`, fmt(cpw(item))].map((v, i) => (
              <div key={i} style={{ textAlign: "center", padding: "6px 2px", borderLeft: i > 0 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ fontSize: 8, color: C.textMuted, letterSpacing: 1.5, marginBottom: 2, fontFamily: "'DM Sans',sans-serif" }}>{["×","¥","≈"][i]}</div>
                <div style={{ fontSize: 11, color: i === 0 ? C.gold : i === 2 ? C.goldLight : C.textSub, fontFamily: "'DM Sans',sans-serif", fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Edit Sheet */}
      {showEdit && (
        <QuickEditSheet item={item} onClose={() => setShowEdit(false)} onSave={onEdit} t={t} />
      )}
    </div>
  );
}

// ─── DETAIL SHEET ─────────────────────────────────────────────
function DetailSheet({ item, items, onClose, onDelete, onAddWear, onEdit, t }) {
  const idx = items.findIndex(i => i.id === item.id);
  const [cur, setCur] = useState(idx >= 0 ? idx : 0);
  const [editMode, setEditMode] = useState(false);
  const it = items[cur] || item;
  const [form, setForm] = useState({ name: it.name, brand: it.brand, cat: it.cat, price: String(it.price), worn: String(it.worn), img: it.img || null });
  const imgRef = useRef();
  const camRef = useRef();

  useEffect(() => {
    const c = items[cur] || item;
    setForm({ name: c.name, brand: c.brand, cat: c.cat, price: String(c.price), worn: String(c.worn), img: c.img || null });
    setEditMode(false);
  }, [cur]);

  const cpVal = cpw(it);
  const cpLabel = it.worn >= 15 ? t.cpHigh : it.worn >= 8 ? t.cpGood : it.worn >= 3 ? t.cpMid : t.cpLow;
  const CATS_BASE = ["上衣","下著","外套","洋裝","鞋履","配件"];
  const BRANDS = ["Totême","The Row","Lemaire","Arket","COS","ZARA","Saint Laurent"];

  const readFile = f => {
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => setForm(p => ({ ...p, img: ev.target.result }));
    r.readAsDataURL(f);
  };

  const saveEdit = () => {
    onEdit(it.id, {
      name: form.name.trim() || it.name,
      brand: form.brand.trim() || it.brand,
      cat: form.cat,
      price: parseInt(form.price) || it.price,
      worn: parseInt(form.worn) >= 0 ? parseInt(form.worn) : it.worn,
      img: form.img,
    });
    setEditMode(false);
  };

  /* hero 區域：有圖片顯示圖片，沒有顯示色塊 */
  const HeroImg = () => (
    <div style={{ height: 220, background: it.img ? "#0a0a0a" : `radial-gradient(ellipse at 50% 40%, ${it.color}44, #0a0a0a)`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {it.img
        ? <img src={it.img} style={{ width: "100%", height: "100%", objectFit: "contain" }} alt={it.name} />
        : <span style={{ fontSize: 80, color: "#F2EDE622", fontFamily: "'Cormorant Garamond',serif", fontWeight: 300 }}>{(it.brand||"?")[0].toUpperCase()}</span>
      }
      {/* 編輯按鈕 */}
      <button onClick={() => setEditMode(e => !e)} style={{ position: "absolute", top: 12, right: 14, padding: "6px 14px", borderRadius: 20, border: `1px solid ${editMode ? C.gold : C.border}`, background: editMode ? C.goldGlow : "rgba(0,0,0,0.55)", color: editMode ? C.gold : C.textMuted, fontSize: 11, fontFamily: "'DM Sans',sans-serif", fontWeight: 500, backdropFilter: "blur(8px)" }}>
        {editMode ? "✕ 取消" : "✏️ 編輯"}
      </button>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.82)", display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div className="slideUp" onClick={e => e.stopPropagation()} style={{ background: C.surface, width: "100%", maxWidth: 480, borderRadius: "24px 24px 0 0", border: `1px solid ${C.goldLine}`, borderBottom: "none", height: "92vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* 頂部翻頁 */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px 8px" }}>
          <button onClick={e => { e.stopPropagation(); setCur(c => Math.max(0, c-1)); }} style={{ color: cur===0 ? C.textMuted : C.gold, fontSize: 24, width: 36 }}>‹</button>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 38, height: 3, background: C.goldLine, borderRadius: 2, margin: "0 auto 6px" }} />
            <span style={{ fontSize: 9, color: C.textMuted, letterSpacing: 2, fontFamily: "'DM Sans',sans-serif" }}>{cur+1} / {items.length}</span>
          </div>
          <button onClick={e => { e.stopPropagation(); setCur(c => Math.min(items.length-1, c+1)); }} style={{ color: cur===items.length-1 ? C.textMuted : C.gold, fontSize: 24, width: 36 }}>›</button>
        </div>

        {/* 捲動區 */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <HeroImg />

          <div style={{ padding: "20px 24px 48px" }}>
            {editMode ? (
              /* ══ 編輯模式 ══ */
              <div>
                <div style={{ fontSize: 10, color: C.gold, letterSpacing: 4, marginBottom: 16, fontFamily: "'DM Sans',sans-serif" }}>EDIT ITEM</div>

                {/* 圖片上傳區 */}
                <div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>商品圖片</div>
                {form.img ? (
                  <div style={{ borderRadius: 14, overflow: "hidden", marginBottom: 10, position: "relative", height: 160, background: "#0a0a0a" }}>
                    <img src={form.img} style={{ width: "100%", height: "100%", objectFit: "contain" }} alt="preview" />
                    <button onClick={() => setForm(p => ({ ...p, img: null }))} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.65)", borderRadius: 8, padding: "4px 10px", color: C.text, fontSize: 11, fontFamily: "'DM Sans',sans-serif" }}>✕ 移除</button>
                  </div>
                ) : (
                  <div style={{ height: 80, background: C.card, border: `1.5px dashed ${C.goldDim}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Sans',sans-serif" }}>尚未上傳圖片</span>
                  </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
                  <button onClick={() => camRef.current.click()} style={{ padding: "11px 0", borderRadius: 10, border: `1px solid ${C.goldLine}`, color: C.gold, fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>📷 拍照</button>
                  <button onClick={() => imgRef.current.click()} style={{ padding: "11px 0", borderRadius: 10, border: `1px solid ${C.border}`, color: C.textMuted, fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>🖼️ 選圖片</button>
                </div>
                <input ref={camRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={e => readFile(e.target.files?.[0])} />
                <input ref={imgRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => readFile(e.target.files?.[0])} />

                {/* 文字欄位 */}
                {[
                  { label: t.itemName, key: "name" },
                  { label: t.brandLabel, key: "brand" },
                  { label: `${t.purchasePrice} (NT$)`, key: "price", type: "number" },
                  { label: t.wearCount, key: "worn", type: "number" },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 6, fontFamily: "'DM Sans',sans-serif" }}>{f.label}</div>
                    <input type={f.type || "text"} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      style={{ width: "100%", background: C.card, border: `1px solid ${C.goldLine}`, borderRadius: 10, padding: "11px", color: C.text, fontFamily: "'DM Sans',sans-serif", boxSizing: "border-box" }} />
                  </div>
                ))}

                {/* 品牌快選 */}
                <div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>品牌快選</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                  {BRANDS.map(b => (
                    <button key={b} onClick={() => setForm(p => ({ ...p, brand: b }))} style={{ padding: "5px 12px", borderRadius: 20, fontSize: 10, background: form.brand===b ? C.gold : C.card, color: form.brand===b ? C.obsidian : C.textMuted, border: `1px solid ${form.brand===b ? C.gold : C.border}`, fontFamily: "'DM Sans',sans-serif" }}>{b}</button>
                  ))}
                </div>

                {/* 分類 */}
                <div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>{t.category}</div>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 24 }}>
                  {CATS_BASE.map(c => (
                    <button key={c} onClick={() => setForm(p => ({ ...p, cat: c }))} style={{ padding: "7px 14px", borderRadius: 20, fontSize: 10, background: form.cat===c ? C.gold : C.card, color: form.cat===c ? C.obsidian : C.textMuted, border: `1px solid ${form.cat===c ? C.gold : C.border}`, fontFamily: "'DM Sans',sans-serif" }}>{c}</button>
                  ))}
                </div>

                <button onClick={saveEdit} style={{ width: "100%", padding: "15px", borderRadius: 12, background: `linear-gradient(135deg,${C.gold},${C.goldLight})`, color: C.obsidian, fontSize: 14, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, letterSpacing: 1 }}>
                  ✓ 儲存修改
                </button>
              </div>
            ) : (
              /* ══ 檢視模式 ══ */
              <div>
                <div style={{ fontSize: 10, color: C.gold, letterSpacing: 4, marginBottom: 4, fontFamily: "'DM Sans',sans-serif" }}>{t.detail}</div>
                <div style={{ fontSize: 24, color: C.text, fontFamily: "'Cormorant Garamond',serif", marginBottom: 4 }}>{it.name}</div>
                <div style={{ fontSize: 12, color: C.textSub, fontFamily: "'DM Sans',sans-serif", marginBottom: 16 }}>{it.brand} · {it.cat}</div>

                <div style={{ background: `linear-gradient(135deg,${C.goldGlow},transparent)`, border: `1px solid ${C.goldLine}`, borderRadius: 12, padding: "16px", marginBottom: 18, display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 4, fontFamily: "'DM Sans',sans-serif" }}>{t.avgWear}</div>
                    <div style={{ fontSize: 26, color: C.text, fontFamily: "'Cormorant Garamond',serif" }}>{fmt(cpVal)}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 9, color: C.textMuted, letterSpacing: 2, marginBottom: 4, fontFamily: "'DM Sans',sans-serif" }}>{t.cp}</div>
                    <div style={{ fontSize: 14, color: it.worn>=15 ? C.gold : it.worn>=8 ? C.goldLight : C.textMuted, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>{cpLabel}</div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 18 }}>
                  {[{ l: t.category, v: it.cat }, { l: t.purchasePrice, v: fmt(it.price) }, { l: t.wearCount, v: `${it.worn}` }].map(d => (
                    <div key={d.l} style={{ background: C.card, borderRadius: 10, padding: "12px 10px" }}>
                      <div style={{ fontSize: 8, color: C.textMuted, letterSpacing: 2, marginBottom: 4, fontFamily: "'DM Sans',sans-serif" }}>{d.l}</div>
                      <div style={{ fontSize: 11, color: C.text, fontFamily: "'DM Sans',sans-serif", fontWeight: 500 }}>{d.v}</div>
                    </div>
                  ))}
                </div>

                <button onClick={() => onAddWear(it.id)} style={{ width: "100%", padding: "15px", borderRadius: 12, marginBottom: 10, background: `linear-gradient(135deg,${C.gold},${C.goldLight})`, color: C.obsidian, fontSize: 14, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, letterSpacing: 1 }}>
                  {t.addWear}
                </button>
                <button onClick={() => onDelete(it.id)} style={{ width: "100%", padding: "13px", borderRadius: 12, background: C.redDim, color: C.red, fontSize: 11, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>
                  {t.deleteItem}
                </button>

                <div style={{ background: C.card, borderRadius: 12, padding: "16px", marginTop: 16, border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 12, fontFamily: "'DM Sans',sans-serif" }}>{t.costForecast}</div>
                  {[5, 10, 20].map(n => (
                    <div key={n} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 11 }}>
                      <span style={{ color: C.textSub, fontFamily: "'DM Sans',sans-serif" }}>{t.wearMore(n)}</span>
                      <span style={{ color: C.gold, fontFamily: "'DM Sans',sans-serif" }}>{fmt(Math.round(it.price / (it.worn + n)))}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// ─── LOG MODAL ────────────────────────────────────────────────
function LogModal({ items, preSelected, onClose, onSave, t }) {
  const [sel, setSel] = useState(preSelected || []);
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState(null);
  const camRef = useRef();
  const galleryRef = useRef();
  const toggle = id => setSel(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const readFile = f => {
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => setPhoto(ev.target.result);
    r.readAsDataURL(f);
  };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 550, background: "rgba(0,0,0,0.82)", display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div className="slideUp" onClick={e => e.stopPropagation()} style={{ background: C.surface, width: "100%", maxWidth: 480, borderRadius: "24px 24px 0 0", border: `1px solid ${C.goldLine}`, borderBottom: "none", height: "88vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>

        <div style={{ flexShrink: 0, padding: "14px 24px 12px" }}>
          <div style={{ width: 38, height: 3, background: C.goldLine, borderRadius: 2, margin: "0 auto 14px" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 22, color: C.text, fontFamily: "'Cormorant Garamond',serif" }}>{t.recordOutfit}</div>
            <button onClick={onClose} style={{ color: C.textMuted, fontSize: 20, lineHeight: 1 }}>✕</button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}>
          <div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 10, fontFamily: "'DM Sans',sans-serif" }}>單品</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 20 }}>
            {items.map(item => {
              const isSel = sel.includes(item.id);
              return (
                <button key={item.id} onClick={() => toggle(item.id)} style={{ padding: "10px 12px", borderRadius: 12, border: `1.5px solid ${isSel ? C.gold : C.border}`, background: isSel ? C.goldGlow : C.card, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", textAlign: "left" }}>
                  <ItemImg item={item} size={28} />
                  <div style={{ overflow: "hidden", flex: 1 }}>
                    <div style={{ fontSize: 11, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.brand}</div>
                    <div style={{ fontSize: 9, color: C.gold, fontFamily: "'DM Sans',sans-serif" }}>{item.cat}</div>
                  </div>
                  {isSel && <span style={{ color: C.gold, fontSize: 12, flexShrink: 0 }}>✓</span>}
                </button>
              );
            })}
          </div>

          <div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 10, fontFamily: "'DM Sans',sans-serif" }}>OOTD 照片</div>
          {photo ? (
            <div style={{ borderRadius: 14, overflow: "hidden", marginBottom: 12, position: "relative", height: 160 }}>
              <img src={photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="ootd" />
              <button onClick={() => setPhoto(null)} style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.65)", borderRadius: 8, padding: "5px 10px", color: C.text, fontSize: 11, fontFamily: "'DM Sans',sans-serif" }}>
                ✕ 移除
              </button>
            </div>
          ) : (
            <div style={{ height: 80, background: C.card, border: `1.5px dashed ${C.goldDim}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Sans',sans-serif" }}>尚未選擇照片</span>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            <button onClick={() => camRef.current.click()} style={{ padding: "12px 0", borderRadius: 10, border: `1px solid ${C.goldLine}`, color: C.gold, fontSize: 12, fontFamily: "'DM Sans',sans-serif", fontWeight: 500 }}>📷 拍照</button>
            <button onClick={() => galleryRef.current.click()} style={{ padding: "12px 0", borderRadius: 10, border: `1px solid ${C.border}`, color: C.textMuted, fontSize: 12, fontFamily: "'DM Sans',sans-serif", fontWeight: 500 }}>🖼️ 選圖片</button>
          </div>
          <input ref={camRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={e => readFile(e.target.files?.[0])} />
          <input ref={galleryRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => readFile(e.target.files?.[0])} />

          <div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>{t.remark}</div>
          <input value={note} onChange={e => setNote(e.target.value)} placeholder={t.remarkPH} style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px", color: C.text, fontFamily: "'DM Sans',sans-serif", marginBottom: 24, boxSizing: "border-box" }} />
        </div>

        <div style={{ flexShrink: 0, padding: "12px 24px 36px", borderTop: `1px solid ${C.border}` }}>
          <button onClick={() => onSave(sel, note, photo)} disabled={sel.length === 0} style={{ width: "100%", padding: "15px", background: sel.length > 0 ? `linear-gradient(135deg,${C.gold},${C.goldLight})` : C.card, color: sel.length > 0 ? C.obsidian : C.textMuted, borderRadius: 12, fontSize: 13, letterSpacing: 1, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>
            {t.save(sel.length)}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ADD ITEM SHEET ───────────────────────────────────────────
function AddSheet({ onClose, onAddItem, t }) {
  const [form, setForm] = useState({ name: "", brand: "", cat: "上衣", price: "", color: "#c5a059" });
  const [tried, setTried] = useState(false);
  const BRANDS = ["Totême", "The Row", "Lemaire", "Arket", "COS", "ZARA", "Saint Laurent"];
  const err = { name: tried && !form.name.trim(), brand: tried && !form.brand.trim(), price: tried && !form.price };
  const submit = () => {
    setTried(true);
    if (!form.name.trim() || !form.brand.trim() || !form.price) return;
    onAddItem({ ...form, id: Date.now(), price: parseInt(form.price) || 0, worn: 0 });
    onClose();
  };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 600, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div className="slideUp" onClick={e => e.stopPropagation()} style={{ background: C.surface, width: "100%", maxWidth: 480, borderRadius: "24px 24px 0 0", border: `1px solid ${C.goldLine}`, borderBottom: "none", height: "90vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>

        <div style={{ flexShrink: 0, padding: "14px 24px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ width: 38, height: 3, background: C.goldLine, borderRadius: 2 }} />
            <button onClick={onClose} style={{ color: C.textMuted, fontSize: 20, lineHeight: 1 }}>✕</button>
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 9, color: C.gold, letterSpacing: 4, marginBottom: 3, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>{t.addItemTitle}</div>
            <div style={{ fontSize: 20, color: C.text, fontFamily: "'Cormorant Garamond',serif" }}>{t.addToWardrobe}</div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}>
          {[{ label: t.itemName, key: "name", placeholder: t.itemNamePH }, { label: t.brandLabel, key: "brand", placeholder: t.brandPH }, { label: t.purchaseAmt, key: "price", placeholder: "0", type: "number" }].map(f => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, color: err[f.key] ? C.red : C.gold, letterSpacing: 3, marginBottom: 7, fontFamily: "'DM Sans',sans-serif" }}>{f.label}</div>
              <input type={f.type || "text"} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ width: "100%", background: C.card, border: `1px solid ${err[f.key] ? "rgba(224,85,85,0.6)" : C.border}`, borderRadius: 10, padding: "11px", color: C.text, fontFamily: "'DM Sans',sans-serif", boxSizing: "border-box" }} />
              {err[f.key] && <div style={{ fontSize: 10, color: C.red, marginTop: 4 }}>{t.required}</div>}
            </div>
          ))}

          <div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>{t.brandLabel}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {BRANDS.map(b => (
              <button key={b} onClick={() => setForm(p => ({ ...p, brand: b }))} style={{ padding: "5px 12px", borderRadius: 20, fontSize: 10, background: form.brand === b ? C.gold : C.card, color: form.brand === b ? C.obsidian : C.textMuted, border: `1px solid ${form.brand === b ? C.gold : C.border}`, fontFamily: "'DM Sans',sans-serif" }}>{b}</button>
            ))}
          </div>

          <div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>{t.category}</div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 20 }}>
            {["上衣","下著","外套","洋裝","鞋履","配件"].map(c => (
              <button key={c} onClick={() => setForm(p => ({ ...p, cat: c }))} style={{ padding: "7px 14px", borderRadius: 20, fontSize: 10, background: form.cat === c ? C.gold : C.card, color: form.cat === c ? C.obsidian : C.textMuted, border: `1px solid ${form.cat === c ? C.gold : C.border}`, fontFamily: "'DM Sans',sans-serif" }}>{c}</button>
            ))}
          </div>
        </div>

        <div style={{ flexShrink: 0, padding: "12px 24px 36px", borderTop: `1px solid ${C.border}` }}>
          <button onClick={submit} style={{ width: "100%", padding: 15, borderRadius: 12, background: `linear-gradient(135deg,${C.gold},${C.goldLight})`, color: C.obsidian, fontSize: 13, fontFamily: "'DM Sans',sans-serif", fontWeight: 600, letterSpacing: 1 }}>
            {t.addItemBtn}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── WARDROBE INNER ───────────────────────────────────────────
function WardrobeInner({ items, setItems, onBack, t }) {
  const [catIdx, setCatIdx] = useState(0);
  const [selMode, setSelMode] = useState(false);
  const [sel, setSel] = useState([]);
  const [detail, setDetail] = useState(null);
  const cats = t.cats;
  const filtered = catIdx === 0 ? items : items.filter(i => {
    const baseCats = ["全部","上衣","下著","外套","洋裝","鞋履","配件"];
    return i.cat === baseCats[catIdx];
  });
  const toggleSel = id => setSel(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const doDelete = () => { setItems(p => p.filter(i => !sel.includes(i.id))); setSel([]); setSelMode(false); };
  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ padding: "22px 22px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <button onClick={onBack} style={{ color: C.gold, fontSize: 22 }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: C.gold, letterSpacing: 5, marginBottom: 4, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>{t.wardrobeTitle}</div>
            <div style={{ fontSize: 28, color: C.text, fontFamily: "'Cormorant Garamond',serif", fontWeight: 300 }}>{t.items(filtered.length)}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
          {selMode ? (
            <>
              <button onClick={() => setSel(filtered.every(i => sel.includes(i.id)) ? [] : filtered.map(i => i.id))} style={{ fontSize: 11, color: C.gold, padding: "4px 12px", borderRadius: 20, border: `1px solid ${C.border}` }}>{t.selectAll}</button>
              {sel.length > 0 && <button onClick={doDelete} style={{ fontSize: 11, color: C.red, padding: "4px 12px", borderRadius: 20, border: `1px solid ${C.redDim}`, background: C.redDim }}>{t.deleteN(sel.length)}</button>}
              <button onClick={() => { setSelMode(false); setSel([]); }} style={{ fontSize: 11, color: C.textMuted, padding: "4px 12px", borderRadius: 20, border: `1px solid ${C.border}` }}>{t.done}</button>
            </>
          ) : (
            <button onClick={() => setSelMode(true)} style={{ fontSize: 11, color: C.textSub, padding: "4px 12px", borderRadius: 20, border: `1px solid ${C.border}` }}>{t.editBtn}</button>
          )}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "12px 22px" }}>
        {cats.map((c, i) => (
          <button key={c} onClick={() => setCatIdx(i)} style={{ padding: "6px 16px", borderRadius: 20, fontSize: 10, background: catIdx === i ? C.gold : C.card, color: catIdx === i ? C.obsidian : C.textMuted, border: `1px solid ${catIdx === i ? C.gold : C.border}`, fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap" }}>{c}</button>
        ))}
      </div>
      <div style={{ padding: "0 22px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {filtered.map((item, i) => (
          <ItemCard key={item.id} item={item} selMode={selMode} selected={sel.includes(item.id)} onToggle={toggleSel} onClick={setDetail} onEdit={(id, updates) => setItems(p => p.map(it => it.id === id ? { ...it, ...updates } : it))} delay={i * 30} t={t} />
        ))}
      </div>
      {detail && (
        <DetailSheet item={detail} items={filtered} onClose={() => setDetail(null)}
          onDelete={id => { setItems(p => p.filter(i => i.id !== id)); setDetail(null); }}
          onAddWear={id => setItems(p => p.map(i => i.id === id ? { ...i, worn: i.worn + 1 } : i))}
          onEdit={(id, updates) => setItems(p => p.map(i => i.id === id ? { ...i, ...updates } : i))}
          t={t}
        />
      )}
    </div>
  );
}

// ─── OOTD TAB ─────────────────────────────────────────────────
function OOTDTab({ items, diary, setDiary, setItems, t }) {
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
  const selEntry = selected ? diary[dateKey(selected)] : null;
  const selIds = selEntry?.itemIds || [];
  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };
  const saveLog = (itemIds, note, photo) => {
    const k = dateKey(selected || today.getDate());
    setDiary(p => ({ ...p, [k]: { itemIds, note, photo } }));
    setItems(p => p.map(i => itemIds.includes(i.id) ? { ...i, worn: i.worn + 1 } : i));
    setShowLog(false);
  };
  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ padding: "28px 22px 0" }}>
        <div style={{ fontSize: 11, color: C.textMuted, letterSpacing: 3, marginBottom: 4, fontFamily: "'DM Sans',sans-serif" }}>{t.ootdLabel}</div>
        <div style={{ fontSize: 28, color: C.text, fontFamily: "'Cormorant Garamond',serif", fontWeight: 300, marginBottom: 20 }}>{t.journal}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <button onClick={prevMonth} style={{ color: C.gold, fontSize: 22, padding: "0 6px" }}>‹</button>
          <div style={{ fontSize: 14, color: C.text, letterSpacing: 4, fontFamily: "'Cormorant Garamond',serif" }}>
            {String(viewMonth + 1).padStart(2, "0")} · {viewYear}
          </div>
          <button onClick={nextMonth} style={{ color: C.gold, fontSize: 22, padding: "0 6px" }}>›</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 8 }}>
          {t.weekDays.map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: 9, color: C.textMuted, letterSpacing: 1, fontFamily: "'DM Sans',sans-serif", marginBottom: 8 }}>{d}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 5, marginBottom: 20 }}>
          {cells.map((d, i) => {
            if (!d) return <div key={"e" + i} />;
            const entry = diary[dateKey(d)];
            const isToday = d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
            const isSel = selected === d;
            return (
              <div key={d} onClick={() => setSelected(d === selected ? null : d)} style={{ borderRadius: 10, background: entry?.photo ? "transparent" : isSel ? `linear-gradient(135deg,${C.gold}20,${C.goldLight}10)` : C.card, border: `1.5px solid ${isSel ? C.gold : isToday ? C.goldDim : C.border}`, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", padding: "7px 0 5px", minHeight: 50, position: "relative", overflow: "hidden" }}>
                {entry?.photo && <img src={entry.photo} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} alt="" />}
                <span style={{ fontSize: 11, color: isToday ? C.gold : entry?.photo ? "#fff" : isSel ? C.goldLight : C.text, fontWeight: 700, position: "relative", zIndex: 1, textShadow: entry?.photo ? "0 1px 3px rgba(0,0,0,0.8)" : "none" }}>{d}</span>
                {entry && !entry.photo && <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.gold, marginTop: 2, position: "relative", zIndex: 1 }} />}
              </div>
            );
          })}
        </div>
        {selected && (
          <div style={{ background: C.card, border: `1px solid ${C.goldLine}`, borderRadius: 16, padding: "16px", marginBottom: 20 }}>
            <div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 12, fontFamily: "'DM Sans',sans-serif" }}>
              {String(selected).padStart(2, "0")} {MONTHS[viewMonth].toUpperCase()}
            </div>
            {selEntry ? (
              <>
                {selEntry.photo && (
                  <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 12, height: 180 }}>
                    <img src={selEntry.photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="ootd" />
                  </div>
                )}
                <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                  {selIds.map(id => {
                    const it = items.find(i => i.id === id);
                    return it ? (
                      <div key={id} style={{ display: "flex", alignItems: "center", gap: 6, background: C.surface, borderRadius: 8, padding: "4px 8px" }}>
                        <div style={{ width: 14, height: 14, borderRadius: "50%", background: it.color }} />
                        <span style={{ fontSize: 11, color: C.textSub, fontFamily: "'DM Sans',sans-serif" }}>{it.brand}</span>
                      </div>
                    ) : null;
                  })}
                </div>
                {selEntry.note && <div style={{ fontSize: 11, color: C.textMuted, fontStyle: "italic", marginBottom: 12 }}>"{selEntry.note}"</div>}
                <button onClick={() => setShowLog(true)} style={{ fontSize: 11, color: C.gold, padding: "4px 8px", borderRadius: 6, border: `1px solid ${C.goldLine}` }}>{t.edit}</button>
              </>
            ) : (
              <div>
                <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 14, fontFamily: "'DM Sans',sans-serif" }}>{t.noRecord}</div>
                <button onClick={() => setShowLog(true)} style={{ width: "100%", padding: "12px", borderRadius: 10, background: `linear-gradient(135deg,${C.gold},${C.goldLight})`, color: C.obsidian, fontSize: 11, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>
                  {t.recordOOTD}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div style={{ padding: "0 22px 20px" }}>
        <button onClick={() => { setSelected(today.getDate()); setShowLog(true); }} style={{ width: "100%", padding: "14px", borderRadius: 12, border: `1px solid ${C.goldLine}`, color: C.gold, fontSize: 12, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>
          {t.recordToday}
        </button>
      </div>
      {showLog && <LogModal items={items} preSelected={selEntry?.itemIds || []} onClose={() => setShowLog(false)} onSave={saveLog} t={t} />}
    </div>
  );
}

// ─── PROFILE TAB ──────────────────────────────────────────────
function ProfileTab({ items, setItems, username, onLogout, t, lang, setLang }) {
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [currency, setCurrency] = useState(CURRENCY_OPTIONS[0]);
  const [showCurr, setShowCurr] = useState(false);
  const [hidden, setHidden] = useState(false);
  const total = items.reduce((s, i) => s + i.price, 0);
  const totalWorn = items.reduce((s, i) => s + i.worn, 0);
  const top5 = [...items].filter(i => i.worn > 0).sort((a, b) => cpw(a) - cpw(b)).slice(0, 5);
  const cold5 = [...items].sort((a, b) => a.worn - b.worn).slice(0, 5);
  const baseCats = ["上衣","下著","外套","洋裝","鞋履","配件"];
  const catCounts = baseCats.map((c, i) => ({ cat: t.cats[i + 1], count: items.filter(it => it.cat === c).length }));
  const maxC = Math.max(...catCounts.map(d => d.count), 1);

  if (showWardrobe) return <WardrobeInner items={items} setItems={setItems} onBack={() => setShowWardrobe(false)} t={t} />;

  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ padding: "28px 22px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, color: C.gold, letterSpacing: 5, marginBottom: 5, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>{t.myProfile}</div>
            <div style={{ fontSize: 30, color: C.text, fontFamily: "'Cormorant Garamond',serif", fontWeight: 300 }}>Hi, {username}</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <LangSwitcher lang={lang} setLang={setLang} />
            <button onClick={() => setShowCurr(s => !s)} style={{ padding: "5px 12px", borderRadius: 20, border: `1px solid ${C.border}`, color: C.gold, fontSize: 10, fontFamily: "'DM Sans',sans-serif" }}>
              {currency.symbol}
            </button>
            <button onClick={onLogout} style={{ padding: "5px 12px", borderRadius: 20, border: `1px solid ${C.border}`, color: C.textMuted, fontSize: 10, fontFamily: "'DM Sans',sans-serif" }}>{t.logout}</button>
          </div>
        </div>

        {showCurr && (
          <div style={{ background: C.card, border: `1px solid ${C.goldLine}`, borderRadius: 12, padding: "8px 0", marginBottom: 16 }}>
            {CURRENCY_OPTIONS.map(opt => (
              <button key={opt.code} onClick={() => { setCurrencyGlobal(opt); setCurrency(opt); setShowCurr(false); }} style={{ width: "100%", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, background: opt.code === currency.code ? C.goldGlow : "transparent", cursor: "pointer" }}>
                <span style={{ fontSize: 18 }}>{opt.country.split(" ")[0]}</span>
                <span style={{ fontSize: 12, color: C.text, fontFamily: "'DM Sans',sans-serif" }}>{opt.country.split(" ").slice(1).join(" ")}</span>
                <span style={{ marginLeft: "auto", fontSize: 10, color: C.gold, fontFamily: "'DM Sans',sans-serif" }}>{opt.symbol}</span>
                {opt.code === currency.code && <span style={{ color: C.gold, fontSize: 12 }}>✓</span>}
              </button>
            ))}
          </div>
        )}

        <button onClick={() => setShowWardrobe(true)} style={{ width: "100%", marginBottom: 16, border: `1px solid ${C.goldLine}`, borderRadius: 20, overflow: "hidden", cursor: "pointer", background: `linear-gradient(135deg,#1a1a14,${C.surface})`, display: "block", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", padding: "20px 22px" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: C.gold, letterSpacing: 4, marginBottom: 5, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>{t.myWardrobe}</div>
              <div style={{ fontSize: 20, color: C.text, fontFamily: "'Cormorant Garamond',serif", fontWeight: 300 }}>{t.items(items.length)}</div>
              <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Sans',sans-serif" }}>{t.totalValue(hidden ? "••••" : fmt(total))}</div>
            </div>
            <div style={{ color: C.gold, fontSize: 22 }}>›</div>
          </div>
        </button>

        <div style={{ background: `linear-gradient(135deg,${C.surface},#1a1a14)`, border: `1px solid ${C.goldLine}`, borderRadius: 16, padding: "16px", marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: C.gold, letterSpacing: 4, marginBottom: 14, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>{t.totalAsset}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
            <div style={{ fontSize: 28, color: C.text, fontFamily: "'Cormorant Garamond',serif" }}>{hidden ? "••••" : fmt(total)}</div>
            <button onClick={() => setHidden(h => !h)} style={{ color: C.textMuted, fontSize: 11, padding: "4px 8px" }}>{hidden ? t.show : t.hide}</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
            {[{ label: t.avgPerItem, value: hidden ? "••••" : fmt(Math.round(total / Math.max(items.length, 1))) }, { label: t.avgPerWear, value: hidden ? "••••" : (totalWorn > 0 ? fmt(Math.round(total / totalWorn)) : "N/A") }].map(d => (
              <div key={d.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px", textAlign: "center" }}>
                <div style={{ fontSize: 9, color: C.textMuted, letterSpacing: 2, marginBottom: 6, fontFamily: "'DM Sans',sans-serif" }}>{d.label}</div>
                <div style={{ fontSize: 14, color: C.text, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>{d.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px", marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: C.gold, letterSpacing: 4, marginBottom: 18, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>{t.catStats}</div>
          {catCounts.filter(d => d.count > 0).map(d => (
            <div key={d.cat} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11 }}>
                <span style={{ color: C.textSub, fontFamily: "'DM Sans',sans-serif" }}>{d.cat}</span>
                <span style={{ color: C.textMuted, fontFamily: "'DM Sans',sans-serif" }}>{d.count}</span>
              </div>
              <div style={{ height: 3, background: C.surface, borderRadius: 2 }}>
                <div style={{ height: "100%", borderRadius: 2, width: `${(d.count / maxC) * 100}%`, background: `linear-gradient(90deg,${C.gold},${C.goldLight})` }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px", marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: C.gold, letterSpacing: 4, marginBottom: 16, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>{t.highCP}</div>
          {top5.map((item, i) => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < top5.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <span style={{ color: C.gold, fontWeight: 600, width: 16, fontSize: 11 }}>#{i + 1}</span>
              <ItemImg item={item} size={26} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: C.text, fontFamily: "'Cormorant Garamond',serif" }}>{item.brand}</div>
                <div style={{ fontSize: 9, color: C.textMuted, fontFamily: "'DM Sans',sans-serif" }}>{t.wornTimes(item.worn)}</div>
              </div>
              <div style={{ fontSize: 11, color: C.gold, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>{hidden ? "••••" : fmt(cpw(item))}</div>
            </div>
          ))}
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px" }}>
          <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 4, marginBottom: 16, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>{t.coldShelf}</div>
          {cold5.map((item, i) => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < cold5.length - 1 ? `1px solid ${C.border}` : "none", opacity: 0.7 }}>
              <span style={{ color: C.textMuted, width: 16, fontSize: 11 }}>{i + 1}</span>
              <ItemImg item={item} size={26} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: C.textSub, fontFamily: "'Cormorant Garamond',serif" }}>{item.brand}</div>
                <div style={{ fontSize: 9, color: C.textMuted, fontFamily: "'DM Sans',sans-serif" }}>{item.cat}</div>
              </div>
              <div style={{ fontSize: 10, color: item.worn === 0 ? C.red : C.textMuted, fontFamily: "'DM Sans',sans-serif", fontWeight: 500 }}>{item.worn === 0 ? t.neverWorn : t.wornTimes(item.worn)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState("zh-TW");
  const t = T[lang];
  const [screen, setScreen] = useState("splash");
  const [username, setUsername] = useState("");
  const [accounts, setAccounts] = useState(ACCOUNTS_DEFAULT);
  const [tab, setTab] = useState("ootd");
  const [items, setItems] = useState(ITEMS_INIT);
  const [diary, setDiary] = useState(DIARY_INIT);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddOOTD, setShowAddOOTD] = useState(false);

  return (
    <div style={{ background: C.obsidian, color: C.text, width: "100%", maxWidth: 420, margin: "0 auto", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{G}</style>
      <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${C.gold},transparent)`, flexShrink: 0 }} />
      {screen === "splash" && <SplashScreen onDone={() => setScreen("login")} lang={lang} setLang={setLang} />}
      {screen === "login" && <LoginScreen onLogin={name => { setUsername(name); setScreen("app"); }} accounts={accounts} setAccounts={setAccounts} lang={lang} setLang={setLang} />}
      {screen === "app" && (
        <>
          <div style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden", paddingBottom: 80 }}>
            {tab === "ootd" && <OOTDTab items={items} diary={diary} setDiary={setDiary} setItems={setItems} t={t} />}
            {tab === "profile" && <ProfileTab items={items} setItems={setItems} username={username} onLogout={() => setScreen("login")} t={t} lang={lang} setLang={setLang} />}
          </div>
          <div style={{ flexShrink: 0 }}>
            <BottomNav tab={tab} setTab={setTab} onAddItem={() => setShowAddItem(true)} onAddOOTD={() => setShowAddOOTD(true)} t={t} />
          </div>
          {showAddItem && <AddSheet onClose={() => setShowAddItem(false)} onAddItem={i => setItems(p => [...p, i])} t={t} />}
          {showAddOOTD && <LogModal items={items} preSelected={[]} onClose={() => setShowAddOOTD(false)} onSave={(ids, note, photo) => { const k = new Date().toISOString().split("T")[0]; setDiary(p => ({ ...p, [k]: { itemIds: ids, note, photo } })); setItems(p => p.map(i => ids.includes(i.id) ? { ...i, worn: i.worn + 1 } : i)); setShowAddOOTD(false); }} t={t} />}
        </>
      )}
    </div>
  );
}
