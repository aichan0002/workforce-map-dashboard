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

export const authorizedRadiusExpression: ExpressionSpecification = [
  "interpolate",
  ["linear"],
  ["coalesce", ["get", "authorizedStrength"], 0],
  0,
  8,
  500,
  13,
  1000,
  19,
  3000,
  30,
];

export const actualRadiusExpression: ExpressionSpecification = [
  "interpolate",
  ["linear"],
  ["coalesce", ["get", "actualStrength"], 0],
  0,
  5,
  500,
  10,
  1000,
  16,
  3000,
  27,
];

export const activeRadiusExpression: ExpressionSpecification = [
  "interpolate",
  ["linear"],
  ["coalesce", ["get", "activePersonnel"], 0],
  0,
  3,
  500,
  7,
  1000,
  12,
  3000,
  22,
];
