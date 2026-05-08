import type { LayerToggleState, ToggleKey } from "../types/geo";

export type ToggleDefinition = {
  key: ToggleKey;
  label: string;
  description: string;
  disabled?: boolean;
};

export const metricGroups: Array<{ title: string; items: ToggleDefinition[] }> = [
  {
    title: "\u4eba\u529b\u6307\u6a19",
    items: [
      { key: "authorizedStrength", label: "\u7de8\u5236\u6578", description: "\u986f\u793a\u7de8\u5236\u5bb9\u91cf 100% \u5916\u5708" },
      { key: "actualStrength", label: "\u73fe\u54e1\u6578", description: "\u4ee5\u85cd\u8272\u6c34\u4f4d\u8868\u73fe\u73fe\u54e1\u6bd4\u4f8b" },
      { key: "activePersonnel", label: "\u5728\u71df\u4eba\u6578", description: "\u4ee5\u6df1\u85cd\u7da0\u6c34\u4f4d\u8868\u73fe\u5728\u71df\u6bd4\u4f8b" },
      { key: "manningRate", label: "\u7de8\u73fe\u6bd4", description: "\u4ee5\u5916\u6846\u8272\u968e\u8868\u73fe\u9054\u6210\u6bd4\u4f8b" },
    ],
  },
  {
    title: "\u8996\u89ba\u6a21\u5f0f",
    items: [
      { key: "points", label: "\u9ede\u4f4d", description: "\u986f\u793a\u6c34\u4f4d\u5708\u9ede\u4f4d" },
      { key: "clustering", label: "\u7fa4\u805a", description: "\u71b1\u5340\u958b\u555f\u6642\u6536\u5408\u9ede\u4f4d" },
      { key: "heatmap", label: "\u71b1\u5340", description: "\u986f\u793a\u7de8\u73fe\u6bd4\u71b1\u5340" },
    ],
  },
];

export const defaultLayerToggles: LayerToggleState = {
  authorizedStrength: true,
  actualStrength: true,
  manningRate: true,
  activePersonnel: true,
  certificationRate: false,
  recruitmentStageRate: false,
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
    .filter((key) => toggles[key] && labelByKey.has(key))
    .map((key) => labelByKey.get(key) ?? key);
}
