import { ExerciseTopicCard } from "@/components/ExerciseTopicCard";
import { Spinner } from "@/components/Spinner";
import {
  selectExerciseError,
  selectExerciseLoading,
  selectExerciseSearchQuery,
  selectFilteredExerciseTopics,
} from "@/redux/exercises/selectors";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import {
  TextInput as RNTextInput,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SIZES } from "../../constants";
import { showToast } from "../../hooks/showToast";
import { useTheme } from "../../hooks/useTheme";
import { fetchExerciseTopics } from "../../redux/exercises/operations";
import { setSearchQuery } from "../../redux/exercises/slice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { ExerciseTopic } from "../../types/exercises.types";
import { navigate } from "../../utils";

export default function ExercisesTopicsScreen() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const filteredTopics = useAppSelector(selectFilteredExerciseTopics);
  const searchQuery = useAppSelector(selectExerciseSearchQuery);
  const isLoading = useAppSelector(selectExerciseLoading);
  const isError = useAppSelector(selectExerciseError);

  useEffect(() => {
    dispatch(fetchExerciseTopics());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      showToast.error({ message: isError });
    }
  }, [isError]);

  const handleSearch = (text: string) => {
    dispatch(setSearchQuery(text));
  };

  const handleTopicPress = (topic: ExerciseTopic) => {
    navigate("/exercises-topic", {
      topicId: topic.id,
      topicTitle: topic.title,
    });
  };

  if (isLoading && filteredTopics.length === 0) {
    return <Spinner />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[styles.fixedHeader, { backgroundColor: colors.background }]}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Теми вправ
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.searchContainer}>
          <View
            style={[
              styles.searchBar,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Ionicons
              name="search"
              size={20}
              color={colors.textSecondary}
              style={styles.searchIcon}
            />
            <RNTextInput
              style={[styles.searchInput, { color: colors.textPrimary }]}
              placeholder="Пошук тем..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch("")}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTopics.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="game-controller-outline"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {searchQuery ? "Теми не знайдено" : "Теми ще не завантажені"}
            </Text>
          </View>
        ) : (
          filteredTopics.map((topic) => (
            <ExerciseTopicCard
              key={topic.id}
              topic={topic}
              onPress={handleTopicPress}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedHeader: {
    paddingTop: 28,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIZES.spacing.lg,
    paddingTop: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: SIZES.fontSize.xl,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.md,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.sm,
    borderRadius: SIZES.borderRadius.md,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: SIZES.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.fontSize.md,
    paddingVertical: SIZES.spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingTop: SIZES.spacing.md,
    paddingBottom: SIZES.spacing.lg,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SIZES.spacing.xl * 2,
  },
  emptyText: {
    fontSize: SIZES.fontSize.lg,
    marginTop: SIZES.spacing.md,
  },
});
