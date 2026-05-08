export function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return "無資料";
  return new Intl.NumberFormat("zh-TW").format(value);
}

export function formatPercent(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return "無法計算";
  return new Intl.NumberFormat("zh-TW", {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(value);
}
