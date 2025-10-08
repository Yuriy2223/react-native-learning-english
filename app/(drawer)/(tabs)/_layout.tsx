// app/(drawer)/(tabs)/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Tabs } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import { SHADOWS } from "../../../constants";
import { useTheme } from "../../../hooks/useTheme";

export default function TabLayout() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
          ...SHADOWS.small,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: "600",
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={openDrawer}
            style={{ marginLeft: 16, padding: 8 }}
          >
            <Ionicons name="menu" size={24} color={colors.text} />
          </TouchableOpacity>
        ),
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Головна",
          headerTitle: "English Learning",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Словник",
          headerTitle: "Словник",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "library" : "library-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* <Tabs.Screen
        name="phrases"
        options={{
          title: "Фрази",
          headerTitle: "Фрази",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "chatbubbles" : "chatbubbles-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      /> */}

      {/* <Tabs.Screen
        name="grammar"
        options={{
          title: "Граматика",
          headerTitle: "Граматика",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "school" : "school-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      /> */}
    </Tabs>
  );
}
