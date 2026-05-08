export const MAP_STYLE_URL =
  import.meta.env.VITE_MAP_STYLE_URL || "https://tiles.openfreemap.org/styles/liberty";

export const TAIWAN_VIEW = {
  center: [120.95, 23.75] as [number, number],
  zoom: 6.7,
  maxBounds: [
    [118.0, 20.0],
    [123.5, 26.8],
  ] as [[number, number], [number, number]],
};
