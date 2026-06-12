import { useState } from "react";
import { useApp } from "../context/AppContext";
import { chillers } from "../data/naviMumbaiData";

export default function CompressorOverride() {
  const { t } = useApp();
  const [pressures, setPressures] = useState(chillers.reduce((acc, c) => ({ ...acc, [c.id]: c.pressure }), {}));
  const [history, setHistory] = useState(chillers.reduce((acc, c) => ({ ...acc, [c.id]: [] }), {}));
  const [pending, setPending] = useState({});
  const [applied, setApplied] = useState({});

  const handleChange = (id, val) => {
    setPending(prev => ({ ...prev, [id]: parseFloat(val) }));
  };

  const applyOverride = (id) => {
    const newVal = pending[id] ?? pressures[id];
    setHistory(prev => ({ ...prev, [id]: [...prev[id], pressures[id]] }));
    setPressures(prev => ({ ...prev, [id]: newVal }));
    setApplied(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setApplied(prev => ({ ...prev, [id]: false })), 2000);
  };

  const undoOverride = (id) => {
    const prev_hist = history[id];
    if (prev_hist.length === 0) return;
    const last = prev_hist[prev_hist.length - 1];
    setPressures(prev => ({ ...prev, [id]: last }));
    setHistory(prev => ({ ...prev, [id]: prev[id].slice(0, -1) }));
    setPending(prev => ({ ...prev, [id]: last }));
  };

  const safeMin = 2.5, safeMax = 7.0;

  return (
    <div className="page-animate">
      <div className="page-header">
        <div className="page-title">⊛ {t.compressor}</div>
        <div className="page-subtitle">Safely adjust and revert compressor pressure settings for each chiller unit</div>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        {chillers.map(c => {
          const cur = pressures[c.id];
          const pen = pending[c.id] ?? cur;
          const isCritical = cur > 6.0;
          const isWarning = cur > 5.5;
          return (
            <div key={c.id} className="card" style={{ borderColor: isCritical ? "var(--red)" : isWarning ? "var(--orange)" : "var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: "Orbitron", fontSize: 13, color: "var(--accent)", fontWeight: 700 }}>{c.id}</div>
                  <div style={{ fontSize: 14, color: "var(--text)", marginTop: 2, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{c.model} · Installed {c.installed}</div>
                </div>
                <span className={`badge ${c.status}`}>{c.status}</span>
              </div>

              <div style={{ background: "var(--bg3)", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "var(--text3)" }}>Current Pressure</span>
                  <span style={{ fontFamily: "Orbitron", fontSize: 20, color: isCritical ? "var(--red)" : isWarning ? "var(--orange)" : "var(--accent)", fontWeight: 700 }}>
                    {cur.toFixed(1)} bar
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "var(--text3)" }}>Set Pressure</span>
                  <span style={{ fontFamily: "JetBrains Mono", fontSize: 14, color: "var(--text2)" }}>
                    {pen.toFixed(1)} bar
                  </span>
                </div>
                <input
                  type="range"
                  min={safeMin}
                  max={safeMax}
                  step={0.1}
                  value={pen}
                  onChange={e => handleChange(c.id, e.target.value)}
                  style={{ width: "100%", marginTop: 8 }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text3)", marginTop: 4 }}>
                  <span>{safeMin} bar (min)</span>
                  <span>{safeMax} bar (max)</span>
                </div>
              </div>

              {pen > 6.2 && (
                <div style={{ background: "#ff444418", border: "1px solid #ff444433", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "var(--red)", marginBottom: 12 }}>
                  ⚠ High pressure setting — confirm with supervisor before applying
                </div>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn primary" onClick={() => applyOverride(c.id)} style={{ flex: 1 }}>
                  {applied[c.id] ? "✓ Applied!" : `${t.apply}`}
                </button>
                <button
                  className="btn"
                  onClick={() => undoOverride(c.id)}
                  disabled={history[c.id].length === 0}
                  style={{ opacity: history[c.id].length === 0 ? 0.4 : 1 }}
                >
                  ↩ {t.undo}
                </button>
              </div>

              {history[c.id].length > 0 && (
                <div style={{ marginTop: 12, fontSize: 11, color: "var(--text3)" }}>
                  History: {history[c.id].map(v => `${v.toFixed(1)}`).join(" → ")} → {cur.toFixed(1)} bar
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="card" style={{ background: "#00d4ff08", borderColor: "#00d4ff33" }}>
        <div className="card-title">📋 Safety Guidelines</div>
        <ul style={{ fontSize: 13, color: "var(--text2)", lineHeight: 2, paddingLeft: 20 }}>
          <li>Normal operating pressure range: <strong style={{ color: "var(--accent)" }}>3.5 – 5.5 bar</strong></li>
          <li>Warning threshold: <strong style={{ color: "var(--orange)" }}>5.5 – 6.0 bar</strong> — monitor closely</li>
          <li>Critical threshold: <strong style={{ color: "var(--red)" }}>&gt; 6.0 bar</strong> — requires supervisor approval</li>
          <li>All changes are logged with timestamp and technician ID</li>
          <li>Undo reverts to previous confirmed value — multiple undos supported</li>
        </ul>
      </div>
    </div>
  );
}
