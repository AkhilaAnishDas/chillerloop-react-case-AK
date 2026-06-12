import { useState } from "react";
import { useApp } from "../context/AppContext";
import { zones, pipes, graphNodes, graphEdges } from "../data/naviMumbaiData";

export default function PipeMapHub() {
  const { t } = useApp();
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredEdge, setHoveredEdge] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);

  const nodeMap = Object.fromEntries(graphNodes.map(n => [n.id, n]));
  const zone = selectedZone ? zones.find(z => z.id === selectedZone) : null;

  const statusColor = { active: "#00cc66", warning: "#ff8800", critical: "#ff4444", inactive: "#64748b" };

  return (
    <div className="page-animate">
      <div className="page-header">
        <div className="page-title">⊗ {t.pipeMap}</div>
        <div className="page-subtitle">Interactive underground pipe network map — Navi Mumbai district cooling system</div>
      </div>

      <div className="grid-2" style={{ gap: 24 }}>
        <div className="card">
          <div className="card-title">⊗ Network Map — Navi Mumbai UGCS</div>
          <svg viewBox="0 0 560 460" style={{ width: "100%", height: 380, background: "var(--bg3)", borderRadius: 10 }}>
            {/* Grid lines */}
            {Array.from({ length: 8 }, (_, i) => (
              <line key={`h${i}`} x1={0} y1={i * 60} x2={560} y2={i * 60} stroke="var(--border)" strokeWidth={0.5} opacity={0.5} />
            ))}
            {Array.from({ length: 10 }, (_, i) => (
              <line key={`v${i}`} x1={i * 60} y1={0} x2={i * 60} y2={460} stroke="var(--border)" strokeWidth={0.5} opacity={0.5} />
            ))}

            {/* Edges / Pipes */}
            {graphEdges.map((e, i) => {
              const from = nodeMap[e.from];
              const to = nodeMap[e.to];
              if (!from || !to) return null;
              const isHovered = hoveredEdge === i;
              const pipe = pipes.find(p => (p.from === e.from && p.to === e.to) || (p.from === e.to && p.to === e.from));
              const sc = pipe ? statusColor[pipe.status] || "#00d4ff" : "#00d4ff";
              return (
                <g key={i}>
                  <line
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={isHovered ? "#fff" : sc}
                    strokeWidth={isHovered ? 4 : 2.5}
                    strokeDasharray={isHovered ? "8 4" : "none"}
                    opacity={isHovered ? 1 : 0.7}
                    style={{ cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={() => setHoveredEdge(i)}
                    onMouseLeave={() => setHoveredEdge(null)}
                    className={isHovered ? "" : "pipe-flow-line"}
                  />
                  {/* Energy label */}
                  <text
                    x={(from.x + to.x) / 2}
                    y={(from.y + to.y) / 2 - 6}
                    fontSize={9}
                    fill={sc}
                    textAnchor="middle"
                    opacity={isHovered ? 1 : 0.6}
                  >
                    {e.energy}kW
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {graphNodes.map(n => {
              const zoneData = zones.find(z => z.id === n.id);
              const col = zoneData ? statusColor[zoneData.status] : "#00d4ff";
              const isSelected = selectedZone === n.id;
              const isHovered = hoveredNode === n.id;
              return (
                <g key={n.id} style={{ cursor: "pointer" }} onClick={() => setSelectedZone(n.id === selectedZone ? null : n.id)}>
                  <circle
                    cx={n.x} cy={n.y} r={isSelected ? 18 : isHovered ? 16 : 13}
                    fill={isSelected ? col : "var(--bg2)"}
                    stroke={col}
                    strokeWidth={isSelected ? 3 : 2}
                    style={{ transition: "all 0.2s", filter: isSelected ? `drop-shadow(0 0 8px ${col})` : "none" }}
                    onMouseEnter={() => setHoveredNode(n.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  />
                  <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={9} fill={isSelected ? "white" : col} fontWeight={700}>
                    {n.id.split("-")[1]}
                  </text>
                  <text x={n.x} y={n.y + 26} textAnchor="middle" fontSize={9} fill="var(--text2)">
                    {n.label}
                  </text>
                </g>
              );
            })}

            {/* Legend */}
            <g transform="translate(16, 400)">
              {Object.entries(statusColor).map(([s, c], i) => (
                <g key={s} transform={`translate(${i * 90}, 0)`}>
                  <circle cx={6} cy={6} r={5} fill={c} opacity={0.8} />
                  <text x={14} y={10} fontSize={10} fill="var(--text3)" textTransform="capitalize">{s}</text>
                </g>
              ))}
            </g>
          </svg>

          <div style={{ marginTop: 12, fontSize: 11, color: "var(--text3)", textAlign: "center" }}>
            Click a node to inspect zone · Hover pipes to see details
          </div>
        </div>

        <div>
          {/* Zone Detail */}
          {zone ? (
            <div className="card" style={{ marginBottom: 20, borderColor: "var(--accent)" }}>
              <div className="card-title">📍 Zone Details — {zone.id}</div>
              <div style={{ fontFamily: "Orbitron", fontSize: 18, color: "var(--accent)", marginBottom: 12 }}>{zone.name}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  ["Flow Rate", `${zone.flowRate} L/s`],
                  ["Temperature", `${zone.temp}°C`],
                  ["Pressure", `${zone.pressure} bar`],
                  ["Heat Load", `${zone.heatLoad.toLocaleString()} kW`],
                  ["Pipe Length", `${zone.pipeLen} km`],
                  ["Status", zone.status],
                ].map(([k, v]) => (
                  <div key={k} style={{ background: "var(--bg3)", borderRadius: 8, padding: "10px 14px" }}>
                    <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>{k}</div>
                    <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 600 }}>
                      {k === "Status" ? <span className={`badge ${v}`}>{v}</span> : v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card" style={{ marginBottom: 20, background: "var(--bg3)", textAlign: "center", padding: 28 }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>⊗</div>
              <div style={{ color: "var(--text3)", fontSize: 13 }}>Click a zone node on the map to inspect its details</div>
            </div>
          )}

          {/* Pipe List */}
          <div className="card">
            <div className="card-title">📋 Pipe Registry — {pipes.length} Lines</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {pipes.map(p => (
                <div key={p.id} style={{ background: "var(--bg3)", borderRadius: 8, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "var(--accent)" }}>{p.id}</div>
                    <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>{p.from} → {p.to} · Ø{p.diameter}mm · {p.length}km · {p.material}</div>
                  </div>
                  <span className={`badge ${p.status}`}>{p.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
