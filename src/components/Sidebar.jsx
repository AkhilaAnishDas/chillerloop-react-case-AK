import { useApp } from "../context/AppContext";

const navItems = [
  { key: "dashboard", icon: "◈", label_key: "dashboard" },
  { key: "flow", icon: "〜", label_key: "flowTracker" },
  { key: "compressor", icon: "⊛", label_key: "compressor" },
  { key: "queue", icon: "⊞", label_key: "restartQueue" },
  { key: "equipment", icon: "⊡", label_key: "equipmentChecker" },
  { key: "heat", icon: "⊕", label_key: "heatSorter" },
  { key: "pipemap", icon: "⊗", label_key: "pipeMap" },
  { key: "planner", icon: "⊘", label_key: "flowPlanner" },
  { key: "fanbalancer", icon: "⊙", label_key: "fanBalancer" },
];

const bottomItems = [
  { key: "excel", icon: "📊", label_key: "excelReport" },
  { key: "about", icon: "◎", label_key: "about" },
  { key: "settings", icon: "⊛", label_key: "settings" },
];

export default function Sidebar() {
  const { sidebarOpen, t, activePage, setActivePage } = useApp();

  return (
    <aside className={`sidebar ${sidebarOpen ? "" : "closed"}`}>
      <div className="sidebar-logo">
        <div className="logo-drop">💧</div>
        <div>
          <div className="logo-text">{t.appName}</div>
          <div className="logo-sub">Navi Mumbai</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">System Modules</div>
        {navItems.map((item) => (
          <div
            key={item.key}
            className={`nav-item ${activePage === item.key ? "active" : ""}`}
            onClick={() => setActivePage(item.key)}
          >
            <span className="icon">{item.icon}</span>
            <span>{t[item.label_key]}</span>
          </div>
        ))}

        <div className="nav-section-label" style={{ marginTop: 16 }}>General</div>
        {bottomItems.map((item) => (
          <div
            key={item.key}
            className={`nav-item ${activePage === item.key ? "active" : ""}`}
            onClick={() => setActivePage(item.key)}
          >
            <span className="icon">{item.icon}</span>
            <span>{t[item.label_key] || (item.key === "excel" ? "Excel Reports" : item.key)}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer-info">
        <div>🟢 System Online</div>
        <div style={{ marginTop: 4 }}>Navi Mumbai UGCS v2.6</div>
      </div>
    </aside>
  );
}
