export type RiskLevel = "low" | "medium" | "high";

export type UnitProperties = {
  unitName: string;
  region: string;
  city: string;
  authorizedStrength: number;
  actualStrength: number;
  manningRate: number | null;
  activePersonnel: number;
  certificationRate: number | null;
  recruitmentStageRate: number | null;
  riskLevel: RiskLevel;
  updatedAt: string;
};

export type LayerToggleState = {
  authorizedStrength: boolean;
  actualStrength: boolean;
  manningRate: boolean;
  activePersonnel: boolean;
  certificationRate: boolean;
  recruitmentStageRate: boolean;
  points: boolean;
  clustering: boolean;
  heatmap: boolean;
  boundaries: boolean;
};

export type ToggleKey = keyof LayerToggleState;
