import { COLORS } from "@/constants";
import { saveSettings } from "@/redux/settings/operations";
import { updateTheme } from "@/redux/settings/slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.settings.settings.theme);
  const settings = useAppSelector((state) => state.settings.settings);

  const currentTheme = theme;
  const colors = COLORS[currentTheme];
  const isDark = currentTheme === "dark";

  const toggleTheme = async () => {
    try {
      const newTheme: "light" | "dark" = isDark ? "light" : "dark";
      dispatch(updateTheme(newTheme));

      await dispatch(saveSettings({ ...settings, theme: newTheme }));
    } catch (error) {
      console.error("Error toggling theme:", error);
    }
  };

  return {
    theme: currentTheme,
    colors,
    isDark,
    toggleTheme,
  };
};
