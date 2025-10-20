import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { GrammarEmptyState } from "../../components/GrammarEmptyState";
import { GrammarSearchBar } from "../../components/GrammarSearchBar";
import { GrammarStats } from "../../components/GrammarStats";
import { GrammarTopicsList } from "../../components/GrammarTopicsList";
import { Spinner } from "../../components/Spinner";
import { SIZES } from "../../constants";
import { useTheme } from "../../hooks/useTheme";
import { fetchGrammarTopics } from "../../redux/grammar/operations";
import {
  selectFilteredTopics,
  selectGroupedTopics,
  selectLoading,
  selectTopics,
} from "../../redux/grammar/selectors";
import { setSearchQuery } from "../../redux/grammar/slice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Topic } from "../../types/grammar.type";
import { navigate } from "../../utils";

export default function GrammarTopicsScreen() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const topics = useAppSelector(selectTopics);
  const filteredTopics = useAppSelector(selectFilteredTopics);
  const groupedTopics = useAppSelector(selectGroupedTopics);
  const isLoading = useAppSelector(selectLoading);
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchGrammarTopics());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setSearchQuery(localSearchQuery));
  }, [localSearchQuery, dispatch]);

  const handleTopicPress = (topic: Topic) => {
    navigate("/grammar-topic", {
      topicId: topic.id,
      topicTitle: topic.title,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <GrammarSearchBar
        value={localSearchQuery}
        onChangeText={setLocalSearchQuery}
      />

      <GrammarStats topics={topics} />

      <ScrollView
        style={styles.topicsList}
        contentContainerStyle={styles.topicsContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <Spinner />
        ) : filteredTopics.length === 0 ? (
          <GrammarEmptyState hasSearchQuery={!!localSearchQuery.trim()} />
        ) : (
          <GrammarTopicsList
            groupedTopics={groupedTopics}
            onTopicPress={handleTopicPress}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topicsList: {
    flex: 1,
  },
  topicsContent: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.xl,
  },
});
