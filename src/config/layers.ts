export const LAYER_IDS = {
  heatmapManning: "heatmap-manning",
  heatmapRecruitment: "heatmap-recruitment",
  clusters: "clusters",
  clusterCount: "cluster-count",
  unitCapacity: "unit-capacity",
  unitActual: "unit-actual",
  unitActive: "unit-active",
  unitPoints: "unit-points",
  manningRing: "manning-ring",
  riskHighlight: "risk-highlight",
  unitLabels: "unit-labels",
  cityBoundaries: "city-boundaries",
} as const;

export const UNIT_SOURCE_ID = "units";
export const CITY_SOURCE_ID = "taiwan-cities";

export const layerOrder = [
  LAYER_IDS.heatmapManning,
  LAYER_IDS.heatmapRecruitment,
  LAYER_IDS.cityBoundaries,
  LAYER_IDS.clusters,
  LAYER_IDS.clusterCount,
  LAYER_IDS.unitCapacity,
  LAYER_IDS.unitActual,
  LAYER_IDS.unitActive,
  LAYER_IDS.unitPoints,
  LAYER_IDS.manningRing,
  LAYER_IDS.riskHighlight,
  LAYER_IDS.unitLabels,
];
