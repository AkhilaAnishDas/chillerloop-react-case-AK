import { useState } from "react";
import { useApp } from "../context/AppContext";
import { restartRequests } from "../data/naviMumbaiData";

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

export default function RestartQueue() {
  const { t } = useApp();
  const [queue, setQueue] = useState([...restartRequests].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]));
  const [restarting, setRestarting] = useState({});
  const [done, setDone] = useState({});

  const handleRestart = (id) => {
    setRestarting(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setRestarting(prev => ({ ...prev, [id]: false }));
      setDone(prev => ({ ...prev, [id]: true }));
      setQueue(prev => prev.map(r => r.id === id ? { ...r, status: "done" } : r));
    }, 2500);
  };

  const priorityColor = { high: "var(--red)", medium: "var(--orange)", low: "var(--green)" };
  const priorityLabel = { high: t.high, medium: t.medium, low: t.low };

  return (
    <div className="page-animate">
      <div className="page-header">
        <div className="page-title">⊞ {t.restartQueue}</div>
        <div className="page-subtitle">Prioritised queue of cooling system restart requests across Navi Mumbai</div>
      </div>

      <div className="grid-3" style={{ marginBottom: 24 }}>
        {["high","medium","low"].map(p => (
          <div key={p} className="stat-card">
            <div className="stat-label">{priorityLabel[p]} Priority</div>
            <div className="stat-value" style={{ color: priorityColor[p], fontSize: 28 }}>
              {queue.filter(r => r.priority === p && r.status !== "done").length}
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)" }}>Pending requests</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-title">⊞ Active Queue — Sorted by Priority</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {queue.map((r, i) => (
            <div
              key={r.id}
              style={{
                background: "var(--bg3)",
                borderRadius: 10,
                padding: "16px 20px",
                border: `1px solid ${r.status === "done" ? "#00cc6633" : r.priority === "high" ? "#ff444433" : r.priority === "medium" ? "#ff880033" : "var(--border)"}`,
                display: "flex",
                alignItems: "center",
                gap: 20,
                opacity: r.status === "done" ? 0.55 : 1,
                transition: "all 0.3s",
              }}
            >
              <div style={{ fontFamily: "Orbitron", fontSize: 22, fontWeight: 700, color: "var(--text3)", minWidth: 28 }}>
                {String(i + 1).padStart(2, "0")}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontFamily: "Orbitron", fontSize: 12, color: "var(--accent)" }}>{r.id}</span>
                  <span className={`badge ${r.status === "done" ? "active" : r.status}`}>{r.status === "done" ? "✓ Done" : r.status}</span>
                  <span style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "var(--text3)" }}>{r.time}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{r.customer}</div>
                <div style={{ fontSize: 12, color: "var(--text3)" }}>Zone: {r.zone} — {r.reason}</div>
              </div>

              <div style={{ textAlign: "center", minWidth: 70 }}>
                <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Priority</div>
                <div style={{ fontWeight: 700, color: priorityColor[r.priority], fontSize: 14, textTransform: "uppercase" }}>
                  {priorityLabel[r.priority]}
                </div>
              </div>

              <button
                className={`btn ${r.status === "done" ? "success" : "primary"}`}
                onClick={() => handleRestart(r.id)}
                disabled={r.status === "done" || restarting[r.id]}
                style={{ minWidth: 110 }}
              >
                {restarting[r.id] ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span> Restarting...
                  </span>
                ) : r.status === "done" ? "✓ Complete" : `⊞ ${t.restart}`}
              </button>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
