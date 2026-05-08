import type { LayerToggleState } from "../types/geo";
import MapLegend from "./MapLegend";
import MapLibreMap from "./MapLibreMap";

type MapPanelProps = {
  toggles: LayerToggleState;
};

function MapPanel({ toggles }: MapPanelProps) {
  return (
    <section className="map-panel" aria-label="臺灣地圖主視覺區">
      <MapLibreMap toggles={toggles} />
      <div className="map-corner-label">
        <span>TAIWAN WORKFORCE VIEW</span>
        <strong>資料日期 2026-05-08</strong>
      </div>
      <MapLegend toggles={toggles} />
    </section>
  );
}

export default MapPanel;
