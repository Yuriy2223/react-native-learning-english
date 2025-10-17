import { Topic } from "@/types/phrases.type";
import { getDifficultyColor, getDifficultyLabel } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";

interface TopicInfoProps {
  topic: Topic;
}

export const TopicInfo = ({ topic }: TopicInfoProps) => {
  const { colors } = useTheme();

  return (
    <>
      <View style={styles.imageContainer}>
        {topic.imageUrl ? (
          <Image source={{ uri: topic.imageUrl }} style={styles.topicImage} />
        ) : (
          <View
            style={[
              styles.imagePlaceholder,
              { backgroundColor: colors.secondary },
            ]}
          >
            <Ionicons name="chatbubbles" size={80} color="#FFFFFF" />
          </View>
        )}
      </View>

      <View style={[styles.infoContainer, { backgroundColor: colors.surface }]}>
        <Text style={[styles.topicTitle, { color: colors.textPrimary }]}>
          {topic.title}
        </Text>

        <Text
          style={[styles.topicDescription, { color: colors.textSecondary }]}
        >
          {topic.description}
        </Text>

        <View
          style={[
            styles.difficultyBadge,
            {
              backgroundColor:
                getDifficultyColor(topic.difficulty, colors) + "20",
            },
          ]}
        >
          <Ionicons
            name="ribbon"
            size={16}
            color={getDifficultyColor(topic.difficulty, colors)}
          />
          <Text
            style={[
              styles.difficultyText,
              { color: getDifficultyColor(topic.difficulty, colors) },
            ]}
          >
            {getDifficultyLabel(topic.difficulty)}
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
    marginBottom: SIZES.spacing.lg,
  },
  topicImage: {
    width: 200,
    height: 200,
    borderRadius: SIZES.borderRadius.xl,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: SIZES.borderRadius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    marginHorizontal: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.lg,
  },
  topicTitle: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: SIZES.spacing.sm,
  },
  topicDescription: {
    fontSize: SIZES.fontSize.md,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: SIZES.spacing.md,
  },
  difficultyBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.sm,
    borderRadius: SIZES.borderRadius.md,
  },
  difficultyText: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: "600",
    marginLeft: SIZES.spacing.xs,
  },
});
