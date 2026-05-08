import type { LayerToggleState } from "../types/geo";

type MapLegendProps = {
  toggles: LayerToggleState;
};

function MapLegend({ toggles }: MapLegendProps) {
  return (
    <div className="map-legend" aria-label="地圖圖例">
      <h2>圖例</h2>

      {toggles.points && (
        <section>
          <h3>點位讀法</h3>
          <p className="legend-note">圓點顏色代表編現比，圓點大小代表現員數。</p>
        </section>
      )}

      {toggles.manningRate && (
        <section>
          <h3>編現比顏色</h3>
          <div className="legend-row"><i style={{ background: "#004f9f" }} />90% 以上 良好</div>
          <div className="legend-row"><i style={{ background: "#0088ff" }} />80% - 89% 注意</div>
          <div className="legend-row"><i style={{ background: "#ff9f1c" }} />70% - 79% 偏低</div>
          <div className="legend-row"><i style={{ background: "#e60012" }} />70% 以下 需關注</div>
          <div className="legend-row"><span className="risk-symbol">▲</span>高風險提示</div>
        </section>
      )}

      {toggles.actualStrength && (
        <section>
          <h3>現員數大小</h3>
          <div className="bubble-scale">
            <span className="bubble bubble-sm" />
            <span className="bubble bubble-md" />
            <span className="bubble bubble-lg" />
            <small>小 / 中 / 大</small>
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
          <p className="legend-note">熱區與群聚同時開啟時，個別點位會收起以降低重疊。</p>
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
