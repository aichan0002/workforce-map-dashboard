import { useCallback, useState } from "react";
import { defaultLayerToggles } from "../config/metrics";
import type { LayerToggleState, ToggleKey } from "../types/geo";

export function useLayerToggles() {
  const [toggles, setToggles] = useState<LayerToggleState>(defaultLayerToggles);

  const setToggle = useCallback((key: ToggleKey, value: boolean) => {
    setToggles((current) => ({
      ...current,
      [key]: value,
    }));
  }, []);

  return { toggles, setToggle };
}
