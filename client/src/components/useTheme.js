import { useTheme as useThemeContext } from "./theme-context";

export function useTheme() {
  return useThemeContext();
}
