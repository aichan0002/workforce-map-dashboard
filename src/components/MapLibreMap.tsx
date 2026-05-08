import { useEffect, useRef } from "react";
import maplibregl, { Map } from "maplibre-gl";
import { CITY_SOURCE_ID, LAYER_IDS, UNIT_SOURCE_ID } from "../config/layers";
import { MAP_STYLE_URL, TAIWAN_VIEW } from "../config/mapStyle";
import type { LayerToggleState } from "../types/geo";
import {
  activeRadiusExpression,
  actualRadiusExpression,
  authorizedRadiusExpression,
  manningColorExpression,
} from "../utils/mapExpressions";
import { attachMapEvents } from "../hooks/useMapEvents";
import ResetViewButton from "./ResetViewButton";

type MapLibreMapProps = {
  toggles: LayerToggleState;
};

const dataUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;

type UnitFeature = {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: {
    unitName: string;
    region: string;
    city: string;
    authorizedStrength: number;
    actualStrength: number;
    manningRate: number | null;
    activePersonnel: number;
    certificationRate: number | null;
    recruitmentStageRate: number | null;
    riskLevel: "low" | "medium" | "high";
    updatedAt: string;
  };
};

type UnitCollection = {
  type: "FeatureCollection";
  features: UnitFeature[];
};

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value));
}

function markerSize(authorizedStrength: number) {
  if (authorizedStrength >= 2200) return 58;
  if (authorizedStrength >= 1500) return 50;
  if (authorizedStrength >= 900) return 42;
  return 34;
}

function ringColor(manningRate: number | null) {
  if (manningRate === null) return "#64748b";
  if (manningRate >= 0.9) return "#004f9f";
  if (manningRate >= 0.8) return "#0088ff";
  if (manningRate >= 0.7) return "#ff9f1c";
  return "#e60012";
}

function unitPopupHtml(properties: UnitFeature["properties"]) {
  const numberFormat = new Intl.NumberFormat("zh-TW");
  const percentFormat = new Intl.NumberFormat("zh-TW", {
    style: "percent",
    maximumFractionDigits: 0,
  });
  const percent = (value: number | null) => (value === null ? "無法計算" : percentFormat.format(value));

  return `
    <div class="map-popup">
      <strong>${properties.unitName}</strong>
      <p>${properties.city}，${properties.region}</p>
      <dl>
        <dt>編制數</dt><dd>${numberFormat.format(properties.authorizedStrength)}</dd>
        <dt>在營人數</dt><dd>${numberFormat.format(properties.activePersonnel)}</dd>
        <dt>現員數</dt><dd>${numberFormat.format(properties.actualStrength)}</dd>
        <dt>編現比</dt><dd>${percent(properties.manningRate)}</dd>
      </dl>
      <p class="popup-note">資料日期：${properties.updatedAt}</p>
    </div>
  `;
}

function createWaterMarker(feature: UnitFeature, map: Map) {
  const element = document.createElement("button");
  const props = feature.properties;
  const authorized = Math.max(props.authorizedStrength, 1);
  const actualPercent = clampPercent((props.actualStrength / authorized) * 100);
  const activePercent = clampPercent((props.activePersonnel / authorized) * 100);
  const size = markerSize(props.authorizedStrength);

  element.type = "button";
  element.className = "water-map-marker";
  element.style.setProperty("--marker-size", `${size}px`);
  element.style.setProperty("--actual-fill", `${actualPercent}%`);
  element.style.setProperty("--active-fill", `${activePercent}%`);
  element.style.setProperty("--manning-ring", ringColor(props.manningRate));
  element.setAttribute("aria-label", props.unitName);
  element.innerHTML = `
    <span class="water-marker-circle">
      <span class="water-fill water-fill-actual"></span>
      <span class="water-fill water-fill-active"></span>
    </span>
  `;

  const popup = new maplibregl.Popup({ offset: Math.round(size / 2) }).setHTML(unitPopupHtml(props));
  element.addEventListener("mouseenter", () => {
    popup.setLngLat(feature.geometry.coordinates).addTo(map);
  });
  element.addEventListener("mouseleave", () => popup.remove());
  element.addEventListener("click", () => {
    popup.setLngLat(feature.geometry.coordinates).addTo(map);
  });

  return element;
}

function updateWaterMarkerVisibility(
  map: Map | null,
  toggles: LayerToggleState,
  elements: HTMLElement[],
) {
  const zoom = map?.getZoom() ?? 0;
  void zoom;
  const visible = toggles.points && (!toggles.heatmap || !toggles.clustering);

  elements.forEach((element) => {
    element.classList.toggle("is-hidden", !visible);
    element.classList.toggle("hide-actual", !toggles.actualStrength);
    element.classList.toggle("hide-active", !toggles.activePersonnel);
    element.classList.toggle("hide-ring", !toggles.manningRate);
  });
}

function setLayerVisibility(map: Map, layerId: string, visible: boolean) {
  if (!map.getLayer(layerId)) return;
  map.setLayoutProperty(layerId, "visibility", visible ? "visible" : "none");
}

function addSourcesAndLayers(map: Map) {
  if (!map.getSource(UNIT_SOURCE_ID)) {
    map.addSource(UNIT_SOURCE_ID, {
      type: "geojson",
      data: dataUrl("data/units.geojson"),
      cluster: true,
      clusterMaxZoom: 10,
      clusterRadius: 50,
    });
  }

  if (!map.getSource(CITY_SOURCE_ID)) {
    map.addSource(CITY_SOURCE_ID, {
      type: "geojson",
      data: dataUrl("data/taiwan-cities.geojson"),
    });
  }

  if (!map.getLayer(LAYER_IDS.heatmapManning)) {
    map.addLayer({
      id: LAYER_IDS.heatmapManning,
      type: "heatmap",
      source: UNIT_SOURCE_ID,
      maxzoom: 11,
      paint: {
        "heatmap-weight": [
          "interpolate",
          ["linear"],
          ["coalesce", ["get", "manningRate"], 0],
          0.5,
          0.2,
          0.7,
          0.5,
          0.9,
          1,
        ],
        "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 5, 0.65, 10, 1.4],
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0,
          "rgba(79,157,247,0)",
          0.35,
          "rgba(0,136,255,0.7)",
          0.7,
          "rgba(255,159,28,0.82)",
          1,
          "rgba(230,0,18,0.92)",
        ],
        "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 5, 30, 10, 56],
        "heatmap-opacity": 0.86,
      },
      layout: { visibility: "none" },
    });
  }

  if (!map.getLayer(LAYER_IDS.heatmapRecruitment)) {
    map.addLayer({
      id: LAYER_IDS.heatmapRecruitment,
      type: "heatmap",
      source: UNIT_SOURCE_ID,
      maxzoom: 11,
      paint: {
        "heatmap-weight": [
          "interpolate",
          ["linear"],
          ["coalesce", ["get", "recruitmentStageRate"], 0],
          0.3,
          0.2,
          0.6,
          0.6,
          0.9,
          1,
        ],
        "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 5, 0.7, 10, 1.45],
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0,
          "rgba(15,76,129,0)",
          0.45,
          "rgba(0,79,159,0.64)",
          0.85,
          "rgba(230,0,18,0.78)",
          1,
          "rgba(230,0,18,0.9)",
        ],
        "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 5, 26, 10, 50],
        "heatmap-opacity": 0.68,
      },
      layout: { visibility: "none" },
    });
  }

  if (!map.getLayer(LAYER_IDS.cityBoundaries)) {
    map.addLayer({
      id: LAYER_IDS.cityBoundaries,
      type: "line",
      source: CITY_SOURCE_ID,
      paint: {
        "line-color": "#06233f",
        "line-width": ["interpolate", ["linear"], ["zoom"], 5, 1.4, 9, 2.6],
        "line-opacity": 0.78,
        "line-dasharray": [2, 2],
      },
      layout: { visibility: "none" },
    });
  }

  if (!map.getLayer(LAYER_IDS.clusters)) {
    map.addLayer({
      id: LAYER_IDS.clusters,
      type: "circle",
      source: UNIT_SOURCE_ID,
      filter: ["has", "point_count"],
      paint: {
        "circle-color": ["step", ["get", "point_count"], "#0088ff", 8, "#004f9f", 18, "#06233f"],
        "circle-radius": ["step", ["get", "point_count"], 24, 8, 31, 18, 40],
        "circle-stroke-width": 4,
        "circle-stroke-color": "rgba(255,255,255,0.96)",
      },
    });
  }

  if (!map.getLayer(LAYER_IDS.clusterCount)) {
    map.addLayer({
      id: LAYER_IDS.clusterCount,
      type: "symbol",
      source: UNIT_SOURCE_ID,
      filter: ["has", "point_count"],
      layout: {
        "text-field": ["get", "point_count_abbreviated"],
        "text-font": ["Noto Sans Regular"],
        "text-size": 17,
      },
      paint: {
        "text-color": "#ffffff",
      },
    });
  }

  if (!map.getLayer(LAYER_IDS.unitCapacity)) {
    map.addLayer({
      id: LAYER_IDS.unitCapacity,
      type: "circle",
      source: UNIT_SOURCE_ID,
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "#06233f",
        "circle-radius": authorizedRadiusExpression,
        "circle-opacity": 0.9,
        "circle-stroke-width": 1,
        "circle-stroke-color": "rgba(255,255,255,0.92)",
      },
    });
  }

  if (!map.getLayer(LAYER_IDS.unitActual)) {
    map.addLayer({
      id: LAYER_IDS.unitActual,
      type: "circle",
      source: UNIT_SOURCE_ID,
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "#2f80ed",
        "circle-radius": actualRadiusExpression,
        "circle-opacity": 0.9,
      },
    });
  }

  if (!map.getLayer(LAYER_IDS.unitActive)) {
    map.addLayer({
      id: LAYER_IDS.unitActive,
      type: "circle",
      source: UNIT_SOURCE_ID,
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "#14b8a6",
        "circle-radius": activeRadiusExpression,
        "circle-opacity": 0.92,
      },
    });
  }

  if (!map.getLayer(LAYER_IDS.unitPoints)) {
    map.addLayer({
      id: LAYER_IDS.unitPoints,
      type: "circle",
      source: UNIT_SOURCE_ID,
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "#ffffff",
        "circle-radius": ["+", authorizedRadiusExpression, 4],
        "circle-opacity": 0,
        "circle-stroke-width": 0,
      },
    });
  }

  if (!map.getLayer(LAYER_IDS.manningRing)) {
    map.addLayer({
      id: LAYER_IDS.manningRing,
      type: "circle",
      source: UNIT_SOURCE_ID,
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "rgba(255,255,255,0)",
        "circle-radius": ["+", authorizedRadiusExpression, 3],
        "circle-stroke-width": 4,
        "circle-stroke-color": manningColorExpression,
      },
    });
  }

  if (!map.getLayer(LAYER_IDS.riskHighlight)) {
    map.addLayer({
      id: LAYER_IDS.riskHighlight,
      type: "symbol",
      source: UNIT_SOURCE_ID,
      filter: ["all", ["!", ["has", "point_count"]], ["==", ["get", "riskLevel"], "high"]],
      layout: {
        "text-field": "\u25b2",
        "text-size": ["interpolate", ["linear"], ["zoom"], 5.5, 13, 8.5, 18],
        "text-offset": [0, -1.25],
        "text-anchor": "bottom",
        "text-allow-overlap": false,
      },
      paint: {
        "text-color": "#e60012",
        "text-halo-color": "rgba(255,255,255,0.98)",
        "text-halo-width": 1.4,
      },
    });
  }

  if (!map.getLayer(LAYER_IDS.unitLabels)) {
    map.addLayer({
      id: LAYER_IDS.unitLabels,
      type: "symbol",
      source: UNIT_SOURCE_ID,
      filter: ["!", ["has", "point_count"]],
      minzoom: 6.75,
      layout: {
        "text-field": ["get", "unitName"],
        "text-size": ["interpolate", ["linear"], ["zoom"], 6.75, 12, 8.5, 14],
        "text-offset": [0, 1.6],
        "text-anchor": "top",
        "text-allow-overlap": false,
      },
      paint: {
        "text-color": "#06233f",
        "text-halo-color": "rgba(255,255,255,0.96)",
        "text-halo-width": 1.8,
      },
    });
  }
}

function applyLayerState(map: Map, toggles: LayerToggleState) {
  const showClusters = toggles.clustering;
  const showPoints = toggles.points;
  const showHeatmap = toggles.heatmap;
  const showIndividualPoints = showPoints && (!showHeatmap || !showClusters);

  setLayerVisibility(map, LAYER_IDS.clusters, showClusters && !showIndividualPoints);
  setLayerVisibility(map, LAYER_IDS.clusterCount, showClusters && !showIndividualPoints);
  setLayerVisibility(map, LAYER_IDS.heatmapManning, showHeatmap && toggles.manningRate);
  setLayerVisibility(map, LAYER_IDS.heatmapRecruitment, false);
  setLayerVisibility(map, LAYER_IDS.cityBoundaries, false);
  setLayerVisibility(map, LAYER_IDS.unitCapacity, false);
  setLayerVisibility(map, LAYER_IDS.unitActual, false);
  setLayerVisibility(map, LAYER_IDS.unitActive, false);
  setLayerVisibility(map, LAYER_IDS.unitPoints, showIndividualPoints);
  setLayerVisibility(map, LAYER_IDS.manningRing, false);
  setLayerVisibility(map, LAYER_IDS.riskHighlight, false);
  setLayerVisibility(map, LAYER_IDS.unitLabels, showIndividualPoints);
}

function MapLibreMap({ toggles }: MapLibreMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const loadedRef = useRef(false);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const markerElementsRef = useRef<HTMLElement[]>([]);
  const togglesRef = useRef(toggles);

  togglesRef.current = toggles;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE_URL,
      center: TAIWAN_VIEW.center,
      zoom: TAIWAN_VIEW.zoom,
      minZoom: TAIWAN_VIEW.minZoom,
      maxBounds: TAIWAN_VIEW.maxBounds,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
    mapRef.current = map;

    let detachEvents: (() => void) | undefined;
    let detachMarkerZoom: (() => void) | undefined;
    map.on("load", () => {
      addSourcesAndLayers(map);
      applyLayerState(map, toggles);
      map.fitBounds(TAIWAN_VIEW.fitBounds, {
        padding: { top: 64, right: 72, bottom: 48, left: 72 },
        duration: 0,
        maxZoom: TAIWAN_VIEW.zoom,
      });
      detachEvents = attachMapEvents(map);
      loadedRef.current = true;

      fetch(dataUrl("data/units.geojson"))
        .then((response) => response.json() as Promise<UnitCollection>)
        .then((collection) => {
          const markers = collection.features.map((feature) => {
            const element = createWaterMarker(feature, map);
            const marker = new maplibregl.Marker({ element, anchor: "center" })
              .setLngLat(feature.geometry.coordinates)
              .addTo(map);
            return marker;
          });
          markersRef.current = markers;
          markerElementsRef.current = markers.map((marker) => marker.getElement());
          updateWaterMarkerVisibility(map, togglesRef.current, markerElementsRef.current);

          const onZoom = () =>
            updateWaterMarkerVisibility(map, togglesRef.current, markerElementsRef.current);
          map.on("zoom", onZoom);
          map.on("moveend", onZoom);
          detachMarkerZoom = () => {
            map.off("zoom", onZoom);
            map.off("moveend", onZoom);
          };
        });
    });

    return () => {
      detachEvents?.();
      detachMarkerZoom?.();
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      markerElementsRef.current = [];
      map.remove();
      mapRef.current = null;
      loadedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loadedRef.current) return;
    applyLayerState(map, toggles);
    updateWaterMarkerVisibility(map, toggles, markerElementsRef.current);
  }, [toggles]);

  const resetView = () => {
    mapRef.current?.fitBounds(TAIWAN_VIEW.fitBounds, {
      padding: { top: 64, right: 72, bottom: 48, left: 72 },
      maxZoom: TAIWAN_VIEW.zoom,
      bearing: 0,
      pitch: 0,
      duration: 750,
    });
  };

  return (
    <>
      <div className="map-container" ref={containerRef} />
      <ResetViewButton onReset={resetView} />
    </>
  );
}

export default MapLibreMap;
