import type { ExpressionSpecification } from "maplibre-gl";

export const manningColorExpression: ExpressionSpecification = [
  "case",
  [">=", ["coalesce", ["get", "manningRate"], 0], 0.9],
  "#004f9f",
  [">=", ["coalesce", ["get", "manningRate"], 0], 0.8],
  "#0088ff",
  [">=", ["coalesce", ["get", "manningRate"], 0], 0.7],
  "#ff9f1c",
  "#e60012",
];

export const pointRadiusExpression: ExpressionSpecification = [
  "interpolate",
  ["linear"],
  ["coalesce", ["get", "actualStrength"], 0],
  0,
  8,
  500,
  13,
  1000,
  19,
  3000,
  30,
];
