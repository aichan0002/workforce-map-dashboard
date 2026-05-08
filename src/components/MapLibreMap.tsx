import { useEffect, useRef } from "react";
import maplibregl, { Map } from "maplibre-gl";
import { CITY_SOURCE_ID, LAYER_IDS, UNIT_SOURCE_ID } from "../config/layers";
import { MAP_STYLE_URL, TAIWAN_VIEW } from "../config/mapStyle";
import type { LayerToggleState } from "../types/geo";
import { manningColorExpression, pointRadiusExpression } from "../utils/mapExpressions";
import { attachMapEvents } from "../hooks/useMapEvents";
import ResetViewButton from "./ResetViewButton";

type MapLibreMapProps = {
  toggles: LayerToggleState;
};

const dataUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;

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

  if (!map.getLayer(LAYER_IDS.unitPoints)) {
    map.addLayer({
      id: LAYER_IDS.unitPoints,
      type: "circle",
      source: UNIT_SOURCE_ID,
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": manningColorExpression,
        "circle-radius": pointRadiusExpression,
        "circle-opacity": 0.96,
        "circle-stroke-width": 1.5,
        "circle-stroke-color": "rgba(6,35,63,0.42)",
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
        "text-field": "▲",
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

  setLayerVisibility(map, LAYER_IDS.clusters, showClusters);
  setLayerVisibility(map, LAYER_IDS.clusterCount, showClusters);
  setLayerVisibility(map, LAYER_IDS.heatmapManning, showHeatmap && toggles.manningRate);
  setLayerVisibility(map, LAYER_IDS.heatmapRecruitment, showHeatmap && toggles.recruitmentStageRate);
  setLayerVisibility(map, LAYER_IDS.cityBoundaries, toggles.boundaries);
  setLayerVisibility(map, LAYER_IDS.unitPoints, showIndividualPoints);
  setLayerVisibility(map, LAYER_IDS.riskHighlight, showIndividualPoints && toggles.manningRate);
  setLayerVisibility(map, LAYER_IDS.unitLabels, showIndividualPoints);

  if (map.getLayer(LAYER_IDS.unitPoints)) {
    map.setPaintProperty(LAYER_IDS.unitPoints, "circle-opacity", showHeatmap ? 0.7 : 0.96);
    map.setPaintProperty(
      LAYER_IDS.unitPoints,
      "circle-radius",
      toggles.actualStrength ? pointRadiusExpression : 13,
    );
    map.setPaintProperty(
      LAYER_IDS.unitPoints,
      "circle-color",
      toggles.manningRate ? manningColorExpression : "#0088ff",
    );
  }
}

function MapLibreMap({ toggles }: MapLibreMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const loadedRef = useRef(false);

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
    });

    return () => {
      detachEvents?.();
      map.remove();
      mapRef.current = null;
      loadedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loadedRef.current) return;
    applyLayerState(map, toggles);
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
