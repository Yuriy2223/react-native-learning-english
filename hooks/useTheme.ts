// hooks/useTheme.ts
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { COLORS } from "../constants";
import { settingsUtils } from "../utils";

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === "dark");

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const settings = await settingsUtils.getSettings();
        if (settings?.theme) {
          setIsDark(settings.theme === "dark");
        } else {
          setIsDark(systemColorScheme === "dark");
        }
      } catch (error) {
        console.error("Error loading theme preference:", error);
        setIsDark(systemColorScheme === "dark");
      }
    };

    loadThemePreference();
  }, [systemColorScheme]);

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);

      const currentSettings = await settingsUtils.getSettings();
      await settingsUtils.saveSettings({
        ...currentSettings,
        theme: newTheme ? "dark" : "light",
      } as any);
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  const colors = isDark ? COLORS.dark : COLORS.light;

  return {
    isDark,
    colors,
    toggleTheme,
  };
};
