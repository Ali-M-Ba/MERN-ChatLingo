import { createContext, useContext } from "react";

const ThemeContext = createContext(null);

function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside a ThemeProvider");
  }

  return context;
}

export { ThemeContext, useTheme };
