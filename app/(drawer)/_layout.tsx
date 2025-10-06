// app/(drawer)/\_layout.tsx

import { Drawer } from "expo-router/drawer";
import React from "react";
import { DrawerContent } from "../../components/DrawerContent";
import { useTheme } from "../../hooks/useTheme";

export default function DrawerLayout() {
  const { colors } = useTheme();

  return (
    <Drawer
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: colors.background,
          width: 280,
        },
        drawerType: "slide",
        overlayColor: "rgba(0,0,0,0.5)",
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: "Головна",
          title: "Головна",
        }}
      />
    </Drawer>
  );
}
