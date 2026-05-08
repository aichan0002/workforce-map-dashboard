import type { LayerToggleState } from "../types/geo";

type MapLegendProps = {
  toggles: LayerToggleState;
};

const text = {
  title: "\u5716\u4f8b",
  aria: "\u5730\u5716\u5716\u4f8b",
  capacityTitle: "\u5bb9\u91cf\u5708\u8b80\u6cd5",
  capacityNote:
    "\u6700\u5916\u5c64\u6df1\u8272\u5708\u4ee3\u8868\u7de8\u5236\u6578 100%\uff1b\u85cd\u8272\u6c34\u4f4d\u4ee3\u8868\u73fe\u54e1\u6578\uff1b\u7da0\u8272\u6c34\u4f4d\u4ee3\u8868\u5728\u71df\u4eba\u6578\u3002",
  manningTitle: "\u7de8\u73fe\u6bd4\u5916\u6846",
  good: "90% \u4ee5\u4e0a \u826f\u597d",
  watch: "80% - 89% \u6ce8\u610f",
  low: "70% - 79% \u504f\u4f4e",
  high: "70% \u4ee5\u4e0b \u9700\u95dc\u6ce8",
  risk: "\u9ad8\u98a8\u96aa\u63d0\u793a",
  waterTitle: "\u4eba\u6578\u6c34\u4f4d",
  authorized: "\u7de8\u5236",
  actual: "\u73fe\u54e1",
  active: "\u5728\u71df",
  heatTitle: "\u71b1\u5340",
  heatLow: "\u4f4e",
  heatHigh: "\u9ad8",
  heatNote: "\u71b1\u5340\u8207\u7fa4\u805a\u540c\u6642\u958b\u555f\u6642\uff0c\u500b\u5225\u9ede\u4f4d\u6703\u6536\u8d77\u4ee5\u964d\u4f4e\u91cd\u758a\u3002",
  boundaryTitle: "\u884c\u653f\u5340\u908a\u754c",
  boundary: "\u5c55\u793a\u7528\u7e23\u5e02\u7bc4\u570d",
};

function MapLegend({ toggles }: MapLegendProps) {
  return (
    <div className="map-legend" aria-label={text.aria}>
      <h2>{text.title}</h2>

      {toggles.points && (
        <section>
          <h3>{text.capacityTitle}</h3>
          <div className="water-marker-sample" aria-hidden="true">
            <span className="sample-circle">
              <span className="sample-fill sample-fill-actual" />
              <span className="sample-fill sample-fill-active" />
            </span>
            <span className="sample-values">
              <span>編制數:110</span>
              <span>在營數:30</span>
              <span>現員數:65</span>
            </span>
          </div>
          <p className="legend-note">{text.capacityNote}</p>
        </section>
      )}

      {toggles.manningRate && (
        <section>
          <h3>{text.manningTitle}</h3>
          <div className="legend-row"><i className="ring-sample" style={{ borderColor: "#004f9f" }} />{text.good}</div>
          <div className="legend-row"><i className="ring-sample" style={{ borderColor: "#0088ff" }} />{text.watch}</div>
          <div className="legend-row"><i className="ring-sample" style={{ borderColor: "#ff9f1c" }} />{text.low}</div>
          <div className="legend-row"><i className="ring-sample" style={{ borderColor: "#e60012" }} />{text.high}</div>
          <div className="legend-row"><span className="risk-symbol">{"\u25b2"}</span>{text.risk}</div>
        </section>
      )}

      {(toggles.authorizedStrength || toggles.actualStrength || toggles.activePersonnel) && (
        <section>
          <h3>{text.waterTitle}</h3>
          <div className="water-legend">
            <span className="water-dot water-authorized" />{text.authorized}
            <span className="water-dot water-actual" />{text.actual}
            <span className="water-dot water-active" />{text.active}
          </div>
        </section>
      )}

      {toggles.heatmap && (
        <section>
          <h3>{text.heatTitle}</h3>
          <div className="heat-scale" />
          <div className="heat-labels">
            <span>{text.heatLow}</span>
            <span>{text.heatHigh}</span>
          </div>
          <p className="legend-note">{text.heatNote}</p>
        </section>
      )}

      {toggles.boundaries && (
        <section>
          <h3>{text.boundaryTitle}</h3>
          <div className="legend-row"><i className="line-sample" />{text.boundary}</div>
        </section>
      )}
    </div>
  );
}

export default MapLegend;
