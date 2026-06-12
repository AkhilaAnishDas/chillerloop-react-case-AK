import { useApp } from "../context/AppContext";

export default function Topbar() {
  const { sidebarOpen, setSidebarOpen, theme, setTheme, t, activePage } = useApp();

  const pageLabels = {
    dashboard: t.dashboard,
    flow: t.flowTracker,
    compressor: t.compressor,
    queue: t.restartQueue,
    equipment: t.equipmentChecker,
    heat: t.heatSorter,
    pipemap: t.pipeMap,
    planner: t.flowPlanner,
    fanbalancer: t.fanBalancer,
    about: t.about,
    settings: t.settings,
  };

  return (
    <header className="topbar">
      <button className="topbar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? "✕" : "☰"}
      </button>
      <div className="topbar-title">💧 {t.appName} — {pageLabels[activePage] || ""}</div>
      <div className="topbar-city">📍 Navi Mumbai, MH</div>
      <button
        className="theme-toggle"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? "☀️" : "🌙"} {theme === "dark" ? t.light : t.dark}
      </button>
    </header>
  );
}
