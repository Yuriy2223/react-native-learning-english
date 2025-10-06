// app/_layout.tsx
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import Toast from "react-native-toast-message";
import { useTheme } from "../hooks/useTheme";
import { AppProvider } from "../provider/Provider";
import { checkAuthStatus } from "../redux/auth/operations";
import { loadSettings } from "../redux/settings/operations";
import { useAppDispatch, useAppSelector } from "../redux/store";

SplashScreen.preventAutoHideAsync();

function GlobalComponents() {
  const { colors, isDark } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />
      <Toast />
    </>
  );
}

function RootLayoutContent() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { isLoading: authLoading } = useAppSelector((state) => state.auth);

  const [fontsLoaded] = useFonts({});

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await dispatch(loadSettings());
        await dispatch(checkAuthStatus());
      } catch (error) {
        console.error("Error initializing app:", error);
      }
    };

    initializeApp();
  }, [dispatch]);

  useEffect(() => {
    if (fontsLoaded && !authLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, authLoading]);

  if (!fontsLoaded || authLoading) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(drawer)" />

      <Stack.Screen name="vocabulary-topic" />
      <Stack.Screen name="vocabulary-card" />

      <Stack.Screen name="phrases-topic" />
      <Stack.Screen name="phrases-card" />

      <Stack.Screen name="grammar-topic" />
      <Stack.Screen name="exercises" />
      <Stack.Screen name="achievements" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <GlobalComponents />
      <RootLayoutContent />
    </AppProvider>
  );
}
