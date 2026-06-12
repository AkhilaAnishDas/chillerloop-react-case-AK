import { useState } from "react";
import { useApp } from "../context/AppContext";
import { graphNodes, graphEdges } from "../data/naviMumbaiData";

// Dijkstra's algorithm
function dijkstra(nodes, edges, startId, endId) {
  const dist = {};
  const prev = {};
  const visited = new Set();
  nodes.forEach(n => { dist[n.id] = Infinity; prev[n.id] = null; });
  dist[startId] = 0;
  const queue = [...nodes.map(n => n.id)];

  while (queue.length > 0) {
    queue.sort((a, b) => dist[a] - dist[b]);
    const u = queue.shift();
    if (u === endId) break;
    visited.add(u);

    const neighbors = edges.filter(e => e.from === u || e.to === u);
    neighbors.forEach(e => {
      const v = e.from === u ? e.to : e.from;
      if (visited.has(v)) return;
      const alt = dist[u] + e.energy;
      if (alt < dist[v]) {
        dist[v] = alt;
        prev[v] = u;
      }
    });
  }

  const path = [];
  let cur = endId;
  while (cur) { path.unshift(cur); cur = prev[cur]; }
  return { path, totalEnergy: dist[endId] };
}

export default function FlowPlanner() {
  const { t } = useApp();
  const [from, setFrom] = useState("NM-01");
  const [to, setTo] = useState("NM-05");
  const [result, setResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

  const handleCalculate = () => {
    if (from === to) return;
    setCalculating(true);
    setTimeout(() => {
      const res = dijkstra(graphNodes, graphEdges, from, to);
      setResult(res);
      setCalculating(false);
    }, 800);
  };

  const nodeMap = Object.fromEntries(graphNodes.map(n => [n.id, n]));
  const nodeLabel = (id) => {
    const n = graphNodes.find(g => g.id === id);
    return n ? `${id} (${n.label})` : id;
  };

  const statusColor = { active: "#00cc66", warning: "#ff8800", critical: "#ff4444" };

  return (
    <div className="page-animate">
      <div className="page-header">
        <div className="page-title">⊘ {t.flowPlanner}</div>
        <div className="page-subtitle">Dijkstra's algorithm finds the most energy-efficient pipe path between any two zones</div>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-title">⊘ Select Route</div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: "var(--text3)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1.5 }}>From Zone</label>
            <select value={from} onChange={e => { setFrom(e.target.value); setResult(null); }} style={{ width: "100%", padding: "10px 14px", fontSize: 14 }}>
              {graphNodes.map(n => <option key={n.id} value={n.id}>{n.id} — {n.label}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, color: "var(--text3)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1.5 }}>To Zone</label>
            <select value={to} onChange={e => { setTo(e.target.value); setResult(null); }} style={{ width: "100%", padding: "10px 14px", fontSize: 14 }}>
              {graphNodes.map(n => <option key={n.id} value={n.id}>{n.id} — {n.label}</option>)}
            </select>
          </div>
          <button className="btn primary" onClick={handleCalculate} disabled={from === to || calculating} style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 15 }}>
            {calculating ? "⟳ Calculating..." : `⊘ ${t.calculate}`}
          </button>
          {from === to && <div style={{ color: "var(--orange)", fontSize: 12, marginTop: 10, textAlign: "center" }}>Select different source and destination zones</div>}

          {result && (
            <div style={{ marginTop: 20, background: "#00d4ff0c", border: "1px solid #00d4ff33", borderRadius: 10, padding: 18, animation: "fade-in-scale 0.4s ease" }}>
              <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Optimal Path Found</div>
              <div style={{ fontFamily: "Orbitron", fontSize: 24, color: "var(--accent)", fontWeight: 700, marginBottom: 8 }}>
                {result.totalEnergy} kW
              </div>
              <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 12 }}>Total pumping energy consumption</div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Route ({result.path.length} nodes):</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {result.path.map((id, i) => (
                  <span key={id} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ background: "var(--bg3)", border: "1px solid var(--accent)", borderRadius: 6, padding: "4px 10px", fontFamily: "JetBrains Mono", fontSize: 12, color: "var(--accent)" }}>
                      {id}
                    </span>
                    {i < result.path.length - 1 && <span style={{ color: "var(--text3)" }}>→</span>}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Visual map */}
        <div className="card">
          <div className="card-title">⊘ Network Graph — Optimal Path Highlighted</div>
          <svg viewBox="0 0 520 400" style={{ width: "100%", height: 340, background: "var(--bg3)", borderRadius: 10 }}>
            {graphEdges.map((e, i) => {
              const from_n = nodeMap[e.from];
              const to_n = nodeMap[e.to];
              if (!from_n || !to_n) return null;
              const onPath = result && result.path.length > 1 &&
                result.path.some((p, idx) => idx < result.path.length - 1 && ((p === e.from && result.path[idx+1] === e.to) || (p === e.to && result.path[idx+1] === e.from)));
              return (
                <g key={i}>
                  <line
                    x1={from_n.x} y1={from_n.y} x2={to_n.x} y2={to_n.y}
                    stroke={onPath ? "var(--accent3)" : "var(--border)"}
                    strokeWidth={onPath ? 4 : 1.5}
                    opacity={onPath ? 1 : 0.4}
                  />
                  <text x={(from_n.x + to_n.x) / 2} y={(from_n.y + to_n.y) / 2 - 5}
                    fontSize={9} fill={onPath ? "var(--accent3)" : "var(--text3)"} textAnchor="middle"
                  >
                    {e.energy}kW
                  </text>
                </g>
              );
            })}
            {graphNodes.map(n => {
              const onPath = result && result.path.includes(n.id);
              const isEnd = result && (n.id === result.path[0] || n.id === result.path[result.path.length - 1]);
              return (
                <g key={n.id}>
                  <circle cx={n.x} cy={n.y} r={onPath ? 16 : 11}
                    fill={isEnd ? "var(--accent3)" : onPath ? "var(--accent)" : "var(--bg2)"}
                    stroke={onPath ? (isEnd ? "var(--accent3)" : "var(--accent)") : "var(--border)"}
                    strokeWidth={onPath ? 2.5 : 1.5}
                    style={{ filter: onPath ? "drop-shadow(0 0 6px var(--accent))" : "none", transition: "all 0.5s" }}
                  />
                  <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={9} fill={onPath ? (isEnd ? "#000" : "#fff") : "var(--text3)"} fontWeight={700}>
                    {n.id.split("-")[1]}
                  </text>
                  <text x={n.x} y={n.y + 26} textAnchor="middle" fontSize={9} fill="var(--text2)">{n.label}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className="card">
        <div className="card-title">📋 All Pipe Connections — Energy Cost</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Distance (km)</th>
              <th>Pumping Energy (kW)</th>
            </tr>
          </thead>
          <tbody>
            {graphEdges.map((e, i) => (
              <tr key={i}>
                <td className="mono" style={{ color: "var(--accent)" }}>{e.from}</td>
                <td className="mono" style={{ color: "var(--accent)" }}>{e.to}</td>
                <td className="mono">{e.weight}</td>
                <td className="mono">{e.energy} kW</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
