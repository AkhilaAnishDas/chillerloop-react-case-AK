import { useApp } from "../context/AppContext";

export default function About() {
  const { t } = useApp();

  return (
    <div className="page-animate">
      <div className="page-header">
        <div className="page-title">◎ {t.about}</div>
        <div className="page-subtitle">Vision, mission, and the story behind ChillerLoop</div>
      </div>

      {/* Hero */}
      <div className="about-hero" style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>❄</div>
        <div style={{ fontFamily: "Orbitron", fontSize: 28, fontWeight: 900, color: "var(--accent)", marginBottom: 10, letterSpacing: 2 }}>
          ChillerLoop
        </div>
        <div style={{ fontSize: 15, color: "var(--text2)", maxWidth: 580, margin: "0 auto", lineHeight: 1.8 }}>
          Navi Mumbai's Underground Cooling System — reimagined as intelligent, real-time infrastructure.
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-title">🎯 Vision &amp; Motive</div>
          <p style={{ color: "var(--text2)", lineHeight: 1.9, fontSize: 14 }}>
            ChillerLoop was built with a single vision — to give city operators and technicians a unified, intuitive platform to monitor, manage, and optimise Navi Mumbai's district cooling infrastructure in real time.
          </p>
          <br />
          <p style={{ color: "var(--text2)", lineHeight: 1.9, fontSize: 14 }}>
            District cooling systems are the backbone of modern smart cities, but they often lack the visibility and control tools needed to operate efficiently. ChillerLoop bridges that gap with live dashboards, intelligent algorithms, and clear data that empowers decisions — before small issues become city-wide problems.
          </p>
        </div>

        <div className="card">
          <div className="card-title">⚙️ How ChillerLoop Works</div>
          <ul style={{ color: "var(--text2)", lineHeight: 2.2, fontSize: 14, paddingLeft: 20 }}>
            <li><strong style={{ color: "var(--accent)" }}>Flow Tracker</strong> — Live water flow speed monitoring across 8 zones</li>
            <li><strong style={{ color: "var(--accent)" }}>Compressor Override</strong> — Safe pressure adjustment with full undo history</li>
            <li><strong style={{ color: "var(--accent)" }}>Restart Queue</strong> — Priority-sorted emergency recovery workflow</li>
            <li><strong style={{ color: "var(--accent)" }}>Equipment Checker</strong> — Instant asset ID verification against central registry</li>
            <li><strong style={{ color: "var(--accent)" }}>Heat Sorter</strong> — Ranked heat load across all pipe sections</li>
            <li><strong style={{ color: "var(--accent)" }}>Pipe Map Hub</strong> — Visual underground network with live status</li>
            <li><strong style={{ color: "var(--accent)" }}>Flow Planner</strong> — Dijkstra's algorithm for optimal energy-efficient routing</li>
            <li><strong style={{ color: "var(--accent)" }}>Fan Balancer</strong> — Intelligent load distribution across cooling tower fans</li>
          </ul>
        </div>
      </div>

      {/* ── Creator Card with properly centered face ── */}
      <div className="about-creator-card" style={{ marginBottom: 24 }}>
        <div style={{ position: "relative", zIndex: 1 }}>

          {/* Profile photo — face precisely centered */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
            {/* Outer glow ring */}
            <div style={{
              width: 160,
              height: 160,
              borderRadius: "50%",
              padding: 4,
              background: "linear-gradient(135deg, var(--accent), var(--accent3), var(--accent))",
              boxShadow: "0 0 0 6px #00d4ff18, 0 0 32px #00d4ff55, 0 0 60px #00d4ff22",
              marginBottom: 18,
              animation: "spin-glow 8s linear infinite",
            }}>
              {/* Inner white ring */}
              <div style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: "var(--bg2)",
                padding: 3,
                overflow: "hidden",
              }}>
                {/* The image — objectPosition tuned for face center */}
                <img
                  src="/akhila.jpeg"
                  alt="Akhila Anish Das"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    /* Image is 1222×762 landscape. Face center is ~45% from left, ~38% from top */
                    objectPosition: "45% 38%",
                    display: "block",
                  }}
                />
              </div>
            </div>

            <div style={{ fontFamily: "Orbitron", fontSize: 22, color: "var(--accent)", fontWeight: 700, textAlign: "center", textShadow: "var(--neon)" }}>
              Akhila Anish Das
            </div>
            <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 6, textAlign: "center" }}>
              First Year B.Tech CSE Student · Batch 2025–2029
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 3, textAlign: "center" }}>
              150096725016 · Case Study No: 46 · Cohort: Larry Page · Semester 2 Sprint 2
            </div>
          </div>

          {/* Quote */}
          <div style={{
            background: "var(--bg2)",
            borderRadius: 12,
            padding: "20px 28px",
            marginBottom: 24,
            borderLeft: "3px solid var(--accent)",
            maxWidth: 680,
            margin: "0 auto 24px",
          }}>
            <p style={{ color: "var(--text)", lineHeight: 1.9, fontSize: 14, fontStyle: "italic", textAlign: "center" }}>
              "I am Akhila, a First Year BTech CSE student who got the problem statement and just wanted to make the best out of it.
              So this app ChillerLoop was invented to solve the case study, and this is an effective way for a city to analyse and
              monitor the water cooling system."
            </p>
          </div>

          {/* Info Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 8 }}>
            {[
              ["Student ID", "150096725016"],
              ["Case Study", "No. 46"],
              ["Cohort", "Larry Page"],
              ["Semester", "2 — Sprint 2"],
              ["Programme", "B.Tech CSE"],
              ["Batch", "2025 – 2029"],
            ].map(([k, v]) => (
              <div key={k} style={{ background: "var(--bg3)", borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>{k}</div>
                <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 600, fontFamily: "JetBrains Mono" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── How to Run Locally ── */}
      <div className="card" style={{ marginBottom: 24, borderColor: "var(--accent3)" }}>
        <div className="card-title" style={{ color: "var(--accent3)" }}>🚀 How to Run on Your Local System</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { step: "01", title: "Install Node.js", code: null, desc: "Download and install Node.js v18+ from nodejs.org. npm comes bundled with it automatically." },
            { step: "02", title: "Extract the ZIP", code: null, desc: "Download chillerloop-v2.zip and extract it to any folder on your computer." },
            { step: "03", title: "Open Terminal in folder", code: null, desc: "Right-click the extracted folder → 'Open in Terminal' (Windows: Shift + Right-click → Open PowerShell here)." },
            { step: "04", title: "Install Dependencies", code: "npm install", desc: "Run this once. It downloads all required packages. Takes about 30–60 seconds." },
            { step: "05", title: "Start the Dev Server", code: "npm run dev", desc: "Starts the app. You'll see: ➜ Local: http://localhost:5173/" },
            { step: "06", title: "Open in Browser", code: null, desc: "Visit http://localhost:5173 in Chrome, Firefox, or Edge. ChillerLoop loads with live data!" },
          ].map(({ step, title, code, desc }) => (
            <div key={step} style={{ display: "flex", gap: 18, alignItems: "flex-start", background: "var(--bg3)", borderRadius: 10, padding: "14px 18px" }}>
              <div style={{ fontFamily: "Orbitron", fontSize: 20, fontWeight: 900, color: "var(--accent3)", minWidth: 34, lineHeight: 1.2 }}>{step}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: "var(--text)", fontSize: 14, marginBottom: 5 }}>{title}</div>
                {code && (
                  <div style={{
                    background: "var(--bg)",
                    border: "1px solid var(--accent3)",
                    borderRadius: 6,
                    padding: "7px 16px",
                    fontFamily: "JetBrains Mono",
                    fontSize: 14,
                    color: "var(--accent3)",
                    marginBottom: 7,
                    display: "inline-block",
                    letterSpacing: 0.5,
                  }}>
                    $ {code}
                  </div>
                )}
                <div style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.6 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, background: "#00ff8812", border: "1px solid #00ff8833", borderRadius: 10, padding: "12px 18px", fontSize: 13, color: "var(--accent3)" }}>
          ✅ <strong>Requirements:</strong> Node.js v18+ · npm v9+ · Chrome / Firefox / Edge · Windows / Mac / Linux
        </div>
      </div>

      {/* Tech Stack */}
      <div className="card">
        <div className="card-title">🛠 Technology Stack</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {["React 18", "Vite", "Recharts", "SheetJS (xlsx)", "Orbitron Font", "Inter Font", "JetBrains Mono", "CSS3 Animations", "Dijkstra's Algorithm", "Context API", "Real-Time Sensor Simulation"].map(tech => (
            <span key={tech} style={{
              background: "var(--bg3)",
              border: "1px solid var(--accent)",
              borderRadius: 20,
              padding: "6px 14px",
              fontSize: 12,
              color: "var(--accent)",
              fontWeight: 600,
            }}>
              {tech}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin-glow {
          from { box-shadow: 0 0 0 6px #00d4ff18, 0 0 32px #00d4ff55, 0 0 60px #00d4ff22; }
          50% { box-shadow: 0 0 0 8px #00ff8818, 0 0 40px #00ff8855, 0 0 80px #00ff8822; }
          to { box-shadow: 0 0 0 6px #00d4ff18, 0 0 32px #00d4ff55, 0 0 60px #00d4ff22; }
        }
      `}</style>
    </div>
  );
}
