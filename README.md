# 組織人力態勢展示平台

展示型單頁式資料視覺化原型。所有點位、名稱與指標皆為 NOTIONAL 模擬資料，不代表任何真實單位或位置。

## 安裝與執行

```bash
npm install
npm run dev
```

開發伺服器預設由 Vite 提供。建置靜態檔：

```bash
npm run build
```

預覽建置結果：

```bash
npm run preview
```

## 技術

- React + TypeScript + Vite
- MapLibre GL JS
- OpenFreeMap style URL，集中於 `src/config/mapStyle.ts`
- 本機 GeoJSON 模擬資料，放在 `public/data`

## 資料格式

主要資料來源為 `public/data/units.geojson`，每筆 Feature 使用 Point geometry，properties 包含：

| 欄位 | 說明 |
|---|---|
| `unitName` | 匿名展示單位名稱 |
| `region` | 北部、中部、南部、東部、離島 |
| `city` | 縣市名稱 |
| `authorizedStrength` | 編制數 |
| `actualStrength` | 現員數 |
| `manningRate` | 編現比，0 至 1 |
| `activePersonnel` | 在營人數 |
| `certificationRate` | 特定能力持證比，0 至 1 |
| `recruitmentStageRate` | 招募階段達成率，0 至 1 |
| `riskLevel` | `low`、`medium`、`high` |
| `updatedAt` | 展示資料日期 |

新增指標時，建議同步更新：

- `public/data/units.geojson`
- `src/config/metrics.ts`
- `src/config/layers.ts`
- `src/components/MapLegend.tsx`

## 部署

此專案可部署為靜態網站。

### GitHub Pages

1. 執行 `npm run build`
2. 將 `dist` 內容發布到 GitHub Pages
3. 若部署於子路徑，於 `vite.config.ts` 設定 `base`

### Cloudflare Pages / Netlify

- Build command: `npm run build`
- Output directory: `dist`

## 注意事項

公開圖資服務可能受網路、政策與流量限制影響。正式展示或長期部署建議改為自架 OpenFreeMap/OpenMapTiles 或 PMTiles 離線方案。
