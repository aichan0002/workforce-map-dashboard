import maplibregl, { GeoJSONSource, Map, MapGeoJSONFeature, PointLike } from "maplibre-gl";
import { LAYER_IDS, UNIT_SOURCE_ID } from "../config/layers";
import type { UnitProperties } from "../types/geo";
import { formatNumber, formatPercent } from "../utils/formatters";

function readProperties(feature: MapGeoJSONFeature): UnitProperties {
  return feature.properties as UnitProperties;
}

function popupHtml(properties: UnitProperties) {
  return `
    <div class="map-popup">
      <strong>${properties.unitName}</strong>
      <p>${properties.city}，${properties.region}</p>
      <dl>
        <dt>編制數</dt><dd>${formatNumber(properties.authorizedStrength)}</dd>
        <dt>現員數</dt><dd>${formatNumber(properties.actualStrength)}</dd>
        <dt>編現比</dt><dd>${formatPercent(properties.manningRate)}</dd>
        <dt>在營人數</dt><dd>${formatNumber(properties.activePersonnel)}</dd>
        <dt>持證比</dt><dd>${formatPercent(properties.certificationRate)}</dd>
        <dt>招募達成率</dt><dd>${formatPercent(properties.recruitmentStageRate)}</dd>
      </dl>
      <p class="popup-note">資料日期：${properties.updatedAt}</p>
    </div>
  `;
}

function tooltipHtml(properties: UnitProperties) {
  return `
    <div class="map-tooltip">
      <strong>${properties.unitName}</strong>
      <span>${properties.city} / ${properties.region}</span>
      <span>編現比 ${formatPercent(properties.manningRate)}</span>
      <span>現員 ${formatNumber(properties.actualStrength)} / 編制 ${formatNumber(properties.authorizedStrength)}</span>
      <span>招募達成率 ${formatPercent(properties.recruitmentStageRate)}</span>
    </div>
  `;
}

export function attachMapEvents(map: Map) {
  const hoverPopup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false,
    offset: 14,
    className: "unit-hover-popup",
  });

  const onPointMove = (event: maplibregl.MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    if (!feature) return;
    map.getCanvas().style.cursor = "pointer";
    hoverPopup
      .setLngLat(event.lngLat)
      .setHTML(tooltipHtml(readProperties(feature)))
      .addTo(map);
  };

  const onPointLeave = () => {
    map.getCanvas().style.cursor = "";
    hoverPopup.remove();
  };

  const onPointClick = (event: maplibregl.MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    if (!feature) return;
    new maplibregl.Popup({ offset: 18 })
      .setLngLat(event.lngLat)
      .setHTML(popupHtml(readProperties(feature)))
      .addTo(map);
  };

  const onClusterClick = async (event: maplibregl.MapMouseEvent) => {
    const features = map.queryRenderedFeatures(event.point as PointLike, {
      layers: [LAYER_IDS.clusters],
    });
    const feature = features[0];
    if (!feature || feature.geometry.type !== "Point") return;

    const source = map.getSource(UNIT_SOURCE_ID) as GeoJSONSource | undefined;
    if (!source) return;

    const clusterId = feature.properties?.cluster_id;
    const zoom = await source.getClusterExpansionZoom(clusterId);
    map.easeTo({
      center: feature.geometry.coordinates as [number, number],
      zoom,
      duration: 650,
    });
  };

  map.on("mousemove", LAYER_IDS.unitPoints, onPointMove);
  map.on("mouseleave", LAYER_IDS.unitPoints, onPointLeave);
  map.on("click", LAYER_IDS.unitPoints, onPointClick);
  map.on("click", LAYER_IDS.clusters, onClusterClick);

  return () => {
    hoverPopup.remove();
    map.off("mousemove", LAYER_IDS.unitPoints, onPointMove);
    map.off("mouseleave", LAYER_IDS.unitPoints, onPointLeave);
    map.off("click", LAYER_IDS.unitPoints, onPointClick);
    map.off("click", LAYER_IDS.clusters, onClusterClick);
  };
}
