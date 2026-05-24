'use client';

import { useState, useEffect } from "react";

const C = {
  obsidian: "#121212",
  surface: "#1E1E1E",
  card: "#252525",
  gold: "#C5A059",
  goldLight: "#D4AF37",
  text: "#F2EDE6",
  textSub: "#9A9590",
  textMuted: "#5A5550",
  border: "rgba(255,255,255,0.07)",
  goldLine: "rgba(197,160,89,0.25)",
  red: "#E05555",
};

const ORBS = [
  { color: "#f4a7c3", size: 220, x: "-10%", y: "-8%", dur: 7 },
  { color: "#c5a0f5", size: 180, x: "65%", y: "-5%", dur: 9 },
  { color: "#f9c784", size: 150, x: "75%", y: "55%", dur: 6 },
  { color: "#80d4f7", size: 200, x: "-15%", y: "60%", dur: 8 },
];

const TRANSLATIONS = {
  "zh-TW": {
    selectAccount: "選擇帳號",
    newAccountName: "新帳號名稱",
    add: "新增",
    login: "登入",
    register: "註冊",
    username: "輸入帳號",
    password: "輸入密碼",
    confirmPassword: "確認密碼",
    enterApp: "開啟 →",
    fillAll: "請填寫所有欄位",
    incorrectLogin: "帳號或密碼不正確",
    passwordTooShort: "密碼至少需要 4 個字元",
    passwordMismatch: "兩次密碼不相符",
    accountExists: "此帳號已被使用",
    accountCreated: "帳號 {name} 建立成功！",
    welcome: "Hi, {name}!",
    comingSoon: "✨ 衣櫃應用即將推出更多功能！",
    logout: "登出",
  },
  "zh-CN": {
    selectAccount: "选择账号",
    newAccountName: "新账号名称",
    add: "新增",
    login: "登入",
    register: "注册",
    username: "输入账号",
    password: "输入密码",
    confirmPassword: "确认密码",
    enterApp: "打开 →",
    fillAll: "请填写所有栏位",
    incorrectLogin: "账号或密码不正确",
    passwordTooShort: "密码至少需要 4 个字元",
    passwordMismatch: "两次密码不相符",
    accountExists: "此账号已被使用",
    accountCreated: "账号 {name} 建立成功！",
    welcome: "Hi, {name}!",
    comingSoon: "✨ 衣柜应用即将推出更多功能！",
    logout: "登出",
  },
  en: {
    selectAccount: "Select Account",
    newAccountName: "New Account Name",
    add: "Add",
    login: "Login",
    register: "Register",
    username: "Enter username",
    password: "Enter password",
    confirmPassword: "Confirm password",
    enterApp: "Open →",
    fillAll: "Please fill in all fields",
    incorrectLogin: "Incorrect username or password",
    passwordTooShort: "Password must be at least 4 characters",
    passwordMismatch: "Passwords do not match",
    accountExists: "This username is already taken",
    accountCreated: "Account {name} created successfully!",
    welcome: "Hi, {name}!",
    comingSoon: "✨ More features coming soon!",
    logout: "Logout",
  },
  ja: {
    selectAccount: "アカウントを選択",
    newAccountName: "新しいアカウント名",
    add: "追加",
    login: "ログイン",
    register: "登録",
    username: "ユーザー名を入力",
    password: "パスワードを入力",
    confirmPassword: "パスワードを確認",
    enterApp: "開く →",
    fillAll: "すべてのフィールドに入力してください",
    incorrectLogin: "ユーザー名またはパスワードが正しくありません",
    passwordTooShort: "パスワードは4文字以上である必要があります",
    passwordMismatch: "パスワードが一致しません",
    accountExists: "このユーザー名は既に使用されています",
    accountCreated: "アカウント {name} が作成されました！",
    welcome: "Hi, {name}!",
    comingSoon: "✨ もっと機能が来ます！",
    logout: "ログアウト",
  },
};

const DEFAULT_ACCOUNTS = [
  { username: "Sylvia", password: "sylvia123" },
  { username: "Chu", password: "chu123" },
];

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; margin: 0; padding: 0; }
  ::-webkit-scrollbar { display: none; }
  body { background: #121212; }
  input, textarea, select { font-family: inherit; background: transparent; outline: none; border: none; font-size: 16px; color: #F2EDE6; }
  button { font-family: inherit; cursor: pointer; border: none; background: none; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

function SplashScreen({ onDone }) {
  const [leaving, setLeaving] = useState(false);

  const handleEnter = () => {
    setLeaving(true);
    setTimeout(onDone, 600);
  };

  return (
    <div onClick={handleEnter} style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "linear-gradient(135deg, #0e0a12 0%, #1a1420 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      overflow: "hidden",
      transition: leaving ? "opacity .6s ease" : "none",
      opacity: leaving ? 0 : 1,
      cursor: "pointer",
    }}>
      {ORBS.map((o, i) => (
        <div key={i} style={{
          position: "absolute",
          left: o.x, top: o.y,
          width: o.size, height: o.size,
          borderRadius: "50%",
          background: `radial-gradient(circle at 40% 40%, ${o.color}55 0%, ${o.color}00 70%)`,
          filter: "blur(38px)",
          animation: `spin ${o.dur}s linear infinite`,
          opacity: 0.6,
        }} />
      ))}

      <div style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
        <h1 style={{
          fontSize: 48,
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
          color: "#F2EDE6",
          marginBottom: 8,
          animation: "fadeUp 0.5s ease both"
        }}>WARDROBE</h1>
        <p style={{
          fontSize: 14,
          color: "#9A9590",
          letterSpacing: 1,
          marginBottom: 32,
          fontFamily: "'DM Sans', sans-serif",
          animation: "fadeUp 0.6s ease both"
        }}>Your digital wardrobe ✨</p>
        <button onClick={handleEnter} style={{
          padding: "12px 24px",
          border: "1px solid #C5A059",
          borderRadius: 6,
          color: "#C5A059",
          fontSize: 12,
          letterSpacing: 2,
          cursor: "pointer",
          transition: "all 0.3s ease",
          animation: "fadeUp 0.7s ease both"
        }}>
          ENTER
        </button>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin, accounts, setAccounts, language }) {
  const t = TRANSLATIONS[language];
  const [mode, setMode] = useState("login");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [newName, setNewName] = useState("");

  const submit = () => {
    if (!user.trim() || !pass) {
      setErr(t.fillAll);
      return;
    }

    if (mode === "login") {
      const match = accounts.find(
        a => a.username.toLowerCase() === user.trim().toLowerCase() && a.password === pass
      );
      if (match) {
        onLogin(match.username);
      } else {
        setErr(t.incorrectLogin);
      }
    } else {
      if (pass.length < 4) {
        setErr(t.passwordTooShort);
        return;
      }
      if (pass !== pass2) {
        setErr(t.passwordMismatch);
        return;
      }
      const exists = accounts.find(a => a.username.toLowerCase() === user.trim().toLowerCase());
      if (exists) {
        setErr(t.accountExists);
        return;
      }
      const newAcc = { username: user.trim(), password: pass };
      setAccounts(p => [...p, newAcc]);
      setSuccess(t.accountCreated.replace("{name}", newAcc.username));
      setTimeout(() => {
        setMode("login");
        setUser(newAcc.username);
        setPass("");
        setPass2("");
        setErr("");
        setSuccess("");
        setNewName("");
      }, 1400);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter") submit();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 998,
      background: C.obsidian,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      overflow: "hidden"
    }}>
      <style>{G}</style>

      <div style={{ position: "relative", zIndex: 2, width: "88%", maxWidth: 360, animation: "slideUp 0.32s cubic-bezier(0.32, 0.72, 0, 1) both" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 20, justifyContent: "center" }}>
          {["zh-TW", "zh-CN", "en", "ja"].map(lang => (
            <button key={lang} onClick={() => window.location.reload()} style={{
              padding: "6px 12px",
              borderRadius: 20,
              fontSize: 10,
              background: "transparent",
              border: `1px solid ${C.border}`,
              color: C.textMuted,
              cursor: "pointer"
            }}>
              {lang === "zh-TW" ? "繁中" : lang === "zh-CN" ? "简中" : lang === "en" ? "EN" : "日本語"}
            </button>
          ))}
        </div>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h2 style={{
            fontSize: 24,
            fontFamily: "'Cormorant Garamond', serif",
            color: C.gold,
            marginBottom: 12
          }}>{t.selectAccount}</h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {accounts.map(acc => (
            <button key={acc.username} onClick={() => {
              setUser(acc.username);
              setPass(acc.password);
              setErr("");
            }} style={{
              padding: "12px 24px",
              border: `1px solid ${C.gold}`,
              borderRadius: 8,
              color: C.text,
              fontSize: 14,
              cursor: "pointer",
              background: C.card,
              transition: "all 0.3s"
            }}>
              {acc.username}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder={t.newAccountName} style={{
            flex: 1,
            padding: "8px 12px",
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            background: C.surface
          }} />
          <button onClick={() => {
            if (newName.trim()) {
              setAccounts(p => [...p, { username: newName.trim(), password: "123456" }]);
              setUser(newName.trim());
              setPass("123456");
              setNewName("");
            }
          }} style={{
            padding: "8px 12px",
            border: `1px solid ${C.gold}`,
            borderRadius: 6,
            color: C.gold,
            cursor: "pointer"
          }}>{t.add}</button>
        </div>

        <div style={{ display: "flex", background: "rgba(30,30,30,0.7)", borderRadius: 30, padding: 4, marginBottom: 16 }}>
          {["login", "register"].map(m => (
            <button key={m} onClick={() => {
              setMode(m);
              setUser("");
              setPass("");
              setPass2("");
              setErr("");
            }} style={{
              flex: 1,
              padding: "9px 0",
              borderRadius: 26,
              background: mode === m ? `linear-gradient(135deg, ${C.gold}, ${C.goldLight})` : "transparent",
              color: mode === m ? C.obsidian : C.textMuted,
              fontSize: 12,
              fontWeight: mode === m ? 600 : 300,
              letterSpacing: 2,
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.22s"
            }}>
              {m === "login" ? t.login : t.register}
            </button>
          ))}
        </div>

        <div style={{ background: "rgba(30,30,30,0.85)", border: `1px solid ${C.goldLine}`, borderRadius: 22, padding: "26px 24px 28px" }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 7, fontFamily: "'DM Sans', sans-serif" }}>USERNAME</div>
            <input value={user} onChange={e => { setUser(e.target.value); setErr(""); }} onKeyDown={onKey} placeholder={t.username} autoCapitalize="none" style={{
              width: "100%",
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: "10px"
            }} />
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 7, fontFamily: "'DM Sans', sans-serif" }}>PASSWORD</div>
            <div style={{ position: "relative" }}>
              <input value={pass} onChange={e => { setPass(e.target.value); setErr(""); }} onKeyDown={onKey} placeholder={t.password} type={showPw ? "text" : "password"} style={{
                width: "100%",
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: "10px"
              }} />
              <button onClick={() => setShowPw(p => !p)} style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                color: C.textMuted,
                fontSize: 14,
                cursor: "pointer"
              }}>
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {mode === "register" && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, marginBottom: 7, fontFamily: "'DM Sans', sans-serif" }}>CONFIRM</div>
              <input value={pass2} onChange={e => { setPass2(e.target.value); setErr(""); }} onKeyDown={onKey} placeholder={t.confirmPassword} type={showPw ? "text" : "password"} style={{
                width: "100%",
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: "10px"
              }} />
            </div>
          )}

          {err && <div style={{ fontSize: 11, color: C.red, marginBottom: 14 }}>{err}</div>}
          {success && <div style={{ fontSize: 11, color: "#7ed87e", marginBottom: 14 }}>{success}</div>}

          <button onClick={submit} style={{
            width: "100%",
            padding: "14px",
            background: user && pass ? `linear-gradient(135deg, ${C.gold}, ${C.goldLight})` : "rgba(197,160,89,0.2)",
            color: user && pass ? C.obsidian : C.textMuted,
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: 2,
            fontFamily: "'DM Sans', sans-serif",
            cursor: user && pass ? "pointer" : "default",
            transition: "all 0.2s",
            boxShadow: user && pass ? `0 6px 22px rgba(197,160,89,0.35)` : "none"
          }}>
            {mode === "login" ? t.enterApp : `${t.register} →`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("splash");
  const [language, setLanguage] = useState("zh-TW");
  const [accounts, setAccounts] = useState(DEFAULT_ACCOUNTS);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("language");
    if (saved) setLanguage(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  const t = TRANSLATIONS[language];

  return (
    <div style={{
      background: C.obsidian,
      color: C.text,
      width: "100%",
      maxWidth: 480,
      margin: "0 auto",
      position: "relative",
      height: "100svh",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }}>
      <style>{G}</style>
      {screen === "splash" && <SplashScreen onDone={() => setScreen("login")} />}
      {screen === "login" && <LoginScreen onLogin={name => { setUsername(name); setScreen("app"); }} accounts={accounts} setAccounts={setAccounts} language={language} />}
      {screen === "app" && (
        <div style={{ position: "relative", zIndex: 2, padding: "40px 24px", textAlign: "center", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <h1 style={{
            fontSize: 32,
            fontFamily: "'Cormorant Garamond', serif",
            color: C.gold,
            marginBottom: 16
          }}>
            {t.welcome.replace("{name}", username)}
          </h1>

          <div style={{ display: "flex", gap: 8, marginBottom: 24, justifyContent: "center", flexWrap: "wrap" }}>
            {["zh-TW", "zh-CN", "en", "ja"].map(lang => (
              <button key={lang} onClick={() => handleLanguageChange(lang)} style={{
                padding: "10px 16px",
                borderRadius: 20,
                fontSize: 12,
                background: language === lang ? `linear-gradient(135deg, ${C.gold}, ${C.goldLight})` : C.card,
                border: `1px solid ${language === lang ? C.gold : C.border}`,
                color: language === lang ? C.obsidian : C.textMuted,
                cursor: "pointer",
                transition: "all 0.3s"
              }}>
                {lang === "zh-TW" ? "繁中" : lang === "zh-CN" ? "简中" : lang === "en" ? "English" : "日本語"}
              </button>
            ))}
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.goldLine}`, borderRadius: 16, padding: "20px", marginBottom: 20, maxWidth: 300 }}>
            <p style={{ fontSize: 14, color: C.textSub, marginBottom: 16 }}>{t.comingSoon}</p>
            <button onClick={() => { setScreen("login"); setUsername(""); }} style={{
              padding: "12px 24px",
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
              color: C.obsidian,
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer"
            }}>
              {t.logout}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
