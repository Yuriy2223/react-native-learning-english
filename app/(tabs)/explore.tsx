import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SIZES } from "../../constants";
import { useTheme } from "../../hooks/useTheme";

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
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Модулі навчання
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Оберіть розділ для вивчення
        </Text>
      </View>

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
              <View style={styles.cardContent}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: module.color + "15" },
                  ]}
                >
                  <Ionicons name={module.icon} size={32} color={module.color} />
                </View>

                <Text
                  style={[styles.moduleTitle, { color: colors.textPrimary }]}
                  numberOfLines={2}
                >
                  {module.title}
                </Text>
              </View>

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
    alignItems: "center",
  },
  headerTitle: {
    fontSize: SIZES.fontSize.xxl,
    fontWeight: "bold",
    marginBottom: SIZES.spacing.xs,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: SIZES.fontSize.md,
    textAlign: "center",
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SIZES.spacing.xs,
    marginBottom: SIZES.spacing.xl,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: SIZES.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SIZES.spacing.md,
  },
  moduleTitle: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "600",
    textAlign: "center",
  },
  arrowContainer: {
    position: "absolute",
    bottom: SIZES.spacing.md,
    right: SIZES.spacing.md,
  },
});
