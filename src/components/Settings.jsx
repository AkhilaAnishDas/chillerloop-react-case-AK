import { useApp, translations } from "../context/AppContext";

export default function Settings() {
  const { t, theme, setTheme, lang, setLang } = useApp();

  const languages = [
    { code: "en", name: "English", native: "English", flag: "🇬🇧" },
    { code: "hi", name: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
    { code: "mr", name: "Marathi", native: "मराठी", flag: "🏮" },
  ];

  return (
    <div className="page-animate">
      <div className="page-header">
        <div className="page-title">⊛ {t.settings}</div>
        <div className="page-subtitle">Personalise your ChillerLoop dashboard experience</div>
      </div>

      {/* Language */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-title">🌐 {t.language}</div>
        <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 18 }}>
          ChillerLoop supports English, Hindi, and Marathi — the three languages at the heart of Navi Mumbai, Maharashtra.
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {languages.map(l => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              style={{
                background: lang === l.code ? "linear-gradient(135deg, var(--accent), var(--accent2))" : "var(--bg3)",
                border: `2px solid ${lang === l.code ? "var(--accent)" : "var(--border)"}`,
                borderRadius: 12,
                padding: "16px 28px",
                cursor: "pointer",
                color: lang === l.code ? "#000" : "var(--text2)",
                fontWeight: 700,
                fontSize: 14,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                minWidth: 130,
                transition: "all 0.2s",
                boxShadow: lang === l.code ? "var(--neon)" : "none",
              }}
            >
              <span style={{ fontSize: 28 }}>{l.flag}</span>
              <span style={{ fontFamily: "Orbitron", fontSize: 12 }}>{l.name}</span>
              <span style={{ fontSize: 16, fontWeight: 800 }}>{l.native}</span>
            </button>
          ))}
        </div>

        {lang !== "en" && (
          <div style={{ marginTop: 20, background: "#00d4ff0c", border: "1px solid #00d4ff33", borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, marginBottom: 8 }}>
              {lang === "hi" ? "✓ हिन्दी भाषा सक्रिय है" : "✓ मराठी भाषा सक्रिय आहे"}
            </div>
            <div style={{ fontSize: 12, color: "var(--text2)" }}>
              {lang === "hi"
                ? "सभी मेनू और लेबल हिन्दी में दिखाए जाएंगे। नवी मुंबई की शीतलन प्रणाली को अब हिन्दी में प्रबंधित करें।"
                : "सर्व मेनू आणि लेबल मराठीत दाखवले जातील. नवी मुंबईची शीतकरण प्रणाली आता मराठीत व्यवस्थापित करा."}
            </div>
          </div>
        )}
      </div>

      {/* Theme */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-title">🎨 {t.theme}</div>
        <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 18 }}>
          Choose a display theme that's comfortable for your environment. Both themes are optimised for extended monitoring sessions.
        </p>
        <div style={{ display: "flex", gap: 16 }}>
          {[
            { key: "dark", label: t.dark, icon: "🌙", desc: "Easy on eyes in low-light environments" },
            { key: "light", label: t.light, icon: "☀️", desc: "Clear and bright for well-lit control rooms" },
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => setTheme(opt.key)}
              style={{
                background: theme === opt.key ? "linear-gradient(135deg, var(--accent), var(--accent2))" : "var(--bg3)",
                border: `2px solid ${theme === opt.key ? "var(--accent)" : "var(--border)"}`,
                borderRadius: 12,
                padding: "20px 28px",
                cursor: "pointer",
                color: theme === opt.key ? "#000" : "var(--text2)",
                fontWeight: 700,
                fontSize: 14,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                minWidth: 180,
                transition: "all 0.2s",
                boxShadow: theme === opt.key ? "var(--neon)" : "none",
              }}
            >
              <span style={{ fontSize: 36 }}>{opt.icon}</span>
              <span style={{ fontFamily: "Orbitron", fontSize: 13 }}>{opt.label} Mode</span>
              <span style={{ fontSize: 11, fontWeight: 400, opacity: 0.8, textAlign: "center", lineHeight: 1.4 }}>{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* System Info */}
      <div className="card">
        <div className="card-title">ℹ System Information</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {[
            ["App Version", "ChillerLoop v2.6"],
            ["City Coverage", "Navi Mumbai, MH"],
            ["Zones Monitored", "8 Active Zones"],
            ["Total Assets", "22 Registered"],
            ["Data Refresh", "Live / 2s"],
            ["Framework", "React 18 + Vite"],
          ].map(([k, v]) => (
            <div key={k} style={{ background: "var(--bg3)", borderRadius: 8, padding: "12px 16px" }}>
              <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 5 }}>{k}</div>
              <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 700, fontFamily: "JetBrains Mono" }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
