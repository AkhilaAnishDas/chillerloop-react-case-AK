import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import * as XLSX from "xlsx";
import { useApp } from "../context/AppContext";
import { zones } from "../data/naviMumbaiData";

const MAX_HISTORY = 25;

function formatTime(d) {
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}`;
}

export default function FlowTracker() {
  const { t } = useApp();
  const [liveZones, setLiveZones] = useState(zones.map(z => ({ ...z })));
  const [chartHistory, setChartHistory] = useState(() => {
    const t0 = formatTime(new Date());
    return [{ t: t0, ...Object.fromEntries(zones.map(z => [z.id, z.flowRate])) }];
  });
  const [exportMsg, setExportMsg] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = formatTime(new Date());
      setLiveZones(prev => {
        const updated = prev.map(z => ({
          ...z,
          flowRate: parseFloat(Math.max(10, z.flowRate + (Math.random() - 0.48) * 5).toFixed(1)),
          temp: parseFloat((z.temp + (Math.random() - 0.5) * 0.15).toFixed(1)),
          pressure: parseFloat((z.pressure + (Math.random() - 0.5) * 0.04).toFixed(2)),
        }));
        setChartHistory(hist => {
          const entry = { t: now, ...Object.fromEntries(updated.map(z => [z.id, z.flowRate])) };
          const next = [...hist, entry];
          return next.length > MAX_HISTORY ? next.slice(next.length - MAX_HISTORY) : next;
        });
        return updated;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const colors = ["#00d4ff", "#00ff88", "#ff8800", "#ff4444", "#aa88ff", "#ffcc00", "#ff66aa", "#44ffcc"];

  const exportExcel = () => {
    const now = new Date();
    const rows = liveZones.map(z => {
      const pipeArea = Math.PI * Math.pow(0.3, 2);
      return {
        "Timestamp": now.toLocaleString("en-IN", { hour12: false }),
        "Zone ID": z.id,
        "Zone Name": z.name,
        "Area": z.area,
        "Flow Rate (L/s)": z.flowRate,
        "Velocity (m/s)": (z.flowRate / 1000 / pipeArea).toFixed(2),
        "Temperature (°C)": z.temp,
        "Pressure (bar)": z.pressure,
        "Pipe Length (km)": z.pipeLen,
        "Status": z.status,
      };
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), "Flow Data");
    const fname = `ChillerLoop_FlowData_${now.toISOString().slice(0,10)}.xlsx`;
    XLSX.writeFile(wb, fname);
    setExportMsg(`✓ Exported: ${fname}`);
    setTimeout(() => setExportMsg(""), 4000);
  };

  return (
    <div className="page-animate">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <div className="page-title">〜 {t.flowTracker}</div>
          <div className="page-subtitle">
            Live water flow speed across Navi Mumbai cooling zones
            <span style={{ marginLeft: 10, color: "var(--green)", fontSize: 11, fontWeight: 700 }}>
              ⬤ LIVE — updating every 3s
            </span>
          </div>
        </div>
        <button className="btn success" onClick={exportExcel}>📊 Export Flow Excel</button>
      </div>

      {exportMsg && (
        <div style={{ background: "#00cc6618", border: "1px solid #00cc6633", borderRadius: 10, padding: "10px 18px", marginBottom: 18, fontSize: 13, color: "var(--green)" }}>
          {exportMsg}
        </div>
      )}

      <div className="grid-4" style={{ marginBottom: 24 }}>
        {liveZones.map((z, i) => (
          <div key={z.id} className="stat-card">
            <div className="stat-icon" style={{ color: colors[i] }}>〜</div>
            <div className="stat-label">{z.area}</div>
            <div className="stat-value" style={{ fontSize: 22, color: z.flowRate > 180 ? "var(--red)" : z.flowRate > 130 ? "var(--orange)" : colors[i], transition: "color 0.5s" }}>
              {z.flowRate} <span style={{ fontSize: 12, color: "var(--text3)" }}>L/s</span>
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>
              {z.temp}°C · {z.pressure} bar
            </div>
            <div className="flow-meter" style={{ marginTop: 10 }}>
              <div className="flow-fill" style={{ width: `${Math.min(100, (z.flowRate / 220) * 100)}%` }} />
            </div>
            <span className={`badge ${z.status}`} style={{ marginTop: 8 }}>{z.status}</span>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-title" style={{ display: "flex", justifyContent: "space-between" }}>
          <span>〜 Real-Time Flow Rate — All 8 Zones (L/s)</span>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "var(--green)" }}>⬤ LIVE</span>
        </div>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="t" tick={{ fill: "var(--text3)", fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis tick={{ fill: "var(--text3)", fontSize: 11 }} domain={["auto", "auto"]} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Legend />
              {zones.map((z, i) => (
                <Line key={z.id} type="monotone" dataKey={z.id} name={z.area} stroke={colors[i]} strokeWidth={2} dot={false} isAnimationActive={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="card-title">⊞ Detailed Flow Table — All Zones · Live</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Zone</th>
              <th>Area</th>
              <th>Flow Rate (L/s)</th>
              <th>Pipe Length (km)</th>
              <th>Velocity (m/s)</th>
              <th>Temp (°C)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {liveZones.map(z => {
              const pipeArea = Math.PI * Math.pow(0.3, 2);
              const velocity = (z.flowRate / 1000 / pipeArea).toFixed(2);
              return (
                <tr key={z.id}>
                  <td className="mono" style={{ color: "var(--accent)" }}>{z.id}</td>
                  <td style={{ color: "var(--text)" }}>{z.name}</td>
                  <td className="mono" style={{ transition: "color 0.5s", color: z.flowRate > 180 ? "var(--red)" : z.flowRate > 130 ? "var(--orange)" : "var(--accent)" }}>{z.flowRate}</td>
                  <td className="mono">{z.pipeLen}</td>
                  <td className="mono">{velocity} m/s</td>
                  <td className="mono">{z.temp}</td>
                  <td><span className={`badge ${z.status}`}>{z.status}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
