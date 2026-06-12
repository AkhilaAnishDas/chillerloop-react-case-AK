import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useApp } from "../context/AppContext";
import { zones } from "../data/naviMumbaiData";

export default function HeatSorter() {
  const { t } = useApp();
  const [sorted, setSorted] = useState([...zones].sort((a, b) => b.heatLoad - a.heatLoad));
  const [sortDir, setSortDir] = useState("desc");

  const handleSort = () => {
    const dir = sortDir === "desc" ? "asc" : "desc";
    setSorted(prev => [...prev].sort((a, b) => dir === "desc" ? b.heatLoad - a.heatLoad : a.heatLoad - b.heatLoad));
    setSortDir(dir);
  };

  const maxHeat = Math.max(...sorted.map(z => z.heatLoad));

  const getHeatColor = (load) => {
    const ratio = load / maxHeat;
    if (ratio > 0.8) return "var(--red)";
    if (ratio > 0.6) return "var(--orange)";
    if (ratio > 0.4) return "#ffcc00";
    return "var(--green)";
  };

  const chartData = sorted.map(z => ({ name: z.area, heat: z.heatLoad, temp: z.temp }));

  return (
    <div className="page-animate">
      <div className="page-header">
        <div className="page-title">⊕ {t.heatSorter}</div>
        <div className="page-subtitle">Ranked heat load analysis across all piping network sections in Navi Mumbai</div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div className="card-title" style={{ margin: 0 }}>⊕ Heat Load Ranking (kW)</div>
          <button className="btn primary" onClick={handleSort}>
            {sortDir === "desc" ? "▼" : "▲"} {t.sort} ({sortDir === "desc" ? "High→Low" : "Low→High"})
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sorted.map((z, i) => {
            const ratio = z.heatLoad / maxHeat;
            const color = getHeatColor(z.heatLoad);
            return (
              <div
                key={z.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  background: "var(--bg3)",
                  borderRadius: 10,
                  padding: "14px 18px",
                  border: `1px solid ${i === 0 ? "#ff444444" : "var(--border)"}`,
                  transition: "all 0.3s",
                  animation: `slide-rank 0.3s ease ${i * 0.05}s both`,
                }}
              >
                <div style={{ fontFamily: "Orbitron", fontSize: 20, fontWeight: 700, color: i < 2 ? color : "var(--text3)", minWidth: 32 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div>
                      <span style={{ fontFamily: "Orbitron", fontSize: 12, color: "var(--accent)", marginRight: 8 }}>{z.id}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{z.name}</span>
                    </div>
                    <span style={{ fontFamily: "Orbitron", fontSize: 18, fontWeight: 700, color }}>
                      {z.heatLoad.toLocaleString()} <span style={{ fontSize: 11, fontWeight: 400 }}>kW</span>
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${ratio * 100}%`, background: color }} />
                  </div>
                  <div style={{ display: "flex", gap: 20, marginTop: 6, fontSize: 11, color: "var(--text3)" }}>
                    <span>Temp: {z.temp}°C</span>
                    <span>Flow: {z.flowRate} L/s</span>
                    <span>Pressure: {z.pressure} bar</span>
                    <span>Pipe: {z.pipeLen} km</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <div className="card-title">⊕ Heat Load Chart — All Zones</div>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill: "var(--text3)", fontSize: 11 }} />
              <YAxis tick={{ fill: "var(--text3)", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }}
                formatter={(v) => [`${v.toLocaleString()} kW`, "Heat Load"]}
              />
              <Bar dataKey="heat" radius={[4,4,0,0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={getHeatColor(entry.heat)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <style>{`
        @keyframes slide-rank {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
