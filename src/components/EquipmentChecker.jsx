import { useState } from "react";
import { useApp } from "../context/AppContext";
import { assetRegistry, chillers, pipes, fans } from "../data/naviMumbaiData";

const allAssets = [
  ...chillers.map(c => ({ id: c.id, type: "Chiller", name: c.name, zone: c.zone, model: c.model, status: c.status })),
  ...pipes.map(p => ({ id: p.id, type: "Pipe", name: p.name, zone: `${p.from}→${p.to}`, model: `${p.material} Ø${p.diameter}mm`, status: p.status })),
  ...fans.map(f => ({ id: f.id, type: "Fan", name: f.name, zone: f.zone, model: `${f.power}kW`, status: f.status })),
];

export default function EquipmentChecker() {
  const { t } = useApp();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [checked, setChecked] = useState(false);

  const handleCheck = () => {
    const trimmed = query.trim().toUpperCase();
    setChecked(true);
    if (!trimmed) { setResult(null); return; }
    const found = allAssets.find(a => a.id === trimmed);
    setResult(found ? { valid: true, asset: found } : { valid: false });
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleCheck(); };

  return (
    <div className="page-animate">
      <div className="page-header">
        <div className="page-title">⊡ {t.equipmentChecker}</div>
        <div className="page-subtitle">Instantly verify any chiller, pipe, or fan asset ID against the central registry</div>
      </div>

      <div className="card" style={{ maxWidth: 600, marginBottom: 28 }}>
        <div className="card-title">⊡ Verify Asset ID</div>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <input
            className="input"
            value={query}
            onChange={e => { setQuery(e.target.value); setChecked(false); }}
            onKeyDown={handleKeyDown}
            placeholder={`${t.enterAssetId} — e.g. CH-NM-001, PL-NM-003, FN-NM-005`}
          />
          <button className="btn primary" onClick={handleCheck} style={{ whiteSpace: "nowrap" }}>
            🔍 {t.checkId}
          </button>
        </div>

        {checked && result !== null && (
          <div style={{
            borderRadius: 10,
            padding: 20,
            background: result.valid ? "#00cc6610" : "#ff444410",
            border: `1px solid ${result.valid ? "#00cc6633" : "#ff444433"}`,
            animation: "fade-in-scale 0.3s ease"
          }}>
            {result.valid ? (
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--green)", marginBottom: 16 }}>
                  ✓ {t.valid} — Asset Found
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    ["Asset ID", result.asset.id],
                    ["Type", result.asset.type],
                    ["Name", result.asset.name],
                    ["Zone", result.asset.zone],
                    ["Model / Spec", result.asset.model],
                    ["Status", result.asset.status],
                  ].map(([k, v]) => (
                    <div key={k} style={{ background: "var(--bg3)", borderRadius: 8, padding: "10px 14px" }}>
                      <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>{k}</div>
                      <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 600, fontFamily: k === "Asset ID" ? "JetBrains Mono" : "Inter" }}>
                        {k === "Status" ? <span className={`badge ${v}`}>{v}</span> : v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ color: "var(--red)", fontSize: 16, fontWeight: 700 }}>
                ✗ {t.invalid} — Asset ID not found in registry
              </div>
            )}
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">📋 Full Asset Registry — {allAssets.length} Items</div>
        <div style={{ marginBottom: 14 }}>
          <input
            className="input"
            placeholder="Filter registry..."
            onChange={e => {
              const val = e.target.value.toLowerCase();
              document.querySelectorAll(".asset-row").forEach(row => {
                row.style.display = row.dataset.search.includes(val) ? "" : "none";
              });
            }}
          />
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Type</th>
                <th>Name</th>
                <th>Zone</th>
                <th>Model / Spec</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {allAssets.map(a => (
                <tr
                  key={a.id}
                  className="asset-row"
                  data-search={`${a.id} ${a.type} ${a.name} ${a.zone}`.toLowerCase()}
                  style={{ cursor: "pointer" }}
                  onClick={() => { setQuery(a.id); setResult({ valid: true, asset: a }); setChecked(true); }}
                >
                  <td className="mono" style={{ color: "var(--accent)" }}>{a.id}</td>
                  <td>
                    <span style={{
                      padding: "2px 8px",
                      borderRadius: 12,
                      fontSize: 10,
                      fontWeight: 700,
                      background: a.type === "Chiller" ? "#00d4ff18" : a.type === "Pipe" ? "#00ff8818" : "#ff880018",
                      color: a.type === "Chiller" ? "var(--accent)" : a.type === "Pipe" ? "var(--accent3)" : "var(--orange)",
                    }}>
                      {a.type}
                    </span>
                  </td>
                  <td style={{ color: "var(--text)" }}>{a.name}</td>
                  <td className="mono">{a.zone}</td>
                  <td style={{ color: "var(--text3)", fontSize: 12 }}>{a.model}</td>
                  <td><span className={`badge ${a.status}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
