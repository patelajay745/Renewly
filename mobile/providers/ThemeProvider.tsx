import React, {createContext, useContext, useState, useMemo} from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavThemeProvider,
} from "@react-navigation/native";
import {darkColors, lightColors, semanticColors} from "@/constants/theme";

type ThemeMode = "light" | "dark";

interface ThemeContextProps {
  mode: ThemeMode;
  colors: typeof semanticColors.light;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | null>(null);

export const useAppTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useAppTheme must be used within ThemeProvider");
  return ctx;
};

export const ThemeProvider = ({children}: {children: React.ReactNode}) => {
  const [mode, setMode] = useState<ThemeMode>("dark"); // default dark

  const toggleTheme = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));

  const colors =
    mode === "light" ? semanticColors["light"] : semanticColors["dark"];

  return (
    <ThemeContext.Provider value={{mode, colors, toggleTheme}}>
      <NavThemeProvider value={mode === "light" ? DefaultTheme : DarkTheme}>
        {children}
      </NavThemeProvider>
    </ThemeContext.Provider>
  );
};
