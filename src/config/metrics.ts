import type { LayerToggleState, ToggleKey } from "../types/geo";

export type ToggleDefinition = {
  key: ToggleKey;
  label: string;
  description: string;
  disabled?: boolean;
};

export const metricGroups: Array<{ title: string; items: ToggleDefinition[] }> = [
  {
    title: "人力指標",
    items: [
      { key: "authorizedStrength", label: "編制數", description: "於提示資訊顯示編制量級" },
      { key: "actualStrength", label: "現員數", description: "於點位大小與提示資訊顯示現員數" },
      { key: "manningRate", label: "編現比", description: "以分級顏色呈現達成比例" },
      { key: "activePersonnel", label: "在營人數", description: "於提示資訊顯示在營人數" },
    ],
  },
  {
    title: "能力指標",
    items: [
      { key: "certificationRate", label: "特定能力持證比", description: "於提示資訊顯示能力資格比例" },
      { key: "recruitmentStageRate", label: "招募階段達成率", description: "可作為熱區權重參考" },
    ],
  },
  {
    title: "視覺模式",
    items: [
      { key: "points", label: "點位", description: "顯示匿名單位點位" },
      { key: "clustering", label: "群聚", description: "縮小時合併點位" },
      { key: "heatmap", label: "熱區", description: "顯示編現比與招募達成率熱區" },
      { key: "boundaries", label: "行政區邊界", description: "顯示展示用縣市邊界" },
    ],
  },
];

export const defaultLayerToggles: LayerToggleState = {
  authorizedStrength: true,
  actualStrength: true,
  manningRate: true,
  activePersonnel: true,
  certificationRate: true,
  recruitmentStageRate: true,
  points: true,
  clustering: true,
  heatmap: false,
  boundaries: false,
};

const labelByKey = new Map(
  metricGroups.flatMap((group) => group.items.map((item) => [item.key, item.label] as const)),
);

export function getEnabledMetricLabels(toggles: LayerToggleState) {
  return (Object.keys(toggles) as ToggleKey[])
    .filter((key) => toggles[key])
    .map((key) => labelByKey.get(key) ?? key);
}
