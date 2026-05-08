import { useMemo } from "react";
import TopBanner from "./components/TopBanner";
import Sidebar from "./components/Sidebar";
import MapPanel from "./components/MapPanel";
import { useLayerToggles } from "./hooks/useLayerToggles";
import { getEnabledMetricLabels } from "./config/metrics";

function App() {
  const { toggles, setToggle } = useLayerToggles();
  const enabledMetrics = useMemo(() => getEnabledMetricLabels(toggles), [toggles]);

  return (
    <div className="app-shell">
      <TopBanner />
      <main className="app-body">
        <Sidebar toggles={toggles} onToggle={setToggle} />
        <MapPanel toggles={toggles} />
      </main>
      <footer className="status-bar">
        <span>NOTIONAL synthetic dataset</span>
        <span>啟用指標：{enabledMetrics.length ? enabledMetrics.join("、") : "無"}</span>
        <span>時區：Asia/Taipei</span>
      </footer>
    </div>
  );
}

export default App;
