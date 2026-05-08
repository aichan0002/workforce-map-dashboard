export const LAYER_IDS = {
  heatmapManning: "heatmap-manning",
  heatmapRecruitment: "heatmap-recruitment",
  clusters: "clusters",
  clusterCount: "cluster-count",
  unitPoints: "unit-points",
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
  LAYER_IDS.unitPoints,
  LAYER_IDS.riskHighlight,
  LAYER_IDS.unitLabels,
];
