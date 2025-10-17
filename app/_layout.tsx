import { ErrorScreen } from "@/components/ErrorScreen";
import { Loader } from "@/components/Loader";
import { selectIsError, selectIsLoading } from "@/redux/auth/selectors";
import { clearError } from "@/redux/auth/slice";
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

function RootLayoutContent() {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const isError = useAppSelector(selectIsError);
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
    if (fontsLoaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoading]);

  if (!fontsLoaded || isLoading) {
    return <Loader fullScreen />;
  }

  if (isError) {
    return (
      <ErrorScreen
        message={isError}
        onRetry={() => {
          dispatch(clearError());
          dispatch(checkAuthStatus());
        }}
      />
    );
  }

  return (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(drawer)" />
        <Stack.Screen name="reset-password" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="vocabulary-topic" />
        <Stack.Screen name="vocabulary-card" />
        <Stack.Screen name="phrases-topic" />
        <Stack.Screen name="phrases-card" />
        {/* <Stack.Screen name="grammar-topic" />
        <Stack.Screen name="exercises" /> */}
        {/* <Stack.Screen name="achievements" /> */}
      </Stack>

      <Toast />
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RootLayoutContent />
    </AppProvider>
  );
}
