import { useState } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";
import { useApp } from "../context/AppContext";
import { fans } from "../data/naviMumbaiData";

export default function FanBalancer() {
  const { t } = useApp();
  const [fanData, setFanData] = useState(fans.map(f => ({ ...f })));
  const [balanced, setBalanced] = useState(false);
  const [balancing, setBalancing] = useState(false);

  const totalPower = fanData.reduce((s, f) => s + f.power * (f.load / 100), 0).toFixed(0);
  const avgLoad = (fanData.reduce((s, f) => s + f.load, 0) / fanData.length).toFixed(1);

  const handleBalance = () => {
    setBalancing(true);
    setTimeout(() => {
      const avg = Math.round(fanData.reduce((s, f) => s + f.load, 0) / fanData.length);
      setFanData(prev => prev.map(f => ({ ...f, load: avg + Math.floor((Math.random() - 0.5) * 6), status: "active" })));
      setBalanced(true);
      setBalancing(false);
    }, 1500);
  };

  const handleReset = () => {
    setFanData(fans.map(f => ({ ...f })));
    setBalanced(false);
  };

  const loadColor = (load) => load > 85 ? "var(--red)" : load > 70 ? "var(--orange)" : "var(--green)";

  const radarData = fanData.map(f => ({ fan: f.id.split("-")[2], load: f.load }));

  return (
    <div className="page-animate">
      <div className="page-header">
        <div className="page-title">⊙ {t.fanBalancer}</div>
        <div className="page-subtitle">Intelligent load distribution across all cooling tower fans in Navi Mumbai</div>
      </div>

      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">Total Power Draw</div>
          <div className="stat-value" style={{ fontSize: 24, color: "var(--accent)" }}>{totalPower} kW</div>
          <div style={{ fontSize: 11, color: "var(--text3)" }}>Across {fanData.length} fans</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average Load</div>
          <div className="stat-value" style={{ fontSize: 24, color: parseFloat(avgLoad) > 80 ? "var(--red)" : "var(--green)" }}>{avgLoad}%</div>
          <div style={{ fontSize: 11, color: "var(--text3)" }}>Target: 65–75%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Balance Status</div>
          <div style={{ marginTop: 8 }}>
            <span className={`badge ${balanced ? "active" : "warning"}`}>{balanced ? "Balanced" : "Unbalanced"}</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 6 }}>
            {balanced ? "Load evenly distributed" : "High variance detected"}
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div className="card-title" style={{ margin: 0 }}>⊙ Fan Load Matrix</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn" onClick={handleReset}>↩ Reset</button>
              <button className="btn primary" onClick={handleBalance} disabled={balancing || balanced}>
                {balancing ? "⟳ Balancing..." : `⊙ ${t.distribute}`}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {fanData.map((f) => (
              <div key={f.id} style={{ background: "var(--bg3)", borderRadius: 10, padding: "14px 16px", border: `1px solid ${f.load > 85 ? "#ff444433" : "var(--border)"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div>
                    <span style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "var(--accent)", marginRight: 8 }}>{f.id}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{f.name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontFamily: "Orbitron", fontSize: 16, fontWeight: 700, color: loadColor(f.load) }}>{f.load}%</span>
                    <span className={`badge ${f.status}`}>{f.status}</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${f.load}%`,
                      background: f.load > 85 ? "var(--red)" : f.load > 70 ? "var(--orange)" : "var(--accent)",
                      transition: "width 1s ease",
                    }}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text3)", marginTop: 6 }}>
                  <span>Rated: {f.power} kW</span>
                  <span>Actual: {(f.power * f.load / 100).toFixed(0)} kW</span>
                  <span>Zone: {f.zone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title">⊙ Load Distribution Radar</div>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="fan" tick={{ fill: "var(--text3)", fontSize: 11 }} />
                <Radar dataKey="load" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.25} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: "var(--bg3)", borderRadius: 10, padding: 16, marginTop: 12 }}>
            <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Power Summary</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <div style={{ fontSize: 10, color: "var(--text3)" }}>Total Rated</div>
                <div style={{ fontFamily: "Orbitron", fontSize: 16, color: "var(--accent)" }}>
                  {fans.reduce((s, f) => s + f.power, 0)} kW
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "var(--text3)" }}>Current Draw</div>
                <div style={{ fontFamily: "Orbitron", fontSize: 16, color: "var(--accent3)" }}>
                  {totalPower} kW
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "var(--text3)" }}>Max Fan Load</div>
                <div style={{ fontFamily: "Orbitron", fontSize: 16, color: "var(--red)" }}>
                  {Math.max(...fanData.map(f => f.load))}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "var(--text3)" }}>Min Fan Load</div>
                <div style={{ fontFamily: "Orbitron", fontSize: 16, color: "var(--green)" }}>
                  {Math.min(...fanData.map(f => f.load))}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
