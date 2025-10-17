import { User } from "@/types/user.types";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";

interface ProfileHeaderProps {
  user: User;
  isEditing: boolean;
  onChangeAvatar: () => void;
}

export function ProfileHeader({
  user,
  isEditing,
  onChangeAvatar,
}: ProfileHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <TouchableOpacity
        style={styles.avatarContainer}
        onPress={onChangeAvatar}
        disabled={!isEditing}
      >
        {user.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        ) : (
          <View
            style={[
              styles.avatarPlaceholder,
              { backgroundColor: colors.primary },
            ]}
          >
            <Text style={styles.avatarText}>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </Text>
          </View>
        )}

        {isEditing && (
          <View
            style={[
              styles.avatarOverlay,
              { backgroundColor: "rgba(0,0,0,0.5)" },
            ]}
          >
            <Ionicons name="camera" size={24} color="#FFFFFF" />
          </View>
        )}
      </TouchableOpacity>

      <Text style={[styles.userName, { color: colors.textPrimary }]}>
        {user.name}
      </Text>

      <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
        {user.email}
      </Text>

      {user.createdAt && (
        <Text style={[styles.joinDate, { color: colors.textSecondary }]}>
          Красавчик з{" "}
          {new Date(user.createdAt).toLocaleDateString("uk-UA", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginHorizontal: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
    borderRadius: SIZES.borderRadius.lg,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: SIZES.spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  avatarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: "bold",
    marginBottom: SIZES.spacing.xs,
  },
  userEmail: {
    fontSize: SIZES.fontSize.md,
    marginBottom: SIZES.spacing.xs,
  },
  joinDate: {
    fontSize: SIZES.fontSize.sm,
  },
});
