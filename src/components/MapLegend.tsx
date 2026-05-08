import type { LayerToggleState } from "../types/geo";

type MapLegendProps = {
  toggles: LayerToggleState;
};

function MapLegend({ toggles }: MapLegendProps) {
  return (
    <div className="map-legend" aria-label="地圖圖例">
      <h2>圖例</h2>

      {toggles.manningRate && (
        <section>
          <h3>編現比</h3>
          <div className="legend-row"><i style={{ background: "#0f4c81" }} />90% 以上 良好</div>
          <div className="legend-row"><i style={{ background: "#4f9df7" }} />80% - 89% 注意</div>
          <div className="legend-row"><i style={{ background: "#f59e0b" }} />70% - 79% 偏低</div>
          <div className="legend-row"><i style={{ background: "#dc2626" }} />70% 以下 需關注</div>
        </section>
      )}

      {toggles.actualStrength && (
        <section>
          <h3>現員數</h3>
          <div className="bubble-scale">
            <span className="bubble bubble-sm" />
            <span className="bubble bubble-md" />
            <span className="bubble bubble-lg" />
            <small>點位越大代表量級越高</small>
          </div>
        </section>
      )}

      {toggles.heatmap && (
        <section>
          <h3>熱區</h3>
          <div className="heat-scale" />
          <div className="heat-labels">
            <span>低</span>
            <span>高</span>
          </div>
        </section>
      )}

      {toggles.boundaries && (
        <section>
          <h3>行政區邊界</h3>
          <div className="legend-row"><i className="line-sample" />展示用縣市範圍</div>
        </section>
      )}
    </div>
  );
}

export default MapLegend;
