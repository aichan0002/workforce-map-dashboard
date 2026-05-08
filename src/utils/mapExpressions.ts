import type { ExpressionSpecification } from "maplibre-gl";

export const manningColorExpression: ExpressionSpecification = [
  "case",
  [">=", ["coalesce", ["get", "manningRate"], 0], 0.9],
  "#0f4c81",
  [">=", ["coalesce", ["get", "manningRate"], 0], 0.8],
  "#4f9df7",
  [">=", ["coalesce", ["get", "manningRate"], 0], 0.7],
  "#f59e0b",
  "#dc2626",
];

export const pointRadiusExpression: ExpressionSpecification = [
  "interpolate",
  ["linear"],
  ["coalesce", ["get", "actualStrength"], 0],
  0,
  5,
  500,
  9,
  1000,
  14,
  3000,
  22,
];
