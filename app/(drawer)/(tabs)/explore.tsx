// app/(drawer)(tabs)/explore.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SIZES } from "../../../constants";
import { useTheme } from "../../../hooks/useTheme";

interface Module {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  route: string;
}

const modules: Module[] = [
  {
    id: "1",
    title: "Словник",
    icon: "book",
    color: "#007AFF",
    route: "/vocabulary-topics",
  },
  {
    id: "2",
    title: "Фрази",
    icon: "chatbubbles",
    color: "#5856D6",
    route: "/phrases-topics",
  },
  {
    id: "3",
    title: "Граматика",
    icon: "school",
    color: "#34C759",
    route: "/grammar-topics",
  },
  {
    id: "4",
    title: "Вправи",
    icon: "fitness",
    color: "#FF9500",
    route: "/exercises",
  },
  {
    id: "5",
    title: "Досягнення",
    icon: "trophy",
    color: "#FF3B30",
    route: "/achievements",
  },
  {
    id: "6",
    title: "Налаштування",
    icon: "settings",
    color: "#8E8E93",
    route: "/settings",
  },
];

export default function ExploreScreen() {
  const { colors } = useTheme();

  const handleModulePress = (route: string) => {
    router.push(route as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Модулі навчання
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Оберіть розділ для вивчення
        </Text>
      </View>

      {/* Modules Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.modulesGrid}>
          {modules.map((module) => (
            <TouchableOpacity
              key={module.id}
              style={[styles.moduleCard, { backgroundColor: colors.surface }]}
              onPress={() => handleModulePress(module.route)}
              activeOpacity={0.7}
            >
              {/* Icon Container */}
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: module.color + "15" },
                ]}
              >
                <Ionicons name={module.icon} size={32} color={module.color} />
              </View>

              {/* Module Title */}
              <Text style={[styles.moduleTitle, { color: colors.text }]}>
                {module.title}
              </Text>

              {/* Arrow Icon */}
              <View style={styles.arrowContainer}>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.textSecondary}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingTop: SIZES.spacing.xl,
    paddingBottom: SIZES.spacing.lg,
  },
  headerTitle: {
    fontSize: SIZES.fontSize.xxl,
    fontWeight: "bold",
    marginBottom: SIZES.spacing.xs,
  },
  headerSubtitle: {
    fontSize: SIZES.fontSize.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.xxl,
  },
  modulesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SIZES.spacing.md,
  },
  moduleCard: {
    width: "47.5%",
    aspectRatio: 1,
    borderRadius: SIZES.borderRadius.lg,
    padding: SIZES.spacing.lg,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: SIZES.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SIZES.spacing.sm,
  },
  moduleTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    marginBottom: SIZES.spacing.xs,
  },
  arrowContainer: {
    alignSelf: "flex-end",
  },
});
