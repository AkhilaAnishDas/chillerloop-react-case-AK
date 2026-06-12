import { useState, useEffect, useRef, useCallback } from "react";
import * as XLSX from "xlsx";
import { useApp } from "../context/AppContext";
import { zones, chillers, fans } from "../data/naviMumbaiData";

function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{
      fontFamily: "JetBrains Mono", fontSize: 13, color: "var(--accent)",
      background: "var(--bg3)", border: "1px solid var(--border)",
      borderRadius: 8, padding: "6px 14px", letterSpacing: 0.5,
      display: "flex", alignItems: "center", gap: 10,
    }}>
      <span style={{ color: "var(--green)", fontSize: 8 }}>●</span>
      {now.toLocaleTimeString("en-IN", { hour12: false })}
      <span style={{ color: "var(--text3)", fontSize: 11 }}>
        {now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const { t, setActivePage } = useApp();
  const videoRef = useRef(null);

  const [liveZones, setLiveZones] = useState(() => zones.map(z => ({ ...z })));
  const [liveChillers, setLiveChillers] = useState(() => chillers.map(c => ({ ...c })));
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [exportMsg, setExportMsg] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.muted = true;
      v.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setLiveZones(prev => prev.map(z => ({
        ...z,
        flowRate: parseFloat(Math.max(8, Math.min(230, z.flowRate + (Math.random() - 0.48) * 4.5)).toFixed(1)),
        temp: parseFloat(Math.max(4, Math.min(12, z.temp + (Math.random() - 0.5) * 0.18)).toFixed(1)),
        pressure: parseFloat(Math.max(2.5, Math.min(6.5, z.pressure + (Math.random() - 0.5) * 0.04)).toFixed(2)),
        heatLoad: Math.max(400, Math.min(5000, Math.round(z.heatLoad + (Math.random() - 0.5) * 85))),
      })));
      setLiveChillers(prev => prev.map(c => ({
        ...c,
        currentLoad: Math.max(25, Math.min(99, Math.round(c.currentLoad + (Math.random() - 0.5) * 2.5))),
        pressure: parseFloat(Math.max(2.5, Math.min(6.5, c.pressure + (Math.random() - 0.5) * 0.035)).toFixed(2)),
      })));
      setLastUpdated(new Date());
      setTick(n => n + 1);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const totalFlow = liveZones.reduce((s, z) => s + z.flowRate, 0).toFixed(0);
  const avgTemp = (liveZones.reduce((s, z) => s + z.temp, 0) / liveZones.length).toFixed(1);
  const totalHeat = liveZones.reduce((s, z) => s + z.heatLoad, 0);
  const criticalZones = liveZones.filter(z => z.status === "critical").length;
  const activeFans = fans.filter(f => f.status === "active").length;
  const activeChillers = liveChillers.filter(c => c.status === "active").length;

  const exportExcel = useCallback(() => {
    const now = new Date();
    const ts = now.toLocaleString("en-IN", { hour12: false });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([
      { "Metric": "Generated At", "Value": ts },
      { "Metric": "City", "Value": "Navi Mumbai, Maharashtra" },
      { "Metric": "Total Flow Rate (L/s)", "Value": totalFlow },
      { "Metric": "Avg Temperature (°C)", "Value": avgTemp },
      { "Metric": "Total Heat Load (kW)", "Value": totalHeat },
      { "Metric": "Critical Zones", "Value": criticalZones },
      { "Metric": "Active Fans", "Value": `${activeFans}/${fans.length}` },
      { "Metric": "Active Chillers", "Value": `${activeChillers}/${chillers.length}` },
      { "Metric": "System", "Value": "ChillerLoop v2.6" },
    ]), "Summary");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(liveZones.map(z => ({
      "Timestamp": ts, "Zone ID": z.id, "Zone Name": z.name, "Area": z.area,
      "Flow Rate (L/s)": z.flowRate, "Temperature (°C)": z.temp,
      "Pressure (bar)": z.pressure, "Heat Load (kW)": z.heatLoad,
      "Pipe Length (km)": z.pipeLen, "Status": z.status,
    }))), "Zone Monitor");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(liveChillers.map(c => ({
      "Timestamp": ts, "Chiller ID": c.id, "Name": c.name, "Model": c.model,
      "Zone": c.zone, "Capacity (kW)": c.capacity, "Load (%)": c.currentLoad,
      "Pressure (bar)": c.pressure, "Status": c.status,
    }))), "Chiller Monitor");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(fans.map(f => ({
      "Timestamp": ts, "Fan ID": f.id, "Name": f.name, "Zone": f.zone,
      "Rated (kW)": f.power, "Load (%)": f.load,
      "Actual (kW)": (f.power * f.load / 100).toFixed(1), "Status": f.status,
    }))), "Fan Monitor");
    const fname = `ChillerLoop_NaviMumbai_${now.toISOString().slice(0,10)}_${String(now.getHours()).padStart(2,"0")}${String(now.getMinutes()).padStart(2,"0")}.xlsx`;
    XLSX.writeFile(wb, fname);
    setExportMsg(`✓ Exported: ${fname}`);
    setTimeout(() => setExportMsg(""), 5000);
  }, [liveZones, liveChillers, totalFlow, avgTemp, totalHeat, criticalZones, activeFans, activeChillers]);

  const stats = [
    { label: "Total Flow Rate", val: totalFlow, suffix: " L/s", color: "var(--accent)", icon: "〜" },
    { label: "Avg Supply Temp", val: avgTemp, suffix: "°C", color: "#44aaff", icon: "🌡" },
    { label: "Critical Zones", val: criticalZones, suffix: "", color: "var(--red)", icon: "⚠" },
    { label: "Active Fans", val: `${activeFans}/${fans.length}`, suffix: "", color: "var(--green)", icon: "⊙", raw: true },
    { label: "Total Heat Load", val: Math.round(totalHeat / 1000), suffix: " MW", color: "var(--orange)", icon: "⊕" },
    { label: "Active Chillers", val: `${activeChillers}/${chillers.length}`, suffix: "", color: "var(--accent3)", icon: "⊛", raw: true },
  ];

  return (
    <div className="page-animate">

      {/* ══ HERO — Full Navi Mumbai video, no watermark label ══ */}
      <div style={{
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 32,
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
      }}>

        {/* Full video — uncut, looping, from first frame */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            opacity: 0.6,
            zIndex: 0,
          }}
        >
          <source src="/navimumbai_full.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlay — readable text, no hard black */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: "linear-gradient(to bottom, rgba(5,10,22,0.52) 0%, rgba(5,10,22,0.28) 40%, rgba(5,10,22,0.62) 80%, var(--bg) 100%)",
        }} />

        {/* Subtle scanline overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,212,255,0.012) 3px, rgba(0,212,255,0.012) 4px)",
        }} />

        {/* Hero content */}
        <div style={{ position: "relative", zIndex: 3, textAlign: "center", padding: "52px 28px", maxWidth: 900, width: "100%" }}>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "rgba(0,212,255,0.14)", border: "1px solid rgba(0,212,255,0.42)",
            backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
            padding: "7px 22px", borderRadius: 30, fontSize: 11,
            color: "#00d4ff", fontWeight: 700, letterSpacing: 2.5,
            textTransform: "uppercase", marginBottom: 28,
            animation: "fadeInDown 0.8s ease both",
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ff88", display: "inline-block", animation: "glow-pulse 2s ease-in-out infinite" }} />
            Live System · Navi Mumbai UGCS · Maharashtra
          </div>

          <h1 style={{
            fontFamily: "Orbitron", fontWeight: 900,
            fontSize: "clamp(32px, 5.2vw, 66px)",
            lineHeight: 1.1, letterSpacing: 2, color: "#fff",
            animation: "fadeInUp 0.9s ease 0.2s both", marginBottom: 18,
            textShadow: "0 2px 40px rgba(0,0,0,0.9)",
          }}>
            <span style={{
              background: "linear-gradient(135deg, #00d4ff, #00ff88)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>❄ ChillerLoop</span><br />
            <span style={{ fontSize: "0.58em", color: "rgba(255,255,255,0.82)", fontWeight: 700, letterSpacing: 3 }}>
              UNDERGROUND COOLING INTELLIGENCE
            </span>
          </h1>

          <p style={{
            fontSize: "clamp(13px, 1.7vw, 17px)", color: "rgba(255,255,255,0.72)",
            lineHeight: 1.8, animation: "fadeInUp 1s ease 0.4s both", marginBottom: 32,
            textShadow: "0 1px 14px rgba(0,0,0,0.7)",
          }}>
            Real-time monitoring of Navi Mumbai's district cooling infrastructure.<br />
            8 zones · 6 chillers · 18.9 km of underground pipe networks · live sensor data.
          </p>

          <div style={{
            display: "flex", justifyContent: "center", gap: "clamp(20px, 4vw, 50px)",
            marginBottom: 40, animation: "fadeInUp 1s ease 0.6s both", flexWrap: "wrap",
          }}>
            {[
              { label: "Live Flow", val: `${totalFlow} L/s` },
              { label: "Zones", val: "8 Active" },
              { label: "Pipeline", val: "18.9 km" },
              { label: "Capacity", val: "21 MW" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "Orbitron", fontSize: "clamp(18px, 2.5vw, 28px)",
                  fontWeight: 700, color: "#00d4ff", textShadow: "0 0 18px #00d4ffaa",
                }}>
                  {s.val}
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: 2, marginTop: 5 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{ animation: "fadeInUp 1s ease 0.8s both", display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn primary" style={{ fontSize: 15, padding: "13px 32px", backdropFilter: "blur(8px)" }} onClick={() => setActivePage("flow")}>
              Open Control Panel →
            </button>
            <button className="btn success" style={{ fontSize: 14, padding: "13px 24px", backdropFilter: "blur(8px)" }} onClick={exportExcel}>
              📊 Export Excel Report
            </button>
          </div>
        </div>
      </div>

      {/* ══ DASHBOARD HEADER ══ */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 14 }}>
        <div>
          <div className="page-title">◈ {t.dashboard}</div>
          <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4, display: "flex", alignItems: "center", gap: 8 }}>
            Live · Navi Mumbai · {lastUpdated.toLocaleTimeString("en-IN", { hour12: false })}
            <span style={{ color: "var(--green)", display: "flex", alignItems: "center", gap: 4, fontWeight: 700 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", display: "inline-block", animation: "glow-pulse 2s ease-in-out infinite" }} />
              LIVE · #{tick}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <LiveClock />
          <button className="btn success" onClick={exportExcel}>📥 Export Excel</button>
        </div>
      </div>

      {exportMsg && (
        <div style={{ background: "#00cc6614", border: "1px solid #00cc6633", borderRadius: 10, padding: "10px 18px", marginBottom: 18, fontSize: 13, color: "var(--green)" }}>
          {exportMsg}
        </div>
      )}

      {/* ══ STAT CARDS ══ */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div style={{ fontFamily: "Orbitron", fontSize: 24, fontWeight: 700, color: s.color, transition: "color 0.4s" }}>
              {s.raw ? s.val : s.val}{s.suffix}
            </div>
          </div>
        ))}
      </div>

      {/* ══ ZONE TABLE ══ */}
      <div className="card" style={{ marginBottom: 22 }}>
        <div className="card-title" style={{ display: "flex", justifyContent: "space-between" }}>
          <span>〜 Zone Monitor — Live Sensor Data</span>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "var(--green)", letterSpacing: 1 }}>⬤ EVERY 3s · #{tick}</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Zone ID</th><th>Area</th><th>Flow (L/s)</th>
                <th>Temp (°C)</th><th>Pressure (bar)</th><th>Heat Load (kW)</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {liveZones.map(z => (
                <tr key={z.id}>
                  <td className="mono" style={{ color: "var(--accent)" }}>{z.id}</td>
                  <td style={{ color: "var(--text)" }}>{z.name}</td>
                  <td className="mono" style={{ color: z.flowRate > 185 ? "var(--red)" : z.flowRate > 135 ? "var(--orange)" : "var(--accent)", transition: "color 0.5s" }}>{z.flowRate}</td>
                  <td className="mono" style={{ color: z.temp > 9 ? "var(--red)" : "var(--text2)", transition: "color 0.5s" }}>{z.temp}</td>
                  <td className="mono">{z.pressure}</td>
                  <td className="mono" style={{ color: z.heatLoad > 3600 ? "var(--red)" : z.heatLoad > 2600 ? "var(--orange)" : "var(--text2)", transition: "color 0.5s" }}>{z.heatLoad.toLocaleString()}</td>
                  <td><span className={`badge ${z.status}`}>{z.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══ CHILLER TABLE ══ */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title" style={{ display: "flex", justifyContent: "space-between" }}>
          <span>⊛ Chiller Monitor — Live Load</span>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "var(--green)" }}>⬤ LIVE</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr><th>Chiller ID</th><th>Name</th><th>Model</th><th>Capacity</th><th>Load %</th><th>Pressure</th><th>Status</th></tr>
            </thead>
            <tbody>
              {liveChillers.map(c => (
                <tr key={c.id}>
                  <td className="mono" style={{ color: "var(--accent)" }}>{c.id}</td>
                  <td style={{ color: "var(--text)" }}>{c.name}</td>
                  <td className="mono" style={{ color: "var(--text3)" }}>{c.model}</td>
                  <td className="mono">{c.capacity.toLocaleString()} kW</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="progress-bar" style={{ width: 70 }}>
                        <div className="progress-fill" style={{
                          width: `${c.currentLoad}%`,
                          background: c.currentLoad > 90 ? "var(--red)" : c.currentLoad > 75 ? "var(--orange)" : "var(--accent)",
                          transition: "width 1.5s ease",
                        }} />
                      </div>
                      <span className="mono" style={{ color: c.currentLoad > 90 ? "var(--red)" : "var(--text2)", transition: "color 0.5s", minWidth: 36 }}>{c.currentLoad}%</span>
                    </div>
                  </td>
                  <td className="mono">{c.pressure} bar</td>
                  <td><span className={`badge ${c.status}`}>{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn success" onClick={exportExcel}>
          📥 Download Full Excel Report (.xlsx)
        </button>
      </div>

      <style>{`
        @keyframes fadeInDown { from { opacity:0; transform:translateY(-18px);} to { opacity:1; transform:translateY(0);} }
        @keyframes fadeInUp   { from { opacity:0; transform:translateY(18px);} to { opacity:1; transform:translateY(0);} }
      `}</style>
    </div>
  );
}
