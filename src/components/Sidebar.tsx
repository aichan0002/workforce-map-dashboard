import { metricGroups } from "../config/metrics";
import type { LayerToggleState, ToggleKey } from "../types/geo";
import MetricToggle from "./MetricToggle";

type SidebarProps = {
  toggles: LayerToggleState;
  onToggle: (key: ToggleKey, value: boolean) => void;
};

function Sidebar({ toggles, onToggle }: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="圖層控制">
      <div className="sidebar-heading">
        <span>圖層控制</span>
        <small>Layer Control</small>
      </div>

      {metricGroups.map((group) => (
        <section className="control-group" key={group.title}>
          <h2>{group.title}</h2>
          <div className="toggle-list">
            {group.items.map((item) => (
              <MetricToggle
                key={item.key}
                id={item.key}
                label={item.label}
                description={item.description}
                checked={toggles[item.key]}
                disabled={item.disabled}
                onChange={onToggle}
              />
            ))}
          </div>
        </section>
      ))}

      <div className="sidebar-note">
        <strong>資料註記</strong>
        <span>本頁僅使用匿名化模擬資料，座標已採展示用途偏移。</span>
      </div>
    </aside>
  );
}

export default Sidebar;
