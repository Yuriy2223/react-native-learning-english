import {
  selectFilteredTopics,
  selectLoading,
  selectSearchQuery,
} from "@/redux/vocabulary/selectors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "../../components/TextInput";
import { VocabularyTopicsCard } from "../../components/VocabularyTopicsCard";
import { SIZES } from "../../constants";
import { useTheme } from "../../hooks/useTheme";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { fetchVocabularyTopics } from "../../redux/vocabulary/operations";
import { setSearchQuery } from "../../redux/vocabulary/slice";

export default function VocabularyTopicsScreen() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const filteredTopics = useAppSelector(selectFilteredTopics);
  const searchQuery = useAppSelector(selectSearchQuery);
  const isLoading = useAppSelector(selectLoading);

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  useEffect(() => {
    dispatch(fetchVocabularyTopics());
  }, [dispatch]);

  const handleSearch = (query: string) => {
    setLocalSearchQuery(query);
    dispatch(setSearchQuery(query));
  };

  const handleTopicPress = (topicId: string, topicTitle: string) => {
    router.push({
      pathname: "/vocabulary-topic" as any,
      params: { topicId, topicTitle },
    });
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: colors.textPrimary }]}>
            Завантаження тем...
          </Text>
        </View>
      );
    }

    if (searchQuery && filteredTopics.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons
            name="search-outline"
            size={64}
            color={colors.textSecondary}
          />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
            Нічого не знайдено
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Спробуйте змінити пошуковий запит
          </Text>
        </View>
      );
    }

    if (filteredTopics.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons
            name="book-outline"
            size={64}
            color={colors.textSecondary}
          />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
            Немає тем
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Теми будуть додані пізніше
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Словник
        </Text>

        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Пошук тем..."
          value={localSearchQuery}
          onChangeText={handleSearch}
          leftIcon={
            <Ionicons name="search" size={20} color={colors.textSecondary} />
          }
          rightIcon={
            localSearchQuery ? (
              <TouchableOpacity onPress={() => handleSearch("")}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            ) : null
          }
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTopics.length > 0 ? (
          <View style={styles.topicsList}>
            {filteredTopics.map((topic) => (
              <VocabularyTopicsCard
                key={topic.id}
                topic={topic}
                onPress={handleTopicPress}
              />
            ))}
          </View>
        ) : (
          renderEmptyState()
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIZES.spacing.lg,
    paddingTop: 60,
    paddingBottom: SIZES.spacing.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: SIZES.fontSize.xl,
    fontWeight: "bold",
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: SIZES.spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.xxl,
  },
  topicsList: {
    gap: SIZES.spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SIZES.spacing.xxl * 2,
  },
  emptyTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    marginTop: SIZES.spacing.md,
    marginBottom: SIZES.spacing.xs,
  },
  emptySubtitle: {
    fontSize: SIZES.fontSize.md,
    textAlign: "center",
  },
  emptyText: {
    fontSize: SIZES.fontSize.lg,
  },
});
