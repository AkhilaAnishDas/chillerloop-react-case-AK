import { useApp } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import FlowTracker from "./components/FlowTracker";
import CompressorOverride from "./components/CompressorOverride";
import RestartQueue from "./components/RestartQueue";
import EquipmentChecker from "./components/EquipmentChecker";
import HeatSorter from "./components/HeatSorter";
import PipeMapHub from "./components/PipeMapHub";
import FlowPlanner from "./components/FlowPlanner";
import FanBalancer from "./components/FanBalancer";
import ExcelReport from "./components/ExcelReport";
import About from "./components/About";
import Settings from "./components/Settings";

const pages = {
  dashboard: Dashboard,
  flow: FlowTracker,
  compressor: CompressorOverride,
  queue: RestartQueue,
  equipment: EquipmentChecker,
  heat: HeatSorter,
  pipemap: PipeMapHub,
  planner: FlowPlanner,
  fanbalancer: FanBalancer,
  excel: ExcelReport,
  about: About,
  settings: Settings,
};

function App() {
  const { sidebarOpen, activePage } = useApp();
  const PageComponent = pages[activePage] || Dashboard;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className={`main-content ${sidebarOpen ? "" : "sidebar-closed"}`}>
        <Topbar />
        <main className="page-area">
          <PageComponent key={activePage} />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
