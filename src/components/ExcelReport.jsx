import { useState } from "react";
import * as XLSX from "xlsx";
import { useApp } from "../context/AppContext";
import { zones, chillers, fans, pipes } from "../data/naviMumbaiData";

export default function ExcelReport() {
  const { t } = useApp();
  const [generating, setGenerating] = useState(false);
  const [lastExport, setLastExport] = useState(null);

  const doExport = (sheetKey) => {
    setGenerating(sheetKey);
    setTimeout(() => {
      const now = new Date();
      const ts = now.toLocaleString("en-IN", { hour12: false });
      const wb = XLSX.utils.book_new();

      if (sheetKey === "full" || sheetKey === "zones") {
        const zoneSheet = zones.map(z => ({
          "Timestamp": ts,
          "Zone ID": z.id,
          "Zone Name": z.name,
          "Area": z.area,
          "Latitude": z.lat,
          "Longitude": z.lng,
          "Flow Rate (L/s)": z.flowRate,
          "Temperature (°C)": z.temp,
          "Pressure (bar)": z.pressure,
          "Heat Load (kW)": z.heatLoad,
          "Pipe Length (km)": z.pipeLen,
          "Status": z.status,
        }));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(zoneSheet), "Zones");
      }

      if (sheetKey === "full" || sheetKey === "chillers") {
        const chillerSheet = chillers.map(c => ({
          "Timestamp": ts,
          "Chiller ID": c.id,
          "Name": c.name,
          "Zone": c.zone,
          "Model": c.model,
          "Installed Year": c.installed,
          "Capacity (kW)": c.capacity,
          "Current Load (%)": c.currentLoad,
          "Pressure (bar)": c.pressure,
          "Status": c.status,
        }));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(chillerSheet), "Chillers");
      }

      if (sheetKey === "full" || sheetKey === "fans") {
        const fanSheet = fans.map(f => ({
          "Timestamp": ts,
          "Fan ID": f.id,
          "Name": f.name,
          "Zone": f.zone,
          "Rated Power (kW)": f.power,
          "Current Load (%)": f.load,
          "Actual Consumption (kW)": (f.power * f.load / 100).toFixed(1),
          "Status": f.status,
        }));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(fanSheet), "Fans");
      }

      if (sheetKey === "full" || sheetKey === "pipes") {
        const pipeSheet = pipes.map(p => ({
          "Timestamp": ts,
          "Pipe ID": p.id,
          "Name": p.name,
          "From Zone": p.from,
          "To Zone": p.to,
          "Diameter (mm)": p.diameter,
          "Length (km)": p.length,
          "Material": p.material,
          "Status": p.status,
        }));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(pipeSheet), "Pipes");
      }

      if (sheetKey === "full") {
        const summary = [
          { "Parameter": "Report Type", "Value": "Full System Report" },
          { "Parameter": "Generated At", "Value": ts },
          { "Parameter": "City", "Value": "Navi Mumbai, Maharashtra, India" },
          { "Parameter": "System", "Value": "ChillerLoop v2.6 — Underground Cooling System" },
          { "Parameter": "Total Zones", "Value": zones.length },
          { "Parameter": "Total Chillers", "Value": chillers.length },
          { "Parameter": "Total Fans", "Value": fans.length },
          { "Parameter": "Total Pipe Lines", "Value": pipes.length },
          { "Parameter": "Total Flow Rate (L/s)", "Value": zones.reduce((s, z) => s + z.flowRate, 0).toFixed(1) },
          { "Parameter": "Total Heat Load (kW)", "Value": zones.reduce((s, z) => s + z.heatLoad, 0).toLocaleString() },
          { "Parameter": "Average Temperature (°C)", "Value": (zones.reduce((s, z) => s + z.temp, 0) / zones.length).toFixed(1) },
          { "Parameter": "Critical Zones", "Value": zones.filter(z => z.status === "critical").length },
          { "Parameter": "Active Chillers", "Value": chillers.filter(c => c.status === "active").length },
          { "Parameter": "Creator", "Value": "Akhila Anish Das — 150096725016" },
          { "Parameter": "Case Study", "Value": "No. 46 — Cohort: Larry Page — Semester 2 Sprint 2" },
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summary), "Summary");
      }

      const label = sheetKey === "full" ? "FullReport" : sheetKey.charAt(0).toUpperCase() + sheetKey.slice(1);
      const fname = `ChillerLoop_NaviMumbai_${label}_${now.toISOString().slice(0,10)}_${String(now.getHours()).padStart(2,"0")}${String(now.getMinutes()).padStart(2,"0")}.xlsx`;
      XLSX.writeFile(wb, fname);
      setLastExport(fname);
      setGenerating(false);
    }, 600);
  };

  const reports = [
    { key: "full", icon: "📊", title: "Full System Report", desc: "All zones, chillers, fans, pipes + summary in one file", color: "var(--accent)" },
    { key: "zones", icon: "🗺", title: "Zone Monitor Report", desc: "Flow rates, temperatures, pressures for all 8 zones", color: "var(--accent3)" },
    { key: "chillers", icon: "⊛", title: "Chiller Report", desc: "Chiller load, model, capacity, pressure per unit", color: "var(--orange)" },
    { key: "fans", icon: "⊙", title: "Fan Power Report", desc: "Fan load percentages, rated vs actual power consumption", color: "#aa88ff" },
    { key: "pipes", icon: "⊗", title: "Pipe Network Report", desc: "Pipe diameter, length, material, and route information", color: "#44aaff" },
  ];

  return (
    <div className="page-animate">
      <div className="page-header">
        <div className="page-title">📥 Excel Report Centre</div>
        <div className="page-subtitle">Download current monitoring data as formatted Excel spreadsheets</div>
      </div>

      <div className="card" style={{ marginBottom: 24, background: "#00d4ff08", borderColor: "#00d4ff33" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ fontSize: 36 }}>📊</div>
          <div>
            <div style={{ fontFamily: "Orbitron", fontSize: 16, color: "var(--accent)", fontWeight: 700, marginBottom: 4 }}>
              Export Real-Time Monitoring Data
            </div>
            <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>
              All exports include a timestamp, zone metadata, and current live sensor readings.<br />
              Data reflects the latest values as of the moment you click Export.
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
        {reports.map(r => (
          <div key={r.key} style={{
            background: "var(--card)",
            border: `1px solid var(--border)`,
            borderRadius: 14,
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            gap: 20,
            transition: "border-color 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = r.color}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
          >
            <div style={{ fontSize: 36, minWidth: 44, textAlign: "center" }}>{r.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 4 }}>{r.title}</div>
              <div style={{ fontSize: 13, color: "var(--text3)" }}>{r.desc}</div>
            </div>
            <button
              className="btn primary"
              onClick={() => doExport(r.key)}
              disabled={generating === r.key}
              style={{
                background: generating === r.key ? "var(--bg3)" : `linear-gradient(135deg, ${r.color}, ${r.color}bb)`,
                borderColor: r.color,
                color: generating === r.key ? "var(--text2)" : "#000",
                minWidth: 140,
              }}
            >
              {generating === r.key ? (
                <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span> Generating...
                </span>
              ) : "📥 Export .xlsx"}
            </button>
          </div>
        ))}
      </div>

      {lastExport && (
        <div style={{ background: "#00cc6618", border: "1px solid #00cc6633", borderRadius: 10, padding: "14px 20px", fontSize: 13, color: "var(--green)" }}>
          ✓ Last export: <strong style={{ fontFamily: "JetBrains Mono" }}>{lastExport}</strong>
        </div>
      )}

      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-title">📋 What's Included in Each Report</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Report</th>
              <th>Sheets Included</th>
              <th>Key Fields</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ color: "var(--accent)", fontWeight: 700 }}>Full System</td>
              <td>Summary, Zones, Chillers, Fans, Pipes</td>
              <td>All metrics + summary statistics</td>
            </tr>
            <tr>
              <td style={{ color: "var(--accent3)", fontWeight: 700 }}>Zone Monitor</td>
              <td>Zones</td>
              <td>Flow, Temp, Pressure, Heat Load, Status</td>
            </tr>
            <tr>
              <td style={{ color: "var(--orange)", fontWeight: 700 }}>Chiller</td>
              <td>Chillers</td>
              <td>Load %, Capacity, Pressure, Model, Status</td>
            </tr>
            <tr>
              <td style={{ color: "#aa88ff", fontWeight: 700 }}>Fan Power</td>
              <td>Fans</td>
              <td>Rated Power, Actual Draw, Load %, Status</td>
            </tr>
            <tr>
              <td style={{ color: "#44aaff", fontWeight: 700 }}>Pipe Network</td>
              <td>Pipes</td>
              <td>Route, Diameter, Length, Material, Status</td>
            </tr>
          </tbody>
        </table>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
