export const MAP_STYLE_URL =
  import.meta.env.VITE_MAP_STYLE_URL || "https://tiles.openfreemap.org/styles/liberty";

export const TAIWAN_VIEW = {
  center: [120.15, 24.05] as [number, number],
  zoom: 5.85,
  minZoom: 5.45,
  fitBounds: [
    [118.05, 21.75],
    [122.25, 26.35],
  ] as [[number, number], [number, number]],
  maxBounds: [
    [117.85, 20.0],
    [123.7, 26.9],
  ] as [[number, number], [number, number]],
};
